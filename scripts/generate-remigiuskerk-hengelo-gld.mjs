import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="remigiuskerk-hengelo-gld";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the axis from the embedded western tower to the eastern choir.
const BASE=-.5,ORIGIN=[218328.2,451944.2],X_AXIS=[.92496,.38006],GROUND_NAP=13.48;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// Pseudobasilica: nave and aisles under one steep roof, plus polygonal choir.
let nave=box(-3.1,25,-8.9,10.9,BASE,21);nave=plane(nave,0,-1.02,20.62);nave=plane(nave,0,1.02,18.58);
let choir=prism([[24.8,-4.7],[28.3,-4.7],[31.6,-1.7],[31.6,2.6],[28.8,5.6],[24.8,5.6]],BASE,21);choir=plane(choir,0,-1.5,19.6);choir=plane(choir,0,1.5,19.6);choir=plane(choir,-1.5,0,63.5);
let sacristy=box(24.8,28.9,5.2,10.8,BASE,12);sacristy=plane(sacristy,0,-1,19);sacristy=plane(sacristy,0,1,3);
// Three-storey massive tower; the parish publishes a 65 m overall height.
const tower=box(-4.8,4.8,-4.7,5.2,BASE,35.8);
const shoulder=Manifold.hull([...sq(0,.25,5,35.75),...oct(0,.25,3.5,37.25)]);
const spire=Manifold.hull([...oct(0,.25,3.5,37.2),...oct(0,.25,.45,65)]);
const stair=Manifold.hull([...oct(3.7,5,1.25,BASE),...oct(3.7,5,1.25,19.5)]);
const stairRoof=Manifold.hull([...oct(3.7,5,1.25,19.45),...oct(3.7,5,.45,20.7)]);
const supports=[];for(const x of [1,5,9,13,17,21,24.2])for(const sign of [-1,1]){let y0=sign<0?-9.8:10.7,y1=sign<0?-8.7:11.8;let s=box(x-.45,x+.45,y0,y1,BASE,8.5);s=plane(s,0,sign<0?1:-1,sign<0?18:20);supports.push(s);}
let church=Manifold.union([nave,choir,sacristy,tower,shoulder,spire,stair,stairRoof,...supports]);
const cuts=[];for(const x of [2.8,6.8,10.8,14.8,18.8,22.7])for(const sign of [-1,1]){let y0=sign<0?-9.2:10.65,y1=sign<0?-8.65:11.2;cuts.push(box(x-.65,x+.65,y0,y1,2.5,7));}
for(const y of [-3,0,3]){cuts.push(box(-5.1,-4.5,y-.55,y+.55,14,26));cuts.push(box(-5.1,-4.5,y-.55,y+.55,27.5,34.5));}
for(const x of [-3,0,3])for(const sign of [-1,1]){let y0=sign<0?-5:4.9,y1=sign<0?-4.4:5.5;cuts.push(box(x-.5,x+.5,y0,y1,14,26));cuts.push(box(x-.5,x+.5,y0,y1,27.5,34.5));}
cuts.push(box(-5.1,-4.5,-.7,.7,BASE,3));church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Remigiuskerk Hengelo Gld",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1876100000010472"],description:"Laatgotische pseudobasiliek met doorlopend kerkdak, driezijdig koor en forse ingebouwde toren met naaldspits. Torenhoogte naar parochiebron; details geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1876100000010472","https://site.skgcollect.nl/216/pagina/2637/remigiuskerk.html","https://www.monumenten.nl/monument/21506","https://commons.wikimedia.org/wiki/Category:Remigiuskerk,_Hengelo","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-remigiuskerk-hengelo-gld.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


