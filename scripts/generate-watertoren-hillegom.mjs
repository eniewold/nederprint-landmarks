import {circle,prism,hull,ring3,union,place,box,writeLandmark} from './efteling-kit.mjs';
const O=[99220.73,476528.65], BASE=-0.5, phase=0.203;
const oct=(r)=>circle([0,0],r,8,phase);
const frustum=(r0,r1,z0,z1)=>hull([...ring3(oct(r0),z0),...ring3(oct(r1),z1)]);
// Eight-sided shaft and upper reservoir: planar facets and sloping collars.
const shaft=frustum(6.65,6.65,BASE,33.0);
const bowl=frustum(6.65,7.05,33.0,35.0);
const reservoir=frustum(7.05,7.05,35,43.9);
const roof=frustum(7.05,7.05,43.9,44.45);
// Ribs are narrow vertical prisms at the eight corners.
const ribs=Array.from({length:8},(_,i)=>{let a=phase+i*Math.PI/4;let x=Math.cos(a),y=Math.sin(a),p=[-y,x];return prism([[x*6.35+p[0]*.52,y*6.35+p[1]*.52],[x*7.05+p[0]*.52,y*7.05+p[1]*.52],[x*7.05-p[0]*.52,y*7.05-p[1]*.52],[x*6.35-p[0]*.52,y*6.35-p[1]*.52]],BASE,43.9)});
const rect3=(x,y,z)=>[x,y,z];
// Each niche has a sloping ceiling, avoiding horizontal overhang.
const cut=(offset,z0,z1)=>hull([rect3(5.48,offset-.46,z0),rect3(7.3,offset-.46,z0),rect3(5.48,offset+.46,z0),rect3(7.3,offset+.46,z0),rect3(5.48,offset-.46,z1+.7),rect3(5.48,offset+.46,z1+.7),rect3(7.3,offset-.46,z1-1.12),rect3(7.3,offset+.46,z1-1.12)]);
const cuts=[]; for(let k=0;k<8;k++){if(k===6) continue; for(const h of [[7,11],[13,17],[19,23],[25,29],[30,32]]) for(const off of [-.8,.8]) cuts.push(place(cut(off,h[0],h[1]),{deg:(phase+Math.PI/8)*180/Math.PI+45*k}));}
// The exterior escape staircase at the southeast face is a vertical, supported
// strip connected from the foot to the shaft. The open spiral and glazing are
// simplified as six shallow sloped-top niches at printable size.
const stairAngle=-56;
const stair=place(box(5.75,-1.55,BASE,7.65,1.55,31.7),{deg:stairAngle});
for(const [lo,hi] of [[6,9],[10,13],[14,17],[18,21],[22,25],[26,29]]) {
  const n=hull([[7.2,-.95,lo],[8,-.95,lo],[7.2,.95,lo],[8,.95,lo],[7.2,-.95,hi+.8],[7.2,.95,hi+.8],[8,-.95,hi],[8,.95,hi]]);
  cuts.push(place(n,{deg:stairAngle}));
}
let tower=union([shaft,bowl,reservoir,roof,stair,...ribs]).subtract(union(cuts));
// Low office/atrium belonging to same BAG building: outer contour from BAG,
// flat roof 3D BAG +5.28 NAP. Lower tower octagon is already in the union.
const world=[[99239.643,476514.544],[99239.859,476516.82],[99242.358,476519.197],[99243.392,476518.11],[99253.319,476527.053],[99230.81,476551.419],[99219.608,476543.284],[99231.076,476531.57],[99227.265,476530.53],[99225.942,476530.169],[99223.681,476532.969],[99224.372,476534.359],[99223.679,476534.723],[99222.96,476533.558],[99219.6,476534.114],[99219.263,476535.665],[99218.442,476535.5],[99218.803,476534.177],[99216.003,476531.916],[99214.613,476532.607],[99214.249,476531.914],[99215.414,476531.195],[99214.858,476527.835],[99213.307,476527.498],[99213.471,476526.676],[99214.794,476527.037],[99217.055,476524.237],[99216.364,476522.847],[99217.057,476522.483],[99217.776,476523.648],[99221.136,476523.092],[99221.473,476521.541],[99222.293,476521.707],[99221.932,476523.03],[99224.732,476525.291],[99226.122,476524.6],[99228.755,476523.084],[99219.603,476514.424],[99228.005,476505.545],[99229.036,476504.455]].map(([x,y])=>[x-O[0],y-O[1]]);
const body=union([tower,prism(world,BASE,4.86)]);
await writeLandmark({slug:'watertoren-hillegom',base:BASE,nodes:[['building:watertoren',body]],catalog:{name:'Watertoren Hillegom',origin:O,xAxis:[1,0],groundOffsetMetres:-0.3,replacesBuildings:['NL.IMBAG.Pand.0534100000011918'],description:'Achthoekige betonnen watertoren met acht ribben, vensternissen en reservoirkop; lage hedendaagse aanbouw uit BAG-voetafdruk.',realWorld:{groundNapM:.424,ahnRoofNapM:44.878,modelHeightM:44.45,publishedHeightM:45.25},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0534100000011918','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.pieters.net/nieuws/meelfabriek-en-watertoren-winnaars-rap-leiden-2023/','https://commons.wikimedia.org/wiki/Category:Watertoren,_Hillegom']}});



