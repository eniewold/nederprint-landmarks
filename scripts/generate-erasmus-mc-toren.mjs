// Oorspronkelijke Medische Faculteit, OD205 / Jean Prouvé, 1968–1972.
// Per-rij voorbeeld: generate-mondriaantoren.mjs, volledig gelezen.
// BAG/PDOK/AHN CC0; 3DBAG TU Delft/3DGI CC BY 4.0. Foto's: Sten van
// Houwelingen CC BY-SA 4.0, Ricknl publiek domein, Cathrotterdam CC BY-SA 4.0;
// Platform Wederopbouw Iris van den Broek / Guido Pijper alleen referentie.
import {Manifold,CrossSection,prism,rect,box,union,ring3,ccw,writeLandmark} from './efteling-kit.mjs';
const slug='erasmus-mc-toren',ORIGIN=[91851,436180],ANGLE=24.2,rad=ANGLE*Math.PI/180,AXIS=[Math.cos(rad),Math.sin(rad)];
const GROUND=-.8,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
// Het 79,2 × 33,6 m hoge labgebouw, vier kopinspringingen en middennissen
// volgen de BAG-voet; de witte driehoekige kolombekleding is apart opgebouwd.
const FOOT=[[-39.49,-16.5],[-36.12,-16.5],[-36.12,-4.4],[-36.97,-4.4],[-39.48,-4.4],[-39.48,3.8],[-36.98,3.8],[-36.12,3.8],[-36.12,16.0],[-7.14,16.0],[-7.14,12.23],[7.3,12.23],[7.3,16.0],[36.33,16.0],[36.33,3.9],[39.66,3.9],[39.68,-4.31],[36.33,-4.31],[36.33,-16.5],[7.32,-16.5],[7.32,-12.75],[-7.11,-12.75],[-7.11,-16.5]];
// The small end recesses are between two wide end shoulders, not the reverse.
const ACTUAL=[[-39.49,-17.21],[-7.11,-17.15],[-7.11,-12.75],[7.32,-12.75],[7.32,-17.15],[39.71,-17.12],[39.68,-4.31],[36.33,-4.31],[36.31,3.88],[39.66,3.89],[39.63,16.69],[7.3,16.64],[7.3,12.23],[-7.14,12.23],[-7.14,16.63],[-39.49,16.59],[-39.48,3.8],[-36.12,3.8],[-36.12,-4.4],[-39.36,-4.46]];
let body=prism(ACTUAL,BASE,z(107.88));
const ribs=[];for(const s of [-1,1])for(const u of [-35.9,-28.7,-21.5,-14.3,-7.14,7.3,14.5,21.7,28.7,36.1]){const face=s>0?16.64:-17.17;ribs.push(prism([[u-1.25,face-s*.75],[u+1.25,face-s*.75],[u+1.25,face],[u,face+s],[u-1.25,face]],BASE,z(107.88)));}
body=union([body,...ribs]);
// Rondhoeken van de televisievensters als echte blinde nis, 0,35 m diep.
function roundedRect(w,h,r=.22){const a=[];for(const [x,y,start]of [[w/2-r,h/2-r,0],[-w/2+r,h/2-r,90],[-w/2+r,-h/2+r,180],[w/2-r,-h/2+r,270]])for(let i=0;i<=4;i++){const t=(start+i*22.5)*Math.PI/180;a.push([x+r*Math.cos(t),y+r*Math.sin(t)]);}return a;}
function window(center,normal,w,h,nap,depth=.35){return prism(roundedRect(w,h,Math.min(.22,h/4)),0,depth+.3).rotate([90,0,0]).rotate([0,0,Math.atan2(normal[1],normal[0])*180/Math.PI-90]).translate([center[0]+normal[0]*.3,center[1]+normal[1]*.3,z(nap+h/2)]);}
const cuts=[];
// Elf brede traveeën van 7,2 m: twee televisievensters per Prouvé-paneel,
// met daarboven twee kleine ventilatievelden; servicebanden op drie niveaus.
const bays=Array.from({length:11},(_,k)=>-35.9+7.2*k);
for(const s of [-1,1])for(const u of bays){const y=s>0?16.64:-17.17,nearCenter=Math.abs(u)<6;const face=nearCenter?(s>0?12.23:-12.75):y;
 for(let k=0;k<24;k++){const h=10.1+4.0*k;if([7,15,23].includes(k)){cuts.push(window([u,face],[0,s],4.9,1.8,h-.4,.55));continue;}for(const du of [-1.13,1.13]){const faceDu=Math.abs(u+du)<7.1?(s>0?12.23:-12.75):y;cuts.push(window([u+du,faceDu],[0,s],1.8,1.45,h));cuts.push(window([u+du,faceDu],[0,s],.95,.6,h+2.05,.25));}}
 // Stijlen en panelen aan de dakdoos, inclusief blinde reliëfdriehoek.
 const tri=[[u-.95,face],[u+.95,face],[u,face]];cuts.push(window([u,face],[0,s],1.9,.95,104.7,.2));
}
// Beide kopse gevels hebben eigen smalle paren en een diepe middeninspringing.
for(const s of [-1,1])for(const v of [-13.3,-8.8,8.2,12.7])for(let k=0;k<24;k++){const h=10.1+4*k;for(const dv of [-.85,.85])cuts.push(window([s>0?39.67:-39.45,v+dv],[s,0],1.3,1.45,h));}
for(const s of [-1,1])for(let k=0;k<24;k++)for(const v of [-1.9,1.3])cuts.push(window([s>0?36.32:-36.12,v],[s,0],1.5,1.45,10.1+4*k));
body=body.subtract(union(cuts));
// Twee echte schuine dakvlakken van de lage rand (+107,88) naar de verhoogde
// middenzone (+111,84); geen hoogtetrap uit rastermetingen.
const roofSlopes=[];for(const s of [-1,1]){const outer=s>0?13.25:-13.78,inner=s>0?7.2:-7.65;roofSlopes.push(Manifold.hull([[-36,outer,z(107.80)],[36.32,outer,z(107.80)],[-36,inner,z(107.80)],[36.32,inner,z(107.80)],[-36,outer,z(107.88)],[36.32,outer,z(107.88)],[-36,inner,z(111.84)],[36.32,inner,z(111.84)]]));}
let roofCore=B(-36,-7.65,36.32,7.2,107.8,111.84);
const tech=B(-11.8,-4.9,30.15,4.16,111.75,114.9),westTech=B(-29.9,-4.4,-11.7,3.85,111.3,111.44);
const plant=union([B(-8.5,-4.37,-4.1,3.9,114.8,116.816),B(-21.5,.1,-13.13,2.1,111.3,114.019),B(-16.8,2.1,-14.0,3.9,111.3,112.65),B(30,-4.4,32.65,4.0,107.8,111.36)]);
const roofCuts=[];for(const [a,b,c,d,top]of [[-11.8,-4.9,30.15,4.16,114.9]]){for(const s of [-1,1])for(let u=a+1;u+1.1<c-.5;u+=2.4)roofCuts.push(window([u,s>0?d:b],[0,s],1.1,2.0,top-2.8));}
roofCore=roofCore.subtract(union(roofCuts));
const technical=tech.subtract(union(roofCuts));
const model=union([body,...roofSlopes,roofCore,technical,westTech,plant]).trimByPlane([0,0,1],BASE);
console.log(JSON.stringify(model.decompose().map(m=>({v:m.volume(),bounds:m.boundingBox()})).slice(0,8))); if(model.status()!=='NoError'||model.decompose().length!==1)throw Error(`faculteitstoren ${model.status()} ${model.decompose().length} volumes`);
const rdLocal=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:erasmus-mc-faculteitstoren-met-prouve-ramen-ribben-en-schuine-dakvlakken',model]],catalog:{name:'Erasmus MC-hoogbouw',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:42.35545937,groundSamplePoints:[[91839,436224],[91892,436221],[91897,436177],[91800,436181]].map(rdLocal),replacesBuildings:['NL.IMBAG.Pand.0599100010031236'],description:'Uitsluitend het afzonderlijke BAG-pand van de oorspronkelijke faculteitstoren: 79,2 × 33,6 m, kop- en middeninspringingen, driehoekige kolombekleding, afgeronde televisievensters en servicebanden, twee doorlopende schuine dakvlakken en technische middenzone. Nieuw ziekenhuis en laagbouw blijven PDOK.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,roofEdgeNapM:107.88,roofCoreNapM:111.84,technicalNapM:114.9,plantNapM:[111.44,111.36,112.65,114.019,116.816],bayPitchM:7.2,storeyM:4.0,nicheDepthM:.35,estimates:['Prouvé-vensters en kleine ventilatievelden uit schuine foto’s, 4 m laagritme en 7,2 m hoofdtraveeën','drie servicebanden, blinde glaspanelen, vensterhoekradius en dakroosters geschat','driehoekige kolombekleding volgt BAG met 1 m uitsteek','technische installaties vereenvoudigd tot gemeten dakniveaus','antennevelden, dakletters, ladderhekwerk en dunne leidingen weggelaten wegens doorsnede kleiner dan 0,9 m']},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100010031236 (TU Delft/3DGI CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://wederopbouwrotterdam.nl/artikelen/medische-faculteit (Platform Wederopbouw, foto’s Iris van den Broek / Guido Pijper alleen referentie)','https://commons.wikimedia.org/wiki/File:Faculteitsgebouw_Erasmus_MC.jpg (Sten van Houwelingen, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Erasmus_MC_2008_hires.JPG (Ricknl, publiek domein)','https://commons.wikimedia.org/wiki/File:Erasmus_Medical_Center_Rotterdam_view_from_Coolhaven.jpg (Cathrotterdam, CC BY-SA 4.0)']}});
