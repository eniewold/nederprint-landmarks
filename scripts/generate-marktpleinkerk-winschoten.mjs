import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="marktpleinkerk-winschoten";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[265556,574127],X_AXIS=[.9906,.1368];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Lang rechthoekig kerkschip met zadeldak en drie grote venstertraveeën.
let ship=box(0,42.9,-6.3,5.7,BASE,11.9),roof=box(0,42.9,-6.3,5.7,11.85,19.7);
roof=plane(roof,0,1.3,20.09);roof=plane(roof,0,-1.3,19.31);
let kerk=Manifold.union([ship,roof]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [3.5,6,8.5,12,14.5,17,20.5,23,25.5,29,31.5,34,37.5,40])for(const y of [-5.95,6.05])kerk=kerk.subtract(arch(x,y,5,1.1,5));
for(const y of [-4,-2,0,2,4])kerk=kerk.subtract(arch(y,0,5.0,1.1,5.0).rotate([0,0,-90]).translate([43.1,0,0]));
for(const [y,h] of [[-4,1.5],[-2.6,3.0],[-1.3,4.5],[0,5],[1.3,4.5],[2.6,3],[4,1.5]])kerk=kerk.subtract(arch(y,0,12,.9,h).rotate([0,0,-90]).translate([43.1,0,0]));
kerk=kerk.subtract(arch(0,0,BASE,1.6,3.1).rotate([0,0,90]).translate([-.1,0,0]));
for(const x of [2,15,28,40.5])for(const y of [-6.6,5.6])kerk=Manifold.union([kerk,box(x-.5,x+.5,y,y+.55,BASE,10)]);
// Twee kleine dakkapellen op de lange noordelijke dakhelling.
for(const x of [14,30]){let d=box(x-.6,x+.6,3.5,5.2,14,16.5),dr=box(x-.6,x+.6,3.5,5.2,16.45,17.1);dr=plane(dr,1,0,17.1-x);dr=plane(dr,-1,0,17.1+x);kerk=Manifold.union([kerk,d,dr]);}
// D'Olle Witte: vierkante schacht en afzonderlijke achthoekige lantaarns.
let shaft=box(-31.1,-22.6,14.5,23.7,BASE,25.3);
// Brede gemetselde kroonlijst met schuine onderzijde, gevolgd door de klokkenverdieping.
let transition=Manifold.hull([[-31.1,14.5,24.75],[-22.6,14.5,24.75],[-22.6,23.7,24.75],[-31.1,23.7,24.75],[-31.7,13.9,25.35],[-22,13.9,25.35],[-22,24.3,25.35],[-31.7,24.3,25.35],[-31.7,13.9,26.15],[-22,13.9,26.15],[-22,24.3,26.15],[-31.7,24.3,26.15]]);
let bell=Manifold.cylinder(8.2,3.4,3.4,8,false).rotate([0,0,22.5]).translate([-26.85,19.1,26.05]);
let lantern=Manifold.cylinder(4.0,2.75,2.75,8,false).rotate([0,0,22.5]).translate([-26.85,19.1,34.2]);
let cap=Manifold.revolve(new CrossSection([[[0,38.1],[2.75,38.1],[2.65,39],[2.3,39.8],[1.55,40.55],[.5,41],[0,41]]]),8).rotate([0,0,22.5]).translate([-26.85,19.1,0]);
let cornice=Manifold.cylinder(.6,3.4,4.0,8,false).rotate([0,0,22.5]).translate([-26.85,19.1,33.7]);
let toren=Manifold.union([shaft,transition,bell,cornice,lantern,cap]);
for(const a of [0,45,90,135,180,225,270,315]){
 const n=arch(0,0,27.2,1.2,5).scale([1,.75,1]).translate([0,3.17,0]).rotate([0,0,a]).translate([-26.85,19.1,0]);toren=toren.subtract(n);
 const l=arch(0,0,34.8,.85,2.2).scale([1,.4,1]).translate([0,2.56,0]).rotate([0,0,a]).translate([-26.85,19.1,0]);toren=toren.subtract(l);
}
// Blinde tweelingvensters in de bakstenen torenschacht.
for(const x of [-28,-25.7])for(const y of [14.85,24.05])toren=toren.subtract(arch(x,y,17,1.05,4.1));
for(const y of [18,20.2])toren=toren.subtract(arch(y,0,17,1.05,4.1).rotate([0,0,90]).translate([-31.2,0,0]));
const parts=[["building:kerk",kerk],["building:toren",toren]];let church=Manifold.union([kerk,toren]);
const META={name:"Marktpleinkerk Winschoten",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.85,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1895100000007017","NL.IMBAG.Pand.1895100000006739"],description:"Romaans-gotische zaalkerk en de vrijstaande achthoekig bekroonde toren d'Olle Witte.",realWorld:{groundNapM:2.85,publishedTowerHeightM:41,ahnPeakNapM:46},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1895100000007017","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1895100000006739","https://monumentenregister.cultureelerfgoed.nl/monumenten/39011","https://monumentenregister.cultureelerfgoed.nl/monumenten/39012","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.openmonumentendag.nl/wp-content/uploads/2019/01/Brochure_afdrukversie.pdf"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-marktpleinkerk-winschoten.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==2)throw new Error(`expected two connected components, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
const base=box(-33,45,-8,25,-1.7,-.45);const plated=Manifold.union([church,base]).translate([0,0,1.7]);const baseStl=`${slug}-grondplaat-1-${scale}.stl`;await writeFile(path.join(outDir,baseStl),toStl(plated,`NederPrint ${META.name} met grondplaat`).buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl,baseStl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





