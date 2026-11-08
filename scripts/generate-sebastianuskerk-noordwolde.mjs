import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sebastianuskerk-noordwolde";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[235098,587918.5],X_AXIS=[.9987,.0516];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Middeleeuws schip met zadeldak en de korte verbindende travee.
let ship=box(3,34.1,-4.9,5.1,BASE,7.2),roof=box(3,34.1,-4.9,5.1,7.15,14.9);
roof=plane(roof,0,1.54,14.75);roof=plane(roof,0,-1.54,15.05);
let tower=box(-2.65,2.9,-2.9,2.6,BASE,21.5);
let connector=box(1.8,4,-4.9,5.1,BASE,7.1);
// De open balustrade wordt op printschaal een gesloten borstwering.
let parapet=box(-2.65,2.9,-2.9,2.6,21.45,22.35);
// Achtzijdige ui met afgeschuinde onderkant, met steile vlakken printbaar.
const onion=Manifold.revolve(new CrossSection([[[0,22.25],[1.35,22.25],[1.35,23.25],[2.15,24.2],[2.2,25.3],[1.8,26.1],[1.2,26.9],[.48,27.9],[0,27.9]]]),8);
let church=Manifold.union([ship,roof,tower,connector,parapet,onion]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [8.5,15,22,29.2])for(const y of [-4.55,5.45])church=church.subtract(arch(x,y,2.1,1.45,4.0));
for(const y of [-2.55,2.95])for(const x of [-1.1,.8])for(const z of [12.0,17.1])church=church.subtract(arch(x,y,z,1.05,2.7));
for(const y of [-1.5,.8])for(const z of [12.0,17.1])church=church.subtract(arch(y,0,z,1.05,2.7).rotate([0,0,90]).translate([-2.75,0,0]));
for(const y of [-2.3,2.0])church=church.subtract(arch(y,0,2.1,1.4,3.8).rotate([0,0,-90]).translate([34.3,0,0]));
for(const x of [6.0,13,19.5,27,33.7])for(const y of [-5.35,5.0])church=Manifold.union([church,box(x-.48,x+.48,y,y+.5,BASE,6.6)]);
// Grote steunbeer met schuine voorzijde aan de zuidgevel.
let butt=Manifold.hull([[19.7,-7.5,BASE],[21.25,-7.5,BASE],[19.7,-4.8,BASE],[21.25,-4.8,BASE],[19.7,-4.8,8.8],[21.25,-4.8,8.8]]);church=Manifold.union([church,butt]);
church=church.subtract(arch(0,0,BASE,1.4,2.6).rotate([0,0,90]).translate([-2.8,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sebastianuskerk Noordwolde",origin:ORIGIN,xAxis:X_AXIS,groundHeight:.069,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0005100000003518"],description:"Romaans-gotische zaalkerk met toren, gedrongen uivormige bekroning en steunberen.",realWorld:{groundNapM:.069,ahnPeakNapM:30.27,ahnAdjacentNapM:28.26},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0005100000003518","https://monumentenregister.cultureelerfgoed.nl/monumenten/8731","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Noordwolde,_Groningen)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.orgelshogeland.nl/?page_id=1084"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sebastianuskerk-noordwolde.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





