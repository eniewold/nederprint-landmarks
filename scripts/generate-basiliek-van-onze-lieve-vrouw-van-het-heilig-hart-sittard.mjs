import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="basiliek-van-onze-lieve-vrouw-van-het-heilig-hart-sittard";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[188913.5,334499.4],X_AXIS=[.84805,.52992];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const nave=box(-21.4,5,-4.6,4.6,BASE,14.8);
let naveRoof=box(-21.4,5,-4.6,4.6,14.75,30);naveRoof=plane(naveRoof,0,-1.63,22.3);naveRoof=plane(naveRoof,0,1.63,22.3);
const left=box(-21.4,4.3,4.5,7.25,BASE,10.3),right=box(-21.4,4.3,-7.25,-4.5,BASE,10.3);
let leftRoof=box(-21.4,4.3,4.49,7.25,10.25,16);leftRoof=plane(leftRoof,0,-.5,14);
let rightRoof=box(-21.4,4.3,-7.25,-4.49,10.25,16);rightRoof=plane(rightRoof,0,.5,14);
// Achtkantig koor met omgang en lagere straalkapellen.
const choirPoly=[[4,-4.6],[9,-4.3],[12.2,-2.5],[12.2,2.5],[9,4.3],[4,4.6]];
let choir=prism(choirPoly,BASE,13.5),choirRoof=prism(choirPoly,13.45,30);choirRoof=plane(choirRoof,0,-1.63,22.3);choirRoof=plane(choirRoof,0,1.63,22.3);choirRoof=plane(choirRoof,-1.35,0,35.5);
const apsePoly=[[4,-7.2],[10.4,-6.5],[13.7,-3],[13.7,2],[10.5,6.8],[4,7.25]];
let apse=prism(apsePoly,BASE,8.9),apseRoof=prism(apsePoly,8.85,16);apseRoof=plane(apseRoof,-.55,0,16.45);apseRoof=plane(apseRoof,0,.6,13.3);apseRoof=plane(apseRoof,0,-.6,13.3);
// Noordelijke dwarsarm, eigen gedraaide nok als dakvlak.
const armPoly=[[2.6,6.9],[10.5,6.9],[6.9,20.5],[-1,16.4]];
let arm=prism(armPoly,BASE,10.6),armRoof=prism(armPoly,10.55,30);armRoof=plane(armRoof,-1.4,.42,20.5);armRoof=plane(armRoof,1.4,-.42,15.5);
// Achtzijdige vieringtoren; AHN heeft boven +98 NAP gaten. De spits wordt
// lineair gereconstrueerd naar AHN-top +106,8 en de bronmaat van circa 60 m.
const oct=(r,z0,z1,x=0,y=0)=>Manifold.cylinder(z1-z0,r,r,8).rotate([0,0,22.5]).translate([x,y,z0]);
const spire=(r,z0,z1,x=0,y=0)=>Manifold.cylinder(z1-z0,r,.04,8).rotate([0,0,22.5]).translate([x,y,z0]);
const crossing=box(-4.1,4.1,-4.1,4.1,BASE,21),shaft=oct(4.45,20.9,31.1),mainSpire=spire(4.4,31.05,63.25);
let solids=[nave,naveRoof,left,right,leftRoof,rightRoof,choir,choirRoof,apse,apseRoof,arm,armRoof,crossing,shaft,mainSpire];
// Vier hoektorentjes zijn op 1:1000 versterkt en met de schacht verenigd.
for(const x of [-2.8,2.8])for(const y of [-2.8,2.8])solids.push(oct(1.05,20.5,32,x,y),spire(1.05,31.9,46,x,y));
// Westgevel met twee ronde traptorens en een puntdak.
for(const y of [-3.2,3.2])solids.push(oct(1.2,BASE,19,-21,y),spire(1.2,18.95,24,-21,y));
// Duidelijke steunberen langs beide beuken.
for(const x of [-20.4,-17,-13.6,-10.2,-6.8,-3.4])for(const side of [-1,1])solids.push(box(x-.48,x+.48,side<0?-7.9:7.15,side<0?-7.15:7.9,BASE,9.4));
// Drie dakkapellen per zijde, als gesloten driehoekige prisma's.
for(const x of [-16.5,-12,-7.5])for(const side of [-1,1]){
 const y=side*2.9;solids.push(box(x-.55,x+.55,y-.55,y+.55,16.6,19.3));
 const top=Manifold.hull([[x-.65,y-.6,19.25],[x+.65,y-.6,19.25],[x+.65,y+.6,19.25],[x-.65,y+.6,19.25],[x,y,20.25]]);solids.push(top);
}
let church=Manifold.union(solids);
// Nissen in de lage zijgevels, de westentree en de torenschacht.
for(const x of [-18.7,-15.3,-11.9,-8.5,-5.1])for(const side of [-1,1])church=church.subtract(box(x-.55,x+.55,side<0?-7.4:6.9,side<0?-6.9:7.4,1.8,8));
church=church.subtract(box(-21.6,-21.1,-.8,.8,BASE,4.2));
for(const side of [-1,1])church=church.subtract(box(-.65,.65,side<0?-4.3:3.9,side<0?-3.9:4.3,23,29));
const parts=[["building:basiliek",church]];
const META={name:"Basiliek van Onze-Lieve-Vrouw van het Heilig Hart Sittard",origin:ORIGIN,xAxis:X_AXIS,groundHeight:43.517,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1883100000010318"],description:"Driebeukige kruisbasiliek met kooromgang, westelijke traptorens, dwarsarm en hoge vieringtoren met vier hoektorentjes; de spits is gereconstrueerd uit AHN, hoogtebron en foto's.",realWorld:{groundNapM:43.517},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1883100000010318","https://monumentenregister.cultureelerfgoed.nl/monumenten/33709","https://kerk-en-orgel.nl/record.php?action=display_ordered&direction=desc&display=table&id=6584&item=976&page_num=49&pagenum=17&province=lb&sort=status","https://basilieksittard.com/home/","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-basiliek-sittard.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

