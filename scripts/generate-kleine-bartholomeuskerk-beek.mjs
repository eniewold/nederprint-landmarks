import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kleine-bartholomeuskerk-beek";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// The local X axis follows the church from the western tower to the eastern apse.
const BASE=-.5,ORIGIN=[192071.8,426750],X_AXIS=[.995,.1],GROUND_NAP=18.428;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]];
let nave=box(2.55,10.7,-3.8,4.3,BASE,12);nave=plane(nave,0,-1.25,10.91);nave=plane(nave,0,1.25,10.29);
let choir=box(10.55,16.2,-2.9,3.5,BASE,11);choir=plane(choir,0,-1.1,9.23);choir=plane(choir,0,1.1,8.57);
let apse=prism([[16.1,-2.9],[19.15,-2.25],[20.7,-.83],[20.6,1.44],[19.1,3.12],[16.1,3.35]],BASE,10);apse=plane(apse,0,-1.1,9.23);apse=plane(apse,0,1.1,8.57);apse=plane(apse,-1,0,27);
const tower=box(-2.5,2.9,-2.8,2.8,BASE,14.1), cap=Manifold.hull([...sq(2.7,14.05),...sq(.45,19.3)]);
let annex=box(16,19.2,-5,-2.5,BASE,6);annex=plane(annex,0,-1,1.4);annex=plane(annex,0,1,8.6);
// A single stepped silhouette extruded through the wall thickness, with no horizontal stacked layers.
function gable(x,z,half){const pts=[[-half,5],[-half,6],[-half*.8,6],[-half*.8,7],[-half*.6,7],[-half*.6,8],[-half*.4,8],[-half*.4,9],[-half*.2,9],[-half*.2,z],[half*.2,z],[half*.2,9],[half*.4,9],[half*.4,8],[half*.6,8],[half*.6,7],[half*.8,7],[half*.8,6],[half,6],[half,5]];return Manifold.extrude(new CrossSection([pts.reverse()]),.95).transform([0,1,0,0,0,0,1,0,1,0,0,0,x,0,0,1]);}
let church=Manifold.union([nave,choir,apse,tower,cap,annex,gable(10.15,11.2,3.75),gable(15.65,9.65,3.1)]);
const cuts=[];for(const x of [4.8,8.2])for(const side of [-1,1]){const y0=side<0?-4.2:4.0,y1=side<0?-3.5:4.7;cuts.push(box(x-.55,x+.55,y0,y1,2,4.5));cuts.push(Manifold.cylinder(y1-y0,.55,.55,20).rotate([90,0,0]).translate([x,y1,4.5]));}
for(const y of [-1,1])cuts.push(box(-2.8,-2.2,y-.4,y+.4,10.8,13.2));
for(const x of [-1,1])for(const side of [-1,1])cuts.push(box(x-.4,x+.4,side<0?-3:-2.8+5.3,side<0?-2.5:3,10.8,13.2));
cuts.push(box(-2.8,-2.2,-.55,.55,BASE,2.7));church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Kleine Bartholomeuskerk Beek",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0282100000000932"],description:"Kerk met westtoren en piramidedak, twee trapgevels, lager koor en driezijdige sluiting. Geveldetails en hoogten van de trapgevels zijn geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0282100000000932","https://commons.wikimedia.org/wiki/Category:Bartholome%C3%BCs,_Beek_(Ubbergen)","https://allesover024.nl/monument/toren-van-de-kleine-bartholomeus-beek-35807/","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kleine-bartholomeuskerk-beek.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


