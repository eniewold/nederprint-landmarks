// Vinoly / Mahler 4: complete podium and low office wing, two rising tower
// volumes, roof equipment and one blind inclined staircase around the facades.
// Example generate-the-rock.mjs; true architectural building volumes/planes.
import {Manifold,CrossSection,prism,rect,box,ccw,union,writeLandmark} from './efteling-kit.mjs';
const slug='vinoly-amsterdam',ORIGIN=[119914,483442],ANGLE=3.2,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=.15,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const podiumPlan=[[-44.546,-17.802],[45.56,-4.985],[45.599,14.592],[-44.446,14.524]];
const middlePlan=[[-44.55,-17.818],[-6.143,-12.355],[-5.853,-2.816],[-6.215,14.517],[-44.446,14.524]];
const upperPlan=[[-44.487,-8.88],[-35.465,-8.529],[-5.853,-2.816],[-6.215,14.517],[-44.446,14.524]];
// These are the three real architectural parts, at measured roof levels.
// The upper trapezoid shifts from the middle shaft; no raster height slices.
const podium=prism(podiumPlan,BASE,z(26.497)),shaft=prism(middlePlan,BASE,z(62.528)),upper=prism(upperPlan,z(60.9),z(91.271));
const machinePlan=[[-40.629,10.504],[-40.759,-4.97],[-8.939,-1.693],[-9.242,10.492]];
const machinery=prism(machinePlan,z(91.1),z(95.119));
const eastPlant=B(22,4.8,34.8,8.7,26.3,29.771),westPlant=B(2,-1.6,6.3,4.1,26.3,29.254);
let body=union([podium,shaft,upper,machinery,eastPlant,westPlant]);
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return prism([[s0,-depth],[s1,-depth],[s1,.5],[s0,.5]].map(([u,v])=>[a[0]+u*t[0]+v*n[0],a[1]+u*t[1]+v*n[1]]),z(h0),z(h1));}
// Dominant vertical fins are represented by thick continuous mullion bands
// between closed glazing panels, with blind horizontal floor subdivisions.
function windows(plan,first,top){const q=ccw(plan),cuts=[];for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=first;h+2.9<top-.8;h+=3.8)for(let s=1;s+2<L-1;s+=3.1)cuts.push(niche(a,b,s,s+2,h,h+2.9,.35));}return cuts;}
const glazing=[...windows(podiumPlan,1.5,26.497),...windows(middlePlan,28.1,62.528),...windows(upperPlan,64.2,91.271)];
// Carve only real external panels: separate roof/shaft boundaries may not
// become opposing window walls. The untouched inside stays completely solid.
function inclinedRecess(a,b,h0,h1,depth=2.2){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),deg=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;const p=[[-.15,z(h0)],[L+.15,z(h1)],[L+.15,z(h1+3.4)],[-.15,z(h0+3.4)]];return Manifold.extrude(new CrossSection([ccw(p)]),depth+.5).rotate([90,0,0]).translate([0,depth,0]).rotate([0,0,deg]).translate([a[0],a[1],0]);}
// The wrapping route is deliberately a blind, broad inclined volume cut.
// Closed backs/floors substitute for tiny open steps, handrails and frames.
// Heights/turns are inferred from oblique photos and the measured terraces;
// exact stair treads are not a reliable AHN roof surface.
const flights=[
 [[45.56,-4.985],[-44.546,-17.802],1.0,24],
 [[-44.55,-17.818],[-6.143,-12.355],24,32],
 [[-6.143,-12.355],[-5.853,-2.816],32,35.9],
 [[-5.853,-2.816],[-6.215,14.517],35.9,43],
 [[-6.215,14.517],[-44.446,14.524],43,59],
 [[-44.446,14.524],[-44.487,-8.88],59,66],
 [[-44.487,-8.88],[-35.465,-8.529],66,66.92],
 [[-35.465,-8.529],[-5.853,-2.816],66.92,70],
 [[-5.853,-2.816],[-6.215,14.517],70,78],
 [[-6.215,14.517],[-44.446,14.524],78,88]
];
// Orient each cut from the CCW face boundary; the ascending flight can run
// the opposite way along that face. Reversal must not cut behind the building.
const stairs=[];for(const [a,b,h0,h1]of flights){let A=a,B=b,H0=h0,H1=h1;if(a[0]>40){A=b;B=a;H0=h1;H1=h0;}stairs.push(inclinedRecess(A,B,H0,H1));}
for(const [i,cut]of stairs.entries()){const candidate=body.subtract(cut);if(candidate.genus()!==0)throw new Error('Stair recess '+i+' must remain blind, genus '+candidate.genus());body=candidate;}
for(const cut of glazing){const candidate=body.subtract(cut);if(candidate.genus()===0&&candidate.status()==='NoError')body=candidate;else candidate.delete();}

// Renovated shopfront/foyer stays a closed base with broad blind glass panels.
const lobby=B(45.05,-4.7,46,10.8,GROUND+.2,5.2);const candidate=body.subtract(lobby);if(candidate.genus()===0)body=candidate;
body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:vinoly-drie-volumes-lage-vleugel-en-omwikkelende-trap',body]],catalog:{name:'Vi\u00f1oly',origin:ORIGIN,xAxis:AXIS,groundHeight:43.182419,groundOffsetMetres:0,groundSamplePoints:[[119864,483451],[119913,483463],[119955,483462]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012107681'],description:'De volledige Vi\u00f1oly/Mahler4 met brede lage kantoor-/winkelvleugel, gedraaide middel- en bovenvolumes, gemeten dakinstallaties, verticale gevelvinnen als gesloten glasreli\u00ebf en een omwikkelende blinde schuine trapgroef. Geen enkel los open trappenhuis, raamframe of publieke pleinplaat; de afzonderlijke Ito/SOM-buurgebouwen blijven behouden.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,podiumRoofNapM:26.497,middleShoulderNapM:62.528,upperRoofNapM:91.271,mainPlantNapM:95.119,lowPlantsNapM:[29.771,29.254],stairFlightsNapM:flights,estimates:['Omwikkelende traproutes/hoeken en bordeshoogtes uit schuine fotos, circa1-3m onzeker; blind2.2m diep met gesloten achtervlakken en doorgaande schuine bodem','Verticale vinnen/glasraster3.1m en laagsteek3.8m/glashoogte2.9m, .35m blinde glasnissen; dunne echte aluminiumvinnen vereenvoudigd tot circa1.1m gesloten banden','Bovenvolume begint op geschatte60.9NAP, daken/voetcontouren volgen3DBAG/AHN4; geen volledig open verticale trapkoker','Glaspatio/foyerinterieur massief gehouden; geen fictieve open binnenhof onder het dichte podiumdak','Dakmachines tot95.119NAP circa418m2, de architectonische hoofdkop is91.271NAP; fijne antennes, leuningen, leidingen en traproedes onder.9m weggelaten']},sources:['https://www.rvapc.com/works/mahler-4-office-tower/ (architect,drie volumes en buitenomtrap)','https://zuidas.nl/en/construction-project/mahler-4-vinoly/ (gemeenteAmsterdam,2005,91m hoofdtoren)','https://www.studioseilern.com/portfolio/mahler-4/ (ontwerpteam)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012107681 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Kantoortoren_Vi%C3%B1oly_in_Amsterdam-Zuid.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Vi%C3%B1oly_Tower.jpg (Steven Lek CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Vi%C3%B1oly_Tower_6.jpg (Steven Lek CC BY-SA4.0)']}});
