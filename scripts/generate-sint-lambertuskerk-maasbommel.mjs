// Sint-Lambertuskerk, Maasbommel (Raadhuisdijk 44, rijksmonument 523092).
// Neogotische driebeukige basiliek van C. van Dijk (1868-1869; BAG geeft 1840),
// toren met vier geledingen, kruisende wimbergen, hoekpinakels en achtkante
// naaldspits aan de dijkzijde (zuid), driezijdig gesloten koor in het noorden.
// Bouwstelsel: +X langs de kerkas van toren naar koor, +Y naar het westen,
// Z omhoog, z = 0 op NAP +8,55 m (maaiveld langs de zijbeuken).
// Maten: footprint en dakvlakken uit 3DBAG (LoD2.2), hoogtes uit AHN-DSM 0,5 m,
// geleding en details geschat uit Commons-foto's.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-lambertuskerk-maasbommel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const BASE=-1,GROUND_NAP=8.55,ORIGIN=[165161,425690],X_AXIS=[-0.0105,1];
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Houd alles onder het vlak z = a x + b y + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Dakvlak dat bij de rand p0-p1 (polygoon linksom) op zEave ligt en met helling k naar binnen stijgt.
const eaveSlope=(s,p0,p1,zEave,k)=>{const dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;return plane(s,-k*nx,-k*ny,zEave+k*(p0[0]*nx+p0[1]*ny))};
const oct=(r,z,cx=0,cy=0)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);

// --- Maten (m) ---
const NAVE_W=3.95,NAVE_EAVE=14.45,NAVE_RIDGE=20.8,NAVE_K=(NAVE_RIDGE-NAVE_EAVE)/NAVE_W; // 58 graden
const NAVE_U0=-8.5,CHOIR_U=19.2,APSE_U=21.5,APSE_HALF=1.45,APSE_K=2.25;           // koordaken 66 graden
const AISLE_U0=-12.3,AISLE_W_OUT=7.42,AISLE_E_OUT=-8.0,AISLE_TOP=10.65,AISLE_K=0.7;
const T_U0=-15.5,T_U1=-8.5,T_V0=-3.7,T_V1=3.4,T_WALL=28.95,T_GABLE=33.25,SPIRE_TOP=46.45;
const T_UC=(T_U0+T_U1)/2,T_VC=(T_V0+T_V1)/2,T_H=(T_V1-T_V0)/2;

// --- Schip met driezijdig gesloten koor ---
const naveP=[[NAVE_U0,-NAVE_W],[CHOIR_U,-NAVE_W],[APSE_U,-APSE_HALF],[APSE_U,APSE_HALF],[CHOIR_U,NAVE_W],[NAVE_U0,NAVE_W]];
let nave=prism(naveP,BASE,NAVE_RIDGE+1);
nave=plane(nave,0,-NAVE_K,NAVE_RIDGE);nave=plane(nave,0,NAVE_K,NAVE_RIDGE);
nave=eaveSlope(nave,[CHOIR_U,-NAVE_W],[APSE_U,-APSE_HALF],NAVE_EAVE,APSE_K);
nave=eaveSlope(nave,[APSE_U,-APSE_HALF],[APSE_U,APSE_HALF],NAVE_EAVE,APSE_K);
nave=eaveSlope(nave,[APSE_U,APSE_HALF],[CHOIR_U,NAVE_W],NAVE_EAVE,APSE_K);

// --- Zijbeuken met lessenaarsdak tot tegen de lichtbeuk; zuidelijk ook langs de toren ---
let aisleW=prism([[AISLE_U0,3],[13.4,3],[13.4,AISLE_W_OUT],[AISLE_U0,AISLE_W_OUT]],BASE,13);
aisleW=plane(aisleW,0,-AISLE_K,AISLE_TOP+AISLE_K*NAVE_W);
let aisleE=prism([[AISLE_U0,AISLE_E_OUT],[13.0,AISLE_E_OUT],[13.0,-3],[AISLE_U0,-3]],BASE,13);
aisleE=plane(aisleE,0,AISLE_K,AISLE_TOP+AISLE_K*NAVE_W);
// Lage kapellen naast het koor en de platte sacristie aan de oostzijde.
let chapelW=prism([[13.3,3.5],[19.3,3.5],[19.3,AISLE_W_OUT],[13.3,AISLE_W_OUT]],BASE,10);
chapelW=plane(chapelW,0,-0.74,4.45+0.74*AISLE_W_OUT);
let chapelE=prism([[12.9,-7.5],[19.2,-7.5],[19.2,-3.5],[12.9,-3.5]],BASE,10);
chapelE=plane(chapelE,0,0.58,4.65+0.58*7.5);
const sacristy=box(13.0,19.2,-13.4,-7.4,BASE,4.75);

// --- Toren: schacht, kruisende wimbergen, hoekpinakels en achtkante naaldspits ---
const shaft=box(T_U0,T_U1,T_V0,T_V1,BASE,T_WALL);
const gk=(T_GABLE-T_WALL)/T_H;
let gableA=box(T_U0,T_U1,T_V0,T_V1,T_WALL-0.1,T_GABLE+0.5);gableA=plane(gableA,0,gk,T_GABLE-gk*T_VC);gableA=plane(gableA,0,-gk,T_GABLE+gk*T_VC);
let gableB=box(T_U0,T_U1,T_V0,T_V1,T_WALL-0.1,T_GABLE+0.5);gableB=plane(gableB,gk,0,T_GABLE-gk*T_UC);gableB=plane(gableB,-gk,0,T_GABLE+gk*T_UC);
const pinnacles=[];for(const u of [T_U0,T_U1-0.9])for(const v of [T_V0,T_V1-0.9]){
  pinnacles.push(box(u,u+0.9,v,v+0.9,T_WALL-1,31.6));
  pinnacles.push(Manifold.hull([[u,v,31.55],[u+0.9,v,31.55],[u+0.9,v+0.9,31.55],[u,v+0.9,31.55],[u+0.45,v+0.45,33.2]]));
}
const spire=Manifold.hull([...oct(2.75,30.5,T_UC,T_VC),...oct(0.5,SPIRE_TOP,T_UC,T_VC)]);
// Steunberen op de zuidhoeken van de toren, met schuine afdekking.
const buttress=(x,y,dx,dy,w,d,zTop)=>{ // voet op de muur (x,y), naar buiten (dx,dy)
  const tx=-dy,ty=dx,h=w/2,pts=[];
  for(const s of [-1,1]){const bx=x+tx*h*s,by=y+ty*h*s;
    pts.push([bx-dx*0.2,by-dy*0.2,BASE],[bx+dx*d,by+dy*d,BASE],[bx+dx*d,by+dy*d,zTop],[bx-dx*0.2,by-dy*0.2,zTop+d*1.3]);}
  return Manifold.hull(pts);
};
const tButt=[];
for(const v of [T_V0+0.45,T_V1-0.45])tButt.push(buttress(T_U0,v,-1,0,0.9,0.8,15));
for(const [v,s] of [[T_V0,-1],[T_V1,1]])tButt.push(buttress(T_U0+0.45,v,0,s,0.9,0.8,15));
// Traptoren in de hoek van toren en westbeuk.
const stair=Manifold.union([prism(oct(1.35,0,-10.9,5.0).map(p=>[p[0],p[1]]),BASE,12.3),Manifold.hull([...oct(1.35,12.25,-10.9,5.0),[-10.9,5.0,15.75]])]);

// --- Steunberen langs de zijbeuken en het koor, lisenen tegen de lichtbeuk ---
const BAYS=[-8.5,-4.8,-1.1,2.6,6.3,10.0,13.4];
const sideButt=[];
for(const u of BAYS){
  sideButt.push(buttress(u,AISLE_W_OUT,0,1,0.9,0.8,6.6));
  if(u<13.4)sideButt.push(buttress(u,AISLE_E_OUT,0,-1,0.9,0.8,6.3));
  if(u>NAVE_U0&&u<13.4)for(const s of [-1,1])sideButt.push(box(u-0.45,u+0.45,s>0?NAVE_W-0.1:-NAVE_W-0.4,s>0?NAVE_W+0.4:-NAVE_W+0.1,9.5,NAVE_EAVE));
}
// Koorsteunberen op de hoeken, langs de bissectrice van de muren.
for(const s of [-1,1]){
  sideButt.push(buttress(APSE_U,s*APSE_HALF,0.932,s*0.363,0.9,0.9,10.5));
  sideButt.push(buttress(CHOIR_U,s*NAVE_W,0.4,s*0.917,0.9,0.9,10.5));
}
// Dakkapellen: twee per kant op het schip.
const dormers=[];for(const u of [-2.3,10.6])for(const s of [-1,1]){
  const vf=s*3.1,vi=s*0.8;
  let d=box(u-0.55,u+0.55,Math.min(vf,vi),Math.max(vf,vi),15.0,17.6);
  d=plane(d,1.1,0,17.6-1.1*u);d=plane(d,-1.1,0,17.6+1.1*u);
  dormers.push(d);
}

let church=Manifold.union([nave,aisleW,aisleE,chapelW,chapelE,sacristy,shaft,gableA,gableB,...pinnacles,spire,...tButt,stair,...sideButt,...dormers]);

// --- Blinde nissen: spitsboogvensters, galmgaten, portaal en wijzerplaten ---
// Nis in een muur met buitennormaal (nx,ny) door punt (x,y); spitse top onder 45 graden.
const niche=(x,y,nx,ny,w,z0,z1,depth=0.35)=>{
  const tx=-ny,ty=nx,h=w/2,pts=[];
  for(const dd of [-depth,0.3])for(const s of [-1,1]){const px=x+nx*dd+tx*h*s,py=y+ny*dd+ty*h*s;pts.push([px,py,z0],[px,py,z1]);}
  for(const dd of [-depth,0.3])pts.push([x+nx*dd,y+ny*dd,z1+h]);
  return Manifold.hull(pts);
};
const diamond=(x,y,nx,ny,r,zc)=>{const tx=-ny,ty=nx,pts=[];for(const dd of [-0.3,0.3])pts.push([x+nx*dd+tx*r,y+ny*dd+ty*r,zc],[x+nx*dd-tx*r,y+ny*dd-ty*r,zc],[x+nx*dd,y+ny*dd,zc+r],[x+nx*dd,y+ny*dd,zc-r]);return Manifold.hull(pts)};
const cuts=[];
for(let i=0;i<BAYS.length-1;i++){const u=(BAYS[i]+BAYS[i+1])/2;
  cuts.push(niche(u,AISLE_W_OUT,0,1,1.3,2.4,6.0),niche(u,AISLE_E_OUT,0,-1,1.3,2.4,6.0));
  cuts.push(niche(u,NAVE_W,0,1,1.1,11.3,13.3),niche(u,-NAVE_W,0,-1,1.1,11.3,13.3));}
cuts.push(niche(-10.4,AISLE_E_OUT,0,-1,1.2,2.4,5.8));
cuts.push(niche(16.3,NAVE_W,0,1,1.2,8.0,13.0),niche(16.3,-NAVE_W,0,-1,1.2,8.0,13.0));
cuts.push(niche(APSE_U,0,1,0,1.2,3.5,12.4));
for(const s of [-1,1]){const ex=APSE_U-CHOIR_U,ey=s*(APSE_HALF-NAVE_W),l=Math.hypot(ex,ey);cuts.push(niche((CHOIR_U+APSE_U)/2,s*(NAVE_W+APSE_HALF)/2,s*-ey/l,s*ex/l,1.1,3.5,12.4));}
// Torengevels: zuid, west, oost en (boven het schip) noord.
const faces=[[T_U0,T_VC,-1,0],[T_UC,T_V1,0,1],[T_UC,T_V0,0,-1],[T_U1,T_VC,1,0]];
for(const [x,y,nx,ny] of faces){const tx=-ny,ty=nx;
  for(const o of [-1.9,0,1.9])cuts.push(niche(x+tx*o,y+ty*o,nx,ny,0.9,21.5,25.3));
  if(nx!==1)cuts.push(niche(x,y,nx,ny,1.3,13.2,18.0));
  cuts.push(diamond(x,y,nx,ny,0.7,30.7));}
cuts.push(niche(T_U0,T_VC,-1,0,1.8,BASE+0.6,3.4,0.45));
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Sint-Lambertuskerk Maasbommel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,
  groundSamplePoints:[[0,9.2],[0,-9.8],[-17.5,-0.15],[23.5,0]],
  replacesBuildings:["NL.IMBAG.Pand.0668100000004445"],
  description:"Neogotische basiliek (C. van Dijk, 1868-1869) met zijbeuken, driezijdig koor, kapellen en sacristie; toren met wimbergen, pinakels en naaldspits aan de dijk. X van toren naar koor, z = 0 op NAP +8,55 m.",
  realWorld:{groundNapM:GROUND_NAP,naveRidgeNapM:29.35,towerWallNapM:37.5,spireTopNapM:55.0,lengthM:37.0,widthM:15.4},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0668100000004445","https://monumentenregister.cultureelerfgoed.nl/monumenten/523092","https://dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0144.php","https://commons.wikimedia.org/wiki/File:Maasbommel,_de_Sint-Lambertuskerk_RM523092_IMG_4122_2018-06-06_13.43.jpg","https://commons.wikimedia.org/wiki/File:Maasbommel_Rijksmonument_523092_RK_kerk_van_opzij.JPG","https://commons.wikimedia.org/wiki/File:Maasbommel_Rijksmonument_523092_RK_kerk_achteraanzicht.JPG","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};

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
