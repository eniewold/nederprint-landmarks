import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-martinus-arnhem";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Local X follows the church from the street-side tower to the eastern choir.
const BASE=-0.5,ORIGIN=[191249,444041.5],X_AXIS=[-.325,.946],GROUND_NAP=16.841;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,35));
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const main=[[0,-4.4],[45.6,-4.4],[47.8,-2.1],[47.8,1.5],[45.6,4.1],[0,4.1]];
const nave=roofed(main,[[0,-2.0,26.65],[0,2.0,26.65],[-1.5,0,95.1]]);
const aisle1=roofed(rect(2,31,-10.8,-4),[[0,1,22.8]]),aisle2=roofed(rect(2,30,4,11.6),[[0,-1,22.8]]);
const cross=roofed(rect(30,45.2,-13,13),[[-1.3,0,75.53],[1.3,0,-22.23]]);
// Low polygonal chapel and access structures alongside the tower and choir.
const front=roofed([[0,4],[3,4],[3,10],[1.2,10],[0,8.7]],[[0,-1,19]]);
const chap1=roofed(rect(40.5,49,-13,-9.5),[[0,1,22]]),chap2=roofed(rect(39,48.7,8.5,11.6),[[0,-1,22]]);
// A tall tapering tower and octagonal needle; AHN reaches NAP +83.45 m.
const tower=box(-3.65,4.05,-4.4,3.8,BASE,42.0),sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]],oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(3.9,41.95),...oct(.45,70)]);
const ribs=[];for(const x of [5,10,15,20,25,29])for(const side of [-1,1]){const y=side<0?-10.2:11,o=side<0?-11.2:12;ribs.push(Manifold.hull([[x-.5,y,BASE],[x+.5,y,BASE],[x-.5,o,BASE],[x+.5,o,BASE],[x-.5,y,11],[x+.5,y,11]]));}
let church=Manifold.union([nave,aisle1,aisle2,cross,front,chap1,chap2,tower,spire,...ribs]);const cuts=[];
for(const x of [7.5,12.5,17.5,22.5,27.5])for(const side of [-1,1]){const y0=side<0?-11.1:11.35,y1=side<0?-10.55:11.95;cuts.push(box(x-.65,x+.65,y0,y1,3.2,9));cuts.push(Manifold.hull([[x-.65,y0,9],[x+.65,y0,9],[x,y0,9.9],[x-.65,y1,9],[x+.65,y1,9],[x,y1,9.9]]));}
cuts.push(box(-4,-3.4,-.8,.8,BASE,4));for(const y of [-1.2,1.2]){cuts.push(box(-4,-3.3,y-.5,y+.5,33,39.5));cuts.push(box(-4,-3.3,y-.5,y+.5,22,28));}for(const x of [-1,1])for(const side of [-1,1])cuts.push(box(x-.5,x+.5,side<0?-4.7:3.55,side<0?-4.15:4.15,33,39.5));church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint-Martinus Arnhem",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0202100000232659"],description:"Neogotische driebeukige kruisbasiliek met hoge toren en spits. Torenpunt en geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000232659","https://monumentenregister.cultureelerfgoed.nl/monumenten/8363","https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk_(Arnhem)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-martinus-arnhem.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));



