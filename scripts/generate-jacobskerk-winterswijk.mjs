import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="jacobskerk-winterswijk";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[246596.2,443465.8],X_AXIS=[.99845,.05567],GROUND_NAP=34.481;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
let nave=box(-5.4,21.5,-10.3,10.3,BASE,18.8);nave=plane(nave,0,1.15,18.8);nave=plane(nave,0,-1.15,18.8);
let choir=prism([[21.3,-7.2],[39.5,-7.2],[42.2,-4.3],[45.2,-1.8],[45.2,1.8],[42.2,4.3],[39.5,7.2],[21.3,7.2]],BASE,21.7);choir=plane(choir,0,1.69,21.7);choir=plane(choir,0,-1.69,21.7);choir=plane(choir,-1.7,0,91.4);
let tower=box(-5.35,5.4,-5.35,5.35,BASE,34.4);
const shoulder=Manifold.hull([...sq(0,0,5.35,34.35),...oct(0,0,3.5,36.0)]);
const clock=Manifold.hull([...oct(0,0,3.5,35.95),...oct(0,0,3.0,39)]);
const spire=Manifold.hull([...oct(0,0,3.0,38.95),...oct(0,0,.45,57)]);
const supports=[];for(const x of [2,6.5,11,15.5,20])for(const sign of [-1,1]){const y=sign*10.3;let p=box(x-.5,x+.5,sign<0?y-1:y-.1,sign<0?y+.1:y+1,BASE,7.6);p=plane(p,0,sign<0?1:-1,17.9);supports.push(p);}for(const x of [23,28,33,38])for(const sign of [-1,1]){let y=sign*7.2;let p=box(x-.5,x+.5,sign<0?y-1:y-.1,sign<0?y+.1:y+1,BASE,9.1);p=plane(p,0,sign<0?1:-1,16.3);supports.push(p);}
let church=Manifold.union([nave,choir,tower,shoulder,clock,spire,...supports]);const cuts=[];
for(const x of [3.8,8.4,13,17.5])for(const sign of [-1,1]){const y=sign*10.3;cuts.push(box(x-.6,x+.6,y-.3,y+.3,2.1,5.7));}
for(const x of [25.2,30.4,35.4])for(const sign of [-1,1]){const y=sign*7.2;cuts.push(box(x-.7,x+.7,y-.3,y+.3,3,8.5));}
for(const x of [-2,2])for(const sign of [-1,1])cuts.push(box(x-.65,x+.65,sign<0?-5.65:5.05,sign<0?-5.05:5.65,24.5,31.0));
for(const y of [-2,2])cuts.push(box(-5.65,-5.05,y-.65,y+.65,24.5,31));cuts.push(box(-5.65,-5.05,-.7,.7,BASE,3));church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Jacobskerk Winterswijk",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0294100000414172"],description:"Gotische kerk met hoger koor, grote westtoren en ingesnoerde spits. Geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0294100000414172","https://monumentenregister.cultureelerfgoed.nl/monumenten/39053","https://monumentenregister.cultureelerfgoed.nl/monumenten/39054","https://www.jacobskerkwinterswijk.nl/","https://commons.wikimedia.org/wiki/Category:Jacobskerk_(Winterswijk)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-jacobskerk-winterswijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


