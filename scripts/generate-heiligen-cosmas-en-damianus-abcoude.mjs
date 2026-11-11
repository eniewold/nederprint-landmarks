// H.H. Cosmas en Damianus Abcoude, driebeukige kruisbasiliek van Alfred Tepe (1887–1888).
// BAG/3DBAG voor omtrek, AHN en foto's voor dakvlakken en spits.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='heiligen-cosmas-en-damianus-abcoude';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[126965,476184],X_AXIS=[.93087,.36536],GROUND_NAP=-.936;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
// Middenbeuk, twee lagere zijbeuken en veelhoekige transepten.
const solids=[roofV(2,43,-5.5,3.0,16.0,24.0),roofV(3.5,24,-10.9,-4.0,8.7,12.15),roofV(3.5,24,1.5,8.35,8.7,12.15)];
const trans=[[24,-11.8],[26,-14.5],[36,-14.5],[38.7,-11.8],[38.7,9.7],[36,12.6],[26,12.6],[24,9.7]];
solids.push(Manifold.hull([...ring(trans,BASE),...ring(trans,16.0),[31.4,-10.5,24],[31.4,8.6,24]]));
const apse=[[38,-5.6],[46,-5.6],[49,-2.8],[49,.8],[46,3.2],[38,3.2]];
solids.push(Manifold.hull([...ring(apse,BASE),...ring(apse,16),[42,-1.2,24]]));
// Lage bijbouw en aangehechte sacristie achter de kerk.
solids.push(box(31.5,39.2,11.8,16.2,BASE,3.3),roofV(41,50,-12.1,-5.3,6,9.4));
// Torenschacht en naaldspits; AHN toont een hogere spits dan de afgeknotte PDOK-mesh.
solids.push(box(-2.25,3.5,-4.9,5.3,BASE,30.5));
const oct=(cx,cy,rx,ry)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [cx+rx*Math.cos(a)/Math.cos(Math.PI/8),cy+ry*Math.sin(a)/Math.cos(Math.PI/8)]});
const tc=[.55,.2];solids.push(Manifold.hull([...ring(rect(-2.25,3.5,-4.9,5.3),30.4),...ring(oct(...tc,2.6,3.4),32.2)]));
solids.push(Manifold.hull([...ring(oct(...tc,2.6,3.4),32.1),...ring(oct(...tc,.47,.47),54.1)]));
// Steunberen, aflopende vlakken en traptoren.
for(const x of [6.7,12.3,17.9,23.5])for(const side of [-1,1]){const y=side<0?-10.9:8.35,o=y+side*.95;solids.push(Manifold.hull([...ring(rect(x-.48,x+.48,Math.min(y,o)-.08,Math.max(y,o)+.08),BASE),...ring(rect(x-.48,x+.48,Math.min(y,o)-.08,Math.max(y,o)+.08),6.9),...ring(rect(x-.48,x+.48,y-.08,y+.08),8.3)]));}
solids.push(Manifold.hull([...ring(oct(2.6,-5.2,1.55,1.55),BASE),...ring(oct(2.6,-5.2,1.55,1.55),15.1),[2.6,-5.2,17.1]]));
for(const x of [24.3,38.3])for(const y of [-12.5,10.7])solids.push(box(x-.5,x+.5,y-.5,y+.5,BASE,14));
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.38,.8])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [9.5,15.1,20.7])for(const side of [-1,1]){cuts.push(niche([x,side<0?-10.9:8.35],[0,side],1.45,2.7,6.4,7.6));cuts.push(niche([x,side<0?-5.5:3],[0,side],1.4,12.1,14.6,15.8));}
for(const y of [-2.6,2.6])cuts.push(niche([-2.25,y],[-1,0],1.5,20.6,27.5,29));
for(const x of [-.8,2])for(const side of [-1,1])cuts.push(niche([x,side<0?-4.9:5.3],[0,side],1.4,20.6,27.5,29));
cuts.push(niche([-2.25,.2],[-1,0],2.3,BASE,3.3,4.6));
for(const side of [-1,1])for(const x of [27.8,34.8])cuts.push(niche([x,side<0?-14.5:12.6],[0,side],1.65,3.2,10.8,12.3));
church=church.subtract(Manifold.union(cuts));
const parts=[['building:kerk',church]];
const META={name:'Heiligen Cosmas en Damianus Abcoude',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0305100000000811'],description:'Driebeukige kruisbasiliek met veelhoekige transepten en hoge westtoren; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:24,towerTopM:54.1},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0305100000000811','https://monumentenregister.cultureelerfgoed.nl/monumenten/6978','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Cosmas_en_Damianus,_Abcoude']};
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






