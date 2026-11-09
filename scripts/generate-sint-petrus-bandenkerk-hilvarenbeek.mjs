import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-petrus-bandenkerk-hilvarenbeek";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[137590,388500],X_AXIS=[.954,.300];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en lage zijbeuk bezitten elk een eigen kap.
let nave=box(-17.2,8,-5.3,9.3,BASE,19.5);nave=plane(nave,0,1.1,17.3);nave=plane(nave,0,-1.1,21.7);
let aisle=box(-16,7,-15.1,-5,BASE,15.8);aisle=plane(aisle,0,1.05,26.3525);aisle=plane(aisle,0,-1.05,5.2475);
let cross=box(7,20,-20.2,14.4,BASE,19.0);cross=plane(cross,1.05,0,4.825);cross=plane(cross,-1.05,0,33.175);
let choir=prism([[19,-7],[29,-7],[33,-5.5],[35,-2.5],[35,0],[33,3],[29,4.3],[19,4.3]],BASE,17.6);choir=plane(choir,0,1.3,19.355);choir=plane(choir,0,-1.3,15.845);choir=plane(choir,-1,0,50);
let chapel=prism([[22,4],[30,4],[32,5],[33,7],[32,9],[30,10],[22,10]],BASE,9.8);chapel=plane(chapel,0,1,2.8);chapel=plane(chapel,0,-1,16.8);chapel=plane(chapel,-1,0,41);
// Toren en geprofileerde spits, met appel, gesloten lantaarn en peer.
let tower=box(-27,-17,-7.3,2.7,BASE,40);let butt=[];
for(const x of [-27.5,-18.1])for(const y of [-8.0,2.1]) {let b=box(x-.7,x+1.4,y,y+1.4,BASE,39);b=plane(b,0,0,37.7);butt.push(b); let pin=box(x-.15,x+.95,y+.2,y+1.2,BASE,42);pin=plane(pin,1,0,42-(x+.4));pin=plane(pin,-1,0,42+(x+.4));butt.push(pin);}
const profile=[[0,39.9],[5.2,39.9],[4.3,42],[2.8,49],[2.8,50.5],[4.0,52],[4.8,54],[4.8,56],[4,58],[2.6,60],[2,61],[2,64.8],[2.6,65.4],[2.6,66],[3,67],[2.9,68.2],[2.3,70],[1.3,71.8],[.5,73],[0,73]];
let spire=Manifold.revolve([profile],16).translate([-22,-2.3,0]);
for(const x of [-14,-9,-4,1,6])for(const y of [-15.6,8.9])butt.push(box(x-.5,x+.5,y,y+1,BASE,10.2));
for(const x of [7.3,19])for(const y of [-20.8,14])butt.push(box(x-.55,x+.55,y,y+1.1,BASE,11));
let rooflet=Manifold.revolve([[[0,14],[.85,14],[.85,21],[1.3,21.8],[1.3,22.7],[.8,23.6],[.45,24.8],[0,24.8]]],12).translate([11.5,-1.4,0]);
let church=Manifold.union([nave,aisle,cross,choir,chapel,tower,spire,rooflet,...butt]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-12,-7,-2,3])for(const y of [-14.7,9.7])church=church.subtract(niche(x,y,3.8,2,8));
for(const y of [-19.8,14.8])for(const x of [10,13.5,17])church=church.subtract(niche(x,y,3.8,1.7,9));
for(const y of [-6.6,4.7])for(const x of [23,28])church=church.subtract(niche(x,y,3,1.6,7));
for(const a of [0,90,180,270])church=church.subtract(niche(0,2.3,61.3,1.1,2.8).rotate([0,0,a]).translate([-22,-2.3,0]));
for(const a of [0,180])for(const dx of [-2.7,0,2.7]) {church=church.subtract(niche(dx,5.35,10,1.6,14).rotate([0,0,a]).translate([-22,-2.3,0]));church=church.subtract(niche(dx,5.35,27,1.6,9).rotate([0,0,a]).translate([-22,-2.3,0]));}
for(const a of [90,270])for(const dx of [-2.7,0,2.7]) {church=church.subtract(niche(dx,5.35,10,1.6,14).rotate([0,0,a]).translate([-22,-2.3,0]));church=church.subtract(niche(dx,5.35,27,1.6,9).rotate([0,0,a]).translate([-22,-2.3,0]));}
church=church.subtract(niche(0,.4,BASE,2.4,4.5).rotate([0,0,90]).translate([-27,-2.3,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Petrus-Bandenkerk Hilvarenbeek",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.469,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0798100000006247"],description:"Gotische kruiskerk met geprofileerde Beekse toren.",realWorld:{groundNapM:17.469,ahn5RoofNapM:36.95,ahn5TowerNapM:84.49,towerHeightM:74.5},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0798100000006247","https://monumentenregister.cultureelerfgoed.nl/monumenten/22152","https://www.beeksetoren.nl/nl","https://commons.wikimedia.org/wiki/Category:Sint-Petrus%27_Bandenkerk_(Hilvarenbeek)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-petrus-bandenkerk-hilvarenbeek.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








