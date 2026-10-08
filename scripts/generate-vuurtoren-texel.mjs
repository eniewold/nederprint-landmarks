// Eierland: bakstenen conische mantel, twee omgangen en kleinere lichtkap.
import { box, prism, rect, circle, hull, ring3, dome, place, union, writeLandmark } from './efteling-kit.mjs';
const slug='vuurtoren-texel',base=-.5,origin=[119438.6,577404.1];
const BODY={foot:4.48,head:3.65,top:26.15};
const cone=(r0,r1,z0,z1)=>hull([...ring3(circle([0,0],r0,96),z0),...ring3(circle([0,0],r1,96),z1)]);
let body=cone(BODY.foot,BODY.head,base,BODY.top);
const cuts=[box(-.8,-5,-.1,.8,-4.07,2.7)];
for(const deg of [0,90,180,270])for(let row=0;row<3;row++){
 const z=4.9+row*8.4+(deg%180===90?4.2:0);if(z+1.6>26)continue;
 const r=BODY.foot+(BODY.head-BODY.foot)*(z+.8)/BODY.top;
 cuts.push(place(box(-.5,-r-.7,z,.5,-r+.35,z+1.6),{deg}));
}
body=body.subtract(union(cuts));
const gallery=(ri,ro,z0,z1,z2)=>union([cone(ri,ro,z0,z1),prism(circle([0,0],ro,96),z1,z2).subtract(prism(circle([0,0],ro-.9,96),z1+.15,z2+1))]);
const lower=gallery(3.69,4.35,25.4,26.15,27.25);
let watchroom=prism(circle([0,0],2.75,96),26.0,30.05);
const wc=[];for(let k=0;k<8;k++)wc.push(place(box(-.45,-3,27.2,.45,-2.4,28.7),{deg:k*45}));
watchroom=watchroom.subtract(union(wc));
const upper=gallery(2.75,3.35,29.3,30.05,31.1);
let lantern=prism(circle([0,0],2.1,96),29.9,33.2);
const gc=[];for(let k=0;k<12;k++)gc.push(place(box(-.38,-2.4,30.7,.38,-1.75,32.95),{deg:k*30}));
lantern=lantern.subtract(union(gc));
const roof=dome([0,0],[[2.2,33.1],[2.2,33.3],[1.92,33.8],[1.27,34.35],[.5,34.7]],96);
const radar=union([prism(circle([0,0],.5,24),34.5,36.15),box(-1.65,-.45,35.25,1.65,.45,36.15)]);
// Vaste smalle vluchtladder op de noordmantel, als vast reliëf met blindrungs.
let ladder=hull([...ring3(rect(-4.7,-.5,-4.25,.5),base),...ring3(rect(-3.92,-.5,-3.45,.5),26.15)]);
const lc=[];for(let z=1;z<25;z+=1.2){const x=-4.7+.78*z/26.15;lc.push(box(x-.2,-.3,z,x+.2,.3,z+.45));}
ladder=ladder.subtract(union(lc));
const initial=union([body,lower,watchroom,upper,lantern,roof,radar,ladder]);
// De mantel sluit enkele kleine ladderuitsparingen volledig in; vul die
// interne holtes, behoud alle naar buiten open blinde nissen.
const tower=union(initial.decompose().filter(s=>s.volume()>0));
await writeLandmark({slug,base,nodes:[['building:vuurtoren met wachtkamer',tower]],catalog:{name:'Vuurtoren Texel',origin,xAxis:[0,-1],groundOffsetMetres:0,groundSamplePoints:[[-5.2,0],[5.2,0],[0,-5.2],[0,5.2]],replacesBuildings:['NL.IMBAG.Pand.0448100000001519'],description:'Lokale +X wijst zuid, -Y naar de westelijke entree en -X naar de noordelijke vluchtladder. Stenen conische mantel, twee omgangen, wachtkamer en lichtkap; samples op het duinplateau, geen dubbel duinvolume.',realWorld:{maaiveldNapM:20.91,rompTopM:26.15,kapTopM:34.7,radarTopM:36.15,voetDiameterM:8.96,schattingen:['omhullende romp en omganghoogtes','verspringende blinde vensters 0,35 m','vorm wachtkamer, glas en koepel','vluchtladder als 1 m breed vast reliëf','radarbalk tot 0,9 m verbreed']},sources:['PDOK BAG 0448100000001519; AHN4 DSM/DTM 0,5 m bbox 119390,577335,119490,577435; actuele orthoHR; 2026-10-08','https://monumentenregister.cultureelerfgoed.nl/monumenten/35278','https://www.vuurtorens.org/vuurtoren/eierland/','https://onh.nl/verhaal/vuurtoren-eierland-texel-twee-torens-ineen']}});
