import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="rk-kerk-onze-lieve-vrouw-visitatie-velp";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X naar de toren langs de nok; maaiveld ca. +16,4 m NAP.
const BASE=-0.3,ORIGIN=[195242,445294.5],X_AXIS=[.973,.23];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const box=(x,y,z,cx,cy,cz)=>Manifold.cube([x,y,z],true).translate([cx,cy,cz]);
// Middenschip met vrijliggende lichtbeuk en zijbeuken met lessenaarsdaken.
const core=prism(rect(-6.8,16.2,-4.4,4.4),BASE,15.3);
const coreRoof=Manifold.hull([[-6.8,-4.4,15.25],[16.2,-4.4,15.25],[-6.8,4.4,15.25],[16.2,4.4,15.25],[-6.8,0,22.4],[16.2,0,22.4]]);
const aisles=[];
for(const sign of [-1,1]){
 const y0=sign<0?-8.0:4.2,y1=sign<0?-4.2:9.1,inner=sign<0?-4.2:4.2;
 aisles.push(prism(rect(-6.8,18.3,y0,y1),BASE,9.0));
 aisles.push(Manifold.hull([[-6.8,y0,8.95],[18.3,y0,8.95],[-6.8,y1,8.95],[18.3,y1,8.95],[-6.8,inner,12.1],[18.3,inner,12.1]]));
}
// Dwarsschip met twee topgevels en een nok dwars op het schip.
const transept=prism(rect(-15.9,-6.5,-8.2,9.2),BASE,14.3);
const transeptRoof=Manifold.hull([[-15.9,-8.2,14.25],[-6.5,-8.2,14.25],[-15.9,9.2,14.25],[-6.5,9.2,14.25],[-11.2,-8.2,22.4],[-11.2,9.2,22.4]]);
// Driezijdig gesloten koor en een lage sacristie aan de zuidzijde.
const cp=[[-23.8,-1.3],[-21.2,-4.1],[-15.6,-4.1],[-15.6,5.1],[-21.0,5.1],[-23.8,2.3]];
const choir=prism(cp,BASE,14.1);
const choirRoof=Manifold.hull([...cp.map(([x,y])=>[x,y,14.05]),[-20.7,.5,22.1],[-15.6,.5,22.1]]);
const sacristy=prism(rect(-17.5,-9.8,-16.5,-8),BASE,7.0);
const sacRoof=Manifold.hull([[-17.5,-16.5,6.95],[-9.8,-16.5,6.95],[-17.5,-8,6.95],[-9.8,-8,6.95],[-13.65,-16.5,10.5],[-13.65,-8,10.5]]);
// Toren en slanke achtzijdige spits; 63 m is de onafhankelijke bouwhoogte.
const tower=prism(rect(16.0,22.7,-3,4.4),BASE,33.0);
const oct=(cx,cy,r,z)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(19.35,.7,4.0,32.95),...oct(19.35,.7,.45,63)]);
// Vieringruiter: onderste octagon en eveneens printbare naald.
const lantern=prism(oct(-8.6,.4,1.4,0).map(([x,y])=>[x,y]),17.0,24.2);
const rider=Manifold.hull([...oct(-8.6,.4,1.4,24.15),...oct(-8.6,.4,.45,34.3)]);
// Lage aanbouw en verbindingsgang maken deel uit van het vervangen BAG-pand.
const chapels=[prism(rect(12,19,-7.8,-2.8),BASE,8.0),prism(rect(12,19,4.2,9.1),BASE,8.0),prism(rect(12.3,15.2,8.9,24.5),BASE,3.5)];
for(const sign of [-1,1]){
 const y0=sign<0?-7.8:4.2,y1=sign<0?-2.8:9.1;
 chapels.push(Manifold.hull([[12,y0,7.95],[19,y0,7.95],[12,y1,7.95],[19,y1,7.95],[15.5,(y0+y1)/2,10.8]]));
}
const braces=[];for(const sign of [-1,1])for(const x of [-4,1,6,11]){
 const y=sign<0?-8:9.1;braces.push(box(1.1,1.1,6.3,x,y,2.85));
 braces.push(Manifold.hull([[x-.55,y-.55,6.0],[x+.55,y-.55,6.0],[x-.55,y+.55,6.0],[x+.55,y+.55,6.0],[x-.55,sign<0?-7.7:8.8,7.0],[x+.55,sign<0?-7.7:8.8,7.0]]));
}
let church=Manifold.union([core,coreRoof,...aisles,transept,transeptRoof,choir,choirRoof,sacristy,sacRoof,tower,spire,lantern,rider,...chapels,...braces]);
const arch=(a,z,w,h,r)=>{const n=a*Math.PI/180;return prism([[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]],0,.7).rotate([90,0,0]).rotate([0,0,a+90]).translate([Math.cos(n)*(r-.5),Math.sin(n)*(r-.5),z]);};
for(const x of [-2,3,8]){church=church.subtract(arch(-90,2.7,1.5,3.7,8).translate([x,0,0]));church=church.subtract(arch(90,2.7,1.5,3.7,9.1).translate([x,0,0]));}
for(const x of [-3,2,7,12]){church=church.subtract(arch(-90,12.5,1.2,2.4,4.4).translate([x,0,0]));church=church.subtract(arch(90,12.5,1.2,2.4,4.4).translate([x,0,0]));}
for(const a of [90,180,270])for(const off of [-1.4,1.4]){const n=a*Math.PI/180;church=church.subtract(arch(a,26.0,1.2,5.0,a===180?3.35:3.7).translate([19.35-Math.sin(n)*off,.7+Math.cos(n)*off,0]));}
church=church.subtract(arch(0,0,1.8,4.5,3.35).translate([19.35,.7,0]));
const parts=[["building:kerk",church]];
const META={name:"RK Kerk Onze Lieve Vrouw Visitatie Velp",origin:ORIGIN,xAxis:X_AXIS,groundHeight:16.4,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0275100000005784"],description:"Neogotische kruisbasiliek met toren, hoge naaldspits en vieringruiter.",realWorld:{groundNapM:16.4,towerHeightM:63},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0275100000005784","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/42147","https://www.skyscrapercenter.com/building/rk-kerk-onze-lieve-vrouw-visitatie/6294","https://kennis.cultureelerfgoed.nl/index.php/Complexen/519335"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-rk-kerk-onze-lieve-vrouw-visitatie-velp.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

