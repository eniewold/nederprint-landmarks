// Lange Jaap: één zestienzijdige conische romp, bouwdelen bovenop; geen DSM-plakken.
import { Manifold, box, prism, circle, hull, ring3, dome, place, union, writeLandmark } from './efteling-kit.mjs';
const slug='lange-jaap', base=-.5, origin=[110593.9,552253.3];
const BODY={bottomRadius:5.45,topRadius:2.15,top:54.55,phase:Math.PI/16};
const frustum=(r0,r1,z0,z1,n=16)=>hull([...ring3(circle([0,0],r0,n,BODY.phase),z0),...ring3(circle([0,0],r1,n,BODY.phase),z1)]);
// Radius komt uit BAG en een lineaire fit op de AHN-zijvlakken; raamnissen uit foto's.
let body=frustum(BODY.bottomRadius,BODY.topRadius,base,BODY.top);
const pointed=(w,h,z,r,depth)=>prism([[-w/2,z],[w/2,z],[w/2,z+h-w/2],[0,z+h],[-w/2,z+h-w/2]],0,depth+1).rotate([90,0,0]).translate([0,-r+depth,0]);
const cuts=[pointed(1.45,3.2,-.1,5.4,.35)];
for(let row=0;row<8;row++){
 const z=7+row*5.8, r=BODY.bottomRadius+(BODY.topRadius-BODY.bottomRadius)*(z+1)/BODY.top;
 for(const deg of [0,90,180,270])cuts.push(place(pointed(.9,1.55,z,r,.35),{deg}));
}
body=body.subtract(union(cuts));
// Schuine kraag vervangt de dunne consoles; parapetten als gesloten ringen.
const gallery=(rInner,rOuter,z0,z1,z2)=>union([frustum(rInner,rOuter,z0,z1,64),prism(circle([0,0],rOuter,64),z1,z2).subtract(prism(circle([0,0],rOuter-.9,64),z1+.15,z2+1))]);
const lower=gallery(2.21,3.65,53.0,54.55,55.5);
let drum=prism(circle([0,0],2.45,64),54.4,60.35);
const glass=[];
for(let k=0;k<12;k++) glass.push(place(box(-.43,-2.7,57.3,.43,-2.12,60.0),{deg:k*30}));
drum=drum.subtract(union(glass));
const upper=gallery(2.45,3.2,56.15,57.0,57.9);
const roof=dome([0,0],[[2.55,60.25],[2.55,60.55],[2.36,61.05],[1.8,61.65],[.75,62.3],[.45,62.4]],64);
const radar=union([prism(circle([0,0],.5,16),62.2,64.1),box(-1.8,-.45,63.7,1.8,.45,64.6).rotate([0,0,35])]);
const tower=union([body,lower,drum,upper,roof,radar]);
await writeLandmark({slug,base,nodes:[['building:zestienzijdige vuurtoren',tower]],catalog:{name:'Lange Jaap',origin,xAxis:[0,-1],groundOffsetMetres:0,groundSamplePoints:[[-6,0],[6,0],[0,-6],[0,6]],replacesBuildings:['NL.IMBAG.Pand.0400100000024142'],description:'RD-zuid is +X; deur aan westzijde (-Y), zestienzijdige conische romp met twee omgangen, lichthuis, koepel en radar. Onderkant -0,5 m, gesloten omgangranden en schuine printkraag.',realWorld:{maaiveldNapM:.8,rompTopM:54.55,kapTopM:62.4,radarTopM:64.6,voetDiameterM:10.9,schattingen:['hoogtes omgangen en lichthuis','vensterritme en oriëntatie','koepelprofiel','radarbalk verbreed tot 0,9 m']},sources:['PDOK BAG 0400100000024142; AHN4 DSM/DTM 0,5 m bbox 110555,552210,110635,552290; actuele orthoHR; 2026-10-08','https://monumentenregister.cultureelerfgoed.nl/monumenten/335626','https://heldersehistorischevereniging.nl/wp-content/uploads/2022/01/Beschrijving-en-waardering-vuurtoren-Lange-Jaap-1-december-2021.pdf','https://www.rijkswaterstaat.nl/nieuws/archief/2024/07/gietijzeren-vuurtorens-groot-onderhoud-succesvol-aanbesteed','https://www.zeilen.nl/actueel/nieuws/hoogste-vuurtoren-van-nederland-staat-op-instorten']}});
