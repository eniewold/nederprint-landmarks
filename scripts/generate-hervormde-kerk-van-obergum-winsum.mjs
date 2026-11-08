import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-kerk-van-obergum-winsum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[230048.106,594711.070],X_AXIS=[-.9984,-.056];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const roof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[x0,(y0+y1)/2,r],[x1,(y0+y1)/2,r]]);
// Zaalkerk met driezijdige sluiting en aangebouwde zadeldaktoren.
const nave=prism(rect(-11.0,12.1,-4.0,4.0),BASE,6.3);
const naveRoof=roof(-11,12.1,-4,4,6.25,11.55);
const choirPoly=[[-11.0,-4.0],[-13.8,-2.6],[-14.8,0],[-13.8,2.6],[-11,4.0]].reverse();
const choir=prism(choirPoly,BASE,6.3);
const choirRoof=Manifold.hull([...choirPoly.map(([x,y])=>[x,y,6.25]),[-11,0,11.55]]);
const tower=prism(rect(11.4,17.0,-2.55,2.55),BASE,14.5);
const towerRoof=roof(11.4,17,-2.55,2.55,14.45,18.85);
let church=Manifold.union([nave,naveRoof,choir,choirRoof,tower,towerRoof]);
function niche(x,y,z,height,width,rot=0){const p=[[-width/2,0],[width/2,0],[width/2,height-width/2],[0,height],[-width/2,height-width/2]];return Manifold.extrude(new CrossSection([p]),.5).rotate([90,0,0]).translate([x,y+.15,z]).rotate([0,0,rot]);}
for(const x of [-9,-4.5,0,4.5,8.5])for(const y of [-4,4])church=church.subtract(niche(x,y,1.7,3.4,1.2));
for(const rot of [0,180])church=church.subtract(niche(0,2.55,10.4,2.2,1.1,rot).translate([14.2,0,0]));
church=church.subtract(niche(0,-17,.1,3.8,1.5,90));
// Twee schuine steunberen bij het verlengde koor.
for(const [x,y] of [[-8,-4],[-8,4]]){const out=y+Math.sign(y)*1.1,inside=y-Math.sign(y)*.15;church=Manifold.union([church,Manifold.hull([[x-.5,inside,BASE],[x+.5,inside,BASE],[x-.5,out,BASE],[x+.5,out,BASE],[x-.5,inside,5.0],[x+.5,inside,5.0],[x-.5,out,3.9],[x+.5,out,3.9]])]);}
const parts=[["building:kerk",church]];
const META={name:"Hervormde kerk van Obergum Winsum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:5.15,groundOffsetMetres:BASE,groundSamplePoints:[[-15,-6],[-8,-8],[0,-9],[8,-8],[18,-6],[19,2],[12,6],[3,7],[-7,7],[-16,6]],replacesBuildings:["NL.IMBAG.Pand.0053100000006263"],description:"Zaalkerk met driezijdig koor en zadeldaktoren op een wierde.",realWorld:{groundNapM:5.15,naveRidgeM:11.55,towerRidgeM:18.85},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0053100000006263","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.winshem.nl/wp-content/uploads/Info-2005-nr3.pdf","https://monumentenregister.cultureelerfgoed.nl/monumenten/39042"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-van-obergum-winsum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));




