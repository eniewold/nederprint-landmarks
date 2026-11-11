// Geerteskerk Kloetinge: kerk en afzonderlijk geregistreerde westtoren.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};const slug='geerteskerk-kloetinge';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;const BASE=-.5,ORIGIN=[52822,390962],X_AXIS=[.998,-.06],GROUND_NAP=3.081;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
const solids=[roofV(.25,30.8,-6.9,7.9,9.1,20.4),roofU(23,30.5,-11.9,12.8,9.1,15.5),roofV(29.6,41.5,-5,5.6,9.2,18.9),roofV(30.5,41.6,5.5,11.7,7.8,12.3),roofV(30.5,41.6,-9.7,-5,5.8,9.8)];
const choir=[[40,-5],[42,-3.8],[45.5,-1.1],[45.5,1.7],[43.8,4.8],[41.6,5.4],[40,5.6]];
solids.push(Manifold.hull([...ring(choir,BASE),...ring(choir,9.2),[40,.3,18.9],[41.5,.3,18.9]]));
// Torenschacht met spits, licht verbrede bekroning en ondersteunde top.
solids.push(box(-8.7,.4,-4.3,5.1,BASE,38.7));
const tx=-4.15,ty=.4,oct=r=>Array.from({length:8},(_,i)=>[tx+r*Math.cos(Math.PI/8+i*Math.PI/4),ty+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
solids.push(Manifold.hull([...ring(oct(3.4),38.6),...ring(oct(1.05),52.0)]));
solids.push(Manifold.hull([...ring(oct(1.05),51.9),...ring(oct(1.55),52.5)]));solids.push(Manifold.hull([...ring(oct(1.55),52.4),...ring(oct(.48),54.7)]));
// Hoeksteunberen volgen de toren over vrijwel de volle hoogte.
for(const x of [-8.8,.25])for(const y of [-4.4,5.0])solids.push(Manifold.hull([...ring(rect(x-.55,x+.55,y-.55,y+.55),BASE),...ring(rect(x-.55,x+.55,y-.55,y+.55),34),...ring(rect(x-.25,x+.25,y-.25,y+.25),35)]));
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.3,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];for(const x of [4,9,14,19])for(const side of [-1,1])cuts.push(niche([x,side<0?-6.9:7.9],[0,side],1.6,3.2,8,8.9));
for(const [x,y,nx,ny] of [[-8.7,.4,-1,0],[-4.15,-4.3,0,-1],[-4.15,5.1,0,1]]){cuts.push(niche([x,y],[nx,ny],1.8,18,26,27));cuts.push(niche([x,y],[nx,ny],1.4,28.4,35.7,36.5));}
cuts.push(niche([-8.7,.4],[-1,0],1.7,0,4,4.8));church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Geerteskerk Kloetinge',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0664100000019388','NL.IMBAG.Pand.0664100000019592'],description:'Gotische kerk met koor, kapellen en westtoren; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:20.4,towerTopM:54.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0664100000019388','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0664100000019592','https://monumentenregister.cultureelerfgoed.nl/monumenten/16426','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Geerteskerk_(Kloetinge)']};

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










