// Vincentiuskerk Reduzum: BAG contour, dakvlakken en negentiende-eeuwse toren.
// Assen: +X langs de nok naar het oosten; alle maten in meters boven maaiveld.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="vincentiuskerk-reduzum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[181832.5,570227.9],X_AXIS=[0.99667,0.08153],GROUND_NAP=1.434;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en driezijdig gesloten koor: regelmatige versie van de BAG-contour.
const poly=[[2.1,-4.15],[20,-4.15],[21.65,-3.7],[23.5,-2.3],[24.1,0],[23.5,2.3],[21.65,3.7],[20,4.15],[2.1,4.15]];
const body=prism(poly,BASE,5.95);
let roof=prism(poly,5.9,20);roof=plane(roof,0,-1.38,11.68);roof=plane(roof,0,1.38,11.68);roof=plane(roof,-1.38,0,39.28);
// De vierkante toren en terugliggende, achtkantige naaldspits.
const tower=box(-2.05,2.35,-2.2,2.2,BASE,18.1);
const oct=(cx,cy,r,z)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(0.15,0,2.05,18.0),...oct(0.15,0,0.45,32.5)]);
const solids=[body,roof,tower,spire];
// Vier versneden hoekberen. Bovenkanten lopen schuin voor printbaarheid.
for(const x of [-1.75,2.0])for(const y of [-1.9,1.9]){
 const b=Manifold.hull([[x-.55,y-.55,BASE],[x+.55,y-.55,BASE],[x+.55,y+.55,BASE],[x-.55,y+.55,BASE],[x-.45,y-.45,10.1],[x+.45,y-.45,10.1],[x+.45,y+.45,10.1],[x-.45,y+.45,10.1],[x,y,11.2]]);solids.push(b);
}
// Lichte lijsten als schuine kragen en vier hoekpinakels, minimaal 0,9 m dik.
for(const z of [10.55,17.55]) solids.push(Manifold.hull([[-2.05,-2.2,z-0.45],[2.35,-2.2,z-0.45],[2.35,2.2,z-0.45],[-2.05,2.2,z-0.45],[-2.42,-2.57,z],[2.72,-2.57,z],[2.72,2.57,z],[-2.42,2.57,z],[-2.42,-2.57,z+0.22],[2.72,-2.57,z+0.22],[2.72,2.57,z+0.22],[-2.42,2.57,z+0.22]]));
for(const x of [-1.85,2.15])for(const y of [-2,2])solids.push(Manifold.hull([[x-.46,y-.46,17.6],[x+.46,y-.46,17.6],[x+.46,y+.46,17.6],[x-.46,y+.46,17.6],[x-.46,y-.46,19.0],[x+.46,y-.46,19.0],[x+.46,y+.46,19.0],[x-.46,y+.46,19.0],[x,y,19.7]]));
// Zuidportaal op foto's: zandstenen omlijsting en rond fronton als compacte massa.
solids.push(box(3.15,5.55,-4.55,-4.08,BASE,3.0));
solids.push(Manifold.hull([[3.15,-4.55,3],[5.55,-4.55,3],[3.15,-4.08,3],[5.55,-4.08,3],[4.35,-4.55,3.8],[4.35,-4.08,3.8]]));
let church=Manifold.union(solids);
// Blinde vensternissen van 0,35 m; de schuine afsluiting print zonder steun.
for(const x of [7.1,12.6,17.9])for(const side of [-1,1]){
 let cut=box(x-.65,x+.65,side<0?-4.45:3.82,side<0?-3.82:4.45,1.8,5.2);
 cut=plane(plane(cut,-1,0,5.2+x),1,0,5.2-x);church=church.subtract(cut);
}
church=church.subtract(box(3.75,4.95,-4.8,-4.25,BASE,2.4));
// Venster boven de ingang en vensters in de schuine koorvlakken.
church=church.subtract(box(3.75,4.95,-4.55,-3.82,3.8,5.2));
for (const side of [-1,1]) {
  const cut=box(-.65,.65,-.5,.5,1.8,5.15).rotate([0,0,side*34]).translate([21.9,side*3.56,0]);
  church=church.subtract(cut);
}
// Noordelijk westvenster en ronde wijzerplaatnissen aan vier torenzijden.
church=church.subtract(box(3.75,4.95,3.82,4.55,3.0,5.2));
for (const side of [-1,1]) {
  const clockNS=Manifold.cylinder(.55,.55,.55,24).rotate([90,0,0]).translate([.15,side<0?-1.9:2.45,16.7]);
  const clockEW=Manifold.cylinder(.55,.55,.55,24).rotate([0,90,0]).translate([side<0?-2.45:1.9,0,16.7]);
  church=church.subtract(clockNS).subtract(clockEW);
}
// Hoog smal westvenster onder de galmgaten.
church=church.subtract(box(-2.4,-1.7,-.55,.55,4.4,8.6));
// Toren: klokvensters aan alle vier zijden, en toegang aan westkant.
for(const side of [-1,1]){
 church=church.subtract(box(-.65,.95,side<0?-2.55:1.86,side<0?-1.86:2.55,12.0,16.3));
 church=church.subtract(box(side<0?-2.4:2.0,side<0?-1.7:2.7,-.8,.8,12.0,16.3));
}
church=church.subtract(box(-2.5,-1.7,-.6,.6,BASE,2.8));
const parts=[["building:kerk",church]];
const META={name:"Vincentiuskerk Reduzum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0055100000252823"],description:"Eenbeukige kerk met driezijdige sluiting, zandstenen zuidportaal en negentiende-eeuwse toren met achtzijdige naaldspits; open balustrade weggelaten op printschaal.",realWorld:{groundNapM:GROUND_NAP,naveRidgeM:11.68,towerEavesM:18.1,towerTopM:32.5},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0055100000252823","https://monumentenregister.cultureelerfgoed.nl/monumenten/22921","https://commons.wikimedia.org/wiki/Category:Vincentiuskerk_Reduzum","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.frieslandwonderland.nl/friesland/plaats/reduzum/friesland/lemma/kerk-en-klokkenstoel-48571"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-vincentiuskerk-reduzum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


