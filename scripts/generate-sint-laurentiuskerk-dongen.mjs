import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="sint-laurentiuskerk-dongen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: oorsprong in het hart van de koepel, +X (u) naar de hoofdingang aan de Hoge Ham (NO),
// +Y (v) naar de noordwestelijke dwarsarm, -Y naar het veelhoekige koor. Hoogtes boven maaiveld NAP +4,67 m.
const BASE=-.5,ORIGIN=[123904.5,404536.3],X_AXIS=[.7837,.6211],GROUND=4.67;
const ccw=p=>p.reduce((a,q,i)=>{const r=p[(i+1)%p.length];return a+q[0]*r[1]-r[0]*q[1]},0)<0?[...p].reverse():p;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const ngon=(n,apothem,cx=0,cy=0,phase=0)=>{const r=apothem/Math.cos(Math.PI/n);return Array.from({length:n},(_,k)=>{const a=phase+Math.PI/n+2*Math.PI*k/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]})};
const ring=(n,apothem,z,cx=0,cy=0)=>ngon(n,apothem,cx,cy).map(([x,y])=>[x,y,z]);
// Dakvlakken: per gootlijn (rand i van een linksom polygoon) een vlak dat met helling `slope` naar binnen oploopt.
const roofed=(poly,eave,slope,edges=poly.map((_,i)=>i),top=60)=>{let s=prism(poly,BASE,top);for(const i of edges){const[p,q]=[poly[i],poly[(i+1)%poly.length]],L=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=-(q[1]-p[1])/L,ny=(q[0]-p[0])/L;s=plane(s,slope*nx,slope*ny,eave-slope*(nx*p[0]+ny*p[1]))}return s};

// Achtkantige centraalbouw: trommel tot de goot, licht gebogen tentdak (twee hellingen) en twaalfhoekige lantaarn met spits.
const DRUM=13.2,EAVE=20.6;
const drum=prism(ngon(8,DRUM),BASE,EAVE+.01);
const dome=Manifold.hull([...ring(8,DRUM,EAVE),...ring(8,9.0,26.7),...ring(8,5.2,31.3)]);
const lantern=prism(ngon(12,4.6),30.5,34.6);
const lanternRoof=Manifold.hull([...ring(12,4.6,34.6),...ring(12,3.0,38.0),...ring(12,.5,41.2)]);
const finial=prism(ngon(8,.47),41,43.5);
const lisenen=ngon(8,DRUM).map(([x,y])=>{const a=Math.atan2(y,x)*180/Math.PI;return box(-.6,.45,-.5,.5,BASE,EAVE).rotate([0,0,a]).translate([x,y,0])});

// Vier armen met zadeldak (goot 13,4 m, nok 19,0 m): schiptravee (+u), westarm (-u), dwarsarm (+v) en koor (-v) met driezijdige sluiting.
const ARM_EAVE=13.4,ARM_SLOPE=.8;
const front=roofed([[0,-7],[19.6,-7],[19.6,7],[0,7]],ARM_EAVE,ARM_SLOPE,[0,2]);
const back=roofed([[-19.8,-7],[0,-7],[0,7],[-19.8,7]],ARM_EAVE,ARM_SLOPE,[0,2]);
const north=roofed([[7,0],[7,19.6],[-7,19.6],[-7,0]],ARM_EAVE,ARM_SLOPE,[0,2]);
const CHOIR=[[-7,0],[-7,-17.6],[-4.6,-21.2],[-1.6,-22.4],[1.6,-22.4],[4.6,-21.2],[7,-17.6],[7,0]];
const choir=roofed(CHOIR,ARM_EAVE,ARM_SLOPE,[0,1,2,3,4,5,6]);

// Hoekkapellen met driezijdige sluiting en achtkantig tentdak (goot 12,0 m, top 16,1 m).
const chapels=[[12.2,12.2],[-12.2,12.2],[12.2,-12.2],[-12.2,-12.2]].map(([x,y])=>roofed(ngon(8,4,x,y),12.0,1.03));

// Potloodtorentjes naast de topgevels van schiptravee en westarm, traptoren bij het koor.
const pencil=(x,y)=>prism(ngon(12,1.3,x,y),BASE,18.6).add(Manifold.hull([...ring(12,1.3,18.6,x,y),[x,y,20.6]]));
const pencils=[[18.7,5.6],[18.7,-5.6],[-18.9,5.5],[-18.9,-5.5]].map(([x,y])=>pencil(x,y));
const stair=box(-8.9,-6.3,-18.0,-15.4,BASE,19.2).add(Manifold.hull([[-8.9,-18,19.2],[-6.3,-18,19.2],[-6.3,-15.4,19.2],[-8.9,-15.4,19.2],[-7.6,-16.7,21.2]]));

// Lage nevenruimten met plat dak tussen armen en kapellen, sacristievleugel met zadeldak en de gang naar het parochiehuis.
const lowNorth=prism([[-17.5,6.5],[17.5,6.5],[17.5,16.5],[12.2,16.5],[7.6,18.8],[-7.6,18.8],[-12.2,16.5],[-17.5,16.5]],BASE,6.8);
const lowSouthEast=prism([[6,-16.2],[21.3,-16.2],[21.3,-13.2],[20,-13.2],[20,-9.7],[19.2,-9.8],[17.2,-7.7],[17.3,-6.5],[6,-6.5]],BASE,7.0);
const lowSouthWest=prism([[-6,-15.9],[-6,-6.4],[-18,-6.4],[-16.7,-9.9],[-16.3,-13.5],[-15.4,-14.4],[-16.3,-15.9]],BASE,6.8);
const annexSouthWest=prism([[-16.3,-15.9],[-5,-15.9],[-5.1,-21],[-6.5,-22.4],[-9.3,-22.4],[-10.6,-21.3],[-11.6,-22.5],[-16.2,-22.4]],BASE,4.2);
const sacristy=roofed([[6,-22.4],[21.5,-22.4],[21.5,-16],[6,-16]],7.8,1.07,[0,2]);
const corridor=prism([[21.3,-13.2],[24.1,-13.2],[24,-23.5],[24.4,-23.8],[26.2,-25.4],[28.5,-25.6],[28.9,-28.3],[26,-28.5],[21.3,-24.7]],BASE,3.8);

// Rondboogportiek aan de Hoge Ham en zijportaal met zadeldakje aan de noordwestarm.
const portal=box(19.0,21.2,-3,3,BASE,4.2).add(Manifold.cylinder(2.2,3,3,32).rotate([0,90,0]).translate([19.0,0,4.2]));
const porch=roofed([[4.9,18],[4.9,22.3],[-4.9,22.3],[-4.9,18]],4.5,.5,[0,2]);

let church=Manifold.union([drum,dome,lantern,lanternRoof,finial,...lisenen,front,back,north,choir,...chapels,...pencils,stair,lowNorth,lowSouthEast,lowSouthWest,annexSouthWest,sacristy,corridor,portal,porch]);

// Blinde vensternissen (0,35 m) met gemetselde keperboog (top >= 55 graden).
const DEPTH=.35;
const niche=(w,h)=>{const r=w/2*Math.tan(55*Math.PI/180);return prism([[-w/2,0],[w/2,0],[w/2,h-r],[0,h],[-w/2,h-r]],0,DEPTH+1).rotate([90,0,0]).translate([0,1,0])};
const cuts=[];
const onFace=(phi,px,py,s,z,w,h)=>{const a=phi*Math.PI/180,tx=-Math.sin(a),ty=Math.cos(a);cuts.push(niche(w,h).translate([s,0,z]).rotate([0,0,phi-90]).translate([px,py,0]))};
// Topgevels: vijf lancetten, de middelste het hoogst.
const gable=(phi,px,py,z0)=>[[-2.6,5.0],[-1.3,6.0],[0,6.6],[1.3,6.0],[2.6,5.0]].forEach(([s,h])=>onFace(phi,px,py,s,z0,.95,h));
gable(0,19.6,0,8.0);gable(180,-19.8,0,6.5);gable(90,0,19.6,7.6);
// Vijfdelige ramen in de schuine trommelvlakken boven de kapellen.
for(const phi of [45,135,225,315]){const a=phi*Math.PI/180;for(const s of [-2.9,-1.45,0,1.45,2.9])onFace(phi,DRUM*Math.cos(a),DRUM*Math.sin(a),s,13.4,1.0,s===0?5.4:4.8)}
// Koorsluiting en zijwanden van de armen.
for(let i=1;i<6;i++){const p=CHOIR[i],q=CHOIR[i+1],phi=Math.atan2(-(q[0]-p[0]),q[1]-p[1])*180/Math.PI;onFace(phi,(p[0]+q[0])/2,(p[1]+q[1])/2,0,7.6,1.0,5.0)}
for(const s of [-.75,.75]){onFace(90,15.5+s,7,0,8.0,.9,4.0);onFace(270,15.5+s,-7,0,8.0,.9,4.0);onFace(90,-15.5+s,7,0,8.0,.9,4.0);onFace(270,-15.5+s,-7,0,8.0,.9,4.0)}
// Kapellen: twee lancetten in het diagonale sluitvlak.
for(const[x,y]of [[12.2,12.2],[-12.2,12.2],[12.2,-12.2],[-12.2,-12.2]]){const phi=Math.atan2(y,x)*180/Math.PI;for(const s of [-.7,.7])onFace(phi,x+4*Math.cos(phi*Math.PI/180),y+4*Math.sin(phi*Math.PI/180),s,7.4,.9,3.6)}
// Deuren in de portalen.
onFace(0,21.2,0,0,BASE,2.4,5.2);onFace(90,0,22.3,0,BASE,1.8,3.6);
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];

const META={name:"Sint-Laurentiuskerk Dongen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0766100000016373"],description:"Expressionistische centraalbouw (Jos en Pierre Cuypers, 1920-21): achtkantige koepel met lantaarn, vier armen met zadeldak en potloodtorentjes, hoekkapellen; oorsprong in het hart van de koepel, X naar de ingang aan de Hoge Ham.",realWorld:{groundNapM:GROUND,drumApothemM:DRUM,drumEaveM:EAVE,armRidgeM:19.0,armEaveM:ARM_EAVE,lanternBaseM:31.3,ahnTopM:43.55},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0766100000016373","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/517190","https://nl.wikipedia.org/wiki/Sint-Laurentiuskerk_(Dongen)","https://commons.wikimedia.org/wiki/Category:Sint-Laurentiuskerk_(Dongen)"]};
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
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printFiles=[100,1000].map(s=>`${slug}-1-${s}.stl`);
await writeFile(path.join(outDir,glb),toGlb(parts));
const printSolid=church.translate([0,0,-BASE]);
for(const s of [100,1000])await writeFile(path.join(outDir,`${slug}-1-${s}.stl`),toStl(printSolid,`NederPrint ${META.name} 1:${s} mm Z-up`,1000/s));
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
