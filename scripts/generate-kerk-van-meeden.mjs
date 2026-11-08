import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kerk-van-meeden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[258385,573637],X_AXIS=[.99997,.0079];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zaalkerk, afzonderlijk portaal en losstaande zadeldaktoren.
let ship=box(-13.2,12.3,-5.25,4.8,BASE,7.1),roof=box(-13.2,12.3,-5.25,4.8,7.05,15.8);
roof=plane(roof,0,1.64,16.15);roof=plane(roof,0,-1.64,15.45);
let porch=box(-6.2,-3.1,-7.7,-5.15,BASE,4.25),porchRoof=box(-6.2,-3.1,-7.7,-5.1,4.2,6.5);
porchRoof=plane(porchRoof,1.5,0,13.7);porchRoof=plane(porchRoof,-1.5,0,-.35);
let kerk=Manifold.union([ship,roof,porch,porchRoof]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-10,-1,3.5,8])kerk=kerk.subtract(arch(x,-4.9,2.8,1.45,3.8));
for(const x of [-10,-5,0,5,10])kerk=kerk.subtract(arch(x,5.15,2.8,1.4,3.8));
kerk=kerk.subtract(arch(-4.7,-7.35,BASE,1.2,2.5));
for(const x of [-12.5,-7.5,-2,2.4,7.0,11.5])for(const y of [-5.5,4.7])kerk=Manifold.union([kerk,box(x-.48,x+.48,y,y+.35,BASE,6.4)]);
let shaft=box(-30.4,-22.5,-27.4,-19.4,BASE,14.8),tr=box(-30.4,-22.5,-27.4,-19.4,14.75,20.6);
tr=plane(tr,1.48,0,59.8);tr=plane(tr,-1.48,0,-18.5);
let toren=Manifold.union([shaft,tr]);
for(const x of [-28.9,-26.5,-24.1])for(const y of [-27.05,-19.05])toren=toren.subtract(arch(x,y,10.7,1.2,2.9));
const parts=[["building:kerk",kerk],["building:toren",toren]];
let church=Manifold.union([kerk,toren]);
const META={name:"Kerk van Meeden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.2,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1987100000001687","NL.IMBAG.Pand.1987100000001686"],description:"Zaalkerk en losstaande zadeldaktoren, met apart portaal en vensternissen.",realWorld:{groundNapM:1.2,towerRoofHeightM:20.6,publishedTowerRidgeAboveFloorM:19.88,ahnRoofNapM:21.98},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1987100000001687","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1987100000001686","https://monumentenregister.cultureelerfgoed.nl/monumenten/28421","https://commons.wikimedia.org/wiki/Category:Kerk_van_Meeden","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.dbnl.org/tekst/ozin001oost01_01/ozin001oost01_01_0011.php"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kerk-van-meeden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==2)throw new Error(`expected two connected components, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
const base=box(-32,14,-29,7,-1.7,-.45);const plated=Manifold.union([church,base]).translate([0,0,1.7]);const baseStl=`${slug}-grondplaat-1-${scale}.stl`;await writeFile(path.join(outDir,baseStl),toStl(plated,`NederPrint ${META.name} met grondplaat`).buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl,baseStl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





