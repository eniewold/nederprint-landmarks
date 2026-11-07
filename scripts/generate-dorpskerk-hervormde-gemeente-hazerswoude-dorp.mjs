import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="dorpskerk-hervormde-gemeente-hazerswoude-dorp";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[100743,456727],X_AXIS=[1,0],GROUND_NAP=-1.097;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip met veelhoekig koor, twee gelijkwaardige dwarsbeuken en zadeldaken.
const poly=[[-13,-6.5],[12.7,-6.5],[17,-4.9],[19,-1.5],[19,2.5],[17,5.7],[12.7,6.5],[-13,6.5]];
const nave=prism(poly,BASE,8.5);
let roof=prism(poly,8.45,18);roof=plane(roof,0,-1.28,16.8);roof=plane(roof,0,1.28,16.8);roof=plane(roof,-1.28,0,33.05);
const trans=box(3.5,12.6,-10.6,10.6,BASE,8.4);
let crossRoof=box(3.5,12.6,-10.6,10.6,8.35,14);crossRoof=plane(crossRoof,-1.14,0,21.75);crossRoof=plane(crossRoof,1.14,0,3.4);
// Toren uit 1646 met kleinere uurwerkgeleding en achthoekige lantaarn.
const tower=box(-19,-12.8,-3.2,3.2,BASE,21.3);
const clock=box(-18.3,-13.5,-2.5,2.5,21.2,27.3);
const clockRoof=Manifold.extrude([[[-2.4,-2.4],[2.4,-2.4],[2.4,2.4],[-2.4,2.4]]],1.5,0,0,[.48,.48]).translate([-15.9,0,27.25]);
const lantern=Manifold.cylinder(4.2,1.25,1.25,8).translate([-15.9,0,28.6]);
const lanternRoof=Manifold.cylinder(1.3,1.3,.45,8).translate([-15.9,0,32.7]);
const finial=Manifold.cylinder(1.55,.45,.1,8).translate([-15.9,0,34]);
// Klein traptorentje bij de zuidwesthoek.
const stair=Manifold.cylinder(7.0,1.25,1.25,6).translate([-15.5,-4.25,BASE]);
const stairRoof=Manifold.cylinder(1.6,1.25,0,6).translate([-15.5,-4.25,6.45]);
let church=Manifold.union([nave,roof,trans,crossRoof,tower,clock,clockRoof,lantern,lanternRoof,finial,stair,stairRoof]);
// Muurdammen en grote vensters, alleen halfdiepe en printbare nissen.
for(const u of [-11.8,-7.6,-3.5,.4])for(const side of [-1,1])church=church.add(box(u-.4,u+.4,side<0?-7.2:6.2,side<0?-6.2:7.2,BASE,7.8));
for(const u of [-9.6,-5.4,-1.5])for(const side of [-1,1]){let c=box(u-.65,u+.65,side*6.5-.3,side*6.5+.3,2.4,6.6);c=plane(c,-1.2,0,6.6+1.2*u);c=plane(c,1.2,0,6.6-1.2*u);church=church.subtract(c)}
for(const side of [-1,1]){let c=box(7.3,8.7,side*10.6-.3,side*10.6+.3,2.4,6.8);c=plane(c,-1.2,0,16.4);c=plane(c,1.2,0,-2.8);church=church.subtract(c)}
for(const side of [-1,1])for(const u of [-16.65,-15.15])church=church.subtract(box(u-.42,u+.42,side*3.2-.27,side*3.2+.27,15.8,18.8));
for(const side of [-1,1])church=church.subtract(box(side<0?-19.25:-13.05,side<0?-18.75:-12.55,-.65,.65,15.8,18.8));
// Toegang en uurwerknis, zoals op de historische torengevel.
church=church.subtract(box(-19.25,-18.65,-.8,.8,0,3));
church=church.subtract(Manifold.cylinder(.55,.95,.95,20).rotate([0,90,0]).translate([-18.55,0,24.4]));
// Opengewerkte lantaarn is op printschaal als vier blinde gaten aangeduid.
for(const side of [-1,1]){let a=box(-16.4,-15.4,side*1.15-.25,side*1.15+.25,29.5,32.1);a=plane(a,-1.2,0,32.1+1.2*(-15.9));a=plane(a,1.2,0,32.1-1.2*(-15.9));church=church.subtract(a);let b=box(-15.9+side*1.15-.25,-15.9+side*1.15+.25,-.5,.5,29.5,32.1);b=plane(b,0,-1.2,32.1);b=plane(b,0,1.2,32.1);church=church.subtract(b);}
// Ook de twee zichtbare zijvlakken van het uurwerk tonen hun wijzerplaat.
for(const side of [-1,1])church=church.subtract(Manifold.cylinder(.55,.95,.95,20).rotate([90,0,0]).translate([-15.9,side*2.7,24.4]));
for(const side of [-1,1]) {const c=box(-.65,.65,-.35,.35,2.5,6.2).rotate([0,0,side*40]).translate([17.4,side*4.1,0]);church=church.subtract(c);}
church=church.rotate([0,0,1]);const parts=[["building:kerk",church]];
const META={name:"Dorpskerk hervormde gemeente Hazerswoude-Dorp",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1672100000000347"],description:"Dorpskerk met veelhoekige koorsluiting, twee dwarsbeuken, zeventiende-eeuwse toren en achthoekige lantaarn.",realWorld:{groundNapM:-1.097},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1672100000000347","https://monumentenregister.cultureelerfgoed.nl/monumenten/21046","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Hazerswoude)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-dorpskerk-hervormde-gemeente-hazerswoude-dorp.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


