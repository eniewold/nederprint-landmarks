// Kunstlinie, Almere. In gebouwassen: X naar oostnoordoost, -Y naar het water.
// Vlaksgewijze zaalvolumes en vlakke daken, maten in meters (AHN DSM + BAG).
import {box, union, writeLandmark} from './efteling-kit.mjs';
const ORIGIN=[143502.801,486617.075], AXIS=[0.971292,0.237888];
const GROUND=-4.4, BASE=-0.4, roof=0.24-GROUND;
const rect=(u0,v0,z0,u1,v1,z1)=>box(u0,-v1,z0,u1,-v0,z1);
let body=union([
  rect(0,0,BASE,88.3,107.1,roof),
  rect(0,0,BASE,45,45,21.35-GROUND), // grote zaal / toneelhuis
  rect(71.8,22.5,BASE,88.3,45,14.90-GROUND), // middenzaal
  rect(0,58,BASE,30,78,8.24-GROUND), // kleine zaal
  rect(62,87,BASE,69,107.1,2.51-GROUND), // lage dakopbouw aan het water
]);
// Open patio's tot het lager gelegen binnenhof, als gezien op AHN en luchtfoto.
const courts=[[48,45,59,58],[72,45,75.5,58],[81,58,87,63],[38,71,45,78],[62,71,69,82],[18,78,23,83],[9,87,12,93],[18,93,23.5,99],[30,93,36,99]];
const cuts=courts.map(([a,b,c,d])=>rect(a,b,0.3,c,d,roof+1));
cuts.push(rect(75.5,39,11.08-GROUND,81,45.1,15.1-GROUND)); // verdiept dak middenzaal
// Glasroeden zijn dunner dan 0,9 m en worden niet als printreliëf gemodelleerd.
body=body.subtract(union(cuts));
if(body.status()!=='NoError'||body.decompose().length!==1) throw Error('Kunstlinie is geen verbonden manifold');
await writeLandmark({slug:'kunstlinie-almere',base:BASE,nodes:[['building:kunstlinie',body]],catalog:{
 name:'Kunstlinie',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundSamplePoints:[[-3,-5],[45,3]],
 replacesBuildings:['NL.IMBAG.Pand.0034100000069262'],
 description:'Glazen cultuurcentrum aan het Weerwater, met drie zaalvolumes, platte daken en open binnenhoven. Lokale -Y naar het water; nulpunt is de noordwesthoek, maaiveld circa NAP -4,4 m.',
 realWorld:{groundNapM:GROUND,roofNapM:0.24,groteZaalNapM:21.35,middenzaalNapM:14.90,kleineZaalNapM:8.24},
 sources:['PDOK BAG pand 0034100000069262 en AHN DSM 0,5 m, geraadpleegd 10 november 2026','https://www.architectuurgidsalmere.nl/almere/schouwburg-kaf','https://www.visitalmere.com/en/locations/1119861943/art-line-almere-flevoland']
}});


