import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-willibrorduskerk-oude-pekela";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[262721.5,569247],X_AXIS=[-.65,.76],GROUND_NAP=1.625;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const octsolid=(x,y,r,z0,z1)=>prism(oct(x,y,r,0).map(v=>v.slice(0,2)),z0,z1);
// Nave, transept and polygonal choir are independent architectural volumes.
let nave=box(1.7,33.2,-4.3,4.9,BASE,21.05);nave=plane(nave,0,1.7,21.05);nave=plane(nave,0,-1.7,22.4);
let transept=box(18.8,27.1,-9,9.4,BASE,21.05);transept=plane(transept,1.7,0,-17.9);transept=plane(transept,-1.7,0,60.0);
let choir=prism([[31,-4.7],[34.2,-4.7],[37.1,-.8],[37.1,2.2],[34.1,4.8],[31,4.8]],BASE,21.05);choir=plane(choir,0,1.7,21.05);choir=plane(choir,0,-1.7,22.4);choir=plane(choir,-1.7,0,77.5);
const aisles=[];for(const side of [-1,1]){let a=box(3,19.1,side<0?-7.2:4.3,side<0?-4:7.9,BASE,13.8);a=plane(a,0,side<0?1.0:-1.0,side<0?15:17.8);aisles.push(a);}
let northChapel=box(27,32.5,4.1,8.5,BASE,12.5);northChapel=plane(northChapel,0,-1,18.5);let southChapel=box(27,33,-7.1,-3.7,BASE,12.5);southChapel=plane(southChapel,0,1,18.0);
let annex=box(26.7,33.2,-14,-7,BASE,10);annex=plane(annex,0,1,20.8);annex=plane(annex,0,-1,1.0);
// Tall west tower with eight-faced spire; parish documents establish 68 m above ground.
const tower=box(-2.9,3.1,-3.2,3.2,BASE,37.1);
let gable1=box(-3.15,3.15,-3.15,3.15,36.9,41);gable1=plane(gable1,0,1.25,41);gable1=plane(gable1,0,-1.25,41);
let gable2=box(-3.15,3.15,-3.15,3.15,36.9,41);gable2=plane(gable2,1.25,0,41);gable2=plane(gable2,-1.25,0,41);
const spire=Manifold.hull([...oct(0,0,3.55,36.9),...oct(0,0,.49,67.8)]);
let frontwing=box(-2.4,3,-11.3,-3.0,BASE,12);frontwing=plane(frontwing,1.5,0,12);frontwing=plane(frontwing,-1.5,0,12);
const turret=octsolid(1.7,5.7,2.05,BASE,12);const turretRoof=Manifold.hull([...oct(1.7,5.7,2.05,11.95),...oct(1.7,5.7,.48,19.0)]);
const ridgeTurret=octsolid(22.8,.4,1.05,20,24.4);const ridgeSpire=Manifold.hull([...oct(22.8,.4,1.05,24.35),...oct(22.8,.4,.48,34.2)]);
const supports=[];for(const x of [4.8,9.9,15,19.1,27])for(const side of [-1,1]){let a=box(x-.5,x+.5,side<0?-8.1:7.4,side<0?-6.9:8.6,BASE,7.2);a=plane(a,0,side<0?1:-1,side<0?15.1:15.4);supports.push(a);}
let church=Manifold.union([nave,transept,choir,...aisles,northChapel,southChapel,annex,tower,gable1,gable2,spire,frontwing,turret,turretRoof,ridgeTurret,ridgeSpire,...supports]);
const cuts=[];for(const x of [7.2,12.5,17])for(const side of [-1,1])cuts.push(box(x-.7,x+.7,side<0?-7.5:7.55,side<0?-6.9:8.15,2.5,6.4));
cuts.push(box(-3.1,-2.6,-.7,.7,BASE,3.8),box(-3.15,-2.6,-1.2,1.2,7,18),box(-3.15,-2.6,-1.3,-.25,26,33),box(-3.15,-2.6,.25,1.3,26,33));for(const side of [-1,1])cuts.push(box(-1.1,1.1,side<0?-3.5:2.85,side<0?-2.85:3.5,26,34));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Sint-Willibrorduskerk Oude Pekela",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0765100000005497"],description:"Neogotische kruisbasiliek met vijfzijdig koor, smalle zijbeuken, doopkapel, dakruiter en spitse westtoren.",realWorld:{groundNapM:GROUND_NAP,towerHeightM:68},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0765100000005497","https://www.heiligenorbertusparochie.nl/oude-pekela/kerkgemeenschap/kerkgebouw/","https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Oude_Pekela)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-oude-pekela.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


