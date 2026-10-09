// Oostpoort: landpoort, twee ronde/achtkante torens, traptoren,
// overdekte stadsmuur en de haakse waterpoort. Meters, Z omhoog.
// BAG 0503100000032633 en AHN4 DSM/DTM 0,5 m, gemeten 2026-10-09.
// De nok van de landpoort ligt evenwijdig aan de lijn tussen de torens.
// Referentiefoto's RCE 20325391, 20322269, 20048592 en Ton Koorevaar.
import {box,prism,circle,hull,ring3,spire,gableRoof,place,union,writeLandmark} from './efteling-kit.mjs';
const slug='oostpoort-delft', base=-.8;
const origin=[85070.515,447428.705],xAxis=[.94732,-.32029];
const GROUND=.4;
const TOWER={r:1.92,spacing:7.34,roundTop:11.15,octTop:14.05,top:24.92};
const GATE={x0:-2.7,x1:1.42,width:5.92,eave:8.7,ridge:11.45};
const GALLERY={x0:-18.15,x1:-2.35,y0:2.13,y1:4.22,eave:5.18,ridge:6.51};
const WATER={x0:-19.65,x1:-16.8,y0:2.1,y1:9.65,eave:5.23,ridge:6.63};
const point=(w,spring,top,z0=base-1)=>[[-w/2,z0],[w/2,z0],[w/2,spring],[0,top],[-w/2,spring]];
// Een doorgang langs X, met top >50° voor steunvrij printen.
const openingX=(w,spring,top,x0,x1,y=0)=>prism(point(w,spring,top),x0,x1).rotate([90,0,90]).translate([0,y,0]);
const openingY=(w,spring,top,y0,y1,x=0)=>prism(point(w,spring,top),-y1,-y0).rotate([90,0,0]).translate([x,0,0]);
// Blinde nissen liggen .35 m achter de gevel. De rechte delen blijven .9 m breed.
const nicheX=(x,y,z,w,h,side)=>box(x-(side>0?.35:1),y-w/2,z,x+(side>0?1:.35),y+w/2,z+h);
const nicheY=(x,y,z,w,h,side)=>box(x-w/2,y-(side>0?.35:1),z,x+w/2,y+(side>0?1:.35),z+h);
const towers=[];
for(const y of [-TOWER.spacing/2,TOWER.spacing/2]){
 const c=[0,y];
 let round=prism(circle(c,TOWER.r,64),base,TOWER.roundTop);
 const cuts=[];
 for(const [angle,z] of [[0,3.7],[90,6.2],[180,2.15],[180,8.5],[270,6.2]]){
  cuts.push(place(box(TOWER.r-.35,-.5,z,TOWER.r+.5,.5,z+1.3),{at:[...c,0],deg:angle}));
 }
 round=round.subtract(union(cuts));
 let oct=prism(circle(c,1.95,8,Math.PI/8),TOWER.roundTop-.02,TOWER.octTop);
 const arcade=[];
 for(let k=0;k<8;k++){
  // Spaarboog per vlak, met venster als smallere, diepere nis.
  const arch=prism(point(1.15,12.5,13.25,11.6),1.48,2.2).rotate([90,0,90]);
  arcade.push(place(arch,{at:[...c,0],deg:k*45}));
 }
 oct=oct.subtract(union(arcade));
 // Acht vlakken; korte uitlopende voet en lange naald. Geen schijven/lagen.
 const flare=hull([...ring3(circle(c,2.04,8,Math.PI/8),14.02),...ring3(circle(c,1.56,8,Math.PI/8),15.38)]);
 const needle=hull([...ring3(circle(c,1.56,8,Math.PI/8),15.37),[0,y,TOWER.top]]);
 const collar=hull([...ring3(circle(c,1.9,64),10.86),...ring3(circle(c,2.03,64),11.04),...ring3(circle(c,2.03,64),11.17)]);
 towers.push(union([round,oct,flare,needle,collar]));
}
let gate=union([box(GATE.x0,-GATE.width/2,base,GATE.x1,GATE.width/2,GATE.eave),place(gableRoof(GATE.width,4.12,GATE.eave-.02,GATE.ridge),{at:[-.64,0,0],deg:90})]);
gate=gate.subtract(openingX(2.7,2.6,4.32,-4,3));
const gateCuts=[];
for(const x of [GATE.x0,GATE.x1])for(const y of [-1.85,1.85])gateCuts.push(nicheX(x,y,5.6,1.0,1.4,x<0?-1:1));
gate=gate.subtract(union(gateCuts));
// Stadszijde: gemetselde topgevel en schoorsteen op de nok.
const rearGable=prism([[-2.96,8.6],[2.96,8.6],[2.96,9.05],[.62,11.8],[.62,12.36],[-.62,12.36],[-.62,11.8],[-2.96,9.05]],GATE.x0-.45,GATE.x0+.03).rotate([90,0,90]);
const chimney=box(-1.14,-.54,11.1,-.14,.54,12.48);
const stairCentre=[-2.38,3.03];
let stair=union([prism(circle(stairCentre,1.33,48),base,11.48),spire(stairCentre,1.42,11.46,13.72,8)]);
stair=stair.subtract(nicheX(-3.69,3.03,4.65,.95,1.55,-1));
let gallery=union([box(GALLERY.x0,GALLERY.y0,base,GALLERY.x1,GALLERY.y1,GALLERY.eave),place(gableRoof(15.8,2.21,GALLERY.eave-.02,GALLERY.ridge),{at:[-10.25,3.175,0]})]);
const galleryCuts=[];
for(const x of [-15.25,-10.5,-6.5]){
 galleryCuts.push(nicheY(x,GALLERY.y0,3.05,1.08,1.45,-1));
 galleryCuts.push(nicheY(x,GALLERY.y1,2.95,1.08,1.55,1));
 galleryCuts.push(nicheY(x,GALLERY.y1,4.75,.9,.9,1));
}
gallery=gallery.subtract(union(galleryCuts));
// Uitstaande steunberen langs de waterkant, op een schuine onderkraag.
const buttresses=[-15.6,-10.6,-5.5].map(x=>hull([[x-.45,4.18,base],[x+.45,4.18,base],[x-.45,4.18,4.8],[x+.45,4.18,4.8],[x-.45,4.7,2.8],[x+.45,4.7,2.8]]));
let watergate=union([box(WATER.x0,WATER.y0,base,WATER.x1,WATER.y1,WATER.eave),place(gableRoof(7.55,2.98,WATER.eave-.02,WATER.ridge),{at:[-18.225,5.875,0],deg:90})]);
// Waterboog is doorlopend en opent tot onder water; spits vervangt rond gewelf.
watergate=watergate.subtract(openingX(4.15,.25,2.86,-21,-15.9,6.78));
const waterCuts=[];
for(const y of [4.25,8.55])for(const x of [WATER.x0,WATER.x1])waterCuts.push(nicheX(x,y,3.0,1.05,1.35,x===WATER.x0?-1:1));
watergate=watergate.subtract(union(waterCuts));
// Twee kleine trapgevels van de waterpoort; grove treden >= .9 m.
const stepped=[[-1.49,5.2],[1.49,5.2],[1.49,5.78],[.55,5.78],[.55,7.08],[-.55,7.08],[-.55,5.78],[-1.49,5.78]];
const waterGables=[WATER.y0,WATER.y1].map(y=>prism(stepped,-y-.25,-y+.25).rotate([90,0,0]).translate([-18.225,0,0]));
// Lage uitbouw aan de zuidelijke stadszijde, afzonderlijk gemeten in het AHN
// (NAP +3,4 m) en de BAG-contour, geen boomkroon als dak meegenomen.
const annex=union([box(-6.83,-4.52,base,-2.46,-2.9,2.72),hull([...ring3([[-6.83,-4.52],[-2.46,-4.52],[-2.46,-2.9],[-6.83,-2.9]],2.7),[-6.83,-2.9,3.01],[-2.46,-2.9,3.01]])]);
const raw=union([gate,rearGable,chimney,stair,...towers,gallery,...buttresses,watergate,...waterGables,annex]);
// Overlappende raamnisuitsparingen bij de noordtoren kunnen hoekrestjes
// <14 cm achterlaten; die zijn onder de printbare detailgrens. Grote losse
// componenten zijn altijd een fout, geen reden om een bouwdeel weg te gooien.
const components=raw.decompose().sort((a,b)=>b.volume()-a.volume());
for(const chip of components.slice(1)){
 const bb=chip.boundingBox();
 if(Math.max(bb.max[0]-bb.min[0],bb.max[1]-bb.min[1])>.15 || chip.volume()>.03)throw Error('Onverwacht los bouwdeel');
}
const model=components[0];
await writeLandmark({slug,base,nodes:[['building:landpoort, torens, stadsmuur en waterpoort',model]],catalog:{
 name:'Oostpoort (Delft)',origin,xAxis,groundOffsetMetres:0,
 groundSamplePoints:[[-3.5,-3],[-3.5,1],[3,-3],[3,3],[-15,0]],
 replacesBuildings:['NL.IMBAG.Pand.0503100000032633'],
 description:'Hart tussen de twee landpoorttorens op NAP +0,40 m; +X naar de veldzijde (oostzuidoost). Landpoort met dwars zadeldak, ronde torenvoeten, achtkante bovengeledingen en geknikte achtkante spitsen, traptoren, overdekte stadsmuur en haakse waterpoort. Doorgaande bogen steiler gemaakt voor 1:1000; onderkant 0,8 m onder straatniveau. De losstaande ophaalbrug blijft PDOK.',
 realWorld:{groundNapM:GROUND,torenTopM:TOWER.top,torenAfstandM:TOWER.spacing,torenDiameterM:3.84,landpoortNokM:GATE.ridge,waterpoortNokM:WATER.ridge,schattingen:['geledinggrens ronde romp/achtkant en dakknik uit fotos en AHN-randpunten','waterpoortgoot en nok bij bomen uit zichtbare AHN-punten en fotos','vensters, spaarbogen, steunberen, topgevels en schoorsteen uit fotos','twee steile doorgangen vervangen ronde gewelven; windvanen, baksteenfriezen, ramenroeden en goten onder .9 m weggelaten']},
 sources:['PDOK BAG WFS 0503100000032633; actuele orthoHR; AHN4 DSM/DTM 0,5 m bbox 85020,447380,85130,447490; 2026-10-09','https://monumentenregister.cultureelerfgoed.nl/monumenten/11968','https://commons.wikimedia.org/wiki/File:De_Oostpoort,_Delft.jpg','https://commons.wikimedia.org/wiki/File:Stadspoort_binnenzijde_-_Delft_-_20325391_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_stadspoort_buitenzijde_aan_water_-_Delft_-_20322269_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Oostpoort,_overzicht_Stadszijde_-_Delft_-_20048592_-_RCE.jpg']
}});
