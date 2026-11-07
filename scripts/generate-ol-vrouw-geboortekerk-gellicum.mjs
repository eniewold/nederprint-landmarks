import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="ol-vrouw-geboortekerk-gellicum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[139091.5,432040],X_AXIS=[.97,.243];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Hoofdbeuk en driezijdig koor; noordbeuk met eigen lessenaarsdak.
const poly=[[1.2,-4.3],[23,-4.3],[25.4,-2.1],[25.7,1.3],[23.4,3.8],[1.2,3.4]];
let body=prism(poly,BASE,7.5),roof=prism(poly,7.45,16);roof=plane(roof,0,-1.65,13.95);roof=plane(roof,0,1.65,13.95);roof=plane(roof,-1.5,0,50.7);
let aisle=box(1.2,19.5,3.2,7.9,BASE,6.4),ar=box(1.2,19.5,3.2,7.9,6.35,13);ar=plane(ar,0,-1,14.3);
// Sacristie met dwarse kap aan de zuidgevel en het historische rechthuis tegen de toren.
let sac=box(14.9,19.5,-9.3,-4.1,BASE,5.1),sr=box(14.9,19.5,-9.3,-4.1,5.05,10);sr=plane(sr,-1.1,0,26.2);sr=plane(sr,1.1,0,-11.65);
let court=box(-8.2,-2,-2.5,2.6,BASE,5.6),cor=box(-8.2,-2,-2.5,2.6,5.55,10);cor=plane(cor,0,-1.1,8.45);cor=plane(cor,0,1.1,8.45);
let tower=box(-2.1,1.4,-2.7,3.4,BASE,19);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[-.35+r*Math.cos((i+.5)*Math.PI/4),.35+r*Math.sin((i+.5)*Math.PI/4),z]);
const shoulder=Manifold.hull([...oct(3.35,18.9),...oct(2,20.3)]),spire=Manifold.hull([...oct(2,20.25),...oct(.55,27)]);
let church=Manifold.union([body,roof,aisle,ar,sac,sr,court,cor,tower,shoulder,spire]);
// Vensters en portalen als blinde nissen, zodat het model zonder steun blijft.
const pointed=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.65],[0,h],[-w/2,h-.65]],0,.7).rotate([90,0,0]).translate([x,y,z]);
for(const x of [3.7,7.7,11.7])church=church.subtract(pointed(x,-3.85,2.7,1.3,4));
for(const x of [3.7,7.7,11.7,15.7])church=church.subtract(pointed(x,8.3,2.5,1.3,3.5));
church=church.subtract(box(25.25,25.85,-.65,.65,2.6,6.7));
for(const [x,y,angle] of [[24.3,-3.1,42],[24.5,2.55,-47]])church=church.subtract(box(-.65,.65,-.55,.55,2.6,6.7).rotate([0,0,angle]).translate([x,y,0]));
for(const x of [-1.4,.1])for(const y of [-2.85,3.05])church=church.subtract(box(x,x+.9,y,y+.5,15.5,18));
for(const y of [-1.5,.5])church=church.subtract(box(-2.25,-1.75,y,y+.9,15.5,18));
church=church.subtract(box(-8.35,-7.8,-.65,.65,BASE,2.5));
for(const y of [-1.6,.5])church=church.subtract(box(-8.35,-7.8,y,y+1,3.5,5.2));
for(const x of [1.8,5.8,9.8,13.8,18.8])church=Manifold.union([church,box(x-.45,x+.45,7.5,8.6,BASE,5.8)]);
for(const x of [2.2,6.5,10.7,14.5])church=Manifold.union([church,box(x-.45,x+.45,-5.3,-4.0,BASE,6.3)]);
const parts=[["building:kerk",church]];
const META={name:"O.L. Vrouw Geboortekerk Gellicum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.261,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0236100000007176"],description:"Tweebeukige kerk met koor, sacristie, toren en aangebouwd voormalig rechthuis.",realWorld:{groundNapM:3.261},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000007176","https://monumentenregister.cultureelerfgoed.nl/monumenten/16506","https://monumentenregister.cultureelerfgoed.nl/monumenten/16507","https://commons.wikimedia.org/wiki/Category:O.L._Vrouw_Geboortekerk,_Gellicum","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://regionaalarchiefrivierenland.nl/gellicum"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-ol-vrouw-geboortekerk-gellicum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

