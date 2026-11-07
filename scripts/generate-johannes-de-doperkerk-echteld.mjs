import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="johannes-de-doperkerk-echteld";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[162700.2,435617.4],X_AXIS=[.9992,-.0388];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en iets verhoogd koor met driezijdige sluiting, beide onder dakvlakken.
let nave=box(1.8,18.4,-5.3,5.2,BASE,7.6),roof=box(1.8,18.4,-5.3,5.2,7.55,16);
roof=plane(roof,0,-1.23,14);roof=plane(roof,0,1.23,14);
const cp=[[18.3,-4.6],[28,-4.6],[30.5,-2.2],[30.7,1.7],[28.4,4.2],[18.3,4.2]];
let choir=prism(cp,BASE,8.5),cr=prism(cp,8.45,16);cr=plane(cr,0,-1.33,14.3);cr=plane(cr,0,1.33,14.3);cr=plane(cr,-1.25,0,52.7);
let wing=box(18.6,25.8,4.1,9.7,BASE,4.6),wr=box(18.6,25.8,4.1,9.7,4.55,10);wr=plane(wr,0,-1,14.3);
let tower=box(-1.9,1.9,-2.2,2.1,BASE,18.2);
const top=Manifold.hull([[-2,-2.3,18.15],[2,-2.3,18.15],[2,2.2,18.15],[-2,2.2,18.15],[-.5,-.55,22.12],[.5,-.55,22.12],[.5,.45,22.12],[-.5,.45,22.12]]);
let church=Manifold.union([nave,roof,choir,cr,wing,wr,tower,top]);
// Spitsboogvormige, blinde vensternissen in de langszijde.
const pointed=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.65],[0,h],[-w/2,h-.65]],0,.65).rotate([90,0,0]).translate([x,y,z]);
for(const x of [4.4,7.8,11.2,14.6])church=church.subtract(pointed(x,-4.8,3.3,1.2,3.2));
for(const x of [19.7,22.8,25.9])church=church.subtract(pointed(x,-4.1,2.7,1.15,5.0));
for(const x of [4.4,7.8,11.2,14.6])church=church.subtract(pointed(x,5.65,3.3,1.2,3.2));
church=church.subtract(box(30.25,30.9,-.65,.65,2.7,7.4));
for(const [x,y,angle] of [[29.25,-3.4,44],[29.55,2.95,-47]])church=church.subtract(box(-.6,.6,-.5,.5,2.7,7.4).rotate([0,0,angle]).translate([x,y,0]));
church=church.subtract(box(6.3,7.7,-5.5,-4.8,BASE,2.6));
church=church.subtract(box(-2.1,-1.5,-.55,.55,BASE,2.5));
for(const y of [-2.35,1.75])church=church.subtract(box(-.6,.6,y,y+.5,15.5,17));
church=church.subtract(box(-2.1,-1.5,-.6,.6,15.5,17));
// Steunberen rond koor, als stenen bouwdelen met voldoende breedte.
for(const x of [18.3,21.4,24.5,27.8])church=Manifold.union([church,box(x-.45,x+.45,-5.65,-4.1,BASE,7.6)]);
for(const x of [3.1,6.5,9.9,13.3])church=Manifold.union([church,box(x-.45,x+.45,4.8,6.1,BASE,5.1)]);
const parts=[["building:kerk",church]];
const META={name:"Johannes de Doperkerk Echteld",origin:ORIGIN,xAxis:X_AXIS,groundHeight:7.416,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1740100000014412"],description:"Middeleeuwse zaalkerk met lager schip, gotisch koor, westtoren en vierkante spits.",realWorld:{groundNapM:7.416},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1740100000014412","https://monumentenregister.cultureelerfgoed.nl/monumenten/14267","https://monumentenregister.cultureelerfgoed.nl/monumenten/14268","https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Echteld","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://voorstraat-echteld.nl/de-hervormde-kerk/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-johannes-de-doperkerk-echteld.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

