import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='waddenkerk-de-cocksdorp';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[120749.5,574685.7],X_AXIS=[.943,.333];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Zaalkerk met schilddak; hoogten relatief aan NAP +0,78 m.
let nave=roofX(box(-5.1,5.2,0,22.5,BASE,10.6),.05,10.6,.88);
nave=plane(nave,0,-.9,26.5);
// Voorfront met fronton en vierkant klokkentorentje met schildkap.
let facade=roofX(box(-5.1,5.2,-.1,.5,BASE,10.6),.05,10.6,.88);
let tower=box(-1.75,1.75,0,3.8,8.1,13.0);
let lantern=box(-1.35,1.35,.35,3.45,12.9,16.7);
let dome=roofX(box(-1.45,1.45,.25,3.55,16.5,18.75),0,18.75,1.35);dome=roofY(dome,1.9,18.75,1.35);
let pilasters=[];for(const x of [-4.75,-1.9,1.9,4.85])pilasters.push(box(x-.48,x+.48,-.35,.3,BASE,7.8));
for(const y of [3.4,6.6,9.8,13,16.2,19.4])for(const x of [-5.1,5.1])pilasters.push(box(x-.45,x+.45,y-.5,y+.5,BASE,6.1));
for(const x of [-3,0,3])pilasters.push(box(x-.5,x+.5,22.3,22.8,BASE,6.1));
let church=Manifold.union([nave,facade,tower,lantern,dome,...pilasters]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-3.3,0,3.3])church=church.subtract(niche(x,.2,4.4,1.2,2.5));
church=church.subtract(niche(0,.2,.2,1.5,3));
for(const y of [4.8,8,11.2,14.4,17.6,20.6])for(const x of [-5.35,4.95])church=church.subtract(niche(0,0,2.2,1.25,3.6).rotate([0,0,90]).translate([x,y,0]));
for(const y of [.65,3.7])church=church.subtract(niche(0,y,13.5,1.1,2.3));
for(const x of [-1.55,1.0])church=church.subtract(niche(0,0,13.5,1.1,2.3).rotate([0,0,90]).translate([x,1.9,0]));
const parts=[['building:kerk',church]];
const META={name:'Waddenkerk De Cocksdorp',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.782,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0448100000001863'],description:'Neoclassicistische zaalkerk met schilddak, fronton en vierkante dakruiter; afmetingen uit BAG en AHN5.',realWorld:{groundNapM:.782,roofRidgeNapM:11.4,ahn5TopNapM:19.55},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0448100000001863','https://commons.wikimedia.org/wiki/Category:Waddenkerk,_De_Cocksdorp','https://monumentenregister.cultureelerfgoed.nl/monumenten/35281','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-waddenkerk-de-cocksdorp.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















