// Volledig gelezen: generate-evoluon.mjs. Bouw uit gevelvlakken en bouwdelen.
import {Manifold,box,prism,hull,rect,union,writeLandmark} from './efteling-kit.mjs';
const slug='rietveld-schroderhuis',origin=[138575,455256],angle=-29.5,ground=2.08,base=-.35;
const a=angle*Math.PI/180,xAxis=[Math.cos(a),Math.sin(a)],z=n=>n-ground,parts=[],cuts=[];
const outline=[[-3.356,-4.375],[-.136,-4.413],[-.131,-4.193],[3.613,-4.175],[3.596,-1.699],[4.496,-1.702],[4.497,-1.482],[4.057,-1.48],[4.071,5.843],[-.559,5.851],[-.558,5.962],[-1.36,5.964],[-1.36,5.623],[-3.591,5.627]];
// Dichte glazen gevelvolumes met blinde nissen: geen kwetsbare open roeden.
parts.push(prism(outline,base,z(8.38)));
// Zuidelijke balkonuitsparing: de uitspringende middenwand blijft als apart vlak.
cuts.push(box(-3.8,-4.8,3.35,-1.8,-3.1,5.25));
// Oostelijke erker trekt onder en boven terug van de buitenste muurplaten.
cuts.push(box(3.52,-1.4,.5,4.8,4.65,2.65),box(3.52,-1.4,3.45,4.8,4.65,5.15));
// Noordelijke vensterstrook en terugliggende tuindeur.
cuts.push(box(-2.8,5.3,.55,2.9,6.6,2.4),box(-2.7,5.3,3.45,3.1,6.6,5.3));
// Voorgevel: centraal groot raam, begane-grondramen en smalle voordeur.
cuts.push(box(-1.35,-4.65,3.8,1.55,-3.82,5.15),box(-2.9,-4.65,.65,-1.55,-3.95,2.4),box(2.18,-4.65,.25,3.25,-3.88,2.55));
// Scheidende blinde glasroeden, 0,9 m breed op 1:1000.
parts.push(box(3.43,.6,base,4.1,1.5,5.3),box(3.42,3.4,base,4.1,4.3,5.3));
// De Stijl-vlakken met eigen uitstekende randen; dikke platen met schuine onderzijde.
function plate(x0,y0,x1,y1,bottom,top,inset=.65){return hull([...rect(x0+inset,y0+inset,x1-inset,y1-inset).map(p=>[...p,bottom]),...rect(x0,y0,x1,y1).map(p=>[...p,bottom+inset*1.3]),...rect(x0,y0,x1,y1).map(p=>[...p,top])]);}
const core=union(parts).subtract(union(cuts));parts.length=0;parts.push(core);
// Groot oostelijk dak en kleine westelijke luifel. Tophoogte uit AHN.
parts.push(plate(2.65,-1.7,4.65,5.8,4.8,6.3,.3),plate(-3.55,-4.6,-1.45,-1.6,4.9,6.38,.3));
// Balkonvloer rust op de bestaande gevel; onderzijde loopt minimaal 50 graden.
parts.push(plate(-3.6,-4.85,-1.45,-2.9,1.95,3.45,.35),plate(1.55,-4.8,3.65,-3.05,2,3.5,.35));
// Gevelplaten lopen langs de vensternissen; geen vrijstaande dunne railing.
parts.push(box(-1.55,-4.5,.05,-.65,-4.04,6.48),box(1.56,-4.47,2.65,2.46,-4.02,6.3),box(3.66,-1.7,base,4.55,-.8,5.4));
// Centraal daklicht en schoorsteen, elk minstens 0,9 m breed.
parts.push(box(-.6,.45,6.15,1.3,2.6,7.12),box(-.45,1.7,6.9,.6,2.85,8.1));
const final=union(parts);
if(final.status()!=='NoError'||final.decompose().length!==1)throw Error('Niet gesloten/verbonden');
await writeLandmark({slug,base,nodes:[['building:Rietveld Schroderhuis gevelvlakken dakplaten en lichtkap',final]],catalog:{name:'Rietveld Schröderhuis',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[6,0],[0,-7],[1,8]],replacesBuildings:['NL.IMBAG.Pand.0344100000059839'],description:'Schroderhuis met complete BAG-voet, terugliggende glasnissen, losse gevelvlakken, twee balkons, oostelijk dakvlak, lichtkap en schoorsteen. Platen verdikt voor 1:1000 en aan de onderzijde afgeschuind; hekjes en dunne balken weggelaten.',realWorld:{groundNapM:ground,mainRoofNapM:8.38,chimneyTopNapM:10.18,axisDegrees:angle,estimates:['venster-, balkon- en gevelplaatmaten uit schuine fotos geschat','daklicht en schoorsteen uit AHN pieken en fotos geschat','dakplaten 1.5 m dik voor printbaarheid; ondersnijdingen schuiner en kleiner; glas blind en roeden grover; fijne balken, hekjes en kleur weggelaten']},sources:['PDOK BAG0344100000059839 BGT AHN DSM/DTM0.5m en orthofoto 2026-10-09','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000059839 (CC BY4.0)','https://whc.unesco.org/en/list/965/','https://www.rietveldschroderhuis.nl/nl/ontdek/ruimtelijk-archief','https://commons.wikimedia.org/wiki/File:Voor_en_zijgevel_-_Utrecht_-_20231596_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Exterieur_vanuit_het_zuiden_-_Utrecht_-_20231592_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Casa_Rietveld_Schr%C3%B6der_07.jpg']}});
