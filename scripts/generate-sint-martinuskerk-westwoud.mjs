// Sint-Martinuskerk Westwoud: neoclassicistische waterstaatskerk van Th. Molkenboer
// (1849-1851), driebeukige kruiskerk onder één zadeldak, koor met driezijdige sluiting,
// westtoren met houten klokkengeleding en ingesnoerde spits.
// Gebouwstelsel: u langs de nok van schip en koor (oost +), v naar het noorden,
// oorsprong RD (138610, 522198) op de kruising van de nokken. Hoogtes in m t.o.v.
// maaiveld NAP +0,10 m.
// Voetafdruk uit BAG-pand 0498100000006516, nok- en gootlijnen en dakhellingen uit
// 3D BAG (LoD2.2) en AHN5-DSM, torengeledingen en nissen uit foto's (RCE, Commons).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="sint-martinuskerk-westwoud";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const GROUND_NAP=.1,nap=z=>+(z-GROUND_NAP).toFixed(3);
const BASE=-.5,ORIGIN=[138610,522198],X_AXIS=[.8937,.4487];
// Schip (met zijbeuken onder één kap), dwarsschip en koor met driezijdige sluiting.
const NAVE={u0:-28.9,u1:4.2,v:8.2},TRANS={u:4.2,v:8.9},CHOIR={u1:5.1,v:4.3,end:9.55,e:2.4};
const NAVE_EAVES=nap(10.5),NAVE_RIDGE=nap(17.1),TRANS_EAVES=nap(10.85),TRANS_RIDGE=nap(17.35),CHOIR_EAVES=nap(10.8),CHOIR_RIDGE=nap(17.0);
// Westfront: verhoogde frontmuur met kroonlijst en schuin oplopende borstwering.
const FRONT={u0:-29.4,u1:-28.2,v:8.7},FRONT_CORNICE=nap(11.6),FRONT_TOP=nap(17.3);
// Toren: onderbouw tot de kroonlijst van het front, schacht met terugsprong,
// kroonlijst, houten klokkengeleding, kroonlijst, ingesnoerde achtzijdige spits.
const TOWER={uc:-31.5,vc:0,baseU:2.85,baseV:3.1,shaft:2.75,clock:2.65,belfry:2.05,pier:2.2,cornice:2.55};
const T_STEP=nap(19.4),T_CORNICE=nap(24.5),T_BELFRY_TOP=nap(29.6),T_BELFRY_CORNICE=nap(30.2),SPIRE_NECK=nap(31.6),SPIRE_TOP=nap(42.45);
// Lage aanbouwen: sacristieën naast het koor, aanbouw tegen de zuidbeuk, portaal noord.
const SACRISTY_N={u0:4.2,u1:9.65,v0:4.3,v1:8.0,top:nap(4.25)},SACRISTY_S={u0:4.2,u1:9.5,v0:-8.9,v1:-4.3,top:nap(4.15)};
const LEANTO={u0:-12.0,u1:-4.2,v0:-10.3,v1:-8.2,top:nap(3.45)},PORCH={u0:.05,u1:2.55,v0:8.9,v1:10.0,hi:nap(3.6),lo:nap(2.2)};

const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const hull=pts=>Manifold.hull(pts);
const ring=(poly,z)=>poly.map(([u,v])=>[u,v,z]);
// Kroonlijst: band rond een convexe voetafdruk, 0,35 m uitkragend op een kraag van 45 graden.
const cornice=(poly,top,over=.35,h=.3)=>{const out=new CrossSection([poly]).offset(over,"Miter").toPolygons()[0];return hull([...ring(poly,top-h-over),...ring(out,top-h),...ring(out,top)])};
// Plint van 0,25 m met een schuine kraag tot NAP +1,0 m.
const PLINTH=nap(.75);
const plinth=poly=>{const out=new CrossSection([poly]).offset(.25,"Miter").toPolygons()[0];return hull([...ring(out,BASE),...ring(out,PLINTH),...ring(poly,PLINTH+.25)])};

// Schip: muren tot de goot, zadeldak tot de nok (helling 39 graden).
const navePoly=rect(NAVE.u0,NAVE.u1,-NAVE.v,NAVE.v);
const nave=hull([...ring(navePoly,BASE),...ring(navePoly,NAVE_EAVES),[NAVE.u0,0,NAVE_RIDGE],[NAVE.u1,0,NAVE_RIDGE]]);
// Dwarsschip: zadeldak dwars op het schip met topgevels; armen steken 0,7 m uit.
const transPoly=rect(-TRANS.u,TRANS.u,-TRANS.v,TRANS.v);
const transept=hull([...ring(transPoly,BASE),...ring(transPoly,TRANS_EAVES),[0,-TRANS.v,TRANS_RIDGE],[0,TRANS.v,TRANS_RIDGE]]);
// Koor met driezijdige sluiting (luchtfoto en 3D BAG; binnen halfrond): zadeldak dat
// in drie schilden eindigt.
const choirPoly=[[0,-CHOIR.v],[CHOIR.u1+2.55,-CHOIR.v],[CHOIR.end,-CHOIR.e],[CHOIR.end,CHOIR.e],[CHOIR.u1+2.55,CHOIR.v],[0,CHOIR.v]];
const choir=hull([...ring(choirPoly,BASE),...ring(choirPoly,CHOIR_EAVES),[0,0,CHOIR_RIDGE],[CHOIR.u1,0,CHOIR_RIDGE]]);

// Westfront: muur met frontonvormige borstwering (31 graden) boven de kroonlijst.
const front=Manifold.extrude(new CrossSection([[[-FRONT.v,BASE],[FRONT.v,BASE],[FRONT.v,FRONT_CORNICE],[0,FRONT_TOP],[-FRONT.v,FRONT_CORNICE]]]),FRONT.u1-FRONT.u0).rotate([90,0,90]).translate([FRONT.u0,0,0]);
const frontPoly=rect(FRONT.u0,FRONT.u1,-FRONT.v,FRONT.v);

// Lisenen tussen de traveeën van de zijbeuken (0,6 m breed, 0,25 m voor de muur).
const bays=[-28.2,-22.2,-16.2,-10.2,-4.2];
const lis=[];
for(const u of bays.slice(1,-1))for(const s of [-1,1])lis.push(box(u-.3,u+.3,s>0?NAVE.v-.01:-NAVE.v-.25,s>0?NAVE.v+.25:-NAVE.v+.01,BASE,NAVE_EAVES-.55));
for(const s of [-1,1])lis.push(box(FRONT.u1-.01,FRONT.u1+.6,s>0?NAVE.v-.01:-FRONT.v,s>0?FRONT.v:-NAVE.v+.01,BASE,FRONT_CORNICE-.6));

// Toren.
const T=TOWER,sq=(hu,hv,z0,z1)=>box(T.uc-hu,T.uc+hu,T.vc-hv,T.vc+hv,z0,z1),sqPoly=(hu,hv)=>rect(T.uc-hu,T.uc+hu,T.vc-hv,T.vc+hv);
const towerBase=sq(T.baseU,T.baseV,BASE,FRONT_CORNICE);
const shaft=Manifold.union([sq(T.shaft,T.shaft,FRONT_CORNICE-.01,T_STEP),sq(T.clock,T.clock,T_STEP-.01,T_CORNICE-.3)]);
// Klokkengeleding: kern met vier hoekpijlers, galmgaten als nissen.
const belfry=Manifold.union([sq(T.belfry,T.belfry,T_CORNICE-.01,T_BELFRY_TOP),...[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>box(T.uc+a*T.pier-(a>0?.75:0),T.uc+a*T.pier+(a<0?.75:0),T.vc+b*T.pier-(b>0?.75:0),T.vc+b*T.pier+(b<0?.75:0),T_CORNICE-.01,T_BELFRY_TOP))]);
// Ingesnoerde spits: vierkante voet die overgaat in een achtzijdige naald tot de top van de knop (AHN).
const oct=(apo,z)=>{const r=apo/Math.cos(Math.PI/8),p=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;p.push([T.uc+r*Math.cos(a),T.vc+r*Math.sin(a),z]);}return p};
const spireFoot=hull([...ring(sqPoly(2.2,2.2),T_BELFRY_CORNICE-.01),...oct(1.25,SPIRE_NECK)]);
const spire=hull([...oct(1.25,SPIRE_NECK-.01),[T.uc,T.vc,SPIRE_TOP]]);

// Lage aanbouwen.
const sacN=box(SACRISTY_N.u0-.2,SACRISTY_N.u1,SACRISTY_N.v0-.2,SACRISTY_N.v1,BASE,SACRISTY_N.top);
const sacS=box(SACRISTY_S.u0-.2,SACRISTY_S.u1,SACRISTY_S.v0,SACRISTY_S.v1+.2,BASE,SACRISTY_S.top);
const leanTo=box(LEANTO.u0,LEANTO.u1+.2,LEANTO.v0,LEANTO.v1+.2,BASE,LEANTO.top);
const porch=plane(box(PORCH.u0,PORCH.u1,PORCH.v0-.2,PORCH.v1,BASE,PORCH.hi+1),0,-(PORCH.hi-PORCH.lo)/(PORCH.v1-PORCH.v0),PORCH.hi+(PORCH.hi-PORCH.lo)/(PORCH.v1-PORCH.v0)*PORCH.v0);

let church=Manifold.union([nave,transept,choir,front,...lis,towerBase,shaft,belfry,spireFoot,spire,sacN,sacS,leanTo,porch,
  cornice(navePoly,NAVE_EAVES),cornice(transPoly,TRANS_EAVES),cornice(choirPoly,CHOIR_EAVES),cornice(frontPoly,FRONT_CORNICE,.35,.5),cornice(sqPoly(T.baseU,T.baseV),FRONT_CORNICE,.35,.5),
  cornice(sqPoly(T.clock,T.clock),T_CORNICE,.35,.4),cornice(sqPoly(T.pier,T.pier),T_BELFRY_CORNICE,.35,.35),
  plinth(navePoly),plinth(transPoly),plinth(choirPoly),plinth(frontPoly),plinth(sqPoly(T.baseU,T.baseV))]);

// Blinde nissen (0,35 m diep) met een spitse top van ~54 graden in plaats van de rondboog.
const niche=(w,z0,z1,depth=.35)=>{const r=w/2,h=z1-z0;return prism([[-r,0],[r,0],[r,h-.7*w],[0,h],[-r,h-.7*w]],-depth,.6).rotate([90,0,0]).translate([0,0,z0])};
const panel=(w,z0,z1,depth=.3)=>box(-w/2,w/2,-.6,depth,z0,z1);
const oculus=(d,zc,depth=.3)=>{const r=d/2/Math.cos(Math.PI/8),p=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;p.push([r*Math.cos(a),r*Math.sin(a)]);}return prism(p,-depth,.6).rotate([90,0,0]).translate([0,0,zc])};
// Nissen liggen in het vlak x/z en snijden naar +y de muur in; onWall plaatst ze per gevel.
const onWall=(n,u,v,deg)=>n.rotate([0,0,deg]).translate([u,v,0]);
const cuts=[];
// Zijbeuken: vier rondboogvensters per zijde.
for(let i=0;i<4;i++){const u=(bays[i]+bays[i+1])/2;cuts.push(onWall(niche(2.0,nap(3.3),nap(8.9)),u,-NAVE.v,0),onWall(niche(2.0,nap(3.3),nap(8.9)),u,NAVE.v,180));}
// Topgevels van het dwarsschip: hoog venster en oculus in de gevelspits.
for(const [v,deg] of [[-TRANS.v,0],[TRANS.v,180]]){cuts.push(onWall(niche(2.4,nap(3.3),nap(9.6)),0,v,deg),onWall(oculus(1.4,nap(13.4)),0,v,deg));}
// Westfront: beeldnissen (Petrus, Paulus) met daaronder een dichtgezet venster.
for(const v of [-5.6,5.6]){cuts.push(onWall(niche(1.7,nap(4.9),nap(8.9)),FRONT.u0,v,-90),onWall(panel(1.7,nap(1.4),nap(4.0)),FRONT.u0,v,-90));}
// Toren: ingang, groot rondboogvenster, beeldnissen op de zijkanten van de onderbouw,
// oculi in de schacht, galmgaten in de klokkengeleding.
const tw=T.uc-T.baseU;
cuts.push(onWall(niche(1.9,BASE,nap(4.3)),tw,T.vc,-90),onWall(niche(2.6,nap(5.4),nap(10.6),.3),tw,T.vc,-90));
for(const [v,deg] of [[T.vc-T.baseV,0],[T.vc+T.baseV,180]])cuts.push(onWall(niche(1.6,nap(4.9),nap(8.9)),T.uc-.6,v,deg));
cuts.push(onWall(oculus(2.0,nap(16.2)),T.uc-T.shaft,T.vc,-90));
for(const [v,deg] of [[T.vc-T.shaft,0],[T.vc+T.shaft,180]])cuts.push(onWall(oculus(1.4,nap(14.6)),T.uc,v,deg));
for(const [u,v,deg] of [[T.uc-T.belfry,T.vc,-90],[T.uc,T.vc-T.belfry,0],[T.uc,T.vc+T.belfry,180],[T.uc+T.belfry,T.vc,90]])cuts.push(onWall(niche(1.5,nap(25.3),nap(29.0),.3),u,v,deg));
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Sint-Martinuskerk Westwoud",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,replacesBuildings:["NL.IMBAG.Pand.0498100000006516"],
  description:"Oorsprong RD (138610, 522198) op de kruising van de nokken, X langs de nok van schip en koor (oostnoordoost); waterstaatskerk van Molkenboer (1851) met driezijdig gesloten koor en westtoren met houten klokkengeleding, torengeledingen en nissen uit foto's geschat.",
  realWorld:{groundNapM:GROUND_NAP,naveEavesNapM:10.5,naveRidgeNapM:17.1,transeptRidgeNapM:17.35,choirRidgeNapM:17.0,frontCorniceNapM:11.6,towerCorniceNapM:24.5,belfryCorniceNapM:30.2,spireTopNapM:42.45,naveWidthM:16.4,transeptLengthM:17.8,lengthM:43.8},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0498100000006516","https://monumentenregister.cultureelerfgoed.nl/monumenten/14065","https://nl.wikipedia.org/wiki/Sint-Martinuskerk_(Westwoud)","https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk,_Westwoud","https://www.openstreetmap.org/way/275130540","https://www.ahn.nl/dataroom"]};

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
