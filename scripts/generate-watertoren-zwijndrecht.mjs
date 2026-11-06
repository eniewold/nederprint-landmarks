import {union,hull,prism,place,circle,dome,box,writeLandmark} from './efteling-kit.mjs';
const BASE=-.5,ORIGIN=[105026.85,425995.22];
const ring=(r,z)=>circle([0,0],r,48).map(([x,y])=>[x,y,z]);
// Ronde sokkel, conische schacht, draagkrans, cilindrisch reservoir en tentdak.
const base=prism(circle([0,0],4.8,48),BASE,4.2);
const shaft=hull([...ring(4.65,4.0),...ring(4.15,21.4)]);
const transition=hull([...ring(4.15,20.4),...ring(4.95,21.2),...ring(4.95,21.7)]);
const tank=prism(circle([0,0],4.95,48),21.5,29.0);
const glass=prism(circle([0,0],4.5,48),28.9,30.5);
const rim=hull([...ring(4.5,30.0),...ring(4.95,30.45),...ring(4.95,30.55)]);
const roof=hull([...ring(4.95,30.5),...ring(1.15,32.6)]);
// Open lantaarn is op printschaal samengevoegd tot een gesloten paviljoentje.
const lantern=prism(circle([0,0],1.15,12),32.5,34.4);
const lanternroof=hull([...ring(1.15,34.3),...ring(.5,34.5)]);
let all=union([base,shaft,transition,tank,glass,rim,roof,lantern,lanternroof]);
const cut=(r,w,z0,z1,d=.38)=>hull([[r-d,-w/2,z0],[r+1,-w/2,z0],[r-d,w/2,z0],[r+1,w/2,z0],[r-d,-w/2,z1],[r+1,-w/2,z1-1.4],[r-d,w/2,z1],[r+1,w/2,z1-1.4]]);
const cuts=[];for(let a=0;a<360;a+=45){for(const [r,w,z0,z1] of [[4.4,1.0,6,9],[4.2,1.0,12,16],[4.95,1.3,23,25],[4.95,.9,27,28]])cuts.push(place(cut(r,w,z0,z1),{deg:a}));}
all=all.subtract(union(cuts));
await writeLandmark({slug:'watertoren-zwijndrecht',base:BASE,nodes:[['building:watertoren',all]],catalog:{name:'Watertoren Zwijndrecht',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:-.3,groundSamplePoints:[[7,0],[-7,0],[0,7],[0,-7]],replacesBuildings:['NL.IMBAG.Pand.0642100000002511'],description:'Ronde watertoren met versmallende schacht, uitkragend reservoir, vernieuwd tentdak en glazen dakring.',realWorld:{groundNapM:3.703,ahnTopNapM:36.258,modelTopM:34.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0642100000002511','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/514921','https://commons.wikimedia.org/wiki/Category:Watertoren_(Zwijndrecht)']}});


