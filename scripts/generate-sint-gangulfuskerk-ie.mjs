import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-gangulfuskerk-ie";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[202539,594031.6],X_AXIS=[0.98823,0.15299];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const poly=[[-1.3,-5.3],[27.8,-5.3],[31.6,-2.1],[31.6,2.8],[28,6],[-1.3,6]];
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const body=prism(poly,BASE,8.2);
const slope=(8.2-15.8)/5.65;
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
let roof=prism(poly,8.15,30); roof=plane(roof,0,slope,15.8-slope*.35); roof=plane(roof,0,-slope,15.8+slope*.35); roof=plane(roof,-1.35,0,58.2);
const tower=box(-3.7,1.1,-2,2.8,BASE,19.5);
const crown=Manifold.hull([[-4,-2.3,19.15],[1.4,-2.3,19.15],[1.4,3.1,19.15],[-4,3.1,19.15],[-4.4,-2.7,19.55],[1.8,-2.7,19.55],[1.8,3.5,19.55],[-4.4,3.5,19.55]]);
const tip=Manifold.hull([[-3.8,-2.1,19.5],[1.2,-2.1,19.5],[1.2,2.9,19.5],[-3.8,2.9,19.5],[-1.35,.4,34.4]]);
let church=Manifold.union([body,roof,tower,crown,tip]);
// Ingemetselde vensters en galmgaten als blinde nissen van circa 0,3 m.
for(const x of [10.1,16.4,22.7]) church=church.subtract(box(x-.65,x+.65,-5.4,-5,2.1,6.2));
for(const x of [6.5,21]) church=church.subtract(box(x-.5,x+.5,5.7,6.1,2.1,6.2));
// Entree in de zuidgevel; als blinde nis voor printbaarheid.
church=church.subtract(box(3,4.5,-5.4,-5,BASE,3.2));
church=church.subtract(box(-3.8,-3.35,-.3,1,BASE,3.1));
for(const x of [-2.5,-.3]) for(const side of [-1,1]) church=church.subtract(box(x-.45,x+.45,side<0?-2.1:2.5,side<0?-1.7:2.9,15.8,18.4));
for(const y of [-.7,1.5]) church=church.subtract(box(-3.8,-3.35,y-.45,y+.45,15.8,18.4));
const parts=[["building:kerk",church]];
const META={name:"Sint Gangulfuskerk Ie",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.909,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0058100000204531"],description:"Middeleeuwse zaalkerk met driezijdige koorsluiting, zadeldak en negentiende-eeuwse westtoren met spits; lokale X langs de as oostwaarts.",realWorld:{groundNapM:3.909},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000204531","https://monumentenregister.cultureelerfgoed.nl/monumenten/31568","https://www.tsjerkepaad.nl/overzicht-kerken/ee-tsjerke-op-de-terp","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-gangulfuskerk-ie.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

