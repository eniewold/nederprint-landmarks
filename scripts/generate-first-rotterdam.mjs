// FIRST Rotterdam, de Architekten Cie., 2015. Per-rij voorbeeld volledig
// gelezen: generate-hoftoren.mjs. Vaste benoemde bouwdelen, geen DSM-lagen.
// BAG/AHN/PDOK CC0; 3DBAG TU Delft/3DGI CC BY 4.0; Commons/Boele foto's referentie.
import {Manifold,CrossSection,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='first-rotterdam',ORIGIN=[91817,437479],ANGLE=16.3,rad=ANGLE*Math.PI/180,AXIS=[Math.cos(rad),Math.sin(rad)],GROUND=-1.25,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const FOOT=[[55.72,5.71],[53.86,5.71],[53.88,19.7],[37.57,20.53],[-38.72,19.65],[-39.1,-21.06],[-25.48,-21.19],[-24.7,-18.74],[-12.42,-20.56],[-12.32,-24.13],[53.99,-24.55],[53.95,-14.29],[56.14,-14.3]];
const TOWER=[[.6,6.94],[11.4,6.94],[11.4,-14.6],[43.81,-14.6],[43.81,-.8],[35.28,-.8],[35.28,17.17],[.6,17.17]];
const PODIUM=rect(-38.72,-13.58,43.84,19.65);
function niche(a,b,s0,s1,h0,h1,d=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-d],[s1,-d],[s1,.3],[s0,.3]].map(([s,w])=>[a[0]+s*t[0]+w*n[0],a[1]+s*t[1]+w*n[1],h])));}
function facade(solid,poly,{first,pitch,top,width=1.35,step=2.4,height=2.75,group=3}={}){const p=ccw(poly),cuts=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<2)continue;for(let s=.9;s+width<L-.75;s+=step){for(let h=first;h+height<top-.5;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height,.45));for(let h=first;h+pitch*group-.9<top-.5;h+=pitch*group)cuts.push(niche(a,b,s-.15,s+width+.15,h-.1,h+pitch*group-.9,.22));}}return solid.subtract(union(cuts));}
// Alleen de werkelijke lage glasdaken, niet de ondergrondse BAG-rand als plaat.
const LOW_GLASS=[[15.75,-14.53],[38.85,-14.57],[37.97,-19.04],[16.48,-19.29]];
let plinth=facade(prism(LOW_GLASS,BASE,z(8.212)),LOW_GLASS,{first:.15,pitch:4.1,top:8.212,width:2.8,step:3.9,height:3.1,group:1});
let podium=facade(prism(PODIUM,BASE,z(34.127)),PODIUM,{first:.2,pitch:3.75,top:34.127,width:2.3,step:3.5,height:2.8,group:1});
let tower=facade(prism(TOWER,BASE,z(124.246)),TOWER,{first:35.4,pitch:3.65,top:120.0,width:1.35,step:2.35,height:2.85,group:3});
// Werkelijk lagere glazen inspringingen: de binnenste facetten krijgen een
// eigen glasraster; op de bovenste laag loopt de stenen kroon als een frame.
const towerCS=new CrossSection([ccw(TOWER)]);
tower=tower.subtract(Manifold.extrude(towerCS.offset(-1.3,'Miter'),10).translate([0,0,z(120.067)]));
const crownCuts=[];const tp=ccw(TOWER);for(let i=0;i<tp.length;i++){const a=tp[i],b=tp[(i+1)%tp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.9;s+1.35<L-.75;s+=2.35)crownCuts.push(niche(a,b,s,s+1.35,120.55,123.25,.35));}tower=tower.subtract(union(crownCuts));
// Dakinstallaties: gesloten technische kern en onderhoudsblok op het echte dak.
const plants=union([B(16,-7.27,28.0,11.37,120.0,124.526),B(21.07,-2.48,27.60,7.01,124.4,126.175),B(28.05,6.51,42.75,9.90,120.0,124.246)]);
const WEST_PLANT=rect(-32.48,-6.83,-15.55,12.77);
let westPlant=facade(prism(WEST_PLANT,z(34.0),z(38.563)),WEST_PLANT,{first:35.0,pitch:3.2,top:38.563,width:1.2,step:2.2,height:2.35,group:1});
const westSmall=B(-29.68,-1.9,-18.2,7.23,38.4,39.051);
// Glazen serre aan de oostkant: volledige BAG-strook, lagere glaspuien.
const CONSERVATORY=[[43.75,-14.29],[56.14,-14.3],[55.72,5.71],[53.86,5.71],[53.88,19.7],[43.84,20.2]];
let serre=facade(prism(CONSERVATORY,BASE,z(8.212)),CONSERVATORY,{first:.2,pitch:4.0,top:8.212,width:1.7,step:2.6,height:3.0,group:1});
// Noordelijke kroon van de onderbouw, oostelijk korte dakdeel en lage rug.
const lowEast=facade(B(38.8,5.8,43.84,18.27,8.1,34.097),rect(38.8,5.8,43.84,18.27),{first:9.7,pitch:3.75,top:34.097,width:2.3,step:3.5,height:2.8,group:1}),lowGlass=B(-15.71,-3.55,11.78,7.46,8.1,34.094);
const northCap=facade(B(.6,17.1,35.41,20.21,8.1,34.293),rect(.6,17.1,35.41,20.21),{first:9.7,pitch:3.75,top:34.293,width:2.3,step:3.5,height:2.8,group:1});
// Het kunstpaneel van Henry Moore: blinde omlijsting, geen fictief baksteenbeeld.
const artFrame=B(-35.7,19.6,-20.5,20.1,.2,7.7);
const artPanel=B(-35.0,19.7,-21.2,20.4,.9,7.0);
// Ingangen in de twee hoge glaslagen met een kleine permanente 45°-luifel.
const canopy=Manifold.hull([...ring3(rect(-9,19.5,-1,19.8),z(5.9)),...ring3(rect(-9,19.5,-1,21.0),z(7.2))]);
let model=union([plinth,podium,tower,plants,westPlant,westSmall,serre,lowEast,lowGlass,northCap,artFrame,canopy]).subtract(artPanel);
// Zoals het Hoftoren-voorbeeld: nissen die een ander bouwdeel geheel afdekt
// worden gevuld; de externe geometrie en gesloten-volumecontrole blijven staan.
model=Manifold.compose(model.decompose().filter(part=>part.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error(`FIRST ${model.status()} ${model.decompose().length} delen`);
const rdLocal=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:first-met-terugliggende-glashoeken-kroon-onderbouw-en-serre',model]],catalog:{name:'FIRST Rotterdam',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:42.26031222,groundSamplePoints:[[91786,437525],[91861,437522],[91876,437456]].map(rdLocal),replacesBuildings:['NL.IMBAG.Pand.0599100100006704'],description:'FIRST Rotterdam: geknikte schacht met glazen inspringingen, hoog drielagenraster, kroon met blinde framevelden, gemeten dakinstallaties, volledige bovengrondse lange onderbouw en lage oostserre, entree en blinde omlijsting van het kunstpaneel. Achterliggende stadstuin en ongefundeerde ondergrondse BAG-rand blijven open. Benoemde prisma’s en bouwdelen, geen DSM-lagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:120.067,crownNapM:124.246,plantNapM:[124.526,126.175],podiumNapM:34.127,westPlantNapM:[38.563,39.051],serreNapM:8.212,storeyM:3.65,nicheDepthM:.45,estimates:['gevelraster met verticale traveeën van circa 2,35 m en groepen van drie lagen; laagritme 3,65 m uit foto’s','glazen inspringingen vereenvoudigd op de union-contour van hoge 3DBAG-dakvlakken','open kroon als 1,3 m dikke gesloten rand met blinde nissen, permanente profielen minstens 0,9 m','serre, entree en kunstpaneelomlijsting uit foto’s vereenvoudigd; kleine bakstenen van het kunstwerk niet weergegeven','fijn dakhekwerk, naamletters, antennes en dunne PV-panelen weggelaten wegens doorsnede onder 0,9 m']},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100006704 (TU Delft/3DGI CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://www.cie.nl/first-rotterdam?lang=en (de Architekten Cie.)','https://www.boele.nl/nl/projecten/first (primaire schuine projectfoto’s, alleen referentie)','https://commons.wikimedia.org/wiki/Category:FIRST_Tower,_Rotterdam (FIRST Rotterdam 2019 en FIRST Rotterdam.jpg, bronmetadata in README)']}});
