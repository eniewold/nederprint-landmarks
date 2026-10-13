// Prinsenhof, atelier PRO / Rijnboutt / Kraaijvanger, 2005–2006.
// Voorbeeld generate-evoluon.mjs gelezen. Vaste benoemde bouwdelen en
// werkelijk afzonderlijke dakvlakken, nooit gestapelde DSM-hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,writeLandmark} from './efteling-kit.mjs';
const slug='prinsenhof-den-haag',ORIGIN=[82965,455108],ANGLE=34.4,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=.5,BASE=-1.2,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const profileY=(p,y0,y1)=>Manifold.extrude([ccw(p)],y1-y0).rotate([90,0,0]).translate([0,y1,0]);
function niche(a,b,s0,s1,h0,h1,depth=.4){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.3],[s0,.3]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,width,step,height,deep=false){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.7,k=0;s+width<L-.45;s+=step,k++)for(let h=first;h+height<top-.4;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height,deep&&L>14&&k===1?1.7:.4));}return cuts.length?solid.subtract(union(cuts)):solid;}
const block=(p,top,type='office')=>facade(prism(p,BASE,z(top)),p,type==='home'?4.4:4.8,type==='home'?3.15:3.6,top,type==='home'?2.1:1.35,type==='home'?3.05:2.55,type==='home'?2.1:2.2,type==='home');
const parts=[];
// Westelijke kantoor-/hotelspine en vier dwarsbeuken. Drie glazen atria
// liggen naast deze spine; de open tuindelen liggen verder oostelijk.
const officeSpine=[[-31.4,-65.8],[-19.9,-65.8],[-19.9,55.9],[-35.7,55.9]];
parts.push(block(officeSpine,23.6));
const officeNorth=rect(-35.9,55.8,-3.1,71.3),officeMiddle=rect(-35.2,10.3,-3.6,25.6),officeSouth=rect(-33.9,-35.6,-4,-20.2);
parts.push(block(officeNorth,56.604),block(officeMiddle,56.616),block(officeSouth,56.586));
const hotel=rect(-31.9,-81.5,-3.5,-65.9),hotelAnnex=rect(-3.6,-81.5,11.1,-65.9);
parts.push(block(hotel,70.582),block(hotelAnnex,56.600));
const northJoin=rect(-3.2,55.65,12.4,71.1);
parts.push(block(northJoin,23.58));
// Vijflaagse woon-werkplint aan de Carolina van Nassaustraat. Geen
// grondplaat binnen de openbare tuinen tussen de dwarsvleugels.
const homeSpine=rect(31.3,-66.25,49.05,70.95);
parts.push(block(homeSpine,17.383,'home'));
const southJoin=rect(-4.1,-35.8,11.8,-20.2),middleJoin=rect(-3.75,9.95,12.45,25.55),northHomeJoin=rect(12.2,55.55,24.1,70.95);
parts.push(block(southJoin,45.270),facade(prism(middleJoin,BASE,z(34.450)),middleJoin,1.15,3.6,34.450,2.3,3.3,2.7),block(northHomeJoin,43.033));
const middleHighJoin=rect(12.35,9.85,24.3,25.4);
parts.push(facade(prism(middleHighJoin,BASE,z(57.324)),middleHighJoin,1.15,3.6,57.324,2.3,3.3,2.7));
// Hellende glasdak-rand naast het middelste verbindingsdeel, van gemeten
// NAP +34,450 naar +36,247. Een doorlopend vlak, geen trap van hoogtelagen.
const glassEdge=[];for(const u of [10.27,12.41])for(const v of [9.95,25.4]){const h=34.450+(u-10.27)/2.14*(36.247-34.450);glassEdge.push([u,v,z(h)],[u,v,z(h-1)]);}parts.push(Manifold.hull(glassEdge));
const homeSouth=[[11.51,-35.74],[31.44,-35.87],[41.94,-35.76],[41.95,-20.96],[11.74,-20.41]];
const homeMiddle=[[24.01,9.88],[42.5,10.31],[42.57,24.63],[31.84,27.66],[31.83,25.28],[24.18,25.33]];
const homeNorth=[[24,55.58],[43.02,55.52],[42.5,70.88],[23.08,70.51],[24.29,62.3],[23.39,61.48],[24.73,58.68]];
parts.push(block(homeSouth,71.513,'home'),block(homeMiddle,71.518,'home'),block(homeNorth,71.542,'home'));
// Liftkernen van de drie woontorens en meetbare techniek op de plint.
parts.push(B(26.28,-31.57,32.37,-25.96,71.35,76.203),B(26.42,13.27,32.90,19.74,71.35,76.223),B(26.66,59.72,33.21,65.6,71.35,76.193));
for(const [a,b,c,d,h] of [[38,-59.4,42.3,-57.4,20.136],[38.1,-13.9,43,-11.6,20.104],[37.7,-43.9,42.8,-41.3,20.130],[38,2,43.1,4.9,20.072],[38.8,31.7,43.6,34.4,20.100],[38.1,47.4,44.2,49.6,20.078]])parts.push(B(a,b,c,d,17.25,h));
// Alle meetbare kantoorinstallaties; de lage .78 m hotelkast is breder
// dan .9 m en blijft als een afzonderlijk vast bouwdeel leesbaar.
for(const [a,b,c,d,h,base] of [[-30.5,-29.5,-28.7,-26.6,57.939,56.45],[5.8,-74.3,8.3,-68.8,57.668,56.45],[-33.4,58.7,-20.8,60.8,58.147,56.45],[-19.8,65.7,-16.4,68.4,58.753,56.45],[-33.4,65.9,-20.8,68.1,58.146,56.45],[-14.5,65.9,-11.3,68.1,58.728,56.45],[-19.9,58.6,-7.2,60.8,58.145,56.45],[-14.5,-74.8,-9.8,-69.3,71.361,70.45],[-3.7,-70,2.8,-68,57.798,56.45]])parts.push(B(a,b,c,d,base,h));
// Dubbeltoren aan de Schenkkade: twee hoge brick-schijven, met een
// terugliggend glazen middenstuk. De verschillende dakvlakken zijn gemeten.
const twinSouth=rect(10.9,-104.05,48.1,-88.6),twinNorth=rect(10.85,-81.55,48.2,-66.1),twinGlass=rect(13.7,-88.8,45.3,-81.4);
parts.push(block(twinSouth,95.555),block(twinNorth,95.539),facade(prism(twinGlass,BASE,z(102.456)),twinGlass,4.7,3.6,102.456,2.3,3.3,2.7));
// Dakmastvoeten uit 3D BAG en de hogere tips uit het lokale AHN, niet
// uit de maximale hoogte van naburige gebouwen in de hele onderzoeksuitsnede.
parts.push(prism([[17,-83.83],[17.08,-86.38],[19.76,-84.35]],z(102.3),z(110.332)),prism([[37.75,-84.21],[37.98,-86.67],[42.06,-85.9],[40.93,-84.21]],z(102.3),z(110.321)));
parts.push(Manifold.cylinder(117.778-110.2,.7,.5,32).translate([18.3,-84.8,z(110.2)]),Manifold.cylinder(117.594-110.2,.7,.5,32).translate([39.5,-85.3,z(110.2)]));
// Drie glaskappen boven echte binnenhoven: dakschalen met drie zadeldak-
// beuken op kolommen, beide glaspuien hebben een open spitse entree.
for(const [y0,y1] of [[-65.8,-35.6],[-20.2,10.1],[25.4,55.8]]){
 const x0=-19.9,x1=-6.8;
 for(let k=0;k<3;k++){const a=x0+(x1-x0)*k/3,b=x0+(x1-x0)*(k+1)/3,m=(a+b)/2;parts.push(profileY([[a,z(11.95)],[m,z(13.35)],[b,z(11.95)],[b,z(12.95)],[m,z(14.35)],[a,z(12.95)]],y0,y1));}
 for(const u of [-19.5,-15.5,-11.3,-7.2])for(let v=y0+.5;v<y1;v+=4.5)parts.push(B(u-.5,v-.5,u+.5,v+.5,.2,12.5));
 for(const v of [y0,y1-.95]){
  const p=rect(x0,v,x1,v+.95);let glass=facade(prism(p,BASE,z(12.95)),p,1.15,3.25,12.95,2.1,3.1,2.2);
  const doorway=profileY([[-14.8,BASE-1],[-11.8,BASE-1],[-11.8,z(2.9)],[-13.3,z(5.05)],[-14.8,z(2.9)]],v-.2,v+1.2);
  parts.push(glass.subtract(doorway));
 }
}
let model=union(parts).setTolerance(.01);
// Verwijder alleen gesloten negatieve CSG-snijnissen; de via de entrees
// verbonden binnenhoven en open tuindelen houden hun werkelijke opening.
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Prinsenhof niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:prinsenhof-kantoren-hotel-woontorens-open-tuinen-glaskappen-en-dubbeltoren',model]],catalog:{name:'Prinsenhof',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:43.97555392,groundSamplePoints:[[82912,455131],[83030,455163],[83071,455043]].map(local),replacesBuildings:['NL.IMBAG.Pand.0518100000267537','NL.IMBAG.Pand.0518100000352973','NL.IMBAG.Pand.0518100000207900'],description:'Volledige Prinsenhof: kantoor- en hotelbeuken, drie woonvolumes met loggiavelden, complete vijflaagse woon-werkplint en aansluitvleugels, open tuindelen, drie holle glaskappen met spitse entrees en kolommen, gemeten dakliftkernen/techniek, twee hoge schijven en glazen middenstuk met dakmasten; vaste bouwprisma’s en dakschalen, geen DSM-lagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,officeRoofsNapM:[56.604,56.616,56.586],hotelRoofNapM:70.582,homeRoofsNapM:[71.513,71.518,71.542],homeCoresNapM:[76.203,76.223,76.193],twinRoofsNapM:[95.555,95.539],twinGlassNapM:102.456,mastBasesNapM:[110.332,110.321],mastTipsNapM:[117.778,117.594],estimates:['regelmatige vaste bouwplannen uit BAG/3D BAG tot .5–1m vereenvoudigd, dunne meetruisstroken kleiner dan .9m weggelaten','vensters, kantoor-/woonritme, loggiaposities en diepte1.7m uit architectfoto’s geschat','glaskappen hebben drie zadeldakbeuken: goot12.95/ridge14.35 en kolommen-/glaspui-indeling geschat rond gemeten gemiddelde12.85, circa1m onzeker','dakcontouren en apparatuurkasten vereenvoudigd op gemeten hoogtes, dakmastenboven110.3 naarcirca117.6–117.8 uitlokaleAHN; schachtbreedte1.4→1.0m voorprint verdikt','fijne glasroedes, lamellen, dakrelings, daktuingroen en masttuien smaller dan .9m weggelaten; geen garage-/tuinplaat']},sources:['https://www.atelierpro.nl/projecten/prinsenhof (architect, volledige kantoren/hotel/atria, primaire buitenfoto’s alleenreferentie)','https://rijnboutt.nl/portfolio/prinsenhof/ (architect, drie woontorens en woon-werkplint)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000267537 (TU Delft/3DGI,CC BY4.0)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000352973 (TU Delft/3DGI,CC BY4.0)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000207900 (TU Delft/3DGI,CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
