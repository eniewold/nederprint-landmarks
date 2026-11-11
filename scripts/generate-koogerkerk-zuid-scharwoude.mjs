// Koogerkerk (Hervormde kerk) Zuid-Scharwoude: gepleisterde eenbeukige kerk uit 1819
// met driezijdige koorsluiting; na de instorting van de toren in 1905 ingekort en
// voorzien van een bakstenen westgevel met half ingebouwde geveltoren en naaldspits.
// Gebouwstelsel: u langs de nok van het schip (oost +), v naar het noorden,
// oorsprong RD (116251.977, 523157.569) midden in het schip. Hoogtes in m t.o.v.
// maaiveld NAP +0,40 m. Voetafdruk uit BAG-pand 0416100000203769, goot, nok en
// dakhelling uit 3D BAG (LoD2.2) en AHN5-DSM, spitshoogte uit het AHN5-DSM,
// torengeledingen, vensters en nissen uit foto's (RCE, Commons).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="koogerkerk-zuid-scharwoude";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const GROUND_NAP=.4,nap=z=>+(z-GROUND_NAP).toFixed(3);
// De oostgevel van de aanbouw staat op de oever van een sloot (AHN-DTM -1,2 tot -1,35 m
// op 0,5 m buiten de muur): de voet loopt daarom tot 1,8 m onder maaiveld door. Het
// maaiveld wordt rond schip en toren gemeten (groundSamplePoints), niet op de
// bbox-hoeken in de sloot.
const BASE=-1.8,ORIGIN=[116251.977,523157.569],X_AXIS=[.99805,.06238];
// Schip (9,73 m breed) en driezijdige koorsluiting; muren uit de BAG.
const NAVE={u0:-12.27,v0:-4.86,v1:4.87};
const APSE={A:[12.33,-4.86],B:[17.2,-2.47],C:[17.2,2.95],D:[12.34,4.87]};
const EAVES=nap(9.0),RIDGE=nap(14.35),RIDGE_END=12.33;   // dakhelling ~48 graden
// Geveltoren (1905), 3,45 m in het vierkant, 1,22 m voor de westgevel.
const TOWER={u0:-13.49,u1:-10.04,v0:-1.89,v1:1.56};
const TU=(TOWER.u0+TOWER.u1)/2,TV=(TOWER.v0+TOWER.v1)/2,TH=(TOWER.u1-TOWER.u0)/2;
const T_CORNICE=nap(19.25),T_TOP=nap(19.55),GABLET_TOP=nap(21.15),SPIRE_TOP=nap(29.6),SPIRE_APOTHEM=1.45;
// Aanbouw aan de oostzijde (consistorie, deel van hetzelfde BAG-pand): zadeldak met nok noord-zuid.
const ANNEX=[[18.35,4.92],[24.78,6.66],[28.68,-7.84],[22.25,-9.57]],ANNEX_EAVES=nap(4.9),ANNEX_RIDGE=nap(6.57);
const LINK={u0:17.0,u1:20.6,v0:-1.95,v1:1.15,top:nap(3.6)};

const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const hull=pts=>Manifold.hull(pts);
const ring=(poly,z)=>poly.map(([u,v])=>[u,v,z]);
const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];

// Schip en koor als één convex lichaam: muren tot de goot, zadeldak tot de nok,
// koorsluiting met drie dakschilden naar het eind van de nok.
const navePoly=[[NAVE.u0,NAVE.v0],APSE.A,APSE.B,APSE.C,APSE.D,[NAVE.u0,NAVE.v1]];
const nave=hull([...ring(navePoly,BASE),...ring(navePoly,EAVES),[NAVE.u0,0,RIDGE],[RIDGE_END,0,RIDGE]]);
// Westgevel: verhoogde gevelafdekking (0,9 m diep, 0,35 m boven de dakvlakken) en
// hoekpijlers die tot boven de goot doorlopen als schouderstukken.
const slope=(RIDGE-EAVES)/4.865;
let coping=box(NAVE.u0,NAVE.u0+.9,NAVE.v0-.1,NAVE.v1+.1,EAVES-.5,RIDGE+1);
coping=plane(coping,0,slope,RIDGE+.35);coping=plane(coping,0,-slope,RIDGE+.35);
const corners=[box(NAVE.u0,NAVE.u0+.9,NAVE.v0-.8,NAVE.v0+.05,BASE,EAVES+.3),box(NAVE.u0,NAVE.u0+.9,NAVE.v1-.05,NAVE.v1+.8,BASE,EAVES+.3)];
// Aanbouw en verbindingsstuk met plat dak.
const annexRidge=[mid(ANNEX[0],ANNEX[1]),mid(ANNEX[2],ANNEX[3])];
const annex=hull([...ring(ANNEX,BASE),...ring(ANNEX,ANNEX_EAVES),...annexRidge.map(([u,v])=>[u,v,ANNEX_RIDGE])]);
const link=box(LINK.u0,LINK.u1,LINK.v0,LINK.v1,BASE,LINK.top);

// Steunberen (lisenen met schuine afdekking, 53 graden) in een eigen stelsel naar buiten langs +x.
const buttress=(u,v,deg,w,depth,top)=>{let b=box(-.4,depth,-w/2,w/2,BASE,top+1);b=plane(b,-1.33,0,top);return b.rotate([0,0,deg]).translate([u,v,0])};
const bt=[];
for(const u of [-7.27,-.05,6.31,11.95])bt.push(buttress(u,NAVE.v0,-90,.9,.8,nap(7.7)),buttress(u,NAVE.v1,90,.9,.8,nap(7.7)));
const radial=(p,q,r)=>{const e=(a)=>{const d=[a[0]-q[0],a[1]-q[1]],l=Math.hypot(...d);return d.map(x=>x/l)},e1=e(p),e2=e(r);return Math.atan2(-(e1[1]+e2[1]),-(e1[0]+e2[0]))*180/Math.PI};
const A=APSE;for(const [p,q,r] of [[A.A,A.B,A.C],[A.B,A.C,A.D]])bt.push(buttress(q[0],q[1],radial(p,q,r),.9,.7,nap(7.7)));

// Toren: schacht tot de kroonlijst op een schuine kraag, vier wimbergen, hoekpinakels
// en een achtzijdige naaldspits.
const sqPts=(h)=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[TU+a*h,TV+b*h]);
const towerBody=box(TOWER.u0,TOWER.u1,TOWER.v0,TOWER.v1,BASE,T_CORNICE);
const cornice=hull([...ring(sqPts(TH),T_CORNICE-.01),...ring(sqPts(TH+.2),T_CORNICE+.2),...ring(sqPts(TH+.2),T_TOP)]);
const spire=Manifold.cylinder(SPIRE_TOP-T_TOP,SPIRE_APOTHEM/Math.cos(Math.PI/8),.05,8).rotate([0,0,22.5]).translate([TU,TV,T_TOP-.01]);
const gablets=[],pinnacles=[];
const gw=TH+.1,grise=GABLET_TOP-T_TOP;   // wimbergen over de volle torenbreedte
for(const deg of [0,90,180,270]){let g=box(0,TH+.15,-gw,gw,T_TOP-.01,GABLET_TOP+.1);g=plane(g,0,grise/gw,GABLET_TOP);g=plane(g,0,-grise/gw,GABLET_TOP);gablets.push(g.rotate([0,0,deg]).translate([TU,TV,0]));}
for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const cu=TU+a*(TH-.3),cv=TV+b*(TH-.3),sqp=[[cu-.45,cv-.45],[cu+.45,cv-.45],[cu+.45,cv+.45],[cu-.45,cv+.45]];pinnacles.push(hull([...ring(sqp,T_TOP-.01),...ring(sqp,T_TOP+.7),[cu,cv,T_TOP+1.35]]));}

let church=Manifold.union([nave,coping,...corners,annex,link,...bt,towerBody,cornice,spire,...gablets,...pinnacles]);

// Blinde nissen (0,3–0,35 m diep). niche() ligt in het vlak x/z en snijdt naar +y in de muur.
const niche=(w,z0,z1,depth=.35)=>{const r=w/2,h=z1-z0;return prism([[-r,0],[r,0],[r,h-.7*w],[0,h],[-r,h-.7*w]],-depth,.6).rotate([90,0,0]).translate([0,0,z0])};
// Rondboognis (zijvensters van 1819) met een halve achthoek als boog.
const roundNiche=(w,z0,z1,depth=.35)=>{const r=w/2,h=z1-z0,c=h-r;return prism([[-r,0],[r,0],[r,c],[r*.707,c+r*.707],[0,h],[-r*.707,c+r*.707],[-r,c]],-depth,.6).rotate([90,0,0]).translate([0,0,z0])};
const onWall=(n,u,v,deg)=>n.rotate([0,0,deg]).translate([u,v,0]);
const cuts=[];
for(const u of [-9.3,-3.66,3.13,9.13]){cuts.push(onWall(roundNiche(1.8,nap(2.4),nap(7.2)),u,NAVE.v0,0),onWall(roundNiche(1.8,nap(2.4),nap(7.2)),u,NAVE.v1,180));}
for(const [p,q] of [[A.A,A.B],[A.C,A.D]]){const deg=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI,[u,v]=mid(p,q);cuts.push(onWall(roundNiche(1.9,nap(2.4),nap(7.4)),u,v,deg));}
// Westgevel: twee spitsboogvensters naast de toren.
for(const v of [-3.45,3.45])cuts.push(onWall(niche(1.5,nap(2.2),nap(6.9)),NAVE.u0,v,-90));
// Toren: deur met boogveld, groot spitsboogvenster, galmgaten op elke zijde.
cuts.push(onWall(niche(1.6,BASE,nap(4.6)),TOWER.u0,TV,-90));
cuts.push(onWall(niche(1.3,nap(8.4),nap(12.4)),TOWER.u0,TV,-90));
for(const [u,v,deg] of [[TOWER.u0,TV,-90],[TU,TOWER.v0,0],[TU,TOWER.v1,180],[TOWER.u1,TV,90]])cuts.push(onWall(niche(1.7,nap(17.3),nap(19.0),.3),u,v,deg));
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Koogerkerk Zuid-Scharwoude",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,groundSamplePoints:[[-14.2,0],[-12.8,-6],[-12.8,6],[0,-6],[0,6],[12,-6],[12,6],[18,-3.5],[18,3.8]],replacesBuildings:["NL.IMBAG.Pand.0416100000203769"],
  description:"Oorsprong RD (116251.977, 523157.569) midden in het schip, X langs de nok naar het oosten (3,6 graden); kerk uit 1819 met driezijdige koorsluiting, geveltoren met naaldspits uit 1905 en oostelijke aanbouw, torengeledingen en nissen uit foto's geschat.",
  realWorld:{groundNapM:GROUND_NAP,eavesNapM:9.0,ridgeNapM:14.35,towerCorniceNapM:19.55,gabletTopNapM:21.15,spireTopNapM:29.6,naveWidthM:9.73,lengthM:29.5,annexRidgeNapM:6.57},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0416100000203769","https://monumentenregister.cultureelerfgoed.nl/monumenten/23928","https://commons.wikimedia.org/wiki/File:Nederlands_Hervormde_Kerk,_Zuid-Scharwoude.jpg","https://commons.wikimedia.org/wiki/File:Toren_-_Zuid-Scharwoude_-_20225773_-_RCE.jpg","https://www.openstreetmap.org/way/51226423","https://www.ahn.nl/dataroom"]};

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
// Losse printbestanden zonder het deel onder maaiveld (vanaf 0,5 m eronder).
const PRINT_BASE=-.5,glb=`${slug}.glb`,printSolid=church.trimByPlane([0,0,1],PRINT_BASE).translate([0,0,-PRINT_BASE]),printFiles=[];
await writeFile(path.join(outDir,glb),toGlb(parts));
for(const scale of [100,1000]){const f=`${slug}-1-${scale}.stl`;printFiles.push(f);await writeFile(path.join(outDir,f),toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale));}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2)+"\n");
