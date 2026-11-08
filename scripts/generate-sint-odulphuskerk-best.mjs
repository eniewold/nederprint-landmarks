import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-odulphuskerk-best';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[155287,391391.5],X_AXIS=[.45,-.893],GROUND_NAP=15.91;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,70));
const loft=(a,b)=>Manifold.hull([...a,...b]);const poly=(x,y,r,z,n=8)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(Math.PI/n+i*2*Math.PI/n),y+r*Math.sin(Math.PI/n+i*2*Math.PI/n),z]);
// Middenschip en koor, lage zijbeuken en kruisarmen met eigen dakvlakken.
const main=roofed([[4,-6],[54,-6],[58,-3],[58,2.5],[54,5],[4,5]],[[0,1.4,25.1],[0,-1.4,23.7],[-1.4,0,99.9]]);
const left=roofed([[4,-11.8],[31,-11.8],[31,-5.7],[4,-5.7]],[[0,.55,18.4]]);
const right=roofed([[4,4.7],[31,4.7],[31,10.9],[4,10.9]],[[0,-.55,17.9]]);
const transept=roofed([[31,-16],[41,-16],[41,13],[31,13]],[[1.4,0,-26.1],[-1.4,0,74.7]]);
const choirLeft=roofed([[41,-10.2],[55,-10.2],[55,-5.7],[41,-5.7]],[[0,.55,18.4]]);
const choirRight=roofed([[41,4.7],[55,4.7],[55,9],[41,9]],[[0,-.55,17.9]]);
// Vierkante westtoren; lantaarn/spits en vier hoekpinakels.
const tower=box(-5.6,5.1,-5.5,6,BASE,37);
const spire=loft(poly(-.25,.25,4.7,36.9),poly(-.25,.25,.49,64.6));
const solids=[main,left,right,transept,choirLeft,choirRight,tower,spire];
for(const x of [-5.4,4.9])for(const y of [-5.3,5.8])solids.push(box(x-.6,x+.6,y-.6,y+.6,BASE,36.5));
for(const x of [-4.8,4.3])for(const y of [-4.7,5.2]){solids.push(box(x-.55,x+.55,y-.55,y+.55,35.5,38.8));solids.push(loft([[x-.55,y-.55,38.7],[x+.55,y-.55,38.7],[x+.55,y+.55,38.7],[x-.55,y+.55,38.7]],[[x-.45,y-.45,40.5],[x+.45,y-.45,40.5],[x+.45,y+.45,40.5],[x-.45,y+.45,40.5]]));}
solids.push(loft(poly(36,-.5,1.35,23),poly(36,-.5,1.35,26)),loft(poly(36,-.5,1.35,25.9),poly(36,-.5,.49,31.5)));
for(const x of [9,14,19,24,29])for(const side of [-1,1]){let y=side<0?-11.8:10.9,ext=y+side*.95;solids.push(loft([[x-.5,y-.15,BASE],[x+.5,y-.15,BASE],[x+.5,y+.15,BASE],[x-.5,y+.15,BASE],[x-.5,ext,BASE],[x+.5,ext,BASE]],[[x-.5,y-.15,10],[x+.5,y-.15,10],[x+.5,y+.15,10],[x-.5,y+.15,10],[x-.5,ext,9.05],[x+.5,ext,9.05]]));}
let church=Manifold.union(solids);const cuts=[];
for(const x of [11.5,16.5,21.5,26.5])for(const y of [-11.8,10.9])cuts.push(box(x-.8,x+.8,y-.35,y+.35,2.5,8));
for(const y of [-16,13])cuts.push(box(34.4,37.6,y-.35,y+.35,4,15));
for(const x of [-5.6,5.1])for(const y of [-2,2])cuts.push(box(x-.35,x+.35,y-.75,y+.75,26,34));
for(const y of [-5.5,6])for(const x of [-2,2])cuts.push(box(x-.75,x+.75,y-.35,y+.35,26,34));
cuts.push(box(-5.95,-5.25,-1.5,1.5,BASE,4.5));
for(const y of [-1.4,1.4])cuts.push(box(57.65,58.35,y-.65,y+.65,3.5,12));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Odulphuskerk Best',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0753100000002070'],description:'Neogotische kruisbasiliek met toren, achthoekige spits en dakruiter.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:64.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0753100000002070','https://www.ahn.nl/dataroom','https://www.sbodulphus.nl/index.php?cat=5&site=www.sbodulphus.nl&subcat=39','https://monumentenregister.cultureelerfgoed.nl/monumenten/512321']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-voormalige-hervormde-kerk-stevensweert.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));




