// Paard van Marken: maten in meters; +X langs de twee daknokken naar de toren.
import {Manifold,box,prism,circle,hull,ring3,union,place,gableRoof,dome,writeLandmark} from './efteling-kit.mjs';
const ORIGIN=[138139.2,496921.05],AXIS=[.999860414,-.016707835];
const GROUND_NAP=1.6,FOOT=-.2,HUT_FOOT=-1.69;
const TOWER={radius:3.05,upperRadius:2.05,gallery:12.25,lantern:14.3,dome:15.5,finial:17.1};
const frustum=(r0,r1,z0,z1,n=64)=>hull([...ring3(circle([0,0],r0,n),z0),...ring3(circle([0,0],r1,n),z1)]);
// Rond torenlichaam, twee sierbanden en de conische drager van de omgang.
let tower=frustum(TOWER.radius,TOWER.upperRadius,FOOT,12.05);
const bands=[4.15,7.55].map(z=>union([frustum(2.78-(z-4.15)*.082,2.98-(z-4.15)*.082,z-.3,z),frustum(2.98-(z-4.15)*.082,2.78-(z-4.15)*.082,z,z+.3)]));
const gallery=union([frustum(2.05,2.75,11.55,12.25),prism(circle([0,0],2.75,64),12.25,13.15).subtract(prism(circle([0,0],1.85,64),12.35,13.25))]);
const cuts=[];for(const a of[0,90,180,270])for(const z of[2.1,5.45,8.8,10.65]){
 const r=TOWER.radius+(TOWER.upperRadius-TOWER.radius)*(z-FOOT)/(12.05-FOOT);
 cuts.push(place(box(-.45,-r-.2,z,.45,-r+.35,z+1.25),{deg:a}));
}
// De historische gevelsteen is een laag reliëf, geen tekst op printschaal.
const plaque=place(box(-.7,-2.83,5.5,.7,-2.32,6.65),{deg:180});
const eastPorch=union([box(2.75,-.77,FOOT,4.08,.77,2.15),place(gableRoof(1.33,1.54,2.15,2.95),{at:[3.415,0,0]})]);
tower=union([tower,...bands,gallery,plaque,eastPorch]).subtract(union(cuts));
let lantern=union([prism(circle([0,0],1.12,12,Math.PI/12),12.1,14.3),dome([0,0],[[1.28,14.3],[1.26,14.65],[1.05,15],[.62,15.32],[.45,15.5]],48),prism(circle([0,0],.45,24),15.4,17.1)]);
const glass=Array.from({length:4},(_,i)=>place(box(-.45,-1.3,13.3,.45,-.87,14.15),{deg:i*90}));lantern=lantern.subtract(union(glass));
// Twee afzonderlijke rechte zadeldaken, gemeten uit dwarsprofielen AHN.
const WEST={x0:-14.4,x1:-7.2,y0:-2.55,y1:3.48,eave:6.36,ridge:8.67};
const EAST={x0:-7.2,x1:-1.7,y0:-2.58,y1:3.08,eave:6.8,ridge:9.26};
const house=(q)=>union([box(q.x0,q.y0,FOOT,q.x1,q.y1,q.eave),place(gableRoof(q.x1-q.x0,q.y1-q.y0,q.eave,q.ridge),{at:[(q.x0+q.x1)/2,(q.y0+q.y1)/2,0]})]);
let houses=union([house(WEST),house(EAST),box(-4.86,3.05,FOOT,-.63,4.8,2.47),box(-12.51,3.48,FOOT,-9.68,5.53,2.3),box(-12.2,-.5,7.8,-11.3,.4,10.05),box(-4.15,-.5,9,-3.25,.4,11.28)]);
const windows=[];for(const q of[WEST,EAST])for(const y of[q.y0,q.y1])for(const x of[q.x0+1.45,q.x0+3.6])for(const z of[1.25,4.4])windows.push(box(x-.55,y-.35,z,x+.55,y+.35,z+1.55));
for(const y of[-1.15,1.3])for(const z of[1.25,4.4])windows.push(box(WEST.x0-.1,y-.6,z,WEST.x0+.35,y+.6,z+1.55));
// Houten verdieping: terugliggende gevelvelden laten hoekstijlen en dakrand staan.
windows.push(box(WEST.x0-.1,-2.1,4.1,WEST.x0+.2,3.05,4.38));houses=houses.subtract(union(windows));
const HUT=[[138126.65,496910.929],[138128.019,496908.694],[138129.006,496909.299],[138128.937,496909.41],[138129.744,496909.904],[138129.339,496910.566],[138128.967,496910.339],[138128.072,496911.8]].map(([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]]);
const hut=union([prism(HUT,HUT_FOOT,.11),place(gableRoof(2.65,1.9,.11,.76),{deg:121.5,at:[-11.11,-10.53,0]})]);
await writeLandmark({slug:'paard-van-marken',base:HUT_FOOT,nodes:[['building:toren-met-omgang-en-portaal',tower],['building:lantaarn-rode-koepel-en-makelaar',lantern],['building:wachterswoning-machinekamer-en-aanbouwen',houses],['building:los-schuurtje',hut]],catalog:{name:'Paard van Marken',origin:ORIGIN,xAxis:AXIS,groundHeight:44.36464157914016,groundOffsetMetres:-.1,groundSamplePoints:[[4.5,0],[0,-4.5],[0,4.5],[-17,0]],replacesBuildings:['NL.IMBAG.Pand.0852100000003061'],description:'Ronde lichttoren met omgang, lantaarn, koepel en verdikte makelaar; afzonderlijke zadeldaken op wachterswoning en machinekamer, twee noordaanbouwen en vrijstaand schuurtje. Lokale +X volgt de nokken oostwaarts.',realWorld:{sourceObjectHeightM:15.5,estimatedFinialTopM:17.1,towerFootDiameterM:6.1,roofRidgesM:[8.67,9.26],roofEavesM:[6.36,6.8],minimumPartM:.9,hutFootM:HUT_FOOT},sources:['https://www.vuurtorens.org/vuurtoren/marken/','https://monumentenregister.cultureelerfgoed.nl/monumenten/28274','https://commons.wikimedia.org/wiki/Category:Marken_lighthouse','PDOK BAG 0852100000003061; BGT L0002.5dd23c32044344b299e3f7e06ef5fdbf en L0002.69529f4b4a00448abf30fcd5a0d064aa; AHN DSM/DTM 0,5 m; Actueel_orthoHR, 2026-10-11']}});


