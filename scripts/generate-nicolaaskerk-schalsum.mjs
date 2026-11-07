import {union,hull,prism,rect,ring3,circle,writeLandmark} from './efteling-kit.mjs';
// Nicolaaskerk Schalsum: maten in m, eigen +x naar de halfronde oostelijke koorsluiting.
// BAG-contour/3D BAG dak; AHN-DSM, ortho en Commons-foto's voor toren en gevels.
const B=-0.55, origin=[167252.4,579129.5], axis=[0.99985,-0.0173];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,45);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalschip en afgerond koor met halfkegeldak; maaiveld NAP +2.71, goot +6.1 en nok +11.85.
const east=20.8, w=3.84, ridge=11.85, eave=6.1;
const apse=Array.from({length:13},(_,i)=>{const a=-Math.PI/2+i*Math.PI/12;return [east+w*Math.cos(a),w*Math.sin(a)]});
const p=[roofed(rect(2.15,-w,east,w),[[0,1.497,ridge],[0,-1.497,ridge]])];
p.push(prism([[east,0],...apse],B,eave),hull([...ring3(apse,eave),[east,0,ridge],[east-.12,0,ridge]]));
// Toren met achtzijdige spits. Maaiveld tot kroonlijst +15.35; hoogste DSM +24.34 boven maaiveld.
p.push(box(-2.6,-2.68,2.3,2.58,B,15.35));
const oct=circle([-.15,-.05],2.42,8,Math.PI/8); const tip=circle([-.15,-.05],.45,8,Math.PI/8);
p.push(hull([...ring3(oct,15.28),...ring3(tip,25.6)]));
// Twee steunberen aan de zuidgevel, als schuin afgedekte prisma's.
for(const x of [5.7,13.4]) p.push(hull([[x-.48,-3.7,B],[x+.48,-3.7,B],[x-.48,-4.75,B],[x+.48,-4.75,B],[x-.48,-3.7,5.5],[x+.48,-3.7,5.5],[x-.48,-4.75,4.45],[x+.48,-4.75,4.45]]));
let all=union(p);
// Nissen in gevels en galmgaten: 0.35 m diep; versimpelde spitse bogen blijven printbaar.
const niche=(x,y,w,z0,z1,axis='y')=>{const z=z1-w*.7;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,.7,z0],[w/2,.7,z0],[-w/2,.7,z],[w/2,.7,z],[0,.7,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
const cuts=[];
for(const x of [7.15,9.8,15.0,18.7]) cuts.push(niche(x,-4.18,1.2,1.35,5.1));
for(const x of [9.0,15.2]) cuts.push(niche(x,3.49,1.2,1.55,5.2));
cuts.push(niche(3.3,-4.18,1.1,0,2.1),niche(3.3,3.49,1.0,3.7,4.7));
for(const x of [-1.05,.75]) cuts.push(niche(x,-3.03,.95,12.65,14.65),niche(x,2.23,.95,12.65,14.65));
for(const y of [-1.0,.85]) cuts.push(niche(-2.25,y,.95,12.65,14.65,'x'));
cuts.push(niche(-2.25,0,1.15,1.0,4.0,'x'));
// Klokplaat aan de zuidzijde en deur in het zuidoostelijke koor.
cuts.push(box(-.9,-3.03,.6,-2.33,10.0,11.4));
cuts.push(niche(0,0,1.1,0,2.45).rotate([0,0,45]).translate([23.65,-3.05,0]));
all=all.subtract(union(cuts));
await writeLandmark({slug:'nicolaaskerk-schalsum',base:B,nodes:[['building:kerk',all]],catalog:{name:'Nicolaaskerk Schalsum',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-4,-4],[4,-6],[18,-6],[27,0],[19,6],[1,6]],replacesBuildings:['NL.IMBAG.Pand.0070100000324295'],description:'Middeleeuwse zaalkerk met halfronde koorsluiting onder een gekegeld dak, twee zuidelijke steunberen, spitse vensters en westtoren met achtzijdige naaldspits.',realWorld:{groundNapM:2.71,ridgeM:11.85,towerCrownM:15.35,ahnTopNapM:27.0528,modelTopM:25.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000324295','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/15867','https://commons.wikimedia.org/wiki/Category:Nicolaaskerk,_Schalsum','https://aldefrysketsjerken.nl/schalsum']}});

