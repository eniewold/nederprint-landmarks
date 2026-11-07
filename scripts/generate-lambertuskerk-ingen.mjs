import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="lambertuskerk-ingen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the axis from the embedded western tower to the eastern choir.
const BASE=-.5,ORIGIN=[161783,441250.5],X_AXIS=[.98545,-.16998],GROUND_NAP=7.781;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// Pseudobasilical nave under one roof; the narrower choir is visibly higher.
let nave=box(-3,19.8,-8.3,8.2,BASE,16);nave=plane(nave,0,-1,15.8);nave=plane(nave,0,1,15.8);
let choir=prism([[19.5,-4.7],[26.8,-4.5],[29.4,-3.6],[30.7,1.2],[29.4,3.6],[26.9,4.4],[19.5,4.6]],BASE,19);choir=plane(choir,0,-1.35,18.0);choir=plane(choir,0,1.35,18.0);choir=plane(choir,-1.35,0,58.1);
let chapel=box(19.5,26.8,-8.5,-4.4,BASE,12);chapel=plane(chapel,0,-1,3.8);chapel=plane(chapel,0,1,16.7);
// A square belfry with a splayed foot and narrow octagonal needle spire.
const tower=box(-3,3,-3.1,3.1,BASE,21.2);
const shoulder=Manifold.hull([...sq(0,0,3.1,21.15),...oct(0,0,1.9,22.35)]);
const spire=Manifold.hull([...oct(0,0,1.9,22.3),...oct(0,0,.45,32.12)]);
const supports=[];for(const x of [-1.8,3,8,13.5,18.8])for(const sign of [-1,1]){let y0=sign<0?-9.1:8,y1=sign<0?-8:9;let s=box(x-.45,x+.45,y0,y1,BASE,7);s=plane(s,0,sign<0?1:-1,sign<0?15.8:15.8);supports.push(s);}
let church=Manifold.union([nave,choir,chapel,tower,shoulder,spire,...supports]);
const cuts=[];for(const x of [1,5.3,10.2,15.8])for(const sign of [-1,1]){let y0=sign<0?-8.6:7.95,y1=sign<0?-8.05:8.5;cuts.push(box(x-.65,x+.65,y0,y1,2.3,6.1));}
for(const x of [21.5,24.5])cuts.push(box(x-.55,x+.55,-8.8,-8.25,2.3,5));
for(const y of [-1.2,1.2])cuts.push(box(-3.3,-2.7,y-.4,y+.4,17.6,20));
for(const x of [-1.2,1.2])for(const sign of [-1,1])cuts.push(box(x-.4,x+.4,sign<0?-3.4:2.8,sign<0?-2.8:3.4,17.6,20));
cuts.push(box(-3.3,-2.7,-.6,.6,BASE,2.7));church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Lambertuskerk Ingen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0214100000008348"],description:"Pseudobasiliek met ingebouwde westtoren, lager schip, hoger vijfzijdig koor en zuidkapel. Spits en geveldetails geschat naar foto's en AHN.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0214100000008348","https://monumentenregister.cultureelerfgoed.nl/monumenten/25843","https://commons.wikimedia.org/wiki/Category:Lambertuskerk,_Ingen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-lambertuskerk-ingen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


