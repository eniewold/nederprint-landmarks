// PKN-kerk (Hervormde kerk) Venhuizen: laatgotische eenbeukige kruiskerk met
// vijfzijdig koor; westgevel en half ingebouwde toren van 1875 (T.C. van der Sterr).
// Gebouwstelsel: u langs de nok van schip en koor (oost +), v naar het noorden,
// oorsprong RD (143395, 520066). Hoogtes in m t.o.v. maaiveld NAP -0,11 m.
// Voetafdruk uit BAG-pand 0498100000007309, nok- en gootlijnen en dakhellingen uit
// 3D BAG (LoD2.2) en AHN5-DSM, torengeledingen uit foto's (RCE, Commons).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="pkn-kerk-venhuizen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const GROUND_NAP=-.11,nap=z=>+(z-GROUND_NAP).toFixed(3);
const BASE=-.5,ORIGIN=[143395,520066],X_AXIS=[.99988,-.01571];
// Maten (m). Muren en kappen.
const VC=.1;                       // as van schip, koor en toren
const NAVE={u0:-14.75,v0:-6.25,v1:6.45};
const TRANS={u0:-5.4,u1:5.5,uc:.05,v0:-13.9,v1:12.55};
const APSE={A:[16.6,-6.25],B:[19.8,-4.75],C:[22.1,-1.95],D:[22.1,2.15],E:[19.8,4.95],F:[16.6,6.45]};
const EAVES=nap(8.4),NAVE_RIDGE=nap(17.05),TRANS_RIDGE=nap(17.25);
// Toren (1875): drie geledingen, kroonlijst, achtzijdige spits met vier dakkapellen.
const TOWER={uc:-14.6,vc:.15,base:2.4,mid:2.25,top:2.15,cornice:2.35};
const T_MID=nap(16.1),T_BELFRY=nap(19.7),T_CORNICE=nap(22.7),SPIRE_TOP=nap(37.2),SPIRE_APOTHEM=2.2;

const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const hull=pts=>Manifold.hull(pts);
const ring=(poly,z)=>poly.map(([u,v])=>[u,v,z]);

// Schip en koor als één convex lichaam: muren tot de goot, zadeldak tot de nok,
// koorsluiting met vijf dakschilden naar het eind van de nok.
const choirPoly=[[NAVE.u0,NAVE.v0],APSE.A,APSE.B,APSE.C,APSE.D,APSE.E,APSE.F,[NAVE.u0,NAVE.v1]];
const naveChoir=hull([...ring(choirPoly,BASE),...ring(choirPoly,EAVES),[NAVE.u0,VC,NAVE_RIDGE],[APSE.A[0],VC,NAVE_RIDGE]]);
// Dwarsschip: zadeldak met topgevels aan beide einden, iets hogere nok.
const transPoly=[[TRANS.u0,TRANS.v0],[TRANS.u1,TRANS.v0],[TRANS.u1,TRANS.v1],[TRANS.u0,TRANS.v1]];
const transept=hull([...ring(transPoly,BASE),...ring(transPoly,EAVES),[TRANS.uc,TRANS.v0,TRANS_RIDGE],[TRANS.uc,TRANS.v1,TRANS_RIDGE]]);

// Steunbeer: in een eigen stelsel naar buiten langs +x, schuin afgedekt (53 graden).
const buttress=(u,v,deg,w,depth,top)=>{let b=box(-.4,depth,-w/2,w/2,BASE,top+1);b=plane(b,-1.33,0,top);return b.rotate([0,0,deg]).translate([u,v,0])};
const bt=[];
for(const u of [-11.55,-8.1,10.85,16.05]){bt.push(buttress(u,NAVE.v0,-90,1.0,1.05,nap(6.2)),buttress(u,NAVE.v1,90,1.0,1.0,nap(6.2)));}
const radial=(p,q,r)=>{const e=(a)=>{const d=[a[0]-q[0],a[1]-q[1]],l=Math.hypot(...d);return d.map(x=>x/l)},e1=e(p),e2=e(r);return Math.atan2(-(e1[1]+e2[1]),-(e1[0]+e2[0]))*180/Math.PI};
const A=APSE;for(const [p,q,r] of [[A.A,A.B,A.C],[A.B,A.C,A.D],[A.C,A.D,A.E],[A.D,A.E,A.F]])bt.push(buttress(q[0],q[1],radial(p,q,r),1.0,1.15,nap(6.2)));
// Diagonale hoekberen: dwarsschip, westhoeken van het schip en de toren.
for(const [u,v,deg] of [[TRANS.u1,TRANS.v0,-45],[TRANS.u0,TRANS.v0,-135],[TRANS.u1,TRANS.v1,45],[TRANS.u0,TRANS.v1,135]])bt.push(buttress(u,v,deg,.95,1.3,nap(6.0)));
for(const [u,v,deg] of [[NAVE.u0,NAVE.v0,-135],[NAVE.u0,NAVE.v1,135]])bt.push(buttress(u,v,deg,.95,1.05,nap(6.0)));
const tw0=TOWER.uc-TOWER.base,tv0=TOWER.vc-TOWER.base,tv1=TOWER.vc+TOWER.base;
for(const [v,deg] of [[tv0,-135],[tv1,135]])bt.push(buttress(tw0,v,deg,.95,1.1,nap(9.2)));

// Toren: onderbouw, middengeleding (blinde boog met oculus), klokkenverdieping,
// kroonlijst op een schuine kraag, achtzijdige spits met vier dakkapellen.
const sq=(h,z0,z1)=>box(TOWER.uc-h,TOWER.uc+h,TOWER.vc-h,TOWER.vc+h,z0,z1);
const towerBody=Manifold.union([sq(TOWER.base,BASE,T_MID),sq(TOWER.mid,T_MID-.01,T_BELFRY),sq(TOWER.top,T_BELFRY-.01,T_CORNICE-.25)]);
const cornice=hull([...ring([[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[TOWER.uc+a*TOWER.top,TOWER.vc+b*TOWER.top]),T_CORNICE-.45),...ring([[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[TOWER.uc+a*TOWER.cornice,TOWER.vc+b*TOWER.cornice]),T_CORNICE-.25),...ring([[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[TOWER.uc+a*TOWER.cornice,TOWER.vc+b*TOWER.cornice]),T_CORNICE)]);
const spire=Manifold.cylinder(SPIRE_TOP-T_CORNICE,SPIRE_APOTHEM/Math.cos(Math.PI/8),.06,8).rotate([0,0,22.5]).translate([TOWER.uc,TOWER.vc,T_CORNICE-.01]);
const lucarnes=[];for(const deg of [0,90,180,270]){let d=box(1.1,TOWER.cornice,-.5,.5,T_CORNICE-.01,T_CORNICE+1.9);d=plane(d,0,1.25,T_CORNICE+1.825);d=plane(d,0,-1.25,T_CORNICE+1.825);lucarnes.push(d.rotate([0,0,deg]).translate([TOWER.uc,TOWER.vc,0]));}

// Gemetselde plint van 0,25 m met een schuine kraag (45 graden) tot NAP +1,6 m.
const PLINTH=nap(1.35);
const plinth=poly=>{const out=new CrossSection([poly]).offset(.25,"Miter").toPolygons()[0];return hull([...ring(out,BASE),...ring(out,PLINTH),...ring(poly,PLINTH+.25)])};
const towerPoly=[[tw0,tv0],[TOWER.uc+TOWER.base,tv0],[TOWER.uc+TOWER.base,tv1],[tw0,tv1]];
let church=Manifold.union([naveChoir,transept,...bt,towerBody,cornice,spire,...lucarnes,plinth(choirPoly),plinth(transPoly),plinth(towerPoly)]);

// Blinde nissen (0,35 m diep) met spitse top van ~54 graden.
const niche=(w,z0,z1,depth=.35)=>{const r=w/2,h=z1-z0;return prism([[-r,0],[r,0],[r,h-.7*w],[0,h],[-r,h-.7*w]],-depth,.6).rotate([90,0,0]).translate([0,0,z0])};
// niche() ligt in het vlak x/z en snijdt naar +y in de muur; plaats per gevel.
const onWall=(n,u,v,deg)=>n.rotate([0,0,deg]).translate([u,v,0]);
const cuts=[];
for(const u of [-13.15,-9.8,-6.75]){cuts.push(onWall(niche(1.6,nap(2.6),nap(7.4)),u,NAVE.v0,0),onWall(niche(1.6,nap(2.6),nap(7.4)),u,NAVE.v1,180));}
for(const u of [8.2,13.45]){cuts.push(onWall(niche(2.0,nap(2.5),nap(7.6)),u,NAVE.v0,0),onWall(niche(2.0,nap(2.5),nap(7.6)),u,NAVE.v1,180));}
const facets=[[A.A,A.B],[A.B,A.C],[A.C,A.D],[A.D,A.E],[A.E,A.F]];
for(const [p,q] of facets){const deg=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;cuts.push(onWall(niche(1.5,nap(2.6),nap(7.5)),(p[0]+q[0])/2,(p[1]+q[1])/2,deg));}
// Topgevels van het dwarsschip: groot middenvenster tussen twee smalle nissen.
for(const [v,deg] of [[TRANS.v0,0],[TRANS.v1,180]]){cuts.push(onWall(niche(2.6,nap(2.8),nap(12.6)),TRANS.uc,v,deg));for(const du of [-3.05,3.05])cuts.push(onWall(niche(1.4,nap(3.2),nap(10.4)),TRANS.uc+du,v,deg));cuts.push(onWall(niche(1.0,nap(13.3),nap(15.9)),TRANS.uc,v,deg));}
for(const v of [-10.0,9.4]){cuts.push(onWall(niche(1.8,nap(2.6),nap(7.4)),TRANS.u1,v,90),onWall(niche(1.8,nap(2.6),nap(7.4)),TRANS.u0,v,-90));}
// Westgevel naast de toren.
for(const v of [-4.3,4.5])cuts.push(onWall(niche(1.4,nap(2.6),nap(6.8)),NAVE.u0,v,-90));
// Toren: ingang, oculusnis, galmgaten in paren op elke vrije zijde.
cuts.push(onWall(niche(1.4,BASE,nap(3.4)),tw0,TOWER.vc,-90));
cuts.push(onWall(niche(1.2,nap(5.0),nap(8.6)),tw0,TOWER.vc,-90));
// Middengeleding: blinde boognis op de drie vrije zijden (oostzijde ligt tegen de kap).
const faces=[[TOWER.uc-TOWER.mid,TOWER.vc,-90],[TOWER.uc,TOWER.vc-TOWER.mid,0],[TOWER.uc,TOWER.vc+TOWER.mid,180]];
for(const [u,v,deg] of faces){cuts.push(onWall(niche(2.6,nap(16.5),nap(19.3),.3),u,v,deg));}
const facesTop=[[TOWER.uc-TOWER.top,TOWER.vc,-90],[TOWER.uc,TOWER.vc-TOWER.top,0],[TOWER.uc,TOWER.vc+TOWER.top,180],[TOWER.uc+TOWER.top,TOWER.vc,90]];
for(const [u,v,deg] of facesTop)for(const d of [-.75,.75]){const n=niche(.95,nap(20.1),nap(22.0),.3);cuts.push(onWall(n.translate([d,0,0]),u,v,deg));}
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"PKN-kerk Venhuizen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:-.2,replacesBuildings:["NL.IMBAG.Pand.0498100000007309"],
  description:"Oorsprong RD (143395, 520066) bij de viering, X langs de nok van schip en koor (oost); laatgotische kruiskerk met vijfzijdig koor en half ingebouwde toren uit 1875, torengeledingen en nissen uit foto's geschat.",
  realWorld:{groundNapM:GROUND_NAP,eavesNapM:8.4,naveRidgeNapM:17.05,transeptRidgeNapM:17.25,towerCorniceNapM:22.7,spireTopNapM:37.2,naveWidthM:12.7,transeptLengthM:26.45,lengthM:39.35},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0498100000007309","https://monumentenregister.cultureelerfgoed.nl/monumenten/37126","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Venhuizen","https://www.openstreetmap.org/way/275529242","https://www.ahn.nl/dataroom"]};

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
