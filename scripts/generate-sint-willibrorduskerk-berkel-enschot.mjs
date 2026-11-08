import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-berkel-enschot";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[138100.75,400183.75],X_AXIS=[.955,.296];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Middenschip, koorsluiting en afzonderlijke dwarskappen boven zijbeuken.
const nave=roofY(box(1.9,28.4,-5.8,4.7,BASE,13.9),13.9,0,.95);
let choir=prism([[27.8,-4.4],[33,-4.4],[35.9,-2.2],[36,2.9],[33,4.2],[27.8,4.5]],BASE,11.3);choir=roofY(choir,11.3,0,1.0);choir=plane(choir,-1.1,0,49.8);
const aisles=[];for(const x of [4.8,9,13.2,17.4,21.6]){
 aisles.push(roofX(box(x-2.2,x+2.2,-7.3,-4.4,BASE,7.1),7.1,x,1.1));
 aisles.push(roofX(box(x-2.2,x+2.2,4.4,7.2,BASE,7.1),7.1,x,1.1));
}
const annex=box(23,32.7,-12.3,-6.8,BASE,3.8),annexWing=box(29,32.8,-19.5,-12,BASE,3.8),side=box(15.2,27.8,7,13.7,BASE,4.3);
const tower=box(-3.4,3.3,-3.2,3,BASE,23.0);
const spire=Manifold.cylinder(15.1,3.0,.5,8).translate([-.05,-.1,22.95]);
const entrance=roofX(box(-4.1,-3,-2.4,2.3,BASE,6.0),6.0,-3.5,.8);
const join=box(22,32.7,-7.5,-4.4,BASE,3.8);
let church=Manifold.union([nave,choir,annex,annexWing,side,tower,spire,entrance,join,...aisles]);
const arch=(x,y,z,w,h,d=1)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d).rotate([90,0,0]).translate([x,y,z]);




for(const x of [4.8,9,13.2,17.4,21.6])for(const y of [-7,7.5])church=church.subtract(arch(x,y,1.4,1.2,3.2,1.1));
for(const y of [-2.9,3.3])church=church.subtract(arch(-.1,y,17.5,1.7,4,1.3));
church=church.subtract(arch(0,0,17.5,1.7,4,1.3).rotate([0,0,90]).translate([-3.6,0,0]));
church=church.subtract(arch(0,0,.1,1.7,4.6,1.4).rotate([0,0,90]).translate([-4.3,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Berkel-Enschot",origin:ORIGIN,xAxis:X_AXIS,groundHeight:12.383,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0855100000703581"],description:"Basilicale kerk met voorgelegen toren en dwarsgeplaatste zijbeukkappen.",realWorld:{groundNapM:12.383,towerHeightM:38.05},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000703581","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://www.bhic.nl/ontdekken/verhalen/de-h-willibrorduskerk-in-berkel","https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk,_Berkel-Enschot"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-berkel-enschot.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

















