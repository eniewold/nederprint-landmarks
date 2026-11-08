import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-berghem";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[167410.25,420155.25],X_AXIS=[-.996,-.09];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Basilicaal schip, lagere zijbeuken, kruisarmen en koor als aparte volumes.
const nave=roofY(box(4.0,52.7,-6.5,6.5,BASE,24.1),24.1,.2,1.3);
const side1=plane(box(4,30.2,5.8,14.8,BASE,11.5),0,-.55,14.7);
const side2=plane(box(4,30.2,-10.7,-5.8,BASE,11.5),0,.8,16.2);
const cross=roofX(box(28.5,41,-15.5,15,BASE,24.1),24.1,34.75,1.3);
let choir=prism([[49,-6.5],[53,-6.5],[57,-3],[58.5,0],[57,3],[53,6.4],[49,6.4]],BASE,24);choir=roofY(choir,24,0,1.3);choir=plane(choir,-1.5,0,105);
const sac1=box(42,51,-13.6,-5.8,BASE,8),sac2=box(42,51,5.8,14.5,BASE,8);
// Oude zware toren en de jongere kruisingruiter met zelfstandige naaldspitsen.
const tower=box(-6.5,5.6,-6.6,7,BASE,40.8);
const needle=Manifold.cylinder(30.95,5.5,.5,8).translate([-.45,.2,40.75]);
const rider=box(33.2,36,-1.3,1.5,22.8,28.5);
const riderRoof=Manifold.cylinder(10,1.35,.5,8).translate([34.6,.1,28.45]);
const turret=Manifold.cylinder(15,1.7,1.7,8).translate([35,-12.7,BASE]);
const turretRoof=Manifold.cylinder(6.5,1.7,.5,8).translate([35,-12.7,14.45]);
let church=Manifold.union([nave,side1,side2,cross,choir,sac1,sac2,tower,needle,rider,riderRoof,turret,turretRoof]);
const arch=(x,y,z,w,h,d=1)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [7,12,17,22,27])for(const y of [-10.4,15.1])church=church.subtract(arch(x,y,2.3,1.4,5.2,1));
for(const x of [-2.5,.8])for(const y of [-6.3,7.3])church=church.subtract(arch(x,y,32,1.4,6,1.3));
for(const y of [-2,1.5])church=church.subtract(arch(0,0,32,1.4,6,1.3).rotate([0,0,90]).translate([-6.7,y,0]));
// Grote bovenlichten en de vensters van beide kruisarmen.
for(const x of [8,13,18,23,27])for(const y of [-6.2,6.8])church=church.subtract(arch(x,y,12,1.5,6,1.2));
for(const x of [32,37])for(const y of [-15.2,15.3])church=church.subtract(arch(x,y,9,1.7,8,1.2));
for(const y of [-1.0,1.8])church=church.subtract(arch(34.6,y,25,1.1,2.8,.8));
const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Berghem",origin:ORIGIN,xAxis:X_AXIS,groundHeight:8.057,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0828100001484075"],description:"Grote kruiskerk met oude westtoren en ranke vieringsruiter.",realWorld:{groundNapM:8.057,towerHeightM:71.7},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001484075","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://beta.bhic.nl/verhalen/de-h-willibrorduskerk-in-berghem","https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Berghem)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-berghem.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));














