// Schreierstoren, Amsterdam: BAG-contour, AHN-DSM/DTM 0,5 m en 3D BAG LoD2.2.
// D-vormige bakstenen toren, achtzijdige opbouw en tentdak, aangebouwd huis en terrasgebouw.
// Vaste invoer in meters; profielvlakken en benoemde bouwdelen, geen hoogteplakken.
import {Manifold,box,prism,rect,circle,hull,ring3,union,hipRoof,writeLandmark} from './efteling-kit.mjs';
const BASE=-2.4,GROUND_NAP=2.5;
const at=n=>n-GROUND_NAP;
const ORIGIN=[121976.9943,487726.1361],AXIS=[.93049724,-.36629891];
// PDOK BAG 0363100012182530: cirkelpassing op de ronde waterzijde, vlakke stadszijde u=-2,954.
const BODY=[[-2.954,-4.4],[-2.954,5.279],[-2.436,5.527],[-1.859,5.689],[-1.272,5.804],[-.676,5.871],[-.077,5.89],[.839,5.825],[1.569,5.69],[2.26,5.49],[2.942,5.195],[3.601,4.792],[4.323,4.166],[4.957,3.364],[5.438,2.422],[5.733,1.351],[5.8,.694],[5.755,-.228],[5.673,-.683],[5.3,-2.082],[5.253,-2.409],[3.256,-3.451],[2.892,-5.197],[.518,-5.312],[-1.95,-5.434]];
const ANNEX=[[-2.954,-4.359],[-2.954,-9.749],[-1.114,-9.632],[4.717,-9.923],[4.556,-6.995],[3.937,-5.145],[2.892,-5.197],[.518,-5.312],[-1.95,-5.434]];
const TERRACE=[[-2.954,-9.749],[-1.443,-16.077],[6.805,-16.682],[6.864,-10.074],[7.532,-10.096],[7.386,-1.812],[6.288,-1.87],[5.303,-2.082],[5.253,-2.409],[4.717,-9.923]];
const TOP=[[-2.954,-4.3],[-2.954,5.279],[.38,6.04],[3.17,5.2],[5.5,2.78],[6.04,-.1],[4.85,-3.6],[1.1,-5.54]];
const ROOF=circle([1.0,.5],4.65,8,Math.PI/8).map(([x,y])=>[Math.max(-2.954,x),y]);
let tower=union([prism(BODY,BASE,at(11.12)),hull([...ring3(BODY,at(11.12)),...ring3(TOP,at(11.82))]),prism(TOP,at(11.82),at(14.39)),hull([...ring3(ROOF,at(14.385)),[.87,.84,at(22.037)]]),Manifold.cylinder(.9,.46,.46,8).translate([.87,.84,at(21.77)])]);
// Blinde ramen en dichtgezette schietgaten: 0,35 m diep, aantallen/hoogtes uit schuine Commons-foto's.
const cuts=[];
for(const z of [3.8,7.35])for(const deg of[-18,70,130]){
 const a=deg*Math.PI/180;cuts.push(box(5.35,-.85,z,6.8,.85,z+2.1).rotate([0,0,deg]));
}
for(const deg of[-22,22,66,110,148]){
 cuts.push(box(5.32,-.45,at(12.15),6.8,.45,at(13.62)).rotate([0,0,deg]));
}
for(const y of [-2.0,2.7])cuts.push(box(-3.5,y-.8,6.5,-2.6,y+.8,8.6)); cuts.push(box(-3.5,-2.8,.2,-2.6,-1.2,2.7),box(-3.5,-2.8,3.1,-2.6,-1.2,5.4));
for(const y of[-3.7,-2,-.3,1.4,3.1,4.5])cuts.push(box(-3.5,y-.45,at(12.1),-2.6,y+.45,at(13.55))); for(let k=0;k<17;k++)cuts.push(Manifold.cylinder(1,.25,.25,12).rotate([0,90,0]).translate([-3.5,-4+k*.55,at(11.46)]));
// Boogfries als blinde boogjes op de schuine, dragende kraag (geen losse consoles).
for(let k=0;k<17;k++){const deg=-45+k*9.5,a=deg*Math.PI/180;cuts.push(Manifold.cylinder(2,.33,.33,16).rotate([0,90,0]).rotate([0,0,deg]).translate([5.35*Math.cos(a),5.35*Math.sin(a),at(11.46)]));}
const dormer=hull([[3.55,1.0,at(14.2)],[4.8,1.0,at(14.2)],[4.8,2.1,at(14.2)],[3.55,2.1,at(14.2)],[3.8,1.55,at(16.12)],[4.8,1.55,at(16.12)]]);
tower=union([tower,dormer]).subtract(union(cuts));
// Aanbouw: AHN goot NAP +11,45 m, schildnok +12,825 m op v=-7,25.
const house=union([prism(ANNEX,BASE,at(11.44)),hipRoof(7.65,5.43,at(11.44)-.02,at(12.825),2.4).translate([.88,-7.253,0])]).subtract(union([box(-3.5,-8.5,1.45,-2.6,-6.9,3.65),box(4.3,-8.9,1.4,5.3,-7.3,3.55),box(4.3,-8.9,5,5.3,-7.3,7.1),box(3.82,-10.2,1.35,5.3,-9.45,3.55),box(3.82,-10.2,5.0,5.3,-9.45,7.2),box(.0,-10.2,1.35,1.5,-9.3,3.55),box(.0,-10.2,5.0,1.5,-9.3,7.2)]));
// Laag café-/terrasgebouw: maaiveld aan het water lager; vlakke voet, terras NAP +4,80.
let terrace=prism(TERRACE,-2.4,at(4.80));
for(const y of[-4.7,-7.8,-11.4,-14.5])terrace=terrace.subtract(box(6.37,y-.65,.35,8.2,y+.65,1.55));
// Bestaande balustrade als gesloten 0,9 m rand met blinde panelen, steviger dan de echte spijlen.
terrace=union([terrace,box(-1.443,-16.08,at(4.6),6.805,-15.18,at(5.72)),box(6.35,-15.4,at(4.5),7.25,-10.3,at(5.72))]);
// Verbinding overlapt de gedeelde BAG-naad met 0,15 m; blijft binnen het pand.
const joint=box(4.45,-9.85,0,4.85,-7.2,at(4.8));
// Buitentrap langs de aanbouw: gesloten wig onder de treden, geen vrije bordessen.
const stair=union(Array.from({length:9},(_,k)=>box(5.0,-9.2+k*.32,0,6.2,-8.86+k*.32,.3*(k+1))));
const all=union([tower,house,terrace,joint,stair]);
if(all.status()!=='NoError'||all.decompose().length!==1)throw Error('Model moet één verbonden gesloten lichaam zijn');
await writeLandmark({slug:'schreierstoren',base:BASE,nodes:[['building:schreierstoren',all]],catalog:{name:'Schreierstoren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.3,groundSamplePoints:[[-4,0],[-4,-5],[0,7]],replacesBuildings:['NL.IMBAG.Pand.0363100012182530'],description:'D-vormige verdedigingstoren met vlakke stadszijde u=-2,954, veelhoekige bovenbouw, achtzijdig tentdak, dakkapel, schilddak van de aanbouw en laag terrasgebouw; oorsprong in de BAG-cirkelpassing, +X naar de waterzijde (RD -21,49 graden), z=0 op NAP +2,5 m, ramen en fries als blinde nissen en balustrade verdikt.',realWorld:{groundNapM:GROUND_NAP,waterSideRadiusM:5.9516,corniceNapM:11.82,eaveNapM:14.385,roofApexNapM:22.037,finialNapM:22.67,annexRidgeNapM:12.825,terraceNapM:4.8},sources:['PDOK BAG pand 0363100012182530 / BGT pand EPSG:28992, geraadpleegd 11 oktober 2026','PDOK AHN DSM/DTM 0,5 m, WCS dsm_05m/dtm_05m','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012182530','https://www.amsterdam.nl/nieuws/achtergrond/stenen-schreierstoren/','https://arcam.nl/architectuur-gids/schreierstoren/','https://commons.wikimedia.org/wiki/Category:Schreierstoren']}});



