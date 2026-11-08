import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="drievuldigheidskerk-landgraaf";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X loopt van het zuidwestelijke koor naar het noordoostelijke torenfront.
const BASE=-.5,ORIGIN=[204265,325350],X_AXIS=[.625,.781];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(s,ridge,at,slope)=>plane(plane(s,0,slope,ridge-slope*at),0,-slope,ridge+slope*at);
const roofY=(s,ridge,at,slope)=>plane(plane(s,slope,0,ridge-slope*at),-slope,0,ridge+slope*at);
// Schip, lagere dwarsarmen en driezijdig gesloten koor, met afzonderlijke dakvlakken.
let nave=roofX(box(2.7,26.2,1.28,11.4,BASE,15.0),15.0,6.2,1.13);
let cross=roofY(box(2.5,11.4,-5.6,18.35,BASE,12.2),12.2,7.1,1.15);
let choir=roofX(prism([[-2.9,4.25],[-.3,2.65],[3.0,2.65],[3.0,10],[-.3,10],[-2.9,8.6]],BASE,11.4),11.4,6.2,1.18);
choir=plane(choir,1.05,0,11.4);
let sac=roofX(box(-3.5,2.6,-5.3,2.9,BASE,8.2),8.2,-1.2,.95);
// Getrapt torenfront: centraal fronton, zijvleugels en hoog vierkant torenlichaam.
let front=roofY(box(25.7,31.6,1.2,11.5,BASE,14.3),14.3,28.9,1.0);
let wing1=roofY(box(25.9,31.6,-2.15,1.4,BASE,10.9),10.9,28.9,1.0);
let wing2=roofY(box(25.9,31.6,11.3,14.8,BASE,10.9),10.9,28.9,1.0);
wing1=plane(wing1,0,1.0,10.35);wing2=plane(wing2,0,-1.0,23.0);
let tower=box(26.1,31.6,3.25,9.4,BASE,19.3);
const ring=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
const towerRoof=Manifold.hull([...ring(26.1,31.6,3.25,9.4,19.2),...ring(28.42,29.32,5.85,6.75,28.4)]);
// Vier topgevels worden afzonderlijk uit dakvlakken gevormd.
const g1=roofX(box(30.8,31.6,3.25,9.4,18.8,22.2),22.2,6.3,1.1);
const g2=roofX(box(26.1,26.9,3.25,9.4,18.8,22.2),22.2,6.3,1.1);
const g3=roofY(box(26.1,31.6,3.25,4.05,18.8,22.2),22.2,28.85,1.2);
const g4=roofY(box(26.1,31.6,8.6,9.4,18.8,22.2),22.2,28.85,1.2);
let church=Manifold.union([nave,cross,choir,sac,front,wing1,wing2,tower,towerRoof,g1,g2,g3,g4]);
// Galmgaten en rondboogramen als ondiepe nissen met printbare bovenzijde.
const arch=(x,y,z,w,h,depth=.55)=>prism([[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]],0,depth).rotate([90,0,0]).translate([x,y,z]);
for(const x of [13.0,15.7,18.4,21.1,23.8])for(const y of [1.55,11.7])church=church.subtract(arch(x,y,2.4,1.5,5.8,.85));
for(const y of [4.65,6.3,7.95])church=church.subtract(arch(y,0,15.0,1.05,3.8).rotate([0,0,90]).translate([31.3,0,0]));
for(const x of [27.4,29.0,30.6])for(const y of [3.5,9.65])church=church.subtract(arch(x,y,15.0,1.05,3.8));
// Twee vensters per frontvleugel en hoofdingang.
for(const y of [-.8,.5,12.15,13.5])church=church.subtract(arch(y,0,4,1.0,3.8).rotate([0,0,90]).translate([31.3,0,0]));
church=church.subtract(arch(6.3,0,.05,1.4,3.8).rotate([0,0,90]).translate([31.3,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Drievuldigheidskerk Landgraaf",origin:ORIGIN,xAxis:X_AXIS,groundHeight:85.506,groundOffsetMetres:BASE,groundSamplePoints:[[15,-6.5],[15,19.2],[-5,6.3],[33,6.3]],replacesBuildings:["NL.IMBAG.Pand.0882100000006960"],description:"Eenbeukige kruiskerk met driezijdig koor en getrapt torenfront met tentdak en vier topgevels.",realWorld:{groundNapM:85.506,towerHeightM:28.4},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0882100000006960","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.kerkgebouwen-in-limburg.nl/kerken/rimburg/h-drievuldigheid","https://www.kerkramenindemijnstreek.nl/kerken/rimburg-h-drievuldigheidskerk/","https://monumentenregister.cultureelerfgoed.nl/monumenten/23855"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-drievuldigheidskerk-landgraaf.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





