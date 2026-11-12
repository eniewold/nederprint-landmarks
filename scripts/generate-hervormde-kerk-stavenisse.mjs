// Hervormde Kerk Stavenisse: T-vormig schip en lantaarn als bouwdelen.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};const slug='hervormde-kerk-stavenisse';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;const BASE=-.5,ORIGIN=[59708.65,400602.27],X_AXIS=[.9798,-.2],GROUND_NAP=1.05;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const gableX=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const gableY=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
// Dwarszaal met schildvormig einde uit BAG-vlakken en lagere oostelijke kapel.
const a=-10.2,b=10.2,c=-12.7,d=12.7;
const hall=Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),8.3),[0,-9.2,14.55],[0,9.2,14.55]]);
const solids=[hall,gableX(8,17,-4.4,4.4,4.5,7.2),gableX(16,28,-5,5,3.3,7.2)];
// Westgevel voor toren en torenromp in vierkant en achtkant.
solids.push(gableX(-13.8,-8,-3.8,3.8,8,13.4));
solids.push(box(-17.7,-13.4,-2.1,2.1,BASE,13.8));
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI*i/4),cy+r*Math.sin(Math.PI*i/4)]),tc=[-15.55,0];
solids.push(Manifold.hull([...ring(oct(...tc,2.0),13.7),...ring(oct(...tc,1.8),19.1)]));
// Lantaarn: ondiepe blinde openingen op een stevige kern, dus geen dunne kolommen.
solids.push(Manifold.hull([...ring(oct(...tc,1.7),19.05),...ring(oct(...tc,1.35),19.6)]));
solids.push(Manifold.hull([...ring(oct(...tc,1.35),19.55),...ring(oct(...tc,1.35),21.8)]));
solids.push(Manifold.hull([...ring(oct(...tc,1.4),21.75),...ring(oct(...tc,.9),22.5),...ring(oct(...tc,.5),22.8)]));
solids.push(Manifold.hull([...ring(oct(...tc,.5),22.75),...ring(oct(...tc,.65),23.3),...ring(oct(...tc,.45),24.0)]));
// Overhoekse steunberen en zware muurdammen op de hoeken.
for(const y of [-2.15,2.15])solids.push(Manifold.hull([...ring(rect(-18.4,-16.9,y-.65,y+.65),BASE),...ring(rect(-18.4,-16.9,y-.65,y+.65),7.8),...ring(rect(-17.8,-16.8,y-.55,y+.55),8.8)]));
let church=Manifold.union(solids);
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];for(const dep of [-.3,.65])for(const [u,z] of [[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]])p.push([x+nx*dep-ny*u,y+ny*dep+nx*u,z]);return Manifold.hull(p)};
const cuts=[];for(const y of [-8.8,-5.6,5.6,8.8])for(const side of [-1,1])cuts.push(niche([side*10.2,y],[side,0],1.15,2,6.1,6.8));
for(const x of [-6,-2,2,6])for(const side of [-1,1])cuts.push(niche([x,side*12.7],[0,side],1.2,1.8,6.5,7.2));
cuts.push(niche([-17.7,0],[-1,0],1.4,0,2.6,3.4),niche([-17.7,0],[-1,0],1.2,4.2,7,7.7));
for(const [x,y,nx,ny] of [[-17.55,0,-1,0],[-15.55,-1.8,0,-1],[-15.55,1.8,0,1]])cuts.push(niche([x,y],[nx,ny],.9,15.5,17.3,17.8));
for(const [x,y,nx,ny] of [[-16.9,0,-1,0],[-15.55,-1.35,0,-1],[-15.55,1.35,0,1],[-14.2,0,1,0]])cuts.push(niche([x,y],[nx,ny],.9,20.0,21.15,21.6));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Hervormde Kerk Stavenisse',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0716100000283519'],description:'T-vormige kerk met oudere westtoren, achtkantige lantaarn en oostelijke grafkapel.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:14.55,towerTopM:24},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0716100000283519','https://monumentenregister.cultureelerfgoed.nl/monumenten/35407','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Stavenisse','https://www.hervormdstavenisse.nl/geschiedenis/kerkgebouw']};
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










