import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="heilige-remigiuskerk-duiven";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the axis from the medieval western tower to the eastern choir.
const BASE=-.5,ORIGIN=[198733.8,440291.2],X_AXIS=[.99295,-.11854],GROUND_NAP=11.472;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// Old nave and lower aisles.
let nave=box(-1,13,-4.3,4.7,BASE,16);nave=plane(nave,0,-1.4,15.9);nave=plane(nave,0,1.4,15.34);
let aisles=box(-1,12.8,-7.3,8.1,BASE,13);aisles=plane(aisles,0,-1,14.9);aisles=plane(aisles,0,1,14.1);
// Twin arms form the enlarged 1910 transept; each has a transverse ridge.
function cross(a,b){let s=box(a,b,-10.5,11.5,BASE,16);s=plane(s,-1.25,0,15.6+(a+b)*.625);s=plane(s,1.25,0,15.6-(a+b)*.625);return s;}
const transept1=cross(10.7,19.8),transept2=cross(19.7,30.5);
let choir=prism([[30,-5.8],[34,-5.8],[36.2,-3.9],[37,-1.7],[36.6,1.9],[34.2,4.5],[30,4.5]],BASE,16);choir=plane(choir,0,-1.25,15.6);choir=plane(choir,0,1.25,15.6);choir=plane(choir,-1,0,50.5);
let sacristy=box(27,35.8,-11.6,-7,BASE,11);sacristy=plane(sacristy,0,-1,0);sacristy=plane(sacristy,0,1,19);
// West tower with characteristic splayed foot and octagonal spire.
const tower=box(-3.6,3.3,-3.2,3.3,BASE,15.8);
const roofBase=Manifold.hull([...sq(-.15,.05,3.5,15.75),...oct(-.15,.05,2.6,17.1)]);
const spire=Manifold.hull([...oct(-.15,.05,2.6,17.05),...oct(-.15,.05,.45,34.13)]);
// Sacristy stair turret and crossing lantern, widened for a stable 1:1000 print.
const turret=Manifold.hull([...oct(27.8,-10.2,1.65,BASE),...oct(27.8,-10.2,1.65,15.6)]);
const turretRoof=Manifold.hull([...oct(27.8,-10.2,1.65,15.55),...oct(27.8,-10.2,.45,20.1)]);
const lantern=Manifold.hull([...oct(23.6,.4,1.0,14.5),...oct(23.6,.4,1,19.2),...oct(23.6,.4,.45,21.83)]);
let church=Manifold.union([nave,aisles,transept1,transept2,choir,sacristy,tower,roofBase,spire,turret,turretRoof,lantern]);
const cuts=[];for(const x of [2.2,6.5])for(const sign of [-1,1]){let y0=sign<0?-7.6:7.8,y1=sign<0?-7:8.4;cuts.push(box(x-.65,x+.65,y0,y1,2.2,5.8));}
for(const x of [13.3,17,22])for(const sign of [-1,1]){let y=sign<0?-10.5:11.5;cuts.push(box(x-.65,x+.65,y-.3,y+.3,3,9));}
for(const y of [-1.1,1.1])cuts.push(box(-3.9,-3.3,y-.45,y+.45,11.9,14.6));
for(const x of [-1.2,1])for(const sign of [-1,1])cuts.push(box(x-.4,x+.4,sign<0?-3.5:3,sign<0?-2.9:3.6,11.9,14.6));
cuts.push(box(-3.9,-3.3,-.55,.55,BASE,2.7));church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Heilige Remigiuskerk Duiven",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0226100000008388"],description:"Pseudobasilicale kerk met middeleeuwse westtoren, dubbel dwarsschip, koor, traptoren en dakruiter. Details geschat naar foto's en AHN.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0226100000008388","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/14175","https://commons.wikimedia.org/wiki/Category:Remigiuskerk,_Duiven","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-heilige-remigiuskerk-duiven.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1){console.log(pieces.map(p=>p.boundingBox()));throw new Error(`expected one connected component, got ${pieces.length}`);}
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





