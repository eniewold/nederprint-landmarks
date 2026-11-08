import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-landricuskerk-echt";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[188632,346503],X_AXIS=[.995,-.1];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Driebeukige hallenkerk: de drie even hoge nokken en goten als echte vlakken.
let parts0=[];
for(const y of [-6.1,0,6.1]){let b=box(-15.0,16.0,y-3.12,y+3.12,BASE,19.9); b=plane(b,0,1.35,19.9-1.35*y);b=plane(b,0,-1.35,19.9+1.35*y);parts0.push(b)}
// Driezijdig gesloten koor en lagere nevenruimten.
let choir=prism([[15.8,-5.9],[21.5,-5.9],[25.0,-2.7],[26.0,0],[25.0,2.7],[21.5,5.9],[15.8,5.9]],BASE,19.9);choir=plane(choir,0,1.35,19.9);choir=plane(choir,0,-1.35,19.9);choir=plane(choir,-1.35,0,19.9+1.35*22.0);parts0.push(choir);
let sac=box(15.5,24,-11.0,-5.8,BASE,8.1);sac=plane(sac,0,1,19);parts0.push(sac);
// Toren met getrapte bakstenen romp en moderne lantaarn, uitgewerkt als gesloten massa met nissen.
parts0.push(box(-23,-14.7,-4.4,4.4,BASE,32.5));
parts0.push(box(-22.3,-15.4,-3.8,3.8,31.8,43.7));
parts0.push(box(-21.2,-16.5,-2.7,2.7,43.4,50.1));
let cap=box(-21.2,-16.5,-2.7,2.7,49.8,53.7);cap=plane(cap,1.35,0,53.7+1.35*18.85);cap=plane(cap,-1.35,0,53.7-1.35*18.85);cap=plane(cap,0,1.35,53.7);cap=plane(cap,0,-1.35,53.7);parts0.push(cap);
// Achtkantige traptoren aan de zuidwestzijde.
parts0.push(Manifold.cylinder(16.5,1.8,1.8,8).translate([-19,-5.1,BASE]));parts0.push(Manifold.cylinder(6.2,1.8,.48,8).translate([-19,-5.1,16.0]));
let church=Manifold.union(parts0);
for(const x of [-13,-8.6,-4.2,.2,4.6,9,13.4])for(const side of [-1,1]){let b=box(x-.48,x+.48,side<0?-10.1:8.9,side<0?-8.9:10.1,BASE,10.8);b=plane(b,0,side<0?1:-1,20.7);church=church.add(b)}
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-10.8,-6.4,-2,2.4,6.8,11.2])for(const y of [-8.7,9.5])church=church.subtract(niche(x,y,3,1.65,8.2));
for(const [z,h,rY,rX] of [[21,6,4.7,4.45],[34,7,4.1,3.75],[44.5,4.4,3,2.65]])for(const a of [0,90,180,270])for(const dx of [-.95,.95]){let cut=niche(dx,a%180===0?rY:rX,z,.7,h);cut=cut.rotate([0,0,a]).translate([-18.85,0,0]);church=church.subtract(cut)}
for(const x of [-9,0,9])for(const y of [-7.3,7.3]){let d=box(x-.5,x+.5,y-.5,y+.5,15,16.9);d=plane(d,1,0,16.9-x);d=plane(d,-1,0,16.9+x);church=church.add(d)}
const parts=[["building:kerk",church]];
const META={name:"Sint-Landricuskerk Echt",origin:ORIGIN,xAxis:X_AXIS,groundHeight:29.23,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1711100000004021"],description:"Driebeukige hallenkerk met driezijdig koor en moderne gesloten torenbekroning met nissen.",realWorld:{groundNapM:29.23,ahnTopNapM:84.69},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1711100000004021","https://www.kerkgebouwen-in-limburg.nl/kerken/echt/landricus","https://commons.wikimedia.org/wiki/Category:Sint_Landricuskerk,_Echt,_Limburg","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-landricuskerk-echt.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








