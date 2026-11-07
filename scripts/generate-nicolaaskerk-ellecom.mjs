import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nicolaaskerk-ellecom";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[203376.6,449487.3],X_AXIS=[.8944,.4472];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en driezijdige koorsluiting onder een doorgaande kap met afgeschild koor.
const poly=[[1.8,-5.6],[20.2,-5.6],[20.3,-4],[23.5,-3.8],[26.2,-1.4],[26.1,1.6],[23.5,3.8],[20.2,4],[20.2,5.8],[1.8,5.8]];
let body=prism(poly,BASE,8.2),roof=prism(poly,8.15,17);roof=plane(roof,0,-1.16,14.9);roof=plane(roof,0,1.16,14.9);roof=plane(roof,-1.3,0,48.55);
let porch=box(16,20.3,-8.6,-5.2,BASE,4.2),pr=box(16,20.3,-8.6,-5.2,4.15,10);pr=plane(pr,0,1.15,14.05);
let tower=box(-1.8,1.9,-2.1,2.6,BASE,17.3);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos((i+.5)*Math.PI/4),.25+r*Math.sin((i+.5)*Math.PI/4),z]);
const shoulder=Manifold.hull([...oct(3,17.2),...oct(1.8,18.35)]),tip=Manifold.hull([...oct(1.8,18.3),...oct(.55,26.4)]);
let church=Manifold.union([body,roof,porch,pr,tower,shoulder,tip]);
// Ronde of spitsboogvormige vensters als ondiepe nissen; geen maaswerk.
const pointed=(x,y,z,w,h)=>prism([[-w/2,0],[w/2,0],[w/2,h-.65],[0,h],[-w/2,h-.65]],0,.7).rotate([90,0,0]).translate([x,y,z]);
for(const x of [5.7,11.6])church=church.subtract(pointed(x,-5.0,2.9,1.15,4.0));
for(const x of [5.7,11.6,16.7])church=church.subtract(pointed(x,6.15,2.9,1.15,4.0));
church=church.subtract(box(25.6,26.4,-.65,.65,2.7,7));
for(const [x,y,angle] of [[24.8,-2.6,42],[24.8,2.7,-42]])church=church.subtract(box(-.65,.65,-.55,.55,2.7,7).rotate([0,0,angle]).translate([x,y,0]));
church=church.subtract(box(-2,-1.45,-.7,.7,BASE,2.8));
for(const y of [-2.25,2.3])church=church.subtract(box(-.6,.6,y,y+.5,14.4,16.2));
church=church.subtract(box(-2,-1.45,-.6,.6,14.4,16.2));
for(const x of [2.2,9.4,16.6])for(const y of [-5.9,5.4])church=Manifold.union([church,box(x-.45,x+.45,y,y+.85,BASE,7.6)]);
const parts=[["building:kerk",church]];
const META={name:"Nicolaaskerk Ellecom",origin:ORIGIN,xAxis:X_AXIS,groundHeight:12.057,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0275100000022702"],description:"Dorpskerk met romaanse westtoren, schip, zijaanbouw en driezijdige laatgotische koorsluiting.",realWorld:{groundNapM:12.057},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0275100000022702","https://monumentenregister.cultureelerfgoed.nl/monumenten/42128","https://commons.wikimedia.org/wiki/Category:Dutch_Reformed_Church,_Ellecom","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://kerkrhedenellecomdesteeg.nl/nicolaaskerk-ellecom/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-nicolaaskerk-ellecom.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

