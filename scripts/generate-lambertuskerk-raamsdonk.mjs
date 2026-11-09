import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="lambertuskerk-raamsdonk";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5, ORIGIN=[121632,411789], X_AXIS=[.968,.251], GROUND_NAP=1.62;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Ridges and walls are continuous planes; measured BAG/AHN5 and RCE photos.
let nave=box(.2,26.5,-10.2,9.1,BASE,18.1);nave=plane(nave,0,.83,18.1+.83*.5);nave=plane(nave,0,-.83,18.1-.83*.5);
let transept=box(21.5,31.2,-11.4,10.5,BASE,18.1);transept=plane(transept,1.32,0,18.1-1.32*26.4);transept=plane(transept,-1.32,0,18.1+1.32*26.4);
let choir=prism([[26,-5.8],[41.8,-5.8],[45.7,-3.5],[45.7,2.6],[41.8,5.2],[26,5.2]],BASE,18.1);choir=plane(choir,0,1.30,18.1+.39);choir=plane(choir,0,-1.30,18.1-.39);choir=plane(choir,-1.3,0,18.1+1.3*40.5);
const tower=box(-3.9,4.35,-4.5,3.9,BASE,20.55);
const top=Manifold.hull([[-3.9,-4.5,20.4],[4.35,-4.5,20.4],[4.35,3.9,20.4],[-3.9,3.9,20.4],[.23,-.3,26.0]]);
let church=Manifold.union([nave,transept,choir,tower,top]);
const supports=[];
for(const x of [3.8,11.8,19.3])for(const side of [-1,1]){const inner=side<0?-10.1:9.0,outer=inner+side*.9;let s=box(x-.48,x+.48,Math.min(inner,outer),Math.max(inner,outer),BASE,8);s=plane(s,0,-side,8+side*inner);supports.push(s)}
for(const x of [33.2,40.7])for(const side of [-1,1]){const inner=side<0?-5.7:5.1,outer=inner+side*.9;let s=box(x-.48,x+.48,Math.min(inner,outer),Math.max(inner,outer),BASE,9);s=plane(s,0,-side,9+side*inner);supports.push(s)}
church=Manifold.union([church,...supports]);const cuts=[];
for(const x of [4.8,9.4,14.1,18.8])for(const side of [-1,1])cuts.push(box(x-1.05,x+1.05,side<0?-10.5:8.8,side<0?-9.85:9.4,3.4,8.8));
for(const side of [-1,1])cuts.push(box(24.9,27.9,side<0?-11.7:10.2,side<0?-11.1:10.8,3.4,10.8));
for(const x of [34.8,38.2,41.0])for(const side of [-1,1])cuts.push(box(x-.8,x+.8,side<0?-6.1:4.9,side<0?-5.5:5.5,3,10.1));
for(const x of [-2,1])for(const side of [-1,1])cuts.push(box(x-.55,x+.55,side<0?-4.8:3.6,side<0?-4.2:4.2,14.8,19));
for(const y of [-2.6,.7])cuts.push(box(-4.2,-3.6,y-.55,y+.55,14.8,19));
cuts.push(box(45.4,46,-2,1.5,3,10));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Lambertuskerk Raamsdonk",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0779100000000276"],description:"Middeleeuwse kerk met piramidedak op toren, kruisvormig schip en veelhoekig koor; details vereenvoudigd.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0779100000000276","https://commons.wikimedia.org/wiki/Category:Lambertuskerk_(Raamsdonk)","https://monumentenregister.cultureelerfgoed.nl/monumenten/32279","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-lambertuskerk-raamsdonk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1){console.log(pieces.map(p=>p.boundingBox()));throw new Error(`expected one connected component, got ${pieces.length}`);}
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





