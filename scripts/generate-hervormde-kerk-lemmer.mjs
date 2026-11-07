import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-kerk-lemmer";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[176817,539787.2],X_AXIS=[.99990,.01396];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const navePoly=[[-.1,-5.4],[21.6,-5.5],[26.1,-2.8],[26.2,2.6],[21.4,5.5],[-.2,5.5]];
const northPoly=[[7.3,5.3],[18.2,5.3],[18.2,14],[15.9,18.3],[9.6,18.3],[7.3,14.1]];
const southPoly=[[7.6,-16],[13.9,-16],[14,-5.3],[7.6,-5.3]];
const body=prism(navePoly,BASE,6.7),north=prism(northPoly,BASE,6.7),south=prism(southPoly,BASE,5.4);
let naveRoof=prism(navePoly,6.65,25);naveRoof=plane(naveRoof,0,-1.34,13.99);naveRoof=plane(naveRoof,0,1.34,13.99);naveRoof=plane(naveRoof,-1.45,0,44.7);
let northRoof=prism(northPoly,6.65,25);northRoof=plane(northRoof,-1.34,0,31.08);northRoof=plane(northRoof,1.34,0,-3.1);northRoof=plane(northRoof,0,-1.7,37.8);
let southRoof=prism(southPoly,5.35,18);southRoof=plane(southRoof,-.75,0,15.85);southRoof=plane(southRoof,.75,0,-.2);southRoof=plane(southRoof,0,.75,17.4);
const tower=box(-2.1,2.6,-2.4,2.4,BASE,17.2);
const ledge=Manifold.hull([[-2.1,-2.4,16.8],[2.6,-2.4,16.8],[2.6,2.4,16.8],[-2.1,2.4,16.8],[-2.5,-2.8,17.2],[3,-2.8,17.2],[3,2.8,17.2],[-2.5,2.8,17.2]]);
const oct=(r,z0,z1)=>Manifold.cylinder(z1-z0,r,r,8).rotate([0,0,22.5]).translate([.25,0,z0]);
const drum=oct(2.3,17.15,21.6);
const upperRing=Manifold.hull([oct(2.3,21.45,21.5),oct(2.65,21.8,21.85)]);
let lantern=oct(2.2,21.75,26.0);
// Acht blinde spitsboognissen: op 1:1000 behoudt de lantaarn een stevige kern.
const arched=(angle)=>Manifold.extrude(new CrossSection([[[-.48,21.85],[.48,21.85],[.48,24.55],[0,25.1],[-.48,24.55]]]),.65).transform([1,0,0,0,0,0,1,0,0,-1,0,0,0,2.3,0,1]).rotate([0,0,angle]).translate([.25,0,0]);
for(const angle of [0,45,90,135,180,225,270,315])lantern=lantern.subtract(arched(angle));
const dome=Manifold.hull([oct(2.2,25.95,26),oct(1.8,27,27.05),oct(.7,27.65,27.7)]);
const finial=Manifold.cylinder(2.0,.45,.16,8).translate([.25,0,27.65]);
let church=Manifold.union([body,north,south,naveRoof,northRoof,southRoof,tower,ledge,drum,upperRing,lantern,dome,finial]);
// Deuren en vensters: blinde nissen met voldoende resterende wanddikte.
for(const x of [4,17.5,22])church=church.subtract(box(x-.6,x+.6,-5.6,-5.1,1.6,5.7));
for(const y of [7.5,11,14.5])for(const side of [-1,1])church=church.subtract(box(side<0?7.2:17.9,side<0?7.6:18.3,y-.6,y+.6,1.6,5.7));
church=church.subtract(box(-2.2,-1.8,-.75,.75,BASE,3));
church=church.subtract(box(-2.2,-1.8,-.55,.55,13.4,15.9));
const parts=[["building:kerk",church]];
const META={name:"Hervormde Kerk Lemmer",origin:ORIGIN,xAxis:X_AXIS,groundHeight:.384,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0082100000150807"],description:"Zaalkerk met driezijdige koorsluiting, noordelijke dwarsarm, zuidelijke aanbouw en half ingebouwde westtoren met open achtkante lantaarn.",realWorld:{groundNapM:.384},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0082100000150807","https://monumentenregister.cultureelerfgoed.nl/monumenten/25749","https://tsjerkepaad.nl/overzicht-kerken/lemmer-tsjerke-oan-it-dok","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-lemmer.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

