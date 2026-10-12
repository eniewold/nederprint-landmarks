// ABN AMRO, Gustav Mahlerlaan 10, Amsterdam (Pei Cobb Freed, 1999).
// Benoemde bouwdelen uit BAG, AHN4 DSM/DTM en 3D BAG AHN5 (2023).
// RD-meetstelsel met oorsprong (120100,483400); +X oost, +Y noord.
// De rechte gevels lopen 0,25 graden tegen de RD-X-as in. Gebogen gevels
// zijn polygonale benaderingen van de cirkelbogen in de BAG, geen hoogtelagen.
// Bronnen: PDOK BAG 0363100012146659 (CC0), AHN (CC0),
// 3D BAG NL.IMBAG.Pand.0363100012146659 (TU Delft/3DGI, CC BY 4.0).
import { Manifold, prism, rect, box, union, writeLandmark, downFaces } from './efteling-kit.mjs';

const slug='abn-amro-hoofdkantoor';
// PDOK op de straat ten zuidoosten: ellipsoïdisch +42,4796 m;
// AHN-DTM op hetzelfde punt NAP -0,455 m. Modelvoet op NAP -1,2 m.
const ORIGIN=[120100,483400], GROUND=-.46, BASE=-.74;
const H={high:104.04,glass:92.61,low:69.86,lowGlass:62.18,wing:28.86,side:24.27,hall:8.42,westHall:12.20,northHall:12.94,plant:105.51};
const z=nap=>nap-GROUND;
const P=(poly,top)=>prism(poly,BASE,z(top));
const B=(x0,y0,x1,y1,top)=>P(rect(x0,y0,x1,y1),top);
const arc=(c,r,a0,a1,n=20)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*Math.PI/180;return [c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];});
const band=(c,inner,outer,a0,a1,n=20)=>[...arc(c,outer,a0,a1,n),...arc(c,inner,a1,a0,n)];

// Hoge toren: granieten schijf en terugliggende glazen vleugels.
const HIGH=rect(-60.74,29.10,-24.90,44.00);
const NORTH_GLASS=[[-65.77,58.57],[-65.83,53.79],[-58.22,53.52],[-58.34,45.49],[-54.16,42.04],[-53.77,43.57],[-28.93,43.78],[-28.26,44.93],[-35.85,51.04],[-44.36,55.72],[-53.65,58.55],[-64.17,59.53],[-67.70,58.98]];
const SOUTH_GLASS=[[-29.82,21.78],[-12.88,22.08],[-12.88,30.72],[-24.90,30.67],[-24.90,29.10],[-29.82,29.10]];
const highTower=P(HIGH,H.high);
const highGlazing=union([P(NORTH_GLASS,H.glass),P(SOUTH_GLASS,H.glass)]);

// Lagere toren aan de zuidoosthoek: gebogen zuidwestkop en granieten schijf.
const LOW_GLASS=[[50.99,-31.62],[57.26,-43.21],[65.13,-42.16],[69.68,-46.55],[75.65,-50.77],[82.16,-53.93],[89.70,-56.12],[89.99,-49.02],[84.70,-46.80],[84.25,-41.08],[85.05,-38.53],[71.37,-38.11],[65.45,-31.39],[59.55,-24.74],[53.66,-24.78]];
const LOW_REAR=[[67.84,-46.52],[93.57,-46.33],[93.92,-33.22],[71.45,-32.53],[67.84,-34.11]];
const lowTower=union([B(54.29,-46.9,93.17,-38.15,H.low),P(LOW_GLASS,H.low),P(LOW_REAR,H.lowGlass)]);

// Vier vleugels om het complex. De gebogen west- en oostvleugels blijven
// echte veelhoekprisma's, met een flauw hellend dak op de oostvleugel.
const westCurve=[[-45.71,-30.87],[-34.59,-30.59],[-25.26,-23.65],[-19.06,-11.82],[-14.44,-3.02],[-13.20,4.47],[-14.60,12.80],[-13.94,21.78],[-13.55,29.50],[-25.84,29.55],[-24.37,11.86],[-25.67,5.95],[-30.05,-5.03],[-34.37,-14.77],[-41.59,-22.41],[-45.71,-27.15]];
const eastCurve=[[47.01,-26.16],[57.99,-26.16],[57.99,-17.31],[58.08,-6.65],[61.33,4.50],[68.42,16.70],[76.54,19.87],[80.56,32.73],[39.92,31.88],[39.98,30.25],[44.19,-9.27],[48.75,-8.34],[49.44,-1.78],[49.43,-5.51],[49.96,-11.21],[49.62,-17.38],[49.36,-22.02]];
const eastPrism=P(eastCurve,30);
const eastSlope=eastPrism.trimByPlane([0,-.12,-1],-z(24.0));
const wings=union([B(-45.79,-46.61,-4.08,-31.60,H.wing),B(-4.88,-46.61,40.55,-31.60,24.53),B(-4.78,32.73,39.92,44.50,24.5),B(39.92,32.73,80.60,44.28,H.wing),P(westCurve,H.side),eastSlope]);
// Licht hellende noordelijke en zuidelijke kapbanen, elk één dakvlak.
const northRoof=B(-5.0,31.83,39.92,39.75,29).trimByPlane([0,-.15,-1],-z(23.35));
const southRoof=B(-4.88,-43.48,40.55,-36.70,29).trimByPlane([0,.15,-1],-z(22.12));

// Centrale dealingroom onder daktuin met vier piramidale glazen lichtkappen.
const HALL=[[-12.10,-25.49],[28.44,-29.68],[28.80,-31.52],[41.82,-31.37],[46.30,10.49],[33.88,9.73],[33.93,20.42],[37.03,20.27],[37.56,24.04],[6.23,27.16],[6.02,31.17],[-6.62,30.09]];
const hall=P(HALL,H.hall);
const roofLights=[];
for(const [cx,cy,top] of [[12.0,4.9,11.1],[23.7,4.3,11.11],[12,-6.1,11.06],[23.7,-6.4,11.18]]) {
 const foot=rect(cx-5.1,cy-4.9,cx+5.1,cy+4.9);
 roofLights.push(Manifold.hull([...foot.map(([x,y])=>[x,y,z(H.hall)-.05]),[cx,cy,z(top)]]));
}
const westHall=P([[-25.26,-32.09],[28.80,-31.52],[28.44,-29.68],[-12.10,-25.49],[-6.62,30.09],[-13.55,29.5],[-20.26,-23.06]],H.westHall);
const northHall=P([[-4.78,44.94],[39.83,44.75],[40.62,61.73],[-3.92,61.94]],H.northHall);
const northLinks=B(-5.0,30.8,39.9,45.5,H.northHall);
// Westelijke straatvleugel en het los vormgegeven ontvangstpaviljoen.
const reception=B(-87.83,46.27,-75.73,58.66,11.31);
const receptionLink=B(-78.1,53.7,-58.1,57.4,8.1);
const southLobby=B(-37.30,-52.95,-15.47,-46.45,12.89);
// Techniek boven de beide torens en op de lage vleugels, meetbare pieken.
const plant=union([
 box(-54,33,z(H.high)-.05,-52.5,35,z(H.plant)),
 box(-29.5,38.5,z(H.high)-.05,-27,41,z(104.73)),
 box(-39.5,35,z(H.high)-.05,-38,36.5,z(104.70)),
 box(57,-39,z(H.low)-.05,59,-38,z(70.69)),
 box(-31,-37,z(H.wing)-.05,-27,-35.5,z(29.59)),
 box(55.5,35.5,z(H.wing)-.05,59,37,z(29.50)),
 box(72.5,34,z(H.wing)-.05,75,35.5,z(29.51)),
 box(31.5,52.5,z(H.northHall)-.05,35.5,56.5,z(14.38)),
 box(-2,49,z(H.northHall)-.05,.5,54,z(14.43)),
 box(33.88,9.73,z(H.hall)-.05,44.55,20.42,z(15.55)),
]);

let body=union([highTower,highGlazing,lowTower,wings,northRoof,southRoof,hall,...roofLights,westHall,northHall,northLinks,reception,receptionLink,southLobby,plant]);
// Gevelnissen: afzonderlijke rechthoekige stenen vensters en doorgaande
// glasbanden, 0,35 m diep. Raster 3,9 m per kantoorlaag uit foto's geschat.
const cuts=[];
function windows(poly,start,top,storey=3.9,pitch=3.4,individual=true){
 const area=poly.reduce((sum,a,i)=>{const b=poly[(i+1)%poly.length];return sum+a[0]*b[1]-b[0]*a[1]},0);
 if(area<0)poly=[...poly].reverse();
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(L<1.8)continue;
  const d=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[d[1],-d[0]];
  for(let h=start;h+2.45<top-.8;h+=storey){
   const intervals=individual?Array.from({length:Math.floor(L/pitch)},(_,j)=>[j*pitch+.8,Math.min((j+1)*pitch-.7,L-.6)]):[[.6,L-.6]];
   for(const [s0,s1] of intervals){if(s1-s0<.9)continue;
    cuts.push(Manifold.hull([z(h),z(h+2.45)].flatMap(zz=>[[s0,-.35],[s1,-.35],[s1,.25],[s0,.25]].map(([s,t])=>[a[0]+d[0]*s+n[0]*t,a[1]+d[1]*s+n[1]*t,zz]))));
   }
  }
 }
}
windows(HIGH,8.0,89.0); windows(NORTH_GLASS,8.0,H.glass,3.9,4,false); windows(SOUTH_GLASS,8.0,H.glass,3.9,4,false);
windows(rect(54.29,-46.9,93.17,-38.15),7.0,60.0); windows(LOW_GLASS,7.0,60,3.9,4,false); windows(LOW_REAR,7,H.lowGlass,3.9,4,false);
for(const poly of [rect(-45.79,-46.61,-4.08,-31.60),rect(-4.88,-46.61,40.55,-31.60),rect(-4.78,32.73,39.92,44.50),rect(39.92,32.73,80.60,44.28),westCurve,eastCurve]) windows(poly,5,24.0,3.9,4.0,false);
// Kenmerkende verticale topsleuf in de granieten torenschijf. Het echte
// vlakke plafond wordt binnenin 50 graden spits voor steunloos 1:1000.
const portal=Manifold.extrude([[[-57.9,z(89.0)],[-51.7,z(89.0)],[-51.7,z(96.3)],[-54.8,z(100.0)],[-57.9,z(96.3)]]],18).rotate([90,0,0]).translate([0,45,0]);
cuts.push(portal);
body=body.subtract(union(cuts));
// Nissen in een door een aangrenzende vleugel afgedekte gevel zijn interne
// holtes. Vul die op; behouden buitenvlakken en de doorgaande topsleuf.
body=union(body.decompose().filter(p=>p.volume()>0));
const report=await writeLandmark({slug,nodes:[['building:abn-amro',body]],base:BASE,catalog:{name:'ABN AMRO-hoofdkantoor',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,groundHeight:42.47959,groundSamplePoints:[[-72,5],[-65,-55],[95,-58]],replacesBuildings:['NL.IMBAG.Pand.0363100012146659'],description:'Twee granieten torenschijven met gebogen glazen vleugels, vier kantoorvleugels, dealingroom met lichtkappen en ontvangstpaviljoen; oorsprong RD (120100,483400), X oost, Y noord, z=0 op NAP -0,46 m. Gevelraster, techniek en interne spits van de topsleuf vereenvoudigd voor 1:1000.',realWorld:{groundNapM:GROUND,highTowerNapM:H.high,highGlazingNapM:H.glass,lowTowerNapM:H.low,lowGlazingNapM:H.lowGlass,wingNapM:H.wing,lightCaps:4},sources:['https://service.pdok.nl/lv/bag/wfs/v2_0','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012146659 (TU Delft/3DGI, CC BY 4.0, AHN5 2023)','https://www.pcf-p.com/projects/abn-amro-bank-head-office/','https://commons.wikimedia.org/wiki/File:ABN_AMRO1.jpg','https://commons.wikimedia.org/wiki/File:ABN_AMRO2.jpg','https://commons.wikimedia.org/wiki/File:ABN_AMRO4.jpg (Migdejong)','https://commons.wikimedia.org/wiki/File:ABN_AMRO_Headquarters_Amsterdam.jpg (Steven Lek, CC BY-SA 4.0)']}});
console.log('overhang',JSON.stringify(downFaces(body,BASE)));
