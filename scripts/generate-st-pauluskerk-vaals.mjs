import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="st-pauluskerk-vaals";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[199824,309132],X_AXIS=[.53,.85];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Driebeukige kruisbasiliek met kapvlakken langs de nok en het dwarsschip.
let nave=box(-22.9,19.2,-6.3,6.3,BASE,24.2);nave=plane(nave,0,1.25,24.2);nave=plane(nave,0,-1.25,24.2);
let cross=box(-1,9,-11,10.8,BASE,24.2);cross=plane(cross,1.45,0,24.2-1.45*4);cross=plane(cross,-1.45,0,24.2+1.45*4);
let sides=[];for(const sign of [-1,1]){let b=box(-22.9,17.7,sign<0?-11.0:6.1,sign<0?-6.1:10.4,BASE,12.9);b=plane(b,0,sign<0?.65:-.65,19.7);sides.push(b)}
// Aanbouwen ter weerszijden van de koorsluiting volgens de BAG-voetafdruk.
let annex1=box(17.5,22.1,-11.3,-7.4,BASE,10.5);annex1=plane(annex1,0,.65,17.8);
let annex2=box(17.5,24.3,3.3,10.5,BASE,11.5);annex2=plane(annex2,0,-.65,17.7);
let choir=prism([[18.8,-5.6],[22,-5.6],[25,-3.1],[26,0],[25,3.1],[22,5.6],[18.8,5.6]],BASE,20.5);choir=plane(choir,0,1.3,20.5);choir=plane(choir,0,-1.3,20.5);choir=plane(choir,-1.3,0,20.5+1.3*22);
// Toren aan de rechtervoorhoek: bakstenen romp, achtkante lantaarn en naaldspits.
let tower=box(-23.5,-15.5,-12.4,-4.4,BASE,33.0);
let oct=Manifold.cylinder(10.4,3.6,3.6,8).translate([-19.5,-8.4,32.8]);
let spire=Manifold.cylinder(19.9,3.6,.48,8).translate([-19.5,-8.4,43.1]);
// Kleinere achthoekige traptoren aan de viering.
let turret=Manifold.cylinder(24,1.75,1.75,8).translate([8.5,-2,BASE]);let turretroof=Manifold.cylinder(11.6,1.75,.47,8).translate([8.5,-2,23.5]);
let stair=Manifold.cylinder(19,1.4,1.4,8).translate([-22.6,6.4,BASE]);let stairroof=Manifold.cylinder(5,1.4,.47,8).translate([-22.6,6.4,18.4]);
let church=Manifold.union([nave,cross,...sides,annex1,annex2,choir,tower,oct,spire,turret,turretroof,stair,stairroof]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.1).rotate([90,0,0]).translate([x,y,z])};
// Ritme van spitsboogvensters in beide langswanden.
for(const x of [-19,-15,-11,-7,-3])for(const y of [-10.55,10.8])if(!(x===-19&&y<0))church=church.subtract(niche(x,y,2.5,1.8,7));
// Middenportaal en drie hoge vensters van de westgevel.
church=church.subtract(niche(0,0,BASE,3.4,5.3).rotate([0,0,90]).translate([-23.25,0,0]));
for(const y of [-2.1,0,2.1])church=church.subtract(niche(0,0,8,1.35,8).rotate([0,0,90]).translate([-23.25,y,0]));
for(const z of [14,23,34,39])for(const a of [90,180,270]){let r=z<33?4.25:3.85;let n=niche(0,r,z,1.25,3.5).rotate([0,0,a]).translate([-19.5,-8.4,0]);church=church.subtract(n)}
for(const x of [-18,-13,-8])for(const side of [-1,1]){let b=box(x-.5,x+.5,side<0?-11.1:10.3,side<0?-10.3:11.1,BASE,9.4);b=plane(b,0,side<0?1:-1,20.3);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Sint-Pauluskerk Vaals",origin:ORIGIN,xAxis:X_AXIS,groundHeight:205.585,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0981100000001113"],description:"Neogotische kruisbasiliek met zijdelingse toren en achtkantige naaldspits.",realWorld:{groundNapM:205.585,ahn5TopNapM:270.62,towerM:63},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0981100000001113","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/36620","https://www.visitzuidlimburg.nl/te-doen-in-zuid-limburg/attracties-bezienswaardigheden/detail/sint-pauluskerk/393259/","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-st-pauluskerk-vaals.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








