// Nederlands Hervormde Kerk Wanneperveen, kerk 1502 met consistorie en vrijstaande klokkenstoel.
// 3D BAG/AHN4 voor kerkafmetingen; OSM en foto's voor de klokkenstoel.
import Module from 'manifold-3d';
import { mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug='nederlands-hervormde-kerk-wanneperveen';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[203784,523783],X_AXIS=[.99589648,.09049968],GROUND_NAP=.328;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ring=(p,z)=>p.map(([x,y])=>[x,y,z]);
const box=(a,b,c,d,z0,z1)=>Manifold.extrude(new CrossSection([rect(a,b,c,d)]),z1-z0).translate([0,0,z0]);
const roofU=(a,b,c,d,eave,ridge)=>Manifold.hull([...ring(rect(a,b,c,d),BASE),...ring(rect(a,b,c,d),eave),[(a+b)/2,c,ridge],[(a+b)/2,d,ridge]]);
// Zadeldak met westelijk schild en driezijdige oostsluiting.
const foot=[[-10.5,-4.45],[8.5,-4.4],[11.45,-1.55],[11.45,2.35],[8.5,4.95],[-10.5,4.95]];
const nave=Manifold.hull([...ring(foot,BASE),...ring(foot,8.05),[-7.5,.15,14.63],[6.2,.15,14.63]]);
const annex=roofU(-6.6,-.8,-11.3,-4.25,4.25,7.38);
const solids=[nave,annex];
// Steunberen langs de kerk en op de koorsluiting, afgeschuind als printbare vlakken.
for(const x of [-10.2,-4.0,2.35,8.1])for(const side of [-1,1]){
 const y=side<0?-4.45:4.95,outer=y+side*1.0;
 solids.push(Manifold.hull([...ring(rect(x-.48,x+.48,Math.min(y-.1,outer),Math.max(y+.1,outer)),BASE),...ring(rect(x-.48,x+.48,Math.min(y-.1,outer),Math.max(y+.1,outer)),5.8),...ring(rect(x-.48,x+.48,y-.1,y+.1),6.9)]));
}
const niche=(center,normal,width,z0,spring,top)=>{const [x,y]=center,[nx,ny]=normal,r=width/2,p=[];const profile=[[-r,z0],[r,z0],[r,spring],[0,top],[-r,spring]];for(const d of [-.38,.8])for(const [u,z] of profile)p.push([x+nx*d-ny*u,y+ny*d+nx*u,z]);return Manifold.hull(p)};
let church=Manifold.union(solids);const cuts=[];
for(const x of [-7.0,-.8,5.1])for(const side of [-1,1])cuts.push(niche([x,side<0?-4.45:4.95],[0,side],1.35,2.8,5.9,7.1));
cuts.push(niche([-10.5,.2],[-1,0],1.4,.1,5.3,6.7));
cuts.push(niche([11.45,.4],[1,0],1.25,2.9,5.8,6.9));
cuts.push(niche([9.95,-3.0],[.7,-.7],1.1,2.9,5.8,6.9),niche([9.95,3.6],[.7,.7],1.1,2.9,5.8,6.9));
for(const x of [-5.2,-2.2])cuts.push(niche([x,-11.3],[0,-1],1.0,1.1,3.3,4.2));
for(const y of [-9.5,-6.7])cuts.push(niche([-6.6,y],[-1,0],1.0,1.1,3.3,4.2));
church=church.subtract(Manifold.union(cuts));
// Open houten klokkenstoel is zeer dun in het echt. Schaal 1:1000 vereist
// minstens 0,9 m brede dragers en spits toelopende openingen. De schematische
// klok wordt door een dikke centrale drager ondersteund (geen losse hangende bel).
const cx=-12.77,cy=-14.93;
const sq=(h)=>rect(cx-h,cx+h,cy-h,cy+h);
let stand=Manifold.hull([...ring(sq(2.5),BASE),...ring(sq(1.45),5.5)]);
const profileX=(p,x0,x1)=>Manifold.extrude(new CrossSection([p]),x1-x0).transform([0,1,0,0,0,0,1,0,1,0,0,0,x0,0,0,1]);
const opening=[[-1.2,BASE-1],[1.2,BASE-1],[1.2,2.7],[0,4.8],[-1.2,2.7]];
const through=profileX(opening,-4,4);stand=stand.subtract(Manifold.union([through.translate([cx,cy,0]),through.rotate([0,0,90]).translate([cx,cy,0])]));
const roof=Manifold.hull([...ring(sq(1.45),5.4),[cx,cy,7.0]]);
const post=box(cx-.47,cx+.47,cy-.47,cy+.47,BASE,5.65);
const bell=Manifold.cylinder(1.15,.65,.48,16).translate([cx,cy,4.2]);
stand=Manifold.union([stand,roof,post,bell]);
const parts=[['building:kerk',church],['building:klokkenstoel',stand]];
const META={name:'Nederlands Hervormde Kerk Wanneperveen',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,replacesBuildings:['NL.IMBAG.Pand.1708100000025507'],description:'Kerk met schilddak en consistorie; een aparte, schematische klokkenstoel ten zuidwesten. Onderkant 0,5 m onder maaiveld.',realWorld:{groundNapM:GROUND_NAP,naveRidgeM:14.63,bellstandTopM:7.0},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000025507','https://monumentenregister.cultureelerfgoed.nl/monumenten/10584','https://monumentenregister.cultureelerfgoed.nl/monumenten/507464','https://www.openstreetmap.org/node/9014769874','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Wanneperveen)']};

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


for(const [name,s] of parts){if(s.status()!=='NoError')throw new Error(`${name}: ${s.status()}`);const c=s.decompose();console.log(name,'status',s.status(),'components',c.length,'genus',s.genus(),'bounds',s.boundingBox());if(c.length!==1)throw new Error(`${name} disconnected`);}
await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,`${slug}.glb`),toGlb(parts));
const all=Manifold.union([church,stand]),plate=box(-16,14,-19,8,BASE-1,BASE+.01),ground=Manifold.union([all,plate]);
const printFiles=[];
for(const scale of [100,1000]){
 const plain=`${slug}-1-${scale}.stl`,withPlate=`${slug}-grondplaat-1-${scale}.stl`;
 await writeFile(path.join(outDir,plain),toStl(all.translate([0,0,-BASE]),`${META.name} 1:${scale}`,1000/scale));
 await writeFile(path.join(outDir,withPlate),toStl(ground.translate([0,0,-BASE+1]),`${META.name} grondplaat 1:${scale}`,1000/scale));
 printFiles.push(plain,withPlate);
}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:`${slug}.glb`,unitsPerMetre:1,className:'building',crs:'EPSG:28992',printFiles},null,2)+'\n');

