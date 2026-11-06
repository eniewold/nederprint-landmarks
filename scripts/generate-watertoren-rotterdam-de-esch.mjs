import { Manifold, hull, union, place, box, writeLandmark } from './efteling-kit.mjs';
const SLUG='watertoren-rotterdam-de-esch', BASE=-0.5, origin=[95327.85,436345.06];
const c=(r0,r1,z0,z1,n=64)=>Manifold.cylinder(z1-z0,r0,r1,n,false).translate([0,0,z0]);
const main=c(10.3,10.3,BASE,20.5);
// Twee bekledingen en kroonlijst op schuin oplopende onderzijde.
const baseBand=union([c(10.3,10.65,3.3,4.15),c(10.65,10.65,4.15,4.55)]);
const shoulder=union([c(10.3,10.8,19.5,20),c(10.8,10.8,20,20.7)]);
const reservoir=c(10.55,10.55,20.3,26.7);
const roof=c(10.55,3.4,26.7,32.4);
const lantern=c(2.4,2.4,32.2,38.6);
// Kromme bovenzijde als rotatievorm: een vloeiend silhouet, geen hoogteplakken.
const onion=Manifold.revolve([[0,38.5],[2.4,38.5],[2.75,39.6],[2.9,41],[2.7,42],[2.0,43],[0.9,43.6],[0.45,44.1],[0,44.1]],64);
const pinnacle=c(0.48,0.45,44.0,47.3,12);
const annex=box(8.5,-9,BASE,14.4,2.0,4.35);
// Nis met puntige bovenkant en radiaal sterk stijgend plafond om steun te vermijden.
const niche=(r,w,z0,z1,d=.4)=>hull([[r-d,-w/2,z0],[r-d,w/2,z0],[r+1,-w/2,z0],[r+1,w/2,z0],[r-d,-w/2,z1+0.7],[r-d,w/2,z1+0.7],[r-d,0,z1+0.7+w/2],[r+1,-w/2,z1+1.3],[r+1,w/2,z1+1.3],[r+1,0,z1+1.3+w/2]]);
const cuts=[];
// Gekoppelde vensters in boognissen van de drie woonverdiepingen.
for(let a=0;a<360;a+=30){ for(let z of [5.5,10.1,14.7]) cuts.push(place(niche(10.3,2.65,z,z+2.9),{deg:a})); cuts.push(place(niche(10.55,1.25,21.15,25.9),{deg:a})); }
// Lantaarn met openingen weergegeven als blinde nissen.
for(let a=0;a<360;a+=60) cuts.push(place(niche(2.4,1.1,33.1,37.2,.35),{deg:a}));
cuts.push(place(niche(10.3,2.1,0.1,3.6),{deg:270}));
const dormer=hull([[7.1,-1,27.0],[9.1,-1,27.0],[7.1,1,27.0],[9.1,1,27.0],[7.1,-1,29.5],[9.1,-1,29.5],[7.1,1,29.5],[9.1,1,29.5],[7.1,0,31.2],[9.1,0,31.2]]);
const dormers=Array.from({length:8},(_,i)=>place(dormer,{deg:i*45}));
const tower=union([main,baseBand,shoulder,reservoir,roof,lantern,onion,pinnacle,annex,...dormers]).subtract(union(cuts));
await writeLandmark({slug:SLUG,base:BASE,nodes:[['building:watertoren',tower]],catalog:{name:'Watertoren De Esch Rotterdam',origin,xAxis:[1,0],groundOffsetMetres:-0.3,groundSamplePoints:[[0,13],[-13,0],[0,-13]],replacesBuildings:['NL.IMBAG.Pand.0599100000758803'],description:'Ronde watertoren met vensternissen, reservoir, kegelkap en lantaarn. Hoogte van slanke top naar literatuur geschat.',realWorld:{heightM:47.3,groundNapM:2.593,diameterM:20.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000758803','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/32914','https://mylittledutchblog.com/2023/10/05/een-oude-watertoren-en-een-interessante-buurt/']}});




