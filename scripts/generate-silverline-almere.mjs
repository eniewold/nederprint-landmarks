// Silverline, Claus en Kaan (2001). Voorbeelden generate-evoluon.mjs,
// generate-nemo.mjs en generate-kubuswoningen.mjs gelezen: bouwprisma's,
// gekantelde gevelvlakken en printkragen, geen gestapelde DSM-plakken.
// BAG/AHN: CC0; 3D BAG, TU Delft/3DGI: CC BY 4.0. Foto's alleen referentie.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='silverline-almere',ORIGIN=[143266,486516],ANGLE=13.75;
const r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
const GROUND=-4.26,BASE=-.48,z=h=>h-GROUND;
const P={u0:-10.5,u1:11.43,v0:-6.27,v1:13.36,lowerRoof:15.448,upperFoot:24.8,roof:44.144,frontRoof:45.121,rim:45.555};
const B=(u0,v0,u1,v1,h0,h1)=>box(u0,v0,z(h0),u1,v1,z(h1));
// Het achtervlak blijft recht; de bovenste zuidgevel kantelt naar het meer.
// Aan de onderkant een aangesloten 45-graden afschuining: geen vlak zwevend dak.
const front=h=>h<17.2?P.v0:h<24.8?P.v0-6.3*(h-17.2)/7.6:h<44.144?-12.57-1.3*(h-24.79)/19.354:-13.87;
let tower=union([
 B(P.u0,P.v0,P.u1,P.v1,-4.74,17.21),
 Manifold.hull([...ring3(rect(P.u0,P.v0,P.u1,P.v1),z(17.2)),...ring3(rect(P.u0,-12.57,P.u1,P.v1),z(24.8))]),
 Manifold.hull([...ring3(rect(P.u0,-12.57,P.u1,P.v1),z(24.79)),...ring3(rect(P.u0,-13.87,P.u1,P.v1),z(P.roof))]),
 B(P.u0,-13.87,P.u1,-6.27,43.9,P.frontRoof),
]);
// Het lage woonblok is een eigen gebouwdeel, op de gemeten voetafdruk.
let wing=B(-21.25,-6.27,-10.45,13.37,-4.74,P.lowerRoof);
const cuts=[];
function frontWindow(u,h,w=2.3,height=1.55){
 const y0=front(h),y1=front(h+height);
 return Manifold.hull([[u,y0-.5,z(h)],[u+w,y0-.5,z(h)],[u,y0+.38,z(h)],[u+w,y0+.38,z(h)],[u,y1-.5,z(h+height)],[u+w,y1-.5,z(h+height)],[u,y1+.38,z(h+height)],[u+w,y1+.38,z(h+height)]]);
}
// Gevarieerde raamvelden en hoekserres; nissen .38m diep, geen dunne kozijnen.
for(let h=1.3;h<43.4;h+=2.85){
 for(let u=-8.9;u<10;u+=3.35){if(h+1.55<17.2||h>24.8)cuts.push(frontWindow(u,h,u>7?2.5:2.1));cuts.push(B(u,12.98,u+2.15,13.8,h,h+1.65));}
 for(let v=-11.8;v<12;v+=3.4){cuts.push(B(11.05,v,11.9,v+2.2,h,h+1.6));if(h>16)cuts.push(B(-11,v,-10.12,v+2.2,h,h+1.6));}
}
tower=tower.subtract(union(cuts));
const lowCuts=[];
for(let h=1.3;h<14;h+=2.85){for(let u=-20.4;u<-11.5;u+=3.1)lowCuts.push(B(u,-6.8,u+1.9,-5.89,h,h+1.55),B(u,12.99,u+1.9,13.8,h,h+1.55));for(let v=-5.2;v<12;v+=3.2)lowCuts.push(B(-21.7,v,-20.87,v+2.1,h,h+1.55));}
wing=wing.subtract(union(lowCuts));
// Verzonden 3D BAG-dakput (NAP +41.38) en borstwering: open van boven.
tower=tower.subtract(B(-5.1,-6.25,4.8,-1.2,41.38,49));
const rim=union([B(-10.5,12.45,11.43,13.36,44.1,P.rim),B(10.53,-13.87,11.43,13.36,44.1,P.rim),B(-10.5,-13.87,-9.6,13.36,44.1,P.rim)]);
// Lift-/dakinstallatie uit de gemeten daken, geen generiek spitsje.
const machinery=union([B(-.43,5.17,4.6,8.98,44.05,45.799),B(-12.3,-6.3,-10.3,-4.1,15.3,16.55)]);
// Zichtbare zwarte garageplint; het begroeide garagedak blijft PDOK-terrein.
const garageOutline=[[-43.01,-27.45],[11.43,-27.45],[11.43,-14.65],[-10.52,-13.9],[-10.51,-7.86],[-21.25,-6.27],[-21.25,13.37],[-43.01,13.37]];
const inner=[[-42.11,-26.55],[10.53,-26.55],[10.53,-15.55],[-11.42,-14.8],[-11.41,-8.76],[-22.15,-7.17],[-22.15,12.47],[-42.11,12.47]];
let garage=prism(garageOutline,BASE,z(-1.525)).subtract(prism(inner,BASE-.1,z(-1.5)));
const doorCuts=[];for(let u=-40;u<10;u+=7)doorCuts.push(B(u,-27.8,u+3.1,-27.07,-3.8,-2.2));
garage=garage.subtract(union(doorCuts));
// Entree en uitloop boven de zwarte plint, aangesloten aan de westgevel.
const entrance=union([B(-22.3,3.2,-20.9,7.9,-4.7,1.25),Manifold.hull([...ring3(rect(-22.8,2.7,-20.9,8.4),z(.05)),...ring3(rect(-23.6,2.7,-20.9,8.4),z(1.25))])]);
const model=union([tower,wing,rim,machinery,garage,entrance]).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError')throw Error('Silverline niet gesloten');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:silverline-gekantelde-toren-woonvleugel-en-garageplint',model]],catalog:{name:'Silverline',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:38.566999637,groundSamplePoints:[[143229,486530],[143223,486523]].map(local),replacesBuildings:['NL.IMBAG.Pand.0034100000070107'],description:'Silverline aan het Weerwater: gekantelde bovenbouw met aangesloten printafschuining, lage woonvleugel, gevarieerde vensternissen, open dakput en installaties, westentree en zwarte garageplint. Oorsprong RD143266/486516 op NAP-4.26m; as13.75graden uit gevels. Het begroeide garagedak blijft terrein, geen dubbele landschapsplaat. Hoogte circa49m, geen120m-toren.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,mainRoofNapM:44.144,frontRoofNapM:45.121,rimNapM:45.555,machineryNapM:45.799,lowWingRoofNapM:15.448,garageTopNapM:-1.525,estimates:['kantelhoek bovenste gevel en overgang op24.8NAP uit schuine foto, circa1.5m onzeker; 45-graden printafschuining begint op17.2NAP','woonlaagritme2.85m, gevarieerde vensters2.1/2.5 bij1.6m en hoekserres uit foto, circa.5m onzeker','entreeportaal en canopy uit foto, .9m minimumdikte; corrugatie en relingen dunner dan.9m weggelaten','garageplint zichtbaar als gesloten.9m wand; begroeid garagedak hoort bij PDOK-terrein']},sources:['https://www.visitalmere.com/nl/locaties/3783843205/silverline','https://www.architectuur.org/bouwwerk/153/Woontoren_Silverline.html','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0034100000070107 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:20150316_Almere_100.JPG','https://commons.wikimedia.org/wiki/File:20150316_Almere_137.JPG','https://commons.wikimedia.org/wiki/File:20150316_Almere_84.JPG','https://commons.wikimedia.org/wiki/File:Silverline.jpg']}});
