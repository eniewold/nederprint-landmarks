import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-lambertuskerk-buren";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the church axis from the tower toward the east choir.
const BASE=-.5,ORIGIN=[151352,435865.5],X_AXIS=[.983,.184],GROUND_NAP=4.616;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,60);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// Two longitudinal roofs over the main church and northern aisle.
const main=roof([[-3.0,-8.2],[24.1,-8.2],[24.1,3.3],[-3,3.3]],-.55,14.5,1.15);
const aisle=roof([[-2.7,3.2],[24.2,3.2],[24.2,11.3],[-2.7,11.3]],7.2,14.4,1.35);
const plan=[[24,-6.3],[34,-6.3],[37.6,-3.1],[38.4,-1.7],[37.6,1.8],[35.6,3.3],[24,3.3]];
let choir=roof(plan,-1.5,15.1,1.3);choir=plane(choir,-1.0,0,53.5);
let porch=prism([[10.5,10.8],[16.7,10.8],[16.7,16.8],[10.5,16.8]],BASE,40);porch=plane(porch,1.3,0,-3.5);porch=plane(porch,-1.3,0,31.8);
const shaft=box(-3.4,3.5,-3.6,3.4,BASE,24.0);
const oct=(r,z,x=0,y=-.1)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const lower=Manifold.hull([...oct(3.35,23.9),...oct(3.35,30.5)]);
const clock=Manifold.hull([...oct(3.25,30.4),...oct(3.25,35.1)]);
const dome=Manifold.hull([...oct(3.25,35),...oct(2.25,36.0)]);
const lantern=Manifold.hull([...oct(2.25,35.9),...oct(2.25,40.2)]);
const lid=Manifold.hull([...oct(2.25,40.1),...oct(.5,42.3)]);
// Polygonal stair tower against the west face, with pointed hip.
const stairs=Manifold.cylinder(12,1.85,1.85,8).translate([-4.1,.8,BASE]);
const stairsRoof=Manifold.cylinder(2,1.85,.45,8).translate([-4.1,.8,11.4]);
const butt=[];for(const x of [4.7,8.6,12.5,16.4,20.3,23.6])for(const s of [-1,1]){let y=s<0?-8.15:11.25,o=y+s*.9;butt.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,8],[x+.45,y,8],[x-.45,y+s*.45,7.55],[x+.45,y+s*.45,7.55]]));}
let church=Manifold.union([main,aisle,choir,porch,shaft,lower,clock,dome,lantern,lid,stairs,stairsRoof,...butt]);
const cuts=[];
function niche(x,y,w,z0,z1,s){const y0=y+(s>0?-.35:-.18),y1=y+(s>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const cap=Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w*.5],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w*.5]]);return Manifold.union([b,cap]);}
for(const x of [6.6,10.5,14.4,18.3,22])cuts.push(niche(x,-8.2,1.5,3.0,6.9,-1));
for(const x of [6.6,18.3,22])cuts.push(niche(x,11.3,1.5,3.0,6.9,1));
for(const s of [-1,1])for(const x of [-1.3,1.3])cuts.push(niche(x,s<0?-3.6:3.4,1.3,15.5,20.0,s));
for(const s of [-1,1])cuts.push(niche(0,s<0?-3.1:2.9,1.5,25.4,28.7,s));
cuts.push(niche(13.6,16.8,2,3,9.0,1));
for(const y of [-3.1,2.9])cuts.push(Manifold.cylinder(.6,1,1,24).rotate([90,0,0]).translate([0,y+.3,33]));
for(const s of [-1,1])cuts.push(niche(0,s<0?-2.18:1.98,1.5,36.8,39.0,s));
// West-front blind arches and clock face distinguish the tower from a plain shaft.
for(const z of [9.0,16.0])for(const y of [-1.65,1.25]){const b=box(-3.65,-3.2,y-.65,y+.65,z,z+4);const c=Manifold.cylinder(.45,.65,.65,20).rotate([0,90,0]).translate([-3.65,y,z+4]);cuts.push(Manifold.union([b,c]));}
cuts.push(Manifold.cylinder(.6,1,1,24).rotate([0,90,0]).translate([-3.3,-.1,33]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint-Lambertuskerk Buren",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0214100000015112"],description:"Gotische kerk met twee langsdaken, koor en vierkante westtoren met achtkantige renaissancebovenbouw en lantaarn; details geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0214100000015112","https://sintlambertusburen.nl/gebouw/","https://www.monumenten.nl/monument/11329","https://commons.wikimedia.org/wiki/Category:Sint-Lambertuskerk_(Buren)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-lambertuskerk-buren.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


