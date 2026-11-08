import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-kerk-ressen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X-as langs de nok oostwaarts; maaiveld ca. +10,45 m NAP.
const BASE=-0.3,ORIGIN=[188112,433611],X_AXIS=[0.9981,0.0613];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const box=(x,y,z,cx,cy,cz)=>Manifold.cube([x,y,z],true).translate([cx,cy,cz]);
// Romaans schip en lager zadeldak.
const nave=prism(rect(-6.0,4.25,-3.55,3.55),BASE,4.65);
const naveRoof=Manifold.hull([[-6,-3.55,4.6],[4.25,-3.55,4.6],[-6,3.55,4.6],[4.25,3.55,4.6],[-6,0,7.55],[4.25,0,7.55]]);
// Het hogere gotische koor heeft een driezijdige sluiting en eigen kapvlakken.
const choirpoly=[[4,-3.65],[10.1,-3.65],[12.3,-1.75],[12.3,1.4],[10.2,3.65],[4,3.65]];
const choir=prism(choirpoly,BASE,5.95);
const choirRoof=Manifold.hull([...choirpoly.map(([x,y])=>[x,y,5.9]),[4,0,9.8],[9.8,0,9.8]]);
// Zuidkapel met dak dwars op het koor, zoals te zien op de foto's.
const chapel=prism(rect(4.15,8.4,-6.3,-3.35),BASE,5.15);
const chapelRoof=Manifold.hull([[4.15,-6.3,5.1],[8.4,-6.3,5.1],[4.15,-3.35,5.1],[8.4,-3.35,5.1],[6.275,-6.3,7.2],[6.275,-3.35,7.2]]);
// Toren met vierkant grondplan en ingesnoerde spits; het hiaat met het schip
// is bij de printschaal gesloten om één draagkrachtig volume te krijgen.
const tower=prism(rect(-11.15,-5.8,-2.55,2.65),BASE,13.85);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[-8.48+r*Math.cos(Math.PI/8+i*Math.PI/4),.05+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(2.72,13.8),...oct(.45,19.55)]);
// Uitkragende koorsteunberen met schuine koppen.
const braces=[];
for(const sign of [-1,1]) for(const x of [4.3,8.9]){
 const y=sign*3.8; braces.push(box(1,1.0,4.6,x,y,2));
 braces.push(Manifold.hull([[x-.5,y-.5,4.2],[x+.5,y-.5,4.2],[x-.5,y+.5,4.2],[x+.5,y+.5,4.2],[x-.5,sign*3.5,5.2],[x+.5,sign*3.5,5.2]]));
}
let church=Manifold.union([nave,naveRoof,choir,choirRoof,chapel,chapelRoof,tower,spire,...braces]);
// Eenvoudige blinde spitsboognissen, 0,7 m diep uitgesneden.
const arch=(a,z,w,h,r)=>{const n=a*Math.PI/180;return prism([[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]],0,.7).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(r-.5),Math.sin(n)*(r-.5),z]);};
for(const x of [-4,-.2,3])for(const s of [-1,1])church=church.subtract(arch(s*90,1.8,1.0,2.0,3.55).translate([x,0,0]));
for(const x of [6,9.2]) church=church.subtract(arch(90,2,1.35,3.1,3.65).translate([x,0,0]));
for(const a of [90,180,270])church=church.subtract(arch(a,9.6,1.1,2.1,2.6).translate([-8.48,.05,0]));
church=church.subtract(arch(180,0,1.45,2.8,2.67).translate([-8.48,.05,0]));
const parts=[["building:kerk",church]];
const META={name:"Hervormde kerk Ressen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:10.45,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1705100000001213"],description:"Romaanse toren en schip met hoger driezijdig koor en zuidkapel.",realWorld:{groundNapM:10.45},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000001213","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://mijngelderland.nl/inhoud/routes/ommetje-ressen/kerk-en-kosterij","https://www.archimon.nl/gelderland/ressenherv.html"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-ressen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

