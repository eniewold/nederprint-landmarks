// Het Potlood: zeshoekige woontoren, twaalfvlakkige punt en lage westaanbouw.
// Referentie voor deze rij: generate-evoluon.mjs, geheel gelezen. Geen DSM-lagen.
import {box,prism,circle,spire,hull,union,writeLandmark} from './efteling-kit.mjs';
const slug='blaaktoren',origin=[93245.14,437273.13],angle=-27.85;
const xAxis=[Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180)];
const ground=3.15,base=-2.3,z=n=>n-ground,parts=[],cuts=[];
const bodyRadius=12.75,wallNap=41.52,shoulderNap=48.64,pointNap=63.86708;
const body=circle([0,0],bodyRadius,6);
parts.push(prism(body,base,z(wallNap)));
// Doorlopende dakmantel tussen zeshoekige gevel en twaalfhoekige dakknik.
parts.push(hull([...body.map(([x,y])=>[x,y,z(wallNap-.15)]),...circle([0,0],8.0,12).map(([x,y])=>[x,y,z(shoulderNap)])]));
parts.push(spire([0,0],8.0,z(shoulderNap-.05),z(pointNap),12,0));
// Onderste draagring van de onderhoudsgalerij: schuine kraag, geen vrij dek.
parts.push(hull([...circle([0,0],6.5,12).map(([x,y])=>[x,y,z(50.9)]),...circle([0,0],7.18,12).map(([x,y])=>[x,y,z(51.70)])]));
// Twaalf dragende dakgraten, verbreed tot .9m; geen vrijstaande balustrade.
for(let j=0;j<12;j++){
 const a=j*Math.PI/6,d=[Math.cos(a),Math.sin(a)],t=[-d[1],d[0]],ps=[];
 for(const [r,n]of[[7.9,48.85],[.55,62.82]])for(const w of[-.45,.45])for(const dz of[-.8,.12])ps.push([r*d[0]+w*t[0],r*d[1]+w*t[1],z(n)+dz]);
 parts.push(hull(ps));
}
// Dertien woonlagen. De typische vensters hebben een afgeschuinde/ronde onderzijde;
// blinde nissen .35m diep houden ramen en hoekbalkons printbaar zonder steun.
const apothem=bodyRadius*Math.cos(Math.PI/6),storey=2.77;
for(let side=0;side<6;side++){
 const a=30+side*60;
 for(let floor=0;floor<13;floor++){
  const nap=5.45+floor*storey;
  if(side===2){
   // Westelijke ontsluitingssectie: smalle trapvensters boven de aanbouw.
   for(const t of[-2.0,2.0])if(nap>11.5)cuts.push(box(apothem-.35,t-.65,z(nap),apothem+.4,t+.65,z(nap+1.55)).rotate([0,0,a]));
  }else for(const t of[-4.3,-1.45,1.45,4.3]){
   if(side===3&&t===4.3&&floor===0)continue; // Achter het lage zijterras.
   const window=[[-.94,.38],[-.56,0],[.56,0],[.94,.38],[.94,2.08],[-.94,2.08]];
   cuts.push(prism(window,0,.75).rotate([90,0,90]).translate([apothem-.35,t,z(nap)]).rotate([0,0,a]));
   // Gedragen witte borstwering onder het venster, geen dun vrij kozijn.
   if(!(side===3&&nap<11.5))parts.push(hull([[apothem-.12,t-1.1,z(nap-.7)],[apothem-.12,t+1.1,z(nap-.7)],
    [apothem-.12,t-1.1,z(nap-.05)],[apothem-.12,t+1.1,z(nap-.05)],
    [apothem+.3,t-1.1,z(nap-.05)],[apothem+.3,t+1.1,z(nap-.05)]]).rotate([0,0,a]));
  }
 }
}
// Hoekbalkons als diepe maar blinde inkepingen; borstweringen blijven solide.
for(const j of[0,1,2,4,5])for(let k=0;k<13;k++){
 const n=5.4+k*storey;
 if((j===2||j===4)&&n<11.5)continue; // Onderste balkons vallen achter de aanbouw: geen ingesloten holte.
 cuts.push(box(11.42,-1.18,z(n+.3),13.4,1.18,z(n+2.2)).rotate([0,0,j*60]));
}
// BAG bevat de lage westaanbouw met centrale glasnok en steile entreekap.
// Dakvlakken uit 3D BAG (TU Delft/3D geoinformatie, CC BY 4.0), gecontroleerd op AHN.
const lowOutline=[[-26.99,0],[-20.98,10.48],[-13.22,10.48],[-5.83,11.48],[-6.44,-10.53],[-20.93,-10.53],[-24.02,-5.18],[-24.02,-3.52],[-25.2,-3.15]];
const roofPlane=(poly,a,b,c)=>{const n=Math.hypot(a,b,1);return prism(poly,base,80).trimByPlane([a/n,b/n,-1/n],-(c-ground)/n);};
// Twee regelmatige schuine vlakken met glasnok naar de toren, plus lage zijterrassen.
parts.push(roofPlane([[-21.60,2.82],[-16.98,10.48],[-13.22,10.48],[-9.95,5.70],[-12.17,1.64],[-12.16,0.06],[-19.69,0]],.4881,-.2796,17.3881));
parts.push(roofPlane([[-21.87,-3.07],[-20.93,-10.53],[-12.20,-10.53],[-12.17,-8.28],[-9.49,-5.90],[-11.43,-2.96],[-12.15,-.86],[-12.16,.07],[-19.69,0]],.4758,.2790,17.1619));
parts.push(prism(lowOutline,base,z(5.85)));
parts.push(prism([[-16.98,10.48],[-13.22,10.48],[-9.95,5.7],[-7.39,9.71],[-5.83,11.48],[-12.67,11.47]],base,z(8.018)));
parts.push(prism([[-12.2,-10.53],[-6.44,-10.53],[-9.49,-5.91],[-11.43,-2.96],[-12.13,-3.03]],base,z(8.085)));
// Dakje van de afzonderlijk herkenbare westentree, centrale top NAP13.73.
const entryOutline=[[-26.99,0],[-25.19,3.12],[-21.6,2.82],[-19.86,-.28],[-21.87,-3.07],[-25.2,-3.15]];
parts.push(hull([...entryOutline.map(([x,y])=>[x,y,base]),[-26.99,0,z(7.71)],[-25.19,3.12,z(5.84)],[-21.6,2.82,z(5.86)],[-19.86,-.28,z(7.63)],[-21.87,-3.07,z(5.86)],[-25.2,-3.15,z(5.63)],[-23.35,-.08,z(13.73)]]));
cuts.push(box(-27.3,-.95,z(2.6),-26.63,.95,z(6.5)));
const raw=union(parts).subtract(union(cuts));
const shells=raw.decompose().filter(s=>Math.abs(s.volume())>1e-6);
if(raw.status()!=='NoError'||shells.length!==1)throw Error('Geen verbonden volume '+JSON.stringify(shells.map(s=>({v:s.volume(),bb:s.boundingBox()}))));
await writeLandmark({slug,base,nodes:[['building:zeshoekige woontoren met puntdak en westentree',shells[0]]],catalog:{
 name:'Blaaktoren (Het Potlood)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[0,-18],[8,-18],[14,-14]],
 replacesBuildings:['NL.IMBAG.Pand.0599100000642847'],
 description:'Hart en gevelrichting uit BAG/3D BAG en AHN; +X op -27.85 graden RD. Zeshoekige woontoren met twaalf dakvlakken boven de knik en complete lage westaanbouw. Voet verdiept voor het verschillende straatniveau.',
 realWorld:{groundNapM:ground,bodyDiameterM:bodyRadius*2,wallNapM:wallNap,shoulderNapM:shoulderNap,topNapM:pointNap,woonlagen:13,
 schattingen:['gevelvensters, borstweringen, balkoninkepingen en trapvensters uit foto vereenvoudigd; nissen .35m diep','hoofdvorm van de zeshoek regelmatig gemaakt; bovenkap 12 vlakrichtingen uit 3D BAG','onderhoudsgalerij als gedragen kraag, dun hek en fijne metaalnaden weggelaten','maaiveld NAP3.15 aan zuidzijde; vlakke onderkant 2.3m verdiept voor lage westzijde']},
 sources:['PDOK BAG 0599100000642847, AHN DSM/DTM .5m, Actueel_orthoHR; 2026-10-09',
 'https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000642847 (3D BAG, CC BY 4.0)',
 'https://rotterdamwoont.nl/app/uploads/2018/01/4.1982.2-projectbladen-Blaakoverbouwing-3.pdf',
 'https://commons.wikimedia.org/wiki/File:Rotterdam_-_Blaaktoren.jpg',
 'https://commons.wikimedia.org/wiki/File:Rotterdam_-_Kijk_Kubus_%26_Blaaktoren.jpg',
 'https://commons.wikimedia.org/wiki/File:Centrale_bibliotheek_van_Rotterdam_en_Blaaktoren_-_City_of_Rotterdam_(21999005883).jpg']
}});
