// Vier geledingen, acht steunberen en een lichtopbouw; geen gestapelde AHN-plakken.
import {box,prism,rect,circle,hull,ring3,dome,place,union,writeLandmark} from './efteling-kit.mjs';
const slug='westkapelle-hoog',base=-.6,origin=[20387.1,395149.14],xAxis=[.99124,-.13208];
const xmin=-4.725,xmax=4.725,ymin=-4.775,ymax=4.775;
let masonry=box(xmin,ymin,base,xmax,ymax,38);
const pointed=(w,h,z,r,depth=.35)=>prism([[-w/2,z],[w/2,z],[w/2,z+h-w/2],[0,z+h],[-w/2,z+h-w/2]],0,depth+4).rotate([90,0,0]).translate([0,-r+depth,0]);
const cuts=[];
// Westdeur; overige openingen blijven blind om een dakbrug op 1:1000 te vermijden.
cuts.push(place(pointed(2.6,5.5,0,4.725,.4),{deg:-90}));
for(const deg of [0,90,180,270]){
 const r=deg%180===0?4.775:4.725;
 for(const [z,h] of [[6.2,5.9],[13.3,7.4],[22.5,7],[30.6,6.4]]){
   for(const x of [-1.25,1.25]) cuts.push(place(pointed(1.45,h,z,r).translate([x,0,0]),{deg}));
 }
}
// BAG: acht haaks tegen de gevel geplaatste steunberen. Elk eigen profiel loopt
// over de volle hoogte; alleen de bouwkundig zichtbare versnijdingen springen terug.
const buttresses=[];
const buttress=()=>prism([[-.1,base],[2.25,base],[2.25,12],[1.8,13],[1.8,21],[1.35,22],[1.35,29],[.85,30],[.85,35.7],[-.1,36.5]],0,1.85).rotate([90,0,0]).translate([0,.925,0]);
for(const x of [-3.25,3.75])for(const side of [-1,1])buttresses.push(place(buttress(),{at:[x,side*4.65,0],deg:side*90}));
for(const y of [-3.65,3.75])for(const side of [-1,1])buttresses.push(place(buttress(),{at:[side*4.65,y,0],deg:side===1?0:180}));
const belts=[12.6,21.9,30.2,37.7].map(z=>box(xmin-.22,ymin-.22,z,xmax+.22,ymax+.22,z+.3));
const deck=box(-5.1,-5.1,37.9,5.1,5.1,38.6).subtract(box(-4.2,-4.2,38.15,4.2,4.2,39.5));
const frustum=(r0,r1,z0,z1)=>hull([...ring3(circle([0,0],r0,64),z0),...ring3(circle([0,0],r1,64),z1)]);
let red=prism(circle([0,0],2.85,64),37.8,46.1);
const panels=[];for(let k=0;k<8;k++)panels.push(place(box(-.8,-3,43.9,.8,-2.48,45.6),{deg:k*45}));
red=red.subtract(union(panels));
const gallery=union([frustum(2.85,3.75,42.8,43.8),prism(circle([0,0],3.75,64),43.8,44.7).subtract(prism(circle([0,0],2.85,64),44,45))]);
let glass=prism(circle([0,0],2.35,64),46,49.1);
const glassCuts=[];for(let k=0;k<12;k++)glassCuts.push(place(box(-.43,-2.55,46.5,.43,-2.02,48.85),{deg:k*30}));
glass=glass.subtract(union(glassCuts));
const roof=dome([0,0],[[2.5,49],[2.5,49.25],[2.2,49.75],[1.5,50.35],[.55,50.75],[.45,50.8]],64);
const ball=dome([0,0],[[.45,50.7],[.63,51],[.63,51.25],[.45,51.5]],32);
const finial=prism(circle([0,0],.45,16),51.3,51.7);
const church=union([masonry,...buttresses,...belts,deck]).subtract(union(cuts));
const joined=union([church,red,gallery,glass,roof,ball,finial]);
// Overlappende beren kunnen de buitenste blinde nissen afsluiten: verwijder
// zulke ingesloten negatieve holtes, die nooit zichtbaar reliëf zijn.
const tower=union(joined.decompose().filter(s=>s.volume()>0));
await writeLandmark({slug,base,nodes:[['building:kerktoren met Hoge Licht',tower]],catalog:{
 name:'Westkapelle Hoog',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-8,0],[8,0],[0,-8],[0,8]],replacesBuildings:['NL.IMBAG.Pand.0717100000010360'],
 description:'Bakstenen kerktoren met vier geledingen, acht versnijdende steunberen, blinde spitsboognissen en westdeur; ronde ijzeren opbouw, omgang, lichthuis en koepel. +X is vrijwel oost, onderkant 0,6 m onder maaiveld.',
 realWorld:{maaiveldNapM:1.6,kerktorenHoogteM:38,totaleHoogteM:51.7,rompBreedteM:9.45,rompDiepteM:9.55,schattingen:['geledinghoogtes en steunbeerprofielen uit schuine foto’s','blind reliëf 0,25–0,4 m','afmetingen lichtopbouw en koepel uit AHN en foto’s','hekwerken en bekroning verdikt tot 0,9 m']},
 sources:['PDOK BAG 0717100000010360; AHN4 DSM/DTM 0,5 m bbox 20300,395080,20440,395220; actuele orthoHR; 2026-10-08','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/38855','https://www.rijkswaterstaat.nl/over-ons/onze-organisatie/onze-historie/onze-monumenten/vuurtoren-hoge-licht','https://commons.wikimedia.org/wiki/File:Lighthouse_Westkapelle_Hoog_R01.jpg','https://commons.wikimedia.org/wiki/File:Lighthouse_Westkapelle_Hoog_R03.jpg']
}});
