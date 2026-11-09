import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-janskerk-roosendaal";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[90479,394233],X_AXIS=[.9998,.0175];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Langsbeuk met laag gehouden zijbeuken en doorlopende dakvlakken.
let nave=box(-27.8,29.5,-5.4,5.4,BASE,17.5);nave=plane(nave,0,1.05,17.5);nave=plane(nave,0,-1.05,17.5);
let sides=[];for(const s of [-1,1]){let b=box(-27.8,27.8,s<0?-12.6:5.2,s<0?-5.2:12.6,BASE,14.5);b=plane(b,0,s<0?.45:-.45,18.8);sides.push(b)}
// Halfronde dwarsarmen en koorsluiting.
let cross=box(-.9,9.6,-12.6,12.6,BASE,17.6);cross=plane(cross,1.0,0,13.25);cross=plane(cross,-1.0,0,21.95);
let apses=[];for(const s of [-1,1]){let wall=Manifold.cylinder(12.3-BASE,5.4,5.4,32).translate([4.35,s*12.4,BASE]);let roof=Manifold.cylinder(5.1,5.4,.1,32).translate([4.35,s*12.4,12.2]);apses.push(wall,roof)}
let choir=Manifold.cylinder(12.3-BASE,4.4,4.4,32).translate([28.9,0,BASE]);let choirRoof=Manifold.cylinder(4.5,4.4,.1,32).translate([28.9,0,12.2]);
// Oude toren en open achtkantige bekroning, massief met nissen voor 1:1000.
let tower=box(-33,-23,-5.6,5.6,BASE,27.3);
let shoulder=Manifold.cylinder(2.4,5.1,3.0,8).rotate([0,0,22.5]).translate([-28,0,27.2]);
let lantern=Manifold.cylinder(6.1,3,3,8).rotate([0,0,22.5]).translate([-28,0,29.5]);
let cap=Manifold.revolve([[[0,35.5],[3,35.5],[2.5,36.5],[1.8,37.3],[2.2,38],[1.9,38.8],[.75,39.5],[.5,40.82],[0,40.82]]],8).translate([-28,0,0]);
// Voorportiek: gesloten front met vier pilasters in plaats van losse zuilen.
let portico=box(-34.2,-30,-6.6,6.6,BASE,10);portico=plane(portico,0,.28,10);portico=plane(portico,0,-.28,10);
let annex=box(16.8,23,-18,-12.2,BASE,8.8);annex=plane(annex,1,0,-11.1);annex=plane(annex,-1,0,28.9);
let rooflet=Manifold.cylinder(3.5,1.2,.45,8).translate([4.35,0,17.3]);
let columns=[];for(const y of [-4.6,-1.55,1.55,4.6])columns.push(Manifold.cylinder(7.4,.65,.65,12).translate([-34.1,y,BASE]));
let church=Manifold.union([...columns,nave,...sides,cross,...apses,choir,choirRoof,tower,shoulder,lantern,cap,portico,annex,rooflet]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.9).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-23,-18,-13,-8,-3])for(const y of [-12.3,13.2])church=church.subtract(niche(x,y,3.2,2.5,6.4));
for(const y of [-5.4,6.2])for(const x of [-30,-26])church=church.subtract(niche(x,y,19.1,1.7,6.1));
for(let a=0;a<360;a+=45){let n=niche(0,3.3,30,1.5,4.2).rotate([0,0,a]).translate([-28,0,0]);church=church.subtract(n)}
church=church.subtract(niche(0,0,BASE,2.4,5.3).rotate([0,0,90]).translate([-34,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Janskerk Roosendaal",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.687,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1674100001071286"],description:"Classicistische kruiskerk met halfronde sluitingen en oudere toren met achtkante lantaarn.",realWorld:{groundNapM:3.687,ahn5TopNapM:44.51,towerHeightPublishedM:57.1},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1674100001071286","https://commons.wikimedia.org/wiki/Category:Sint_Jan_de_Doper,_Roosendaal","https://tongerlohuys.nl/wp-content/uploads/Jaarboek-33-1973-Artikel-3.pdf","https://www.erfgoedroosendaal.nl/htmlpag/glaskunst/roosendaalmarkt002_sintjanskerk.pdf","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-janskerk-roosendaal.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));











