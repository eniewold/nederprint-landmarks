// H.H. Simon en Judaskerk Lattrop: 1925 ontwerp Joseph en Pierre Cuypers jr.
// Geometrie in meters uit BAG/3D BAG en AHN4, gevels geschat naar RCE-foto's.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='heilig-hart-simon-en-judaskerk-lattrop-breklenkamp';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[263148.8,494501],X_AXIS=[.75114987,.66013171],GROUND_NAP=20.77;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const below=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
// Langskap, dwarskappen en vijfzijdig koor: rechte dakvlakken, geen hoogteplakken.
const solids=[roofV(-.2,24.15,-8.35,8.45,6.6,15.95),box(15.6,24.0,-9.65,9.65,BASE,6.65)];
solids.push(roofU(5.25,15.75,-10.05,10.05,7.45,13.92));
// Kleine dwarsgevel bij het koor, zichtbaar op de RCE-zuidfoto.
solids.push(roofU(19.4,22.8,-9.65,-7.9,6.65,9.25));
const apse=[[23.8,-4.6],[28.45,-4.6],[30.08,-1.7],[30.08,1.1],[28.45,4.4],[23.8,4.4]];
solids.push(Manifold.hull([...ring(apse,BASE),...ring(apse,7.32),[26.0,-.1,12.82]]));
// Sacristieën met lage platte daken aan beide koorflanken.
solids.push(box(23.7,28.6,-12,-4.35,BASE,4.48),box(23.7,28.8,4.2,9.2,BASE,4.48));
// Zijdelingse portalen, steunen en westelijke zijvolumes.
solids.push(box(15.25,20.65,-14.15,-9.55,BASE,2.9),box(-2.9,.2,-6.0,-2.8,BASE,9.9),box(-2.9,.2,2.8,6.0,BASE,9.9));
for(const x of [5.5,15.5,20.9])for(const side of [-1,1]){if(x===5.5&&side<0)continue;const y=side*(x>20?9.6:10.05);solids.push(box(x-.48,x+.48,y-(y<0?1.0:.1),y+(y<0?.1:1.0),BASE,7.4));}
// Toren: compacte bakstenen schacht met ingesnoerde achtzijdige spits.
const oct=(cx,cy,rx,ry)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [cx+rx*Math.cos(a)/Math.cos(Math.PI/8),cy+ry*Math.sin(a)/Math.cos(Math.PI/8)]});
const tc=[-1.0,0],tower=box(-2.9,1.0,-2.95,3.0,BASE,18.55);
const lower=Manifold.hull([...ring(rect(-2.9,1,-2.95,3),18.45),...ring(oct(...tc,1.85,2.05),20.0)]);
const spire=Manifold.hull([...ring(oct(...tc,1.85,2.05),19.9),...ring(oct(...tc,.47,.47),30.5)]);
solids.push(tower,lower,spire);
// Ondiepe blinde spitsboognissen, ook galmgaten; ingang op de westzijde.
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.38,.8])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
cuts.push(niche([-2.9,0],[-1,0],2.6,BASE,2.4,3.8));
for(const v of [-.95,0,.95]) cuts.push(niche([-2.9,v],[-1,0],.75,5.1,7.5,8.2));
for(const u of [-1.8,-.25])for(const v of [-2.95,3]) cuts.push(niche([u,v],[0,Math.sign(v)],1.15,15.1,17.1,18.05));
for(const v of [-.9,.9]) cuts.push(niche([-2.9,v],[-1,0],1.1,15.1,17.1,18.05));
for(const u of [8.5,9.55,10.6,11.65,12.7])for(const v of [-10.05,10.05]) cuts.push(niche([u,v],[0,Math.sign(v)],.8,2.9,6.3,7.0));
for(const u of [16.8,17.9,19.0]) cuts.push(niche([u,-9.65],[0,-1],.85,3,6.0,6.7));
for(const u of [17,19.1,21.2]) cuts.push(niche([u,9.65],[0,1],1.0,3,6.2,7.0));
cuts.push(niche([21.5,-9.65],[0,-1],1.0,3.5,5.8,6.45));
// RCE-oostgevel: vensters op de vijf vlakken van de koorsluiting.
cuts.push(niche([30.08,-.3],[1,0],1.15,3,6.1,7.05));
for(const s of [-1,1]){
 cuts.push(niche([29.27,s*3.0],[.85,s*.53],1.15,3,6.1,7.05));
 cuts.push(niche([26.25,s*4.5],[0,s],1.15,3,6.1,7.05));
}
church=church.subtract(Manifold.union(cuts));
const parts=[['building:kerk',church]];
const META={name:'H.H. Simon en Judaskerk Lattrop',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.1774100000242228'],description:'Kruisbasiliek met dwarskappen, vijfzijdig gesloten koor, twee sacristieën en achtzijdige torenspits; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:15.95,towerTopM:30.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1774100000242228','https://monumentenregister.cultureelerfgoed.nl/monumenten/508960','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:Noordwest-gevel_-_Lattrop_-_20129462_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Oostgevel_-_Lattrop_-_20129463_-_RCE.jpg']};

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




