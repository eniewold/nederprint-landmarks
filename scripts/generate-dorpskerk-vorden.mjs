import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="dorpskerk-vorden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[218452.5,457700.8],X_AXIS=[.9975,-.071];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,e,r)=>{let z=box(a,b,c,d,e-.05,r),m=(c+d)/2,k=(r-e)/((d-c)/2);return plane(plane(z,0,k,r-k*m),0,-k,r+k*m)};
// Hoofdbeuk met driezijdige koorsluiting en afgeschuinde dakvlakken.
let solids=[box(2.8,31.6,-4.7,4.7,BASE,10.35),gable(2.8,31.6,-4.7,4.7,10.3,17.95),prism([[31.4,-4.7],[34.9,-2.1],[35.4,1.6],[32,4.7],[31,4.7]],BASE,10.3)];
let choir=box(31.3,35.4,-4.7,4.7,10.25,18);choir=plane(choir,0,1.62,18);choir=plane(choir,0,-1.62,18);choir=plane(choir,-1.85,0,76.1);solids.push(choir);
// Noordbeuk heeft eigen schilddak met nok evenwijdig aan het schip.
solids.push(box(3,24.6,4.3,12.05,BASE,8.35));let side=gable(3,24.6,4.3,12.05,8.3,15);side=plane(side,1.5,0,4.2);side=plane(side,-1.5,0,45.3);solids.push(side);
// Lage bijbouw aan het oosteinde van de noordbeuk.
solids.push(box(24.4,29,5.5,12,BASE,4.2),gable(24.4,29,5.5,12,4.15,8.4));
// Torenschacht en ingesnoerde achtzijdige naald, met schuine voet.
solids.push(box(-3.2,3.1,-3.6,3.5,BASE,22.6));
let shoulder=Manifold.hull([[-3.2,-3.6,22.55],[3.1,-3.6,22.55],[3.1,3.5,22.55],[-3.2,3.5,22.55],[-2.95,-2.95,24.2],[2.95,-2.95,24.2],[2.95,2.95,24.2],[-2.95,2.95,24.2]]);solids.push(shoulder,Manifold.cylinder(19.8,3.1,.45,8,false).rotate([0,0,22.5]).translate([0,0,24.1]));
// Regelmatige steunberen, kleine terugliggende gotische ramen en ingang.
for(const x of [3,10,17,22.5,27,31])for(const y of [-5.6,11.8]){if(y>0 && x>22.5)continue;const yo=y<0?-4.5:12.5;solids.push(box(x,x+.9,Math.min(y,yo),Math.max(y,yo),BASE,7.7));}
let church=Manifold.union(solids);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.45).rotate([90,0,0]).translate([x,y,z])};
for(const x of [6.5,13.5,19.5,24.7,29])church=church.subtract(arch(x,-4.55,2.8,1.5,4));
for(const x of [6.5,13.5,19.5])church=church.subtract(arch(x,12.2,2.8,1.5,4));
church=church.subtract(arch(0,0,1,1.6,3).rotate([0,0,90]).translate([-3.3,0,0]));
for(const z of [9.5,14.5,19])church=church.subtract(arch(0,0,z,1.1,2).rotate([0,0,90]).translate([-3.3,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Dorpskerk Vorden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:12.923,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1876100000016214"],description:"Tweebeukige dorpskerk met driezijdig koor en middeleeuwse toren met naaldspits.",realWorld:{groundNapM:12.923,publishedTowerHeightM:44,publishedTowerAndWeathervaneM:46,ahnTopNapM:57.7},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1876100000016214","https://monumentenregister.cultureelerfgoed.nl/monumenten/38120","https://commons.wikimedia.org/wiki/Category:Antoniuskerk,_Vorden","https://pgvorden.nl/kerk-in-vorden/historie-dorpskerk","https://geldersekerken.nl/flipbook/Venster%202025-1/PDF.pdf","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-dorpskerk-vorden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








