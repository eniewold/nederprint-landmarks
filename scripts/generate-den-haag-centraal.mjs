// BGT-overkapping 8cc96185-9d1a-5b72-8567-b371e7847b47, BAG Stichthage.
// Het dak bestaat uit afzonderlijke vlakke ruitvormige koepels, geen DSM-plakken.
import {box,prism,hull,union,writeLandmark} from './efteling-kit.mjs';
const slug='den-haag-centraal',base=-.8,origin=[82114,455294],xAxis=[.6065,-.79508],ground=.85;
const hall=[[-33.6,-46.1],[-4.4,-46.2],[-4.1,-48.7],[33.5,-48.6],[33.9,-46.2],[61.2,-46.2],[61.1,78.7],[33.7,78.7],[33.4,81.1],[-4.2,81],[-4.5,78.6],[-33.6,78.5]];
const office=[[-48.7,-50.87],[-36.92,-50.86],[-36.95,-46.51],[-33.51,-46.5],[-33.61,78.94],[-37.02,78.93],[-37.04,83.29],[-48.87,83.31],[-48.87,78.91],[-52.24,78.91],[-52.23,70.74],[-60.58,70.73],[-60.46,-38.34],[-52.15,-38.3],[-52.15,-46.54],[-48.72,-46.53]];
const EAVE=22.28,CUPOLA=22.72,p=[prism(hall,base,EAVE),prism(office,base,54.18),box(-52.2,-46.5,base,-33.55,78.9,59.61)],cuts=[];
const clip=prism(hall,base,30),diamond=(x,y,a,b)=>[[x-a,y],[x,y-b],[x+a,y],[x,y+b]];
// 8 x 12 m modules; the perimeter clips partial diamonds. Low truncated
// pyramids retain the real flat ventilation lids and four continuous slopes.
for(let row=0;row<21;row++)for(let col=0;col<13;col++){
 const x=-33.6+8*col+(row%2)*4,y=-46.2+6*row;
 const shell=hull([prism(diamond(x,y,3.62,5.62),EAVE-.04,EAVE+.01),prism(diamond(x,y,1.65,2.55),CUPOLA-.04,CUPOLA)]).intersect(clip);
 if(shell.volume()>.01)p.push(shell);
}
// Three glazed sides: blind panels keep a continuous support-free core.
for(const y of [-46.1,78.6])for(let x=-29.5;x<60;x+=8){
 cuts.push(box(x-3.1,y-.38,1.8,x+3.1,y+.38,6.6),box(x-3.1,y-.38,8.5,x+3.1,y+.38,20.6));
}
for(let y=-40;y<77;y+=8)cuts.push(box(60.8,y-3.1,1.8,61.6,y+3.1,6.6),box(60.8,y-3.1,8.5,61.6,y+3.1,20.6));
// Entrances project into the square and Rijnstraat, with their own transoms.
for(const y of [-48.65,81.05])for(let x=-.5;x<33;x+=8)cuts.push(box(x-3.1,y-.38,1,x+3.1,y+.38,6.6));
// Stichthage: stepped end cores, fourteen long horizontal window ribbons.
for(let z=4.3;z<58;z+=3.8){
 if(z>54.2)cuts.push(box(-52.55,-43.5,z,-51.85,75.8,z+1.35));
 if(z>22.8)cuts.push(box(-33.9,-43.5,z,-33.2,75.8,z+1.35));
 for(const y of [-46.5,78.9])cuts.push(box(-48.9,y-.35,z,-36.7,y+.35,z+1.35));
}
for(let z=4;z<53;z+=3.8)cuts.push(box(-60.8,-35,z,-60.12,66.5,z+1.35));
// Roof plant, parapets and the stair/lift towers visible in ortho and AHN.
p.push(box(-51.7,-45.9,59.5,-50.5,78.3,60.38),box(-35.1,-45.9,59.5,-33.9,78.3,60.38));
for(const y of [-39,16,69])p.push(box(-48.3,y-3,59.5,-40.3,y+3,61.35));
const shells=union(p).subtract(union(cuts)).decompose(),outer=shells.filter(s=>s.volume()>0);
if(outer.length!==1||shells.some(s=>s.volume() < -150))throw Error('Los bouwdeel of grote holte');
await writeLandmark({slug,base,nodes:[['building:stationshal met wybertjesdak en Stichthage',outer[0]]],catalog:{name:'Den Haag Centraal (Den Haag)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-63,-54],[-65,85],[0,-55],[10,87]],replacesBuildings:['NL.IMBAG.Pand.0518100000271819'],description:'Stationshal met BGT-contour en afzonderlijke ruitdakvlakken; +X naar de treinsporen, Stichthage aan -X. Volle kern achter blinde glasnissen voor 1:1000.',realWorld:{groundNapM:ground,hallEaveM:EAVE,cupolaM:CUPOLA,officeRoofM:59.61,officePlantM:61.35,schattingen:['ruitvormige koepels op regelmatige 8x12m module; randdelen vereenvoudigd en ventilatiedeksels gesloten','raamverdeling, glasnissen, dakinstallaties en borstwering naar fotos; kozijnen verdikt','model omvat de vernieuwde stationshal en aangebouwd Stichthage; afzonderlijke busoverkapping, metroviaduct en perronkappen buiten de hal blijven bestaande kaartgeometrie']} ,sources:['PDOK BGT overigbouwwerk 8cc96185-9d1a-5b72-8567-b371e7847b47; BAG 0518100000271819; AHN DSM/DTM .5m en Actueel_orthoHR bbox 82000,455000,82400,455440; 2026-10-09','https://www.prorail.nl/nieuws/de-wybertjes-van-den-haag-centraal','https://www.benthemcrouwel.com/projects/the-hague-central-station','https://commons.wikimedia.org/wiki/File:Station_Den_Haag_Centraal_2017_(Rijnstraat).jpg','https://commons.wikimedia.org/wiki/File:The_Hague_Central_Station,_Anna_van_Buerenplein_entrance,_2018.jpg','https://commons.wikimedia.org/wiki/File:Het_nieuwe_dak.JPG']}});
