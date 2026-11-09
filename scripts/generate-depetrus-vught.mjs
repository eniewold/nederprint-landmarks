// DePetrus Vught: kruiskoepelkerk met paviljoens, alle maten in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="depetrus-vught";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[148832,407706],X_AXIS=[.880,.475];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Lang schip met hoge kap, twee lagere zijbeuken en koor aan de westkant.
let hall=box(-27,28.6,-6.5,6.5,BASE,32.5);hall=plane(hall,0,1,32.5);hall=plane(hall,0,-1,32.5);
let aisle1=box(-25.5,26,-12.3,-6.2,BASE,17.5);aisle1=plane(aisle1,0,.65,21.5);
let aisle2=box(-25.5,26,6.2,12.3,BASE,17.5);aisle2=plane(aisle2,0,-.65,21.5);
let apse=Manifold.cylinder(15.8,7.2,7.2,24).translate([-27.2,0,BASE]);
let apseRoof=Manifold.cylinder(5.7,7.2,.45,24).translate([-27.2,0,15.2]);
// Dwarsbeuk met eigen nok en twee afgeronde kapellen.
let cross=box(-7.5,9.2,-15.5,15.5,BASE,32.3);cross=plane(cross,1,0,31.5);cross=plane(cross,-1,0,33.2);
let apses=[];for(const y of [-15,15]){apses.push(Manifold.cylinder(20.8,7.4,7.4,24).translate([.8,y,BASE]));apses.push(Manifold.cylinder(6.6,7.4,.6,16).translate([.8,y,20.2]));}
// Vieringtoren met achthoekige bekroning en verdikte naald, hoogte 57,9 m volgens beheerder.
let drum=Manifold.cylinder(8.5,8,7.7,8).rotate([0,0,22.5]).translate([.8,0,30]);
let dome=Manifold.cylinder(6.4,7.7,3.1,8).rotate([0,0,22.5]).translate([.8,0,38.2]);
let lantern=Manifold.cylinder(5.7,3.1,3.1,8).rotate([0,0,22.5]).translate([.8,0,44.2]);
let spire=Manifold.cylinder(8,3.2,.45,8).rotate([0,0,22.5]).translate([.8,0,49.9]);
// Verbonden lage paviljoen-/luifeldelen binnen dezelfde BAG-contour.
let flat1=box(-38,-7,13,22.8,BASE,5.1),flat2=box(-29.5,-11.4,-23.7,-12.2,BASE,5.2),flat3=box(11.5,21.1,11.8,22.8,BASE,4.8),flat4=box(12.7,26.5,-21,-11.5,BASE,4.5);
// Lage verbindingen volgen de aaneengesloten BAG-voet.
let links=[box(-25.7,-23,10.5,14,BASE,4.9),box(-12.6,-10.6,-14,-11.5,BASE,4.9),box(10.2,13,10.8,13,BASE,4.6)];
// Vier kleine traptorens flankeren de transeptafsluitingen.
let turrets=[];for(const x of [-5.9,7.5])for(const y of [-13.2,13.2]){
 turrets.push(Manifold.cylinder(25,1.5,1.5,12).translate([x,y,BASE]));
 turrets.push(Manifold.cylinder(4,1.7,.45,8).translate([x,y,24.3]));
}
let church=Manifold.union([hall,aisle1,aisle2,apse,apseRoof,cross,...apses,drum,dome,lantern,spire,flat1,flat2,flat3,flat4,...links,...turrets]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-22,-17,-12,13,18,23]){church=church.subtract(niche(x,-11.8,2,2.2,6.2));church=church.subtract(niche(x,12.8,2,2.2,6.2));}
for(const x of [-22,-16,-10,12,18,24]){church=church.subtract(niche(x,-6,19.5,2,4.6));church=church.subtract(niche(x,7,19.5,2,4.6));}
// Twee rijen ronde nissen op de halfronde transeptgevels.
for(const y of [-15,15])for(const angle of [-55,-25,0,25,55])for(const z of [3,12.5]){
 const rot=angle+(y<0?180:0);
 church=church.subtract(niche(0,7.8,z,1.45,4).rotate([0,0,rot]).translate([.8,y,0]));
}
// De toegangsgevel met drie grote ronde nissen.
for(const y of [-3.3,0,3.3])church=church.subtract(niche(-y,.5,1.2,2.1,6).rotate([0,0,-90]).translate([28.6,0,0]));
for(const x of [-24,-19,-14,14,19,24])for(const y of [-12.35,12.35])church=Manifold.union([church,box(x-.5,x+.5,y-.45,y+.45,BASE,10)]);
const parts=[["building:kerk",church]];
const META={name:"DePetrus Vught",origin:ORIGIN,xAxis:X_AXIS,groundHeight:5.52,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0865100000009197"],description:"Neoromaanse kruiskoepelkerk met vieringtoren, rond gesloten koor en zijpaviljoens.",realWorld:{groundNapM:5.52,towerHeightM:57.9,ahn5NaveNapM:38},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0865100000009197","https://monumentenregister.cultureelerfgoed.nl/monumenten/521327","https://commons.wikimedia.org/wiki/Category:Sint_Petrus,_Vught","https://www.depetrus.nl/praktische-informatie/","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-depetrus-vught.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








