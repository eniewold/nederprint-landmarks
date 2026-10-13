// Beurs WTC: named office wings, a continuous barrel hall, lens tower and entrance.
// Example: generate-weenatoren.mjs (curved facade), generate-evoluon.mjs (profiles).
// Measured plans/heights: 3D BAG, TU Delft/3DGI, CC BY 4.0, checked with PDOK
// AHN4 DSM/DTM and current ortho. Roof patches were combined into building parts,
// not stacked height layers. Local +X follows the north facade, +Y Coolsingel.
import {Manifold,CrossSection,prism,box,rect,ccw,union,circle,writeLandmark} from './efteling-kit.mjs';
const slug='beurs-wtc-rotterdam',ORIGIN=[92648,437325],GROUND=.4,BASE=-1,z=h=>h-GROUND;
const B=(x0,y0,x1,y1,h0,h1)=>box(x0,y0,z(h0),x1,y1,z(h1));
function recess(a,b,s0,s1,h0,h1,depth=.3){
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];
 return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.3],[s0,.3]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));
}
function windows(body,plan,top,{first=2.4,pitch=3.4,height=2.05,width=6.2,step=7.2}={}){
 const p=ccw(plan),cuts=[];
 for(let i=0;i<p.length;i++){
  const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(let h=first;h+height<top-.6;h+=pitch)
   for(let s=.65;s+.95<L-.6;s+=step)cuts.push(recess(a,b,s,Math.min(s+width,L-.6),h,h+height));
 }
 return cuts.length?body.subtract(union(cuts)):body;
}
const wing=(p,h,settings)=>windows(prism(p,BASE,z(h)),p,h,settings);
function profileAlongY(profile,y0,y1){return Manifold.extrude(new CrossSection([ccw(profile)]),y1-y0).rotate([90,0,0]).translate([0,y1,0]);}
// Seven Gusto rafters carry this ONE barrel: 90th percentile cross-section
// over the unobstructed northern 20 m; the southern profiles agree within .2 m
// outside the tower shadow. Panels/thermolux are represented by shallow seams.
const hallRoof=[[-15.7,13.75],[-15,13.935],[-13,14.556],[-11,15.025],[-9,15.422],[-7,15.783],[-5,16.105],[-3,16.381],[-1,16.595],[1,16.801],[3,16.939],[5,17.031],[7,17.116],[9,17.182],[11,17.190],[13,17.108],[15,17.031],[17,16.905],[19,16.734],[21,16.523],[23,16.260],[25,15.976],[27,15.646],[29,15.263],[31,14.817],[33.5,14.15]];
const hallProfile=[[-15.7,BASE],[33.5,BASE],...hallRoof.toReversed().map(([u,h])=>[u,z(h)])];
let hall=profileAlongY(hallProfile,-57.2,25.3);
const seams=[];for(let y=-54;y<24;y+=3.05)seams.push(B(-16,y,34,y+.16,13.5,17.9));
hall=hall.subtract(union(seams).intersect(profileAlongY(hallProfile,-57.2,25.3)).subtract(profileAlongY(hallProfile.map(([u,h],i)=>[u,i<2?h:h-.13]),-57.2,25.3)));
// Lens shaft has curved long faces and short flat end panes, not an ellipse.
function bezier(a,b,c,d,n=24){return Array.from({length:n},(_,i)=>{const t=i/n,s=1-t;return [0,1].map(k=>s*s*s*a[k]+3*s*s*t*b[k]+3*s*t*t*c[k]+t*t*t*d[k]);});}
const lens=[...bezier([5.78,5.21],[-8,-12],[-7,-33],[6.45,-51.38]),[6.45,-51.38],[12.76,-50.91],...bezier([12.76,-50.91],[27,-32],[25,-10],[11.77,5.17]),[11.77,5.17]];
const tower=windows(prism(lens,BASE,z(87.476)),lens,87.476,{first:18,pitch:3.45,height:2.5,width:1.25,step:2.1});
const towerPlant=prism([[4.26,-31.59],[14.07,-32.13],[14.81,-17.38],[12.86,-9.66],[5.13,-10.36],[3.76,-15.96]],z(87.25),z(93.546));
const towerPlantHead=B(7,-34.4,13.35,-31.74,87.25,93.884);
// Three main old-Beurs office sides, with a second Coolsingel wing behind the
// open narrow light court. Inside corners and windows stay solid and blind.
const west=wing([[-55.94,-33.41],[-44.68,-33.83],[-43.75,59],[-55.36,58.92]],27.417);
const north=wing([[-32.77,43.5],[50.66,43.5],[48.66,58.63],[-32.77,60.42]],27.433);
const east=wing([[36.68,-36],[50.54,-44.02],[50.66,43.65],[39.37,43.14]],20.192);
const westInner=wing([[-33.85,-32.05],[-20.31,-32.77],[-20.03,43.3],[-33.43,43.95]],23.857);
const westLower=wing([[-55.94,-33.41],[-44.68,-33.83],[-44.22,-8.51],[-33.73,-8.11],[-33.85,-32.05],[-20.31,-32.77],[-20.52,-37.14],[-53.97,-37.26]],20.15);
const westStair=wing(rect(-45.03,-2.06,-32.39,7.74),30.809,{pitch:3.4,width:1.2,step:2.3});
const courtCanopy=profileAlongY([[-44.4,BASE],[-33.6,BASE],[-33.6,z(4.6)],[-40.9,z(6.02)],[-44.4,z(8.2)]],13.35,49.4).subtract(B(-40.8,13.2,-34.6,45,.1,4.7));
// Meent/Coolsingel hanging bridge: an arched opening through a four-storey body.
const hangingBridge=windows(prism(rect(-44,49.3,-33.35,56.2),BASE,z(22.688)),rect(-44,49.3,-33.35,56.2),22.688,{first:8,pitch:3.35,width:1.2,step:2.3}).subtract(profileAlongY([[-43.1,BASE-1],[-34.2,BASE-1],[-34.2,z(2)],[-38.65,z(6.0)],[-43.1,z(2)]],49.2,56.3));
const northAnnex=wing(rect(-15.7,25.1,39.35,43.5),11.334,{pitch:3.4,width:2.2,step:3.4});
const eastAnnex=wing([[33.2,-58.08],[38.2,-57.15],[39.35,43.5],[33.8,37.33]],12.723,{pitch:3.4,width:2.2,step:3.4});
const southAnnex=wing([[-16.98,-67],[4.86,-67.79],[38.35,-67.45],[38.2,-57.15],[-15.7,-57.06]],10.299,{pitch:3.4,width:2.1,step:3.3});
const caretaker=wing(rect(38.0,-53.8,47.8,-36.1),18.216,{pitch:3.4,width:1.3,step:2.4});
const southeast=wing(rect(38.35,-65.5,50.15,-53.8),11.73,{pitch:3.4,width:1.3,step:2.4});
const eastSmallPlant=B(38.0,-53.8,48,-52.4,11.5,14.936);
const northWestPlant=B(-29.4,43.4,-20,49.83,27.1,30.884),northEastPlant=B(39.37,43.1,46.1,49.54,27.1,30.886);
const roundStair=windows(prism(circle([14.5,38.9],5.5,32),BASE,z(13.044)),circle([14.5,38.9],5.5,32),13.044,{first:1.5,pitch:3.3,width:1,step:1.9});
// Main entrance: meeting hall suspended on six piers above granite stairs.
// Its curved red/green patinated roof is a single extruded cross-section.
const entrancePlan=rect(-57.5,-51.4,-20.4,-37.2);
let entrance=prism(entrancePlan,z(8.7),z(21.35));
const diamonds=[];for(let x=-55;x<-22;x+=3.8)for(let h=11.4;h<20;h+=4.2)diamonds.push(Manifold.hull([[x,-51.65,z(h-1.35)],[x+1.1,-51.65,z(h)],[x,-51.65,z(h+1.35)],[x-1.1,-51.65,z(h)],[x,-51.1,z(h-1.35)],[x+1.1,-51.1,z(h)],[x,-51.1,z(h+1.35)],[x-1.1,-51.1,z(h)]]));entrance=entrance.subtract(union(diamonds));
const entranceRoof=profileAlongY([[-51.4,z(21.3)],[-37.2,z(21.3)],[-37.2,z(21.5)],[-39.5,z(23.0)],[-42.5,z(23.75)],[-46,z(23.85)],[-49,z(23.0)],[-51.4,z(21.5)]],20.4,57.5).rotate([0,0,90]);
// Curved glazed bow to Coolsingel, measured in ortho and AHN.
const bowPlan=[[-57.5,-51.4],[-60.6,-50.2],[-61.38,-44.32],[-60.59,-38.48],[-57.5,-37.2]];
const bow=windows(prism(bowPlan,z(8.7),z(21.306)),bowPlan,21.306,{first:10.3,pitch:12,height:9,width:1.2,step:2.2});
const piers=Array.from({length:6},(_,i)=>B(-56.7+i*6.7,-51.4,-55.4+i*6.7,-50.1,GROUND-1,9.0));
const entranceBack=B(-57.5,-39,-20.4,-37.0,GROUND-1,9.0);
const stairSteps=[];for(let i=0;i<8;i++)stairSteps.push(B(-55,-59+i*.95,-28,-58+i*.95,GROUND-1,GROUND+(i+1)*.54));
// Square green bell/clock tower: gross silhouette preserved, open bell frame
// simplified to a solid 1:1000-safe cap with .3m blind horizontal detail.
const clock=B(-26.37,-59.51,-23.0,-56.17,GROUND-1,41.55).subtract(B(-26.8,-59.7,-22.5,-58.95,38.4,40.6));
const bellCap=B(-26.7,-59.8,-22.7,-55.9,41.45,42.397),clockStair=wing(rect(-26.4,-56.2,-22.8,-51.3),19.854,{first:1.5,pitch:3.4,width:1,step:2.2});
const entryGlass=wing([[-23.43,-54.4],[-22.97,-59.51],[-17.0,-67],[-15.7,-57.05],[-20.4,-56.3],[-21.93,-52.44]],4.68,{first:1.1,pitch:4,height:2.6,width:1.2,step:2.4});
const body=union([hall,tower,towerPlant,towerPlantHead,west,north,east,westInner,westLower,westStair,courtCanopy,hangingBridge,northAnnex,eastAnnex,southAnnex,caretaker,southeast,eastSmallPlant,northWestPlant,northEastPlant,roundStair,entrance,entranceRoof,bow,...piers,entranceBack,...stairSteps,clock,bellCap,clockStair,entryGlass]);
// Fill only hidden enclosed niches created at overlapping structural joints.
const solid=Manifold.compose(body.decompose().filter(s=>s.volume()>0));
await writeLandmark({slug,base:BASE,nodes:[['building:beurs-wtc-toren-en-oude-beurs',solid]],catalog:{name:'Beurs World Trade Center',origin:ORIGIN,xAxis:[.951,.309],groundOffsetMetres:0,groundHeight:43.82831,groundSamplePoints:[[-71.16,-41.04],[-55.9,73.85]],replacesBuildings:['NL.IMBAG.Pand.0599100000617974'],description:'Ovale groene WTC-toren met de volledige oude Beurs: gebogen hal, drie kantoorvleugels, lichtcourt, hoofdentree, trappen en kloktoren; bovenbouwen uit benoemde vlakken en bouwdelen.',realWorld:{groundNapM:GROUND,towerRoofNapM:87.476,towerPlantNapM:93.546,towerPlantHeadNapM:93.884,clockNapM:42.397,officeRoofsNapM:[27.417,27.433,23.857,20.192],hallRidgeNapM:17.19,entryRidgeNapM:23.85,estimates:['Torenlens met twee gemeten randbogen vereenvoudigd met Beziercurven; circa 0.5m contourafwijking','Gevelramen, kozijnritme, traphoogten en zes entreezuilen uit schuine fotos; nissen .3m diep, minimaal .9m brede zichtbare delen','De vergaderzaal heeft een gekromde kap met gemeten kruin en geschatte boog tussen de dakranden','Bellstoel als gesloten kap; fijne klokplaat, vlaggen en ornamenten kleiner dan .9m niet apart','Dakinstallaties samengevoegd tot de gemeten kernen; haldak als één dwarsprofiel, onzichtbaar halinterieur massief']},sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/513765 (RCE, Beurs en Kamer van Koophandel)','https://groosman.com/beurs-wtc/ (architect)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000617974 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Rotterdam_-_World_Trade_Center.jpg (Fred Romero CC BY2.0)','https://commons.wikimedia.org/wiki/File:Beurs-World_Trade_Center.jpg (Edison McCullen CC BY-SA4.0)']}});
