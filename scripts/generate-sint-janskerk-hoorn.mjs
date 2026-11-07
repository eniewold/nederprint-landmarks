import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-janskerk-hoorn";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[151968.6,601230.8],X_AXIS=[1,0],GROUND_NAP=3.393;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// BAG-plattegrond in assenstelsel van de nok: schip en vijfzijdig koor.
const poly=[[2.85,-4.4],[31.4,-4.4],[34,-3.6],[35.7,-1.3],[35.7,1.2],[34,3.3],[31.5,4.0],[2.85,4.0]];
const body=prism(poly,BASE,6.72);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// NAP 10.1 dakvoet en 14.7 nok, teruggerekend naar maaiveld.
const slope=(6.72-11.31)/4.2;
let roof=prism(poly,6.7,25);roof=plane(roof,0,slope,11.31+slope*.2);roof=plane(roof,0,-slope,11.31-slope*.2);roof=plane(roof,-1.1,0,46.1);
const tower=box(-3,3,-3.3,2.7,BASE,14.37);
// Foto: achtzijdige, ingesnoerde naaldspits op vierkante toren.
const oct=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;oct.push([2.5*Math.cos(a),-.3+2.5*Math.sin(a),14.30]);}
const tip=Manifold.hull([...oct,[0,-.3,27.75]]);
let church=Manifold.union([body,roof,tower,tip]);
// Blinde vensternissen en de toegang, aangezet aan de hand van foto's.
for(const x of [5.1,11.2,17.3,23.3,29.0])for(const y of [-1,1]){
 const c=box(x-.48,x+.48,y<0?-4.65:3.7,y<0?-4.1:4.25,2.0,5.55);church=church.subtract(c);
}
church=church.subtract(box(7.4,8.7,-4.72,-4.1,BASE,3.25));
// Vensters in de drie koorsluitingsvlakken, als blinde nissen.
church=church.subtract(box(35.35,36.1,-.55,.45,2.0,5.45));
for(const side of [-1,1]){
 const cut=box(-.65,.65,-.38,.38,2.0,5.45).rotate([0,0,side*55]).translate([34.75,side*2.35,0]);
 church=church.subtract(cut);
}
for(const side of [-1,1])church=church.subtract(box(-.52,.52,side<0?-3.55:2.42,side<0?-3.02:2.95,11.45,13.35));
church=church.subtract(box(-3.25,-2.72,-.82,.22,11.45,13.35));
church=church.subtract(box(-3.25,-2.72,-.95,.35,BASE,3.0));
church=church.rotate([0,0,-6.2]);
const parts=[["building:kerk",church]];
const META={name:"Sint Janskerk Hoorn",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0093100000212887"],description:"Middeleeuwse zaalkerk met vijfzijdig koor, zadeldak en westtoren met naaldspits; vensters en entree naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0093100000212887","https://monumentenregister.cultureelerfgoed.nl/monumenten/35084","https://commons.wikimedia.org/wiki/Category:Janskerk_Hoorn_(Terschelling)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-janskerk-hoorn.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

