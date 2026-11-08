import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kloosterkerk-ten-boer";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[242010,588532.5],X_AXIS=[.9994,.0355];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Lang schip met rechte oostgevel, noordelijke traptoren en later zuidelijk bouwdeel.
let ship=box(-1.4,32.7,-6.2,4.9,BASE,11.1),roof=box(-1.4,32.7,-6.2,4.9,11.05,17.8);
roof=plane(roof,0,1.18,18.57);roof=plane(roof,0,-1.18,17.03);
let annex=box(4.5,14.6,-16.4,-6.1,BASE,3.4),ar=box(4.5,14.6,-16.4,-6.1,3.35,7.4);
ar=plane(ar,1.2,0,-1.5);ar=plane(ar,-.7,0,12.65);
let stair=box(13.7,16,4.8,6.4,BASE,9.7),st=box(13.7,16,4.8,6.4,9.65,11.3);
st=plane(st,1,0,-3.5);st=plane(st,-1,0,26.2);st=plane(st,0,1,5.7);st=plane(st,0,-1,16.9);
// Dakruiter: twee achthoekige lantaarns en afgeronde kap; openingen worden nissen.
let tower=Manifold.cylinder(4,2.0,2.0,8,false).rotate([0,0,22.5]).translate([.15,-.5,16.8]);
let upper=Manifold.cylinder(3.2,2.0,2.0,8,false).rotate([0,0,22.5]).translate([.15,-.5,20.75]);
let cap=Manifold.cylinder(1.5,2,.48,8,false).rotate([0,0,22.5]).translate([.15,-.5,23.95]);
let church=Manifold.union([ship,roof,annex,ar,stair,st,tower,upper,cap]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [4,10,17.5,23.5,29.5])for(const y of [-5.85,5.25])church=church.subtract(arch(x,y,4.3,1.4,4.2));
// Reeksen blindbogen maken de romanogotische gevelindeling zichtbaar.
for(const x of [2,6,8,12,19,21,25,27,31])for(const y of [-5.85,5.25])church=church.subtract(arch(x,y,5.3,.9,3.7));
for(const y of [-2.5,0,2.5])church=church.subtract(arch(y,0,4.5,1.1,4).rotate([0,0,90]).translate([-1.5,0,0]));
for(const y of [-2.3,0,2.3])church=church.subtract(arch(y,0,5,1.1,3.8).rotate([0,0,-90]).translate([32.9,0,0]));
for(const a of [0,45,90,135,180,225,270,315]){const n=arch(0,0,21.1,.8,2.0).scale([1,.4,1]).translate([0,1.9,0]).rotate([0,0,a]).translate([.15,-.5,0]);church=church.subtract(n);}
for(const y of [-5.8,4.4])church=Manifold.union([church,box(-1.9,-.9,y,y+1.0,BASE,7)]);
const parts=[["building:kerk",church]];
const META={name:"Kloosterkerk Ten Boer",origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.614,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0009100007678505"],description:"Romaans-gotische kloosterkerk met dakruiter, traptoren en zuidelijke aanbouw.",realWorld:{groundNapM:1.614,publishedRidgeM:17.8,publishedTowerM:28,ahnPeakNapM:27.16},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0009100007678505","https://monumentenregister.cultureelerfgoed.nl/monumenten/9779","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.pkntenboer.nl/hervormde/de-kloosterkerk-van-ten-boer/","https://commons.wikimedia.org/wiki/File:Romanogotische_kloosterkerk_van_Ten_Boer.jpg"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kloosterkerk-ten-boer.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





