import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nikolaestsjerke-swichum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// BAG and roof ridge: +X east along church; heights relative to NAP +2.091 m.
const BASE=-0.5,ORIGIN=[183857,574181],X_AXIS=[0.9906,0.1368],GROUND_NAP=2.091;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,50);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// The nave and semicircular choir have continuous sloping roof planes.
const nave=roof([[-9,-4.25],[8.4,-4.25],[8.4,4.35],[-9,4.35]],.05,10.55,1.13);
const arc=Array.from({length:9},(_,i)=>{const a=-Math.PI/2+Math.PI*i/8;return [8.4+4.36*Math.cos(a),.05+4.3*Math.sin(a)]});
let choir=roof([[8.2,-4.25],...arc,[8.2,4.35]],.05,10.55,1.13);
// Faceted half-conical roof at the choir, one plane per footprint edge.
for(let i=0;i<arc.length-1;i++){const [x0,y0]=arc[i],[x1,y1]=arc[i+1],dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy);let nx=-dy/l,ny=dx/l;if(nx*(8.3-x0)+ny*(.05-y0)<0){nx=-nx;ny=-ny}const k=1.13;choir=plane(choir,k*nx,k*ny,5.66-k*(nx*x0+ny*y0));}
// West tower saddle roof, with the gable aligned along the nave.
const tower=roof([[-12.45,-2.04],[-8.82,-2.04],[-8.82,2.22],[-12.45,2.22]],.10,19.9,1.70);
const solids=[nave,choir,tower];
// Masonry buttresses at the curved choir, photo proportions enlarged to 0.9 m.
for(const a of [-55,-20,20,55]){const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r),cx=8.4+4.25*c,cy=.05+4.25*s;const b=box(-.55,.65,-.48,.48,BASE,5.0);solids.push(plane(b,-.7,0,4.90).rotate([0,0,a]).translate([cx,cy,0]));}
let church=Manifold.union(solids);
// Shallow pointed niches (0.35 m) on long walls, tower and entrance.
const cuts=[];
function sideNiche(x,y,w,z0,z1,side){const y0=y+(side>0?-.35:-.18),y1=y+(side>0?.18:.35);return Manifold.hull([[x-w/2,y0,z0],[x+w/2,y0,z0],[x-w/2,y1,z0],[x+w/2,y1,z0],[x-w/2,y0,z1],[x+w/2,y0,z1],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y0,z1+w*.85],[x,y1,z1+w*.85]])}
for(const x of [-5.5,.5,6.1])for(const side of [-1,1])cuts.push(sideNiche(x,side<0?-4.25:4.35,1.35,2.0,4.8,side));
cuts.push(sideNiche(-6.8,-4.25,1.2,BASE,2.65,-1));
// Two choir-side windows in the curved closure, oriented radially.
for(const side of [-1,1]) cuts.push(sideNiche(0,0,1.2,2.0,4.7,1).rotate([0,0,side>0?-22.5:-157.5]).translate([10.05, .05+side*3.98, 0]));
for(const side of [-1,1])for(const x of [-11.95,-9.95])cuts.push(sideNiche(x,side<0?-2.04:2.22,.9,12.9,14.4,side));
const westNiche=(y,w,z0,z1)=>Manifold.hull([[-12.7,y-w/2,z0],[-12.1,y-w/2,z0],[-12.7,y+w/2,z0],[-12.1,y+w/2,z0],[-12.7,y-w/2,z1],[-12.1,y-w/2,z1],[-12.7,y+w/2,z1],[-12.1,y+w/2,z1],[-12.7,y,z1+w*.7],[-12.1,y,z1+w*.7]]);
for(const y of [-.8,.95])cuts.push(westNiche(y,.9,12.9,14.4));cuts.push(westNiche(0,1.1,BASE,2.2));
// Round clock faces are represented as shallow printable recesses.
cuts.push(Manifold.cylinder(.5,.6,.6,20).rotate([0,90,0]).translate([-12.65,.1,16]));
cuts.push(Manifold.cylinder(.5,.6,.6,20).rotate([90,0,0]).translate([-10.6,-1.9,16]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Nikolaestsjerke Swichum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0080100000376054"],description:"Middeleeuwse zaalkerk met halfrond koor, steunberen en westelijke zadeldaktoren; vlakken en maten uit BAG, 3D BAG en AHN; blinde venster- en galmnissen naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000376054","https://monumentenregister.cultureelerfgoed.nl/monumenten/24519","https://commons.wikimedia.org/wiki/Category:Nicolaaskerk,_Swichum","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nikolaestsjerke-swichum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


