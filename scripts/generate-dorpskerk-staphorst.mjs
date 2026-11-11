// Dorpskerk Staphorst: toren uit 1753, kerk 1952 met uitbreiding 1990.
// Maten uit BAG/3D BAG en AHN; gevels en spitsprofiel uit RCE/Commons-foto's.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='dorpskerk-staphorst';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[210500,517860],X_AXIS=[.621727,-.783234],GROUND_NAP=2.176;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofV=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,(c+d)/2,ridge],[b,(c+d)/2,ridge]]);
const offsetRoof=(a,b,c,d,eave,ridge,ry)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[a,ry,ridge],[b,ry,ridge]]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
// Centrale kap en acht dwarskappen, telkens uit rechte vlakken.
const solids=[
 offsetRoof(-12.25,20.65,-10.7,5.3,7.8,17.68,-2.6),
 offsetRoof(-12.25,19.45,-23.2,-8.9,2.65,14.5,-12.6),
 offsetRoof(-12.25,19.45,3.8,18.0,2.65,14.8,7.7),
];
for(const x of [-3.15,1.85,6.85,11.85])for(const side of [-1,1]){
 const [lo,hi]=side<0?[-23.25,-9.5]:[4.4,18.15];
 solids.push(roofU(x-2.4,x+2.4,lo,hi,9.45,12.1));
}
// Twee lange, lichte installatievolumes op de dakvlakken (3D BAG en actuele ortho).
// Hun voet loopt door tot onderin het gebouw, zodat geen ingesloten holte ontstaat.
for(const [a,b,c,d] of [[5.2,13.3,-10.5,-7.3],[5.1,13.6,2.3,6.4]]){
 solids.push(box(a,b,c,d,BASE,13.4));
}
// Entree op de straatgevel en lagere zijvleugels.
solids.push(roofV(-14.25,-11.9,-17.6,-10.7,2.8,4.5));
solids.push(roofV(-13.1,-11.9,10.0,14.2,3.0,4.0));
// Bakstenen toren met achtzijdige ingesnoerde spits.
const tower=box(-15.9,-10.45,5.1,10.35,BASE,19.55),tc=[-13.2,7.72];
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return[cx+r*Math.cos(a)/Math.cos(Math.PI/8),cy+r*Math.sin(a)/Math.cos(Math.PI/8)]});
const foot=Manifold.hull([...ring(rect(-15.9,-10.45,5.1,10.35),19.45),...ring(oct(...tc,1.85),21.1)]);
const spire=Manifold.hull([...ring(oct(...tc,1.85),21.0),...ring(oct(...tc,.48),32.0)]);
solids.push(tower,foot,spire);
const niche=(center,normal,width,z0,z1,point=false)=>{let [x,y]=center,[nx,ny]=normal,r=width/2,p=[];const prof=point?[[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]]:[[-r,z0],[r,z0],[r,z1],[-r,z1]];for(const d of [-.36,.8])for(const [u,z] of prof)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [-3.15,1.85,6.85,11.85])for(const side of [-1,1])cuts.push(niche([x,side<0?-23.25:18.15],[0,side],2.1,1.0,8.8));
// Galmgaten, wijzerplaatnissen en frontvensters zijn gesloten en ondiep.
for(const x of [-15.9,-10.45]){cuts.push(niche([x,7.72],[Math.sign(x-tc[0]),0],1.6,14.2,17.8,true));cuts.push(niche([x,7.72],[Math.sign(x-tc[0]),0],1.4,18.0,19.1));}
for(const y of [5.1,10.35]){cuts.push(niche([tc[0],y],[0,Math.sign(y-tc[1])],1.6,14.2,17.8,true));cuts.push(niche([tc[0],y],[0,Math.sign(y-tc[1])],1.4,18.0,19.1));}
cuts.push(niche([-15.9,7.72],[-1,0],1.7,BASE,3.6,true));
for(const y of [6.65,8.75])cuts.push(niche([-15.9,y],[-1,0],.9,9.2,11.7,true));
for(const x of [-14.2,-12.2])cuts.push(niche([x,10.35],[0,1],.9,9.2,11.7,true));
cuts.push(niche([-12.25,13.0],[-1,0],3.0,4.8,10.0));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Dorpskerk Staphorst',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.0180100000001058'],description:'Toren met achtzijdige spits en kerk met centrale kap en dwarse puntgevels; onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:17.68,towerTopM:32.0},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0180100000001058','https://monumentenregister.cultureelerfgoed.nl/monumenten/34246','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:Dorpskerk-Staphorst.jpg','https://commons.wikimedia.org/wiki/File:Staphorst_Hersteld_Hervormde_Kerk.jpg']};

function toStl(solid,label,mmPerMetre){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return b;
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:`NederPrint generate-${slug}.mjs`},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min.map(x=>+x.toFixed(3)),max:bb.max.map(x=>+x.toFixed(3))}},null,1));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printSolid=church.translate([0,0,-BASE]),printFiles=[];
await writeFile(path.join(outDir,glb),toGlb(parts));
for(const scale of [100,1000]){const f=`${slug}-1-${scale}.stl`;printFiles.push(f);await writeFile(path.join(outDir,f),toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale));}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2)+"\n");




