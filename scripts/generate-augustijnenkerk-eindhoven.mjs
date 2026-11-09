import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="augustijnenkerk-eindhoven";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: u langs de hoofdas (west -> oost, nokrichting -25 graden in RD), v naar het noorden.
// Oorsprong in de vieringsas (hart van de viering op de nok), maaiveld NAP +15,94 m (3DBAG).
const BASE=-.5,ORIGIN=[161738,383231],X_AXIS=[.9063,-.4226];
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a<0?[...p].reverse():p};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zadeldak langs u (nok op v=c) of langs v (nok op u=c): z <= r - k |...|.
const roofV=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofU=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Schilddak op een convexe veelhoek: elk dakvlak loopt vanaf de goot op de gevel met helling k naar binnen.
const hipRoof=(poly,eave,k,top=200)=>{const p=ccw(poly);let s=prism(p,BASE,top);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/L,ny=(b[0]-a[0])/L;s=plane(s,k*nx,k*ny,eave-k*(nx*a[0]+ny*a[1]))}return s};
const ngon=(cx,cy,r,n,z0,z1,rTop=r)=>Manifold.cylinder(z1-z0,r,rTop,n).translate([cx,cy,z0]);
// Torentje: n-hoekige schacht met naald (bovenkant >= 0,9 m breed).
const turret=(cx,cy,r,n,eave,top)=>Manifold.union([ngon(cx,cy,r,n,BASE,eave),ngon(cx,cy,r,n,eave-.05,top,.45)]);
// Blinde nis met spitse top (> 50 graden): punt op de gevel, buitennormaal in graden.
const niche=(px,py,ang,z,w,h,d=.4)=>{const t=Math.min(h-.2,w*.65),p=[[-w/2,0],[w/2,0],[w/2,h-t],[0,h],[-w/2,h-t]];return prism(p,0,d+.6).rotate([90,0,0]).translate([0,.6,0]).rotate([0,0,ang-90]).translate([px,py,z])};
// Steunbeer met afgeschuinde top (helling 1,2 naar buiten).
const buttress=(u,v,dir,w,out,top)=>{let b=dir==="v"?box(u-w/2,u+w/2,Math.min(v,v+out),Math.max(v,v+out),BASE,top):box(Math.min(u,u+out),Math.max(u,u+out),v-w/2,v+w/2,BASE,top);const s=Math.sign(out);return dir==="v"?plane(b,0,-1.2*s,top+1.2*s*v):plane(b,-1.2*s,0,top+1.2*s*u)};

// Schip met middenbeuk (muren v=+-4,6, goot 16,8 m, nok 24,85 m) van de westgevel tot de viering.
const RIDGE=24.85,K=1.75,NW=4.6;
let nave=roofV(box(-36,-4,-NW,NW,BASE,40),RIDGE,0,K);
// Zijbeuken met lessenaarsdak (11,0 m aan het schip, 9,3 m aan de buitenmuur).
const aisleN=plane(box(-36,-4,NW-.05,9.6,BASE,20),0,-1.7/5,11+1.7/5*NW);
const aisleS=plane(box(-36,-4,-8.9,-NW+.05,BASE,20),0,1.7/4.3,11+1.7/4.3*NW);
const confess=box(-25.8,-4.4,9.5,10.2,BASE,4);
// Dwarsschip (u -4,4..5,5) met topgevels op v=-13,4 en v=14,0; zelfde nok, helling 1,62.
const transept=roofU(box(-4.4,5.5,-13.4,14,BASE,40),RIDGE,.55,1.62);
// Koor met driezijdige sluiting van een regelmatige achthoek (hart 14,9; apothema 6); de apsisvlakken lopen in de koorkap.
let choir=prism([[5,-NW],[16,-NW],[17.38,-6],[20.9,-2.48],[20.9,2.48],[17.38,6],[16,NW],[5,NW]],BASE,40);
choir=roofV(choir,RIDGE,0,K);choir=plane(choir,-K,0,RIDGE+K*14.9);
for(const s of [1,-1])choir=plane(choir,-K*.7071,-s*K*.7071,RIDGE+K*.7071*14.9);
// Kapellen naast het koor: zadeldaken dwars op de as met afgewolfde buiteneinden.
const hipOut=(s,r,vEdge,k)=>vEdge>0?plane(s,0,-k,r+k*(vEdge-(r-10.5)/k)):plane(s,0,k,r-k*(vEdge+(r-10.5)/k));
const chapNA=hipOut(roofU(box(5.4,11.05,NW-.05,13.6,BASE,30),14.8,8.25,1.56),14.8,13.6,1.56);
const chapNB=hipOut(roofU(box(11,16.4,NW-.05,13.6,BASE,30),15.9,13.7,2.0),15.9,13.6,2.0);
const annexN=box(10.9,16.4,13.5,15.6,BASE,9.7);
const chapSA=hipOut(roofU(box(5.4,11.45,-12.6,-NW+.05,BASE,30),14.6,8.4,1.5),14.6,-12.6,1.5);
const chapSB=hipRoof([[11.4,-NW+.05],[17.4,-NW+.05],[17.4,-8.8],[15.5,-10.5],[11.4,-10.5]],8,1.1);
// Westkapellen naast de gevel met veelhoekige sluiting.
const chapWS=hipRoof([[-32.6,-8.6],[-25.8,-8.6],[-25.8,-10.3],[-27.1,-12],[-29.3,-12],[-30.6,-10.9],[-32,-10]],8.5,1.4);
const chapWN=hipRoof([[-31.2,9.5],[-25.9,9.5],[-25.9,11.9],[-27,12.8],[-29.5,13.2],[-31.2,12.2]],7.6,1.4);
// Zeshoekige westtoren met de punt naar het westen, zes wijzerplaatgevels, zeshoekige naald en Heilig Hartbeeld.
const TC=[-34.7,7.85],TR=3.8,TE=30.5;
const shaft=ngon(TC[0],TC[1],TR,6,BASE,TE);
const spire=ngon(TC[0],TC[1],3.3,6,TE-.1,60.9,.45);
const statue=ngon(TC[0],TC[1],.45,8,60.8,65.0);
const gables=[],pinn=[];
for(let i=0;i<6;i++){const a=30+60*i,r=a*Math.PI/180,ap=TR*Math.cos(Math.PI/6);
  gables.push(prism([[-1.65,0],[1.65,0],[0,6.2]],0,2.6).rotate([90,0,0]).translate([0,ap,TE-.05]).rotate([0,0,a-90]).translate([TC[0],TC[1],0]));
  const va=60*i*Math.PI/180;pinn.push(ngon(TC[0]+3.25*Math.cos(va),TC[1]+3.25*Math.sin(va),.5,8,TE-.05,34,.45));}
const stairTurret=turret(-33.8,12.2,1.2,8,24,30);
// Doopkapel zuidwest: lage zeshoek met tentdak, open lantaarn (als dichte lantaarn) en naald.
const bap=Manifold.union([ngon(-34.4,-6.75,3.6,6,BASE,12),ngon(-34.4,-6.75,3.6,6,11.95,17.4,.7),ngon(-34.4,-6.75,1.0,8,16,19.6),ngon(-34.4,-6.75,1.0,8,19.55,25,.45)]);
const turretSW=turret(-32.1,-10.85,1.1,8,14.5,22);
const turretNE=turret(12.2,14.6,1.2,8,17,23);
const turretSE=turret(12.0,-11.3,1.2,8,15,22);
// Dakruiter op de viering.
const fleche=Manifold.union([ngon(.55,0,1.3,8,22,29.2),ngon(.55,0,1.3,8,29.15,40.5,.45)]);
// Dakkapellen op schip en koor.
const dormers=[];
for(const c of [-27.2,-16.6,10])for(const s of [1,-1]){let d=box(c-.6,c+.6,s>0?.5:-3.4,s>0?3.4:-.5,17,30);d=roofU(d,21.4,c,1.4);dormers.push(d)}
// Steunberen tussen de traveeën van de zijbeuken en aan de dwarsschipgevels.
const butt=[];
for(const u of [-25.8,-20.5,-15,-9.1])butt.push(buttress(u,9.6,"v",1,.6,8),buttress(u,-8.9,"v",1,-.5,8));
for(const u of [-4,5.1])butt.push(buttress(u,14,"v",.9,.8,13),buttress(u,-13.4,"v",.9,-.8,13));
for(const v of [-11,11.5])butt.push(buttress(-4.4,v,"u",.9,-.7,12),buttress(5.5,v,"u",.9,.7,12));
// Gevelpinakel op de westtop.
const crossPost=ngon(-35.45,0,.5,8,RIDGE-1.25,27,.45);
let church=Manifold.union([nave,aisleN,aisleS,confess,transept,choir,chapNA,chapNB,annexN,chapSA,chapSB,chapWS,chapWN,shaft,spire,statue,...gables,...pinn,stairTurret,bap,turretSW,turretNE,turretSE,fleche,...dormers,...butt,crossPost]);
// Gevelreliëf: portalen, vensters, galmgaten.
const cuts=[];
cuts.push(niche(-36,0,180,BASE,2.6,5.6,.6),niche(-36,-2.4,180,BASE,1.3,3.8),niche(-36,2.4,180,BASE,1.3,3.8));
cuts.push(niche(-36,0,180,6.5,2.4,7.5),niche(-36,-2.4,180,7.5,1.2,5.5),niche(-36,2.4,180,7.5,1.2,5.5));
for(const u of [-23.1,-17.8,-12.1,-6.8]){cuts.push(niche(u,9.6,90,2.6,1.6,4.8),niche(u,-8.9,270,2.6,1.6,4.8),niche(u,NW,90,12,1.4,3.6),niche(u,-NW,270,12,1.4,3.6))}
for(const u of [-1.6,2.7]){cuts.push(niche(u,14,90,3.5,1.6,8.5),niche(u,-13.4,270,3.5,1.6,8.5))}
cuts.push(niche(.55,14,90,13.5,1.6,4),niche(.55,-13.4,270,13.5,1.6,4));
for(const [px,py,a] of [[20.9,0,0],[19.14,4.24,45],[19.14,-4.24,-45]])cuts.push(niche(px,py,a,3,1.8,8));
cuts.push(niche(8.25,13.6,90,3,1.6,5),niche(8.4,-12.6,270,3,1.6,5));
for(let i=0;i<6;i++){const a=30+60*i,r=a*Math.PI/180,ap=TR*Math.cos(Math.PI/6),fx=TC[0]+ap*Math.cos(r),fy=TC[1]+ap*Math.sin(r),tx=-Math.sin(r),ty=Math.cos(r);
  for(const o of [-.9,.9]){cuts.push(niche(fx+tx*o,fy+ty*o,a,24.5,1,4.2));if(a===150||a===210){cuts.push(niche(fx+tx*o,fy+ty*o,a,19.6,.9,2.8),niche(fx+tx*o,fy+ty*o,a,8.5,1.1,6.8),niche(fx+tx*o,fy+ty*o,a,2,1.1,3.4))}}}
for(let i=0;i<6;i++){const a=30+60*i,r=a*Math.PI/180,ap=3.6*Math.cos(Math.PI/6);if(a>=150&&a<=270)cuts.push(niche(-34.4+ap*Math.cos(r),-6.75+ap*Math.sin(r),a,3,1.4,6.5))}
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Augustijnenkerk Eindhoven",origin:ORIGIN,xAxis:X_AXIS,groundHeight:15.942,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0772100000285555"],description:"Neogotische driebeukige kruiskerk (Paterskerk, 1897-1898) met zeshoekige westtoren, doopkapel, dakruiter en koor met achtzijdige sluiting; oorsprong in de viering, X langs de nok naar het oosten.",realWorld:{groundNapM:15.942,ahn5RidgeNapM:40.8,ahn5FlecheNapM:56.4,ahn5SpireNapM:76.52,towerHeightWikipediaM:66},sources:["https://nl.wikipedia.org/wiki/Augustijnenkerk_(Eindhoven)","https://monumentenregister.cultureelerfgoed.nl/monumenten/518826","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000285555","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Paterskerk_(Eindhoven)"]};
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
