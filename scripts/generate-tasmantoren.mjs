// Tasmantoren, Wicher van der Wal, 2010. Voorbeelden Evoluon en Malietoren.
// Twee echte plattegronden, verbindingsbrug en dakframe; geen hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='tasmantoren',ORIGIN=[235921,582706],ANGLE=-37.1,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=.6,BASE=-.7,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const west=[[-27.87,-23.54],[-10.2,-23.54],[-1.06,10.58],[-18.69,10.59]],east=rect(14.45,-23.55,31.54,10.58),wing=rect(31.46,-23.54,96.3,-9.92);
function niche(a,b,s0,s1,h0,h1){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-.38],[s1,-.38],[s1,.45],[s0,.45]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(poly,top,first=2.8,pitch=3.12){let body=prism(poly,BASE,z(top));const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);const glass=i===0||i===1;for(let h=first;h+1.9<top-.7;h+=pitch)for(let s=1.0;s+1.9<L-.6;s+=glass?2.85:3.5)cuts.push(niche(a,b,s,s+1.9,h,h+1.9));}return body.subtract(union(cuts));}
let westTower=facade(west,72.796),eastTower=facade(east,72.796),lowWing=facade(wing,16.471,2.8,3.0);
// De brug heeft penthouses; de dakruimte blijft open onder het witte frame.
const bridgePlan=[[-4.7,-1.4],[14.7,-1.4],[14.7,7.9],[-2.1,7.9]];
let bridge=prism(bridgePlan,z(58.2),z(70.1));
const bridgeCuts=[];for(const v of [-1.4,7.9])for(let h=59.3;h<69;h+=3.1)for(let u=-2.8;u+2.4<14;u+=3.3)bridgeCuts.push(B(u,v-.38,u+2.4,v+.38,h,h+1.9));bridge=bridge.subtract(union(bridgeCuts));
// Steile vaste onderschalen onder de brug; het midden van de poort blijft
// meer dan 45m vrij, ook na export. Onderzijde en kraag uit foto's geschat.
const haunches=[Manifold.hull([...ring3(rect(-4.8,-1.3,-3.7,7.8),z(48.8)),...ring3(rect(-4.8,-1.3,5.1,7.8),z(58.3))]),Manifold.hull([...ring3(rect(14.0,-1.3,15.0,7.8),z(48.8)),...ring3(rect(5.0,-1.3,15.0,7.8),z(58.3))])];
const roofFrame=[B(-2.5,-1.1,-1.4,7.8,70.0,72.8),B(13.2,-1.1,14.5,7.8,70.0,72.8)];
function beam(a,b,w=1.0){return Manifold.hull([Manifold.cube([w,w,w],true).translate([a[0],a[1],z(a[2])]),Manifold.cube([w,w,w],true).translate([b[0],b[1],z(b[2])])]);}
for(let u=-1.8;u<14;u+=4)roofFrame.push(beam([u,-1.3,72.1],[u,7.8,72.1]),beam([u,-1.3,70.0],[u+4,7.8,72.1]));
// Lage glazen entree tussen de voeten, geen duplicaat van het landschapsdek.
const lobbyPlan=[[-3.72,1.07],[-2.35,-.66],[14.23,-1.06],[14.03,7.78],[-1.93,7.65]];
let lobby=prism(lobbyPlan,BASE,z(7.771));const lobbyCuts=[];for(let u=-1;u<13;u+=2.8)lobbyCuts.push(B(u,7.4,u+1.9,8.1,1.5,6.8));lobby=lobby.subtract(union(lobbyCuts));
const machines=[B(-11.5,-8.8,-7.5,-4,72.6,74.316),B(16.1,-9.9,19.7,-3.1,72.6,74.339),B(16.3,-18.9,20.1,-15.0,72.6,76.205)];
// Op het lange lage dak staan herkenbare zonnepaneelvelden, op draagkragen.
const solar=[];for(let u=35;u<92;u+=4)solar.push(Manifold.hull([...ring3(rect(u,-21.8,u+2.8,-11.6),z(16.3)),...ring3(rect(u,-21.0,u+2.8,-12.4),z(17.37))]));
let model=union([westTower,eastTower,lowWing,bridge,...haunches,...roofFrame,lobby,...machines,...solar]).trimByPlane([0,0,1],BASE);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:tasmantoren-scheve-torens-open-poort-brug-en-woonvleugel',model]],catalog:{name:'Tasmantoren',origin:ORIGIN,xAxis:AXIS,groundHeight:41.37303118,groundOffsetMetres:0,groundSamplePoints:[[235906,582739],[235873,582696]].map(local),replacesBuildings:['NL.IMBAG.Pand.0014100010982651'],description:'Twee verschillend gerichte torens aan de Regattaweg, penthousebrug met open dakframe en blijvend vrije poort, lage glazen entree en volledige lange woonvleugel met zonnepaneelvelden. Platte gemeten daken en benoemde bouwdelen, geen DSM-hoogtelagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:72.796,wingRoofNapM:16.471,lobbyRoofNapM:7.771,machineryNapM:[74.316,74.339,76.205],estimates:['brugonderkant58.2NAP en open dakruimte boven70.1NAP uit bronfoto’s, circa1–2m onzeker','gevelramen1.9bij1.9m op3.12m laagsteek, glazen serrevelden en entreepuien vereenvoudigd als.38m blinde nissen','vaste45-graden onderschalen maken de hoge brug zonder losse steun printbaar en verkleinen de bovenste poortzone','witte dakframebalken op1m verdikt; zonnepaneelprofielen op16.471NAP dak uit de ortho geschat','lage landschapsplaat rond het gebouw blijft PDOK-terrein; toekomstige Hunzetoren niet opgenomen']},sources:['https://architectenweb.nl/projecten/project.aspx?id=15950 (Solarlux: twee gedraaide torens en triomfboog)','https://nieuwinstad.nl/projects/tasmantoren/','https://www.tasmantoren.nl/contact/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010982651 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:20110521_Tasmantoren_Groningen_NL.jpg (Wutsje CC BY-SA3.0)','https://commons.wikimedia.org/wiki/File:Groningen_Tasmantoren_5.jpg (Zairon CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Tasmantoren_-_vooraanzicht.jpg (Hardscarf CC BY-SA4.0)']}});
