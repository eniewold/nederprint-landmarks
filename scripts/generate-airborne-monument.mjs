// De Naald in Oosterbeek. BGT-punt, AHN DSM/DTM 0,5 m en RCE-foto's.
// Bouw uit doorlopende vlakken en aangehechte bouwdelen, geen hoogtelagen.
import {Manifold,box,hull,ring3,rect,circle,prism,union,writeLandmark} from './efteling-kit.mjs';
const ORIGIN=[185506.886,444579.997],AXIS=[.97437,-.22495];
const HEIGHT=15.77,CROWN=10.77;
const tapered=(a,b,z0,z1)=>hull([...ring3(rect(-a,-a,a,a),z0),...ring3(rect(-b,-b,b,b),z1)]);
// Ortho: vierkante voet circa 12 m, langs de 13 graden gedraaide armen.
// De kleine echte traptreden worden een doorlopende afgeschuinde voet.
const platform=tapered(6.15,5.65,0,.7);
const arms=[];for(const deg of [0,90,180,270]){
 arms.push(union([box(.75,-.5,.35,5.55,.5,1.7),box(4.45,-.55,.35,5.65,.55,1.8)]).rotate([0,0,deg]));
}
// Licht gebogen basispilasters zijn omwentelingsvormen, aangesloten op de kern.
const shaft=tapered(.88,.77,.48,CROWN+.08),ribs=[];
for(const x of [-.68,.68])for(const y of [-.68,.68]){
 const prof=[[0,.48],[.48,.48],[.48,1.65],[.35,1.95],[.3,3.4],[.3,CROWN+.2],[0,CROWN+.2]];
 ribs.push(Manifold.revolve(prof,16).translate([x,y,0]));
}
// Natuurstenen reliëfvlakken en schuine kragen; geen vrijhangende lijsten.
const relief=[];for(const deg of [0,90,180,270]){
 relief.push(box(-.6,-1.05,.8,.6,-.72,2.9).rotate([0,0,deg]));
 relief.push(hull([[-.7,-.75,3.05],[.7,-.75,3.05],[-.7,-1.03,3.35],[.7,-1.03,3.35],[-.7,-.72,3.48],[.7,-.72,3.48]]).rotate([0,0,deg]));
 relief.push(box(-.38,-.88,CROWN+.18,.38,-.7,CROWN+1.05).rotate([0,0,deg]));
}
// Vijf figuren, schematisch en met minimaal 0,9 m dragende doorsnede.
// De vier wachters liggen tegen de zuil; ledematen en handen zijn reliëf.
const crown=tapered(.77,.68,CROWN-.03,CROWN+2.4),figures=[];
const sphere=(x,y,z,rx,ry,rz)=>Manifold.sphere(1,16).scale([rx,ry,rz]).translate([x,y,z]);
for(const x of [-.67,.67])for(const y of [-.67,.67]){
 figures.push(union([
  prism(circle([x,y],.45,16),CROWN-.05,CROWN+1.45),
  hull([...ring3(circle([x,y],.45,16),CROWN+1.2),...ring3(circle([x,y],.49,16),CROWN+2.15)]),
  sphere(x,y,CROWN+2.5,.46,.46,.48),
 ]));
}
const central=union([tapered(.7,.5,CROWN+2.1,CROWN+4.15),sphere(0,0,HEIGHT-.52,.48,.48,.52)]);
// Duif in de armen: compact aangehecht silhouet, vleugel met oplopende onderkant.
const dove=hull([[-.4,-.45,14.0],[.4,-.45,14.0],[-.4,-1,14.55],[.4,-1,14.55],[-.35,-.5,15.05],[.35,-.5,15.05]]);
const whole=union([platform,...arms,shaft,...ribs,...relief,crown,...figures,central,dove]);
if(whole.status()!=='NoError'||whole.decompose().length!==1)throw Error('Gesloten samenhang ontbreekt');
await writeLandmark({slug:'airborne-monument',base:0,nodes:[['building:voetarmen-zuil-vijf-figuren',whole]],catalog:{name:'Airborne Monument Oosterbeek (De Naald)',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.04,groundSamplePoints:[[-8,0],[8,0],[0,-8],[0,8]],description:'De Naald tegenover Hartenstein: vier bakstenen voetarmen, vier hoekribben en vijf aangehechte figuren. Oorsprong BGT-kunstobject; x-as langs de gedraaide voet.',realWorld:{heightM:HEIGHT,groundNapM:55.52,crownHeightM:5,baseSizeM:12.3,estimatedShaftWidthM:1.76,estimatedArmWidthM:1,minimumFigureDiameterM:.9,estimatedReliefDepthM:.33},sources:['https://www.4en5mei.nl/oorlogsmonumenten/zoeken/323/oosterbeek-airborne-monument','https://nl.wikipedia.org/wiki/Airborne-monument_(Oosterbeek)','https://commons.wikimedia.org/wiki/Category:Airborne_Monument,_Oosterbeek','https://api.pdok.nl/lv/bgt/ogc/v1/collections/straatmeubilair/items','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});


