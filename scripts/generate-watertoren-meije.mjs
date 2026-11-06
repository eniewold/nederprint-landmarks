import { Manifold, hull, union, place, writeLandmark } from './efteling-kit.mjs';
const SLUG='watertoren-meije', BASE=-0.5;
const origin=[113964.66,459278.53], ground=-1.302;
// BAG-voet rond, doorsnede 11,85 m. AHN: dakrand NAP +44,94, top +56,48.
const shaftRadius=5.83, eave=46.24, top=57.78;
const cyl=(r0,r1,z0,z1,n=64)=>Manifold.cylinder(z1-z0,r0,r1,n,false).translate([0,0,z0]);
const shaft=cyl(shaftRadius,shaftRadius,BASE,eave);
// Dicht ondersteunde daklijst; bovenkant is een echt kegeldak, niet gestapelde ringen.
const rim=union([cyl(5.83,6.03,45.55,45.75),cyl(6.03,6.03,45.75,46.24)]);
const roof=cyl(6.03,0.02,eave,top);
// De gevelopeningen zijn blinde nissen met schuin plafond, daarom steunloos.
const niche=(r,w,z0,z1,d=0.35)=>hull([[r-d,-w/2,z0],[r-d,w/2,z0],[r+1,-w/2,z0],[r+1,w/2,z0],[r-d,-w/2,z1+d],[r-d,w/2,z1+d],[r+1,-w/2,z1-1.5],[r+1,w/2,z1-1.5]]);
const cuts=[];
for(let a=0;a<360;a+=30) cuts.push(place(niche(shaftRadius,0.95,43.3,44.7),{deg:a}));
for(const a of [30,90,150,210,270,330]) {cuts.push(place(niche(shaftRadius,0.95,31.3,33.3),{deg:a})); cuts.push(place(niche(shaftRadius,0.95,16.2,18.2),{deg:a+15}));}
cuts.push(place(niche(shaftRadius,1.4,0.1,2.6,0.4),{deg:270}));
const model=union([shaft,rim,roof]).subtract(union(cuts));
await writeLandmark({slug:SLUG,base:BASE,nodes:[['building:watertoren',model]],catalog:{name:'Watertoren Meije',origin,xAxis:[1,0],groundOffsetMetres:-0.3,groundSamplePoints:[[8,0],[-8,0],[0,-8]],replacesBuildings:['NL.IMBAG.Pand.0569100000015485'],description:'Ronde watertoren met kegelkap, kroonlijst en blinde nissen. Afmetingen en raamposities naar AHN, BAG en foto’s geschat.',realWorld:{heightM:top,groundNapM:ground,diameterM:11.86},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0569100000015485','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:Watertoren_(De_Meije).JPG','https://monumentenregister.cultureelerfgoed.nl/monumenten/525044']}});


