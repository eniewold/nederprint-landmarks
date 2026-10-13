// UP/IJ-toren with its full Passenger Terminal Amsterdam and quay skywalk.
// Example generate-de-rotterdam.mjs; named volumes and one continuous roof profile.
// RD roof planes from 3DBAG/AHN4; facade/plinth rhythm from oblique photos.
import {Manifold,CrossSection,prism,rect,box,ccw,union,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='ij-toren',ORIGIN=[122941,487872],ANGLE=-16.2,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=1.4,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const profileAlongY=(p,y0,y1)=>Manifold.extrude(new CrossSection([ccw(p)]),y1-y0).rotate([90,0,0]).translate([0,y1,0]);
function windows(s,p,top,first=15,pitch=3.75){const cuts=[],q=ccw(p);for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];for(let h=first;h+2.6<top-.5;h+=pitch)for(let x=1;x+1.45<L-.9;x+=2.5){const pol=[[x,-.35],[x+1.4,-.35],[x+1.4,.4],[x,.4]].map(([u,v])=>[a[0]+u*t[0]+v*n[0],a[1]+u*t[1]+v*n[1]]);cuts.push(prism(pol,z(h),z(h+2.6)));}}return cuts.length?s.subtract(union(cuts)):s;}
// The two glazed slabs have straight faces. The curved architectural surface
// belongs to the separate lower terminal hall, not to the UP office tower.
const westPlan=rect(-35.74,5.23,-7.115,20.93),eastPlan=rect(-2.5,5.2,23.34,20.90);
let west=windows(prism(westPlan,BASE,z(81.096)),westPlan,81.096),east=windows(prism(eastPlan,BASE,z(81.096)),eastPlan,81.096);
const centralSpine=B(-7.115,1.06,-2.5,20.9,GROUND-1,89.086);
// Central service head with blind broad louvre bands, retained full thickness.
const spineCuts=[];for(let h=34;h<88;h+=2.2)spineCuts.push(B(-7.3,1.0,-2.3,1.36,h,h+.9));
const spine=centralSpine.subtract(union(spineCuts));
// Western glass blade and crowning canopy. The two-metre lower cantilever is
// supported by an integrated 45-degree face instead of an open thin frame.
const glassBlade=windows(profileAlongY([[-37.84,z(59.2)],[-35.3,z(61.74)],[-35.3,z(80.9)],[-37.84,z(80.9)]],5.3,19.29),rect(-37.84,5.3,-35.3,19.29),80.9,63);
const westCap=Manifold.hull([...ring3(rect(-35.74,5.23,-7.1,20.93),z(80.0)),...ring3(rect(-37.9,3.7,-7.1,22.3),z(82.0))]);
const roofWell=B(-31.5,9.6,-12.5,17.4,79.834,82.3);
const westRoof=westCap.subtract(roofWell);west=west.subtract(roofWell);
const services=[B(5.2,14.6,14.6,16.4,81,83.296),B(-2.5,1.3,9.96,2.6,80.9,82.155)];
// Measured slim southern office wing (not the separately registered eastern
// warehouse and not the Movenpick hotel to the west).
const southPlan=rect(-7.21,-31.83,6.36,5.25),south=windows(prism(southPlan,BASE,z(32.697)),southPlan,32.697,9.0);
// Passenger hall has one extruded curved/plane cross-section. Knots come
// from the AHN median across its unobstructed roof; no height-slice stacking.
const roofProfile=[[-117.0,20.94],[-114,22.18],[-111,24.51],[-108,24.91],[-105,25.45],[-102,25.87],[-99,26.09],[-96,26.11],[-93,25.90],[-90,25.88],[-87,24.99],[-84,24.34],[-48,16.909],[-45,16.61],[-39.5,16.525]];
let hall=profileAlongY([[-117,BASE],[-39.5,BASE],...roofProfile.slice().reverse().map(([u,h])=>[u,z(h)])],-24.5,12.2);
// Broad glass subdivisions on both long facades remain blind in the hall.
const hallCuts=[];for(const y of[-24.5,12.2])for(let x=-115;x<-41;x+=4.2){const i=roofProfile.findIndex(p=>p[0]>x);const a=roofProfile[Math.max(0,i-1)],b=roofProfile[i<0?roofProfile.length-1:i];const roof=a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]||1);for(let h=13.5;h+2.2<roof-.7;h+=3.5)hallCuts.push(B(x,y-.35,x+3.1,y+.35,h,h+2.2));}
hall=hall.subtract(union(hallCuts));
const terminalPlinth=windows(B(-122.79,-31.82,-37.15,19.29,GROUND-1,12.564),rect(-122.79,-31.82,-37.15,19.29),12.564,3.0,3.9);
const eastPlinth=windows(B(-37.2,-31.82,-7.1,5.3,GROUND-1,12.574),rect(-37.2,-31.82,-7.1,5.3),12.574,3,3.9);
const vestibule=windows(B(-39.6,-17.2,-25.35,-2.45,12.4,18.094),rect(-39.6,-17.2,-25.35,-2.45),18.094,13.0);
// The real full quay skywalk spans beyond the terminal. Lower glazing is a
// closed three-metre tube; triangular openings underneath retain a 50-degree
// print slope and full piers at least 1.2 m thick. No street/garage roof slab.
let quay=B(-151.57,21.8,154.24,25.82,GROUND-1,11.774),archCuts=[];
for(let x=-149.7;x+8.8<153.5;x+=10.2)archCuts.push(profileAlongY([[x,BASE-1],[x+8.8,BASE-1],[x+8.8,z(2.9)],[x+4.4,z(8.3)],[x,z(2.9)]],21.6,26.1));
quay=quay.subtract(union(archCuts));const quayWindows=[];for(let x=-150;x+2.5<154;x+=4)for(const y of[21.8,25.82])quayWindows.push(B(x,y-.3,x+2.5,y+.3,8.9,10.9));quay=quay.subtract(union(quayWindows));
const quayLinks=[B(-115.48,19.2,-108.14,22.1,8.0,11.774),B(-50.52,19.2,-35.72,22.1,8.0,11.774),B(-7.1,19.5,4.6,22.1,8,11.774)];
let body=union([west,east,spine,glassBlade,westRoof,...services,south,hall,terminalPlinth,eastPlinth,vestibule,quay,...quayLinks]);body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:up-ij-toren-terminal-en-kadepassage',body]],catalog:{name:'UP Office Building (IJ-toren)',origin:ORIGIN,xAxis:AXIS,groundHeight:44.426876,groundOffsetMetres:0,groundSamplePoints:[[122928,487833],[122898,487841],[122966,487823]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012090447'],description:'UP/IJ-toren met twee rechte glasgevelschijven, centrale hoge installatiekern, westelijke glasvin en kroon, volledige Passenger Terminal-hal met doorlopend gebogen dak, lage terminal-/entreevleugels en de lange glazen kadepassage; de publieke ondergrondse garagevoet, Movenpick en oostelijke warehouses blijven buiten de landmark.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:81.096,coreTopNapM:89.086,roofWellNapM:79.834,southWingNapM:32.697,hallRoofProfileNapM:roofProfile,terminalPlinthNapM:12.564,quayRoofNapM:11.774,estimates:['Gevelraster2.5m en3.75m/.35m blinde nissen, glasvin/kroononderkant uit schuine fotos','Kroon82.0NAP, glasvinbegin59.2NAP circa1-2m onzeker; kern/dakput/wing gemeten','Terminaldakprofile uitAHN4, doorlopend gevel-/dakvlak; kleine lasnaden weggelaten','Glazen kadepassage massief3mhoog, .3m blinde glasnissen en1.2m piers met50deg vereenvoudigde onderbogen','Geen ondergrondse garage-/publieke verhoogde pleinplaat of AHN-scheepsmast/antenne; westelijk hotel en oostelijke warehouses aparte BAG behouden']},sources:['https://upofficebuilding.nl/ (eigenaar, Piet Heinkade55,19verdiepingen)','https://www.tgm.nl/projecten/ij-toren/ (gevelrenovatie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012090447 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:PietHeinKade2015.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:%27IJ-Toren%27_Amsterdam_(5619892436).jpg (FaceMePLS CC BY2.0)','https://commons.wikimedia.org/wiki/File:A_photo_of_climbing-hall,_Passenger_terminal_and_waterfront_of_the_IJ_in_Amsterdam,_Oosterdok_2005.jpg (Fons Heijnsbroek CC0)']}});
