// Kruisherenkapel Uden, gebouwvlakken gemeten in BAG, AHN5 en foto's.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kruisherenkapel-uden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[170405,408068.8],X_AXIS=[.9986,-.0523];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Het hoge schip heeft een steile kap; de zijbeuken hebben lagere lessenaarsdaken.
let hall=box(0,39,-5.1,5.1,BASE,21);hall=plane(hall,0,1.48,21);hall=plane(hall,0,-1.48,21);
let choir=prism([[38,-5.1],[41,-5.1],[45,-2.5],[45,2.5],[41,5.1],[38,5.1]],BASE,21);choir=plane(choir,0,1.48,21);choir=plane(choir,0,-1.48,21);choir=plane(choir,-1.3,0,74.3);
let south=box(3,38,-10.6,-4.8,BASE,11.0);south=plane(south,0,.55,13.8);
let north=box(3,39,4.8,10.6,BASE,11);north=plane(north,0,-.55,13.8);
// Lage aanbouwen en voorgeveltorens, uit de BAG-omtrek.
let annex=box(4,11,-13.2,-10,BASE,8.8);annex=plane(annex,0,.6,16.8);annex=plane(annex,0,-.6,2.9);
let sacristy=box(30,42,9.8,13,BASE,13.4);sacristy=plane(sacristy,0,1,2);sacristy=plane(sacristy,0,-1,24.8);
let towers=[];for(const y of [-6.3,6.3]){towers.push(Manifold.cylinder(17,1.55,1.55,16).translate([2,y,BASE]));towers.push(Manifold.cylinder(7.8,1.7,.4,8).rotate([0,0,22.5]).translate([2,y,16.3]));}
// Forse dakruiter; de slanke punt is op printschaal verstevigd.
const lantern=Manifold.cylinder(2.7,1.2,1.2,8).translate([29,0,19.8]);
const fleche=Manifold.cylinder(8.0,1.4,.4,8).translate([29,0,22.2]);
const portals=[];
for(const y of [-2.5,0,2.5]) {
  let portal=box(-1.35,.35,y-1.08,y+1.08,BASE,5.6);
  portal=plane(portal,0,1.1,5.6-1.1*y);
  portal=plane(portal,0,-1.1,5.6+1.1*y);
  portals.push(portal);
}
let church=Manifold.union([hall,choir,south,north,annex,sacristy,lantern,fleche,...towers,...portals]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.85).rotate([90,0,0]).translate([x,y,z])};
for(const x of [11,16,21,26,31,36])church=church.subtract(niche(x,-10.2,2,1.7,4.2)); for(const x of [6,11,16,21,26])church=church.subtract(niche(x,11.1,2,1.7,4.2));
for(const x of [3.5,8.5,13.5,18.5,23.5,28.5,33.5]){church=Manifold.union([church,box(x-.38,x+.38,-11,-10.3,BASE,6)]);church=Manifold.union([church,box(x-.38,x+.38,10.3,11,BASE,6)]);}
church=church.subtract(niche(0,.5,1,2.8,5.1).rotate([0,0,90]).translate([-.15,0,0]));
// Lichtbeukvensters en opvallende vensters in de puntgevel.
for(const x of [6,11,16,21,26,31,36])for(const y of [-4.65,5.5])church=church.subtract(niche(x,y,9.2,1.65,3.5));
for(const y of [-2,0,2])church=church.subtract(niche(y,.55,8,1.0,4.2).rotate([0,0,90]).translate([-.15,0,0]));
const parts=[["building:kapel",church]];
const META={name:"Kruisherenkapel Uden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:16.8,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0856100000342675"],description:"Kruisherenkapel met zijbeuken, koorsluiting, traptorens en aanbouwen.",realWorld:{groundNapM:16.8,ahn5RoofNapM:37.8},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0856100000342675","https://monumentenregister.cultureelerfgoed.nl/monumenten/512971","https://commons.wikimedia.org/wiki/Category:Kruisherenkapel,_Uden","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kruisherenkapel-uden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1){console.log(pieces.map(p=>p.boundingBox()));throw new Error(`components ${pieces.length}`);} 
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));











