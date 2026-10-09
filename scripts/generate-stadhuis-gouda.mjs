// Huidige toestand na restauratie 1952: BAG-contour, rechte AHN-dakvlakken,
// RCE-foto's en doorsneden Warffemius. Geen DSM-hoogtelagen.
import {box,prism,circle,spire,hull,ring3,gableRoof,place,union,writeLandmark,downFaces} from './efteling-kit.mjs';
const slug='stadhuis-gouda',base=-.8,ground=.1313;
const origin=[108544.65,447248.44],xAxis=[.312,.95008];
const front=-16.867,rear=16.83,left=5.971,right=-5.832;
const eave=12.66,ridge=21.55;
const pointed=(w,z,h)=>[[-w/2,z],[w/2,z],[w/2,z+h*.68],[0,z+h],[-w/2,z+h*.68]];
const archX=(x,y,z,w,h,depth=.4)=>prism(pointed(w,z,h),x-depth,x+.6).rotate([90,0,90]).translate([0,y,0]);
const archY=(x,y,z,w,h)=>prism(pointed(w,z,h),-.4,.65).rotate([90,0,0]).translate([x,y,0]);
const cuts=[];
for(const y of [right,left])for(const x of [-13,-9.3,-5.6,-1.9,1.8,5.5,9.2,12.9])for(const z of [2.4,7.8])cuts.push(archY(x,y,z,1.6,3.3));
for(const x of [front,rear])for(const y of [-3.45,0,3.45])for(const z of [2.3,7.8,12.35])cuts.push(archX(x,y,z,2.1,z>12?3.1:3.65));
const parts=[box(front,right,base,rear,left,eave).subtract(union(cuts)),place(gableRoof(33.72,11.1,eave-.05,ridge),{at:[-.02,-.3,0]})];
// Beide topgevels zijn echte architectonische trapgevels. De dakhellingen
// erachter blijven twee doorlopende vlakken, nooit gestapelde DSM-plakken.
function steppedGable(x,top){
 const h=[12.7,14.55,16.45,18.35,20.25,22.15];
 const p=[[-5.9,eave-.2],[-5.9,h[0]]];
 for(let i=0;i<5;i++){const v=-5.9+(i+1)*.98;p.push([v,h[i]],[v,h[i+1]]);}
 p.push([-.99,top],[.99,top]);
 for(let i=4;i>=0;i--){const v=5.9-(i+1)*.98;p.push([v,h[i+1]],[v,h[i]]);}
 p.push([5.9,h[0]],[5.9,eave-.2]);
 return prism(p,x-.4,x+.4).rotate([90,0,90]);
}
parts.push(steppedGable(front,22.45),steppedGable(rear,23.9));
// De piroen met schildhoudende leeuw: brede voet, compacte sculptuur.
parts.push(box(rear-.5,-.65,23.5,rear+.5,.65,25.1),spire([rear,0],.85,25.05,25.96,8));
// Twee uitkragende achtkante arkels op steile draagkraag.
for(const y of [-5.65,5.65]){
 const c=[front-.18,y],poly=circle(c,1.13,8,Math.PI/8);
 parts.push(hull([...ring3(circle(c,.48,8),7.65),...ring3(poly,9.2)]),prism(poly,9.15,17.55),spire(c,1.33,17.5,25.66,8,Math.PI/8));
 for(const z of [10,13.9])parts.push(box(front-.72,y-.48,z,front-.25,y+.48,z+2));
}
// Vierkante geveltoren met drie loggia-/galmnisniveaus en lange naald.
let tower=box(front-1.1,-1.8,17.3,front+1.8,1.8,26.3);
const tc=[];for(const z of [17.6,20.25,23.5])tc.push(archX(front-1.1,0,z,2.05,2.1,.35));
for(const y of [-1.8,1.8])tc.push(archY(front+.35,y,23.5,1.8,2.1));
parts.push(tower.subtract(union(tc)),box(front-1.23,-1.9,26.15,front+1.95,1.9,27.1),spire([front+.35,0],1.85,27.05,34.35,8,Math.PI/8));
// Pinakels blijven ≥0.9 m breed waar zij boven de gevel uitsteken.
for(const y of [-3.5,3.5])parts.push(box(front-.5,y-.45,15.1,front+.5,y+.45,20.8),spire([front,y],.66,20.75,23.2,4,Math.PI/4));
for(const y of [-1.25,1.25])parts.push(box(front-.4,y-.45,21.8,front+.55,y+.45,25.5),spire([front,y],.65,25.45,27.45,4,Math.PI/4));
// Grote centrale dakkapellen met flankerende kleinere kapelletjes.
for(const y of [-3.65,3.55]){
 let dormer=union([box(-2.25,y-1.4,15.4,2.05,y+1.4,18.65),place(gableRoof(3.5,4.5,18.6,21.5),{at:[-.1,y,0],deg:90})]);
 parts.push(dormer.subtract(archY(-.1,y+(y>0?1.4:-1.4),16.1,1.4,1.9)));
 for(const x of [-11.8,-7.4,7.3,11.7])parts.push(box(x-.55,y-.55,14.5,x+.55,y+.55,17.15),place(gableRoof(1.7,1.15,17.1,18.35),{at:[x,y,0],deg:90}));
}
parts.push(box(-1.05,-1.0,21.4,.45,.45,23.8),box(-1.25,-1.2,23.65,.65,.65,24.32));
// Renaissancebordes en twee trappen: volle draagkern, treden als reliëf.
parts.push(box(-20.2,-1.7,base,front+.15,1.7,3.05));
for(const side of [-1,1]){
 const y0=side<0?-5.65:1.6,y1=side<0?-1.6:5.75;
 const z0=side<0?.15:3.05,z1=side<0?3.05:.15;
 parts.push(hull([[-20.17,y0,base],[-17.6,y0,base],[-20.17,y1,base],[-17.6,y1,base],[-20.17,y0,z0],[-17.6,y0,z0],[-20.17,y1,z1],[-17.6,y1,z1]]));
 for(let i=1;i<=5;i++){const y=y0+(y1-y0)*i/6,z=z0+(z1-z0)*i/6;parts.push(box(-20.15,y-.13,z-.15,-17.65,y+.13,z+.12));}
}
// Klein baldakijn boven de hoofdingang: tegen gevel gedragen en ≥.9m dik.
parts.push(box(-19.05,-1.9,2.9,-18.1,-.95,6.4),box(-19.05,.95,2.9,-18.1,1.9,6.4),place(gableRoof(2.4,4.1,6.3,7.65),{at:[-18.2,0,0]}));
// Schavot: zij- en frontbogen als blinde spitsnissen; de vlakke historische
// korfbogen zouden op 1:1000 dichtgesmeerd worden door de printopvulling.
let scaffold=box(16.65,-4.42,base,22.48,4.61,3.95);
const sc=[];for(const y of [-3.0,0,3.0])sc.push(archX(22.48,y,.3,1.9,2.9,.35));
for(const y of [-4.42,4.61])for(const x of [18,20.9])sc.push(archY(x,y,.3,1.8,2.9));
parts.push(scaffold.subtract(union(sc)));
// Klokken-/poppenspel aan de zuidoosthoek in een compacte gevelkast.
parts.push(box(-15.2,right-.5,7.25,-12.2,right+.15,10.2));
const shells=union(parts).decompose(),outside=shells.filter(m=>m.volume()>0);
if(outside.length!==1||shells.some(m=>m.volume() < -3))throw Error('Los bouwdeel of onverwachte binnenholte');
const model=outside[0];
await writeLandmark({slug,base,nodes:[['building:stadhuis, geveltoren, arkels, trapgevels, bordes en schavot',model]],catalog:{name:'Stadhuis (Gouda)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-23,0],[0,-9],[0,9],[25,0]],replacesBuildings:['NL.IMBAG.Pand.0513100011122752'],description:'Huidige vrijstaande stadhuis met twee trapgevels, geveltoren, arkels, twee grote dakkapellen, één schoorsteen, bordes en schavot; +X langs de nok naar de achtergevel. Bouwdelen en dakvlakken, .8m verzonken voet.',realWorld:{groundNapM:ground,roofEaveM:eave,roofRidgeM:ridge,clockTipM:34.35,orielSpireM:25.66,schattingen:['puntige toppen geëxtrapoleerd boven AHN-rasterpunten; pinakels, vensters, kapelletjes, klokkenkast en beeldhouwwerk vereenvoudigd naar RCE-fotos','schavot als vol volume met blinde nissen, baldakijn op dikke zijsteunen en trappen op volle kern voor 1:1000','windvanen, balusters, roeden en ornamenten smaller dan .9m weggelaten']},sources:['PDOK BAG 0513100011122752, actuele orthoHR, AHN DSM/DTM .5m bbox 108450,447180,108570,447310; 2026-10-09','https://monumentenregister.cultureelerfgoed.nl/monumenten/16843','https://www.dbnl.org/tekst/dens002goud01_01/dens002goud01_01_0015.php (RCE/Denslagen 2001, fig.121, 131 en 134)','https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_en_linker_zijgevel_-_Gouda_-_20359142_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_en_rechter_zijgevel_-_Gouda_-_20359148_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_van_de_achtergevel_met_trapgevel_-_Gouda_-_20379848_-_RCE.jpg']}});
console.log('ondervlakken',JSON.stringify(downFaces(model,base)));
