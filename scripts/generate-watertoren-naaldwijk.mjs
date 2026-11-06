import {circle,prism,hull,ring3,union,place,box,dome,writeLandmark} from './efteling-kit.mjs';
const O=[74127.25,446191.2], BASE=-.5, A=-3.5;
const disk=(r)=>circle([0,0],r,48,0);
const shaft=prism(disk(6.05),BASE,35.25);
// Four broad tapering brick buttresses, directly attached to the cylindrical shaft.
const points=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x0,y1,z],[x1,y0,z],[x1,y1,z]];
const pier=hull([...points(5.4,8.25,-1.48,1.48,BASE),...points(5.4,7.4,-1.48,1.48,26.3),...points(5.4,6.25,-1.48,1.48,27.5)]);
const piers=Array.from({length:4},(_,k)=>place(pier,{deg:A+k*90}));
// Copper dome from an analytic circular arc profile, not height-sliced roof.
const profile=Array.from({length:13},(_,i)=>{const t=(Math.PI/2)*i/12;return [6.05*Math.cos(t),35.25+5.95*Math.sin(t)];});
const top=dome([0,0],profile,48);
// Blind recess with 45-degree ceiling for print without supports.
const window=(ang,width,z0,z1,rad=6.05,depth=.45)=>{let p=hull([[rad-depth,-width/2,z0],[rad+1,-width/2,z0],[rad-depth,width/2,z0],[rad+1,width/2,z0],[rad-depth,-width/2,z1+depth],[rad-depth,width/2,z1+depth],[rad+1,-width/2,z1-1],[rad+1,width/2,z1-1]]);return place(p,{deg:ang})};
const cuts=[];
for(let k=0;k<4;k++){for(let j=1;j<=5;j++)cuts.push(window(A+k*90+j*15,.9,3.4,25.1));}
// 24 narrow lights around the cornice, enlarged minimally for the print.
for(let k=0;k<24;k++)cuts.push(window(A+k*15,.9,32.6,34.7));
// Main entrance on north face, recessed.
cuts.push(window(90,1.7,0,3.2,6.05,.6));
const body=union([shaft,top,...piers]).subtract(union(cuts));
await writeLandmark({slug:'watertoren-naaldwijk',base:BASE,nodes:[['building:watertoren',body]],catalog:{name:'Watertoren Naaldwijk',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1783100000002398'],description:'Cilindrische bakstenen watertoren met vier zware steunberen, verticale vensternissen en koperen koepel.',realWorld:{groundNapM:.549,ahnTopNapM:41.782,modelHeightM:41.2,publishedHeightM:40.8},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1783100000002398','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/516156','https://commons.wikimedia.org/wiki/File:Naaldwijk_watertoren.jpg']}});
