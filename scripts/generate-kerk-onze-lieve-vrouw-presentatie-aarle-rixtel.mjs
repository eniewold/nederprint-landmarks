import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kerk-onze-lieve-vrouw-presentatie-aarle-rixtel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[172465.25,391284.25],X_AXIS=[-.214,.977];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
// Zaal met nok en schuin dakschild, lage zijaanbouwen met een plat dak.
let nave=prism([[-2.8,-9.9],[40.1,-9.9],[45.1,-3.4],[45.1,3.4],[40.1,8.4],[-2.8,8.4]],BASE,20.9);
nave=roofY(nave,20.9,0,.72);nave=plane(nave,-.8,0,53.0);
const side1=box(1.7,35.4,8.2,12.3,BASE,5.7),side2=box(1.9,35.2,-12.9,-9.7,BASE,5.7);
// Vierkante toren, achthoekige klokkenlantaarn, lage koepel en ronde bekroning.
const sac=prism([[34.5,-12.7],[41.5,-12.7],[47.9,-6.7],[45,-3.8],[40,-8.4],[34.5,-8.4]],BASE,4.0);
const front=box(-3.5,1.8,-8.5,8.4,BASE,16.0);
const tower=box(-3.5,2.8,-4.5,4.3,BASE,26.4);
const ring=(r,z)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [-.35+r*Math.cos(a),-.1+r*Math.sin(a),z]});
const lantern=prism(ring(2.7,0).map(([x,y])=>[x,y]),26.35,32.1);
const dome=Manifold.hull([...ring(2.7,32.05),...ring(1.6,34.5),...ring(.7,35.8)]);
const crown=Manifold.cylinder(2.3,.7,.5,8).translate([-.35,-.1,35.7]);
// Klassieke straatgevel: een driehoekig fronton en ingangsportiek.
const portico=box(-4.4,-3.25,-3.8,3.8,BASE,5.8);
const pediment=prism([[-4.4,14.8],[4.4,14.8],[0,17.5]],0,1.2).rotate([90,0,90]).translate([-3.5,0,0]);
let church=Manifold.union([nave,side1,side2,sac,front,tower,lantern,dome,crown,portico,pediment]);
const arch=(x,y,z,w,h,d=1)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,d).rotate([90,0,0]).translate([x,y,z]);
for(const x of [5.5,11.5,17.5,23.5,29.5,35.5])for(const y of [-9.6,8.7])church=church.subtract(arch(x,y,7.5,1.6,5.0));
for(const y of [-4.2,4.6])church=church.subtract(arch(-.35,y,20.2,2.1,4.4,1.3));
for(const y of [-2.1,2.7])church=church.subtract(arch(-.35,y,27.0,1.2,3.8,1.0));
church=church.subtract(arch(0,0,27,1.2,3.8,1).rotate([0,0,90]).translate([-3.1,-.1,0]));
church=church.subtract(arch(0,0,27,1.2,3.8,1).rotate([0,0,-90]).translate([2.4,-.1,0]));
for(const y of [-5.4,0,5.4])church=church.subtract(arch(0,0,8,1.6,5,1.2).rotate([0,0,90]).translate([-3.7,y,0]));
church=church.subtract(arch(0,0,.1,2.4,5.5,1.2).rotate([0,0,90]).translate([-3.7,0,0]));
// Drie diepe nissen laten de kolommen van de portiek leesbaar zien.
for(const y of [-2.3,0,2.3])church=church.subtract(arch(0,0,.05,1.25,4.6,1.3).rotate([0,0,90]).translate([-4.6,y,0]));
const parts=[["building:kerk",church]];
const META={name:"Onze Lieve Vrouw Presentatie Aarle-Rixtel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:16.151,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1659100000007829"],description:"Waterstaatskerk met breed schip en koepelvormige open torenlantaarn.",realWorld:{groundNapM:16.151,towerHeightM:38},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1659100000007829","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://www.bhic.nl/ontdekken/verhalen/de-kerk-van-onze-lieve-vrouwe-presentatie-in-aarle-rixtel","https://commons.wikimedia.org/wiki/Category:Kerk_van_Onze_Lieve_Vrouw_Presentatie,_Aarle-Rixtel"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kerk-onze-lieve-vrouw-presentatie-aarle-rixtel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

















