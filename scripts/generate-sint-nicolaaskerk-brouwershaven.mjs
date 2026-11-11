// Sint-Nicolaaskerk Brouwershaven: hallenkerk met kooromgang en vieringruiter.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};const slug='sint-nicolaaskerk-brouwershaven';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;const BASE=-.5,ORIGIN=[52927,416269.5],X_AXIS=[1,0],GROUND_NAP=.104;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
const solids=[roofV(-6.3,.3,-3,2.6,8,12.7),roofV(0,55,-6.2,7.1,15.5,24.7),roofV(0,36,-15.4,-6.1,15.5,21.4),roofV(0,36,7,15.4,14.7,20.7),roofU(35,47,-14.5,15.4,15.5,24.7)];
// Hoge koorsluiting met omlopende lage straalkapellen.
const high=[[54,-6.1],[57,-5.5],[60,-2.9],[60,2.9],[57,5.6],[54,7.1]];
solids.push(Manifold.hull([...ring(high,BASE),...ring(high,15.5),[54,0,24.7],[56.7,0,24.7]]));
const low=[[47,-14.8],[54,-12],[60,-9],[65,-6],[67.8,-2.5],[67.8,1],[65,5],[60,8],[54,11.2],[47,14.5]];
solids.push(Manifold.hull([...ring(low,BASE),...ring(low,7.8),[51,-9,11.4],[60,-5,11.4],[63,0,11.4],[60,5,11.4],[51,9,11.4]]));
for(const [cx,cy] of [[56,-9],[63,-6],[66,0],[63,6],[56,9]]){const r=2.4,p=Array.from({length:8},(_,i)=>[cx+r*Math.cos(i*Math.PI/4),cy+r*Math.sin(i*Math.PI/4)]);solids.push(Manifold.hull([...ring(p,BASE),...ring(p,8.1),[cx,cy,11.1]]));}
solids.push(roofU(19.8,24.5,-23.2,-15,4.5,7.8),roofU(45.7,54.3,-20.5,-13,7.8,12.7));
// Achtkante vieringruiter; open lantaarn met printbare kern, smalle spits geschat op foto.
const tx=41.2,ty=0,oct=r=>Array.from({length:8},(_,i)=>[tx+r*Math.cos(Math.PI/8+i*Math.PI/4),ty+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
solids.push(Manifold.extrude(new CrossSection([oct(1.35)]),5).translate([0,0,23.5]));
solids.push(Manifold.hull([...ring(oct(1.35),28.4),...ring(oct(.48),37)]));
for(const x of [0.4,9.4,18.4,27.4,36.4])for(const side of [-1,1]){const y=side<0?-15.35:15.35,edge=y+side*1.15;solids.push(Manifold.hull([...ring(rect(x-.5,x+.5,Math.min(y,edge),Math.max(y,edge)),BASE),...ring(rect(x-.5,x+.5,Math.min(y,edge),Math.max(y,edge)),11.3),...ring(rect(x-.5,x+.5,y-.08,y+.08),12.5)]));}
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.3,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];for(const x of [4.8,13.8,22.8,31.8])for(const side of [-1,1])cuts.push(niche([x,side<0?-15.4:15.4],[0,side],1.9,3,11.4,12.4));
for(const [cx,cy] of [[56,-9],[63,-6],[66,0],[63,6],[56,9]]){const a=Math.atan2(cy,cx-53);cuts.push(niche([cx+2.2*Math.cos(a),cy+2.2*Math.sin(a)],[Math.cos(a),Math.sin(a)],1.4,2,6.3,7.1));}
cuts.push(niche([-6.3,-.2],[-1,0],1.7,0,5,5.8));for(const [nx,ny] of [[1,0],[-1,0],[0,1],[0,-1]])cuts.push(niche([tx+nx*1.25,ty+ny*1.25],[nx,ny],.8,25.4,27.4,27.9));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint Nicolaaskerk Brouwershaven',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.1676100000442681'],description:'Hallenkerk met straalkapellen en vereenvoudigde vieringruiter; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:24.7,towerTopEstimatedM:37},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000442681','https://monumentenregister.cultureelerfgoed.nl/monumenten/11122','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Nicolaaskerk_(Brouwershaven)']};

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









