import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="ceciliakerk-lekkum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[183847.5,582293],X_AXIS=[.99296,-.11840];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const poly=[[2,-4.3],[20.1,-4.3],[23.6,-2],[23.6,2.1],[20.2,4.4],[2,4.3]];
const body=prism(poly,BASE,6.35);
const slope=(6.35-12.25)/4.35;
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
let roof=prism(poly,6.3,30); roof=plane(roof,0,slope,12.25); roof=plane(roof,0,-slope,12.25); roof=plane(roof,-1.65,0,45.29);
const tower=box(-1.9,2.1,-2.3,2.3,BASE,15.7);
const crown=Manifold.hull([[-1.9,-2.3,15.2],[2.1,-2.3,15.2],[2.1,2.3,15.2],[-1.9,2.3,15.2],[-2.3,-2.7,15.6],[2.5,-2.7,15.6],[2.5,2.7,15.6],[-2.3,2.7,15.6]]);
const shoulder=Manifold.hull([[-2,-2.4,15.55],[2.2,-2.4,15.55],[2.2,2.4,15.55],[-2,2.4,15.55],[-1.3,-1.65,16.3],[1.5,-1.65,16.3],[1.5,1.65,16.3],[-1.3,1.65,16.3]]);
const tip=Manifold.hull([[-1.3,-1.65,16.25],[1.5,-1.65,16.25],[1.5,1.65,16.25],[-1.3,1.65,16.25],[.1,0,25.5]]);
let church=Manifold.union([body,roof,tower,crown,shoulder,tip]);
// Vensters en deuren in blinde nissen; een toegangsdeur in de zuidgevel.
for(const x of [7,11.5,16,21]) for(const side of [-1,1]) church=church.subtract(box(x-.65,x+.65,side<0?-4.4:4.05,side<0?-4.05:4.5,1.7,5.25));
church=church.subtract(box(3.2,4.6,-4.4,-4,BASE,3.3));
for(const side of [-1,1]) church=church.subtract(box(-.5,.7,side<0?-2.4:2,side<0?-2:2.4,12.4,14.6));
church=church.subtract(box(-2,-1.6,-.5,.7,12.4,14.6));
church=church.subtract(box(-2,-1.6,-.55,.55,2.2,8));
// Verticale hoeklisenen op de toren.
for(const x of [-1.9,1.5])for(const y of [-2.3,1.7])church=Manifold.union([church,box(x,x+.6,y,y+.6,BASE,15.2)]);
const parts=[["building:kerk",church]];
const META={name:"Ceciliakerk Lekkum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.195,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0080100000366579"],description:"Zaalkerk met driezijdige koorsluiting en westtoren met vierkante spits; lokale X langs het schip oostwaarts.",realWorld:{groundNapM:3.195},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000366579","https://monumentenregister.cultureelerfgoed.nl/monumenten/24513","https://www.ghardeman.nl/fotos600p/lekkum.htm","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-ceciliakerk-lekkum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

