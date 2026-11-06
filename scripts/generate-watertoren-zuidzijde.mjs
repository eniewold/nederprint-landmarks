import {union,hull,prism,place,circle,dome,box,writeLandmark} from './efteling-kit.mjs';
const BASE=-.5,ORIGIN=[76726.85,413060.03];
const ring=(r,z,n=8)=>circle([0,0],r,n,Math.PI/8).map(([x,y])=>[x,y,z]);
const shaft=prism(circle([0,0],5.4,8,Math.PI/8),BASE,26.0);
// Reservoir loopt via een schuine overgang naar de grotere achtkant.
const transition=hull([...ring(5.4,24.6),...ring(5.9,25.1),...ring(5.9,38.2)]);
const roof=dome([0,0],[[5.9,38.0],[5.8,39.0],[5.5,40.2],[5.0,41.4],[4.2,42.5],[3.1,43.3],[1.8,43.8],[.05,44.0]],32);
const ribs=[]; for(let a=0;a<360;a+=45) ribs.push(place(box(4.8,-.48,BASE,5.75,.48,37.8),{deg:a}));
let all=union([shaft,transition,roof,...ribs]);
const cut=(r,t,w,z0,z1,d=.4)=>hull([[r-d,t-w/2,z0],[r+1,t-w/2,z0],[r-d,t+w/2,z0],[r+1,t+w/2,z0],[r-d,t-w/2,z1],[r+1,t-w/2,z1-1.4],[r-d,t+w/2,z1],[r+1,t+w/2,z1-1.4]]);
const cuts=[];
for(let a=0;a<360;a+=45){ for(const [lo,hi] of [[3.0,5.0],[8.0,10.0],[13.0,15.0],[18.0,20.0],[26.3,28.1],[30.0,35.0],[36.2,37.5]])cuts.push(place(cut(a<0?5:5.1,0,1,lo,hi),{deg:a})); }
all=all.subtract(union(cuts));
await writeLandmark({slug:'watertoren-zuidzijde',base:BASE,nodes:[['building:watertoren',all]],catalog:{name:'Watertoren Zuidzijde',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:-.3,groundSamplePoints:[[8,0],[-8,0],[0,8],[0,-8]],replacesBuildings:['NL.IMBAG.Pand.0580100000245872'],description:'Achthoekige watertoren met reservoir en koepeldak, vensters als blinde nissen.',realWorld:{groundNapM:.502,ahnTopNapM:44.53,modelTopM:44.0},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0580100000245872','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/Category:Watertoren_(Zuidzijde)']}});

