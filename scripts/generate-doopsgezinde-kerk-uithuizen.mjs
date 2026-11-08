import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="doopsgezinde-kerk-uithuizen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[240323,603265],X_AXIS=[.9724,-.2334];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Driezijdig gesloten zaal, zijruimten en gepleisterde schoudergevel.
const plan=[[-2.6,-3.6],[15.1,-3.6],[17.4,-1.05],[17.4,2.59],[15.3,5],[-2.6,5]];
let ship=prism(plan,BASE,6.2),roof=prism(plan,6.15,10.25);
roof=plane(roof,0,1.0,9.65);roof=plane(roof,0,-.89,10.78);roof=plane(roof,-1.2,0,28.4);
let s=box(-2.6,2.4,-5.1,-3.5,BASE,4.1),sr=box(-2.6,2.4,-5.1,-3.5,4.05,6.1);sr=plane(sr,0,1.0,9.2);
let n=box(-2.6,2.5,4.9,6.6,BASE,4.0),nr=box(-2.6,2.5,4.9,6.6,3.95,6.1);nr=plane(nr,0,-1.0,10.6);
let church=Manifold.union([ship,roof,s,sr,n,nr]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [4.2,8.3,12.4])for(const y of [-3.25,5.35])church=church.subtract(arch(x,y,2.2,1.2,3));
// Twee hoge frontvensters, middenvenster en de entree.
for(const y of [-2.45,3.55])church=church.subtract(arch(y,0,2.0,1.3,3.4).rotate([0,0,90]).translate([-2.7,0,0]));
church=church.subtract(arch(.55,0,5.0,1.25,3.4).rotate([0,0,90]).translate([-2.7,0,0]));
church=church.subtract(arch(.55,0,BASE,1.45,2.6).rotate([0,0,90]).translate([-2.7,0,0]));
for(const y of [-4.7,-3.4,4.6,6.1])church=Manifold.union([church,box(-2.85,-2.2,y-.47,y+.47,BASE,y===-4.7||y===6.1?5.0:7.0)]);
for(const y of [-.9,1.95])church=Manifold.union([church,box(-2.85,-2.2,y-.47,y+.47,BASE,9.6)]);
const parts=[["building:kerk",church]];
const META={name:"Doopsgezinde kerk Uithuizen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.154,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1651100000010336"],description:"Driezijdig gesloten vermaning met schoudergevel en twee lage zijruimten.",realWorld:{groundNapM:2.154,roofRidgeNapM:12.38},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1651100000010336","https://monumentenregister.cultureelerfgoed.nl/monumenten/515328","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Doopsgezinde_Kerk_(Uithuizen)","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/515328"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-doopsgezinde-kerk-uithuizen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-1000.stl`,`${slug}-1-100.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





