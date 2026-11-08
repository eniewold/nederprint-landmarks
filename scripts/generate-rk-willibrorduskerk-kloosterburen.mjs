import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="rk-willibrorduskerk-kloosterburen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[221974.285,600530.664],X_AXIS=[.264396,.964414];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const roof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[x0,(y0+y1)/2,r],[x1,(y0+y1)/2,r]]);
const crossRoof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[(x0+x1)/2,y0,r],[(x0+x1)/2,y1,r]]);
// Kerkas loopt van het vijfzijdig koor naar de toren; maten in meters.
const nave=prism(rect(-17,21.3,-8.2,6.8),BASE,9.8);
const naveRoof=roof(-17,21.3,-8.2,6.8,9.75,15.9);
const transept=prism(rect(-9,-.5,-11.5,9.4),BASE,10.1);
const transeptRoof=crossRoof(-9,-.5,-11.5,9.4,10.05,15.0);
const choirPoly=[[-16.7,-4.8],[-19.3,-4.8],[-21.4,-3],[-22,-.7],[-21.4,1.6],[-19.3,3.4],[-16.7,3.4]];
const choir=prism([...choirPoly].reverse(),BASE,10.0);
const choirRoof=Manifold.hull([...choirPoly.map(([x,y])=>[x,y,9.95]),[-16.7,-.7,14.5],[-19,-.7,13.2]]);
const sacristy=prism(rect(-18,-9,-12.5,-7.9),BASE,4.4);
const sacRoof=roof(-18,-9,-12.5,-7.9,4.35,6.2);
const tx=21.1,ty=-.45;
const tower=prism(rect(tx-3.5,tx+3.5,ty-3.5,ty+3.5),BASE,28.0);
const octagon=(radius,z)=>Array.from({length:8},(_,i)=>[tx+radius*Math.cos(Math.PI/8+i*Math.PI/4),ty+radius*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...octagon(3.8,27.9),...octagon(.49,52.0)]);
const gable=(rot)=>Manifold.hull([[-3.1,-3.4,27.5],[3.1,-3.4,27.5],[0,-3.4,31.2],[-3.1,-2.7,27.5],[3.1,-2.7,27.5],[0,-2.7,31.2]].map(([x,y,z])=>{let a=rot*Math.PI/180;return[tx+x*Math.cos(a)-y*Math.sin(a),ty+x*Math.sin(a)+y*Math.cos(a),z]}));
let church=Manifold.union([nave,naveRoof,transept,transeptRoof,choir,choirRoof,sacristy,sacRoof,tower,spire,...[0,90,180,270].map(gable)]);
function niche(x,y,z,height,width,rot=0){const p=[[-width/2,0],[width/2,0],[width/2,height-width/2],[0,height],[-width/2,height-width/2]];return Manifold.extrude(new CrossSection([p]),.55).rotate([90,0,0]).translate([x,y+.15,z]).rotate([0,0,rot]);}
for(const x of [3.5,8,12.6,17])for(const y of [-8.2,6.8])church=church.subtract(niche(x,y,2.1,5.3,1.2));
for(const rot of [0,90,180,270])for(const offset of [-.85,.85]){const cut=niche(offset,3.5,21.0,5.6,1.2).rotate([0,0,rot]).translate([tx,ty,0]);church=church.subtract(cut);}
church=church.subtract(niche(0,-3.5,.05,4.5,1.9).rotate([0,0,90]).translate([tx,ty,0]));
church=church.subtract(niche(0,-3.5,10.0,6.5,1.6).rotate([0,0,90]).translate([tx,ty,0]));
for(const x of [3.5,8,12.6,17])for(const y of [-8.1,6.7])church=Manifold.union([church,prism(rect(x-.5,x+.5,y-.4,y+.4),BASE,7.0)]);
const parts=[["building:kerk",church]];
const META={name:"R.K. Willibrorduskerk Kloosterburen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.4,groundOffsetMetres:BASE,groundSamplePoints:[[-19,6],[-12,10],[4,10],[14,9],[23,5],[23,-6],[5,-10]],replacesBuildings:["NL.IMBAG.Pand.1663100000000360"],description:"Neogotische kruiskerk met vijfzijdig koor en toren met achtkante spits.",realWorld:{groundNapM:1.4,naveRidgeM:15.9,towerRoofApproxM:52},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1663100000000360","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://groningen.erfgoedcms.nl/FY/lemma/kloosterburen","https://monumentenregister.cultureelerfgoed.nl/monumenten/509515"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-rk-willibrorduskerk-kloosterburen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));






