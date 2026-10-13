// Weenatoren, Klunder 1990/1991. Voorbeeld Evoluon gelezen.
// Ronde gevel als Ã©Ã©n prisma en afzonderlijke dakvlakken/kern, geen lagen.
import {Manifold,prism,rect,box,union,ccw,writeLandmark} from './efteling-kit.mjs';
const slug='weenatoren',ORIGIN=[92249,437705],ANGLE=17.46,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=-.23,BASE=-.7,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const front=[[-13.77,5.16],[-13.77,-7.32],...Array.from({length:25},(_,i)=>{const a=Math.PI+i*Math.PI/24;return [1.25+14.97*Math.cos(a),-7.32+14.97*Math.sin(a)]}),[16.23,5.5]];
const rear=rect(-13.77,5.4,16.23,16.67);
function niche(a,b,s0,s1,h0,h1){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-.38],[s1,-.38],[s1,.5],[s0,.5]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));}
function facade(body,poly,first,top,pitch){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<.1)continue;const count=Math.max(1,Math.floor(L/2.9)),step=L/count;for(let j=0;j<count;j++)for(let h=first;h+1.9<top-.7;h+=pitch)cuts.push(niche(a,b,j*step+.35,(j+1)*step-.35,h,h+1.9));}return body.subtract(union(cuts));}
let tower=facade(prism(front,BASE,z(97.186)),front,2.6,96.9,3.15);
// Rechte achterste gevels lopen door tot hun eigen gemeten kroonhoogte.
const westShoulder=rect(-13.77,-2.0,-3.6,5.3),eastShoulder=rect(5.9,-2.1,16.23,5.5);
const shoulders=[facade(prism(westShoulder,BASE,z(101.689)),westShoulder,2.6,101.3,3.15),facade(prism(eastShoulder,BASE,z(101.693)),eastShoulder,2.6,101.3,3.15)];
const liftPlan=[[-4.32,-2.12],[-2.98,-10.66],[2.01,-11.73],[4.17,-11.47],[5.42,-10.21],[6.62,-.21],[5.91,3.51],[-3.81,3.77],[-3.63,-2.12]];
const liftCore=prism(liftPlan,BASE,z(105.38));
let offices=facade(prism(rear,BASE,z(41.449)),rear,2.4,41.0,3.6);
const rearPlant=[B(-6.6,5.0,8.4,9.25,41.3,46.647),B(-1.71,3.7,4.57,7.92,41.3,50.824),B(7.0,10.0,11.0,15.2,41.3,43.147)];
// Dakinstallaties op het halfronde dak, minimaal.9m; geen oude Diamant.
const vents=[B(7,-9,11,-5,97.1,98.77),B(-7,-15,-3,-12,97.1,98.3)];
// Dubbelhoge glasentree en donkere plint op de afgeronde Weenazijde.
const entrance=union([B(-3,-23,5,-21.3,.5,6.8),B(-14.3,-2.5,-13.1,2.0,.5,6.8)]);
let model=union([tower,...shoulders,liftCore,offices,...rearPlant,...vents]).subtract(entrance).trimByPlane([0,0,1],BASE);
// Gesloten binnenholtes achter samengevoegde gevelnissen zijn geen materiaal.
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:weenatoren-ronde-ponskaartgevel-kroon-en-kantoorachterbouw',model]],catalog:{name:'Weenatoren',origin:ORIGIN,xAxis:AXIS,groundHeight:43.11189843,groundOffsetMetres:0,groundSamplePoints:[[92229,437684],[92258,437679],[92226,437714]].map(local),replacesBuildings:['NL.IMBAG.Pand.0599100000689019'],description:'Ronde ponskaartgevel, drie gemeten vlakke dakniveaus en centrale liftkroon, rechte achtergevels, volledige eigen lage kantoorachterbouw met techniek en dubbelhoge entreenissen. Geen fictief hellend dak en geen circa2020 verwijderde Diamant.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,roundRoofNapM:97.186,shouldersNapM:[101.689,101.693],coreNapM:105.38,officeRoofNapM:41.449,officePlantNapM:[46.647,50.824,43.147],estimates:['ronde gevelradius14.97m uit BAG/ortho benaderd met24 vlakjes over180graden','vensters.38m diep, circa1.9m hoog op3.15m steek, entreepuien en plint uit schuine fotoâ€™s geschat','techniek op hoofdplatdak98.77gemeten, tweede klein ventilatieveld98.3NAP geschat uit ortho','naastgelegen glazen Weenahuis blijft eigen PDOK-pand; geen gezamenlijke garage/straatplaat vervangen']},sources:['https://movares.com/projecten/weenatoren/ (constructeur,rondeplattegrond)','https://www.bkor.nl/beeld/diamant/ (Diamant rond2020 verwijderd)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000689019 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:Rotterdam_Weena_Tower_1.jpg (Zairon CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Weenatoren_in_Rotterdam.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Rotterdam_-_Weenatoren.jpg (Fred Romero CC BY2.0)']}});
