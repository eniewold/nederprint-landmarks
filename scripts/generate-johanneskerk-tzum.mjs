import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="johanneskerk-tzum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Local +X follows the BAG and roof ridge eastward, Z is relative to NAP +3.164 m.
const BASE=-0.5,ORIGIN=[166765,574695],X_AXIS=[.9788,-.2048],GROUND_NAP=3.164;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,85);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
const axis=2.27,ridge=14.32,k=.99;
const foot=[[-12.7,-3.16],[21.55,-3.37],[25.01,-2.34],[26.63,.15],[26.24,3.03],[24.88,5.60],[21.8,7.62],[-12.7,7.77]];
let nave=roof(foot,axis,ridge,k);
// Three apsidal hip planes rise inward from the east footprint, following the measured eaves.
const apse=[[21.55,-3.37],[25.01,-2.34],[26.63,.15],[26.24,3.03],[24.88,5.6],[21.8,7.62]];
for(let i=0;i<apse.length-1;i++){const [x0,y0]=apse[i],[x1,y1]=apse[i+1],dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);let nx=-dy/L,ny=dx/L;if(nx*(15-x0)+ny*(axis-y0)<0){nx=-nx;ny=-ny}nave=plane(nave,nx*k,ny*k,8.9-k*(nx*x0+ny*y0));}
const tower=box(-22.9,-12.45,-2.86,7.77,BASE,31.58);
// Octagonal spire, full-height continuous triangular faces; upper tip broadened to 0.9 m for printing.
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>{const a=(Math.PI/8)+i*Math.PI/4;return[x+r*Math.cos(a),y+r*Math.sin(a),z]});
const spire=Manifold.hull([...oct(-17.67,2.45,5.0,31.48),...oct(-17.67,2.45,.49,69.0)]);
// Southern annex (consistory): measured footprint with hipped roof.
let annex=roof([[9.45,-10.69],[15.53,-10.76],[15.48,-3.05],[9.44,-3.05]],12.5,9.78,.84);
// roof() runs along X; this roof ridge runs along Y, so clip the X direction directly.
annex=prism([[9.45,-10.69],[15.53,-10.76],[15.48,-3.05],[9.44,-3.05]],BASE,30);
annex=plane(annex,.84,0,9.78-.84*12.48);annex=plane(annex,-.84,0,9.78+.84*12.48);annex=plane(annex,0,.84,9.78+.84*8.1);
let church=Manifold.union([nave,tower,spire,annex]);
// 0.35 m deep pointed facade recesses, enlarged only where required by print scale.
const cuts=[];
function sideNiche(x,y,w,z0,z1,side){const y0=y+(side>0?-.35:-.18),y1=y+(side>0?.18:.35);return Manifold.hull([[x-w/2,y0,z0],[x+w/2,y0,z0],[x-w/2,y1,z0],[x+w/2,y1,z0],[x-w/2,y0,z1],[x+w/2,y0,z1],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y0,z1+w*.85],[x,y1,z1+w*.85]])}
for(const x of [-8,-2.5,3,8,18.4])cuts.push(sideNiche(x,7.72,1.65,2.2,6.2,1));
for(const x of [-8,-2.7,2.6,7.3,18.7])cuts.push(sideNiche(x,-3.23,1.65,2.2,6.2,-1));
for(const x of [10.9,14.1])cuts.push(sideNiche(x,-10.73,1.15,3.4,6.4,-1));
for(const side of [-1,1]){
 const y=side<0?-2.86:7.77;
 for(const x of [-20.85,-17.65,-14.45])cuts.push(sideNiche(x,y,1.1,12.1,20.3,side));
 for(const x of [-19.35,-15.9])cuts.push(sideNiche(x,y,1.45,24.0,27.5,side));
}
const westNiche=(y,w,z0,z1)=>Manifold.hull([[-23.1,y-w/2,z0],[-22.55,y-w/2,z0],[-23.1,y+w/2,z0],[-22.55,y+w/2,z0],[-23.1,y-w/2,z1],[-22.55,y-w/2,z1],[-23.1,y+w/2,z1],[-22.55,y+w/2,z1],[-23.1,y,z1+w*.8],[-22.55,y,z1+w*.8]]);
for(const y of [-.4,2.5,5.4])cuts.push(westNiche(y,1.05,12.1,20.3));
for(const y of [.65,4.25])cuts.push(westNiche(y,1.45,24.0,27.5));cuts.push(westNiche(2.5,1.8,BASE,3.3));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Johanneskerk Tzum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0070100000318527"],description:"Zaalkerk met driezijdig koor, zuidelijke consistorie en hoge westtoren met achtzijdige naaldspits. BAG, 3D BAG en AHN bepalen positie en maten; gevelnissen zijn naar foto's geschat. Balustrade en windvaan zijn wegens schaal weggelaten.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000318527","https://monumentenregister.cultureelerfgoed.nl/monumenten/15869","https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Tzum","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://tsjerkepaad.nl/overzicht-kerken/tzum-johannes-kerk"]};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-johanneskerk-tzum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


