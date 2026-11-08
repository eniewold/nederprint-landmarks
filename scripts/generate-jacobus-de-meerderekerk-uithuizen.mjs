import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="jacobus-de-meerderekerk-uithuizen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[240121,603177],X_AXIS=[-.239,-.971],GROUND_NAP=2.366;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// Nave, cross-wing, polygonal choir and the lower aisles have separate pitched roofs.
let nave=box(-.2,28,-4.5,4.5,BASE,19.45);nave=plane(nave,0,1,19.45);nave=plane(nave,0,-1,19.45);
let transept=box(16.7,25.5,-10,10.5,BASE,19.45);transept=plane(transept,1,0,-1.7);transept=plane(transept,-1,0,40.6);
let choir=prism([[25,-4.5],[31.6,-3.8],[35.3,-1.6],[35.5,2.5],[32.9,4.1],[25,4.5]],BASE,19.45);choir=plane(choir,0,1,19.45);choir=plane(choir,0,-1,19.45);choir=plane(choir,-1,0,51.05);
const aisles=[];for(const side of [-1,1]){let a=box(0,17.1,side<0?-8.9:4.1,side<0?-4:9.2,BASE,12);a=plane(a,0,side<0?-.7:.7,side<0?4.85:4.65);aisles.push(a);}
let sacristy=box(28,35.5,4,11.5,BASE,9);sacristy=plane(sacristy,0,1,1.5);sacristy=plane(sacristy,0,-1,16.5);
const tower=box(-2.6,2.1,-2.55,2.55,BASE,22.1);
const spire=Manifold.hull([...oct(-.25,0,2.55,22.0),...oct(-.25,0,.49,31.2)]);
const pinnacles=[];for(const x of [-1.9,1.45])for(const y of [-1.9,1.9])pinnacles.push(box(x-.47,x+.47,y-.47,y+.47,20.4,23),Manifold.hull([...sq(x,y,.47,22.95),...sq(x,y,.45,25.1)]));
const supports=[];for(const x of [3.2,7.5,12.2,16.7,25])for(const side of [-1,1]){let a=box(x-.48,x+.48,side<0?-9.8:8.8,side<0?-8.5:10.1,BASE,7);a=plane(a,0,side<0?1:-1,side<0?16.3:16.7);supports.push(a);}
let church=Manifold.union([nave,transept,choir,...aisles,sacristy,tower,spire,...pinnacles,...supports]);
const cuts=[];for(const x of [4.8,9.8,14.4])for(const side of [-1,1])cuts.push(box(x-.55,x+.55,side<0?-9.2:8.85,side<0?-8.6:9.45,2.4,5.5));
cuts.push(box(-2.85,-2.3,-.55,.55,BASE,3));for(const side of [-1,1])cuts.push(box(-1.2,.8,side<0?-2.8:2.2,side<0?-2.2:2.8,17.5,20.6));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Jacobus de Meerderekerk Uithuizen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1651100000004057"],description:"Neogotische kruiskerk met lagere zijbeuken, koor, sacristie en vierkant torentje met naaldspits en hoekpinakels.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000004057","https://liudgerparochie.nl/jacobus-de-meerderekerk-uithuizen/","https://commons.wikimedia.org/wiki/Category:Sint-Jacobus_de_Meerdere,_Uithuizen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-jacobus-de-meerderekerk-uithuizen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


