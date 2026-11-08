import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-lambertuskerk-neeritter";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X loopt vanaf het westelijk torenfront naar de koorsluiting.
const BASE=-.5,ORIGIN=[184204,352736.5],X_AXIS=[.999,.045];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(s,ridge,at,slope)=>plane(plane(s,0,slope,ridge-slope*at),0,-slope,ridge+slope*at);
// Gotisch middenschip en lagere zijbeuken, met doorlopende schuine dakvlakken.
const nave=roofX(box(4.0,26.0,-4.2,3.5,BASE,17.7),17.7,-.7,1.5);
const south=plane(box(2.3,25,-10.1,-3.9,BASE,12.5),0,.95,16.15);
const north=plane(box(3.2,20.5,3.4,7.2,BASE,9.6),0,-.68,11.95);
// Veelhoekige koorsluiting met eigen afgeschuinde dakvlakken.
let choir=prism([[25.5,-4.25],[28.0,-3.8],[30.5,-1.8],[30.5,1.5],[28.3,3.5],[25.5,3.5]],BASE,17.0);
choir=roofX(choir,17,-.7,1.45);choir=plane(choir,-1.35,0,54.0);
const sac=box(20.2,24.8,3.4,7.4,BASE,7.2);
// Vierkante toren met achtkantige lantaarn en lage bolvormige bekroning.
const tower=box(-3.0,3.5,-3.7,3.5,BASE,24.45);
const rect=(a,b,c,d,z)=>[[a,c,z],[b,c,z],[b,d,z],[a,d,z]];
const shoulder=Manifold.hull([...rect(-3,3.5,-3.7,3.5,24.4),...rect(-1.5,2,-1.7,1.5,26.45)]);
const ring=(r,z)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [.25+r*Math.cos(a),-.1+r*Math.sin(a),z]});
const lant=prism(ring(1.75,0).map(([x,y])=>[x,y]),26.4,30.4);
const dome=Manifold.hull([...ring(1.75,30.35),...ring(1.35,31.5),...ring(.5,32.0)]);
const ball=Manifold.cylinder(1.2,.5,.5,8).translate([.25,-.1,31.95]);
const solids=[nave,south,north,choir,sac,tower,shoulder,lant,dome,ball];
// Steunberen rond schip en koor.
for(const x of [6,11,16,21,25])for(const side of [-1,1]){
 const y0=side<0?-11.25:7.1,y1=side<0?-10:8.1;
 let b=box(x-.5,x+.5,y0,y1,BASE,7.2);b=plane(b,0,side<0?1:-1,side<0?18:15.3);solids.push(b);
}
let church=Manifold.union(solids);
// Grote rondboog- en spitsboognissen; dakjes van de uitsparingen zijn zelfdragend.
const arch=(x,y,z,w,h,depth=.9)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,depth).rotate([90,0,0]).translate([x,y,z]);
for(const x of [8.5,13.5,18.5,23])for(const y of [-9.85,7.5])church=church.subtract(arch(x,y,2.4,1.5,4.5));
for(const y of [-3.0,3.9])church=church.subtract(arch(.25,y,17,2.2,4.5,1.4));
for(const y of [-0.75,1.95])church=church.subtract(arch(.25,y,26.9,1.1,2.8,1.1));
church=church.subtract(arch(0,0,26.9,1.1,2.8,1.1).rotate([0,0,90]).translate([-1.6,-.1,0]));
church=church.subtract(arch(0,0,26.9,1.1,2.8,1.1).rotate([0,0,-90]).translate([2.1,-.1,0]));
church=church.subtract(arch(0,0,17,2.2,4.5,1.4).rotate([0,0,90]).translate([-3.25,0,0]));
church=church.subtract(arch(0,0,17,2.2,4.5,1.4).rotate([0,0,-90]).translate([3.75,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Lambertuskerk Neeritter",origin:ORIGIN,xAxis:X_AXIS,groundHeight:28.742,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1640100000053033"],description:"Gotische kerk met lagere zijbeuken en een romaanse westtoren met opvallende achthoekige peperbusbekroning.",realWorld:{groundNapM:28.742,towerHeightM:33.15},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1640100000053033","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://www.kerkgebouwen-in-limburg.nl/kerken/neeritter/lambertus","https://commons.wikimedia.org/wiki/Category:Lambertus,_Neeritter"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-lambertuskerk-neeritter.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));







