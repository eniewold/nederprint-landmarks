// Bergkerk Deventer: gemeten bouwdelen, geometrische dakvlakken, twee romaanse torens.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="bergkerk-deventer";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[207989,474058],X_AXIS=[.898,.44];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
function gableX(a,b,c,d,ridge,axis,slope){let s=box(a,b,c,d,BASE,ridge);s=plane(s,0,slope,ridge-slope*axis);return plane(s,0,-slope,ridge+slope*axis)}
function gableY(a,b,c,d,ridge,axis,slope){let s=box(a,b,c,d,BASE,ridge);s=plane(s,slope,0,ridge-slope*axis);return plane(s,-slope,0,ridge+slope*axis,0)}
const solids=[];
// Middenschip en koor: doorgaande steile kap, afgeschuind boven de koorsluiting.
let nave=gableX(-22,23,-4.5,4.5,29.0,0,1.65);nave=plane(nave,-1.5,0,62.2);solids.push(nave);
// Brede kooromgang met gefacetteerde oostsluiting; lessenaarsdaken rondom.
const apse=[[15,-12.0],[24,-10.8],[28,-8.8],[30.5,-4.6],[30.5,4.0],[28,8.3],[24,10.5],[15,12.0]];
let choir=prism(apse,BASE,18.3); choir=plane(choir,0,0.82,22.0); choir=plane(choir,0,-.82,22.0);choir=plane(choir,-.85,0,42.0);solids.push(choir);
// Zijbeuken met afzonderlijke lessenaars, dakvlakken volgens BAG/AHN.
for(const side of [-1,1]){
 for(const [a,b] of [[-22,-4],[8,20]]){
  let aisle=box(a,b,side<0?-13:-.2,side<0?.2:13,BASE,20.0);
  aisle=plane(aisle,0,-side*.86,23.0);solids.push(aisle);
 }
}
// Noord- en zuidtransept: topgevel en dwarsgeplaatste zadeldaken.
solids.push(gableY(-4.1,8.1,-21.5,21.5,20.8,2,1.7));
// Aanbouw tegen zuidoostelijk transept met apart dwars zadeldak.
solids.push(gableY(8,18.5,-18.1,-10.2,15.4,13.25,1.25));
// Steunberen van de zijbeuken en het transept, met schuin aflopende bovenzijde.
for(const side of [-1,1]) for(const x of [-18.5,-14,-9.5,-5,8.6,13.3,17.7]){
 let b=box(x-.52,x+.52,side<0?-14.0:12.5,side<0?-12.5:14,BASE,12.2);b=plane(b,0,-side,25.1);solids.push(b);
}
// Radiale steunberen rond de kooromgang; bovenzijde loopt onder 45 graden af.
for(const [x,y] of [[20,-12],[24,-10.8],[28,-8.8],[30.5,-4.6],[30.5,0],[30.5,4],[28,8.3],[24,10.5],[20,12]]) {
 let b=box(-.4,1.4,-.55,.55,BASE,12.2);b=plane(b,-1,0,13.4);
 solids.push(b.rotate([0,0,Math.atan2(y,x-20)*180/Math.PI]).translate([x,y,0]));
}
// Dubbele romaanse westtorens en verbindende westgevel.
solids.push(gableX(-27,-20,-3.7,3.7,25.0,0,1.4));
for(const y of [-6.5,6.5]){
 solids.push(box(-27,-20.4,y-3.4,y+3.4,BASE,29.8));
 // Vierkantige naald met geknikte, uitlopende voet.
 const base=box(-27,-20.4,y-3.4,y+3.4,29.7,30.0);
 const mid=box(-26.4,-21,y-2.8,y+2.8,33.2,33.25);
 const tip=box(-24.18,-23.28,y-.45,y+.45,49.6,49.65);
 solids.push(Manifold.hull([base,mid]),Manifold.hull([mid,tip]));
}
let church=Manifold.union(solids);
// Gotische spitsvensters in gevels als blinde nissen.
function nicheY(x,y,z,w,h){const p=[[-w/2,0],[w/2,0],[w/2,h-w/1.6],[0,h],[-w/2,h-w/1.6]];return prism(p,0,.6).rotate([90,0,0]).translate([x,y+.3,z]);}
for(const y of [-13,13])for(const x of (y<0?[-19,-15,-11,-7,18.5]:[-19,-15,-11,-7,10.2,14.5,18.5]))church=church.subtract(nicheY(x,y,2.5,1.7,7.6));
for(const x of [11,15.5]) church=church.subtract(nicheY(x,-18.1,2,1.6,6));
for(const y of [-21.5,21.5]) church=church.subtract(nicheY(2,y,3.5,2.4,11.7));
for(const y of [-4.5,4.5]) for(const x of [11,15.5,19.5]) church=church.subtract(nicheY(x,y,19.3,1.2,2.8));
church=church.subtract(nicheY(2,21.5,BASE,1.6,3.4));
// Romaanse galmgaten op drie zijden van de twee torens.
for(const y of [-6.5,6.5]) for(const x of [-25.4,-22]) for(const z of [22.2,26.3]){
 church=church.subtract(nicheY(x,y+Math.sign(y)*3.4,z,1.05,2.5));
}
function nicheX(y,z,w,h){const p=[[-w/2,0],[w/2,0],[w/2,h-w/1.6],[0,h],[-w/2,h-w/1.6]];return prism(p,0,.65).rotate([90,0,0]).rotate([0,0,90]).translate([-27.3,y,z]);}
for(const y of [-7.5,-5.5,5.5,7.5]) for(const z of [22.2,26.3]) church=church.subtract(nicheX(y,z,1.0,2.5));
church=church.subtract(nicheX(0,2.0,2.8,12.0));
for(const y of [-2,2]) {const p=[[-.8,0],[.8,0],[.8,6.9],[0,8],[-.8,6.9]]; const cut=prism(p,0,.65).rotate([90,0,0]).rotate([0,0,90]).translate([30.2,y,2.5]); church=church.subtract(cut);}
const parts=[["building:kerk",church]];
const META={name:"Bergkerk Deventer",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:[[-18,-15],[-10,-15],[0,-23],[15,-15]],replacesBuildings:["NL.IMBAG.Pand.0150100000000704"],description:"Bergkerk: twee romaanse westtorens met spitsen, langsschip, zijbeuken, dwarsschip en gesloten kooromgang; geometrische dakvlakken en blinde vensternissen.",realWorld:{groundNapM:12.897,naveRidgeM:29,towerTopM:49.65},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0150100000000704","https://monumentenregister.cultureelerfgoed.nl/monumenten/12416","https://commons.wikimedia.org/wiki/Category:Bergkerk_(Deventer)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-bergkerk-deventer.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(JSON.stringify(pieces.map(p=>({volume:p.volume(),bounds:p.boundingBox()})))); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

















