// Maria Geboortekerk, Nijmegen (Berg en Dalseweg 40-42, rijksmonument 522947).
// Neogotische kruisbasiliek van Johannes Kayser (schip 1900-1901) en Jules Kayser
// (koor, dwarsschip en voorgevel 1923-1924): driebeukig schip van zes traveeën
// met luchtbogen over de zijbeuken, dwarsschip met topgevels, koortravee met twee
// kapellen, lagere vijfzijdige apsis, achtkante dakruiter met naald op de viering
// en twee achtkante traptorens met spits aan de voorgevel. Op hetzelfde BAG-pand
// staan de sacristie achter het koor en de pastorie (Berg en Dalseweg 40) met
// een gang naar de kerk.
// Bouwstelsel: +X langs de kerkas van het koor naar de voorgevel (NNO), +Y naar
// het WNW, Z omhoog, z = 0 op NAP +32,6 m (verdiepte binnenplaats en koorzijde;
// het voorplein ligt 2,5 m hoger). Oorsprong op de viering.
// Maten: footprint uit de BAG, nok-, goot- en dakhoogtes uit het AHN-DSM 0,5 m,
// geleding, vensters en spitsen uit foto's (Commons, RCE).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="maria-geboortekerk-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const BASE=-1,GROUND_NAP=32.6,ORIGIN=[188482.4,428281.4],X_AXIS=[0.3859,0.9225];
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Houd alles onder het vlak z = a x + b y + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Dakvlak dat bij de rand p0-p1 (polygoon linksom) op zEave ligt en met helling k naar binnen stijgt.
const eaveSlope=(s,p0,p1,zEave,k)=>{const dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;return plane(s,-k*nx,-k*ny,zEave+k*(p0[0]*nx+p0[1]*ny))};
const hipAll=(s,poly,zEave,k)=>{const p=ccw(poly);for(let i=0;i<p.length;i++)s=eaveSlope(s,p[i],p[(i+1)%p.length],zEave,k);return s};
// Zadeldak met de nok evenwijdig aan X (op y = yc) of aan Y (op x = xc).
const ridgeX=(s,yc,zr,k)=>plane(plane(s,0,-k,zr+k*yc),0,k,zr-k*yc);
const ridgeY=(s,xc,zr,k)=>plane(plane(s,-k,0,zr+k*xc),k,0,zr-k*xc);
const oct=(r,z,cx=0,cy=0)=>Array.from({length:8},(_,i)=>{const R=r/Math.cos(Math.PI/8),t=Math.PI/8+i*Math.PI/4;return[cx+R*Math.cos(t),cy+R*Math.sin(t),z]});
const oct2=(r,cx,cy)=>oct(r,0,cx,cy).map(p=>[p[0],p[1]]);

// --- Maten (m, boven NAP +32,6) ---
const NAVE_W=6.1,NAVE_EAVE=23.4,RIDGE=32.8,K=(RIDGE-NAVE_EAVE)/NAVE_W;          // 57 graden
const CHOIR_U=-11.2,FRONT_U=44.1;
const TR_U=5.9,TR_V=13.9;                                                       // dwarsschip
const AISLE_V=11.7,AISLE_V_W=10.8,AISLE_W_U=36.3,AISLE_END=40.3,AISLE_EAVE=12.0,AISLE_K=0.6;
const APSE_W=5.5,APSE_C=-15.8,APSE_EAVE=19.5,APSE_K=1.58;                        // nok +28,2
const T_U=42.2,T_V=6.3,T_R=1.95,T_DRUM=27.9,T_TOP=35.5;                          // traptorens
const FLECHE_R=1.55,FLECHE_LANTERN=38.0,FLECHE_TOP=49.5;                          // dakruiter
const BAYS=[10.3,15.3,20.2,25.3,30.3,35.8];
const FRONT_GROUND=2.5;                                                         // voorplein

// --- Schip en koortravee, dwarsschip (zelfde dwarsprofiel) ---
let nave=box(CHOIR_U,FRONT_U,-NAVE_W,NAVE_W,BASE,RIDGE+1);nave=ridgeX(nave,0,RIDGE,K);
let transept=box(-TR_U,TR_U,-TR_V,TR_V,BASE,RIDGE+1);transept=ridgeY(transept,0,RIDGE,K);
// Topgevels: 0,35 m boven het dakvlak, met een vlakke kraag van 0,6 m dik.
const gableWall=(a,b,c,d,dir)=>{let g=box(a,b,c,d,BASE,RIDGE+1.5);return dir==="x"?ridgeX(g,0,RIDGE+0.4,K):ridgeY(g,0,RIDGE+0.4,K)};
const gables=[gableWall(FRONT_U-0.6,FRONT_U,-NAVE_W-0.05,NAVE_W+0.05,"x"),gableWall(CHOIR_U,CHOIR_U+0.6,-NAVE_W-0.05,NAVE_W+0.05,"x"),
  gableWall(-TR_U-0.05,TR_U+0.05,TR_V-0.6,TR_V,"y"),gableWall(-TR_U-0.05,TR_U+0.05,-TR_V,-TR_V+0.6,"y")];
const chimney=box(CHOIR_U+0.1,CHOIR_U+1.0,-0.45,0.45,28,RIDGE+1.4);

// --- Zijbeuken met lessenaarsdak tegen de lichtbeuk, smaller laatste travee bij de torens ---
const aislePoly=s=>[[TR_U-0.2,s*NAVE_W*0.9],[AISLE_W_U,s*NAVE_W*0.9],[AISLE_W_U,s*AISLE_V],[TR_U-0.2,s*AISLE_V]];
const aisleWest=s=>[[AISLE_W_U-0.1,s*NAVE_W*0.9],[AISLE_END,s*NAVE_W*0.9],[AISLE_END,s*9.6],[AISLE_END-1.1,s*AISLE_V_W],[AISLE_W_U-0.1,s*AISLE_V_W]];
const aisles=[];
for(const s of [-1,1])for(const p of [aislePoly(s),aisleWest(s)]){let a=prism(p,BASE,17);a=plane(a,0,-s*AISLE_K,AISLE_EAVE+AISLE_K*AISLE_V);aisles.push(a)}

// --- Apsis: vijf zijden van een achthoek, lager schilddak ---
const t=APSE_W*Math.tan(Math.PI/8);
const apseP=[[CHOIR_U+0.3,-APSE_W],[APSE_C-t,-APSE_W],[APSE_C-APSE_W,-t],[APSE_C-APSE_W,t],[APSE_C-t,APSE_W],[CHOIR_U+0.3,APSE_W]];
let apse=prism(apseP,BASE,30);
{const p=ccw(apseP);for(let i=0;i<p.length;i++){if(p[i][0]>CHOIR_U&&p[(i+1)%p.length][0]>CHOIR_U)continue;apse=eaveSlope(apse,p[i],p[(i+1)%p.length],APSE_EAVE,APSE_K)}}

// --- Kapellen naast de koortravee: zadeldak dwars op het koor, topgevel naar buiten ---
const chapels=[];
for(const s of [-1,1]){
  const p=[[-5.9,s*5.9],[-5.9,s*11.0],[-7.1,s*12.2],[-10.8,s*12.2],[-12.0,s*11.0],[-12.0,s*5.9]];
  let c=prism(p,BASE,19);c=ridgeY(c,-8.95,17.2,1.55);chapels.push(c);
  // Traptorentje in de hoek van dwarsschip en kapel.
  chapels.push(box(-7.2,-5.7,s>0?9.0:-10.5,s>0?10.5:-9.0,BASE,20.6),Manifold.hull([[-7.2,s*9.0,20.55],[-5.7,s*9.0,20.55],[-5.7,s*10.5,20.55],[-7.2,s*10.5,20.55],[-6.45,s*9.75,23.6]]));
}
// Lage verbindingsbouw tussen koor, kapellen en sacristie; klein aanbouwtje aan de oostzijde.
const lowParts=[box(-15.2,-5.9,5.3,13.7,BASE,7.2),box(-15.2,-11.0,-7.0,-5.3,BASE,7.0)];
// Sacristie: twee vleugels met zadeldak, nokken evenwijdig aan het koor.
let sacA=box(-15.2,-7.4,13.6,19.4,BASE,14);sacA=ridgeX(sacA,16.5,13.1,1.07);
let sacB=box(-22.5,-15.15,7.1,16.5,BASE,15);sacB=ridgeX(sacB,11.8,14.0,0.95);
// Lage portaaltjes naast het dwarsschip.
const porches=[box(TR_U-0.2,8.6,AISLE_V-0.2,13.6,BASE,6.0),box(TR_U-0.2,9.7,-14.4,-AISLE_V+0.2,BASE,6.0)];

// --- Steunberen ---
const buttress=(x,y,dx,dy,w,d,zTop)=>{ // voet op de muur (x,y), naar buiten (dx,dy)
  const tx=-dy,ty=dx,h=w/2,pts=[];
  for(const s of [-1,1]){const bx=x+tx*h*s,by=y+ty*h*s;
    pts.push([bx-dx*0.2,by-dy*0.2,BASE],[bx+dx*d,by+dy*d,BASE],[bx+dx*d,by+dy*d,zTop],[bx-dx*0.2,by-dy*0.2,zTop+d*1.3]);}
  return Manifold.hull(pts);
};
const butts=[];
// Hoeken van het dwarsschip.
for(const s of [-1,1])for(const u of [-5.05,5.05])butts.push(buttress(u,s*TR_V,0,s,1.35,0.45,19.5));
// Luchtbogen: pijler op de zijbeukmuur met pinakel, schuine boog als volle schijf tot de lichtbeuk.
const pinnacle=(u,v,z0,z1,w=0.9)=>Manifold.hull([[u-w/2,v-w/2,z0],[u+w/2,v-w/2,z0],[u+w/2,v+w/2,z0],[u-w/2,v+w/2,z0],[u,v,z1]]);
for(const u of BAYS)for(const s of [-1,1]){
  const vo=u>AISLE_W_U?AISLE_V_W:AISLE_V;
  butts.push(box(u-0.45,u+0.45,s>0?vo-0.3:-vo-0.7,s>0?vo+0.7:-vo+0.3,BASE,17.0));
  butts.push(pinnacle(u,s*(vo+0.2),16.95,20.8));
  butts.push(Manifold.hull([[u-0.45,s*(vo-0.3),11.0],[u+0.45,s*(vo-0.3),11.0],[u-0.45,s*(vo-0.3),17.0],[u+0.45,s*(vo-0.3),17.0],
    [u-0.45,s*(NAVE_W-0.3),15.0],[u+0.45,s*(NAVE_W-0.3),15.0],[u-0.45,s*(NAVE_W-0.3),21.2],[u+0.45,s*(NAVE_W-0.3),21.2]]));
}
// Pinakels op de hoeken van de zijbeukfronten.
for(const s of [-1,1])butts.push(box(AISLE_END-0.9,AISLE_END,s>0?9.6:-10.5,s>0?10.5:-9.6,BASE,15.0),pinnacle(AISLE_END-0.45,s*10.05,14.95,18.8));
// Steunberen tegen de apsis op de hoeken.
for(const s of [-1,1]){
  butts.push(buttress(APSE_C-t,s*APSE_W,-0.383,s*0.924,0.9,0.7,15.5));
  butts.push(buttress(APSE_C-APSE_W,s*t,-0.924,s*0.383,0.9,0.7,15.5));
}

// --- Traptorens aan de voorgevel: achtkante schacht, kraag, achtkante spits ---
const towers=[];
for(const s of [-1,1]){const c=[T_U,s*T_V];
  towers.push(prism(oct2(T_R,...c),BASE,T_DRUM));
  towers.push(Manifold.hull([...oct(T_R,22.9,...c),...oct(T_R+0.25,23.15,...c),...oct(T_R+0.25,24.0,...c)]));
  towers.push(Manifold.hull([...oct(T_R+0.1,T_DRUM-0.05,...c),...oct(T_R+0.1,T_DRUM+0.35,...c),...oct(0.25,T_TOP,...c)]));
}
// Voorportaal met topgeveltje.
let porch=box(FRONT_U-0.5,FRONT_U+0.5,-3.1,3.1,BASE,13);porch=ridgeX(porch,0,12.0,1.0);

// --- Dakruiter op de viering: achtkante lantaarn met wimbergen en naald ---
const fleche=[prism(oct2(FLECHE_R,0,0),28,FLECHE_LANTERN),Manifold.hull([...oct(FLECHE_R,FLECHE_LANTERN-0.05,0,0),...oct(0.2,FLECHE_TOP,0,0)])];
for(let i=0;i<8;i++){const th=i*Math.PI/4,nx=Math.cos(th),ny=Math.sin(th),tx=-ny,ty=nx,w=0.64,r0=FLECHE_R-0.2,r1=FLECHE_R+0.3;
  const pts=[];for(const r of [r0,r1]){for(const sgn of [-1,1])pts.push([nx*r+tx*w*sgn,ny*r+ty*w*sgn,36.6]);pts.push([nx*r,ny*r,39.6])}
  fleche.push(Manifold.hull(pts));
  pts.length=0;for(const r of [r0,r1])for(const sgn of [-1,1])pts.push([nx*r+tx*w*sgn,ny*r+ty*w*sgn,36.6],[nx*r+tx*w*sgn,ny*r+ty*w*sgn,36.0]);
  pts.push([nx*r0,ny*r0,35.4]);fleche.push(Manifold.hull(pts));
}

// --- Dakkapellen met zadeldak op schip en dwarsschip ---
const dormers=[];
const dormerV=(u,s)=>{let d=box(u-0.6,u+0.6,s>0?2.6:-4.7,s>0?4.7:-2.6,25.0,28.0);return ridgeY(d,u,27.85,1.1)};
for(let i=0;i<BAYS.length;i++){const u=i===0?(TR_U+BAYS[0])/2:(BAYS[i-1]+BAYS[i])/2;for(const s of [-1,1])dormers.push(dormerV(u,s))}
for(const s of [-1,1])dormers.push(dormerV(33.05+5.1,s),dormerV(-8.5,s));
for(const s of [-1,1])for(const sv of [-1,1]){let d=box(s>0?2.6:-4.7,s>0?4.7:-2.6,sv*9.5-0.6,sv*9.5+0.6,25.0,28.0);dormers.push(ridgeX(d,sv*9.5,27.85,1.1))}

// --- Pastorie (Berg en Dalseweg 40) met gang naar de kerk ---
const pastP=[[50.4,9.3],[64.3,10.3],[63.45,22.6],[50.05,22.7]];
let pastorie=prism(pastP,BASE,20);pastorie=hipAll(pastorie,pastP,12.6,0.72);
const pastChimney=box(50.8,51.7,16.6,17.5,10,17.1);
const corridor=[prism([[35.6,AISLE_V-0.3],[40.06,AISLE_V-0.3],[40.06,14.45],[37.4,17.2],[35.6,17.2]],BASE,5.1),box(40.0,50.6,11.3,13.2,BASE,5.5),box(47.25,50.6,13.0,22.75,BASE,6.5)];

let church=Manifold.union([nave,transept,...gables,chimney,...aisles,apse,...chapels,...lowParts,sacA,sacB,...porches,...butts,...towers,porch,...fleche,...dormers,pastorie,pastChimney,...corridor]);

// --- Blinde nissen: spitsboogvensters, portaal, roosvensters ---
// Nis in een muur met buitennormaal (nx,ny) door punt (x,y); spitse top onder 45 graden.
const niche=(x,y,nx,ny,w,z0,z1,depth=0.35)=>{
  const tx=-ny,ty=nx,h=w/2,pts=[];
  for(const dd of [-depth,0.3])for(const s of [-1,1]){const px=x+nx*dd+tx*h*s,py=y+ny*dd+ty*h*s;pts.push([px,py,z0],[px,py,z1]);}
  for(const dd of [-depth,0.3])pts.push([x+nx*dd,y+ny*dd,z1+h]);
  return Manifold.hull(pts);
};
const cuts=[];
const bayMids=[(TR_U+BAYS[0])/2,...BAYS.slice(1).map((u,i)=>(BAYS[i]+u)/2),(BAYS[5]+AISLE_END)/2];
for(const u of bayMids)for(const s of [-1,1]){
  const vo=u>AISLE_W_U?AISLE_V_W:AISLE_V;
  if(u>9)cuts.push(niche(u,s*vo,0,s,1.4,4.0,9.0));                // zijbeukvensters
  cuts.push(niche(u,s*NAVE_W,0,s,1.8,16.6,20.4));           // lichtbeuk
}
for(const s of [-1,1]){
  cuts.push(niche(0,s*TR_V,0,s,5.4,8.0,17.0,0.4));          // venster in de topgevel van het dwarsschip
  for(const o of [-1.4,0,1.4])cuts.push(niche(o,s*TR_V,0,s,0.9,23.0,25.2-Math.abs(o)*0.8));
  cuts.push(niche(-8.95+0,s*12.2,0,s,0.9,4.5,7.6),niche(-10.0,s*12.2,0,s,0.9,4.5,7.0),niche(-7.9,s*12.2,0,s,0.9,4.5,7.0));
  cuts.push(niche(-8.5,s*NAVE_W,0,s,1.8,18.2,20.6));        // koortravee boven de kapel
}
// Apsisvensters op de vijf zijden.
{const faces=[[APSE_C-APSE_W,0,-1,0],[APSE_C-t*1.5,-APSE_W+t*0.5,-0.707,-0.707],[APSE_C-t*1.5,APSE_W-t*0.5,-0.707,0.707],[APSE_C-0.5,-APSE_W,0,-1],[APSE_C-0.5,APSE_W,0,1]];
  for(const [x,y,nx,ny] of faces)cuts.push(niche(x,y,nx,ny,1.3,8.0,16.0));
  for(const s of [-1,1])cuts.push(niche(-13.0,s*APSE_W,0,s,1.3,8.0,16.0));}
// Voorgevel: portaal, groot venster met roos, nissen in de topgevel en de torens.
cuts.push(niche(FRONT_U+0.5,0,1,0,2.6,FRONT_GROUND,7.6,0.45));
cuts.push(niche(FRONT_U,0,1,0,6.0,11.6,18.5,0.4));
for(const o of [-2.4,-1.2,0,1.2,2.4])cuts.push(niche(FRONT_U,o,1,0,0.9,24.0,28.0-Math.abs(o)*0.9));
for(const s of [-1,1]){
  cuts.push(niche(AISLE_END,s*7.9,1,0,1.1,FRONT_GROUND,5.4));                 // zijdeuren
  for(const z of [9.0,15.0,20.5])cuts.push(niche(T_U+T_R,s*T_V,1,0,0.7,z,z+1.6,0.3)); // torenvensters
  cuts.push(niche(T_U,s*(T_V+T_R),0,s,0.7,24.5,26.5,0.3));
}
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Maria Geboortekerk Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,
  groundSamplePoints:[[-23.5,0],[-24,10],[44,16.5],[46,19]],
  replacesBuildings:["NL.IMBAG.Pand.0268100000002755"],
  description:"Neogotische kruisbasiliek (J. en J. Kayser, 1901 en 1924) met luchtbogen, dwarsschip, kapellen, lagere vijfzijdige apsis, dakruiter met naald en twee traptorens aan de voorgevel; met sacristie en pastorie op hetzelfde BAG-pand. X van het koor naar de voorgevel, z = 0 op NAP +32,6 m.",
  realWorld:{groundNapM:GROUND_NAP,frontSquareNapM:35.1,naveEaveNapM:56.0,naveRidgeNapM:65.4,apseRidgeNapM:60.8,stairTowerTopNapM:68.1,flecheTopNapM:82.1,churchLengthM:65.9,complexLengthM:86.8,transeptWidthM:27.8},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000002755","https://monumentenregister.cultureelerfgoed.nl/monumenten/522947","https://nl.wikipedia.org/wiki/Maria_Geboortekerk_(Nijmegen)","https://commons.wikimedia.org/wiki/Category:Maria_Geboortekerk_(Nijmegen)","https://commons.wikimedia.org/wiki/File:Zuid-oost_gevel_-_Nijmegen_-_20167856_-_RCE.jpg","https://commons.wikimedia.org/wiki/File:Westgevel_-_Nijmegen_-_20167853_-_RCE.jpg","https://commons.wikimedia.org/wiki/File:Nijmegen_Rijksmonument_522947_kerk_Berg_en_Dalseweg_42_achterzijde.JPG","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};

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
