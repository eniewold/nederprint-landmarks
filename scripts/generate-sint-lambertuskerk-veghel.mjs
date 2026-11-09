import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-lambertuskerk-veghel';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[165724,403233],X_AXIS=[.178,.984];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);

// Middenschip en transept: dakvlakken volgens 3D BAG, nok NAP +38,7 m.
let nave=roofY(box(-35,25,-5.4,4.8,BASE,29.5),-.3,29.5,1.48);
let aisles=[];for(const [a,b,k,c] of [[-12.4,-5.3,.65,19.7],[4.7,11.4,-.65,19.0]]){let s=box(-35,-4,a,b,BASE,16.3);s=plane(s,0,k,c);aisles.push(s)}
let transept=roofX(box(-3.3,8.2,-16.7,17.3,BASE,29.5),2.45,29.5,1.48);
let choir=roofY(prism([[16,-5.4],[24,-5.4],[27,-3.7],[28.5,-1.8],[28.5,1.4],[27,3.7],[24,4.8],[16,4.8]],BASE,29.5),-.3,29.5,1.48);choir=plane(choir,-1.3,0,64);
// Kooromgang met afzonderlijke veelhoekige straalkapellen, ieder eigen dak.
let amb=prism([[18,-12],[25,-12],[30,-10],[33,-6],[34,0],[32,5],[29,9],[24,11],[18,11]],BASE,10.6);
let chapels=[];for(const [x,y] of [[22,-10],[27,-9],[30,-5],[31,0],[29,5],[26,9],[21,10]]){let r=3.8;let poly=[[-r,-r*.65],[-r*.65,-r],[r*.65,-r],[r,-r*.65],[r,r*.65],[r*.65,r],[-r*.65,r],[-r,r*.65]];let c=prism(poly,BASE,16);c=roofY(c,0,16,1.2);c=roofX(c,0,16,1.2);chapels.push(c.translate([x,y,0]))}
// Langere lage sacristie met reeks dwarskappen op de noordwestzijde.
let annex=[];for(const x of [8.5,11.7,14.9,18.1,21.3,24.5]){annex.push(roofX(box(x-1.6,x+1.6,11,19.2,BASE,10.8),x,10.8,1.45))}
let back=roofY(box(30,40.7,-5.4,3.8,BASE,15.5),-.8,15.5,1.1);
// Toren en achtvlakkige spits. Historische bron geeft 83,5 m; AHN5 mist hoogste deel.
let tower=box(-42,-32,-4.7,4.1,BASE,45.5);
let spire=Manifold.cylinder(37.5,4.7,.45,8).rotate([0,0,22.5]).translate([-37,-.3,45.3]);
// Vier hoge geveltoppen aan de spitsvoet zoals zichtbaar op de foto's.
let crowns=[roofY(box(-42.4,-41.4,-2.8,2.2,BASE,52),-.3,52,2.2),roofY(box(-32.6,-31.6,-2.8,2.2,BASE,52),-.3,52,2.2),roofX(box(-39.5,-34.5,-5.1,-4.1,BASE,52),-37,52,2.2),roofX(box(-39.5,-34.5,3.5,4.5,BASE,52),-37,52,2.2)];
let pinnacles=[];for(const x of [-40.3,-33.7])for(const y of [-3.4,2.8]){pinnacles.push(box(x-.55,x+.55,y-.55,y+.55,BASE,44));pinnacles.push(Manifold.cylinder(5,.85,.45,4).rotate([0,0,45]).translate([x,y,43.8]))}
let lantern=Manifold.cylinder(3.4,1.5,1.5,8).translate([2.45,-.3,29.0]);let lanternTop=Manifold.cylinder(8.5,1.5,.45,8).translate([2.45,-.3,32.1]);
let buttresses=[];for(const x of [-32.5,-27.5,-22.5,-17.5,-12.5,-7.5])for(const side of [-1,1]){let y=side<0?-13.5:11;let q=box(x-.55,x+.55,y,y+1.5,BASE,12);q=plane(q,0,side<0?1:-1,24);buttresses.push(q)}
// Luchtbogen langs het schip: massief met dezelfde schuine bovenzijde, steunloos printbaar.
for(const x of [-27.5,-22.5,-17.5,-12.5,-7.5])for(const side of [-1,1]){
 let q=box(x-.5,x+.5,side<0?-12.4:4.7,side<0?-5.3:11.4,BASE,20.8);
 buttresses.push(plane(q,0,side<0?1:-1,25.2));
}
// Schuin gevulde luchtbogen blijven zonder steun afdrukbaar.
for(const x of [14,19,24])for(const side of [-1,1]){let q=box(x-.5,x+.5,side<0?-11.8:4.6,side<0?-5.2:11,BASE,21);buttresses.push(plane(q,0,side<0?1:-1,25))}
let church=Manifold.union([nave,...aisles,transept,choir,amb,...chapels,...annex,back,tower,spire,...crowns,...pinnacles,lantern,lanternTop,...buttresses]);
// Sluit twee onbedoelde kruipruimten onder de aansluiting van de sacristie.
church=Manifold.union([church,box(8.1,13.6,4.7,11.1,BASE,.1),box(14.4,18.1,4.7,11.1,BASE,.1)]);
const niche=(x,y,z,w,h)=>{let p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.3).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-30,-25,-20,-15,-10])for(const y of [-11.8,12.0])church=church.subtract(niche(x,y,3,1.8,6.8));
for(const y of [-16.2,18])church=church.subtract(niche(2.45,y,4,3.4,9.2));
// Grote rozetten in de geveltoppen van beide dwarsarmen.
for(const y of [-15.9,17.9])church=church.subtract(Manifold.cylinder(1.5,2.5,2.5,32).rotate([90,0,0]).translate([2.45,y,16]));
for(const y of [-3.0,.0,2.5])church=church.subtract(niche(0,0,1,1.8,5).rotate([0,0,90]).translate([-42.5,y,0]));
for(const y of [-1.9,.9])church=church.subtract(niche(0,0,7.3,1.25,4.0).rotate([0,0,90]).translate([-42.5,y,0]));
church=church.subtract(Manifold.cylinder(1.4,2.5,2.5,32).rotate([0,90,0]).translate([-42.6,-.3,14]));
for(const y of [-2,1.4])church=church.subtract(niche(0,0,31,1.7,9).rotate([0,0,90]).translate([-42.5,y,0]));
for(const [x,y,ang] of [[22,-13.2,0],[27,-12.2,0],[26,11.6,180]])church=church.subtract(niche(0,0,3,1.5,6).rotate([0,0,ang]).translate([x,y,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Lambertuskerk Veghel',origin:ORIGIN,xAxis:X_AXIS,groundHeight:9.2,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0860100001910490'],description:'Neogotische kruisbasiliek met hoge westtoren, kooromgang en sacristie.',realWorld:{groundNapM:9.2,ahn5TopNapM:87.728,publishedTowerHeightM:83.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0860100001910490','https://commons.wikimedia.org/wiki/Category:Sint-Lambertuskerk_(Veghel)','https://www.vriendenvandeeerdsekerk.nl/wp-content/uploads/2016/11/2016-09-11-Open-Monumentendag-Boekje2.compressed.pdf','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-lambertuskerk-veghel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















