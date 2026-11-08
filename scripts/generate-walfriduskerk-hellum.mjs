import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="walfriduskerk-hellum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[251885,584479],X_AXIS=[.994,.11];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const roof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[x0,(y0+y1)/2,r],[x1,(y0+y1)/2,r]]);
// Zaalkerk en rondgesloten koor; maaiveld NAP +2,6 m.
const nave=prism(rect(-11.25,12,-4.5,5.3),BASE,8.0);
const naveRoof=roof(-11.25,12,-4.5,5.3,7.95,13.75);
const apsePlan=[[11.9,-4.5],[13.4,-4.2],[14.3,-3.8],[15.1,-3.2],[15.7,-2.4],[16.2,-1.6],[16.5,-.7],[16.6,.3],[16.6,1.3],[16.3,2.2],[15.9,3.1],[15.3,3.9],[14.6,4.6],[13.8,5.1],[12.8,5.4],[11.9,5.5]];
const apse=prism(apsePlan,BASE,8.0);
const apseRoof=Manifold.hull([...apsePlan.map(([x,y])=>[x,y,7.95]),[11.9,.4,13.75],[12.4,.4,13.0]]);
// Aangebouwde toren met houten belfort en slanke vierzijdige spits.
const tx=-13.55,ty=.25;
const tower=prism(rect(-15.9,-11.15,-2.6,3.1),BASE,15.0);
// De uitkragende omloop wordt door een schuine overgang gedragen; de balustrade
// wordt op printschaal als volle rand vereenvoudigd.
const transition=Manifold.hull([[tx-2.35,ty-2.85,14.7],[tx+2.35,ty-2.85,14.7],[tx-2.35,ty+2.85,14.7],[tx+2.35,ty+2.85,14.7],[tx-2.65,ty-3.15,15.2],[tx+2.65,ty-3.15,15.2],[tx-2.65,ty+3.15,15.2],[tx+2.65,ty+3.15,15.2]]);
const ledge=prism(rect(tx-2.65,tx+2.65,ty-3.15,ty+3.15),15.15,15.45);
const belfry=prism(rect(tx-2.05,tx+2.05,ty-2.55,ty+2.55),15.4,18.1);
const spire=Manifold.hull([[tx-2.35,ty-2.85,18.05],[tx+2.35,ty-2.85,18.05],[tx-2.35,ty+2.85,18.05],[tx+2.35,ty+2.85,18.05],[tx-.45,ty-.45,26.2],[tx+.45,ty-.45,26.2],[tx-.45,ty+.45,26.2],[tx+.45,ty+.45,26.2]]);
let church=Manifold.union([nave,naveRoof,apse,apseRoof,tower,transition,ledge,belfry,spire]);
function sideNiche(x,y){return Manifold.extrude(new CrossSection([[-.6,0],[.6,0],[.6,2.7],[0,3.3],[-.6,2.7]]),.7).rotate([90,0,0]).translate([x,y+.3,2.0]);}
for(const x of [-7,-2,3,8])for(const y of [-4.5,5.3])church=church.subtract(sideNiche(x,y));
// Ondiepe, gesloten galmgatnissen met puntige bovenzijde blijven steunvrij.
function bellNiche(offset,rotation,extent){
 const profile=[[-.48,0],[.48,0],[.48,1.45],[0,1.93],[-.48,1.45]];
 return Manifold.extrude(new CrossSection([profile]),.65).rotate([90,0,0]).translate([offset,extent+.2,15.58]).rotate([0,0,rotation]).translate([tx,ty,0]);
}
for(const rot of [0,180])for(const offset of [-.68,.68])church=church.subtract(bellNiche(offset,rot,2.55));
for(const rot of [90,270])for(const offset of [-.8,.8])church=church.subtract(bellNiche(offset,rot,2.05));
const parts=[["building:kerk",church]];
const META={name:"Walfriduskerk Hellum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.6,groundOffsetMetres:BASE,groundSamplePoints:[[0,-6],[-8,-5],[8,-6],[0,6],[8,6]],replacesBuildings:["NL.IMBAG.Pand.0040100000014587"],description:"Middeleeuwse zaalkerk met ronde koorsluiting en aangebouwde toren.",realWorld:{groundNapM:2.6,roofRidgeM:13.75,towerRoofApproxM:26.2},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0040100000014587","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://api.ellipsis-drive.com/v3/ogc/wcs/94037eea-4196-48db-9f83-0ef330a7655e?request=getCapabilities&version=1.0.0&requestedEpsg=28992","https://monumentenregister.cultureelerfgoed.nl/monumenten/33810"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-walfriduskerk-hellum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));




