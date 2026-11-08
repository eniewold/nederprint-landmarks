import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kerk-van-garmerwolde";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[239129.5,585357.5],X_AXIS=[.9901,.1404],GROUND_NAP=-.05;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Het 19e-eeuws gesloopte schip ontbreekt bewust. Het koor en dwarspanden vormen een T.
let choir=box(-7.35,2.88,-14.25,14.75,BASE,16.9);choir=plane(choir,1.43,0,20.1);choir=plane(choir,-1.43,0,13.7);
let transept=box(-10.0,10.2,-5.15,5.88,BASE,16.9);transept=plane(transept,0,1.34,16.41);transept=plane(transept,0,-1.34,17.39);
const supports=[];for(const x of [-7.35,2.88])for(const y of [-13.8,14.3]){let p=box(x-.6,x+.6,y-.6,y+.6,BASE,8.3);supports.push(p);}for(const x of [-9.5,9.7])for(const y of [-4.65,5.38])supports.push(box(x-.55,x+.55,y-.55,y+.55,BASE,7.9));
let church=Manifold.union([choir,transept,...supports]);const cuts=[];
for(const x of [-7.35,2.88])for(const y of [-11,-8,8,11])cuts.push(box(x-.3,x+.3,y-.55,y+.55,4.5,8.3));
for(const y of [-5.15,5.88])for(const x of [-8.5,5,8.5]){cuts.push(box(x-.5,x+.5,y-.3,y+.3,1.5,4));cuts.push(box(x-.5,x+.5,y-.3,y+.3,5.2,8.3));}
for(const y of [-14.25,14.75])for(const x of [-5.8,-2.3,1.2]){cuts.push(box(x-.48,x+.48,y-.3,y+.3,1.8,4));cuts.push(box(x-.48,x+.48,y-.3,y+.3,5.2,8.2));}
church=church.subtract(Manifold.union(cuts));
// De vrijstaande zadeldaktoren staat gedraaid ten opzichte van de kerk.
let tower=box(-3.94,3.94,-3.7,3.7,BASE,19.85);tower=plane(tower,0,1.45,19.85);tower=plane(tower,0,-1.45,19.85);
const tc=[];for(const sign of [-1,1])for(const x of [-1.25,1.25])tc.push(box(x-.55,x+.55,sign<0?-3.95:3.35,sign<0?-3.35:3.95,9.5,12.6));tc.push(box(-.6,.6,-3.95,-3.35,BASE,2.5));tower=tower.subtract(Manifold.union(tc));tower=tower.rotate([0,0,18.05]).translate([8.96,28.48,0]);
const parts=[["building:kerk",church],["building:toren",tower]];church=Manifold.union([church,tower]);
const META={name:"Kerk van Garmerwolde",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0009100007677186","NL.IMBAG.Pand.0009100007680336"],description:"Romano-gotische kerk met kruisvormig resterend gebouw en vrijstaande zadeldaktoren. Gevelreliëf naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0009100007677186","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0009100007680336","https://monumentenregister.cultureelerfgoed.nl/monumenten/9780","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Garmerwolde)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kerk-van-garmerwolde.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==2)throw new Error(`expected church and detached tower, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


