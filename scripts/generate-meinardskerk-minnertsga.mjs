import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="meinardskerk-minnertsga";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[168815,584980.7],X_AXIS=[1,0],GROUND_NAP=1.927;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const poly=[[5,-6.75],[45.6,-6.75],[49.5,-4.8],[51.3,-1.5],[51.3,1.5],[49.5,4.8],[45.6,6.75],[5,6.75]];
const body=prism(poly,BASE,10.1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
let roof=prism(poly,10.08,28);roof=plane(roof,0,-1.42,19.68);roof=plane(roof,0,1.42,19.68);roof=plane(roof,-1.42,0,82.2);
const tower=box(-5,5.2,-5.1,5.1,BASE,32.1);
let towerRoof=box(-5,5.2,-5.1,5.1,32.05,50);towerRoof=plane(towerRoof,0,-1.76,41.08);towerRoof=plane(towerRoof,0,1.76,41.08);
const bouwdelen=[body,roof,tower,towerRoof];
// Steunberen met afgeschuinde bovenzijde, verbreed naar 0,9 m.
for(const x of [10.0,15.4,20.8,26.2,31.6,37.0,42.4])for(const side of [-1,1]){
 let b=box(x-.45,x+.45,side<0?-7.35:6.6,side<0?-6.6:7.35,BASE,8.8);
 b=side<0?plane(b,0,1,15.5):plane(b,0,-1,15.5);bouwdelen.push(b);
}
let church=Manifold.union(bouwdelen);
// Gotische kerkvensters, drie galmgaten per torenzijde en westportaal.
for(const x of [7.8,12.7,18.1,23.5,28.9,34.3,39.7,44.5])for(const side of [-1,1])church=church.subtract(box(x-.65,x+.65,side<0?-7:6.42,side<0?-6.42:7,2.6,8.55));
church=church.subtract(box(-5.3,-4.72,-.7,.7,BASE,3.1));
church=church.subtract(box(-5.3,-4.72,-.7,.7,4.0,7.4));
for(const v of [-1.7,0,1.7])for(const side of [-1,1]){
 church=church.subtract(box(v-.45,v+.45,side<0?-5.35:4.85,side<0?-4.85:5.35,26,29));
 church=church.subtract(box(side<0?-5.25:4.95,side<0?-4.75:5.45,v-.45,v+.45,26,29));
}
church=church.subtract(box(50.9,51.6,-.7,.7,2.7,8.6));
for(const side of [-1,1]){
 const cut=box(-.8,.8,-.45,.45,2.7,8.6).rotate([0,0,-side*61]).translate([50.4,side*3.15,0]);church=church.subtract(cut);
}
church=church.rotate([0,0,2.3]);
const parts=[["building:kerk",church]];
const META={name:"Meinardskerk Minnertsga",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0063100000000087"],description:"Eenbeukige kerk met vijfzijdig koor, steunberen en monumentale zadeldaktoren. De gevelindeling is naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0063100000000087","https://monumentenregister.cultureelerfgoed.nl/monumenten/8634","https://commons.wikimedia.org/wiki/Category:Meinardskerk","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-meinardskerk-minnertsga.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

