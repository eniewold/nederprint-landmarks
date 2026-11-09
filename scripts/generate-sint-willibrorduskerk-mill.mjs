import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-willibrorduskerk-mill';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[182406.15,410915.07],X_AXIS=[.921,-.39];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge,axis='x')=>{let s=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);s=plane(s,0,-k,ridge+k*mid)}else{const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;s=plane(s,k,0,ridge-k*mid);s=plane(s,-k,0,ridge+k*mid)}return s};
// Driebeukige basiliek: schip, laaggelegen zijbeuken, koor en dwarspanden.
let p=[box(-25,16,-10.5,10.5,BASE,10.1),box(-25,19,-5.2,5.2,BASE,16),gable(-25,19,-5.2,5.2,16,24)];
for(const [a,b] of [[-10.5,-5.1],[5.1,10.5]]){let r=box(-25,15,a,b,10,13.1),k=3/(b-a);r=plane(r,0,a<0?k:-k,a<0?10.1-k*a:10.1+k*b);p.push(r)}
const ap=[[18,-5.2],[21,-5.2],[24,-2.5],[24,2.5],[21,5.2],[18,5.2]];p.push(prism(ap,BASE,16));p.push(Manifold.hull([...ap.map(([x,y])=>[x,y,15.9]),[18,-.05,24],[20,-.05,24],[20,.05,24],[18,.05,24]]));
p.push(box(7,20,-23,22,BASE,6.2));p.push(gable(7,20,-23,22,6.2,10.5,'y'));
// Toren met gekanteelde kroon, gemeten hoogte ca. 45 m boven maaiveld.
p.push(box(-34.5,-25,-5.1,5.1,BASE,43));p.push(Manifold.cylinder(5.6,6.65,.1,4,false).rotate([0,0,45]).translate([-29.75,0,42.9]));
for(const x of [-34,-25.7])for(const y of [-4.5,4.5]){p.push(box(x-.6,x+.6,y-.6,y+.6,BASE,45));}
for(const x of [-21,-15.2,-9.4,-3.6,2.2])for(const y of [-10.4,10.4])p.push(box(x-.55,x+.55,Math.min(y,y*1.12),Math.max(y,y*1.12),BASE,10));
let church=Manifold.union(p);
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.6).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-18,-12.2,-6.4,-.6,5.2])for(const y of [-10.2,11])church=church.subtract(arch(x,y,2.2,2,5));
for(const x of [-18,-12.2,-6.4,-.6,5.2,10])for(const y of [-5,5.7])church=church.subtract(arch(x,y,11.3,1.6,3.5));
for(const x of [-32.5,-29.8,-27])for(const y of [-4.65,5.55])church=church.subtract(arch(x,y,33,1.35,7));
for(const y of [-2.8,0,2.8])church=church.subtract(arch(y,0,33,1.5,7).rotate([0,0,90]).translate([-34.6,0,0]));
church=church.subtract(arch(0,0,1,3,5).rotate([0,0,90]).translate([-34.6,0,0]));
church=church.subtract(arch(0,0,6,2,7).rotate([0,0,-90]).translate([24.1,0,0]));
church=church.subtract(arch(0,0,6,1.7,7).rotate([0,0,-48]).translate([22.6,-3.94,0]));
church=church.subtract(arch(0,0,6,1.7,7).rotate([0,0,-132]).translate([22.6,3.94,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Willibrorduskerk Mill',origin:ORIGIN,xAxis:X_AXIS,groundHeight:17,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0815100000001878'],description:'Driebeukige basiliek met platte westtoren, koor en lage transeptarmen.',realWorld:{groundNapM:17,ahn4TopNapM:64,ahn5TopNapM:65.8,towerTopM:48.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0815100000001878','https://commons.wikimedia.org/wiki/Category:Sint_Willibrord_kerk,_Mill','https://monumentenregister.cultureelerfgoed.nl/monumenten/29932','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-willibrorduskerk-mill.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
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





