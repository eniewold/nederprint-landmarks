// Willibrorduskerk Haringhuizen: zaalkerk en ingekorte toren als bouwdelen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-vituskerk-naarden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[139653.7,478660.5],X_AXIS=[.998,.063];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Basilicaal schip en smallere kooromgang met vijfzijdige sluiting.
let aisles=prism([[-6,-11.8],[53,-11.8],[60,-9],[65,-3],[65,3],[60,9],[53,11.8],[-6,11.8]],BASE,13);aisles=plane(aisles,0,.4,15.4);aisles=plane(aisles,0,-.4,15.4);aisles=plane(aisles,-.7,0,56);
let nave=box(-4,50,-5.2,5.2,BASE,27.3);nave=plane(nave,0,1.4,27.3);nave=plane(nave,0,-1.4,27.3);
let choir=prism([[49,-5.2],[56,-5.2],[60,-3],[62,0],[60,3],[56,5.2],[49,5.2]],BASE,27.3);choir=plane(choir,0,1.4,27.3);choir=plane(choir,0,-1.4,27.3);choir=plane(choir,-1.4,0,114);
// Dwarsbeuken met twee echte zadeldaken.
let cross=box(31,42,-22,24,BASE,26.3);cross=plane(cross,1.3,0,-21.15);cross=plane(cross,-1.3,0,73.75);
let tower=box(-5.6,5.7,-5.7,5.7,BASE,44.8);let crown=box(-5.9,6,-6,6,43.9,45.1);
let spire=Manifold.cylinder(16.7,3.3,.48,8).rotate([0,0,22.5]).translate([0,0,45]);
let church=Manifold.union([aisles,nave,choir,cross,tower,crown,spire]);
const niche=(x,y,z,w,h)=>{let r=w/2;return prism([[-r,0],[r,0],[r,h-r],[0,h],[-r,h-r]],0,1).rotate([90,0,0]).translate([x,y,z])};
// Raamtravee�n beneden en lichtbeuk, torennissen en galmgaten.
// Hoge vensters van het vijfzijdige koor en lagere kooromgang.
for(const x of [51.5,54.5]){church=church.subtract(niche(x,-4.7,15.2,1.6,4.5));church=church.subtract(niche(x,5.7,15.2,1.6,4.5));}
church=church.subtract(niche(0,0,15.2,1.65,5.1).rotate([0,0,29]).translate([58,-3.7,0]));
church=church.subtract(niche(0,0,15.2,1.65,5.1).rotate([0,0,-29]).translate([58,4.5,0]));
church=church.subtract(niche(0,0,15.2,1.4,5.1).rotate([0,0,-56]).translate([61.3,1.4,0]));
church=church.subtract(niche(0,0,2.8,2,7.3).rotate([0,0,-90]).translate([65.4,0,0]));
church=church.subtract(niche(0,0,2.8,2,7.3).rotate([0,0,22]).translate([56.5,-9.9,0]));
church=church.subtract(niche(0,0,2.8,2,7.3).rotate([0,0,-22]).translate([56.5,10.9,0]));
for(const x of [8,12.2,16.4,20.6,24.8,29]) {church=church.subtract(niche(x,-11.5,2.8,2,7.6));church=church.subtract(niche(x,12.3,2.8,2,7.6));church=church.subtract(niche(x,-4.9,15.2,1.6,4.5));church=church.subtract(niche(x,5.7,15.2,1.6,4.5));}
for(const y of [-22.4,24.5])for(const x of [33,37,40])church=church.subtract(niche(x,y>0?y:y+.8,3,1.6,8));
for(const rot of [0,90,180,270])for(const x of [-2.2,2.2]){church=church.subtract(niche(x,6.1,17,2,14).rotate([0,0,rot]));church=church.subtract(niche(x,6.1,36,2,5.5).rotate([0,0,rot]));}
for(const x of [6.2,10.4,14.6,18.8,23,27.2,30.5]){church=Manifold.union([church,box(x-.5,x+.5,-12.8,-11.5,BASE,11)]);church=Manifold.union([church,box(x-.5,x+.5,11.5,12.8,BASE,11)]);}
// Kleine printbare dakruiter op de nok.
let rider=Manifold.cylinder(4,1,.48,6).translate([20,0,27.1]);church=Manifold.union([church,rider]);
const parts=[["building:kerk",church]];
const META={name:"Sint-Vituskerk Naarden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.143,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0425100000011484"],description:"Laatgotische kruisbasiliek met kooromgang, ingebouwde toren en dakruiter.",realWorld:{groundNapM:2.143,ahn5TowerNapM:63.82},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0425100000011484","https://monumentenregister.cultureelerfgoed.nl/monumenten/30227","https://commons.wikimedia.org/wiki/Category:Exterior_of_Grote_of_Sint-Vituskerk_(Naarden)","https://www.ahn.nl/dataroom"]};
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











