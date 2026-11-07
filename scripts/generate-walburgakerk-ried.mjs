import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// Plaatselijk assenstelsel: +x naar het koor en +y naar de noordkant.
const B=-0.6, origin=[168536.7,581859.4], axis=[0.9918,-0.1274];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,50); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const nave=[[1.97,-3.98],[20.06,-3.98],[23.07,-2.28],[23.02,2.05],[19.86,3.86],[1.97,3.86]];
const p=[roofed(nave,[[0,1.52,12.08],[0,-1.52,11.9],[-1.52,0,12.08+1.52*19.3]])];
// Klokkentoren en laag zadeldak met uitgesproken ingesnoerde naaldspits.
p.push(box(-2.87,-2.79,2.05,2.66,B,16.5));
// Schuine waterlijst onder de klokkenverdieping, rondom de toren.
p.push(hull([[-2.87,-2.79,11.55],[2.05,-2.79,11.55],[2.05,2.66,11.55],[-2.87,2.66,11.55],[-3.07,-2.99,11.75],[2.25,-2.99,11.75],[2.25,2.86,11.75],[-3.07,2.86,11.75],[-3.07,-2.99,11.85],[2.25,-2.99,11.85],[2.25,2.86,11.85],[-3.07,2.86,11.85]]));
p.push(hull([[-3.02,-2.94,16.35],[2.2,-2.94,16.35],[2.2,2.81,16.35],[-3.02,2.81,16.35],[-3.12,-3.04,16.5],[2.3,-3.04,16.5],[2.3,2.91,16.5],[-3.12,2.91,16.5]]));
p.push(hull([[-3.12,-3.04,16.48],[2.3,-3.04,16.48],[2.3,2.91,16.48],[-3.12,2.91,16.48],[-1.55,-1.2,18.15],[.72,-1.2,18.15],[.72,1.08,18.15],[-1.55,1.08,18.15]]));
p.push(hull([[-1.55,-1.2,18.1],[.72,-1.2,18.1],[.72,1.08,18.1],[-1.55,1.08,18.1],[-.86,-.52,28.6],[.04,-.52,28.6],[.04,.38,28.6],[-.86,.38,28.6]]));
// Lagere consistorie aan de noordzijde: twee delen met platte daken.
p.push(box(1.96,3.7,9.5,8.22,B,3.76),box(9.28,3.7,15.98,8.2,B,2.98));
let all=union(p);
// Blinde, spitse en rondbogige venster- en portaalnissen, 0,35 m diep.
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w*.7;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,.7,z0],[w/2,.7,z0],[-w/2,.7,z],[w/2,.7,z],[0,.7,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
const cuts=[];
for(const x of [5.6,8.8,12,15.2,18.4]) cuts.push(niche(x,-4.3,1.35,1.85,5.9));
cuts.push(niche(3.2,-4.3,1.1,0,2.6));
for(const x of [-1.35,.55]) cuts.push(niche(x,-3.14,1.0,12.8,15.7),niche(x,2.31,1.0,12.8,15.7));
for(const y of [-1.1,.9]) cuts.push(niche(-2.52,y,1.0,12.8,15.7,'x'),niche(2.4,y,1.0,12.8,15.7,'x'));
cuts.push(niche(-2.52,0,1.15,0,2.5,'x'));
cuts.push(niche(-.4,-3.14,1.1,10.0,11.1));
for(const x of [3.7,6.9,11.7,14.2]) cuts.push(niche(x,7.86,1.0,1.0,2.5));
all=all.subtract(union(cuts));
await writeLandmark({slug:'walburgakerk-ried',base:B,nodes:[['building:kerk',all]],catalog:{name:'Walburgakerk Ried',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-4,-4],[5,-5],[20,-5],[23,4],[16,9],[-4,4]],replacesBuildings:['NL.IMBAG.Pand.0070100000315736'],description:'Zaalkerk met driezijdige sluiting, schilddak, westtoren met ingesnoerde spits, spitsboogvensters aan de zuidzijde en noordelijke consistorie.',realWorld:{groundNapM:1.94,ahnTopNapM:30.535,modelTopM:28.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000315736','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/15865','https://commons.wikimedia.org/wiki/Category:Walburgakerk,_Ried','https://pkn.ried-skingen.nl/ried-walburgakerk/']}});
