import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-esch";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[148405,402523],X_AXIS=[.9798,.2];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip, dwarsschip en lager veelzijdig koor, ieder met eigen kapvlakken.
let nave=box(-14.2,8,-5.8,8.4,BASE,15.85);nave=plane(nave,0,1,14.55);nave=plane(nave,0,-1,17.15);
let cross=box(2.1,10.5,-10.4,10.1,BASE,18.85);cross=plane(cross,1.2,0,11.29);cross=plane(cross,-1.2,0,26.41);
let choir=prism([[10,-6.2],[16.8,-6.2],[19,-5],[20.2,-2.8],[19.8,-.4],[18.2,2],[10,2.5]],BASE,14.2);choir=plane(choir,0,1.0,16.05);choir=plane(choir,0,-1.0,12.35);choir=plane(choir,-1,0,33.8);
// Drie topgevels met dwarse kapjes aan beide zijden van het schip.
let wings=[];for(const x of [-10.4,-6.0,-1.6])for(const s of [-1,1]){let w=s<0?box(x-2,x+2,-7.7,-5.6,BASE,10.9):box(x-2,x+2,8.2,10.5,BASE,10.9);w=plane(w,1.0,0,10.9-x);w=plane(w,-1.0,0,10.9+x);wings.push(w)}
// Oude toren links van het front, met vierkant tentdak.
let tower=box(-18.1,-11.5,-8.5,-1.6,BASE,18.2);let roof=Manifold.cylinder(8.7,4.9,.64,4).rotate([0,0,45]).translate([-14.8,-5.05,18.1]);
// Klein traptorentje op de andere gevelhoek en dakruiter boven de viering.
let stair=Manifold.cylinder(14.1,1.4,1.4,8).translate([-13.5,7.3,BASE]);let stairRoof=Manifold.cylinder(2.1,1.4,.46,8).translate([-13.5,7.3,13.5]);
let lantern=Manifold.cylinder(2.1,1.1,1.1,8).translate([6.3,1.3,18.1]);let cap=Manifold.cylinder(1.5,1.1,.46,8).translate([6.3,1.3,20.15]);
// De twee ronde kapellen ter weerszijden van het koor zijn zichtbaar vanaf de achterzijde.
let roundChapels=[];for(const y of [-7,3.5]){roundChapels.push(Manifold.cylinder(8,1.6,1.6,16).translate([13,y,BASE]),Manifold.cylinder(2.2,1.6,.46,16).translate([13,y,7.4]))}
let butt=[];for(const x of [15,17.5])for(const y of [-6.5,1.8])butt.push(box(x-.45,x+.45,y,y+1.0,BASE,8.7));
let church=Manifold.union([nave,cross,choir,...wings,tower,roof,stair,stairRoof,lantern,cap,...roundChapels,...butt]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.0).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-10.4,-6,-1.6])for(const y of [-7.25,10.95])church=church.subtract(niche(x,y,2.8,1.7,5.4));
for(const y of [-9.95,10.55])church=church.subtract(niche(6.3,y,3.6,2.3,7.3));
for(const y of [-5.75,2.55])church=church.subtract(niche(16.5,y,3.5,1.3,4.8));
for(const a of [0,90,180])for(const dx of [-1.4,1.4])church=church.subtract(niche(dx,3.85,13,1.2,3.8).rotate([0,0,a]).translate([-14.8,-5.05,0]));
church=church.subtract(niche(0,.45,BASE,1.6,3.4).rotate([0,0,90]).translate([-18.1,-5.05,0]));
church=church.subtract(niche(0,.45,BASE,1.7,3.6).rotate([0,0,90]).translate([-14.2,1.3,0]));
let rose=Manifold.cylinder(1.0,1.7,1.7,24).rotate([0,90,0]).translate([-14.65,1.3,9.3]);church=church.subtract(rose);
for(const a of [0,90,180,270])church=church.subtract(niche(0,1.7,18.7,1.0,1.0).rotate([0,0,a]).translate([6.3,1.3,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Esch",origin:ORIGIN,xAxis:X_AXIS,groundHeight:7.452,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0788100000000402"],description:"Kruiskerk met oude toren naast de voorgevel, roosvenster en dakruiter.",realWorld:{groundNapM:7.452,ahn5TowerNapM:34.32,ahn5RoofNapM:26.3},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0788100000000402","https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Esch)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-esch.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








