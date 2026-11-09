import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='garnizoenskerk-ravenstein';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[173277,423142],X_AXIS=[.782,.623];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge,axis='x')=>{let s=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);s=plane(s,0,-k,ridge+k*mid)}else{const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;s=plane(s,k,0,ridge-k*mid);s=plane(s,-k,0,ridge+k*mid)}return s};
// Eenbeukig schip met zadeldak en polygonale koorsluiting.
let p=[box(-9.4,6.5,-6.45,6.9,BASE,6.8),gable(-9.4,6.5,-6.45,6.9,6.8,15)];
const ap=[[6.2,-6.45],[8.5,-6.45],[10.5,-3],[11,0],[10.5,3],[8.5,6.9],[6.2,6.9]];p.push(prism(ap,BASE,6.8));p.push(Manifold.hull([...ap.map(([x,y])=>[x,y,6.7]),[6.2,.15,15],[7,.15,15],[7,.25,15],[6.2,.25,15]]));
// Zichtbare steunberen en brede pilasters van de blinde voorgevel.
for(const x of [-7.8,-4.4,-1,2.4,5.8])for(const y of [-6.4,6.85])p.push(box(x-.46,x+.46,Math.min(y,y*1.14),Math.max(y,y*1.14),BASE,6.7));
for(const y of [-6.4,-2.25,2.3,6.85])p.push(box(-10.35,-9.2,y-.48,y+.48,BASE,7));
// Printbare opengewerkte dakruiter als massieve kern en afgeronde kap.
p.push(Manifold.cylinder(3.6,1.05,1.05,8,false).translate([.3,.2,14.5]));p.push(Manifold.cylinder(2,1.05,.45,8,false).translate([.3,.2,18]));
let church=Manifold.union(p);
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.6).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-6,-2.6,.8,4.2])for(const y of [-6.2,7.4])church=church.subtract(arch(x,y,2,1.8,4.3));
for(const v of [-4.35,0,4.5])church=church.subtract(arch(v,0,2.1,2.6,6).rotate([0,0,90]).translate([-9.5,0,0]));
church=church.subtract(arch(0,0,1,1.5,2.7).rotate([0,0,90]).translate([-9.5,0,0]));
church=church.subtract(arch(0,0,2,1.8,4).rotate([0,0,-99.5]).translate([10.85,-1.55,0]));
church=church.subtract(arch(0,0,2,1.8,4).rotate([0,0,-80.5]).translate([10.85,1.55,0]));
const parts=[['building:kerk',church]];
const META={name:'Garnizoenskerk Ravenstein',origin:ORIGIN,xAxis:X_AXIS,groundHeight:8.6,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0828100001484074'],description:'Eenbeukige garnizoenskerk met blinde voorgevelramen, dakruiter en koorsluiting.',realWorld:{groundNapM:8.6,ahn4TopNapM:28.07,ahn5TopNapM:29.48,towerTopM:20},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001484074','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Ravenstein','https://monumentenregister.cultureelerfgoed.nl/monumenten/32365','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-garnizoenskerk-ravenstein.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
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





