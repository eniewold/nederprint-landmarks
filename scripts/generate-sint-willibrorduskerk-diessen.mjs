import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-diessen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[140290,387374],X_AXIS=[.9798,.2];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Driebeukig schip onder een ongedeelde kap.
let nave=box(-14.7,6.8,-8.7,6.6,BASE,17.4);nave=plane(nave,0,1,18.45);nave=plane(nave,0,-1,16.35);
// Lager dwarsschip en driezijdig gesloten koor.
let cross=box(5.6,14.2,-11.8,8.9,BASE,15.0);cross=plane(cross,1.1,0,4.11);cross=plane(cross,-1.1,0,25.89);
let choir=prism([[13.5,-6.4],[19.2,-6.4],[21.8,-3.8],[22.9,-.3],[21.1,2.4],[13.5,2.5]],BASE,12.5);choir=plane(choir,0,1.15,14.74);choir=plane(choir,0,-1.15,10.26);choir=plane(choir,-1,0,34.2);
// Voormalige sacristie onder eigen kap.
let chapel=box(5.8,14,-11.8,-8.5,BASE,8.8);chapel=plane(chapel,1,0,-.8);chapel=plane(chapel,-1,0,19.2);
// Vierkante westtoren, hoeksteunberen en achtkantige naald.
let tower=box(-22.5,-14.6,-6.2,3.9,BASE,34.5);
let spire=Manifold.cylinder(24.0,3.5,.46,8).translate([-18.55,-1.15,34.4]);
let butt=[];for(const x of [-22.9,-15.2])for(const y of [-6.7,3.4]){let b=box(x,x+1.2,y,y+1.2,BASE,28.5);butt.push(b)}
for(const x of [-12,-7,-2,3])for(const y of [-9.1,6.2])butt.push(box(x-.5,x+.5,y,y+1,BASE,7.4));
let church=Manifold.union([nave,cross,choir,chapel,tower,spire,...butt]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.0).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-10,-5,0,4])for(const y of [-8.25,7.05])church=church.subtract(niche(x,y,2.9,1.5,4.5));
for(const y of [-11.35,9.35])church=church.subtract(niche(9.8,y,3.0,2,6.0));
for(const y of [-5.95,2.95])for(const x of [16,19])church=church.subtract(niche(x,y,3,1.25,5));
for(const z of [13,21.5,28.5])for(const a of [0,90,180])for(const dx of [-1.3,1.3])church=church.subtract(niche(dx,5.3,z,1.1,4.5).rotate([0,0,a]).translate([-18.55,-1.15,0]));
church=church.subtract(niche(0,.45,BASE,1.7,3.2).rotate([0,0,90]).translate([-22.5,-1.15,0]));
church=church.subtract(niche(0,.45,4.2,1.8,5).rotate([0,0,90]).translate([-22.5,-1.15,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Diessen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.696,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0798100000006301"],description:"Driebeukige gotische kerk met laag dwarsschip, koor en rijke westtoren.",realWorld:{groundNapM:17.696,ahn5RoofNapM:35.17,ahn5TowerNapM:76.15},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0798100000006301","https://monumentenregister.cultureelerfgoed.nl/monumenten/12898","https://commons.wikimedia.org/wiki/Category:Willibrordus,_Diessen","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-diessen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








