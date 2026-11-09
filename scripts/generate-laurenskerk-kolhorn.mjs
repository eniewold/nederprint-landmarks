// Willibrorduskerk Haringhuizen: zaalkerk en ingekorte toren als bouwdelen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="laurenskerk-kolhorn";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[121583.8,534169.15],X_AXIS=[.9983,.059];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip met driezijdige koorsluiting en noordelijke kruisarm.
let nave=prism([[2.2,-5.15],[20.4,-5.15],[23,-2.5],[23,2.5],[20.4,5.15],[2.2,5.15]],BASE,16.1);nave=plane(nave,0,1.55,16.1);nave=plane(nave,0,-1.55,16.1);nave=plane(nave,-1.55,0,51.8);
let arm=box(7.6,17.1,4.5,11.4,BASE,15.4);arm=plane(arm,1.35,0,-1.25);arm=plane(arm,-1.35,0,32.1);
let tower=box(-1.9,2.5,-2.65,2.3,BASE,20.9);let cap=box(-2.1,2.7,-2.85,2.5,20.4,21.1);
let spire=Manifold.cylinder(7.8,1.85,.48,8).rotate([0,0,22.5]).translate([.3,-.18,21]);
let entrance=box(22.5,25.4,-1.45,1.45,BASE,4.5);entrance=plane(entrance,0,.9,4.5);entrance=plane(entrance,0,-.9,4.5);
let church=Manifold.union([nave,arm,tower,cap,spire,entrance]);
const niche=(x,y,z,w,h)=>{let r=w/2;return prism([[-r,0],[r,0],[r,h-r],[0,h],[-r,h-r]],0,.8).rotate([90,0,0]).translate([x,y,z])};
// Hoge spitsboogramen op zuidgevel en noordarm.
for(const x of [4.5,7.7,10.9,14.1,17.3,20.5])church=church.subtract(niche(x,-4.8,2.3,1.25,4.2));
for(const x of [12.4])church=church.subtract(niche(x,11.8,2.3,1.25,4.2));
church=church.subtract(niche(0,.45,8,1.3,3.7).rotate([0,0,90]).translate([-1.9,-.18,0]));
church=church.subtract(niche(0,.5,BASE,1.35,2.6).rotate([0,0,-90]).translate([25.4,0,0]));
for(const rot of [0,90,180,270])for(const x of [-.65,.65])church=church.subtract(niche(x,2.85,18.2,.95,1.9).rotate([0,0,rot]).translate([.3,-.18,0]));
church=church.subtract(niche(0,.45,BASE,1.35,2.8).rotate([0,0,90]).translate([-1.9,-.18,0]));
for(const x of [3,6.2,9.4,12.6,15.8,19])church=Manifold.union([church,box(x-.45,x+.45,-5.75,-5,BASE,7)]);
const parts=[["building:kerk",church]];
const META={name:"Laurenskerk Kolhorn",origin:ORIGIN,xAxis:X_AXIS,groundHeight:-.157,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0412100000570105"],description:"Halve kruiskerk met driezijdige koorsluiting en negentiende-eeuwse toren.",realWorld:{groundNapM:-.157,ahn5TowerNapM:28.72},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0412100000570105","https://monumentenregister.cultureelerfgoed.nl/monumenten/8679","https://monumentenregister.cultureelerfgoed.nl/monumenten/8680","https://commons.wikimedia.org/wiki/Category:Laurenskerk_(Kolhorn)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-meeuwen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));












