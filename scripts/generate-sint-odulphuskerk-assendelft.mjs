// Sint-Odulphuskerk en verbonden pastorie, Assendelft; bouwdelen in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-odulphuskerk-assendelft";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[111441,498766],X_AXIS=[.5,.8660254];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip, dwarsbeuk en lagere zijbeuken met hun eigen dakvlakken.
let hall=box(-17.4,26.5,-5.6,5.3,BASE,20.4);hall=plane(hall,0,1.15,20.1);hall=plane(hall,0,-1.15,20.7);
let transept=box(-1.5,8.2,-12.6,15.1,BASE,20.4);transept=plane(transept,1.28,0,16.1);transept=plane(transept,-1.28,0,24.7);
let aisle1=box(-12,20,-12.3,-5.4,BASE,10.5);aisle1=plane(aisle1,0,.5,16.8);
let aisle2=box(-12,20,5.1,10.5,BASE,10.5);aisle2=plane(aisle2,0,-.5,16);
// Halfronde koorapsis en twee ronde zijkapellen met kegelvormige daken.
function apse(x,y,r,wall,roof){return Manifold.union([Manifold.cylinder(wall-BASE,r,r,24).translate([x,y,BASE]),Manifold.cylinder(roof,r,0,24).translate([x,y,wall-.05])]);}
let choir=apse(-17.3,-.8,3.7,14.1,4.5),chapel1=apse(-11.9,-8.9,2.55,9.6,2.4),chapel2=apse(-14.1,17,3.3,9.3,3.1);
let port=box(1,7.7,-16.6,-11.8,BASE,9.7);port=plane(port,1,0,5.3);port=plane(port,-1,0,14.3);
// Vierkante zijtoren met frontalen en hoge vierzijdige naaldspits.
let tower=box(20,26.5,-12.4,-5.7,BASE,30.3);
let frontals=[];for(const rot of [0,90,180,270]){let g=box(-3.4,3.4,2.8,3.35,30,33.3);g=plane(g,1,0,33.3);g=plane(g,-1,0,33.3);frontals.push(g.rotate([0,0,rot]).translate([23.25,-9.05,0]));}
let spire=Manifold.cylinder(21.5,4.7,.48,4).rotate([0,0,45]).translate([23.25,-9.05,30.2]);
// Pastorie en verbindingsdeel vallen binnen hetzelfde BAG-pand als de kerk.
let parsonage=prism([[-37.9,15],[-35.2,7.6],[-21.3,5.6],[-20.6,8],[-19,17.6],[-19,22.2],[-23.7,26.6],[-34.2,28.1],[-36.2,26.7]],BASE,13.1);parsonage=plane(parsonage,1,0,46.2);parsonage=plane(parsonage,-1,0,-13.0);parsonage=plane(parsonage,0,1,.8);parsonage=plane(parsonage,0,-1,35.5);
let connection=Manifold.union([box(-20,-15,11,17.8,BASE,7.8),box(-15,0,9.5,17,BASE,8.5)]);
let church=Manifold.union([hall,transept,aisle1,aisle2,choir,chapel1,chapel2,port,tower,spire,parsonage,connection,...frontals]);
const niche=(x,y,z,w,h)=>{let r=w/2;let p=[[-r,0],[r,0],[r,h-r],[0,h],[-r,h-r]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-8,-3,12,17])church=church.subtract(niche(x,-11.9,2,1.3,5.1)); for(const x of [12,17])church=church.subtract(niche(x,10.9,2,1.3,5.1));
for(const x of [-8,-3,12,17]) { church=church.subtract(Manifold.cylinder(.8,.95,.95,16).rotate([90,0,0]).translate([x,5.7,14.4])); church=church.subtract(Manifold.cylinder(.8,.95,.95,16).rotate([-90,0,0]).translate([x,-6.0,14.4])); }
church=church.subtract(niche(0,.4,4,1.4,6).rotate([0,0,90]).translate([-21,-.8,0]));
church=church.subtract(Manifold.cylinder(.8,1,1,16).rotate([-90,0,0]).translate([3.4,-13,17.2]));
for(const x of [2.2,5.2])for(const y of [-12.2,15.5])church=church.subtract(niche(x,y,8,1.4,4.6));
for(const rot of [0,90,180,270])for(const x of [-1.1,1.1])church=church.subtract(niche(x,3.7,24,1.2,4).rotate([0,0,rot]).translate([23.25,-9.05,0]));
for(const x of [-33,-29,-25]){const y=23.214-.14286*x+.3;church=church.subtract(niche(x,y,3,1.4,3.5));}
const parts=[["building:kerk",church]];
const META={name:"Sint-Odulphuskerk Assendelft",origin:ORIGIN,xAxis:X_AXIS,groundHeight:-.795,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0479100000000550"],description:"Neoromaanse kruiskerk met zijtoren, ronde apsiden en verbonden pastorie.",realWorld:{groundNapM:-.795,ahn5TowerNapM:51.01},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0479100000000550","https://monumentenregister.cultureelerfgoed.nl/monumenten/39923","https://commons.wikimedia.org/wiki/Category:Sint-Odulphuskerk_(Assendelft)","https://www.ahn.nl/dataroom"]};
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













