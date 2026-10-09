// Per rij volledig gelezen: generate-amsterdam-centraal.mjs en generate-domtoren.mjs.
import {Manifold,box,prism,hull,union,writeLandmark} from './efteling-kit.mjs';
const slug='carre',origin=[122103,486160],angle=16.5,ground=1,base=-.4;
const a=angle*Math.PI/180,xAxis=[Math.cos(a),Math.sin(a)],z=n=>n-ground,parts=[],cuts=[];
const outline=[[32.768,-10.355],[32.768,-6.955],[32.768,-6.305],[32.118,-6.306],[31.717,-6.306],[31.718,-5.226],[32.117,-5.226],[32.767,-5.227],[32.767,-4.576],[32.766,-1.176],[32.766,-0.528],[32.117,-0.526],[31.717,-0.526],[31.716,0.554],[32.117,0.554],[32.767,0.555],[32.766,1.204],[32.766,4.604],[32.766,5.254],[32.116,5.254],[31.716,5.253],[31.716,6.333],[32.116,6.333],[32.766,6.334],[32.766,6.984],[32.765,10.383],[32.765,11.034],[32.115,11.033],[31.715,11.033],[31.715,12.113],[32.115,12.113],[32.765,12.112],[32.765,12.763],[32.765,16.163],[32.765,16.812],[32.114,16.812],[31.714,16.813],[31.715,17.892],[32.114,17.893],[32.763,17.894],[32.763,18.542],[32.763,21.942],[32.763,22.593],[32.114,22.592],[31.714,22.592],[31.713,23.672],[32.114,23.672],[32.764,23.672],[32.763,24.322],[32.763,27.722],[32.762,28.371],[32.112,28.371],[29.752,28.37],[29.751,35.17],[28.521,35.17],[-1.844,35.157],[-1.742,29.888],[-10.795,29.878],[-10.814,28.479],[-10.842,26.413],[-25.672,26.429],[-25.674,24.628],[-25.676,21.498],[-25.684,11.86],[-26.715,11.855],[-27.494,11.851],[-27.476,3.742],[-25.666,3.75],[-25.633,-10.838],[-25.545,-10.838],[-15.723,-10.816],[-9.144,-10.862],[-6.217,-10.867],[-6.218,-11.545],[-5.327,-11.547],[-5.326,-10.868],[-2.27,-10.872],[-2.271,-11.552],[-1.299,-11.553],[-1.298,-10.873],[1.838,-10.878],[11.546,-10.94],[14.356,-10.933],[22.977,-10.91],[22.986,-12.534],[22.255,-12.541],[22.265,-12.903],[22.307,-13.263],[22.38,-13.617],[22.485,-13.964],[22.618,-14.3],[22.781,-14.623],[22.971,-14.931],[23.188,-15.221],[23.429,-15.492],[23.692,-15.74],[23.976,-15.964],[24.279,-16.162],[24.598,-16.334],[24.93,-16.477],[25.274,-16.59],[25.538,-16.655],[25.806,-16.703],[26.076,-16.733],[26.106,-16.736],[26.388,-16.746],[26.669,-16.737],[26.949,-16.709],[27.325,-16.641],[27.692,-16.539],[28.049,-16.403],[28.392,-16.235],[28.718,-16.037],[29.024,-15.808],[29.308,-15.554],[29.468,-15.387],[29.618,-15.212],[29.758,-15.03],[29.771,-15.012],[29.974,-14.699],[30.147,-14.371],[30.291,-14.028],[30.404,-13.673],[30.483,-13.311],[30.53,-12.943],[30.545,-12.573],[29.757,-12.573],[29.757,-11.007],[32.118,-11.006],[32.769,-11.006]];
const footprint=prism(outline,base,z(34));
const clip=(x0,y0,x1,y1)=>box(x0,y0,base,x1,y1,z(34)).intersect(footprint);
// Volledige historische zaalvoet en moderne achterbouw, afzonderlijke bouwdelen.
parts.push(clip(-30,-11.6,10.65,26.45).intersect(box(-30,-12,base,11,27,z(20.35))));
parts.push(clip(10.3,-11.05,27.6,28.4).intersect(box(10,-12,base,28,29,z(29.15))));
parts.push(clip(27.3,-11.05,34,36).intersect(box(27,-12,base,34,36,z(22.82))));
parts.push(clip(10.5,28.2,30,36).intersect(box(10,28,base,31,36,z(22.82))));
parts.push(clip(-11,26.3,-1.5,31).intersect(box(-11,26,base,-1.4,31,z(10.7))));
parts.push(clip(-1.85,26.3,6.5,36).intersect(box(-2,26,base,7,36,z(9.27))));
parts.push(clip(6.3,26.3,10.75,36).intersect(box(6,26,base,11,36,z(18.35))));
parts.push(clip(22,-18,31,-10.9).intersect(box(22,-18,base,31,-10.8,z(6.43))));
// Doorlopende gekromde schildkap: twee glad geïnterpoleerde AHN-profielen.
// De profielen liggen IN de dakvlakken; geen horizontale hoogteplakken.
function smooth(stations){
 const slopes=stations.slice(1).map((p,i)=>(p[1]-stations[i][1])/(p[0]-stations[i][0]));
 const tangents=stations.map((p,i)=>i===0?slopes[0]:i===stations.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2/(1/slopes[i-1]+1/slopes[i]));
 const r=[];for(let i=0;i<stations.length-1;i++){const [x,y]=stations[i],h=stations[i+1][0]-x,Y=stations[i+1][1];for(let k=0;k<8;k++){const t=k/8;r.push([x+h*t,(2*t**3-3*t**2+1)*y+(t**3-2*t**2+t)*h*tangents[i]+(-2*t**3+3*t**2)*Y+(t**3-t**2)*h*tangents[i+1]]);}}r.push(stations.at(-1));return r;
}
const px=smooth([[-25.7,20.35],[-21.4,24.1],[-18,25.8],[-14,27.3],[-10,28.2],[-6,28.9],[0,29.3],[6,29.25],[10.65,29.1]]);
const py=smooth([[-11.6,20.35],[-7,24.1],[-4,26.3],[0,27.9],[4,28.95],[7.8,29.3],[12,28.95],[16,27.9],[20,26.3],[23,24.1],[26.45,20.35]]);
const closed=s=>[[s[0][0],z(20.2)],...s.map(([x,h])=>[x,z(h)]),[s.at(-1)[0],z(20.2)]];
const roofX=prism(closed(px),0,42).rotate([90,0,0]).translate([0,29,0]);
const roofY=prism(closed(py),0,42).rotate([90,0,0]).rotate([0,0,90]).translate([-29,0,0]);
parts.push(roofX.intersect(roofY).intersect(footprint));
// AHN-gemeten centrale dakruiter: schilddak, nok NAP 32,87 m.
parts.push(box(-3,2.5,z(28.2),4,13.3,z(31.5)),hull([[-3,2.5],[4,2.5],[4,13.3],[-3,13.3]].map(p=>[...p,z(31.45)]).concat([[.27,5.48,z(32.87)],[.27,10.1,z(32.87)]])));
// Noordelijke toneelgevel: vier volle vinnen aan de gracht, minimaal 1,1 m dik.
parts.push(box(10.5,34.15,base,29.8,35.17,z(29.15)).intersect(footprint));
for(const x of[11.4,17,22.6,28.2])parts.push(box(x-.55,28.1,base,x+.55,35.17,z(29.15)).intersect(footprint));
// Middenrisaliet en driehoekig fronton langs de Amstel.
const gable=[[-4.05,z(18.7)],[4.05,z(18.7)],[4.05,z(20.65)],[0,z(23.05)],[-4.05,z(20.65)]];
parts.push(prism(gable,-.9,.9).rotate([90,0,0]).rotate([0,0,90]).translate([-26.8,7.8,0]));
// Drie vensterlagen als blinde nissen; gevel blijft massief achter het glas.
for(const y of[-8,-4.3,-.6,3.1,12.5,16.2,19.9,23.6]){
 for(const[lo,hi]of[[1.8,5.8],[8,12.3],[14.5,17.5]])cuts.push(box(-26.6,y-1.0,z(lo),-25.28,y+1.0,z(hi)));
 // Gehechte pilasters en eenvoudig bovenlicht/frontonrelief.
 parts.push(box(-26.05,y-1.55,z(6.7),-25.3,y-1.05,z(18.3)));
 parts.push(hull([[-26.1,y-1.3,z(12.3)],[-25.3,y-1.3,z(12.3)],[-26.1,y+1.3,z(12.3)],[-25.3,y+1.3,z(12.3)],[-25.7,y,z(13.6)]]));
}
for(const y of[5.65,9.95])for(const[lo,hi]of[[1.6,5.8],[8,12.3],[14.5,17.5]])cuts.push(box(-28.5,y-1.1,z(lo),-27.05,y+1.1,z(hi)));
// De grote zuilen worden gevelrelief, verbonden over hun hele hoogte.
for(const y of[3.8,7.8,11.8])parts.push(box(-27.8,y-.55,z(6.7),-26.7,y+.55,z(19.7)));
// Balkon en kroonlijst met steile onderrand; plaat minimaal 1,5 m dik.
for(const [lo,hi]of[[5.5,7],[18.4,19.9]])parts.push(hull([[-25.8,-10.8,z(lo)],[-25.3,-10.8,z(lo)],[-25.8,26.4,z(lo)],[-25.3,26.4,z(lo)],[-26.4,-10.8,z(hi)],[-25.3,-10.8,z(hi)],[-26.4,26.4,z(hi)],[-25.3,26.4,z(hi)]]));
// Centrale balkonplaat sluit op de uitspringende entree aan.
parts.push(hull([[-27.5,3.7,z(5.5)],[-26.8,3.7,z(5.5)],[-27.5,11.9,z(5.5)],[-26.8,11.9,z(5.5)],[-28.1,3.7,z(7)],[-26.8,3.7,z(7)],[-28.1,11.9,z(7)],[-26.8,11.9,z(7)]]));
// Vrije zuidgevel: eenvoudige blindvensters; geen ramen in gedeelde buurwanden.
for(const x of[-22,-17,-12,-7,-2,3,8])for(const [lo,hi]of[[3,6],[9,12],[15,18]])cuts.push(box(x-1,-12,z(lo),x+1,-10.5,z(hi)));
// Achterzijde met terugliggende glasband en paneelritme, geen vrij hekwerk.
for(let k=0;k<7;k++){const y=-7.8+k*5.78;for(const[lo,hi]of[[1.8,4.5],[18.5,21.8]])cuts.push(box(32.4,y-1.5,z(lo),33.5,y+1.5,z(hi)));}
for(const x of[13.7,19.3,24.9])cuts.push(box(x-1.9,34.75,z(23.7),x+1.9,36,z(28.5)));
// Dakruiter heeft gesloten glasnissen aan de vier zijden.
// Glasstroken naast het fronton: blinde nissen die het buitenvlak raken.
for(const [y0,y1]of[[.5,3.3],[12.3,15.1]])cuts.push(hull([[-27,y0,z(21.2)],[-27,y1,z(21.2)],[-27,y0,z(24)],[-27,y1,z(24)],[-24.3,y0,z(21.2)],[-24.3,y1,z(21.2)],[-21.7,y0,z(24)],[-21.7,y1,z(24)]]));
for(const y of[4.4,7.8,11.2]){cuts.push(box(-3.5,y-.7,z(29.7),-2.6,y+.7,z(31)),box(3.6,y-.7,z(29.7),4.5,y+.7,z(31)));}
const final=union(parts).subtract(union(cuts));
if(final.status()!=='NoError'||final.decompose().length!==1)throw Error('Niet gesloten/verbonden '+final.status()+' '+final.decompose().length);
await writeLandmark({slug,base,nodes:[['building:Carré gebogen schildkap toneelgebouw gevel',final]],catalog:{name:'Koninklijk Theater Carré',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-30,0],[-30,18],[33,37]],replacesBuildings:['NL.IMBAG.Pand.0363100012165489'],description:'Complete BAG-voet: historische zaal met doorlopende gekromde schildkap, middenrisaliet en dakruiter, toneelgebouw en lagere grachtvleugels. Gevelrelief en blinde glasnissen op 1:1000.',realWorld:{groundNapM:ground,eaveNapM:20.35,curvedRoofNapM:29.3,roofLanternNapM:32.87,stageRoofNapM:29.15,rearWingNapM:22.82,axisDegrees:angle,estimates:['interpolatie tussen AHN-dakprofielen en frontonprofiel geschat uit schuine fotos','venstermaten, pilasters, balkon en vier toneelgevelvinnen vereenvoudigd uit fotos','dunne roeven, gevelbeelden, letters, hekwerk, vlaggen en installaties weggelaten']},sources:['PDOK BAG0363100012165489 BGT AHN DSM/DTM0.5m orthofoto 2026-10-09','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012165489 (CC BY4.0)','https://monumentenregister.cultureelerfgoed.nl/monumenten/185','https://commons.wikimedia.org/wiki/File:Carre_amsterdam_facade.jpg','https://commons.wikimedia.org/wiki/File:Carre_Theatre_2038.jpg','https://commons.wikimedia.org/wiki/File:Onbekendegracht_carre.jpg']}});
