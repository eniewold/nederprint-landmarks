// Nationaal Monument Westerbork: spoor, opwaartse rails, stootblok en keienmuur.
// Meters, Z omhoog; +X langs het spoor naar de muur. Alle invoer is vast.
import {Manifold,box,rect,hull,ring3,union,writeLandmark} from './efteling-kit.mjs';
const ORIGIN=[237397,548450.7],AXIS=[.999179538,.0405];
// PDOK ortho 2026: spooras circa 2,32 graden, uiteinden circa RD 237359/548449 en 237435/548452.
// De bron noemt 40 m; de huidige ortho meet circa 76 m inclusief de uiteinden.
const MIN=.9,RAIL_CENTRE=.78;
const SECTIONS=[[-39,2.2,2.65],[-38.4,1.9,2.4],[-37.7,1.5,1.95],[-37,1.1,1.3],[-36,.8,.9],[-35,.78,.85],[37.4,.78,.85]];
const rail=side=>union(SECTIONS.slice(1).map(([x1,y1,z1],i)=>{
 const [x0,y0,z0]=SECTIONS[i];
 return hull([[x0,side*y0-MIN/2,0],[x0,side*y0+MIN/2,0],[x0,side*y0-MIN/2,z0],[x0,side*y0+MIN/2,z0],[x1,side*y1-MIN/2,0],[x1,side*y1+MIN/2,0],[x1,side*y1-MIN/2,z1],[x1,side*y1+MIN/2,z1]]);
}));
// De 97 echte bielzen zijn grover gegroepeerd: 34 brede dwarsliggers zonder zwevende rail.
const sleepers=Array.from({length:34},(_,i)=>box(-37.8+i*2.22,-1.4,0,-36.9+i*2.22,1.4,.45));
const rails=union([rail(-1),rail(1),...sleepers]);
// Stootblok: twee schuinstaande schragen, dwarsbalk met spitse opening en bufferkoppen.
const trestle=side=>hull([...ring3(rect(35.8,side*.78-.45,39.0,side*.78+.45),0),...ring3(rect(37.05,side*.78-.45,37.95,side*.78+.45),1.55)]);
const beam=hull([...ring3(rect(37.05,-1.55,37.95,1.55),1.1),...ring3(rect(37.05,-1.55,37.95,1.55),2.0)]);
const head=side=>hull([...ring3(rect(36.8,side*.9-.45,37.5,side*.9+.45),1.1),...ring3(rect(36.55,side*.9-.45,37.5,side*.9+.45),1.45),...ring3(rect(36.55,side*.9-.45,37.5,side*.9+.45),2.0)]);
const haunch=side=>hull([[37.05,side*.78,0],[37.95,side*.78,0],[37.05,side*.33,.65],[37.95,side*.33,.65],[37.05,0,1.1],[37.95,0,1.1],[37.05,side*.78,1.1],[37.95,side*.78,1.1]]);
const stop=union([trestle(-1),trestle(1),beam,haunch(-1),haunch(1),head(-1),head(1),box(35.8,-1.23,0,39,1.23,.25)]);
// Licht achteroverhellende keienmuur met grove, vastgehechte keien als reliëf.
const wallBody=hull([...ring3(rect(39.55,-4.5,40.75,4.5),0),...ring3(rect(39.85,-4.5,41.05,4.5),2.55)]);
const stones=Array.from({length:3},(_,row)=>Array.from({length:8},(_,i)=>{
 const y=-4.45+i*1.1+(row%2?.12:0),z=.08+row*.81;
 return hull([...ring3(rect(39.5,y,40.15,y+.98),z),...ring3(rect(39.31,y+.08,40.18,y+.9),z+.35),...ring3(rect(39.58,y+.02,40.22,y+.94),z+.73)]);
})).flat();
const wall=union([wallBody,...stones]);
const plaque=side=>hull([...ring3(rect(37.85,side*3.3-.75,39.3,side*3.3+.75),0),...ring3(rect(37.85,side*3.3-.75,39.3,side*3.3+.75),.6),[39.3,side*3.3-.75,.85],[39.3,side*3.3+.75,.85]]);
const plaques=union([plaque(-1),plaque(1)]);
await writeLandmark({slug:'kamp-westerbork',base:0,nodes:[['building:spoor-en-opwaartse-rails',union([rails,stop])],['building:keienmuur',wall],['building:tekstplaten',plaques]],catalog:{name:'Nationaal Monument Westerbork',origin:ORIGIN,xAxis:AXIS,groundHeight:57.99769448439919,groundOffsetMetres:-.15,groundSamplePoints:[[-30,0],[0,0],[30,0]],description:'Spoormonument met gekromde opwaartse railuiteinden, stootblok, keienmuur en twee tekstplaten; spoorstaven en liggers verdikt voor 1:1000. Grindbed en paden blijven PDOK.',realWorld:{minimumPartsM:MIN,representedSleepers:34,actualSleepers:97,wallHeightM:2.55,raisedRailTopM:2.65,estimatedRailLengthM:76.4,sourceRailLengthM:40},sources:['https://www.4en5mei.nl/oorlogsmonumenten/zoeken/2055/hooghalen-nationaal-monument-westerbork','https://kampwesterbork.nl/downloads/plattegrond-april-2021.pdf','https://commons.wikimedia.org/wiki/Category:Westerbork_national_memorial','PDOK BGT, AHN DSM/DTM 0,5 m en Actueel_orthoHR, 2026-10-11']}});
