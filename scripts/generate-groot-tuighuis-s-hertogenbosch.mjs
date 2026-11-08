import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='groot-tuighuis-s-hertogenbosch';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[149890,410924],X_AXIS=[.9999,.012],GROUND_NAP=5.64;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,35));
// Verhoogd middenschip met langskap en driezijdige koorsluiting.
const main=roofed([[-29.7,-5.1],[24,-5.1],[27.6,-3],[28,-1.5],[28,1],[27,3],[24,5],[-29.7,5]],[[0,1.1,23.5],[0,-1.1,23.5],[-1.1,0,49.9]]);
// Lagere zijbeuken met lessenaarsdak langs het schip.
const south=roofed([[-29.7,-10.8],[9.6,-10.8],[9.6,-4.8],[-29.7,-4.8]],[[0,1,20.3]]);
const north=roofed([[-29.7,4.8],[9.6,4.8],[9.6,10.4],[-29.7,10.4]],[[0,-1,20.3]]);
const loft=(a,b)=>Manifold.hull([...a,...b]);const solids=[main,south,north];
for(const x of [-23.5,-17.8,-12,-6.3,-.5])for(const side of [-1,1]){const y=side<0?-10.8:10.4,ext=y+side*.95;solids.push(loft([[x-.48,y-.15,BASE],[x+.48,y-.15,BASE],[x+.48,y+.15,BASE],[x-.48,y+.15,BASE],[x-.48,ext,BASE],[x+.48,ext,BASE]],[[x-.48,y-.15,9.2],[x+.48,y-.15,9.2],[x+.48,y+.15,9.2],[x-.48,y+.15,9.2],[x-.48,ext,8.25],[x+.48,ext,8.25]]));}
for(const x of [12.8,17.1,21.2,24])for(const side of [-1,1]){const y=side<0?-5.1:5,ext=y+side*1.3;solids.push(loft([[x-.5,y-.15,BASE],[x+.5,y-.15,BASE],[x+.5,y+.15,BASE],[x-.5,y+.15,BASE],[x-.5,ext,BASE],[x+.5,ext,BASE]],[[x-.5,y-.15,17.2],[x+.5,y-.15,17.2],[x+.5,y+.15,17.2],[x-.5,y+.15,17.2],[x-.5,ext,15.9],[x+.5,ext,15.9]]));}
let church=Manifold.union(solids);const cuts=[];
for(const x of [14.8,19.2,22.6])for(const y of [-5.1,5])for(const z of [2.3,6,9.6,13.2])cuts.push(box(x-.65,x+.65,y-.35,y+.35,z,z+2.2));
cuts.push(Manifold.cylinder(.8,.95,.95,16).rotate([0,90,0]).translate([-30.1,0,18.6]));
for(const x of [-26.5,-20.6,-14.9,-9.1,-3.4,3,7])for(const y of [-10.8,10.4]){cuts.push(box(x-.9,x+.9,y-.35,y+.35,2.2,5.0),box(x-.9,x+.9,y-.35,y+.35,6.3,8.8));}
for(const x of [-26,-20.4,-14.7,-9,-3.3,2.4,8,13.7,19.5])for(const y of [-5.1,5])cuts.push(box(x-.6,x+.6,y-.35,y+.35,16.2,18.1));
cuts.push(box(-30,-29.4,-1.5,1.5,BASE,3.1));
for(const y of [-6,-3,0,3,6])cuts.push(box(-30,-29.4,y-.7,y+.7,5,8.4));
for(const y of [-1.8,0,1.8])cuts.push(box(-30,-29.4,y-.5,y+.5,11,13.5));
church=church.subtract(Manifold.union(cuts));const parts=[['building:tuighuis',church]];
const META={name:"Groot Tuighuis 's-Hertogenbosch",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0796100000227151'],description:'Voormalige Sint-Jacobskerk met basilicale doorsnede en driezijdige koorsluiting.',realWorld:{groundNapM:GROUND_NAP,ridgeHeightM:23.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0796100000227151','https://www.ahn.nl/dataroom','https://www.erfgoedshertogenbosch.nl/verhalen/geschiedenis-van-het-groot-tuighuis','https://monumentenregister.cultureelerfgoed.nl/monumenten/21585']};

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




