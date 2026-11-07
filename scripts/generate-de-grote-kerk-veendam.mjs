import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="de-grote-kerk-veendam";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[254655,569760],X_AXIS=[0.99863,-0.05234],GROUND_NAP=1.808;
const ccw=p=>p.reduce((n,q,i)=>{const r=p[(i+1)%p.length];return n+q[0]*r[1]-r[0]*q[1]},0)>0?p:[...p].reverse();
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(poly,planes)=>planes.reduce((o,[a,b,c])=>plane(o,a,b,c),prism(poly,BASE,40));
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const facet=(a,b,z,s,inside)=>{let dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l;if(nx*(inside[0]-a[0])+ny*(inside[1]-a[1])<0){nx=-nx;ny=-ny}return [s*nx,s*ny,z-s*(nx*a[0]+ny*a[1])];};
const TC=[-11.45,5.55],solids=[];
// Brede zaalkerk met afgeknot schilddak.
solids.push(roofed(rect(-9.3,15.9,-9.0,9.8),[[0,1.1,18.64],[0,-1.1,20.84],[1.1,0,20.3],[-1.1,0,27.6],[0,0,17.1]]));
solids.push(prism([[1.7,-9],[15.8,-9],[19.3,-13.2],[22,-15.4],[16.6,-22],[6.3,-21],[6.3,-12.5],[1.7,-12.5]],BASE,4.1));
const annex=[[15.8,-21.6],[27.7,-32.7],[34.8,-25.1],[22.9,-14.0]];
solids.push(roofed(annex,[facet(annex[0],annex[1],6.8,1,[25,-23]),facet(annex[1],annex[2],6.8,1,[25,-23]),facet(annex[2],annex[3],6.8,1,[25,-23]),facet(annex[3],annex[0],6.8,1,[25,-23]),[0,0,10.1]]));
solids.push(roofed(rect(-13.3,-8.8,-4.7,1.5),[[0,-1,8.3]]));
solids.push(box(-15.4,-7.5,1.5,9.6,BASE,21.1));
// De gebruiker heeft 30 m totale hoogte gekozen: spitsvoet 21,1 m en top 30 m.
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
const cap=Manifold.hull([...oct(TC[0],TC[1],3.7).map(([x,y])=>[x,y,21.0]),...oct(TC[0],TC[1],.45).map(([x,y])=>[x,y,30])]);solids.push(cap);
// Vier compacte dakkapellen met ondersteunde voet aan de spits.
for(const angle of [0,90,180,270]){
 let p=box(1.0,1.9,-.5,.5,23.8,25.1).rotate([0,0,angle]).translate([TC[0],TC[1],0]);solids.push(p);
}
let church=Manifold.union(solids);
for(const x of [-5.5,0,5.7,11.4])for(const side of [-1,1])church=church.subtract(box(x-1,x+1,side<0?-9.25:9.5,side<0?-8.7:10.1,2.5,6.6));
for(const y of [4.3,6.8])for(const side of [-1,1])church=church.subtract(box(side<0?-15.65:-7.8,side<0?-15.1:-7.25,y-.5,y+.5,14,19.2));
for(const x of [-12.7,-10.2])for(const side of [-1,1])church=church.subtract(box(x-.5,x+.5,side<0?1.25:9.35,side<0?1.8:9.85,14,19.2));
church=church.subtract(box(-15.65,-15.1,5.0,6.1,BASE,3.0));
// Oostelijke gevel: vensterreeksen en de ronde rozet boven de toegang.
for(const y of [-6.4,-2.1,2.1,6.4])church=church.subtract(box(15.55,16.15,y-.65,y+.65,2.5,6.8));
const rozet=Manifold.cylinder(.6,.8,.8,20).rotate([0,90,0]).translate([15.55,0,10.5]);church=church.subtract(rozet);
const parts=[["building:kerk",church]];
const META={name:"De Grote Kerk Veendam",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0047100000270903"],description:"Brede historische zaalkerk met toren en verbonden aanbouwen; gebruiker kiest 30 m totale hoogte wegens AHN-gat in spits.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0047100000270903","https://monumentenregister.cultureelerfgoed.nl/monumenten/36884","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Veendam)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://nl.wikipedia.org/wiki/Grote_Kerk_(Veendam)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-de-grote-kerk-veendam.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


