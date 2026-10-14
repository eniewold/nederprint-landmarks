// Amsterdam Symphony: five above-ground groups belonging to BAG 0363100012128931.
// Example: generate-evoluon.mjs; continuous building volumes, blind facade recesses
// and curved plant covers. The underground BAG rectangle is not a plaza slab.
// Roof contours/heights: 3D BAG, TU Delft/3DGI, CC BY 4.0; checked against PDOK AHN4.
import {Manifold,prism,rect,box,union,ccw,writeLandmark,flag,toStl} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='amsterdam-symphony',ORIGIN=[120000,483225],GROUND=-.75,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.36){
  const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];
  return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.35],[s0,.35]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));
}
function windows(body,poly,top,{pitch=3.6,step=2.65,width=1.25,first=2.4,height=2.1,offset=0}={}){
  const cuts=[],p=ccw(poly);
  for(let i=0;i<p.length;i++){
    const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    for(let h=first,row=0;h+height<top-.6;h+=pitch,row++)
      for(let s=.7+(row%2)*offset;s+width<L-.7;s+=step)cuts.push(niche(a,b,s,s+width,h,h+height));
  }
  return cuts.length?body.subtract(union(cuts)):body;
}
const block=(poly,top,settings={})=>windows(prism(poly,BASE,z(top)),poly,top,settings);
const ellipsoidCap=(u,v,rx,ry,bottom,top)=>Manifold.sphere(1,48).scale([rx,ry,top-bottom]).translate([u,v,z(bottom)]).intersect(B(u-rx-1,v-ry-1,u+rx+1,v+ry+1,bottom-.1,top+.1));
// Residential tower: the skewed roof edges come from the measured facade axes.
const homePlan=[[-15.95,28.4],[8.24,27.82],[7.8,46.99],[-15.17,46.07]];
const home=block(homePlan,101.885,{pitch:3.45,step:2.65,width:1.25,offset:.32});
const homePlant=B(-9.3,32.2,1.35,41.8,101.65,104.179);
const homeEntry=B(-7,27.5,-1,28.9,-.5,5.7);
const residential=union([home,homePlant]).subtract(homeEntry);
// Office tower: tall shaft, lower L-shoulder and three low courtyard wings.
const officePlan=[[18.19,44.59],[40.42,44.49],[41.3,78.48],[18.29,78.39]];
const officeShoulderPlan=[[22.65,32.75],[45.27,32.78],[44.7,65.4],[40.97,65.61],[40.42,44.49],[22.816,44.573]];
const officeShaft=block(officePlan,102.004,{pitch:3.75,step:2.65,width:1.3});
const officeShoulder=block(officeShoulderPlan,73.247,{pitch:3.75,step:2.65,width:1.3}).subtract(B(24.3,33.6,40.0,37.8,72.349,73.6));
const officeSouthPlan=[[29.945,29.659],[85.979,24.088],[86.018,39.728],[45.848,39.469],[45.267,32.785],[29.509,32.755]];
const officeSouth=block(officeSouthPlan,22.829,{pitch:3.75,offset:.32});
const officeNorth=block(rect(40.97,64.77,86.11,79.22),22.843,{pitch:3.75,offset:.32});
const officeEast=block([[72.2,39.639],[86.018,39.728],[86.078,64.139],[71.496,65.052]],22.427,{pitch:3.75,offset:.32});
const courtDeck=prism(rect(45.0,39.64,71.6,64.9),BASE,z(8.502));
const officePlant=B(25.21,51.74,34.94,66.32,101.8,104.236),officePlantStep=B(26.07,65.97,34.78,71.11,101.8,103.712);
const officeEntry=B(22.1,38.8,23.1,42.8,-.5,5.8);
const office=union([officeShaft,officeShoulder,officeSouth,officeNorth,officeEast,courtDeck,officePlant,officePlantStep]).subtract(officeEntry);
// Hotel: a tall L around a low glazed entrance/courtyard roof and roof plant.
const hotelWest=block(rect(41.55,-34.0,57.74,6.97),38.666,{pitch:3.2,step:2.8,width:1.45});
const hotelEast=block(rect(57.5,-21.1,81.6,-5.45),38.675,{pitch:3.2,step:2.8,width:1.45});
const hotelLobby=block([[57.63,-5.5],[81.6,-5.45],[81.0,9.03],[57.63,6.97]],7.905,{pitch:3.2,step:3.5,width:2.1});
const hotelPlant=union([B(44.9,-21.55,57.8,-5.49,38.45,43.263),B(57.5,-17.9,69.76,-8.9,38.45,43.263)]);
const hotel=union([hotelWest,hotelEast,hotelLobby,hotelPlant]).subtract(B(71,-5.8,77,-4.9,-.5,5.2));
// Northwest low-rise offices: L-wings with a low joining arm and recessed courtyard.
const nwWest=block(rect(-78.9,20.42,-64.7,79.35),30.563,{pitch:3.5,step:2.6,offset:.3});
const nwNorth=block(rect(-78.9,64.77,-34.0,79.35),30.563,{pitch:3.5,step:2.6,offset:.3});
const nwHead=block(rect(-50.2,25.64,-34.22,45.07),30.567,{pitch:3.5,step:2.6,offset:.3});
const nwJoin=block(rect(-50.2,44.8,-34.15,64.9),10.571,{pitch:3.5,step:2.6});
const nwCourt=prism(rect(-64.8,45.07,-49.5,64.9),BASE,z(3.930));
// Curved plan of the continuous L-shaped white machinery cover, from ortho.
const northCoverPlan=[[-76,53],[-74,51],[-71,51],[-69,54],[-69,62],[-70,66],[-67,69],[-63,70],[-58,70],[-52,69],[-45,68],[-40,67],[-38,69],[-38,73],[-39,76],[-44,77],[-52,75],[-62,75],[-70,77],[-75,76],[-77,73],[-75,66],[-74,62],[-76,57]];
const northCover=prism(northCoverPlan,z(30.4),z(33.814));
const nwCap=ellipsoidCap(-41.3,35.4,5.2,6.1,30.4,33.903);
const northwest=union([nwWest,nwNorth,nwHead,nwJoin,nwCourt,northCover,nwCap]);
// Southwest low-rise offices: tall east bar, lower west wing, recessed inner court.
const swEast=block([[-49.68,-36.54],[-34.1,-34.6],[-32.43,6.76],[-47.23,7.1]],40.956,{pitch:3.45,step:2.8,width:1.4});
const swWest=block([[-78.94,-15.09],[-54.97,-9.77],[-54.93,2.48],[-47.04,2.08],[-47.23,7.1],[-78.91,6.94]],27.799,{pitch:3.45,step:2.8});
const swSouth=block(rect(-81.1,-36.5,-49.6,-24.25),11.020,{pitch:3.45,step:2.8});
const swCourt=prism(rect(-65,-21,-49.5,-3.6),BASE,z(.272));
const swHighCover=ellipsoidCap(-40.0,-4.8,5.5,9,40.8,43.815),swLowCover=ellipsoidCap(-65.0,.5,8.0,4.5,27.6,30.678);
const southwest=union([swEast,swWest,swSouth,swCourt,swHighCover,swLowCover]);
const nodes=[['building:symphony-woontoren',residential],['building:symphony-kantoortoren-en-hofvleugels',office],['building:symphony-hotel',hotel],['building:symphony-laagbouw-noordwest',northwest],['building:symphony-laagbouw-zuidwest',southwest]];
// Overlapping wings can enclose recesses on shared interior walls. Fill these
// hidden air pockets; keep the exterior niches and the open courtyards.
const closedNodes=nodes.map(([name,body])=>[name,Manifold.compose(body.decompose().filter(p=>p.volume()>0))]);
await writeLandmark({slug,base:BASE,nodes:closedNodes,catalog:{name:'Amsterdam Symphony',origin:ORIGIN,xAxis:[1,0],groundHeight:42.44917,groundOffsetMetres:0,groundSamplePoints:[[-10,-1],[91,9]],replacesBuildings:['NL.IMBAG.Pand.0363100012128931'],description:'Beide Symphony-torens, getrapte kantoorlaagbouw, hotel en alle bovengrondse vleugels van het gedeelde BAG-pand; de ondergrondse garage blijft onder het maaiveld en openbare pleinruimten blijven vrij.',realWorld:{groundNapM:GROUND,residentialRoofNapM:101.885,residentialPlantNapM:104.179,officeRoofNapM:102.004,officeShoulderNapM:73.247,officePlantNapM:104.236,hotelRoofNapM:38.666,hotelPlantNapM:43.263,lowRoofsNapM:[30.563,30.567,10.571,3.930,40.956,27.799,11.020,.272],estimates:['Venster-/metselwerkritme, verspringing van 0.32m en entreepuien uit schuine Commons-fotos geschat; nissen 0.36m diep','Regelmatige vleugelranden uit 3DBAG/AHN vereenvoudigd, circa0.3-0.8m; brede gesloten volumes houden raamrijen blind','Ronde plantkappen: contour uit ortho en dakhoogtes uit3DBAG; lokaal omhullende ellipsoide tussen gemeten voet en kruin','Het witte noordelijke installatiescherm is als massief volume met gebogen L-contour vereenvoudigd','Geen glas-koppen zoals de backlog suggereerde: bakstenen torens met afzonderlijke daktechniek; gepubliceerde105m wordt door techniekhoogte bereikt']},sources:['https://www.cie.nl/Amsterdam-Symphony?lang=nl (architect)','https://www.boele.nl/nl/projecten/symphony (bouwer)','https://www.verhoeven.nl/nl/projecten/symphony-amsterdam (gevelelementen)','https://zuidas.nl/en/threesixty_info/amsterdam-symphony/ (gemeente)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012128931 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Amsterdam_-_Symphony_Office_Tower_%26_Symphony_Amsterdam_(30214043291).jpg (Fred Romero CC BY2.0)','https://commons.wikimedia.org/wiki/File:Amsterdam_Symphony_Towers.jpg (Choinowski CC BY-SA4.0)']}});

// Five real buildings stay separate on the map; a standalone-print variant connects them.
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),scale=Number(flag('--scale','1000'));
const all=union(closedNodes.map(([,part])=>part)),bounds=all.boundingBox();
const plate=union([all,box(bounds.min[0]-1,bounds.min[1]-1,BASE-scale/1000,bounds.max[0]+1,bounds.max[1]+1,BASE+.02)]).translate([0,0,-BASE+scale/1000]);
if(plate.status()!=='NoError'||plate.decompose().filter(p=>p.volume()>1e-6).length!==1)throw new Error('Symphony ground plate must connect five buildings');
const plateName=`${slug}-grondplaat-1-${scale}.stl`;await writeFile(path.join(outDir,plateName),toStl(plate,'NederPrint Symphony with 1mm ground plate').buffer);
const entryPath=path.join(outDir,slug+'.json'),entry=JSON.parse(await readFile(entryPath,'utf8'));entry.printFiles.push(plateName);await writeFile(entryPath,JSON.stringify(entry,null,2));
