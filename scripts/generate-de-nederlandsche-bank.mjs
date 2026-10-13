// DNB after Mecanoo's 2025 renovation. The dismantled round 1991 tower is
// deliberately absent; the new city garden stays open. Named permanent wings
// and continuous facade/roof planes, not stacked height-map layers.
// Example: generate-abn-amro-hoofdkantoor.mjs. Constants from PDOK BAG/ortho
// (CC0), 3D BAG TU Delft/3DGI CC BY4.0 (AHN4 2020) and direct AHN5 DSM 2023.
// Old 3DBAG roof planes constrain the permanent wings; 2025 photos override
// demolished volumes and the new crown. AHN6 does not yet cover Amsterdam.
import {Manifold,prism,box,rect,ccw,union,ring3,writeLandmark,toStl,flag} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const slug='de-nederlandsche-bank',ORIGIN=[121830,485778],ANGLE=14.1,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=2.05,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.3],[s0,.3]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));}
function windows(body,plan,first,top,{pitch=3.65,width=1.45,step=2.5,height=1.75,depth=.35}={}){
 const cuts=[],p=ccw(plan);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let h=first;h+height<top-.6;h+=pitch)for(let s=.7;s+1<L-.6;s+=step)cuts.push(niche(a,b,s,Math.min(s+width,L-.6),h,h+height,depth));}
 return cuts.length?body.subtract(union(cuts)):body;
}
const part=(p,h,settings={})=>windows(prism(p,BASE,z(h)),p,5.6,h,settings);
// Four long permanent office sides. The canal-side edge is slightly oblique,
// unlike the square Frederiksplein front. Broad flat bodies keep windows blind.
const westPlan=[[-59.86,-51.84],[-43.74,-50.97],[-43.55,25.29],[-59.38,43.53]];
const west=part(westPlan,15.199,{pitch:4.0,width:3.9,step:5.2,height:2.55});
const eastPlan=[[48.35,-44.15],[62.5,-45.61],[62.73,59.59],[51.21,44.19],[49.92,17.37]];
const east=part(eastPlan,15.199,{pitch:4.0,width:3.9,step:5.2,height:2.55});
const southPlan=[[-59.86,-51.84],[62.5,-45.61],[62.52,-33.5],[50.26,-34.66],[25.15,-34.05],[7.74,-34.08],[-45.04,-33.84],[-43.74,-46.13]];
const south=part(southPlan,15.199,{pitch:4,width:3.9,step:5.2,height:2.55});
const frontPlan=[[-59.38,43.53],[51.21,44.19],[62.73,59.59],[-59.29,59.64]];
let front=part(frontPlan,15.199,{pitch:4,width:3.9,step:5.2,height:2.55});
// Restored double-height cash hall glazing at the western Frederiksplein end.
const tallGlass=rect(-59.29,43.53,-37.1,59.64);
front=front.subtract(B(-59.6,59.02,-38.0,60.0,5.7,13.8));
const tallMullions=[];for(let x=-58.6;x<-37.6;x+=3.65)tallMullions.push(B(x,59.0,x+1,59.64,5.45,14.25));
// Set-back top office/roof volumes supporting the large photovoltaic roof
// structures seen in the ortho and current facades. Named wings, with complete
// horizontal bands; outdoor roof margins remain lower around these bodies.
const westTop=windows(prism(rect(-55.6,-45.3,-43.74,25.5),z(14.95),z(19.131)),rect(-55.6,-45.3,-43.74,25.5),15.6,19.131,{pitch:4,width:3.9,step:5.2,height:2.45});
const eastTop=windows(prism([[49.0,-34.66],[58.16,-39.08],[58.79,41.67],[51.12,41.68]],z(14.95),z(19.131)),[[49.0,-34.66],[58.16,-39.08],[58.79,41.67],[51.12,41.68]],15.6,19.131,{pitch:4,width:3.9,step:5.2,height:2.45});
const southTop=windows(prism([[-55.6,-45.3],[58.16,-39.08],[50.26,-34.66],[-45.04,-33.84],[-43.74,-46.13]],z(14.95),z(19.131)),[[-55.6,-45.3],[58.16,-39.08],[50.26,-34.66],[-45.04,-33.84],[-43.74,-46.13]],15.6,19.131,{pitch:4,width:3.9,step:5.2,height:2.45});
// The northern hall occupies a deeper bar, leaving the city garden to the south.
const northPlan=[[-48.37,25.5],[-20.77,25.34],[-20.82,22.91],[-21.02,21.13],[-33.14,21.62],[-33.58,25.28],[-48.37,25.5]];
const northMainPlan=[[-48.31,25.5],[51.48,24.99],[51.37,51.55],[-48.31,52.13]];
const north=part(northMainPlan,20.572,{pitch:4.05,width:3.9,step:5.2,height:2.7});
const atriumPlan=[[-34.9,21.62],[-21.02,21.13],[-20.4,44.48],[-34.94,45.16]];
const atrium=part(atriumPlan,22.094,{pitch:4.05,width:1.3,step:2.4,height:2.6});
// Main tower: measured long north-south slab. The upper glass level is restored
// as a distinct continuous crown; the two retained stair/service heads agree
// with ortho. They are not the removed round tower or the old large plant.
const shaftPlan=[[7.97,-29.55],[27.28,-29.65],[27.69,17.91],[8.6,17.95]];
const shaft=windows(prism(shaftPlan,BASE,z(66.6)),shaftPlan,20.8,66.6,{pitch:3.45,width:1.25,step:2.3,height:1.55});
const crownPlan=[[8.75,-28.4],[26.4,-28.5],[26.7,16.8],[9.4,16.85]];
const crown=windows(prism(crownPlan,z(66.45),z(70.45)),crownPlan,66.9,70.45,{pitch:4.3,width:1.25,step:2.3,height:2.75,depth:.3});
const capFoot=[[8.1,-29.6],[27.3,-29.7],[27.7,18],[8.6,18]];
const capTop=[[6.9,-30.8],[28.5,-30.9],[28.9,19.2],[7.4,19.2]];
const cap=Manifold.hull([...ring3(capFoot,z(70.15)),...ring3(capTop,z(71.35))]);
const northHead=B(14.0,-1.7,19.4,7.2,70.3,74.15),southHead=B(14.6,-18.3,20.3,-13.3,70.3,73.55);
// Raised logistics/restaurant body at the canal end of the tower, and the
// lower eastern reception part visible in the courtyard; separate flat planes.
const logistics=part([[.5,-28.83],[8.0,-29.55],[8.63,-6.85],[4.84,-7.02],[4.81,-7.8],[.3,-9.12]],10.05,{pitch:4,width:1.3,step:2.5,height:2.4});
const eastCourtRoom=part([[26.8,-14.53],[33.34,-14.44],[34.93,-3.08],[26.8,-1.26]],5.242,{pitch:5.5,width:1.2,step:2.3,height:2.4});
// Blind public entry cuts emphasize the ground-floor recessed glass plinth.
// Large entry nooks stay under .9m deep; no freestanding glass panels.
const groundCuts=[];
for(const p of[frontPlan,westPlan,eastPlan,southPlan]){const v=ccw(p);for(let i=0;i<v.length;i++){const a=v[i],b=v[(i+1)%v.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=1;s+2<L-1;s+=5.2)groundCuts.push(niche(a,b,s,Math.min(s+3.9,L-1),GROUND+.6,4.6,.65));}}
let all=union([west,east,south,front,...tallMullions,westTop,eastTop,southTop,north,atrium,shaft,crown,cap,northHead,southHead,logistics,eastCourtRoom]).subtract(union(groundCuts));
// Lightweight roof-edge/pergola frames are thickened to at least .9m and
// merged into their roof, never imported as detached laser scaffolding.
const roofEdges=[];for(let x=-55;x<51;x+=5.2)roofEdges.push(B(x,51.4,x+.9,56.6,14.95,16.099));
all=union([all,...roofEdges]);
const body=Manifold.compose(all.decompose().filter(p=>p.volume()>0));
const groups=all.decompose().filter(p=>p.volume()>1e-6).sort((a,b)=>b.volume()-a.volume());
const nodes=[['building:dnb-hofvleugels-en-atrium',groups[0]],['building:dnb-toren-en-logistiek',groups[1]]];
if(groups.length!==2)throw new Error('Expected separate main tower and surrounding court wings');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes,catalog:{name:'De Nederlandsche Bank',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:45.192265,groundSamplePoints:[[121834,485845],[121880,485817]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012165684'],description:'DNB na renovatie2025: langgerekte torenschijf met vernieuwde glazen kroon, brede hofvleugels en terugliggende publieke plint, noordelijke dubbelhoge kaszaal, atrium en lage logistieke delen; ontmantelde ronde toren ontbreekt, stadstuin en oostpatio blijven open.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,oldRoofNapM:68.182,currentCrownRoofNapM:70.45,capTopNapM:71.35,northStairHeadNapM:74.15,southStairHeadNapM:73.55,wingRoofNapM:19.131,northHallRoofNapM:20.572,atriumRoofNapM:22.094,outerRoofNapM:15.199,logisticsRoofNapM:10.05,eastCourtRoofNapM:5.242,estimates:['Vernieuwde glazen kroon en dakrand uit AHN5 en fotos2025; exacte capdikte/.9-1.2m overstek en glasvloer66.6NAP geschat, circa1m hoogteonzekerheid','Raamrijen, witte banddikte, dubbelhoge kaszaalpuien en grondnissen uit recente fotos; nissen .3-.65m diep en brede dichte gevellichamen','Bovenbouw langs de lage vleugels en zonnepanelen/pergolaranden gesloten vereenvoudigd; dunne zonnepanelen en profielen niet los','Atriumcontour en lage logistieke vleugels uit oude3DBAG/currentortho, van grillige laserpunten naar doorgaande gevelvlakken vereenvoudigd','Ronde1991toren, verbindingsbrug en oude installatiebovenbouw verwijderd volgens actueleBAG/luchtfoto/Mecanoo; 3DBAG kiest hier AHN4 2020 en toont verouderde bouwdelen']},sources:['https://www.mecanoo.nl/Projects?project=282&t=2 (architect, renovatie2025)','https://www.dnb.nl/over-ons/renovatie/ (gebouwbeheerder, heropening2025)','https://www.pieters.net/projecten/de-nederlandsche-bank (constructeur, nieuwe kroon)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012165684 (TU Delft/3DGI CC BY4.0; AHN4 2020, blijvende vleugels)','https://www.ahn.nl/dataroom (AHN5 DSM WCS, CC0; bouwfase2023)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:De_Nederlandsche_Bank_(2025),_Westeinde_side.jpg (Erremm CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:De_Nederlandsche_Bank_(2025).jpg (Erremm CC BY-SA4.0)']}});

// A separate standalone-print STL connects both real ground-based groups.
// This 1mm plate is never in the GLB or on the map.
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
const scale=Number(flag('--scale','1000'));
const plate=union([body,box(-61,-53,BASE-scale/1000,64,61,BASE+.02)]).translate([0,0,-BASE+scale/1000]);
if(plate.status()!=='NoError'||plate.decompose().filter(p=>p.volume()>1e-6).length!==1)throw new Error('Print ground plate does not connect both groups');
const plateName=`${slug}-grondplaat-1-${scale}.stl`;
await writeFile(path.join(outDir,plateName),toStl(plate,'NederPrint DNB with 1mm ground plate').buffer);
const entryPath=path.join(outDir,slug+'.json'),entry=JSON.parse(await readFile(entryPath,'utf8'));
entry.printFiles.push(plateName);await writeFile(entryPath,JSON.stringify(entry,null,2));
console.log('Optional ground-plate STL',plateName,'NoError; one connected component');
