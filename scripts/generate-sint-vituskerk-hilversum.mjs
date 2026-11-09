import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-vituskerk-hilversum';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[140760,470448],X_AXIS=[.950,.312];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;return plane(plane(s,0,k,ridge-k*mid),0,-k,ridge+k*mid)};
const crossGable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;return plane(plane(s,k,0,ridge-k*mid),-k,0,ridge+k*mid)};
const roof=(p,eave,peaks)=>Manifold.hull([...p.map(([x,y])=>[x,y,eave]),...peaks]);

// Basiliek: middenschip, zijbeuken en vijfzijdig koor, met eigen schuine daken.
const solids=[];
const choir=[[-4,-7],[70,-7],[75,-5.3],[78,-2],[78,2],[75,5.3],[70,7],[-4,7]];
solids.push(prism(choir,BASE,20.6),roof(choir,20.55,[[0,0,28.7],[70,0,28.7]]));
for(const [lo,hi] of [[-13,-6.5],[6.5,13]])solids.push(box(4,67,lo,hi,BASE,10.4),gable(4,67,lo,hi,10.35,14.2));
// Ritmische puntgevels aan de lichtbeuk, zichtbaar op de dronefoto.
for(const x of [8,13,18,23,28,33,38,61,66])for(const side of [-1,1]) { const c=side<0?-9.3:6.3,d=side<0?-6.3:9.3; solids.push(box(x-2,x+2,c,d,BASE,20.55),crossGable(x-2,x+2,c,d,20.5,24.1)); }
// Dwarsschip: een gesloten dwarskap met frontons.
solids.push(box(43,56,-18.8,18.8,BASE,20.2),crossGable(43,56,-18.8,18.8,20.15,28.7));
// Buitenste lage beuken; afzonderlijk aangebouwde lage ruimten volgen BAG.
solids.push(box(23,43,-17.4,-12.4,BASE,9),gable(23,43,-17.4,-12.4,8.95,11.8));
solids.push(box(23,43,12.4,17.4,BASE,9),gable(23,43,12.4,17.4,8.95,11.8));
solids.push(box(56,67,-17.2,-12.4,BASE,9),gable(56,67,-17.2,-12.4,8.95,11.8));
solids.push(box(56,67,12.4,17.4,BASE,9),gable(56,67,12.4,17.4,8.95,11.8));
// Kooromgang rond veelhoekige apsis.
const ambulatory=[[65,-13],[70,-12],[74,-9],[78,-6],[80,-2],[80,2],[78,6],[74,9],[70,12],[65,13]];
solids.push(prism(ambulatory,BASE,10.5),roof(ambulatory,10.45,[[67,-6,14.2],[73,-5,14.2],[76,0,14.2],[73,5,14.2],[67,6,14.2]]));
// Aangebouwd parochiehuis en sacristie, met eigen nok en lagere verbinding.
solids.push(box(5,25,-31,-17,BASE,10),gable(5,25,-31,-17,9.95,15.5));
solids.push(box(12,19,-19,-12.5,BASE,5.5),gable(12,19,-19,-12.5,5.45,8.3));
solids.push(box(56,72,-22.5,-16,BASE,11.1),gable(56,72,-22.5,-16,11.05,14.8));
solids.push(box(25,31,-31,-25,BASE,5.4),gable(25,31,-31,-25,5.35,7.8));
// Vrijliggende kapellen bij toren.
const cap=[[-3.5,-12.8],[0,-15],[4,-14],[6,-11.5],[6,-6],[-3.5,-6]];
solids.push(prism(cap,BASE,7.5),roof(cap,7.45,[[1,-10,12]]));
// Sterke steunberen rond schip en transept, fysiek verbonden met de muur.
for(const x of [7,12,17,22,27,32,37,42,57,62,67])for(const y of [-13,13])solids.push(box(x-.48,x+.48,y-.65,y+.65,BASE,10.8));
// Torenschacht met vier hoektorentjes en spits: geheel samenhangende bouwdelen.
solids.push(box(-6,6,-6,6,BASE,56));
const r=(x,y,rad,z)=>Array.from({length:8},(_,i)=>[x+rad*Math.cos(i*Math.PI/4),y+rad*Math.sin(i*Math.PI/4),z]);
solids.push(Manifold.hull([...r(0,0,6,55.9),...r(0,0,3.5,71),...r(0,0,.55,96.5)]));
for(const x of [-4.7,4.7])for(const y of [-4.7,4.7]){solids.push(Manifold.cylinder(12.5,1.8,1.8,8).translate([x,y,55.5]));solids.push(Manifold.hull([...r(x,y,1.8,68),...r(x,y,.48,77.5)]));}
// Slanke vieringruiter, minimaal 0,9 m op 1:1000.
solids.push(Manifold.cylinder(4,1,1,8).translate([50,0,27.8]),Manifold.cylinder(8,1,.45,8).translate([50,0,31.7]));
let church=Manifold.union(solids);
const pointed=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w*.55],[0,h],[-w/2,h-w*.55]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
for(const x of [8,13,18,23,28,33,38,61,66])for(const y of [-8.95,9.65])church=church.subtract(pointed(x,y,14,2.1,5));
for(const y of [-4,-1.3,1.4,4.1])for(const z of [8,24,39])church=church.subtract(pointed(0,0,z,1.5,9).rotate([0,0,90]).translate([-6.3,y,0]));
for(const x of [-4,-1.3,1.4,4.1])for(const z of [24,39])church=church.subtract(pointed(x,-5.65,z,1.5,9));
// Klokhuis, dwarsschip en koor hebben aan alle buitenzijden blinde spitsboognissen.
for(const y of [-4,-1.3,1.4,4.1])for(const z of [24,39])church=church.subtract(pointed(0,0,z,1.5,9).rotate([0,0,90]).translate([5.65,y,0]));
for(const x of [-4,-1.3,1.4,4.1])for(const z of [24,39])church=church.subtract(pointed(x,6.35,z,1.5,9));
for(const x of [45.5,49.5,53.5])for(const y of [-18.45,19.15])for(const z of [3,12.5])church=church.subtract(pointed(x,y,z,1.8,6));
church=church.subtract(pointed(0,0,3,1.7,5).rotate([0,0,90]).translate([79.65,0,0]));
// Twee verdiepingen met spitsboogvensters in de hoge zuidoostvleugel.
for(const x of [58.1,60.8,63.5,66.2,68.9,71.2])for(const z of [2.0,6.6])church=church.subtract(pointed(x,-22.15,z,1.25,3.3));
for(const y of [-21,-18.6])for(const z of [2.0,6.6])church=church.subtract(pointed(0,0,z,1.2,3.3).rotate([0,0,90]).translate([71.65,y,0]));
for(const x of [8,12,16,20,24])church=church.subtract(pointed(x,-30.65,2.3,1.35,4.2));
const parts=[['building:kerk',church]];
const META={name:'Sint-Vituskerk Hilversum',origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.629,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0402100001490401'],description:'Neogotische basiliek met toren, zijkapellen, dwarsschip, kooromgang, sacristie en aangebouwd parochiehuis.',realWorld:{groundNapM:4.629,roofRidgeNapM:33.37,ahn4TowerNapM:96.21,sourceTowerHeightM:98.3},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0402100001490401','https://commons.wikimedia.org/wiki/Category:Sint-Vituskerk_(Hilversum)','https://steengoedhilversum.nl/monumenten/sint-vituskerk/','https://tgooi.info/kerken/rkvituskerk.php','https://monumentenregister.cultureelerfgoed.nl/monumenten/22159','https://www.ahn.nl/dataroom']};

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





