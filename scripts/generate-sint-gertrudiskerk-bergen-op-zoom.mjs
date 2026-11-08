import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-gertrudiskerk-bergen-op-zoom";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[78694,390066],X_AXIS=[.99755,-.07];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Westelijk kerkdeel met thans vlakke kap; twee monumentale dwarsdelen.
let hall=box(-35.5,-.8,-19.5,17,BASE,16.0);
let cross=box(-.9,10,-24.6,23.1,BASE,24.6);cross=plane(cross,1.45,0,24.6-1.45*4.55);cross=plane(cross,-1.45,0,24.6+1.45*4.55);
let nave=box(-1,20.4,-6.2,6.2,BASE,24.6);nave=plane(nave,0,1.35,24.6);nave=plane(nave,0,-1.35,24.6);
let middle=box(9.8,20.4,-14.2,19.4,BASE,12.0);
let east=box(20.2,29,-26.6,26.5,BASE,15.3);
let edge=box(28.7,32.3,24.6,27.3,BASE,8);
// Peperbus: middeleeuwse vierkante toren en achthoekige koepelbekroning.
let tower=box(-36.6,-23.8,-7.5,6.5,BASE,35.0);
let clock=Manifold.cylinder(13.5,5.0,5.0,8).translate([-30.2,-.5,34.9]);
let dome=Manifold.cylinder(3.5,5.0,2.0,8).translate([-30.2,-.5,48.3]);
let lantern=Manifold.cylinder(7.0,2.0,2.0,8).translate([-30.2,-.5,51.7]);
let crown=Manifold.cylinder(3.5,2.0,.47,8).translate([-30.2,-.5,58.6]);
let church=Manifold.union([hall,cross,nave,middle,east,edge,tower,clock,dome,lantern,crown]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.1).rotate([90,0,0]).translate([x,y,z])};
// Grote spitsboogvensters in de westelijke zijgevels.
for(const x of [-20,-14,-8])for(const y of [-19.0,17.5])church=church.subtract(niche(x,y,3,2.2,8));
// Hoog venster in beide kopgevels van het dwarsschip.
for(const y of [-24.1,23.6])church=church.subtract(niche(4.55,y,4,4.0,13));
for(const z of [22,29])for(const a of [0,90,180,270]){let n=niche(0,7.35,z,2.1,5).rotate([0,0,a]).translate([-30.2,-.5,0]);church=church.subtract(n)}
for(const a of [0,90,180,270]){let n=niche(0,5.1,37,2.2,8).rotate([0,0,a]).translate([-30.2,-.5,0]);church=church.subtract(n)}
for(const y of [-22,-16,-10,-4,4,10,16,22])church=church.subtract(niche(0,0,3.5,1.8,7).rotate([0,0,-90]).translate([29.4,y,0]));
for(const x of [-23,-17,-11,-5])for(const s of [-1,1]){let b=box(x-.55,x+.55,s<0?-20.2:16.8,s<0?-19.3:17.7,BASE,10.5);b=plane(b,0,s<0?1:-1,s<0?30.7:28.2);church=church.add(b)}
for(const x of [20.6,28.2])for(const s of [-1,1]){let b=box(x-.6,x+.6,s<0?-28.5:26.3,s<0?-26.3:27.6,BASE,10.2);b=plane(b,0,s<0?1:-1,s<0?38.5:37.8);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Sint-Gertrudiskerk Bergen op Zoom",origin:ORIGIN,xAxis:X_AXIS,groundHeight:9.948,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0748100000009084"],description:"Grote historische kerk met twee dwarsdelen en de Peperbus als torenbekroning.",realWorld:{groundNapM:9.948,ahn4TopNapM:69.25,ahn5TopNapM:71.23,towerM:62.1},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0748100000009084","https://monumentenregister.cultureelerfgoed.nl/monumenten/9116","https://misrooster.nl/kerk/bergen-op-zoom/grote-of-st-gertrudiskerk","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-gertrudiskerk-bergen-op-zoom.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








