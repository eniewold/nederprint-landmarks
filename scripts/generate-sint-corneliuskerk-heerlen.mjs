import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-corneliuskerk-heerlen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// De X-as loopt van het tweelingtorenfront naar het koor.
const BASE=-.5,ORIGIN=[195074.5,325344.7],X_AXIS=[.9894,.145];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(s,ridge,at,slope)=>plane(plane(s,0,slope,ridge-slope*at),0,-slope,ridge+slope*at);
const roofY=(s,ridge,at,slope)=>plane(plane(s,slope,0,ridge-slope*at),-slope,0,ridge+slope*at);
// Basilicale middenbeuk en lagere zijbeuken met langslopende lessenaarsdaken.
let nave=roofX(box(-2.2,43.2,-5.8,6.6,BASE,18.3),18.3,.4,.57);
let south=plane(box(1.9,27,-10.1,-5.5,BASE,10),0,.55,12.75);
let north=plane(box(1.9,27,6.3,10.4,BASE,10),0,-.55,13.1);
// De kruisarmen hebben een nok in de dwarsrichting.
let cross=roofY(box(26.4,39.2,-12.6,13.1,BASE,14.4),14.4,32.8,.57);
// Halfronde apsis, bedekt door een kegelvormig dak van vlakke segmenten.
const ring=(z)=>Array.from({length:20},(_,i)=>{const a=2*Math.PI*i/20;return [44.3+4.85*Math.cos(a),.4+4.85*Math.sin(a),z]});
const circ=ring(0).map(([x,y])=>[x,y]);const apse=prism(circ,BASE,10.7);
const apseRoof=Manifold.hull([...ring(10.6),[44.3,.4,15.4]]);
// Lagere nevenruimtes aan het koor en twee biechtstoelen langs beide zijden.
let sac=roofX(box(39,49.0,-12.0,-7.4,BASE,9.3),9.3,-9.7,.9);
let annex=roofX(box(42.4,49.4,5.0,8.5,BASE,7.7),7.7,6.7,.8);
// Bakstenen angelusklokje op de oostgevel van het koor.
const bell=roofX(box(42.35,43.45,-.55,1.35,17.2,21.0),21.0,.4,1.05);
const solids=[nave,south,north,cross,apse,apseRoof,sac,annex,bell];
for(const x of [4.4,14.6])for(const side of [-1,1]){const a=side<0?-10.8:9.6,b=side<0?-9.4:11.0;solids.push(roofY(box(x-1.4,x+1.4,a,b,BASE,5.4),5.4,x,.8));}
// Twee torens: vierkant muurwerk met tentdaken, niet met een naaldspits.
const rect3=(a,b,c,d,z)=>[[a,c,z],[b,c,z],[b,d,z],[a,d,z]];
for(const [a,b] of [[-10.2,-5.1],[5.1,10.3]]){
 solids.push(box(-3.0,2.15,a,b,BASE,28.0));
 solids.push(Manifold.hull([...rect3(-3.0,2.15,a,b,27.95),...rect3(-.88,.02,(a+b)/2-.45,(a+b)/2+.45,30.55)]));
}
let church=Manifold.union(solids);
// Ondiepe raam- en deurnissen met printbare schuine bovenzijde.
const arch=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]],0,.5).rotate([90,0,0]).translate([x,y,z]);
for(const x of [5.0,9.4,13.8,18.2,22.6])for(const y of [-9.95,10.55])church=church.subtract(arch(x,y,2.6,1.1,3.8));
for(const x of [5.0,9.4,13.8,18.2,22.6])for(const y of [-5.4,6.8])church=church.subtract(arch(x,y,11.7,1.1,2.7));
for(const cy of [-7.65,7.7]){
 for(const y of [cy-1.05,cy+1.05]){
  church=church.subtract(arch(y,0,22.5,1.35,4.2).rotate([0,0,90]).translate([-3.25,0,0]));
  church=church.subtract(arch(y,0,22.5,1.35,4.2).rotate([0,0,90]).translate([1.9,0,0]));
 }
 const outer=cy<0?-9.95:10.55;
 for(const x of [-1.5,.55])church=church.subtract(arch(x,outer,22.5,1.35,4.2));
 for(const z of [6,11,16])church=church.subtract(arch(cy,0,z,1.0,2.0).rotate([0,0,90]).translate([-3.25,0,0]));
}
// Uitsparing van de angelusgevel en hoofdingang blijven ondiep.
church=church.subtract(arch(.4,0,18.4,.9,1.6).rotate([0,0,90]).translate([43.15,0,0]));
church=church.subtract(arch(0,0,.05,2.2,4.0).rotate([0,0,90]).translate([-2.4,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Corneliuskerk Heerlen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:96.33,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0917100000018184"],description:"Neoromaanse kruisbasiliek met tweelingtorens onder tentdaken en een halfronde apsis.",realWorld:{groundNapM:96.33,towerHeightM:30.55},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0917100000018184","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.kerkgebouwen-in-limburg.nl/kerken/heerlerheide/cornelius","https://www.kerkramenindemijnstreek.nl/kerken/heerlerheide-corneliuskerk/","https://commons.wikimedia.org/wiki/Category:Sint-Corneliuskerk,_Heerlen"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-corneliuskerk-heerlen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





