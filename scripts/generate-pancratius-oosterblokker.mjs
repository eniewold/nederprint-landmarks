import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='pancratius-oosterblokker';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[136928,520321.4],X_AXIS=[.984,.179];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Schip, dwarspanden, vijfzijdig koor en toren; AHN5 maaiveld NAP +0,41 m.
let nave=roofY(box(.7,38.8,-6.1,6.0,BASE,17.4),0,17.4,1.38);
let choir=roofY(prism([[37.5,-6.2],[39,-5.8],[42,-4.8],[44,-2.2],[44,1.6],[42.2,4.2],[39,5.6],[37.5,5.7]],BASE,17.4),0,17.4,1.38);
choir=plane(choir,-1.38,0,78.1);
let transept=roofX(box(19.4,31.1,-12.8,12.8,BASE,17.4),25.25,17.4,1.43);
let tower=box(-2.55,3.45,-3.4,3.2,BASE,25.6);
let spire=Manifold.cylinder(17.9,3.1,.06,8).rotate([0,0,22.5]).translate([.45,-.1,25.55]);
let supports=[];for(const x of [3.5,7.6,11.5,15.3,34.5,38.8])for(const side of [-1,1]){let a=box(x-.48,x+.48,side<0?-7.0:5.7,side<0?-5.7:6.9,BASE,6.0);a=plane(a,0,side<0?1:-1,12.5);supports.push(a)}
for(const x of [19.7,30.8])for(const side of [-1,1]){let a=box(x-.48,x+.48,side<0?-13.5:12.4,side<0?-12.4:13.5,BASE,5.8);a=plane(a,0,side<0?1:-1,18.5);supports.push(a)}
let church=Manifold.union([nave,choir,transept,tower,spire,...supports]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5.6,9.5,13.4,17.2,33,37])for(const y of [-5.85,6.25])church=church.subtract(niche(x,y,2,1.35,5.2));
for(const y of [-12.55,13.05]){for(const x of [21.8,28.7])church=church.subtract(niche(x,y,2,1.3,5.5));church=church.subtract(niche(25.25,y,2,2.5,7));church=church.subtract(niche(25.25,y,12,1.1,2.4));}
for(const [a,b] of [[[39,5.6],[42.2,4.2]],[[42.2,4.2],[44,1.6]],[[44,-2.2],[42,-4.8]],[[42,-4.8],[39,-5.8]]]){const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),x=(a[0]+b[0])/2-.12*Math.sin(ang),y=(a[1]+b[1])/2+.12*Math.cos(ang);church=church.subtract(niche(0,0,2,1.25,5).rotate([0,0,ang*180/Math.PI]).translate([x,y,0]));}
for(const y of [-3.15,3.45])for(const x of [-.4,1.25])church=church.subtract(niche(x,y,21.1,1,3.2));
for(const side of [-1,1])for(const y of [-.85,.85])church=church.subtract(niche(0,0,21.1,1,3.2).rotate([0,0,90]).translate([side<0?-2.8:3.2,y,0]));
church=church.subtract(niche(0,0,.15,1.3,3).rotate([0,0,90]).translate([-2.8,0,0]));
const parts=[['building:kerk',church]];
const META={name:'Pancratius Oosterblokker',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.411,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0498100000000112'],description:'Eenbeukige kruiskerk met zadeldaken, vijfzijdig koor en toren met naaldspits.',realWorld:{groundNapM:.411,roofRidgeNapM:17.814,ahnTowerTopNapM:43.929},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0498100000000112','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Oosterblokker','https://monumentenregister.cultureelerfgoed.nl/monumenten/14055','https://monumentenregister.cultureelerfgoed.nl/monumenten/14056','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-pancratius-oosterblokker.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

















