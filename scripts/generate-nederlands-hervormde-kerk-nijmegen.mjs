import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[184164.8,427478.3],X_AXIS=[.9777,-.21];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Driebeukig schip met twee lagere zijkappen, driezijdig koor en portaal.
const koor=[[17,-3.3],[20.5,-3.3],[22.5,-1.3],[22.5,1.4],[20.5,3.4],[17,3.4]];
let roof=(poly,z,peak,k)=>{let s=prism(poly,z,peak+.1);s=plane(s,0,k,peak);s=plane(s,0,-k,peak);return s};
let core=box(2.5,18,-3.3,3.3,BASE,8.6),center=roof([[2.5,-3.3],[18,-3.3],[18,3.3],[2.5,3.3]],8.55,12.4,1.15);
let choir=prism(koor,BASE,8.5),choirRoof=roof(koor,8.45,12.35,1.15);choirRoof=plane(choirRoof,-1,0,33.5);
let wings=[];for(const y of [-6.8,3.15]){wings.push(box(2.5,18,y,y+3.5,BASE,5.8));let r=box(2.5,18,y,y+3.5,5.75,10);r=plane(r,0,y<0?.9:-.9,y<0?11.9:11.9);wings.push(r)}
let tower=box(-2.9,2.8,-3.3,3.2,BASE,17.6),portal=box(3.7,6.9,-8.1,-6.7,BASE,4.1);
let portalRoof=plane(box(3.7,6.9,-8.1,-6.7,4,5.6),0,.6,9.1);
const shoulder=Manifold.hull([[-2.9,-3.3,17.5],[2.8,-3.3,17.5],[2.8,3.2,17.5],[-2.9,3.2,17.5],[-1.8,-2.1,19.2],[1.7,-2.1,19.2],[1.7,2,19.2],[-1.8,2,19.2]]);
const tip=Manifold.hull([[-1.8,-2.1,19.1],[1.7,-2.1,19.1],[1.7,2,19.1],[-1.8,2,19.1],[-.5,-.5,35.8],[.5,-.5,35.8],[.5,.5,35.8],[-.5,.5,35.8]]);
let church=Manifold.union([core,center,choir,choirRoof,...wings,tower,portal,portalRoof,shoulder,tip]);
const pointed=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]],0,.75).rotate([90,0,0]).translate([x,y,z]);
for(const x of [4.4,7.7,11.1,14.5,17])for(const y of [-6.3,7.05])church=church.subtract(pointed(x,y,2.1,1.15,3.4));
for(const x of [-1.15,.55])for(const y of [-2.8,3.55])church=church.subtract(pointed(x,y,14.5,.75,2.4));
church=church.subtract(box(-3.1,-2.55,-.7,.7,BASE,2.6));
for(const y of [-1.3,.45])church=church.subtract(prism([[y,14.5],[y+.8,14.5],[y+.8,16.1],[y+.4,16.7],[y,16.1]],0,.65).rotate([90,0,0]).rotate([0,0,90]).translate([-3.05,0,0]));
church=church.subtract(box(22.05,22.7,-.6,.6,2.6,6.1));
for(const [x,y,angle] of [[21.55,-2.35,45],[21.55,2.4,-45]])church=church.subtract(box(-.65,.65,-.55,.55,2.6,6.1).rotate([0,0,angle]).translate([x,y,0]));
for(const x of [7.8,11.1,14.5,17.7])for(const y of [-7,6.25])church=Manifold.union([church,box(x-.45,x+.45,y,y+.75,BASE,4.3)]);
const parts=[["building:kerk",church]];
const META={name:"Nederlands Hervormde Kerk Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:9.231,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0268100000045592"],description:"Witte kerkje van Neerbosch met driebeukig schip, koorsluiting en toren met naaldspits.",realWorld:{groundNapM:9.231,ahnTopNapM:45.072},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000045592","https://monumentenregister.cultureelerfgoed.nl/monumenten/31205","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_kerk_Neerbosch","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0157.php"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nederlands-hervormde-kerk-nijmegen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));




