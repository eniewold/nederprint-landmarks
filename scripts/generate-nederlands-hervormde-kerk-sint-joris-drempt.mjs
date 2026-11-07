import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-sint-joris-drempt";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the church axis from the Romanesque tower toward the choir.
const BASE=-.5,ORIGIN=[208241.6,446702],X_AXIS=[.992,.126],GROUND_NAP=12.907;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,60);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// The broad nave is formed by two continuous roof planes.
const nave=roof([[3.9,-7.3],[22.6,-7.3],[22.6,8.7],[4,8.7]],.5,16.0,1.2);
const plan=[[22.4,-3.5],[29.4,-3.5],[31.8,-1],[31.8,2.1],[29.6,4.3],[22.4,4.3]];
let choir=roof(plan,.4,16.0,1.2);choir=plane(choir,-1.0,0,47.8);
let sacristy=roof([[22.4,-6.5],[26,-6.5],[26,-3.4],[22.4,-3.4]],-4.95,6.7,.9);
const tower=box(-3.5,4.0,-3.3,4.3,BASE,21.2);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[.25+r*Math.cos(Math.PI/8+i*Math.PI/4),.5+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const hip=Manifold.hull([...oct(4.2,21.1),...oct(2.9,22.4)]);
const spire=Manifold.hull([...oct(2.9,22.3),...oct(.45,39.4)]);
const butt=[];for(const x of [5.3,9.6,13.9,18.2,22.2])for(const s of [-1,1]){let y=s<0?-7.25:8.65,o=y+s*.9;butt.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,7],[x+.45,y,7],[x-.45,y+s*.45,6.55],[x+.45,y+s*.45,6.55]]));}
// Thin lisenes are part of the masonry and are widened slightly for the print.
const strips=[];for(const x of [-3.0,3.5])for(const s of [-1,1]){let y=s<0?-3.3:4.3;strips.push(box(x-.45,x+.45,y-.12,y+.12,BASE,20));}
let church=Manifold.union([nave,choir,sacristy,tower,hip,spire,...butt,...strips]);
const cuts=[];
function niche(x,y,w,z0,z1,s){const y0=y+(s>0?-.35:-.18),y1=y+(s>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const cap=Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w*.45],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w*.45]]);return Manifold.union([b,cap]);}
for(const x of [7.4,11.7,16,20])for(const s of [-1,1])cuts.push(niche(x,s<0?-7.3:8.7,1.35,2.9,5.8,s));
for(const x of [-1.3,1.4])for(const s of [-1,1])cuts.push(niche(x,s<0?-3.3:4.3,1.0,17.1,19.1,s));
for(const x of [24.5,27.5])cuts.push(niche(x,4.3,1.5,4,9.8,1));
cuts.push(niche(27.5,-3.5,1.5,4,9.8,-1));
const west=box(-3.7,-3.2,-.3,1.3,BASE,3.0);const westArch=Manifold.cylinder(.5,.8,.8,24).rotate([0,90,0]).translate([-3.7,.5,3]);cuts.push(Manifold.union([west,westArch]));
const end=box(31.45,32,-.4,1.1,3.5,9.0);const endCap=Manifold.hull([[31.45,-.4,9],[31.45,1.1,9],[31.45,.35,9.7],[32,-.4,9],[32,1.1,9],[32,.35,9.7]]);cuts.push(Manifold.union([end,endCap]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint-Joriskerk Drempt",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1876100000010264"],description:"Pseudobasiliek met driezijdig koor, romaanse westtoren, hoge naaldspits en geschatte geveldetails.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1876100000010264","https://www.monumenten.nl/monument/22840","https://sintjoriskerkdrempt.nl/","https://commons.wikimedia.org/wiki/Category:Sint-Joriskerk,_Drempt","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nederlands-hervormde-kerk-sint-joris-drempt.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


