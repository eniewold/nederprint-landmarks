// Eerebegraafplaats: ommuurd grafveld, omgang, urn en klokkenstoel.
// BGT/ortho/AHN 2026. Doorlopende prisma's; geen hoogtelagen.
import {Manifold,box,rect,prism,ring3,hull,union,writeLandmark} from './efteling-kit.mjs';
const ORIGIN=[99804,490712],AXIS=[.3924,.9198];
const OUTLINE=[[-53.7,-5.27],[-51.34,-6.23],[-47.68,-8.73],[-35.62,-10.18],[-12.42,-11.21],[6.75,-11.14],[25.1,-10.7],[35.31,-10.12],[41.17,-9.18],[44.78,-7.59],[45.49,-6.17],[48.66,-6.14],[52.33,-5.93],[56.7,-5.39],[58.77,-7.53],[62.89,-10.78],[64.98,-7.16],[59.61,-2.31],[59.57,-.93],[57.76,2.56],[53.79,8.89],[50.31,13.21],[47.17,15.95],[46.74,17.42],[41.33,20.78],[39.78,17.71],[-41.11,17.77],[-41.2,19.46],[-50,19.45],[-51.76,13.19],[-52.01,10.33],[-52.81,4.55]];
const FIELD=rect(-38.79,-5.46,35.92,12.6);
// De 41 ongelijke grafvakken zijn afzonderlijk afgelezen in de gedraaide ortho.
const PLOTS=[];const add=(x0,x1,y0,y1)=>PLOTS.push([x0,y0,x1,y1]);
for(const [a,b]of [[-34,-30],[-29,-23],[-22,-19],[-18,-14],[-13,-9],[-8,3],[4,8],[9,12],[13,16.5],[17.5,21.5],[22.5,26],[27,30.5],[31.5,35]])add(a,b,7.8,11.8);
add(-38,-35,.7,11.8);
for(const[a,b]of [[-34,-30],[-22,-18],[-17,-14],[-13,-9],[22.5,26],[31.5,35]])add(a,b,.7,6.6);
for(const[a,b]of [[-29,-23],[4,8],[9,12],[13,21.5]]){add(a,b,.7,3.1);add(a,b,4,6.6);}
add(-8,3,1,5.4);
for(const[a,b]of [[-38,-35],[-34,-30],[-29,-23],[-22,-18],[-17,-14],[-13,-9],[-8,3],[4,8],[9,21.5],[22.5,26],[27,30.5],[31.5,35]])add(a,b,-4.8,-.1);
if(PLOTS.length!==41)throw Error('Grafvakken '+PLOTS.length);
const patch=union(PLOTS.map(([a,b,c,d])=>box(a+.25,b+.25,0,c-.25,d-.25,.45)));
let floor=prism(OUTLINE,0,.8).subtract(prism(FIELD,.3,1));
const rims=union(PLOTS.map(([a,b,c,d])=>box(a,b,.29,c,d,.55).subtract(box(a+.25,b+.25,.28,c-.25,d-.25,.6))));
floor=union([floor,rims]).subtract(patch);
// Muren sluiten aan op de omgang; westzijde hoger tegen de duinen.
const walls=union([box(-51.3,17.2,0,38,18.1,2.7),box(42,17.2,0,47.4,18.1,2.7),box(-52.9,-5.8,0,-52,17.8,1.85),box(-39,-11.5,0,35,-10.6,1.95)]);
// Vier gedenkplaten als blinde reliëfvlakken op de westmuur.
const plaques=union([-33,-16,1,18].map(x=>box(x-3.1,16.85,.85,x+3.1,17.3,2.2)));
// Klokkentoren: BGT overkapping 2,2 × 2,9 m; AHN top NAP 18,61 m.
const tower=box(-52.8,10.2,0,-50.45,13.3,3.45);
const bellFrame=box(-52.55,10.5,3.35,-50.7,13,5.05);
const blind=hull([[-52.6,10.15,3.65],[-50.65,10.15,3.65],[-51.625,10.15,4.85],[-52.6,10.85,3.65],[-50.65,10.85,3.65],[-51.625,10.85,4.85]]);
const bellRoof=hull([...ring3(rect(-52.55,10.5,-50.7,13),4.5),...ring3(rect(-52.95,10.05,-50.3,13.45),4.95),...ring3(rect(-52.7,10.3,-50.55,13.2),5.81)]);
const bell=union([tower,bellFrame.subtract(blind),bellRoof]);
// Urn van 2,5 m op noordterras; diameters uit foto's, minimaal 0,9 m.
const urn=Manifold.revolve([[0,0],[.58,0],[.58,.7],[.46,.95],[.46,2.15],[.65,2.4],[.45,2.5],[0,2.5]],24).translate([41.2,-3.9,.8]);
// Open toegang in noordwestmuur. Geen horizontale houten poortbalk of dun hek.
const gate=union([box(37.4,16.8,0,38.4,18.5,3.6),box(41.6,16.8,0,42.6,18.5,3.6)]);
const building=union([walls,plaques,bell,urn,gate]);
floor=floor.subtract(building);
await writeLandmark({slug:'erebegraafplaats-bloemendaal',base:0,nodes:[['road:omgang-paden-grafvakken',floor],['vegetation:41-grafvakken',patch],['building:muren-gedenkplaten-urn-klokkenstoel-toegang',building]],catalog:{name:'Eerebegraafplaats Bloemendaal',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.8,groundHeight:56.61547,groundSamplePoints:[[-35,-10],[0,-10],[35,-10]],replacesTerrain:['G0377.cfa0463095e849ddb0d21012a97b2ed9'],description:'Het ommuurde grafveld op het duin: verlaagde grafvakken en verhoogde omgang, vier gedenkplaten, urn en klokkenstoel. Houten kruis op het duin en auditorium buiten het grafveld niet opgenomen.',realWorld:{groundNapM:13.6,graveFieldNapM:13.1,bellTopNapM:18.61,urnHeightM:2.5,gravePlots:41,estimatedWallThicknessM:.9,estimatedPlotBordersM:.25,estimatedUrnPositionLocalM:[41.2,-3.9]},sources:['https://www.eerebegraafplaatsbloemendaal.eu/ontwerp-en-architectuur','https://www.eerebegraafplaatsbloemendaal.eu/klokkenstoel','https://www.eerebegraafplaatsbloemendaal.eu/urn','https://www.4en5mei.nl/oorlogsmonumenten/zoeken/1813/overveen-eerebegraafplaats','https://commons.wikimedia.org/wiki/Category:Erebegraafplaats_Bloemendaal','https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel/items','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
