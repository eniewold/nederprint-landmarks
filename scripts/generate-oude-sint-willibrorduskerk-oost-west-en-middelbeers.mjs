import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-sint-willibrorduskerk-oost-west-en-middelbeers";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[145170,386133],X_AXIS=[.987,.16];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Breed schip met één doorlopende kap en twee lagere dwarsarmen.
let nave=box(-8.1,7.7,-6.65,6.2,BASE,14.4);nave=plane(nave,0,1.36,14.4);nave=plane(nave,0,-1.36,14.4);
let transept=box(1.9,7.7,-8.3,8.1,BASE,11.1);transept=plane(transept,1.65,0,3.18);transept=plane(transept,-1.65,0,19.02);
let choir=prism([[7.5,-3.4],[13.9,-3.4],[16.1,-1.5],[16.1,1.1],[14,2.9],[7.5,2.9]],BASE,11.5);choir=plane(choir,0,1.7,11.5);choir=plane(choir,0,-1.7,11.5);choir=plane(choir,-2,0,39.3);
let annex=box(7.55,11.1,2.8,5.6,BASE,5.3);annex=plane(annex,0,-.7,9.2);
// Bakstenen westtoren met achtzijdige spits uit AHN5.
let tower=box(-14,-8,-3.4,3.2,BASE,19.7);
let spire=Manifold.cylinder(19.98,3.35,.46,8).translate([-11,0,19.65]);
let church=Manifold.union([nave,transept,choir,annex,tower,spire]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
// Vensters in de langs- en dwarsgevels als ondiep reliëf.
for(const x of [-6,-2.5]) {church=church.subtract(niche(x,-6.35,1.1,1.35,4.2));church=church.subtract(niche(x,0,1.1,1.35,4.2).rotate([0,0,180]).translate([2*x,5.9,0]));}
church=church.subtract(niche(4.8,-8,1.4,1.5,5));church=church.subtract(niche(4.8,0,1.4,1.5,5).rotate([0,0,180]).translate([9.6,7.8,0]));
for(const x of [9.2,12.3]){church=church.subtract(niche(x,-3.1,2.2,1,4));church=church.subtract(niche(x,0,2.2,1,4).rotate([0,0,180]).translate([2*x,2.6,0]));}
church=church.subtract(niche(0,0,BASE,1.7,3.7).rotate([0,0,90]).translate([-14.3,0,0]));
for(const y of [-1.5,1.4]){church=church.subtract(niche(0,0,15.6,1.1,3.2).rotate([0,0,90]).translate([-14.3,y,0]));church=church.subtract(niche(0,0,15.6,1.1,3.2).rotate([0,0,-90]).translate([-7.7,y,0]));}
for(const x of [-12.2,-9.8]) {church=church.subtract(niche(x,-3.1,15.6,1.1,3.2));church=church.subtract(niche(x,0,15.6,1.1,3.2).rotate([0,0,180]).translate([2*x,2.9,0]));}
for(const side of [-1,1])for(const x of [-7.7,-4.5,-1.3]){let b=box(x-.45,x+.45,side<0?-7.0:5.9,side<0?-6.35:6.65,BASE,4.8);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Oude Sint-Willibrorduskerk Middelbeers",origin:ORIGIN,xAxis:X_AXIS,groundHeight:19.393,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0823100000001198"],description:"Middeleeuwse kruiskerk met lagere koorsluiting en hoge westtoren.",realWorld:{groundNapM:19.393,ahn5TopNapM:59.075,ridgeM:14.4},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0823100000001198","https://monumentenregister.cultureelerfgoed.nl/monumenten/31597","https://commons.wikimedia.org/wiki/Category:Oude_Sint-Willibrorduskerk,_Middelbeers","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-sint-willibrorduskerk-oost-west-en-middelbeers.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








