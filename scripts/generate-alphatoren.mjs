// Alphatoren en De Boulevard, Enschede: KOW, 2008, één BAG-pand.
// Vlakke daken, benoemde bouwdelen en gevelnissen, geen AHN-hoogtelagen.
// BAG (PDOK, CC0) 0153100000472517; AHN DSM/DTM 0,5 m (CC0).
// Dakmaten gecontroleerd met 3D BAG (TU Delft/3DGI, CC BY 4.0, AHN5 2023).
// Gevelraster, serres, kroon en entree: Commons-foto's en KOW-projectpagina.
import { Manifold, CrossSection, prism, rect, box, union, writeLandmark, downFaces } from './efteling-kit.mjs';
const slug='alphatoren', ORIGIN=[258432,470895], HEART=[-8,24];
const GROUND=43.15, BASE=-.6, ANGLE=-10.3, rad=ANGLE*Math.PI/180;
const z=nap=>nap-GROUND;
// Alle lagere bouwdelen in RD min (258440,470871); toren in eigen stelsel.
const P=(p,top)=>prism(p,BASE,z(top));
const B=(x0,y0,x1,y1,top)=>P(rect(x0,y0,x1,y1),top);
const T=(s)=>s.rotate([0,0,ANGLE]).translate([...HEART,0]);
const FOOT=[[-16.620,41.709],[-21.557,14.548],[-20.989,14.446],[-22.844,3.542],[-24.168,3.744],[-27.689,-14.793],[-31.881,-14.866],[-31.934,-11.992],[-43.627,-12.181],[-43.311,-31.048],[-42.364,-31.029],[-41.654,-36.721],[-40.960,-36.633],[-40.447,-41.465],[-41.040,-41.553],[-40.193,-48.066],[-32.138,-46.700],[-32.128,-48.059],[2.228,-42.281],[2.591,-30.227],[46.585,-29.472],[46.631,-26.622],[59.096,-26.622],[60.200,-21.702],[58.498,-21.426],[59.390,-15.276],[67.007,26.484],[-16.620,41.709]];

// De garage valt onder hetzelfde BAG-pand, maar de binnentuin en paden
// erboven zitten al in PDOK-terrein. Laat die hof als een doorgaande
// uitsparing open; behoud alleen de onderbouw onder de gebouwvleugels.
const COURT=[[-25.5,-13.5],[42.2,-13.5],[42.4,16.6],[11.8,22.2],[5.0,19.0],[3.5,7.5],[-16.5,10.0],[-21.0,3.5]];
const podium=P(FOOT,47.444).subtract(prism(COURT,BASE-1,z(150)));
const highSouthFoot=[[-16.767,9.627],[2.844,7.241],[5.068,19.221],[2.648,19.509],[1.545,11.310],[-16.020,13.255]];
const highNorthFoot=[[-14.087,37.660],[-11.981,35.991],[-2.614,34.230],[1.418,33.472],[5.149,30.038],[3.235,23.870],[12.190,22.517],[17.521,35.502],[-11.387,39.920]];

// Woontoren: glas-serres op alle hoeken, baksteen met vensters ertussen.
const HALF=11.1, STOREY=3.08, FIRST=47.45;
let tower=prism(rect(-HALF,-HALF,HALF,HALF),BASE,z(127.159));
const cuts=[];
function niche(a,b,s0,s1,depth,h0,h1){
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),d=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[d[1],-d[0]];
 return Manifold.hull([z(h0),z(h1)].flatMap(zz=>[[s0,-depth],[s1,-depth],[s1,.3],[s0,.3]].map(([s,t])=>[a[0]+s*d[0]+t*n[0],a[1]+s*d[1]+t*n[1],zz])));
}
const square=rect(-HALF,-HALF,HALF,HALF);
for(let face=0;face<4;face++){
 const a=square[face],b=square[(face+1)%4];
 for(let k=0;k<26;k++){
  const h=FIRST+k*STOREY;
  if(h+2.1>126.8)continue;
  // Hoekserres en twee groeven voor de verticale hoekstijlen.
  cuts.push(niche(a,b,.55,5.25,.35,h+.4,h+2.25),niche(a,b,16.95,21.65,.35,h+.4,h+2.25));
  const slots=h>114?[[6.15,8.7],[9.65,12.55],[13.5,16.05]]:[[6.3,7.65],[9,10.35],[11.85,13.2],[14.55,15.9]];
  for(const [lo,hi] of slots)cuts.push(niche(a,b,lo,hi,.35,h+.5,h+2.25));
 }
 // Centrale verticale gleuf en teruggezette glazen begane grond.
 cuts.push(niche(a,b,10.65,11.55,.35,56.3,113.0),niche(a,b,.6,21.6,.4,44.2,46.6));
}
tower=tower.subtract(union(cuts));
// Kroon: panoramaverdieping, kleiner techniekhuis en schoorsteen.
let panorama=prism(rect(-8.25,-7.6,8.25,7.6),z(127.05),z(130.634));
const crownCuts=[];
const crown=rect(-8.25,-7.6,8.25,7.6);
for(let i=0;i<4;i++){const a=crown[i],b=crown[(i+1)%4],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.9;s<L-1.4;s+=3.3)crownCuts.push(niche(a,b,s,Math.min(s+2.3,L-.8),.35,127.7,130.0));}
panorama=panorama.subtract(union(crownCuts));
const plant=prism(rect(-4.2,-4.2,4.2,4.2),z(130.5),z(134.238));
const chimney=prism(rect(-.8,-.7,.8,.7),z(134.1),z(144.42));
// Afdekplaten met 45 graden ondersnede, 0,9 m in plaats van dunne platen.
const cap=(w,d,h)=>Manifold.hull([...rect(-w/2+.45,-d/2+.45,w/2-.45,d/2-.45).map(([u,v])=>[u,v,z(h)-.9]),...rect(-w/2,-d/2,w/2,d/2).map(([u,v])=>[u,v,z(h)])]);
const towerAssembly=T(union([tower,panorama,plant,chimney,cap(22.7,22.7,127.159),cap(17.2,15.9,130.634),cap(9.2,9.2,134.238)]));

// Vier lagere woongebouwen, elk met eigen dak en lagere dakterrassen.
const NORTH=[[12.19,22.52],[42.66,17.18],[43.92,24.64],[40.47,31.32],[21.14,34.84],[18.35,28.98],[13.39,30.12]];
const NORTHEAST=[[42.57,16.69],[47.15,10.82],[63.57,7.75],[67.01,26.49],[45.34,30.44]];
const EAST=[[42.46,-11.72],[59.49,-14.73],[63.57,7.75],[47.15,10.82],[43.72,-5.95]];
const EAST_TOP=[[43.72,-5.95],[56.47,-8.83],[60.93,-6.81],[62.2,.20],[45.49,5.41]];
const WEST_L=[[-43.31,-31.04],[-20.18,-30.47],[-20.75,-25.55],[-31.87,-25.59],[-31.94,-11.98],[-43.63,-12.17]];
const WEST_MID=[[-31.87,-25.59],[-20.75,-25.55],[-20.18,-30.47],[-9.36,-30.27],[-8.73,-22.08],[-10.55,-13.94],[-27.51,-13.96],[-27.54,-21.08],[-31.91,-21.21]];
const WEST_SOUTH=[[-42.56,-30.89],[-25.11,-30.57],[-24.56,-46.78],[-32.13,-48.05],[-40.19,-48.06]];
const SOUTH=[[-10.3,-22.11],[42.44,-21.24],[42.23,-13.87],[-10.55,-13.94]];
const wings=[['torenplint-zuid',highSouthFoot,56.292],['torenplint-noord',highNorthFoot,56.304],['noord',NORTH,62.226],['noordoost',NORTHEAST,56.364],['oost',EAST,73.961],['west-L',WEST_L,64.226],['west-midden',WEST_MID,59.825],['west-zuid',WEST_SOUTH,53.968],['zuid',SOUTH,50.440]];
const detailedWings=[];
for(const [name,poly,top] of wings){
 let outline=new CrossSection([poly],'NonZero').toPolygons()[0];
 const area=outline.reduce((s,a,i)=>{const b=outline[(i+1)%outline.length];return s+a[0]*b[1]-b[0]*a[1]},0);if(area<0)outline=[...outline].reverse();
 const holes=[];
 for(let i=0;i<outline.length;i++){
  const a=outline[i],b=outline[(i+1)%outline.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(let h=47.8;h+2.1<top-.5;h+=3.15)for(let s=.9;s+1.2<L-.6;s+=3.3)holes.push(niche(a,b,s,Math.min(s+2.1,L-.6),.35,h,h+2));
 }
 detailedWings.push(P(outline,top).subtract(union(holes)));
}
const eastPenthouse=P(EAST_TOP,78.353);
const gardenHomes=[];
for(const [x0,x1] of [[-2.61,1.23],[4.40,8.76],[12.34,16.33],[20.05,23.69],[26.60,31.0],[34.97,38.64]]) gardenHomes.push(B(x0,-29.73,x1,-21.4,47.79));
// Entree in de torenplint: diepe blinde glasnis, portaal en massieve luifel
// met schuin ondervlak; brede bordestrap aan het Mooienhof (foto KOW).
const entrance=union([B(-23.5,8.5,-20.8,13.5,47.9)]);
const stairs=[];
for(let i=0;i<4;i++)stairs.push(B(-28.0+i*1.0,8.5,-22.5,13.5,44.2+i*.95));
// Serrebalkons aan de binnenhofzijde van de oostelijke schijf: zeven echte
// verdiepingsvloeren (foto), met een 45 graden kraag onder elke uitkraging.
const balconies=[];
const ba=[47.15,10.82],bb=[43.72,-5.95],bl=Math.hypot(bb[0]-ba[0],bb[1]-ba[1]),bd=[(bb[0]-ba[0])/bl,(bb[1]-ba[1])/bl],bn=[bd[1],-bd[0]];
for(let k=0;k<7;k++){
 const h=50.6+k*3.15;
 const points=[];
 for(const [out,nap] of [[-.10,h-1.8],[1.8,h],[1.8,h+.9],[-.10,h+.9]])for(const s of [1.2,bl-1.2])points.push([ba[0]+s*bd[0]+out*bn[0],ba[1]+s*bd[1]+out*bn[1],z(nap)]);
 balconies.push(Manifold.hull(points));
}
// Gemeten dakopbouwen en grotere technische kasten van de lage gebouwen.
const roofPlant=union([box(18.35,28.98,z(62.1),21.14,34.84,z(63.39)),box(40.47,24.96,z(62.1),45.34,30.44,z(63.40)),box(-31.9,-21.21,z(59.7),-27.54,-16.24,z(62.65)),box(55.8,10.0,z(56.25),59.3,13.4,z(57.5))]);
let building=union([podium,towerAssembly,...detailedWings,eastPenthouse,...gardenHomes,entrance,...stairs,...balconies,roofPlant]);
building=union(building.decompose().filter(p=>p.volume()>0)).translate([-HEART[0],-HEART[1],0]);
await writeLandmark({slug,nodes:[['building:alphatoren-en-de-boulevard',building]],base:BASE,catalog:{name:'Alphatoren',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,groundHeight:86.66397,groundSamplePoints:[[-21,-4],[1,23],[65,12],[-37,-53]],replacesBuildings:['NL.IMBAG.Pand.0153100000472517'],description:'Alphatoren met de vier lagere woongebouwen van De Boulevard, gebouwd in 2008. Oorsprong RD (258432,470895), X oost, Y noord, z=0 op NAP +43,15 m; toren langs -10,3 graden. Benoemde vlakdaken, hoekserres, panoramaverdieping, schoorsteen, vensternissen en entree; gevelritme en printkragen vereenvoudigd.',realWorld:{towerAxisDegrees:ANGLE,groundNapM:GROUND,towerRoofNapM:127.159,panoramaRoofNapM:130.634,plantRoofNapM:134.238,chimneyNapM:144.42,chimneyPrintWidthM:1.6,lowerWingsNapM:[62.226,56.364,78.353,64.226,59.825,53.968,50.440]},sources:['https://kow.nl/projecten/alphatoren-de-boulevard-enschede/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0153100000472517 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:20130407_Enschede_60.JPG','https://commons.wikimedia.org/wiki/File:20130407_Enschede_77.JPG','https://commons.wikimedia.org/wiki/File:20130407_Enschede_94.JPG','https://commons.wikimedia.org/wiki/File:Aerial_Twente_(6781751906)_(cropped).jpg']}});
console.log('overhang',JSON.stringify(downFaces(building,BASE)));
