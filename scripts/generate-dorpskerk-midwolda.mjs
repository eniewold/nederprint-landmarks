import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="dorpskerk-midwolda";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[263451.5,579834.3],X_AXIS=[.9929,.1187],GROUND_NAP=2.838;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const octsolid=(x,y,r,z0,z1)=>prism(oct(x,y,r,0).map(v=>v.slice(0,2)),z0,z1);
// The broad hipped roof rises to a shallow central plateau measured in the DSM.
let nave=box(2.7,27.9,-5.35,12.35,BASE,15.55);nave=plane(nave,0,1.2,14.55);nave=plane(nave,0,-1.2,22.55);nave=plane(nave,1.2,0,8.35);nave=plane(nave,-1.2,0,45.43);
const tower=box(-3.5,2.8,-2.8,3.6,BASE,16.4);
const octagon=octsolid(-.35,.35,3.0,16.2,21.55);
// Octagonal bell stage, swept shoulder and smaller upper lantern with domed cap.
const eave=Manifold.hull([...oct(-.35,.35,3,21.1),...oct(-.35,.35,3.4,21.5)]);
const crown=Manifold.hull([...oct(-.35,.35,3.4,21.45),...oct(-.35,.35,1.65,22.85)]);
const lantern=octsolid(-.35,.35,1.65,22.8,25.55);
const dome=Manifold.hull([...oct(-.35,.35,1.65,25.5),...oct(-.35,.35,.48,26.15)]);
const supports=[];for(const x of [9.1,15.1,21.1])for(const side of [-1,1]){let s=box(x-.5,x+.5,side<0?-6.25:12.05,side<0?-5.05:13.25,BASE,6.8);s=plane(s,0,side<0?1:-1,side<0?13.05:19.05);supports.push(s);}
const pinnacles=[];for(const x of [6.1,24.8])for(const y of [.7,5.8]){pinnacles.push(octsolid(x,y,.55,15.0,16.2),Manifold.hull([...oct(x,y,.55,16.15),...oct(x,y,.46,18)]));}
let porch=box(11.9,15.6,12.2,15,BASE,5.5);porch=plane(porch,1.1,0,-10.2);porch=plane(porch,-1.1,0,20.05);
let church=Manifold.union([nave,tower,octagon,eave,crown,lantern,dome,porch,...supports,...pinnacles]);
const cuts=[];for(const x of [5.8,12,18.5,24])for(const s of [-1,1])cuts.push(box(x-.7,x+.7,s<0?-5.55:12.05,s<0?-5.05:12.55,2.1,6.6));
cuts.push(box(-3.8,-3.2,-.6,.7,BASE,3.2));
for(const side of [-1,1])cuts.push(box(side<0?-3.6:1.95,side<0?-2.6:3.0,-.35,1.05,18,20.8));
for(const s of [-1,1])cuts.push(box(-1.1,.5,s<0?-3.0:3.25,s<0?-2.45:3.8,18.5,20.1));
for(const s of [-1,1]) {cuts.push(box(-1.05,.35,s<0?-3.0:2.65,s<0?-2.05:3.7,18,20.8)); cuts.push(box(-.95,.25,s<0?-1.5:1.4,s<0?-.7:2.3,23.2,24.65));}
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Dorpskerk Midwolda",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1895100000015495"],description:"Brede zaalkerk met afgewolfd dak, vier pinakels, steunberen en toren met achtkante houten bovenbouw en lantaarn; details op printformaat vereenvoudigd.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1895100000015495","https://www.kerkmidwolda.nl/historie","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Midwolda","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-dorpskerk-midwolda.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


