import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-caeciliakerk-berkel-enschot';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[137555,398848],X_AXIS=[.292,-.956],GROUND_NAP=12.24;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,50));
const loft=(a,b)=>Manifold.hull([...a,...b]);const poly=(x,y,r,z,n=8)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(Math.PI/n+i*2*Math.PI/n),y+r*Math.sin(Math.PI/n+i*2*Math.PI/n),z]);
// Kruisbasiliek met afzonderlijke kappen, zijkapellen en driezijdig koor.
const main=roofed([[.5,-5],[26,-5],[30,-2.5],[30,2.5],[26,5],[.5,5]],[[0,1.3,18],[0,-1.3,18],[-1.3,0,51.8]]);
const transept=roofed([[14,-9],[23,-9],[23,9],[14,9]],[[1.35,0,-6.175],[-1.35,0,43.775]]);
const south=roofed([[1,-8],[14,-8],[14,-4.7],[1,-4.7]],[[0,1,16.2]]);
const north=roofed([[1,4.7],[14,4.7],[14,8],[1,8]],[[0,-1,16.2]]);
// De pastorie en verbindingsgang liggen in hetzelfde te vervangen BAG-pand.
const rectory=roofed([[-21.8,-22.7],[-8,-22.7],[-8,-12],[-21.8,-12]],[[0,1,29],[0,-1,-5.7]]);
const link=box(-8.2,1,-15,-12,BASE,6.8),link2=box(-2,1,-12.2,-7.7,BASE,6.8);
// Vierkante schacht, achthoekige lantaarn en zeskantige naaldspits.
const tower=box(-3.5,3.5,-3.5,3.5,BASE,22.8);
const lantern=loft(poly(0,0,3.35,22.7),poly(0,0,3.35,28));
const spire=loft(poly(0,0,3.15,27.9,6),poly(0,0,.52,47,6));
const solids=[main,transept,south,north,rectory,link,link2,tower,lantern,spire];
for(const x of [-2.7,2.7])for(const y of [-2.7,2.7]){solids.push(box(x-.5,x+.5,y-.5,y+.5,21.8,25.2));solids.push(loft([[x-.5,y-.5,25.1],[x+.5,y-.5,25.1],[x+.5,y+.5,25.1],[x-.5,y+.5,25.1]],[[x-.45,y-.45,27],[x+.45,y-.45,27],[x+.45,y+.45,27],[x-.45,y+.45,27]]));}
solids.push(loft(poly(18.5,0,1.25,17),poly(18.5,0,1.25,19.5)),loft(poly(18.5,0,1.25,19.4),poly(18.5,0,.49,24.5)));
for(const x of [4.2,8,11.8])for(const side of [-1,1]){const y=side<0?-8:8,ext=y+side*.95;solids.push(loft([[x-.48,y-.15,BASE],[x+.48,y-.15,BASE],[x+.48,y+.15,BASE],[x-.48,y+.15,BASE],[x-.48,ext,BASE],[x+.48,ext,BASE]],[[x-.48,y-.15,7],[x+.48,y-.15,7],[x+.48,y+.15,7],[x-.48,y+.15,7],[x-.48,ext,6.05],[x+.48,ext,6.05]]));}
let church=Manifold.union(solids);const cuts=[];
for(const x of [6.1,10])for(const y of [-8,8])cuts.push(box(x-.65,x+.65,y-.35,y+.35,2,5.8));
for(const y of [-9,9])cuts.push(box(17.2,19.8,y-.35,y+.35,3,10));
for(const x of [-3.5,3.5])for(const y of [-1.2,1.2])cuts.push(box(x-.35,x+.35,y-.5,y+.5,15.8,20.4));
for(const y of [-3.5,3.5])for(const x of [-1.2,1.2])cuts.push(box(x-.5,x+.5,y-.35,y+.35,15.8,20.4));
cuts.push(box(-3.8,-3.2,-1,1,BASE,3.5));
for(const x of [-19.5,-16.5,-12.5,-9.5])cuts.push(box(x-.6,x+.6,-23.05,-22.35,1.5,4.5));
cuts.push(box(-15.1,-13.9,-23.05,-22.35,BASE,3));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Caeciliakerk Berkel-Enschot',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0855100000647781'],description:'Neogotische kruisbasiliek met westtoren, dakruiter en aangebouwde pastorie.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:47},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000647781','https://www.ahn.nl/dataroom','https://monumentenregister.cultureelerfgoed.nl/monumenten/526156','https://www.openmonumentendag.nl/wp-content/uploads/2019/01/20-403-RUI-Uitingen-OMD-def-low-5aug_Corr.pdf']};

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




