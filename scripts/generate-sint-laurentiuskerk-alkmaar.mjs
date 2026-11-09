import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-laurentiuskerk-alkmaar';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[112010,516004],X_AXIS=[.371,.92864];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;return plane(plane(s,0,k,ridge-k*mid),0,-k,ridge+k*mid)};
const crossGable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;return plane(plane(s,k,0,ridge-k*mid),-k,0,ridge+k*mid)};
const roof=(p,eave,peaks)=>Manifold.hull([...p.map(([x,y])=>[x,y,eave]),...peaks]);
// Basilicaal schip en koor, lagere zijbeuken en dwarsbeuk met een eigen kap.
let solids=[box(-26,18,-5.5,5.5,BASE,15.3),gable(-26,18,-5.5,5.5,15.25,21.9),box(-26,-6,-10.1,10.1,BASE,7.6),gable(-26,-6,-10.1,10.1,7.55,12),box(-6.3,13.2,-15.5,18.5,BASE,7.8),crossGable(-6.3,13.2,-15.5,18.5,7.75,12),box(-1.2,8.3,-15.5,18.5,BASE,15.4),crossGable(-1.2,8.3,-15.5,18.5,15.35,21.9),box(13,19,-9.5,9.5,BASE,8),gable(13,19,-9.5,9.5,7.95,12)];
// Koor met driezijdige sluiting en lager dak op de sluiting.
const choir=[[17,-5.5],[21,-5.5],[25,-3.2],[26.7,-1.2],[26.7,1.4],[25,3.5],[21,5.5],[17,5.5]];
solids.push(prism(choir,BASE,15.3),roof(choir,15.25,[[17,0,21.9],[21,0,21.9]]));
// Onvoltooide toren aan de voorgevel, met dak en portaal; geen fictieve torenspits.
solids.push(box(-26.6,-23.5,-4.5,4.5,BASE,16.8),gable(-26.6,-23.5,-4.5,4.5,16.75,21.8),box(-30,-26,-3.2,3.8,BASE,5.3),crossGable(-30,-26,-3.2,3.8,5.25,7.3));
// Lage sacristie en aangebouwde delen conform de BAG-plattegrond.
solids.push(box(13.1,27.8,4,12.5,BASE,4.1),box(18,22.5,-12.3,-8.5,BASE,5.1),gable(18,22.5,-12.3,-8.5,5.05,7));
// Dakruiter op de viering; gesloten kern voor printbaarheid.
solids.push(Manifold.cylinder(3,1,1,8).translate([3.5,0,20.8]),Manifold.cylinder(9.5,1,.1,8).translate([3.5,0,23.6]));
for(const x of [-25,-21,-16,-11,-6])for(const y of [-10,10])solids.push(box(x-.45,x+.45,y-.55,y+.55,BASE,8));
for(const x of [-1.2,8.3])for(const y of [-15.2,18.2])solids.push(box(x-.5,x+.5,y-.5,y+.5,BASE,15.5));
let church=Manifold.union(solids);
const pointed=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w*.55],[0,h],[-w/2,h-w*.55]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-23,-18.5,-14,-9.5])for(const y of [-9.7,10.4])church=church.subtract(pointed(x,y,2.4,1.8,4.7));
for(const x of [-23,-18.5,-14,-9.5])for(const y of [-5.2,5.8])church=church.subtract(pointed(x,y,11.3,1.5,3.3));
for(const y of [-15.2,18.8])church=church.subtract(pointed(3.4,y,3,2.3,5.5));
church=church.subtract(pointed(0,0,1,2.7,4.5).rotate([0,0,90]).translate([-30.3,.3,0]));
// De drie karakteristieke roosvensters als ondiepe, gesloten nissen.
for(const y of [-15.15,18.85])church=church.subtract(Manifold.cylinder(.7,2.1,2.1,24).rotate([90,0,0]).translate([3.5,y,12.2]));
church=church.subtract(Manifold.cylinder(.7,2.1,2.1,24).rotate([0,90,0]).translate([-26.9,0,12.4]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Laurentiuskerk Alkmaar',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.55,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0361100000104663'],description:'Cuyperskerk met basilicaal schip, driezijdig koor, dwarsbeuk en dakruiter.',realWorld:{groundNapM:.55,roofRidgeNapM:22.45,ahn5SpireNapM:33.65},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0361100000104663','https://commons.wikimedia.org/wiki/Category:Sint-Laurentiuskerk_(Alkmaar)','https://monumentenregister.cultureelerfgoed.nl/monumenten/7433','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-kerk-oisterwijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
for(const piece of pieces)console.log('piece',JSON.stringify(piece.boundingBox()),piece.volume());
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





