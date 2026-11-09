import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-servatiuskerk-erp';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[170193.2,401252.7],X_AXIS=[.9973,-.0735],GROUND_NAP=11.71;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const cyl=(x,y,r,z0,z1,n=8)=>Manifold.cylinder(z1-z0,r,r,n).translate([x,y,z0]);
const dome=(x,y,r,z0,h)=>Manifold.revolve([[[0,z0],[r*.72,z0],[r,z0+h*.32],[r*.9,z0+h*.58],[r*.52,z0+h*.84],[0,z0+h]]],16).translate([x,y,0]);
// Brede hallenkerk, zadeldak en afgeschuind koordak als afzonderlijke vlakken.
let hall=prism([[0,-10.1],[47.5,-10.1],[53.4,-4],[53.4,4],[47.5,10.1],[0,10.1]],BASE,24.65);
hall=plane(hall,0,.8,24.65);hall=plane(hall,0,-.8,24.65);hall=plane(hall,-1.3,0,86.14);
// Westtoren met vier torentjes en centrale lantaarn onder uivormige kap.
const tower=box(-3.6,3.6,-3.6,3.6,BASE,32.9);
const drum=cyl(0,0,2.4,32.7,44.7,8), top=dome(0,0,2.4,44.65,4.25);
const corners=[];for(const x of [-2.7,2.7])for(const y of [-2.7,2.7]){corners.push(cyl(x,y,1.05,32.3,36.9,4));corners.push(Manifold.cylinder(1.7,1.05,0,4).translate([x,y,36.85]));}
// Achtergevel: dakvenster op het schildvlak, zichtbaar op de foto.
const rearDormer=box(49.7,51.3,-.8,.8,18.5,21.4);
const rearRoof=Manifold.hull([[49.7,-.9,21.3],[51.3,-.9,21.3],[51.3,.9,21.3],[49.7,.9,21.3],[50.5,0,22.4]]);
// Kleine dakruiter op de koornok.
const rider=cyl(40.8,0,1.15,23.8,28.2,8),riderTop=dome(40.8,0,1.2,28.1,1.4);
const piers=[];for(const x of [4,12,20,28,36,44])for(const y of [-10.1,10.1])piers.push(box(x-.46,x+.46,y-.34,y+.34,BASE,16.6));
let church=Manifold.union([hall,tower,drum,top,...corners,rearDormer,rearRoof,rider,riderTop,...piers]);
const cuts=[];for(const x of [8,16,24,32,40])for(const y of [-10.1,10.1])cuts.push(box(x-1.05,x+1.05,y-.33,y+.33,4,13.3));
for(const y of [-2.0,0,2.0]){cuts.push(box(-3.95,-3.3,y-.5,y+.5,24,30));cuts.push(box(3.3,3.95,y-.5,y+.5,24,30));}
for(const x of [-2.0,0,2.0])for(const y of [-3.6,3.6])cuts.push(box(x-.5,x+.5,y-.35,y+.35,24,30));
for(const a of [-2.25,2.25]){cuts.push(box(a-.35,a+.35,-.5,.5,39,43));cuts.push(box(-.5,.5,a-.35,a+.35,39,43));}
for(const y of [-7.4,7.4])cuts.push(box(-.35,.35,y-.8,y+.8,4,13));
cuts.push(box(-3.95,-3.3,-1.15,1.15,8,15.7));
cuts.push(box(-3.95,-3.3,-1.05,1.05,18.3,22.2));
cuts.push(box(53.05,53.75,-1.15,1.15,6,13.1));
for(const y of [-2.5,2.5])cuts.push(box(53.05,53.75,y-.55,y+.55,1.6,4.5));
cuts.push(box(-3.95,-3.3,-.9,.9,BASE,5));
for(const y of [-10.1,10.1])cuts.push(box(49,51,y-.35,y+.35,4,13));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Servatiuskerk Erp',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0860100002601923'],description:'Neoclassicistische hallenkerk met Cuypers-torenspits uit 1897.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:48.9},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0860100002601923','https://www.ahn.nl/dataroom','https://franciscusparochiemeierijstad.nl/algemeen/geschiedenis/st-servatiuskerk-erp/','https://commons.wikimedia.org/wiki/Category:Sint-Servatiuskerk_(Erp)']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-voormalige-hervormde-kerk-stevensweert.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


