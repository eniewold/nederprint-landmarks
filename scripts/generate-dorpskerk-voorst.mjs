import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="dorpskerk-voorst";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[207007.97175,465024.51825],X_AXIS=[.94197996,.33566911],GROUND_NAP=7.919;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
let nave=prism([[3.71,-5.21],[34.08,-5.21],[37.05,-2.17],[37.05,2.37],[34.5,4.87],[34.5,10.48],[3.86,10.48]],BASE,19.97);
nave=plane(nave,0,-1.19,19.85);nave=plane(nave,0,1,20.07);nave=plane(nave,-2,0,87.6);
let aisle=box(3.71,22.79,-9.28,-5.20,BASE,16);aisle=plane(aisle,0,1.70,23.72);
const tower=box(-3.06,3.87,-3.68,3.68,BASE,25.2);
const shoulder=Manifold.hull([...sq(.4,0,3.45,25.15),...oct(.4,0,2.8,26.3)]);
const spire=Manifold.hull([...oct(.4,0,2.8,26.25),...oct(.4,0,.45,45.3)]);
const supports=[];for(const x of [4.4,9.2,14,18.8,22,26,30,33])for(const sign of [-1,1]){let y=sign<0?(x>22.79?-5.21:-9.28):10.48;let s=box(x-.45,x+.45,sign<0?y-.85:y-.1,sign<0?y+.1:y+.85,BASE,6.8);s=plane(s,0,sign<0?1:-1,sign<0?6.8-y:6.8+y);supports.push(s);}
const dormers=[];for(const x of [8,15,21])for(const sign of [-1,1]){const y=sign*4;let z=sign<0?20.10+1.32*y:19.85-1.19*y;let d=box(x-.65,x+.65,y-.65,y+.65,BASE,z+1.2);d=plane(d,sign<0?1.1:-1.1,0,sign<0?z+1.2+1.1*x:z+1.2-1.1*x);dormers.push(d);}
let church=Manifold.union([nave,aisle,tower,shoulder,spire,...supports,...dormers]);
const cuts=[];for(const x of [6.8,11.6,16.4,21,25,29,32])for(const sign of [-1,1]){let y=sign<0?(x>22.79?-5.21:-9.28):10.48;cuts.push(box(x-.55,x+.55,y-.3,y+.3,2.1,5.7));}
for(const y of [-1.35,1.35])for(const z of [6,12,19])cuts.push(box(-3.3,-2.75,y-.5,y+.5,z,z+2.5));
for(const x of [-1,1.8])for(const sign of [-1,1])cuts.push(box(x-.45,x+.45,sign<0?-3.95:3.4,sign<0?-3.4:3.95,19,22));
cuts.push(box(-3.4,-2.7,-.65,.65,BASE,3));church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Dorpskerk Voorst",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0285100000107390"],description:"Laatgotische kerk met romaanse westtoren en hoge spits. Geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0285100000107390","https://monumentenregister.cultureelerfgoed.nl/monumenten/38044","https://monumentenregister.cultureelerfgoed.nl/monumenten/38045","https://commons.wikimedia.org/wiki/File:Voorst-38044.JPG","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-dorpskerk-voorst.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


