// Station Maastricht: parallelle zadeldaken, trapgevels en benoemde bouwdelen.
import {Manifold,prism,box,hull,ring3,rect,gableRoof,hipRoof,union,writeLandmark} from './efteling-kit.mjs';
const O=[177425.05411889977,317803.36070443224],A=[-0.27563735581699905,0.9612616959383189],G=47.4,BASE=-.8,at=n=>n-G,FOOT=[[-34.196,-18.03],[2.47,-17.346],[82.956,-15.847],[86.761,-15.753],[86.032,22.814],[82.683,22.751],[82.512,31.78],[61.915,31.391],[61.92,31.172],[56.521,31.069],[56.781,17.273],[35.754,16.877],[35.685,20.536],[29.406,20.418],[29.367,22.518],[27.167,22.476],[27.106,25.675],[20.829,25.557],[20.809,26.556],[10.131,26.357],[10.151,25.356],[3.871,25.238],[3.931,22.048],[1.731,22.007],[1.761,20.468],[-8.607,20.272],[-8.508,14.973],[-14.557,14.86],[-14.504,12.08],[-27.363,11.838],[-27.371,12.278],[-34.759,12.139],[-34.685,8.29],[-56.384,7.878],[-74.106,7.542],[-73.811,-4.284],[-78.207,-4.375],[-78.2,-4.719],[-89.895,-4.966],[-100.643,-5.192],[-110.487,-5.4],[-121.989,-5.643],[-134.235,-5.901],[-145.503,-6.139],[-145.379,-12.239],[-135.038,-13.775],[-119.808,-15.879],[-108.795,-16.793],[-95.194,-17.806],[-87.158,-18.291],[-79.792,-18.525],[-73.347,-18.394],[-68.091,-18.661],[-55.853,-18.433],[-34.196,-18.03]],CANOPY=[[20.254,-8.497],[15.919,-8.517],[16.165,-11.854],[14.471,-12.37],[12.14,-11.331],[12.506,-8.533],[13.652,-8.528],[13.007,-8.079],[11.75,-8.101],[11.68,-8.538],[1.467,-8.585],[-7.279,-8.798],[-7.282,-8.921],[-8.132,-8.819],[-8.136,-8.631],[-12.44,-8.652],[-12.577,-8.655],[-13.024,-8.864],[-13.315,-8.672],[-13.661,-8.68],[-13.831,-8.956],[-20.122,-9.108],[-20.207,-9.025],[-20.263,-9.111],[-21.136,-9.133],[-21.586,-8.867],[-23.453,-8.911],[-23.546,-9.191],[-27.698,-9.292],[-27.344,-9.002],[-29.272,-9.048],[-29.256,-9.33],[-33.638,-9.435],[-33.617,-9.151],[-35.384,-9.192],[-37.153,-9.233],[-38.573,-9.267],[-38.566,-9.554],[-41.849,-9.634],[-42.428,-9.141],[-42.47,-9.105],[-43.793,-9.13],[-43.802,-9.391],[-46.273,-9.449],[-48.218,-9.494],[-49.579,-9.527],[-49.674,-9.824],[-51.793,-9.875],[-51.784,-9.579],[-54.323,-9.638],[-56.077,-9.68],[-59.83,-9.768],[-62.292,-9.826],[-62.285,-9.489],[-64.857,-9.539],[-64.861,-9.887],[-66.969,-9.937],[-73.574,-10.093],[-73.577,-9.966],[-74.235,-9.788],[-73.596,-9.198],[-73.602,-8.939],[-73.699,-5.07],[-145.487,-6.924],[-145.379,-12.239],[-135.038,-13.773],[-119.807,-15.878],[-108.795,-16.793],[-95.194,-17.805],[-87.157,-18.291],[-79.792,-18.523],[-73.347,-18.394],[-68.091,-18.661],[82.956,-15.845],[86.573,-15.757],[86.76,-15.71],[86.583,-6.317],[85.867,-6.334],[86.082,-6.661],[77.087,-6.83],[77.231,-7.103],[76.441,-7.113],[76.432,-6.843],[74.999,-6.87],[75.026,-7.132],[73.853,-7.148],[73.919,-6.89],[72.76,-6.913],[72.698,-7.163],[67.597,-7.231],[61.801,-7.308],[59.541,-7.337],[58.64,-7.349],[58.51,-7.698],[58.241,-7.355],[52.113,-7.437],[52.053,-7.385],[51.479,-7.385],[49.513,-7.423],[49.483,-7.471],[46.323,-7.507],[41.243,-7.623],[36.231,-7.745],[34.076,-7.797],[33.927,-7.976],[33.514,-8.435],[32.998,-8.437],[32.99,-7.823],[30.64,-7.88],[30.657,-8.377],[30.66,-8.448],[29.739,-9.915],[30.808,-12.544],[26.347,-12.57],[24.6,-11.055],[20.478,-11.002]];
const profileX=(p,x0,x1)=>prism(p,0,x1-x0).rotate([90,0,90]).translate([x0,0,0]);
const roofBlock=(x0,x1,y0,ym,y1,e0,r,e1=e0)=>profileX([[y0,BASE],[y1,BASE],[y1,at(e1)],[ym,at(r)],[y0,at(e0)]],x0,x1);
const masses=[prism(CANOPY,BASE,at(52.42)),prism(FOOT,BASE,-.1)];
// Zuidkantoren met lange kap, hogere zuidelijke aansluiting en grote vestibule.
masses.push(roofBlock(-74,-8.05,-8.3,-.9,8,57.63,64.01,57.39),roofBlock(-8.1,13.5,-8.8,-1.45,5.1,57.83,66.7,59.03));
masses.push(roofBlock(2,29.41,4.75,13.85,22.82,61.29,72.18,61.9),box(10.13,22.2,BASE,20.99,26.56,at(62.2)));
// Twee parallelle noordkappen en noordelijke dwarsvleugel om het lage tussenstuk.
masses.push(roofBlock(24.15,67.7,-8.45,-.9,6.48,57.51,66.64,58.79),roofBlock(29.37,62.64,6.16,11.9,18.64,58.79,65.48,57.44));
masses.push(roofBlock(67.66,86.58,-7.23,.05,7.72,55.95,64.91,55.7),roofBlock(61.55,82.9,16.5,24.5,31.76,55.81,64.92,56.98),box(61.6,6.9,BASE,83,13.3,at(53.34)),box(79.3,12.1,BASE,86.24,22.82,at(55.79)));
// Afgeschuinde lage kopuitbouw en het kleinere westelijke huisje.
masses.push(prism([[11.8,-7.4],[24.5,-7.1],[24.3,5.9],[20.3,5.9],[11.8,1.9]],BASE,at(58.7)),union([box(-14.5,14.3,BASE,2.2,22,at(51.8)),hipRoof(16.7,7.7,at(51.78),at(57.3),2.7).translate([-6.15,18.15,0])]));
// Geleide lichtstrook op de betonnen perronkap, niet de foutieve buurdakhoogte +71.
masses.push(gableRoof(65.6,3.8,at(52.4),at(54.79)).translate([-40.1,-12.4,0]));
let body=union(masses).intersect(prism(FOOT,BASE,90));
// Trapgevel uit een getrapt gevelprofiel; treden zijn onderdeel van de gevelwand.
const stepped=(c,half,eave,peak,n=7)=>{let p=[[c-half,at(eave)]];for(let k=0;k<n;k++){const w=half-k*(half-.65)/n,z=eave+(peak-eave)*k/n;p.push([c-w,at(z)],[c-w,at(eave+(peak-eave)*(k+1)/n)]);}p.push([c-.65,at(peak)],[c+.65,at(peak)]);for(let k=n-1;k>=0;k--){const w=half-k*(half-.65)/n;p.push([c+w,at(eave+(peak-eave)*(k+1)/n)],[c+w,at(eave+(peak-eave)*k/n)]);}return p;};
const facade=(p,y,depth=1.1)=>prism(p,0,depth).rotate([90,0,0]).translate([0,y,0]);
const details=[];
// Middenfronton met klok, en trapgevels op de koppen van de parallelle kappen.
details.push(facade(stepped(15.55,5.4,61.8,73.3),26.5));
for(const [x,v,eave,peak,half]of[[2.2,13.8,61.3,73.05,9.05],[29.3,13.8,61.8,73.05,9.05],[24.3,-.9,57.7,67.55,7.1],[67.6,-.9,57.7,67.55,7.1],[61.7,24.5,56,65.8,7.5],[82.65,24.5,56,65.8,7.5]])details.push(profileX(stepped(v,half,eave,peak),x-.55,x+.55));
// Toren: rechte schacht, zadeldak en twee getrapte klokkeng e vels.
const TC=[-31.08,9.3];details.push(roofBlock(-34.83,-27.33,6.25,9.4,12.3,78.57,82.82,78.57),facade(stepped(TC[0],3.75,78.6,84,5),12.3),facade(stepped(TC[0],3.75,78.6,84,5),7.35));
// Dakkapellen met zadeldak, vast aangesloten op de schuine dakvlakken.
for(const x of[-67,-59,-51,-43,-23,-15])details.push(hull([[x-1.4,5.4,at(58.8)],[x+1.4,5.4,at(58.8)],[x-1.4,8.1,at(58.8)],[x+1.4,8.1,at(58.8)],[x,5.4,at(63.65)],[x,8.1,at(63.65)]]));
for(const x of[36,46,56])details.push(hull([[x-1.3,14.7,at(58.5)],[x+1.3,14.7,at(58.5)],[x-1.3,18.7,at(58.5)],[x+1.3,18.7,at(58.5)],[x,14.7,at(64)],[x,18.7,at(64)]]));
// Spoorzijde: negen zuidelijke dakkapellen, twee op de aansluiting en de
// noordelijke dakkapellen rond het brede, getrapte middenfronton. Posities en
// kaphoogtes uit de kleine RoofSurfaces van 3D BAG, gecontroleerd met AHN,
// PDOK-ortho en open perronfoto's. Google Maps 3D alleen als visuele kruiscontrole.
const RAIL_DORMERS=[
  [-64.83,-9.94,-6.55,2.25,60.16,61.66],
  [-59.64,-9.83,-6.60,2.25,59.94,61.44],
  [-54.32,-9.68,-6.50,2.25,60.12,61.62],
  [-49.03,-9.87,-6.54,2.25,59.80,61.30],
  [-43.74,-9.45,-6.40,2.10,60.12,61.62],
  [-35.40,-9.23,-6.16,1.80,60.04,61.54],
  [-22.90,-8.71,-5.83,2.00,59.87,61.37],
  [-17.80,-8.36,-6.07,1.80,59.63,61.13],
  [-11.05,-8.49,-5.71,1.70,59.71,61.21],
  [6.70,-6.10,-3.89,1.20,62.90,63.80],
  [32.99,-7.98,-4.56,2.15,61.15,62.67],
  [59.86,-7.35,-3.62,2.30,61.40,63.00],
  [74.91,-6.87,-4.40,1.90,58.40,59.90],
];
for(const [x,y0,y1,half,eave,ridge] of RAIL_DORMERS){
  const bottom=eave-2.5;
  details.push(box(x-half,y0,at(bottom),x+half,y1,at(eave)),
    hull([[x-half,y0,at(eave)],[x+half,y0,at(eave)],
      [x-half,y1,at(eave)],[x+half,y1,at(eave)],
      [x,y0,at(ridge)],[x,y1,at(ridge)]]));
}
// Lage platte dakkapel op de aansluitkap, en het grote noordelijke dwarsdak.
details.push(box(-3.60,-6.52,at(60.30),-1.06,-4.12,at(63.10)));
details.push(box(41.24,-7.62,at(56.70),51.48,-2.21,at(58.30)),
  hull([[41.24,-7.62,at(58.30)],[51.48,-7.62,at(58.30)],
    [41.24,-2.21,at(58.30)],[51.48,-2.21,at(58.30)],
    [46.26,-7.62,at(64.90)],[46.26,-2.21,at(64.90)]]),
  facade(stepped(46.26,5.12,58.30,65.80),-6.52,1.10));
// Twee schoorsteen-/ventilatieblokken op de lange zuidelijke nok.
details.push(box(-53.18,-2.16,at(61.40),-51.45,1.10,at(64.80)),
  box(7.25,-1.76,at(64.90),9.10,-.70,at(67.36)));

// Luifel met een 45-graden gesloten onderzijde en twee vereenvoudigde leeuwenreliëfs.
details.push(hull([[2.5,22,at(50.9)],[29,22,at(50.9)],[2.5,24.2,at(53.1)],[29,24.2,at(53.1)],[2.5,22,at(53.1)],[29,22,at(53.1)]]));
for(const x of[9.1,22]){details.push(box(x-.65,22.25,at(53),x+.65,24.45,at(54.7)),hull([[x-.6,22.1,at(54.4)],[x+.6,22.1,at(54.4)],[x-.6,24,at(54.4)],[x+.6,24,at(54.4)],[x-.5,22.4,at(56.7)],[x+.5,22.4,at(56.7)],[x-.5,23.4,at(56.7)],[x+.5,23.4,at(56.7)]]));}
body=union([body,...details]);
// Vensters, glasvelden en klokken zijn blind: geen dunne raamroedes of open bogen.
const cuts=[];
// Bovengevel aan het spoor: herkenbare vensterreeksen boven de perronkap.
// Uitsparingen beginnen buiten de wand en blijven blind, 0,35 m diep.
for(const [y,x0,x1,pitch,z0,z1] of [
  [-8.30,-71.0,-9.0,3.10,5.75,9.25],
  [-8.45,26.0,66.0,3.60,5.75,9.25],
  [-7.23,69.5,84.0,3.50,5.45,7.90],
  [-7.36,13.5,23.5,3.40,5.90,9.60],
])for(let x=x0;x<x1;x+=pitch)cuts.push(box(x-.75,y-.60,z0,x+.75,y+.35,z1));
// Blinde glasvelden in de nieuwe dakkapellen en het spoorfronton.
for(const [x,y0,,half,eave] of RAIL_DORMERS)
  cuts.push(box(x-Math.min(.80,half-.90),y0-.25,at(eave-1.80),
    x+Math.min(.80,half-.90),y0+.35,at(eave-.25)));
cuts.push(box(-3.05,-6.80,at(61.15),-1.61,-6.17,at(62.70)));
for(const x of[43.0,46.26,49.50])for(const [z0,z1]of[[58.8,60.9],[61.5,63.0]])
  cuts.push(box(x-.70,-7.88,at(z0),x+.70,-7.27,at(z1)));
// Glazen halvensters op beide dwarsgevels en verdieping boven de lage passage.
for(const [x,inner]of[[2.2,.35],[29.3,-.35]])for(const y of[9.5,13.8,18.1])
  for(const [z0,z1]of[[62.5,65.2],[66.0,68.5]])
    cuts.push(box(Math.min(x-inner,x)-.30,y-.80,at(z0),Math.max(x-inner,x)+.30,y+.80,at(z1)));
// Pijler-/raamritme onder de kap als ondiepe blinde nissen in het gesloten
// steunvolume. De buitenrand volgt de volledige BAG-contour, ook in de bocht.
const railEdge=x=>{const ys=[];for(let i=0;i<FOOT.length;i++){
  const a=FOOT[i],b=FOOT[(i+1)%FOOT.length];
  if(x>=Math.min(a[0],b[0])&&x<=Math.max(a[0],b[0])&&Math.abs(a[0]-b[0])>.001)
    ys.push(a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]));
}return Math.min(...ys);};
for(let x=-140;x<83;x+=8.4){const x0=x-2.40,x1=x+2.40,y0=railEdge(x0),y1=railEdge(x1);
  cuts.push(prism([[x0,y0-.40],[x1,y1-.40],[x1,y1+.35],[x0,y0+.35]],.45,4.10));
}

for(const [y,x0,x1]of[[7.9,-73,-8],[18.4,29,60],[31.6,62,82]])for(let x=x0+2;x<x1-2;x+=4.6)for(const z of[2,6.3])if(!(y===7.9&&x>-35&&x<-27))cuts.push(box(x-.65,y-.28,z,x+.65,y+.5,z+3.1));
for(const x of[5,9,13,17,21,25])for(const z of[7.5,11.1])cuts.push(box(x-.65,22.1,z,x+.65,27,z+2.7).intersect(box(x-.65,x>10&&x<21?26.25:22.55,z,x+.65,27,z+2.7)));
for(const y of[6.4,12.1]){cuts.push(Manifold.cylinder(.5,.95,.95,24).rotate([90,0,0]).translate([TC[0],y+.3,at(80.7)]));for(const x of[-33.4,-31.1,-28.8])cuts.push(box(x-.5,y-.25,at(76.5),x+.5,y+.25,at(78.1)));}
cuts.push(Manifold.cylinder(.5,.8,.8,24).rotate([90,0,0]).translate([15.55,26.8,at(67.9)]));
body=body.subtract(union(cuts));
if(body.status()!=='NoError'||body.decompose().length!==1)throw Error('station niet verbonden');
await writeLandmark({slug:'station-maastricht',base:BASE,nodes:[['building:station',body]],catalog:{name:'Station Maastricht',origin:O,xAxis:A,groundOffsetMetres:-.3,groundSamplePoints:[[-45,18],[15,34],[45,25]],replacesBuildings:['NL.IMBAG.Pand.0935100000025024'],description:'Volledig stationspand: parallelle zadelkappen, vestibule met trapfronton en klok, hoge klokkentoren met trapgevels, zuidkantoren met spoorvensters en negen spoorzijdige dakkapellen, noordelijke dwarsvleugel met breed trapfronton en dakkapellen, lage kopuitbouwen, halvensters, pijlernissen, luifel met leeuwenreliëfs en gesloten betonnen perronkap met lichtstrook. Herstelt buurdakbesmetting van de lage kap. +X RD 106 graden, z=0 NAP +47,4 m; voet -0,8 m.',realWorld:{groundNapM:G,canopyNapM:52.42,canopyLightRidgeNapM:54.79,southRidgeNapM:64.01,hallRidgeNapM:72.18,hallFrontonNapM:73.3,towerRoofNapM:82.82,towerGableNapM:84,railSouthDormerRidgesNapM:[61.66,61.44,61.62,61.30,61.62,61.54,61.37,61.13,61.21],railNorthCrossRidgeNapM:64.90,railNorthCrossGableNapM:65.80,railFacadeNicheDepthM:.35},sources:['PDOK BAG/BGT 0935100000025024, AHN DSM/DTM 0,5 m en ortho, 11 oktober 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000025024','https://monumentenregister.cultureelerfgoed.nl/monumenten/506688','https://www.spoorbeeld.nl/databank/maastricht','https://commons.wikimedia.org/wiki/Category:Station_Maastricht','https://commons.wikimedia.org/wiki/Category:Platforms_at_Station_Maastricht','https://www.aerophotostock.com/media/7938f835-2f96-426d-8610-c575f647bd93-maastricht-luchtfoto-stadsdeel-wyck-met-station-maastricht','Google Maps 3D station Maastricht: uitsluitend visuele kruiscontrole, geen geometrie overgenomen, 11 oktober 2026']}});
