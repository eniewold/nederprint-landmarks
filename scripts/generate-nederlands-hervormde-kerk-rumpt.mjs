import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-rumpt";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X volgt de nok naar oost, ten opzichte van een maaiveld van circa 3,5 m NAP.
const BASE=-0.3,ORIGIN=[140534.48,432918.95],X_AXIS=[0.9849,0.1734];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const box=(x,y,z,cx,cy,cz)=>Manifold.cube([x,y,z],true).translate([cx,cy,cz]);
// Middenschip en zijbeuken met een samenhangend lang dak.
const nave=prism(rect(-17.5,6.0,-8.2,8.2),BASE,7.35);
const naveRoof=Manifold.hull([[-17.5,-8.2,7.3],[6,-8.2,7.3],[-17.5,8.2,7.3],[6,8.2,7.3],[-17.5,0,16.5],[6,0,16.5]]);
// Smaller, hoger koor met driezijdige sluiting en eigen schilddak.
const cp=[[5.7,-4.75],[15.2,-4.75],[18.2,-2.35],[18.2,2.3],[15.2,4.75],[5.7,4.75]];
const choir=prism(cp,BASE,9.65);
const choirRoof=Manifold.hull([...cp.map(([x,y])=>[x,y,9.6]),[5.7,0,17],[15,0,17]]);
// Zuiderkapel met veelhoekige sluiting en afzonderlijk schilddak.
const pp=[[-.6,-10.4],[1.4,-12.6],[4.1,-12.4],[5.5,-10],[5.5,-7.9],[-.6,-7.9]];
const chapel=prism(pp,BASE,7.25);
const chapelRoof=Manifold.hull([...pp.map(([x,y])=>[x,y,7.2]),[2.4,-7.9,11.3],[2.4,-10.3,11.3]]);
// Westtoren en haar lage ingesnoerde spits, met kleine noordwestelijke traptoren.
const tower=prism(rect(-17.8,-12.25,-2.9,2.9),BASE,19.35);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[-15.025+r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(3.0,19.3),...oct(.45,26.35)]);
const stair=prism(rect(-18.25,-16.4,2.1,4.0),BASE,11.5);
const stairRoof=Manifold.hull([[-18.25,2.1,11.45],[-16.4,2.1,11.45],[-18.25,4,11.45],[-16.4,4,11.45],[-17.32,3.05,12.5]]);
// Steunberen langs de zijgevels, met schuine koppen.
const braces=[];
for(const sign of [-1,1])for(const x of [-11.6,-7.6,-3.6,.4,4.4]){
 const y=sign*8.35;braces.push(box(1,1,5.4,x,y,2.4));
 braces.push(Manifold.hull([[x-.5,y-.5,5],[x+.5,y-.5,5],[x-.5,y+.5,5],[x+.5,y+.5,5],[x-.5,sign*8.1,6],[x+.5,sign*8.1,6]]));
}
for(const sign of [-1,1])for(const x of [10,14.5]){
 const y=sign*4.85;braces.push(box(1,1,7,x,y,3.2));
 braces.push(Manifold.hull([[x-.5,y-.5,6.6],[x+.5,y-.5,6.6],[x-.5,y+.5,6.6],[x+.5,y+.5,6.6],[x-.5,sign*4.6,7.6],[x+.5,sign*4.6,7.6]]));
}
let church=Manifold.union([nave,naveRoof,choir,choirRoof,chapel,chapelRoof,tower,spire,stair,stairRoof,...braces]);
const arch=(a,z,w,h,r)=>{const n=a*Math.PI/180;return prism([[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]],0,.7).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(r-.5),Math.sin(n)*(r-.5),z]);};
// Gevelopeningen als blinde nissen: geen vrijdragende lateien.
for(const s of [-1,1])for(const x of [-13.5,-9.5,-5.5,-1.5,2.5])if(!(s<0 && x>0))church=church.subtract(arch(s*90,2.8,1.5,2.8,8.2).translate([x,0,0]));
for(const s of [-1,1])for(const x of [8,12.2])church=church.subtract(arch(s*90,2.9,1.5,4,4.75).translate([x,0,0]));
for(const a of [90,180,270])church=church.subtract(arch(a,15,1.35,2.5,2.9).translate([-15.025,0,0]));
church=church.subtract(arch(180,0,2.6,10,2.8).translate([-15.025,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Nederlands Hervormde Kerk Rumpt",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.5,groundOffsetMetres:0,groundSamplePoints:[[0,8.8],[-12,8.8],[9,5.3],[-10,-8.8]],replacesBuildings:["NL.IMBAG.Pand.0236100000008578"],description:"Driebeukige kerk met ingebouwde toren, hoger koor en zuidelijke kapel.",realWorld:{groundNapM:3.5},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000008578","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/16515","https://monumentenregister.cultureelerfgoed.nl/monumenten/16516","https://www.archimon.nl/gelderland/rumptherv.html"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nederlands-hervormde-kerk-rumpt.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

