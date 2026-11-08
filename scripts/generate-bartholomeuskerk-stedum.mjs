import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="bartholomeuskerk-stedum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[242064.752,593661.263],X_AXIS=[-.955527,-.294904];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const roof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[x0,(y0+y1)/2,r],[x1,(y0+y1)/2,r]]);
const crossRoof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[(x0+x1)/2,y0,r],[(x0+x1)/2,y1,r]]);
// Romanogotische kruiskerk, polygonale koorsluiting en zadeldaktoren.
const nave=prism(rect(-21.2,15.4,-6.0,5.6),BASE,9.6);
const naveRoof=roof(-21.2,15.4,-6.0,5.6,9.55,17.9);
const cross=prism(rect(-10.4,-.5,-14.0,14.5),BASE,9.9);
const crossCap=crossRoof(-10.4,-.5,-14.0,14.5,9.85,16.3);
const choirPlan=[[-21.1,-6.0],[-23.7,-3.9],[-24.6,-1.0],[-24.2,3.2],[-21.1,5.6]].reverse();
const choir=prism(choirPlan,BASE,9.4);
const choirRoof=Manifold.hull([...choirPlan.map(([x,y])=>[x,y,9.35]),[-21.1,-.2,17.9]]);
const annex=prism(rect(-19,-11,-10.7,-5.7),BASE,8.7);
const annexRoof=roof(-19,-11,-10.7,-5.7,8.65,14.1);
const tower=prism(rect(17.2,28.0,-6.0,3.6),BASE,30.4);
const towerRoof=roof(17.2,28.0,-6.0,3.6,30.35,38.3);
const connector=prism(rect(15.2,17.4,-5.9,4.8),BASE,8.8);
const connectorRoof=roof(15.2,17.4,-5.9,4.8,8.75,16.4);
let church=Manifold.union([nave,naveRoof,cross,crossCap,choir,choirRoof,annex,annexRoof,tower,towerRoof,connector,connectorRoof]);
function niche(x,y,z,height,width,rot=0){const p=[[-width/2,0],[width/2,0],[width/2,height-width/2],[0,height],[-width/2,height-width/2]];return Manifold.extrude(new CrossSection([p]),.5).rotate([90,0,0]).translate([x,y+.15,z]).rotate([0,0,rot]);}
// Twee gevelzones met diepe spaarvelden en vensters, vereenvoudigd op printschaal.
for(const x of [2.0,4.1,6.2,8.4,10.5,12.6])for(const y of [-6.0,5.6]){church=church.subtract(niche(x,y,1.0,3.5,1.1));church=church.subtract(niche(x,y,5.4,2.5,1.05));}
for(const y of [-12,-9.5,-7,7,9.5,12]){church=church.subtract(niche(y,.5,1.0,3.5,1.1,90));church=church.subtract(niche(y,.5,5.4,2.5,1.05,90));}
for(const x of [-9,-7,-5,-3,-1.5])for(const y of [-14,14.5]){church=church.subtract(niche(x,y,1.0,3.6,1.1));church=church.subtract(niche(x,y,5.5,2.8,1.05));}
church=church.subtract(niche(0,-28,.1,4.1,1.8,90));
church=church.subtract(Manifold.cylinder(.55,1.15,1.15,24).rotate([0,90,0]).translate([27.6,-1.2,8.0]));
// Zadeldaktoren met galmgaten, wijzerplaat en toegang.
for(const x of [20,22.4,24.8])for(const y of [-6.0,3.6])church=church.subtract(niche(x,y,23.1,3.6,1.15));
church=church.subtract(niche(22.5,3.6,.1,3.8,1.6));
church=church.subtract(Manifold.cube([2,.5,2],true).translate([22.5,3.55,28.3]));
const parts=[["building:kerk",church]];
const META={name:"Bartholomeuskerk Stedum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.0,groundOffsetMetres:BASE,groundSamplePoints:[[-23,-8],[-15,-17],[-3,-17],[8,-8],[20,-8],[30,-8],[30,8],[15,9],[0,17],[-15,15],[-25,8]],replacesBuildings:["NL.IMBAG.Pand.0024100000145896"],description:"Romanogotische kruiskerk met koorsluiting en forse zadeldaktoren.",realWorld:{groundNapM:2.0,naveRidgeM:17.9,towerRidgeM:38.3},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0024100000145896","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/34504"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-bartholomeuskerk-stedum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





