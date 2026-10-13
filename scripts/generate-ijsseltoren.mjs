// IJsseltoren / PPKS, Zwolle, 2006. Voorbeeld generate-evoluon.mjs gelezen.
// Benoemde bouwdelen en doorlopende dakvlakken; geen DSM-hoogtelagen.
import {Manifold,CrossSection,prism,rect,box,union,ccw,writeLandmark} from './efteling-kit.mjs';
const slug='ijsseltoren',ORIGIN=[201150,502550],GROUND=1.2,BASE=-1.2,z=h=>h-GROUND;
const FOOT=[[-82.53,-31.01],[-69.27,-34.48],[-55.8,-37.01],[-42.18,-38.58],[-28.49,-39.18],[-6.5,-38.17],[8.53,-36.09],[23.35,-32.88],[37.89,-28.55],[50.41,-23.66],[60.62,-17.88],[69.88,-10.68],[76.08,-4.43],[84.05,3.85],[30.76,54.58],[22.14,49.26],[24.52,43.81],[20.08,48.02],[3.97,41.93],[-10.1,39.08],[-24.3,38],[-38.74,38.6],[-52.68,40.95],[-48.23,60.18],[-54.85,62.16]];
const HIGH=[[-74.2,-32.04],[-43.1,-36],[-39.11,-2.78],[-67.79,1.52]];
const MIDDLE=[[5.19,-36.62],[19.26,-33.71],[8.81,18.42],[-5.48,15.62]];
const EAST=[[72.17,-5.61],[81.57,5.88],[46.36,39.34],[36.26,28.58]];
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,width,step,height){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.9;s+width<L-.8;s+=step)for(let h=first;h+height<top-.5;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height));}return cuts.length?solid.subtract(union(cuts)):solid;}
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
// Glazen, gebogen concourse en de lagere noordelijke daktuinterrassen.
let podium=facade(prism(FOOT,BASE,z(7.7)),FOOT,2.2,3.1,7.7,1.6,2.7,2.1);
const hallWest=[[-82.53,-31.01],[-74.2,-32.04],[-67.79,1.52],[-49.68,-1.2],[-42,5],[-48.5,34.5],[-52.68,40.95],[-54.85,43]];
const hallCentre=[[-43.1,-36],[-28.49,-39.18],[-6.5,-38.17],[5.19,-36.62],[-2.08,-1.03],[-15,-1.2],[-24.3,38],[-52.68,40.95],[-43,5],[-39.11,-2.78]];
const hallEast=[[19.26,-33.71],[37.89,-28.55],[50.41,-23.66],[60.62,-17.88],[69.88,-10.68],[84.05,3.85],[50.09,36.18],[36.26,28.58],[37.92,19.48],[16.18,5.98],[11.96,2.67]];
// Elke halvleugel heeft één werkelijk hellend dakvlak, tot de gemeten
// concourshoogtes 9,2–16,46 m; de lagere groene terrassen blijven vrij.
function hall(poly){return prism(poly,BASE,1).warp(v=>{const top=z(13.3+.043*(v[1]+8));v[2]=BASE+(v[2]-BASE)/(1-BASE)*(top-BASE);});}
const halls=[hallWest,hallCentre,hallEast].map(p=>facade(hall(p),p,8.4,4.5,12.7,1.6,2.7,2.3));
let high=prism(HIGH,BASE,z(87.982));
// Doorlopende horizontale glasbanden met verticale stijlen op alle kanten.
const bandCuts=[],hp=ccw(HIGH);for(let i=0;i<hp.length;i++){const a=hp[i],b=hp[(i+1)%hp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=17.2;h<85;h+=3.8)for(let s=.85;s+2.65<L-.6;s+=3.55)bandCuts.push(niche(a,b,s,s+2.65,h,h+2.7));}high=high.subtract(union(bandCuts));
let middle=facade(prism(MIDDLE,z(16.9),z(36.806)),MIDDLE,18.2,3.8,36.806,1.7,3,2.1);
let east=facade(prism(EAST,z(16.9),z(44.292)),EAST,18.2,3.8,44.292,1.7,3,2.1);
// De twee lage kantoorstroken rusten op kolommen, geen massieve gevelwand
// onder de eerste kantoorvloer; concourse en daktuinen blijven zichtbaar.
const columns=[];for(const p of [ccw(MIDDLE),ccw(EAST)])for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=2;s<L-1;s+=7.5){const t=[(b[0]-a[0])/L,(b[1]-a[1])/L],x=a[0]+s*t[0]-t[1],y=a[1]+s*t[1]+t[0];columns.push(B(x-.65,y-.65,x+.65,y+.65,6.9,17.2));}}
// Glaskop: gemeten NAP +92,434, met een terugliggend ovaal dakvolume;
// dakruimte tussen dit volume en de buitenste glaswand blijft open.
const crown=prism(HIGH,z(87.85),z(92.434)).subtract(CrossSection.ofPolygons([ccw(HIGH)]).offset(-1).extrude(6).translate([0,0,z(87.7)]));
const oval=Manifold.cylinder(92.434-87.8,10,10,64).scale([1,.95,1]).translate([-55.8,-13.5,z(87.8)]);
const mast=B(-71.4,-15.4,-70.5,-14.5,87.8,95.686);
// Meetbare techniek op de lagere daken en langgerekte lichtstraten van
// het concourse; heel fijne relingen/antennepunten worden niet vrijstaand.
const plantMiddle=B(3,-25,7,-17,36.7,38.2),plantEast=prism([[62,6],[66,10],[59,17],[55,13]],z(44.2),z(45.65));
const lights=[];for(const y of [-21,-7,9]){const pts=[[-38,y],[-18,y-1],[1,y+2],[20,y+6],[35,y+11]];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);lights.push(Manifold.cube([L,1.1,1.05],true).rotate([0,0,Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI]).translate([(a[0]+b[0])/2,(a[1]+b[1])/2,z(13.3+.043*((a[1]+b[1])/2+8))+.35]));}}
let model=union([podium,...halls,high,middle,east,...columns,crown,oval,mast,plantMiddle,plantEast,...lights]);
model=model.setTolerance(.01);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('IJsseltoren niet gesloten/verbonden');
await writeLandmark({slug,base:BASE,nodes:[['building:ijsseltoren-drie-kantoorvolumes-gebogen-concourse-glaskop',model]],catalog:{name:'IJsseltoren',origin:ORIGIN,xAxis:[1,0],groundHeight:42.56070274,groundOffsetMetres:0,groundSamplePoints:[[-20,-52],[29,-55],[99,-6],[50,57]],replacesBuildings:['NL.IMBAG.Pand.0193100000049836'],description:'Volledige IJsseltoren aan de Grote Voort: drie kantoorvolumes met verschillende hoogtes, gebogen glazen concourse, noordelijke daktuinterrassen, daklichtstraten, glaskop met terugliggend ovaal dakvolume en dakmast. Named prisma’s en doorlopende hellende haldakvlakken, geen DSM-lagen.',realWorld:{groundNapM:GROUND,towerRoofNapM:87.982,glassCrownNapM:92.434,mastNapM:95.686,lowerRoofsNapM:[36.806,44.292],estimates:['regelmatige torencontouren en ovaal dakvolume circa 1–2 m uit BAG/AHN en foto’s','gevelritme, vensters en glazen puien uit schuine foto’s, blinde nissen .35 m','concourse-dakhelling .043 en lichtstraatposities uit bronplan/AHN/luchtfoto, circa 1 m onzeker','fijne relingen, reclameletters en dunne antennes smaller dan .9 m weggelaten']},sources:['https://www.trebbe.nl/project/spoolderwerk/ (bouwer, 95.5 m, volledige onderbouw, schuine foto’s uitsluitend referentie)','https://ijsseltoren.nl/ (beheerder en concoursefoto’s)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000049836 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
