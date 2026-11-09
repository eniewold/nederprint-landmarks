import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-antonius-abtkerk-terheijden';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[111054,406185],X_AXIS=[.9659,.2588];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Middenschip: lange zadeldaken volgens 3D BAG en AHN. Hoogten t.o.v. NAP +2,52 m.
let nave=roofY(box(-22,20.6,-5.2,5.8,BASE,24.1),.25,24.1,1.12);
let aisles=[];for(const side of [-1,1]){const y0=side<0?-9.8:5.6,y1=side<0?-5:9.7;let s=box(-25,-.2,y0,y1,BASE,14);s=plane(s,0,side<0?.45:-.45,16.25);aisles.push(s)}
// Transept met kruisende nok en koor met vijfzijdige sluiting.
let transept=roofX(box(-1.2,9.3,-14.5,14.6,BASE,24.1),4.05,24.1,1.27);
let choir=roofY(prism([[8,-5.2],[20.3,-5.2],[23.6,-3.3],[25.9,-1],[25.9,2.4],[23.6,4.5],[20.3,5.8],[8,5.8]],BASE,24.1),.25,24.1,1.12);
choir=plane(choir,-1.0,0,46.2);
// Bakstenen sacristie op de zuidoostelijke hoek met twee gootvlakken.
let annex=roofY(box(9,20.4,-14.0,-5.0,BASE,10.2),-9.5,10.2,.48);
// Twee dakkapellen op het zuidelijke sacristiedak (RCE/Commons-foto P1070874).
let dormers=[11.7,17.2].map(x=>roofX(box(x-.6,x+.6,-13.1,-11.5,7.5,10.1),x,10.1,1));
// Toren met gemetselde schacht en steile achtkante spits; bron vermeldt 63 m.
let tower=box(-28.0,-20.2,-3.5,3.9,BASE,35.5);
let spire=Manifold.cylinder(27.3,4.2,.45,8).rotate([0,0,22.5]).translate([-24.1,.2,35.3]);
let stairs=Manifold.cylinder(17,1.5,1.5,8).translate([-25.7,-3.4,BASE]);let stairRoof=Manifold.cylinder(2.2,1.5,.15,8).translate([-25.7,-3.4,16.4]);
let lantern=Manifold.cylinder(3.2,1.25,1.25,8).translate([4,.2,24]);let lanternTop=Manifold.cylinder(4.8,1.25,.45,8).translate([4,.2,27]);
// Toegang aan de transeptgevel en afgeschuinde steunberen.
let porch=roofX(box(1.2,5.4,-16.3,-14.0,BASE,7),3.3,7,1.2);
let supports=[];for(const x of [-18,-13,-8,-3])for(const s of [-1,1]){let y=s<0?-10.8:9.4;let q=box(x-.55,x+.55,y,y+1.4,BASE,10.5);q=plane(q,0,s<0?1:-1,20.2);supports.push(q)}
// Steunberen tegen de zes kanten van de vijfzijdige koorsluiting; huls loopt tot boven de vensters.
const APSE=[[20.3,-5.2],[23.6,-3.3],[25.9,-1],[25.9,2.4],[23.6,4.5],[20.3,5.8]];
for(let i=0;i<APSE.length;i++){const [x,y]=APSE[i],angle=Math.atan2(y-.25,x-19)*180/Math.PI;let s=box(-.7,.7,-.65,1.2,BASE,17.4).rotate([0,0,angle-90]).translate([x,y,0]);supports.push(s)}
let church=Manifold.union([nave,...aisles,transept,choir,annex,...dormers,tower,spire,stairs,stairRoof,lantern,lanternTop,porch,...supports]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-20.5,-15.5,-10.5,-5.5])for(const y of [-9.5,10.4])church=church.subtract(niche(x,y,3,1.8,6));
for(const y of [-13.8,14.9])church=church.subtract(niche(4,y,3.5,4.2,13));
// Hoge koorvensters op de vlakke sluitingsvlakken; geen doorlopende gaten.
for(let i=0;i<APSE.length-1;i++){const [x0,y0]=APSE[i],[x1,y1]=APSE[i+1],x=(x0+x1)/2,y=(y0+y1)/2,ang=Math.atan2(y1-y0,x1-x0)*180/Math.PI;let n=niche(0,0,4.5,1.7,10).rotate([0,0,ang]).translate([x,y,0]);church=church.subtract(n)}
for(const x of [-25.5,-23.1])for(const y of [-3.2,4.7])church=church.subtract(niche(x,y,26,1.25,5.5));
for(const y of [-2.0,2.4])church=church.subtract(niche(0,0,25.5,1.3,6).rotate([0,0,90]).translate([-28.4,y,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Antonius Abtkerk Terheijden',origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.515,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1719100000002500'],description:'Gotische kruiskerk met sacristie, zijbeuken, vieringtoren en westtoren; gemeten dakvlakken en geschatte spits.',realWorld:{groundNapM:2.515,ahn5TopNapM:58.50,publishedTowerHeightM:63},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1719100000002500','https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Antonius_Abtkerk,_Terheijden','https://www.kijkopdrimmelen.nl/bezit-herstel-en-eerste-restauratie-van-de-antonius-abt-kerk-terheijden/','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-antonius-abtkerk-terheijden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















