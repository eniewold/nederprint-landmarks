import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kerk-op-de-hoogte-wolvega";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the roof axis eastward from the tower; all dimensions are metres.
const BASE=-.5,ORIGIN=[196073.55,543368.2],X_AXIS=[.99998,-.006],GROUND_NAP=3.655;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,50);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// Nave and three-sided choir with the same continuous roof and hipped east end.
const plan=[[3,-5.2],[24.1,-5.2],[28.4,-2.3],[28.45,2.1],[24.2,4.9],[3,4.95]];
let nave=roof(plan,-.12,15.83,1.2);nave=plane(nave,-1.2,0,44.75);
// The low western entrance wing is connected to the tower.
let wing=roof([[-11.1,-2.45],[-3,-2.45],[-3,2.5],[-11.1,2.5]],0,7.5,1.0);wing=plane(wing,1.05,0,18.35);
const tower=box(-3.1,3.15,-3.55,3.6,BASE,19.05);
const lantern=box(-2.55,2.55,-2.8,2.8,18.95,25.0);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const hip=Manifold.hull([...oct(3.0,24.9),...oct(2.2,26.0)]);
const spire=Manifold.hull([...oct(2.2,25.95),...oct(.45,39.8)]);
// Sloping masonry buttresses follow the actual roofline, enlarged to printable width.
const supports=[];for(const x of [3.45,8.7,13.55,18.6,23.65])for(const side of [-1,1]){
 const y=side<0?-5.1:4.85,outer=side<0?-6.0:5.8;
 supports.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,outer,BASE],[x+.45,outer,BASE],[x-.45,y,9.35],[x+.45,y,9.35],[x-.45,side<0?-5.5:5.25,8.95],[x+.45,side<0?-5.5:5.25,8.95]]));
}
let church=Manifold.union([nave,wing,tower,lantern,hip,spire,...supports]);
const cuts=[];
function roundNiche(x,y,w,z0,z1,side){const y0=y+(side>0?-.4:-.18),y1=y+(side>0?.18:.4);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const c=Manifold.cylinder(y1-y0,w/2,w/2,16).rotate([90,0,0]).translate([x,y1,z1]);return Manifold.union([b,c]);}
for(const x of [6.25,11.1,16.1,21.15])for(const side of [-1,1])cuts.push(roundNiche(x,side<0?-5.2:4.95,1.5,3.4,6.8,side));
cuts.push(roundNiche(4.7,-5.2,1.8,BASE,2.25,-1));
cuts.push(roundNiche(4.7,4.95,1.8,BASE,2.25,1));
// Three choir windows follow the facets of the east closure.
cuts.push(roundNiche(0,0,1.5,3.4,6.8,1).rotate([0,0,-90]).translate([28.45,-.1,0]));
cuts.push(roundNiche(0,0,1.5,3.4,6.8,1).rotate([0,0,-146]).translate([26.25,-3.75,0]));
cuts.push(roundNiche(0,0,1.5,3.4,6.8,1).rotate([0,0,-34]).translate([26.3,3.5,0]));
for(const side of [-1,1])for(const x of [-1.0,1.0])cuts.push(roundNiche(x,side<0?-2.8:2.8,1.0,20.05,22.5,side));
for(const side of [-1,1])cuts.push(Manifold.cylinder(.55,.65,.65,20).rotate([90,0,0]).translate([0,side*2.8+.27,23.9]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Kerk op de Hoogte Wolvega",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0098100000023148"],description:"Zaalkerk met driezijdig koor, lage westelijke aanbouw en vierkante toren met terugliggende houten bovenbouw en ingesnoerde naaldspits; geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0098100000023148","https://www.monumenten.nl/monument/38881","https://commons.wikimedia.org/wiki/Category:Kerk_op_de_Hoogte","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kerk-op-de-hoogte-wolvega.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));



