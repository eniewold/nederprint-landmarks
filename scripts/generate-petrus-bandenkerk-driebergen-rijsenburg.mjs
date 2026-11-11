// Sint-Petrus'-Bandenkerk Rijsenburg, classicistische kerk van Adrianus Tollus (1809–1810).
// BAG/AHN en foto's; elke kap als vlak lichaam en zichtbare zuilen als verbonden bouwdelen.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='petrus-bandenkerk-driebergen-rijsenburg';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[147366,451879],X_AXIS=[-.7538,-.6571],GROUND_NAP=4.482;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
// Rechthoekig schip en vier dwarskappen bij het koor, elk afzonderlijke dakvlakken.
const solids=[roofV(-2.7,36.8,-5.45,5.45,8.55,13.9)];
for(const x of [16.5,24.5]) solids.push(roofU(x,x+7.55,-9.9,9.95,9.35,13.15));
// Afgeronde absis en aangebouwde lage vleugel aan de achterzijde.
const apse=[[36.5,-2.7],[38.8,-1.57],[38.8,1.6],[36.5,2.7]];
solids.push(Manifold.hull([...ring(apse,BASE),...ring(apse,8.2),[36.5,0,11.8]]));
solids.push(roofV(33.1,43.45,-12,-6.28,5.1,7.95),box(30.5,34,-9.9,-5.3,BASE,4.8));
// Classicistische westgevel en portiek; zuilen dragen door tegen de gevel.
solids.push(box(-4.3,-2.6,-2.75,2.72,BASE,7.5));
for(const y of [-2.3,-1.25,1.25,2.3])solids.push(box(-4.7,-3.85,y-.47,y+.47,BASE,7.3));
solids.push(Manifold.hull([...ring(rect(-4.7,-2.6,-3,3),7.2),[-4.7,0,8.7],[-2.6,0,8.7]]));
// Vierkante ondertoren, achtkantige klokkenlantaarn en koepeldak.
solids.push(box(-2.7,1.9,-2.8,2.8,BASE,17.5));
const oct=(r)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4)/Math.cos(Math.PI/8)-.4,r*Math.sin(Math.PI/8+i*Math.PI/4)/Math.cos(Math.PI/8)]);
solids.push(Manifold.hull([...ring(oct(1.7),17.4),...ring(oct(1.7),21.2)]));
solids.push(Manifold.hull([...ring(oct(1.7),21.15),...ring(oct(1.15),22.1)]));
solids.push(Manifold.hull([...ring(oct(.65),22.0),...ring(oct(.65),23.2),...ring(oct(.47),24.0)]));
// Ondiepe rondboognissen; boog geprint met een spitse 45-graden bovenzijde.
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.32,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
cuts.push(niche([-4.7,0],[-1,0],1.4,BASE,4.8,5.5));
for(const y of [-4,4])cuts.push(niche([-2.7,y],[-1,0],1.4,2.4,6.3,7));
for(const x of [2.8,6.4,10,13.6])for(const s of [-1,1])cuts.push(niche([x,s*5.45],[0,s],1.15,2.8,7.2,7.8));
for(const x of [20.2,28.2])for(const s of [-1,1])cuts.push(niche([x,s<0?-9.9:9.95],[0,s],1.5,3.1,7.7,8.45));
for(const s of [-1,1])cuts.push(niche([-.4,s*1.7],[0,s],1.25,18.2,20.3,20.95));
church=church.subtract(Manifold.union(cuts));
const parts=[['building:kerk',church]];
const META={name:"Petrus' Bandenkerk Driebergen-Rijsenburg",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.1581100000009695'],description:'Classicistische kerk met zuilenportiek, dwarskappen en achtkantige koepeltoren; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:13.9,towerTopM:24},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1581100000009695','https://monumentenregister.cultureelerfgoed.nl/monumenten/14099','https://service.pdok.nl/rws/ahn/wcs/v1_0',"https://commons.wikimedia.org/wiki/Category:Sint_Petrus%27_Banden_(Driebergen-Rijsenburg)"]};
function toStl(solid,label,mmPerMetre){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return b;
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:`NederPrint generate-${slug}.mjs`},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min.map(x=>+x.toFixed(3)),max:bb.max.map(x=>+x.toFixed(3))}},null,1));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printSolid=church.translate([0,0,-BASE]),printFiles=[];
await writeFile(path.join(outDir,glb),toGlb(parts));
for(const scale of [100,1000]){const f=`${slug}-1-${scale}.stl`;printFiles.push(f);await writeFile(path.join(outDir,f),toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale));}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2)+"\n");





