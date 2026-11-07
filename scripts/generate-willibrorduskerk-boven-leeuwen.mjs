import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="willibrorduskerk-boven-leeuwen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the axis from the southern tower to the northern choir.
const BASE=-.5,ORIGIN=[165978,433037],X_AXIS=[.35,.93675],GROUND_NAP=6.474;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// High nave with lower aisles and two steep cross-gables on either side.
let nave=box(1.2,31,-7.4,3.2,BASE,20);nave=plane(nave,0,-1,17.1);nave=plane(nave,0,1,21.3);
let aisles=box(-.9,26,-15.5,7.5,BASE,15);aisles=plane(aisles,0,-.8,10.8);aisles=plane(aisles,0,.8,17.2);
function cross(a,b,c,d){let s=box(a,b,c,d,BASE,20);s=plane(s,-1,0,19+(a+b)/2);s=plane(s,1,0,19-(a+b)/2);return s;}
const transept1=cross(11.5,19.3,-18,11),transept2=cross(23.5,30.2,-16.7,8.6);
// Three-sided choir, lower chapel and sacristy to the north.
let choir=prism([[28,-8],[35.5,-8],[39,-5],[40,-1.5],[39,2],[35.5,4],[28,4]],BASE,18);choir=plane(choir,0,-1,16);choir=plane(choir,0,1,20);choir=plane(choir,-1,0,54);
let annex=box(34.5,45.2,-2.4,2.2,BASE,8);annex=plane(annex,0,-1,7.5);annex=plane(annex,0,1,7.5);
// Shortened square tower with four gables and octagonal spire.
const tower=box(-.7,5.6,-3.6,2.6,BASE,20.7);
let portal=box(-7.1,0,-5.0,2.6,BASE,13);portal=plane(portal,0,-1,10.3);portal=plane(portal,0,1,12.7);
let g1=cross(-.7,5.6,-3.6,2.6),g2=box(-.7,5.6,-3.6,2.6,20,25);g2=plane(g2,0,-1,22.5);g2=plane(g2,0,1,23.5);
const spire=Manifold.hull([...oct(2.45,-.5,3.05,20.5),...oct(2.45,-.5,.45,34.33)]);
const fleche=Manifold.hull([...oct(26,-2.1,1,18.2),...oct(26,-2.1,.45,24.0)]);
const supports=[];for(const x of [3,10.8,19.8,24.0,30])for(const side of [-1,1]){let inn=side<0?-15.2:7.1,out=side<0?-16.1:8;let s=box(x-.45,x+.45,Math.min(inn,out),Math.max(inn,out),BASE,8);s=plane(s,0,side<0?1:-1,side<0?23:15);supports.push(s);}
let church=Manifold.union([nave,aisles,transept1,transept2,choir,annex,tower,portal,g1,g2,spire,fleche,...supports]);
const cuts=[];for(const x of [4,9,21])for(const side of [-1,1]){let y0=side<0?-15.8:7.15,y1=side<0?-15.15:7.8;cuts.push(box(x-.6,x+.6,y0,y1,2.8,7.5));}
for(const x of [13,16.5,25,28.5])for(const side of [-1,1]){const edge=x<20?(side<0?-18:11):(side<0?-16.7:8.6);cuts.push(box(x-.55,x+.55,edge-.3,edge+.3,3,9));}
for(const x of [1,3.6])for(const side of [-1,1])cuts.push(box(x-.38,x+.38,side<0?-3.9:2.3,side<0?-3.3:2.9,16,19.6));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Willibrorduskerk Boven-Leeuwen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0668100000012504"],description:"Neogotische basiliek met verlaagde zuidtoren, naaldspits, dwarskappen, driezijdig koor en dakruiter. Details geschat naar AHN en foto's.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0668100000012504","https://www.monumenten.nl/monument/523086","https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk,_Boven-Leeuwen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-willibrorduskerk-boven-leeuwen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1){console.log(pieces.map(p=>p.boundingBox()));throw new Error(`expected one connected component, got ${pieces.length}`);}
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





