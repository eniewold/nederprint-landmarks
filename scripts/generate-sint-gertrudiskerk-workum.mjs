import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-gertrudiskerk-workum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[158744,554669],X_AXIS=[.9834,-.1814],GROUND_NAP=1.713;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const yroof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,50);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
const xroof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,50);s=plane(s,slope,0,ridge-slope*axis);s=plane(s,-slope,0,ridge+slope*axis);return s};
// Three parallel roofs of the hall church; their ridges follow 3D BAG planes.
const nave=yroof([[-17,-4.6],[4.9,-4.6],[4.9,6.2],[-17,6.2]],.8,23.45,1.48);
const south=yroof([[-17,-11.4],[3,-11.4],[3,-4.5],[-17,-4.5]],-7.9,20.05,1.45);
const north=yroof([[-17,6.1],[3,6.1],[3,12.9],[-17,12.9]],9.5,20.05,1.45);
// Crossing roof runs perpendicular to the nave. Choir has a faceted east hip.
const transept=xroof([[-.6,-19],[11.5,-19],[11.5,19.6],[-.6,19.6]],5.4,23.5,1.46);
let choir=yroof([[10,-4.9],[23.8,-4.9],[27.5,-2],[28.4,.1],[28.4,2],[24.1,6.9],[10,6.9]],.8,23.4,1.48);choir=plane(choir,-1.46,0,58.2);
const sacristy=xroof([[17.9,-16.4],[25,-16.4],[25,-4.8],[17.9,-4.8]],21.5,11.85,1.42);
let west=box(-21.4,-16.8,-11.4,12.8,BASE,7.0);west=plane(west,.64,0,17.7);
const supports=[];for(const x of [-16,-10.2,-4,10.6,15,19.4,23.3])for(const side of [-1,1]){
 let y=side<0?-11.2:12.7;if(x>10)y=side<0?-4.7:6.7;if(x>10&&x<14)continue;
 const yo=y+side*.9;supports.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,yo,BASE],[x+.45,yo,BASE],[x-.45,y,14],[x+.45,y,14],[x-.45,y+side*.45,13.55],[x+.45,y+side*.45,13.55]]));
}
// A compact closed roof lantern reproduces the small crossing spire.
const oct=(r,z,x,y)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const roofLantern=Manifold.hull([...oct(1.1,22.5,5.1,.8),...oct(1.1,27.3,5.1,.8)]);
const roofSpire=Manifold.hull([...oct(1.1,27.2,5.1,.8),...oct(.45,32,5.1,.8)]);
let churchPart=Manifold.union([nave,south,north,transept,choir,sacristy,west,roofLantern,roofSpire,...supports]);
const cuts=[];function niche(x,y,w,z0,z1,side){const y0=y+(side>0?-.4:-.2),y1=y+(side>0?.2:.4);return Manifold.hull([[x-w/2,y0,z0],[x+w/2,y0,z0],[x-w/2,y1,z0],[x+w/2,y1,z0],[x-w/2,y0,z1],[x+w/2,y0,z1],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y0,z1+w*.7],[x,y1,z1+w*.7]])}
for(const x of [-13,-7,-2])for(const side of [-1,1])cuts.push(niche(x,side<0?-11.4:12.9,2.1,4.2,11.0,side));

// Choir windows lie between the buttresses; the south wall is partly covered by the sacristy.
for(const x of [13.0,17.2,21.3])cuts.push(niche(x,6.9,1.7,4.0,10.8,1));
cuts.push(niche(13.0,-4.9,1.7,4.0,10.8,-1));
for(const side of [-1,1]) {cuts.push(niche(4.3,side<0?-19:19.6,2.1,4.0,15.0,side));cuts.push(niche(7.0,side<0?-19:19.6,2.1,4.0,15.0,side));}
churchPart=churchPart.subtract(Manifold.union(cuts));
// Freestanding late medieval tower: square masonry shaft and pyramidal roof.
const tx=-35.65,ty=-.65;let tower=box(tx-5.25,tx+5.25,ty-5.1,ty+5.1,BASE,25.6);
let tent=box(tx-5.25,tx+5.25,ty-5.1,ty+5.1,25.5,31);tent=plane(tent,1,0,31-tx);tent=plane(tent,-1,0,31+tx);tent=plane(tent,0,1,31-ty);tent=plane(tent,0,-1,31+ty);
const lantern=Manifold.hull([...oct(1.55,29.0,tx,ty),...oct(1.55,32.2,tx,ty)]);
// Polygonal onion cap made from sloping faces, thickened for a reliable print.
const bulb=Manifold.union([Manifold.hull([...oct(1.1,32.0,tx,ty),...oct(1.7,32.7,tx,ty)]),Manifold.hull([...oct(1.7,32.65,tx,ty),...oct(1.6,33.6,tx,ty),...oct(.45,35.4,tx,ty)])]);
tower=Manifold.union([tower,tent,lantern,bulb]);
const towerCuts=[];for(const side of [-1,1])for(const x of [tx-2.6,tx,tx+2.6]){towerCuts.push(niche(x,ty+side*5.1,1.25,5,13,side));towerCuts.push(niche(x,ty+side*5.1,1.25,16.8,23.5,side));}
tower=tower.subtract(Manifold.union(towerCuts));
const church=Manifold.union([churchPart,tower]);
const parts=[["building:kerk",churchPart],["building:toren",tower]];
const META={name:"Sint-Gertrudiskerk Workum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0104100000124703","NL.IMBAG.Pand.0104100000132090"],description:"Driebeukige hallenkerk met dwarsschip, sacristie en dakruiter, en vrijstaande toren met tentdak en uivormige bekroning. Nissen en bekroningen geschat voor 1:1000.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0104100000124703","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0104100000132090","https://monumentenregister.cultureelerfgoed.nl/monumenten/39458","https://commons.wikimedia.org/wiki/Category:Grote_Kerk_(Workum)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-gertrudiskerk-workum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==2)throw new Error(`expected church and freestanding tower, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));









