import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kloosterkerk-thesinge";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.4,ORIGIN=[239231.4,587559.5],X_AXIS=[.9998,.017],GROUND_NAP=.047;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
// Rectangular nave with hipped west end and a rounded, half-conical apse.
let nave=box(0,15,-5.5,5.5,BASE,14.8);nave=plane(nave,0,1.2,14.8);nave=plane(nave,0,-1.2,14.8);nave=plane(nave,1.2,0,8.2);
const arc=Array.from({length:13},(_,i)=>{const a=-Math.PI/2+i*Math.PI/12;return[14.8+5.5*Math.cos(a),5.5*Math.sin(a)]});
const apse=prism([[14.6,-5.5],...arc,[14.6,5.5]],BASE,8.2);
const apseRoof=Manifold.hull([...arc.map(([x,y])=>[x,y,8.15]),[14.75,-.02,14.8],[14.75,.02,14.8],[14.8,0,14.78]]);
// Compact square open belfry represented as a solid with print-safe recesses.
const base=box(8.7,11.2,-1.25,1.25,13.7,16);
const lantern=box(8.8,11.1,-1.15,1.15,15.9,17.7);
const eave=Manifold.hull([...sq(9.95,0,1.15,17.65),...sq(9.95,0,1.45,17.95)]);
const dome=Manifold.hull([...sq(9.95,0,1.45,17.9),...sq(9.95,0,.46,19.2)]);
let dormer=box(2.1,3.2,-.6,.6,9.4,12.2);dormer=plane(dormer,1.2,0,9.55);
let church=Manifold.union([nave,apse,apseRoof,base,lantern,eave,dome,dormer]);
const cuts=[];for(const x of [4.5,8,11.5,14.8])for(const side of [-1,1])cuts.push(box(x-.5,x+.5,side<0?-5.7:5.15,side<0?-5.15:5.7,2.6,5.8));
for(const angle of [-60,-30,0,30,60])cuts.push(box(5.05,5.8,-.5,.5,3.1,6.6).rotate([0,0,angle]).translate([14.8,0,0]));
cuts.push(box(-.25,.25,-.65,.65,BASE,2.9));for(const side of [-1,1])cuts.push(box(9.4,10.5,side<0?-1.35:.85,side<0?-.85:1.35,16.15,17.35));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Kloosterkerk Thesinge",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0009100007678907"],description:"Overgebleven koor van de kloosterkerk met halfronde sluiting, schilddak en kleine houten dakruiter.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0009100007678907","https://www.groningerkerken.nl/downloads/sogk_folder_kerk_thesinge.pdf","https://commons.wikimedia.org/wiki/Category:Kloosterkerk,_Thesinge","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kloosterkerk-thesinge.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


