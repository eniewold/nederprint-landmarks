import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='theaterkerk-wadway-spanbroek';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[127540,522825],X_AXIS=[.99965,-.0264];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;return plane(plane(s,0,k,ridge-k*mid),0,-k,ridge+k*mid)};
const crossGable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;return plane(plane(s,k,0,ridge-k*mid),-k,0,ridge+k*mid)};
const roof=(p,eave,peaks)=>Manifold.hull([...p.map(([x,y])=>[x,y,eave]),...peaks]);
// Historisch schip en hoger, rechtgesloten koor met afzonderlijke daken.
const solids=[];
solids.push(box(-7.44,2.64,-3.66,3.96,BASE,5.2),gable(-7.44,2.64,-3.66,3.96,5.15,9.52));
const cp=[[2.55,-3.66],[11.94,-3.66],[12.27,3.96],[2.55,3.96]];
solids.push(prism(cp,BASE,6.1),roof(cp,6.05,[[2.55,.08,10.65],[8.56,.08,10.65]]));
solids.push(box(12,14.05,.8,3.46,BASE,3.8),gable(12,14.05,.8,3.46,3.75,4.95));
for(const x of [3.1,6.25,9.4,11.8])for(const y of [-3.7,4])solids.push(box(x-.46,x+.46,y-.75,y+.75,BASE,5.4));
// Vierkante toren met zeer laag piramidedak; windvaan wordt weggelaten.
solids.push(box(-11.1,-7.42,-2.03,2.34,BASE,15.18));
solids.push(roof([[-11.1,-2.03],[-7.42,-2.03],[-7.42,2.34],[-11.1,2.34]],15.13,[[-9.26,.15,16.4]]));
// Foyer uit 2022 op gedraaid rechthoekig grondplan, met schilddak en lage glazen gang.
const fp=[[-12.55,10.44],[-2.87,21.55],[2,17.25],[-7.68,6.14]];
const footprint=[[-3.85,4.0],[-1.24,4.36],[-5.81,8.39],[2,17.25],[-2.87,21.55],[-12.55,10.44],[-9.95,8.17],[-9.32,8.9]];
const foyer=Manifold.union([prism(fp,BASE,4.13),roof(fp,4.08,[[-10.115,8.29,7.34],[-2.8,17.8,7.34]])]).intersect(prism(footprint,BASE-.1,12));
solids.push(box(-3.9,-1.1,3.7,4.5,BASE,3.9),foyer,prism([[-9.95,8.17],[-9.32,8.9],[-3.85,4],[-1.24,4.36],[-5.81,8.39],[-7.68,6.14]],BASE,3.9));
let church=Manifold.union(solids);
const pointed=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w*.55],[0,h],[-w/2,h-w*.55]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-2.7,4.65,7.8,10.9])for(const y of [-3.31,4.31])church=church.subtract(pointed(x,y,2.1,1.5,3));
for(const y of [-1,1])for(const z of [8,11.5])church=church.subtract(pointed(0,0,z,1,2.5).rotate([0,0,90]).translate([-11.45,y,0]));
church=church.subtract(pointed(0,0,.1,1.25,2.5).rotate([0,0,90]).translate([-11.45,0,0]));
// Glaspanelen aan de lange zijde en de kopgevel zijn ondiepe, gesloten nissen.
const glass=(a,b,t,w)=>{const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;return box(-w/2,w/2,-.35,.35,.45,3.4).rotate([0,0,ang]).translate([x,y,0])};
for(const t of [.12,.23,.34])church=church.subtract(glass([-12.55,10.44],[-2.87,21.55],t,1.25));
for(const t of [.2,.75])church=church.subtract(glass([-2.87,21.55],[2,17.25],t,1.4));
const parts=[['building:kerk',church]];
const META={name:'Theaterkerk Wadway Spanbroek',origin:ORIGIN,xAxis:X_AXIS,groundHeight:-.014,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0432100000000295'],description:'Laatgotische theaterkerk met laag bekroonde toren en gedraaide moderne foyer.',realWorld:{groundNapM:-.014,shipRidgeNapM:9.5,choirRidgeNapM:10.65,towerRoofNapM:16.4,foyerRidgeNapM:7.34},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0432100000000295','https://commons.wikimedia.org/wiki/Category:Wadway_Theaterchurch','https://studioarchitectura.nl/portfolio-item/langebuurt-4-3-3/','https://witwognum.nl/projecten/uitbreiding-foyer-theaterkerk-wadway/','https://monumentenregister.cultureelerfgoed.nl/monumenten/31802','https://www.ahn.nl/dataroom']};

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





