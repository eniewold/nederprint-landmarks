import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-bakel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[179581.25,390654.75],X_AXIS=[.93,.367];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Middenschip, lagere zijbeuken, dwarsschip en koor met aparte kappen.
const nave=roofY(box(4,30,-5.1,4.4,BASE,18.5),18.5,-.2,1.55);
const side1=plane(box(4,25.5,3.5,8,BASE,10.3),0,-.9,13.5);
const side2=plane(box(4,25.5,-9,-4,BASE,10.3),0,.9,13.9);
const cross=roofX(box(22.5,30,-11.5,10.6,BASE,11.7),11.7,26.3,1.35);
let choir=prism([[29,-4.8],[37.8,-4.8],[40.5,-1.7],[40.5,1.4],[37.8,4.1],[29,4.5]],BASE,17);choir=roofY(choir,17,0,1.6);choir=plane(choir,-1.3,0,67.5);
const rear1=box(29.2,38.3,4,9.8,BASE,7.4),rear2=box(29.2,38.5,-10.8,-4,BASE,7.4);
// Stevige gotische toren met spits; topbron AHN5 is volledig gemeten.
const tower=box(-5.3,4.5,-5,5.6,BASE,30.0);
const needle=Manifold.cylinder(22.5,4.4,.5,8).translate([-.4,.3,29.9]);
const buttresses=[];
for(const x of [-5.8,4.8])for(const y of [-4.4,4.9])buttresses.push(plane(box(x-.65,x+.65,y-.65,y+.65,BASE,23.5),0,0,23.5));
let church=Manifold.union([nave,side1,side2,cross,choir,rear1,rear2,tower,needle,...buttresses]);
const arch=(x,y,z,w,h,d=1)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [7,11,15,19])for(const y of [-8.7,8.3])church=church.subtract(arch(x,y,1.8,1.2,4,1.2));
for(const x of [-2.1,1.2])for(const y of [-4.7,5.9])church=church.subtract(arch(x,y,22,1.7,5.3,1.5));
for(const y of [-1.4,1.6]){
 church=church.subtract(arch(0,0,22,1.7,5.3,1.5).rotate([0,0,90]).translate([-5.5,y,0]));
 church=church.subtract(arch(0,0,22,1.7,5.3,1.5).rotate([0,0,-90]).translate([4.7,y,0]));
}
church=church.subtract(arch(0,0,.1,1.8,5.5,1.2).rotate([0,0,90]).translate([-5.5,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Bakel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:22.641,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1652100000000841"],description:"Gotische kerk met zware westtoren en slanke spits.",realWorld:{groundNapM:22.641,towerHeightM:52.4},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1652100000000841","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://monumentenregister.cultureelerfgoed.nl/monumenten/8592","https://commons.wikimedia.org/wiki/Category:Sint_Willibrorduskerk,_Bakel"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-bakel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));














