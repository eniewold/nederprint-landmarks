import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="evangelisch-lutherse-kerk-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

// Gebouwstelsel: u langs de gevels van de kerk (60,3 graden in RD, van de toren aan de Prins Hendrikstraat naar achteren),
// v 90 graden linksom (naar het noordwesten); hoogtes boven het maaiveld (AHN-dtm NAP +32,7 m). De voorpartij is
// spiegelsymmetrisch om v = 1,55 (hart van de toren); de zaal ligt 1,7 m verder naar het zuidoosten dan naar het noordwesten.
const BASE=-0.5,ORIGIN=[188304.18,428253.09],X_AXIS=[0.4958,0.8684],AXIS_V=1.55;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Dakvlak: houdt alles onder z = a u + b v + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const mirror=p=>p.map(([u,v])=>[u,2*AXIS_V-v]).reverse();
// Schilddak op een convexe veelhoek (linksom): elke rand met een helling stijgt vanaf zijn goot naar binnen; null = binnenmuur.
function hipped(poly,eave,slopes,top=40){
  let s=prism(poly,BASE,top);
  poly.forEach((a,i)=>{const k=slopes[i];if(k==null)return;const b=poly[(i+1)%poly.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=[-(b[1]-a[1])/L,(b[0]-a[0])/L];
    s=plane(s,k*n[0],k*n[1],eave-k*(n[0]*a[0]+n[1]*a[1]));});
  return s;
}
// Blinde spitsboognis (0,35 m diep) in een gevel door (u,v) met buitennormaal n.
function niche(u,v,n,z,w,h,depth=.35){
  const s=prism([[-w/2,0],[w/2,0],[w/2,h-w*.6],[0,h],[-w/2,h-w*.6]],0,depth+.5).rotate([90,0,0]).translate([0,.5,0]);
  return s.rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI-90]).translate([u,v,z]);
}
// Dakkapel met zadeldakje op een dakvlak met helling k: voorkant op (u,v) met buitennormaal d, voet op hoogte z0.
function dormer(u,v,d,k,z0,w,h,r){
  const L=(h+r)/k+.4,t=[d[1],-d[0]];
  return prism([[-w/2,0],[w/2,0],[w/2,h],[0,h+r],[-w/2,h]],0,L).warp(p=>{const[x,y,e]=p;p[0]=u+x*t[0]-e*d[0];p[1]=v+x*t[1]-e*d[1];p[2]=z0+y;});
}

// Zaal: veelhoek uit BAG met afgeschuinde hoeken naast de voorpartij; schilddak uit 3D BAG LoD2.2 en AHN:
// nok +14,75 m op u = 1,5 van v = -1,9 tot 5,0, langsvlakken 1,23 (51 graden), schilden 1,35, schuine hoeken ca. 1,05.
const HALL=[[-3.0,-4.4],[-0.5,-7.04],[5.0,-7.04],[5.0,8.44],[-1.1,8.44],[-3.0,7.0]];
let hall=prism(HALL,BASE,20);
hall=plane(hall,1.23,0,14.75-1.23*1.5);hall=plane(hall,-1.23,0,14.75+1.23*1.5);
hall=plane(hall,0,1.35,14.75+1.35*1.9);hall=plane(hall,0,-1.35,14.75+1.35*5.0);
const edgePlane=(s,a,b,eave,k)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=[-(b[1]-a[1])/L,(b[0]-a[0])/L];return plane(s,k*n[0],k*n[1],eave-k*(n[0]*a[0]+n[1]*a[1]));};
hall=edgePlane(hall,HALL[0],HALL[1],9.3,1.08);hall=edgePlane(hall,HALL[4],HALL[5],10.2,1.04);
// Achtervleugel: zadeldak langs u, nok +13,3 m op v = 1,6, helling 0,69; oostgevel is scheidingsmuur.
let rear=box(2.5,11.67,-2.9,6.77,BASE,20);rear=plane(rear,0,-.69,13.3+.69*1.6);rear=plane(rear,0,.69,13.3-.69*1.6);
// Kosterswoning aan de Jacob Canisstraat (zelfde BAG-pand): twee bouwlagen tot +7,8 m, afgeknot schilddak (65 graden) tot +10,3 m.
const houseA=hipped([[5.0,-9.3],[9.06,-9.3],[9.06,-2.9],[5.0,-2.9]],7.8,[2.2,null,null,2.2],10.3);
const houseB=hipped([[9.06,-10.19],[11.6,-10.19],[11.67,-2.9],[9.06,-2.9]],7.8,[2.2,null,null,null],10.3);
// Zijkapellen naast de toren: veelhoekig met steil schilddak (58 graden), goot +6,9 m, top ca. +9,2 m.
const CHAPEL_N=[[-6.85,3.6],[-3.0,3.6],[-3.0,6.46],[-6.37,6.46],[-6.85,5.72]];
const chapelN=hipped(CHAPEL_N,6.9,[1.6,null,1.6,1.6,1.6]),chapelS=hipped(mirror(CHAPEL_N),6.9,[1.6,1.6,null,1.6,1.6]);
// Toren (1929): schacht 4,3 x 4,3 m tot de goot +14,5 m en een tentdak tot +18,3 m (3D BAG-top, 60 graden). De dunne paal met windvaan
// (AHN-maximum +21,3 m) is smaller dan 0,9 m en weggelaten.
const TU=[-7.1,-2.8],TV=[-0.6,3.7],TC=[(TU[0]+TU[1])/2,AXIS_V];
const shaft=box(TU[0],TU[1],TV[0],TV[1],BASE,14.5);
const pyramid=Manifold.hull([[TU[0],TV[0],14.45],[TU[1],TV[0],14.45],[TU[1],TV[1],14.45],[TU[0],TV[1],14.45],[TC[0],TC[1],18.3]]);
// Voorportaal met puntgevel voor de toren en een plint over de volle torenbreedte (BAG-voorgevel u = -7,78).
const plinth=plane(box(-7.78,TU[0]+.1,TV[0],TV[1],BASE,5),1,0,4.0+7.78);
let porch=box(-7.78,TU[0]+.1,AXIS_V-1.3,AXIS_V+1.3,BASE,8);porch=plane(porch,0,1.75,4.0+1.75*(1.3-AXIS_V));porch=plane(porch,0,-1.75,4.0+1.75*(1.3+AXIS_V));
// Dakkapellen: op beide schilden van de zaal en in het mansardedak van de kosterswoning.
const dormers=[
  dormer(2.2,-4.7,[0,-1],1.35,14.75+1.35*(-4.7+1.9),1.1,1.0,.8),
  dormer(2.2,6.9,[0,1],1.35,14.75-1.35*(6.9-5.0),1.1,1.0,.8),
  dormer(7.1,-8.75,[0,-1],2.2,7.8+2.2*.55,1.2,1.0,.5),
  dormer(10.4,-9.65,[0,-1],2.2,7.8+2.2*.54,1.2,1.0,.6),
];
let church=Manifold.union([hall,rear,houseA,houseB,chapelN,chapelS,shaft,pyramid,plinth,porch,...dormers]);
// Gevelopeningen als blinde nissen: ingang, torenvensters, galmgaten, zaalvensters, kapelvensters en woningvensters.
const cuts=[];
cuts.push(niche(-7.78,AXIS_V,[-1,0],0,1.5,3.4));
for(const dv of [-.75,.75])cuts.push(niche(TU[0],AXIS_V+dv,[-1,0],6.5,.8,3.3));
for(const dv of [-1.1,0,1.1]){cuts.push(niche(TU[0],AXIS_V+dv,[-1,0],10.4,.7,3.4));cuts.push(niche(TU[1],AXIS_V+dv,[1,0],10.4,.7,3.4));}
for(const du of [-1.1,0,1.1]){cuts.push(niche(TC[0]+du,TV[0],[0,-1],10.4,.7,3.4));cuts.push(niche(TC[0]+du,TV[1],[0,1],10.4,.7,3.4));}
cuts.push(niche(2.25,-7.04,[0,-1],1.8,2.6,5.4));
for(const u of [0.4,2.4,4.0])cuts.push(niche(u,8.44,[0,1],2.6,1.1,5.6));
cuts.push(niche(-1.75,-5.72,[-.7261,-.6876],2.2,1.0,4.6));
cuts.push(niche(-2.05,7.72,[-.604,.797],2.6,1.0,4.8));
for(const u of [7.0,9.6])cuts.push(niche(u,6.77,[0,1],2.4,1.1,4.6));
for(const [v,n] of [[5.05,[-1,0]],[AXIS_V*2-5.05,[-1,0]]])cuts.push(niche(-6.85,v,n,1.6,.9,3.6));
cuts.push(niche(-4.9,6.46,[0,1],1.6,.9,3.6));cuts.push(niche(-4.9,2*AXIS_V-6.46,[0,-1],1.6,.9,3.6));
for(const z of [1.4,4.6]){cuts.push(niche(6.4,-9.3,[0,-1],z,.95,2.4));cuts.push(niche(7.9,-9.3,[0,-1],z,.95,2.4));cuts.push(niche(9.8,-10.19,[0,-1],z,.95,2.4));cuts.push(niche(10.9,-10.19,[0,-1],z,.95,2.4));}
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Evangelisch-Lutherse Kerk Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:32.7,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0268100000002585"],
  description:"Lutherse kerk (Derk Semmelink, 1896) aan de Prins Hendrikstraat met zaal onder schilddak, zijkapellen, toren uit 1929 met tentdak, achtervleugel en kosterswoning; oorsprong midden in de zaal, X van de toren naar achteren.",
  realWorld:{groundNapM:32.7,hallRidgeM:14.75,towerEaveM:14.5,towerRoofTopM:18.3,windvaneAhnM:21.3},
  sources:["https://nl.wikipedia.org/wiki/Lutherse_kerk_(Nijmegen)","https://www.wikidata.org/wiki/Q2225820","https://monumentenregister.cultureelerfgoed.nl/monumenten/476729","https://www.openstreetmap.org/way/279900610","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000002585","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Lutherse_Kerk_(Nijmegen)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:`NederPrint generate-${slug}.mjs`},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
