import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-corneliuskerk-wanroij';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[184900,407632],X_AXIS=[.756,.654];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);

// Hoofdkappen volgens gemeten 3D BAG-dakvlakken; hoogtes boven NAP +14,17 m.
let nave=roofY(box(-18,20,-5.4,5.1,BASE,21.3),-.15,21.3,1.5);
let aisles=[];for(const [a,b,k,c] of [[-9.0,-5.3,.57,14.6],[5,9.1,-.57,14.6]]){let s=box(-2,19,a,b,BASE,11);s=plane(s,0,k,c);aisles.push(s)}
let transept=roofX(box(-11,-1,-10.7,11.6,BASE,21.3),-6,21.3,1.5);
let choir=roofY(prism([[-21,-3],[-19,-5.4],[-10,-5.4],[-10,5.1],[-19,5.1],[-21,3]],BASE,21.3),-.15,21.3,1.5);choir=plane(choir,1.5,0,49.8);
// Zadelkap van de sacristie en kleinere vijfzijdige aanbouw aan het koor.
let sacristy=roofY(box(-19,-9.8,-15.4,-8.8,BASE,9.5),-12.1,9.5,1.12);
let chapel=roofY(prism([[-15,4.4],[-10,4.4],[-10,9.0],[-12,10.5],[-14.2,9],[-15,7]],BASE,11.6),7.3,11.6,1);
// Westtoren met achtkantige spits en vier hoektorentjes.
let tower=box(17.8,26,-4.15,4.15,BASE,33.8);
let spire=Manifold.cylinder(23.6,4.4,.45,8).rotate([0,0,22.5]).translate([21.9,0,33.6]);
let turrets=[];for(const x of [18.5,25.3])for(const y of [-3.45,3.45]){let shaft=Manifold.cylinder(5.5,1,1,8).translate([x,y,29.3]);let roof=Manifold.cylinder(5.8,1,.45,8).translate([x,y,34.6]);turrets.push(shaft,roof)}
let lantern=Manifold.cylinder(3.4,1.4,1.4,8).translate([-6,-.15,21.0]);let lanternTop=Manifold.cylinder(6.2,1.4,.45,8).translate([-6,-.15,24.2]);
let portal=roofY(box(25.5,27.2,-2.2,2.2,BASE,5.7),0,5.7,1.1);
let buttresses=[];for(const x of [1,5,9,13,17])for(const side of [-1,1]){let y=side<0?-10.1:8.7;let s=box(x-.5,x+.5,y,y+1.4,BASE,10);s=plane(s,0,side<0?1:-1,19);buttresses.push(s)}
for(const [x,y] of [[-20,-3],[-20,3],[-18,-5.3],[-18,5.2]])buttresses.push(box(x-.55,x+.55,y-.55,y+.55,BASE,15));
// Dakkapellen, zichtbaar op kerkfoto en AHN, 1,0 m breed gemaakt.
let dormers=[];for(const x of [4,10])for(const side of [-1,1]){let y=side<0?-3.6:2.6;dormers.push(roofX(box(x-.55,x+.55,y,y+1.2,16,18.5),x,18.5,1))}
let church=Manifold.union([nave,...aisles,transept,choir,sacristy,chapel,tower,spire,...turrets,lantern,lanternTop,portal,...buttresses,...dormers]);
const niche=(x,y,z,w,h)=>{let p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.2).rotate([90,0,0]).translate([x,y,z])};
for(const x of [3,7,11,15])for(const y of [-8.5,9.7])church=church.subtract(niche(x,y,2.4,1.7,5.3));
for(const x of [3,7,11,15])for(const y of [-4.9,5.7])church=church.subtract(niche(x,y,12.4,1.5,4));
for(const y of [-10.2,12.2])church=church.subtract(niche(-6,y,3,3.1,10));
// Gelede westtoren: drie hoge blinde nissen en de galmgaten op beide zijden.
for(const x of [19.3,21.9,24.5])for(const y of [-3.55,4.75]){
 church=church.subtract(niche(x,y,15.1,1.1,7.0));
 church=church.subtract(niche(x,y,27.5,1.1,4.5));
}
for(const y of [-2.6,0,2.6])church=church.subtract(niche(0,0,27,1.35,4.7).rotate([0,0,90]).translate([25.4,y,0]));
church=church.subtract(niche(0,0,1,2.3,4.4).rotate([0,0,90]).translate([26.5,0,0]));
for(const [x,y,a] of [[-20,-2,270],[-20,2,270],[-19.1,-4.4,225],[-19.1,4.2,315]])church=church.subtract(niche(0,0,4,1.8,9).rotate([0,0,a]).translate([x,y,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Corneliuskerk Wanroij',origin:ORIGIN,xAxis:X_AXIS,groundHeight:14.17,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1702100000000991'],description:'Neogotische kruisbasiliek met hoge toren, dakruiter, sacristie en vijfzijdig koor.',realWorld:{groundNapM:14.17,ahn5TopNapM:71.739},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1702100000000991','https://commons.wikimedia.org/wiki/Category:Sint-Corneliuskerk_(Wanroij)','https://www.landvancuijk.nl/toerisme-en-recreatie/sintcorneliuskerk/','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-corneliuskerk-wanroij.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















