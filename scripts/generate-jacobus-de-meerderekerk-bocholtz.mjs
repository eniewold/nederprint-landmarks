import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='jacobus-de-meerderekerk-bocholtz';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.6,ORIGIN=[198644.25,314432.75],X_AXIS=[0.903,0.4296],GROUND_NAP=166.7;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z);let mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const roofY=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z);let mid=(x0+x1)/2;v=plane(v,sl,0,z-sl*mid);return plane(v,-sl,0,z+sl*mid)};
// Twin transepts, central nave and roof slabs are independent plane-trimmed volumes.
const nave=roofX(3.7,42.0,-4.5,4.3,18.9,1.3);
const transept1=roofY(19.8,28.4,-11.0,11.1,18.9,1.28);
const transept2=roofY(28.3,41.3,-16.8,16.8,18.8,.89);
let choir=prism([[40.8,-4.2],[42.8,-3.6],[45.1,-.9],[45.1,1.4],[43.3,4.0],[40.8,4.3]],BASE,18.9);choir=plane(choir,0,1.3,18.9);choir=plane(choir,0,-1.3,18.9);choir=plane(choir,-1.3,0,73.7);
let south=box(1.4,19.9,-8.8,-4.3,BASE,9.4);south=plane(south,0,1,14.1);
let north=box(1.2,19.7,4.0,8.3,BASE,9.4);north=plane(north,0,-1,13.4);
let annex=box(40.7,49.1,5.0,16.8,BASE,8.0);annex=plane(annex,0,-.75,17.2);annex=plane(annex,-.75,0,42.0);
const tower=box(-4.2,4.0,-4.7,4.0,BASE,29.5);
let g1=roofX(-4.2,4,-4.7,4.0,35.5,1.35).translate([0,0,0]);
let g2=roofY(-4.2,4,-4.7,4.0,35.5,1.35);
const spire=Manifold.hull([...oct(-.1,-.35,4.4,30.3),...oct(-.1,-.35,.49,57.5)]);
const butt=[];for(const x of [4.9,9.9,15,19.2])for(const side of [-1,1]){let b=box(x-.48,x+.48,side<0?-9.6:7.7,side<0?-8.5:8.8,BASE,7.2);b=plane(b,0,side<0?1:-1,side<0?16.7:15.0);butt.push(b)}
let church=Manifold.union([nave,transept1,transept2,choir,south,north,annex,tower,g1,g2,spire,...butt]);
const cuts=[];for(const x of [5.5,10,14.5,18.6])for(const side of [-1,1])cuts.push(box(x-.68,x+.68,side<0?-9.1:8.0,side<0?-8.5:8.6,2.8,6.5));
for(const x of [21.5,23.8,30.6,33.3,36,39])for(const side of [-1,1]){const y=side<0?(x<28?-11:-16.8):(x<28?11.1:16.8);cuts.push(box(x-.58,x+.58,y-.25,y+.25,3.0,8.8))}
for(const side of [-1,1])cuts.push(box(-1.25,1.25,side<0?-5:3.7,side<0?-4.4:4.3,21.2,27.3));
cuts.push(box(-4.5,-3.9,-1.05,1.05,BASE,4.0),box(-4.5,-3.9,-1.5,1.5,7,12),box(-4.5,-3.9,-1.4,-.25,21,27),box(-4.5,-3.9,.25,1.4,21,27));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Jacobus de Meerderekerk Bocholtz',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0965100000802486'],description:'Neogotische kruisbasiliek met twee dwarsschepen, veelhoekig koor, lagere zijbeuken, sacristie en westtoren met achtkantige spits.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:58},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0965100000802486','https://www.dolmans.com/nieuws/mvl-groep-herstelt-torenspits-van-kerk-in-bocholtz/','https://www.kerkgebouwen-in-limburg.nl/kerken/bocholtz/jacobus-de-meerdere','https://commons.wikimedia.org/wiki/Category:Jacobus_de_Merderekerk_(Bocholtz)','https://service.pdok.nl/rws/ahn/wcs/v1_0']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-jacobus-de-meerderekerk-bocholtz.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


