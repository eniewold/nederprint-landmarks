import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-janskluis-geleen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X langs de kluis naar de driezijdige sluiting en de dakruiter.
const BASE=-.5,ORIGIN=[186309.225,330142.375],X_AXIS=[.392,.920];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Voetafdruk BAG, doorlopend zadeldak en schilden op de driezijdige sluiting.
let building=prism([[0,-2.52],[13.93,-2.52],[15.05,-1.44],[15.02,1.43],[13.95,2.54],[0,2.52]],BASE,8.45);
building=plane(building,0,1.10,8.45);building=plane(building,0,-1.10,8.45);building=plane(building,-1.10,0,24.5);building=plane(building,1.20,0,5.45);
// De met leien beklede klokkenstoel sluit aan op het dak; spits ingesnoerd.
const turret=box(12.1,14.25,-1.05,1.05,7.1,10.0);
const pts=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
const eave=Manifold.hull([...pts(12.1,14.25,-1.05,1.05,9.65),...pts(11.88,14.47,-1.27,1.27,9.95)]);
const spire=Manifold.hull([...pts(11.88,14.47,-1.27,1.27,9.95),...pts(12.72,13.63,-.45,.45,11.45)]);
let church=Manifold.union([building,turret,eave,spire]);
// Ondiepe rechthoekige gevelnisjes voor ramen en deur.
for(const x of [3.2,6.1,8.8,11])for(const y of [-2.75,2.35])church=church.subtract(box(x-.46,x+.46,y,y+.40,3.0,4.4));
// De zuidoostgevel toont drie lagere ramen, een deur en een hoger kapelraam.
for(const x of [1.6,3.3,5.0])church=church.subtract(box(x-.50,x+.50,-2.75,-2.35,0.85,2.8));
church=church.subtract(box(8.35,9.45,-2.75,-2.35,0.05,2.35));
church=church.subtract(box(11.8,13.05,-2.75,-2.35,2.5,4.55));
// Aan de tegenoverliggende gevel liggen de deur en het grotere raam naar de kapel.
church=church.subtract(box(9.1,10.2,2.35,2.75,0.05,2.35));
church=church.subtract(box(11.8,13.05,2.35,2.75,2.5,4.55));
const parts=[["building:kluis",church]];
const META={name:"Sint-Janskluis Geleen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:62.2,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1883100000039236"],description:"Bakstenen kluis met lang zadeldak, driezijdige sluiting en vierkante dakruiter met naaldspits.",realWorld:{groundNapM:62.2},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1883100000039236","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/16045","https://www.kerkgebouwen-in-limburg.nl/kerken/geleen/st-janskluis","https://commons.wikimedia.org/wiki/Category:Sint-Janskluis,_Geleen"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-janskluis-geleen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





