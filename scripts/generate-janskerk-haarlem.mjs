import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='janskerk-haarlem';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[103952,488643],X_AXIS=[.975,-.222];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Gotische Janskerk met koor en historische aanbouwen; hoogte t.o.v. NAP +2,24 m.
let nave=roofY(box(-.5,40,-2.8,9.6,BASE,21.85),3.4,21.85,1.65);
let choir=roofY(prism([[39,-2.8],[42,-1.3],[45.6,1.7],[45.6,5.8],[42.8,8.5],[40,9.6],[39,9.6]],BASE,21.85),3.4,21.85,1.65);choir=plane(choir,-1.5,0,83.5);
// Zuidkapel met dwars zadeldak en lagere langsbouw met eigen dakvlak.
let chapel=roofX(box(5.9,12.4,-8,-2.4,BASE,17.4),9.15,17.4,1.4);
let aisle=box(0,27,-9.2,-2.5,BASE,10.5);aisle=plane(aisle,0,.65,11.9);
let corridor=box(6.6,22.4,-10.5,-7,BASE,5.6);corridor=plane(corridor,0,.38,9.3);
// Twee zadeldaken van de aaneengeschakelde kosterswoning en archiefaanbouwen.
let houses=[];for(const [a,b] of [[27,33.2],[33.2,39.1],[39.1,46.5]]){let h=roofX(box(a,b,-10.4,-2.5,BASE,9.3),(a+b)/2,9.3,1.05);houses.push(h)}
let lantern=Manifold.cylinder(3.6,1.45,1.45,8).translate([21.4,3.4,21.4]);
let spire=Manifold.cylinder(7.5,1.45,.1,8).translate([21.4,3.4,24.9]);
let church=Manifold.union([nave,choir,chapel,aisle,corridor,...houses,lantern,spire]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [4,10,16,22,28,34])church=church.subtract(niche(x,9.85,5,1.5,7));
church=church.subtract(niche(0,0,4,3.0,13).rotate([0,0,90]).translate([-.75,3.4,0]));
for(const y of [2.2,4.85])church=church.subtract(niche(21.4,y,21.9,1,2.2));
for(const x of [7.7,10.6])church=church.subtract(niche(x,-7.75,4.2,1.25,6));
for(const x of [29,32,35,38,41,44])church=church.subtract(niche(x,-10.15,1.4,1,2.8));
for(const y of [0,3,6])church=church.subtract(niche(0,0,4,1.4,7).rotate([0,0,-90]).translate([45.85,y,0]));
const parts=[['building:kerk',church]];
const META={name:'Janskerk Haarlem',origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.242,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0392100000064921'],description:'Middeleeuwse Janskerk met vijfzijdig koor, zuidkapel, historische kosterswoning en dakruiter.',realWorld:{groundNapM:2.242,roofRidgeNapM:24.1,ahn5TowerNapM:35.2},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0392100000064921','https://commons.wikimedia.org/wiki/Category:Janskerk,_Haarlem','https://monumentenregister.cultureelerfgoed.nl/monumenten/19332','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-janskerk-haarlem.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















