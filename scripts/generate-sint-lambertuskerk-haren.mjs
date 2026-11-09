import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-lambertuskerk-haren';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[168671.5,423358.75],X_AXIS=[.999,-.048];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge),k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);return plane(s,0,-k,ridge+k*mid)};
// Pseudobasiliek onder breed zadeldak met driezijdige koorsluiting.
let p=[box(2.8,28.5,-6.2,6.2,BASE,8.5),gable(2.8,28.5,-6.2,6.2,8.5,16.1)];
let cp=[[28.3,-6.2],[29.2,-5.4],[31.3,-3.3],[32.5,-1.8],[32.5,1.7],[31.3,3.3],[29.1,5.4],[28.3,6.2]];
p.push(prism(cp,BASE,8.5));p.push(Manifold.hull([...cp.map(([x,y])=>[x,y,8.4]),[28.2,-.1,16.1],[29,-.1,16.1],[29,.1,16.1],[28.2,.1,16.1]]));
// Oude vierkante westtoren, slanke ingesnoerde achtkantige spits.
p.push(box(-3,3,-3,3,BASE,22.6));
p.push(Manifold.cylinder(1.0,3.8,3.0,8,false).translate([0,0,22.45]));
p.push(Manifold.cylinder(17.7,3.0,.5,8,false).translate([0,0,23.4]));
// Kleine aanbouwen tegen het koor; lage muren en zadeldaken.
p.push(box(23.4,29.1,6,8.3,BASE,4.5),gable(23.4,29.1,6,8.3,4.5,5.1));
p.push(box(23.4,29.5,-7.1,-6,BASE,4.9),gable(23.4,29.5,-7.1,-6,4.9,5.3));
// Regelmatige steunberen langs het schip.
for(const x of [3.1,7,11,15,19,23,27])for(const sign of [-1,1]){const y=sign*6.1;let b=box(x-.48,x+.48,Math.min(y,sign*7.1),Math.max(y,sign*7.1),BASE,7.2);p.push(b)}
// Eén zichtbare dakkapel en een kleine schoorsteen bij het koor.
let d=box(12,13.1,3.4,4.5,10.5,12.7);d=plane(d,1,0,12.7-12.55);d=plane(d,-1,0,12.7+12.55);p.push(d,box(27.4,28.4,-.45,.45,15.6,17));
let church=Manifold.union(p);
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5,9,13,17,21,25])for(const y of [-5.9,6.5])church=church.subtract(arch(x,y,2,1.2,4.5));
for(const x of [-1.3,1.3])for(const y of [-2.7,3.3])church=church.subtract(arch(x,y,15,1,4.5));
for(const y of [-1.3,1.3])church=church.subtract(arch(0,0,15,1,4.5).rotate([0,0,90]).translate([-3.3,y,0]));
church=church.subtract(arch(0,0,5,1.4,6).rotate([0,0,90]).translate([-3.3,0,0]));
church=church.subtract(arch(0,0,BASE,1.8,3.3).rotate([0,0,90]).translate([-3.3,0,0]));
church=church.subtract(arch(0,0,3,1.3,5).rotate([0,0,90]).translate([32.2,0,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Lambertuskerk Haren',origin:ORIGIN,xAxis:X_AXIS,groundHeight:7.468,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0828100001486273'],description:'Pseudobasiliek met westtoren en veelhoekige koorsluiting.',realWorld:{groundNapM:7.468,ahn4TopNapM:48.6,ahn5TopNapM:46.34},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001486273','https://commons.wikimedia.org/wiki/Category:Lambertuskerk_(Haren)','https://monumentenregister.cultureelerfgoed.nl/monumenten/28515','https://service.pdok.nl/rws/ahn/wcs/v1_0']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-lambertuskerk-haren.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





