import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-jozef-of-heuvelse-kerk-tilburg';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[134495,396587],X_AXIS=[.957,.29];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);

// Hoofdkap: 3D BAG-nok NAP 42,06, goot ca. NAP 35,2.
let nave=roofY(box(-34,31,-4.4,4.6,BASE,27.3),.1,27.3,1.55);
// Lage zijbeuken, met enkelvoudige lessenaardaken.
let aisles=[];for(const s of [-1,1]){let a=s<0?-9.8:4.4,b=s<0?-4.3:10;let m=box(-30.5,29,a,b,BASE,15.1);m=plane(m,0,s<0?1.0:-1.0,19.5);aisles.push(m)}
// Grote dwarskap over de viering en de jaren vijftig verlengde dwarsarmen.
let trans=roofX(box(.8,10.4,-15.1,15.2,BASE,27.3),5.6,27.3,1.55);
let extensions=[];for(const s of [-1,1]){let y0=s<0?-29.6:15.2,y1=s<0?-15.1:29.6;extensions.push(roofX(box(.8,10.4,y0,y1,BASE,14.8),5.6,14.8,.7))}
// Koor en kooromgang, veelhoekig, met vijf afzonderlijke straalkapellen.
let choir=roofY(prism([[25,-4.4],[29.8,-4.4],[32.7,-3.1],[34.2,-1.5],[34.2,1.7],[32.7,3.3],[29.8,4.6],[25,4.6]],BASE,27.3),.1,27.3,1.55);choir=plane(choir,-1.55,0,73.8);
// Lage kooromgang met vijf zelfstandig leesbare, uitkragende straalkapellen.
let ambulatory=prism([[24,-9.0],[29,-9.0],[33.4,-6.6],[36.3,-3.4],[36.3,3.6],[33.4,6.8],[29,9.2],[24,9.2]],BASE,9.2);
let chapels=[];
for(const [x,y] of [[29.5,-8.0],[34,-6.0],[37.0,0.1],[34,6.2],[29.5,8.2]]){
 const r=3.0;
 const footprint=[[-r,-r*.68],[-r*.68,-r],[r*.68,-r],[r,-r*.68],[r,r*.68],[r*.68,r],[-r*.68,r],[-r,r*.68]];
 let cap=prism(footprint,BASE,15.8);
 cap=roofY(cap,0,15.8,1.7);cap=roofX(cap,0,15.8,1.7);
 chapels.push(cap.translate([x,y,0]));
}
// Twee achthoekige torens met acht geveltoppen en achtvlakkige spitse daken.
let towers=[];for(const y of [-7.4,7.7]){let shaft=box(-37.5,-28.7,y-4.2,y+4.2,BASE,26.8);let oct=Manifold.cylinder(19.0,4.3,4.3,8).rotate([0,0,22.5]).translate([-33.1,y,26.4]);let sp=Manifold.cylinder(27.0,4.1,.45,8).rotate([0,0,22.5]).translate([-33.1,y,44.5]);towers.push(shaft,oct,sp);for(let k=0;k<8;k++){let ang=k*45;let wedge=prism([[-1.45,0],[1.45,0],[0,3.8]],0,.7).rotate([90,0,0]).translate([0,-3.7,43.0]).rotate([0,0,ang]).translate([-33.1,y,0]);towers.push(wedge)}}
// Middentop, drie toegangsportalen en vieringtorentje.
let front=roofX(box(-38,-33,-4.1,4.3,BASE,30.4),-35.5,30.4,1.5);
let portals=[];for(const [y,w] of [[-7.4,3.1],[.1,4.4],[7.7,3.1]]){let p=roofY(box(-39,-36,y-w/2,y+w/2,BASE,7.5),y,7.5,1.1);portals.push(p)}
let lantern=Manifold.cylinder(4.0,1.55,1.55,8).translate([5.6,0,27]);let lanternRoof=Manifold.cylinder(8.5,1.55,.45,8).translate([5.6,0,31]);
// Regelmatige steunberen van schip, koor en dwarsarmen.
let supports=[];for(const x of [-28,-23,-18,-13,-8,-3,15,20,25])for(const s of [-1,1]){let a=s<0?-11.1:9.6;let p=box(x-.55,x+.55,a,a+1.5,BASE,11.1);p=plane(p,0,s<0?1:-1,21);supports.push(p)}
// Luchtbogen als massieve schuine steunberen: open bogen zijn te dun op 1:1000.
for(const x of [16,21,26])for(const side of [-1,1]){
 let b=box(x-.55,x+.55,side<0?-9.8:4.4,side<0?-4.4:10,BASE,20.5);
 supports.push(plane(b,0,side<0?1:-1,25));
}
for(const y of [-27,-22,-17,17,22,27])for(const x of [.6,9.8])supports.push(box(x-.55,x+.55,y-.55,y+.55,BASE,12));
let church=Manifold.union([nave,...aisles,trans,...extensions,choir,ambulatory,...chapels,...towers,front,...portals,lantern,lanternRoof,...supports]);
// Blinde spitsboogvensters, 0,6 m diep, en de grote rozet als ronde nis.
const niche=(x,y,z,w,h)=>{let p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.3).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-25,-20,-15,-10,-5,17,22,27])for(const y of [-9.2,10.7])church=church.subtract(niche(x,y,3,2,6.4));
for(const y of [-25,-20,20,25])for(const x of [.3,9.8])church=church.subtract(niche(0,0,3,1.6,6).rotate([0,0,90]).translate([x,y,0]));
// Hoge vensters op de koorsluiting en de vijf kapellen rondom.
for(const [x,y,ang] of [[30.4,-3.3,25],[32.0,-1.8,50],[33.5,.1,90],[32.0,2.0,130],[30.4,3.5,155]]){
 church=church.subtract(niche(0,0,12.0,1.8,9.0).rotate([0,0,ang]).translate([x,y,0]));
}
for(const [x,y,ang] of [[29.5,-10.5,0],[35.5,-8,45],[39.4,0.1,90],[35.5,8.2,135],[29.5,10.7,180]]){
 church=church.subtract(niche(0,0,2.7,1.7,5.8).rotate([0,0,ang]).translate([x,y,0]));
}
for(const y of [-7.4,7.7]){church=church.subtract(niche(0,0,27.8,2.4,13).rotate([0,0,90]).translate([-38.1,y,0]));church=church.subtract(niche(0,0,11,3.0,9).rotate([0,0,90]).translate([-38.1,y,0]))}
for(const y of [-7.4,.1,7.7])church=church.subtract(niche(0,0,0.8,y===.1?2.4:1.7,4.8).rotate([0,0,90]).translate([-39.2,y,0]));
church=church.subtract(Manifold.cylinder(1.2,3.1,3.1,32).rotate([0,90,0]).translate([-38.5,.1,15.8]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Jozef of Heuvelse kerk Tilburg',origin:ORIGIN,xAxis:X_AXIS,groundHeight:14.763,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0855100000306086'],description:'Neogotische kruisbasiliek met twee 72 meter hoge torens, kooromgang en dwarsarmen.',realWorld:{groundNapM:14.763,ahn4TopNapM:86.56,publishedTowerHeightM:72},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000306086','https://commons.wikimedia.org/wiki/Category:Heuvelse_kerk','https://bhic.nl/ontdekken/verhalen/de-heuvelkerk-in-tilburg','https://service.pdok.nl/rws/ahn/wcs/v1_0']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-jozef-of-heuvelse-kerk-tilburg.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















