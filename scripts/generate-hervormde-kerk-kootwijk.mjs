import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-kerk-kootwijk";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[181190.4,466307.7],X_AXIS=[.998,.065],GROUND_NAP=30.667;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,30);s=plane(s,0,slope,ridge-slope*axis);return plane(s,0,-slope,ridge+slope*axis)};
let nave=roof([[2.7,-3.55],[17.2,-3.55],[19.6,-1.65],[19.6,1.6],[17.2,3.55],[2.7,3.55]],0,8.84,1.2);nave=plane(nave,-1.15,0,31.15);
const tower=box(-3.1,3.1,-3,3,BASE,11.3);
const square=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]];
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const shoulder=Manifold.hull([...square(3.05,11.2),...oct(2.2,12.1)]);
const spire=Manifold.hull([...oct(2.2,12),...oct(.49,16.6)]);
const stair=Manifold.cylinder(5.5,1.15,1.15,6).translate([-.1,3.0,BASE]);const stairRoof=Manifold.cylinder(1.3,1.15,.45,6).translate([-.1,3,4.9]);
const butt=[];for(const x of [3.6,6.05,8.5,10.95,13.4,15.85])for(const s of [-1,1]){const y=s*3.4,o=s*4.3;butt.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,4.1],[x+.45,y,4.1],[x-.45,y+s*.45,3.65],[x+.45,y+s*.45,3.65]]))}
let church=Manifold.union([nave,tower,shoulder,spire,stair,stairRoof,...butt]);const cuts=[];
function niche(x,y,w,z0,z1,s){let y0=y+(s>0?-.3:-.15),y1=y+(s>0?.15:.3);return Manifold.union([box(x-w/2,x+w/2,y0,y1,z0,z1),Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w/2],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w/2]])])};
for(const x of [4.8,7.25,9.7,12.15,14.6,17])for(const s of [-1,1])cuts.push(niche(x,s*3.55,1.05,2,4.1,s));
for(const s of [-1,1])for(const x of [-1.4,1.4])cuts.push(niche(x,s*3,1,8.2,10,s));
function west(y,w,z0,z1){return Manifold.union([box(-3.25,-2.75,y-w/2,y+w/2,z0,z1),Manifold.hull([[-3.25,y-w/2,z1],[-3.25,y+w/2,z1],[-3.25,y,z1+w/2],[-2.75,y-w/2,z1],[-2.75,y+w/2,z1],[-2.75,y,z1+w/2]])])}
for(const y of [-1.35,1.35])cuts.push(west(y,1,8.2,10));cuts.push(west(0,1.35,0,2.1));church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Hervormde kerk Kootwijk",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0203100000321101","NL.IMBAG.Pand.0203100000435554"],description:"Laatgotische zaalkerk met driezijdig koor, steunberen, zware toren en zeshoekige traptoren; details geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0203100000321101","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0203100000435554","https://monumentenregister.cultureelerfgoed.nl/monumenten/8624","https://pknkwb.nl/locatie/hervormde-kerk-kootwijk","https://commons.wikimedia.org/wiki/Category:NH_Kerk_Kootwijk","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-kootwijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


