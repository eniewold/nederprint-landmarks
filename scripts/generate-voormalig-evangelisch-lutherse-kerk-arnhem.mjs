import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="voormalig-evangelisch-lutherse-kerk-arnhem";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X goes from the tower toward the round apse. Heights in metres above ground.
const BASE=-.5,ORIGIN=[191160.5,444148.5],X_AXIS=[.329,-.94433],GROUND_NAP=18.165;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,60);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
const poly=[[1,-7.2],[32,-7.2],[34,-7.05],[36,-6.3],[37.7,-5],[38.8,-3],[39.3,0],[38.8,3],[37.7,5],[36,6.3],[34,7.05],[32,7.2],[1,7.2]];
let nave=roof(poly,0,22.4,1.37);
// Polygonal half-conical apse cap: sloped planes meeting the long ridge.
for(const [a,b,c] of [[-1.37,0,66.24],[-1.15,0.74,59.2],[-1.15,-.74,59.2],[-.72,1.16,45.44],[-.72,-1.16,45.44]]) nave=plane(nave,a,b,c);
const tower=box(-3.0,2.1,-2.8,2.8,BASE,26.8);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const skirt=Manifold.hull([...oct(3.1,26.7),...oct(2.4,28.0)]);
const spire=Manifold.hull([...oct(2.4,27.9),...oct(.45,44.4)]);
// House and connecting range on the western side, within the BAG footprint.
let house=roof([[0,-13.8],[9,-13.8],[9,-7.1],[0,-7.1]],-10.45,15.8,1.05);house=plane(house,-1.0,0,21.0);house=plane(house,1,0,7.3);
const connector=box(8.5,32.5,-13.8,-7.05,BASE,5.8);
const supports=[];for(const x of [4.2,9.9,15.7,21.5,27.3,31.5])for(const side of [-1,1]){let y=side*7.1,o=side*8; supports.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,12],[x+.45,y,12],[x-.45,side*7.55,11.55],[x+.45,side*7.55,11.55]]));}
const rider=box(17,19,-1.0,1.0,21.6,24.3); const riderRoof=roof([[16.8,-1.2],[19.2,-1.2],[19.2,1.2],[16.8,1.2]],0,25.6,1.1);
const dormers=[];for(const x of [7.2,12.8,18.4,24,29.6])for(const side of [-1,1]){
 const y=side*3.5;dormers.push(box(x-.55,x+.55,y-.5,y+.5,16.4,18.6));
 dormers.push(Manifold.hull([[x-.6,y-.55,18.5],[x+.6,y-.55,18.5],[x-.6,y+.55,18.5],[x+.6,y+.55,18.5],[x-.6,y,19.1],[x+.6,y,19.1]]));
}
let church=Manifold.union([nave,tower,skirt,spire,house,connector,rider,riderRoof,...supports,...dormers]);
const cuts=[];
function niche(x,y,w,z0,z1,side){const y0=y+(side>0?-.35:-.18),y1=y+(side>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const cap=Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w*.45],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w*.45]]);return Manifold.union([b,cap]);}
for(const x of [7.0,12.8,18.6,24.4,29.5]) for(const side of [1]) cuts.push(niche(x,side*7.2,1.9,4.4,10.8,side));
// The front tower's tall gothic windows, shallow so the sculpture stays solid.
for(const z of [4.0,15.4,21.0]){const w=z===4?2.1:1.8,h=z===4?6.2:3.4;let cut=box(-3.2,-2.7,-w/2,w/2,z,z+h);const cap=Manifold.hull([[-3.2,-w/2,z+h],[-3.2,w/2,z+h],[-3.2,0,z+h+w*.45],[-2.7,-w/2,z+h],[-2.7,w/2,z+h],[-2.7,0,z+h+w*.45]]);cuts.push(Manifold.union([cut,cap]));}
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Voormalig Evangelisch-Lutherse kerk Arnhem",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0202100000215121"],description:"Neogotische zaalkerk met halfronde apsis, geveltoren met ingesnoerde spits, dakruiter en aanliggende kosterswoning. Details en spitstop geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000215121","https://monumentenregister.cultureelerfgoed.nl/monumenten/516875","https://commons.wikimedia.org/wiki/Category:Evangelisch-Lutherse_Kerk","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-voormalig-evangelisch-lutherse-kerk-arnhem.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


