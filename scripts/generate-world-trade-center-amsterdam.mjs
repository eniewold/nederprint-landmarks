// WTC Amsterdam, KPF/OZ1985-2004, Tower Ten PLP/OZ2022.
// Voorbeelden Evoluon en Amsterdam Centraal: benoemde bouwdelen en
// doorlopende gemeten glasdakprofielen; nooit gestapelde DSM-hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark,toStl} from './efteling-kit.mjs';
import {writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='world-trade-center-amsterdam',ORIGIN=[120025,483710],ANGLE=3.15,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=.79,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-.38],[s1,-.38],[s1,.45],[s0,.45]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));}
function windows(body,poly,first,top,pitch=3.6,step=3.4){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=first;h+2.3<top-.5;h+=pitch)for(let s=.7;s+2.3<L-.4;s+=step)cuts.push(niche(a,b,s,s+2.3,h,h+2.3));}return body.subtract(union(cuts));}
const block=(poly,top,first=2.5,pitch=3.6)=>windows(prism(poly,BASE,z(top)),poly,first,top,pitch);
const profileY=(pts,v0,v1)=>Manifold.extrude([ccw(pts)],v1-v0).rotate([90,0,0]).translate([0,v1,0]);
const shell=(profile,v0,v1,thickness=1.15)=>profileY([...profile.map(([u,h])=>[u,z(h)]),...profile.slice().reverse().map(([u,h])=>[u,z(h-thickness)])],v0,v1);
const beam=(a,b,w=.95)=>Manifold.hull([Manifold.cube([w,w,w],true).translate([a[0],a[1],z(a[2])]),Manifold.cube([w,w,w],true).translate([b[0],b[1],z(b[2])])]);
// H: gemeten smalle weststrook, hoofdschacht, kroonkamer en techniek.
const westH=block(rect(-124.0,-38.3,-115.3,-15.0),92.107,3.0,3.7);
const shaftH=block(rect(-115.5,-38.9,-80.6,-16.6),97.665,3.0,3.7);
const crownH=B(-114.2,-34.23,-84.27,-18.86,97.5,101.172),plantH=B(-115.75,-31.17,-87.47,-21.99,101.0,103.267);
// I: echte lage westvleugel en glasgevel aan Zuidplein, verbonden aan H.
const westWingPlan=[[-134.49,-31.31],[-129.84,-32.0],[-126.19,-20.67],[-125.84,-8.92],[-118.8,-7.97],[-118.83,21.1],[-117.07,23.84],[-117.05,39.86],[-126.36,40.48],[-126.37,43.88],[-117.04,44.01],[-117.03,51.9],[-134.49,51.9]];
const westI=block(westWingPlan,28.139,2.7,4.0),eastI=block(rect(-85.8,-16.9,-81.0,52.2),28.89,2.7,4.0),northI=block(rect(-134.49,50.6,-81,52.8),28.5,2.7,4.0);
// Gemeten golf over de westelijke atriumkap: een extrusie van een glad
// polygonisch dwarsprofiel (hoogteverandering langs u, constant langs v).
const westProfile=[[-119,27.9],[-117,27.878],[-112,27.174],[-107,26.689],[-102,27.05],[-97,27.921],[-92,28.711],[-87,28.832],[-82,28.799]];
const westGlass=shell(westProfile,-16.9,50.8);
const glassSide=block(rect(-120,-16.9,-118,50.8),26.8,2.7,4.0);
const westHaunches=[profileY([[-119,z(7.0)],[-119,z(26.8)],[-100,z(26.8)]],-16.9,50.8),profileY([[-82,z(10.0)],[-100,z(26.8)],[-82,z(27.6)]],-16.9,50.8)];
const westFrame=[];for(let v=-15;v<51;v+=6)for(let k=1;k<westProfile.length;k++){const [u0,h0]=westProfile[k-1],[u1,h1]=westProfile[k];westFrame.push(beam([u0,v,h0-.1],[u1,v,h1+.65]));}
// Straatzijde van H heeft een dubbele entree; de atriumruimte blijft hol.
let west=union([westH,shaftH,crownH,plantH,westI,eastI,northI,westGlass,glassSide,...westHaunches,...westFrame]).subtract(B(-103,-39.4,-96,-38.25,1.4,7.2));
// A: twee lage kantoorarmen en terugliggende centrale kern uit LoD2.2.
const aPlan=[[-9.9,-20.75],[30.57,-20.8],[30.3,-8.8],[6.6,-8.8],[6.6,28.3],[-5.1,28.3],[-5.1,-7.5],[-9.9,-9.45]];
const towerA=block(aPlan,42.761),plantA=B(3.0,-15.36,16.5,-.5,42.6,48.435),roofA=B(-9.9,-20.75,30.3,-11.01,42.6,46.537);
// B en C: afzonderlijke L-/kernvolumes met echte platte dakniveaus.
const bPlan=[[42.5,41.9],[42.8,30.3],[58.4,30.3],[59.2,22.1],[72.5,23.1],[72.0,35.0],[84.4,33.8],[85.9,46.1]];
const towerB=block(bPlan,63.774),plantB=B(58.4,22.1,72.5,38.0,63.5,65.793);
// Het dakvlak op NAP63.788 omvat een brede noordarm; de oude
// versmalling tot 0.28m was geen gevel en werd door twee raamrijen doorboord.
// Vereenvoudigde buitencontour uit het 3DBAG-vlak, zonder dakapparaatnissen.
const cPlan=[[60.5,-31.85],[104.47,-29.29],[103.27,-20.28],[102.23,-18.26],[87.86,-18.92],[87.84,-22.75],[74.88,-23.47],[73.85,-8.19],[75.49,-8.18],[75.25,2.29],[68.31,1.57],[69.15,-18.77],[61.5,-20.38]];
const towerC=block(cPlan,63.788),plantC=block([[74.88,-23.47],[87.84,-22.75],[87.86,-18.92],[88.09,-16.75],[86.07,-16.2],[85.65,-8.69],[73.85,-8.19]],64.745);
// E, de zuidoostelijke toren, blijft zelfstandig herkenbaar naast Ten.
const ePlan=[[125.44,-37.74],[168.0,-37.75],[167.0,-20.9],[151.4,-20.9],[151.4,1.7],[137.3,1.7],[137.3,-23.4],[125.07,-27.69]];
const towerE=block(ePlan,61.9),plantE=B(125.44,-37.74,151.69,-23.43,61.7,65.869);
// Tower Ten vervangt hier de oude D-massa. AHN5 meet de twee hogere
// vleugels en lagere west-/noordarmen; de oudere3DBAG zag slechts38.9m.
const tenHighPlan=rect(129.7,-.5,170.0,15.5),tenShoulderPlan=rect(133.9,15.3,170.1,31.6),tenWestPlan=rect(109.4,.5,133.95,28.8),tenNorthPlan=rect(109.4,28.5,170.1,53.5);
const tenHigh=block(tenHighPlan,79.027),tenShoulder=block(tenShoulderPlan,71.275),tenWest=block(tenWestPlan,50.189),tenNorth=block(tenNorthPlan,38.158);
const tenPlant=B(138.5,19.0,167.5,25.0,71.1,76.443);
// Witte verticale stijlen1m en glasvelden volgen de laatste gebouwfoto's.
const tenRibs=[];
for(let u=131;u<170;u+=3.6){
  tenRibs.push(B(u-.45,-1.0,u+.45,.25,6,79.8));
  // Noordstijlen horen alleen bij de schouder, niet boven de lage noordvleugel.
  if(u-.45>=133.9)tenRibs.push(B(u-.45,31.25,u+.45,32.1,6,71.9));
}
// F/G en het atrium in de plint. Lage vleugels en glasgolf zijn eigen
// bouwdelen; het Zuidplein tussen oost en west blijft volledig vrij.
const fgWest=block(rect(-29.6,-39.6,-25.6,52.6),26.839,2.7,4),fgEast=block(rect(-17.6,-29.8,-13.5,51.8),25.216,2.7,4);
const fgProfile=[[-29.6,26.84],[-27,27.7],[-24,27.55],[-21,26.84],[-18,25.8],[-13.5,25.22]],fgGlass=shell(fgProfile,-29.8,51.8);
const fgHaunches=[profileY([[-26,z(17)],[-26,z(26.5)],[-18,z(26.5)]],-29.8,51.8),profileY([[-14,z(17)],[-22,z(25.5)],[-14,z(25.5)]],-29.8,51.8)];
// Centrale kap volgt AHN5-dwarsmetingen, met gebogen dal en tweede golf.
const centralProfile=[[18.8,18.44],[22,18.436],[30,17.459],[40,16.73],[50,16.51],[60,16.851],[70,18.05],[80,18.804],[90,18.413],[100,18.257],[110,18.25]];
const centerGlass=shell(centralProfile,-5.5,25.0);
const retailSouth=block(rect(18.8,-7,110,-4.5),16.55,2.2,3.6),retailNorth=block(rect(-10.5,24.5,110,30.3),17.8,2.2,3.6);
const centralHaunches=[Manifold.hull([...ring3(rect(18.8,-6.0,110,-4.5),z(.5)),...ring3(rect(18.8,-6.0,110,10.5),z(16.5))]),Manifold.hull([...ring3(rect(18.8,24.0,110,25.5),z(.5)),...ring3(rect(18.8,10.0,110,25.5),z(16.5))])];
const shopEast=block(rect(101,-35,125.8,-13.4),17.439,2.2,3.6),shopMiddle=block(rect(30.0,-22.4,63.0,-5.0),16.759,2.2,3.6);
const profileHeight=u=>{for(let i=1;i<centralProfile.length;i++){const [a,h0]=centralProfile[i-1],[b,h1]=centralProfile[i];if(u<=b)return h0+(h1-h0)*(u-a)/(b-a);}return 18.25;};
const glassFrame=[];for(let u=22;u<110;u+=6){const h=profileHeight(u)+.3;glassFrame.push(beam([u,-5.4,h],[u,25,h],.9));}
const fgConnector=block(rect(-14.1,24.5,-9.0,30.6),24.6,2.7,4.0);
let east=union([towerA,plantA,roofA,towerB,plantB,towerC,plantC,towerE,plantE,tenHigh,tenShoulder,tenWest,tenNorth,tenPlant,...tenRibs,fgWest,fgEast,fgGlass,...fgHaunches,centerGlass,retailSouth,retailNorth,...centralHaunches,shopEast,shopMiddle,fgConnector,...glassFrame]);
for(const [name,m] of [['west',west],['east',east]])if(m.status()!=='NoError')throw Error(name+' niet gesloten');
west=Manifold.compose(west.decompose().filter(p=>p.volume()>0));east=Manifold.compose(east.decompose().filter(p=>p.volume()>0));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:wtc-west-H-I-en-holle-golfkap',west],['building:wtc-oost-kantoortorens-Ten-en-holle-glasatriums',east]],catalog:{name:'World Trade Center Amsterdam',origin:ORIGIN,xAxis:AXIS,groundHeight:43.87165557,groundOffsetMetres:0,groundSamplePoints:[[119955,483706],[120151,483659]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012065344','NL.IMBAG.Pand.0363100012096613'],description:'Beide WTC-groepen rond het behouden Zuidplein, met torens H/I, A/B/C/E, actuele TowerTen in plaats van oude D-massa, eigen lage winkel-/kantoorvleugels en holle golfvormige glaskappen met raam-/staalritme. AHN5 voor vernieuwde delen;3D BAG/AHN4 voor ongewijzigde dakvlakken.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,hRoofsNapM:[92.107,97.665,101.172,103.267],eastRoofsNapM:[42.761,46.537,48.435,63.774,65.793,63.788,64.745,61.9,65.869],tenRoofsNapM:[79.027,71.275,50.189,38.158,76.443],estimates:['C-buitencontour en kern vereenvoudigd uit afzonderlijke 3DBAG-dakvlakken; brede arm behouden, apparaatnissen weggelaten','TowerTen regelmatige vleugelgrenzen uitAHN5 gemeten/vereenvoudigd, circa0.5-1m onzeker; raamritme en witte1m stijlen uit laatste foto geschat','golfkappen volgen gemeten dwarsprofielen, geextrudeerd langs hun lengte; lokale glasgaten lineair geinterpoleerd','vaste45-graden onderschalen onder beide atriums veranderen de lagere vrije ruimte; westelijke kap blijft onder7m vrij, middendeel wordt hoger gedeeltelijk gevuld','vensters.38m diep, glas-/staalraster en entreepuien geschat; oude gevels volgen3.6-4m laagsteek','kleine dakapparaten, precieze zonnepaneelindeling en nieuwe constructiekranen weggelaten; geen terreinplaat op Zuidplein en station niet vervangen']},sources:['https://arcam.nl/architectuur-gids/wtc-complex-zuidas/','https://zuidas.nl/construction-project/wtc/ (TowerTen opgeleverd2022)','https://www.ahn.nl/dataroom (AHN5 DSM,CC0)','https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec (AHN5,coveragefc9d369f-94ca-4373-8281-a6854edb67c9)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012065344 (TU Delft/3DGI CC BY4.0)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012096613 (oudereD-vlakken niet gebruikt)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4,CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:World_Trade_Center_Amsterdam_2.jpg (Steven Lek CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:World_Trade_Center_Amsterdam_Toren_H.jpg (Choinowski CC BY-SA4.0)','https://zuidas.nl/wp-content/uploads/2017/12/20230111-wtc-tower-ten-marcel-steinbach-01-1800x1201.jpg (Marcel Steinbach2023,uitsluitend visuele referentie)']}});
// Op1:1000 past het samengevoegde complex niet op een standaard printbed;
// beide gesloten gebouwgroepen hebben daarom ook een eigen bruikbare STL.
for(const [suffix,solid] of [['west',west],['oost',east]]){const name=slug+'-'+suffix+'-1-1000.stl';await writeFile(path.resolve(import.meta.dirname,'../models',slug,name),toStl(solid.translate([0,0,-BASE]),'WTC '+suffix+' 1:1000').buffer);}
const jsonPath=path.resolve(import.meta.dirname,'../models',slug,slug+'.json');const cat=JSON.parse(await(await import('node:fs/promises')).readFile(jsonPath,'utf8'));cat.printFiles.push(slug+'-west-1-1000.stl',slug+'-oost-1-1000.stl');await writeFile(jsonPath,JSON.stringify(cat,null,2));
