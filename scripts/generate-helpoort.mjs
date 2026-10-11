// Helpoort: BAG-plattegrond, twee asymmetrische dakvlakken en ronde/D-vormige torens.
import{Manifold,box,prism,circle,hull,ring3,union,place,gableRoof,writeLandmark}from'./efteling-kit.mjs';
const O=[176641.15,317347.25],q=Math.hypot(.9985,.0548),A=[.9985/q,.0548/q],BASE=-.25,NAP=48.0;
const G={front:-4.3,rear:4.2,eaveFront:14.72,eaveRear:10.28,ridgeY:-2.6,ridge:16.1,towerEave:17.35,peaks:[21.00,20.719],wall:3.10};
const pointed=(x,y0,y1,width,spring,top)=>hull([[x-width/2,y0,BASE-.1],[x+width/2,y0,BASE-.1],[x-width/2,y1,BASE-.1],[x+width/2,y1,BASE-.1],[x-width/2,y0,spring],[x+width/2,y0,spring],[x-width/2,y1,spring],[x+width/2,y1,spring],[x,y0,top],[x,y1,top]]);
const passage=pointed(0,-5,5,4,1.1,3.957);
// Een ongelijk zadeldak: korte veldhelling, lange stadshelling, geen DSM-lagen.
const walls=box(-3.7,G.front,BASE,3.5,G.rear,G.eaveRear);
const roof=hull([...ring3([[-3.7,G.front],[3.5,G.front],[-3.7,G.rear],[3.5,G.rear]],G.eaveRear),[-3.7,G.front,G.eaveFront],[3.5,G.front,G.eaveFront],[-3.7,G.ridgeY,G.ridge],[3.5,G.ridgeY,G.ridge]]);
let gate=union([walls,roof]).subtract(passage);
// Ronde monden zijn ondiepe nissen; daarachter loopt de printbare spitse tunnel.
for(const [y,back]of[[-4.3,false],[4.2,true]]){const y0=back?y-.35:y-.25,y1=back?y+.25:y+.35;const mouth=union([box(-2.2,y0,BASE-.1,2.2,y1,1.1),Manifold.cylinder(y1-y0,2.2,2.2,48).rotate([90,0,0]).translate([0,y1,1.1])]);gate=gate.subtract(mouth);}
const cuts=[];for(const x of[-1.65,0,1.65]){cuts.push(box(x-.5,-4.5,10.0,x+.5,-3.95,11.5));cuts.push(box(x-.45,-4.5,12.4,x+.45,-3.95,13.8));}
for(const x of[-2.1,-.7,.7,2.1])for(const z of[5.55,7.15,9.0])cuts.push(box(x-.5,3.85,z,x+.5,4.5,z+(z===9?1.0:1.35)));
for(const x of[-3.7,3.5])for(const z of[4.5,9.3])cuts.push(box(x-.35,.1,z,x+.35,1.0,z+1.5));gate=gate.subtract(union(cuts));
// Lijsten, drie driehoekige veldvensterkappen, achtervensterkader.
const details=[box(-3.75,-4.45,14.12,3.55,-4.0,14.5),box(-2.75,4.05,5.1,2.75,4.48,5.45),box(-2.75,4.05,8.6,2.75,4.48,8.95),box(-3.7,4.05,9.1,3.5,4.45,9.45)];
for(const x of[-1.65,0,1.65])details.push(hull([[x-.65,-4.48,11.5],[x+.65,-4.48,11.5],[x-.65,-4.02,11.5],[x+.65,-4.02,11.5],[x,-4.48,12.1],[x,-4.02,12.1]]));
// Mezekouw / houten erker met drie brede blinde vensters en 45 graden onderschoor.
let oriel=union([box(-2.1,-5.25,5.7,2.1,-4.0,8.4),hull([[-2.1,-4.1,4.55],[2.1,-4.1,4.55],[-2.1,-5.25,5.7],[2.1,-5.25,5.7],[-2.1,-4.0,5.7],[2.1,-4.0,5.7]]),gableRoof(4.5,1.55,8.35,9.05).translate([0,-4.65,0])]);
oriel=oriel.subtract(union([-1.35,0,1.35].map(x=>box(x-.45,-5.5,7.05,x+.45,-4.9,8.05))));details.push(oriel);
// Dakkapel op de lange stadshelling. De hoge oude schoorsteen ontbreekt in AHN/ortho.
let dormer=union([box(-.6,.0,12.5,.6,1.8,13.7),gableRoof(1.4,2.0,13.65,14.55).translate([0,.9,0])]);dormer=dormer.subtract(box(-.45,1.5,12.75,.45,2.0,13.65));details.push(dormer);
const towers=[];
const dPoly=(x,y,r)=>[...Array.from({length:25},(_,k)=>{const t=Math.PI+Math.PI*k/24;return[x+r*Math.cos(t),y+r*Math.sin(t)]}),[x+r,y+2.1],[x-r,y+2.1]];
for(const [i,x,y,r]of[[0,-4.22,-4.4,1.75],[1,3.65,-4.5,1.78]]){
 const poly=dPoly(x,y,r),cap=dPoly(x,y,r+.22);let t=prism(poly,BASE,G.towerEave);
 const tc=[];for(const deg of[-160,-90,-20])for(const z of[7.2,12.2,15.8])tc.push(place(box(r-.35,-.45,z,r+.5,.45,z+1.2),{deg,at:[x,y,0]}));tc.push(box(x-.45,y+1.75,BASE-.1,x+.45,y+2.4,2.3));t=t.subtract(union(tc));
 const eave=hull([...ring3(poly,G.towerEave-.4),...ring3(cap,G.towerEave)]);
 const cone=hull([...ring3(cap,G.towerEave),[x,y,G.peaks[i]-.45]]);towers.push(union([t,eave,cone,Manifold.sphere(.45,20).translate([x,y,G.peaks[i]-.45])]));
}
// De hele BAG-voetafdruk oostwaarts: weermuur, Jekertoren en korte noordwaartse staart.
const eastPoly=[[5.25,-4.57],[19.55,-4.51],[22.98,-1.25],[22.98,3.10],[17.67,-2.12],[5.25,-1.97]];
let eastWall=prism(eastPoly,BASE,G.wall),westWall=prism([[-10.566,-4.314],[-5.6,-4.59],[-3.8,-2.11],[-10.51,-1.736]],BASE,G.wall);
const battlements=[];for(const x of[7.4,10.3,13.2,16.1,18.8])battlements.push(box(x-.9,-4.57,G.wall-.05,x+.9,-3.6,G.wall+.95));for(const x of[-9.3,-6.5])battlements.push(box(x-.9,-4.35,G.wall-.05,x+.9,-3.4,G.wall+.95));
// Dichte blinde boognis aan stadszijde bij de hoektoren; geen verborgen open overspanning.
eastWall=eastWall.subtract(union([box(17.0,-2.5,BASE-.1,19.3,-1.3,1.25),Manifold.cylinder(.5,1.15,1.15,32).rotate([90,0,0]).translate([18.15,-1.85,1.25])]));
let corner=prism(circle([21.95,-3.6],2.05,48),BASE,11.0);
for(const deg of[-90,0,90,180])for(const z of[4.6,7.3,9.3])corner=corner.subtract(place(box(1.7,-.45,z,2.4,.45,z+1.2),{deg,at:[21.95,-3.6,0]}));
corner=union([corner,hull([...ring3(circle([21.95,-3.6],2.05,48),10.7),...ring3(circle([21.95,-3.6],2.25,48),11.0)]),hull([...ring3(circle([21.95,-3.6],2.25,48),11.0),[21.95,-3.6,15.257]]),Manifold.sphere(.45,20).translate([21.95,-3.6,15.257]),hull([...ring3(circle([21.95,-3.6],2.05,48),8.2),...ring3(circle([21.95,-3.6],2.25,48),8.45),...ring3(circle([21.95,-3.6],2.05,48),8.7)])]);
// Alles één gesloten node: onafhankelijke dakopvulling zou de poorttunnel sluiten.
const whole=union([gate,...details,...towers,eastWall,westWall,...battlements,corner]);
await writeLandmark({slug:'helpoort',base:BASE,nodes:[['building:helpoort-weermuur-en-jekertoren',whole]],catalog:{name:'Helpoort',origin:O,xAxis:A,groundHeight:93.55522083349764,groundOffsetMetres:.03,groundSamplePoints:[[0,-7],[0,7],[-6,-7],[6,-7]],replacesBuildings:['NL.IMBAG.Pand.0935100000106387'],description:'Halfronde veldtorens met vlakke achterkant, ongelijk zadeldak, mezekouw, vensternissen, weermuur met kantelen en Jekertoren. +Y naar Sint Bernardusstraat; poort intern spits 55 graden, ronde mond ondiep. AHN torens circa 21 m verschilt van gepubliceerde 24 m.',realWorld:{groundNapM:NAP,towerTopNapM:[69.000,68.719],towerPublishedHeightM:24,frontEaveM:14.72,rearEaveM:10.28,roofRidgeM:16.1,gateWidthM:4,estimatedGateSpringM:1.1,estimatedGateApexM:3.957,cornerTopNapM:63.707,wallTopNapM:51.10,minimumStructuralPartM:.9},sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/27997','https://www.vestingmuseummaastricht.nl/index.php/museum/vestingmuseum','https://www.zichtopmaastricht.nl/locaties/helpoort','https://commons.wikimedia.org/wiki/Category:Helpoort','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000106387','PDOK BAG/BGT 0935100000106387, AHN DSM/DTM 0,5 m en Actueel_orthoHR, 2026-10-11']}});
