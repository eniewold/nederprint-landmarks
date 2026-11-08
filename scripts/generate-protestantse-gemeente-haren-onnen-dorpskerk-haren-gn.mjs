import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="protestantse-gemeente-haren-onnen-dorpskerk-haren-gn";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[236422.5,576896.5],X_AXIS=[.9039,.4278];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// De toren, het hogere schip, het lagere koor en de consistorie als aparte bouwdelen.
let tower=box(-3.8,2.7,-4.2,2.9,BASE,23.0);
let spire=box(-3.8,2.7,-4.2,2.9,22.95,42.0);
spire=plane(spire,5.35,0,44.94);spire=plane(spire,-5.35,0,39.06);spire=plane(spire,0,5.35,45.48);spire=plane(spire,0,-5.35,38.52);
let ship=box(2.5,23.6,-6,4.8,BASE,8.1),roof=box(2.5,23.6,-6,4.8,8.05,14.1);
roof=plane(roof,0,1.11,14.77);roof=plane(roof,0,-1.11,13.43);
let choir=box(23.5,35.4,-5.5,4.1,BASE,7.4),cr=box(23.5,35.4,-5.5,4.1,7.35,13.3);
cr=plane(cr,0,1.23,14.16);cr=plane(cr,0,-1.23,12.44);
let cons=box(35.2,42,-5,3.7,BASE,5.4),cor=box(35.2,42,-5,3.7,5.35,9.3);
cor=plane(cor,0,.9,9.89);cor=plane(cor,0,-.9,8.71);
// Vier gemetselde topgevels vormen een herkenbare overgang naar de spits.
const gableX=(x)=>Manifold.hull([[x-.3,-4.2,22.7],[x-.3,2.9,22.7],[x-.3,-.65,29.0],[x+.3,-4.2,22.7],[x+.3,2.9,22.7],[x+.3,-.65,29.0]]);
const gableY=(y)=>Manifold.hull([[-3.8,y-.3,22.7],[2.7,y-.3,22.7],[-.55,y-.3,29.0],[-3.8,y+.3,22.7],[2.7,y+.3,22.7],[-.55,y+.3,29.0]]);
let church=Manifold.union([tower,spire,ship,roof,choir,cr,cons,cor,gableX(-3.8),gableX(2.7),gableY(-4.2),gableY(2.9)]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5,8.5,12,15.5,19.0,22])for(const y of [-5.65,5.15])church=church.subtract(arch(x,y,2.2,1.2,3.4));
for(const x of [26.3,30,33.3])for(const y of [-5.15,4.45])church=church.subtract(arch(x,y,2.2,1.2,3.1));
for(const y of [-3.85,3.25])for(const x of [-1.5,.4])church=church.subtract(arch(x,y,15.5,.8,2.7));
church=church.subtract(arch(0,0,BASE,1.5,2.8).rotate([0,0,90]).translate([-3.9,-.6,0]));
const parts=[["building:kerk",church]];
const META={name:"Dorpskerk Haren",origin:ORIGIN,xAxis:X_AXIS,groundHeight:6.644,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0017100000005271"],description:"Dorpskerk met vierzijdige torenspits, schip, koor en consistorie.",realWorld:{groundNapM:6.644,ahnPeakNapM:53.72,ahnSurroundingRoofNapM:48.84,publishedTowerHeightM:42},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0017100000005271","https://monumentenregister.cultureelerfgoed.nl/monumenten/20272","https://commons.wikimedia.org/wiki/Category:Nicolaaskerk_(Haren,_Groningen)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.harendekrant.nl/nieuws/skyline-van-haren-wordt-gerepareerd/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-gemeente-haren-onnen-dorpskerk-haren-gn.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));






