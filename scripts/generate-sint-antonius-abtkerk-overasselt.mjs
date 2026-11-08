import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-antonius-abtkerk-overasselt";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[182772,419190],X_AXIS=[.893,-.45];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Hoog middenschip met twee lage zijbeuken; kapvlakken volgen de 3DBAG-nokken.
let ship=box(-2.5,28.3,-9.6,-1.6,BASE,16.1),sr=box(-2.5,28.3,-9.6,-1.6,16.05,21.2);
sr=plane(sr,0,1.275,28.34);sr=plane(sr,0,-1.275,14.06);
let sides=[];for(const [a,b,sign] of [[-13.2,-9.5,1],[-1.7,2.0,-1]]){let w=box(1.7,16.2,a,b,BASE,7.4);let r=box(1.7,16.2,a,b,7.35,10.2);r=plane(r,0,sign*.73,sign===1?17.1:9.0);sides.push(w,r)}
// Transept met kruisende zadeldaken en vijfzijdige absiden aan beide uiteinden.
let trans=box(16.1,24.8,-13.3,2.1,BASE,16.1),tr=box(16.1,24.8,-13.3,2.1,16.05,21.2);
tr=plane(tr,1.17,0,-2.78);tr=plane(tr,-1.17,0,45.18);
const north=[[16.1,2],[24.8,2],[23.7,4.6],[22.1,6.3],[18.9,6],[16.7,4.3]],south=[[16.1,-13.2],[24.8,-13.2],[23.7,-15.8],[21.6,-17.4],[19,-17.3],[17,-15.8]];
function apse(p,cy){let b=prism(p,BASE,10),r=prism(p,9.95,15.8);r=plane(r,1.2,0,-8.8);r=plane(r,-1.2,0,40.4);r=plane(r,0,cy>0?-1.2:1.2,cy>0?18.2:31.8);return [b,r]}
let transepts=[...apse(north,1),...apse([...south].reverse(),-1)];
const choir=[[24.7,-9.5],[30.6,-9.5],[32.3,-6.8],[32.1,-4.2],[30.5,-2],[24.7,-2]];
let c=prism(choir,BASE,16.1),cr=prism(choir,16.05,21.2);cr=plane(cr,0,1.275,28.34);cr=plane(cr,0,-1.275,14.06);cr=plane(cr,-1.2,0,55.0);
// Platgedekte sacristie en ronde doopkapel.
let sac=prism([[28,-13],[29.2,-15.1],[34.7,-15.1],[34.8,-13.6],[39.4,-13.7],[39.5,-9.2],[30.6,-9.2]],BASE,5.2);
let bapt=Manifold.cylinder(5.2,2,2,8,false).translate([0,-9.7,BASE]);let baptR=Manifold.cylinder(1.8,2,.02,8,false).translate([0,-9.7,4.7]);
// Eén noordwesttoren: vierkante schacht, achthoekige klokkenetage en spits.
let tower=box(-3.2,3.3,-2.1,3.4,BASE,24.3);
let bell=Manifold.cylinder(6.8,3,3,8,false).rotate([0,0,22.5]).translate([.05,.65,24.2]);
let spire=Manifold.cylinder(7.9,3,.55,8,false).rotate([0,0,22.5]).translate([.05,.65,31]);
let church=Manifold.union([ship,sr,...sides,trans,tr,...transepts,c,cr,sac,bapt,baptR,tower,bell,spire]);
// Blinde rondbogen, galmgaten en roosvenster benaderen het zichtbare gevelreliëf.
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5,9,13])for(const y of [-12.85,2.35])church=church.subtract(arch(x,y,2.3,1.1,3.8));
for(const x of [5,9,13])for(const y of [-9.25,-1.25])church=church.subtract(arch(x,y,12.0,1.0,2.5));
for(const x of [-1.5,1.5])for(const [z,h] of [[7,3.2],[14,4.0],[19,3.0]])church=church.subtract(arch(x,3.75,z,1,h));
for(const x of [-1.5,1.5])church=church.subtract(arch(x,-1.75,19,1,3));
for(const z of [7,14,19])for(const y of [-.8,1.7])church=church.subtract(arch(y,0,z,1,z===14?4:3).rotate([0,0,90]).translate([-3.3,0,0]));
for(const x of [-1.2,1.2])for(const y of [-1.7,3.0])church=church.subtract(arch(x,y,25.0,1.2,4.7));
// Westportaal in de voorgevel van het schip en de ronde nis erboven.
church=church.subtract(arch(-5.6,0,BASE,2,4.1).rotate([0,0,90]).translate([-2.7,0,0]));
let rose=Manifold.cylinder(.9,1.6,1.6,24,false).rotate([0,90,0]).translate([-2.9,-5.6,11.3]);church=church.subtract(rose);
for(const x of [3.0,7.0,11.0,15.0])for(const y of [-13.8,1.8])church=Manifold.union([church,box(x-.45,x+.45,y,y+.9,BASE,6)]);
// Rondboogvensters in de buitenvlakken van beide transeptapsissen.
for(const x of [19.2,20.6,22.0]){church=church.subtract(arch(x,6.5,4.1,1.0,4.4));church=church.subtract(arch(x,-17.0,4.1,1.0,4.4));}
// Vier kleine dakkapellen, op de hellende hoofdkap aangesloten.
for(const x of [6,11])for(const y of [-8.5,-3.8]){let d=box(x-.5,x+.5,y-.5,y+.5,16.2,19.4);d=plane(d,1,0,19.4-x);d=plane(d,-1,0,19.4+x);church=Manifold.union([church,d]);}
// De drie hoge ramen van de oostelijke koorsluiting, bevestigd door archieffoto.
for(const [x,y,ang] of [[31.55,-8.0,-122],[32.3,-5.5,-90],[31.45,-3.05,-58]]){church=church.subtract(arch(0,0,5.0,1.3,6.5).rotate([0,0,ang]).translate([x,y,0]));}
const parts=[["building:kerk",church]];
const META={name:"Sint Antonius Abtkerk Overasselt",origin:ORIGIN,xAxis:X_AXIS,groundHeight:10.077,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0252100000017987"],description:"Neoromaanse kruisbasiliek met vijfzijdig koor, absidiale transeptarmen en één toren.",realWorld:{groundNapM:10.077,ahnTopNapM:49.114},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0252100000017987","https://monumentenregister.cultureelerfgoed.nl/monumenten/523921","https://commons.wikimedia.org/wiki/Category:Sint-Antonius_Abtkerk_(Overasselt)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://kennis.cultureelerfgoed.nl/index.php/Complexen/523920","https://www.oozo.nl/oud-beeldmateriaal/heumen/overasselt/overasselt/105960/foto-hoogstraat-9-te-overasselt","https://www.oozo.nl/oud-beeldmateriaal/heumen/overasselt/overasselt/105736/foto-hoogstraat-9-te-overasselt"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-antonius-abtkerk-overasselt.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1){console.log(pieces.map(p=>p.boundingBox()));throw new Error(`expected one connected component, got ${pieces.length}`);}
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));













