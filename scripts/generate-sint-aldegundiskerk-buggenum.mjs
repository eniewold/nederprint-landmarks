import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-aldegundiskerk-buggenum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X volgt de lengteas van de toren naar het koor.
const BASE=-.5,ORIGIN=[196449.6,360424.6],X_AXIS=[.9998,.022];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(s,ridge,at,slope)=>plane(plane(s,0,slope,ridge-slope*at),0,-slope,ridge+slope*at);
const roofY=(s,ridge,at,slope)=>plane(plane(s,slope,0,ridge-slope*at),-slope,0,ridge+slope*at);
// Na-oorlogs schip met hoog zadeldak en aansluitende lagere zijbeuken.
const nave=roofX(box(3.1,27,-5.6,5.7,BASE,21),21,.2,1.6);
const south=plane(box(3.1,27,-9.2,-5.5,BASE,12.2),0,.62,15.5);
const north=plane(box(3.1,27,5.5,9.4,BASE,12.2),0,-.62,15.55);
// Het oudere, driezijdig gesloten koor heeft zijn eigen lagere nok en schilden.
let choir=prism([[26.8,-4.35],[33.2,-4.35],[36,-1.8],[36.2,1.6],[33.4,4.4],[26.8,4.4]],BASE,18.7);
choir=roofX(choir,18.7,.2,1.5);choir=plane(choir,-1.55,0,70.1);
// Sacristie en doopkapel als zelfstandige bouwdelen met kappen.
const sac=roofX(box(27,36,-11.3,-8.3,BASE,10),10,-8.3,.9);
const sacJoin=box(27,34,-8.5,-4.1,BASE,7.0);
const bapt=roofY(box(.2,4.5,3.1,8.9,BASE,10.2),10.2,2.35,1.0);
const tower=box(-3.3,3.3,-3.25,3.35,BASE,28.45);
const rect=(a,b,c,d,z)=>[[a,c,z],[b,c,z],[b,d,z],[a,d,z]];
const crown=Manifold.hull([...rect(-3.3,3.3,-3.25,3.35,28.05),...rect(-3.6,3.6,-3.55,3.65,28.4)]);
const spire=Manifold.hull([...rect(-3.3,3.3,-3.25,3.35,28.4),...rect(-.45,.45,-.4,.5,46.7)]);
const solids=[nave,south,north,choir,sac,sacJoin,bapt,tower,crown,spire];
// Schuine steunberen tussen de vijf traveeën zijn onderdeel van de gevel.
for(const x of [3.8,8.4,13,17.6,22.2,26.4])for(const side of [-1,1]){
 const y0=side<0?-10.35:9.25,y1=side<0?-9.05:10.55;
 let butt=box(x-.5,x+.5,y0,y1,BASE,8.4);butt=plane(butt,0,side<0?1:-1,side<0?18.6:18.9);solids.push(butt);
}
let church=Manifold.union(solids);
// Vijf dubbele hoge boogramen in beide zijgevels en galmgaten op de toren.
const arch=(x,y,z,w,h,depth=.75)=>prism([[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]],0,depth).rotate([90,0,0]).translate([x,y,z]);
for(const x of [6.15,10.75,15.35,19.95,24.3])for(const y of [-8.9,9.65])church=church.subtract(arch(x,y,3.0,1.45,4.7));
for(const x of [-1.25,1.25])for(const y of [-2.65,3.95])church=church.subtract(arch(x,y,22.4,1.5,4.7,1.25));
for(const y of [-1.25,1.25]){
 church=church.subtract(arch(y,0,22.4,1.5,4.7,1.25).rotate([0,0,90]).translate([-3.7,0,0]));
 church=church.subtract(arch(y,0,22.4,1.5,4.7,1.25).rotate([0,0,90]).translate([2.5,0,0]));
}
church=church.subtract(arch(0,0,.05,1.45,3.4).rotate([0,0,90]).translate([-3.55,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Aldegundiskerk Buggenum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:18.938,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1640100000035611"],description:"Naoorlogse driebeukige kerk met behouden driezijdig koor en een toren met hoge piramidespits.",realWorld:{groundNapM:18.938,towerHeightM:46.7},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1640100000035611","https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec","https://www.kerkgebouwen-in-limburg.nl/kerken/buggenum/aldegundis","https://www.dbnl.org/tekst/sten009monu08_01/sten009monu08_01_0032.php"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-aldegundiskerk-buggenum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





