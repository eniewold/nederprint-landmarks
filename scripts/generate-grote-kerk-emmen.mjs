// Grote Kerk (Grote of Pancratiuskerk) in Emmen, opgebouwd uit muren, planvlakken,
// hipped roofs and the tower's changing octagonal profiles; no stacked height layers.
// Measurements are metres in RD/local building axes; source and estimates are documented in the model README.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => { const i = argv.indexOf(name); return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback; };
const scale = Number(flag("--scale", "1000"));
const slug = "grote-kerk-emmen";
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), slug);
const mmPerMetre = 1000 / scale;
const wasm = await Module(); wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);
const BASE = -0.3;
const ORIGIN = [256678.5, 534157.0];
const GROUND_NAP = 23.1;
const NAP = (height) => height - GROUND_NAP;
const X_AXIS = [1, 0]; // 0° RD, west tower to the east end of the church

const ccw = (pts) => {
  let a = 0;
  pts.forEach(([x0,y0],i) => { const [x1,y1]=pts[(i+1)%pts.length]; a += x0*y1-x1*y0; });
  return a > 0 ? pts : [...pts].reverse();
};
const rect = (x0,x1,y0,y1) => [[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const prism = (poly,z0,z1) => Manifold.extrude(new CrossSection([ccw(poly)]), z1-z0).translate([0,0,z0]);
const oct = ([cx,cy], across) => {
  const r = across/(2*Math.cos(Math.PI/8));
  return Array.from({length:8},(_,k)=>{const a=Math.PI/8+k*Math.PI/4;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
};
const loft = (sections) => Manifold.union(sections.slice(1).map(([z1,p1],i)=>{
  const [z0,p0]=sections[i]; return Manifold.hull([...p0.map(([x,y])=>[x,y,z0]),...p1.map(([x,y])=>[x,y,z1])]);
}));
const hipped = (x0,x1,y0,y1,eave,ridge,axis="x") => {
  const pts=[[x0,y0,eave],[x1,y0,eave],[x1,y1,eave],[x0,y1,eave]];
  if(axis==="x") { const half=(y1-y0)/2, cy=(y0+y1)/2; pts.push([x0+half,cy,ridge],[x1-half,cy,ridge]); }
  else { const half=(x1-x0)/2, cx=(x0+x1)/2; pts.push([cx,y0+half,ridge],[cx,y1-half,ridge]); }
  return Manifold.hull(pts);
};
// A shallow, pointed blind niche in a face; 0° faces east, 90° north, 180° west, 270° south.
const profileX = (pts,x0,x1) => Manifold.extrude(new CrossSection([ccw(pts)]),x1-x0)
  .transform([0,1,0,0,0,0,1,0,1,0,0,0,x0,0,0,1]);
const niche = ([cx,cy],angle,a,s,w,z0,z1,d=0.45) => profileX(
  [[s-w/2,z0],[s+w/2,z0],[s+w/2,z1],[s,z1+0.6*(w/2)],[s-w/2,z1]],a-d,a+0.15,
).rotate([0,0,angle]).translate([cx,cy,0]);
const box = (x0,x1,y0,y1,z0,z1) => prism(rect(x0,x1,y0,y1),z0,z1);

const solids=[];
// Church base and waterstaat-style cruciform walls (the BAG/OSM outline is about 39 × 31 m).
const eaveNave=NAP(32.6), ridgeNave=NAP(39.0);
const eaveCross=NAP(32.8), ridgeCross=NAP(38.9);
const eaveChoir=NAP(32.1), ridgeChoir=NAP(38.4);
solids.push(box(-11.0,3.3,-6.1,6.1,BASE,eaveNave));
solids.push(box(2.4,14.1,-14.0,14.6,BASE,eaveCross));
solids.push(box(13.7,20.0,-6.1,6.3,BASE,eaveChoir));
// Hipped roofs extruded as closed polyhedra from eave corners to the ridge; the crossing roofs union at the transept.
solids.push(hipped(-11.0,3.3,-6.1,6.1,eaveNave,ridgeNave,"x"));
solids.push(hipped(2.4,14.1,-14.0,14.6,eaveCross,ridgeCross,"y"));
solids.push(hipped(13.7,20.0,-6.1,6.3,eaveChoir,ridgeChoir,"x"));
// Simple inset cross-structure and a small sacristy at the south-east, from the orthophoto.
solids.push(box(13.8,19.0,-9.2,-6.0,BASE,NAP(27.0)));
solids.push(hipped(13.8,19.0,-9.2,-6.0,NAP(27.0),NAP(29.5),"x"));

// Full-height Doric pilaster bands at the two-bay nave, one transept bay and choir.
for(const x of [-9.0,-3.7,1.4,15.0,18.5]){
  const ztop=x<3.0?eaveNave:eaveChoir;
  solids.push(box(x-0.5,x+0.5,-6.48,-5.98,BASE,ztop),box(x-0.5,x+0.5,5.98,6.68,BASE,ztop));
}
for(const x of [3.4,7.9,12.9]) solids.push(box(x-0.5,x+0.5,-14.45,-13.88,BASE,eaveCross),box(x-0.5,x+0.5,14.48,15.05,BASE,eaveCross));// Romanesque west tower, with a coarse fieldstone plinth, tall brick shaft, gallery, octagonal clock stage and spire.
const TC=[-14.95,-0.45];
const towerBase=rect(-19.2,-10.7,-4.7,3.8);
solids.push(prism(towerBase,BASE,NAP(40.0)));
// Squared stone plinth: broad blocks touch the ground and are fused to the shaft.
for(const [x0,x1,y0,y1] of [
  [-19.5,-17.4,-5.0,-4.35],[-17.3,-14.8,-5.0,-4.35],[-14.7,-10.4,-5.0,-4.35],
  [-19.5,-18.8,-4.2,-1.8],[-19.5,-18.8,-1.6,1.0],[-19.5,-18.8,1.2,4.1],
  [-19.5,-17.0,3.45,4.1],[-16.8,-13.5,3.45,4.1],[-13.3,-10.4,3.45,4.1],
]) solids.push(box(x0,x1,y0,y1,BASE,NAP(25.8)));
// Lisenes at the outer faces of the square shaft, broad enough to read at 1:1000.
for(const x of [-18.6,-16.9,-13.0,-11.3]) solids.push(box(x-0.45,x+0.45,-5.0,-4.48,BASE,NAP(39.8)),box(x-0.45,x+0.45,3.55,4.05,BASE,NAP(39.8)));
for(const y of [-3.7,2.8]) solids.push(box(-19.52,-18.98,y-0.45,y+0.45,BASE,NAP(39.8)));// Slightly splayed shoulder to the terrace; the outward underside rises at 45°.
solids.push(Manifold.hull([
  [-19.2,-4.7,NAP(39.3)],[-10.7,-4.7,NAP(39.3)],[-10.7,3.8,NAP(39.3)],[-19.2,3.8,NAP(39.3)],
  [-19.65,-5.15,NAP(40.2)],[-10.25,-5.15,NAP(40.2)],[-10.25,4.25,NAP(40.2)],[-19.65,4.25,NAP(40.2)],
]));
// Solid, printable substitute for the thin iron gallery balustrade.
solids.push(box(-19.65,-10.25,-5.15,4.25,NAP(40.2),NAP(41.2)));
solids.push(Manifold.hull([
  [-19.65,-5.15,NAP(41.2)],[-10.25,-5.15,NAP(41.2)],[-10.25,4.25,NAP(41.2)],[-19.65,4.25,NAP(41.2)],
  [-19.15,-4.65,NAP(41.7)],[-10.75,-4.65,NAP(41.7)],[-10.75,3.75,NAP(41.7)],[-19.15,3.75,NAP(41.7)],
]));
// Octagonal upper stage with four large clock/arched window bays, and a concave, eight-sided slate spire.
solids.push(loft([[NAP(41.6),oct(TC,8.1)],[NAP(47.0),oct(TC,8.1)]]));
solids.push(loft([
  [NAP(47.0),oct(TC,8.1)],[NAP(48.1),oct(TC,7.3)],[NAP(49.3),oct(TC,5.9)],
  [NAP(51.2),oct(TC,4.4)],[NAP(53.2),oct(TC,2.8)],[NAP(55.0),oct(TC,1.4)],
  [NAP(56.3),oct(TC,0.35)],[NAP(57.2),[[TC[0],TC[1]]]],
]));
// The slender horizontal wind vane is omitted at 1:1000; the spire tapers to a printable point.

let complex=Manifold.union(solids);
// Pointed, shallow facade openings are made as real solids crossing the exterior face.
// This keeps the arched cuts open to the outside and avoids enclosed internal voids.
const opening=(profile,axis,lo,hi)=>Manifold.hull(profile.flatMap(([u,z])=>axis==='y'?[[u,lo,z],[u,hi,z]]:[[lo,u,z],[hi,u,z]]));
const pointed=(u,w,z0,z1,apex,axis,lo,hi)=>opening([[u-w/2,z0],[u+w/2,z0],[u+w/2,z1],[u,apex],[u-w/2,z1]],axis,lo,hi);
const cuts=[];
// Three levels of Romanesque paired arches on the tower's north and south faces, plus the west face.
for(const [z0,z1,apex] of [[3.5,6.1,7.0],[8.5,11.1,12.0],[13.4,15.6,16.3]]){
  for(const x of [-17.2,-12.7]){
    cuts.push(pointed(x,1.0,NAP(z0),NAP(z1),NAP(apex),'y',-4.92,-4.48));
    cuts.push(pointed(x,1.0,NAP(z0),NAP(z1),NAP(apex),'y',3.55,4.00));
  }
  for(const y of [-2.6,1.3]) cuts.push(pointed(y,1.0,NAP(z0),NAP(z1),NAP(apex),'x',-19.45,-18.95));
}
// Raised round-headed entrance panel on the west tower face; relief stays support-free at 1:1000.
const doorRelief=opening([
  [-1.6,BASE],[0.7,BASE],[0.7,NAP(25.8)],
  [0.5,NAP(26.35)],[0.1,NAP(26.75)],[-0.45,NAP(26.9)],
  [-1.0,NAP(26.75)],[-1.4,NAP(26.35)],[-1.6,NAP(25.8)],
], 'x',-19.65,-19.1);
// Four tall openings in the octagonal belfry; their pointed heads stay open on the face.
for(const u of [-1.9,1.9]){
  cuts.push(pointed(TC[1]+u,2.0,NAP(43.2),NAP(46.0),NAP(47.2),'x',TC[0]-4.7,TC[0]-3.7));
  cuts.push(pointed(TC[1]+u,2.0,NAP(43.2),NAP(46.0),NAP(47.2),'x',TC[0]+3.7,TC[0]+4.7));
  cuts.push(pointed(TC[0]+u,2.0,NAP(43.2),NAP(46.0),NAP(47.2),'y',TC[1]-4.7,TC[1]-3.7));
  cuts.push(pointed(TC[0]+u,2.0,NAP(43.2),NAP(46.0),NAP(47.2),'y',TC[1]+3.7,TC[1]+4.7));
}
complex=complex.subtract(Manifold.union(cuts));
complex=Manifold.union([complex,doorRelief]);
const parts=[["building:kerk-en-toren",complex]];

const META={
  name:"Grote of Pancratiuskerk",
  origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:-0.3,groundHeight:GROUND_NAP,
  replacesBuildings:["0114100000202332"],
  description:"Oorsprong op RD (256678,5, 534157), +X naar het oosten langs de kerk-as en +Y naar het noorden. Het model bevat de kruiskerk uit 1856 met drie hipped roof volumes en de westtoren: veldstenen voet, gemetselde geledingen, een vereenvoudigde galerij, octagonale klokverdieping en ingezwenkte achtkantige spits. De westingang is als verhoogd rondboogportaal op de torengevel weergegeven voor steunloos printen op 1:1000. Hoogten afgeleid uit AHN-DSM 0,5 m en maaiveld NAP +23,1 m; daknok, vensters, portaal en torenprofielen deels geschat. Vervangt BAG-pand 0114100000202332.",
  realWorld:{lengthM:39.2,widthM:31.0,groundNapM:23.1,naveRidgeNapM:39.0,transeptRidgeNapM:38.9,choirRidgeNapM:38.4,towerTopNapM:57.2},
  sources:[
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/510954",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/14958",
    "https://www.openstreetmap.org/way/273317988",
    "PDOK BAG pand 0114100000202332 (kerk en toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS (26-11-2026): gebouw- en torenhoogten; PDOK luchtfoto (Actueel_orthoHR): grondplan",
    "Wikimedia Commons: Grote of Pancratiuskerk, Emmen (RCE- en overzichtsfoto's)",
  ],
};

function toStl(solid,label){
 const mesh=solid.getMesh(),v=mesh.vertProperties,tri=mesh.triVerts,stride=mesh.numProp,count=tri.length/3;
 const buffer=Buffer.alloc(84+count*50); buffer.write(label.slice(0,79),0,80,"ascii");buffer.writeUInt32LE(count,80);let off=84;
 for(let t=0;t<count;t++){
  const p=[0,1,2].map(k=>{const i=tri[t*3+k]*stride;return [v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});
  const a=p[1].map((c,i)=>c-p[0][i]),b=p[2].map((c,i)=>c-p[0][i]);const n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],len=Math.hypot(...n)||1;
  for(const x of [...n.map(c=>c/len),...p[0],...p[1],...p[2]]){buffer.writeFloatLE(x,off);off+=4;}buffer.writeUInt16LE(0,off);off+=2;
 }
 return {buffer,triangles:count};
}
function toGlb(namedParts){
 const chunks=[],views=[],accessors=[],meshes=[],nodes=[];let byteLength=0;
 const push=(arr,target)=>{const b=Buffer.from(arr.buffer,arr.byteOffset,arr.byteLength),pad=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:byteLength,byteLength:b.length,target});chunks.push(pad);byteLength+=pad.length;return views.length-1;};
 for(const [name,solid] of namedParts){
  const mesh=solid.calculateNormals(0,40).getMesh(),stride=mesh.numProp,count=mesh.vertProperties.length/stride;
  const positions=new Float32Array(count*3),normals=new Float32Array(count*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<count;i++){
   const v=mesh.vertProperties,p=[v[i*stride],v[i*stride+2],-v[i*stride+1]],n=stride>=6?[v[i*stride+3],v[i*stride+5],-v[i*stride+4]]:[0,1,0];
   for(let j=0;j<3;j++){positions[i*3+j]=p[j];normals[i*3+j]=n[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}
  }
  const pi=push(positions,34962),ni=push(normals,34962),ii=push(Uint32Array.from(mesh.triVerts),34963);accessors.push({bufferView:pi,componentType:5126,count,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count,type:"VEC3"},{bufferView:ii,componentType:5125,count:mesh.triVerts.length,type:"SCALAR"});const a=accessors.length-3;
  meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});
 }
 const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-grote-kerk-emmen.mjs (manifold-3d)"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength}],bufferViews:views,accessors}));
 const jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),head=Buffer.alloc(12);head.writeUInt32LE(0x46546c67,0);head.writeUInt32LE(2,4);head.writeUInt32LE(12+8+jp.length+8+bin.length,8);
 const ch=(length,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(length,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([head,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}
if(argv.includes("--components")) console.log(JSON.stringify(complex.decompose().map((p)=>({volume:+p.volume().toFixed(2),box:p.boundingBox()})),null,2));
for(const [name,solid] of parts){if(solid.status()!=="NoError")throw new Error(`${name}: ${solid.status()}`);if(Math.abs(solid.boundingBox().min[2]-BASE)>1e-5)throw new Error(`${name}: base is not flat`);}
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`;await writeFile(path.join(outDir,glb),toGlb(parts));
const stl=`${slug}-1-${scale}.stl`;const printable=complex.translate([0,0,-BASE]);const stlOut=toStl(printable,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlOut.buffer);
const bb=complex.boundingBox();
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({name:META.name,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",origin:META.origin,xAxis:META.xAxis,groundOffsetMetres:META.groundOffsetMetres,groundHeight:META.groundHeight,replacesBuildings:META.replacesBuildings.map(id=>`NL.IMBAG.Pand.${id}`),description:META.description,printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)},sources:META.sources},null,2));
console.log(JSON.stringify({slug,status:complex.status(),genus:complex.genus(),triangles:complex.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2)),stl:stlOut.triangles,scale},null,2));






