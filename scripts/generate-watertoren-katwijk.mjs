// Watertoren Katwijk, 1878. Achthoekige gemetselde schacht, rond reservoir,
// ondiep tentdak, lantaarn en de twee aangebouwde vleugels van hetzelfde BAG-pand.
// BAG en AHN leveren positie, contour en hoogten; gevelindeling naar foto's.
import { Manifold, union, hull, prism, place, circle, box, gableRoof, writeLandmark } from './efteling-kit.mjs';
const BASE=-0.5, ORIGIN=[88259.9,467043.4], DEG=-29.4;
const AXIS=[Math.cos(DEG*Math.PI/180),Math.sin(DEG*Math.PI/180)];
const oct=[[-8.68,-3.52],[-3.74,-8.44],[4.03,-8.49],[8.94,-3.49],[8.9,3.81],[4.03,8.58],[-3.96,8.54],[-8.72,3.61]];
const ring=(r,z,n=64)=>circle([0,0],r,n).map(([x,y])=>[x,y,z]);
const p3=(p,z)=>p.map(([x,y])=>[x,y,z]);
// Torenplint en achthoekige schacht; bovenlijst is door 45° kraag gedragen.
const plinth=prism(oct,BASE,4.3);
const shaft=prism(oct,BASE,25.8);
const cornice=hull([...p3(oct,25.4),...ring(9.55,26.1)]);
const tank=prism(circle([0,0],9.55,64),26.05,28.45);
const roof=hull([...ring(9.55,28.4),...ring(1.9,30.35)]);
const lantern=prism(circle([0,0],1.9,8,Math.PI/8),29.7,32.3);
const lanternRoof=hull([...ring(1.9,32.3,8),[0,0,34.05]]);
// De vleugels zijn deel van hetzelfde BAG-pand. Afmetingen en dakvlakken zijn
// gebaseerd op de 3D-BAG dakvlakken, met vlakke onderkant onder maaiveld.
const west=union([box(-20.57,8.45,BASE,-3.96,18.08,4.45),place(gableRoof(16.61,9.63,4.4,7.0),{at:[-12.265,13.265,0]})]);
const south=union([box(-3.74,-17.87,BASE,4.05,-8.3,4.3),place(gableRoof(9.57,7.79,4.25,7.0),{deg:90,at:[.155,-13.085,0]})]);
let all=union([plinth,shaft,cornice,tank,roof,lantern,lanternRoof,west,south]);
// 0,3 m diepe nissen met schuin plafond, vier verdiepingen met vensterparen.
const cut=(r,t,w,z0,z1,d=.3)=>hull([[r-d,t-w/2,z0],[r+.3,t-w/2,z0],[r-d,t+w/2,z0],[r+.3,t+w/2,z0],[r-d,t-w/2,z1+.6],[r+.3,t-w/2,z1],[r-d,t+w/2,z1+.6],[r+.3,t+w/2,z1]]);
const cuts=[]; const planes=[0,45,90,135,180,225,270,315];
for(const a of planes)for(const z of [6.2,10.4,15.1,19.3])for(const t of [-.75,.75]) cuts.push(place(cut(a % 180 === 90 ? 8.5 : 8.8,t,.9,z,z+2.05,.48),{deg:a}));
// Nissen in de lage gevels, met steunloos schuin bovenvlak.
for(const x of [-17.5,-14.0,-10.5,-7.0]) cuts.push(place(cut(18.08,x,1.0,1.0,3.2,.35),{deg:90}));
for(const y of [-15.4,-12.3]) cuts.push(cut(4.05,y,1.0,1.0,3.0,.35));
// Toegang centraal in de westelijke gevel; andere kleine ornamenten zijn te fijn.
cuts.push(place(cut(8.8,0,2.0,0,2.5,.4),{deg:180}));
all=all.subtract(union(cuts));
await writeLandmark({slug:'watertoren-katwijk',base:BASE,nodes:[['building:watertoren-en-aanbouwen',all]],catalog:{name:'Watertoren Katwijk',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.3,groundSamplePoints:[[11,0],[-11,0],[0,-21],[0,21]],replacesBuildings:['NL.IMBAG.Pand.0537100000025991'],description:'Achthoekige watertoren met rond reservoir, tentdak en lantaarn, en beide lage aangebouwde vleugels. RD-oorsprong op torenas; X-as langs de westelijke vleugel.',realWorld:{groundNapM:6.897,ahnTopNapM:40.947,towerTopM:34.05,shaftWidthM:17.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0537100000025991','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/508787','https://commons.wikimedia.org/wiki/Category:Water_tower_in_Katwijk']}});

