// Stadhuis Delft: benoemde vleugels, schilddakvlakken, binnenhof en vierkante toren.
// BAG 0503100000014169, AHN DSM/DTM 0,5 m, 3D BAG LoD2.2 en schuine bronfoto's.
// Vast maatstelsel in meters; geen rasterhoogtelagen.
import {Manifold,prism,box,hull,ring3,rect,hipRoof,union,writeLandmark} from './efteling-kit.mjs';
const O=[84372.0517,447509.6131],A=[.86776545,.49697396],G=1.3,BASE=-.6,at=n=>n-G;
const FOOT=[[-14.64,6.03],[-14.64,3.69],[-14.34,3.69],[-14.31,.89],[-14.51,-13.09],[14.14,-13.13],[14.14,-12.84],[14.74,-12.84],[14.74,-11.76],[14.18,-11.76],[14.22,-8.84],[14.74,-8.84],[14.74,-7.78],[14.2,-7.78],[14.15,-4.82],[14.49,-4.82],[14.49,-4.66],[14.9,-4.66],[14.9,-3.6],[14.35,-3.6],[14.36,-1.32],[14.36,1.32],[14.36,3.68],[14.92,3.68],[14.92,4.71],[14.53,4.73],[14.53,4.87],[14.2,4.87],[14.2,7.83],[14.74,7.83],[14.73,8.9],[14.19,8.9],[14.15,11.81],[14.73,11.81],[14.72,12.88],[14.17,12.9],[14.18,13.15],[-14.34,13.09],[-14.35,6.03]];
const footprint=prism(FOOT,BASE,50);
// Drie schilddakvleugels om het lager overkapte binnenhof, nok NAP +19,5.
const wings=[];
for(const y of [-8.77,8.77])wings.push(union([box(-14.45,y-4.4,BASE,10.2,y+4.4,at(12.65)),hipRoof(24.65,8.8,at(12.63),at(19.5),6.5).translate([-2.125,y,0])]));
wings.push(union([box(6,-13.15,BASE,14.93,13.15,at(12.65)),hipRoof(26.3,8.8,at(12.63),at(19.5),4.4).rotate([0,0,90]).translate([10.1,0,0])]));
const courtyard=hull([...ring3(rect(-.7,-4.5,6.2,4.5),BASE),[-.7,-4.5,at(10.6)],[6.2,-4.5,at(12.4)],[-.7,4.5,at(10.6)],[6.2,4.5,at(12.4)]]);
const service=union([box(-14.65,-5.4,BASE,-9.4,5.8,at(5.7)),hipRoof(10.8,5.3,at(5.68),at(7.4),2.4).rotate([0,0,90]).translate([-12,0.2,0])]);
let body=union([...wings,courtyard,service,prism(FOOT,BASE,at(4.54))]).intersect(footprint);
// Renaissancistische dakbalustrade: gesloten stroken van 0,9 m, met blinde paneelverdeling.
const rails=[box(13.25,-13.1,at(12.3),14.2,13.1,at(14.05)),box(-14.3,12.2,at(12.3),14.2,13.15,at(14.05)),box(-14.3,-13.15,at(12.3),14.2,-12.2,at(14.05))];
// Pilasters en horizontale kroonlijsten zijn versmolten met de gevel, geen losse delen.
const trim=[];for(const n of[5.75,11.85,12.65])trim.push(box(14.05,-13.15,at(n-.35),14.55,13.15,at(n)),box(-14.4,-13.5,at(n-.35),14.3,-12.85,at(n)),box(-14.4,12.85,at(n-.35),14.3,13.5,at(n)));
for(const y of[-12.3,-8.3,-4.1,4.1,8.3,12.3])trim.push(box(14.1,y-.45,0,14.92,y+.45,at(14.45)));
// Topgevels: twee zijgevels en het gebogen fronton met hoger opzetstuk aan de Markt.
const profile=(top,depth)=>prism(top,0,depth).rotate([90,0,90]);
const fronton=profile([[-4.5,at(12.5)],[-4.5,at(19.1)],[-3.2,at(20.2)],[-1.65,at(20.2)],[-1.65,at(23.1)],[-1,at(24.35)],[1,at(24.35)],[1.65,at(23.1)],[1.65,at(20.2)],[3.2,at(20.2)],[4.5,at(19.1)],[4.5,at(12.5)]],1.15).translate([13.78,0,0]);
const sideGable=profile([[-3.6,at(12.5)],[-3.6,at(17.8)],[-2.3,at(18.4)],[-2.3,at(20.1)],[-1.2,at(20.1)],[-1.2,at(22.53)],[1.2,at(22.53)],[1.2,at(20.1)],[2.3,at(20.1)],[2.3,at(18.4)],[3.6,at(17.8)],[3.6,at(12.5)]],1.1);
const gables=[fronton,sideGable.rotate([0,0,90]).translate([-.1,12.3,0]),sideGable.rotate([0,0,-90]).translate([-.1,-12.3,0])];
// Schoorstenen in vier dakhoeken; posities/hoogtes gemeten op DSM en luchtfoto.
for(const x of[-2.1,7.8])for(const y of[-8.3,8.3])trim.push(box(x-.65,y-.65,at(15),x+.65,y+.65,at(22.52)));
// Dakkapellen op de zichtbare buiten- en binnenzijden van de kappen.
const dormers=[];for(const y of[-10.1,-6.2,-2.1,2.1,6.2,10.1])dormers.push(hull([[12.55,y-.55,at(14.3)],[14.2,y-.55,at(14.3)],[14.2,y+.55,at(14.3)],[12.55,y+.55,at(14.3)],[13.9,y,at(16.7)],[12.55,y,at(16.7)]]));
for(const y of[-12.6,12.6])for(const x of[-7.7,-3.5,4.5,8.7])dormers.push(hull([[x-.55,y-.6,at(14.1)],[x+.55,y-.6,at(14.1)],[x-.55,y+.6,at(14.1)],[x+.55,y+.6,at(14.1)],[x,y-.6,at(16.7)],[x,y+.6,at(16.7)]]));
body=union([body,...rails,...trim,...gables,...dormers]);
const cuts=[];for(const y of[-10.3,-6.25,-2.15,2.15,6.25,10.3])for(const z of[1.35,6.2])cuts.push(box(13.8,y-.85,z,15.5,y+.85,z+3.1));
for(const sign of[-1,1])for(const x of[-11.5,-7.5,-3.5,.5,4.5,8.5])for(const z of[1.35,6.2])cuts.push(box(x-.85,sign<0?-14:-13.4,z,x+.85,sign<0?-12.75:-12.85,z+3.1).translate([0,sign<0?0:26.25,0]));
// Portaal en balkon met een gesloten dragende kap; nis blijft blind.
cuts.push(box(14,-.9,.1,16,.9,3.4),box(14,-.9,6.25,16,.9,9.4));
body=body.subtract(union(cuts));
body=union([body,hull([[14,-1.8,4.8],[14,1.8,4.8],[15.5,-1.8,6.3],[15.5,1.8,6.3],[14,-1.8,6.3],[14,1.8,6.3]]),box(14,-1.8,6.1,15.5,1.8,6.9)]);
// Het Steen: vierkant onderlichaam, natuurstenen klokkengeleding, tentdak en vier klokfrontons.
const TC=[-5.45,.15],square=(half,z)=>ring3(rect(TC[0]-half,TC[1]-half,TC[0]+half,TC[1]+half),at(z));
let tower=union([box(-10.45,-4.85,BASE,-.45,5.15,at(25.12)),hull([...square(5.25,24.45),...square(4.7,25.12)]),box(-10.1,-4.5,at(25.1),-.8,4.8,at(33.85)),hull([...square(4.65,33.25),...square(5.15,33.85)]),hull([...square(4.65,33.8),[TC[0],TC[1],at(41.15)]]),Manifold.cylinder(.9,.46,.46,8).translate([TC[0],TC[1],at(40.95)])]);
const towerCuts=[];for(const deg of[0,90,180,270]){
 for(const lateral of[-2.7,0,2.7])towerCuts.push(profile([[lateral-.65,at(26.1)],[lateral+.65,at(26.1)],[lateral+.65,at(31.1)],[lateral,at(32.25)],[lateral-.65,at(31.1)]],2).translate([4.15,0,0]).rotate([0,0,deg]).translate([...TC,0]));
 const clock=profile([[-1.65,at(34.5)],[1.65,at(34.5)],[1.65,at(37.4)],[0,at(38.6)],[-1.65,at(37.4)]],1).translate([2.9,0,0]).rotate([0,0,deg]).translate([...TC,0]);tower=union([tower,clock]);
 towerCuts.push(Manifold.cylinder(.6,1.0,1.0,24).rotate([0,90,0]).translate([3.45,0,at(36.25)]).rotate([0,0,deg]).translate([...TC,0]));
}
tower=tower.subtract(union(towerCuts));
// Achterste traptoren tegen Het Steen, uit BAG en AHN.
const stairTower=union([box(-13,-1.2,BASE,-9.3,2.7,at(24.6)),hipRoof(3.7,3.9,at(24.58),at(25.72),1.1).translate([-11.15,.75,0])]);
const entranceSteps=union(Array.from({length:5},(_,k)=>box(14.25,-1.8,BASE,17.5-k*.55,1.8,.2*(k+1)))); const all=union([body,tower,stairTower,entranceSteps]);if(all.status()!=='NoError'||all.decompose().length!==1)throw Error(JSON.stringify({status:all.status(),parts:all.decompose().map(s=>s.boundingBox())}));
await writeLandmark({slug:'stadhuis-delft',base:BASE,nodes:[['building:stadhuis',all]],catalog:{name:'Stadhuis Delft',origin:O,xAxis:A,groundOffsetMetres:-.3,groundSamplePoints:[[17,-9],[20,0],[17,9]],replacesBuildings:['NL.IMBAG.Pand.0503100000014169'],description:'Volledig BAG-pand met drie schilddakvleugels, lager overkapt binnenhof, Het Steen met vierkant tentdak en vier klokfrontons, traptoren, dakbalustrade, pilasters, fronton, zijtopgevels, schoorstenen en dakkapellen. Dakvlakken en bouwdelen; geen hoogteplakken. z=0 NAP +1,3 m, +X naar de Markt, RD 29,8 graden; verborgen voet -0,6 m.',realWorld:{groundNapM:G,wingEaveNapM:12.65,wingRidgeNapM:19.5,towerCollarNapM:25.12,towerEaveNapM:33.85,towerRoofNapM:41.15,finialNapM:41.85,sideGableNapM:22.53},sources:['PDOK BAG/BGT 0503100000014169 EPSG:28992, 11 oktober 2026','PDOK AHN DSM/DTM 0,5 m via WCS','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0503100000014169','https://monumentenregister.cultureelerfgoed.nl/monumenten/11901','https://www.indelft.nl/nl/locaties/1181195682/stadhuis-oranje-route','https://commons.wikimedia.org/wiki/Category:Stadhuis_Delft']}});





