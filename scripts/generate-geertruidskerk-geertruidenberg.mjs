import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='geertruidskerk-geertruidenberg';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[118746,412542],X_AXIS=[.9998,-.018];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge),k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);return plane(s,0,-k,ridge+k*mid)};
// Drie parallelle beuken, elk met een eigen langskap en eigen goot.
let parts0=[];
for(const [a,c,d] of [[-21,-15,-5],[-18,-5,4.5],[-27,4.5,14.5]])parts0.push(box(a,6,c,d,BASE,14.3),gable(a,6,c,d,14.3,21.85));
// Hoger koor met vijfzijdige koorsluiting en afgeschuinde dakvlakken.
parts0.push(box(5.8,24.8,-7,5.5,BASE,17.9),gable(5.8,24.8,-7,5.5,17.9,27.1));
let end=prism([[24.5,-7],[28,-6],[31,-3],[31,1.5],[28,4.5],[24.5,5.5]],BASE,17.9);
let endroof=Manifold.hull([[24.5,-7,17.8],[28,-6,17.8],[31,-3,17.8],[31,1.5,17.8],[28,4.5,17.8],[24.5,5.5,17.8],[24.5,-.8,27.1],[25,-.8,27.1],[25,-.7,27.1],[24.5,-.7,27.1]]);parts0.push(end,endroof);
// Lage aanbouw tegen de noordzijde van het koor.
parts0.push(box(9,20,5.4,12,BASE,5.6),gable(9,20,5.4,12,5.6,8.2));
// Middeleeuwse westtoren met platte bekroning; geen naaldspits.
parts0.push(box(-30,-18,-6.2,5.8,BASE,35.3));
for(const x of [-30,-18])for(const y of [-6.2,5.8])parts0.push(box(x-.65,x+.65,y-.65,y+.65,BASE,29.6));
// Rechte borstwering en grof weergegeven kantelen van minimaal 0,9 m.
// Borstwering dicht uitgevoerd op printschaal, met vier korte hoekpinakels.
parts0.push(box(-30,-18,-6.2,-5.3,35.2,36.5),box(-30,-18,4.9,5.8,35.2,36.5),box(-30,-29.1,-5.3,4.9,35.2,36.5),box(-18.9,-18,-5.3,4.9,35.2,36.5));
for(const x of [-29.4,-18.6])for(const y of [-5.6,5.2])parts0.push(Manifold.cylinder(1.8,.65,.48,4,false).translate([x,y,36.3]));
// Steunberen met schuin aflopend uiteinde aan de lange gevels.
for(const x of [-16,-10,-4,2])for(const s of [-1,1]){const ya=s*14.3,yb=s*16.1;let b=box(x-.6,x+.6,Math.min(ya,yb),Math.max(ya,yb),BASE,13.8);parts0.push(b)}
for(const x of [12,17,22,27])for(const s of [-1,1]){const y=s<0?-5.5:4.4,yb=s<0?-8.5:7;parts0.push(box(x-.6,x+.6,Math.min(y,yb),Math.max(y,yb),BASE,15.4))}
// Ronde traptorens aan de overgang van beuk en koor, herkenbaar op de RCE-foto.
for(const y of [-14.7,14.2]){parts0.push(Manifold.cylinder(18.5,1.6,1.6,12,false).translate([5.2,y,BASE]));parts0.push(Manifold.cylinder(4.5,1.65,.48,8,false).translate([5.2,y,17.9]));}
let church=Manifold.union(parts0);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.5).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-16,-10,-4,2])for(const y of [-14.8,14.8])church=church.subtract(arch(x,y,4,1.7,8));
church=church.subtract(arch(0,0,4,3.0,10).rotate([0,0,90]).translate([-27.3,9.5,0]));
for(const x of [12,17,22])for(const y of [-6.8,5.8])church=church.subtract(arch(x,y,6,1.5,8));
for(const x of [-27,-23,-19.5])for(const y of [-5.9,6.1])for(const z of [17,25])church=church.subtract(arch(x,y,z,1.2,5));
for(const y of [-3,0,3])church=church.subtract(arch(0,0,24,1.2,6).rotate([0,0,90]).translate([-30.3,y,0]));
church=church.subtract(arch(0,0,5,1.6,10).rotate([0,0,90]).translate([30.7,-.8,0]));
church=church.subtract(arch(0,0,BASE,2,4.5).rotate([0,0,90]).translate([-30.3,0,0]));
const parts=[['building:kerk',church]];
const META={name:'Geertruidskerk Geertruidenberg',origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.45,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0779100000000146'],description:'Hallenkerk met drie kappen, verhoogd koor en stompe toren.',realWorld:{groundNapM:3.45,towerHeightM:37},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0779100000000146','https://www.monumenten.nl/monument/15950','https://commons.wikimedia.org/wiki/Category:Geertruidskerk','https://service.pdok.nl/rws/ahn/wcs/v1_0']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-geertruidskerk-geertruidenberg.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





