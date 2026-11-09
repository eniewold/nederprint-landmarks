import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="sint-catharinakerk-eindhoven";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: X langs de as van het koor (X<0) naar het dubbeltorenfront (X>0, noordoost),
// Y naar links (noordwest, Davidstoren). Oorsprong op de viering, maaiveld NAP +17,26 m.
// As uit de BAG-gevels (36,9 graden), nok AHN NAP +47,85 m, torens 73 m (Wikipedia/Reliwiki).
const BASE=-.5,ORIGIN=[161395.91,383089.62],X_AXIS=[.7997,.6004];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
const oct=(x,y,z0,z1,flat,top=flat,rot=0)=>{const c=Math.cos(Math.PI/8);return Manifold.cylinder(z1-z0,flat/2/c,top/2/c,8).rotate([0,0,22.5+rot]).translate([x,y,z0])};
const RIDGE=30.6,EAVE=21.8,K=(RIDGE-EAVE)/6.2;
const parts=[];
// Middenschip en koor onder een doorlopende kap, dwarsschip met dezelfde doorsnede.
parts.push(roofY(box(-16.8,37.8,-6.2,6.2,BASE,RIDGE+1),RIDGE,0,K));
// Dwarsschip iets smaller dan het schip, nok op X=0,5; noordwestgevel met laag portaal.
const TE=[-19.8,18.2];
parts.push(roofX(box(-5.3,6.3,TE[0],TE[1],BASE,RIDGE+1),RIDGE,.5,(RIDGE-EAVE)/5.8));
parts.push(plane(box(-3.5,3.5,TE[1]-.5,20.9,BASE,6),0,-1.5,5.3+1.5*19));
// Vijfzijdige koorsluiting met eigen dakschilden.
const AC=[-16.8,0],AR=6.2,apsePoly=[90,126,162,198,234,270].map(a=>[AC[0]+AR*Math.cos(a*Math.PI/180),AR*Math.sin(a*Math.PI/180)]);
let apse=roofY(prism([[AC[0]+.5,AR],...apsePoly,[AC[0]+.5,-AR]],BASE,RIDGE+1),RIDGE,0,K);
{const d=AR*Math.cos(Math.PI/10),ka=(RIDGE-EAVE)/d;for(const a of [108,144,180,216,252]){const nx=Math.cos(a*Math.PI/180),ny=Math.sin(a*Math.PI/180);apse=plane(apse,-ka*nx,-ka*ny,EAVE+ka*d+ka*(nx*AC[0]));}}
parts.push(apse);
// Zijbeuken van schip en koor (lessenaarsdak), dwarsschipbeuken aan weerszijden van het dwarsschip.
for(const s of [-1,1]){
  const aisle=(x0,x1,y1)=>plane(box(x0,x1,s>0?6:-y1,s>0?y1:-6,BASE,16),0,-s*.6,14.5+.6*6.2);
  parts.push(aisle(-16.8,29.9,11.75),aisle(-16.8,-12,12));
  parts.push(plane(box(6,12.4,s>0?11.7:-18.6,s>0?18.6:-11.7,BASE,15),-.55,0,14.1+.55*6.3));
  parts.push(plane(box(-12.4,-5,s>0?11.7:-20.1,s>0?18.6:-11.7,BASE,15),.55,0,14.1+.55*5.3));
  // Lage kapellen naast het koor; aan de zuidoostkant tot de sacristie.
  parts.push(plane(box(-21.7,-12,s>0?11.8:-20.1,s>0?18.6:-11.8,BASE,10),0,-s*.15,9.3+.15*11.8));
}
// Kooromgang als omhullende van de BAG-koorsluiting, met drie straalkapellen en twee traptorens.
const ambRing=[[-16.3,-12],...[90,126,162,198,234,270].map(a=>[AC[0]+9.8*Math.cos(a*Math.PI/180),9.8*Math.sin(a*Math.PI/180)]),[-16.3,12]];
const ambPts=[];for(const[x,y]of ambRing){ambPts.push([x,y,BASE],[x,y,10.5]);}
for(const[x,y]of apsePoly)ambPts.push([x+(x-AC[0])*.02,y*1.02,15.6]);ambPts.push([-16.3,-6.3,15.6],[-16.3,6.3,15.6]);
parts.push(Manifold.hull(ambPts));
// Lage omgang rond het koor op de BAG-omtrek, waar kapellen en omgang op staan.
parts.push(prism([[-12,-20.1],[-12,18.6],[-21.9,18.6],[-21.9,14.55],[-26.8,11.45],[-27.2,10.75],[-27.2,6.35],[-27.6,5.65],[-31.6,3.55],[-32,2.85],[-32,-2.85],[-31.6,-3.55],[-27.6,-5.75],[-27.2,-6.45],[-27.2,-10.85],[-26.4,-11.85],[-21.7,-14.65],[-21.7,-20.1]],BASE,7));
const chapels=[[-27.3,0,0],[-22.9,9.2,-11.5],[-22.9,-9.2,11.5]];
for(const[x,y,r]of chapels){parts.push(oct(x,y,BASE,12.5,8.6,8.6,r));parts.push(oct(x,y,12.49,16.8,8.6,.3,r));}
for(const s of [-1,1]){parts.push(oct(-18.6,s*13.2,BASE,14.5,2.4));parts.push(oct(-18.6,s*13.2,14.49,18,2.4,.3));}
// Sacristie en kosterij aan de zuidoostkant onder een steil zadeldak.
parts.push(roofY(box(-27.3,-4.3,-26.95,-20.05,BASE,12),11.1,-23.5,1.42));
// Steunberen met pinakels langs de zijbeuken, pinakels bij de luchtbogen op de lichtbeuk.
for(const x of [12.4,18,24])for(const s of [-1,1]){
  parts.push(box(x-.5,x+.5,s>0?11.5:-13.05,s>0?13.05:-11.5,BASE,11.5));parts.push(oct(x,s*12.3,11.49,16.5,1.0,.15));
}
for(const x of [-11.5,6.2,12.4,18,24])for(const s of [-1,1]){parts.push(oct(x,s*6.7,13,17.5,1.0));parts.push(oct(x,s*6.7,17.49,20.5,1.0,.15));}
// Hoekpinakels van de dwarsschipgevels.
for(const x of [-5.3,6.3])for(const y of TE){parts.push(oct(x,y,BASE,24,1.3));parts.push(oct(x,y,23.99,28,1.3,.15));}
// Dakruiter op de viering.
parts.push(oct(0,0,27.5,35,2.6));parts.push(oct(0,0,34.99,48.4,2.6,.2));
// Dubbeltorenfront: onderbouw tot de balustrade, vierkante klokverdieping, achtkant en naald.
// Y>0: Davidstoren (forser, met wimpergen), Y<0: Mariatoren (slanker, hogere achtkant met spitsjes).
const TX=34.2;
for(const s of [-1,1]){
  const ty=s*8.3;
  parts.push(box(29.7,38.4,s>0?3.9:-12.45,s>0?12.45:-3.9,BASE,28));
  for(const x of [30.1,36.7])parts.push(box(x,x+1.1,s>0?12:-14.15,s>0?14.15:-12,BASE,24));
  for(const y of [4.45,10.95])parts.push(plane(box(38.3,39.8,s*y-.55,s*y+.55,BASE,23),-1.5,0,22+1.5*38.3));
  parts.push(box(TX-3.9,TX+3.9,ty-3.9,ty+3.9,27.9,40));
  const david=s>0,flat=david?6.2:5.4,top=david?50:56;
  parts.push(oct(TX,ty,39.9,top,flat));
  for(const dx of [-3.15,3.15])for(const dy of [-3.15,3.15]){parts.push(oct(TX+dx,ty+dy,39.9,david?46:48,1.1));parts.push(oct(TX+dx,ty+dy,david?45.99:47.99,david?50.5:53.5,1.1,.15));}
  if(david){
    const w=2.6,g=prism([[-w/2,0],[w/2,0],[w/2,10],[0,14.2],[-w/2,10]],0,.9).rotate([90,0,0]);
    for(const a of [0,90,180,270])parts.push(g.translate([0,flat/2+.75,39.9]).rotate([0,0,a]).translate([TX,ty,0]));
    parts.push(oct(TX,ty,top-.01,73,5.0,.25));
  }else{
    const rv=2.35;for(let i=0;i<8;i++){const a=(22.5+45*i)*Math.PI/180;parts.push(oct(TX+rv*Math.cos(a),ty+rv*Math.sin(a),top-.01,61,1.0,.15));}
    parts.push(oct(TX,ty,top-.01,73,4.4,.25));
  }
}
// Drie portalen met wimpergen in het front.
const gable=(w,h,peak,d)=>prism([[-w/2,0],[w/2,0],[w/2,h],[0,peak],[-w/2,h]],0,d).rotate([90,0,0]);
parts.push(gable(6.4,12,18.5,2.2).rotate([0,0,90]).translate([37.6,0,BASE]));
for(const s of [-1,1])parts.push(gable(4.4,9,14.5,1.5).rotate([0,0,90]).translate([38.3,s*8.3,BASE]));
let church=Manifold.union(parts);
// Blinde nissen: spitsboogvensters, deuren en roosvensters (zeshoek met de punt omhoog).
const niche=(x,y,z,w,h,phi,d=.4)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d+.3).rotate([90,0,0]).translate([0,.3,0]).rotate([0,0,phi-90]).translate([x,y,z]);
const rose=(x,y,z,r,phi,d=.4)=>{const p=[];for(let i=0;i<6;i++){const a=(90+60*i)*Math.PI/180;p.push([r*Math.cos(a),r*Math.sin(a)+z]);}return prism(p,0,d+.3).rotate([90,0,0]).translate([0,.3,0]).rotate([0,0,phi-90]).translate([x,y,0]);};
const cuts=[];
for(const s of [-1,1]){
  const n=s>0?90:-90;
  for(const x of [15.2,21.2,27])cuts.push(niche(x,s*11.75,3.2,1.8,6.5,n),niche(x,s*6.2,16.4,1.6,4.2,n));
  for(const x of [-9.3,-14.4,9.3])cuts.push(niche(x,s*6.2,16.4,1.6,4.2,n));
  const te=s>0?TE[1]:TE[0];for(const x of [-2,3])cuts.push(niche(x,te,s>0?6.5:2.5,1.8,s>0?6:9,n));
  cuts.push(rose(.5,te,17,3.0,n));
  if(s>0)for(const x of [-15,-19])cuts.push(niche(x,18.6,2,1.4,4,n));
  for(const x of [8,10.6])cuts.push(niche(x,s*18.6,3,1.4,6,n));
  const ty=s*8.3;
  cuts.push(niche(34.9,s*12.45,8,1.8,8,n),niche(38.4,ty,16,1.8,10,0));
  for(const d of [-1.6,1.6]){cuts.push(niche(TX+d,ty+s*3.9,30,1.1,7.5,n),niche(TX+3.9,ty+d,30,1.1,7.5,0),niche(TX-3.9,ty+d,30.5,1.1,7,180));}
  const david=s>0,fl=david?3.1:2.7;
  for(const a of david?[45,135,225,315]:[0,90,180,270]){const r=a*Math.PI/180;cuts.push(niche(TX+fl*Math.cos(r),ty+fl*Math.sin(r),david?41:42.5,1.2,david?5.5:8,a));}
  cuts.push(niche(39.8,s*8.3,BASE,2.2,6,0,.6));
}
cuts.push(rose(37.8,0,21.2,3,0),niche(39.8,0,BASE,3,8,0,.7));
for(const x of [-24,-19.5,-15,-10.5,-6.5])cuts.push(niche(x,-26.95,1.5,1.2,3.2,-90));
for(const[x,y,r]of chapels)for(const da of [-45,0,45]){const deg=(y===0?180:Math.sign(y)*135+r)+da,q=deg*Math.PI/180;cuts.push(niche(x+4.3*Math.cos(q),y+4.3*Math.sin(q),3,1.3,5,deg));}
church=church.subtract(Manifold.union(cuts));
const named=[["building:kerk",church]];
const META={name:"Sint-Catharinakerk Eindhoven",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.26,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0772100000282608"],description:"Neogotische kruisbasiliek van Cuypers (1867) met dubbeltorenfront naar het Catharinaplein (+X), kooromgang met drie straalkapellen naar het zuidwesten; oorsprong op de viering.",realWorld:{groundNapM:17.26,ridgeNapM:47.85,crossingTurretNapM:65.7,towerHeightM:73,ahnTowerTopNapM:[92.7,93.45]},sources:["https://nl.wikipedia.org/wiki/Sint-Catharinakerk_(Eindhoven)","https://www.reliwiki.nl/index.php/Eindhoven,_Catharinaplein_1_-_Catharina","https://monumentenregister.cultureelerfgoed.nl/monumenten/14635","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000282608","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Sint-Catharinakerk_(Eindhoven)"]};
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
const glb=`${slug}.glb`,printFiles=[];
await writeFile(path.join(outDir,glb),toGlb(named));
for(const scale of [100,1000]){const stl=`${slug}-1-${scale}.stl`;printFiles.push(stl);await writeFile(path.join(outDir,stl),toStl(church.translate([0,0,-BASE]),`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale).buffer);}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2)+"\n");
