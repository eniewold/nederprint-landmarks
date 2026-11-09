import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-urbanuskerk-amstelveen';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[119882.5,474925.5],X_AXIS=[.999,-.04];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);
// Kruiskerk en schuin aangebouwde pastorie; hoogten ten opzichte van NAP -1,29 m.
let nave=roofY(box(-26.5,-3.4,-5.4,5.5,BASE,20.0),.05,20.0,1.72);
let crossing=roofX(box(-4.2,5.5,-10.7,11,BASE,20.1),.65,20.1,1.9);
// Vijf afzonderlijke haakse kappen per zijbeuk, zichtbaar op de PDOK-ortho.
let chapels=[];for(const x of [-24.2,-19.9,-15.6,-11.3,-7])for(const side of [-1,1]){let a=roofX(box(x-2.05,x+2.05,side<0?-9:4.7,side<0?-4.7:9.1,BASE,11.35),x,11.35,1.25);chapels.push(a)}
// Koor met vijfzijdige sluiting en lagere flankerende ruimtes.
let choir=roofY(prism([[5,-5.0],[16.4,-5],[19,-3],[20,-1.4],[20,1.3],[19,3.4],[16.4,5],[5,5]],BASE,20.1),0,20.1,1.7);choir=plane(choir,-1.4,0,43.0);
let flanks=[];for(const side of [-1,1]){let a=roofY(box(5,14,side<0?-9:4.8,side<0?-4.8:9,BASE,13),side<0?-6.9:6.9,13,.9);flanks.push(a)}
// Vieringtoren met vier dakhoeklantaarns; AHN meet spits tot NAP +49,15 m.
let tower=box(-4.0,4.2,-4.5,4.5,BASE,26.1);
let spire=Manifold.cylinder(24.4,5.5,.08,4).rotate([0,0,45]).translate([.1,0,26.0]);
let corners=[];for(const x of [-3.4,3.5])for(const y of [-3.7,3.7]){corners.push(Manifold.cylinder(3,1.25,1.25,8).translate([x,y,25.3]));corners.push(Manifold.cylinder(4.2,1.25,.12,8).translate([x,y,28.2]))}
// Aangebouwde pastorie draait 27 graden ten opzichte van de kerk.
let wing=roofX(box(-7,7,0,15,BASE,16.1),0,16.1,.82).rotate([0,0,-27.4]).translate([-2,-26.3,0]);
let dormers=[];for(const y of [3,7.5,12]){let d=roofY(box(3.3,5.2,y-.65,y+.65,11,14.2),y,14.2,1);dormers.push(d.rotate([0,0,-27.4]).translate([-2,-26.3,0]))}
let wingLink=roofX(box(-3.2,4,-14,-8.8,BASE,10),.4,10,1.0);
let church=Manifold.union([nave,crossing,...chapels,choir,...flanks,tower,spire,...corners,wing,wingLink,...dormers]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,.55).rotate([90,0,0]).translate([x,y,z])};
for(const [a,b] of [[[16.4,5],[19,3.4]],[[19,3.4],[20,1.3]],[[20,-1.4],[19,-3]],[[19,-3],[16.4,-5]]]){const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),x=(a[0]+b[0])/2-.12*Math.sin(ang),y=(a[1]+b[1])/2+.12*Math.cos(ang);church=church.subtract(niche(0,0,3,1.5,6).rotate([0,0,ang*180/Math.PI]).translate([x,y,0]));}
for(const x of [-4,0,4])for(const z of [1.3,5.5])church=church.subtract(niche(x,.2,z,1.1,2.5).rotate([0,0,-27.4]).translate([-2,-26.3,0]));
for(const x of [-24.2,-19.9,-15.6,-11.3,-7])for(const y of [-8.7,9.35])church=church.subtract(niche(x,y,1.7,1.35,4));
for(const y of [-2.6,0,2.6])church=church.subtract(niche(0,0,9,1.5,6).rotate([0,0,90]).translate([-26.75,y,0]));
church=church.subtract(niche(0,0,.2,2.2,5).rotate([0,0,90]).translate([-26.75,0,0]));
for(const x of [-2,1.1,3.5])for(const y of [-4.2,4.75])church=church.subtract(niche(x,y,19,1.2,4.5));
for(const x of [-2,1.5])for(const y of [-10.4,11.25])church=church.subtract(niche(x,y,3,1.55,7));
const parts=[['building:kerk',church]];
const META={name:'Sint-Urbanuskerk Amstelveen',origin:ORIGIN,xAxis:X_AXIS,groundHeight:-1.293,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0362100001091256'],description:'Sint-Urbanuskerk Nes aan de Amstel met vieringtoren, dwarsschip, vijf zijbeukdaken en schuin aangebouwde pastorie.',realWorld:{groundNapM:-1.293,ahn5RoofNapM:18.86,ahn5TowerNapM:49.15},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0362100001091256','https://commons.wikimedia.org/wiki/Category:St-Urbanuskerk_(Nes_aan_de_Amstel)','https://monumentenregister.cultureelerfgoed.nl/monumenten/8142','https://www.ahn.nl/dataroom']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-urbanuskerk-amstelveen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















