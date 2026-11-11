// Hervormde kerk Hei- en Boeicop: oude westtoren gesloopt, huidige open dakruiter.
// BAG/AHN voor volumes, foto's voor gevel en dakruiter.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='hervormde-kerk-hei-en-boeicop';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[133988,439653],X_AXIS=[.99887,-.04745],GROUND_NAP=1.042;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
// Langskap met westelijk schild en dwarse oostkap; dakvlakken geen hoogtelagen.
const nave=Manifold.hull([...ring(rect(-.82,24.5,-6.12,5.85),BASE),...ring(rect(-.82,24.5,-6.12,5.85),10.4),[4.5,-.14,16.3],[22,-.14,16.3]]);
const east=Manifold.hull([...ring(rect(21.1,29.5,-4.25,3.6),BASE),...ring(rect(21.1,29.5,-4.25,3.6),10.4),[22,-.3,16.3],[25.3,-.3,16.3]]);
const annex=Manifold.hull([...ring(rect(21.1,26.5,8.4,12.6),BASE),...ring(rect(21.1,26.5,8.4,12.6),3.8),[23.8,9.3,5.9],[23.8,11.7,5.9]]);
const link=box(21.4,25.1,5.7,8.6,BASE,3.2);
// Ruiter: fijne open stijlen vervangen door printbare dragende kern.
const bx=19.3,by=-.5;
const oct=(r)=>Array.from({length:8},(_,i)=>[bx+r*Math.cos(Math.PI/8+i*Math.PI/4)/Math.cos(Math.PI/8),by+r*Math.sin(Math.PI/8+i*Math.PI/4)/Math.cos(Math.PI/8)]);
const rider=box(bx-.48,bx+.48,by-.48,by+.48,15.2,20.25);
const flare=Manifold.hull([...ring(oct(.48),19.7),...ring(oct(1),20.3)]);
const spire=Manifold.hull([...ring(oct(1),20.25),...ring(oct(.47),26.1)]);
const solids=[nave,east,annex,link,rider,flare,spire];
for(const x of [0.4,3.5,7,10.5,14,17.5,21.5])for(const s of [-1,1]){const y=s<0?-6.12:5.85,o=y+s*.9;solids.push(Manifold.hull([...ring(rect(x-.46,x+.46,Math.min(y,o)-.06,Math.max(y,o)+.06),BASE),...ring(rect(x-.46,x+.46,Math.min(y,o)-.06,Math.max(y,o)+.06),8.1),...ring(rect(x-.46,x+.46,y-.06,y+.06),9.1)]));}
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.32,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [2,5.25,8.75,12.25,15.75,19.5])for(const s of [-1,1])cuts.push(niche([x,s<0?-6.12:5.85],[0,s],1.2,3,7.5,8.1));
for(const y of [-2.3,2.1])cuts.push(niche([29.5,y],[1,0],1.25,1,3,3.65));
cuts.push(niche([29.5,0],[1,0],1.25,5.8,7.1,7.75));
for(const y of [-2.2,2.2])cuts.push(niche([-.82,y],[-1,0],1.15,1.4,6.5,7.1));
church=church.subtract(Manifold.union(cuts));
const parts=[['building:kerk',church]];
const META={name:'Hervormde kerk Hei- en Boeicop',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0707100000374815'],description:'Kerk met dwarskap, lage bijbouw en schematische dakruiter; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:16.3,bellTurretM:26.1},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0707100000374815','https://monumentenregister.cultureelerfgoed.nl/monumenten/21330','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Hei-_en_Boeicop']};
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






