import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-petruskerk-jistrum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[200403.5,580839.5],X_AXIS=[1,0],GROUND_NAP=3.145;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const body=box(-6.2,6.5,-3.7,3.7,BASE,5.55);
const apse=Manifold.cylinder(5.55-BASE,3.7,3.7,24).translate([6.5,0,BASE]).intersect(box(6.4,10.5,-4,4,BASE,6));
let roof=box(-6.2,6.5,-3.7,3.7,5.5,12);roof=plane(roof,0,-1.26,10.2);roof=plane(roof,0,1.26,10.2);
const apseroof=Manifold.cylinder(4.65,3.7,0,24).translate([6.5,0,5.55]).intersect(box(6.4,10.5,-4,4,5.5,11));
const tower=box(-9.9,-6.0,-2.1,2.3,BASE,16.65);
let towerroof=box(-9.9,-6,-2.1,2.3,16.6,20);towerroof=plane(towerroof,0,-1.27,19.45+.1*1.27);towerroof=plane(towerroof,0,1.27,19.45-.1*1.27);
let church=Manifold.union([body,apse,roof,apseroof,tower,towerroof]);
// Blinde vensters en galmgaten, voldoende diep zichtbaar zonder kwetsbare openingen.
for(const x of [-4.4,0,4.1])for(const y of [-1,1]){const cut=box(x-.5,x+.5,y<0?-3.9:3.35,y<0?-3.35:3.9,1.9,4.4);church=church.subtract(cut)}
// Drie kleine blinde ramen in de halfronde koorwand.
for(const angle of [-55,0,55]) { const cut=box(9.85,10.5,-.43,.43,2.0,3.7).translate([-6.5,0,0]).rotate([0,0,angle]).translate([6.5,0,0]); church=church.subtract(cut); }
// Westelijke toegang als ondiepe nis.
church=church.subtract(box(-10.1,-9.55,-.55,.75,0,2.6));
for(const y of [-1,1])church=church.subtract(box(-8.55,-7.35,y<0?-2.3:1.95,y<0?-1.75:2.5,13.1,15.4));
for(const x of [-1,1])church=church.subtract(box(x<0?-10.1:-6.2,x<0?-9.65:-5.8,-.5,.7,13.1,15.4));
church=church.rotate([0,0,10.65]);
const parts=[["building:kerk",church]];
const META={name:"Sint-Petruskerk Jistrum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0737100000013860"],description:"Dertiende-eeuwse romaanse zaalkerk met halfrond koor en zadeldaktoren; vensters en galmgaten als blinde nissen.",realWorld:{groundNapM:3.145},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000013860","https://monumentenregister.cultureelerfgoed.nl/monumenten/35645","https://commons.wikimedia.org/wiki/Category:Sint-Petruskerk_(Jistrum)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-petruskerk-jistrum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

