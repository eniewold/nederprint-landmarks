import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='zuiderkerk-enkhuizen';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[148630,524048],X_AXIS=[.99994,.01074];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;return plane(plane(s,0,k,ridge-k*mid),0,-k,ridge+k*mid)};
const crossGable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;return plane(plane(s,k,0,ridge-k*mid),-k,0,ridge+k*mid)};
const roof=(p,eave,peaks)=>Manifold.hull([...p.map(([x,y])=>[x,y,eave]),...peaks]);
// Tweebeukige hallenkerk: twee daken en afzonderlijke vijfzijdige sluitingen.
let solids=[];
for(const [lo,hi] of [[-9.9,0],[0,10]]){const m=(lo+hi)/2,p=[[-22,lo],[26.5,lo],[30,lo+2.5],[30,hi-2.5],[26.5,hi],[-22,hi]];solids.push(prism(p,BASE,8.4),roof(p,8.35,[[-22,m,16],[26,m,16]]));}
// Heilig Kruiskapel aan de noordzijde, met dwarskap en de twee lagere vertrekken.
solids.push(box(-1.5,18.2,9,19.4,BASE,8.1),crossGable(-1.5,18.2,9,19.4,8.05,15.2));
solids.push(box(-10.3,-1.5,9,15.4,BASE,6.3),gable(-10.3,-1.5,9,15.4,6.25,10));
solids.push(box(-1.6,5.6,14,19.4,BASE,6.3),gable(-1.6,5.6,14,19.4,6.25,9.4));
// Lage zuidportiek met afgeschuind schilddak.
solids.push(box(-5.3,-1.2,-13.7,-9.7,BASE,4.6),roof([[-5.3,-13.7],[-1.2,-13.7],[-1.2,-9.7],[-5.3,-9.7]],4.55,[[-3.25,-11.7,7.2]]));
for(const x of [-20,-15,-10,-5,0,5,10,15,20,25])for(const y of [-9.8,9.9])solids.push(box(x-.4,x+.4,y-.5,y+.5,BASE,8.7));
// Bakstenen torenschacht, achtkantige houten bovenbouw en geschatte bekroning.
const tx=-25.5,ty=-5.2;
solids.push(box(-30,-22,-10,-.4,BASE,39.5));
solids.push(Manifold.cylinder(19,4.2,3.8,8).rotate([0,0,22.5]).translate([tx,ty,39.4]));
solids.push(Manifold.cylinder(6.5,3.8,1.9,8).rotate([0,0,22.5]).translate([tx,ty,58.3]));
solids.push(Manifold.cylinder(4,1.9,1.9,8).translate([tx,ty,64.7]));
const ring=(r,z)=>Array.from({length:8},(_,i)=>{let a=i*Math.PI/4;return [tx+r*Math.cos(a),ty+r*Math.sin(a),z]});
solids.push(Manifold.hull([...ring(1.9,68.6),...ring(2.4,69.5),...ring(2.1,71.2),...ring(.55,72.7)]),Manifold.cylinder(2.1,.55,.35,8).translate([tx,ty,72.7]));
let church=Manifold.union(solids);
const pointed=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w*.55],[0,h],[-w/2,h-w*.55]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-17.5,-12.5,-7.5,-2.5,2.5,7.5,12.5,17.5,22.5])church=church.subtract(pointed(x,-9.55,2.7,2.1,4.9));
for(const y of [-9.6,-.1])church=church.subtract(pointed(0,0,2.7,2.5,4.9).rotate([0,0,90]).translate([29.7,y+4.8,0]));
for(const x of [-20,19,24])church=church.subtract(pointed(x,10.3,2.7,2,4.7));
for(const x of [-28,-25.5,-23])for(const z of [14,27])church=church.subtract(pointed(x,-9.65,z,1.3,7));
for(const y of [-8,-5.2,-2.4])for(const z of [14,27])church=church.subtract(pointed(0,0,z,1.3,7).rotate([0,0,90]).translate([-30.3,y,0]));
// Opengewerkte lantaarn vereenvoudigd als ondiepe galmgaten; een kern blijft staan.
for(let i=0;i<8;i++)for(const x of [-1.1,1.1])church=church.subtract(pointed(x,4.15,43,1.1,12).rotate([0,0,i*45]).translate([tx,ty,0]));
const parts=[['building:kerk',church]];
const META={name:'Zuiderkerk Enkhuizen',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.17,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0388100000229269'],description:'Tweebeukige hallenkerk met vijfzijdige koren, kruisbeuk en hoge Zuidertoren.',realWorld:{groundNapM:.17,roofRidgeNapM:16.3,ahn4TowerNapM:61.6,sourceTowerHeightM:75},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0388100000229269','https://commons.wikimedia.org/wiki/Category:Zuiderkerk_(Enkhuizen)','https://commons.wikimedia.org/wiki/Category:Zuidertoren_(Enkhuizen)','https://monumentenregister.cultureelerfgoed.nl/monumenten/15268','https://enkhuizen.net/wat-te-doen/zuiderkerk','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-kerk-oisterwijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
for(const piece of pieces)console.log('piece',JSON.stringify(piece.boundingBox()),piece.volume());
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





