// Schielandtoren / eigen Beursplein-pand, de Architekten Cie., 1996.
// Voorbeeld generate-evoluon.mjs geheel gelezen. Benoemde bouwprisma's,
// erkers, dakbeuken en passage-schalen; nooit gestapelde DSM-hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='schielandtoren',ORIGIN=[92693,437148],ANGLE=15.9,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=.7,BASE=-1.2,z=h=>h-GROUND;
const brick=[[-8.75,-2.35],[-8.75,-11.89],[-1.96,-14.61],[-1.29,-12.64],[8.9,-15.25],[8.89,-14.06],[5.92,-13.68],[5.97,-2.08],[-5.14,-2.02],[-5.31,8.86],[2.6,8.78],[2.27,.59],[3.56,-.35],[2.23,-.6],[9.72,-2.09],[9.7,13.51],[4.56,20.89],[-14.25,12.4],[-13.98,8.61],[-11.84,7.19],[-12.81,2.27],[-14.26,1.72],[-13.12,.69],[-13.45,-1.02],[-10.62,-2.82]];
const core=[[-5.31,-2.03],[8.39,-2.03],[8.39,-.9],[2.6,-.9],[2.6,8.86],[-5.31,8.86]];
const eastBay=[[5.92,-15.59],[9.73,-15.59],[9.72,-2.08],[5.97,-2.08]];
const westBay=[[-17.5,4.84],[-16.04,7.28],[-17,8.48],[-15.79,10.61],[-14.1,10.31],[-14.25,12.4],[-11.84,7.19],[-12.81,2.27],[-14.26,1.72]];
const southBay=[[-9.44,-13.05],[-8.75,-11.89],[-3.22,-15.54],[-1.96,-14.61],[-1.29,-12.64],[6.14,-15.58],[5.1,-17.11],[-4.26,-16.17]];
const shopWest=[[-55.42,78.06],[-59.18,18.72],[-57.33,18.13],[-59.26,13.26],[-28.3,13.2],[-27.29,27.92],[-32.71,28.55],[-32.76,27.48],[-37,27.77],[-37.07,31.82],[-47.3,33.66],[-44.92,70.87],[-27.89,69.67],[-28.26,64],[-17.54,62.92],[-17.42,76.05],[-35.27,76.8],[-35.3,77.85],[-44.62,79.22],[-44.97,77.41]];
const shopCourt=[[-37.07,31.82],[-37,27.77],[-32.76,27.48],[-32.71,28.55],[-27.29,27.92],[-24.81,63.67],[-28.26,64],[-27.89,69.67],[-44.92,70.87],[-47.3,33.66]];
const shopSouth=[[-62.21,11.59],[-20.16,-6.51],[-8.75,-8.43],[-8.75,-2.35],[-10.62,-2.82],[-13.45,-1.02],[-13.12,.69],[-19.09,6.29],[-34.06,13.21],[-59.26,13.26],[-57.33,18.13],[-59.18,18.72],[-59.34,16.14],[-61.49,14.5]];
const garage=[[-12.21,13.32],[4.56,20.89],[7.59,16.54],[7.89,21.84],[9.37,21.9],[9.83,25.95],[9.62,76.04],[-12.19,75.58]];
const passageSouth=[[-15.79,10.61],[-14.1,10.31],[-14.25,12.4],[-12.21,13.32],[-12.2,38.14],[-15.75,38.87],[-16.14,37.64],[-26.28,42.47],[-28.3,13.2],[-23.13,12.18],[-23,9.83],[-17.5,4.84],[-16.04,7.28],[-17,8.48]];
const passageNorth=[[-17.54,62.92],[-24.79,64.07],[-26.28,42.47],[-16.14,37.64],[-15.75,38.87],[-12.2,38.14],[-12.71,75.58],[-17.42,76.05]];
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.4){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,w,step,h,depth=.4){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<w+.3)continue;for(let s=.3;s+w<L-.15;s+=step)for(let v=first;v+h<top-.25;v+=pitch)cuts.push(niche(a,b,s,s+w,v,v+h,depth));}return cuts.length?solid.subtract(union(cuts)):solid;}
function profileY(profile,y0,y1){return Manifold.extrude([ccw(profile)],y1-y0).rotate([90,0,0]).translate([0,y1,0]);}
const parts=[facade(prism(brick,BASE,z(96.260)),brick,8.8,3,96.25,1.7,2.8,1.9),prism(core,BASE,z(101.200))];
// Metalen glazen erkers met scherpe planhoeken. Twee overstekende erkers
// beginnen rond de negende woonlaag; de automatische LoD-reconstructie
// ziet daar de lagere plintdaken. De schuine voet wordt verbonden gedragen.
for(const [plan,footRoof] of [[eastBay,8.325],[westBay,14.542]]){
 parts.push(facade(prism(plan,BASE,z(footRoof)),plan,1.5,3.1,footRoof,2.1,3.0,2.5));
 const inner=plan.map(([x,y])=>[x*.83,y]);parts.push(Manifold.hull([...ring3(inner,z(25.1)),...ring3(plan,z(29.1))]),facade(prism(plan,z(29.0),z(96.260)),plan,29.7,3,96.2,2.5,3.0,2.25));
}
parts.push(facade(prism(southBay,BASE,z(101.334)),southBay,8.8,3,101.3,2.5,3.0,2.2));
// Het hele eigen winkel-/garagepand: drie straatbouwdelen en verlaagd
// binnendak. Dit zijn benoemde volumes met eigen dakhoogtes, geen hoogtelagen.
parts.push(facade(prism(shopWest,BASE,z(20.115)),shopWest,1.2,4.0,20,3.0,4.1,2.8),prism(shopCourt,BASE,z(15.847)),facade(prism(shopSouth,BASE,z(11.602)),shopSouth,1.2,4,11.5,2.8,4.0,2.8),facade(prism(garage,BASE,z(27.313)),garage,1.3,4.0,27.2,2.7,4.0,2.7));
// Vier lange licht gebogen / gefacetteerde groene dakbeuken op de garage,
// uit foto en gemeten goot/nokhoogtes, als doorlopende architectuurprofielen.
for(let k=0;k<4;k++){const a=-12.25+k*5.48,b=a+5.48,m=(a+b)/2;parts.push(profileY([[a,z(27.15)],[b,z(27.15)],[b,z(27.313)],[m+1,z(28.82)],[m,z(29.05)],[m-1,z(28.82)],[a,z(27.313)]],23.0,75.65).intersect(prism(garage,z(27.1),z(30))));}
// Lagere oostelijke aansluiting en gemeten opstaand gevel-/dakdeel naast
// het garagevolume, met de zichtbare lage voet eronder.
const eastGarage=[[9.7,13.51],[13.17,13.8],[12.9,21.8],[13.17,26.45],[9.83,25.95],[9.37,21.9],[7.89,21.84],[7.59,16.54]];
parts.push(prism([[9.91,18.46],[14.1,19.1],[13.1,26.44],[9.83,25.95]],BASE,z(10.421)),prism(eastGarage,z(10.3),z(27.579)));
// De verbinding/winkelpassage houdt een holle ruimte onder haar daken,
// op dragende kolommen, zonder nieuwe vloer over de openbare omgeving.
parts.push(prism(passageSouth,z(14.346),z(15.346)),prism(passageNorth,z(18.829),z(19.829)));
for(const [plan,top] of [[passageSouth,14.346],[passageNorth,18.829]])for(const u of [-25.2,-14.0])for(let v=14;v<74;v+=5){const column=B(u-.5,v-.5,u+.5,v+.5,.2,top+.1);if(column.intersect(prism(plan,z(.1),z(top+.2))).volume()>0)parts.push(column.intersect(prism(plan,BASE,z(top+.2))));}
// Aangesloten puien op de beide passage-einden. Geen muur over de hele hof:
// de buitenruimte blijft doorlopen tussen de kolommen en de winkelblokken.
parts.push(B(-27.8,12.7,-12.1,13.7,.2,14.45),B(-17.5,74.5,-12.3,75.5,.2,18.95));
// Open spitse passage-ingang als printvereenvoudiging van de glasentree.
const doorway=profileY([[-22.9,BASE-1],[-19.1,BASE-1],[-19.1,z(3.2)],[-21,z(6.1)],[-22.9,z(3.2)]],12.3,14.2);
// Afgeronde entreecanopy aan Bulgersteyn: geschatte gebogen bouwplaat, .9m
// dik, met een oplopende aangesloten onderzijde. Geen terreinplaat.
const canopy=[];for(let k=0;k<=20;k++){const a=(-180+k*180/20)*Math.PI/180;canopy.push([-2+13*Math.cos(a),-7+11*Math.sin(a)]);}canopy.push([11,-4],[-15,-4]);
parts.push(prism(canopy,z(4.9),z(5.8)));
// Gemeten installaties en lift-/techniekhuizen op de lage gebouwen.
for(const [a,b,c,d,h0,h1] of [[-55.3,24.02,-50.74,29.16,19.9,22.712],[-35.38,21.24,-32.31,26.0,19.9,23.173],[-40.3,15.4,-35.2,17.3,19.9,21.834],[-6.92,28.74,.02,33.39,28.2,33.189],[-19.3,25.56,-16.96,27.02,15.2,18.403],[-22.94,34.51,-20.83,36.96,15.2,19.386],[-46.39,14.1,-45.04,16.58,19.9,20.966]])parts.push(B(a,b,c,d,h0,h1));
// Binnendak: meetbare brede lichtstraat / techniek, als lage dakvorm,
// zonnepanelen en dunne relingen worden wegens hun dikte weggelaten.
parts.push(Manifold.hull([...ring3(rect(-43.98,47.3,-38.82,56.89),z(15.75)),...ring3(rect(-42.6,48.5,-40.2,55.7),z(17.083))]));
// De onderbouw heeft een gemeten ronde zuidwestelijke hoek en lage gebogen
// luifelstrook; beide blijven gekoppeld aan het winkelsolid.
parts.push(Manifold.cylinder(z(9.212)-BASE,3.65,3.65,48).translate([-58.65,10.1,BASE]),prism([[-50.43,5.84],[-49.8,4.8],[-20.16,-6.51],[-20.3,-5.55]],z(8.334),z(9.234)));
// Noordelijke lage toegang tot de ondergrondse ruimte: alleen het zichtbare
// gebouwtje; de ondergrondse garage krijgt geen bovenbouwplaat.
const northAccess=prism([[-44.11,84.91],[-34.41,85.9],[-35.8,90.11],[-44.0,89.9]],BASE,z(5.453));
let model=union(parts).subtract(doorway).setTolerance(.01);
model=Manifold.compose(model.decompose().filter(s=>s.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Schielandtoren niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:schielandtoren-erkers-volledige-winkels-garage-en-holle-passage',model],['building:schielandtoren-noordelijke-lage-toegang',northAccess]],catalog:{name:'Schielandtoren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:44.25283745,groundSamplePoints:[[92688,437125],[92708,437153],[92642,437126],[92616,437180]].map(local),replacesBuildings:['NL.IMBAG.Pand.0599100000702017'],description:'Compleet eigen Schielandtoren/Beursplein-pand: bakstenen toren met vensters, scherpe metalen glazen erkers en hun onderschalen, gemeten liftkern, hele winkel-/garageplint met vier doorlopende dakbeuken, verlaagd binnendak, holle passage op kolommen met open spitse entree, afgeronde canopy, daktechniek en noordelijke lage toegang. Geen fictieve dakspits, terrein-/garageplaat of gestapelde DSM-hoogtelagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:96.260,coreRoofNapM:101.200,southBayRoofNapM:101.334,localAhnMaximumNapM:101.406,westShopRoofNapM:20.115,innerRoofNapM:15.847,southShopRoofNapM:11.602,garageGutterNapM:27.313,garageRidgeNapM:29.05,passageRoofsNapM:[15.346,19.829],estimates:['vaste contouren uit BAG/3D BAG circa.5Ã¢â‚¬â€œ1m vereenvoudigd, gebogen zuidelijke winkelgevel gemiddeld11.602NAP, plaatselijk1Ã¢â‚¬â€œ2m onzeker','metalen erkers volgen fotoÃ¢â‚¬â„¢s en gemeten lagere contouren; twee overstekende delen vanaf29.1NAP, onderschaal25.1Ã¢â‚¬â€œ29.1 voor print, circa1Ã¢â‚¬â€œ2m onzeker','vensters1.7Ãƒâ€”1.9m met3m verdiepingsritme, glazen erkers2.5Ãƒâ€”2.25m, winkelpuien en kolomraster1m dik op5m uit fotoÃ¢â‚¬â„¢s geschat','passagevloerruimte blijft hol; gemeten lagere dakvlakken15.346/19.829 als1m dikke schalen, vrije hoogte wordt door45printcorrectie kleiner','vier garage-dakbeuken en nok29.05 uit gemeten band27.3Ã¢â‚¬â€œ29.1 en foto geschat; glas-/techniekvorm op binnendak geschat','entreecanopy circa26Ãƒâ€”14m op5.8NAP, .9m dik en boogvorm geschat; reclame/relings/kozijnen/zonpanelen dunner dan.9m weggelaten','noordelijke lage toegang staat afzonderlijk op terrein en is met eigen gesloten building-node opgenomen; overige Beursplein-panden blijven PDOK']},sources:['https://www.vormliving.nl/portfolio/schielandtoren/ (eigenaar,Pi de Bruijn,32woonlagen; schuine fotoÃ¢â‚¬â„¢s alleen referentie)','https://architectenweb.nl/projecten/project.aspx?id=1040 (eigen de Architekten Cie.-projectprofiel,Beursplein en metalen erkers,schuine fotoÃ¢â‚¬â„¢s alleen referentie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702017 (TU Delft/3DGI,CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
