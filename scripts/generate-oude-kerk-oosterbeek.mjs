import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-kerk-oosterbeek";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[185946.5,443378],X_AXIS=[.972,.233];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip met regelmatige zadeldakvlakken en een ten opzichte daarvan versmald koor.
let ship=box(2.8,22.1,-4.05,4.05,BASE,8), roof=box(2.8,22.1,-4.05,4.05,7.95,12.8);
roof=plane(roof,0,1.19,12.8);roof=plane(roof,0,-1.19,12.8);
// De apsis is halfrond, met een half kegelvormig dak aansluitend op het koor.
const choirOutline=[[21.9,-3],[27,-3],...[...Array(13)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/12;return [27+3*Math.cos(a),3*Math.sin(a)];}),[21.9,3]];
let choir=prism(choirOutline,BASE,6.9), cr=box(21.9,27,-3,3,6.85,11.0);
cr=plane(cr,0,1.37,11);cr=plane(cr,0,-1.37,11);
let cone=Manifold.cylinder(4.1,3,.02,24,false).translate([27,0,6.9]).intersect(box(27,30.2,-3.1,3.1,6.85,11.1));
// Westtoren met laag vierzijdig tentdak; het AHN en de foto zijn leidend.
let tower=box(-2.8,3.1,-3.4,3.4,BASE,16.1);
let towerRoof=Manifold.hull([[-2.8,-3.4,16],[3.1,-3.4,16],[3.1,3.4,16],[-2.8,3.4,16],[-.35,-.5,23.2],[.65,-.5,23.2],[.65,.5,23.2],[-.35,.5,23.2]]);
// Noordelijk ingangsportaal en twee lage aanbouwen langs het koor.
let portal=box(8.2,11.6,3.9,4.7,BASE,5.5);let portroof=plane(box(8.2,11.6,3.9,4.7,5.4,6.4),0,-1,10.1);
let annexN=box(22,26.3,2.9,5.5,BASE,3.5),annexNR=plane(box(22,26.3,2.9,5.5,3.45,5),0,-.55,6.5);
let annexS=box(15.5,22.1,-6.4,-3.9,BASE,3.4),annexSR=plane(box(15.5,22.1,-6.4,-3.9,3.35,5),0,.65,7.55);
let south=box(22,26.3,-11,-3,BASE,3.3),southR=box(22,26.3,-11,-3,3.25,5.7);
southR=plane(southR,1.1,0,-20.8);southR=plane(southR,-1.1,0,32.2);southR=plane(southR,0,1.1,16.7);
let chimney=box(21.2,22.2,-.5,.5,11.5,14.2);
let church=Manifold.union([ship,roof,choir,cr,cone,tower,towerRoof,portal,portroof,annexN,annexNR,annexS,annexSR,south,southR,chimney]);
// Romeinse rondboogvensters en galmgaten, als blinde nissen op printschaal.
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5.0,8.4,11.7,15.0,18.3,21.0])for(const y of [-3.7,4.4]) church=church.subtract(arch(x,y,4.0,1.0,2.2));
for(const x of [-1.3,1.4])for(const y of [-3.0,3.8]) church=church.subtract(arch(x,y,12.8,1.0,2.7));
for(const y of [-1.4,1.4])for(const x of [-2.9,2.8]) church=church.subtract(arch(y,0,12.8,1.0,2.7).rotate([0,0,90]).translate([x,0,0]));
church=church.subtract(arch(9.9,4.8,BASE,1.3,3.0));
// Smalle rondboognissen in apsis en vensters van de lage aanbouwen.
church=church.subtract(arch(0,0,3.0,.9,2.0).rotate([0,0,90]).translate([29.5,0,0]));
for(const x of [23.2,25.3]) church=church.subtract(arch(x,5.8,1.2,.9,1.4));
for(const x of [23.1,25.2]) church=church.subtract(arch(x,-10.7,1.1,.9,1.4));
const parts=[["building:kerk",church]];
const META={name:"Oude Kerk Oosterbeek",origin:ORIGIN,xAxis:X_AXIS,groundHeight:13.194,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0274100000000610"],description:"Romaanse zaalkerk met versmald koor en ronde apsis, westtoren en lage aanbouwen.",realWorld:{groundNapM:13.194,ahnTopNapM:37.839},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0274100000000610","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/32432","https://commons.wikimedia.org/wiki/Category:Oude_Kerk,_Oosterbeek","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.oudekerkoosterbeek.nl/architectuur/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-kerk-oosterbeek.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





