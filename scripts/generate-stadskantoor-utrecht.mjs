// Stadskantoor Utrecht, Kraaijvanger (Dirk Jan Postel / Christian Müller).
// Voorbeeld generate-evoluon.mjs gelezen. Benoemde prisma's, gevelvlakken,
// H-vorm en printonderschalen; geen gestapelde hoogtelagen.
// BAG/AHN CC0; dakmaten TU Delft/3DGI 3D BAG, CC BY4.0.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='stadskantoor-utrecht',ORIGIN=[135870,455736],ANGLE=29.67,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=2.47,BASE=-.7,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const northTop=[[-20.9,13.71],[-10.84,13.74],[-9.41,12.08],[-7.75,13.74],[26.78,13.84],[26.78,41.47],[-20.5,41.47]];
const northShoulder=rect(-20.9,6.9,26.78,41.47);
const southTop=[[-21.29,-51.62],[19.67,-51.62],[19.62,-24.7],[-5.25,-23.56],[-6.31,-23.33],[-21.27,-23.35]];
const southShoulder=[[-21.29,-51.62],[26.64,-51.62],[26.74,-23.6],[21.23,-17.3],[-21.27,-17.3]];
function niche(a,b,s0,s1,h0,h1,depth=.4){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.45],[s0,.45]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,width=2.7,step=4.0,height=2.0){const cuts=[],p=ccw(poly);for(let k=0;k<p.length;k++){const a=p[k],b=p[(k+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.75;s+width<L-.3;s+=step)for(let h=first;h+height<top-.3;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height));}return solid.subtract(union(cuts));}
// Noordtoren gaat tot de drielaagse garage; de zuidtoren staat boven de
// stationsterminal. Dakcontouren zijn gemeten, de twee schuine gevels zijn
// echte doorlopendevlakken tussen schouder en dak, geen trapvorm.
let north=union([prism(northShoulder,BASE,z(55.353)),Manifold.hull([...ring3(northShoulder,z(55.34)),...ring3(northTop,z(92.45))])]);
let south=Manifold.hull([...ring3(southShoulder,z(33.0)),...ring3(southShoulder,z(55.41)),...ring3(southTop,z(92.439))]);
north=facade(north,northShoulder,12.0,3.6,91.9);
south=facade(south,southShoulder,34.8,3.6,91.9);
// Raamnissen volgen ook de gekantelde gevelvlakken; geen lege schuine wand.
const slopeCutsNorth=[],slopeCutsSouth=[];
for(let h=58.0;h+2<92;h+=3.6){
 const y0=6.9+6.84*(h-55.34)/37.11,y1=6.9+6.84*(h+2-55.34)/37.11;
 for(let u=-19;u+2.7<25;u+=4)slopeCutsNorth.push(Manifold.hull([[u,y0-.45,z(h)],[u+2.7,y0-.45,z(h)],[u,y0+.4,z(h)],[u+2.7,y0+.4,z(h)],[u,y1-.45,z(h+2)],[u+2.7,y1-.45,z(h+2)],[u,y1+.4,z(h+2)],[u+2.7,y1+.4,z(h+2)]]));
 const x0=26.64-6.97*(h-55.41)/37.029,x1=26.64-6.97*(h+2-55.41)/37.029;
 for(let v=-50;v+2.7<-26;v+=4)slopeCutsSouth.push(Manifold.hull([[x0-.4,v,z(h)],[x0+.45,v,z(h)],[x0-.4,v+2.7,z(h)],[x0+.45,v+2.7,z(h)],[x1-.4,v,z(h+2)],[x1+.45,v,z(h+2)],[x1-.4,v+2.7,z(h+2)],[x1+.45,v+2.7,z(h+2)]]));
}
north=north.subtract(union(slopeCutsNorth));south=south.subtract(union(slopeCutsSouth));
// H-vormige middenzone: twee afzonderlijke gevelvleugels om het atrium,
// dak55.353/55.412NAP, met boven de glasvloer een echte open binnenhof.
const westPlan=rect(-17.81,-17.33,-6.32,6.96),eastPlan=[[11.91,-16.8],[21.23,-17.3],[26.74,-23.6],[26.78,6.9],[11.13,6.13]];
let west=facade(prism(westPlan,z(32.8),z(55.353)),westPlan,34.8,3.6,55.3);
let east=facade(prism(eastPlan,z(32.8),z(55.412)),eastPlan,34.8,3.6,55.35);
// Gekromde publiekshalgevel aan Mineurslaan, glasbanden en toegangspui.
const glassFront=[[-21.26,-18.06],[-19.92,-17.35],[-6.32,-17.24],[-6.32,12.1],[-9.41,12.08],[-11.14,10.36],[-14.8,10.25],[-19.53,8.09],[-20.49,2.93],[-21.03,-9.0]];
let hall=prism(glassFront,z(10.2),z(32.9));
const glassCuts=[];for(let h=11.8;h<31;h+=4.0)for(let v=-16;v<7;v+=4.2)glassCuts.push(B(-21.65,v,-20.15,v+3.0,h,h+2.85));hall=hall.subtract(union(glassCuts));
// Glasdak36.309NAP. De ruimte eronder blijft hol; aangesloten45-graden
// onderschalen rusten aan beide zijden op de hal/carrévleugels.
const atriumPlan=rect(-6.8,-16.8,12.24,10.12),atriumRoof=prism(atriumPlan,z(35.309),z(36.309));
const atriumSupports=[Manifold.hull([...ring3(rect(-7.0,-16.8,-6.2,10.12),z(26.0)),...ring3(rect(-7.0,-16.8,1.8,10.12),z(35.4))]),Manifold.hull([...ring3(rect(11.7,-16.8,12.5,10.12),z(26.0)),...ring3(rect(3.2,-16.8,12.5,10.12),z(35.4))])];
const panes=[];for(let v=-15.5;v<9;v+=4.3)panes.push(B(-6.8,v,12.24,v+.9,36.2,36.8));
// Drie hoofdsteunpunten (bron Staalprijs); posities onder de zuidtoren uit
// foto's geschat. De printkragen zijn afzonderlijke schuine draagvlakken.
const columns=[];
for(const [u,v,plan] of [[-17,-46,rect(-21.29,-51.62,-5.0,-33.5)],[21,-45,rect(-5.1,-51.62,26.64,-33.5)],[2,-23,southShoulder]]){
 columns.push(B(u-1.25,v-1.25,u+1.25,v+1.25,2.3,33.15));
 const inset=plan.map(([x,y])=>[u+(x-u)*.1,v+(y-v)*.1]);
 columns.push(Manifold.hull([...ring3(inset,z(10.0)),...ring3(plan,z(33.0))]));
}
// Schuine witte geveldiagonalen op de pixelramen. Volle stroken van1.1m
// blijven aan de gevel verbonden en laten het X-verband ook in print zien.
const eastFace=h=>26.64+(19.67-26.64)*Math.max(0,(h-55.41)/(92.439-55.41));
const southGapFace=h=>-17.3-7.4*Math.max(0,(h-55.41)/(92.439-55.41));
function beam(a,b,width=1.1){const follow=p=>p[1]<-17.3?[p[0]>20?eastFace(p[2])-.1:p[0],Math.min(p[1],southGapFace(p[2])-.3),p[2]]:p;a=follow(a);b=follow(b);return Manifold.hull([Manifold.cube([width,width,width],true).translate([a[0],a[1],z(a[2])]),Manifold.cube([width,width,width],true).translate([b[0],b[1],z(b[2])])]);}
const braces=[];
for(const u of [-20.9,26.5])for(const [a,b,h0,h1] of [[14,40.5,57,82],[14,40.5,67,91]])braces.push(beam([u,a,h0],[u,b,h1]),beam([u,a,h1],[u,b,h0]));
for(const u of [-21.29,26.5])for(const [a,b,h0,h1] of [[-50.5,-19.5,35,54],[-50.5,-24,58,84]])braces.push(beam([u,a,h0],[u,b,h1]),beam([u,a,h1],[u,b,h0]));
for(const v of [-51.62,41.47])for(const [h0,h1] of [[57,81],[67,91]])braces.push(beam([-19.8,v,h0],[19.0,v,h1]),beam([-19.8,v,h1],[19.0,v,h0]));
// Diagonalen op de verbindingszone, met brede glasvelden in de publieke hal.
braces.push(beam([-18.0,-17.2,34],[-18.0,7.0,54]),beam([-18.0,-17.2,54],[-18.0,7.0,34]));
const machinery=[B(-13.95,20.82,-3.1,34.18,92.3,96.469),B(5.78,-44.11,16.65,-30.03,92.3,96.457),B(-4,22.0,1,26.4,92.3,97.8)];
// Het noordelijke ventilatieveld en de zichtbare ronde ventilatorkoppen.
// Hoogteveld94.077NAP is gemeten; ventilatoren uit ortho op.9m verdikt.
machinery.push(B(12.58,19.6,18.42,34.11,92.3,94.077));
for(const [u,v,h] of [[-12,24,96.469],[-8,24,96.469],[-12,28,96.469],[-8,28,96.469],[-12,32,96.469],[-8,32,96.469],[8,-40,96.457],[14,-40,96.457],[8,-35,96.457],[14,-35,96.457]])machinery.push(Manifold.cylinder(.9,.65,.65,24).translate([u,v,z(h-.02)]));
// De garage en haar westelijke plintrand vormen echte gebouwvolumes.
const garage=union([B(-20.9,6.9,26.78,41.47,1.77,10.32),B(-24.31,-9.0,-20.7,41.47,1.77,10.509)]);
// Draagstroken aan de binnengevel koppelen de glasdakonderschalen aan de
// echte onderbouw; geen vloer op openbare stationsruimte.
const supports=[B(-7.1,-16.8,-6.2,13.0,10.2,33.0),B(11.7,-16.8,12.6,7.0,10.2,33.0)];
let building=union([north,south,west,east,hall,atriumRoof,...atriumSupports,...panes,...columns,...braces,...machinery,garage,...supports]).trimByPlane([0,0,1],BASE);
building=Manifold.compose(building.decompose().filter(part=>part.volume()>0));
// Stadstrappen naar de eigen ingang. Acht grovere treden (ca1m stijging)
// volgen de echte toegang; de rest van het Stadsplateau blijft terrein.
const stairs=[];for(let k=0;k<8;k++){const u0=-38+(14*k)/8,u1=-38+(14*(k+1))/8;stairs.push(B(u0,-8,u1,7,1.77,2.47+(10.35-2.47)*(k+1)/8));}
const steps=union(stairs);
if(building.status()!=='NoError')throw Error('Stadskantoor niet gesloten');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:stadskantoor-h-vorm-diagonalen-en-glashal',building],['road:stadskantoor-toegangstrappen',steps]],catalog:{name:'Stadskantoor Utrecht',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:45.86565235,groundSamplePoints:[[135855,455684],[135828,455717],[135834,455769],[135886,455776]].map(local),replacesBuildings:['NL.IMBAG.Pand.0344100000135173'],description:'H-vormig Stadskantoor met twee gemeten afgeschuinde torens, dakinstallaties, witte diagonalen en pixelvensters, twee carrévleugels, holle glasdakzone, gekromde publiekshalgevel, garageplint, drie geschatte zuidkolommen met printunderschaal en aparte toegangstrappen. Utrecht Centraal en WTC blijven eigen panden. RD135870/455736, as29.67graden, z0NAP2.47m; Stadsplateau circa10.3NAP.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofsNapM:[92.45,92.439],machineryNapM:[96.469,96.457,97.8],courtyardRoofsNapM:[55.353,55.412],atriumRoofNapM:36.309,garageNapM:10.509,estimates:['schouder55.35NAP en zuidonderkant33.0NAP uit opstand en foto, binnengevelhellingen vanuit gemeten topcontouren opgebouwd','witte diagonalen1.1m breed en raamvelden2.7bij2.0m op3.6m steek uit foto geschat; glasfront en drie hoofdkolomposities circa1m onzeker','glaskapruimte en zuidonderhang houden hun vrije onderzijde, vaste45-graden printkragen veranderen de lagere vrije ruimte','toegangstrappen8grove treden naar10.35NAP, plaats/wijdte uitluchtfoto geschat; geen algemeen pleinplateau','installatiehoofdvolumes en noordelijkeventilatieveld94.077NAP gemeten;10ventilatorkoppen uitorthofoto geschat en tot.9m verdikt, dunne geleframes/roosters onder.9m weggelaten']},sources:['https://www.nationalestaalprijs.nl/project/stadskantoor-utrecht (constructie,driehoofdkolommen)','https://www.staalmakers.nl/projecten/stadskantoor-utrecht/ (uitvoerende staalbouwer)','https://www.octatube.nl/project-item/projectitem/167-stadskantoor-utrecht.html (glasgevelleverancier)','https://www.architectuur.org/bouwwerk/690/Stadskantoor_Utrecht.html','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000135173 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:Stadskantoor_Utrecht._(18148413504).jpg (FaceMePLS,CC BY2.0)','https://commons.wikimedia.org/wiki/File:Stadskantoor_Utrecht_in_2021.jpg (Choinowski,CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Stadskantoor_Utrecht_(oktober_2014)_1.jpg (Victor van Werkhooven,CC BY3.0)']}});
