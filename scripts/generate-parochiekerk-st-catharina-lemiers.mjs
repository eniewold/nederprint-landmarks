import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="parochiekerk-st-catharina-lemiers";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[197674,310910],X_AXIS=[.667,.745];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Driebeukig schip en koor: echte zadeldakvlakken met driezijdige koorsluiting.
let core=prism([[-10,-3.5],[12,-3.5],[15,-2],[16,0],[15,2],[12,3.5],[-10,3.5]],BASE,14.45);core=plane(core,0,1,14.45);core=plane(core,0,-1,14.45);core=plane(core,-1.25,0,14.45+1.25*12);
let south=box(-8.5,4,-7.1,-3.35,BASE,8.3);south=plane(south,0,.4,9.65);
let north=box(-8.5,4,3.35,7.1,BASE,8.3);north=plane(north,0,-.4,9.65);
// Dwarspand heeft dwars op de nok een eigen zadeldak.
let transept=box(3.0,9.1,-10.2,10.2,BASE,14.45);transept=plane(transept,1.1,0,14.45-1.1*6.05);transept=plane(transept,-1.1,0,14.45+1.1*6.05);
let church=Manifold.union([core,north,south,transept]);
// Twee gelijke westtorens met vier frontalen en achthoekige spitsen.
for(const y of [-4.45,4.45]){
 let tower=box(-13.5,-8.9,y-2.25,y+2.25,BASE,18.5);
 let cap=box(-13.5,-8.9,y-2.25,y+2.25,17.7,20.2);cap=plane(cap,1,0,20.2+11.2);cap=plane(cap,-1,0,20.2-11.2);cap=plane(cap,0,1,20.2-y);cap=plane(cap,0,-1,20.2+y);
 let spire=Manifold.cylinder(6.4,2.15,.48,8).translate([-11.2,y,18.4]);
 church=Manifold.union([church,tower,cap,spire]);
}
// Kleine dakruiter op de viering, verbreed voor een bruikbare print.
church=church.add(Manifold.cylinder(2.6,.55,.47,8).translate([6.05,0,14.2]));
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
// De hoofdtoegang en het roosvenster liggen centraal tussen de torens.
church=church.subtract(niche(0,0,BASE,1.7,3.4).rotate([0,0,90]).translate([-10.2,0,0]));
church=church.subtract(Manifold.cylinder(.6,1.4,1.4,16).rotate([0,90,0]).translate([-10.2,0,8.7]));
// De roosvensters in de beide topgevels van het dwarspand.
for(const side of [-1,1]){
 let rose=Manifold.cylinder(.6,1.3,1.3,16).rotate([90*side,0,0]).translate([6.05,side*10.4,9.4]);
 church=church.subtract(rose);
}
for(const x of [-6.5,-3.4,-.3])for(const y of [-6.85,7.35])church=church.subtract(niche(x,y,2.3,1.0,3.4));
for(const y0 of [-4.45,4.45])for(const z of [11.8,15.2])for(const a of [0,90,180,270]){let n=niche(0,2.5,z,1.1,2.4).rotate([0,0,a]).translate([-11.2,y0,0]);church=church.subtract(n)}
for(const sign of [-1,1])for(const x of [3.4,8.5]){let b=box(x-.46,x+.46,sign<0?-10.8:10,sign<0?-10:10.8,BASE,9.1);b=plane(b,0,sign<0?1:-1,19.8);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Parochiekerk St. Catharina Lemiers",origin:ORIGIN,xAxis:X_AXIS,groundHeight:153.02,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0981100000015381"],description:"Basilicale kruiskerk met twee achthoekige torenspitsen.",realWorld:{groundNapM:153.02,ahnTopNapM:178.19},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0981100000015381","https://www.kerkgebouwen-in-limburg.nl/kerken/lemiers/catharina-van-alexandrie","https://kerkfotografie.nl/heilige-catharina-van-alexandrie-lemiers/","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-parochiekerk-st-catharina-lemiers.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








