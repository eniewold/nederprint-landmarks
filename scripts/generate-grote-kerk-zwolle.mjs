// Grote Kerk Zwolle: bouwdelen en regelmatige dakvlakken, geen DSM-lagen.
// BAG/AHN CC0; 3D BAG LoD2.2 CC BY 4.0; gemeten 10-10-2026.
import { Manifold, prism, rect, box, union, hull, circle, spire, writeLandmark, downFaces } from './efteling-kit.mjs';
const SLUG='grote-kerk-zwolle', ORIGIN=[202860,502915], ANGLE=.57*Math.PI/180;
const GROUND_NAP=3.8, BASE=-.55, nap=z=>z-GROUND_NAP;
const cut=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n);};
const roofed=(poly,planes)=>planes.reduce((s,[a,b,c])=>cut(s,a,b,nap(c)),prism(poly,BASE,60));
const ridgeY=(y,z,t)=>[[0,t,z-t*y],[0,-t,z+t*y]];
const pts=[],cuts=[];
// De drie hallen hebben eigen nokken, westelijke schilden en driezijdige koren.
// De zuidelijke hal is aan het koor één vak korter.
const halls=[
 {name:'zuid',poly:[[-30.3,-17.4],[25.8,-17.4],[29.9,-14.0],[29.9,-8.5],[25.8,-5.55],[-30.0,-5.55]],planes:[[0,1.5376,49.65],[0,-1.5413,15.42],[1.4965,0,67.08],[-1.79,0,75.65],[-1.358, .979,75.457],[-1.245,-1.133,49.547]]},
 {name:'midden',poly:[[-30.1,-5.6],[32.9,-5.6],[35.8,-2.1],[35.8,2.2],[33.4,5.5],[-29.65,6.55]],planes:[[0,1.543,31.93],[0,-1.5998,32.23],[1.4833,0,67.08],[-1.66,0,83.0],[-1.23,.996,69.765],[-1.285,-.9423,70.9]]},
 {name:'noord',poly:[[-29.65,6.5],[33.3,5.5],[36.18,8.87],[36.24,12.32],[33.5,16.63],[32.6,17.35],[-29.42,17.9]],planes:[[0,1.6079,14.459],[0,-1.5562,50.80],[1.4833,0,67.084],[-1.65,0,85.05],[-1.32,.847,63.657],[-1.311,-1.009,84.35]]},
];
for(const h of halls)pts.push(roofed(h.poly,h.planes));
// Westelijke consistorie: achtzijdig blok en echte achtzijdige lage spits.
const CONS=[-36.2,.55],cr=6.85;
pts.push(prism(circle(CONS,cr,8,Math.PI/8),BASE,nap(23.4)),spire(CONS,cr,nap(23.4),nap(31.45),8,Math.PI/8));
// De verbindingsruimte voorkomt losse volumes tussen consistorie en middenschip.
pts.push(box(-33.8,-5.55,BASE,-28.5,6.55,nap(23.6)));
// Noordportaal: rechthoekige bouw met hoge achtzijdige spits, zeskantige traptoren.
pts.push(box(-2.03,17.5,BASE,10.25,24.45,nap(19.4)));
pts.push(prism(circle([4.4,21.0],3.75,8,Math.PI/8),nap(18.5),nap(20.1)),spire([4.4,21],3.75,nap(20.1),nap(31.35),8,Math.PI/8));
pts.push(prism(circle([10.1,19.0],1.45,6,0),BASE,nap(22.9)),spire([10.1,19.0],1.45,nap(22.9),nap(26.2),6,0));
// Kleine hoekpinakels op het portaal: verbonden met de gevel, minimum 1,06 m.
for(const x of [-1.4,9.6])for(const y of [18.2,23.85]){
 pts.push(box(x-.53,y-.53,BASE,x+.53,y+.53,nap(21.6)),spire([x,y],.75,nap(21.6),nap(23.9),4,Math.PI/4));
}
// Catechisatielokaal: apart BAG-pand, eigen schilddak en geveltopje.
pts.push(roofed(rect(-17.22,17.3,-1.95,24.4),[...ridgeY(21.1,14.72,1.7),[1.85,0,41.2],[-1.83,0,4.63]]));
pts.push(roofed(rect(-13.7,22.1,-10.4,24.45),[[1.99,0,38.6],[-2.42,0,-16.0]]));
// Hoofdwacht aan de noordkant: eigen lage kap en centraal renaissancefronton.
pts.push(roofed(rect(10.2,17.2,26.2,24.1),[...ridgeY(20.85,13.4,1.53),[1.65,0,-7.0],[-1.90,0,56.75]]));
pts.push(roofed(rect(16.2,22.4,20.8,24.13),[[.9,0,-1.38],[-.9,0,31.92]]));
// Kooraanbouwen: zuidelijke sacristie en lage leprozenkapel tussen de koren.
pts.push(roofed(rect(18.05,-19.45,26.05,-16.8),[[0,.7869,23.738]]));
pts.push(roofed([[25.5,-14.1],[30,-14.1],[34,-6.8],[32.9,-5.6],[25.5,-5.6]],[[.027,0,9.025]]));
pts.push(box(.35,-18.6,BASE,6.05,-17.2,nap(8.65)));
pts.push(roofed([[.35,-18.6],[1.74,-19.99],[4.83,-20.02],[6.05,-18.6]],[[0,0,8.65]]));
// Steunberen: schuine bovenkant, geen horizontale uitstekende blokken.
const buttress=(x,y,deg,h,depth=1.45)=>hull([[-.55,1.0,BASE],[.55,1.0,BASE],[-.55,-depth,BASE],[.55,-depth,BASE],[-.55,1.0,nap(h)],[.55,1.0,nap(h)],[-.55,-depth,nap(h-2.8)],[.55,-depth,nap(h-2.8)]]).rotate([0,0,deg]).translate([x,y,0]);
for(const x of [-29.65,-22.4,-15.3,-8,-1.7,8.1,17.9,26.4]){
 pts.push(buttress(x,-17.35,0,23.0));
 if(x<-2||x>11)pts.push(buttress(x,17.7,180,23.0));
}
for(const [x,y,d]of [[25.8,-17,330],[29.9,-14.0,270],[29.9,-8.7,230],[35.8,-2.1,330],[35.8,-1.8,270],[35.8,2.1,270],[33.5,5.5,230],[33.1,17.1,230],[36.1,12.2,270],[36.1,8.8,270]])pts.push(buttress(x,y,(d+180)%360,22.1,1.2));
// Dakkapellen per travee op beide buitenste hellingen, en op de westelijke schilden.
for(const [side,y,plane]of [[-1,-15.8,[0,1.5376,49.65]],[1,16.0,[0,-1.5562,50.8]]])for(const x of [-26,-19,-12,-5,3.2,13,22.5]){
 const z=plane[1]*y+plane[2];
 pts.push(roofed(rect(x-.63,y-.75,x+.63,y+.75),[...ridgeY(y,z+1.5,1),[0,-side*1.5,z+2.2+side*1.5*y]]));
}
for(const y of [-11.3,11.5])pts.push(roofed(rect(-28.9,y-.65,-27.4,y+.65),[[1.5,0,68.8],...ridgeY(y,26.6,1.3)]));
// Blinde spitsboognissen van 0,35 m diep; geen fragiel maaswerk.
const niche=(x,y,deg,w,z0,z1)=>Manifold.extrude([[[ -w/2,nap(z0)],[w/2,nap(z0)],[w/2,nap(z1)],[0,nap(z1)+w*.72],[-w/2,nap(z1)]]],.55).rotate([90,0,0]).translate([0,.35,0]).rotate([0,0,deg]).translate([x,y,0]);
for(const x of [-26,-19,-12,-5,3.2,13,22.5]){
 cuts.push(niche(x,-17.35,0,4.2,7.2,17.8));
 if(x<-2||x>11)cuts.push(niche(x,17.7,180,4.2,7.2,17.8));
}
for(const y of [-11.2,11.5])cuts.push(niche(-30,y,270,4.6,6.5,18));
for(const h of halls)for(let i=1;i<h.poly.length-2;i++){const a=h.poly[i],b=h.poly[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len>3)cuts.push(niche((a[0]+b[0])/2,(a[1]+b[1])/2,Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,Math.min(3.8,len-1.1),7.2,17.3));}
cuts.push(niche(4.2,24.45,180,6.3,3.8,9.7),niche(4.2,24.45,180,4.2,13,15.3),niche(3.2,-20.01,0,2.8,4.1,6.0));
for(const x of [-14.5,-9.5,-4.6,12.9,16.6,20.3,23.8])cuts.push(niche(x,x<0?24.4:24.1,180,1.6,4.9,7));
for(const a of [Math.PI,3*Math.PI/4,5*Math.PI/4]){
 const r=cr*Math.cos(Math.PI/8);cuts.push(niche(CONS[0]+r*Math.cos(a),CONS[1]+r*Math.sin(a),90+a*180/Math.PI,2.3,9.5,16.3));
}
const solid=union(pts).subtract(union(cuts));
if(solid.decompose().length!==1||solid.genus()!==0)throw new Error('De kerk moet één gesloten volume zonder doorlopende gaten zijn.');
console.log('overhang-vlakken',JSON.stringify(downFaces(solid,BASE)));
await writeLandmark({slug:SLUG,nodes:[['building:kerk',solid]],base:BASE,catalog:{
 name:'Grote of Sint-Michaëlskerk',origin:ORIGIN,xAxis:[Math.cos(ANGLE),Math.sin(ANGLE)],groundOffsetMetres:-.3,groundHeight:46.3,
 groundSamplePoints:[[-44,0],[0,-25],[34,24],[-23,28]],
 replacesBuildings:['NL.IMBAG.Pand.0193100000000169','NL.IMBAG.Pand.0193100000004645','NL.IMBAG.Pand.0193100000018194'],
 description:'Drie hallen uit regelmatige dakvlakken met driezijdige koorsluitingen en westelijke schilden; korter zuiderkoor, achtzijdige consistorie, noordportaal met spits en zeszijdige traptoren, catechisatielokaal, Hoofdwacht, zuidportaal, kooraanbouwen, steunberen, dakkapellen en blinde vensternissen. Oorsprong bij het middenschip; +X naar het oosten, Z omhoog.',
 realWorld:{groundNapM:GROUND_NAP,northRidgeNapM:32.92,middleRidgeNapM:32.03,southRidgeNapM:32.54,consistoryTipNapM:31.45,portalSpireTipNapM:31.35,roofAxisDegrees:.57,minimumFreeStandingM:1.06},
 sources:['https://service.pdok.nl/lv/bag/wfs/v2_0','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000000169','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000004645','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000018194','https://monumentenregister.cultureelerfgoed.nl/monumenten/41666','https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Michaëlskerk (schuine referentiefoto’s, geen foto’s opgenomen)','https://commons.wikimedia.org/wiki/File:Exterieur_noord-oost_zijde_-_Zwolle_-_20229095_-_RCE.jpg (A.J. van der Wal/RCE, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Grote_of_Sint-Michaëlskerk_-_BB_-_2.jpg (Ben Bender, CC BY-SA 3.0)','https://www.dbnl.org/tekst/kuil005noor01_01/kuil005noor01_01_0016.php']
}});









