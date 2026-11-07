import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nicolaaskerk-nijeholtpade";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[201577.9,547300.7],X_AXIS=[1,0],GROUND_NAP=2.596;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const poly=[[1.3,-3.65],[18.2,-3.65],[20.9,-2.0],[20.9,1.55],[18.2,3.5],[1.3,3.5]];
const body=prism(poly,BASE,4.85);let roof=prism(poly,4.83,18);roof=plane(roof,0,-1.35,9.75-.1);roof=plane(roof,0,1.35,9.75+.1);roof=plane(roof,-1.75,0,41.8);
const tower=box(-1.4,1.65,-1.55,1.55,BASE,12.45);
const tip=Manifold.hull([[-1.4,-1.55,12.4],[-1.4,1.55,12.4],[1.65,-1.55,12.4],[1.65,1.55,12.4],[.125,0,22.6]]);
const bouwdelen=[body,roof,tower,tip];
// Onderdeel tegen de westkant: wigvormige steunbeer.
bouwdelen.push(Manifold.hull([[-2.65,-.55,BASE],[-2.65,.55,BASE],[-1.2,-.55,BASE],[-1.2,.55,BASE],[-1.2,-.55,7.3],[-1.2,.55,7.3]]));
// Zes steunberen met schuine bovenkant, op printschaal 0,9 m breed.
for(const x of [4.05,6.85,9.55,12.3,15.1,17.9])for(const side of [-1,1]){
 let b=box(x-.45,x+.45,side<0?-4.15:3.35,side<0?-3.45:4.0,BASE,4.25);b=side<0?plane(b,0,1,8.4):plane(b,0,-1,8.25);bouwdelen.push(b);
}
let church=Manifold.union(bouwdelen);
for(const x of [2.65,5.45,8.2,10.95,13.7,16.5,19.05])for(const side of [-1,1])church=church.subtract(box(x-.43,x+.43,side<0?-3.9:3.2,side<0?-3.35:3.8,1.55,3.75));
// De voormalige westopening ligt achter de steunbeer en blijft dicht.
for(const side of [-1,1])church=church.subtract(box(-.45,.45,side<0?-1.8:1.25,side<0?-1.25:1.8,10.35,11.75));
church=church.subtract(box(-1.65,-1.15,-.45,.45,10.35,11.75));
church=church.subtract(box(20.6,21.15,-.55,.55,1.55,3.65));
church=church.rotate([0,0,1.7]);
const parts=[["building:kerk",church]];
const META={name:"Nicolaaskerk Nijeholtpade",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0098100000014110"],description:"Laatgotische zaalkerk met driezijdig koor, steunberen en slanke toren met naaldspits. Vensters en spits naar AHN en foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0098100000014110","https://monumentenregister.cultureelerfgoed.nl/monumenten/38865","https://commons.wikimedia.org/wiki/Category:Nicolaaskerk,_Nijeholtpade","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.zuidoostfriesland.nl/alle-locaties/2588472253/sint-nicolaaskerk-nijeholtpade"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nicolaaskerk-nijeholtpade.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));



