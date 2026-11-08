import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-laurentiuskerk-breda';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.4,ORIGIN=[113251,397879],X_AXIS=[.9659,.2588],GROUND_NAP=3.61;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const pointRoof=(x,y,r,z0,z1,n=4)=>Manifold.hull([...Array.from({length:n},(_,i)=>[x+r*Math.cos(Math.PI/4+i*2*Math.PI/n),y+r*Math.sin(Math.PI/4+i*2*Math.PI/n),z0]),[x,y,z1]]);
// Middenschip, koor en dwarsschip met onafhankelijke zadeldakvlakken.
let nave=box(-25.8,19,-5.3,5.3,BASE,23.9);nave=plane(nave,0,1.48,23.9);nave=plane(nave,0,-1.48,23.9);
let transept=box(-5.3,5.3,-16.4,16.4,BASE,23.9);transept=plane(transept,1.48,0,23.9);transept=plane(transept,-1.48,0,23.9);
let north=box(-25.8,16.5,5.1,10.8,BASE,12.3);north=plane(north,0,-.54,17.8);
let south=box(-25.8,16.5,-10.8,-5.1,BASE,12.3);south=plane(south,0,.54,17.8);
// Dwarskapellen met eigen zadeldaken volgens de nokken van de 3D BAG.
const chapels=[];for(const y of [-1,1]){let c=box(-15.6,-10,-14.2*y,-8*y,BASE,14.4);if(y<0)c=box(-15.6,-10,8,14.2,BASE,14.4);c=plane(c,1.7,0,36.16);c=plane(c,-1.7,0,-7.36);chapels.push(c);}
// Koor met driezijdige afsluiting en lagere oostelijke aanbouw.
let choir=prism([[18,-5.3],[20,-4.7],[22,-2],[22,2],[20,4.7],[18,5.3]],BASE,23.9); choir=plane(choir,0,1.48,23.9);choir=plane(choir,0,-1.48,23.9);choir=plane(choir,-1.5,0,53.9);
let rear=box(17.5,23.3,6.5,14.8,BASE,12.2);rear=plane(rear,1.4,0,-15.52);rear=plane(rear,-1.32,0,38.34);
const corridor=prism([[22.8,8.2],[23.3,8.7],[23.3,10.6],[32.8,10.8],[32.7,15],[22.8,14.8]],BASE,3.1);
// Aan weerszijden van het koor een diagonaal gesloten kapel.
const choirsides=[];for(const y of [-1,1]){const shape=[[6,5],[17.5,5],[19,7],[18.5,11],[15.5,13],[12,13],[9,11],[6,10]].map(([x,v])=>[x,y*v]);if(y<0)shape.reverse();let part=prism(shape,BASE,13.4);part=plane(part,0,y*.75,20.0);part=plane(part,-.8,0,27);choirsides.push(part);}
// Achtzijdige viering en achthoekige spits, gemeten uit AHN5.
const drum=box(-5.3,5.3,-5.3,5.3,BASE,35.0);
const spire=Manifold.hull([...oct(6.2,34.8),...oct(.45,60.6)]);
const turrets=[];for(const x of [-4.7,4.7])for(const y of [-4.7,4.7]){turrets.push(box(x-1.35,x+1.35,y-1.35,y+1.35,BASE,31));turrets.push(pointRoof(x,y,1.9,30.9,38.3));}
const front=[];for(const y of [-6.5,6.5]){front.push(box(-27.5,-24.5,y-1.6,y+1.6,BASE,20.5));front.push(pointRoof(-26,y,2.25,20.4,26.5));}
const piers=[];for(const x of [-21,-16,-11,10,14])for(const y of [-10.8,10.8])piers.push(box(x-.5,x+.5,y-.45,y+.45,BASE,7.5));
let church=Manifold.union([nave,transept,north,south,choir,rear,corridor,drum,spire,...choirsides,...chapels,...turrets,...front,...piers]);
const cuts=[];for(const x of [-23,-18.5,-9.5])for(const y of [-10.8,10.8])cuts.push(box(x-.8,x+.8,y-.35,y+.35,2.5,7.1));
for(const y of [-2.6,0,2.6])cuts.push(box(-26.1,-25.4,y-.7,y+.7,7,15.5));
for(const x of [-22,-18,-14,-10,10,14])for(const y of [-5.3,5.3])cuts.push(box(x-.65,x+.65,y-.3,y+.3,12.8,15.2));
for(const y of [-16.4,16.4])for(const x of [-2.6,0,2.6])cuts.push(box(x-.65,x+.65,y-.3,y+.3,5,13));
for(const k of [-3,-1,1,3]){for(const a of [-5.3,5.3]){cuts.push(box(a-.35,a+.35,k-.5,k+.5,26,32));cuts.push(box(k-.5,k+.5,a-.35,a+.35,26,32));}}
for(const y of [-1.3,0,1.3])cuts.push(box(21.7,22.3,y-.48,y+.48,8,16));
cuts.push(box(-26.2,-25.3,-1.3,1.3,BASE,4));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Laurentiuskerk Breda',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0758100000014207'],description:'Kruisbasiliek met achthoekige vieringtoren en vier hoektorentjes.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:60.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000014207','https://www.ahn.nl/dataroom','https://kunstinbreda.nl/religieus/kerken/breda/st-laurentiuskerk-ginnekenweg/','https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Laurentiuskerk_(Ginneken)']};
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


