// Amstel Tower, Powerhouse Company 2018: benoemde prisma's en echte balkons.
// BAG 0363100012246480, AHN DSM/DTM 0,5 m en ortho (PDOK, CC0).
// Dakcontouren gecontroleerd met PDOK LoD2.2 (3D BAG, TU Delft/3DGI,
// CC BY 4.0); gevelvorm gecontroleerd op de architectfoto's van
// Sebastian van Damme en Commons Choinowski (CC BY-SA 4.0).
// Voorbeeld voor deze rij: generate-mondriaantoren.mjs, efteling-kit.mjs.
import {Manifold,CrossSection,prism,box,union,ring3,writeLandmark,toStl,flag} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const slug='amstel-tower', ORIGIN=[123100,484300], GROUND=.5, BASE=-.9;
const H={hotel:25.40,shaft:98.83,terrace:101.03,plant:103.75};
const z=h=>h-GROUND;
// Bezierhoeken tussen rechte gevels, gefit op AHN boven NAP +90 m.
// Geen pixels of hoogtegebieden in het model; één doorlopende schacht.
function curve(a,b,c,d,n=10){return Array.from({length:n},(_,i)=>{const t=i/n,s=1-t;return [0,1].map(k=>s*s*s*a[k]+3*s*s*t*b[k]+3*s*t*t*c[k]+t*t*t*d[k]);});}
const OUTER=[...curve([-3.0,-21.6],[-2.9,-23.7],[-5.0,-24.8],[-7.3,-23.8]),[-18.4,-19.5],...curve([-18.4,-19.5],[-22.7,-17.8],[-23.0,-14.3],[-23.6,-9.5]),[-24.9,3.2],...curve([-24.9,3.2],[-25.4,7.5],[-22.1,9.2],[-18.8,7.5]),[-6.3,.8],...curve([-6.3,.8],[-3.9,-.6],[-3.8,-2.1],[-3.6,-5.0])];
const outer=new CrossSection([OUTER],'NonZero');
const core=outer.offset(-1.2,'Round',24).toPolygons()[0];
const deck=(section,h,depth=1.2)=>union([
 Manifold.hull([...ring3(section.offset(-depth,'Round',24).toPolygons()[0],z(h)-depth),...ring3(section.toPolygons()[0],z(h))]),
 prism(section.toPolygons()[0],z(h)-.01,z(h)+.9)
]);
// Blind glas- en loggiareliëf langs alle gevels, minimaal 0,9 m penanten.
function glazing(poly,bottom,top,pitch=3.06,spacing=3.25){
 const cs=new CrossSection([poly],'NonZero'),p=cs.toPolygons()[0];
 let area=p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0);if(area<0)p.reverse();
 const edges=p.map((a,i)=>{const b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);return {a,b,L}}),length=edges.reduce((s,e)=>s+e.L,0),cuts=[];
 for(let along=1.5;along<length-.8;along+=spacing){let r=along,e;for(const edge of edges){e=edge;if(r<edge.L)break;r-=edge.L;}
  const d=[(e.b[0]-e.a[0])/e.L,(e.b[1]-e.a[1])/e.L],normal=[d[1],-d[0]],at=[e.a[0]+r*d[0],e.a[1]+r*d[1]];
  for(let h=bottom;h+2.0<top-.2;h+=pitch)cuts.push(box(-.35,-1.05,z(h),.4,1.05,z(h+1.9)).rotate([0,0,Math.atan2(normal[1],normal[0])*180/Math.PI]).translate([...at,0]));
 }
 return prism(poly,BASE,z(top)).subtract(union(cuts));
}
const floors=[];
for(let k=0;k<24;k++)floors.push(deck(outer,25.4+k*3.06));
let shaft=glazing(core,26.55,H.shaft);
// Twee echte dakniveaus, een afgeronde dakopbouw en een onderhoudswagen.
const upper=outer.offset(-1.25,'Round',24),plant=outer.offset(-4.05,'Round',24);
const crown=union([prism(upper.toPolygons()[0],z(H.shaft)-.1,z(H.terrace)),deck(upper,H.terrace-.9,.65),prism(plant.toPolygons()[0],z(H.terrace)-.1,z(H.plant)),box(-14.2,-4.5,z(H.plant)-.1,-12.8,-2.0,z(104.01))]);
// Hotel met dezelfde afgeronde vloercontouren; de lange as staat 20,1° RD.
const hotelAngle=20.1*Math.PI/180,hotelPlace=([u,v])=>[-21+u*Math.cos(hotelAngle)-v*Math.sin(hotelAngle),-1+u*Math.sin(hotelAngle)+v*Math.cos(hotelAngle)];
const hotelOutline=[...curve([0,-5.5],[0,-7.5],[.8,-7.5],[2,-7.5]),[51.2,-7.5],...curve([51.2,-7.5],[53.2,-7.5],[53.2,-6.7],[53.2,-5.5]),[53.2,5.5],...curve([53.2,5.5],[53.2,7.5],[52.4,7.5],[51.2,7.5]),[2,7.5],...curve([2,7.5],[0,7.5],[0,6.7],[0,5.5])].map(hotelPlace);
const hotelSection=new CrossSection([hotelOutline],'NonZero'),hotelCore=hotelSection.offset(-1,'Round',24).toPolygons()[0];
const hotelFloors=[5.00,8.40,11.80,15.20,18.60,22.00,24.50].map(h=>deck(hotelSection,h,1));
const hotel=glazing(hotelCore,5.8,H.hotel,3.4,3.2);
// Entreepuien zijn blinde nissen; de dikke luifel heeft een schuine kraag.
const entrance=deck(hotelSection,4.8,1.0);
const roofService=box(1.17,10.06,z(H.hotel)-.1,6.08,16.45,z(26.67));
const southOutline=[[-17.077,-28.913],[-3.2,-23.857],[-3.4,-2.3],[-25.9,-4.4]],southSection=new CrossSection([southOutline],'NonZero');
const southPodium=glazing(southSection.offset(-1,'Round',24).toPolygons()[0],5.8,H.hotel,3.4,3.2);
const southFloors=[5.00,8.40,11.80,15.20,18.60,22.00,24.50].map(h=>deck(southSection,h,1));
const main=union([shaft,...floors,crown,hotel,southPodium,...southFloors,...hotelFloors,entrance,roofService]);
// Losse bovengrondse bouwdelen bij het busplatform vallen onder hetzelfde
// BAG-pand. Neem ze mee, maar geen garageplaat of busplatform-terrein.
const shopNorth=[[-27.893,79.305],[-31.496,87.010],[-21.732,90.569],[-19.495,82.727]];
const shopLong=[[-12.616,36.304],[-3.405,39.352],[-14.752,70.757],[-24.205,67.579]];
const serviceEast=[[17.213,31.556],[18.724,33.723],[21.168,34.613],[22.418,31.214],[18.245,29.946]];
const serviceNorth=[[5.689,83.123],[7.099,79.271],[1.096,77.081],[-4.424,91.744],[-2.141,92.775],[1.888,81.733]];
const nodes=[['building:woon-en-hoteltoren-met-rondlopende-balkons',main],['building:horeca-lang-bij-busplatform',glazing(shopLong,2.7,6.33,4,3.1)],['building:horeca-noord',glazing(shopNorth,2.7,5.90,4,3.2)],['building:dienstgebouw-oost',prism(serviceEast,BASE,z(3.67))],['building:dienstgebouw-noord',prism(serviceNorth,BASE,z(3.08))]];
await writeLandmark({slug,nodes,base:BASE,catalog:{name:'Amstel Tower',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,groundHeight:43.4537875,groundSamplePoints:[[0,-30],[30,10],[10,30],[-35,0]],replacesBuildings:['NL.IMBAG.Pand.0363100012246480'],description:'Amstel Tower (2018), met doorlopende afgeronde woontorenschacht, 24 balkons, hotel, twee kroontrappen en vier lage bouwdelen van hetzelfde BAG-pand; garage-terrein blijft PDOK. RD (123100,484300), X oost, Y noord, NAP +0,5 m. Gevelritme, balkonprofielen, luifel en glasnissen vereenvoudigd voor 1:1000.',realWorld:{groundNapM:GROUND,hotelRoofNapM:H.hotel,towerRoofNapM:H.shaft,terraceNapM:H.terrace,plantNapM:H.plant,topNapM:104.01,balconyPitchM:3.06,balconyDepthM:1.2,balconyPrintThicknessM:.9,nicheDepthM:.35,estimates:['vloersteek en gevelritme op architectfoto’s','balkons 1,2 m uitkraging met 45° ondersnede en 0,9 m dikte voor print','afgeronde gevelcontour gefit op AHN-silhouet','entreepuien en glasnissen 0,35 m diep','dakinstallatie en kroonvorm uit AHN, luchtfoto en PDOK LoD2.2']},sources:['https://www.powerhouse-company.com/amstel-tower (foto’s Sebastian van Damme, referentie)','https://commons.wikimedia.org/wiki/File:Amstel_Tower_winter_2021.jpg (Choinowski, CC BY-SA 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (DSM/DTM 0,5 m, CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://api.3dbag.nl (dakcontouren via PDOK LoD2.2, TU Delft/3DGI, CC BY 4.0)']}});
// Alleen de losse STL krijgt een grondplaat; die zit nooit in de kaart-GLB.
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const all=union(nodes.map(([,s])=>s)), bb=all.boundingBox();
const plate=box(bb.min[0]-2,bb.min[1]-2,BASE-1,bb.max[0]+2,bb.max[1]+2,BASE+.05);
const print=union([all,plate]).translate([0,0,1-BASE]);
const filename=slug+'-grondplaat-1-1000.stl';
await writeFile(path.join(outDir,filename),toStl(print,'NederPrint Amstel Tower 1:1000 met grondplaat').buffer);
const file=path.join(outDir,slug+'.json'),entry=JSON.parse(await readFile(file,'utf8'));entry.printFiles.push(filename);await writeFile(file,JSON.stringify(entry,null,2));
console.log('grondplaat',print.status(),print.decompose().length,'delen');
