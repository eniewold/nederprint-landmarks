import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-kerk-spijk";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[128899,429859],X_AXIS=[.9887,.15];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Pseudobasilicaal middenschip en driezijdig koor met vlakke dakhellingen.
let ship=box(1.9,14.1,-3,4,BASE,7.2),roof=box(1.9,14.1,-3,4,7.15,12.5);roof=plane(roof,0,1.49,11.76);roof=plane(roof,0,-1.49,13.24);
const choir=[[13.9,-3],[19.5,-3],[22.3,-1],[22.3,2.5],[19.9,4.9],[13.9,4.9]];
let c=prism(choir,BASE,5.1),cr=prism(choir,5.05,10.4);cr=plane(cr,0,1.33,9.1);cr=plane(cr,0,-1.33,11.7);cr=plane(cr,-1.5,0,39.7);
// Drie aparte dwarse zadeldaken op elke zijbeuk, met bijbehorende puntgevels.
let wings=[];for(const [a,b] of [[-5.4,-2.8],[3.8,6.3]]){wings.push(box(3.1,14.9,a,b,BASE,4.6));for(const x of [5.1,8.8,12.5]){let r=box(x-1.85,x+1.85,a,b,4.55,7.1);r=plane(r,1.35,0,7.1-1.35*x);r=plane(r,-1.35,0,7.1+1.35*x);wings.push(r)}}
// Een lage aanbouw naast de toren en een portaal bij het koor.
let annex=box(-2.4,2.1,2.0,6.3,BASE,3.8),annexR=plane(box(-2.4,2.1,2.0,6.3,3.75,7.7),0,-.85,9.1);
let portal=box(14.5,17.2,-5.5,-2.8,BASE,2.7),portalR=plane(box(14.5,17.2,-5.5,-2.8,2.65,4.1),0,.6,5.95);
// De afzonderlijke toren: vierkante schacht, schuin inspringende schouder en lange achtvlakkige naald.
let tower=box(-2.4,2.0,-2.3,2.1,BASE,17.0);
let shoulder=Manifold.hull([[-2.4,-2.3,16.95],[2,-2.3,16.95],[2,2.1,16.95],[-2.4,2.1,16.95],[-1.55,-1.45,18.5],[1.15,-1.45,18.5],[1.15,1.25,18.5],[-1.55,1.25,18.5]]);
let spire=Manifold.cylinder(15.25,1.85,.55,8,false).rotate([0,0,22.5]).translate([-.2,-.1,18.45]);
let church=Manifold.union([ship,roof,c,cr,...wings,annex,annexR,portal,portalR,tower,shoulder,spire]);
const arch=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.65],[0,h],[-w/2,h-.65]],0,.8).rotate([90,0,0]).translate([x,y,z]);
for(const x of [5.1,8.8,12.5])for(const y of [-5.05,6.65])church=church.subtract(arch(x,y,1.8,1.25,4.3));
for(const x of [-1,.7])for(const y of [-1.95,2.45])church=church.subtract(arch(x,y,13.3,.75,2.2));
for(const y of [-.9,.7])church=church.subtract(arch(y,0,13.3,.75,2.2).rotate([0,0,90]).translate([-2.5,0,0]));
church=church.subtract(arch(0,0,1.7,1.2,3.0).rotate([0,0,-90]).translate([22.5,1,0]));
church=church.subtract(arch(8.8,6.65,BASE,1.1,2.4));
for(const x of [3.4,6.9,10.6,14.2])for(const y of [-5.8,6.0])church=Manifold.union([church,box(x-.45,x+.45,y,y+.85,BASE,4.3)]);
const parts=[["building:kerk",church]];
const META={name:"Hervormde Kerk Spijk",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.059,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0733100000007251","NL.IMBAG.Pand.0733100000008661"],description:"Pseudobasilicale kerk met puntgevels en dwarskappen, driezijdig koor en afzonderlijke westtoren.",realWorld:{groundNapM:3.059,ahnTopNapM:39.604},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0733100000007251","https://monumentenregister.cultureelerfgoed.nl/monumenten/22001","https://monumentenregister.cultureelerfgoed.nl/monumenten/22002","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Spijk_(Lingewaal)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0189.php","https://www.dbnl.org/tekst/gron052vijf01_01/gron052vijf01ill0513.gif"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-spijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));






