// Johanneskerk Nieuwerkerk: gotisch koor met sacristie, kerkzaal en vrijstaande zeshoekige toren.
import Module from 'manifold-3d';import { mkdir, writeFile } from 'node:fs/promises';import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};const slug='johanneskerk-nieuwerkerk';const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;const BASE=-.5,ORIGIN=[59060,407649],X_AXIS=[.9994,-.034],GROUND_NAP=1.0;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]],ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
// Het overgebleven laatgotische koor met vijfzijdige sluiting, kapvlakken uit BAG en AHN.
const body=[[-.8,-5.9],[15.3,-5.9],[18.1,-4.8],[20.0,-2.7],[21.2,-.5],[20.3,2.0],[18.2,4.4],[15.3,5.9],[-.8,5.9]];
const bodyRoof=Manifold.hull([...ring(body,BASE),...ring(body,11.2),[-.8,0,19.55],[15.1,0,19.55],[19.5,0,13.8]]);
const solids=[bodyRoof];
// Historische sacristie tegen het koor en aanbouw op zuidwesthoek.
solids.push(roofV(-1.5,4.6,-11.8,-5.7,6.6,10.55));
solids.push(roofV(-4.3,0.4,-3.7,2.5,6.5,9.15));
// Moderne kerkzaal en gangen: deze zijn met de kerk één BAG-pand.
solids.push(roofV(-27,-19.1,-7.2,2.6,3.8,9.1),roofV(-27,-19.0,2.5,10.1,3.8,9.1));
solids.push(roofV(-17.0,-9.2,-2.7,5.0,3.8,9.15),box(-19.3,-8.6,-2.7,5.1,BASE,3.65),box(-9.4,-.5,2.2,5.1,BASE,3.65));
// Steunberen langs gotische koor en de vijfzijdige sluiting.
for(const x of [1.7,5.3,9.1,12.8,15.8])for(const s of [-1,1]) {let y=s<0?-6.9:5.8;solids.push(Manifold.hull([...ring(rect(x-.5,x+.5,y,y+1.1),BASE),...ring(rect(x-.5,x+.5,y,y+1.1),9.2),...ring(rect(x-.5,x+.5,s<0?-6.0:5.8,s<0?-5.8:6.0),10.2)]));}
for(const [x,y] of [[17.7,-4.6],[20,-2.6],[20.1,2.2],[17.7,4.3]])solids.push(box(x-.55,x+.55,y-.55,y+.55,BASE,10.0));
const niche=(center,normal,width,z0,spring,top)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];let prof=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.32,.65])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [3.5,7.2,10.9,14.6])for(const side of [-1,1])cuts.push(niche([x,side<0?-5.9:5.9],[0,side],1.9,4.3,9.3,10.4));
church=church.subtract(Manifold.union(cuts.slice(0,-1)));
// Vrijstaande zeskantige toren, eigen BAG-pand: schaal en hoogte uit AHN en foto's.
const tc=[-39.3,2.2], hex=(r)=>Array.from({length:6},(_,i)=>[tc[0]+r*Math.cos(Math.PI/6+i*Math.PI/3),tc[1]+r*Math.sin(Math.PI/6+i*Math.PI/3)]);
let tower=Manifold.extrude(new CrossSection([hex(4.05)]),27.2-BASE).translate([0,0,BASE]);
tower=Manifold.union([tower,Manifold.hull([...ring(hex(3.8),27),[tc[0],tc[1],32.2]])]);
// Zes steunberen als bouwdelen met afgeschuinde bovenzijde.
for(let i=0;i<6;i++){let a=Math.PI/6+i*Math.PI/3,dx=Math.cos(a),dy=Math.sin(a),x=tc[0]+dx*4,y=tc[1]+dy*4;let pillar=box(-.7,.7,-.7,.7,BASE,19.8).translate([x,y,0]);tower=Manifold.union([tower,pillar]);}
const towerCuts=[];for(let i=0;i<6;i++){let a=i*Math.PI/3,n=[Math.cos(a),Math.sin(a)];towerCuts.push(niche([tc[0]+n[0]*3.45,tc[1]+n[1]*3.45],n,1.2,21,25,25.7));}
tower=tower.subtract(Manifold.union(towerCuts));
const parts=[['building:kerk',church],['building:toren',tower]];
const META={name:'Johanneskerk Nieuwerkerk',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.1676100000432074','NL.IMBAG.Pand.1676100000462578'],description:'Vijfzijdig gesloten koor met sacristie en kerkzaal; vrijstaande zeshoekige toren op eigen fundament.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:19.55,towerTopM:32.2},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000432074','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000462578','https://monumentenregister.cultureelerfgoed.nl/monumenten/14164','https://monumentenregister.cultureelerfgoed.nl/monumenten/14165','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Sint_Johannes_Evangelist_(Nieuwerkerk)']};
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
const whole=Manifold.union([church,tower]);const bb=whole.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=whole.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min.map(x=>+x.toFixed(3)),max:bb.max.map(x=>+x.toFixed(3))}},null,1));
if(pieces.length!==2)throw new Error(`expected church and freestanding tower, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printSolid=whole.translate([0,0,-BASE]),printFiles=[];
await writeFile(path.join(outDir,glb),toGlb(parts));
for(const scale of [100,1000]){const f=`${slug}-1-${scale}.stl`;printFiles.push(f);await writeFile(path.join(outDir,f),toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale));}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2)+"\n");










