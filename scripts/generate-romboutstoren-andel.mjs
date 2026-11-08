import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='romboutstoren-andel';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[131978.3,421748.05],X_AXIS=[.985,.174],GROUND_NAP=2.2;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const loft=(a,b)=>Manifold.hull([...a,...b]);
// Vierkante torenschacht en gemetselde vierkante spits: vlakke bouwdelen.
const tower=box(-2.25,2.25,-2.35,2.35,BASE,15.2);
const roof=loft([[-2.15,-2.25,15.15],[2.15,-2.25,15.15],[2.15,2.25,15.15],[-2.15,2.25,15.15]],[[-.45,-.45,23.5],[.45,-.45,23.5],[.45,.45,23.5],[-.45,.45,23.5]]);
// Overgebleven muur van de verwoeste kerk, oplopend naar de toren.
const ruin=loft([[2,-2.35,BASE],[9,-2.35,BASE],[9,-1.4,BASE],[2,-1.4,BASE]],[[2,-2.35,9.8],[2,-1.4,9.8],[9,-2.35,4],[9,-1.4,4]]);
let church=Manifold.union([tower,roof,ruin]);const cuts=[];
// Schijnvensters op de klokgeleding en de schacht, 0,3 m diep en minstens 0,9 m breed.
for(const x of [-2.25,2.25])for(const y of [-.65,.65])cuts.push(box(x-.35,x+.35,y-.48,y+.48,11,13.8));
for(const y of [-2.35,2.35])for(const x of [-.65,.65])cuts.push(box(x-.48,x+.48,y-.35,y+.35,11,13.8));
for(const x of [-2.25,2.25])cuts.push(box(x-.35,x+.35,-.48,.48,6.8,9.7));
for(const y of [-2.35,2.35])cuts.push(box(-.48,.48,y-.35,y+.35,6.8,9.7));
cuts.push(box(-2.6,-2,-.6,.6,BASE,2.8));
// De herkenbare wijzerplaat is een ondiep rond veld boven de galmgaten.
for(const side of [-1,1]){cuts.push(Manifold.cylinder(.7,.6,.6,16).rotate([0,90,0]).translate([side<0?-2.6:1.9,0,14.4]));cuts.push(Manifold.cylinder(.7,.6,.6,16).rotate([-90,0,0]).translate([0,side<0?-2.7:2.0,14.4]));}
church=church.subtract(Manifold.union(cuts));const parts=[['building:toren',church]];
const META={name:'Romboutstoren Andel',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0874100000007662'],description:'Vrijstaande laatmiddeleeuwse toren met bakstenen spits en ruïnemuur.',realWorld:{groundNapM:GROUND_NAP,topHeightM:23.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0874100000007662','https://www.ahn.nl/dataroom','https://monumentenregister.cultureelerfgoed.nl/monumenten/39622','https://www.tankens.nl/over-tankens/actueel/romboutstoren-andel']};

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




