// Le Mirage: two unequal glazed wings, faceted/waving front, panorama-lift
// spine and the separately registered high corner, not a single sloping roof.
// Example generate-the-rock.mjs; named full-height volumes/continuous planes.
import {Manifold,CrossSection,prism,rect,box,ccw,union,writeLandmark} from './efteling-kit.mjs';
const slug='le-mirage',ORIGIN=[135896,453079],ANGLE=-66,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=1.9,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const slab=(p,h)=>Manifold.extrude(new CrossSection([ccw(p)]).offset(.03),z(h)-BASE).translate([0,0,BASE]);
function safeNiche(solid,a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];for(const u of[s0+.08,(s0+s1)/2,s1-.08])for(const h of[h0+.08,(h0+h1)/2,h1-.08]){const p=[a[0]+u*t[0],a[1]+u*t[1]];if(solid.rayCast([p[0]+n[0]*.15,p[1]+n[1]*.15,z(h)],[p[0]-n[0]*1.4,p[1]-n[1]*1.4,z(h)]).length!==1)return null;}return niche(a,b,s0,s1,h0,h1,depth);}
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return prism([[s0,-depth],[s1,-depth],[s1,.5],[s0,.5]].map(([u,v])=>[a[0]+u*t[0]+v*n[0],a[1]+u*t[1]+v*n[1]]),z(h0),z(h1));}
function glazed(s,p,top,first=5.6){const cuts=[],q=ccw(p);for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=first;h+2.45<top-3.1;h+=3.6)for(let u=.9;u+1.65<L-.85;u+=2.7){const cut=safeNiche(s,a,b,u,u+1.65,h,h+2.45);if(cut)cuts.push(cut);}for(let u=1;u+1.8<L-1;u+=4.7){const cut=safeNiche(s,a,b,u,Math.min(u+3.3,L-.9),2.3,5.35,.45);if(cut)cuts.push(cut);}}return cuts.length?s.subtract(union(cuts)):s;}
// Front slab follows the measured folded facade. A gently eased change of
// direction keeps broad continuous faces, rather than an invented roof ramp.
const frontPlan=[[-25.098,-7.53],[-16.232,-7.473],[-14.977,-7.804],[7.617,-19.045],[10.814,-12.62],[17.696,-12.895],[11.099,-8.09],[10.761,-1.38],[11.068,-.096],[-18.29,-.078],[-18.822,-.967],[-20.609,-4.974],[-25.155,-2.208]];
const backPlan=[[-19.355,9.169],[-18.868,-.078],[-18.29,-.078],[17.777,-.1],[17.804,.486],[19.947,.544],[19.865,10.263],[-20.117,9.891],[-20.089,9.151]];
const westReturn=[[-25.155,-2.208],[-20.609,-4.974],[-18.822,-.967],[-19.355,9.169],[-20.089,9.151],[-20.326,7.481],[-19.883,7.485],[-19.827,.392],[-25.184,.319]];
const panoramaPlan=[[11.068,-.096],[10.761,-1.38],[11.099,-8.09],[17.703,-12.896],[17.777,-.1]];
const cornerPlan=[[15.697,-23.044],[20.252,-14.243],[17.696,-12.895],[10.814,-12.62],[7.617,-19.045]];
const front=slab(frontPlan,86.774),back=slab(backPlan,76.604),corner=slab(cornerPlan,86.76);
const west=slab(westReturn,82.43),panorama=slab(panoramaPlan,83.95);
// Union the structural slabs before carving exterior-only glazing. Shared
// internal boundaries must not become opposing window cuts and thin cracks.
const internalReturnJoint=B(-19,-1,-18,-.05,GROUND-1,82.43);
let body=union([front,back,west,panorama,corner,internalReturnJoint]);
// Shared BAG edges simplified within 0.05 m; join the continuous floor plate
// at the visible foyer, not with an external/public square under the tower.
const foyerLink=B(10.7,-12.5,17.9,-1.0,GROUND-1,5.6);body=union([body,foyerLink]);
const wholeFoot=CrossSection.union([frontPlan,backPlan,westReturn,panoramaPlan,cornerPlan,rect(10.7,-12.5,17.9,-1),rect(-19,-1,-18,-.05)].map(p=>new CrossSection([ccw(p)]).offset(.03))).toPolygons();
for(const p of wholeFoot)body=glazed(body,p,86.77);
// Only the part of the internal north front-slab face above the lower wing
// is exposed. Broad blind panes end below the silver crown.
const exposedCuts=[];for(let h=77.1;h+2.45<83.2;h+=3.6)for(let u=1;u+1.65<28;u+=2.7){const cut=safeNiche(body,[11.068,-.096],[-18.29,-.078],u,u+1.65,h,h+2.45);if(cut)exposedCuts.push(cut);}
const crownCuts=[],f=ccw(frontPlan);for(let i=0;i<f.length;i++){const a=f[i],b=f[(i+1)%f.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L>4&&Math.min(a[1],b[1])<-.5&&Math.max(a[1],b[1])<-.05)for(const h of[82.0,84.2]){const cut=safeNiche(body,a,b,.7,L-.7,h,h+.45,.2);if(cut)crownCuts.push(cut);}}
body=body.subtract(union([...exposedCuts,...crownCuts]));body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:le-mirage-geknikte-glasvleugels-en-panoramaliften',body]],catalog:{name:'Le Mirage',origin:ORIGIN,xAxis:AXIS,groundHeight:45.179891,groundOffsetMetres:0,groundSamplePoints:[[135875,453081],[135911,453051],[135926,453061]].map(local),replacesBuildings:['NL.IMBAG.Pand.0344100000079355','NL.IMBAG.Pand.0344100000117092'],description:'Le Mirage aan Europaplein/Vliegend Hertlaan: hoge geknikte glasvleugel, lagere achtervleugel, westelijke terugloop en verticale panoramaliften met de apart geregistreerde hoge hoekvleugel. Gemeten vrijwel vlakke ongelijke dakniveaus, zilveren blind gearticuleerde kroon en brede glasentree; de naburige C-vleugel en parkeerterrassen blijven behouden.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,frontRoofNapM:86.774,backRoofNapM:76.604,westReturnNapM:82.43,panoramaRoofNapM:83.95,cornerRoofNapM:86.76,estimates:['Gevelraster3.6m/2.7m, glasnissen.35m blind en publieke plint.45m geschat uit fotos; circa1.05m materiaal tussen ramen','Dakvlakkenuit3DBAG/AHN4, geen schuin aflopend dak over hele lengte; westelijke kleine dakovergang82.43NAP vereenvoudigd totvlak','Panoramaliftgevel vereenvoudigd tot dik gesloten glasvolume en ondiepe zilveren kroonbanden.2m, exacte glas-/metaalprofielen niet afzonderlijk','Interne terugloopvoeg van maximaal.5m gesloten, overige BAG-voegen binnen.05m vereenvoudigd met eigen foyerverbinding; geen publieke plateau-/straatplaat','Fijne dakantenne2.5m2 tot89.544NAP weggelaten, geen fictieve grote plantkop; C-vleugel en parkeergarage apart behouden']},sources:['https://lemirageutrecht.nl/ (gebouwbeheerder,21verdiepingen,KPF)','https://lemirageutrecht.nl/gebouw/ (4panoramaliften,renovatie2020)','https://lemirageutrecht.nl/locatie/ (Europaplein)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000079355 (TU Delft/3DGI CC BY4.0)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000117092 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Kantoorgebouw_Mirage_in_Utrecht.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Le_Mirage-01.jpg (T Houdijk publiek domein)']}});
