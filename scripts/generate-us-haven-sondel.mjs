import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// Sondel, BAG-contour in een stelsel langs de nok; +X wijst naar de voorgevel.
const B=-0.5, origin=[169178.5,542688.95], axis=[0.996187,0.087243];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,40); for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Driezijdige westelijke sluiting, lange muur en zadeldak, met schilden op het koor.
const nave=[[-10.86,1.36],[-10.79,-1.73],[-7.9,-4.17],[10.45,-4.17],[10.5,3.84],[-8.04,3.78]];
let p=[roofed(nave,[[0,1.0,10.12],[0,-1.0,9.79],[1.05,0,17.65]])];
// Vierkante, witte dakruiter staat op de oostgevel. 0,9m brede top is printbaar.
p.push(box(7.6,-1.18,9.65,0.88,B,12.20));
p.push(hull([[7.6,-1.18,12.15],[9.65,-1.18,12.15],[9.65,.88,12.15],[7.6,.88,12.15],[7.4,-1.38,12.35],[9.85,-1.38,12.35],[9.85,1.08,12.35],[7.4,1.08,12.35]]));
p.push(hull([[7.4,-1.38,12.34],[9.85,-1.38,12.34],[9.85,1.08,12.34],[7.4,1.08,12.34],[8.17,-.60,17.0],[9.07,-.60,17.0],[9.07,.30,17.0],[8.17,.30,17.0]]));
// Gevellisenen tussen de traveeën, direct op de muur en gedragen vanaf de voet.
for(const x of [-6.25,-1.85,2.75,7.0]) { p.push(box(x-.18,-4.43,x+.18,-4.10,B,6.2)); p.push(box(x-.18,3.77,x+.18,4.10,B,6.2)); }
let all=union(p);
// Rondbogige blinde nissen, 0,35 m diep. De top is een facettenboog.
const niche=(x,y,w,z0,z1,ang=0)=>{const r=w/2,z=z1-r,pts=[[-r,z0],[r,z0],[r,z],[r*.866,z+r*.5],[r*.5,z+r*.866],[0,z1],[-r*.5,z+r*.866],[-r*.866,z+r*.5],[-r,z]];return hull(pts.flatMap(([u,v])=>[[u,0,v],[u,.7,v]])).rotate([0,0,ang]).translate([x,y,0])};
const cuts=[];
// Vier brede vensters en een kleiner raam bij de ingang; twee oculi als schematische ondiepe nissen.
for(const x of [-8.4,-4.1,.45,4.75]){cuts.push(niche(x,-4.52,1.55,1.7,5.55));cuts.push(niche(x,3.49,1.55,1.7,5.55));}
cuts.push(niche(8.15,-4.52,1.0,1.7,3.5),niche(8.15,3.49,1.0,1.7,3.5));
for(const x of [-1.85,2.75]) cuts.push(niche(x,-4.52,.95,4.65,5.6),niche(x,3.49,.95,4.65,5.6));
// Vensters op de schuine koorsluiting.
cuts.push(niche(-9.58,-3.22,1.35,1.7,5.5,-40.17),niche(-9.22,2.30,1.35,1.7,5.5,40.6));
// Frontale hoofddeur en twee zijramen in de oostelijke topgevel.
cuts.push(niche(10.8,0,2.0,0,3.15,90),niche(10.8,-2.55,.95,1.2,2.9,90),niche(10.8,2.3,.95,1.2,2.9,90),niche(10.8,0,.9,7.0,8.5,90));
// Galmgaten: blinde nissen met voldoende dikte om op 1:1000 te dragen.
cuts.push(niche(8.62,-1.53,1.2,10.2,12.0),niche(8.62,.53,1.2,10.2,12.0),niche(7.95,-.15,1.2,10.2,12.0,90),niche(10.0,-.15,1.2,10.2,12.0,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'us-haven-sondel',base:B,nodes:[['building:kerk',all]],catalog:{name:'Us Haven Sondel',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-12,-6],[0,-6],[12,-6],[-12,6],[0,6],[12,6]],replacesBuildings:['NL.IMBAG.Pand.0653100000148978'],description:'Zaalkerk met driezijdig koor, langs zadeldak en vierkante dakruiter met ingesnoerde spits; vensters en galmgaten als blinde nissen.',realWorld:{groundNapM:4.713,ahnTopNapM:21.36,modelTopM:17.0},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0653100000148978','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/15935','https://commons.wikimedia.org/wiki/Category:De_Haven,_Sondel','https://pkn-ons.nl/kerkgebouwen.htm']}});


