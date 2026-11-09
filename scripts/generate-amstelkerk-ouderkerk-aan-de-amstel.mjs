// Willibrorduskerk Haringhuizen: zaalkerk en ingekorte toren als bouwdelen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="amstelkerk-ouderkerk-aan-de-amstel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[121916.4,478746.8],X_AXIS=[.981,.195];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Grieks kruis: twee elkaar kruisende volumes met afgeknotte topgevels.
let eastwest=box(-12.2,12.1,-5.9,6.2,BASE,17.84);eastwest=plane(eastwest,0,1,17.9);eastwest=plane(eastwest,0,-1,18.2);eastwest=plane(eastwest,1,0,28.4);eastwest=plane(eastwest,-1,0,28.3);
let northsouth=box(-6.1,5.9,-12.2,12.4,BASE,17.84);northsouth=plane(northsouth,1,0,17.75);northsouth=plane(northsouth,-1,0,17.55);northsouth=plane(northsouth,0,1,28.4);northsouth=plane(northsouth,0,-1,28.6);
let portal=box(-9.7,-6,-9,-5.6,BASE,8.0);portal=plane(portal,0,1,16.5);
// Dichte vierkante lantaarn op de kruising, met verdiept galmgat en gesloten top.
let base=box(-2.3,2.3,-2.3,2.3,16.4,19.2);
let lantern=box(-1.85,1.85,-1.85,1.85,19.0,24.8);
let roof=Manifold.cylinder(2.5,2.65,1.05,4).rotate([0,0,45]).translate([0,0,24.7]);
let point=Manifold.cylinder(2.2,1.05,.48,8).translate([0,0,27.1]);
let church=Manifold.union([eastwest,northsouth,portal,base,lantern,roof,point]);
const niche=(x,y,z,w,h)=>{let r=w/2;return prism([[-r,0],[r,0],[r,h-r],[0,h],[-r,h-r]],0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const rot of [0,90,180,270]){
 church=church.subtract(niche(0,12.6,4.1,1.8,6).rotate([0,0,rot]));
 church=church.subtract(Manifold.cylinder(.7,.75,.75,16).rotate([90,0,0]).translate([0,12.6,14.3]).rotate([0,0,rot]));
 church=church.subtract(niche(0,2.15,20.3,1.5,2.9).rotate([0,0,rot]));
}
// Geblokte hoeklisenen en ingangspartij als doorlopende printbare stroken.
for(const rot of [0,90,180,270]){for(const x of [-5.6,5.4])church=Manifold.union([church,box(x-.48,x+.48,11.8,12.65,BASE,11.6).rotate([0,0,rot])]);}
church=church.subtract(niche(0,12.6,BASE,1.5,2.5));
const parts=[["building:kerk",church]];
const META={name:"Amstelkerk Ouderkerk aan de Amstel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:.676,groundOffsetMetres:BASE,groundSamplePoints:[[-15,-8],[-8,-15],[8,-15],[15,-8]],replacesBuildings:["NL.IMBAG.Pand.0437100000001261"],description:"Classicistische kerk op Grieks kruis met centrale vierkante klokkenlantaarn.",realWorld:{groundNapM:.676,ahn5TowerNapM:30.13},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0437100000001261","https://monumentenregister.cultureelerfgoed.nl/monumenten/31968","https://commons.wikimedia.org/wiki/Category:Amstelkerk_(Ouderkerk)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-meeuwen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));









