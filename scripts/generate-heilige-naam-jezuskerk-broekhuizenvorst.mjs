import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="heilige-naam-jezuskerk-broekhuizenvorst";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Lokaal x loopt naar het koor; de toren staat op de oorsprong.
const BASE=-.5,ORIGIN=[208484.8,389855.1],X_AXIS=[.967,.255];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Tweebeukig schip: gebroken noordelijk dakvlak sluit aan op de lagere zijbeuk.
let main=box(-1,16,-4.4,5.8,BASE,21);main=plane(main,0,1.61,19.55);main=plane(main,0,-1.61,21.48);
let aisle=box(-1,16,5.7,9.95,BASE,12.6);aisle=plane(aisle,0,-.68,16.55);
// Driezijdig gesloten lager koor, met zelfstandige nok en aansluitende schuine vlakken.
let choir=prism([[15.8,-4.3],[24.4,-4.3],[27,-1.4],[27,1.6],[24.4,4.25],[15.8,4.25]],BASE,17.25);choir=plane(choir,0,1.55,17.25);choir=plane(choir,0,-1.55,17.25);choir=plane(choir,-1.0,0,41.6);
// Twee kruisarmen met zadeldaken, zuidelijk portaal en oostelijke sacristie.
let north=box(16.1,21.8,3.9,10.1,BASE,14);north=plane(north,1.45,0,-13.1);north=plane(north,-1.45,0,41.9);
let south=box(15.5,21.8,-14.1,-4.1,BASE,10);south=plane(south,1.13,0,-11.2);south=plane(south,-1.13,0,31.1);
let hall=box(12.6,16.1,-14.1,-8.0,BASE,6.8);hall=plane(hall,1,0,-9.1);hall=plane(hall,-1,0,19.6);
let sac=box(21.5,27.4,-13,-6.3,BASE,6.6);sac=plane(sac,0,.55,11.9);sac=plane(sac,0,-.55,1.3);
// Vierkante torenschacht met achthoekige ingesnoerde helm. Gebouwen en spits zijn echte bouwdelen.
let tower=box(-3.05,3.12,-2.35,3.35,BASE,27.45);
const oct=(r,z)=>[...Array(8)].map((_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [r*Math.cos(a),.5+r*Math.sin(a),z]});
const crown=Manifold.hull([...oct(3.72,27.35),...oct(2.1,29.05)]);
const spire=Manifold.hull([...oct(2.1,29),...oct(.49,46.55)]);
let solids=[main,aisle,choir,north,south,hall,sac,tower,crown,spire];
// Zichtbare steunberen op de gevels, met schuine afdekking.
for(const x of [4.8,10.3,15.8]) for(const side of [-1,1]){const y=side<0?-4.4:9.9;let b=box(x-.52,x+.52,side<0?y-1.15:y-.1,side<0?y+.1:y+1.15,BASE,10.6);b=plane(b,0,side<0?1:-1,side<0?15:20.5);solids.push(b)}
// Sluit de aansluiting van zijbeuk en kruisarm: geen interne spleet.
solids.push(box(15.95,16.15,4.2,9.9,BASE,10));
let church=Manifold.union(solids);
// Galmgaten, blindnissen, poort en vensters zijn ondiep; spitse bovenzijde is printbaar.
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.65).rotate([90,0,0]).translate([x,y,z])};
for(const y of [-1,1.1]){church=church.subtract(arch(y,0,19.2,1.0,6.7).rotate([0,0,90]).translate([-3.3,0,0]));church=church.subtract(arch(y,0,11.8,1.0,5.2).rotate([0,0,90]).translate([-3.3,0,0]));}
for(const x of [-1.7,.4,2])for(const y of [-2.0,3.7])church=church.subtract(arch(x,y,19.2,1,6.7));
for(const x of [6.6,12]){church=church.subtract(arch(x,-4.05,3,1.25,6.4));church=church.subtract(arch(x,10.25,3,1.25,5.2));}
for(const x of [17.8,20]){church=church.subtract(arch(x,-13.8,2.5,1.0,4.6));church=church.subtract(arch(x,10.45,2.5,1.0,4.6));}
church=church.subtract(arch(.5,0,0.05,1.55,3.5).rotate([0,0,90]).translate([-3.3,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Heilige Naam Jezuskerk Broekhuizenvorst",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.3,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1507100000009631"],description:"Tweebeukige gotische kruiskerk met voorgebouwde toren, ingesnoerde achthoekige spits, twee kruisarmen en lager koor met driezijdige sluiting.",realWorld:{groundNapM:17.3,towerHeightM:47},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1507100000009631","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.lgogterhorst.nl/info_lgog/INFOLGOG%20no%2057.pdf","https://www.kerkgebouwen-in-limburg.nl/kerken/broekhuizenvorst/h-naam-jezus","https://commons.wikimedia.org/wiki/Category:Heilige_Naam_Jezuskerk_(Broekhuizenvorst)"]};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-heilige-naam-jezuskerk-broekhuizenvorst.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





