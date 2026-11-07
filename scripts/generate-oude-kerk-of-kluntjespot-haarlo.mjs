import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-kerk-of-kluntjespot-haarlo";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[236810.34,458781.31],X_AXIS=[1,0];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const poly=[[5.63,-5.82],[8.1,-.13],[5.83,5.63],[.16,8.09],[-5.6,5.85],[-8.08,.17],[-5.82,-5.62],[-.13,-8.09]];
let walls=prism(poly,BASE,7.05);
// Achthoekig tentdak als acht dakvlakken en een gesloten, printbare dakruiter.
const roof=Manifold.hull([...poly.map(([x,y])=>[x,y,7]),[-.5,-.5,14.5],[.5,-.5,14.5],[.5,.5,14.5],[-.5,.5,14.5]]);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos((i+.5)*Math.PI/4),r*Math.sin((i+.5)*Math.PI/4),z]);
const lantern=Manifold.hull([...oct(1.05,14),...oct(1.05,17.1)]), cap=Manifold.hull([...oct(1.05,17.05),...oct(.5,17.6)]);
let chimney=box(4.1,5.1,4.9,5.9,7,12.5);
let church=Manifold.union([walls,roof,lantern,cap,chimney]);
// Vlaknormalen zijn 22,5 + n×45 graden; de voorzijde is 67,5 graden.
const apothem=7.46,cut=(a,u,z,w,h)=>{
 const t=(a+90)*Math.PI/180,n=a*Math.PI/180;
 return prism([[-w/2,0],[w/2,0],[w/2,h-.55],[0,h],[-w/2,h-.55]],0,.85).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(apothem-.6)+Math.cos(t)*u,Math.sin(n)*(apothem-.6)+Math.sin(t)*u,z]);
};
// Vier grote ramen, twee lage en één hoog in de voorgevel; dubbele deuren in aangrenzende vlakken.
for(const a of [157.5,202.5,292.5,337.5])church=church.subtract(cut(a,0,2.25,1.25,3.55));
church=church.subtract(cut(67.5,0,3.6,1.3,2.45));
for(const u of [-1.9,1.9])church=church.subtract(cut(67.5,u,.8,1.05,2.25));
for(const a of [22.5,112.5])church=church.subtract(cut(a,0,BASE,1.1,2.6));
for(const [x,y] of poly)church=Manifold.union([church,box(x-.45,x+.45,y-.45,y+.45,BASE,6.7)]);
for(const a of [0,90,180,270]){const n=a*Math.PI/180;church=church.subtract(box(-.25,.25,-.35,.35,15,16.5).rotate([0,0,a]).translate([1.0*Math.cos(n),1.0*Math.sin(n),0]));}
const parts=[["building:kerk",church]];
const META={name:"Oude Kerk of Kluntjespot Haarlo",origin:ORIGIN,xAxis:X_AXIS,groundHeight:18.568,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1859100000780933"],description:"Achthoekige centraalbouw met tentdak, hoekpilasters en dakruiter.",realWorld:{groundNapM:18.568},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1859100000780933","https://monumentenregister.cultureelerfgoed.nl/monumenten/516436","https://kluntjespot.nl/gebouw/","https://www.geldersekerken.nl/filmpjes/Haarlo/index.html","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-kerk-of-kluntjespot-haarlo.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

