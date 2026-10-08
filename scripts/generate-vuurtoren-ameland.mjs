// Bornrif: ronde conische romp en benoemde lichtkapdelen, geen hoogtelagen.
import { box, prism, circle, hull, ring3, dome, place, union, writeLandmark } from './efteling-kit.mjs';
const slug='vuurtoren-ameland',base=-.5,origin=[170846.4,607024.9];
const BODY={foot:4.72,head:2.58,top:46.55};
const cone=(r0,r1,z0,z1)=>hull([...ring3(circle([0,0],r0,96),z0),...ring3(circle([0,0],r1,96),z1)]);
let body=cone(BODY.foot,BODY.head,base,BODY.top);
const cuts=[box(-.85,-5.2,-.1,.85,-4.28,3.2)];
for(let row=0;row<9;row++){
 const z=3.9+4.8*row,r=BODY.foot+(BODY.head-BODY.foot)*(z+.8)/BODY.top;
 for(const deg of [0,90,180,270])cuts.push(place(box(-.5,-r-1,z,.5,-r+.35,z+1.7),{deg}));
}
body=body.subtract(union(cuts));
const gallery=(ri,ro,z0,z1,z2)=>union([cone(ri,ro,z0,z1),prism(circle([0,0],ro,96),z1,z2).subtract(prism(circle([0,0],ro-.9,96),z1+.15,z2+1))]);
const lower=gallery(2.65,3.8,45.3,46.55,47.55);
let lantern=prism(circle([0,0],2.55,96),46.4,52.35);
const panels=[];
for(let k=0;k<12;k++)panels.push(place(box(-.45,-2.8,49.7,.45,-2.2,52.05),{deg:k*30}));
for(let k=0;k<4;k++)panels.push(place(box(-.5,-2.8,47.2,.5,-2.2,48.7),{deg:k*90}));
lantern=lantern.subtract(union(panels));
const upper=gallery(2.55,3.35,48.6,49.45,50.4);
const roof=dome([0,0],[[2.65,52.25],[2.65,52.5],[2.4,53.1],[1.8,53.65],[.65,54.25],[.5,54.35]],96);
const radar=union([prism(circle([0,0],.5,24),54.2,55.3),box(-1.6,-.45,54.4,1.6,.45,55.3)]);
// Laag, met de toren verbonden portaal; alleen de feitelijke torenvoet, geen duin.
const portal=box(-1.4,-5.15,base,1.4,-3.9,.4);
const tower=union([body,lower,lantern,upper,roof,radar,portal]);
await writeLandmark({slug,base,nodes:[['building:ronde vuurtoren met lichthuis',tower]],catalog:{name:'Vuurtoren Bornrif',origin,xAxis:[.996195,-.087156],groundOffsetMetres:0,groundSamplePoints:[[-6,0],[6,0],[0,-6],[0,6]],replacesBuildings:['NL.IMBAG.Pand.0060100000125111'],description:'Lokale +X volgt RD-oost -5 graden; ingang op -Y aan de zuidzijde. Ronde taps toelopende romp met twee omgangen, blinde vensters, koepel en radar; geen reliëf voor geschilderde kleurbanden.',realWorld:{maaiveldNapM:9.28,totalHeightM:55.3,rompTopM:46.55,voetDiameterM:9.44,paintBands:'rood-wit; schildering, geen geometrische ribben',schattingen:['overgangs- en omganghoogtes','blind vensterritme en nisdiepte 0,35 m','koepel/radarvorm','portaal 2,8 x 1,25 m']},sources:['PDOK BAG 0060100000125111; AHN4 DSM/DTM 0,5 m bbox 170800,606980,170890,607070; actuele orthoHR; 2026-10-08','https://monumentenregister.cultureelerfgoed.nl/monumenten/7693','https://www.vuurtorens.org/vuurtorenoverzicht-ameland/','https://www.vuurtorens.org/wp-content/uploads/2023/08/De-vuurtoren-van-Ameland-juni-2023.pdf','https://www.ameland-site.nl/een-adembenemend-uitzicht-vanaf-de-bornrif']}});
