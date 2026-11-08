import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="laurentiuskerk-breda";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[113251,397716],X_AXIS=[.98081,.195],GROUND=[[0,-10],[6,-14],[23,-6],[26,0],[14,7],[6,14],[-10,7]];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Laatgotisch schip, dwarsbeuk en koor, elk onder een zadeldak.
let nave=box(-22.1,3,-5.2,5.6,BASE,18.78);nave=plane(nave,0,1.2,18.54);nave=plane(nave,0,-1.2,19.02);
let cross=box(2.5,10.6,-12.5,12.5,BASE,18.78);cross=plane(cross,1.1,0,12.51);cross=plane(cross,-1.1,0,25.05);
let crossSide=box(10.4,13.8,-11.2,11.2,BASE,10.5);crossSide=plane(crossSide,-.8,0,21.54);
let bridge=box(-2.8,3,-8.5,8.4,BASE,14.0);bridge=plane(bridge,0,1,22.5);bridge=plane(bridge,0,-1,22.4);
let choir=prism([[13.6,-4.4],[21.2,-4.4],[25.2,-2.5],[25.2,2.6],[21.2,4.5],[13.6,4.5]],BASE,17.8);choir=plane(choir,0,1.1,17.8);choir=plane(choir,0,-1.1,17.8);choir=plane(choir,-1.1,0,41.12);
// Ingebouwde westtoren en vierzijdige spits, plus kleine vieringruiter.
let tower=box(-22.1,-16.6,-2.7,2.8,BASE,21.5);
let spire=Manifold.cylinder(7.55,3.88,.47,4).rotate([0,0,45]).translate([-19.35,.05,21.45]);
let crossing=Manifold.cylinder(2.5,.85,.85,8).translate([5.7,.6,18.4]).add(Manifold.cylinder(4.95,.85,.47,8).translate([5.7,.6,20.85]));
let church=Manifold.union([nave,cross,crossSide,bridge,choir,tower,spire,crossing]);
// Steunberen en brede gevelnissen op de in het register beschreven traveeën.
for(const y of [-2,2.2]){let b=box(-23.2,-21.9,y-.5,y+.5,BASE,9);b=plane(b,1,0,32.2);church=church.add(b)}
for(const y of [-2.5,2.55]){let b=box(25.0,26.3,y-.5,y+.5,BASE,7.5);b=plane(b,-1,0,33.8);church=church.add(b)}
for(const x of [2.8,10.1])for(const s of [-1,1]){let b=box(x-.55,x+.55,s<0?-13.3:12.3,s<0?-12.3:13.3,BASE,10);b=plane(b,0,s<0?1:-1,s<0?23.3:23.3);church=church.add(b)}
for(const x of [-21.5,-17,-12.1,-7.2])for(const s of [-1,1]){let b=box(x-.48,x+.48,s<0?-5.9:5.4,s<0?-5:6.2,BASE,8.5);b=plane(b,0,s<0?1:-1,s<0?14.4:14.7);church=church.add(b)}
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.1).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-15,-10,-5])for(const y of [-4.7,6.0])church=church.subtract(niche(x,y,3,1.5,6));
for(const y of [-12.0,13.0])church=church.subtract(niche(5.7,y,4,2.5,8));
for(const x of [17,20])for(const y of [-3.9,4.9])church=church.subtract(niche(x,y,3,1.4,6));
for(const a of [0,90,180])for(const x of [-1,1]){let n=niche(x,3.15,17.2,1,3.5).rotate([0,0,a]).translate([-19.35,.05,0]);church=church.subtract(n)}
const parts=[["building:kerk",church]];
const META={name:"Laurentiuskerk Ginneken Breda",origin:ORIGIN,xAxis:X_AXIS,groundHeight:4.196,groundOffsetMetres:BASE,groundSamplePoints:GROUND,replacesBuildings:["NL.IMBAG.Pand.0758100000007007"],description:"Laatgotische protestantse kruiskerk met ingebouwde westtoren en dakruiter.",realWorld:{groundNapM:4.196,ahn4TopNapM:32.63,ahn5TopNapM:33.239,ahn5CrossingNapM:30.019},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000007007","https://monumentenregister.cultureelerfgoed.nl/monumenten/10355","https://protestantsegemeenteginneken.nl/geschiedenis.html","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-laurentiuskerk-breda.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








