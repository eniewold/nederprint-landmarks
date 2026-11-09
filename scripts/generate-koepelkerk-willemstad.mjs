// Koepelkerk Willemstad: achtzijdig tentdak, onvoltooide toren en consistorie.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='koepelkerk-willemstad';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[89362.56,411892.4],X_AXIS=[.813,-.582];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const roof=(p,eave,peaks)=>Manifold.hull([...p.map(([x,y])=>[x,y,eave]),...peaks]);
const oct=[[-11.1,-2.5],[-5.7,-7.6],[3.7,-7.5],[8.6,-2.5],[8.7,6.9],[3.7,12],[-6,12],[-11.1,5.7]];
// De buitenzijde heeft acht rechte dakvlakken; het gewelf zelf is binnen.
let solids=[prism(oct,BASE,13.2),roof(oct,13.1,[[-1.1,2.2,27.8]])];
// Aanbouw: de lage consistorie met schilddak, en de onvoltooide westtoren.
const annex=[[8.4,-1.8],[13.8,-1.8],[13.8,6.4],[8.4,6.4]];
solids.push(prism(annex,BASE,4.6),roof(annex,4.5,[[10.7,.4,8.1],[10.7,4.2,8.1]]));
const tower=[[-5.6,-15.9],[3.4,-15.9],[3.7,-7.2],[-5.7,-7.2]];
solids.push(prism(tower,BASE,16.4),roof(tower,16.3,[[-1.1,-13.5,22.7],[-1.1,-9.5,22.7]]));
// Pilasters op de hoeken en een gesloten, achthoekige lantaarn met afgeknotte kap.
for(const [x,y] of oct)solids.push(box(x-.48,x+.48,y-.48,y+.48,BASE,13));
for(const [x,y] of [[-5.6,-15.9],[3.4,-15.9]])solids.push(box(x-.5,x+.5,y-.5,y+.5,BASE,16));
solids.push(Manifold.cylinder(1.9,1.25,1.25,8).translate([-1.1,2.2,27.2]),Manifold.cylinder(1.9,1.25,.15,8).translate([-1.1,2.2,29.05]));
// De vier kleine dakvensters steken boven de schuine tentvlakken uit.
for(const deg of [45,135,225,315]){
 const dormer=Manifold.union([box(3,4.8,-.7,.7,21,23.7),roof([[3,-.7],[4.8,-.7],[4.8,.7],[3,.7]],23.6,[[3.2,0,24.6],[4.6,0,24.6]])]);
 solids.push(dormer.rotate([0,0,deg]).translate([-1.1,2.2,0]));
}
// Vier eenvoudige dakkapellen met zijdelingse aansluiting op het torendak.
for(const x of [-3.6,1.4])solids.push(box(x-.65,x+.65,-15.1,-13.2,16,19),roof([[x-.65,-15.1],[x+.65,-15.1],[x+.65,-13.2],[x-.65,-13.2]],18.9,[[x,-14.2,20.3]]));
let church=Manifold.union(solids);
// Ramen als ondiepe ronde nissen, uitgelijnd met elk buitenvlak.
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.75).rotate([90,0,0]).translate([x,y,z])};
for(let i=0;i<oct.length;i++){
 if(i===1||i===3)continue; // toren en consistorie sluiten hier tegen de kerk aan
 const a=oct[i],b=oct[(i+1)%oct.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len,angle=Math.atan2(-nx,ny)*180/Math.PI;
 church=church.subtract(arch(0,0,4,2.2,7.5).rotate([0,0,angle]).translate([(a[0]+b[0])/2+nx*.35,(a[1]+b[1])/2+ny*.35,0]));
}
// Entree aan de voet van de oude toren en de vensters van de consistorie.
church=church.subtract(arch(-1.1,-15.5,.2,2.3,3.8));
for(const y of [.1,4.2])church=church.subtract(arch(y,0,1.2,1.4,2.1).rotate([0,0,90]).translate([13.45,0,0]));
const parts=[['building:kerk',church]];
const META={name:'Koepelkerk Willemstad',origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.479,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1709100000001770'],description:'Achtzijdige kerk met tentdak, daklantaarn, onvoltooide toren en lage consistorie.',realWorld:{groundNapM:1.479,roofPeakNapM:29.4,lanternTopNapM:32.44},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1709100000001770','https://commons.wikimedia.org/wiki/Category:Exterior_of_Koepelkerk_(Willemstad)','https://monumentenregister.cultureelerfgoed.nl/monumenten/38956','https://www.pgwillemstad.nl/koepelkerk/de-bouw/','https://www.ahn.nl/dataroom']};

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





