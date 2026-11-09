// Augustinuskerk Nieuwendam: bouwdelen en dakvlakken, maten in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="augustinuskerk-amsterdam";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[124242.5,489393],X_AXIS=[.26,.966];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en vijfzijdig koor met steile langskap.
let hall=box(0,32,-4.5,4.1,BASE,19.4);hall=plane(hall,0,1.23,19.15);hall=plane(hall,0,-1.23,19.65);
let choir=prism([[30,-4.5],[34.8,-3.6],[37.3,-1.5],[37.3,1.2],[34.8,3.6],[30,4.1]],BASE,19.4);choir=plane(choir,0,1.23,19.15);choir=plane(choir,0,-1.23,19.65);choir=plane(choir,-1,0,53);
// Lagere zijbeuken met lessenaarskappen.
let left=box(.5,24.5,-7.2,-4,BASE,12.8);left=plane(left,0,1.0,16.8);
let right=box(.5,24.5,3.8,7.2,BASE,12.8);right=plane(right,0,-1.0,16.8);
// Driezijdige transeptkoppen, kappen als afzonderlijke vlakken.
function transept(sign){let p=[[22.2,3.7],[22.2,6.5],[24.5,8.6],[30.8,8.6],[32.2,7.0],[32.2,3.7]]; if(sign<0)p=p.map(([x,y])=>[x,-y]); else p.reverse();let s=prism(p,BASE,18);s=plane(s,1,0,-8.4);s=plane(s,-1,0,44.4);s=plane(s,0,-sign*1.0,24.1);return s;}
let tran1=transept(1),tran2=transept(-1);
// Zijdeuren naast de fronttoren en lagere noordelijke kapellen.
let porch1=box(-1,4.8,3,7.5,BASE,12.5);porch1=plane(porch1,1,0,7.7);porch1=plane(porch1,-1,0,15.8);porch1=plane(porch1,0,-1,17.6);
let porch2=box(-1,4.8,-7.5,-3,BASE,12.5);porch2=plane(porch2,1,0,7.7);porch2=plane(porch2,-1,0,15.8);porch2=plane(porch2,0,1,17.6);
let chapel1=box(31,35.5,3,6.7,BASE,13);chapel1=plane(chapel1,0,-1.0,17.5);chapel1=plane(chapel1,-1.0,0,46);
let chapel2=box(31,35.5,-6.7,-3,BASE,13);chapel2=plane(chapel2,0,1.0,17.5);chapel2=plane(chapel2,-1.0,0,46);
let rearAnnex=box(32,38.7,6.5,9.8,BASE,8.3);
// Toren en 8-zijdige spits uit AHN; kruis vereenvoudigd voor 1:1000.
let tower=box(-2.8,3,-3.3,2.8,BASE,26.3);
let spire=Manifold.cylinder(17.2,3.9,.48,8).rotate([0,0,22.5]).translate([.1,-.25,26.1]);
let church=Manifold.union([hall,choir,left,right,tran1,tran2,porch1,porch2,chapel1,chapel2,rearAnnex,tower,spire]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [7,11.5,16,20.5])for(const y of [-6.8,7.6])church=church.subtract(niche(x,y,3.8,1.5,5.1));
for(const x of [24.5,28,31])for(const y of [-8.2,9])church=church.subtract(niche(x,y,4,1.4,7.8));
for(const x of [32.5,35])for(const y of [-6.3,7.1])church=church.subtract(niche(x,y,4,1.2,5.1));
church=church.subtract(niche(0,.4,5,1.4,7).rotate([0,0,-90]).translate([37.3,0,0]));
for(const a of [0,180])for(const x of [-1.2,1.2])church=church.subtract(niche(x,3.5,19,1.2,5).rotate([0,0,a]));
for(const a of [90,270])for(const x of [-1.2,1.2])church=church.subtract(niche(x,3.5,19,1.2,5).rotate([0,0,a]));
church=church.subtract(niche(0,.4,2,1.7,4).rotate([0,0,90]).translate([-2.8,0,0]));
for(const x of [5,9.3,13.8,18.3,22.7])for(const y of [-7.25,7.25])church=Manifold.union([church,box(x-.5,x+.5,y-.45,y+.45,BASE,8)]);
for(const x of [-2.6,2.8])for(const y of [-3.2,2.7])church=Manifold.union([church,box(x-.5,x+.5,y-.5,y+.5,BASE,15)]);
const parts=[["building:kerk",church]];
const META={name:"Augustinuskerk Amsterdam",origin:ORIGIN,xAxis:X_AXIS,groundHeight:-1.11,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0363100012120986"],description:"Neogotische Augustinuskerk Nieuwendam met fronttoren, zijbeuken en driezijdige transepten.",realWorld:{groundNapM:-1.11,ahn5TowerNapM:42.16},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012120986","https://monumentenregister.cultureelerfgoed.nl/monumenten/508533","https://commons.wikimedia.org/wiki/Category:Augustinuskerk_(Amsterdam-Noord)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-meeuwen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));











