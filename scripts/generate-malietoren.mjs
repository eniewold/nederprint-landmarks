// Malietoren, Benthem Crouwel, 1996. Voorbeeld generate-nemo.mjs gelezen.
// Vaste bouwdelen, gevelvlakken, dakplaten en een printbare open poort.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='malietoren',ORIGIN=[82287,455635],ANGLE=34.35,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=1,BASE=-5.5,z=h=>h-GROUND;
const PLAN=[[-14.8,-19.5],[-10,-18.8],[-5,-17.3],[0,-16.7],[5,-17.3],[10,-18.8],[14.8,-19.5],[14.8,19.5],[10,18.8],[5,17.3],[0,16.7],[-5,17.3],[-10,18.8],[-14.8,19.5]];
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
const profileY=(pts,y0,y1)=>Manifold.extrude([ccw(pts)],y1-y0).rotate([90,0,0]).translate([0,y1,0]);
// Bovenbouw volgt de naar binnen gevouwen glazen kopgevels; vijf lage
// parkeerlagen en dertien kantoorlagen, met blinde geometrische glasbanden.
let body=prism(PLAN,z(9.2),z(71.55));const cuts=[],p=ccw(PLAN);
for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L>35){for(let h=24.6;h<70;h+=3.6)for(let s=.8;s+3.2<L-.8;s+=4.1)cuts.push(niche(a,b,s,s+3.2,h,h+2.25,.45));for(let h=10;h<22.7;h+=1.1)cuts.push(niche(a,b,.6,L-.6,h,h+.55,.4));}else{for(let h=24.6;h<70;h+=3.6)cuts.push(niche(a,b,.25,L-.25,h,h+2.5,.45));for(let h=10;h<22.7;h+=1.1)cuts.push(niche(a,b,.2,L-.2,h,h+.55,.4));}}
body=body.subtract(union(cuts));
// Geschatte 15 m rijbaanopening, met basis onder de verdiepte Utrechtsebaan.
// De 45°-haunches zijn verbonden printkragen; de centrale weg blijft vrij.
const legs=[prism(rect(-14.8,-19.5,-7.5,19.5),BASE,z(9.3)),prism(rect(7.5,-19.5,14.8,19.5),BASE,z(9.3))];
const haunches=[profileY([[-7.5,z(-4.4)],[-7.5,z(9.3)],[6.2,z(9.3)]],-16.7,16.7),profileY([[7.5,z(-4.4)],[-6.2,z(9.3)],[7.5,z(9.3)]],-16.7,16.7)];
// Stalen gevelstijlen en zichtbare diagonalen langs de terugliggende glas-
// kopgevels; voldoende dik om op 1:1000 aan de gevel te blijven zitten.
const steel=[];function rib(a,b,w=1){return Manifold.hull([Manifold.cube([w,w,w],true).translate(a),Manifold.cube([w,w,w],true).translate(b)]);}
for(const side of [-1,1]){for(const u of [-10,0,10]){const face=u===0?16.7:18.8;steel.push(B(u-.5,side>0?face-.9:-face-.1,u+.5,side>0?face+.1:-face+.9,23.7,71.7));}for(const h of [25.1,40.1,55.1]){steel.push(rib([-10,side*18.5,z(h)],[0,side*16.5,z(h+14.5)]));steel.push(rib([0,side*16.5,z(h+14.5)],[10,side*18.5,z(h)]));}}
// Overstekende dakplaten en afzonderlijke centrale techniek uit AHN/3D BAG.
// Twee brede zijvelden liggen op NAP +74,545; een open techniekstrook blijft.
const roofWest=Manifold.hull([...ring3(rect(-14.8,-19.5,-5.2,19.5),z(73.3)),...ring3(rect(-16.1,-20,-5.2,20.8),z(74.545))]);
const roofEast=Manifold.hull([...ring3(rect(5.2,-19.5,14.8,19.5),z(73.3)),...ring3(rect(5.2,-20,16.2,20.8),z(74.545))]);
const roofPosts=[];for(const u of [-13,-7,7,13])for(const v of [-17,0,17])roofPosts.push(B(u-.55,v-.55,u+.55,v+.55,71.4,73.5));
const centralCore=B(-4.5,-7.4,4.1,8.1,71.4,75.713);
const westPlant=B(-4.5,8.1,-1.5,13.6,71.4,73.907),eastPlant=B(1.6,-12.4,4.1,-7.3,71.4,73.897);
const northVent=B(1.6,8.1,4.15,13.9,71.4,72.66),southVent=B(-4.5,-12.65,.5,-8.4,71.4,72.665);
// Zijentree in het westelijke draagdeel en zijn kleine schuine printluifel.
const entryCut=B(-15.5,-6,-14.05,6,1.25,5.4);
const canopy=Manifold.hull([...ring3(rect(-15.2,-5,-14.3,5),z(5.0)),...ring3(rect(-15.7,-5,-14.3,5),z(5.65))]);
let model=union([body,...legs,...haunches,...steel,roofWest,roofEast,...roofPosts,centralCore,westPlant,eastPlant,northVent,southVent,canopy]).subtract(entryCut).setTolerance(.005);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Malietoren niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:malietoren-ingevouwen-glasgevels-dakplaten-en-open-rijbaanpoort',model]],catalog:{name:'Malietoren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:44.11794974,groundSamplePoints:[[82266,455613],[82299,455663],[82312,455641],[82273,455652]].map(local),replacesBuildings:['NL.IMBAG.Pand.0518100000224954'],description:'Volledige Malietoren: ingevouwen glazen kopgevels, glasbanden, vijf lamellen-parkeerlagen, stalen stijlen en diagonalen, afzonderlijke overstekende dakplaten met open centrale techniekstrook, gemeten dakopbouwen en open poort boven de verdiepte Utrechtsebaan met verbonden 45 graden printkragen; vlakken en bouwdelen, geen DSM-lagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,officeRoofNapM:71.55,roofPlatesNapM:74.545,centralCoreNapM:75.713,gateWidthM:15,gateUndersideNapM:9.2,printGatePeakNapM:3.1,estimates:['ingevouwen glasgevels met circa 3 m recessie, glasbanden/lamellen en staalposities uit architectfoto’s geschat','onderzijde NAP +9.2, rijbaanbreedte15m, draagpoten en entree circa 1–2m onzeker; 45 graden printkragen boven de verdiepte weg zijn modelvereenvoudiging','dakcontouren, posts en apparatuur vereenvoudigd op gemeten dakhoogtes, circa .5–1m onzeker','dunne glasroedes, aluminiumlamellen afzonderlijk en ronde glasblokken kleiner dan .9m weggelaten']},sources:['https://www.benthemcrouwel.com/projects/malietoren (architect, 1996, gevouwen glazen kop, lamellen en zichtbare staalconstructie, foto’s uitsluitend referentie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000224954 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
