import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="steentjeskerk-eindhoven";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: u langs de nok van het schip (west -> oost, nokrichting 5,3 graden in RD), v naar het noorden.
// Oorsprong op de nok van het middenschip, maaiveld NAP +17,14 m (3DBAG). Maten uit BAG-contour en AHN-DSM (0,5 m).
const BASE=-.5,ORIGIN=[160631.88,383381.29],X_AXIS=[.99572,.09237];
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a<0?[...p].reverse():p};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Dakvlak: houdt z <= a u + b v + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zadeldak langs u met de nok op v=c.
const roofV=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
// Schild- of tentdak op een convexe veelhoek: elk dakvlak loopt vanaf de goot op de gevel met helling k naar binnen.
const hipRoof=(poly,eave,k,top=200)=>{const p=ccw(poly);let s=prism(p,BASE,top);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/L,ny=(b[0]-a[0])/L;s=plane(s,k*nx,k*ny,eave-k*(nx*a[0]+ny*a[1]))}return s};
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const sq=(cu,cv,h)=>rect(cu-h,cu+h,cv-h,cv+h);
// Blinde nis met spitse top (> 50 graden): punt op de gevel, buitennormaal in graden.
const niche=(px,py,ang,z,w,h,d=.4)=>{const t=Math.min(h-.2,w*.65),p=[[-w/2,0],[w/2,0],[w/2,h-t],[0,h],[-w/2,h-t]];return prism(p,0,d+.6).rotate([90,0,0]).translate([0,.6,0]).rotate([0,0,ang-90]).translate([px,py,z])};

// Middenschip: muren v=+-6,75, nok 19,4 m, helling 0,615 (31,6 graden); schild naar het westen (0,95) en het oosten (0,83).
const NW=6.75,RIDGE=19.4,K=.615,UW=-20.3,UE=25;
let nave=roofV(box(UW,UE,-NW,NW,BASE,40),RIDGE,0,K);
nave=plane(nave,.95,0,RIDGE+.95*15.67);
nave=plane(nave,-.83,0,RIDGE+.83*19.95);
// Zijbeuken met lessenaarsdak (10,55 m aan het schip, helling 0,59), buitenmuren v=11,65 en v=-10,95.
const AK=.59,AH=10.55;
const aisleN=plane(box(UW,24.8,NW-.05,11.65,BASE,20),0,-AK,AH+AK*NW);
const aisleS=plane(box(UW,24.8,-10.95,-NW+.05,BASE,20),0,AK,AH+AK*NW);
// Halfronde apsis (hart u=25,18, straal 5,27, muur tot 10,65 m) met halfkegeldak van tien koperen vlakken tot 14,4 m.
const AC=25.18,AR=5.27,AE=10.65;
const half=box(UE-.05,AC+AR+1,-AR-1,AR+1,BASE-1,30);
const apseWall=Manifold.cylinder(AE-BASE,AR,AR,64).translate([AC,0,BASE]);
const apseRoof=Manifold.cylinder(14.4-AE+.05,AR/Math.cos(Math.PI/20),.05,20).rotate([0,0,9]).translate([AC,0,AE-.05]);
const apse=Manifold.union([apseWall,apseRoof]).intersect(half);
// Westtoren (hart u=-23,44, v=9,63), versmallend in geledingen: plint, schacht, vensterzone, wijzerplaatzone, galmzone,
// kroonlijst op een kraag van 45 graden en tentdak (helling 0,95) tot 33,55 m.
const TU=-23.44,TV=9.63;
const tower=Manifold.union([
  prism(sq(TU,TV,2.7),BASE,6.5),prism(sq(TU,TV,2.55),6.4,16),prism(sq(TU,TV,2.47),15.9,20.5),
  prism(sq(TU,TV,2.42),20.4,24.5),prism(sq(TU,TV,2.38),24.4,30.25),
  Manifold.hull([prism(sq(TU,TV,2.38),30.2,30.25),prism(sq(TU,TV,2.68),30.54,30.55)]),
  prism(sq(TU,TV,2.68),30.5,31.0),hipRoof(sq(TU,TV,2.68),31.0,.95)]);
// Ondiepe absidevormige uitbouwen tegen de west- en noordzijde van de toren (BAG-boog, straal 1,9 m) met kegelkapje.
const bulge=(cu,cv)=>Manifold.union([Manifold.cylinder(4.6-BASE,1.9,1.9,32).translate([cu,cv,BASE]),Manifold.cylinder(.8,1.9,1.1,32).translate([cu,cv,4.55])]);
const bulges=Manifold.union([bulge(-24.82,TV),bulge(TU,10.99)]);
// Voorportaal met lessenaarsdak (8,3 m aan het schip, 5,5 m aan de straat) tussen toren en doopkapel.
const porch=plane(box(-24.95,UW+.05,-6.3,6.95,BASE,12),.6,0,8.3+.6*20.3);
// Doopkapel: blok van twee lagen met tentdak (goot 10 m, top 12,2 m).
const bap=hipRoof(rect(-24.7,UW+.05,-10.85,-6.3),10,1);
// Dakkapel op het westschild en schoorsteen op de nok aan de oostzijde.
const dormer=roofV(box(-18.9,-16,-.85,.85,14,30),17.75,0,1.2);
const chimney=box(15,16.5,-.7,1.1,15,22.4);
// Traptorentjes naast de apsis met tentdak (goot 11 m, top 12,4 m).
const towerNE=hipRoof(rect(23.8,26.7,10.9,13.72),11,1),towerSE=hipRoof(rect(23.8,26.97,-13.5,-10.66),11,1);
// Sacristie-aanbouwen: platte stroken op 8 m langs beide zijbeuken, lage platte sacristie en een zadeldak (nok 9,2 m) met schild naar het oosten.
const annexN=box(10.45,23.85,11.6,13.75,BASE,8.1);
const annexS=box(10.79,23.85,-13.5,-10.9,BASE,8);
const sacrA=box(10.79,16.55,-19.17,-13.45,BASE,4.5);
let sacrB=roofV(box(16.5,26.27,-19.17,-13.45,BASE,20),9.2,-16.31,1);
sacrB=plane(sacrB,-1,0,9.2+1*(26.27-2.86));
// Lisenen (pilasters) op de traveegrenzen van zijbeuken en lichtbeuk.
const BAYS=9,BW=(UE-UW)/BAYS,pil=[];
for(let i=1;i<BAYS;i++){const u=UW+i*BW;
  if(u<10.2){pil.push(box(u-.45,u+.45,11.6,11.95,BASE,7.3),box(u-.45,u+.45,-11.25,-10.9,BASE,7.5))}
  pil.push(box(u-.45,u+.45,NW-.1,NW+.3,9.5,15.1),box(u-.45,u+.45,-NW-.3,-NW+.1,9.5,15.1))}
let church=Manifold.union([nave,aisleN,aisleS,apse,tower,bulges,porch,bap,dormer,chimney,towerNE,towerSE,annexN,annexS,sacrA,sacrB,...pil]);
// Gevelreliëf: rondboogvensters, arcade van het portaal, galmgaten en blinde arcade van de apsis als spitse nissen.
const cuts=[];
for(let i=0;i<BAYS;i++){const u=UW+(i+.5)*BW;
  cuts.push(niche(u,NW,90,11.2,1.4,3.2),niche(u,-NW,270,11.2,1.4,3.2));
  if(u<10)cuts.push(niche(u,11.65,90,2.4,1.4,3.6),niche(u,-10.95,270,2.4,1.4,3.6));}
for(let i=0;i<5;i++)cuts.push(niche(-24.95,-6.3+1.32+2.65*i,180,.3,1.7,3.9));
cuts.push(niche(UW,3.6,180,9.2,1.5,4.6),niche(UW,-3.6,180,9.2,1.5,4.6),niche(UW,1.2,180,10,1,2.6,.35),niche(UW,-1.2,180,10,1,2.6,.35));
cuts.push(niche(-24.7,-8.57,180,.3,2.6,4.8),niche(-24.7,-8.57,180,6.2,1.2,2.6),niche(-22.5,-10.85,270,.3,2.4,4.6),niche(-22.5,-10.85,270,6.2,1.2,2.6));
// Toren: vier zijden (west, noord, oost, zuid).
for(const [a,du,dv] of [[180,-1,0],[90,0,1],[0,1,0],[270,0,-1]]){
  const face=(h,o,z,w,hh,d)=>cuts.push(niche(TU+du*h-dv*o,TV+dv*h+du*o,a,z,w,hh,d));
  for(const o of [-1.25,0,1.25])face(2.47,o,17,.9,2.8);
  for(const o of [-.95,.95])face(2.38,o,25.6,1,3.6,.6);
  face(2.55,0,11,.9,2.2);}
for(let k=-2;k<=2;k++){const t=k*30*Math.PI/180;cuts.push(niche(AC+AR*Math.cos(t),AR*Math.sin(t),k*30,2.6,1.4,2.8))}
for(let k=-5;k<=5;k++){const t=k*15*Math.PI/180;cuts.push(niche(AC+AR*Math.cos(t),AR*Math.sin(t),k*15,6.4,1,2.6,.3))}
for(const [u,v,a] of [[26.7,12.3,0],[26.97,-12.08,0],[25.25,13.72,90],[25.4,-13.5,270]])cuts.push(niche(u,v,a,7.2,.9,2.2));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Steentjeskerk Eindhoven",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.143,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0772100000288003"],description:"Driebeukige basilicale kerk in Kunradersteen (Sint-Antonius van Paduakerk, H. van Groenendael, 1917-1919) met vierkante westtoren, voorportaal, doopkapel en halfronde apsis; oorsprong op de nok van het schip, X langs de nok naar het koor (oost).",realWorld:{groundNapM:17.143,ahnNaveRidgeNapM:36.54,ahnTowerRoofNapM:50.71,ahnApseRoofNapM:31.5,ahnChimneyNapM:39.5,interiorLengthWikipediaM:50,interiorWidthWikipediaM:20,naveHeightWikipediaM:15},sources:["https://nl.wikipedia.org/wiki/Steentjeskerk","https://monumentenregister.cultureelerfgoed.nl/monumenten/518710","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000288003","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Steentjeskerk_(Eindhoven)"]};
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
