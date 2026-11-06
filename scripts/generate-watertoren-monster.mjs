import {Manifold,circle,prism,hull,ring3,union,place,box,gableRoof,writeLandmark} from './efteling-kit.mjs';
const O=[73723.0,451465.0],BASE=-0.5, R=7.45, PHASE=Math.PI/16;
const circ=(r)=>circle([0,0],r,32,PHASE);
const fr=(r0,r1,z0,z1)=>hull([...ring3(circ(r0),z0),...ring3(circ(r1),z1)]);
// Brick shaft, buttress-like vertical ribs and broad reservoir above.
const shaft=fr(7.35,7.0,BASE,25.2);
const lower=fr(7.0,7.25,25.2,25.5);
const reservoir=fr(7.25,7.25,25.5,31.5);
const roof=fr(7.25,.35,31.5,38.0);
// Four masonry pilasters and three pale bands, strengthened by sloping undersides.
const ribs=[];for(let k=0;k<8;k++){const a=k*45;const p=box(6.8,-.53,BASE,7.55,.53,23.0);ribs.push(place(p,{deg:a}));}
const bands=[5.7,15.1,20.6].map(z=>union([fr(7.0,7.52,z-.52,z),fr(7.52,7.52,z,z+.8)]));
// Round-headed windows are represented by blind niches with 45-degree ceilings.
const window=(s,z0,z1)=>hull([[6.35,s-.48,z0],[8.2,s-.48,z0],[6.35,s+.48,z0],[8.2,s+.48,z0],[6.35,s-.48,z1+1],[6.35,s+.48,z1+1],[8.2,s-.48,z1-.85],[8.2,s+.48,z1-.85]]);
const holes=[];for(let k=0;k<8;k++){for(const [z0,z1] of [[8.2,11.0],[17,19.4],[22.5,24.1]])holes.push(place(window(0,z0,z1),{deg:22.5+45*k}));}
const entry=place(window(0,-.1,3.6),{deg:270});holes.push(entry);
let tower=union([shaft,lower,reservoir,roof,...ribs,...bands]).subtract(union(holes));
// Four substantial roof dormers: roofed, attached solids, simplified at 1:1000.
const dormers=[];for(let k=0;k<4;k++){const a=k*90;const b=box(4.45,-.7,31.8,5.8,.7,34.8); const cap=place(gableRoof(1.7,1.4,34.8,35.5),{at:[5.05,0,0]});dormers.push(place(union([b,cap]),{deg:a}));}
// Northwestern machine house and boiler house, both part of the same BAG object.
function house(L,W,z,at,deg){const base=box(-L/2,-W/2,BASE,L/2,W/2,z);const roof=gableRoof(L,W,z,z+2.8);return place(union([base,roof]),{at:[...at,0],deg});}
const house1=house(14,7.3,5.3,[-4.1,9.8],-61.2);
const house2=house(10.3,7.3,5.3,[-1.1,15.2],-61.2);
const body=union([tower,...dormers,house1,house2]);
await writeLandmark({slug:'watertoren-monster',base:BASE,nodes:[['building:watertoren',body]],catalog:{name:'Watertoren Monster',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1783100000004031'],description:'Ronde bakstenen watertoren met ribben en banden, reservoir met kegelkap en vier dakkapellen, met aangrenzende machinegebouwen.',realWorld:{groundNapM:3.818,ahnTopNapM:42.258,modelHeightM:38.0,publishedHeightM:37.8},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1783100000004031','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/525139','https://www.raderadvies.nl/projecten/watertoren-dunea/','https://commons.wikimedia.org/wiki/File:Monster_watertoren.jpg']}});
