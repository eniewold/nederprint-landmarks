// Sint-Bavokerk Aardenburg: basilicaal schip, hallenkoor, westtoren en vieringruiter.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='sint-bavokerk-aardenburg';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[19680,366648],X_AXIS=[.94,-.342],GROUND_NAP=3.599;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
const solids=[roofV(-3,21,-.9,13.9,13.6,22.3),roofV(-3,17.5,-4.1,-.7,8.4,13.6),roofV(3.2,17.5,13.9,16.4,8.2,11.6),roofU(17,28,-4.5,16.4,16.3,23.9),roofV(27.9,58.8,-.2,10.9,15.6,23.5),roofV(28,50,-6.8,-.1,15.4,20.0),roofV(28,50,10.8,18.8,15.4,20.1)];
const choir=[[57,-.2],[59,0],[62.6,3.0],[62.6,8.8],[59,12],[57,10.9]];
solids.push(Manifold.hull([...ring(choir,BASE),...ring(choir,15.4),[57,5.5,23.5],[59,5.5,23.5]]));
// Westtoren met gesloten lantaarn en een vereenvoudigde, printbare peerkap.
solids.push(box(-3.2,3.5,10.0,16.5,BASE,33.2));
const poly=(cx,cy,r)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
const tx=.1,ty=13.3,oct=r=>poly(tx,ty,r);
solids.push(Manifold.hull([...ring(oct(2.2),33.1),...ring(oct(1.85),37.6)]));
solids.push(Manifold.extrude(new CrossSection([oct(1.15)]),4.3).translate([0,0,37.5]));
solids.push(Manifold.hull([...ring(oct(1.15),41.7),...ring(oct(1.9),43.0)]));
solids.push(Manifold.hull([...ring(oct(1.9),42.9),...ring(oct(1.7),45),...ring(oct(.48),49.5)]));
// Vieringruiter, eveneens met gesloten kern en slanke kap.
const vx=23.2,vy=5.6,vOct=r=>poly(vx,vy,r);
solids.push(Manifold.extrude(new CrossSection([vOct(1.65)]),4.0).translate([0,0,22.8]));
solids.push(Manifold.extrude(new CrossSection([vOct(1.1)]),3.1).translate([0,0,26.7]));
solids.push(Manifold.hull([...ring(vOct(1.1),29.7),...ring(vOct(.48),37.05)]));
// Steunberen als bouwdelen, hoekige afdekking.
for(const x of [29,34.1,39.2,44.1,49.5])for(const side of [-1,1]){const y=side<0?-6.75:18.75,edge=y+side*.95;solids.push(Manifold.hull([...ring(rect(x-.5,x+.5,Math.min(y,edge),Math.max(y,edge)),BASE),...ring(rect(x-.5,x+.5,Math.min(y,edge),Math.max(y,edge)),11.4),...ring(rect(x-.5,x+.5,y-.08,y+.08),12.4)]));}
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.3,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids).subtract(box(12,14.2,16.25,16.6,BASE-1,15));const cuts=[];
for(const x of [31.5,36.5,41.5,46.5])for(const side of [-1,1])cuts.push(niche([x,side<0?-6.8:18.8],[0,side],1.6,3,11.6,12.5));
for(const side of [-1,1])cuts.push(niche([23,side<0?-4.5:16.4],[0,side],1.6,3,12.5,13.3));
cuts.push(niche([-3.2,13.3],[-1,0],1.3,19,29,29.8),niche([-3.2,13.3],[-1,0],1.4,0,4,4.8));
for(const [nx,ny] of [[1,0],[-1,0],[0,1],[0,-1]])cuts.push(niche([tx+nx*1.06,ty+ny*1.06],[nx,ny],.65,38.4,40.6,41.1));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint Bavokerk Aardenburg',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.1714100000732699','NL.IMBAG.Pand.1714100000732700'],description:'Scheldegotische basiliek met hallenkoor, westtoren en vieringruiter; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,choirRidgeM:23.5,westTowerTopM:49.5,crossingRiderM:37.05},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1714100000732699','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1714100000732700','https://monumentenregister.cultureelerfgoed.nl/monumenten/6880','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Sint-Baafskerk_(Aardenburg)']};

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









