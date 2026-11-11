// Pieterskerk Utrecht: romaanse basiliek, dwarsschip en koor; historische westtorens verdwenen.
// BAG/AHN, PDOK en RCE-foto's voor de huidige volumes.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='pieterskerk-utrecht';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[136968,455919],X_AXIS=[.95099,.30922],GROUND_NAP=4.128;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
// Middenbeuk en zijbeuken met eigen vlakken; noordelijke lage bijbouw is BAG-onderdeel.
const solids=[roofV(-2,36,-4.7,4.7,17.8,22.7),roofV(-2,25.8,-9.95,-4.5,8.1,10.9),roofV(-2,25.8,4.5,10.1,8.1,10.9)];
// Dwarsschip, hoge koorsluiting en zuid-oostelijke kapel.
solids.push(roofU(25.9,35.1,-13.05,14.1,15.8,22.5).subtract(box(25.8,26.5,-13.2,-10.0,BASE-1,24)));
const choir=[[35,-5],[45,-5],[48.6,-2.4],[48.7,2],[45,5.3],[35,5.3]];
solids.push(Manifold.hull([...ring(choir,BASE),...ring(choir,17.4),[35,.15,22.7],[44,.15,22.7]]));
const chapel=[[35,-13.05],[43.8,-13.0],[47.2,-9.7],[47.2,-7.3],[44.8,-5.2],[35,-5.0]];
solids.push(Manifold.hull([...ring(chapel,BASE),...ring(chapel,10.3),[38,-8.8,14.1],[42.4,-8.8,14.1]]));
// Lage noordelijke aanbouw binnen de BAG-contour.
solids.push(roofV(8.1,25.7,10,14.85,7.0,9.45));
// Open vieringruiter vervangen door draagkern van 0,96 m; plat koepeltje en korte top.
const bx=30.2,by=0;const oct=(r)=>Array.from({length:8},(_,i)=>[bx+r*Math.cos(Math.PI/8+i*Math.PI/4)/Math.cos(Math.PI/8),by+r*Math.sin(Math.PI/8+i*Math.PI/4)/Math.cos(Math.PI/8)]);
solids.push(box(bx-.48,bx+.48,-.48,.48,21.5,26.1));
solids.push(Manifold.hull([...ring(oct(.48),25.6),...ring(oct(1.0),26.2)]));
solids.push(Manifold.hull([...ring(oct(1.0),26.15),...ring(oct(.55),27.1)]));
solids.push(box(bx-.47,bx+.47,-.47,.47,27,29.3));
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.3,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [2,6,10,14,18,22])for(const s of [-1,1])cuts.push(niche([x,s*4.7],[0,s],1.25,13.2,16.0,16.65));
for(const y of [-9,-5,5,9])cuts.push(niche([30.5,y<0?-13.05:14.1],[0,Math.sign(y)],1.6,4.8,13.0,13.85));
cuts.push(niche([48.7,0],[1,0],1.4,5,15,15.7),niche([46.8,-3.7],[.6,-.8],1.4,5,15,15.7),niche([46.8,3.65],[.6,.8],1.4,5,15,15.7),niche([46.0,-11.35],[.7,-.7],1.4,3.5,8.5,9.2),niche([47.2,-8.5],[1,0],1.4,3.5,8.5,9.2));
church=church.subtract(Manifold.union(cuts));
const parts=[['building:kerk',church]];
const META={name:'Pieterskerk Utrecht',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0344100000023250'],description:'Romaanse basiliek met dwarsschip, hoge koorsluiting, zijkapel en schematische vieringruiter; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:22.7,riderTopM:29.3},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000023250','https://monumentenregister.cultureelerfgoed.nl/monumenten/18297','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Pieterskerk,_Utrecht']};
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






