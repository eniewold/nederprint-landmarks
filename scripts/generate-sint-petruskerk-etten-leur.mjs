import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-petruskerk-etten-leur";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[104403.5,399962],X_AXIS=[.27,-.963];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Kruisbasiliek met zijbeuken, lage kapellen en zevenzijdig koor.
const nave=roofY(box(-3,46,-8,8,BASE,22),22,0,1.05);
const cross=roofX(box(30,39,-12.5,12.5,BASE,21.8),21.8,34.5,1.15);
let choir=prism([[43,-7],[48,-7],[52,-5],[54,-2],[54,2],[52,5],[48,7],[43,7]],BASE,21.4);choir=roofY(choir,21.4,0,1.15);choir=plane(choir,-1,0,73.4);
const aisles=[box(4,30,-9,-7.7,BASE,11.5),box(4,30,7.7,10,BASE,11.5)];
const chapels=[roofY(box(37,47,-13,-8,BASE,10),10,-10.5,.9),roofY(box(37,47,8,13,BASE,10),10,10.5,.9)];
const towers=[];for(const y of [-6.5,6.5]){towers.push(box(-3.6,3.6,y-3.6,y+3.6,BASE,27.5));towers.push(roofY(box(-3.6,3.6,y-3.6,y+3.6,BASE,29),29,y,1.2));towers.push(Manifold.cylinder(24.8,3.55,.5,8).translate([0,y,27.45]));}
towers.push(Manifold.cylinder(2.5,1.25,1.25,8).translate([34.5,0,20.5])); towers.push(Manifold.cylinder(11,1.25,.5,8).translate([34.5,0,22.8]));
const portal=roofY(box(-5,-2.8,-3.5,3.5,BASE,9),9,0,1.1);
let church=Manifold.union([nave,cross,choir,...aisles,...chapels,...towers,portal]);
const arch=(x,y,z,w,h,d=.6)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [8,13,18,23,27])for(const y of [-8.8,10.2])church=church.subtract(arch(x,y,3,1.5,6,.5));
for(const x of [32,36])for(const y of [-12.3,12.7])church=church.subtract(arch(x,y,4,1.7,9,.5));
for(const side of [-6.5,6.5])for(const x of [-1.2,1.2])for(const y of [side-3.4,side+3.8])church=church.subtract(arch(x,y,20,1.5,6,.5));
for(const side of [-6.5,6.5])for(const y of [side-1.2,side+1.2])church=church.subtract(arch(0,0,20,1.5,6,.5).rotate([0,0,90]).translate([-3.8,y,0]));
church=church.subtract(arch(0,0,10,5.2,5.8,.6).rotate([0,0,90]).translate([-3.2,0,0]));
church=church.subtract(arch(0,0,0,3.2,5.5,.6).rotate([0,0,90]).translate([-5.2,0,0]));
for(const y of [-1.7,0,1.7])church=church.subtract(arch(0,0,13,1.2,5,.6).rotate([0,0,90]).translate([53.8,y,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Petruskerk Etten-Leur",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.682,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0777100000142218"],description:"Neogotische kruisbasiliek met twee achthoekige spitsen en roosvenster.",realWorld:{groundNapM:2.682,towerHeightM:52.25},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0777100000142218","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://monumentenregister.cultureelerfgoed.nl/monumenten/14676","https://commons.wikimedia.org/wiki/Category:Sint-Petruskerk_(Etten-Leur)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-petruskerk-etten-leur.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















