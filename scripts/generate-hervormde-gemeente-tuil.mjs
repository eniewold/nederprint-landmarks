import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-gemeente-tuil";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X runs from the west tower to the east vestry.
const BASE=-.5,ORIGIN=[144789.73725,426013.11],X_AXIS=[.96796921,.25106894],GROUND_NAP=4.469;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(s,m,centre,top)=>{s=plane(s,0,-m,top+m*centre);return plane(s,0,m,top-m*centre);};
let nave=gable(box(1.7,21.65,-4.32,4.32,BASE,12.46),1.25,0,12.46);
let choir=prism([[21.4,-4.32],[22.1,-4.12],[24.7,-1.63],[24.7,1.51],[22.16,4.11],[21.4,4.32]],BASE,12.46);choir=gable(choir,1.25,0,12.46);choir=plane(choir,-1.7,0,49.18);
// Lower 1850 vestry: its own long pitched roof and the cross gable at the entrance.
let vestry=gable(box(24.55,31.57,-2.04,4.62,BASE,6.83),.84,1.29,6.83);
let entry=box(25.2,27.2,-2.35,.1,BASE,5.8);entry=plane(entry,-1.5,0,45.1);entry=plane(entry,1.5,0,-33.5);
const tower=box(-1.71,1.71,-1.77,1.77,BASE,15.63);
const sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]];
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const shoulder=Manifold.hull([...sq(1.71,15.6),...oct(1.15,17.05)]),spire=Manifold.hull([...oct(1.15,17),...oct(.5,24.45)]);
const buttresses=[];for(const x of [1.98,5.78,9.58,13.38,17.18,21.9])for(const sign of [-1,1]){
 let y0=sign<0?-4.87:4.2,y1=sign<0?-4.2:4.87,b=box(x-.44,x+.44,y0,y1,BASE,6.35);b=plane(b,0,sign<0?1:-1,sign<0?11.15:11.15);buttresses.push(b);
}
let church=Manifold.union([nave,choir,vestry,entry,tower,shoulder,spire,...buttresses]);
const sideNiche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-.5],[0,h],[-w/2,h-.5]];return Manifold.extrude(new CrossSection([p]),.38).rotate([90,0,0]).translate([x,y,z]);};
const frontNiche=(y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-.5],[0,h],[-w/2,h-.5]];return Manifold.extrude(new CrossSection([p]),.38).rotate([90,0,90]).translate([-1.77,y,z]);};
const cuts=[];for(const x of [3.9,7.68,11.48,15.28,19.4]){cuts.push(sideNiche(x,4.38,2.4,1.1,3.4));cuts.push(sideNiche(x,-3.98,2.4,1.1,3.4));}
for(const sign of [-1,1]){let y=sign<0?-1.43:1.83;cuts.push(sideNiche(0,y,11.5,.85,2));}
cuts.push(frontNiche(0,.05,1.2,2.6),frontNiche(0,11.5,.85,2));
// Two clock faces at the upper tower walls.
cuts.push(Manifold.cylinder(.34,.5,.5,24).rotate([0,90,0]).translate([-1.77,0,14.1]));
cuts.push(Manifold.cylinder(.34,.5,.5,24).rotate([90,0,0]).translate([0,1.83,14.1]));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Hervormde Gemeente Tuil",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0304100000009486"],description:"Zaalkerk met middeleeuwse toren, driezijdige sluiting en lagere consistorie; +X naar het oosten.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0304100000009486","https://monumentenregister.cultureelerfgoed.nl/monumenten/30342","https://monumentenregister.cultureelerfgoed.nl/monumenten/30343","https://monumentenregister.cultureelerfgoed.nl/monumenten/522051","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Tuil)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-gemeente-tuil.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


