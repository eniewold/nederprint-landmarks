// A'DAM Toren: zelfstandige vlakken/bouwdelen, geen gestapelde DSM-lagen.
// node scripts/generate-a-dam-toren.mjs [--scale 1000] [--out ../models]
import { Manifold, box, prism, rect, circle, hull, ring3, strip, place, union, writeLandmark, toStl, flag, scale } from './efteling-kit.mjs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
const slug='a-dam-toren', origin=[121972.75,488554.5], xAxis=[.8086,.58836], base=-.7;
const bag=[[121960.067,488555.174],[121959.15,488549.134],[121958.595,488545.783],[121958.339,488544.233],[121958.224,488543.54],[121958.886,488543.436],[121960.41,488543.198],[121965.642,488542.38],[121974.192,488541.013],[121973.507,488536.746],[121988.4,488516.059],[122004.449,488527.719],[121989.502,488548.296],[121998.58,488546.84],[121999.289,488551.4],[121985.827,488553.559],[121987.264,488562.648],[121987.504,488564.165],[121987.631,488564.968],[121986.888,488565.084],[121985.334,488565.328],[121975.843,488566.813],[121969.799,488575.069],[121953.999,488563.549]];
const local=([x,y])=>[(x-origin[0])*xAxis[0]+(y-origin[1])*xAxis[1],-(x-origin[0])*xAxis[1]+(y-origin[1])*xAxis[0]];
const plan=bag.map(local);
const plinthCuts=[];
for(let i=0;i<plan.length;i++){
 const a=plan[i],b=plan[(i+1)%plan.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let s=.5;s+1.4<L;s+=1.9)for(const z of [.6,3.0,6.0,9.0])plinthCuts.push(prism(strip(a,b,.65,s,s+1.4),z,z+1.55));
}
const facadeCuts=union(plinthCuts);
const foot=prism(plan,base,4.7).subtract(facadeCuts);
const wing=prism(plan,base,10.95).intersect(box(-10.2,-41,base,10.2,-14.5,11)).subtract(facadeCuts);
const beam=box(-10.45,-10.45,8.8,10.45,10.45,10.2);
const core=box(-5,-5,base,5,5,64.8);
const legs=[];
for(const sx of [-1,1])for(const sy of [-1,1]) {
 const pad=([x,y,z],s)=>ring3(rect(x-s/2,y-s/2,x+s/2,y+s/2),z);
 const foot=[sx*7.8,sy*7.8,base];
 for(const head of [[sx*10,sy*6,9.4],[sx*6,sy*10,9.4]])legs.push(hull([...pad(foot,2),...pad(head,1.8)]));
}
// 18 gevelrijen, maatvoering gecontroleerd met de prefabmodules (1,75 x 3 m).
let shaft=box(-10.45,-10.45,10.1,10.45,10.45,64.8);
const cuts=[];
for(let row=0;row<18;row++)for(let col=0;col<12;col++){
 const z=10.65+row*3.0,a=-9.85+col*1.68;
 const window=box(a,-10.7,z,a+1.30,-10.12,Math.min(64.3,z+2.25));
 for(let side=0;side<4;side++)cuts.push(place(window,{deg:side*90}));
}
shaft=shaft.subtract(union(cuts));
// Brandtrap als doorlopende schacht met blinde bordesnissen.
let stairs=box(10.2,6.8,base,11.65,9.5,64.8);
for(let row=0;row<18;row++)stairs=stairs.subtract(box(11.32,7.2,10.65+row*3,12,9.1,12.3+row*3));
const drum=prism(circle([0,0],11,96),64.6,70.5);
const square=(r)=>rect(-r,-r,r,r).map(([x,y])=>[(x-y)/Math.SQRT2,(x+y)/Math.SQRT2]);
const crown=hull([...ring3(square(11.6),70.4),...ring3(square(12.1),75.9)]);
const terrace=prism(square(12.1),75.8,76.3);
const railing=prism(square(12.1),76.1,77.2).subtract(prism(square(11.2),76,78));
// Dakopbouw op het terras; V-vormige bovenranden rond de mast, uit foto/AHN.
const roofParts=[box(-5.0,-5,76,-0.1,5,80.7),box(.1,-5,76,5,5,80.7)];
for(let side=0;side<4;side++)for(const sx of [-1,1]){
 const edge=hull([...ring3(rect(sx<0?-5:0,-5.1,sx<0?0:5,-4.2),79.3),...ring3(rect(sx<0?-5:-.01,-5.1,sx<0?-4.99:5,-4.2),81.7)]);
 roofParts.push(place(edge,{deg:side*90}));
}
const roofHouse=union(roofParts);
const machines=union([box(-4.3,-2.7,80.6,-2.7,2,81.8),box(1.8,-3.7,80.6,3.4,.7,81.5),box(-1.3,2.3,80.6,1.4,3.8,81.7),box(-2.5,-4.2,80.6,-.9,-3,81.6)]);
let mast=box(-1.1,-1.1,76,1.1,1.1,94.9);
// Drie Andreaskruizen als blinde gaten: 0,35 m diep, geen doorlopende sleuven.
for(const z of [88.4,90.3,92.2])for(const deg of [-45,45]){
 const cross=box(-.9,-.3,-.16,.9,.3,.16).rotate([0,deg,0]).translate([0,-1.08,z]);mast=mast.subtract(cross);
}
const swings=[];
for(const at of [[-9,-8.1,76.2],[-9,-3.8,76.2]]){
 const portal=union([box(-.45,-1.7,0,.45,-.8,3),box(-.45,.8,0,.45,1.7,3),box(-.45,-1.7,2.7,.45,1.7,3.6),box(-1.1,-.7,0,.9,.7,.9)]);
 swings.push(place(portal,{at,deg:45}));
}
const initial=union([foot,wing,beam,core,...legs,shaft,stairs,drum,crown,terrace,railing,roofHouse,machines,mast,...swings]);
// Nissen achter de aangebouwde brandtrap zijn volledig ingesloten; vul die
// interne holtes dicht. De open blinde gevelnissen blijven behouden.
const building=union(initial.decompose().filter(m=>m.volume()>0));
const nodes=[['building:toren met kroon en pylonen',building]];
await writeLandmark({slug,nodes,base,catalog:{name:"A'DAM Toren",origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-15,-17],[15,-23],[-13,20],[12,20]],replacesBuildings:['NL.IMBAG.Pand.0363100012071204'],description:'Romp met blind gevelraster, vier V-pylonen, kern, lage vleugel en brandtrap; ronde tussenbouw en 45 graden gedraaide kroon met hellende gevel, terras, balustrade, dakopbouw, ventilatiemast met drie blinde Andreaskruizen en twee schommels. Het echte kroonvolume staat in de GLB; de zelfstandige STL heeft een 45 graden kraag voor steunvrij printen. Onderkant 0,7 m onder maaiveld.',realWorld:{maaiveldNapM:1.8,rompTopM:64.8,kroonDekM:76.3,mastTopM:94.9,tussenbouwDiameterM:22,rotatieKroonGraden:45,schattingen:['blinde raamnissen 0,33 m','pylonen 2 m','brandtrap 1,45 x 2,7 m','vorm dakopbouw','schommelportalen verbreed tot 0,9 m']},sources:['PDOK BAG pand 0363100012071204; AHN4 DSM/DTM 0,5 m bbox 121900,488495,122060,488655; actuele orthoHR; 2026-10-08','https://arcam.nl/architectuur-gids/adam-toren/','https://www.staalmakers.nl/projecten/adam-toren-amsterdam/','https://commons.wikimedia.org/wiki/File:Top_A%27DAM_Toren.JPG','https://commons.wikimedia.org/wiki/File:Shell_Tower_Amsterdam-Noord_from_tour_boat_2016-09-12.jpg']}});
// Permanente printkraag, alleen voor de zelfstandige STL. De kaart en preview
// gebruiken de echte GLB en vullen onder de kroon met Printbare overhang.
const collar=hull([...ring3(circle([0,0],11,96),64.0),...ring3(square(11.65),70.5)]);
const lowerCollar=hull([...ring3(rect(-5,-5,5,5),3.0),...ring3(rect(-10.45,-10.45,10.45,10.45),8.8)]);
const printable=union([building,collar,lowerCollar]).translate([0,0,-base]);
await writeFile(path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug,`${slug}-1-${scale}.stl`),toStl(printable,`NederPrint A'DAM Toren 1:${scale}, 45 graden printkraag`).buffer);
console.log('Steunvrije STL:',printable.status(),printable.numTri(),'driehoeken');
