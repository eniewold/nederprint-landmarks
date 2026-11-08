import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="protestantse-gemeente-velp";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X from the semicircular rear annex toward the entrance at Kerkstraat.
const BASE=-.5,ORIGIN=[195666,445059],X_AXIS=[.91585705,.4015045],GROUND_NAP=14.317;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// The two intersecting hipped roofs of the T-shaped Waterstaatskerk.
let cross=box(-3.3,7.8,-16,16,BASE,13.98);cross=plane(cross,-.77,0,15.67);cross=plane(cross,.77,0,12.29);cross=plane(cross,0,-.77,22.0);cross=plane(cross,0,.77,22.0);
let nave=box(7.7,18.2,-5.51,5.56,BASE,13.98);nave=plane(nave,0,-.77,13.98);nave=plane(nave,0,.77,13.98);
// Rondeel: a low semicircular wing surrounding an open courtyard.
const ringProfile=[[9.2,BASE],[14.3,BASE],[14.3,2.7],[9.2,4.5]];
const roundRoof=Manifold.revolve([ringProfile],64).translate([-5,0,0]);
const clip=box(-20,-4.999,-15,15,BASE,5);const rondeel=Manifold.intersection([roundRoof,clip]);
const link1=box(-5.1,-3.1,-13.5,-9.0,BASE,4.1),link2=box(-5.1,-3.1,9.0,13.5,BASE,4.1);
// Entrance columns, projecting triangular pediment and the characteristic bell gable.
const columns=[-3.1,3.1].map(y=>Manifold.cylinder(9.7,.5,.5,16).translate([18.1,y,BASE]));
const pediment=Manifold.hull([[18.15,-5.55,10],[18.15,5.55,10],[18.85,-5.55,10.7],[18.85,5.55,10.7],[18.15,0,13.3],[18.85,0,13.3]]);
const gablePoly=[[-3.8,12.0],[-2.8,13],[-2.0,16.2],[-1.7,16.9],[1.7,16.9],[2,16.2],[2.8,13],[3.8,12.0]];
const bell=Manifold.extrude(new CrossSection([gablePoly.reverse()]),.85).rotate([90,0,90]).translate([17.4,0,0]);
const pilasters=[];for(const y of [-15.2,-11.5,-7,7,11.5,15.2])pilasters.push(box(7.65,8.12,y-.45,y+.45,BASE,9.6));
let church=Manifold.union([cross,nave,rondeel,link1,link2,...columns,...pilasters,pediment,bell]);
const frontNiche=(y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]];return Manifold.extrude(new CrossSection([p]),.5).rotate([90,0,90]).translate([17.76,y,z]);};
const sideNiche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]];return Manifold.extrude(new CrossSection([p]),.4).rotate([90,0,0]).translate([x,y,z]);};
const cuts=[frontNiche(0,.05,2.0,4.6),frontNiche(-4.3,2.6,1.0,4.2),frontNiche(4.3,2.6,1.0,4.2)];
for(const y of [-13.2,-9.2,9.2,13.2]){let c=frontNiche(y,2.7,1.0,4.2).translate([-10.4,0,0]);cuts.push(c);}
for(const x of [-1.5,2.2,5.9]){cuts.push(sideNiche(x,16.06,2.7,1.1,4.0));cuts.push(sideNiche(x,-15.65,2.7,1.1,4.0));}
// Windows along the outer wall of the modern Rondeel.
for(const deg of [110,130,150,170,190,210,230,250]){
 const a=deg*Math.PI/180,x=-5+14.25*Math.cos(a),y=14.25*Math.sin(a);
 cuts.push(box(-.55,.55,-.1,.35,1.0,2.25).rotate([0,0,deg+90]).translate([x,y,0]));
}
cuts.push(Manifold.cylinder(.5,.58,.58,24).rotate([0,90,0]).translate([17.8,0,15]));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Protestantse Gemeente Velp",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0275100000008585"],description:"T-vormige Grote Kerk met neoclassicistische ingang en het halfronde Rondeel; +X richting de voorgevel.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0275100000008585","https://monumentenregister.cultureelerfgoed.nl/monumenten/504520","https://commons.wikimedia.org/wiki/Category:Waterstaatskerk_(Velp)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-gemeente-velp.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


