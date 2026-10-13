// StadsHeer + het eigen Haestrechtkwartier-pand, EGM, 2007.
// Voorbeeld generate-evoluon.mjs gelezen. Benoemde bouwvolumes en vlakken,
// serres met printonderschaal; geen gestapelde AHN-hoogtelagen.
// BAG/AHN CC0; dakmaten 3D BAG (TU Delft/3DGI, CC BY4.0).
import {Manifold,prism,rect,box,union,ccw,ring3,gableRoof,writeLandmark} from './efteling-kit.mjs';
const slug='stadsheer',ORIGIN=[133574,396870],ANGLE=-7.84,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=15.2,BASE=-.7,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.38){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.5],[s0,.5]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,w=2.1,step=3.4,height=1.8,skip=[]){const cuts=[],p=ccw(poly);for(let k=0;k<p.length;k++){if(skip.includes(k))continue;const a=p[k],b=p[(k+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.55;s+w<L-.3;s+=step)for(let h=first;h+height<top-.5;h+=pitch)cuts.push(niche(a,b,s,s+w,h,h+height));}return cuts.length?solid.subtract(union(cuts)):solid;}
// Drie gemeten torendaken: oostschijf97.953, westschijf106.913,
// trappen-/penthousekern115.233m NAP. De glazen serreboxen vormen de kroon.
const towerPlan=[[-11.49,-9.65],[-2.23,-9.65],[-2.23,-13.24],[15.39,-13.24],[15.39,2.49],[3.65,2.49],[3.65,8.16],[-11.49,8.16]];
let tower=union([B(-11.49,-9.65,3.65,8.16,14.5,106.913),B(-2.23,-13.24,15.39,2.49,14.5,97.953),B(-2.44,-4.03,9.8,2.49,97.7,115.233)]);
tower=facade(tower,towerPlan,18.4,3.22,106.9,2.1,3.3,1.75);
// Glasplint: terugliggende puien met dragende pijlers en gevelopeningen als nis.
tower=tower.subtract(B(-10.9,-10.1,2.8,-9.25,15.9,18.0)).subtract(B(14.99,-12.5,15.8,1.8,15.9,18.0));
const topCuts=[];for(let h=108;h<113;h+=2.5)for(let u=-1.5;u<8;u+=3)topCuts.push(B(u,-4.5,u+2,-3.65,h,h+1.3),B(u,2.12,u+2,2.9,h,h+1.3));tower=tower.subtract(union(topCuts));
// Serres:85 woningen uit ontwikkelaarsbron; posities en afmetingen op
// schuine foto's geschat. De2.1m diepe boxen hebben vaste45-graden voeten.
function serre(a,b,s,h){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]],pt=(u,d)=>[a[0]+u*t[0]+d*n[0],a[1]+u*t[1]+d*n[1]],w=3.25,d=2.1;const inside=[pt(s,-.3),pt(s+w,-.3),pt(s+w,.02),pt(s,.02)],outside=[pt(s,-.3),pt(s+w,-.3),pt(s+w,d),pt(s,d)];let m=union([Manifold.hull([...ring3(inside,z(h-d)),...ring3(outside,z(h))]),prism(outside,z(h-.01),z(h+2.65))]);const aa=pt(s,d),bb=pt(s+w,d);return m.subtract(niche(aa,bb,.4,w-.4,h+.45,h+2.2,.3));}
const bays=[];
for(let k=0;k<24;k++){const h=35.2+k*2.8;bays.push(serre([-11.49,8.16],[-11.49,-9.65],[.9,6.2,10.8,3.8][k%4],h));bays.push(serre([3.65,8.16],[-11.49,8.16],[.8,5.6,9.2,3.0][(k+1)%4],h));}
for(let k=0;k<20;k++)bays.push(serre([-2.23,-13.24],[15.39,-13.24],[1.0,5.6,10.3,7.8][k%4],35.2+k*2.8));
for(let k=0;k<17;k++)bays.push(serre([15.39,-13.24],[15.39,2.49],[.9,5.1,9.8,3.2][(k+2)%4],35.2+k*2.8));
// Vier kantoorbouwdelen op de echte voetafdrukken, met lagere koppen en
// techniekblokken. Hoogtes gecontroleerd in AHN, geen overgenomenPDOK-ruis.
const westPlan=rect(-57.47,12.38,-37.02,50.05);
let westOffice=union([B(-57.47,12.38,-37.02,50.05,14.5,61.514),B(-57.47,23.28,-37.12,34.56,61.3,67.017)]);
westOffice=facade(westOffice,westPlan,18.5,3.22,61.5,2.2,3.4,1.7);
const nearPlan=rect(-11.52,11.87,3.63,50.94),middlePlan=rect(39.78,12.39,55.5,49.3),eastPlan=rect(85.69,12.36,100.84,48.08);
let nearOffice=union([B(-11.52,11.87,3.63,50.94,14.5,39.93),B(-11.41,39.53,3.39,50.94,39.7,45.54)]);
let middleOffice=union([B(39.78,12.39,55.5,49.3,14.5,39.981),B(39.24,39.52,54.76,49.3,39.7,45.401)]);
let eastOffice=union([B(85.69,12.36,100.45,48.08,14.5,39.994),B(85.66,38.96,100.84,48.08,39.7,45.436)]);
nearOffice=facade(nearOffice,nearPlan,17.5,3.5,45.5,2.6,3.9,2.5);
middleOffice=facade(middleOffice,middlePlan,17.5,3.5,45.4,2.6,3.9,2.5);
eastOffice=facade(eastOffice,eastPlan,17.5,3.5,45.4,2.6,3.9,2.5);
// Noordelijke parkeerschijf en hogere glazen verbindingsvleugel; de twee
// binnentuinen blijven open, geen vloerplaatoverhetplein.
const parking=facade(B(-46.33,49,95.1,67.6,14.5,30.795),rect(-46.33,49,95.1,67.6),17.3,3.2,30.7,3.0,4.1,1.8);
const corridor=facade(B(-40.53,39.52,86.0,51.0,14.5,32.772),rect(-40.53,39.52,86.0,51.0),17.3,3.5,32.7,2.8,4.0,2.5);
// De entree tussen westkantoor en toren bestaat uit drie echte glazen
// dwarskappen, goot21.14/21.62, nok22.56m NAP, met doorlopendevlakken.
const foyerParts=[B(-37.1,23.2,-11.4,39.55,14.5,21.15)];
for(let k=0;k<3;k++)foyerParts.push(gableRoof(25.7,5.4,z(21.14),z(22.56)).translate([-24.25,25.9+k*5.4,0]));
const foyer=facade(union(foyerParts),rect(-37.1,23.2,-11.4,39.55),16.5,3,21.1,3,4,3);
// Trappentorens / ronde parkeerhellingen aan de beide einden van het dek.
function ramp(cx,cy,radius,roof){const cylinder=Manifold.cylinder(z(roof)-BASE,radius,radius,48).translate([cx,cy,BASE]);const hole=Manifold.cylinder(z(roof+1)-z(roof-2),radius-1.1,radius-1.1,48).translate([cx,cy,z(roof-2)]);return cylinder.subtract(hole);}
const ramps=[ramp(-45,58,7.1,30.7),ramp(96.1,56.5,7.1,30.7)];
// Dakliftkern en installaties zijn meetbaar; dikke frames bij glasdelen.
const technique=[B(-49.0,42,-44.2,44.2,61.4,63.91),B(-44,29.9,-40.6,32.0,66.9,68.481),B(-4.8,43.7,-1.1,46.1,45.4,47.15),B(44.8,43.2,49.1,46.8,45.3,47.13),B(91,42.2,95.1,44.9,45.3,47.9),B(3.3,-3.0,7.7,.3,115.1,117.1)];
const link=B(-10.7,7.5,3.2,13.0,14.5,36.273);
let model=union([tower,...bays,westOffice,nearOffice,middleOffice,eastOffice,parking,corridor,foyer,...ramps,...technique,link]).trimByPlane([0,0,1],BASE);
// Gesloten interne nissen achter aansluitende bouwvolumes vullen we dicht.
// Ze dragen niet bij aan het zichtbare gevelreliëf en hoeven niet geprint.
model=Manifold.compose(model.decompose().filter(part=>part.volume()>0));
if(model.status()!=='NoError')throw Error('StadsHeer niet gesloten');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:stadsheer-serres-en-volledige-haestrechtkwartier',model]],catalog:{name:'StadsHeer',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:58.34388678,groundSamplePoints:[[133555,396855],[133587,396850],[133690,396897]].map(local),replacesBuildings:['NL.IMBAG.Pand.0855100000394673'],description:'StadsHeer met85geslotenserresopprintkragen, verschillende gemeten torenkoppen, glasplint, vier kantoorvolumes,glazenverbindingsvleugels, drie foyer-dakvlakken en de noordelijke parkeerschijf met ronde hellingen. Het gehele eigen BAG-pand wordt vervangen; binnentuinen en openbarepleinen blijvenopen. RD133574/396870, hoofdas-7.84graden, z0NAP15.2m.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofsNapM:[97.953,106.913,115.233],machineryNapM:117.1,westOfficeRoofsNapM:[61.514,67.017],otherOfficeRoofsNapM:[39.93,39.981,39.994,45.54,45.401,45.436],parkingRoofNapM:30.795,corridorRoofNapM:32.772,foyerGutterRidgeNapM:[21.14,22.56],serres:85,estimates:['serreplaatsing in vier ritmesuit schuinefoto s:3.25m breed,2.1m diep,2.65m hoog; vaste45-graden onderschalen vergrotenonderhang','venster-/glasritme, woonlaagsteek2.8m, kantoorsteek3.2/3.5m en glasplint uitfoto s geschat, circa.5m onzeker','rondeparkeerhellingen7.1m straal en1.1m borstwering vanuitluchtfoto vereenvoudigd; inrichting van binnenhellingen weggelaten','installatieblokken uitAHN op3DBAG-daken, top117.1NAP binnenAHNmaximum117.76','smallekozijnen,lamellen,leuningenenzonnepanelenonder.9m weggelaten; noorderdek isgebouw, geenpleinvloer']},sources:['https://factor-s.com/Ontwikkeling/referentieprojecten/de-stadsheer.aspx (ontwikkelaar,85woningen/6kantoorlagen/25woonlagen)','https://www.skyscrapercenter.com/building/de-stadsheer/5856 (CVU,101m,EGM,2007)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000394673 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:Stadsheer_Tilburg_DSCF9463.jpg (G.Lanting,CC BY4.0)','https://commons.wikimedia.org/wiki/File:Stadsheer_Tilburg_DSCF9465.jpg (G.Lanting,CC BY4.0)','https://commons.wikimedia.org/wiki/File:Stadsheer_Tilburg_P1160983.jpg (G.Lanting,CC BY4.0)','https://commons.wikimedia.org/wiki/File:UPC0511-Unnatural-7_(5772263355).jpg (Joris Leermakers,CC BY-SA2.0)']}});
