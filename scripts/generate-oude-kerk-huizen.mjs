// Willibrorduskerk Haringhuizen: zaalkerk en ingekorte toren als bouwdelen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-kerk-huizen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[144485.95,478870.25],X_AXIS=[.9996,.027];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// West-oost schip, driezijdig gesloten koor en noordelijk dwarsschip.
let nave=box(-3,34,-6.1,6.1,BASE,17.8);nave=plane(nave,0,1.35,17.8);nave=plane(nave,0,-1.35,17.8);
let choir=prism([[34,-5.2],[36.6,-3],[38,-.3],[36.6,2.8],[34,5.1]],BASE,16.2);choir=plane(choir,0,1.1,16.2);choir=plane(choir,0,-1.1,16.2);choir=plane(choir,-1,0,51);
let transept=box(14.4,22.7,5.5,16.6,BASE,14.2);transept=plane(transept,1.05,0,-5.3);transept=plane(transept,-1.05,0,33.9);
// Zuidelijke uitbouw met twee halve veelhoekige gevels en kapvlakken.
let southL=prism([[4.7,-5.5],[4.8,-11],[7,-15.5],[11.4,-17.8],[15.8,-17.7],[16,-5.5]],BASE,14.6);
southL=plane(southL,0,.65,21.7);southL=plane(southL,.8,0,7.7);
let southR=prism([[22.7,-5.5],[22.7,-17.5],[26.9,-17.3],[31,-14.7],[33.9,-10.5],[34,-5.5]],BASE,14.6);
southR=plane(southR,0,.65,21.7);southR=plane(southR,-.8,0,40.8);
let southMid=box(15.5,23,-18,-5.5,BASE,17.8);southMid=plane(southMid,1.05,0,-2.4);southMid=plane(southMid,-1.05,0,38.1);
let tower=box(-3,3.6,-3.5,3.6,BASE,28.1);let crown=box(-3.4,4,-3.9,4,27.2,28.2);
let spire=Manifold.cylinder(6.1,2.3,.5,4).rotate([0,0,45]).translate([.3,.05,28.1]);
let church=Manifold.union([nave,choir,transept,southL,southR,southMid,tower,crown,spire]);
const niche=(x,y,z,w,h)=>{let r=w/2;return prism([[-r,0],[r,0],[r,h-r],[0,h],[-r,h-r]],0,.8).rotate([90,0,0]).translate([x,y,z])};
// Spitsboogvensters en geleding, ondiep voor printbaarheid.
for(const x of [16.2,18.6,21])church=church.subtract(niche(x,17,2,1.15,5.2));
for(const x of [5.5,9.3,13.2,26,29.5,33])church=church.subtract(niche(x,6.5,2.3,1.4,4.4));
for(const x of [11.8,14.1,16.5,18.5,20.5,22.5,24.5,26]){church=church.subtract(niche(x,-17.3,5.2,1.25,3.2));church=church.subtract(niche(x,-17.3,1.1,1.0,2.2));}
for(const rot of [0,90,180,270])for(const x of [-1,1])church=church.subtract(niche(x,4.05,22.4,1,3.4).rotate([0,0,rot]).translate([.3,.05,0]));
church=church.subtract(niche(0,.5,BASE,1.5,3).rotate([0,0,90]).translate([-3,.05,0]));
for(const x of [3,7,11,15])church=Manifold.union([church,box(x-.45,x+.45,6,7,BASE,6.2)]);
const parts=[["building:kerk",church]];
const META={name:"Oude Kerk Huizen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:6.901,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0406100000005818"],description:"Middeleeuwse kerk met ingebouwde toren, noordelijke kruisarm en zuidelijke veelhoekige uitbouw.",realWorld:{groundNapM:6.901,ahn5TowerNapM:41.34},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0406100000005818","https://monumentenregister.cultureelerfgoed.nl/monumenten/22719","https://commons.wikimedia.org/wiki/Category:Oude_Kerk_(Huizen)","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-meeuwen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));










