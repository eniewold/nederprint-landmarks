import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-ammerzoden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[143907.5,418060],X_AXIS=[.995,-.1],GROUND_NAP=4.688;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const yroof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,50);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// Intact polygonal choir; the former nave and transept are roofless ruins.
let choir=yroof([[26.1,-4.2],[36.8,-4.2],[39.5,-3.3],[41.1,-1.2],[41.1,2.3],[39.3,4.6],[37.1,5.4],[26.1,5.4]],.6,16.05,1.2);choir=plane(choir,-1.2,0,59.2);
const tower=box(-1.9,2.55,-2.35,3.35,BASE,18.8);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(2.5,18.7),...oct(.45,28.8)]);
// The standing wall pieces have an irregular silhouette, each made as a single sloping surface.
const ruined=[];
function wallX(a,b,y,w,ha,hb){return Manifold.hull([[a,y-w/2,BASE],[a,y+w/2,BASE],[b,y-w/2,BASE],[b,y+w/2,BASE],[a,y-w/2,ha],[a,y+w/2,ha],[b,y-w/2,hb],[b,y+w/2,hb]])}
function wallY(x,a,b,w,ha,hb){return Manifold.hull([[x-w/2,a,BASE],[x+w/2,a,BASE],[x-w/2,b,BASE],[x+w/2,b,BASE],[x-w/2,a,ha],[x+w/2,a,ha],[x-w/2,b,hb],[x+w/2,b,hb]])}
// West cross-wall joins tower; low nave walls lead into taller transept remnants.
ruined.push(wallY(2.45,-8.0,8.9,1.25,5.0,5.0));
for(const y of [-7.55,8.45]){ruined.push(wallX(2,6,y,1.3,6.9,7.5));ruined.push(wallX(5.95,10,y,1.3,7.5,7.2));ruined.push(wallX(9.95,14,y,1.3,7.2,8.2));ruined.push(wallX(13.95,17.7,y,1.3,8.2,9.5));}
for(const side of [-1,1]){
 const end=side<0?-13.1:13.6,near=side<0?-7.5:8.4;
 ruined.push(wallY(17.0,Math.min(near,end),Math.max(near,end),1.35,10.3,10.3));
  // Broken upper masonry follows the uneven silhouette visible in recent photographs.
 ruined.push(wallX(16.5,19.1,end,1.35,10.1,10.9));
 ruined.push(wallX(19.05,21.4,end,1.35,10.9,10.4));
 ruined.push(wallX(21.35,23.8,end,1.35,10.4,11.0));
 ruined.push(wallX(23.75,26.5,end,1.35,11.0,9.5));
 ruined.push(wallY(26.1,Math.min(side<0?-4.2:5.4,end),Math.max(side<0?-4.2:5.4,end),1.35,10.2,10.2));
}
// Broad buttresses are expressed as structural solids rather than fine edges.
const supports=[];for(const x of [4.0,8.7,13.4,17.0])for(const side of [-1,1]){const y=side<0?-7.5:8.4;let b=box(x-.48,x+.48,Math.min(y,y+side*1.0),Math.max(y,y+side*1.0),BASE,5.3);supports.push(b)}
for(const x of [29,33,36.5])for(const side of [-1,1]){const y=side<0?-4.0:5.2;let b=box(x-.5,x+.5,Math.min(y,y+side*1.1),Math.max(y,y+side*1.1),BASE,8.0);supports.push(plane(b,0,-side*.8,8+side*.8*y));}
// Polygonal stair turret on the south side of the west tower.
let stair=prism([[.1,-2.2],[.2,-3.7],[1.0,-4.5],[2.4,-4.6],[2.55,-2.2]],BASE,14.0);
stair=plane(stair,1.0,0,15.3);stair=plane(stair,-1.0,0,17.6);stair=plane(stair,0,1.0,18.0);stair=plane(stair,0,-1.0,11.2);
let church=Manifold.union([tower,spire,stair,choir,...ruined,...supports]);
// Pointed through-openings preserve the characteristic roofless arches.
function arch(x,y,w,z0,z1,depth){return Manifold.hull([[x-w/2,y-depth/2,z0],[x+w/2,y-depth/2,z0],[x-w/2,y+depth/2,z0],[x+w/2,y+depth/2,z0],[x-w/2,y-depth/2,z1],[x+w/2,y-depth/2,z1],[x-w/2,y+depth/2,z1],[x+w/2,y+depth/2,z1],[x,y-depth/2,z1+w*.65],[x,y+depth/2,z1+w*.65]])}
const cuts=[];
for(const side of [-1,1]){
 let y=side<0?-13.1:13.6;
 cuts.push(arch(21.5,y,3.2,3.4,7.2,2.0));
 cuts.push(arch(21.5,y,1.15,BASE,1.9,2.0));
 // Roofless nave still retains paired masonry arches, visible between buttresses.
 let naveY=side<0?-7.55:8.45;
 for(const x of [6.1,11.0])cuts.push(arch(x,naveY,2.3,2.7,5.3,2.0));
}
for(const x of [30.5,34.8])for(const side of [-1,1]){let y=side<0?-4.2:5.4;cuts.push(arch(x,y,1.3,2.6,8.0,.55).translate([0,side<0?.15:-.15,0]));}
// Additional surviving openings in the transept side walls.
for(const y of [-8.8,9.5])cuts.push(arch(0,0,2.5,3.4,7.1,2.0).rotate([0,0,90]).translate([26.1,y,0]));
// Window recesses in the three facets of the choir closure.
for(const [x,y,a] of [[40.3,-2.25,-127],[41.1,.55,-90],[40.2,3.45,-53]])cuts.push(arch(0,0,1.15,2.6,8.0,.6).rotate([0,0,a]).translate([x,y,0]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Nederlands hervormde kerk Ammerzoden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0263100000008785"],description:"Ruïnekerk met intact veelhoekig koor en toren, dakloze muurrestanten en open spitsbogen; sterk vereenvoudigd naar foto's wegens begroeiing.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0263100000008785","https://monumentenregister.cultureelerfgoed.nl/monumenten/8105","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Ammerzoden","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nederlands-hervormde-kerk-ammerzoden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





