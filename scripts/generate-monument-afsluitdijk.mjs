// Dudoks Vlietermonument: trappenhuis, zeshoekige uitkijkpost, luifel, bordes en trap.
import {Manifold,prism,box,hull,ring3,rect,union,writeLandmark} from './efteling-kit.mjs';
const O=[136307.2817742256, 553588.7966657182],A=[0.7524149088957244, 0.6586894601186805],G=4.0,BASE=-4.5,at=n=>n-G,FOOT=[[-0.649, 6.248], [-0.649, 4.734], [-21.43, 4.737], [-21.431, -4.676], [21.796, -4.681], [21.797, 4.251], [0.789, 4.735], [0.763, 6.23], [-0.649, 6.248]];
// De geregistreerde uitbreiding ligt in de dijk. Alleen een verborgen fundering;
// nog geen verzonnen bovengrondse volumes voor de werkzaamheden tot 2027.
const foundation=prism(FOOT,BASE,BASE+1.0);
// Lage restaurant-/bordesplint met afgeronde IJsselmeerhoek uit AHN en bronfoto's.
const plintFoot=[[-7.9,1.6],[-7.9,-6.3],[-7.5,-7.2],[-6.4,-7.8],[6.6,-7.8],[7.6,-7.2],[8,-6.2],[8,1.6]];
const plint=prism(plintFoot,BASE,at(5.96));
// D-vormig trappenhuis: gesloten rechte landzijde, facetten aan de glazen meerzijde.
const shaftFoot=[];for(let k=0;k<=12;k++){const a=Math.PI+k*Math.PI/12;shaftFoot.push([-.45+1.82*Math.cos(a),1.85+1.82*Math.sin(a)]);}shaftFoot.push([1.37,3.22],[-2.27,3.22]);
let shaft=prism(shaftFoot,BASE,at(20.1));
const windows=[];
// Drie brede verticale glasnissen op de gebogen gevel; ruim 0,9 m brede stijlen blijven staan.
for(let k=0;k<3;k++){const a=(210+k*60)*Math.PI/180,normal=[Math.cos(a),Math.sin(a)];const notch=box(-.425,-.35,at(9.2),.425,.1,at(19.9)).rotate([0,0,a*180/Math.PI-90]).translate([-.45+1.85*normal[0],1.85+1.85*normal[1],0]);windows.push(notch);}
for(const z of[10.8,14.4])windows.push(box(-1.35,3.01,at(z),.15,3.45,at(z+.65)));
shaft=shaft.subtract(union(windows));
// Langgerekte zeshoekige uitkijkpost; onderzijde gesloten onder maximaal 45 graden.
const gallery=[[-2.6,2.5],[-2.4,.02],[1.4,.02],[2.8,2.4],[.8,4.72],[-2.4,4.72]];
let cup=union([hull([...ring3(rect(-2.15,.3,1.25,3.15),at(17.5)),...ring3(gallery,at(19.2))]),prism(gallery,at(19.15),at(20.1))]);
// Open uitzicht naar de Waddenzee als blinde nis; glas blijft gesloten.
cup=cup.subtract(box(-1.8,4.37,at(19.18),.45,4.95,at(19.9)));
const roof=hull([...ring3(gallery,at(20.08)),[-.35,2.85,at(20.93)]]),finial=box(-.8,2.4,at(20.8),.1,3.3,at(21.53));
// Breed horizontaal luifeldak, op de toren/poortmassa en een schuin gesloten bordes.
const canopyFoot=rect(-3.82,-4.7,3.8,3.3),canopy=union([hull([...ring3(rect(-2.2,-1.5,1.35,3.0),at(5.7)),...ring3(canopyFoot,at(8.7))]),prism(canopyFoot,at(8.69),at(8.96))]);
// Gesloten traplichaam loopt langs de zuidwestkant van de plint naar het bordes.
const stairs=[];for(let k=0;k<8;k++)stairs.push(box(-9.1+k*.65,-6.6,BASE,-3.5,-3.35,at(2.15+k*.55)));
// Balustrade boven het bordes: continu 0,95 m dik; kleine glas-/deurnissen.
const parapet=prism(plintFoot,at(5.92),at(7.4)).subtract(prism([[-6.95,.7],[-6.95,-5.9],[-6.35,-6.85],[6.15,-6.85],[7.05,-5.8],[7.05,.7]],at(5.9),at(7.6)));
let body=union([foundation,plint,prism(plintFoot,at(5.9),at(6.4)),shaft,cup,roof,finial,canopy,...stairs,parapet]);
body=body.subtract(union([box(-5.9,-8.1,at(1.1),-3.3,-7.57,at(3.8)),box(-2.3,-8.1,at(1.1),.1,-7.57,at(3.8)),box(.95,-8.1,at(1.1),3.35,-7.57,at(3.8)),box(4.2,-8.1,at(1.1),6.1,-7.57,at(3.8))]));
// Bronzen reli�f en sluitingssteen als vast gevelreli�f; letters/beelden niet los.
body=union([body,box(-2.6,3.12,at(4.35),-.9,3.55,at(5.75)),box(-.95,4.60,BASE,.85,6.18,at(6.22))]);
if(body.status()!=='NoError'||body.decompose().length!==1)throw Error('Afsluitdijkmonument niet verbonden');
await writeLandmark({slug:'monument-afsluitdijk',base:BASE,nodes:[['building:dudok-toren-bordes-en-luifel',body]],catalog:{name:'Monument op de Afsluitdijk',origin:O,xAxis:A,groundOffsetMetres:-.3,groundSamplePoints:[[-12,8],[12,8],[0,10]],replacesBuildings:['NL.IMBAG.Pand.0462100000006517'],description:'Dudoks D-vormige glazen trappentoren met rechte landzijde, zeshoekige uitkijkpost, tentdak, brede lage luifel, afgeronde bordesplint, balustrade en entree-trap. Glas gesloten en luifels met schuine onderzijde voor steunloos 1:1000. Hele actuele BAG-contour behouden als begraven fundering; nieuwe uitbreiding in de dijk en tijdelijke bouwplaats niet verzonnen. +X RD 41,2 graden; z=0 NAP +4,0 m, voet tot NAP -0,5 m aan het meer.',realWorld:{groundNapM:G,plintNapM:5.96,bordesPrintableNapM:6.4,balustradeEstimatedNapM:7.4,canopyNapM:8.96,shaftEaveNapM:20.1,roofPeakNapM:20.93,finialEstimatedNapM:21.53},sources:['PDOK BAG/BGT 0462100000006517, AHN DSM/DTM 0,5 m, ortho 11 oktober 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0462100000006517','https://monumentenregister.cultureelerfgoed.nl/monumenten/510384','https://deafsluitdijk.nl/projecten/renovatie-vlietermonument-afsluitdijk/','https://deafsluitdijk.nl/nieuws/vlietermonument-restauratie-bijna-klaar-uitbreiding-eenvoudiger/','https://commons.wikimedia.org/wiki/Category:Monument_Afsluitdijk']}});
