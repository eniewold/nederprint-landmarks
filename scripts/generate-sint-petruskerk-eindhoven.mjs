import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="sint-petruskerk-eindhoven";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Meetstelsel (u, v): u langs de nok naar het koor (RD-richting 15,4 graden, uit de goten en de steunberen
// van de BAG-contour), v 90 graden linksom; meetoorsprong RD (160900, 384952). Hoogtes boven maaiveld NAP +19,4 m.
// De modeloorsprong ligt in de viering op de nokas (u 0,1, v 5,5): aan het eind schuift het model daarheen.
const BASE=-.5,ORIGIN=[160898.64,384957.33],X_AXIS=[.9641,.2656],SHIFT=[-.1,-5.5];
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a<0?[...p].reverse():p};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Dakvlak: houdt z <= a u + b v + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zadeldak met nok langs u (op v=c) of langs v (op u=c): z <= r - k |...|.
const roofV=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofU=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// n-hoek met een vlak (geen hoekpunt) naar +u wanneer rot=180/n.
const ngon=(cx,cy,r,n,z0,z1,rTop=r,rot=0)=>Manifold.cylinder(z1-z0,r,rTop,n).rotate([0,0,rot]).translate([cx,cy,z0]);
const oct=(cx,cy,a0,a1,z0,z1)=>ngon(cx,cy,a0/Math.cos(Math.PI/8),8,z0,z1,a1/Math.cos(Math.PI/8),22.5);
// Blinde nis met spitse top (> 50 graden): punt op de gevel, buitennormaal in graden.
const niche=(px,py,ang,z,w,h,d=.4)=>{const t=Math.min(h-.2,w*.65),p=[[-w/2,0],[w/2,0],[w/2,h-t],[0,h],[-w/2,h-t]];return prism(p,0,d+.6).rotate([90,0,0]).translate([0,.6,0]).rotate([0,0,ang-90]).translate([px,py,z])};
// Steunbeer met afgeschuinde top (helling 1,2 naar buiten).
const buttress=(u,v,dir,w,out,top)=>{const i=-.3*Math.sign(out);let b=dir==="v"?box(u-w/2,u+w/2,Math.min(v+i,v+out),Math.max(v+i,v+out),BASE,top):box(Math.min(u+i,u+out),Math.max(u+i,u+out),v-w/2,v+w/2,BASE,top);const s=Math.sign(out);return dir==="v"?plane(b,0,-1.2*s,top+1.2*s*v):plane(b,-1.2*s,0,top+1.2*s*u)};
// Diagonale hoeksteunbeer: ruit op de hoek, naar buiten geschoven, met spitse kap.
const diagButt=(cu,cv,su,sv,r,top)=>{const d=r*.45,x=cu+su*d,y=cv+sv*d;return Manifold.union([ngon(x,y,r,4,BASE,top,r,45),ngon(x,y,r,4,top-.05,top+1.6,.65,45)])};

// --- Schip (middenbeuk, muren v 0,1 en 10,9), dwarsschip en koor: één nok op 27,55 m, helling 1,27 (52 graden).
const R=27.55,K=1.27,CV=5.5,V0=.1,V1=10.9;
const nave=roofV(box(-43.2,5.3,V0,V1,BASE,40),R,CV,K);
const transept=roofU(box(-5.1,5.3,-6.7,17.7,BASE,40),R,.1,K);
// Koor met driezijdige sluiting van een regelmatige achthoek (hart u 18,3, apothema 5,4); de apsisvlakken lopen in de koorkap.
const CU=18.3,AP=5.4,T=AP*Math.tan(Math.PI/8);
let choir=prism([[5,V0],[CU+T,V0],[CU+AP,CV-T],[CU+AP,CV+T],[CU+T,V1],[5,V1]],BASE,40);
choir=roofV(choir,R,CV,K);choir=plane(choir,-K,0,R+K*CU);
for(const s of [1,-1])choir=plane(choir,-K*Math.SQRT1_2,-s*K*Math.SQRT1_2,R+K*Math.SQRT1_2*(CU+s*CV));
// Zijbeuken van het schip met lessenaarsdak (14,2 m aan de lichtbeuk, 10,8 m aan de buitenmuur).
const aisleS=plane(box(-36.8,-5,-5.6,V0+.05,BASE,20),0,.6,14.2-.6*V0);
const aisleN=plane(box(-43.2,-5,V1-.05,16,BASE,20),0,-.6,14.2+.6*V1);
// Kooromgangen: tot u 14 hoog (12,6 -> 10,6 m), daarna lager (10,6 -> 7,4 m).
const choirSA=plane(box(5.2,14,-5.3,V0+.05,BASE,20),0,.37,12.6-.37*V0);
const choirNA=plane(box(5.2,14,V1-.05,16.4,BASE,20),0,-.37,12.6+.37*V1);
const choirSB=plane(box(14,19.6,-6.1,V0+.05,BASE,20),0,.516,10.6-.516*V0);
const choirNB=plane(box(14,19.6,V1-.05,17.3,BASE,20),0,-.5,10.6+.5*V1);
// Platte sacristieën achter het koor: strook op 7,3 m en een lage veelhoekige omgang rond de apsis op 5,2 m.
const sacristy=box(19.5,22.6,-6.1,17.3,BASE,7.3);
const ambulatory=prism([[22.5,-4.5],[24.3,-4.5],[24.3,.3],[26.1,3],[26.1,8],[24.3,10.7],[24.3,15.7],[22.5,15.7]],BASE,5.2);
// Portalen aan de zijbeuken met zadeldak dwars op de as.
const porchS=roofU(box(-34.5,-31,-8.2,-5.5,BASE,10),5.8,-32.75,1.2);
const porchN=roofU(box(-34.7,-31.2,15.9,18.4,BASE,10),5.8,-32.95,1.2);

// --- Westtoren (1912): vierkante schacht 9,4 m tot 44,5 m, klokverdieping met vier wimbergen en hoekpinakels,
// achtkante spits met knik, dakkapelletjes, kroon op 61 m en naald tot 72,0 m (AHN).
const TU=-47.45,TH=4.7,TE=44.5;
const shaft=box(TU-TH,TU+TH,CV-TH,CV+TH,BASE,TE);
const tButt=[diagButt(TU-TH,CV-TH,-1,-1,1.1,30),diagButt(TU-TH,CV+TH,-1,1,1.1,30)];
const tGables=[],tPinn=[];
for(const a of [0,90,180,270]){
  tGables.push(prism([[-3.2,0],[3.2,0],[0,6.3]],0,1.2).rotate([90,0,0]).translate([0,TH,TE-.1]).rotate([0,0,a-90]).translate([TU,CV,0]));
}
for(const [su,sv] of [[-1,-1],[1,-1],[1,1],[-1,1]])tPinn.push(Manifold.union([ngon(TU+su*(TH-.65),CV+sv*(TH-.65),.65,8,TE-.1,48.2),ngon(TU+su*(TH-.65),CV+sv*(TH-.65),.65,8,48.15,51.5,.45)]));
const spire=Manifold.union([oct(TU,CV,3.8,2.4,TE-.1,49),oct(TU,CV,2.4,1.75,48.99,60.8),oct(TU,CV,1.75,2.05,60.79,61.1),oct(TU,CV,2.05,2.05,61.09,62.2),oct(TU,CV,1.05,.45,62.19,72.0)]);
// Dakkapelletjes in de spits: kleine topgevels op de vier hoofdvlakken, onderkant 45 graden.
const spDorm=[];
for(const a of [0,90,180,270]){
  let d=roofV(box(1.4,3.1,-.6,.6,49.6,54),52.7,0,1.8);
  d=d.trimByPlane([-Math.SQRT1_2,0,Math.SQRT1_2],(49.6-1.6)*Math.SQRT1_2);
  spDorm.push(d.rotate([0,0,a]).translate([TU,CV,0]));
}
// Westportaal met wimberg.
const portal=roofV(box(-53.3,TU-TH+.05,CV-2.9,CV+2.9,BASE,20),11.5,CV,1.38);

// --- Dakruiter op de viering, pinakels op de dwarsschipgevels, dakkapellen op het schip.
const fleche=Manifold.union([oct(.1,CV,1.1,1.1,25,31.2),oct(.1,CV,1.1,.45,31.19,37.5)]);
const trPinn=[ngon(.1,-6.2,.5,8,26,30.2,.45),ngon(.1,17.2,.5,8,26,30.2,.45)];
const dormers=[];
for(const c of [-32,-22,-12])for(const s of [1,-1]){let d=box(c-.6,c+.6,s>0?1.6:CV,s>0?CV:9.4,22,30);d=roofU(d,24.3,c,1.4);dormers.push(d)}
// Steunberen.
const butt=[];
for(const u of [-29.65,-23.4,-17.15,-10.95])butt.push(buttress(u,-5.6,"v",.9,-1.4,9));
for(const u of [-36.65,-29.8,-23.6,-17.4,-11.25])butt.push(buttress(u,16,"v",.9,1.4,9));
butt.push(buttress(10.2,-5.3,"v",.9,-1.4,8.5),buttress(14.3,-6.1,"v",.9,-1,7.5),buttress(18.2,-6.1,"v",.9,-1,7));
butt.push(buttress(10,16.4,"v",.9,1.4,8.5),buttress(14.1,17.3,"v",.9,1,7.5),buttress(18,17.3,"v",.9,1,7));
for(const [cu,su] of [[-5.1,-1],[5.3,1]])for(const [cv,sv] of [[-6.7,-1],[17.7,1]])butt.push(diagButt(cu,cv,su,sv,.9,12));

let church=Manifold.union([nave,transept,choir,aisleS,aisleN,choirSA,choirNA,choirSB,choirNB,sacristy,ambulatory,porchS,porchN,shaft,...tButt,...tGables,...tPinn,spire,...spDorm,portal,fleche,...trPinn,...dormers,...butt]);

// --- Gevelreliëf: portalen, vensters, galmgaten als blinde spitse nissen.
const cuts=[];
cuts.push(niche(-53.3,CV,180,BASE,2.6,6.4,.6));
for(const [a,px,py] of [[180,TU-TH,CV],[90,TU,CV+TH],[270,TU,CV-TH]]){const tx=-Math.sin(a*Math.PI/180),ty=Math.cos(a*Math.PI/180);
  if(a!==180)cuts.push(niche(px,py,a,13,1.8,9));else cuts.push(niche(px,py,a,13.5,2.4,10));
  cuts.push(niche(px,py,a,25,2.6,5));
  for(const o of [-1.5,1.5])cuts.push(niche(px+tx*o,py+ty*o,a,33.6,1.15,8.4));}
for(const o of [-1.5,1.5])cuts.push(niche(TU+TH,CV+o,0,33.6,1.15,8.4));
const bays=[-33,-26.5,-20.3,-14.05,-8];
for(const u of bays){if(u!==-33)cuts.push(niche(u,-5.6,270,2.8,1.6,5.2));cuts.push(niche(u,16,90,2.8,1.6,5.2),niche(u,V0,270,15.1,1.4,4.4),niche(u,V1,90,15.1,1.4,4.4))}
cuts.push(niche(-39.7,V0,270,7,1.6,8));
for(const v of [-6.7,17.7])cuts.push(niche(.1,v,v<0?270:90,5.5,3.4,11.5),niche(-2.9,v,v<0?270:90,3,1.2,5),niche(3.1,v,v<0?270:90,3,1.2,5));
for(const u of [7.6,12.1]){cuts.push(niche(u,V0,270,13.6,1.4,5),niche(u,V1,90,13.6,1.4,5),niche(u,-5.3,270,3,1.6,5.5),niche(u,16.4,90,3,1.6,5.5))}
cuts.push(niche(16.5,V0,270,11.6,1.4,6.5),niche(16.5,V1,90,11.6,1.4,6.5),niche(16.2,-6.1,270,2.5,1.4,3.8),niche(16.2,17.3,90,2.5,1.4,3.8));
cuts.push(niche(CU+AP,CV,0,8,1.6,9.5));
for(const s of [1,-1])cuts.push(niche(CU+AP*Math.SQRT1_2,CV+s*AP*Math.SQRT1_2,s*45,8,1.6,9.5));
church=church.subtract(Manifold.union(cuts)).translate([SHIFT[0],SHIFT[1],0]);
const parts=[["building:kerk",church]];
const META={name:"Sint-Petruskerk Eindhoven",origin:ORIGIN,xAxis:X_AXIS,groundHeight:19.4,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0772100000308080"],description:"Neogotische kruisbasiliek van H.J. van Tulder (1880) in Woensel met westtoren van L.P.J. Kooken (1912): vierkante schacht, klokverdieping met wimbergen en achtkante spits met kroon; oorsprong in de viering op de nokas, X langs de nok naar het koor (oost).",realWorld:{groundNapM:19.4,ahn5RidgeNapM:46.95,ahn5SpireNapM:91.43,towerHeightWikipediaM:76},sources:["https://nl.wikipedia.org/wiki/Sint-Petruskerk_(Eindhoven)","https://monumentenregister.cultureelerfgoed.nl/monumenten/14653","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000308080","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Sint_Petruskerk_(Eindhoven)"]};
function toStl(solid,label,mmPerMetre){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:`NederPrint generate-${slug}.mjs`},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`;
await writeFile(path.join(outDir,glb),toGlb(parts));
const printSolid=church.translate([0,0,-BASE]);
for(const scale of [100,1000]){const r=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale);await writeFile(path.join(outDir,`${slug}-1-${scale}.stl`),r.buffer);}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
