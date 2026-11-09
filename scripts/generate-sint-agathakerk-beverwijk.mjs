import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-agathakerk-beverwijk';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[105540,499574],X_AXIS=[.751,.6605];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const rotate=(p,a)=>p.map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]);
const ring=(r,z,cx=0,cy=0)=>Array.from({length:8},(_,i)=>{let a=(i+.5)*Math.PI/4;return [cx+r*Math.cos(a),cy+r*Math.sin(a),z]});
// Centrale achtzijdige trommel en gewelfde hoofdkoepel met gemeten profiel.
let solids=[prism(ring(13,0).map(([x,y])=>[x,y]),BASE,18.5),Manifold.hull([...ring(13,18.45),...ring(11.6,21),...ring(9,25),...ring(5.4,28.8),...ring(1.8,30.7)])];
// Acht afzonderlijke kapellen met een eigen achtvlakkig gewelfdak.
const chapel=[[-4.6,9.5],[4.6,9.5],[5,12],[5,19.7],[3.3,21.9],[-3.3,21.9],[-5,19.7],[-5,12]];
for(let i=0;i<8;i++){let a=i*Math.PI/4,p=rotate(chapel,a),cx=-14.7*Math.sin(a),cy=14.7*Math.cos(a);solids.push(prism(p,BASE,8.7),Manifold.hull([...p.map(([x,y])=>[x,y,8.65]),...ring(4.1,12.6,cx,cy),...ring(1.5,15.2,cx,cy)]));}
// Lantaarn en schilddak: gesloten kern voor een robuuste print op 1:1000.
solids.push(Manifold.cylinder(4.1,1.75,1.75,8).translate([0,0,30.2]),Manifold.cylinder(3.6,2,.12,8).translate([0,0,34.2]));
// Voorportaal, als apart bouwdeel op de zuidwestzijde van de BAG-contour.
const portal=[[-3.3,-24.6],[3.8,-24.6],[3.8,-19],[-3.3,-19]];
solids.push(prism(portal,BASE,5.4),Manifold.hull([...portal.map(([x,y])=>[x,y,5.35]),[0,-21.8,8.1]]));
const entrance=[[-3.3,19],[3.8,19],[3.8,24.3],[-3.3,24.3]];
solids.push(prism(entrance,BASE,5.4),Manifold.hull([...entrance.map(([x,y])=>[x,y,5.35]),[.25,19,8.1],[.25,24.3,8.1]]));
// Lage nevenruimten flankeren de portalen aan beide lange zijden.
for(const [a,b] of [[-9.1,-3],[3,9.1]])for(const [c,d] of [[-24.3,-18],[18,24.3]])solids.push(box(a,b,c,d,BASE,3.8));
let church=Manifold.union(solids);
for(let i=0;i<8;i++)church=church.subtract(Manifold.cylinder(.65,.85,.85,16).rotate([0,90,0]).translate([11.65,0,16.7]).rotate([0,0,i*45]));
const pointed=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w*.55],[0,h],[-w/2,h-w*.55]];return prism(p,0,.65).rotate([90,0,0]).translate([x,y,z])};
// Ondiepe nissen in de radiale kapelgevels.
for(let i=0;i<8;i++){if(i===0||i===4)continue;let a=i*45;for(const x of [-2,0,2])church=church.subtract(pointed(x,22.15,2.8,1.15,3).rotate([0,0,a]));}
church=church.subtract(pointed(.25,-24.3,.1,2.2,3.8));
church=church.subtract(pointed(.25,24.6,.1,2.2,3.8));
const parts=[['building:kerk',church]];
const META={name:'Sint-Agathakerk Beverwijk',origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.3,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0375100000019150'],description:'Achthoekige centraalbouw met hoofdkoepel, kapellenkrans en lantaarn.',realWorld:{groundNapM:2.3,domeNapM:33,ahn5LanternNapM:40.9},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0375100000019150','https://commons.wikimedia.org/wiki/Category:Sint_Agathakerk,_Beverwijk','https://monumentenregister.cultureelerfgoed.nl/monumenten/492352','https://www.ahn.nl/dataroom']};

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





