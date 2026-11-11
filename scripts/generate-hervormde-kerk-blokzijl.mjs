// Hervormde Kerk (Grote Kerk) Blokzijl: in 1609 gestichte zaalkerk, in de loop van de
// 17e eeuw uitgebouwd tot kruiskerk met vier even hoge armen onder zadeldaken die aan
// de uiteinden in een steil schild (53 graden) achter een rechte gevel met een
// segmentvormige top eindigen; in de noordarm de toren van 1630 aan de Kerkstraat met
// klokvormige kap, open achtkante lantaarn, koepeltje en naald. Ingangsportaal met
// lage zijvleugels voor de zuidgevel (Brouwerstraat), lage aanbouwen tegen de oostarm.
// Gebouwstelsel: u naar het oosten, v naar het noorden (beide nokken lopen op RD-noord;
// 3D BAG-dakvlakken op 0/90/180/-90 graden), oorsprong RD (193751.7, 526779.1) op de
// kruising van de nokken. Hoogtes in m t.o.v. maaiveld NAP +1,75 m (AHN-DTM rond de kerk).
// Voetafdruk uit BAG-pand 1708100000017874, nok-, goot- en schildhoogtes en hellingen
// uit 3D BAG (LoD2.2) en AHN-DSM, gevelbekroningen en torengeledingen uit de AHN-
// omhullende en foto's (RCE, Commons), vensters en portaal uit foto's geschat.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="hervormde-kerk-blokzijl";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const GROUND_NAP=1.75,nap=z=>+(z-GROUND_NAP).toFixed(3);
const BASE=-.5,ORIGIN=[193751.7,526779.1],X_AXIS=[1,0];
// Schip (west-oost) en dwarsarm (zuid-noord), beide met goot NAP +11,9 en nok NAP +17,4 (41-43 graden).
const NAVE={u0:-13.9,u1:15.5,vS:-5.8,vN:6.15},ARM={uW:-5.9,uE:5.8,vS:-13.1,vN:14.15};
const EAVES=nap(11.9),RIDGE=nap(17.4);
// Schilden aan de armeinden: 53 graden, beginnend op de schouder van de gevel.
const HIP_K=Math.tan(53*Math.PI/180),SHOULDER=nap(14.2);
// Gevelbekroning: rechte schouders met een segmentboog (koorde 6 m) tot NAP +16,3.
const GABLE={t:.9,half:3.0,top:nap(16.3)};
// Toren in de noordarm, voorgevel gelijk met de noordgevel.
const TOWER={uc:-.4,vc:11.575,hu:2.85,hv:2.575},T_CORNICE=nap(22.8);
const BELL=[[nap(22.8),3.1,2.85,.9],[nap(23.3),2.6,2.35,.8],[nap(24.6),1.9,1.8,.6]],BELL_TOP=nap(25.4);
const LANTERN={apo:1.25,ring:1.45,z0:nap(25.3),rail:nap(25.95),z1:nap(28.0)},CAP={z0:nap(28.1),mid:nap(29.3),z1:nap(30.2)},SPIRE_TOP=nap(35.0);
// Ingangsportaal (zuid) met zijvleugels, aanbouwen tegen de oostarm.
const PORCH={u0:-2.6,u1:-.15,v0:-16.0,top:nap(5.05),ped:nap(5.85)},WINGS={u0:-3.9,u1:1.15,v0:-15.4,top:nap(4.05)};
const ANNEX_A={u0:5.8,u1:8.7,v0:-10.7,v1:-5.8,top:nap(5.7),foot:nap(4.2)},ANNEX_B={u0:8.7,u1:14.4,v0:-8.2,v1:-5.8,lo:nap(5.7),hi:nap(11.6)};

const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const hull=pts=>Manifold.hull(pts);
const ring=(poly,z)=>poly.map(([u,v])=>[u,v,z]);
// Houd alles onder het vlak z = z0 + k * (d . p - s0): een schild of lessenaar vanaf een lijn.
const below=(s,[dx,dy],s0,z0,k)=>{const n=Math.hypot(k*dx,k*dy,1);return s.trimByPlane([k*dx/n,k*dy/n,-1/n],(k*s0-z0)/n)};
const chamfer=(uc,vc,a,b,c)=>[[uc-a+c,vc-b],[uc+a-c,vc-b],[uc+a,vc-b+c],[uc+a,vc+b-c],[uc+a-c,vc+b],[uc-a+c,vc+b],[uc-a,vc+b-c],[uc-a,vc-b+c]];
const oct=(uc,vc,apo)=>{const r=apo/Math.cos(Math.PI/8),p=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;p.push([uc+r*Math.cos(a),vc+r*Math.sin(a)]);}return p};

// Schip en dwarsarm: muren tot de goot, zadeldak tot de nok, schilden aan de uiteinden.
const navePoly=rect(NAVE.u0,NAVE.u1,NAVE.vS,NAVE.vN),armPoly=rect(ARM.uW,ARM.uE,ARM.vS,ARM.vN);
let nave=hull([...ring(navePoly,BASE),...ring(navePoly,EAVES),[NAVE.u0,0,RIDGE],[NAVE.u1,0,RIDGE]]);
nave=below(below(nave,[1,0],NAVE.u0,SHOULDER,HIP_K),[-1,0],-NAVE.u1,SHOULDER,HIP_K);
let arm=hull([...ring(armPoly,BASE),...ring(armPoly,EAVES),[0,ARM.vS,RIDGE],[0,ARM.vN,RIDGE]]);
arm=below(arm,[0,1],ARM.vS,SHOULDER,HIP_K);

// Rechte eindgevels met segmentvormige top, 0,9 m dik, voor de schilden (west, oost, zuid).
const gableProfile=(h0,h1)=>{const s=GABLE.top-SHOULDER,r=(GABLE.half**2+s*s)/(2*s),zc=GABLE.top-r,pts=[[h0,BASE],[h1,BASE],[h1,SHOULDER]];
  for(let i=0;i<=16;i++){const x=GABLE.half-2*GABLE.half*i/16;pts.push([x,zc+Math.sqrt(r*r-x*x)]);}pts.push([h0,SHOULDER]);return new CrossSection([pts])};
const gableW=Manifold.extrude(gableProfile(NAVE.vS,NAVE.vN),GABLE.t).rotate([90,0,90]).translate([NAVE.u0,0,0]);
const gableE=Manifold.extrude(gableProfile(NAVE.vS,NAVE.vN),GABLE.t).rotate([90,0,90]).translate([NAVE.u1-GABLE.t,0,0]);
const gableS=Manifold.extrude(gableProfile(ARM.uW,ARM.uE),GABLE.t).rotate([90,0,0]).translate([0,ARM.vS+GABLE.t,0]);

// Toren: schacht tot de kroonlijst, klokvormige kap in drie vlakken (uitzwenkende voet,
// steile buik), achtkante lantaarn met balustraderand en kroonlijst, koepeltje en naald.
const T=TOWER,tPoly=rect(T.uc-T.hu,T.uc+T.hu,T.vc-T.hv,T.vc+T.hv);
const shaft=prism(tPoly,BASE,T_CORNICE);
const towerCornice=hull([...ring(tPoly,T_CORNICE-.45),...ring(chamfer(T.uc,T.vc,BELL[0][1],BELL[0][2],BELL[0][3]),T_CORNICE)]);
const bellLevels=[...BELL.map(([z,a,b,c])=>ring(chamfer(T.uc,T.vc,a,b,c),z)),ring(oct(T.uc,T.vc,LANTERN.ring),BELL_TOP)];
const bell=Manifold.union(bellLevels.slice(1).map((l,i)=>hull([...bellLevels[i],...l])));
const lantern=Manifold.union([prism(oct(T.uc,T.vc,LANTERN.apo),LANTERN.z0,LANTERN.z1),prism(oct(T.uc,T.vc,LANTERN.ring),LANTERN.z0,LANTERN.rail),
  hull([...ring(oct(T.uc,T.vc,LANTERN.apo),LANTERN.z1-.3),...ring(oct(T.uc,T.vc,1.5),LANTERN.z1-.05),...ring(oct(T.uc,T.vc,1.5),CAP.z0)])]);
const cap=Manifold.union([hull([...ring(oct(T.uc,T.vc,1.5),CAP.z0-.01),...ring(oct(T.uc,T.vc,1.0),CAP.mid)]),hull([...ring(oct(T.uc,T.vc,1.0),CAP.mid-.01),...ring(oct(T.uc,T.vc,.5),CAP.z1)])]);
const spire=hull([...ring(oct(T.uc,T.vc,.45),CAP.z1-.01),[T.uc,T.vc,SPIRE_TOP]]);

// Portaal: middendeel met segmentvormig fronton, lagere zijvleugels.
const P=PORCH,pedH=(P.u1-P.u0)/2,pedS=P.ped-P.top,pedR=(pedH*pedH+pedS*pedS)/(2*pedS);
const pedProfile=(()=>{const zc=P.ped-pedR,pts=[[-pedH,P.top-.3],[pedH,P.top-.3]];for(let i=0;i<=10;i++){const x=pedH-2*pedH*i/10;pts.push([x,zc+Math.sqrt(pedR*pedR-x*x)]);}return new CrossSection([pts])})();
const porch=Manifold.union([box(P.u0,P.u1,P.v0,ARM.vS+.3,BASE,P.top),box(WINGS.u0,WINGS.u1,WINGS.v0,ARM.vS+.3,BASE,WINGS.top),
  Manifold.extrude(pedProfile,.9).rotate([90,0,0]).translate([(P.u0+P.u1)/2,P.v0+.9,0])]);
// Aanbouwen: plat afgedekte aanbouw met schuine voorkant, lessenaar tegen het schip.
const annexA=below(box(ANNEX_A.u0-.3,ANNEX_A.u1,ANNEX_A.v0,ANNEX_A.v1+.3,BASE,ANNEX_A.top),[0,1],ANNEX_A.v0,ANNEX_A.foot,1.2);
const annexB=below(box(ANNEX_B.u0-.3,ANNEX_B.u1,ANNEX_B.v0,ANNEX_B.v1+.3,BASE,ANNEX_B.hi),[1,0],ANNEX_B.u0,ANNEX_B.lo,(ANNEX_B.hi-ANNEX_B.lo)/(ANNEX_B.u1-ANNEX_B.u0));

// Wijzerplaten: achtkante schijven van 1,7 m die 0,15 m voor de toren liggen.
const clock=(u,v,deg)=>Manifold.extrude(new CrossSection([oct(0,0,.85)]),.25).rotate([90,0,0]).translate([0,.1,nap(21.2)]).rotate([0,0,deg]).translate([u,v,0]);
const clocks=[clock(T.uc,T.vc+T.hv,180),clock(T.uc,T.vc-T.hv,0),clock(T.uc-T.hu,T.vc,-90),clock(T.uc+T.hu,T.vc,90)];

let church=Manifold.union([nave,arm,gableW,gableE,gableS,shaft,towerCornice,bell,lantern,cap,spire,porch,annexA,annexB,...clocks]);

// Blinde nissen (0,35 m diep) met een spitse top van ~54 graden in plaats van de rondboog.
const niche=(w,z0,z1,depth=.35)=>{const r=w/2,h=z1-z0;return prism([[-r,0],[r,0],[r,h-.7*w],[0,h],[-r,h-.7*w]],-depth,.6).rotate([90,0,0]).translate([0,0,z0])};
// Nissen liggen in het vlak x/z en snijden naar +y de muur in; onWall plaatst ze per gevel.
const onWall=(n,u,v,deg)=>n.rotate([0,0,deg]).translate([u,v,0]);
const cuts=[];
// Eindgevels: twee hoge vensters met tracering (west, oost), zuid twee vensters en een blinde boog.
for(const v of [-2.4,2.4])cuts.push(onWall(niche(2.6,nap(5.5),nap(11.6)),NAVE.u0,v,-90),onWall(niche(2.6,nap(5.5),nap(11.6)),NAVE.u1,v,90));
cuts.push(onWall(niche(3.0,nap(5.55),nap(11.85)),-2.8,ARM.vS,0),onWall(niche(2.7,nap(5.55),nap(11.6)),.75,ARM.vS,0),onWall(niche(2.1,nap(5.55),nap(10.5),.3),3.7,ARM.vS,0));
// Lange muren: één hoog venster per vrij muurvak (aantal en plaats geschat).
const side=(u,v,deg)=>onWall(niche(2.2,nap(5.0),nap(11.0)),u,v,deg);
cuts.push(side(-9.9,NAVE.vS,0),side(-9.9,NAVE.vN,180),side(10.6,NAVE.vN,180),side(ARM.uE,9.6,90),side(ARM.uW,9.6,-90),side(ARM.uW,-9.5,-90));
// Portaal: middendeur en twee zijdeuren.
cuts.push(onWall(niche(1.5,BASE,nap(4.3),.3),(P.u0+P.u1)/2,P.v0,0),onWall(niche(.95,BASE,nap(3.5),.3),(WINGS.u0+P.u0)/2,WINGS.v0,0),onWall(niche(.95,BASE,nap(3.5),.3),(WINGS.u1+P.u1)/2,WINGS.v0,0));
// Toren: deur en galmgat in de noordgevel, galmgaten opzij en achter boven het dak.
cuts.push(onWall(niche(1.3,BASE,nap(4.4),.3),T.uc,ARM.vN,180),onWall(niche(1.3,nap(15.4),nap(18.9)),T.uc,ARM.vN,180));
cuts.push(onWall(niche(1.2,nap(16.6),nap(19.6)),T.uc-T.hu,T.vc,-90),onWall(niche(1.2,nap(16.6),nap(19.6)),T.uc+T.hu,T.vc,90),onWall(niche(1.2,nap(18.0),nap(20.0)),T.uc,T.vc-T.hv,0));
// Lantaarn: acht spitse openingen als nis, midden op elk vlak.
for(let i=0;i<8;i++){const a=Math.PI/4*i,deg=a*180/Math.PI+90;cuts.push(onWall(niche(.6,nap(26.0),nap(27.5),.3),T.uc+LANTERN.apo*Math.cos(a),T.vc+LANTERN.apo*Math.sin(a),deg));}
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Hervormde Kerk Blokzijl",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,replacesBuildings:["NL.IMBAG.Pand.1708100000017874"],
  description:"Oorsprong RD (193751.7, 526779.1) op de kruising van de nokken, X naar het oosten; kruiskerk (1609, 17e eeuw uitgebouwd) met schilden achter rechte gevels met segmenttop en de toren van 1630 in de noordarm; torenbekroning, vensters en portaal uit foto's geschat.",
  realWorld:{groundNapM:GROUND_NAP,eavesNapM:11.9,ridgeNapM:17.4,hipPitchDeg:53,gableShoulderNapM:14.2,gableTopNapM:16.3,towerCorniceNapM:22.8,bellRoofTopNapM:25.4,lanternTopNapM:28.0,capTopNapM:30.2,spireTopNapM:35.0,naveLengthM:29.4,armLengthM:27.25,naveWidthM:11.95,armWidthM:11.7},
  sources:["https://service.pdok.nl/lv/bag/wfs/v2_0 (pand 1708100000017874)","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000017874","https://monumentenregister.cultureelerfgoed.nl/monumenten/10448","https://nl.wikipedia.org/wiki/Hervormde_kerk_(Blokzijl)","https://commons.wikimedia.org/w/index.php?search=Blokzijl+kerk&ns6=1","https://www.openstreetmap.org/way/267114635","https://service.pdok.nl/rws/ahn/wcs/v1_0 (dsm_05m, dtm_05m)"]};

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
