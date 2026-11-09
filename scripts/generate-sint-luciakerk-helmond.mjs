import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-luciakerk-helmond';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[172158.25,386476.25],X_AXIS=[-.954,-.317];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge,axis='x')=>{let s=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);s=plane(s,0,-k,ridge+k*mid)}else{const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;s=plane(s,k,0,ridge-k*mid);s=plane(s,-k,0,ridge+k*mid)}return s};
// Schip en koor; lagere zijbeuken met lessenaarsdaken en dwarsschip.
let p=[box(3.4,41.5,-4.2,4.2,BASE,13.8),gable(3.4,41.5,-4.2,4.2,13.8,20.2)];
for(const [a,b] of [[-8.2,-4.1],[4.1,8.2]]){p.push(box(3.1,24,a,b,BASE,7));let r=box(3.1,24,a,b,6.9,9.6),k=2.6/(b-a);r=plane(r,0,a<0?k:-k,a<0?7-k*a:7+k*b);p.push(r)}
p.push(box(23,31,-13.7,13.7,BASE,14.1),gable(23,31,-13.7,13.7,14.1,21.0,'y'));
let cp=[[41.3,-4.3],[43.3,-4.1],[45.7,-1.3],[45.7,1.3],[43.3,4.1],[41.3,4.3]];p.push(prism(cp,BASE,13.8));p.push(Manifold.hull([...cp.map(([x,y])=>[x,y,13.7]),[41.2,-.08,20.2],[42.1,-.08,20.2],[42.1,.08,20.2],[41.2,.08,20.2]]));
// Lage kooromgang en kapellen aan weerskanten van de veelhoekige sluiting.
let ap=[[40,-6.8],[44,-6.8],[47,-4.8],[48,-2],[48,2],[47,4.8],[44,6.8],[40,6.8]];p.push(prism(ap,BASE,6.8));
for(const [a,b] of [[-10.8,-6.5],[6.5,10.8]]){p.push(box(38,44.5,a,b,BASE,5.5),gable(38,44.5,a,b,5.5,9.7,'y'))}
// Diagonale schoren zijn volledig verbonden met de onderbouw, zonder vrij zwevende delen.
for(const sign of [-1,1])for(const x of [39,43]){const y1=sign*4,y2=sign*7;let brace=Manifold.hull([[x-.5,y1-.5,12.8],[x+.5,y1-.5,12.8],[x+.5,y1+.5,12.8],[x-.5,y1+.5,12.8],[x-.5,y2-.5,6.3],[x+.5,y2-.5,6.3],[x+.5,y2+.5,6.3],[x-.5,y2+.5,6.3]]);p.push(brace)}
// Vierkante toren met borstwering en hoekpinakels; gesloten voor 1:1000.
p.push(box(-4,4,-4,4,BASE,28.0));for(const x of [-3.5,3.5])for(const y of [-3.5,3.5])p.push(box(x-.5,x+.5,y-.5,y+.5,BASE,29.3));
p.push(Manifold.cylinder(25,3.5,.5,8,false).translate([0,0,28.0]));
// Vieringruiter en koordakkapellen, als gesloten printbare delen.
p.push(Manifold.cylinder(2,1,1,8,false).translate([27,0,19.5]),Manifold.cylinder(9.8,1,.5,8,false).translate([27,0,21.4]));
for(const x of [10,16,35])for(const y of [-2.5,2.5]){let d=box(x-.6,x+.6,y-.6,y+.6,15,17);d=plane(d,1,0,17-x);d=plane(d,-1,0,17+x);p.push(d)}
for(const x of [7,11.5,16,20.5])for(const y of [-8.1,8.1])p.push(box(x-.5,x+.5,Math.min(y,y*.9),Math.max(y,y*.9),BASE,7));
let church=Manifold.union(p);
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [9,13.5,18,22])for(const y of [-7.9,8.5])church=church.subtract(arch(x,y,2,1.2,4));
for(const x of [25,29])for(const y of [-13.4,14])church=church.subtract(arch(x,y,5,1.2,6));
for(const x of [-1.7,1.7])for(const y of [-3.7,4.3])for(const z of [15,22])church=church.subtract(arch(x,y,z,1.1,4));
for(const y of [-1.6,1.6])for(const z of [15,22])church=church.subtract(arch(0,0,z,1.1,4).rotate([0,0,90]).translate([-4.3,y,0]));
church=church.subtract(arch(0,0,BASE,2,4).rotate([0,0,90]).translate([-4.3,0,0]));
for(const y of [-1.5,0,1.5])church=church.subtract(arch(0,0,7,1,5).rotate([0,0,90]).translate([45.4,y,0]));
for(const y of [-13.7,13.7]){const start=y<0?y-.05:y-.4;church=church.subtract(Manifold.cylinder(.45,1.7,1.7,24,false).rotate([-90,0,0]).translate([27,start,10.7]))}
const parts=[['building:kerk',church]];
const META={name:'Sint-Luciakerk Helmond',origin:ORIGIN,xAxis:X_AXIS,groundHeight:18.2,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0794100000390849'],description:'Driebeukige kruisbasiliek met kooromgang, westtoren en vieringruiter.',realWorld:{groundNapM:18.2,ahn4TopNapM:62.529,ahn5TopNapM:71.218,ahn5VieringNapM:49.313},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0794100000390849','https://commons.wikimedia.org/wiki/Category:Sint-Luciakerk_(Mierlo-Hout)','https://monumentenregister.cultureelerfgoed.nl/monumenten/513046','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-luciakerk-helmond.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





