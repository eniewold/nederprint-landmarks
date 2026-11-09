// Goirkese kerk Tilburg: afzonderlijke vlakken en bouwdelen, maten in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="goirkese-kerk-tilburg";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[133815,398234],X_AXIS=[.956,-.294];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const ridgeY=(s,z,t)=>plane(plane(s,0,t,z),0,-t,z);
const ridgeX=(s,z,t)=>plane(plane(s,t,0,z),-t,0,z);
// Schip en zijbeuken met onafhankelijke dakvlakken en meetbare goten.
let nave=ridgeY(box(-51,-5,-5.3,5.3,BASE,27),26.5,1.15);
let aisles=[];for(const side of [-1,1]){let s=side<0?box(-51,-9,-13,-5.2,BASE,15.4):box(-51,-9,5.2,13,BASE,15.4);s=plane(s,0,-side*.45,19.3);aisles.push(s);}
// Transept uit 1938, drie langsvlakken en puntgevels aan noord en zuid.
let transept=ridgeX(box(-7.1,8.2,-25.7,28.5,BASE,27),26.7,1.20);
// De lagere, haaks op het schip gerichte aanbouwen tussen kerk en dwarsbeuken.
let crossingAnnex=[];for(const side of [-1,1]){let s=side<0?box(-13.2,-6.8,-19.4,.1,BASE,19):box(-13.2,-6.8,-.1,20.1,BASE,19);s=plane(s,1.15,0,30.5);s=plane(s,-1.15,0,7.5);crossingAnnex.push(s);}
// Centrale vieringtoren, laag tentdak en lantaarn, geen gestapelde hoogtevelden.
let tower=box(-6.6,6.6,-6.6,6.6,BASE,34.2);
let cap=Manifold.hull([[-6.6,-6.6,34],[-6.6,6.6,34],[6.6,-6.6,34],[6.6,6.6,34],[-1.8,-1.8,42],[-1.8,1.8,42],[1.8,-1.8,42],[1.8,1.8,42]]);
let lantern=box(-1.7,1.7,-1.7,1.7,41.7,47.3);
let tip=Manifold.cylinder(5.4,2.45,.45,4).rotate([0,0,45]).translate([0,0,47]);
// Veelhoekige koorsluiting en de twee kleine flankerende absissen.
let choir=prism([[6,-6],[12,-6],[14,-4],[15.4,-1],[15.4,2],[13.5,5],[11,6],[6,6]],BASE,19.3);
let choirRoof=Manifold.hull([[6,-6,19.1],[12,-6,19.1],[14,-4,19.1],[15.4,-1,19.1],[15.4,2,19.1],[13.5,5,19.1],[11,6,19.1],[6,6,19.1],[8,0,25.5]]);
let parts2=[];for(const y of [-9,9]){let cy=Manifold.cylinder(9,3.2,3.2,8).translate([9,y,BASE]);let roof=Manifold.cylinder(3,3.2,.25,8).translate([9,y,8.4]);parts2.push(cy,roof);}
// Uitkragende veelhoekige portalen aan de westgevel.
let entry=ridgeY(box(-54.5,-50,-3.5,3.5,BASE,14),13.3,1.1);
let westT=[];for(const y of [-10,10]){westT.push(Manifold.cylinder(11,2.4,2.4,8).translate([-51.8,y,BASE]));westT.push(Manifold.cylinder(3,2.4,.2,8).translate([-51.8,y,10.4]));}
let church=Manifold.union([nave,...aisles,...crossingAnnex,transept,tower,cap,lantern,tip,choir,choirRoof,box(6,12,-10,10,BASE,8.6),...parts2,entry,...westT]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-45,-38.8,-32.6,-26.4,-20.2,-14])for(const y of [-12.6,13.4])church=church.subtract(niche(x,y,2.5,2.4,8));
for(const x of [-45,-38.8,-32.6,-26.4,-20.2,-14])for(const y of [-4.9,5.7])church=church.subtract(niche(x,y,15.3,2,4.6));
for(const y of [-25.3,28.9])for(const x of [-3.8,0,3.8])church=church.subtract(niche(x,y,3,2,9));
// Kenmerkende grote spitsboog in het westfront en ramen van het transept.
for(const y of [-1.5,1.5])church=church.subtract(niche(0,0,12,2,8).rotate([0,0,90]).translate([-51.4,y,0]));
for(const y of [-21,-17,17,21])church=church.subtract(niche(0,0,3,1.8,9).rotate([0,0,270]).translate([8.6,y,0]));
for(const a of [0,180])for(const x of [-3,3])church=church.subtract(niche(x,7,27,2,4).rotate([0,0,a]));
for(const a of [90,270])for(const x of [-3,3])church=church.subtract(niche(x,7,27,2,4).rotate([0,0,a]));
church=church.subtract(niche(0,.4,BASE,2.2,4.5).rotate([0,0,90]).translate([-54.5,0,0]));
for(const x of [-48,-41.8,-35.6,-29.4,-23.2,-17])for(const y of [-13.4,12.7])church=Manifold.union([church,box(x-.5,x+.5,y,y+(.8),BASE,10)]);
const parts=[["building:kerk",church]];
const META={name:"Goirkese Kerk Tilburg",origin:ORIGIN,xAxis:X_AXIS,groundHeight:13.65,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0855100000019067"],description:"Basilicale kerk met dwarsbeuken en vieringtoren uit 1938.",realWorld:{groundNapM:13.65,ahn5TowerNapM:65.66},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000019067","https://monumentenregister.cultureelerfgoed.nl/monumenten/521052","https://commons.wikimedia.org/wiki/Category:Goirkese_kerk","https://www.openmonumentendag.nl/monument/goirkese-kerk/","https://www.ahn.nl/dataroom"]};

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








