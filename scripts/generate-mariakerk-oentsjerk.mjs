import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="mariakerk-oentsjerk";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[188690,585374],X_AXIS=[1,0],GROUND_NAP=1.439;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const body=box(-8.6,10.9,-5.7,5.7,BASE,7.2);
const apse=Manifold.cylinder(7.7,5.7,5.7,24).translate([10.9,0,BASE]).intersect(box(10.8,16.7,-6,6,BASE,7.3));
let roof=box(-8.6,10.9,-5.7,5.7,7.15,14);roof=plane(roof,0,-1.13,13.65);roof=plane(roof,0,1.13,13.65);
const apseRoof=Manifold.cylinder(6.45,5.7,0,24).translate([10.9,0,7.2]).intersect(box(10.8,16.7,-6,6,7.15,14));
const tower=box(-15.2,-8.4,-3.95,3.95,BASE,18.8);
let towerRoof=box(-15.2,-8.4,-3.95,3.95,18.75,24);towerRoof=plane(towerRoof,0,-1.2,23.55);towerRoof=plane(towerRoof,0,1.2,23.55);
// Historisch baarhuis, tegenwoordig keuken, aan de noordzijde van de toren.
const annex=box(-15,-8.5,3.8,6,BASE,2.5);let annexRoof=box(-15,-8.5,3.8,6,2.45,3.8);annexRoof=plane(annexRoof,0,-.55,5.75);
// Schuine steunbeer tussen toren en zuidgevel.
let butt=box(-8.9,-7.9,-6.8,-5.4,BASE,5.6);butt=plane(butt,0,1.1,12.7);
let church=Manifold.union([body,apse,roof,apseRoof,tower,towerRoof,annex,annexRoof,butt]);
// Zuidelijke ramen, ingang en toren-galmgaten als ondiepe nissen.
for(const u of [-3.8,2.2,6.5]){let c=box(u-.55,u+.55,-5.95,-5.35,2.0,5.3);c=plane(c,-1.2,0,5.3+1.2*u);c=plane(c,1.2,0,5.3-1.2*u);church=church.subtract(c)}
church=church.subtract(box(-7.2,-5.8,-5.95,-5.35,0,2.3));
for(const u of [-12.5,-10.9])for(const side of [-1,1])church=church.subtract(box(u-.45,u+.45,side*3.95-.25,side*3.95+.25,14.8,17.1));
for(const v of [-1,1])church=church.subtract(box(-15.45,-14.95,v-.45,v+.45,14.8,17.1));
church=church.subtract(box(-15.45,-14.95,-.55,.55,0,2.5));
for(const side of [-1,1]){const c=box(-.55,.55,-.4,.4,2.2,5).rotate([0,0,side*45]).translate([15,side*4.0,0]);church=church.subtract(c)}
// Rond raam en lage nis in de noordgevel, zichtbaar op de RCE-foto.
church=church.subtract(Manifold.cylinder(.6,.55,.55,20).rotate([90,0,0]).translate([-4.8,5.95,5.2]));
church=church.subtract(box(-5.3,-4.3,5.35,5.95,.7,2.3));
church=church.rotate([0,0,2.35]);const parts=[["building:kerk",church]];
const META={name:"Mariakerk Oentsjerk",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0737100000004562"],description:"Middeleeuwse Mariakerk met halfrond koor, zadeldaktoren, schuine steunbeer en voormalig baarhuis aan de noordzijde.",realWorld:{groundNapM:1.439},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000004562","https://monumentenregister.cultureelerfgoed.nl/monumenten/35658","https://commons.wikimedia.org/wiki/Category:Mariakerk,_Oentsjerk","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-mariakerk-oentsjerk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

