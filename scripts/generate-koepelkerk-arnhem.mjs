import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="koepelkerk-arnhem";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// RD-aligned axes, origin at the centre of the octagonal church.
const BASE=-0.5,ORIGIN=[190741.75,443945.6],X_AXIS=[1,0],GROUND_NAP=16.501;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const oct=[[-9.37,-7.8],[-1.07,-12.15],[7.86,-9.36],[12.19,-1.02],[9.35,7.97],[1.11,12.22],[-7.83,9.41],[-12.19,1.11]];
const wall=prism(oct,BASE,13.65);
// Smooth ellipsoidal dome clipped by the octagonal drum. It is a continuous surface, not a stack of layers.
const dome=Manifold.sphere(1,96).scale([12.2,12.2,8.8]).translate([0,0,13.55]).intersect(prism(oct,13.54,23));
const annex=prism([[-5.88,10],[-.75,11.64],[-1.39,13.68],[-2.92,14.48],[-5.8,13.55],[-6.62,12.04]],BASE,5.1);
const lanternPoly=Array.from({length:8},(_,i)=>[2.05*Math.cos(i*Math.PI/4),2.05*Math.sin(i*Math.PI/4)]);
const lantern=prism(lanternPoly,21.25,26.25);const lanternDome=Manifold.sphere(1,48).scale([2.05,2.05,1.7]).translate([0,0,26.2]).intersect(prism(lanternPoly,26.19,28));
let church=Manifold.union([wall,dome,annex,lantern,lanternDome]);
// Arched recesses face out from each of the eight bays.
const cuts=[];for(let i=0;i<8;i++){const a=oct[i],b=oct[(i+1)%8],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,ang=Math.atan2(my,mx)*180/Math.PI,dist=Math.hypot(mx,my);const part=Manifold.union([box(dist-.35,dist+.5,-1.15,1.15,4.8,10.1),Manifold.cylinder(.85,1.15,1.15,24).rotate([0,90,0]).translate([dist-.35,0,10.1])]).rotate([0,0,ang]);cuts.push(part);}
for(let i=0;i<8;i++){const angle=i*45;cuts.push(box(1.72,2.35,-.48,.48,22.2,25.65).rotate([0,0,angle]));}
// West-facing entrance, visibly broad at ground level.
cuts.push(box(-12.6,-11.2,-1.1,1.1,BASE,3.5));church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Koepelkerk Arnhem",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0202100000253043"],description:"Achthoekige centraalbouw met ellipsoïdale koepel, achtzijdige lantaarn en lage achteraanbouw. Details naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000253043","https://www.monumenten.nl/monument/8331","https://commons.wikimedia.org/wiki/Category:Koepelkerk,_Arnhem","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-koepelkerk-arnhem.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


