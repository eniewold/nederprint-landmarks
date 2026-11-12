// Sint Maartenskerk Heenvliet: asymmetrische zaalkerk met noordbeuk en westelijke geveltoren.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};const slug='sint-maartenskerk-heenvliet';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;const BASE=-.5,ORIGIN=[76250,431267],X_AXIS=[.9732,-.2299],GROUND_NAP=-.58;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
// Dakhelften als afzonderlijke dakvlakken boven het schip; noordelijk lessenaarsdak loopt laag door.
const foot=[[0,-7.3],[21,-7.3],[24,-6.7],[26,-4.4],[26,-1.3],[24,1.1],[21,2.6],[21,7.7],[0,7.7]];
const roofPts=[...ring(foot,BASE),[0,-7.3,8.7],[21,-7.3,8.7],[24,-6.7,8.7],[26,-4.4,8.7],[26,-1.3,8.7],[24,1.1,8.7],[21,2.6,8.7],[21,7.7,4.4],[0,7.7,4.4],[2,-2.25,16.1],[21,-2.25,16.1]];
const solids=[Manifold.hull(roofPts)];
// Vierkante torenschacht met slanke, vierzijdige spits boven de voorgevel.
const tower=rect(.1,4.5,-4.5,.0);solids.push(Manifold.hull([...ring(tower,BASE),...ring(tower,18.6)]));
solids.push(Manifold.hull([...ring(tower,18.55),...ring(rect(.6,4,-4,-.5),19.3)]));
solids.push(Manifold.hull([...ring(rect(.6,4,-4,-.5),19.25),...ring(rect(1.8,2.8,-2.75,-1.75),27.6)]));
// Zijbeuksteunberen en een kleine aanbouw aan noordgevel.
for(const x of [4,8,12,16,20])for(const y of [-7.9,7.2]){const b=rect(x,x+.9,y,y+1.1);solids.push(Manifold.hull([...ring(b,BASE),...ring(b,4.0),...ring(rect(x,x+.9,y+(y<0?.5:0),y+(y<0?1.1:.6)),4.5)]));}
const ext=rect(7,11,7.3,13.4);solids.push(Manifold.hull([...ring(ext,BASE),...ring(ext,2.4),[9,7.3,4.4],[9,11.7,4.4],[9,13.4,2.4]]));
let church=Manifold.union(solids);
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];for(const dep of [-.35,.7])for(const [u,z] of [[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]])p.push([x+nx*dep-ny*u,y+ny*dep+nx*u,z]);return Manifold.hull(p)};
const cuts=[];for(const x of [2.5,6.5,10.5,14.5,18.5])cuts.push(niche([x,-7.3],[0,-1],1.7,2.5,6.3,7.2));
cuts.push(niche([26,-2.8],[1,0],1.7,2.7,6.5,7.4));cuts.push(niche([24.8,-5.6],[.75,-.66],1.4,2.7,6.4,7.3));cuts.push(niche([24.8,-.1],[.75,.66],1.4,2.7,6.4,7.3));
for(const [x,y,nx,ny] of [[.1,-2.25,-1,0],[4.5,-2.25,1,0],[2.3,-4.5,0,-1],[2.3,0,0,1]])cuts.push(niche([x,y],[nx,ny],1.3,15.9,17.3,18));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint Maartenskerk Heenvliet',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0568100000100348'],description:'Zaalkerk met lage noordbeuk, vijfzijdige koorsluiting en slanke westelijke toren.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:16.1,towerTopM:27.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0568100000100348','https://monumentenregister.cultureelerfgoed.nl/monumenten/9381','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Heenvliet']};
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










