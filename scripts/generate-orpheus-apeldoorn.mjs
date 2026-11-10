// Orpheus te Apeldoorn: benoemde gebouwvleugels en kap als doorsnede.
// Maten uit BAG, 3D BAG en AHN4 DSM 0,5 m.
import {Manifold,prism,box,hull,union,writeLandmark} from './efteling-kit.mjs';
const O=[193650,470325], G=17.11, BASE=-.7, at=z=>z-G;
const FOOT=[[9.62,-36.271],[11.198,-41.188],[21.927,-37.736],[26.769,-42.935],[25.943,-49.99],[44.829,-39.034],[51.298,14.217],[60.823,13.1],[63.595,36.139],[33.298,39.879],[33.125,39.9],[33.117,39.833],[-14.786,45.756],[-16.101,35.066],[-17.544,23.513],[-49.156,27.432],[-49.353,25.832],[-52.465,26.23],[-54.085,13.564],[-57.228,13.933],[-60.201,-11.34],[-50.967,-12.474],[-49.351,-19.604],[-27.875,-15.431],[-29.927,-31.938],[-11.161,-29.02],[-10.715,-31.901],[-4.356,-30.913],[-1.448,-39.858]];
// Buitencontour met foyer op NAP +26,9; op de lage zuidvleugel na.
const lowSouth=[[7.5,-20],[7.1,-21.4],[21.8,-37.8],[11.2,-41.2],[9.6,-36.3],[-1.4,-39.9],[-5.3,-28.4],[-11.9,-29.1],[-9.7,-17.7]];
const lowAnnex=[[-5.3,-28.4],[-4.4,-30.9],[-10.8,-31.6],[-11.1,-29.2]];
let foyer=prism(FOOT,BASE,at(26.9)).subtract(prism(lowSouth,BASE-1,at(27.1))).subtract(prism(lowAnnex,BASE-1,at(27.1)));
const blocks=[prism(lowSouth,BASE,at(23.15)),prism(lowAnnex,BASE,at(21.2)),
// Voormalige zaal, toneelhuis, zaalvleugels, noordfoyer en dak boven gang.
prism([[8.4,-19.2],[.9,-18.9],[3.8,5.6],[16.3,9.2],[25.5,-18.6],[13.4,-21.8]],BASE,at(39.85)),
// Het flauwe dak van de oudere zaal is een doorlopend vlak (helling ca. 5°).
(()=>{const p=[[32.6,-12.3],[23.9,-13.6],[17.5,5.6],[25.4,9.5],[36.8,11.7],[41.4,3.7],[42.1,-7.3]]; return hull([...p.map(([x,y])=>[x,y,BASE]),...p.map(([x,y])=>[x,y,at(29.8+.082*(x-30)+.027*y)])]);})(),
prism([[-29.9,-31.9],[-27.9,-15.7],[-9.7,-17.7],[-11.9,-29.1]],BASE,at(31.1)),
// Grote installaties op het oostelijke foyer- en toneeldak, AHN/3D BAG.
prism([[18.5,11],[21.7,11.5],[23.5,19.6],[27.5,19.5],[28.3,20.6],[24.9,23.2],[22,21.7],[20.6,15.5]],BASE,at(28.7)),
prism([[27.9,16.1],[28.2,14.8],[35,15.6],[37.7,15.3],[38.1,17],[34.6,17.6]],BASE,at(27.85)),
prism([[33.6,18.4],[33.9,17.4],[36.8,16.7],[38,17.1],[39.4,24.9],[37.4,25.4],[37.9,19.6]],BASE,at(28.85)),
prism([[27.4,18.5],[31.7,18.4],[32,17],[33.9,17.4],[33.4,19],[34.7,19.8],[36.2,30.6],[34.9,31.6],[33.7,22.9],[32.8,20.7],[27.6,20.3]],BASE,at(28.1)),
prism([[34,14.2],[36.6,14.2],[36.7,15.6],[34,15.6]],BASE,at(37.85)),
prism([[33.1,39.8],[34.2,38.3],[32.4,27.8],[25.5,28.1],[25.6,28.9],[19,27.8],[18.4,29.2],[-16.3,33.5],[-14.8,45.8]],BASE,at(28.1)),
prism([[-.4,13.3],[-41,17.6],[-44,19.2],[-47.6,12.8],[-54.1,13.7],[-52.5,26.2],[6.9,19],[1.1,13.1],[3.8,12.8],[8.4,14.3],[8.2,12.6],[-.9,9.4]],BASE,at(28.1)),
prism([[-1.3,10.8],[.1,6.4],[-25.7,9.9],[-34.3,14.2],[-33.6,16.9],[-.4,13.3]],BASE,at(31.55)),
prism([[-49.4,-19.6],[-50.8,-13.1],[-30.4,-15.9]],BASE,at(33.5)),
prism([[-44,19.2],[-34.3,14.2],[-25.7,9.9],[-47.6,12.8]],BASE,at(33.5))];
// Doorsnede van de westelijke zaal: de gebogen kop met een reeks rechte raakvlakken,
// niet gestapelde hoogtelagen. As -7,1 graden RD, breedte 24,7 m.
const shell=[[-60,BASE], [0,BASE],[0,at(44.9)],[-24,at(45.0)],[-30,at(44.79)],[-34,at(44.45)],[-38,at(43.72)],[-42,at(42.54)],[-46,at(40.87)],[-50,at(38.62)],[-54,at(35.59)],[-58,at(30.88)],[-60,at(27.25)]];
const hall=Manifold.extrude([shell],24.7).rotate([90,0,0]).translate([0,12.35,0]).rotate([0,0,-7.1]).translate([2.35,-6.65,0]);
// De entreeluifel is conform de taakopdracht weggelaten.

let body=union([foyer,...blocks,hall]).decompose().sort((a,b)=>b.volume()-a.volume())[0];
// Onzichtbaar glas wordt ondiep ingesneden: kader en stijlen blijven staan.
// Zuid- en oostgevel van het oude theater, en westelijke foyer onder de kap.
const glassCuts=[];
for(let i=0;i<FOOT.length-1;i++){
 const a=FOOT[i],b=FOOT[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);
 const oldFront=a[0]>20 && b[0]>20 && Math.min(a[1],b[1])<15;
 const westFront=a[0]<-54 && b[0]<-54;
 if(L<8||(!oldFront&&!westFront)) continue;
 const ang=Math.atan2(dy,dx)*180/Math.PI;
 for(let t=1;t<L-2;t+=3.8) for(const [lo,hi] of [[1.3,3.7],[5,7.6]])
  glassCuts.push(hull([[t,-.3,lo],[Math.min(t+2.8,L-.8),-.3,lo],[t,.35,lo],[Math.min(t+2.8,L-.8),.35,lo],[t,-.3,hi],[Math.min(t+2.8,L-.8),-.3,hi],[t,.35,hi-.7],[Math.min(t+2.8,L-.8),.35,hi-.7]]).rotate([0,0,ang]).translate([...a,0]));
}
body=body.subtract(union(glassCuts));
// Buitentrap zuidwest, gemeten AHN: NAP +19,6 tot +24,8 m.
// Werkelijke stalen treden en leuningen zijn vereenvoudigd tot aaneengesloten,
// steunloze treden van 1,2 m (waarheid circa 0,3 m) bij 1:1000.
const stair=[];
for (let i=0; i<10; i++) {
  const y0=-25.0+i*1.2, y1=y0+1.21;
  stair.push(box(-58.0,y0,BASE,-53.0,y1,2.45+i*.53));
}
stair.push(box(-58,-13.1,BASE,-52,-10.3,7.22));
body=union([body,...stair]);
if(body.status()!=='NoError'||body.decompose().length!==1) throw Error('Orpheus is niet gesloten');
await writeLandmark({slug:'orpheus-apeldoorn',base:BASE,nodes:[['building:theater',body]],catalog:{name:'Orpheus',origin:O,xAxis:[1,0],groundOffsetMetres:-.3,groundSamplePoints:[[70,0],[0,-65],[-75,0]],replacesBuildings:['NL.IMBAG.Pand.0200100000700144'],description:'Theater Orpheus met gebogen kap van de westelijke grote zaal, toneelhuis, oudere zaal en lage foyers.',realWorld:{groundNapM:G},sources:['PDOK AHN DSM 0,5m en ortho, 10 november 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0200100000700144','https://www.architectuur.org/bouwwerk/266/Theater_Orpheus.html','https://commons.wikimedia.org/wiki/Category:Schouwburg_Orpheus,_Apeldoorn','https://quadrat.nl/buitenruimte/orpheus-apeldoorn.html']}});
