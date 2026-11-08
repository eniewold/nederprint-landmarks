import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='martinuskerk-s-gravenmoer';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[123939.6,407767.9],X_AXIS=[.996,.089],GROUND_NAP=2.0;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,35));
// Laatgotisch schip en lager, driezijdig afgesloten koor: vlakke zadeldaken.
const nave=roofed([[-2,-6.3],[25.2,-6.3],[25.2,6.3],[-2,6.3]],[[0,1,15.3],[0,-1,15.3]]);
const choir=roofed([[24.8,-5],[33,-5],[37,-2.3],[37,2.3],[33,5],[24.8,5]],[[0,1.35,15.3],[0,-1.35,15.3],[-1.35,0,60.1]]);
const tower=box(-2.8,2.8,-2.8,2.8,BASE,20.4);
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const loft=(a,b)=>Manifold.hull([...a,...b]);
const roof=loft(oct(0,0,2.75,20.35),oct(0,0,.49,29.4));
const solids=[nave,choir,tower,roof];
// De steunberen zijn tot de grond doorgetrokken en bovenaan schuin afgewerkt.
for(const x of [4.8,9.9,15,20.1,25]) for(const side of [-1,1]){const y=6.3*side,ext=y+side*.95;solids.push(loft([[x-.48,y-.15,BASE],[x+.48,y-.15,BASE],[x+.48,y+.15,BASE],[x-.48,y+.15,BASE],[x-.48,ext,BASE],[x+.48,ext,BASE]],[[x-.48,y-.15,8.4],[x+.48,y-.15,8.4],[x+.48,y+.15,8.4],[x-.48,y+.15,8.4],[x-.48,ext,7.45],[x+.48,ext,7.45]]));}
// Aanbouw aan het koor, met lessenaarsdak.
solids.push(roofed([[19,-8.4],[25,-8.4],[25,-5.8],[19,-5.8]],[[0,1,14.8]]));
let church=Manifold.union(solids);
const cuts=[];for(const x of [7.3,12.4,17.5,22.5])for(const y of [-6.3,6.3])if(!(x===22.5 && y<0))cuts.push(box(x-.85,x+.85,y-.32,y+.32,2.6,7.4));
for(const x of [-2.8,2.8])for(const y of [-1,1])cuts.push(box(x-.32,x+.32,y-.5,y+.5,15.3,18.5));
for(const y of [-2.8,2.8])for(const x of [-1,1])cuts.push(box(x-.5,x+.5,y-.32,y+.32,15.3,18.5));
cuts.push(box(36.65,37.35,-.75,.75,2.8,8.2));
for(const side of [-1,1])cuts.push(box(-.5,.5,-.7,.7,2.8,8.2).rotate([0,0,side*56]).translate([35,side*3.65,0]));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:"Martinuskerk 's Gravenmoer",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0766100000009313'],description:'Gotisch schip en koor met vierkante westtoren en achtkantige spits.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:29.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0766100000009313','https://www.ahn.nl/dataroom','https://monumentenregister.cultureelerfgoed.nl/monumenten/18148','https://commons.wikimedia.org/wiki/Category:Exterior_of_Martinuskerk_(%27s_Gravenmoer)']};

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





