import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="onze-lieve-vrouw-visitatiekerk-budel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[168119.75,365213.75],X_AXIS=[1,0];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Schip met kruisarmen en polygonale koorsluiting.
const nave=roofY(box(3,52,-9.5,9.5,BASE,26.15),26.15,0,1.0);
const cross=roofX(box(25,38,-15.5,15.5,BASE,26.1),26.1,31.5,1.0);
let choir=prism([[50,-9],[55,-9],[59,-6],[61,-2],[61,3],[58,7],[54,9],[50,9]],BASE,25.5);choir=roofY(choir,25.5,0,1.0);choir=plane(choir,-1.1,0,90.4);
let ambulatory=prism([[48,-11],[55,-11],[60,-7],[61,-3],[61,3],[58,9],[54,11],[48,11]],BASE,11.4);ambulatory=roofY(ambulatory,11.4,0,.25);
const aisle1=box(6,25,-12,-8,BASE,12),aisle2=box(6,25,8,12,BASE,12);
const tower=box(-4.5,4.5,-4.5,4.5,BASE,39.2);
const spire=Manifold.cylinder(29.5,4.4,.5,4).rotate([0,0,45]).translate([0,0,39.1]);
const corners=[];for(const x of [-3.65,3.65])for(const y of [-3.65,3.65]){corners.push(Manifold.cylinder(4,1.15,1.15,8).translate([x,y,37]));corners.push(Manifold.cylinder(9,1.15,.5,8).translate([x,y,40.95]));}
const portico=roofY(box(-7,-4, -3,3,BASE,9),9,0,1.15);
const rider=Manifold.cylinder(5,1.2,1.2,8).translate([34.5,0,25]);
const riderRoof=Manifold.cylinder(9,1.2,.5,8).translate([34.5,0,29.95]);
let church=Manifold.union([nave,cross,choir,ambulatory,aisle1,aisle2,tower,spire,portico,rider,riderRoof,...corners]);
const arch=(x,y,z,w,h,d=.6)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [9,14,19,23])for(const y of [-11.8,12.2])church=church.subtract(arch(x,y,4,1.7,6,.5));
for(const x of [9,14,19,23])for(const y of [-9.3,9.7])church=church.subtract(arch(x,y,14,1.7,5,.5));
for(const x of [-2.4,0,2.4])for(const y of [-4.3,4.7])church=church.subtract(arch(x,y,14,1.25,12,.5));
for(const y of [-2.4,0,2.4])church=church.subtract(arch(0,0,14,1.25,12,.5).rotate([0,0,90]).translate([-4.7,y,0]));
for(const y of [-9.3,9.7])church=church.subtract(arch(52,y,13,2,8,.5));
for(const y of [-1.3,1.3])church=church.subtract(arch(0,0,13,1.6,8,.6).rotate([0,0,90]).translate([60.7,y,0]));
for(const x of [28,32,36])for(const y of [-15.3,15.7])church=church.subtract(arch(x,y,5,1.6,9,.5));
for(const x of [-1.3,1.3])for(const y of [-4.3,4.7])church=church.subtract(arch(x,y,32,1.5,6,.5));
for(const y of [-1.3,1.3])church=church.subtract(arch(0,0,32,1.5,6,.5).rotate([0,0,90]).translate([-4.7,y,0]));
for(const y of [-1.3,1.3])church=church.subtract(arch(0,0,0,1.8,4.8,.5).rotate([0,0,90]).translate([-7.1,y,0]));
const parts=[["building:kerk",church]];
const META={name:"Onze-Lieve-Vrouw Visitatiekerk Budel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:31.522,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1706100000059496"],description:"Neogotische kruiskerk met westtoren, vier hoektorens en dakruiter.",realWorld:{groundNapM:31.522,towerHeightM:68.7},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1706100000059496","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://www.visitbrabant.com/nl/locaties/775672556/kerk-onze-lieve-vrouw-visitatie-budel","https://commons.wikimedia.org/wiki/File:Budel_-_Kerkstraat_10_5_O.L._Vrouw_Visitatie_kerk_(1).JPG"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-onze-lieve-vrouw-visitatiekerk-budel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















