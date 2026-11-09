import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="catharinakerk-etten-leur";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[102866,398088],X_AXIS=[.99734,.0729];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Het overgebleven eenbeukige koor onder zadeldak met polygonale sluiting.
let nave=box(-11.2,14,-5.2,5.1,BASE,18.7);nave=plane(nave,0,1.35,18.77);nave=plane(nave,0,-1.35,18.63);
let choir=prism([[13.8,-5.2],[17.4,-4.5],[19.3,-2.5],[20.3,0],[19.2,2.6],[17.2,4.6],[13.8,5.1]],BASE,18.7);choir=plane(choir,0,1.35,18.77);choir=plane(choir,0,-1.35,18.63);choir=plane(choir,-1.35,0,45.0);
// 1771: vierkante toren met ingetrokken achtkante klokgeleding en lantaarn.
let tower=box(-20.3,-11,-5.2,5.2,BASE,30.2);
let shoulder=Manifold.cylinder(6.3,3.9,2.5,8).translate([-15.65,0,30.1]);
let clock=Manifold.cylinder(3.4,2.5,2.5,8).translate([-15.65,0,36.3]);
let lantern=Manifold.cylinder(6.0,1.8,1.8,8).translate([-15.65,0,39.6]);
let dome=Manifold.cylinder(3.8,1.8,.46,8).translate([-15.65,0,45.5]);
let stair=Manifold.cylinder(10.0,1.2,1.2,8).translate([-18,-5.0,BASE]);let stairRoof=Manifold.cylinder(2.0,1.2,.46,8).translate([-18,-5,9.4]);
let towersupport=[];for(const x of [-19.8,-11.8])for(const y of [-5.5,4.5]){towersupport.push(box(x-.5,x+.5,y,y+1,BASE,18));towersupport.push(Manifold.cylinder(1.9,.5,.46,8).translate([x,y+.5,30.1]))}
let butt=[];for(const x of [-8.8,-4.3,.2,4.7,9.2,13.7])for(const y of [-5.6,4.8]){let b=box(x-.5,x+.5,y,y+1,BASE,12.8);butt.push(b)}
for(const [x,y] of [[17.4,-4.5],[19.3,-2.5],[19.2,2.6],[17.2,4.6]])butt.push(box(x-.5,x+.5,y-.5,y+.5,BASE,12.8));
let church=Manifold.union([nave,choir,tower,shoulder,clock,lantern,dome,stair,stairRoof,...towersupport,...butt]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.0).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-6.6,-2.1,2.4,6.9,11.4])for(const y of [-4.75,5.55])church=church.subtract(niche(x,y,3,1.6,5));
// Dichtgemetselde maar zichtbare grote koornissen op de schuine gevelvlakken.
for(const [x,y,a] of [[18.06,-3.22,46.5],[19.43,-1.1,68.2],[19.38,1.14,112.9],[17.92,3.32,135]])church=church.subtract(niche(0,0,4,1.2,6).rotate([0,0,a]).translate([x,y,0]));
for(const z of [12,19,25])for(const a of [0,90,180])church=church.subtract(niche(0,5.65,z,1.5,4.2).rotate([0,0,a]).translate([-15.65,0,0]));
for(const dx of [-1.5,1.5])for(const a of [0,90,180])church=church.subtract(niche(dx,5.65,24.8,1.3,4).rotate([0,0,a]).translate([-15.65,0,0]));
church=church.subtract(niche(0,.45,BASE,1.7,3.5).rotate([0,0,90]).translate([-20.3,0,0]));
for(const a of [0,90,180,270])church=church.subtract(niche(0,2.4,40.3,1.0,4.5).rotate([0,0,a]).translate([-15.65,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Catharinakerk Etten-Leur",origin:ORIGIN,xAxis:X_AXIS,groundHeight:8.927,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0777100000151750"],description:"Eenbeukig gotisch koor met klassieke toren en achtkante lantaarn uit 1771.",realWorld:{groundNapM:8.927,ahn5RoofNapM:27.65,ahn5TowerNapM:58.89},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0777100000151750","https://monumentenregister.cultureelerfgoed.nl/monumenten/15401","https://commons.wikimedia.org/wiki/Category:Exterior_of_Catharinakerk_(Etten-Leur)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-catharinakerk-etten-leur.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








