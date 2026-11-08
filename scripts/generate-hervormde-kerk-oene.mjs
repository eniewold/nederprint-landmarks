import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-kerk-oene";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[199974,484226],X_AXIS=[.9915,-.13];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Een kap over drie beuken, met driezijdige koorsluiting; maten uit BAG en 3DBAG.
const foot=[[-2.4,-7],[18,-7],[19.4,-5.5],[19.4,-2.8],[20.7,-1],[20.7,1],[19,3.3],[18.3,7],[-2.3,7.4]];
let mass=prism(foot,BASE,4.1);let roof=prism(foot,4.05,13.4);roof=plane(roof,0,1.32,13.4);roof=plane(roof,0,-1.32,13.4);roof=plane(roof,-2.2,0,53.7);
// De dwarsvleugel uit 1951, met schild aan noordzijde, nok in Y-richting.
let wing=box(5.8,16.1,4,20.5,BASE,4.1),wr=box(5.8,16.1,4,20.5,4.05,11.3);
wr=plane(wr,1.38,0,-4.02);wr=plane(wr,-1.38,0,26.62);wr=plane(wr,0,-1.38,34.35);
// Kleine consistorie aan oostzijde van de noordvleugel.
let vestry=box(15.7,21.4,7.2,12.3,BASE,4.0),vr=box(15.7,21.4,7.2,12.3,3.95,7.2);
vr=plane(vr,0,1.2,-4.55);vr=plane(vr,0,-1.2,18.95);vr=plane(vr,-1.2,0,30.1);
let tower=box(-2.3,2.5,-2.3,2.8,BASE,17.8);
let spire=Manifold.hull([[-2.3,-2.3,17.7],[2.5,-2.3,17.7],[2.5,2.8,17.7],[-2.3,2.8,17.7],[-.5,-.25,24.3],[.5,-.25,24.3],[.5,.75,24.3],[-.5,.75,24.3]]);
let church=Manifold.union([mass,roof,wing,wr,vestry,vr,tower,spire]);
const pointed=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]],0,.8).rotate([90,0,0]).translate([x,y,z]);
for(const x of [3.8,8.9,13.5,17.1])church=church.subtract(pointed(x,-6.6,1.4,1.2,2.4));
for(const y of [9,12,15.3,18.5]) {let cut=pointed(y,-5.5,1.4,1.1,2.2).rotate([0,0,90]);church=church.subtract(cut.translate([0,0,0]));}
for(const y of [-2.0,3.1]) church=church.subtract(pointed(0,y,14.5,1.0,2.0));
for(const x of [-2.5,2.2]) church=church.subtract(pointed(0,0,14.5,1.0,2.0).rotate([0,0,90]).translate([x,.25,0]));
for(const x of [2,6.5,11.1,16])church=Manifold.union([church,box(x-.45,x+.45,-7.8,-6.8,BASE,3.0)]);
for(const y of [10.2,13.4,16.7,20])church=Manifold.union([church,box(5.1,6,y-.45,y+.45,BASE,3)]);
// Vensters en steunberen van de noordgevel en de driezijdige koorsluiting.
for(const x of [7.3,10.9,14.5]) church=church.subtract(pointed(x,20.8,1.2,1.15,2.5));
for(const x of [6.2,9.4,12.7,15.8]) church=Manifold.union([church,box(x-.45,x+.45,20.4,21.3,BASE,3)]);
// Westgevel: uitstekend driehoekig vensterfront op volle hoogte, met blinde nis.
let westgevel=prism([[-2.8,-1.35],[-2.25,-1.35],[-2.25,1.35],[-2.8,1.35]],BASE,7.6);
let geveltop=prism([[-1.35,0],[1.35,0],[0,1.35]],0,.55).rotate([90,0,0]).rotate([0,0,90]).translate([-2.8,0,7.6]);
church=Manifold.union([church,westgevel,geveltop]);
church=church.subtract(pointed(0,0,1.8,1.3,5.4).rotate([0,0,90]).translate([-2.9,0,0]));
church=church.subtract(pointed(3.4,-6.6,BASE,1.25,2.5));
church=church.subtract(pointed(0,0,2.0,1.2,4.4).rotate([0,0,90]).translate([20.4,0,0]));
for(const y of [-5.4,-3.8]) church=Manifold.union([church,box(18.8,19.8,y-.45,y+.45,BASE,3)]);
let corner=box(15.8,18.5,16.5,19.4,BASE,4), cornerRoof=box(15.8,18.5,16.5,19.4,3.95,6.2);
cornerRoof=plane(cornerRoof,-1.2,0,26.3);cornerRoof=plane(cornerRoof,1.2,0,-14.3);
church=Manifold.union([church,corner,cornerRoof]);
const parts=[["building:kerk",church]];
const META={name:"Hervormde Kerk Oene",origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.929,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0232100000000509"],description:"Dorpskerk met romaanse westtoren, driebeukig schip, koor en noordelijke dwarsvleugel.",realWorld:{groundNapM:4.929,ahnTopNapM:29.196},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0232100000000509","https://monumentenregister.cultureelerfgoed.nl/monumenten/15349","https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_(Oene)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0160.php"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-oene.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1){console.log(pieces.map(p=>p.boundingBox()));throw new Error(`expected one connected component, got ${pieces.length}`);} 
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));









