import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="antonius-van-paduakerk-ulft";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[222931,435267],X_AXIS=[.77,.638];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Middenschip en lager aangebouwde zijbeuken; de kruisende kappen zijn vlakke dakvlakken.
let ship=box(-1,28,-4.8,4.8,BASE,10.3),sr=box(-1,28,-4.8,4.8,10.25,14.6);sr=plane(sr,0,.9,14.6);sr=plane(sr,0,-.9,14.6);
let side=[];for(const [a,b,sign] of [[-7.6,-4.7,1],[4.7,6.9,-1]]){let w=box(2.2,21.5,a,b,BASE,7.0),r=box(2.2,21.5,a,b,6.95,8.2);r=plane(r,0,sign*.45,sign===1?10.4:10.3);side.push(w,r)}
let transept=box(21.3,33,-10.2,10.1,BASE,10.1),tr=box(21.3,33,-10.2,10.1,10.05,14.7);tr=plane(tr,.82,0,-7.6);tr=plane(tr,-.82,0,37.0);
let choir=box(28,38,-4.1,4.1,BASE,11),qr=box(28,38,-4.1,4.1,10.95,14.7);qr=plane(qr,0,.9,14.7);qr=plane(qr,0,-.9,14.7);
let apsis=Manifold.cylinder(8.4,4,4,24,false).translate([38,0,BASE]).intersect(box(37.9,42.1,-4.1,4.1,BASE,8.4));
let ar=Manifold.cylinder(4,4,.02,24,false).translate([38,0,7.9]).intersect(box(37.9,42.1,-4.1,4.1,7.85,12));
// Consistorie en bijgebouwen op de zuidflank, verbonden met de kerk.
let flat=box(21.7,31.1,-15.6,-10.1,BASE,4.5),sac=box(30.9,37.5,-15.7,-9.9,BASE,5.8),sc=box(30.9,37.5,-15.7,-9.9,5.75,8.8);
sc=plane(sc,.9,0,-22.0);sc=plane(sc,-.9,0,39.6);sc=plane(sc,0,.9,20.15);sc=plane(sc,0,-.9,-2.55);
// Symmetrische torens: gesloten klokkenetage met blinde galmgaten voor printschaal.
let towers=[];for(const y of [-6.25,5.55]){let t=box(-1.6,2.5,y-2,y+2,BASE,18.9);let p=Manifold.hull([[-1.6,y-2,18.85],[2.5,y-2,18.85],[2.5,y+2,18.85],[-1.6,y+2,18.85],[-.05,y-.5,23.4],[.95,y-.5,23.4],[.95,y+.5,23.4],[-.05,y+.5,23.4]]);towers.push(t,p)}
// Dakruiter als aaneengesloten achthoek met koepel; ijle zuilen zijn massief vereenvoudigd.
let rider=Manifold.cylinder(2.2,.9,.9,8,false).translate([27.2,0,14.3]);let dome=Manifold.sphere(.9,16).translate([27.2,0,16.3]).intersect(box(26.2,28.2,-1,1,16.3,17.3));
let church=Manifold.union([ship,sr,...side,transept,tr,choir,qr,apsis,ar,flat,sac,sc,...towers,rider,dome]);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.8).rotate([90,0,0]).translate([x,y,z])};
for(const x of [5,9,13,17])for(const y of [-7.25,7.25])church=church.subtract(arch(x,y,2,1.1,3.3));
for(const x of [6,10,14,18])for(const y of [-4.45,5.15]){let hole=Manifold.cylinder(.8,.8,.8,16,false).rotate([90,0,0]).translate([x,y,9.3]);church=church.subtract(hole)}
for(const y of [-6.25,5.55]){for(const z of [6,15])church=church.subtract(arch(y,0,z,1.1,z===6?6:2.8).rotate([0,0,90]).translate([-1.7,0,0]));for(const x of [-.5,.8])for(const yy of [y-1.65,y+2.35])church=church.subtract(arch(x,yy,15,1,2.8));}
church=church.subtract(arch(0,0,BASE,2.2,3.8).rotate([0,0,90]).translate([-1.1,0,0]));
let rose=Manifold.cylinder(.8,1.8,1.8,24,false).rotate([0,90,0]).translate([-1.1,0,9.4]);church=church.subtract(rose);
for(const y of [-2.5,0,2.5])church=church.subtract(arch(0,0,3,1.1,4.5).rotate([0,0,-90]).translate([42.1,y,0]));
// Vijf hoge vensters in elke dwarse eindgevel, zichtbaar op de bronfoto.
for(const x of [23.2,25.2,27.2,29.2,31.2])for(const y of [-9.85,10.45])church=church.subtract(arch(x,y,6.0,1.0,3.8));
// Twee dakkapellen op het middenschip, rechtstreeks verbonden met het dak.
for(const x of [8,15])for(const y of [-3.6,3.6]){let d=box(x-.5,x+.5,y-.5,y+.5,10.5,12.7);d=plane(d,1,0,12.7-x);d=plane(d,-1,0,12.7+x);church=Manifold.union([church,d]);}
const parts=[["building:kerk",church]];
const META={name:"Antonius van Paduakerk Ulft",origin:ORIGIN,xAxis:X_AXIS,groundHeight:14.52,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1509100000203444"],description:"Neoromaanse kruisbasiliek met twee torens, dakruiter en halfronde apsis.",realWorld:{groundNapM:14.52,ahnTopNapM:38.756},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1509100000203444","https://monumentenregister.cultureelerfgoed.nl/monumenten/523685","https://commons.wikimedia.org/wiki/Category:Antonius,_Ulft","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-antonius-van-paduakerk-ulft.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





