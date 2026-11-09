import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-annakerk-molenschot";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[119980.75,398348.75],X_AXIS=[.127,-.992];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Pseudobasiliek met transept, koor en de ingekorte noordtoren.
const nave=roofY(box(2,23,-4.5,4.5,BASE,14.6),14.6,0,1.05);
let choir=prism([[22,-4.5],[25,-4.5],[29,-2.4],[30,0],[29,2.4],[25,4.5],[22,4.5]],BASE,14.6);choir=roofY(choir,14.6,0,1.05);choir=plane(choir,-1,0,39.6);
const transept=roofX(box(18,23,-9.1,8.1,BASE,14.6),14.6,20.5,1.2);
const left=roofY(box(2.5,18.5,-7.7,-4,BASE,8.9),8.9,-4,.7),right=roofY(box(2.5,18.5,4,7.7,BASE,8.9),8.9,4,.7);
const sacristy=roofY(box(23,28,-10,-4,BASE,8.5),8.5,-7,.8);
const chapel=roofX(roofY(prism([[23,4],[28,4],[29,6],[28,8.5],[24,8.5],[23,7]],BASE,8.8),8.8,6.2,.7),8.8,26,1);
const tower=box(-2.8,2.8,-3.2,2.8,BASE,25.7);
const spire=Manifold.cylinder(6.26,4.25,.45,4).rotate([0,0,45]).translate([0,-.2,25.7]);
const rider=Manifold.cylinder(7.4,1.0,.45,8).translate([20.5,0,14.3]);
const buttresses=[];for(const x of [5,9,13,17])for(const y of [-7.9,7.9])buttresses.push(roofX(box(x-.5,x+.5,y-.55,y+.55,BASE,7.5),7.5,x,1));
let church=Manifold.union([nave,choir,transept,left,right,sacristy,chapel,tower,spire,rider,...buttresses]);
const arch=(x,y,z,w,h,d=.8)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.6],[0,h],[-w/2,h-w*.6]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [7,11,15])for(const y of [-7.3,8.1])church=church.subtract(arch(x,y,2,1.4,4.8,.8));
for(const x of [-1.45,1.45])for(const y of [-2.8,3.2])church=church.subtract(arch(x,y,19,1.4,5,.8));
for(const y of [-1.65,1.25])for(const x of [-3.2,3.2])church=church.subtract(arch(0,0,19,1.4,5,.8).rotate([0,0,90]).translate([x,y,0]));
for(const x of [-1.7,0,1.7])for(const y of [-2.8,3.2])church=church.subtract(arch(x,y,13,1,3.8,.8));
for(const y of [-1.8,-.2,1.4])for(const x of [-3.2,2.4])church=church.subtract(arch(0,0,13,1,3.8,.8).rotate([0,0,90]).translate([x,y,0]));
church=church.subtract(arch(0,0,0,2.0,4,.8).rotate([0,0,90]).translate([-3.2,-.2,0]));
for(const y of [-8.7,8.5])church=church.subtract(arch(20.5,y,3,2.4,8,.8));
const parts=[["building:kerk",church]];
const META={name:"Sint-Annakerk Molenschot",origin:ORIGIN,xAxis:X_AXIS,groundHeight:7.926,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0784100000000513"],description:"Kruiskerk met zijbeuken en ingekorte noordtoren.",realWorld:{groundNapM:7.926,towerHeightM:31.96},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0784100000000513","https://monumentenregister.cultureelerfgoed.nl/monumenten/516948","https://www.parochieheiligegeest.nl/samenleven-en-de-kerk/gebouwen/annakerk/","https://argusvlinder.com/2008/03/02/annakerk-en-annakapel-in-molenschot/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-annakerk-molenschot.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
















