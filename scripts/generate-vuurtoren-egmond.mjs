// Vuurtoren J.C.J. van Speijk: regelmatige bouwdelen op BAG en AHN; meters.
import{Manifold,box,prism,circle,hull,ring3,union,place,dome,writeLandmark}from'./efteling-kit.mjs';
const ORIGIN=[103158.24,514884.4],AXIS=[.97066064,-.24045358],BASE=-.25;
const T={r0:3.05,r1:1.9,bodyTop:24.15,watchBottom:24.95,watchTop:27.15,lanternTop:29.7,domeTop:31.1,top:31.85};
const fr=(r0,r1,z0,z1,n=64)=>hull([...ring3(circle([0,0],r0,n),z0),...ring3(circle([0,0],r1,n),z1)]);
const rectFr=(a,b,z0,z1)=>hull([...ring3([[-a,-a],[a,-a],[a,a],[-a,a]],z0),...ring3([[-b,-b],[b,-b],[b,b],[-b,b]],z1)]);
let tomb=union([box(-5.15,-5.15,BASE,5.15,5.15,3.55),rectFr(5.15,5.65,3.55,4.05),box(-5.65,-5.65,4.05,5.65,5.65,4.5)]);
const plaques=[box(4.8,-4.4,1.3,5.3,-1.2,2.65),box(4.8,1.2,1.3,5.3,4.4,2.65),box(-1.5,-5.3,1.35,1.5,-4.8,2.7),box(-1.5,4.8,1.35,1.5,5.3,2.7)];
tomb=union([tomb,...plaques]).subtract(box(4.8,-.85,BASE-.1,5.8,.85,2.6));
// Leeuw boven de landzijdige deur: zittende romp, kop, snuit en voorpoten.
const lion=union([box(3.7,-1.1,4.4,5.5,1.1,4.7),Manifold.sphere(1,24).scale([.7,.8,1.25]).translate([4.35,0,5.7]),Manifold.sphere(.65,24).translate([4.55,0,6.9]),Manifold.sphere(.45,16).translate([5,0,6.8]),box(4.9,-.95,4.6,5.8,-.05,5.7),box(4.9,.05,4.6,5.8,.95,5.7)]);
const acroteria=[[-5.15,-5.15],[-5.15,5.15],[5.15,-5.15],[5.15,5.15],[-5.15,0],[0,-5.15],[0,5.15]].map(([x,y])=>hull([...ring3(circle([x,y],.55,8),4.45),[x,y,5.6]]));
tomb=union([tomb,lion,...acroteria]);
let shaft=fr(T.r0,T.r1,4.35,T.bodyTop);const cuts=[];
// Drie zeezijdige patrijspoorten en twee ronde ornamenten op de landzijde.
for(const z of[7.6,13.5,19.4]){const r=T.r0+(T.r1-T.r0)*(z-4.35)/(T.bodyTop-4.35);cuts.push(Manifold.cylinder(.9,.7,.7,32).rotate([0,90,0]).translate([-r-.3,0,z]));}
for(const z of[10.5,23]){const r=T.r0+(T.r1-T.r0)*(z-4.35)/(T.bodyTop-4.35);cuts.push(Manifold.cylinder(.7,.7,.7,32).rotate([0,90,0]).translate([r-.35,0,z]));}
shaft=shaft.subtract(union(cuts));shaft=union([shaft,box(2.3,-1.25,16.4,2.62,1.25,17.3)]);
// Uitkijkruimte heeft een naar buiten hellende veelhoekige gevel, geen cilinder.
let watch=union([fr(1.9,2.7,24.05,24.95,12),fr(2.7,3.45,24.95,27.15,12),fr(3.45,3.65,27.15,27.35,12)]);
const glass=Array.from({length:12},(_,k)=>place(box(-.55,-3.7,25.65,.55,-2.62,26.8),{deg:k*30}));watch=watch.subtract(union(glass));
let lantern=union([prism(circle([0,0],1.75,12),27.2,29.7),fr(1.75,2.05,29.5,29.8),dome([0,0],[[2.05,29.8],[1.85,30.2],[1.35,30.75],[.6,31.1]],48),prism(circle([0,0],.45,24),31,31.85)]);
lantern=lantern.subtract(union(Array.from({length:8},(_,k)=>place(box(-.45,-1.9,27.55,.45,-1.35,29.3),{deg:k*45}))));
// De beschermmuur op het duin volgt de vierkante platformrand op de ortho.
const outer=box(-8.5,-8.5,BASE,8.5,8.5,1.15).subtract(box(-7.6,-7.6,BASE-.1,7.6,7.6,1.25)).subtract(box(7.4,-1.4,BASE-.1,8.7,1.4,1.25));
const steps=[0,1,2,3].map(i=>box(5.05+i*.9,-1.35,BASE,5.95+i*.9,1.35,.9-i*.23));
await writeLandmark({slug:'vuurtoren-egmond',base:BASE,nodes:[['building:tombe-leeuw-en-gedenkstenen',tomb],['building:ronde-schacht-met-patrijspoorten',shaft],['building:kustwachtlokaal-en-lichthuis',union([watch,lantern])],['road:duinmuur-en-entreestappen',union([outer,...steps])]],catalog:{name:'Vuurtoren J.C.J. van Speijk',origin:ORIGIN,xAxis:AXIS,groundHeight:55.42432220360166,groundOffsetMetres:-.1,groundSamplePoints:[[7,0],[-7,0],[0,7],[0,-7]],replacesBuildings:['NL.IMBAG.Pand.0373100000016150'],description:'Neoclassicistische tombe met leeuw; ronde taps toelopende schacht met zeezijdige patrijspoorten; veelhoekig kustwachtlokaal, lichthuis en bolkap. Landzijdige ingang naar +X. Gemeten silhouet circa 31,85 m inclusief tombe en makelaar; bron noemt objecthoogte 28 m.',realWorld:{publishedObjectHeightM:28,ahnTopNapM:44.59806,groundNapM:12.75,totalModelHeightM:T.top,tombWidthM:10.3,shaftDiameterM:[6.1,3.8],estimatedWatchHeightM:[24.95,27.15],minimumPartM:.9},sources:['https://www.vuurtorens.org/vuurtoren/egmond-aan-zee/','https://www.vuurtorens.org/wp-content/uploads/2023/08/De-vuurtoren-van-Egmond-aan-Zee-juni-2023.pdf','https://monumentenregister.cultureelerfgoed.nl/monumenten/14590','https://commons.wikimedia.org/wiki/Category:J.C.J._van_Speijk_lighthouse','PDOK BAG 0373100000016150, AHN DSM/DTM 0,5 m en Actueel_orthoHR, 2026-10-11']}});


