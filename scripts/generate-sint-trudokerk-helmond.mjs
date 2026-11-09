import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-trudokerk-helmond";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[171043.6,388611.2],X_AXIS=[-.59,-.807];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,r,c,k)=>plane(plane(s,0,k,r-k*c),0,-k,r+k*c);
const roofX=(s,r,c,k)=>plane(plane(s,k,0,r-k*c),-k,0,r+k*c);
// Schip, kruisarmen, kooromgang en vijf radiale kapellen met eigen dakvlakken.
const nave=roofY(box(2.5,39,-5.4,5.4,BASE,24.1),24.1,0,1.2);
const cross=roofX(box(21.6,30.2,-10.2,10.2,BASE,24.2),24.2,25.9,1.25);
let choir=prism([[30,-5.4],[39,-5.4],[43,-3.7],[45,-1.5],[45,1.5],[43,3.7],[39,5.4],[30,5.4]],BASE,24);choir=roofY(choir,24,0,1.2);choir=plane(choir,-1,0,69);
const aisles=[roofY(box(.5,22,-8.5,-5,BASE,12.2),12.2,-5,.7),roofY(box(.5,22,5,8.5,BASE,12.2),12.2,5,.7)];
let ambulatory=prism([[29,-7.7],[39,-7.7],[44,-5.5],[47,-2],[47,2],[44,5.5],[39,7.7],[29,7.7]],BASE,12.2);ambulatory=roofY(ambulatory,12.2,0,.45);ambulatory=plane(ambulatory,-.7,0,45.1);
const chapels=[];for(const deg of [-60,-30,0,30,60]){const t=deg*Math.PI/180,x=40+5.5*Math.cos(t),y=5.5*Math.sin(t);chapels.push(Manifold.cylinder(11.3,2.4,2.4,6).translate([x,y,BASE]));chapels.push(Manifold.cylinder(3.4,2.4,.02,6).translate([x,y,10.8]));}
const sideAnnex=roofY(box(.5,17.8,8,15.2,BASE,8.5),8.5,11.6,.55);
const tower=box(-3.8,3.8,-3.8,3.8,BASE,36.5);
const spire=Manifold.cylinder(24.5,3.65,.45,8).rotate([0,0,22.5]).translate([0,0,36.5]);
const turrets=[];for(const x of [-3.3,3.3])for(const y of [-3.3,3.3])turrets.push(Manifold.cylinder(5,0.8,.4,4).rotate([0,0,45]).translate([x,y,36.3]));
const fleche=[Manifold.cylinder(2.4,1.05,1.05,8).translate([26,0,23.6]),Manifold.cylinder(6,1.05,.45,8).translate([26,0,26])];
const buttresses=[];for(const x of [4,8,12,16,20])for(const y of [-1,1])buttresses.push(roofX(box(x-.48,x+.48,y<0?-9.4:8.4,y<0?-8.4:9.4,BASE,10),10,x,1));
let church=Manifold.union([nave,cross,choir,...aisles,ambulatory,...chapels,sideAnnex,tower,spire,...turrets,...fleche,...buttresses]);
const arch=(x,y,z,w,h,d=.8)=>prism([[-w/2,0],[w/2,0],[w/2,h-w*.6],[0,h],[-w/2,h-w*.6]],0,d).rotate([90,0,0]).translate([x,y,z]);
// Galmgaten en spitsboogramen met voldoende breedte op 1:1000.
for(const y of [-1.4,1.4])church=church.subtract(arch(0,0,27,1.5,6,.9).rotate([0,0,90]).translate([-3.9,y,0]));
for(const x of [-1.3,1.3])for(const y of [-3.7,4.6])church=church.subtract(arch(x,y,27,1.5,6,.9));
for(const y of [-1.2,1.2])church=church.subtract(arch(0,0,16,1.4,7,.8).rotate([0,0,90]).translate([-3.9,y,0]));
church=church.subtract(arch(0,0,0,3,5,.9).rotate([0,0,90]).translate([-3.9,0,0]));
for(const x of [6,10,14,18])church=church.subtract(arch(x,-8.4,2.5,1.5,6,.9));
for(const x of [6,10,14,18])for(const y of [-5.3,6.3])church=church.subtract(arch(x,y,13.5,1.3,5.5,1));
for(const y of [-10.1,11.1])church=church.subtract(arch(26,y,4,3.5,10,.9));
for(const deg of [-60,-30,0,30,60]){const t=deg*Math.PI/180,x=40+5.5*Math.cos(t),y=5.5*Math.sin(t);const niche=arch(0,0,2,1.2,5.8,1).rotate([0,0,90]).translate([1.6,0,0]).rotate([0,0,deg]).translate([x,y,0]);church=church.subtract(niche);}
for(const y of [-1.5,1.5])church=church.subtract(arch(0,0,14,1.3,6,.9).rotate([0,0,90]).translate([44.3,y,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Trudokerk Helmond",origin:ORIGIN,xAxis:X_AXIS,groundHeight:17.745,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0794100000403545"],description:"Kruisbasiliek met vier hoektorentjes en vijf straalkapellen.",realWorld:{groundNapM:17.745,towerHeightM:61},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0794100000403545","https://monumentenregister.cultureelerfgoed.nl/monumenten/21456","https://damiaanhelmond.nl/images/parochiekrant/2024/damiaan-04-2024.pdf","https://commons.wikimedia.org/wiki/Category:Sint-Trudokerk_(Stiphout)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-trudokerk-helmond.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));

if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















