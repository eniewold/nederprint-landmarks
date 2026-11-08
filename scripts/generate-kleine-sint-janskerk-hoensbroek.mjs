import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kleine-sint-janskerk-hoensbroek";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[192760,326081],X_AXIS=[.897,.442];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en vlak gesloten koor delen een doorlopende nok en een afgewolfde oostkant.
let body=box(-8.1,14.2,-2.65,2.65,BASE,10.8);body=plane(body,0,1.9,10.8);body=plane(body,0,-1.9,10.8);body=plane(body,-1.9,0,10.8+1.9*12.5);
// De zijbeuken hebben lessenaarsdaken.
let north=box(-8.1,6.4,2.5,5.15,BASE,6.1);north=plane(north,0,-.55,7.55);
let south=box(-8.1,6.4,-5.15,-2.5,BASE,6.1);south=plane(south,0,.55,7.55);
let sac=box(6.2,11.8,-5.2,-2.4,BASE,5.0);sac=plane(sac,0,.65,7.8);
// De romaanse toren heeft een vierkante romp en een ingesnoerde achtzijdige spits.
let tower=box(-13.3,-8.0,-2.55,2.55,BASE,14.9);
let skirt=Manifold.cylinder(1.35,3.5,3.5,4).rotate([0,0,45]).translate([-10.65,0,14.8]);
let spire=Manifold.cylinder(8.55,2.5,.48,8).translate([-10.65,0,16.15]);
let church=Manifold.union([body,north,south,sac,tower,skirt,spire]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.5).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-5.7,-1.8,2.1])for(const y of [-4.9,5.4])church=church.subtract(niche(x,y,1.5,1.05,2.8));
for(const x of [8.1,11.3])for(const y of [2.9])church=church.subtract(niche(x,y,1.7,1.0,3.6));
for(const a of [0,90,180,270]){let n=niche(0,2.8,10.9,.9,2.3).rotate([0,0,a]).translate([-10.65,0,0]);church=church.subtract(n)}
let entrance=niche(0,0,BASE,1.4,2.5).rotate([0,0,90]).translate([-13.55,0,0]);church=church.subtract(entrance);
const parts=[["building:kerk",church]];
const META={name:"Kleine Sint-Janskerk Hoensbroek",origin:ORIGIN,xAxis:X_AXIS,groundHeight:80.795,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0917100000001478"],description:"Kleine pseudobasiliek met lagere zijbeuken, koor, sacristie en ingesnoerde torenspits.",realWorld:{groundNapM:80.795,ahnTopNapM:105.55},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0917100000001478","https://www.kerkramenindemijnstreek.nl/kerken/hoensbroek-kleine-st-jankerk/","https://commons.wikimedia.org/wiki/Category:Sint-Janskerk_(Hoensbroek)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kleine-sint-janskerk-hoensbroek.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








