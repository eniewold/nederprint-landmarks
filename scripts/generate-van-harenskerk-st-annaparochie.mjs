import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// RD-as volgt de vrijwel oost-west lopende gevel; z ten opzichte van NAP +1,43 m.
const B=-0.5, origin=[173039.1,587847.7], axis=[1,0];
const oct=(x,y,a)=>[[x-a*.41421356,y-a],[x+a*.41421356,y-a],[x+a,y-a*.41421356],[x+a,y+a*.41421356],[x+a*.41421356,y+a],[x-a*.41421356,y+a],[x-a,y+a*.41421356],[x-a,y-a*.41421356]];
const rings=(c0,z0,c1,z1)=>hull([...c0.map(([x,y])=>[x,y,z0]),...c1.map(([x,y])=>[x,y,z1])]);
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const parts=[];
// Hoofdachtkant, BAG-contour 19,5 m tussen de vlakke gevels. Acht dakvlakken lopen naar de achthoekige stenen onderbouw van de lantaarn.
parts.push(prism(oct(0,0,9.72),B,9.25));
parts.push(rings(oct(0,0,9.72),9.23,oct(0,0,3.48),16.78));
// Bakstenen achthoek, omgang op schuine kraag, achthoekige klokkenlantaarn en laag koepeldak.
parts.push(prism(oct(0,0,3.48),16.65,19.73));
parts.push(rings(oct(0,0,3.48),19.65,oct(0,0,3.78),19.95));
parts.push(prism(oct(0,0,3.78),19.93,20.16));
parts.push(prism(oct(0,0,3.13),20.10,24.23));
parts.push(rings(oct(0,0,3.13),24.2,oct(0,0,1.55),25.35));
parts.push(rings(oct(0,0,1.55),25.33,oct(0,0,.45),25.85));
parts.push(prism(oct(0,0,.45),25.8,26.65));
// De Van Harenskapel (1686): kleinere achtkant tegen de noordwestgevel met eigen tentdak.
parts.push(prism(oct(-2.55,11.67,2.43),B,4.85));
parts.push(rings(oct(-2.55,11.67,2.43),4.8,oct(-2.55,11.67,.12),8.95));
// Klein portaal aan de noordzijde en twee ingangen op de zuidoost- en zuidwestfacet.
parts.push(box(1.47,9.4,3.35,11.43,B,4.0));
const doorway=(ang)=>{
 const n=[Math.cos(ang),Math.sin(ang)],t=[-n[1],n[0]], pt=(r,s)=>[n[0]*r+t[0]*s,n[1]*r+t[1]*s];
 const poly=[pt(9.55,-1.28),pt(11.16,-1.28),pt(11.16,1.28),pt(9.55,1.28)];
 const top=[pt(9.55,-1.28),pt(10.45,-1.28),pt(10.45,1.28),pt(9.55,1.28)];
 parts.push(prism(poly,B,3.2),rings(poly,3.17,top,3.9));
};
doorway(-3*Math.PI/4); doorway(-Math.PI/4);
// Lisenen op de acht hoeken: beperkte reliëfbreedte zonder vrije overhang.
for(const [x,y] of oct(0,0,9.72)) parts.push(box(x-.38,y-.38,x+.38,y+.38,B,9.25));
let all=union(parts);
// Zichtbare vensters als spitse blinde nissen, symmetrisch per gevel; noordzijde deels bedekt door de grafkapel.
const cuts=[];
const niche=(a,r,w,z0,z1,depth=.36)=>{
 const n=[Math.cos(a),Math.sin(a)],t=[-n[1],n[0]],point=(d,s,z)=>[n[0]*d+t[0]*s,n[1]*d+t[1]*s,z];
 const pts=[]; for(const d of [r-depth,r+.12]) for(const [s,z] of [[-w/2,z0],[w/2,z0],[-w/2,z1-w*.45],[w/2,z1-w*.45],[0,z1]]) pts.push(point(d,s,z));
 return hull(pts);
};
for(let k=0;k<8;k++) cuts.push(niche(k*Math.PI/4,9.72,2.05,3.65,7.9));
// Drie toegangen en wijzerplaat op de zuidelijke lantaarnonderbouw.
for(const a of [-Math.PI/2,-Math.PI/4,-3*Math.PI/4])cuts.push(niche(a,a===-Math.PI/2?9.72:11.16,1.35,0,2.55));
for(let k=0;k<8;k++)cuts.push(niche(k*Math.PI/4,3.13,1.35,20.7,23.55));
cuts.push(niche(-Math.PI/2,3.48,1.0,18.05,19.15));
all=all.subtract(union(cuts));
await writeLandmark({slug:'van-harenskerk-st-annaparochie',base:B,nodes:[['building:kerk',all]],catalog:{name:'Van Harenskerk St.-Annaparochie',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-11,-9],[0,-11],[11,-9],[11,7],[0,14],[-11,7]],replacesBuildings:['NL.IMBAG.Pand.0063100000004179'],description:'Achtzijdige centraalbouw met achtvlaks tentdak, bakstenen onderbouw en achthoekige klokkenlantaarn met koepeldak; aan de noordzijde de achtkantige Van Harenskapel en drie ingangen in de zuidzijde, met blinde spitsboogvensters voor 1:1000.',realWorld:{groundNapM:1.431,eavesNapM:10.68,towerTopM:26.65,ahnMaxNapM:28.78},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0063100000004179','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/9495','https://commons.wikimedia.org/wiki/Category:Van_Harenskerk_(Sint_Annaparochie)','https://aldefrysketsjerken.nl/annaparochie']}});
