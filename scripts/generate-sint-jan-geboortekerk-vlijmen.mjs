import {circle,rect,prism,box,hull,ring3,union,place,gableRoof,writeLandmark} from './efteling-kit.mjs';
const BASE=-.5,O=[143679.2,412047],rot=-.65;
const parts=[];
// Het middenschip en de zijbeuken zijn doorlopende bouwdelen met eigen dakvlakken.
parts.push(box(-5,-26,BASE,5,29,18.1),place(gableRoof(55,10,18,25.65),{at:[0,1.5,0],deg:90}));
for(const side of [-1,1]) {const x=side*8.05; parts.push(box(x-3.1,-25,BASE,x+3.1,29,10.9),place(gableRoof(54,6.2,10.8,15.35),{at:[x,2,0],deg:90}));}
// Dwarsschip met twee topgevels; koor sluit vijfzijdig.
parts.push(box(-15.9,-10.1,BASE,15.9,-.8,18.2),place(gableRoof(31.8,9.3,18.1,25.65),{at:[0,-5.45,0]}));
const apse=[[-11.1,-25],[-10.5,-27.5],[-6.2,-32],[-1,-34],[1,-34],[6.2,-32],[10.5,-27.5],[11.1,-25]];
parts.push(prism(apse,BASE,10.8),hull([...ring3(apse,10.7),[0,-24,19.5],[0,-29,16.5]]));
parts.push(box(-5,-29,BASE,5,-23,18),hull([...ring3([[-5,-29],[0,-32.5],[5,-29],[5,-22],[-5,-22]],18),[0,-24,25.65],[0,-28,25.65]]));
// Sacristie aan oostzijde; zadeldak is een afzonderlijk bouwdeel.
parts.push(box(10.5,-16.2,BASE,17.1,-10,8),place(gableRoof(6.4,6.6,7.9,11.4),{at:[13.8,-13.1,0],deg:90}));
// Westtoren met vier geveltoppen en achtvlakkige naaldspits.
parts.push(box(-5.3,28.6,BASE,5.3,38.3,37.1));
parts.push(place(gableRoof(9.7,10.6,37,42),{at:[0,33.45,0],deg:90}),place(gableRoof(10.6,9.7,37,42),{at:[0,33.45,0]}));
parts.push(hull([...ring3(circle([0,33.45],4.65,8,Math.PI/8),38.1),...ring3(circle([0,33.45],.45,8,Math.PI/8),68.55)]));
// Torensteunberen en ritmische steunberen langs de zijbeuken.
for(const x of [-5.2,5.2])for(const y of [29,37.7])parts.push(hull([[x-.65,y-.65,BASE],[x+.65,y-.65,BASE],[x-.65,y+.65,BASE],[x+.65,y+.65,BASE],[x-.55,y-.55,31],[x+.55,y-.55,31],[x-.55,y+.55,31],[x+.55,y+.55,31],[x,y,32.2]]));
for(const x of [-11.3,11.3])for(const y of [2.6,9,15.4,21.8,28])parts.push(hull([[x-.65,y-.55,BASE],[x+.65,y-.55,BASE],[x-.65,y+.55,BASE],[x+.65,y+.55,BASE],[x-.48,y-.48,10],[x+.48,y-.48,10],[x-.48,y+.48,10],[x+.48,y+.48,10],[x,y,11.1]]));
// Vieringtorentje: vierkant voetstuk en naald boven de nok.
parts.push(box(-1.1,-6.5,24.4,1.1,-4.3,30.2),hull([...ring3(circle([0,-5.4],1.45,8,Math.PI/8),30),...ring3(circle([0,-5.4],.45,8,Math.PI/8),36)]));
// Kleine dakkapellen steken aan beide zijden uit het middenschip.
for(const x of [-2.8,2.8])for(const y of [5,13,21])parts.push(box(x-.65,y-.6,20.6,x+.65,y+.6,22.6),place(gableRoof(1.3,1.2,22.5,23.2),{at:[x,y,0]}));
for(const [x,y] of [[-10.4,-27.5],[-6.2,-32],[-1,-34],[1,-34],[6.2,-32],[10.4,-27.5]]) parts.push(hull([[x-.5,y-.5,BASE],[x+.5,y-.5,BASE],[x-.5,y+.5,BASE],[x+.5,y+.5,BASE],[x-.45,y-.45,9.4],[x+.45,y-.45,9.4],[x-.45,y+.45,9.4],[x+.45,y+.45,9.4],[x,y,10.4]]));
// Spitsboognissen, ondiep en zonder vrije bovenvlakken.
const niche=(x,y,ang,w,z0,z1)=>{let p=hull([[0,-w/2,z0],[1,-w/2,z0],[0,w/2,z0],[1,w/2,z0],[0,-w/2,z1-w/2],[0,w/2,z1-w/2],[1,-w/2,z1-w/2],[1,w/2,z1-w/2],[0,0,z1],[1,0,z1]]);return place(p,{at:[x,y,0],deg:ang})};
const cuts=[];
for(const side of [-1,1])for(const y of [5.7,12.1,18.5,24.9])cuts.push(niche(side*10.75,y,side>0?0:180,1.7,3,8.4));
for(const side of [-1,1])for(const y of [5.7,12.1,18.5,24.9])cuts.push(niche(side*4.65,y,side>0?0:180,1.55,15.2,19));
for(const side of [-1,1]){cuts.push(niche(side*4.95,33.4,side>0?0:180,2,27.5,34));cuts.push(niche(side*4.95,33.4,side>0?0:180,1.6,18.5,24));}
cuts.push(niche(0,37.95,90,2.7,0,5));cuts.push(niche(0,37.95,90,2.5,8,15.5));cuts.push(niche(0,37.95,90,2,27.5,34));
cuts.push(niche(-3.1,-30.45,-130,1.5,12.4,17.2),niche(3.1,-30.45,-50,1.5,12.4,17.2),niche(-8.1,-29.6,-130,1.5,3,8),niche(8.1,-29.6,-50,1.5,3,8),niche(0,-33.6,-90,1.5,3,8));
const body=place(union(parts).subtract(union(cuts)),{deg:rot});
await writeLandmark({slug:'sint-jan-geboortekerk-vlijmen',base:BASE,nodes:[['building:kerk',body]],catalog:{name:'Sint-Jan Geboortekerk Vlijmen',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0797100000009892'],description:'Neogotische kruisbasiliek met westtoren, vieringtorentje, zijbeuken en vijfzijdig koor.',realWorld:{groundNapM:4.073,ahnTopNapM:72.606,modelHeightM:68.55,publishedTowerHeightM:71},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0797100000009892','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/37871','https://commons.wikimedia.org/wiki/File:Julianastraat_44,_Vlijmen.jpg']}});


