import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="de-protestantse-gemeente-marum-noordwijk";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[212922.458,573520.971],X_AXIS=[-.9559,-.2937];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const roof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[x0,(y0+y1)/2,r],[x1,(y0+y1)/2,r]]);
// Romaans schip met licht inspringend koor en vijfzijdige sluiting.
const nave=prism(rect(-2.2,8.05,-4.05,4.05),BASE,5.4);
const naveRoof=roof(-2.2,8.05,-4.05,4.05,5.35,11.05);
const choir=prism(rect(-8.9,-2.1,-3.25,3.25),BASE,6.35);
const choirRoof=roof(-8.9,-2.1,-3.25,3.25,6.3,11.05);
const apsePoly=[[-8.85,-3.25],[-10.6,-2.8],[-11.65,-1.1],[-11.65,1.1],[-10.6,2.8],[-8.85,3.25]].reverse();
const apse=prism(apsePoly,BASE,6.35);
const apseRoof=Manifold.hull([...apsePoly.map(([x,y])=>[x,y,6.3]),[-8.85,0,11.05]]);
const tx=9.65,ty=0;
const tower=prism(rect(7.8,11.4,-2.55,2.55),BASE,16.5);
const spire=Manifold.hull([[tx-1.8,ty-2.55,16.45],[tx+1.8,ty-2.55,16.45],[tx-1.8,ty+2.55,16.45],[tx+1.8,ty+2.55,16.45],[tx-.45,ty-.45,24.65],[tx+.45,ty-.45,24.65],[tx-.45,ty+.45,24.65],[tx+.45,ty+.45,24.65]]);
let church=Manifold.union([nave,naveRoof,choir,choirRoof,apse,apseRoof,tower,spire]);
function niche(x,y,z,height,width,rotation=0){const p=[[-width/2,0],[width/2,0],[width/2,height-width/2],[0,height],[-width/2,height-width/2]];return Manifold.extrude(new CrossSection([p]),.55).rotate([90,0,0]).translate([x,y+.15,z]).rotate([0,0,rotation]);}
for(const x of [.0,3.0,6.0])for(const y of [-4.05,4.05])church=church.subtract(niche(x,y,1.6,3.0,1.15));
for(const x of [-7.4,-4.3])for(const y of [-3.25,3.25])church=church.subtract(niche(x,y,1.7,3.2,1.15));
for(const rot of [0,180])church=church.subtract(niche(0,2.55,12.2,2.6,1.2,rot).translate([tx,ty,0]));
for(const rot of [90,270])church=church.subtract(niche(0,1.8,12.2,2.6,1.2,rot).translate([tx,ty,0]));
// Schuine steunberen op het schip zoals zichtbaar op historische foto's.
for(const [x,y] of [[3.3,-4.05],[5.4,4.05]]){const yout=y+Math.sign(y)*1.15;const yin=y-Math.sign(y)*.15;church=Manifold.union([church,Manifold.hull([[x-.5,yin,BASE],[x+.5,yin,BASE],[x-.5,yout,BASE],[x+.5,yout,BASE],[x-.5,yin,5.1],[x+.5,yin,5.1],[x-.5,yout,3.95],[x+.5,yout,3.95]])]);}
const parts=[["building:kerk",church]];
const META={name:"Kerk van Marum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:3.2,groundOffsetMetres:BASE,groundSamplePoints:[[-10,-4],[-5,-5],[2,-6],[7,-6],[10,-4],[10,4],[3,6],[-7,5]],replacesBuildings:["NL.IMBAG.Pand.0025100000007244"],description:"Romaanse kerk met versmald koor, vijfzijdige koorsluiting en toren met naaldspits.",realWorld:{groundNapM:3.2,naveRidgeM:11.05,towerRoofApproxM:24.65},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0025100000007244","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/28286"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-de-protestantse-gemeente-marum-noordwijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));







