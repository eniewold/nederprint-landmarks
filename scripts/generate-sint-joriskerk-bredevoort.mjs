import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-joriskerk-bredevoort";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[239586.25,440122.75],X_AXIS=[.9915,-.13];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Hoofdvolume met vijfzijdige oostelijke koorsluiting; de zijvleugels krijgen een eigen hellend dak.
const poly=[[-3.1,-4.6],[13.3,-4.6],[16.1,-1.8],[16.1,2.2],[13.7,5.5],[-2.9,5.3]];
let body=prism(poly,BASE,7.7), roof=prism(poly,7.65,18);
roof=plane(roof,0,-1.58,15.5);roof=plane(roof,0,1.48,15.5);roof=plane(roof,-1.35,0,34.0);
let south=box(5.9,13.3,-9.1,-4.4,BASE,3.6),sr=box(5.9,13.3,-9.1,-4.4,3.55,11);
sr=plane(sr,0,1.25,15.0);
let north=box(1.5,13.6,5.2,9.5,BASE,3.6),nr=box(1.5,13.6,5.2,9.5,3.55,11);
nr=plane(nr,0,-1.25,15.5);
// Leien klokkenhuis met achtzijdig ingesnoerde spits; kleine top fysiek verbreed voor de print.
let tower=box(-2.15,2.15,-1.9,2.5,11.2,21.4);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos((i+.5)*Math.PI/4),.3+r*Math.sin((i+.5)*Math.PI/4),z]);
let shoulder=Manifold.hull([...oct(3.0,21.3),...oct(1.8,24.1)]),spire=Manifold.hull([...oct(1.8,24),...oct(.55,32.05)]);
let church=Manifold.union([body,roof,south,sr,north,nr,tower,shoulder,spire]);
// Westelijke toegangsdeur en klein venster in de geveltop.
church=church.subtract(box(-3.3,-2.55,-.8,.8,BASE,3.25));
church=church.subtract(box(-3.3,-2.55,-.45,.45,8.3,10.1));
// Waar zichtbaar: hoge gotische nissen in de langsgevel en de koorsluiting.
for(const x of [1.5,4.2]) church=church.subtract(box(x-.62,x+.62,-4.8,-4.15,2.3,6.8));
church=church.subtract(box(15.55,16.25,-.5,.8,2.3,6.7));
for(const [x,y,angle] of [[14.7,-3.2,45],[14.9,3.85,-54]]) church=church.subtract(box(-.62,.62,-.5,.5,2.3,6.8).rotate([0,0,angle]).translate([x,y,0]));
// Geluidsopeningen in het klokkenhuis, blind uitgevoerd.
for(const y of [-1.95,2.2]) for(const x of [-1.2,.55])church=church.subtract(box(x,x+.8,y,y+.35,17.3,19.7));
for(const x of [-2.2,1.8]) church=church.subtract(box(x,x+.4,-.45,.65,17.3,19.7));
const parts=[["building:kerk",church]];
const META={name:"Sint Joriskerk Bredevoort",origin:ORIGIN,xAxis:X_AXIS,groundHeight:28.097,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0197100000014789"],description:"Bakstenen kerk met koorsluiting, lage zijvleugels en een vierkant klokkenhuis met ingesnoerde spits.",realWorld:{groundNapM:28.097},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0197100000014789","https://monumentenregister.cultureelerfgoed.nl/monumenten/6869","https://commons.wikimedia.org/wiki/Category:Sint-Joriskerk,_Bredevoort","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-joriskerk-bredevoort.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

