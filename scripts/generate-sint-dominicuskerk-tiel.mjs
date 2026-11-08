import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-dominicuskerk-tiel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X volgt de nok van het koor naar de toren. Hoogten vanaf +6 m NAP.
const BASE=-0.3,ORIGIN=[158026,433128],X_AXIS=[0.749,.663];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const box=(x,y,z,cx,cy,cz)=>Manifold.cube([x,y,z],true).translate([cx,cy,cz]);
// Centrale basiliek en lagere zijbeuken onder afzonderlijke lessenaarsdaken.
const core=prism(rect(-11.7,16.4,-6,4),BASE,16.0);
const coreRoof=Manifold.hull([[-11.7,-6,15.95],[16.4,-6,15.95],[-11.7,4,15.95],[16.4,4,15.95],[-11.7,-1,21.8],[16.4,-1,21.8]]);
const aisles=[];
for(const sign of [-1,1]){
 const y0=sign<0?-13.5:3.8,y1=sign<0?-5.8:11.4,inner=sign<0?-5.8:3.8;
 aisles.push(prism(rect(-11.7,23.8,y0,y1),BASE,8.9));
 aisles.push(Manifold.hull([[-11.7,y0,8.85],[23.8,y0,8.85],[-11.7,y1,8.85],[23.8,y1,8.85],[-11.7,inner,12.6],[23.8,inner,12.6]]));
}
// Het hogere dwarsbouwdeel en zijn lagere vleugels.
const crossing=prism(rect(-22.5,-11.4,-6.1,4.1),BASE,20.0);
const crossingRoof=Manifold.hull([[-22.5,-6.1,19.95],[-11.4,-6.1,19.95],[-22.5,4.1,19.95],[-11.4,4.1,19.95],[-16.95,-6.1,27.3],[-16.95,4.1,27.3]]);
const wings=[];
for(const s of [-1,1]){
 const y0=s<0?-14.5:3.9,y1=s<0?-5.9:13.8,inner=s<0?-5.9:3.9;
 wings.push(prism(rect(-22.4,-11.5,y0,y1),BASE,11.2));
 wings.push(Manifold.hull([[-22.4,y0,11.15],[-11.5,y0,11.15],[-22.4,y1,11.15],[-11.5,y1,11.15],[-16.95,y0,16],[-16.95,y1,16]]));
}
// Klein koor met veelhoekige afsluiting.
const apsisp=[[-26,-3.1],[-23.3,-5.8],[-22.3,-5.8],[-22.3,4.3],[-23.1,4.3],[-25.9,1.2]];
const apse=prism(apsisp,BASE,10.4);
const apseRoof=Manifold.hull([...apsisp.map(([x,y])=>[x,y,10.35]),[-23,-.8,15.0],[-24.6,-.8,15.0]]);
// Ingebouwde vierkante toren met het kenmerkende lage tentdak.
const tower=prism(rect(16.1,27.1,-5.7,3.9),BASE,37.5);
const towerRoof=Manifold.hull([[16.1,-5.7,37.45],[27.1,-5.7,37.45],[16.1,3.9,37.45],[27.1,3.9,37.45],[21.6,-.9,40.5]]);
// Steunberen tegen de lage zijgevels.
const braces=[];for(const sign of [-1,1])for(const x of [-8,-2,4,10,16]){
 const y=sign<0?-13.55:11.45;braces.push(box(1.2,1.4,7.7,x,y,3.55));
 braces.push(Manifold.hull([[x-.6,y-.7,7.35],[x+.6,y-.7,7.35],[x-.6,y+.7,7.35],[x+.6,y+.7,7.35],[x-.6,sign<0?-13.2:11.1,8.45],[x+.6,sign<0?-13.2:11.1,8.45]]));
}
let church=Manifold.union([core,coreRoof,...aisles,crossing,crossingRoof,...wings,apse,apseRoof,tower,towerRoof,...braces]);
// Nissen als blinde, afgeschuinde openingen; geen vrijdragende lateien.
const arch=(a,z,w,h,r)=>{const n=a*Math.PI/180;return prism([[-w/2,0],[w/2,0],[w/2,h-.65],[0,h],[-w/2,h-.65]],0,.7).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(r-.5),Math.sin(n)*(r-.5),z]);};
for(const x of [-5,1,7,13]){
 church=church.subtract(arch(-90,3,1.6,3.7,13.5).translate([x,0,0]));
 church=church.subtract(arch(90,3,1.6,3.7,11.4).translate([x,0,0]));
}
// Vensters in de lichtbeuk boven de lage zijdaken.
for(const x of [-8,-2,4,10]) {
 church=church.subtract(arch(-90,13.2,1.3,2.1,6).translate([x,0,0]));
 church=church.subtract(arch(90,13.2,1.3,2.1,4).translate([x,0,0]));
}
// De hoge galmgaten en vlakke entree bevinden zich op de torenzijden.
for(const a of [90,180,270])for(const off of [-2,2]){
 const n=a*Math.PI/180;const tx=-Math.sin(n)*off,ty=Math.cos(n)*off;
 church=church.subtract(arch(a,30.2,1.4,4.0,a===180?5.5:4.8).translate([21.6+tx,-.9+ty,0]));
}
church=church.subtract(arch(0,0,2.4,4.3,5.5).translate([21.6,-.9,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Dominicuskerk Tiel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:6.0,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0281100000019337"],description:"Driebeukige kerk met hoger dwarsbouwdeel en vierkante toren onder vlak tentdak.",realWorld:{groundNapM:6.0,towerHeightM:40},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0281100000019337","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/520655","https://www.raadvanstate.nl/uitspraken/%4050698/200905155-1-r2/","https://suitbertusparochie.nl/blog/portfolio/h-dominicuskerk-tiel/"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-dominicuskerk-tiel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

