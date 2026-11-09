import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='hervormde-kerk-abbekerk';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[130163.765,527299.025],X_AXIS=[.9705,.241];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Eenvoudig schip en vijfzijdige koorsluiting; BAG en AHN5, grond NAP +0,37 m.
let nave=roofY(box(2.1,24.1,-4.68,4.79,BASE,13.0),.05,13.0,1.22);
let choir=roofY(prism([[23,-4.68],[24.3,-4.5],[26.3,-3.4],[27.8,-1],[27.8,1],[26.5,3.4],[24.1,4.79],[23,4.79]],BASE,13),.05,13,1.22);
choir=plane(choir,-1.32,0,44.7);
// Gemetselde toren met vierkante romp en achtzijdige spits, gemeten AHN5 tot NAP +34,9 m.
let tower=box(-2.4,2.45,-2.67,2.67,BASE,20.8);
let spire=Manifold.cylinder(14,2.8,.08,8).rotate([0,0,22.5]).translate([0,0,20.7]);
let supports=[];for(const x of [12.98,18.65,23.4])for(const side of [-1,1]){let a=box(x-.48,x+.48,side<0?-5.85:4.6,side<0?-4.5:6.1,BASE,6.2);a=plane(a,0,side<0?1:-1,side<0?11.1:11.4);supports.push(a)}
let church=Manifold.union([nave,choir,tower,spire,...supports]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5.4,9.1,15.8,21.1])for(const y of [-4.4,5.0])church=church.subtract(niche(x,y,1.9,1.35,4.5));
for(const [a,b] of [[[24.1,4.79],[26.5,3.4]],[[26.5,3.4],[27.8,1]],[[27.8,-1],[26.3,-3.4]],[[26.3,-3.4],[24.3,-4.5]]]){const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),x=(a[0]+b[0])/2-.12*Math.sin(ang),y=(a[1]+b[1])/2+.12*Math.cos(ang);church=church.subtract(niche(0,0,2,1.25,4.3).rotate([0,0,ang*180/Math.PI]).translate([x,y,0]));}
for(const y of [-2.4,2.95])church=church.subtract(niche(0,y,15.8,1.25,3.4));
for(const y of [-.8,.8])church=church.subtract(niche(0,0,15.8,1.0,3.4).rotate([0,0,90]).translate([-2.65,y,0]));
church=church.subtract(niche(0,0,.2,1.3,3.1).rotate([0,0,90]).translate([-2.65,0,0]));
const parts=[['building:kerk',church]];
const META={name:'Hervormde Kerk Abbekerk',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.373,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0420100000011815'],description:'Witgepleisterde zaalkerk met vijfzijdig koor en gemetselde toren; BAG en AHN5 geven plattegrond en dakhoogten.',realWorld:{groundNapM:.373,roofRidgeNapM:13.35,ahn5TowerTopNapM:34.93},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0420100000011815','https://commons.wikimedia.org/wiki/Category:Protestantse_Kerk_(Abbekerk)','https://monumentenregister.cultureelerfgoed.nl/monumenten/30655','https://monumentenregister.cultureelerfgoed.nl/monumenten/30656','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-abbekerk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















