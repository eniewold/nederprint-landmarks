import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="de-wingerd-hart-heilige-parochie-roermond";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[197801.75,355886.75],X_AXIS=[.906,.423];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Middenschip en dwarsschip met haakse zadeldaken.
let nave=box(-28,17,-6.5,6.5,BASE,25.1);nave=plane(nave,0,1.45,25.1);nave=plane(nave,0,-1.45,25.1);
let transept=box(-6.8,6.8,-18.4,18.4,BASE,24.8);transept=plane(transept,1.45,0,24.8);transept=plane(transept,-1.45,0,24.8);
let sides=[];for(const sign of [-1,1]){let a=box(-26.6,10.2,sign<0?-11:-6.35,sign<0?-6.35:11,BASE,10.0);if(sign>0)a=box(-26.6,10.2,6.35,11,BASE,10.0);a=plane(a,0,sign<0?.6:-.6,16.1);sides.push(a)}
let choir=prism([[16.4,-5.5],[19,-5.5],[21,-3.7],[22.3,-1.4],[22.3,1.4],[21,3.7],[19,5.5],[16.4,5.5]],BASE,20.5);choir=plane(choir,0,1.3,20.5);choir=plane(choir,0,-1.3,20.5);choir=plane(choir,-1.4,0,20.5+1.4*19.5);
// Twee kapellen naast het koor met schilddaken; maatvoering uit de BAG-vlakken.
for(const sign of [-1,1]){
 const y=sign*15.8;let wing=box(9.9,21.6,y-3.1,y+3.1,BASE,9.1);
 wing=plane(wing,0,1.32,9.1-1.32*y);wing=plane(wing,0,-1.32,9.1+1.32*y);
 wing=plane(wing,1.32,0,9.1-1.32*13.1);wing=plane(wing,-1.32,0,9.1+1.32*18.6);sides.push(wing);
 let connector=box(6.3,11.3,sign<0?-16.5:10.8,sign<0?-10.8:16.5,BASE,9.6);connector=plane(connector,-.65,0,13.7);sides.push(connector);
 let west=box(-11.0,-6.5,sign<0?-16.5:10.8,sign<0?-10.8:16.5,BASE,9.3);west=plane(west,.6,0,15.9);sides.push(west);
}
// Octogonale vieringtoren met bolvormig gewelf; elk profielpunt ligt op een ellips.
let drum=Manifold.cylinder(18.6,6.2,6.2,8).translate([0,0,15.0]);
let profile=[[0,0],[6.2,0]];for(let i=1;i<=16;i++){let z=9.2*i/16;let radius=Math.max(1.25,6.2*Math.sqrt(Math.max(0,1-(z/9.4)**2)));profile.push([radius,z])}profile.push([0,9.2]);
let dome=Manifold.revolve([profile],8).translate([0,0,33.5]);
let lantern=Manifold.cylinder(2.1,1.25,1.25,8).translate([0,0,42.5]);let needle=Manifold.cylinder(3.9,1.25,.48,8).translate([0,0,44.6]);
let parts0=[nave,transept,...sides,choir,drum,dome,lantern,needle];
// Vier gemetselde hoektorens rond de viering met naaldvormige spitsen.
for(const x of [-8.3,8.3])for(const y of [-8.3,8.3]){parts0.push(Manifold.cylinder(25.5,2.15,2.15,8).translate([x,y,BASE]));parts0.push(Manifold.cylinder(7.7,2.15,.48,8).translate([x,y,25.0]))}
let church=Manifold.union(parts0);
// Wijzerplaten worden blinde ronde nissen; de wijzers zijn te klein om te printen.
for(const a of [0,90,180,270]){let dial=Manifold.cylinder(.65,1.2,1.2,16).rotate([90,0,0]).translate([0,6.0,37.0]).rotate([0,0,a]);church=church.subtract(dial)}
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-21,-15])for(const y of [-10.75,11.25])church=church.subtract(niche(x,y,2.5,1.25,5.3));
for(const x of [12.2,15.5,19])for(const y of [-18.65,19.15])church=church.subtract(niche(x,y,1.5,1.2,2.5));
for(const y of [-3,0,3]){let n=niche(0,0,BASE,1.5,4).rotate([0,0,90]).translate([-28.2,y,0]);church=church.subtract(n)}
for(const y of [-2.8,0,2.8]){let n=niche(0,0,7.0,1.3,8.5).rotate([0,0,90]).translate([-28.2,y,0]);church=church.subtract(n)}
for(const x of [-3,0,3])for(const y of [-18.15,18.65])church=church.subtract(niche(x,y,6,1.25,8));
for(const a of [0,90,180,270]){let n=niche(0,6.45,29.5,1.4,2.4).rotate([0,0,a]);church=church.subtract(n)}
for(const x of [-8.3,8.3])for(const y of [-8.3,8.3])for(const a of [0,90,180,270]){let n=niche(0,2.47,21.4,1.0,2.5).rotate([0,0,a]).translate([x,y,0]);church=church.subtract(n)}
for(const x of [-24,-18,-12])for(const side of [-1,1]){let b=box(x-.5,x+.5,side<0?-11.9:10.8,side<0?-10.8:11.9,BASE,9.0);b=plane(b,0,side<0?1:-1,21);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Heilig Hart van Jezuskerk Roermond",origin:ORIGIN,xAxis:X_AXIS,groundHeight:27.415,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0957100000260553"],description:"Kruiskerk met achthoekige vieringtoren, koepel en vier hoektorens.",realWorld:{groundNapM:27.415,ahn5TopNapM:75.986},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0957100000260553","https://monumentenregister.cultureelerfgoed.nl/monumenten/520535","https://www.kerkgebouwen-in-limburg.nl/kerken/roermond/h-hart-van-jezus","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-de-wingerd-hart-heilige-parochie-roermond.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








