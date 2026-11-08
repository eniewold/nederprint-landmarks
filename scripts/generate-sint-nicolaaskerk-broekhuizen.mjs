import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-nicolaaskerk-broekhuizen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[208955.7,388835.5],X_AXIS=[.99875,-.04998];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const footprint=[[-15.65,-4.48],[12.7,-4.48],[16.35,-2.0],[17.2,0],[16.35,2],[12.7,4.48],[-15.65,4.48]];
let walls=prism(footprint,BASE,9.92),roof=prism(footprint,9.9,16.54);
roof=plane(roof,0,1.48,16.54);roof=plane(roof,0,-1.48,16.54);roof=plane(roof,-1.5,0,16.54+1.5*13.8);
// Noordelijk portaal en de lange lage zuidelijke sacristie.
let portal=box(2.3,6.9,4.35,5.55,BASE,4.2);portal=plane(portal,0,-.55,7.25);
let sacristy=box(1.2,9.5,-10.25,-4.35,BASE,6.2);sacristy=plane(sacristy,0,.72,12.7);
// Twee achthoekige geledingen van de open dakruiter worden gesloten met nissen.
const oct=(r,z0,h)=>Manifold.cylinder(h,r,r,8).translate([7.8,0,z0]);
let lower=oct(1.9,15.8,3.7), upper=oct(1.35,19.4,2.2);
let bellroof=Manifold.cylinder(2.55,1.35,.46,8).translate([7.8,0,21.55]);
let church=Manifold.union([walls,roof,portal,sacristy,lower,upper,bellroof]);
// Drie dakvensters en een schoorsteen, zichtbaar aan de zuidzijde.
for(const x of [-11.1,-1.2,8.2]){
 let dormer=box(x-.55,x+.55,-3.1,-1.9,11.5,14.6);
 dormer=plane(dormer,1,0,14.6-x);dormer=plane(dormer,-1,0,14.6+x);
 church=church.add(dormer);
}
church=church.add(box(3.1,4.0,-.85,.05,15.0,17.15));
// Schuine steunberen zijn bouwdelen; de bovenzijde volgt de printhelling.
for(const x of [-14.4,-9.5,-5.3,-.5,4.2,9.0,12.7])for(const sign of [-1,1]){
 let b=box(x-.48,x+.48,sign<0?-5.55:4.28,sign<0?-4.28:5.55,BASE,7.0);
 b=plane(b,0,sign<0?1:-1,sign<0?12.4:12.4);church=church.add(b);
}
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-12.3,-7.6,-3.1,1.7,6.4,11])for(const y of [-4.07,4.87])church=church.subtract(niche(x,y,3.0,1.15,4.6));
for(const [z,r] of [[17.2,1.95],[20.0,1.4]])for(const angle of [0,90,180,270]){let cut=niche(7.8,r,z,.7,1.25);cut=cut.translate([-7.8,0,0]).rotate([0,0,angle]).translate([7.8,0,0]);church=church.subtract(cut)}
church=church.subtract(niche(0,0,BASE,1.3,2.8).rotate([0,0,90]).translate([-15.25,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Nicolaaskerk Broekhuizen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:18.8,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1507100000016898"],description:"Eenbeukige kerk met driezijdig koor, sacristie, portaal en dubbele dakruiter.",realWorld:{groundNapM:18.8,ahnTopNapM:43.1},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1507100000016898","https://monumentenregister.cultureelerfgoed.nl/monumenten/11091","https://www.kerkgebouwen-in-limburg.nl/kerken/broekhuizen/nicolaas","https://commons.wikimedia.org/wiki/Category:Sint_Nicolaaskerk,_Broekhuizen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-nicolaaskerk-broekhuizen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








