import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-barbarakerk-culemborg";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[143930.5,440940],X_AXIS=[.927,.375];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Basilicale hoofdbeuk, lagere zijbeuken en dwarsbeuk: alle daken zijn vlakken.
let nave=box(-6.5,52.5,-12,-2.6,BASE,19.8),roof=box(-6.5,52.5,-12,-2.6,19.75,27);
roof=plane(roof,0,-1.18,16.55);roof=plane(roof,0,1.18,33.78);
let south=box(-3.9,48,-18.3,-11.8,BASE,9.5),sr=box(-3.9,48,-18.3,-11.8,9.45,17);sr=plane(sr,0,1,27.8);
let north=box(3.2,47.8,-2.8,3.6,BASE,9.5),nr=box(3.2,47.8,-2.8,3.6,9.45,17);nr=plane(nr,0,-1,13.1);
let tran=box(25.7,35,-13,8.8,BASE,19.7),tr=box(25.7,35,-13,8.8,19.65,27);
tr=plane(tr,-1.15,0,60);tr=plane(tr,1.15,0,-9.8);
let back=box(52.3,59.5,-15.4,.8,BASE,8),br=box(52.3,59.5,-15.4,.8,7.95,16);br=plane(br,0,-1,7.5);br=plane(br,0,1,22.1);
let rearWing=box(59.2,62.2,.5,7.4,BASE,5.5), rw=box(59.2,62.2,.5,7.4,5.45,11);rw=plane(rw,0,-1,12.9);
let crossing=box(29.4,31.2,-8.2,-6.4,24.1,28.5);
const crossingTip=Manifold.hull([[29.4,-8.2,28.4],[31.2,-8.2,28.4],[31.2,-6.4,28.4],[29.4,-6.4,28.4],[29.8,-7.8,36],[30.8,-7.8,36],[30.8,-6.8,36],[29.8,-6.8,36]]);
let tower=box(-3.3,3.1,-3,3.2,BASE,33.2);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos((i+.5)*Math.PI/4),.1+r*Math.sin((i+.5)*Math.PI/4),z]);
let spire=Manifold.hull([...oct(3.1,33.1),...oct(.55,62)]);
let church=Manifold.union([nave,roof,south,sr,north,nr,tran,tr,back,br,rearWing,rw,crossing,crossingTip,tower,spire]);
// Vier kleine torenhoekspitsen zijn ten minste 0,9 m breed uitgevoerd.
for(const x of [-2.8,2])for(const y of [-2.5,1.7]){
 const pin=box(x,x+1.05,y,y+1.05,31,36.7);const cap=Manifold.hull([[x,y,36.6],[x+1.05,y,36.6],[x+1.05,y+1.05,36.6],[x,y+1.05,36.6],[x+.075,y+.075,38],[x+.975,y+.075,38],[x+.975,y+.975,38],[x+.075,y+.975,38]]);church=Manifold.union([church,pin,cap]);
}
// Torengalmgaten en hoge vensternissen; blinde inkepingen voorkomen interne holtes.
for(const y of [-1.7,.35])church=church.subtract(box(-3.5,-2.9,y,y+1.05,25.5,30.5));
for(const x of [-1.8,.3])for(const y of [-3.15,2.85])church=church.subtract(box(x,x+1.05,y,y+.5,25.5,30.5));
for(const x of [5,10,15,20,38,43,48])for(const y of [-18.5,3.3])church=church.subtract(box(x-.65,x+.65,y,y+.55,3.1,7.8));
for(const x of [5,10,15,20,38,43,48])for(const y of [-12.15,-2.95])church=church.subtract(box(x-.6,x+.6,y,y+.5,15.2,18.6));
// De grote roosvensters zijn herkenbare blinde ronde nissen, zonder maaswerk.
church=church.subtract(Manifold.cylinder(0.9,2.35,2.35,32).rotate([0,90,0]).translate([-6.7,-7.3,13.6]));
church=church.subtract(Manifold.cylinder(0.9,2.25,2.25,32).rotate([90,0,0]).translate([30.3,9,14.2]));
church=church.subtract(Manifold.cylinder(0.9,2.25,2.25,32).rotate([0,-90,0]).translate([52.7,-7.3,14.2]));
church=church.subtract(box(-6.7,-6.05,-8.4,-6.2,BASE,4.5));
church=church.subtract(box(29.2,31.4,8.1,9,BASE,4.5));
const parts=[["building:kerk",church]];
const META={name:"Sint-Barbarakerk Culemborg",origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.852,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0216100000002222"],description:"Neogotische kruisbasiliek met roosvensters, terzijde geplaatste toren en slanke spits.",realWorld:{groundNapM:4.852},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0216100000002222","https://monumentenregister.cultureelerfgoed.nl/monumenten/11576","https://commons.wikimedia.org/wiki/Category:Sint-Barbarakerk_(Culemborg)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.seniorencollectiefculemborg.nl/wp-content/uploads/2023/11/Kijker-2023-05-32s.pdf"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-barbarakerk-culemborg.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

