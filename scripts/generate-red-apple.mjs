// The Red Apple, KCAP, 2009. Voorbeeld generate-evoluon.mjs geheel gelezen.
// Vaste bouwprisma's, gevelstijlen en atriumdakschalen, geen DSM-hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='red-apple',ORIGIN=[93218,436907],ANGLE=44.66,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=2.6,BASE=-1.2,z=h=>h-GROUND;
const tower=[[-56.55,18],[-56.35,-2.11],[-34.19,-2.62],[-33.66,18.02]];
const garage=[[-34.19,-2.62],[-20.26,-2.62],[-19.44,4.67],[-.18,4.52],[-.04,-2.63],[15.25,-2.63],[14.85,19.15],[9.9,17.8],[4.7,16.44],[-33.71,16.08]];
const officeRoof=[[-20.26,-2.62],[-.04,-2.63],[-.18,4.52],[-19.44,4.67]];
const kop=[[15.19,-2.63],[62.33,-2.38],[62.23,14.77],[21.3,33.83],[14.75,19.07]];
const kopFoot=[[15.0,.4],[59.3,.7],[59.2,12.9],[22.7,29.9],[14.6,19.4]];
const lowWest=[[-56.21,18],[-35.53,18.02],[-36.47,20.79],[-31.08,32.61],[-46.15,39.93],[-54.8,21.12]];
const lowNorth=[[-35.04,19.44],[-31.48,16.1],[2.57,16.42],[4.2,22.77],[-15.04,27.06],[-27.21,30.83],[-31.42,31.87],[-33.31,27.71],[-29.31,21.41]];
const lowKop=[[2.16,23.36],[8.68,21.46],[15.32,36.6],[9.52,39.24]];
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.4){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.5],[s0,.5]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,width,step,height,depth=.4){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.65;s+width<L-.4;s+=step)for(let h=first;h+height<top-.3;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height,depth));}return cuts.length?solid.subtract(union(cuts)):solid;}
// Doorlopende glazen woontoren; de red aluminiumstijlen zijn aan de onderkant
// breder. De uiterste dakrand boven de gemeten vloer blijft open tussen stijlen.
const parts=[prism(tower,BASE,z(123.273))];
const p=ccw(tower),glassCuts=[];
for(let i=0;i<p.length;i++){
 const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];
 for(let s=.8;s+1<L;s+=1.9){const plan=w=>[[s-w/2,-.35],[s+w/2,-.35],[s+w/2,.15],[s-w/2,.15]].map(([q,d])=>[a[0]+q*t[0]+d*n[0],a[1]+q*t[1]+d*n[1]]);glassCuts.push(Manifold.hull([...ring3(plan(.7),z(3)),...ring3(plan(1.35),z(123.2))]));}
 for(let h=6;h<123;h+=3)glassCuts.push(niche(a,b,.2,L-.2,h,h+.18,.12));
 for(let s=.25;s+.9<L;s+=1.9){const plan=[[s,-.9],[s+.9,-.9],[s+.9,0],[s,0]].map(([q,d])=>[a[0]+q*t[0]+d*n[0],a[1]+q*t[1]+d*n[1]]);parts.push(prism(plan,z(123.1),z(124.25)));}
}
parts[0]=parts[0].subtract(union(glassCuts));
parts.push(prism([[-42.1,5.69],[-41.7,11.78],[-47.51,9.62],[-47.69,5.83]],z(123.1),z(125.991)),prism([[-53.33,7.35],[-52.75,3.96],[-51.31,3.95],[-51.17,7.98],[-52.99,8.22]],z(123.1),z(125.672)));
// Hele parkeer-/kantooronderbouw en de hogere terugliggende kantoorstrook.
parts.push(facade(prism(garage,BASE,z(23.937)),garage,3.2,3.45,23.8,2.4,3.5,2.6),facade(prism(officeRoof,z(23.7),z(29.769)),officeRoof,25.0,3.4,29.6,2.4,3.5,2.5));
parts.push(facade(prism(lowWest,BASE,z(7.063)),lowWest,3.0,4,7.1,2.7,3.7,3.35),facade(prism(lowNorth,BASE,z(6.357)),lowNorth,3.0,4,6.6,2.7,3.7,2.6),facade(prism(lowKop,BASE,z(8.674)),lowKop,3.0,3.3,8.6,2.0,3.0,2.5));
parts.push(prism([[-37.37,35.5],[-43.52,30.01],[-39.53,27.49],[-31.91,32.99]],z(6.9),z(13.431)),prism([[-35.53,18.02],[-33.66,18.02],[-29.31,21.41],[-33.31,27.71],[-36.47,20.79]],z(6.2),z(13.419)));
// Aansluitvleugel tussen garage, lage winkelzijde en kopblok; het hogere
// glas-/entreevlak is als vast bouwdeel gemodelleerd.
parts.push(facade(prism([[2.8,16.25],[12.1,16.25],[14.7,19.8],[16.7,23.4],[21.14,33.45],[15.32,36.6],[8.68,21.46],[4.2,22.77]],BASE,z(25.92)),[[2.8,16.25],[12.1,16.25],[14.7,19.8],[16.7,23.4],[21.14,33.45],[15.32,36.6],[8.68,21.46],[4.2,22.77]],3.2,3.4,25.9,2,3.1,2.6));
// Kopblok: glazen terugliggende onderbouw, zichtbare draagkolommen en het
// uitkragende vijfhoekige woonvolume. Onderzijde en kolomraster zijn fotomaten.
parts.push(facade(prism(kopFoot,BASE,z(25.9)),kopFoot,3.05,3.35,25.85,2.0,3.0,2.7));
for(const u of [19,25,31,37,43,49,55,58.7])parts.push(B(u-.6,1.0,u+.6,2.3,25.7,29.6));
for(const [u,v] of [[59,11.8],[52.7,16.3],[45.8,19.5],[38.8,22.7],[31.8,25.8],[24.8,29.0],[18.5,20.7]])parts.push(B(u-.6,v-.6,u+.6,v+.6,25.7,29.6));
let upper=facade(prism(kop,z(29.4),z(56.002)),kop,30.0,3.15,56,2.4,2.8,2.45,.45);
// Twee grote atriumvensters als diepe blinde velden, met aangesloten brede
// lamelregels. Fijne werkelijke roedes zijn op 1:1000 niet afzonderlijk.
const cp=ccw(kop);for(const i of [0,2]){const a=cp[i],b=cp[(i+1)%cp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),s=L*.42;upper=upper.subtract(niche(a,b,s,s+7.5,37.0,49.8,1.6));for(let h=37.1;h<49.1;h+=1.4)parts.push(niche(a,b,s,s+7.5,h,h+.9,.85).intersect(prism(kop,z(29.4),z(56.002))));}
// Atrium en dakterrassen zijn uitsparingen in het benoemde kopblok. Alleen
// ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©n meter dikke glaskappen/terrasvlakken sluiten de gemeten lagere daken.
const atriumA=[[27.54,-2.0],[46.02,-2],[46.19,5.53],[36.46,6.23],[28.59,6.03],[30.39,2.91],[25.89,3.09],[25.96,-1.4]];
const atriumB=[[23.59,5.9],[47.13,5.32],[53.76,8.93],[31.83,18.88],[31.57,11.44],[23.68,10.14]];
upper=upper.subtract(union([prism(atriumA,z(32),z(60)),prism(atriumB,z(32),z(60))]));
parts.push(upper,prism(atriumA,z(45.926),z(46.926)),prism(atriumB,z(51.803),z(52.803)),B(25.84,10.49,31.57,17.8,55.8,58.418));
// Gemeten dakinstallaties en liftkasten, afzonderlijke aangesloten bouwdelen.
parts.push(prism([[25.33,15.72],[31.81,18.33],[31.83,18.88],[25.61,21.15]],z(55.8),z(58.325)),prism([[-45.41,39.8],[-44.5,37.17],[-42.2,38],[-40.1,38.75],[-39.25,40.99]],z(6.9),z(27.279)));
// Gemeten kleinere installaties op garage en het lagere atriumdak.
for(const [plan,h,base] of [
 [rect(12.5,-2.5,15.0,-1.1),26.754,23.8],
 [rect(5.0,11.27,6.97,14.63),25.871,23.8],
 [[[-29.76,3.82],[-30.95,.75],[-29.67,.08],[-28.3,2.96]],25.128,23.8],
 [[[3.13,11.56],[3.95,15.42],[2.46,15.64],[2,12.37]],25.073,23.8],
 [[[26.94,2.25],[28.6,2.3],[30.39,6.03],[27,6.0]],47.843,46.8],
 [rect(32.7,.6,35.4,2.7),47.492,46.8],
 [rect(32.2,4.35,36.4,6.15),48.512,46.8],
 [rect(37.35,.1,40.5,3.3),47.810,46.8],
 [[[-33.7,16.1],[-31.5,16.1],[-33.5,18]],16.168,13.3],
 ])parts.push(prism(plan,z(base),z(h)));
// De openbare arcade loopt door de lage noordelijke winkelplint. Een spitse
// bovenzijde is een printvereenvoudiging van de rechthoekige fotodoorgang.
const passage=Manifold.extrude([ccw([[-13.9,BASE-1],[-11.1,BASE-1],[-11.1,z(4.6)],[-12.5,z(6.2)],[-13.9,z(4.6)]])],14).rotate([90,0,0]).translate([0,31,0]);
let model=union(parts).subtract(passage).setTolerance(.01);
model=Manifold.compose(model.decompose().filter(s=>s.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Red Apple niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:red-apple-toren-kopblok-atria-arcade-en-volledige-plint',model]],catalog:{name:'The Red Apple',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:46.01782201,groundSamplePoints:[[93198,436863],[93213,436886],[93261,436944],[93207,436950]].map(local),replacesBuildings:['NL.IMBAG.Pand.0599100000753288'],description:'Volledige Red Apple: toren met versmallende verticale stijlen en glazen gevelvelden, vijfhoekig uitkragend kopblok op terugliggende onderbouw en kolommen, hol atrium met twee gemeten glaskappen, grote diepe atriumvensters, parkeer-/kantooronderbouw, winkels, arcade, lage vleugels en gemeten techniek. Vaste bouwprismaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s en dakschalen, geen DSM-hoogtelagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:123.273,towerCoreNapM:125.991,kopRoofNapM:56.002,atriumRoofsNapM:[46.926,52.803],kopCoreNapM:58.418,garageNapM:23.937,officeRoofNapM:29.769,lowRoofsNapM:[6.357,7.063,8.674,13.419,13.431],estimates:['contouren circa .5ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“1m uit BAG/3D BAG/luchtfoto vereenvoudigd; koponderbouw 3m terugliggend en onderzijde29.4NAP uit fotoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s geschat','kolomraster en 1.2m dikke kolommen, torenstijlen.85ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢.3m, vensters/ritme en kopbloklamellen uit architectfotoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s geschat','atria hol tot geschatte vloer32NAP; twee gemeten glaskappen1m dik; grote atriumvensters1.6m diep blind voor printbaarheid','arcade2.8m breed met spitse bovenzijde is geschatte printdoorgang; fijne roedes/glasrelings/dakrails en vegetatie smaller dan.9m weggelaten','geen extra straat-/kade-/garageplaat; aansluitende ibis/Dock21 zijn eigen BAG-panden en blijven PDOK']},sources:['https://www.kcap.eu/projects/6/red-apple-rotterdam (architect,2009,124m,bouwprogramma; fotoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s Rob tHart en Ossip van Duivenbode alleen referentie)','https://www.kcap.eu/pressroom?project=6 (publiek benoemde schuine fotoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s, alleen referentie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000753288 (TU Delft/3DGI,CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
