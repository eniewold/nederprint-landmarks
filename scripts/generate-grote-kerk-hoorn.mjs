import {circle,prism,box,hull,ring3,union,place,gableRoof,writeLandmark} from './efteling-kit.mjs';
const BASE=-.5,O=[132880,517045.7],rot=5.7,parts=[];
// Twee elkaar doorsnijdende zadeldaken op de kruisvormige kerkromp.
parts.push(box(-29,-9.5,BASE,20,9.5,15.3),place(gableRoof(49,19,15.2,26.35),{at:[-4.5,0,0]}));
parts.push(box(-9.5,-19.1,BASE,9.5,19.1,15.3),place(gableRoof(38.2,19,15.2,26.35),{at:[0,0,0],deg:90}));
// Verlaagde oostelijke aanbouwen met eigen dak.
for(const y of [-12.2,12.2])parts.push(box(9,-15+12.2+y,BASE,17.5,-9.2+12.2+y,11.4),place(gableRoof(8.5,5.8,11.3,14.5),{at:[13.25,y,0]}));
// Vierkante ondertoren en achthoekige lantaarn met achtzijdige leien spits.
parts.push(box(-38.1,-4.7,BASE,-28.7,4.7,31.0));
parts.push(prism(circle([-33.4,0],4.75,8,Math.PI/8),30.9,41.4));
parts.push(hull([...ring3(circle([-33.4,0],4.75,8,Math.PI/8),41.3),...ring3(circle([-33.4,0],.45,8,Math.PI/8),61.4)]));
// Gevelpilasters en de ingangspartij op de westgevel.
for(const y of [-4.5,4.5])parts.push(box(-38.35,y-.5,BASE,-37.4,y+.5,29.5));
parts.push(box(-39,-2.5,BASE,-37.5,2.5,5.3),hull([[-39,-2.5,5.3],[-37.4,-2.5,5.3],[-39,2.5,5.3],[-37.4,2.5,5.3],[-39,0,7.2],[-37.4,0,7.2]]));
for(const side of [-1,1])for(const x of [-23,-18.3,-13.6,-8.9])parts.push(box(x-.45,side*9.25-.6,BASE,x+.45,side*9.25+.6,14.5));
for(const side of [-1,1])for(const y of [-14.5,-10,10,14.5])parts.push(box(side*9.25-.6,y-.45,BASE,side*9.25+.6,y+.45,14.5));
// Ronde kerkvensters als blinde nissen; gekoppelde steile top maakt printbaar.
const niche=(x,y,ang,w,z0,z1)=>{let p=hull([[0,-w/2,z0],[1,-w/2,z0],[0,w/2,z0],[1,w/2,z0],[0,-w/2,z1-w/2],[0,w/2,z1-w/2],[1,-w/2,z1-w/2],[1,w/2,z1-w/2],[0,0,z1],[1,0,z1]]);return place(p,{at:[x,y,0],deg:ang})};
const cuts=[];
for(const side of [-1,1])for(const x of [-25.2,-20.6,-15.9,-11.2])cuts.push(niche(x,side*9.15,side*90,2.1,3.5,11.7));
for(const side of [-1,1])for(const y of [-16.3,-12.1,12.1,16.3])if(side<0 || Math.abs(y)>15)cuts.push(niche(side*9.15,y,side>0?0:180,2.1,3.5,11.7));
for(const side of [-1,1]) {cuts.push(niche(-33.4,side*4.35,side*90,1.8,23,28.5));cuts.push(niche(-33.4,side*4.1,side*90,1.8,33.2,38.8));}
cuts.push(niche(-38.65,0,180,2.3,0,4.5),niche(-37.8,0,180,2.1,23,28.5),niche(-37.4,0,180,1.8,33.2,38.8));
for(const side of [-1,1])for(const x of [-3,0,3])cuts.push(niche(x,side*18.75,side*90,2.0,3.4,12.8));
for(const y of [-3,0,3])cuts.push(niche(19.65,y,0,2.0,3.4,12.8));
// Kleine daklichten van de verbouwing: ondiepe uitsparingen in de dakvlakken.
for(const x of [-26,-23.5,-21,-18.5,-16,-13.5,-11,12,14.5,17])for(const y of [-7,-4,4,7]) {const z=26.35-11.15*Math.abs(y)/9.5;cuts.push(box(x-.55,y-.5,z-.8,x+.55,y+.5,z+2));}
for(const y of [-16.5,-14,-11.5,11.5,14,16.5])for(const x of [-7,-4,4,7]) {const z=26.35-11.15*Math.abs(x)/9.5;cuts.push(box(x-.5,y-.55,z-.8,x+.5,y+.55,z+2));}
const body=place(union(parts).subtract(union(cuts)),{deg:rot});

await writeLandmark({slug:'grote-kerk-hoorn',base:BASE,nodes:[['building:kerk',body]],catalog:{name:'Grote Kerk Hoorn',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0405100000552184'],description:'Neorenaissancistische kruiskerk met vierkante toren, achtzijdige lantaarn en naaldspits.',realWorld:{groundNapM:.784,ahnTopNapM:62.178,modelHeightM:61.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0405100000552184','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/333542','https://commons.wikimedia.org/wiki/File:Hoorn_027.JPG']}});





