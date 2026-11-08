import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-johannes-de-doperkerk-merselo";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X-as loopt langs het schip vanaf de achthoekige zijtoren naar het koor.
const BASE=-.5,ORIGIN=[192676.25,393548.35],X_AXIS=[.998,-.065];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(s,ridge,at,slope)=>plane(plane(s,0,slope,ridge-slope*at),0,-slope,ridge+slope*at);
// Eén schip met forse kap en lager driezijdig gesloten middeleeuws koor.
const nave=roofX(box(-1.8,20.5,1.35,11.5,BASE,18.95),18.95,6.2,1.47);
let choir=prism([[20.3,2.55],[25.6,2.55],[28.8,4.35],[28.8,7.95],[25.6,9.6],[20.3,9.6]],BASE,13.9);
choir=roofX(choir,13.9,6.1,1.4);choir=plane(choir,-1.5,0,52.3);
const sac=roofX(box(15,23.6,10.6,13.0,BASE,7.7),7.7,10.6,.9);
// Achthoekige traptoren en naaldspits; afmetingen bij de top voor 1:1000 verbreed.
const ring=(cx,cy,r,z)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return[cx+r*Math.cos(a),cy+r*Math.sin(a),z]});
const footprint=ring(-.7,0,1.95,0).map(([x,y])=>[x,y]);const tower=prism(footprint,BASE,22.7);
const spire=Manifold.hull([...ring(-.7,0,1.95,22.65),...ring(-.7,0,.49,32.8)]);
// Eén verticaal trapgevelprofiel, dwars op het schip en verankerd in de kap.
const steps=[[1.35,10],[11.5,10],[11.5,11.4],[10.75,11.4],[10.75,12.8],[10,12.8],[10,14.1],[9.25,14.1],[9.25,15.4],[8.5,15.4],[8.5,16.7],[7.75,16.7],[7.75,18],[7,18],[7,19.5],[6.55,19.5],[6.55,20.4],[5.8,20.4],[5.8,19.5],[5.35,19.5],[5.35,18],[4.6,18],[4.6,16.7],[3.85,16.7],[3.85,15.4],[3.1,15.4],[3.1,14.1],[2.35,14.1],[2.35,12.8],[1.6,12.8],[1.6,11.4],[1.35,11.4]];
const gable=prism(steps,0,1.0).rotate([90,0,90]).translate([19.5,0,0]);
const westGable=prism(steps,0,1.0).rotate([90,0,90]).translate([-1.8,0,0]);
const solids=[nave,choir,sac,tower,spire,gable,westGable];
// De steunberen lopen verticaal langs de traveeën; de bovenzijde helt af.
for(const x of [3.8,9.0,14.2,19.4])for(const side of [-1,1]){
 const y0=side<0?.1:11.4,y1=side<0?1.55:12.8;
 let b=box(x-.52,x+.52,y0,y1,BASE,10.8);b=plane(b,0,side<0?1:-1,side<0?11:23.2);solids.push(b);
}
let church=Manifold.union(solids);
// Grote spitsboogvensters en hoge galmgaten als ondiepe zelfdragende nissen.
const arch=(x,y,z,w,h,depth=.85)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.9],[0,h],[-w/2,h-w*.9]],0,depth).rotate([90,0,0]).translate([x,y,z]);
for(const x of [1.1,6.4,11.6,16.8])for(const y of [1.6,11.8])church=church.subtract(arch(x,y,3.0,1.65,6.8));
for(const x of [-1.4,0])church=church.subtract(arch(x,-1.35,17,1.0,4.1));
// Grote spitsboog in het westelijke front en een kleinere nis in de topgevel.
church=church.subtract(arch(6.2,0,2.4,2.8,7.8).rotate([0,0,90]).translate([-2.0,0,0]));
church=church.subtract(arch(6.2,0,13.1,1.3,4.0).rotate([0,0,90]).translate([-2.0,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Johannes de Doperkerk Merselo",origin:ORIGIN,xAxis:X_AXIS,groundHeight:25.776,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0984100000410749"],description:"Eenbeukige kerk met een opvallende trapgevel, lager driezijdig koor en slanke achthoekige zijtoren met naaldspits.",realWorld:{groundNapM:25.776,towerHeightM:32.8},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0984100000410749","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://www.kerkgebouwen-in-limburg.nl/kerken/merselo/johannes-de-doper","https://commons.wikimedia.org/wiki/Category:Sint-Johannes_de_Doperkerk_(Merselo)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-johannes-de-doperkerk-merselo.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





