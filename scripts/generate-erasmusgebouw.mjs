// Erasmusgebouw Nijmegen, 1973. Voorbeeld per rij: generate-achmeatoren.mjs.
// BAG/AHN/PDOK CC0; 3DBAG TU Delft/3DGI CC BY 4.0; foto's Hanno Lans
// CC BY 4.0. Volledige BAG-voet, eigen gevelbanden en werkelijk gebogen haldak.
import {Manifold,CrossSection,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='erasmusgebouw',ORIGIN=[188020,425726],ANGLE=-7.85,rad=ANGLE*Math.PI/180,AXIS=[Math.cos(rad),Math.sin(rad)];
const GROUND=24.1,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,d=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-d],[s1,-d],[s1,.3],[s0,.3]].map(([s,w])=>[a[0]+s*t[0]+w*n[0],a[1]+s*t[1]+w*n[1],h])));}
function glazing(solid,poly,first,pitch,top,bandHeight=1.45){const p=ccw(poly),cuts=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<3)continue;for(let h=first;h+bandHeight<top-.5;h+=pitch){cuts.push(niche(a,b,.5,L-.5,h,h+bandHeight,.32));for(let s=.7;s+1.35<L-.5;s+=1.75)cuts.push(niche(a,b,s,s+1.35,h+.1,h+bandHeight-.1,.45));}}return solid.subtract(union(cuts));}
const TOWER=rect(-11.74,-23.41,13.32,25.35);
let tower=glazing(prism(TOWER,BASE,z(102.455)),TOWER,26.8,3.65,102.455);
// Eigenlijke dakopbouw: lage centrale technische rug en twee hogere liftkernen.
const roofSpine=rect(-3.9,-16.7,5.8,18.1),CORE_S=rect(-3.75,-17.1,5.25,-6.4),CORE_N=rect(-3.58,8.65,5.73,18.1);
let spine=glazing(prism(roofSpine,z(102.4),z(111.367)),roofSpine,103.6,3,111.367,1.2);
const southCore=prism(CORE_S,z(110.9),z(113.388)),northCore=prism(CORE_N,z(110.9),z(113.368));
const sidePlant=B(5.5,5.2,9.35,15.0,102.4,111.37);
// Zuidelijke onderwijsstrip: afzonderlijke vleugels en lagere westkop.
const SOUTH=[[-88.32,-48.71],[-82.18,-48.96],[-83,-40.35],[-43.27,-39.94],[-42.62,-48.34],[-27.9,-48.78],[-27.92,-33.21],[-23.42,-33.24],[-23.44,-32.3],[-73.21,-31.57],[-73.2,-32.75],[-87.63,-32.7],[-88.39,-31.65]];
let south=glazing(prism(SOUTH,BASE,z(36.684)),SOUTH,25.2,3.4,36.684,1.55);
const EAST=[[-21.9,-48.8],[7.02,-48.81],[7.02,-30.75],[1.98,-30.7],[1.92,-41.75],[-22.23,-41.65]];
let east=glazing(prism(EAST,BASE,z(36.696)),EAST,25.2,3.4,36.696,1.55);
const EAST_HIGH=[[-23.44,-32.3],[-23.26,-41.64],[1.92,-41.75],[1.97,-32.97],[-14.84,-32.92],[-14.84,-30.53],[-19.45,-30.49],[-19.43,-32.36]];
let eastHigh=glazing(prism(EAST_HIGH,BASE,z(40.564)),EAST_HIGH,25.2,3.4,40.564,1.55);
const west=glazing(B(-88.45,-32.75,-73.2,-11.02,GROUND+BASE,29.934),rect(-88.45,-32.75,-73.2,-11.02),25.1,3.3,29.934,1.6);
const linkPoly=[[-23.59,-11.09],[-23.66,15.51],[-11.75,15.58],[-11.74,-7.0],[-17.92,-6.91],[-19.59,-8.52],[-19.58,-10.77]];
let link=glazing(prism(linkPoly,BASE,z(32.635)),linkPoly,25.4,3.4,32.635,1.9);
const innerLink=[[-19.45,-30.49],[7.02,-30.75],[7.03,-24.44],[-11.74,-24.23],[-11.74,-14.4],[-14.83,-14.16],[-14.84,-30.53]];
const inner=glazing(prism(innerLink,BASE,z(36.17)),innerLink,25.4,3.3,36.17);
// Doorlopend gebogen dak boven de lage zaal, doorsnede in v/z en extrusie
// langs u. De convexe profielboog benadert de drie gemeten dakpunten.
const profile=[];for(let k=0;k<=24;k++){const v=-31.65+20.65*k/24;const h=33.73-.0095*(v+18.05)**2;profile.push([v,h]);}
const hallPoints=[[-31.65,GROUND+BASE],[-11,GROUND+BASE],...profile.reverse()];
let hall=Manifold.hull([-68.65,-18.45].flatMap(u=>hallPoints.map(([v,h])=>[u,v,z(h)])));
const hallCuts=[];for(const u of [-68.65,-18.45])for(let v=-30;v+2<-11.5;v+=3.1)hallCuts.push(B(u<0?u-.3:u-.3,v,u+.4,v+2,26,30.3));
hall=hall.subtract(union(hallCuts));
// Gemeten technische opbouwen van de zuidvleugel, geen losse hoogtelaag.
const lowPlants=union([B(-83,-48.06,-63.5,-40.15,36.6,39.776),B(-63.67,-45.81,-43.27,-39.94,36.6,40.502),B(-68.95,-48.34,-49.9,-45.5,36.6,40.842),B(-27.9,-48.78,-21.9,-33.21,GROUND+BASE,37.271)]);
// Entreedeur en bescheiden afgeschuinde luifel aan de pleinzijde.
const entree=Manifold.hull([...ring3(rect(-24,-.9,-23.4,2.3),z(26.2)),...ring3(rect(-25.4,-.9,-23.4,2.3),z(27.7))]);
const lowLinks=union([B(-88.36,-51.46,-76.71,-48.61,GROUND+BASE,28.61),B(-73.32,-32.75,-68.60,-11.02,GROUND+BASE,28.727),B(-75.99,-17.89,-68.60,-11.02,GROUND+BASE,32.246),Manifold.cylinder(z(29.344)-BASE,1.4,1.4,24).translate([-88.48,-14.26,BASE])]);
let model=union([lowLinks,tower,spine,southCore,northCore,sidePlant,south,east,eastHigh,west,link,inner,hall,lowPlants,entree]).trimByPlane([0,0,1],BASE);
// Zoals in het Achmeatoren-voorbeeld: een door de westkop afgedekte nis
// is een ingesloten negatieve holte, die niet aan de buitengevel hoort.
model=Manifold.compose(model.decompose().filter(part=>part.volume()>0));
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error(`Erasmusgebouw ${model.status()} ${model.decompose().length} delen`);
const rdLocal=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:erasmusgebouw-met-glasbanden-liftkernen-gebogen-zaal-en-zuidvleugels',model]],catalog:{name:'Erasmusgebouw',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:67.79057763,groundSamplePoints:[[188042,425734],[188024,425673],[187937,425675],[187920,425709]].map(rdLocal),replacesBuildings:['NL.IMBAG.Pand.0268100000087407'],description:'Erasmusgebouw inclusief volledige BAG-onderbouw: 25,06 × 48,76 m toren, horizontale blinde glasbanden, centrale dakrug en twee liftkernen, lage zaal met continu gebogen dak, lange zuidelijke onderwijsstrip, westkop, entree en technische opbouwen. Binnenhof open; Refter en afzonderlijke campusbrug blijven PDOK.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:102.455,spineNapM:111.367,roofCoreNapM:[113.388,113.368],lowRoofNapM:[29.934,32.635,36.17,36.684,36.696,40.564],hallRoofNapM:[32.01,33.73,33.145],storeyM:3.65,nicheDepthM:.32,estimates:['21 glasbanden op circa 3,65 m laagritme, blinde nissen .32 m en venstervakken .45 m diep','gebogen laagbouwdak als continue profielboog door gemeten rand- en middenhoogtes','lage gevelramen, entree en kleine techniek vereenvoudigd uit foto’s','dakletters, antennes en fijn hekwerk weggelaten wegens vrijstaande doorsnede onder 0,9 m','glasverbindingen binnen de eigen BAG-voet als blinde massieve puien; afzonderlijke loopbruggen naar Refter/Gymnasion blijven PDOK']},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000087407 (TU Delft/3DGI CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://www.ru.nl/over-ons/de-campus/gebouwen-en-ruimtes/erasmusgebouw','https://commons.wikimedia.org/wiki/Category:Erasmusgebouw,_Nijmegen (foto’s Nijmegen 01/02/05/07, Hanno Lans CC BY 4.0)']}});
