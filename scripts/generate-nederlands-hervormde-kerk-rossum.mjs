import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-rossum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Tower-centred axis from west tower towards the choir in the east.
const BASE=-.5,ORIGIN=[152095.85,423442.8],X_AXIS=[.98580282,.16790711],GROUND_NAP=6.657;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const FOOT=[[2.44,-5.76],[22.62,-5.76],[25.25,-4.57],[27,-.08],[25.36,5.16],[22.58,6.28],[2.44,6.28]];
// The nave has five bays, a five-sided choir and a shallow sloped ridge.
let nave=prism(FOOT,BASE,15.1);nave=plane(nave,0,-.81,15.31);nave=plane(nave,0,.81,14.89);nave=plane(nave,-1.1,0,39.85);
// The flat-roofed vestry projects behind the choir.
const annex=prism([[25.2,-4.57],[27.45,-4.57],[28.36,-2.97],[31.04,-2.97],[32.34,-1.49],[32.34,2.15],[31.06,3.49],[28.5,3.48],[27.47,5.16],[25.2,5.16]],BASE,4.49);
const tower=box(-2.47,2.47,-2.48,2.48,BASE,16.35);
// The AHN samples the spire to +25.90 m; a short tip is interpolated.
const ring=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...ring(2.25,16.3),...ring(.5,26.6)]);
const buttresses=[];for(const x of [6.4,10.45,14.5,18.55,22.5])for(const sign of [-1,1]){
 let a=sign<0?-6.3:6.0,b=sign<0?-5.5:6.8;let s=box(x-.45,x+.45,a,b,BASE,9.9);s=plane(s,0,sign<0?1:-1,sign<0?16.0:16.5);buttresses.push(s);
}
let church=Manifold.union([nave,annex,tower,spire,...buttresses]);
const sideNiche=(x,y,z,w,h)=>{const pts=[[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]];return Manifold.extrude(new CrossSection([pts]),.4).rotate([90,0,0]).translate([x,y,z]);};
const frontNiche=(y,z,w,h)=>{const pts=[[-w/2,0],[w/2,0],[w/2,h-.5],[0,h],[-w/2,h-.5]];return Manifold.extrude(new CrossSection([pts]),.4).rotate([90,0,90]).translate([-2.53,y,z]);};
const cuts=[];for(const x of [4.4,8.45,12.5,16.55,20.6]){cuts.push(sideNiche(x,-5.42,4,1.3,4.5));cuts.push(sideNiche(x,6.34,4,1.3,4.5));}
for(const sign of [-1,1]){let y=sign<0?-2.12:2.54;cuts.push(sideNiche(0,y,10.3,1.15,2.4));cuts.push(sideNiche(0,y,13.6,.9,1.5));cuts.push(sideNiche(0,y,3.5,1.7,3));}
cuts.push(frontNiche(0,.05,1.2,2.5),frontNiche(0,10.3,1.15,2.4),frontNiche(0,13.6,.9,1.5));
// Four clock faces in the sloping spire are shallow circular recesses.
for(const ang of [0,90,180,270]){
 const clock=Manifold.cylinder(.4,.5,.5,24).rotate([90,0,0]).translate([0,1.92,18.7]).rotate([0,0,ang]);cuts.push(clock);
}
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Nederlands Hervormde Kerk Rossum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0263100000004374"],description:"Zaalkerk met romaanse toren en vijfzijdige koorsluiting; +X van toren naar koor.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0263100000004374","https://monumentenregister.cultureelerfgoed.nl/monumenten/32725","https://monumentenregister.cultureelerfgoed.nl/monumenten/32726","https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Rossum,_Gelderland","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nederlands-hervormde-kerk-rossum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


