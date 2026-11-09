import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-johannes-onthoofdingkerk-goirle';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[132873.9,392181.9],X_AXIS=[.49,-.87];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge,axis='x')=>{let s=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);s=plane(s,0,-k,ridge+k*mid)}else{const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;s=plane(s,k,0,ridge-k*mid);s=plane(s,-k,0,ridge+k*mid)}return s};
// Schip en koor met afzonderlijke vlakke dakvlakken, zijbeuken en dwarsschip.
let p=[box(-1.4,48,-6.2,6.2,BASE,15.5),gable(-1.4,48,-6.2,6.2,15.5,24.2)];
for(const [a,b] of [[-11.4,-6.1],[6.1,11.4]]){p.push(box(5,32,a,b,BASE,9.6));let r=box(5,32,a,b,9.5,15.55),k=(15.5-9.6)/(b-a);r=plane(r,0,a<0?k:-k,a<0?9.6-k*a:9.6+k*b);p.push(r)}
p.push(box(31,42.3,-16,16,BASE,11),gable(31,42.3,-16,16,11,19.2,'y'));
let choir=prism([[47.8,-6.2],[52,-5.8],[55,-3.4],[57.5,0],[55,3.3],[52,5.8],[47.8,6.2]],BASE,15.3);
let cr=Manifold.hull([[47.8,-6.2,15.2],[52,-5.8,15.2],[55,-3.4,15.2],[57.5,0,15.2],[55,3.3,15.2],[52,5.8,15.2],[47.8,6.2,15.2],[47.8,-.08,24.2],[50,-.08,24.2],[50,.08,24.2],[47.8,.08,24.2]]);p.push(choir,cr);
// Middeleeuwse toren staat naast de voorgevel; omliggende gevel en portaal.
p.push(box(-3.2,5.2,-12.4,-3,BASE,34.7));
let sp=Manifold.hull([[-3.1,-12.3,34.6],[5.1,-12.3,34.6],[5.1,-3.1,34.6],[-3.1,-3.1,34.6],[.55,-8.15,55.4],[1.45,-8.15,55.4],[1.45,-7.25,55.4],[.55,-7.25,55.4]]);p.push(sp);
for(const x of [-3.2,5.2])for(const y of [-12.4,-3])p.push(box(x-.6,x+.6,y-.6,y+.6,BASE,15));
p.push(box(-8.4,4,-.3,11.5,BASE,5.2),gable(-8.4,4,-.3,11.5,5.2,8.3));
p.push(box(-8.4,3.6,11.3,33.4,BASE,8.3),gable(-8.4,3.6,20,33.4,8.3,13));
// Sacristie en laag aangebouwde volumes ter weerszijden van het koor.
p.push(box(42,48,-14.5,-6,BASE,8.8),gable(42,48,-14.5,-6,8.8,12.8,'y'));
p.push(box(47,55,6,13,BASE,7.4),gable(47,55,6,13,7.4,12.6,'y'));
// Steunberen en raamtraveeën op de zijgevels.
for(const x of [10,15.5,21,26.5,32])for(const y of [-11.5,11.5])p.push(box(x-.55,x+.55,Math.min(y,y*.94),Math.max(y,y*.94),BASE,9.6));
// Dakkapellen en schoorsteen die op de RCE-koorfoto zichtbaar zijn.
for(const x of [16,27,44])for(const y of [-3.5,3.5]){let d=box(x-.6,x+.6,y-.6,y+.6,18.8,21.5);d=plane(d,1,0,21.5-x);d=plane(d,-1,0,21.5+x);p.push(d)}
p.push(box(43.5,44.6,-.55,.55,23.3,27.3));
let church=Manifold.union(p);
const arch=(x,y,z,w,h)=>{const pt=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(pt,0,.6).rotate([90,0,0]).translate([x,y,z])};
for(const x of [12.5,18,23.5,29])for(const y of [-11.15,11.7])church=church.subtract(arch(x,y,3,1.3,5));
for(const x of [33,36.5,40])for(const y of [-15.7,16.3])church=church.subtract(arch(x,y,4,1.2,6));
for(const x of [-1,2.8])for(const y of [-12.1,-2.7])for(const z of [22,28])church=church.subtract(arch(x,y,z,1.3,4.5));
for(const y of [-10,-5])for(const z of [22,28])church=church.subtract(arch(0,0,z,1.3,4.5).rotate([0,0,90]).translate([-3.5,y,0]));
church=church.subtract(arch(0,0,10,3.2,9).rotate([0,0,90]).translate([-1.7,0,0]));
church=church.subtract(arch(0,0,BASE,2.2,4.3).rotate([0,0,90]).translate([-8.7,26,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Johannes Onthoofdingkerk Goirle',origin:ORIGIN,xAxis:X_AXIS,groundHeight:15.317,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0785100000012716'],description:'Kruiskerk met vrijstaande oude hoektoren en naaldspits; AHN-hoogte wijkt af van lokale bronnen.',realWorld:{groundNapM:15.317,ahn4TopNapM:72.47,ahn5TopNapM:70.84,localSourceHeightM:71},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0785100000012716','https://visitgoirle.com/gools-geheim/kerk-st-jan/','https://www.sintjorisgoirle.nl/assets/files/Canon-GildeSintJorisGoirle.pdf','https://commons.wikimedia.org/wiki/Category:Sint-Johannes_Onthoofdingkerk,_Goirle','https://service.pdok.nl/rws/ahn/wcs/v1_0']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-johannes-onthoofdingkerk-goirle.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





