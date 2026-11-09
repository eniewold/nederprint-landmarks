import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-sint-clemenskerk-nuenen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[167332,388900],X_AXIS=[.966,.259];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Hoofdbeuk met kapvlakken en afzonderlijke lagere zijbeuken.
let nave=box(-10.4,7.4,-2.5,3.5,BASE,14.3);nave=plane(nave,0,1.6,13.5);nave=plane(nave,0,-1.6,15.1);
let sides=[];for(const sign of [-1,1]){let b=box(-10.4,1,sign<0?-5.35:3.3,sign<0?-2.3:6.45,BASE,7.5);b=plane(b,0,sign<0?.55:-.55,sign<0?8.8:9.3);sides.push(b)}
// Dwarsbeuk met twee kopgevels en vijfzijdig koor.
let transept=box(.9,7.4,-8.5,9.3,BASE,14.3);transept=plane(transept,1.6,0,7.9);transept=plane(transept,-1.6,0,20.7);
let choir=prism([[7.2,-3.5],[12.3,-3.5],[15.2,-1.5],[15.2,2.4],[12.3,4.2],[7.2,4.2]],BASE,14.3);choir=plane(choir,0,1.25,13.925);choir=plane(choir,0,-1.25,14.675);choir=plane(choir,-1.55,0,33.4);
// Sacristieën tegen koor: kruiskappen, ingemeten in de BAG.
let annex1=box(7.25,12.3,-8.9,-3.2,BASE,7.3);annex1=plane(annex1,1,0,-2.3);annex1=plane(annex1,-1,0,17.1);
let annex2=box(7.25,11.9,4.0,9.3,BASE,7.2);annex2=plane(annex2,1,0,-2.2);annex2=plane(annex2,-1,0,16.8);
// Toren en achtzijdige spits; top uit AHN5, niet de afgekapte 3DBAG.
let tower=box(-15.7,-10.2,-2.35,3.6,BASE,18.6);
let spire=Manifold.cylinder(9.5,3.05,.46,8).translate([-12.95,.625,18.55]);
let church=Manifold.union([nave,...sides,transept,choir,annex1,annex2,tower,spire]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.65).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-8.6,-5,-1.5])for(const sign of [-1,1]){let cut=niche(x,0,1.2,1.15,4.2);if(sign<0)cut=cut.translate([0,-5.0,0]);else cut=cut.rotate([0,0,180]).translate([2*x,6.1,0]);church=church.subtract(cut)}
// Grote spitsboogramen van beide transeptgevels.
for(const sign of [-1,1]){let cut=niche(4.15,0,1.4,2.15,7.4);if(sign<0)cut=cut.translate([0,-8.2,0]);else cut=cut.rotate([0,0,180]).translate([8.3,9.0,0]);church=church.subtract(cut)}
// Westportaal en galmgaten als blinde nissen.
church=church.subtract(niche(0,0,BASE,1.8,4).rotate([0,0,90]).translate([-16,.6,0]));
for(const z of [8.5,14.3])for(const y of [-.5,1.7])church=church.subtract(niche(0,0,z,1,3).rotate([0,0,90]).translate([-16,y,0]));
for(const x of [-14,-11.9]) {church=church.subtract(niche(x,-2.05,14.3,1,3));church=church.subtract(niche(x,0,14.3,1,3).rotate([0,0,180]).translate([2*x,3.3,0]));}
for(const y of [-.5,1.7])church=church.subtract(niche(0,0,14.3,1,3).rotate([0,0,-90]).translate([-9.9,y,0]));
church=church.subtract(niche(0,0,2,1.4,5.2).rotate([0,0,-90]).translate([15.5,.5,0]));
for(const x of [-9.9,-6.5,-2.6])for(const side of [-1,1]){let b=box(x-.46,x+.46,side<0?-5.95:6.1,side<0?-5.05:6.95,BASE,5.4);church=church.add(b)}
const parts=[["building:kerk",church]];
const META={name:"Oude Sint-Clemenskerk Gerwen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.327,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0820100000005871"],description:"Middeleeuwse kruiskerk met toren, koor en sacristieën.",realWorld:{groundNapM:17.327,ahn5TopNapM:45.42,ridgeM:14.3},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0820100000005871","https://monumentenregister.cultureelerfgoed.nl/monumenten/30824","https://commons.wikimedia.org/wiki/Category:Sint_Clemenskerk,_Gerwen","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-sint-clemenskerk-nuenen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








