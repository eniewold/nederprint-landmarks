import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kerk-van-den-andel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.3,ORIGIN=[229727.24,600460.18],X_AXIS=[.987,.16];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const roof=(x0,x1,y0,y1,z,r)=>Manifold.hull([[x0,y0,z],[x1,y0,z],[x0,y1,z],[x1,y1,z],[x0,(y0+y1)/2,r],[x1,(y0+y1)/2,r]]);
// Vrijstaande romaanse zaalkerk, kerkgrond ca. NAP +2,4 m.
const nave=prism(rect(-9.94,9.94,-3.73,3.73),BASE,5.6);
const naveRoof=roof(-9.94,9.94,-3.73,3.73,5.55,10.6);
let body=Manifold.union([nave,naveRoof]);
function sideNiche(x,y){return Manifold.extrude(new CrossSection([[-.65,0],[.65,0],[.65,2.8],[0,3.5],[-.65,2.8]]),.7).rotate([90,0,0]).translate([x,y+.3,1.4]);}
for(const x of [-6,-2,2,6])for(const y of [-3.73,3.73])body=body.subtract(sideNiche(x,y));
const portal=Manifold.extrude(new CrossSection([[0,0],[1.5,0],[1.5,2.9],[0,2.9]]),.7).rotate([90,0,90]).translate([-10.2,-.75,0]);body=body.subtract(portal);
// Toren staat apart op een lager deel van de wierde, ca. 0,3 m lager.
const tx=15.53,ty=-10.77,TA=-.6;
const towerBase=prism(rect(tx-2.54,tx+2.54,ty-2.38,ty+2.38),TA,9.1);
const towerRoof=Manifold.hull([[tx-2.54,ty-2.38,9.05],[tx+2.54,ty-2.38,9.05],[tx-2.54,ty+2.38,9.05],[tx+2.54,ty+2.38,9.05],[tx-1,ty-.95,11.8],[tx+1,ty-.95,11.8],[tx-1,ty+.95,11.8],[tx+1,ty+.95,11.8]]);
const rider=prism(rect(tx-.65,tx+.65,ty-.65,ty+.65),11.75,14.6);
const riderRoof=Manifold.hull([[tx-.65,ty-.65,14.55],[tx+.65,ty-.65,14.55],[tx-.65,ty+.65,14.55],[tx+.65,ty+.65,14.55],[tx-.45,ty-.45,16.1],[tx+.45,ty-.45,16.1],[tx-.45,ty+.45,16.1],[tx+.45,ty+.45,16.1]]);
let tower=Manifold.union([towerBase,towerRoof,rider,riderRoof]);
for(const a of [0,90,180,270]){const cut=Manifold.cube([.6,1.2,2.4],true).translate([tx+2.5,ty,7.15]).translate([-tx,-ty,0]).rotate([0,0,a]).translate([tx,ty,0]);tower=tower.subtract(cut);}
const church=Manifold.union([body,tower]);
const parts=[["building:kerk",body],["building:toren",tower]];
const META={name:"Kerk van Den Andel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.4,groundOffsetMetres:BASE,groundSamplePoints:[[0,-5],[-6,-5],[6,-5],[0,5],[15,-7],[18,-11]],replacesBuildings:["NL.IMBAG.Pand.0053100000007247","NL.IMBAG.Pand.0053100000007207"],description:"Middeleeuwse zaalkerk en vrijstaande toren op de wierde.",realWorld:{churchGroundNapM:2.4,towerGroundNapM:2.1,roofRidgeM:10.6,highestPointM:16.1},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0053100000007247","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0053100000007207","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/8582","https://www.groningerkerken.nl/downloads/den_andel_kerkbeschrijving_tz_sw2025.pdf"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kerk-van-den-andel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]+.6)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==2)throw new Error(`expected two detached buildings, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));




