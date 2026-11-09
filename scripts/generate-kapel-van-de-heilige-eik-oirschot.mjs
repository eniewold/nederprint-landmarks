import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='kapel-van-de-heilige-eik-oirschot';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[146486.1,390410.54],X_AXIS=[.993,.115];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge,axis='x')=>{let s=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);s=plane(s,0,-k,ridge+k*mid)}else{const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;s=plane(s,k,0,ridge-k*mid);s=plane(s,-k,0,ridge+k*mid)}return s};
const profileX=(pts,x0,x1)=>Manifold.extrude(new CrossSection([pts]),x1-x0).transform([0,1,0,0,0,0,1,0,1,0,0,0,x0,0,0,1]);
// Schip en driezijdige sluiting; zadeldak opgebouwd uit vlakken.
let p=[box(-7.5,7.25,-2.15,4.18,BASE,4.2),gable(-7.5,7.25,-2.15,4.18,4.2,7.25)];
const ap=[[7.1,-1.75],[7.3,-1.75],[8.6,-.1],[8.6,2],[7.3,3.74],[7.1,3.74]];p.push(prism(ap,BASE,4.2));p.push(Manifold.hull([...ap.map(([x,y])=>[x,y,4.1]),[7.1,.95,7.25],[7.2,.95,7.25],[7.2,1.05,7.25],[7.1,1.05,7.25]]));
// Voorkant is een enkel profiel met zes verspringende treden.
const stair=[[-2.7,0],[4.75,0],[4.75,4.4],[3.65,4.4],[3.65,5.3],[2.6,5.3],[2.6,6.2],[1.55,6.2],[1.55,7.1],[.5,7.1],[.5,6.2],[-.6,6.2],[-.6,5.3],[-1.7,5.3],[-1.7,4.4],[-2.7,4.4]];p.push(profileX(stair,-7.55,-6.6));
let church=Manifold.union(p);
// Drie open galerijbogen: op schaal verbrede stijlen en 45-graden bovenzijde.
for(const v of [-1.25,1,3.25]){const w=1.05;const hole=[[v-w/2,-.6],[v+w/2,-.6],[v+w/2,2.5],[v,3.025],[v-w/2,2.5]];church=church.subtract(profileX(hole,-7.7,-5.5));}
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.6).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-3.8,-1.3,1.2,3.7,6])for(const y of [-1.9,4.68])church=church.subtract(arch(x,y,1.9,.95,1.7));
const parts=[['building:kapel',church]];
const META={name:'Kapel van de Heilige Eik Oirschot',origin:ORIGIN,xAxis:X_AXIS,groundHeight:14.1,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0823100000005517'],description:'Kapel met trapgevel, open portaal en driezijdig koor.',realWorld:{groundNapM:14.1,bagAreaM2:92.54,ridgeM:7.25},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0823100000005517','https://commons.wikimedia.org/wiki/Category:Kapel_van_de_Heilige_Eik,_Oirschot','https://monumentenregister.cultureelerfgoed.nl/monumenten/31352','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kapel-van-de-heilige-eik-oirschot.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
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





