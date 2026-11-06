import {circle,prism,hull,union,place,dome,writeLandmark} from './efteling-kit.mjs';
const O=[92743,450699], BASE=-.5, phase=Math.PI/8;
const shaft=prism(circle([0,0],5.85,8,phase),BASE,31.1);
const reservoir=prism(circle([0,0],5.85,16,Math.PI/16),30.9,43.0);
const profile=Array.from({length:13},(_,i)=>{const t=Math.PI*i/24;return [5.1*Math.cos(t),42.95+5.4*Math.sin(t)];});
const roof=dome([0,0],profile,32);
const window=(ang,width,z0,z1,rad=5.42,depth=.5)=>{const p=hull([[rad-depth,-width/2,z0],[rad+1,-width/2,z0],[rad-depth,width/2,z0],[rad+1,width/2,z0],[rad-depth,-width/2,z1+depth],[rad-depth,width/2,z1+depth],[rad+1,-width/2,z1-1],[rad+1,width/2,z1-1]]);return place(p,{deg:ang})};
const cuts=[];
for(let k=0;k<8;k++){cuts.push(window(k*45, .85, 24.7,27.4));if(k%2===0)cuts.push(window(k*45,.85,10.1,13.5));}
cuts.push(window(-90,1.4,0,3.3));
const body=union([shaft,reservoir,roof]).subtract(union(cuts));
await writeLandmark({slug:'watertoren-zoetermeer',base:BASE,nodes:[['building:watertoren',body]],catalog:{name:'Watertoren Zoetermeer',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0637100000139778'],description:'Achtzijdige bakstenen watertoren De Tien Gemeenten, met zestienzijdig reservoir en koepeldak.',realWorld:{groundNapM:-2.89,ahnTopNapM:45.47,modelHeightM:48.35,publishedHeightM:48.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0637100000139778','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.architectuurpuntzoetermeer.nl/gebouw-van-de-maand-watertoren-de-tien-gemeenten/','https://www.oudsoetermeer.nl/e2/site/oudsoetermeer/custom/site/upload/file/seghen_waert_2/sw_2011_4.pdf']}});
