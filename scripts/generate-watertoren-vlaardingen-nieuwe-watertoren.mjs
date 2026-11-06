import {union,hull,prism,place,circle,writeLandmark} from './efteling-kit.mjs';
const BASE=-.5, ORIGIN=[83629.94,436658.50];
const ring=(r,z)=>circle([0,0],r,48).map(([x,y])=>[x,y,z]);
const drum=prism(circle([0,0],7.16,48),BASE,35.03);
const top=prism(circle([0,0],2.20,32),35,38.13);
const cap=hull([...ring(2.2,38.0),...ring(2.4,38.2),...ring(2.4,38.4)]);
const stairFoot=[[6.0,-3.8],[8.18,-4.0],[8.94,-1.1],[6.0,-.2]];
const stair=prism(stairFoot,BASE,26.9);
let all=union([drum,top,cap,stair]);
// Verdiepte ramen met 45 graden bovenzijde; de gladde boventank blijft gesloten.
const cut=(r,t,w,z0,z1,d=.4)=>hull([[r-d,t-w/2,z0],[r+1,t-w/2,z0],[r-d,t+w/2,z0],[r+1,t+w/2,z0],[r-d,t-w/2,z1],[r+1,t-w/2,z1-1.4],[r-d,t+w/2,z1],[r+1,t+w/2,z1-1.4]]);
const cuts=[];
for(let a=0;a<360;a+=30){
 for(const [z0,z1] of [[3,5.5],[7.4,9.6],[11.3,13.5],[16.5,18.2],[20.1,21.8]]) cuts.push(place(cut(7.16,0,1.0,z0,z1),{deg:a}));

 cuts.push(place(cut(2.2,0,.9,35.4,37.2,.4),{deg:a}));
}
// Doorlopende vensterband met verzonken velden en smalle stijlen.
for(let a=15;a<=315;a+=15){
 const band=hull([[6.56,-.70,23.4],[8.16,-.70,23.4],[6.56,.70,23.4],[8.16,.70,23.4],[6.56,-.70,25.1],[8.16,-.70,23.5],[6.56,.70,25.1],[8.16,.70,23.5]]);
 cuts.push(place(band,{deg:a}));
}
all=all.subtract(union(cuts));
await writeLandmark({slug:'watertoren-vlaardingen-nieuwe-watertoren',base:BASE,nodes:[['building:watertoren',all]],catalog:{name:'Nieuwe watertoren Vlaardingen',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:-.3,groundSamplePoints:[[9,0],[-9,0],[0,9],[0,-9]],replacesBuildings:['NL.IMBAG.Pand.0622100000050967'],description:'Ronde bakstenen watertoren met gesloten boventank, vensterband en lage dakopbouw.',realWorld:{groundNapM:1.232,ahnTopNapM:39.407,modelTopM:38.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0622100000050967','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Nieuwe_watertoren_(Vlaardingen)']}});

