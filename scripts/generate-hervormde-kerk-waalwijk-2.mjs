import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='hervormde-kerk-waalwijk-2';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[131805,411152],X_AXIS=[.991,.129];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);

// Zaalkerk met gordingdak; goot NAP +7,3 en nok NAP +14,36 m.
let nave=roofY(box(-9.35,10.2,-6.3,5.1,BASE,12.73),-.6,12.73,1.23);
// Topgevels steken minimaal boven de dakvlakken uit.
let gables=[];for(const x of [-9.2,10])gables.push(roofY(box(x-.18,x+.18,-6.3,5.1,BASE,13.1),-.6,13.1,1.25));
// Witte achthoekige grafkapel, een lage ingesnoerde koepel volgens foto.
let chapel=Manifold.cylinder(6.25-BASE,3.2,3.2,8).rotate([0,0,22.5]).translate([.5,7.6,BASE]);
let prof=[[0,6.2],[3.2,6.2],[2.9,6.8],[2.5,7.5],[2.1,8.25],[1.55,9.0],[1,9.6],[.55,10.0],[0,10.2]];
let chapelRoof=Manifold.revolve([prof],8).rotate([0,0,22.5]).translate([.5,7.6,0]);
let chapelCap=Manifold.cylinder(.9,.55,.55,8).translate([.5,7.6,10.1]);
// Pastorie met schilddak, eigen BAG-pand; de lange nok loopt langs de tuin.
let house=roofX(box(-15.5,-9.1,-15.0,5,BASE,10.0),-12.3,10.0,.9);
house=plane(plane(house,0,.9,20.5),0,-.9,11.5);
// Aangebouwde kleine hal en plat afgedekte aanbouw aan achterzijde.
let connector=box(-9.2,-4.4,-11.6,-6.1,BASE,3.4);
let belfry=Manifold.cylinder(3.1,1.05,1.05,8).translate([.4,-.6,11.9]);
let spire=Manifold.cylinder(5.65,1.05,.45,8).translate([.4,-.6,14.9]);
let church=Manifold.union([nave,...gables,chapel,chapelRoof,chapelCap,house,connector,belfry,spire]);
// Spitsboogvensters zijn blinde nissen, open klokkenstoel als ondiepe uitsparing.
const niche=(x,y,z,w,h)=>{let p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.9).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-6.6,-3.8,-1,1.8,4.6,7.4])for(const y of [-5.8,5.6])church=church.subtract(niche(x,y,2.2,1.1,3.2));
// Tuin- en straatgevel van de pastorie: vensters met 0,4 m reliëf.
for(const y of [-12,-8.5,-5,-1.5,2])for(const z of [1.0,4.2])church=church.subtract(niche(0,0,z,1,2.1).rotate([0,0,90]).translate([-15.9,y,0]));
for(const x of [-14,-12,-10.3])for(const z of [1,4.2,7])church=church.subtract(niche(x,5.5,z,1,1.8));
for(const ang of [0,45,90,135,180]){let r=ang*Math.PI/180,x=.5+2.8*Math.cos(r),y=7.6+2.8*Math.sin(r);church=church.subtract(niche(0,0,1.8,1.15,2.7).rotate([0,0,ang+90]).translate([x,y,0]));}
for(const ang of [0,90,180,270]){let r=ang*Math.PI/180;church=church.subtract(niche(0,0,13,1.0,1.55).rotate([0,0,ang+90]).translate([.4+.65*Math.cos(r),-.6+.65*Math.sin(r),0]));}
const parts=[['building:kerk',church]];
const META={name:'Hervormde Kerk Besoijen Waalwijk',origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.633,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0867100000044532','NL.IMBAG.Pand.0867100000044533'],description:'Zaalkerk met dakruiter, grafkapel en aangebouwde pastorie.',realWorld:{groundNapM:1.633,ahn5TopNapM:22.166},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0867100000044532','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0867100000044533','https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_Besoyen','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-kerk-waalwijk-2.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















