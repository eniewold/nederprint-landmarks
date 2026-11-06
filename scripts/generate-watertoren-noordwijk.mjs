// Watertoren Noordwijk (1917): achthoekige schacht met uitzichtdek, koepel
// en aangebouwde traptoren. Hoogten en ligging uit BAG, AHN en foto's.
import { union,hull,prism,place,circle,dome,writeLandmark } from './efteling-kit.mjs';
const BASE=-.5,ORIGIN=[90086.6,473093.8],ANGLE=-30;
const AXIS=[Math.cos(ANGLE*Math.PI/180),Math.sin(ANGLE*Math.PI/180)];
const footprint=[[4.52,.04],[3.93,2.3],[-.07,4.58],[-2.25,3.91],[-4.54,-.08],[-4.01,-2.29],[-.02,-4.59],[2.23,-3.96]];
const stair=[[-4.3,.55],[-6.88,2.18],[-5.38,4.8],[-2.6,3.13]];
const ring=(r,z,n=32)=>circle([0,0],r,n,Math.PI/8).map(([x,y])=>[x,y,z]);
const body=prism(footprint,BASE,20.8);
// Uitstekende goot wordt op schaal met 45°-kraag aan de schacht bevestigd.
const eave=hull([...ring(3.6,18.5,8),...ring(5.2,20.8,8),...ring(5.2,21.2,8)]);
const cupola=dome([0,0],[[4.3,21.0],[4.2,21.5],[3.9,22.0],[3.2,22.7],[2.5,23.15],[1.5,23.55],[0.05,23.75]],32);
const stairs=prism(stair,BASE,17.7);
const stairRoof=hull([...stair.map(([x,y])=>[x,y,17.65]),[-4.8,2.7,19.0]]);
let all=union([body,eave,cupola,stairs,stairRoof]);
const cut=(r,t,w,z0,z1,d=.35)=>hull([[r-d,t-w/2,z0],[r+1.5,t-w/2,z0],[r-d,t+w/2,z0],[r+1.5,t+w/2,z0],[r-d,t-w/2,z1+2*d],[r+1.5,t-w/2,z1-3],[r-d,t+w/2,z1+2*d],[r+1.5,t+w/2,z1-3]]);
const cuts=[];
// De uitzichtopeningen zijn als blinde nissen weergegeven met printbare bovenzijde.
for(const a of [0,60,120,180,240,300]){
 cuts.push(place(cut(4.1,0,2.0,16.8,17.7,.35),{deg:a}));
 
 cuts.push(place(cut(4.1,0,1.0,2.5,4.0,.35),{deg:a}));
 cuts.push(place(cut(4.1,0,1.0,12.4,14.4,.35),{deg:a}));
}
// Op de traptoren staan verticale smalle vensters, samen vereenvoudigd.
for(const z of [3.5,7.5,11.5,15.2])cuts.push(place(cut(6.8,0,.9,z,z+1.5,.6),{deg:150}));

all=all.subtract(union(cuts));
await writeLandmark({slug:'watertoren-noordwijk',base:BASE,nodes:[['building:watertoren',all]],catalog:{name:'Watertoren Noordwijk',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.3,groundSamplePoints:[[6,0],[0,-6],[-7,0],[0,6]],replacesBuildings:['NL.IMBAG.Pand.0575100000024061'],description:'Achthoekige schacht, koepeldak, uitkijkgeleding en aangebouwde traptoren; maaiveld op de duinvoet van het gebouw.',realWorld:{groundNapM:19.007,ahnTopNapM:42.7536,modelTopM:23.75},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0575100000024061','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/511994','https://commons.wikimedia.org/wiki/Category:Watertower_Noordwijk']}});










