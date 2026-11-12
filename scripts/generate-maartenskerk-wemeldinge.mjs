// Maartenskerk Wemeldinge: twee parallelle kappen, vijfzijdig koor en westtoren.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};const slug='maartenskerk-wemeldinge';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;const BASE=-.5,ORIGIN=[57626.8,392863.1],X_AXIS=[.950,.3122],GROUND_NAP=1.85;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roof=(a,b,c,d,r,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,r,ridge],[b,r,ridge]]);
// Twee beuken met gescheiden dakvlakken: de zuidelijke kap eindigt eerder.
const solids=[roof(0,31,-3.65,7.5,0,10.45,17.55),roof(.5,23,-11.5,-3.4,-7.3,10.4,17.2)];
const choir=[[30.8,-3.65],[34,-3.65],[37,-1.8],[38,1.8],[37,5.5],[34,7.5],[30.8,7.5]];
solids.push(Manifold.hull([...ring(choir,BASE),...ring(choir,10.3),[30.8,0,17.55],[33,0,17.55],[37,1.5,11.8]]));
// Vierkante torenromp en achthoekige slanke naald boven vlak torendak.
solids.push(box(-7.2,.4,-3.6,3.6,BASE,22.9));
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI*i/4),cy+r*Math.sin(Math.PI*i/4)]);
solids.push(Manifold.hull([...ring(oct(-3.4,0,2.8),22.85),...ring(oct(-3.4,0,.48),38.05)]));
// Zware steunberen met schuine afsluiting.
for(const side of [-1,1]){const y=side<0?-11.5:7.5;for(const x of (side<0?[1.5,6.6,11.8,17,22]:[1,5,9,13,17,21,25,29,33]))solids.push(Manifold.hull([...ring(rect(x-.5,x+.5,Math.min(y,y+side*1.15),Math.max(y,y+side*1.15)),BASE),...ring(rect(x-.5,x+.5,Math.min(y,y+side*1.15),Math.max(y,y+side*1.15)),8.4),...ring(rect(x-.5,x+.5,y-.1,y+.1),9.4)]));}
for(const y of [-2.8,2.8])solids.push(Manifold.hull([...ring(rect(-8.4,-7,y-.65,y+.65),BASE),...ring(rect(-8.4,-7,y-.65,y+.65),10),...ring(rect(-7.3,-6.9,y-.6,y+.6),11.3)]));
let church=Manifold.union(solids);
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];for(const dep of [-.3,.65])for(const [u,z] of [[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]])p.push([x+nx*dep-ny*u,y+ny*dep+nx*u,z]);return Manifold.hull(p)};
const cuts=[];for(const x of [3,7,11,15,19,23,27,31])cuts.push(niche([x,7.5],[0,1],1.8,3,8,9));for(const x of [4,9.2,14.4,19.6])cuts.push(niche([x,-11.5],[0,-1],1.8,3,8,9));
cuts.push(niche([38,0],[1,0],1.8,3,8,9));
cuts.push(niche([-7.2,0],[-1,0],1.7,0,2.8,3.6));for(const z of [7.5,12,17])cuts.push(niche([-7.2,0],[-1,0],.9,z,z+1.6,z+2));
for(const [x,y,nx,ny] of [[-7.2,0,-1,0],[-3.4,-3.6,0,-1],[-3.4,3.6,0,1]])for(const u of [-.8,.8])cuts.push(niche([x+(ny?u:0),y+(nx?u:0)],[nx,ny],.9,19.6,21.4,22));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Maartenskerk Wemeldinge',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0678100000007555'],description:'Tweebeukige Maartenskerk met vijfzijdig koor en oudere toren met achtzijdige naald.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:17.55,towerTopM:38.05},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0678100000007555','https://monumentenregister.cultureelerfgoed.nl/monumenten/23507','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Sint_Maarten_(Wemeldinge)','https://de.wikipedia.org/wiki/Maartenskerk_(Wemeldinge)']};
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










