import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="dorpskerk-almen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the medieval nave eastward from the tower; Y points north.
const BASE=-.5,ORIGIN=[217606.75,463628.3],X_AXIS=[.99975,-.0225],GROUND_NAP=11.445;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const yroof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,45);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// The straight-ended medieval choir is contiguous with the original south nave.
const nave=yroof([[3,-5.25],[20.95,-5.25],[20.95,3.15],[3,3.15]],-1.05,12.3,1.2);
const choir=yroof([[20.8,-4.25],[29,-4.25],[29,3.05],[20.8,3.05]],-.60,12.0,1.2);
// 1849 widening: lower, hipped roof with four continuous sloping planes.
let extension=yroof([[3.1,3.0],[20.95,3.0],[20.95,10.65],[3.1,10.65]],6.825,10.55,.75);extension=plane(extension,.75,0,5.4);extension=plane(extension,-.75,0,23.4);
const tower=box(-3.05,3.15,-3.35,3.25,BASE,19.2);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]];
const foot=Manifold.hull([...sq(3.08,19.1),...oct(2.7,21.0)]);
const spire=Manifold.hull([...oct(2.7,20.95),...oct(.45,32.0)]);
// Projecting buttresses have sloped heads and are wide enough for 1:1000.
const supports=[];for(const x of [3.5,7.5,12.0,16.5,20.3,25.0,28.4]){
 const y=x<21?-5.05:-4.05,outer=y-.85;
 supports.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,outer,BASE],[x+.45,outer,BASE],[x-.45,y,6.3],[x+.45,y,6.3],[x-.45,y-.4,5.85],[x+.45,y-.4,5.85]]));
}
for(const x of [3.7,8.5,13,17.5,20.4]){
 const y=10.45,outer=11.35;supports.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,outer,BASE],[x+.45,outer,BASE],[x-.45,y,6.3],[x+.45,y,6.3],[x-.45,10.85,5.9],[x+.45,10.85,5.9]]));
}
// The straight choir end has the characteristic diagonal corner buttresses.
for(const side of [-1,1]){
 const b=box(-.48,.65,-.48,.48,BASE,6.3);
 supports.push(plane(b,-.7,0,6.1).rotate([0,0,side*45]).translate([28.7,side<0?-3.9:2.75,0]));
}
let church=Manifold.union([nave,choir,extension,tower,foot,spire,...supports]);
const cuts=[];function niche(x,y,w,z0,z1,side){const y0=y+(side>0?-.4:-.2),y1=y+(side>0?.2:.4);return Manifold.hull([[x-w/2,y0,z0],[x+w/2,y0,z0],[x-w/2,y1,z0],[x+w/2,y1,z0],[x-w/2,y0,z1],[x+w/2,y0,z1],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y0,z1+w*.65],[x,y1,z1+w*.65]])}
for(const x of [5.5,9.6,14.2,18.4])cuts.push(niche(x,-5.25,1.4,2.2,5.3,-1));
for(const x of [5.8,10.7,15.3,19])cuts.push(niche(x,10.65,1.4,2.1,5.0,1));
for(const x of [22.8,26.6])cuts.push(niche(x,-4.25,1.3,2.2,5.3,-1));
cuts.push(niche(12.8,10.65,1.4,BASE,2.4,1)); cuts.push(niche(0,0,1.4,2.2,5.3,1).rotate([0,0,-90]).translate([29,-.6,0]));
// Recessed clock faces and belfry openings, plus a west doorway.
for(const side of [-1,1]){cuts.push(niche(0,side<0?-3.35:3.25,1.0,15.0,17.1,side));cuts.push(Manifold.cylinder(.5,.65,.65,20).rotate([90,0,0]).translate([0,side*3.3+.25,17.4]));}
cuts.push(Manifold.cylinder(.5,.65,.65,20).rotate([0,90,0]).translate([-3.3,0,17.4]));
cuts.push(Manifold.hull([[-3.3,-.6,BASE],[-2.85,-.6,BASE],[-3.3,.6,BASE],[-2.85,.6,BASE],[-3.3,-.6,2.4],[-2.85,-.6,2.4],[-3.3,.6,2.4],[-2.85,.6,2.4],[-3.3,0,3.0],[-2.85,0,3.0]]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Dorpskerk Almen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0262100000001360"],description:"Middeleeuwse kerk met recht gesloten koor, ingesnoerde torenspits en noordelijke uitbreiding uit 1849; nissen en spitstop naar foto en AHN geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0262100000001360","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/16710","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Almen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-dorpskerk-almen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





