import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','100')),slug='esdonkse-kapelleke-gemert';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[174321.14,398872.35],X_AXIS=[.995,.096];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.05,ridge),k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;s=plane(s,0,k,ridge-k*mid);return plane(s,0,-k,ridge+k*mid)};
// Rechthoekig schip, zadeldak en vijfzijdige koorsluiting volgens BAG en 3DBAG.
let ship=box(0,7.05,-2.52,2.52,BASE,3.3),roof=gable(0,7.05,-2.52,2.52,3.3,7.1);
let choir=prism([[6.95,-2.52],[7.25,-2.45],[8.9,-1.55],[8.9,1.15],[7.1,2.52],[6.95,2.52]],BASE,3.3);
let cr=Manifold.hull([[6.9,-2.52,3.25],[7.25,-2.45,3.25],[8.9,-1.55,3.25],[8.9,1.15,3.25],[7.1,2.52,3.25],[6.9,2.52,3.25],[6.9,-.05,7.1],[7.05,-.05,7.1],[7.05,.05,7.1],[6.9,.05,7.1]]);
// Lage zijaanbouw met dwars zadeldak.
let ann=box(4.98,7.05,-4.64,-2.47,BASE,2.1), ar=box(4.98,7.05,-4.64,-2.47,2.05,3.5);ar=plane(ar,1.35,0,3.5-1.35*6.015);ar=plane(ar,-1.35,0,3.5+1.35*6.015);
// Noordelijke ondiepe grafnis: BAG-uitbouw 0,53 m, tot 0,9 m verdikt voor 1:1000.
let shrine=box(4.6,7.1,2.49,3.42,BASE,2.0), shrineRoof=box(4.6,7.1,2.49,3.42,1.95,3.0);
shrineRoof=plane(shrineRoof,.8,0,3-.8*5.85);shrineRoof=plane(shrineRoof,-.8,0,3+.8*5.85);
// Dakruiter: open klokkenstoel tot een massieve, 0,9 m brede kern vereenvoudigd.
let rider=box(3,3.9,-.48,.48,6.75,8.4), cap=Manifold.cylinder(1.3,.8,.3,4,false).rotate([0,0,45]).translate([3.45,0,8.35]);
// Aanhechting van de iets bredere dakkap met 45-graden schuine kraag.
let collar=Manifold.cylinder(.3,.65,.8,4,false).rotate([0,0,45]).translate([3.45,0,8.1]);
// Herkenbaar verhoogd tuitgeveltje bij de westgevel.
let tip=box(-.15,.45,-.48,.48,6.8,7.55);
let church=Manifold.union([ship,roof,choir,cr,ann,ar,shrine,shrineRoof,rider,collar,cap,tip]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.45).rotate([90,0,0]).translate([x,y,z])};
for(const x of [2,4.1])for(const y of [-2.3,2.75])church=church.subtract(arch(x,y,1.3,.95,1.5));
church=church.subtract(arch(1.1,-2.3,BASE,1,2));
church=church.subtract(arch(5.85,3.65,.15,1.25,1.1));
church=church.subtract(arch(0,0,1.1,.95,1.25).rotate([0,0,90]).translate([8.65,-.2,0]));
// De twee oculi zijn iets vergroot en als ondiepe nissen geprint.
for(const y of [-1,1])church=church.subtract(Manifold.cylinder(.45,.48,.48,16,false).rotate([0,90,0]).translate([-.2,y,2.25]));
const parts=[['building:kapel',church]];
const META={name:'Esdonkse kapelleke Gemert',origin:ORIGIN,xAxis:X_AXIS,groundHeight:13.964,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1652100000016676'],description:'Kapel met vijfzijdig koor, aanbouw en vereenvoudigde dakruiter.',realWorld:{groundNapM:13.964,ridgeHeightM:7.13,footprintSquareM:48.1},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1652100000016676','https://commons.wikimedia.org/wiki/Category:Esdonks_Kapelletje','https://monumentenregister.cultureelerfgoed.nl/monumenten/16061','https://service.pdok.nl/rws/ahn/wcs/v1_0']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-esdonkse-kapelleke-gemert.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





