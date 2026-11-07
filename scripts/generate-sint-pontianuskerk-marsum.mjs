import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-pontianuskerk-marsum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[177758,580509.5],X_AXIS=[1,0],GROUND_NAP=4.8;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const poly=[[-12.5,-4.6],[13.5,-4.6],[15.6,-3.9],[17.7,-1.7],[17.7,1.7],[15.6,3.9],[13.5,4.7],[-12.5,4.7]];
const body=prism(poly,BASE,6.9);
let roof=prism(poly,6.85,17);roof=plane(roof,0,-1.8,15.26);roof=plane(roof,0,1.8,15.26);roof=plane(roof,-1.8,0,39.56);
const tower=box(-18.4,-12.3,-3.05,3.25,BASE,20.1);
const lowSpire=Manifold.extrude([[[-2.7,-2.7],[2.7,-2.7],[2.7,2.7],[-2.7,2.7]]],1.7,0,0,[.7,.7]).translate([-15.35,.1,20.1]);
const tip=Manifold.hull([[-17.24,-1.79,21.8],[-13.46,-1.79,21.8],[-13.46,1.99,21.8],[-17.24,1.99,21.8],[-15.35,.1,32.1]]);
let church=Manifold.union([body,roof,tower,lowSpire,tip]);
for(const u of [-9.3,-5,-.7,3.6,7.9,12.2]){let cut=box(u-.6,u+.6,-4.85,-4.25,2.1,5.8);cut=plane(cut,-1.2,0,5.8+1.2*u);cut=plane(cut,1.2,0,5.8-1.2*u);church=church.subtract(cut)}
// Deur in de zuidgevel en vensters in de afgeschuinde koorsluiting.
church=church.subtract(box(-10.05,-8.55,-4.9,-4.25,0,1.9));
for(const side of [-1,1]) { const cut=box(-.65,.65,-.5,.5,2.4,5.2).rotate([0,0,side<0?45:-45]).translate([16.55,side*2.9,0]); church=church.subtract(cut); }
church=church.subtract(box(17.35,17.95,-.55,.55,2.4,5.2));
for(const x of [-1,1])for(const y of [-1,1]){const c=box(x<0?-18.6:-12.6,x<0?-18.1:-12.1,y<0?-1.8:.8,y<0?-.8:1.8,16.1,18.3);church=church.subtract(c)}
for(const y of [-1,1])church=church.subtract(box(-16.9,-15.9,y<0?-3.3:2.9,y<0?-2.75:3.45,16.1,18.3));
church=church.rotate([0,0,-.15]);const parts=[["building:kerk",church]];
const META={name:"Sint-Pontianuskerk Marsum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0083100000005118","NL.IMBAG.Pand.0083100000005122"],description:"Eenbeukige kerk met koorsluiting en afzonderlijk BAG-pand voor de dertiende-eeuwse toren met ingesnoerde spits.",realWorld:{groundNapM:4.8},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000005118","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000005122","https://monumentenregister.cultureelerfgoed.nl/monumenten/28622","https://commons.wikimedia.org/wiki/Category:Sint-Pontianuskerk_(Marsum,_Friesland)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-pontianuskerk-marsum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

