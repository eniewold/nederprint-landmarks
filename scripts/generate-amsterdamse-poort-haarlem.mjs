// Hoofdpoort, twee weergangen en voorpoort, ieder eigen gevel/dak/geleding.
import {box,prism,rect,circle,hull,ring3,spire,gableRoof,dome,place,union,writeLandmark} from './efteling-kit.mjs';
const slug='amsterdamse-poort-haarlem',base=-2,origin=[104559.6,488339.2],xAxis=[.965926,.258819];
const yc=.4;
const point=(w,spring,top,z0)=>[[-w/2,z0],[w/2,z0],[w/2,spring],[0,top],[-w/2,spring]];
// Doorgang over de X-as met steil (>50°) boogdak, geen horizontale brug.
const through=(x0,x1)=>prism(point(3.5,3.1,5.5,base-1),x0,x1).rotate([90,0,90]).translate([0,yc,0]);
const blind=(w,h,z,depth=.35)=>prism(point(w,h-w*.7,h,z).map(([y,zz])=>[y,zz]),0,depth+1);
const faceNiche=(w,h,z,x,y,side,depth=.35)=>prism(point(w,z+h-w*.7,z+h,z),0,depth+1).rotate([90,0,side===1?90:-90]).translate([x-side*depth,y,0]);
let main=box(-4.25,-4.05,base,5.15,4.8,15.1);
const roof=place(gableRoof(9.5,9.05,15,20.95),{at:[.45,yc,0]});
const stepped=prism([[-4.55,14.9],[4.55,14.9],[4.55,15.7],[3.1,15.7],[3.1,18.1],[2.35,18.1],[2.35,21.2],[-2.35,21.2],[-2.35,18.1],[-3.1,18.1],[-3.1,15.7],[-4.55,15.7]],0,.7).rotate([90,0,-90]).translate([-4.1,yc,0]);
const mainCuts=[through(-6,7),faceNiche(5.1,7.9,0,-4.25,yc,-1,.3),faceNiche(1.7,4.2,8.2,-4.25,yc,-1),faceNiche(1.3,3.1,15.1,-4.6,yc,-1),faceNiche(2.0,5.7,7.7,5.15,yc,1)];
main=union([main,roof,stepped]).subtract(union(mainCuts));
const octTower=(c,r,z0,z1,top)=>{
 let body=prism(circle(c,r,8,Math.PI/8),z0,z1);
 const cuts=[];
 for(let k=0;k<8;k++)cuts.push(place(box(-.46,-r-.2,z1-2.5,.46,-r+.27,z1-.25),{at:[...c,0],deg:k*45+22.5}));
 body=body.subtract(union(cuts));
 return union([body,spire(c,r+.15,z1-.05,top,8),prism(circle(c,.45,12),top-.5,top+.35)]);
};
const high=[octTower([4.1,-3.45],1.25,base,17.05,20.9),octTower([4.1,4.4],1.25,base,17.05,20.9)];
const wings=[];
for(const y of [-3.35,4.35]){
 let wall=box(4.8,y-.55,base,11.1,y+.55,6.9);
 // Kleine waterbogen worden blinde nissen; water en brugdek blijven PDOK.
 const waterArch=prism(point(2.3,.1,1.7,-1.4),0,.35).rotate([90,0,0]).translate([7.4,y-.25,0]);
 wall=wall.subtract(waterArch);
 wings.push(union([wall,place(gableRoof(6.5,1.5,6.85,7.85),{at:[7.95,y,0]})]));
}
const frontTowers=[];
for(const c of [[11.1,-3.15],[11.1,4.05]]){
 let round=prism(circle(c,1.95,64),base,5.9);
 const windows=[];for(let k=0;k<8;k++)windows.push(place(box(-.45,-2.1,2.2,.45,-1.61,3.1),{at:[...c,0],deg:k*45}));
 round=round.subtract(union(windows));
 const bands=[1.1,2,3.7,5.6].map(z=>prism(circle(c,2.02,64),z,z+.16));
 const upper=octTower(c,1.88,5.7,8.7,13.15);
 frontTowers.push(union([round,...bands,upper]));
}
const fore=union([box(9.65,-2.6,base,11.45,3.5,6.55),place(gableRoof(1.9,6.2,6.5,7.3),{at:[10.55,yc,0]})]).subtract(through(8,14));
const pinnacles=[-3.9,4.6].map(y=>union([prism(circle([-4.15,y],.5,8),9.4,14.75),spire([-4.15,y],.75,14.65,15.65,8)]));
// Uurwerk op de westelijke trapgevel: schijf en ingedrukte wijzers.
const clock=prism(circle([0,19.6],.85,32),0,.25).rotate([90,0,-90]).translate([-4.72,yc,0]);
const model=union([main,...high,...wings,...frontTowers,fore,...pinnacles,clock]);
await writeLandmark({slug,base,nodes:[['building:hoofdpoort, weergangen en voorpoort',model]],catalog:{
 name:'Amsterdamse Poort (Haarlem)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-6,0],[-3,-6],[-3,6],[14,-6],[14,6]],replacesBuildings:['NL.IMBAG.Pand.0392100000036575'],
 description:'Hoofdpoort met zadeldak en westelijke trapgevel, twee hoge achtkante traptorens, twee lage ronde/achtkante veldtorens en overdekte weergangen. +X naar de veldzijde (oostnoordoost). Doorgangen met steil printbaar profiel; waterbogen blind. Onderkant -2 m onder straatniveau.',
 realWorld:{maaiveldNapM:1.0,hoofdpoortTopM:21.2,veldtorenTopM:13.5,hoofdgebouwM:[9.4,8.85,15.1],schattingen:['dakvorm en geledinghoogtes uit AHN en schuine foto’s','steile boogdaken in plaats van ronde gewelven voor steunvrij 1:1000','vensters, klok en pinakels vereenvoudigd','hoekprofielen en baksteenfriezen weggelaten']},
 sources:['PDOK BAG 0392100000036575; AHN4 DSM/DTM 0,5 m bbox 104520,488290,104620,488390; actuele orthoHR; 2026-10-08','https://monumentenregister.cultureelerfgoed.nl/monumenten/19771','https://commons.wikimedia.org/wiki/File:Amsterdamse_Poort_in_Haarlem_1.jpg','https://commons.wikimedia.org/wiki/File:Amsterdamse_Poort_2011_BS_Amsterdam_Netherlands_(2).jpg']
}});
