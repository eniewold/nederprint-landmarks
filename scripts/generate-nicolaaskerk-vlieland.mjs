import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// Nicolaaskerk Vlieland: gebouwstelsel langs de uit BAG/3D BAG gemeten nokken.
// X circa oost, Y circa noord; z in meters boven maaiveld (NAP +3,416 m).
const B=-.5, origin=[133513.13,589974.35], axis=[.999452,-.03310];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,35);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Twee kruisende zadeldaken, naar BAG; 3D BAG-nok NAP +14,43, goten +8,4 tot +8,6.
let pieces=[roofed(rect(-4.3,-14.0,4.95,14.0),[[1.28,0,10.59],[-1.28,0,11.43]]),
 roofed(rect(-9.64,-4.8,10.25,4.8),[[0,1.23,10.98],[0,-1.23,10.98]])];
// Kerkekamer aan zuidwestzijde met schilddak, afzonderlijk in de BAG-contour.
pieces.push(roofed(rect(-8.65,-10.63,-4.24,-4.76),[[1.08,0,16.9],[-1.08,0,.52],[0,1.08,15.90],[0,-1.08,-.52]]));
// Voorgevel: verhoogde klokvormige hals met rond gesloten top en tuit, direct op dakvlak.
const prof=[[-4.3,5.05],[-3.2,6.2],[-2.15,7.75],[-1.3,9.5],[-.85,11.2],[-.45,11.75],[.15,11.95],[.8,11.75],[1.25,11.2],[1.7,9.5],[2.65,7.75],[3.75,6.2],[4.95,5.05]];
pieces.push(hull(prof.flatMap(([x,z])=>[[x,-14.04,z],[x,-13.60,z]])));
// Tuitgevels west, oost en noord: korte nokverhoging boven de dakvoet.
for(const x of [-9.65,9.85])pieces.push(box(x,-.48,x+.4,.48,10.8,11.35));
pieces.push(box(-.16,13.6,.84,14.02,10.85,11.35));
// Zichtbare steunberen (foto's): getrapt/afgeschuind, ≥0,9 m breed voor de printschaal.
const buttress=(x,y,angle,h=5.3)=>{const pts=[[-.45,0,B],[.45,0,B],[-.45,-.85,B],[.45,-.85,B],[-.45,0,h],[.45,0,h],[-.45,-.28,h], [.45,-.28,h],[-.45,-.85,h-1.0],[.45,-.85,h-1.0]];return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
for(const x of [-3.65,3.8])pieces.push(buttress(x,-14.0,0,4.7));
for(const y of [-3.5,0,3.5])pieces.push(buttress(-9.6,y,270,4.6));
for(const y of [-3.5,3.5])pieces.push(buttress(10.2,y,90,4.6));
for(const y of [-12.1,-8.1,8.1,12.1]){pieces.push(buttress(4.92,y,90,4.4)); if(y>0)pieces.push(buttress(-4.28,y,270,4.4));}
let all=union(pieces);
// Rondbogige blinde nissen 0,35 m diep; afgeronde vensters en deur op de zichtbare gevels.
const niche=(x,y,w,z0,z1,ang=0)=>{const r=w/2,z=z1-r,pts=[[-r,z0],[r,z0],[r,z],[r*.866,z+r*.5],[r*.5,z+r*.866],[0,z1],[-r*.5,z+r*.866],[-r*.866,z+r*.5],[-r,z]];return hull(pts.flatMap(([u,v])=>[[u,0,v],[u,.7,v]])).rotate([0,0,ang]).translate([x,y,0])};
const cuts=[];
// Voorgevel aan de straat, met hoofddeur, twee ramen en drie ronde bovenlichten.
cuts.push(niche(.35,-14.38,2.0,0,3.25),niche(-2.65,-14.38,1.35,1.35,4.45),niche(3.25,-14.38,1.35,1.35,4.45));
for(const x of [-1.35,2.05])cuts.push(niche(x,-14.38,.95,5.5,6.45));cuts.push(niche(.35,-14.38,.95,8.15,9.1));
// Westelijk dwarsschip: twee onderramen en twee hoge vensters op de topgevel.
for(const y of [-1.95,1.95])cuts.push(niche(-9.99,y,1.55,1.45,5.0,270),niche(-9.99,y,1.05,6.0,7.7,270));
// Oostelijk dwarsschip; gevelvensters en kleinere vensters in de top.
for(const y of [-1.95,1.95])cuts.push(niche(10.6,y,1.55,1.45,5.0,90),niche(10.6,y,1.05,6.0,7.7,90));
// Langsgevels van zuid- en noordarm en sluitgevel noord.
for(const y of [-12.05,-8.0,8.0,12.05])cuts.push(niche(5.30,y,1.4,1.35,5.0,90));
for(const y of [8.0,12.05])cuts.push(niche(-4.66,y,1.4,1.35,5.0,270));
cuts.push(niche(.3,14.35,1.6,1.4,5.05,180));
// Kerkekamer: ramen in de straat- en westzijde.
cuts.push(niche(-6.5,-10.98,1.2,2.0,4.1),niche(-9.0,-8.0,1.2,2.0,4.1,270));
all=all.subtract(union(cuts));
await writeLandmark({slug:'nicolaaskerk-vlieland',base:B,nodes:[['building:kerk',all]],catalog:{name:'Nicolaaskerk Vlieland',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-11,-6],[-11,6],[0,-16],[0,16],[12,-6],[12,6]],replacesBuildings:['NL.IMBAG.Pand.0096100000383318'],description:'Kruiskerk met twee kruisende zadeldaken, klokgevel, tuitgevels, kerkekamer, steunberen en blinde venster- en deurnissen.',realWorld:{groundNapM:3.416,naveRidgeNapM:14.43,modelTopM:11.95},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0096100000383318','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/37576','https://commons.wikimedia.org/wiki/Category:Sint-Nicolaaskerk,_Vlieland','https://nicolaaskerk-vlieland.nl/-/overdekerk']}});
