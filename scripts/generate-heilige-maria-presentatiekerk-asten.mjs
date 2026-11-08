import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="heilige-maria-presentatiekerk-asten";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[179829,379349],X_AXIS=[.5593,.82896];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip, zijbeuken en dwarsschip met zelfstandige kappen.
let nave=box(-15,25,-6.6,6.6,BASE,28.7);nave=plane(nave,0,1.3,28.7);nave=plane(nave,0,-1.3,28.7);
let cross=box(-11.2,4.5,-16.5,16.5,BASE,28.7);cross=plane(cross,1.1,0,28.7+1.1*3.35);cross=plane(cross,-1.1,0,28.7-1.1*3.35);
let sides=[];for(const s of [-1,1]){let b=box(-10.8,25,s<0?-10.5:6.4,s<0?-6.4:10.9,BASE,18.7);b=plane(b,0,s<0?.7:-.7,26.1);sides.push(b)}
// Koor met driezijdige sluiting en lagere kapellen rondom het koor.
let choir=prism([[-27,-2],[-27,2],[-24,7.7],[-20,8.8],[-10.5,8.8],[-10.5,-8.8],[-20,-8.8],[-24,-7.7]].reverse(),BASE,24);choir=plane(choir,0,1.0,24);choir=plane(choir,0,-1.0,24);choir=plane(choir,1.0,0,49);
let chapels=[];for(const s of [-1,1])for(const [lo,hi] of [[-26.4,-18.6],[-18.6,-10.8]]){let b=box(lo,hi,s<0?-16.0:8.4,s<0?-8.4:16.3,BASE,15.8);let mid=(lo+hi)/2;b=plane(b,1,0,15.8-mid);b=plane(b,-1,0,15.8+mid);b=plane(b,0,s<0?.8:-.8,28.3);chapels.push(b)}
let end=box(-29,-24,-3,3,BASE,13.3);end=plane(end,0,1,13.3);end=plane(end,0,-1,13.3);end=plane(end,1,0,42.3);
let annex=prism([[4.2,-19.2],[10.5,-19.2],[10.5,-20],[18.7,-20],[18.7,-14.8],[4.2,-14.8]],BASE,11.5);annex=plane(annex,0,.8,27.5);
// Monumentale vierkante westtoren, klokgeleding, vier hoektorens en naald.
let tower=box(24.5,33.6,-3.6,4.4,BASE,42.5);
let clock=box(25.3,32.7,-2.8,3.6,42.4,51.5);
let spire=Manifold.cylinder(23.6,4.6,.47,4).rotate([0,0,45]).translate([29,.4,51.4]);
let pins=[];for(const x of [25.3,32.8])for(const y of [-2.8,3.6]){let p=Manifold.cylinder(12.5,.95,.95,8).translate([x,y,41.5]);let c=Manifold.cylinder(4.5,.95,.47,8).translate([x,y,53.9]);pins.push(p,c)}
let crossing=Manifold.cylinder(6,1.1,1.1,8).translate([-5.9,0,27.0]).add(Manifold.cylinder(9,1.1,.47,8).translate([-5.9,0,32.9]));
let church=Manifold.union([nave,cross,...sides,choir,...chapels,end,annex,tower,clock,spire,...pins,crossing]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.2).rotate([90,0,0]).translate([x,y,z])};
for(const x of [6,11,16,21])for(const y of [-10.0,11.3])church=church.subtract(niche(x,y,3,1.6,6.5));
// Groot portaal en de hoge torenvensters aan drie vrije zijden.
church=church.subtract(niche(0,0,BASE,3.5,5.5).rotate([0,0,-90]).translate([33.95,.4,0]));
for(const y of [-1.5,.5,2.5])church=church.subtract(niche(0,0,13,1.25,9).rotate([0,0,-90]).translate([33.95,y,0]));
for(const z of [29,44])for(const a of [0,90,270]){let n=niche(0,4.8,z,1.5,5).rotate([0,0,a]).translate([29,.4,0]);church=church.subtract(n)}
// Ronde vensternissen in de twee gevels van het dwarsschip.
for(const y of [-15.9,17.0])church=church.subtract(Manifold.cylinder(1.2,2.4,2.4,24).rotate([90,0,0]).translate([-5.9,y,17.2]));
for(const x of [4,9,14,19,23.5])for(const s of [-1,1]){let b=box(x-.5,x+.5,s<0?-11.1:10.3,s<0?-10.3:11.5,BASE,12);b=plane(b,0,s<0?1:-1,23.1);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Heilige Maria Presentatiekerk Asten",origin:ORIGIN,xAxis:X_AXIS,groundHeight:25.693,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0743100000001594"],description:"Driebeukige kruisbasiliek met kooromgang, dakruiter en 75 m hoge toren met vier hoektorens.",realWorld:{groundNapM:25.693,ahn4TopNapM:95.31,ahn5TopNapM:100.07,towerM:75},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0743100000001594","https://monumentenregister.cultureelerfgoed.nl/monumenten/8443","https://www.rkfranciscus.nl/docs/2016/Geschiedenis_Asten.pdf","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-heilige-maria-presentatiekerk-asten.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








