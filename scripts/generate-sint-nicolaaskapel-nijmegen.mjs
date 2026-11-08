import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","100")),slug="sint-nicolaaskapel-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.3,ORIGIN=[188248.63,428948.18],X_AXIS=[1,0];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const reg=(n,r,z=0)=>Array.from({length:n},(_,i)=>[r*Math.cos(2*Math.PI*i/n+Math.PI/16),r*Math.sin(2*Math.PI*i/n+Math.PI/16),z]);
const outer=reg(16,6.95).map(([x,y])=>[x,y]);
const inner=reg(8,4.8).map(([x,y])=>[x,y]);
let walls=prism(outer,BASE,6.8); let drum=prism(inner,6.5,12.8);
// De lagere omgang heeft een doorlopend zestienzijdig lessenaarsdak; de octogonale kern heeft een steil tentdak.
const lowerRoof=Manifold.hull([...reg(16,6.95,6.75),...reg(16,4.55,8.75)]);
const highRoof=Manifold.hull([...reg(8,4.8,12.75),...reg(8,.48,20)]);
let church=Manifold.union([walls,drum,lowerRoof,highRoof]);
// Nisvorm met afgeschuinde bovenzijde, per vlak in plaats van open overhang.
const cut=(a,z,w,h,r)=>{const n=a*Math.PI/180;return prism([[-w/2,0],[w/2,0],[w/2,h-.55],[0,h],[-w/2,h-.55]],0,.7).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(r-.5),Math.sin(n)*(r-.5),z]);};
for(let i=0;i<16;i++){let a=22.5*i+22.5;for(const z of [1.0,4.0]) church=church.subtract(cut(a,z,1.05,2.1,6.82));}
for(let i=0;i<8;i++)church=church.subtract(cut(45*i+33.75,9,1.15,2.65,4.44));
// Westelijk ingangsrisaliet met afzonderlijk zadeldak.
const b=(x,y,z)=>Manifold.cube([x,y,z],true);
const entry=b(2.8,3.2,6.2).translate([-6.7,-1.3,2.8]).rotate([0,0,12]);
const er=Manifold.hull([[-8.3,-3.1,5.8],[-5.2,-3.1,5.8],[-8.3,.5,5.8],[-5.2,.5,5.8],[-6.75,-3.1,8.2],[-6.75,.5,8.2]]).rotate([0,0,12]);
church=Manifold.union([church,entry,er]);
// Verdiepte toegangsboog en nis in de westgevel, met afgeschuinde bovenzijde.
church=church.subtract(cut(180,0,1.65,3.1,8.3).translate([0,-1.3,0]).rotate([0,0,12]));
church=church.subtract(cut(180,4.1,1.1,1.65,8.3).translate([0,-1.3,0]).rotate([0,0,12]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Nicolaaskapel Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:32.782,groundOffsetMetres:BASE,groundSamplePoints:[[0,0],[3,0],[-3,0],[0,3],[0,-3]],replacesBuildings:["NL.IMBAG.Pand.0268100000045513"],description:"Zestienzijdige kapel met achtzijdige kern, hellende daken en ingangsrisaliet op de Valkhofheuvel.",realWorld:{groundNapM:32.782},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000045513","https://monumentenregister.cultureelerfgoed.nl/monumenten/31192","https://sint-nicolaas.eu/nijmegen/","https://www.brugnijmegen.nl/nieuws/algemeen/149537/open-monumentendag-nijmegen"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-nicolaaskapel-nijmegen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

