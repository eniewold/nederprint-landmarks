// Ronde verdedigingstoren, stenen achtkant en twee houten klokkenverdiepingen.
import {box,prism,circle,hull,ring3,dome,place,union,writeLandmark} from './efteling-kit.mjs';
const slug='montelbaanstoren',base=-1.8,origin=[122206.3,487237.8],xAxis=[.97815,-.20791];
const phase=Math.PI/8,oct=(r,z0,z1)=>prism(circle([0,0],r,8,phase),z0,z1);
const frustum=(r0,r1,z0,z1,n=8)=>hull([...ring3(circle([0,0],r0,n,phase),z0),...ring3(circle([0,0],r1,n,phase),z1)]);
const point=(w,h,z,r,depth)=>prism([[-w/2,z],[w/2,z],[w/2,z+h-w*.65],[0,z+h],[-w/2,z+h-w*.65]],0,depth+1).rotate([90,0,0]).translate([0,-r+depth,0]);
const foot=prism(circle([0,0],5.75,16,phase),base,1.25);
let round=prism(circle([0,0],5.05,96),1.1,12.6);
const roundCuts=[];
for(const z of [2.2,5.8,9.3])for(const deg of [20,90,160,230,300])roundCuts.push(place(box(-.62,-5.3,z,.62,-4.67,z+1.8),{deg}));
roundCuts.push(place(point(1.8,3.3,0,5.05,.35),{deg:270}));
round=round.subtract(union(roundCuts));
let brick=oct(4.85,12.45,21.3);
const brickCuts=[];for(let k=0;k<8;k++)for(const [z,h] of [[13.4,3.0],[17.3,3.35]])brickCuts.push(place(point(1.55,h,z,4.85*Math.cos(phase),.35),{deg:k*45}));
brick=brick.subtract(union(brickCuts));
const brickBelts=[12.5,16.8,21.1].map(z=>oct(5.0,z,z+.22));
let clock=oct(3.78,21.65,25.55);
const discs=[];
for(const deg of [0,90,180,270]){
 const disc=prism(circle([0,23.65],1.25,48),0,.3).rotate([90,0,0]).translate([0,-3.35,0]);
 // De klokschijf overlapt het achtkant; wijzers vervallen op 1:1000.
 discs.push(place(disc,{deg}));
}
const clockBase=frustum(4.85,3.78,21.25,21.8),clockRoof=frustum(4.05,2.9,25.5,26.4);
const belfry=(r,z0,z1,w)=>{
 let body=oct(r,z0,z1);
 const cuts=[];for(let k=0;k<8;k++)cuts.push(place(point(w,z1-z0-1,z0+.5,r*Math.cos(phase),.38),{deg:k*45}));
 return body.subtract(union(cuts));
};
const lower=belfry(2.85,26.25,31.9,1.45);
const gallery=union([frustum(2.85,3.45,31.7,32.35),oct(3.45,32.35,33.3).subtract(oct(2.55,32.5,33.5))]);
const shoulders=frustum(3.3,1.7,33.1,34.1);
const upper=belfry(1.7,33.95,38.2,.95);
const cap=frustum(1.95,1.15,38.15,39.3);
const onion=dome([0,0],[[.75,39.2],[.6,39.55],[.95,40],[.88,40.6],[.45,41.2],[.45,41.5]],32);
const ball=dome([0,0],[[.45,41.4],[.55,41.7],[.55,41.95],[.45,42.2]],24);
const vane=union([prism(circle([0,0],.45,12),41.9,45),box(-1.2,-.45,43.35,1.2,.45,44.25),box(-.45,-.45,44.1,1.15,.45,45)]);
const joined=union([foot,round,brick,...brickBelts,clockBase,clock,...discs,clockRoof,lower,gallery,shoulders,upper,cap,onion,ball,vane]);
const tower=union(joined.decompose().filter(s=>s.volume()>0));
await writeLandmark({slug,base,nodes:[['building:verdedigingstoren met klokkenopbouw',tower]],catalog:{
 name:'Montelbaanstoren',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-6.5,-2],[-6.5,2],[-2,6.5],[2,6.5]],replacesBuildings:['NL.IMBAG.Pand.0363100012181906'],
 description:'Ronde bakstenen ondertoren op veelhoekige voet, stenen achtkant, vier uurwerken en twee versmallende houten klokkengeledingen met blinde boognissen, omgang en koepel. +X oostzuidoost, entree westzijde. Onderkant -1,8 m; hoogste dunne bekroning uit foto’s geschat.',
 realWorld:{maaiveldNapM:2,rondeRompTopM:12.6,stenenAchtkantTopM:21.3,houtenKapTopM:41.5,totaleHoogteGeschatM:45,literatuurHoogteM:48,schattingen:['windwijzer 45 m boven lokale voet: AHN mist de dunne hoogste delen; literatuur noemt 48 m zonder sluitend meetpunt','geledingen en koepelprofiel uit AHN/foto’s','open belforten als 0,38 m diepe blinde nissen','klokschijven en raamritme','windwijzer en balustrade minimaal 0,9 m breed']},
 sources:['PDOK BAG 0363100012181906; AHN4 DSM/DTM 0,5 m bbox 122150,487180,122260,487290; actuele orthoHR; 2026-10-08','https://monumentenregister.cultureelerfgoed.nl/monumenten/4025','https://www.amsterdam-monumentenstad.nl/database/grachtenboek_objecten.php?id=5391','https://commons.wikimedia.org/wiki/File:2024_Montelbaanstoren_gf99.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_ronde_bakstenen_toren_met_een_achtzijdige_houten_bovenbouw_en_bekroning,_gezien_vanaf_de_brug_-_Amsterdam_-_20408352_-_RCE.jpg']
}});
