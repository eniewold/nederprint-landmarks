import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='hervormde-kerk-sprang-sprang-capelle';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[131678.32,409075.42],X_AXIS=[.9703,.2419];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge,axis='x')=>{let s=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);s=plane(s,0,-k,ridge+k*mid)}else{const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;s=plane(s,k,0,ridge-k*mid);s=plane(s,-k,0,ridge+k*mid)}return s};
// Westelijk hoog schip met zijbeuken en lagere oostelijke beuken.
let p=[box(-18.5,-1.4,-10.7,6.4,BASE,9.3),box(-18.5,-1.4,-6.2,1.9,BASE,13.7),gable(-18.5,-1.4,-6.2,1.9,13.7,20.5),box(-1.5,10.9,-9.3,5.1,BASE,7),box(-1.5,10.9,-5.9,1.7,BASE,11.6),gable(-1.5,10.9,-5.9,1.7,11.6,18.1)];
// Aflopende daken boven de vier lagere zijbeuken.
for(const [u0,u1,a,b,eave,inside] of [[-18.5,-1.4,-10.7,-6.15,9.3,13.7],[-18.5,-1.4,1.85,6.4,9.3,13.7],[-1.5,10.9,-9.3,-5.85,7,11.6],[-1.5,10.9,1.65,5.1,7,11.6]]){let q=box(u0,u1,a,b,eave-.1,inside+.1),k=(inside-eave)/(b-a);q=plane(q,0,a<0?k:-k,a<0?eave-k*a:eave+k*b);p.push(q)}
// Het noordtransept heeft een rechte topgevel, het zuidtransept sluit driezijdig.
p.push(box(10.8,19.5,4.9,10.7,BASE,12),gable(10.8,19.5,4.9,10.7,12,17.5,'y'));
const south=[[10,-9.1],[10,-13.2],[12.1,-15.5],[15.5,-15.5],[17.5,-13.1],[17.5,-6.4]];p.push(prism(south,BASE,12),Manifold.hull([...south.map(([x,y])=>[x,y,11.95]),[13.75,-12.5,17],[13.75,-6.4,17]]));
// Driezijdig gesloten koor, met eigen kap.
const ap=[[17.4,-5.5],[25.4,-5.5],[28.3,-2.7],[28.3,-.7],[25.6,1.5],[17.4,1.5]];p.push(prism(ap,BASE,10.5),Manifold.hull([...ap.map(([x,y])=>[x,y,10.45]),[17.3,-2,15.8],[24.5,-2,15.8]]));
// Consistorie en lage traptoren bij de noordelijke kruisarm.
p.push(box(18.2,22.6,1.2,7.0,BASE,9.5),gable(18.2,22.6,1.2,7,9.5,12.0,'y'));
p.push(Manifold.cylinder(12.6,1.4,1.4,8,false).translate([19.4,7.0,BASE]),Manifold.cylinder(2.3,1.4,.45,8,false).translate([19.4,7.0,12.05]));
// Brede vierkante westtoren, korte ingesnoerde spits en vier hoektorentjes.
p.push(box(-28.3,-18.3,-6.3,2.8,BASE,23.3));
p.push(Manifold.cylinder(2.8,6.3,2.1,4,false).rotate([0,0,45]).translate([-23.3,-1.75,23.25]));
p.push(Manifold.cylinder(10.5,1.45,.45,8,false).translate([-23.3,-1.75,26]));
for(const [x,y] of [[-27.7,-5.7],[-27.7,2.2],[-18.9,-5.7],[-18.9,2.2]]) p.push(Manifold.cylinder(24,1.15,1.15,4,false).rotate([0,0,45]).translate([x,y,BASE]),Manifold.cylinder(2.3,1.15,.45,4,false).rotate([0,0,45]).translate([x,y,23.45]));
// Steunberen langs schip en dwarspand.
for(const x of [-17.9,-12.5,-7.3,-2.2])for(const y of [-10.65,6.35])p.push(box(x-.5,x+.5,y<0?y-1:y-.05,y<0?y+.05:y+1,BASE,9.0));
for(const x of [2.1,7])for(const y of [-9.25,5.05])p.push(box(x-.5,x+.5,y<0?y-.8:y-.05,y<0?y+.05:y+.8,BASE,6.8));
for(const [x,y] of [[10.7,10.7],[19.4,10.7],[10,-13],[17.5,-13],[25.4,-5.5],[25.6,1.5]])p.push(box(x-.5,x+.5,y<0?y-.8:y-.05,y<0?y+.05:y+.8,BASE,9.5));
let church=Manifold.union(p);
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.5).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-15.1,-9.9,-4.7])for(const y of [-10.45,6.65])church=church.subtract(arch(x,y,2.8,2,5));
for(const x of [.4,4.6,8.7])for(const y of [-9.05,5.35])church=church.subtract(arch(x,y,2.1,1.6,4));
for(const x of [-26.4,-24.3,-22.3,-20.3])for(const y of [-6.05,3.05])church=church.subtract(arch(x,y,14.6,1.2,6.8));
for(const y of [-4.6,-2.7,-.8,1.1])church=church.subtract(arch(y,0,14.6,1.2,6.8).rotate([0,0,90]).translate([-28.55,0,0]));
church=church.subtract(arch(-1.75,0,.3,2.2,4.2).rotate([0,0,90]).translate([-28.55,0,0]));
church=church.subtract(arch(14.9,10.95,2.8,2.5,6.2));
// De koorgevel heeft herkenbare blinde spitsboognissen.
for(const x of [20.3,23.8])church=church.subtract(arch(x,-5.25,2.1,1.5,5.7));
church=church.subtract(arch(-1.7,0,2.1,1.5,5.7).rotate([0,0,-90]).translate([28.55,0,0]));
const parts=[['building:kerk',church]];
const META={name:'Hervormde Kerk Sprang Sprang-Capelle',origin:ORIGIN,xAxis:X_AXIS,groundHeight:5.28,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0867100000009948'],description:'Middeleeuwse kerk met hoog en laag schip, twee ongelijke kruisarmen, koor en brede westtoren.',realWorld:{groundNapM:5.28,ahn4TopNapM:40.82,ahn5TopNapM:42.11,towerTopM:36.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0867100000009948','https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Sprang','https://monumentenregister.cultureelerfgoed.nl/monumenten/34133','https://www.ahn.nl/dataroom','https://heemkundesprangcapelle.nl/1989/december-2001/bouwgeschiedenis-van-de-ned-herv-kerk-van-sprang']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-sprang-sprang-capelle.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
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





