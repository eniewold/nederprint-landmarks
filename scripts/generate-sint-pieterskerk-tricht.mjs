import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-pieterskerk-tricht";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[146941.5,433421.5],X_AXIS=[.978,.21];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Een dak over het driebeukige schip; het koor sluit driezijdig en heeft dezelfde nok.
let ship=box(.3,26.5,-7.7,8.1,BASE,6.1),roof=box(.3,26.5,-7.7,8.1,6.05,17.6);
roof=plane(roof,0,1.47,17.3);roof=plane(roof,0,-1.47,17.9);
const choir=[[26,-4.4],[33,-4.4],[36.9,-1.5],[36.9,1.8],[32.7,4.8],[26,4.8]];
let c=prism(choir,BASE,11),cr=prism(choir,10.95,17.6);cr=plane(cr,0,1.47,17.3);cr=plane(cr,0,-1.47,17.9);cr=plane(cr,-1.8,0,77.1);
// Sacristie aan koorzijde en doopkapel aan zuidwestkant van de toren.
let sac=box(22.3,27.2,-9.6,-7.55,BASE,3.4),sacR=plane(box(22.3,27.2,-9.6,-7.55,3.35,6.3),0,.85,11.5);
let chapel=box(.25,3.8,-7.7,-3,BASE,5.8),chapelR=plane(box(.25,3.8,-7.7,-3,5.75,12),0,.95,13.1);
// Middeleeuwse toren met herstelde vierzijdige piramidespits in plaats van naald.
let tower=box(-2.6,3.6,-3.2,3.6,BASE,20.1);
let spire=Manifold.hull([[-2.6,-3.2,20.05],[3.6,-3.2,20.05],[3.6,3.6,20.05],[-2.6,3.6,20.05],[-.65,-.3,26.8],[.35,-.3,26.8],[.35,.7,26.8],[-.65,.7,26.8]]);
let church=Manifold.union([ship,roof,c,cr,sac,sacR,chapel,chapelR,tower,spire]);
const arch=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.75],[0,h],[-w/2,h-.75]],0,.8).rotate([90,0,0]).translate([x,y,z]);
for(const x of [5.2,9.4,13.5,17.6,21.7])for(const y of [-7.35,8.45])church=church.subtract(arch(x,y,2.0,1.5,3.5));
// Drie grote spitsboognissen per torengevel en de galmgaten daarbinnen.
for(const x of [-1.3,.45,2.15])for(const y of [-2.85,3.95])for(const z of [10.2,15.5])church=church.subtract(arch(x,y,z,1.1,4.0));
for(const y of [-1.8,.1,2])for(const z of [10.2,15.5])church=church.subtract(arch(y,0,z,1.1,4).rotate([0,0,90]).translate([-2.7,0,0]));
church=church.subtract(arch(.5,-7.35,BASE,1.3,2.7));
for(const x of [26.8,30.0,33.3])for(const y of [-4.7,4.45])church=Manifold.union([church,box(x-.45,x+.45,y,y+.85,BASE,9.2)]);
church=church.subtract(arch(0,0,3,1.3,6.5).rotate([0,0,-90]).translate([37.1,.15,0]));
// Lange koorvensters tussen de steunberen en een schoorsteen bij de sacristie.
for(const x of [27.8,31.6])for(const y of [-4.05,5.15])church=church.subtract(arch(x,y,3.0,1.2,6.3));
church=Manifold.union([church,box(22.8,23.8,-4.4,-3.4,11,15.5)]);
const parts=[["building:kerk",church]];
const META={name:"Sint-Pieterskerk Tricht",origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.097,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0236100000020884"],description:"Driebeukige kerk met gemeenschappelijk dak, driezijdig koor, doopkapel en vierzijdige torenspits.",realWorld:{groundNapM:4.097,ahnTopNapM:32.515},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000020884","https://monumentenregister.cultureelerfgoed.nl/monumenten/16521","https://monumentenregister.cultureelerfgoed.nl/monumenten/16522","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Tricht","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://maranatha-tricht.nl/historie-van-het-kerkgebouw/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-pieterskerk-tricht.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





