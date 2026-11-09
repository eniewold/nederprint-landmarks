import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='engelse-kerk-amsterdam';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[121148,486945],X_AXIS=[.96695,.25497];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// De nok ligt aan de noordkant: het zuidelijke dakvlak loopt door over de lagere zijbeuk.
const outline=[[-15.55,-8.94],[5.44,-8.94],[5.44,-5.05],[12.37,-5.05],[12.47,-1.69],[15.2,.04],[12.05,6.18],[-15.55,5.97]];
let body=prism(outline,BASE,16);body=plane(plane(body,0,.91,13.66),0,-1.45,18.38);
let solids=[body];
// De toren van vier geledingen, portaal en steile, ingesnoerde spits.
solids.push(box(-18.63,-13.7,-1.1,4.6,BASE,18.6),box(-18.63,-17.5,-1.1,4.6,BASE,7));
solids.push(Manifold.cylinder(1.2,2.4,1.8,4).rotate([0,0,45]).translate([-16.15,1.75,18.5]));
solids.push(Manifold.cylinder(10.5,1.8,.12,8).translate([-16.15,1.75,19.6]));
// Lage aanbouw bij de koorsluiting op de BAG-contour.
const wing=[[2.5,6],[12.05,6],[11.8,7.4],[2.64,8.96]];
solids.push(prism(wing,BASE,3.4));
const rear=[[12,0],[15.2,.05],[16.6,-.45],[18.4,3.25],[12.05,6.18]];
solids.push(prism(rear,BASE,5.4),Manifold.hull([...rear.map(([x,y])=>[x,y,5.35]),[14.5,2.8,8.2],[16,2.8,8.2]]));
let church=Manifold.union(solids);
const rounded=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[0,1,2,3,4,5,6].map(i=>{let a=Math.PI*i/6;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.6).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-12,-6.5,-1,4.5,10])church=church.subtract(rounded(x,6.28,5.5,1.7,3.3));
for(const x of [-11,-5,1])church=church.subtract(rounded(x,-8.63,1.6,1.5,2.9));
church=church.subtract(rounded(0,0,.1,1.7,3).rotate([0,0,90]).translate([-18.9,1.75,0]));
for(const y of [-.3,2.8])church=church.subtract(rounded(0,0,14,1,2.8).rotate([0,0,90]).translate([-18.9,y,0]));
const parts=[['building:kerk',church]];
const META={name:'Engelse Kerk Amsterdam',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.11,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0363100012168141'],description:'Begijnhofkapel met asymmetrische kap, aangebouwde zuidbeuk en toren met spits.',realWorld:{groundNapM:.11,roofRidgeNapM:15.56,ahn5SpireNapM:30.23},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012168141','https://commons.wikimedia.org/wiki/Category:English_Reformed_Church_(Amsterdam)','https://monumentenregister.cultureelerfgoed.nl/monumenten/384','https://www.ahn.nl/dataroom']};

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





