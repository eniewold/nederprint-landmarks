import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-antonius-abtkerk-mook';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.6,ORIGIN=[189098.3,418085.8],X_AXIS=[.93,.367],GROUND_NAP=12.5;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const roofY=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(x0+x1)/2;v=plane(v,sl,0,z-sl*mid);return plane(v,-sl,0,z+sl*mid)};
const nave=roofX(2.5,22.9,-4.1,4.9,14.1,1.25);
const transept1=roofY(6.8,10.7,-10.4,11.0,14.1,1.5),transept2=roofY(10.4,15.3,-11.2,11.6,14.1,1.2);
let choir=prism([[21.2,-3.8],[23.8,-3.8],[26,-1.5],[26,2.5],[23.8,4.7],[21.2,4.7]],BASE,13.8);choir=plane(choir,0,1.25,13.24);choir=plane(choir,0,-1.25,14.36);choir=plane(choir,-1.2,0,44.0);
let south=plane(box(2.3,6.9,-7.6,-3.7,BASE,11.1),0,.8,14.0),north=plane(box(2.3,6.9,4.4,7.5,BASE,11.1),0,-.8,14.6);
let s2=plane(box(14.3,19.4,-7.6,-3.7,BASE,11.2),0,.8,14.2),n2=plane(box(14.3,19.4,4.4,7.6,BASE,11.2),0,-.8,14.7);
const tower=box(-2.8,2.9,-3.2,3.1,BASE,14.5);
// De twee geledingen van de middeleeuwse toren hebben schuine, printbare lijsten.
const belt=z=>Manifold.hull([[-2.8,-3.2,z],[2.9,-3.2,z],[2.9,3.1,z],[-2.8,3.1,z],[-3.15,-3.55,z+.4],[3.25,-3.55,z+.4],[3.25,3.45,z+.4],[-3.15,3.45,z+.4]]);
// Ingesnoerde, achthoekige spits met uitlopend dak, AHN5 toont de top.
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const flare=Manifold.hull([...oct(3.45,14.4),...oct(2.2,15.6)]),spire=Manifold.hull([...oct(2.2,15.55),...oct(.49,26.7)]);
const butt=[];for(const x of [7.2,10.4,14.8])for(const side of [-1,1]){const y=side<0?(x<8?-10.4:-11.2):(x<8?11:11.6);let b=box(x-.48,x+.48,y-.6,y+.6,BASE,7.1);b=plane(b,0,side<0?1:-1,side<0?18.1:18.5);butt.push(b)}
let church=Manifold.union([nave,transept1,transept2,choir,south,north,s2,n2,tower,belt(6.3),belt(10),flare,spire,...butt]);
const cuts=[];for(const x of [8.8,12.8])for(const y of [-11.2,11.6])cuts.push(box(x-.7,x+.7,y-.35,y+.35,2.6,8.6));
for(const x of [4.5,16.4])for(const side of [-1,1]){let y=side*7.55;cuts.push(box(x-.55,x+.55,y-.4,y+.4,2.6,7.2));}
for(const x of [-1.2,1.2])for(const y of [-3.2,3.1])cuts.push(box(x-.5,x+.5,y-.3,y+.3,11,13.7));
for(const y of [-1.1,1.1])cuts.push(box(-3.1,-2.5,y-.5,y+.5,11,13.7));
for(const y of [-1.5,0,1.5])cuts.push(box(-3.2,-2.45,y-.5,y+.5,7.2,9.2));
cuts.push(box(-3.1,-2.5,-1,1,BASE,3.6));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Antonius Abtkerk Mook',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0944100000200554'],description:'Kerk met dubbel dwarsschip, driezijdig koor en middeleeuwse toren met ingesnoerde spits.',realWorld:{groundNapM:GROUND_NAP,spireHeightM:26.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0944100000200554','https://www.ahn.nl/dataroom','https://monumentenregister.cultureelerfgoed.nl/monumenten/30073','https://commons.wikimedia.org/wiki/Category:Antonius_Abtkerk,_Mook']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-antonius-abtkerk-mook.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


