import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-agathakerk-boekel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection,Mesh}=wasm;
const BASE=-.5,ORIGIN=[174923,401613],X_AXIS=[.99849,-.055];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Dak uit aaneengesloten zijvlakken met paraboolprofiel; geen gestapelde lagen.
function parabolaSpire(cx,cy,z0,z1,r0,r1){const v=[],t=[],n=16;for(let i=0;i<=n;i++){let f=i/n,r=r1+(r0-r1)*Math.pow(1-f,.65),z=z0+(z1-z0)*f;for(const [x,y] of [[-r,-r],[r,-r],[r,r],[-r,r]])v.push(cx+x,cy+y,z)}for(let i=0;i<n;i++)for(let j=0;j<4;j++){let a=4*i+j,b=4*i+(j+1)%4,c=b+4,d=a+4;t.push(a,b,c,a,c,d)}t.push(0,2,1,0,3,2);let k=4*n;t.push(k,k+1,k+2,k,k+2,k+3);return new Manifold(new Mesh({numProp:3,vertProperties:Float32Array.from(v),triVerts:Uint32Array.from(t)}))}
// Driebeukig schip met eigen zadeldak en laag aflopende zijbeuken.
let nave=box(-19.2,13.5,-7.8,5.8,BASE,23.15);nave=plane(nave,0,1.3,24.45);nave=plane(nave,0,-1.3,21.85);
let sides=[];for(const s of [-1,1]){let b=box(-19.2,13.3,s<0?-15:5.6,s<0?-7.6:12.9,BASE,11.7);b=plane(b,0,s<0?.75:-.75,s<0?23:21.4);sides.push(b)}
// Voorportaal en doopkapel aan weerszijden van de vrijstaande toren.
let porch=box(-24.4,-19,-7.8,5.8,BASE,17.4);porch=plane(porch,0,1.3,18.7);porch=plane(porch,0,-1.3,16.1);
let baptistery=box(-24.4,-19,5.6,9.5,BASE,7.6);
let tower=box(-24.5,-19.2,-12.9,-7.6,BASE,29.4);
let spire=parabolaSpire(-21.85,-10.25,29.3,43.2,2.65,.47);
// Koor, veelhoekige sluiting en de twee lage aanbouwen.
let choir=box(13.3,19.9,-7.8,5.8,BASE,18.5);choir=plane(choir,0,1.2,19.7);choir=plane(choir,0,-1.2,17.3);
let apse=prism([[19.7,-6.7],[23,-5.7],[25,-3],[25,.4],[23.1,3.1],[19.7,4.1]],BASE,13.5);apse=plane(apse,0,1.1,14.9);apse=plane(apse,0,-1.1,12.1);apse=plane(apse,-1.1,0,35.17);
let low1=box(13.1,19.9,-11.7,-7.5,BASE,7.1);let low2=box(13,24.6,5.6,16.6,BASE,7.2);
let lantern=Manifold.cylinder(2.3,.7,.7,8).translate([9.9,-.8,22.7]).add(Manifold.cylinder(3.1,.7,.47,8).translate([9.9,-.8,24.9]));
let church=Manifold.union([nave,...sides,porch,baptistery,tower,spire,choir,apse,low1,low2,lantern]);
for(const x of [-15.8,-3.1,9.7]){let b=box(x-1.6,x+1.6,-16.5,-14.8,BASE,7);b=plane(b,0,1,23.5);church=church.add(b)}
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.2).rotate([90,0,0]).translate([x,y,z])};
// Drie portalen en groot raam in de westgevel.
for(const y of [-5,-1,3])church=church.subtract(niche(0,0,BASE,1.8,4).rotate([0,0,90]).translate([-24.7,y,0]));
church=church.subtract(niche(0,0,7,5.0,4.5).rotate([0,0,90]).translate([-24.7,-1,0]));
for(const x of [-15,-9,-3,3,9]){let y=[-15,-3,9].includes(x)?-16.0:-14.5;church=church.subtract(niche(x,y,3,1.4,4.8));church=church.subtract(niche(x,13.3,3,1.4,4.8))}
for(const a of [0,90,180,270]){let n=niche(0,3.1,23.5,1.3,3.6).rotate([0,0,a]).translate([-21.85,-10.25,0]);church=church.subtract(n)}
const parts=[["building:kerk",church]];
const META={name:"Sint-Agathakerk Boekel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:16.097,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0755100000003612"],description:"Driebeukige kerk met zijtoren en karakteristieke parabolische spits.",realWorld:{groundNapM:16.097,ahn4TopNapM:57.27,ahn5TopNapM:59.326},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0755100000003612","https://monumentenregister.cultureelerfgoed.nl/monumenten/518257","https://www.heemkundekringboekel.nl/sint-agathakerk/","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-agathakerk-boekel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








