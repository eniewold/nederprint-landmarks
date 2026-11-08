import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="antoniuskerk-kantens";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[237965,598409.5],X_AXIS=[.9935,.114];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip op de wierde: gevelvlakken en een dak met twee dakvlakken.
let ship=box(-1.17,29.05,-5.81,4.98,BASE,7.35);
let roof=box(-1.17,29.05,-5.81,4.98,7.3,14.3);
roof=plane(roof,0,1.285,14.83);roof=plane(roof,0,-1.285,13.77);
// Achtkantige toren met leien naald; spits ligt net onder de losse topmeting.
let tower=Manifold.cylinder(21.8-BASE,3.85,3.85,8,false).rotate([0,0,22.5]).translate([.55,-.4,BASE]);
let spire=Manifold.cylinder(14.8,3.85,.48,8,false).rotate([0,0,22.5]).translate([.55,-.4,21.75]);
// Monumentale schuine steunbeer aan westzijde, met spitsbogige doorgang.
let buttress=Manifold.hull([[-8.3,-.75,BASE],[-8.3,.75,BASE],[-1.8,-.75,BASE],[-1.8,.75,BASE],[-1.8,-.75,15.5],[-1.8,.75,15.5]]);
let passage=prism([[-5.35,-.5],[-3.15,-.5],[-3.15,3.1],[-4.25,4.45],[-5.35,3.1]],0,2.0).rotate([90,0,0]).translate([0,1,0]);buttress=buttress.subtract(passage);
let church=Manifold.union([ship,roof,tower,spire,buttress]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [12.0,18.1,23.2])church=church.subtract(arch(x,-5.46,2.5,1.4,3.4));
for(const x of [8,13,18,23])church=church.subtract(arch(x,5.33,2.6,1.2,3.3));
church=church.subtract(arch(0,0,BASE,1.5,2.6).rotate([0,0,-90]).translate([29.4,-.4,0]));
for(const y of [-2.2,1.4])church=church.subtract(arch(y,0,8.7,1,1.6).rotate([0,0,-90]).translate([29.4,0,0]));
for(const i of [0,1,2,3,4,5,6,7]){const ang=i*45;const cutter=arch(0,0,17.3,1.05,3.5).translate([0,3.8,0]).rotate([0,0,ang]).translate([.55,-.4,0]);church=church.subtract(cutter);}
const parts=[["building:kerk",church]];
const META={name:"Antoniuskerk Kantens",origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.86,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1651100000012616"],description:"Eenbeukige kerk met achtkante toren en westelijke boogsteunbeer op de wierde.",realWorld:{groundNapM:4.86,ahnPeakNapM:43.47,ahnAdjacentNapM:41.45},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000012616","https://monumentenregister.cultureelerfgoed.nl/monumenten/23456","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Kantens","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.pgksr.nl/antoniuskerk"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-antoniuskerk-kantens.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





