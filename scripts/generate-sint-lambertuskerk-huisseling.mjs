import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-lambertuskerk-huisseling";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[172512,422143],X_AXIS=[.986,.168];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Zaalkerk met koorsluiting, zijdelingse toren, dwarskapel en lage verbonden vleugel.
const nave=roofY(box(2.3,30.5,4.9,16.6,BASE,16),16,10.75,1.1);
let choir=prism([[29,7],[32,7],[34.5,8.5],[35.5,10],[35.5,12],[34.5,13.5],[32,15],[29,15]],BASE,15);choir=roofY(choir,15,11,1.1);choir=plane(choir,-1,0,48.5);
const cross=roofX(box(19,27,1,9,BASE,13.2),13.2,23,1.1);
const annex=roofX(box(21.6,29,-15.5,1.5,BASE,7.4),7.4,25.3,.7);
const tower=box(25.7,31.3,13.2,18.8,BASE,24.4);
const cap=roofX(roofY(box(25.7,31.3,13.2,18.8,BASE,30.82),30.82,16,2.3),30.82,28.5,2.3);
const buttresses=[];for(const x of [5,10,15,20])for(const y of [4.8,16.5])buttresses.push(roofX(box(x-.45,x+.45,y<10?4.1:16.4,y<10?5.1:17.4,BASE,8),8,x,1));
let church=Manifold.union([nave,choir,cross,annex,tower,cap,...buttresses]);
const arch=(x,y,z,w,h,d=.8)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.6],[0,h],[-w/2,h-w*.6]],0,d).rotate([90,0,0]).translate([x,y,z]);
// Dubbele galmgaten, lange blinde nissen, ramen en de ingang in de voorgevel.
for(const x of [27.6,29.4])for(const y of [13.3,19.5])church=church.subtract(arch(x,y,19.5,1.15,3.8,.9));
for(const y of [15.1,16.9])church=church.subtract(arch(0,0,19.5,1.15,3.8,.9).rotate([0,0,90]).translate([25.6,y,0]));
for(const y of [15.1,16.9])church=church.subtract(arch(0,0,11.4,1,6,.8).rotate([0,0,90]).translate([25.6,y,0]));
for(const x of [6.8,8.2,11.8,13.2,16.8,18.2])for(const y of [5,17.4])church=church.subtract(arch(x,y,3,1.1,6,.9));
for(const y of [9,12.5])church=church.subtract(arch(0,0,8,1.4,4,.9).rotate([0,0,90]).translate([2.2,y,0]));
church=church.subtract(arch(0,0,0,2.4,4.3,.9).rotate([0,0,90]).translate([2.2,10.75,0]));
for(const y of [9.3,11,12.7])church=church.subtract(arch(0,0,3,1.1,6,.9).rotate([0,0,90]).translate([34.8,y,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Lambertuskerk Huisseling",origin:ORIGIN,xAxis:X_AXIS,groundHeight:7.472,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0828100001486269"],description:"Zaalkerk met veelhoekig koor en zijdelingse toren.",realWorld:{groundNapM:7.472,towerHeightM:30.82},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001486269","https://www.huisseling.nl/sint-lambertuskerk/","https://commons.wikimedia.org/wiki/Category:Sint-Lambertuskerk_(Huisseling)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-lambertuskerk-huisseling.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















