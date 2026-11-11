// Sint-Martinuskerk 's-Gravenpolder: kruiskerk met octogonale toren en herstelde lantaarn.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='st-martinuskerk-s-gravenpolder';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[51554,386448.5],X_AXIS=[.982,.19],GROUND_NAP=1.18;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
const solids=[roofV(-1.9,14.7,-4.35,4.65,5.25,11.6),roofV(14.5,25.8,-3.6,3.65,7.1,12.0),roofU(8.2,16.2,-11.9,.1,6.0,11.5),roofU(10,15.5,0,11.1,5.3,9.6)];
// Ingebouwde octogonale toren en geschatte herstelde kap met printbaar gesloten lantaarn.
const tx=-.2,ty=.1;const oct=r=>Array.from({length:8},(_,i)=>[tx+r*Math.cos(Math.PI/8+i*Math.PI/4),ty+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
solids.push(Manifold.extrude(new CrossSection([oct(2.65)]),16.4-BASE).translate([0,0,BASE]));
solids.push(Manifold.hull([...ring(oct(2.65),16.3),...ring(oct(1.15),20.0)]));
solids.push(Manifold.extrude(new CrossSection([oct(1.12)]),2.35).translate([0,0,19.9]));
solids.push(Manifold.hull([...ring(oct(1.12),22.2),...ring(oct(.5),23.17)]));
// Steunberen met afgeschuinde bovenkant.
for(const x of [4.75,8.4,18.7,22.9]) for(const side of [-1,1]) {
 const y=side<0?(x<10?-4.32:-3.57):(x<10?4.62:3.62),edge=y+side*.75;
 solids.push(Manifold.hull([...ring(rect(x-.46,x+.46,Math.min(y,edge),Math.max(y,edge)),BASE),...ring(rect(x-.46,x+.46,Math.min(y,edge),Math.max(y,edge)),4.1),...ring(rect(x-.46,x+.46,y-.08,y+.08),4.9)]));
}
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.3,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [2.8,6.5])for(const side of [-1,1])cuts.push(niche([x,side<0?-4.35:4.65],[0,side],1.3,1.7,4.4,5.1));
for(const x of [17.2,20.7,24.1])for(const side of [-1,1])cuts.push(niche([x,side<0?-3.6:3.65],[0,side],1.3,2,5.6,6.3));
cuts.push(niche([12.2,-11.9],[0,-1],2,1.8,5.6,6.6),niche([12.75,11.1],[0,1],1.8,1.8,4.8,5.7),niche([25.8,0],[1,0],2.2,2,6.4,7.5),niche([-2.6,.1],[-1,0],1.35,1,4,4.7));
for(const [nx,ny] of [[1,0],[-1,0],[0,1],[0,-1]]) {
 cuts.push(niche([tx+nx*2.45,ty+ny*2.45],[nx,ny],1.0,11.3,14.2,14.8));
 cuts.push(niche([tx+nx*1.03,ty+ny*1.03],[nx,ny],.75,20.3,21.4,21.8));
}
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:"St. Martinuskerk 's-Gravenpolder",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0654100000028768'],description:'Kruiskerk met ingebouwde octogonale toren, kap en vereenvoudigde lantaarn; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,choirRidgeM:12,towerTopM:23.17},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000028768','https://monumentenregister.cultureelerfgoed.nl/monumenten/9968','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.openmonumentendag.nl/monument/maartenskerk-8/']};

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









