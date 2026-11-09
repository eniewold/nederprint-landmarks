// Benedictuskerk Teeffelen: meetbare vlakken en bouwdelen, in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-benedictuskerk-teeffelen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[162128.5,423336],X_AXIS=[.9837,.1796];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip met gemeten nok en goten; koor met driezijdige sluiting.
let hall=box(2.3,18,-4.1,5.8,BASE,11.3);hall=plane(hall,0,1.15,11.95);hall=plane(hall,0,-1.15,13.91);
let choir=prism([[17,-4.1],[18,-4.1],[20.7,-1.7],[21.2,2],[19.9,4.3],[17,5.8]],BASE,11.3);
choir=plane(choir,0,1.15,11.95);choir=plane(choir,0,-1.15,13.91);choir=plane(choir,-1.0,0,30.0);
// Noordelijke sacristie, schilddak volgens 3D BAG en foto.
let annex=box(15.6,21.8,5.6,10.8,BASE,7.2);annex=plane(annex,1,0,-11.6);annex=plane(annex,-1,0,25.8);annex=plane(annex,0,1,-1.6);annex=plane(annex,0,-1,14.8);
let tower=box(-2.55,2.55,-3.1,2.95,BASE,15.1);
let spire=Manifold.cylinder(8.8,3.5,.45,4).rotate([0,0,45]).translate([0,-.08,15]);
let tips=[];for(const x of [-2.5,2.5])for(const y of [-3,2.9]){tips.push(Manifold.cylinder(2.8,.55,.45,8).translate([x,y,14.4]));tips.push(Manifold.cylinder(2,.65,.15,4).rotate([0,0,45]).translate([x,y,17.1]));}
let church=Manifold.union([hall,choir,annex,tower,spire,...tips]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [4.4,7.9,11.4,14.9,18])for(const y of [-3.7,6.2])church=church.subtract(niche(x,y,1.5,1.3,4.3));
for(const x of [16.8,18.6,20.3])church=church.subtract(niche(x,11.2,1.3,.9,2.4));
for(const a of [0,180])for(const x of [-.8,.8])church=church.subtract(niche(x,3.35,10.3,1.1,3.2).rotate([0,0,a]));
for(const a of [90,270])for(const x of [-.8,.8])church=church.subtract(niche(x,2.9,10.3,1.1,3.2).rotate([0,0,a]));
church=church.subtract(niche(0,.4,BASE,1.5,3.4).rotate([0,0,90]).translate([-2.55,0,0]));
for(const x of [3,6.3,9.8,13.3,16.8])church=Manifold.union([church,box(x-.42,x+.42,-4.55,-4,BASE,5.2)]);
const parts=[["building:kerk",church]];
const META={name:"Sint-Benedictuskerk Teeffelen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:6.22,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0828100001452929"],description:"Eenbeukige kerk met toren en noordelijke sacristie; gemeten in BAG en AHN5.",realWorld:{groundNapM:6.22,ahn5TowerNapM:29.62},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001452929","https://monumentenregister.cultureelerfgoed.nl/monumenten/25917","https://commons.wikimedia.org/wiki/Category:Sint-Benedictuskerk_(Teeffelen)","https://www.ahn.nl/dataroom"]};

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








