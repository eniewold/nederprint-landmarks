import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-opijnen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X langs de nok, oostwaarts; hoogtes boven maaiveld ca. +4,0 m NAP.
const BASE=-0.3,ORIGIN=[149034,426616],X_AXIS=[0.99972,-0.0237];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const box=(x,y,z,cx,cy,cz)=>Manifold.cube([x,y,z],true).translate([cx,cy,cz]);
// Zaal met afgeschuinde koorhoeken, muur en twee dakvlakken.
const footprint=[[-10.2,-4.55],[12.0,-4.55],[13.4,-3.1],[13.4,2.8],[11.9,4.35],[-10.2,4.35]];
const hall=prism(footprint,BASE,8.35);
const hallRoof=Manifold.hull([...footprint.map(([x,y])=>[x,y,8.3]),[-10.2,-.1,13],[11.7,-.1,13]]);
// Bakstenen toren heeft drie gemetselde geledingen en een achtkantige leien naald.
const tower=prism(rect(-14.0,-10,-2.0,1.95),BASE,17.5);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[-12+r*Math.cos(Math.PI/8+i*Math.PI/4),-.025+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(2.12,17.45),...oct(.45,24.05)]);
// Steunberen tegen de lange gevels zijn prismatische metselwerkdelen.
const braces=[];
for(const sign of [-1,1]) for(const x of [-6.6,-1.6,3.4,8.4]) {
 const y=sign<0?-4.75:4.55;
 braces.push(box(1.05,1.05,5.2,x,y,2.3));
 braces.push(Manifold.hull([[x-.525,y-.525,4.8],[x+.525,y-.525,4.8],[x-.525,y+.525,4.8],[x+.525,y+.525,4.8],[x-.525,sign<0?-4.5:4.3,5.8],[x+.525,sign<0?-4.5:4.3,5.8]]));
}
// Steunberen aan weerszijden van de torenaansluiting.
for(const sign of [-1,1]) {
 const y=sign*2.3;
 braces.push(box(1.2,1.15,6.3,-10.15,y,2.85));
 braces.push(Manifold.hull([[-10.75,y-.575,5.9],[-9.55,y-.575,5.9],[-10.75,y+.575,5.9],[-9.55,y+.575,5.9],[-10.75,sign*1.8,7.0],[-9.55,sign*1.8,7.0]]));
}
let church=Manifold.union([hall,hallRoof,tower,spire,...braces]);
// Op elke zijgevel vier blinde rondboogvensters: afgeschuinde bovenzijde is printbaar.
const arch=(a,z,w,h,r)=>{const n=a*Math.PI/180;return prism([[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]],0,.7).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(r-.5),Math.sin(n)*(r-.5),z]);};
for(const sign of [-1,1]) for(const x of [-8.6,-3.6,1.4,6.4]) church=church.subtract(arch(sign<0?-90:90,2.1,1.35,3.5,4.5).translate([x,0,0]));
// Westportaal en de galmgaten, herkenbaar op de vier torenzijden.
church=church.subtract(arch(180,0,1.7,3.2,2).translate([-12,0,0]));
for(const a of [90,180,270]) {
  church=church.subtract(arch(a,13.0,1.25,2.55,2).translate([-12,0,0]));
  church=church.subtract(arch(a,7.6,1.25,2.5,2).translate([-12,0,0]));
}
const parts=[["building:kerk",church]];
const META={name:"Nederlands Hervormde Kerk Opijnen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.0,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0304100000002758"],description:"Witgepleisterde zaalkerk met westtoren, spits en steunberen.",realWorld:{groundNapM:4.0},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0304100000002758","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/30337","https://monumentenregister.cultureelerfgoed.nl/monumenten/30338","https://www.kerkopijnen.nl/historie"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nederlands-hervormde-kerk-opijnen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

