// Willemswerf, Wim Quist1988. Voorbeeld NEMO gelezen: echte dakplanvergelijking.
// Geometrisch raster, diagonale glasstrook en volledige garage; geen DSM-lagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='willemswerf',ORIGIN=[93280,436885],ANGLE=46.8,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=3.69,BASE=-.8,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const mainPlan=[[-56.69,1.01],[-56.46,-5.81],[-53.45,-8.99],[-49.87,-13.78],[40.9,-14.05],[40.23,2.36],[31.08,1.02],[27.31,-7.43],[15.88,-7.68],[15.77,-6.26],[18.23,-5.46],[17.73,-1.26],[13.58,-1.35],[13.44,1.54],[2.64,.76],[.01,2.71],[-5.85,9.72],[-14.34,9.76],[-14.63,-2.12],[-18.61,-.95],[-20.65,1.51],[-19.95,9.94],[-30.52,1.85]];
function niche(a,b,s0,s1,h0,h1){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-.38],[s1,-.38],[s1,.45],[s0,.45]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));}
function windows(body,poly,first,top,pitch=3.6){const p=ccw(poly),cuts=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=first;h+1.75<top-.6;h+=pitch)for(let s=.7;s+2.5<L-.4;s+=3.6)cuts.push(niche(a,b,s,s+2.5,h,h+1.75));}return body.subtract(union(cuts));}
let main=windows(prism(mainPlan,BASE,z(90.609)),mainPlan,6.0,90.3);
// EÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©n glasdakvlak uit LoD2.2, zNAP=-.99776578*u-.00807638*v+41.64179667.
const glassPlan=[[-49.563,-14.998],[-49.411,-27.071],[22.898,-16.496],[22.559,-14.485]];
const roof=(u,v)=>-.997765781522*u-.008076375547*v+41.641796672768;
const n=Math.hypot(.997765781522,.008076375547,1);
let glass=prism(glassPlan,BASE,z(100)).trimByPlane([-.997765781522/n,-.008076375547/n,-1/n],-(41.641796672768-GROUND)/n);
// Glasvelden op het hellende vlak liggen in dat vlak, niet als vlakke treden.
glass=windows(glass,glassPlan,6,91);
const glassCuts=[];for(let u=-48;u<20;u+=3.6)for(let v=-26;v<-15;v+=2.4){const p=rect(u,v,u+2.5,v+1.4);glassCuts.push(Manifold.hull([...p.map(([u,v])=>[u,v,z(roof(u,v)-.38)]),...p.map(([u,v])=>[u,v,z(roof(u,v)+.5)])]));}glass=glass.subtract(union(glassCuts));
// Hoge zuidwestkop met open dakput en gemeten technische opstap.
const headPlan=rect(-64.3,-29.23,-49.45,-13.15);
let head=windows(prism(headPlan,BASE,z(91.524)),headPlan,6,91.1);
head=head.subtract(B(-62.5,-27.5,-51.2,-15.0,88.344,93));
const lowWest=[[-61.16,10.52],[-61.11,-9.65],[-56.75,-9.64],[-56.69,1.01],[-30.52,1.85],[-21.01,10.07]];
const lowEast=[[.01,2.71],[2.64,.76],[22.09,.7],[24.28,.78],[34.08,1.67],[33.13,10.81],[.01,10.05]];
const garages=[windows(prism(lowWest,BASE,z(19.202)),lowWest,4.9,19.0,2.8),windows(prism(lowEast,BASE,z(19.203)),lowEast,4.9,19.0,2.8)];
// Afgeronde in-/uitrijlus aan AndrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© van der Louwbrug: geen losse wegbrug.
const rampPlan=[[40.0,-7.56],[41.0,-13.8],[46.0,-13.82],[54.02,-17.37],[64.22,-16.88],[69.25,-12.79],[70.35,-.62],[67.74,5.48],[64.28,7.65],[53.67,8.05],[49.62,7.03],[45.51,2.58],[40.49,-2.93]];
let ramps=prism(rampPlan,BASE,z(19.058));const rampCuts=[];for(let h=5.6;h<18;h+=2.9)rampCuts.push(B(52,-17.8,63,-16.45,h,h+1.5),B(52,7.5,63,8.8,h,h+1.5));ramps=ramps.subtract(union(rampCuts));
const machines=[B(-18.59,1.23,-14.32,10.68,90.4,91.542),B(-2.5,.8,-.7,4.1,90.4,91.578),B(13.5,-1.3,25.0,1.0,90.4,91.542),B(-54.8,-4.0,-49.4,.0,90.4,94.888)];
// Regelmatige verhoogde daklichten op het smalle hoofddak (ortho/AHN).
for(let u=-42;u<16;u+=7.2)machines.push(B(u,-12,u+1.8,-8.5,90.4,91.51));
const terrace=Manifold.hull([...ring3(rect(15.8,-7.65,27.3,-7.3),z(77.0)),...ring3([[15.77,-6.26],[15.88,-7.68],[27.31,-7.43],[27.61,-5.37],[23.72,-5.83],[23.43,-1.14],[21.33,-1.19],[19.69,-5.76]],z(84.859))]);
const roofTerraceCut=B(16.8,-6.3,25.8,-1.9,84.859,93);
// Noordkern volgt eigen ingesprongen plan; garagepoort en straatpui zijn nissen.
const entries=union([B(27.7,-14.8,36.2,-13.4,3.9,9.9),B(46,-14.0,52,-12.7,3.9,7.5)]);
let model=union([main,glass,head,...garages,ramps,...machines,terrace]).subtract(union([roofTerraceCut,entries])).trimByPlane([0,0,1],BASE);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:willemswerf-diagonale-glasstrook-en-volledige-parkeeronderbouw',model]],catalog:{name:'Willemswerf',origin:ORIGIN,xAxis:AXIS,groundHeight:47.04817914,groundOffsetMetres:0,groundSamplePoints:[[93258,436815],[93279,436838],[93308,436886]].map(local),replacesBuildings:['NL.IMBAG.Pand.0599100000612039'],description:'Willemswerf met het echte doorlopende diagonale glasvlak, 3.6m-gevelraster, ingesprongen achterkern, hoge kop met open dakput, afzonderlijke technische delen/daklichten, noordelijke vijflaagse garages en volledige afgeronde oostelijke hellingbaanvoet. Platte daken waar gemeten en ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©n glasplanvergelijking.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,mainRoofNapM:90.609,glassRoofPlaneNap:[-.997765781522,-.008076375547,41.641796672768],headRimNapM:91.524,headWellNapM:88.344,roofTerraceNapM:84.859,machineryNapM:[91.542,91.578,94.888],garageRoofsNapM:[19.202,19.203,19.058],estimates:['venstervakken2.5bij1.75m/.38m diep, puien en garagebanden uit fotos geschat;3.6m geometrisch raster volgens bron','glasvelden volgen gemeten45-graden vlak; paneelindeling en.38m reliÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â«f vereenvoudigd','hellingbaanlus en laagbouw volgen gemeten omtrek, individuele hellingbanen inwendig niet uitgehold','garageonderbouw gesloten voor printbaarheid; de overstekte Hertekade wordt onder de eigen parkeerlagen gedeeltelijk gevuld','daklichten en machines vereenvoudigd op gemeten hoogtes; open dakput en kleiner noordterras behouden met geschatte vasteonderschaal77–84.859NAP']},sources:['https://www.qwa.nl/geschiedenis/ (architect,glas-trapezium)','https://www.architectuur.org/bouwwerk/425/Kantoorgebouw_Willemswerf.html (gevelraster,garages,achterkern)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000612039 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:Gebouw_Willemswerf_Rotterdam.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Willemswerf_@_Rotterdam_(30465517922).jpg (Guilhem Vellut CC BY2.0)','https://commons.wikimedia.org/wiki/File:Willemswerf2.JPG (R08-42,publiekdomein)']}});
