// Sassenpoort: bouwdelen en dakvlakken uit BAG/AHN, plattegrond/doorsneden
// van Ter Kuile (RCE, fig.21), veld- en stadszijdefoto's. Geen hoogtelagen.
import {box,prism,circle,hull,ring3,spire,hipRoof,gableRoof,place,union,writeLandmark,downFaces} from './efteling-kit.mjs';
const slug='sassenpoort',base=-.8,ground=2.86;
const origin=[203085.58,502710.86],xAxis=[.6,-.8];
const pointed=(w,s,t,z=base-1)=>[[-w/2,z],[w/2,z],[w/2,s],[0,t],[-w/2,s]];
const passage=(w,s,t,x0,x1)=>prism(pointed(w,s,t),x0,x1).rotate([90,0,90]);
const niche=(x,y,z,w,h,side,axis='x')=>axis==='x'?box(x-(side>0?.35:1),y-w/2,z,x+(side>0?1:.35),y+w/2,z+h):box(x-w/2,y-(side>0?.35:1),z,x+w/2,y+(side>0?1:.35),z+h);
const cuts=[];
for(const x of [-3.72,7.3])for(const z of [8.3,12.9,18.15])cuts.push(niche(x,0,z,1.5,2.3,x<0?-1:1));
for(const y of [-4.95,4.95])for(const x of [-.9,3.0])for(const z of [8.3,12.9,18.15])cuts.push(niche(x,y,z,1.35,2.4,y<0?-1:1,'y'));
let body=box(-3.72,-4.95,base,7.3,4.95,23.0).subtract(union(cuts)).subtract(passage(3.6,3.5,5.8,-12,12));
const parts=[body,place(hipRoof(10.5,8.9,22.95,30.32,3.6),{at:[1.6,0,0]})];
// Weergang met echte open ruimten tussen de grove kantelen.
const rim=box(-3.9,-5.1,22.75,7.45,5.1,23.8).subtract(box(-2.95,-4.15,22.6,6.5,4.15,24.5));parts.push(rim);
for(const y of [-4.65,4.65])for(const x of [-2.8,-.8,1.2,3.2,5.2,7])parts.push(box(x-.5,y-.45,23.75,x+.5,y+.45,24.95));
for(const x of [-3.45,7.0])for(const y of [-3.7,-1.7,.3,2.3,4.3])parts.push(box(x-.45,y-.5,23.75,x+.45,y+.5,24.95));
// Ronde veldtorenvoeten gaan op een steile kraag over in achtkanten.
for(const [cx,cy,top] of [[7.15,-4.9,33.45],[7.2,4.9,33.45]]){
 const c=[cx,cy],phase=Math.PI/8;
 let tower=union([prism(circle(c,2.83,64),base,7.65),hull([...ring3(circle(c,2.82,64),7.5),...ring3(circle(c,3.02,8,phase),8.32)]),prism(circle(c,3.02,8,phase),8.3,23.8)]);
 const windows=[];
 for(const z of [9.4,14.0,19.2])for(const deg of [0,90,270])windows.push(place(box(2.38,-.55,z,3.3,.55,z+1.8),{at:[...c,0],deg}));
 tower=tower.subtract(union(windows));
 const roof=union([hull([...ring3(circle(c,2.84,8,phase),23.75),...ring3(circle(c,2.4,8,phase),24.7)]),spire(c,2.4,24.68,top,8,phase)]);
 parts.push(tower,roof);
 // Twee grotere dakvensters per spits, met een puntkap en ondiepe nis.
 for(const deg of [0,270]){
  const dormer=union([box(1.64,-.52,25.2,2.55,.52,26.05),place(gableRoof(1.05,1.05,26.02,26.95),{at:[2.08,0,0]})]).subtract(niche(2.55,0,25.38,.9,.65,1));
  parts.push(place(dormer,{at:[...c,0],deg}));
 }
}
// Stadszijdetorens: veelhoekig en op steunberen uitgekraagd, geen ronde
// toren tot op straat. De bestaande trapkoker draagt de noordoosthoek.
for(const cy of [-4.85,4.85]){
 const c=[-3.3,cy],poly=circle(c,2.15,8,Math.PI/8);
 parts.push(box(-4.25,cy-.55,base,-3.1,cy+.55,9.65));
 let tower=union([hull([...ring3(circle(c,1.0,8,Math.PI/8),8.8),...ring3(poly,10.4)]),prism(poly,10.35,23.3)]);
 const wc=[];for(const z of [11.7,16.1,20.5])for(const deg of [180,cy<0?270:90])wc.push(place(box(1.46,-.55,z,2.5,.55,z+1.75),{at:[...c,0],deg}));
 parts.push(tower.subtract(union(wc)),spire(c,2.3,23.25,31.25,8,Math.PI/8));
}
// Rechthoekige oostelijke trapkoker tot onder de stadszijdetoren.
parts.push(box(-4.55,3.15,base,-2.85,5.7,10.5));
// Mezekouw: uitspringende weergang op een steile draagkraag. Ondiep
// reliëf toont de drie spaarbogen; geen vlak vrijhangend balkon.
let mach=union([hull([[7.25,-2.4,12.6],[7.25,2.4,12.6],[7.25,-2.4,15],[7.25,2.4,15],[8.8,-2.4,15],[8.8,2.4,15]]),box(7.25,-2.4,14.95,8.8,2.4,17.1),place(gableRoof(4.9,1.8,17.05,18.05),{at:[8.02,0,0],deg:90})]);
const mc=[];for(const y of [-1.55,0,1.55])mc.push(prism(pointed(.95,16.05,16.65,15.1),8.45,9.1).rotate([90,0,90]).translate([0,y,0]));parts.push(mach.subtract(union(mc)));
// Dakruiter: houten schacht, vier wijzerplaatnissen, vier puntgeveltjes,
// achtkante naald. Windvaan/stang zijn kleiner dan de printbare detailgrens.
const clock=[1.6,.3];let lantern=box(.5,-.8,29.8,2.7,1.4,35.0);
const cc=[];for(const deg of [0,90,180,270])cc.push(place(prism(circle([0,33.2],.88,32),.8,1.3).rotate([90,0,90]),{at:[...clock,0],deg}));
lantern=lantern.subtract(union(cc));parts.push(lantern,spire(clock,1.55,34.95,43.85,8,Math.PI/8));
for(const deg of [0,90,180,270])parts.push(place(prism([[-.75,34.8],[.75,34.8],[0,37.0]],.9,1.85).rotate([90,0,90]),{at:[...clock,0],deg}));
for(const y of [-2.8,2.8])for(const x of [-.55,3.85]){
 let dm=union([box(x-.55,y-.6,25.85,x+.55,y+.6,27.0),place(gableRoof(1.15,1.3,26.98,28.15),{at:[x,y,0],deg:90})]);
 parts.push(dm.subtract(niche(x,y+(y>0?.6:-.6),26.05,.9,.75,y>0?1:-1,'y')));
}
// Het aangebouwde huis deelt BAG 0193100000041732. Contour vereenvoudigd
// per bouwdeel, afzonderlijk zadeldak uit het AHN; naburige BAG-panden blijven.
let annex=union([box(-9.79,4.48,base,-3.6,10.38,7.15),place(gableRoof(6.3,5.85,7.1,11.8),{at:[-6.65,7.43,0]})]);
const ac=[];for(const x of [-8.0,-5.9])for(const z of [1.4,4.8])ac.push(niche(x,10.38,z,1.15,1.8,1,'y'));
for(const y of [5.5,7.4,9.3])for(const z of [1.4,4.8])ac.push(niche(-9.79,y,z,1.1,1.8,-1));
parts.push(annex.subtract(union(ac)),prism([[4.48,7.1],[10.38,7.1],[9.65,9.8],[8.2,11.8],[8.2,12.6],[6.7,12.6],[6.7,11.8],[5.2,9.8]],-10.0,-9.5).rotate([90,0,90]));
const shells=union(parts).decompose();
// Een nis achter een aansluitend bouwdeel mag geen afgesloten binnenholte
// worden. Behoud de verbonden buitenhuid en vul zulke kleine binnenholtes.
const outside=shells.filter(m=>m.volume()>0);
if(outside.length!==1 || shells.some(m=>m.volume() < -1.1))throw Error('Onverwacht los bouwdeel of grote binnenholte');
const model=outside[0];
await writeLandmark({slug,base,nodes:[['building:poort, vier hoektorens, dakruiter en aangebouwd huis',model]],catalog:{
 name:'Sassenpoort (Zwolle)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-7,-6],[-5,0],[12,0],[5,-11]],replacesBuildings:['NL.IMBAG.Pand.0193100000041732'],
 description:'Sassenpoort met ronde veldtorenvoeten, achtkante bovenbouw, uitgekraagde stadszijdetorens, schilddak, weergang met kantelen, mezekouw, dakruiter en het aangebouwde huis in hetzelfde BAG-pand. Onderkant .8 m onder straat; gewelf steil vereenvoudigd voor 1:1000.',
 realWorld:{groundNapM:ground,clockTipM:43.85,fieldSpireM:33.45,citySpireM:31.25,roofRidgeM:30.32,schattingen:['torenspitsen en dakruiter boven de hoogste AHN-rasterpunten naar spitsvlakken en fotos geëxtrapoleerd','vensters, spaarbogen, kantelen, dakkapellen, kraagstenen en huisgevel uit fotos en historische doorsneden vereenvoudigd','doorgaand gewelf en mezekouwkraag steil gemaakt; windvanen, raamroeden en beeldhouwwerk onder .9 m weggelaten']},
 sources:['PDOK BAG WFS 0193100000041732, actuele orthoHR en AHN DSM/DTM .5 m bbox 203040,502660,203150,502770; 2026-10-09','https://www.dbnl.org/tekst/kuil005noor01_01/kuil005noor01_01_0016.php (Ter Kuile, fig.21, plattegronden en dwarsdoorsneden)','https://monumentenregister.cultureelerfgoed.nl/monumenten/41788','https://commons.wikimedia.org/wiki/File:Sassenpoort_in_Zwolle.jpg','https://commons.wikimedia.org/wiki/File:Exterieur_Sassenpoort_-_Zwolle_-_20228707_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Sassenpoort,_stadszijde_-_Zwolle_-_20228716_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Zwolle_-_Sassenpoort_v1.jpg']
}});console.log('ondervlakken',JSON.stringify(downFaces(model,base)));
