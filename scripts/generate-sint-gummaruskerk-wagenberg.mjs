// Sint-Gummaruskerk Wagenberg, bouwdelen en dakvlakken, maten in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-gummaruskerk-wagenberg";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[110696.25,408693.25],X_AXIS=[.660,-.751];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Lang schip, hoog lichtbeuk en twee gemeten lagere zijbeuken.
let hall=box(2,41,-4,4,BASE,22.8);hall=plane(hall,0,1.25,22.8);hall=plane(hall,0,-1.25,22.8);
let aisle1=box(2,39,-9.8,-3.8,BASE,10.4);aisle1=plane(aisle1,0,.45,12.2);
let aisle2=box(2,39,3.8,9.8,BASE,10.4);aisle2=plane(aisle2,0,-.45,12.2);
// Dwarsbeuk met topgevels, koor en vijfzijdige koorsluiting.
let cross=box(39,47,-10.7,10.7,BASE,22.8);cross=plane(cross,1.25,0,-30.95);cross=plane(cross,-1.25,0,76.55);
let choir=prism([[46,-5.6],[55,-5.6],[59,-4],[61,-2],[61,2],[59,4],[55,5.6],[46,5.6]],BASE,22.8);
choir=plane(choir,0,1.25,22.8);choir=plane(choir,0,-1.25,22.8);choir=plane(choir,-1.15,0,88.4);
// Lagere sacristieën en één lage aanbouw binnen het BAG-pand.
let annex1=box(49,62.5,-11,-5.3,BASE,6.6);annex1=plane(annex1,0,1,17.6);annex1=plane(annex1,0,-1,-.1);
let annex2=box(49,62.5,5.3,11.2,BASE,6.6);annex2=plane(annex2,0,1,-.1);annex2=plane(annex2,0,-1,17.6);
let low=box(8,24,9.5,14.25,BASE,3.8);
// Toren met hoge centrale naald en vier kleine hoektorens.
let tower=box(-3.25,3.25,-3.15,3.15,BASE,38.5);
let spire=Manifold.cylinder(28.7,3.35,.45,4).rotate([0,0,45]).translate([0,0,38.3]);
let pinnacles=[];for(const x of [-2.75,2.75])for(const y of [-2.65,2.65]){
 pinnacles.push(Manifold.cylinder(4.8,.75,.7,8).translate([x,y,36.5]));pinnacles.push(Manifold.cylinder(6,.85,.45,4).rotate([0,0,45]).translate([x,y,41.1]));}
// Slanke vieringruiter, in AHN en foto's aanwezig.
let rider=Manifold.cylinder(2.5,1.3,1.2,8).translate([43,0,21]);
let riderSpire=Manifold.cylinder(15,1.4,.45,8).translate([43,0,23.3]);
let church=Manifold.union([hall,aisle1,aisle2,cross,choir,annex1,annex2,low,tower,spire,...pinnacles,rider,riderSpire]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5,10.3,15.6,20.9,26.2,31.5,36.6]){
 church=church.subtract(niche(x,-9.3,1.6,1.5,4.3));church=church.subtract(niche(x,10.3,1.6,1.5,4.3));
 church=church.subtract(niche(x,-3.5,13.0,2.1,5.1));church=church.subtract(niche(x,4.5,13.0,2.1,5.1));
}
// Grote hoge koorramen boven de lagere aanbouwen.
for(const x of [49,52,55,57.8]){
 church=church.subtract(niche(x,-5.1,8,1.7,9));
 church=church.subtract(niche(x,6.1,8,1.7,9));
}
church=church.subtract(niche(0,.5,8,1.7,9).rotate([0,0,-90]).translate([61,0,0]));
// Rond venster boven de lange transeptvensters, als gesloten nis.
for(const y of [-10.1,11.3]) church=church.subtract(Manifold.cylinder(1.2,1.5,1.5,24).rotate([90,0,0]).translate([43,y,15.4]));
// Hoge driedelige transeptvensters en klankopeningen aan de toren.
for(const y of [-10.2,11.2])for(const x of [41,43,45])church=church.subtract(niche(x,y,6,1.3,7));
for(const x of [-1.1,1.1]){church=church.subtract(niche(x,-2.65,29.5,1.25,6));church=church.subtract(niche(x,3.65,29.5,1.25,6));}
for(const y of [-1.1,1.1]){church=church.subtract(niche(y,.5,29.5,1.25,6).rotate([0,0,90]).translate([-3.25,0,0]));}
church=church.subtract(niche(0,.5,.1,2,4.5).rotate([0,0,90]).translate([-3.25,0,0]));
// Ondersteunende steunberen langs de zijbeuken, vanaf vlakke bodem.
for(const x of [3,8,13.3,18.6,23.9,29.2,34.5,38.5])for(const y of [-9.9,9.9])church=Manifold.union([church,box(x-.45,x+.45,y-.45,y+.45,BASE,7)]);
const parts=[["building:kerk",church]];
const META={name:"Sint-Gummaruskerk Wagenberg",origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.62,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1719100000005973"],description:"Neogotische kruiskerk met hoge westtoren en vieringruiter.",realWorld:{groundNapM:1.62,ahn5NaveNapM:24.3,towerHeightM:67},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1719100000005973","https://monumentenregister.cultureelerfgoed.nl/monumenten/521492","https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Gummaruskerk,_Wagenberg","https://naardekerk.nl/wie-zijn-wij/informatie/kerken/267-h-gummaruskerk-wagenberg.html","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-gummaruskerk-wagenberg.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








