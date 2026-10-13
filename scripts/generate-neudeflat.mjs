// Neudeflat / Maaskant 1961–1963, transformatie A3 2017.
// Voorbeeld generate-evoluon.mjs gelezen. Benoemde prisma’s en dakvlakken.
import {Manifold,prism,rect,box,union,ccw,writeLandmark} from './efteling-kit.mjs';
const slug='neudeflat',ORIGIN=[136544,456074],GROUND=3.8,BASE=-1.2,z=h=>h-GROUND;
const FOOT=[[-10.75,-9.85],[-8.52,-8.35],[4.25,-11.56],[6.61,-7.65],[6.37,-7.38],[13.53,6.98],[10.06,12.32],[-10.74,10.56],[-11.67,3.99],[-13.38,4.24],[-14.08,-1],[-12.38,-1.24],[-12.6,-2.83],[-11.32,-4.72],[-12.96,-6.58]];
const MAIN=[[-12.15,-2.42],[-8.51,-8.34],[4.25,-11.56],[6.03,-7.85],[13.53,6.98],[10.06,12.32],[-10.28,10.61]];
const CORE=[[-11.84,-3.01],[-11.15,-5.18],[-8.27,-8.23],[-3.83,-5.23],[.43,-5.62],[.91,-3.64],[-6.23,6.71],[-7.25,.46],[-7.95,.93],[-10.71,-1.87],[-12.56,-2.58]];
function niche(a,b,s0,s1,h0,h1,depth=.4){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.35],[s0,.35]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function glass(solid,poly,first,pitch,top,width,step,height){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.55;s+width<L-.4;s+=step)for(let h=first;h+height<top-.45;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height));}return solid.subtract(union(cuts));}
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
// Gehele commerciële voet, inclusief lage entree aan de westzijde.
const foot=glass(prism(FOOT,BASE,z(8.411)),FOOT,4.6,4,8.411,2,2.9,2.7);
let body=glass(prism(MAIN,BASE,z(59.051)),MAIN,12.5,3.2,59.051,4.5,5.05,2.05);
// Diepe balkons/serres op de smalle Neude-kop en aan de andere kop,
// als blinde nissen in doorlopende bouwvolumes; geen losse hoogtelagen.
const balconyCuts=[];for(const [a,b] of [[[13.53,6.98],[10.06,12.32]],[[-12.15,-2.42],[-8.51,-8.34]]]){const L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=12.5;h+2.05<58.8;h+=3.2)balconyCuts.push(niche(a,b,.45,L-.45,h,h+2.05,2.0));}body=body.subtract(union(balconyCuts));
// De grote westelijke dak-/liftopbouw is gemeten op NAP +61,656.
const core=glass(prism(CORE,BASE,z(61.656)),CORE,12.5,3.2,58.9,1.8,2.7,1.85);
// Hoekbalkons in de westelijke opbouw sluiten aan op de achtergevel.
const a=CORE[1],b=CORE[2],L=Math.hypot(b[0]-a[0],b[1]-a[1]);const rearCuts=[];for(let h=12.5;h+2.05<58.8;h+=3.2)rearCuts.push(niche(a,b,.35,L-.35,h,h+2.05,1.6));
let model=union([foot,body,core.subtract(union(rearCuts))]);
// Glazen commerciële etages en terugliggende entree langs de zuidzijde.
const lowCuts=[];const p=ccw(MAIN);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.55;s+2.1<L-.4;s+=3)for(const h of [4.65,8.35])lowCuts.push(niche(a,b,s,s+2.1,h,h+2.7,.5));}model=model.subtract(union(lowCuts));
// Grote meetbare dakventilatiekasten op het platte hoofdvlak. Kleine
// schoorsteenpunten en het dunne stalen dakframe zijn niet vrijstaand.
const plants=[[2.55,7.35,59.711],[-1.75,4.75,59.439],[6.15,1.95,59.641],[2.25,-1.15,59.702]].map(([x,y,h])=>B(x-.65,y-.65,x+.65,y+.65,58.95,h));
model=union([model,...plants]).setTolerance(.005);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Neudeflat niet gesloten/verbonden');
await writeLandmark({slug,base:BASE,nodes:[['building:neudeflat-wigvormige-toren-glasbanden-serres-en-dakopbouw',model]],catalog:{name:'Neudeflat',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,groundHeight:47.22958266,groundSamplePoints:[[10,23],[30,8],[9,-17],[-17,-13]],replacesBuildings:['NL.IMBAG.Pand.0344100000048613'],description:'Huidige Neudeflat na transformatie A3 in 2017: volledige wigvormige toren, commerciële voet en lage westentree, horizontale glasbanden, diepe kopbalkons/serres en achterste balkonvelden, afzonderlijke hoge westelijke dakopbouw en ventilatiekasten; doorlopende bouwprisma’s en platte daken, geen DSM-lagen.',realWorld:{groundNapM:GROUND,mainRoofNapM:59.051,roofCoreNapM:61.656,lowEntranceNapM:8.411,storeyM:3.2,estimates:['regelmatige wigvormige toren- en dakplannen uit BAG/3D BAG vereenvoudigd circa .5–1m','glasbanden, commerciële puien, balkons en serres uit gevelbouwersfoto’s: verdiepingsritme3.2m, diepe nissen2.0/1.6m geschat','vier dakventilatiekasten gemeten NAP59.439–59.711, contouren circa1.3m uit luchtfoto/AHN vereenvoudigd, circa .5m onzeker','dunne dakframebalken, balustrades, kozijnroedes en kleinere dakpunten smaller dan .9m weggelaten']},sources:['https://facedo.nl/portfolio-item/transformatie-neudeflat/ (gevelbouwer, huidige buitenfoto’s en transformatie2017, uitsluitend referentie)','https://www.a3architecten.com/nieuws-neudeflat/ (architect, nieuwe balkons/serres en kozijnen)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000048613 (TU Delft/3DGI, CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
