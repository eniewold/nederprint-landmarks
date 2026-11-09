import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="heilige-clemenskerk-nuenen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[166301.75,387181.25],X_AXIS=[.95,-.312];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Kruisbasiliek met driezijdige transeptarmen en koor met lage kastenomgang.
const nave=roofY(box(3,41,-5.8,5.8,BASE,21.85),21.85,0,1.15);
let choir=prism([[40,-5.8],[46,-5.8],[51,-3],[52.5,-1.5],[52.5,1.5],[51,3],[46,5.8],[40,5.8]],BASE,21.85);choir=roofY(choir,21.85,0,1.15);choir=plane(choir,-1,0,67.85);
const north=prism([[28,0],[36,0],[36,13],[34,16.5],[30,16.5],[28,13]],BASE,20.8), south=prism([[28,-13],[30,-15],[34,-15],[36,-13],[36,0],[28,0]],BASE,20.8);
const transept=[plane(roofX(north,20.8,32,1.15),0,-1,33.8),plane(roofX(south,20.8,32,1.15),0,1,33.8)];
const aisles=[roofY(box(3,28,-10,-5.2,BASE,12.2),12.2,-5.2,.7),roofY(box(3,28,5.2,10,BASE,12.2),12.2,5.2,.7)];
const ambulatory=roofY(prism([[40,-9],[48,-9],[51,-7],[53,-3],[53,3],[51,7],[48,9],[40,9]],BASE,10),10,0,.5);
const sacristies=[-1,1].map(k=>roofX(box(38,46,k<0?-12.5:8,k<0?-8:12.5,BASE,10),10,42,1));
const tower=box(-4.4,4.4,-4.4,4.4,BASE,28.3);
const belfry=Manifold.cylinder(10,5.1,5.1,8).rotate([0,0,22.5]).translate([0,0,28]);
const spire=Manifold.cylinder(14.73,5.1,.45,8).rotate([0,0,22.5]).translate([0,0,37.9]);
const buttresses=[];for(const x of [8,15,22])for(const y of [-10,10])buttresses.push(roofX(box(x-.55,x+.55,y-.6,y+.6,BASE,14),14,x,1));
let church=Manifold.union([nave,choir,...transept,...aisles,ambulatory,...sacristies,tower,belfry,spire,...buttresses]);
const arch=(x,y,z,w,h,d=.8)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.6],[0,h],[-w/2,h-w*.6]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [10.5,12.5,17.5,19.5,24,26])for(const y of [-9.6,10.4])church=church.subtract(arch(x,y,2.5,2,6,.8));
for(const x of [10,11.6,13.2,17,18.6,20.2,23,24.6,26.2])for(const y of [-5.4,6.2])church=church.subtract(arch(x,y,12.6,1,2.5,.8));
for(const x of [-1.6,1.6])for(const y of [-4.2,5.0])church=church.subtract(arch(x,y,29.5,1.7,7,.9));
for(const y of [-1.6,1.6])for(const x of [-5,4.2])church=church.subtract(arch(0,0,29.5,1.7,7,.9).rotate([0,0,90]).translate([x,y,0]));
church=church.subtract(arch(0,0,0,2.4,5,.8).rotate([0,0,90]).translate([-4.8,0,0]));
const rose=Manifold.cylinder(.8,1.8,1.8,16).rotate([0,90,0]).translate([-4.8,0,12.5]);church=church.subtract(rose);
for(const x of [30,34])for(const y of [-14.6,16.9])church=church.subtract(arch(x,y,3,1.8,8,.8));
church=church.subtract(arch(0,0,11,2,7,.9).rotate([0,0,90]).translate([52.1,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Heilige Clemenskerk Nuenen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.381,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0820100000003149"],description:"Kruisbasiliek met driezijdige transeptarmen en kooromgang.",realWorld:{groundNapM:17.381,towerHeightM:52.63},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0820100000003149","https://monumentenregister.cultureelerfgoed.nl/monumenten/517999","https://ronddelinde.nl/wp-content/uploads/2023/03/2020_week_16.pdf","https://beeldbanknuenen.nl/boeken/pdf/2694.pdf"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-heilige-clemenskerk-nuenen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





















