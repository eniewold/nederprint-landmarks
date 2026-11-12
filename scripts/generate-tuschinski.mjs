// Tuschinski, Amsterdam: bouwdelen in stelsel langs de Reguliersbreestraat.
// Plan en dakmaten: PDOK BAG, AHN5 DSM 0,5m en 3D BAG; gevel uit foto's.
import {Manifold,prism,box,hull,union,dome,circle,writeLandmark} from './efteling-kit.mjs';
const O=[121440,486600], X=[.8746,-.4848], G=.754, BASE=-.5, z=n=>n-G;
const FOOT=[[.3,-26.3],[-9,-29.1],[-9.3,-28.3],[-11,-28.8],[-12.9,-23.2],[-10.8,-23.1],[-12.3,16.5],[-6.7,16.8],[-7.3,33.6],[-3.2,33.5],[7.3,34.5],[7.8,21.5],[13.4,21.4],[13.7,15.6],[19.7,16],[20.4,3.3],[19.4,3.3],[19.6,-1.3],[20.6,-1.3],[20.9,-7.5],[19.1,-7.7],[20,-12.7],[24,-24.2],[5.1,-29.6],[3.9,-25.9]];
const lowEast=[[10.4,11.2],[13.7,15.6],[19.7,16],[19.8,13.1],[20,11.2],[16.1,11.4]];
const lowRear=[[19,-16.5],[21.1,-15.8],[24,-24.2],[21.5,-24.9],[20.4,-21.8],[19,-20.5]];
const body=prism(FOOT,BASE,z(19.8)).subtract(prism(lowEast,z(16.35),z(20))).subtract(prism(lowRear,z(16.2),z(20)));
const front=box(-6.7,16.5,BASE,7.5,33.7,z(22.2)).intersect(prism(FOOT,BASE,z(23)));
const upperFront=box(-6.8,22.9,z(21.8),7.5,32.4,z(22.65));
// Achterste toneelgebouw: dakvlak helt naar beide lange gevels.
const stagePoly=[[-9,-29],[-11,-28.8],[-12.5,-23],[-8.8,-17.5],[17,-17],[19.4,-20.9],[21.5,-24.9],[5.1,-29.6],[3.9,-25.9],[.3,-26.3]];
const stage=hull([...stagePoly.map(([x,y])=>[x,y,BASE]),...stagePoly.map(([x,y])=>[x,y,z(25.75-Math.abs(y+22.3)*.20)])]).intersect(prism(FOOT,BASE,z(27)));
// Zaalkap: gemeten dwarse boog als doorsnede, geëxtrudeerd en op de gebogen
// kop begrensd. Geen horizontale hoogtelagen.
const section=[[-7.2,BASE],[17,BASE],[17,z(19.8)],[15,z(20.8)],[13,z(21.6)],[11,z(22.1)],[9,z(22.45)],[7,z(22.7)],[5,z(22.8)],[3,z(22.8)],[1,z(22.65)],[-1,z(22.35)],[-3,z(21.8)],[-5,z(21.1)],[-7.2,z(20)]];
const roofPlan=[[-7.2,-17.4],[-7.2,3.4],[-5.5,5.1],[-3.3,6.1],[-1,7.2],[3,8.2],[6.9,8.5],[10.5,7.3],[13.5,5.8],[16.4,4],[17,-17.1]];
const hall=Manifold.extrude([section],26).rotate([90,0,0]).translate([0,8.5,0]).intersect(prism(roofPlan,BASE,z(24)));
// Tweerichtingsdak op de lichtkoepel op de zaal; voet minimaal 0,9 m.
const skylight=hull([[3,-9.4,z(22.2)],[6.7,-9.4,z(22.2)],[6.7,-5.6,z(22.2)],[3,-5.6,z(22.2)],[4.85,-7.5,z(24.8)]]);
// De flankerende dakopbouw bij de tussenbouw en installaties: meten in
// AHN/3D BAG, met de omtrek afgeleid van de ortho.
const parts=[body,front,upperFront,stage,hall,skylight,
  box(-2.6,10.6,BASE,3.4,15.4,z(22.73)),
  box(16.1,8.6,BASE,19.9,11.3,z(23.2)),
  box(-6.2,17.1,BASE,7.35,23.2,z(22.35)),
  box(7.5,17,BASE,10.4,20.8,z(20.4)),
  box(11,3.8,BASE,12.6,5.4,z(22.8))
];
// Voorgevel: twee rechthoekige gemetselde torens met koperen koepels.
for(const x of [-5.15,5.45]){
 parts.push(box(x-1.9,29.4,BASE,x+1.9,33.95,z(24.5)));
 parts.push(dome([x,31.65],[[1.7,z(24.1)],[1.7,z(25.2)],[1.5,z(26.2)],[1.1,z(27.3)],[.65,z(28)]],16));
 // Lantaarn is in werkelijkheid open met fijne metalen spijlen; op 1:1000
 // als een gesloten achthoek van minimaal 0,9 m.
 parts.push(prism(circle([x,31.65],.52,8,Math.PI/8),z(27.8),z(30.2)));
 parts.push(hull([...circle([x,31.65],.52,8).map(([a,b])=>[a,b,z(30.1)]),[x,31.65,z(31.05)]]));
 // geveldammen/erkers zijn op foto zichtbaar en dragen tot op maaiveld.
 parts.push(box(x-1.12,33.65,BASE,x+1.12,34.05,z(21.7)));
}
// Erker midden boven entree en doorlopende pilasters; onderzijde 45 graden.
parts.push(box(-2.55,33.4,BASE,2.65,34.12,z(17.2)));
for (const x of [-3.35,3.45]) parts.push(box(x-.48,33.45,BASE,x+.48,34.08,z(21.2)));
// Nissen met vlakke diepte en schuine top worden als eenvoudig reliëf gesneden.
let solid=union(parts);
const cuts=[];
for (const x of [-5.15,5.45]) for(const [a,b] of [[2.1,5.5],[7,10.4],[12,15.3],[17,20.6]]){
 const w=.58; cuts.push(hull([[x-w,33.75,a],[x+w,33.75,a],[x-w,34.3,a],[x+w,34.3,a],[x-w,33.75,b-.6],[x+w,33.75,b-.6],[x-w,34.3,b-.6],[x+w,34.3,b-.6],[x,33.75,b],[x,34.3,b]]));
}
for(const x of [-1.5,0,1.5]) for(const [a,b] of [[6,9.3],[10,13.6]]) {
 const w=.48; cuts.push(hull([[x-w,33.86,a],[x+w,33.86,a],[x-w,34.4,a],[x+w,34.4,a],[x-w,33.86,b-.5],[x+w,33.86,b-.5],[x-w,34.4,b-.5],[x+w,34.4,b-.5],[x,33.86,b],[x,34.4,b]]));
}
// Drie vensters van de achtergevel aan de Reguliersdwarsstraat (foto
// Amsterdam Monumentenstad). Op 1:1000 ondiep en met printbare bovenzijde.
for (const t of [5.0,8.7,12.4]) {
 const x=5.1+t*.961,y=-29.6+t*.275;
 cuts.push(hull([[-.5,-.25,6],[.5,-.25,6],[-.5,.25,6],[.5,.25,6],[-.5,-.25,8.6],[.5,-.25,8.6],[-.5,.25,8.6],[.5,.25,8.6],[0,-.25,9.1],[0,.25,9.1]]).rotate([0,0,16]).translate([x,y,0]));
}
// Ingang als blinde nis; geen open platte overspanning.
cuts.push(hull([[-2,33.8,.4],[2,33.8,.4],[-2,34.4,.4],[2,34.4,.4],[-2,33.8,3],[2,33.8,3],[-2,34.4,3],[2,34.4,3],[0,33.8,5],[0,34.4,5]]));
solid=solid.subtract(union(cuts));
if(solid.status()!=='NoError'||solid.decompose().length!==1) throw Error('Tuschinski niet gesloten of verbonden');
await writeLandmark({slug:'tuschinski',base:BASE,nodes:[['building:theater',solid]],catalog:{name:'Koninklijk Theater Tuschinski',origin:O,xAxis:X,groundOffsetMetres:-.25,groundSamplePoints:[[-3,35],[5,35]],replacesBuildings:['NL.IMBAG.Pand.0363100012168188'],description:'Tuschinski met tweelingtorens, gevelerker, gebogen zaalkap en toneelgebouw. +Y wijst naar de Reguliersbreestraat.',realWorld:{groundNapM:G},sources:['PDOK AHN5 DSM 0,5m en actuele ortho, 10 november 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012168188','https://monumentenregister.cultureelerfgoed.nl/monumenten/4828','https://commons.wikimedia.org/wiki/File:Tuschinski_Theater_Amsterdam-msu-9124-.jpg','https://www.amsterdam-monumentenstad.nl/database/grachtenboek_objecten.php?id=5645']}});
