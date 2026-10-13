// Grotius I en II, MVRDV, 2022. Voorbeeld per rij: generate-evoluon.mjs
// volledig gelezen. Twee vrijstaande woontorens met gemeten terrasdaken.
// BAG/PDOK CC0; 3D BAG TU Delft/3DGI, AHN5 2023, CC BY 4.0.
// Foto's van Daria Scagliola en Emmely van Mierlo: alleen visuele referentie.
// Benoemde verticale woonvolumes en dakvlakken; geen DSM-hoogtelagen.
import {Manifold,CrossSection,prism,rect,box,union,ccw,ring3,writeLandmark,toStl} from './efteling-kit.mjs';
import {writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
const slug='grotius-den-haag',ORIGIN=[82435,455347],ANGLE=-40.3,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
const argv=process.argv.slice(2),flag=(name,fallback)=>{const i=argv.indexOf(name);return i>=0?argv[i+1]:fallback;};
const scale=Number(flag('--scale','1000')),outRoot=path.resolve(flag('--out',path.join(import.meta.dirname,'../models')));
const GROUND=.8,BASE=-1.2,z=h=>h-GROUND;
const local=([x,y])=>[x*AXIS[0]+y*AXIS[1],-x*AXIS[1]+y*AXIS[0]];
// BAG 0518100001758098 is de compacte zuidelijke toren (Grotius II).
const SOUTH=ccw([[-3.14,-53.07],[8.1,-73.85],[38.05,-57.68],[14.93,-39.26]].map(local));
// BAG 0518100001758100 is de lange noordelijke toren (Grotius I).
const NORTH=ccw([[-9.65,8.2],[7.31,-13.92],[26.55,-27.23],[42.6,-17.08],[21.94,1.33],[5.71,17.91]].map(local));
const section=poly=>new CrossSection([ccw(poly)]);
const prismCs=(s,h0,h1)=>Manifold.extrude(s,h1-h0).translate([0,0,h0]);
function niche(a,b,s0,s1,h0,h1,depth=.35){
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];
 return Manifold.hull([h0,h1].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],z(h)])));
}
// Natuurstenen vensterraster en deels inpandige balkonvelden. De dragende
// hoofdvorm is steeds een doorlopend prisma, niet een stapel vloervolumes.
function facade(solid,poly,bottom,top,balconies=false){
 const p=ccw(poly),cuts=[],plates=[];
 for(let i=0;i<p.length;i++){
  const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(L<2.8)continue;
  const count=Math.max(1,Math.round((L-1.6)/3.4)),pitch=(L-1.6)/count;
  for(let k=0;k<count;k++){
   const s=.8+pitch*(k+.5),w=Math.min(2.55,pitch-.9);
   for(let h=bottom;h+2.2<top-.55;h+=3.02){
    const isBalcony=balconies&&k%3===1&&h>7;
    cuts.push(niche(a,b,s-w/2,s+w/2,h,h+2.2,isBalcony?.9:.35));
    if(isBalcony){
     const t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]],s0=s-w/2,s1=s+w/2;
     const plane=(d)=>[[s0,-.15],[s1,-.15],[s1,d],[s0,d]].map(([u,v])=>[a[0]+u*t[0]+v*n[0],a[1]+u*t[1]+v*n[1]]);
     plates.push(Manifold.hull([...ring3(plane(.15),z(h)-1.2),...ring3(plane(1.35),z(h)-.05)]));
    }
   }
  }
 }
 return union([solid.subtract(union(cuts)),...plates]);
}
// De kroon bestaat uit woonbeuken, als verticale prisma's met een eigen vlak
// dak. Traveegrenzen geschat op foto's en gecontroleerd tegen de 3D BAG-
// dakvlakken; hoogte per beuk is gemeten. Geen per-meter raster of laagstapel.
function dwelling(poly,u0,v0,u1,v1,roof,foot){
 const s=section(poly).intersect(section(rect(u0,v0,u1,v1)));
 if(s.area()<.5)return null;
 const contours=s.toPolygons();
 let solid=prismCs(s,z(foot)-.1,z(roof));
 for(const c of contours)solid=facade(solid,c,foot+.9,roof,false);
 return solid;
}
const northWestHead=()=>dwelling(NORTH,-15,-6,-4,5,112.331,88.356);
const northWestShoulder=()=>dwelling(NORTH,-15,5,-4,11,109.371,88.356);
const northWestTerrace=()=>dwelling(NORTH,-15,11,-4,22,103.383,88.356);
const northWestHighFront=()=>dwelling(NORTH,-4,-6,1,5,118.330,88.356);
const northWestHighMiddle=()=>dwelling(NORTH,-4,5,1,11,115.345,88.356);
const northWestHighRear=()=>dwelling(NORTH,-4,11,1,22,115.321,88.356);
const northCentralWest=()=>dwelling(NORTH,1,-6,6,11,121.452,88.356);
const northCentralWestRear=()=>dwelling(NORTH,1,11,6,22,115.321,88.356);
const northCentralApartments=()=>dwelling(NORTH,6,-6,16,22,121.452,88.356);
const northCentralEast=()=>dwelling(NORTH,16,-6,21,11,121.452,88.356);
const northCentralEastRear=()=>dwelling(NORTH,16,11,21,22,115.322,88.356);
const northEastHighFront=()=>dwelling(NORTH,21,-6,26,5,118.323,88.356);
const northEastHighMiddle=()=>dwelling(NORTH,21,5,26,11,121.502,88.356);
const northEastHighRear=()=>dwelling(NORTH,21,11,26,22,115.344,88.356);
const northEastShoulderFront=()=>dwelling(NORTH,26,-6,31,5,112.326,88.356);
const northEastShoulderMiddle=()=>dwelling(NORTH,26,5,31,11,118.363,88.356);
const northEastShoulderRear=()=>dwelling(NORTH,26,11,31,22,115.344,88.356);
const northEastLowerFront=()=>dwelling(NORTH,31,-6,36,5,103.335,88.356);
const northEastLowerMiddle=()=>dwelling(NORTH,31,5,36,11,109.342,88.356);
const northEastLowerRear=()=>dwelling(NORTH,31,11,36,22,112.294,88.356);
const northEastEndFront=()=>dwelling(NORTH,36,-6,50,5,100.319,88.356);
const northEastEndMiddle=()=>dwelling(NORTH,36,5,50,11,109.342,88.356);
const northEastEndRear=()=>dwelling(NORTH,36,11,50,22,106.336,88.356);
// Compacte kroon: centrale woonblokken, rondom afzonderlijke terrasbeuken.
const southWestFront=()=>dwelling(SOUTH,30,-60,41.5,-38.5,94.353,70.500);
const southWestMiddle=()=>dwelling(SOUTH,30,-38.5,41.5,-28.5,97.391,70.500);
const southWestRear=()=>dwelling(SOUTH,30,-28.5,41.5,-23.5,88.366,70.500);
const southWestEnd=()=>dwelling(SOUTH,30,-23.5,41.5,-16,79.490,70.500);
const southCentralFront=()=>dwelling(SOUTH,41.5,-60,51.5,-43.5,97.361,70.500);
const southCentralFrontHigh=()=>dwelling(SOUTH,41.5,-43.5,46.5,-38.5,100.509,70.500);
const southCentralMiddle=()=>dwelling(SOUTH,41.5,-38.5,56.5,-28.5,100.509,70.500);
const southCentralRearWest=()=>dwelling(SOUTH,41.5,-28.5,46.5,-23.5,91.383,70.500);
const southCentralRearEast=()=>dwelling(SOUTH,46.5,-28.5,56.5,-23.5,97.394,70.500);
const southCentralEnd=()=>dwelling(SOUTH,41.5,-23.5,56.5,-16,91.383,70.500);
const southEastFront=()=>dwelling(SOUTH,51.5,-60,56.5,-43.5,91.375,70.500);
const southEastFrontHigh=()=>dwelling(SOUTH,46.5,-43.5,56.5,-38.5,97.361,70.500);
const southEastMiddle=()=>dwelling(SOUTH,56.5,-60,72,-28.5,88.370,70.500);
const southEastRear=()=>dwelling(SOUTH,56.5,-28.5,72,-23.5,85.346,70.500);
const southEastEnd=()=>dwelling(SOUTH,56.5,-23.5,72,-16,82.405,70.500);
const northCrown=union([northWestHead(),northWestShoulder(),northWestTerrace(),northWestHighFront(),northWestHighMiddle(),northWestHighRear(),northCentralWest(),northCentralWestRear(),northCentralApartments(),northCentralEast(),northCentralEastRear(),northEastHighFront(),northEastHighMiddle(),northEastHighRear(),northEastShoulderFront(),northEastShoulderMiddle(),northEastShoulderRear(),northEastLowerFront(),northEastLowerMiddle(),northEastLowerRear(),northEastEndFront(),northEastEndMiddle(),northEastEndRear()]);
const southCrown=union([southWestFront(),southWestMiddle(),southWestRear(),southWestEnd(),southCentralFront(),southCentralFrontHigh(),southCentralMiddle(),southCentralRearWest(),southCentralRearEast(),southCentralEnd(),southEastFront(),southEastFrontHigh(),southEastMiddle(),southEastRear(),southEastEnd()]);
let north=union([facade(prism(NORTH,BASE,z(88.356)),NORTH,3.8,88.356,true),northCrown,box(7.5,4.5,z(121.3),22.5,9,z(122.446))]);
let south=union([facade(prism(SOUTH,BASE,z(70.500)),SOUTH,3.8,70.5,true),southCrown,box(44,-36.5,z(100.4),49.2,-31.2,z(102.265))]);
// De entree is een hoge glasnis en luifel aan de westelijke straatkant.
for(const [tower,poly] of [[0,NORTH],[1,SOUTH]]){
 const a=poly[0],b=poly[1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
 const entry=niche(a,b,L*.35,L*.65,1.2,5.7,.6);
 if(tower===0)north=north.subtract(entry);else south=south.subtract(entry);
}
function closed(s){const out=Manifold.compose(s.decompose().filter(p=>p.volume()>0));if(out.status()!=='NoError'||out.decompose().length!==1)throw Error('Grotius niet gesloten/verbonden');return out;}
north=closed(north);south=closed(south);
const samples=[[82418,455290],[82434,455310],[82420,455370],[82486,455345]].map(([x,y])=>local([x-ORIGIN[0],y-ORIGIN[1]]));
await writeLandmark({slug,base:BASE,nodes:[['building:grotius-I-lange-toren-met-woonterraskroon',north],['building:grotius-II-compacte-toren-met-woonterraskroon',south]],catalog:{name:'Grotius',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:44.11194433,groundSamplePoints:samples,replacesBuildings:['NL.IMBAG.Pand.0518100001758098','NL.IMBAG.Pand.0518100001758100','NL.IMBAG.Pand.0518100001758099'],description:'Twee vrijstaande Grotiustorens op eigen BAG-contour, met doorlopende natuurstenen romp, geometrisch vensterraster, deels inpandige balkons met 45 graden onderzijde, asymmetrische kroon uit verticale woonbeuken op gemeten AHN5-dakhoogtes en dakopbouwen; de ondergrondse keldervoet en parkoverkluizing worden niet als bovengrondse plaat gemodelleerd.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,northCrownNapM:121.452,northPlantNapM:122.446,southCrownNapM:100.509,southPlantNapM:102.265,northCrownStartNapM:88.356,southCrownStartNapM:70.500,storeyM:3.02,estimates:['kroonbeukgrenzen uit foto’s en 3D BAG tot circa 1–2 m vereenvoudigd; vlakke dakhoogtes wel gemeten','venstertraveeën circa 3,4 m, raamnis .35 m, balkonnis .9 m, balkons 1,35 m uitkragend met printkraag en vloerdikte minimaal .9 m','laagritme 3,02 m, eerste glaslaag, loggiaposities en entreenissen uit foto’s geschat','dunne glasbalustrades, railingen, roedes, planten, zonnepanelen en onderhoudsgiek niet vrijstaand opgenomen wegens doorsnede onder .9 m']},sources:['https://www.mvrdv.com/projects/392/grotius-towers (architect; Daria Scagliola/Emmely van Mierlo, foto’s alleen referentie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001758098 (TU Delft/3DGI, CC BY 4.0, AHN5 2023)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001758100 (TU Delft/3DGI, CC BY 4.0, AHN5 2023)','PDOK BAG-WFS en AHN DSM/DTM .5 m, CC0; gewone AHN-laag/luchtfoto toont bouwfase','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
// Los printen: de twee torens blijven in de GLB los; alleen deze extra STL
// krijgt een grondplaat. De straat/het park worden op de kaart niet gedubbeld.
const both=union([north,south]),bb=both.boundingBox();
const plate=box(bb.min[0]-2,bb.min[1]-2,BASE-1.2,bb.max[0]+2,bb.max[1]+2,BASE+.15);
const print=union([both,plate]).translate([0,0,-BASE+1.2]);
if(print.status()!=='NoError'||print.decompose().length!==1)throw Error('Grondplaat-STL niet gesloten/verbonden');
await writeFile(path.join(outRoot,slug,`${slug}-grondplaat-1-${scale}.stl`),toStl(print,'NederPrint Grotius met grondplaat').buffer);
const jsonPath=path.join(outRoot,slug,`${slug}.json`),catalog=JSON.parse(await readFile(jsonPath,'utf8'));
catalog.printFiles.push(`${slug}-grondplaat-1-${scale}.stl`);await writeFile(jsonPath,JSON.stringify(catalog,null,2)+'\n');
