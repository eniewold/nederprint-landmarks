import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-urbanus-ouderkerk-aan-de-amstel';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[121870,478637],X_AXIS=[.9798,.2];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Middenschip, zijbeuken, transept, koor, toren en verbonden pastorie; maaiveld NAP -1,27 m.
let nave=roofY(box(-3.2,31,-5.6,2.0,BASE,20.9),-1.8,20.9,1.38);
let south=plane(box(-3.2,18.2,-10.2,-5.3,BASE,10.8),0,.65,16.9);
let north=plane(box(-3.2,18.2,1.7,6.6,BASE,10.8),0,-.65,12.0);
let choir=roofY(prism([[29,-5.6],[33,-5.6],[35.6,-4.6],[36.7,-2.4],[36.7,-.2],[35.5,1.7],[34.3,2.9],[29,2.0]],BASE,20.9),-1.8,20.9,1.38);choir=plane(choir,-1.38,0,71.5);
let transept=roofX(box(18.1,30.7,-14.5,11.9,BASE,20.9),24.4,20.9,1.34);
let sac=roofX(box(30.5,35.4,-14.5,-7.0,BASE,8.2),32.9,8.2,.7);
let tower=box(-3.2,2.6,2.4,7.4,BASE,35.0);
let pediment=prism([[-1.5,0],[1.5,0],[0,2.6]],0,.6).rotate([90,0,0]);
let frontals=[pediment.translate([-.3,3.0,34.7]),pediment.translate([-.3,7.4,34.7]),pediment.rotate([0,0,90]).translate([-3.2,4.9,34.7]),pediment.rotate([0,0,90]).translate([2.0,4.9,34.7])];
let spire=Manifold.cylinder(18.1,2.7,.06,8).rotate([0,0,22.5]).translate([-.3,4.9,34.95]);
let fleche=Manifold.cylinder(5.2,.65,.45,8).translate([24.4,-1.8,20.6]);
// Pastorie op schuine kavel, met twee zadeldaken en verbonden tussenlid.
let rectory=roofY(box(-6,6,-5.2,5.2,BASE,17.3),0,17.3,1.25).rotate([0,0,45]).translate([48,-18.2,0]);
let link=box(33,44,-16,-10.0,BASE,6.5);
let supports=[];for(const x of [4.5,9.3,14.0])for(const side of [-1,1]){let a=box(x-.5,x+.5,side<0?-10.9:6.1,side<0?-9.9:7.2,BASE,6.5);a=plane(a,0,side<0?1:-1,16.6);supports.push(a)}
let church=Manifold.union([nave,south,north,choir,transept,sac,tower,spire,fleche,rectory,link,...frontals,...supports]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [4.2,9,13.7,17])for(const y of [-9.95,6.85])church=church.subtract(niche(x,y,2.2,1.3,4.8));
for(const x of [4,8.5,13,17])for(const y of [-5.35,2.25])church=church.subtract(niche(x,y,12.5,1.1,3.2));
for(const y of [-14.25,12.15]){for(const x of [21.5,24.4,27.3])church=church.subtract(niche(x,y,6,1.25,5));church=church.subtract(Manifold.cylinder(.55,2.1,2.1,32).rotate([90,0,0]).translate([24.4,y,15]));}
for(const y of [2.65,7.65])for(const x of [-1,0.4])church=church.subtract(niche(x,y,29.5,.9,3.4));
for(const side of [-1,1])for(const y of [4.2,5.6])church=church.subtract(niche(0,0,29.5,.9,3.4).rotate([0,0,90]).translate([side<0?-3.45:2.35,y,0]));
church=church.subtract(niche(0,0,.15,1.5,3.6).rotate([0,0,90]).translate([-3.45,-1.8,0]));
church=church.subtract(Manifold.cylinder(.55,2.1,2.1,32).rotate([0,90,0]).translate([-3.4,-1.8,15]));
const parts=[['building:kerk',church]];
const META={name:'Sint Urbanus Ouderkerk aan de Amstel',origin:ORIGIN,xAxis:X_AXIS,groundHeight:-1.266,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0437100000002180','NL.IMBAG.Pand.0437100000002181'],description:'Kruisbasiliek met naastgelegen toren, sacristie en aangebouwde pastorie.',realWorld:{groundNapM:-1.266,roofRidgeNapM:19.605,ahnTowerTopNapM:51.881},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0437100000002180','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0437100000002181','https://monumentenregister.cultureelerfgoed.nl/monumenten/511287','https://monumentenregister.cultureelerfgoed.nl/monumenten/511288','https://www.amstelveen.nl/sites/default/files/2026-03/verantwoordingsdocument-gba-v20260312.pdf','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-urbanus-ouderkerk-aan-de-amstel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));



















