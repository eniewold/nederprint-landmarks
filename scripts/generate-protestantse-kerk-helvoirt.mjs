import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="protestantse-kerk-helvoirt";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[144500,404802],X_AXIS=[.946,.324];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
let nave=box(-11.2,6,-4.8,2.2,BASE,14.45);nave=plane(nave,0,1.65,16.595);nave=plane(nave,0,-1.65,12.305);
let north=box(-11.2,1,2,4.8,BASE,9.3);north=plane(north,0,-1,13.7);
let south=box(-10.5,1,-7.8,-4.6,BASE,9.5);south=plane(south,0,1,17.2);
let cross=box(.5,10.5,-8.3,8.4,BASE,14.6);cross=plane(cross,1.5,0,6.35);cross=plane(cross,-1.5,0,22.85);
let choir=prism([[9,-4.8],[13,-4.8],[15.9,-2.8],[15.9,.7],[13,2.7],[9,2.7]],BASE,13.8);choir=plane(choir,0,1.55,15.4275);choir=plane(choir,0,-1.55,12.1725);choir=plane(choir,-1.25,0,32.3);
let tower=box(-18,-10.8,-4.9,2.3,BASE,25.3);let spire=Manifold.cylinder(19.3,4.15,.45,4).rotate([0,0,45]).translate([-14.4,-1.3,25.25]);
let turret=Manifold.cylinder(17.8,1.3,1.3,8).translate([-10.5,2.3,BASE]);let tcap=Manifold.cylinder(1.5,1.3,.45,8).translate([-10.5,2.3,17.2]);
let butt=[];for(const x of [-17.5,-11])for(const y of [-5.5,1.9])butt.push(box(x-.45,x+.45,y,y+1,BASE,13));
for(const y of [-8.6,7.8])for(const x of [1,10])butt.push(box(x-.45,x+.45,y,y+1,BASE,8));
let dormers=[]; for(const x of [-8,-3]) { let g=box(x-1.4,x+1.4,-7.85,-4.5,BASE,10.7); g=plane(g,1.2,0,10.7-1.2*x); g=plane(g,-1.2,0,10.7+1.2*x); dormers.push(g); }
let church=Manifold.union([nave,north,south,cross,choir,tower,spire,turret,tcap,...butt,...dormers]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
for(const y of [-7.4,5.2])for(const x of [-8,-3])church=church.subtract(niche(x,y,3.5,1.3,3.5));
for(const y of [-7.9,8.8])for(const x of [3.5,7.5])church=church.subtract(niche(x,y,3.3,1.5,6));
for(const y of [-4.3,3.2]) church=church.subtract(niche(11.2,y,3,1.4,5));
church=church.subtract(niche(0,.35,3,1.4,5).rotate([0,0,-90]).translate([15.9,-1,0]));
for(const a of [0,180])for(const dx of [-1.4,1.4])church=church.subtract(niche(dx,4,19.5,1.1,4).rotate([0,0,a]).translate([-14.4,-1.3,0]));
for(const a of [90,270])for(const dx of [-1.4,1.4])church=church.subtract(niche(dx,4,19.5,1.1,4).rotate([0,0,a]).translate([-14.4,-1.3,0]));
church=church.subtract(niche(0,.35,BASE,1.5,3.5).rotate([0,0,90]).translate([-18,-1.3,0]));
church=church.subtract(niche(0,.35,4.5,1.4,5).rotate([0,0,90]).translate([-18,-1.3,0]));
const parts=[["building:kerk",church]];
const META={name:"Protestantse Kerk Helvoirt",origin:ORIGIN,xAxis:X_AXIS,groundHeight:7.95,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0788100000000666"],description:"Gotische dorpskerk met westtoren, transept en veelzijdig gesloten koor.",realWorld:{groundNapM:7.95,ahn5RoofNapM:22.4,ahn5TowerNapM:52.69},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0788100000000666","https://monumentenregister.cultureelerfgoed.nl/monumenten/21463","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Helvoirt","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-kerk-helvoirt.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








