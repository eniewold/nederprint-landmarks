import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-deurne";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[183340,386232],X_AXIS=[.8,.6];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en vijfzijdig gesloten koor met doorgaande zadeldakken.
let nave=box(-18,25,-5.8,5.4,BASE,27.4);nave=plane(nave,0,1.2,27.64);nave=plane(nave,0,-1.2,27.16);
let choir=prism([[24.8,-5.8],[27.6,-4.2],[29.2,-1.2],[27.6,2.8],[24.8,5.4]],BASE,27.4);choir=plane(choir,0,1.2,27.64);choir=plane(choir,0,-1.2,27.16);choir=plane(choir,-1.2,0,61.2);
// Lage zijbeuken onder lessenaarsdaken.
let aisles=[];for(const s of [-1,1]){let a=s<0?box(-18,3,-11.5,-5.7,BASE,15.2):box(-18,3,5.3,10.9,BASE,15.2);a=s<0?plane(a,0,.65,19):plane(a,0,-.65,18.7);aisles.push(a)}
// Dwarsschip met topgevels en steile dwarskap.
let cross=box(2,14,-14.2,13.9,BASE,26.2);cross=plane(cross,1.25,0,16.2);cross=plane(cross,-1.25,0,36.2);
// Lage kapellen aan weerszijden van het koor.
let chapels=[];for(const s of [-1,1]){let a=s<0?box(14,24,-13.7,-5.5,BASE,12.0):box(14,24,5.2,13.8,BASE,12.0);a=plane(a,1.0,0,-5);a=plane(a,-1.0,0,33);chapels.push(a)}
// Oude westtoren en de twee kortere geveltorens uit 1882.
let tower=box(-27,-17,-5.6,5.2,BASE,31.1);
let spire=Manifold.cylinder(26.5,4.2,.46,8).translate([-22,-.2,31.0]);
let turrets=[];for(const y of [-8.1,7.6]){let a=box(-26,-18,y-3,y+3,BASE,18.8);let roof=Manifold.cylinder(4.1,4.24,.64,4).rotate([0,0,45]).translate([-22,y,18.7]);turrets.push(a,roof)}
// Traptorentje naast de noordelijke transeptgevel.
let stair=Manifold.cylinder(19,1.3,1.3,8).translate([2.3,11.8,BASE]);let stairRoof=Manifold.cylinder(3.2,1.3,.46,8).translate([2.3,11.8,18.4]);
let butt=[];for(const x of [-16,-11,-6,-1])for(const y of [-11.9,10.5])butt.push(box(x-.5,x+.5,y,y+1.0,BASE,11.6));
let church=Manifold.union([nave,choir,...aisles,cross,...chapels,tower,spire,...turrets,stair,stairRoof,...butt]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.0).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-14,-9,-4,1])for(const y of [-11.05,11.35])church=church.subtract(niche(x,y,3.5,1.5,7.0));
for(const x of [-14,-9,-4,1])for(const y of [-5.35,5.85])church=church.subtract(niche(x,y,14,1.4,4.5));
for(const y of [-13.75,14.35])church=church.subtract(niche(8,y,4,3.2,13));
for(const x of [17,21])for(const y of [-13.25,14.25])church=church.subtract(niche(x,y,2.6,1.3,4.3));
for(const y of [-5.15,5.65])for(const x of [16,20,24])church=church.subtract(niche(x,y,9,1.5,10));
for(const z of [22,26])for(const a of [0,90,180])for(const dx of [-1.3,1.3])church=church.subtract(niche(dx,5.9,z,1.15,3.4).rotate([0,0,a]).translate([-22,-.2,0]));
for(const y of [-8.1,7.6])church=church.subtract(niche(y,.45,3,1.5,6).rotate([0,0,90]).translate([-26,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Deurne",origin:ORIGIN,xAxis:X_AXIS,groundHeight:26.434,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0762100000018832"],description:"Gotische kruisbasiliek met westtoren, vijfzijdig koor en twee lage geveltorens.",realWorld:{groundNapM:26.434,ahn5RoofNapM:53.8,ahn5TowerNapM:84.06},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0762100000018832","https://monumentenregister.cultureelerfgoed.nl/monumenten/12372","https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Deurne)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-deurne.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








