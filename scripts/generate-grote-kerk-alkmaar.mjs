// Grote Kerk Alkmaar, opgebouwd uit benoemde bouwdelen en rechte dakvlakken.
// BAG 0361100000015852 (PDOK, CC0), AHN DSM/DTM 0,5 m (CC0),
// 3D BAG LoD2.2 (TU Delft/3DGI, CC BY 4.0), geraadpleegd 10-10-2026.
// Nokken en goten gemeten in het gebouwstelsel, geen gestapelde hoogtelagen.
// Gevelnissen, pinakels en dakruiterprofiel vereenvoudigd naar foto's.
import { Manifold, prism, rect, box, union, hull, circle, spire, writeLandmark, downFaces } from './efteling-kit.mjs';

const SLUG = 'grote-kerk-alkmaar';
const ORIGIN = [111453.36, 516309.45];
const ANGLE = -13.92 * Math.PI / 180;
const GROUND_NAP = 1.8;
const BASE = -.5;
const nap = z => z - GROUND_NAP;
const cut = (s,a,b,c) => { const n=Math.hypot(a,b,1); return s.trimByPlane([a/n,b/n,-1/n],-c/n); };
const roofed = (poly,planes) => planes.reduce((s,[a,b,c])=>cut(s,a,b,nap(c)),prism(poly,BASE,70));
const ridgeY = (y,z,t) => [[0,t,z-t*y],[0,-t,z+t*y]];
const ridgeX = (x,z,t) => [[t,0,z-t*x],[-t,0,z+t*x]];
const pts=[];
// Middenschip en koor: dezelfde hoofdnok, verschillende gemeten hellingen.
const NAVE = {west:-49.47,east:-4.4,south:-8.06,north:7.57,ridgeY:-.42,ridge:38.02,slope:1.79};
pts.push(roofed(rect(NAVE.west,NAVE.south,NAVE.east,NAVE.north),ridgeY(NAVE.ridgeY,NAVE.ridge,NAVE.slope)));
const CHOIR = {east:25.35,south:-7.95,north:7.35,ridge:37.77,slope:1.61};
pts.push(roofed(rect(-4.4,CHOIR.south,CHOIR.east,CHOIR.north),ridgeY(-.5,CHOIR.ridge,CHOIR.slope)));
// Driezijdige koorsluiting: vlakke polygonale schilden, geen rond kegeldak.
const apse=[[25.1,-7.95],[29.12,-5.08],[30.3,-.5],[29.1,4.92],[25.1,7.35]];
pts.push(roofed(apse,[[ -1.47,0,75.03],[-1.22,.97,65.02],[-1.18,-.96,62.73],...ridgeY(-.5,37.77,1.61)]));
// Dwarsschip met vlakke topgevels op beide uiteinden.
const TRANSEPT = {x0:-11.42,x1:2.43,y0:-28.65,y1:27.94,ridgeX:-4.43,ridge:37.86,slope:1.67};
pts.push(roofed(rect(TRANSEPT.x0,TRANSEPT.y0,TRANSEPT.x1,TRANSEPT.y1),ridgeX(TRANSEPT.ridgeX,TRANSEPT.ridge,TRANSEPT.slope)));
// Zijbeuken: vijf dwarse kappen aan weerszijden, elk met een schild buiten.
const BAYS=[-45.65,-39.38,-33.09,-26.75,-20.42];
for(const [i,x] of BAYS.entries()) for(const north of [false,true]) {
 const half=3.2,y0=north?7.3:-18.7,y1=north?17.7:-7.7;
 const planes=[...ridgeX(x,19.16,1.61), north?[0,-1.63,42.05]:[0,1.59,42.09]];
 pts.push(roofed(rect(x-half,y0,x+half,y1),planes));
}
pts.push(roofed(rect(-17.26,-18.65,-11.42,-7.7),[[.946,0,30.5]]));
pts.push(roofed(rect(-17.26,7.3,-11.42,17.65),[[.968,0,30.84]]));
// Kooromgang: drie rechte delen en vijfzijdige sluiting met eigen lessenaarsvlakken.
pts.push(roofed(rect(2.43,-15.0,26.8,-7.7),[[0,.962,27.36]]));
pts.push(roofed(rect(2.43,7.1,26.8,13.9),[[0,-.90,26.08]]));
const ambulatory=[[25,-15],[32.7,-11.0],[37,-4.1],[37,3.8],[32.6,10.4],[26.5,13.8],[25.1,7.35],[29.1,4.92],[30.3,-.5],[29.12,-5.08],[25.1,-7.95]];
pts.push(roofed(ambulatory,[[-.50,.745,38.20],[-.76,.435,43.48],[-.866,0,45.57],[-.742,-.473,42.76],[-.445,-.757,35.94]]));
// Sacristie/consistorie en portalen. Alle bijgebouwen van het BAG-pand blijven aanwezig.
pts.push(roofed(rect(8.0,-22.2,26.4,-15),ridgeY(-18.75,9.55,.97)));
pts.push(roofed(rect(2.42,-28.6,8.12,-14.3),[[-1.065,0,17.99]]));
pts.push(roofed(rect(-29.75,-26.1,-23.45,-18.65),ridgeY(-23.75,8.37,1.07)));
pts.push(roofed(rect(-23.45,-28.65,-11.42,-18.6),ridgeY(-25.6,12.65,1.30)));
pts.push(roofed(rect(2.43,13.9,8.2,18.6),ridgeY(15.7,12.63,1.0)));
pts.push(roofed(rect(-41.35,17.65,-37.68,21.01),ridgeY(19.32,7.3,1.1)));
pts.push(roofed(rect(-53.75,-3,-49.4,2.12),[[1.21,0,78.78]]));
pts.push(roofed(rect(37,-2.53,40.6,1.65),[[-1.85,0,80.20]]));
// Kleine dakkapellen op de lage zuidelijke vleugels, uit de schuine foto's geschat.
for(const x of [-20.3,-15.4])pts.push(roofed(rect(x-.75,-28.1,x+.75,-26.65),[[0,.6,28.1]]));
for(const x of [14.2,21.4])pts.push(roofed(rect(x-.72,-21.95,x+.72,-20.35),[[0,.6,22.7]]));
// Steunberen als schuine prisma's; op elk relevant geveluiteinde een pinakel.
const buttress=(x,y,deg,height,depth=1.45)=>hull([[-.53,1.1,BASE],[.53,1.1,BASE],[-.53,-depth,BASE],[.53,-depth,BASE],[-.53,1.1,height],[.53,1.1,height],[-.53,-depth,height-2.25],[.53,-depth,height-2.25]]).rotate([0,0,deg]).translate([x,y,0]);
for(const north of [false,true])for(const x of [-49.0,-42.65,-36.3,-30,-23.65,-17.35]){
 const y=north?17.7:-18.68;
 pts.push(buttress(x,y,north?180:0,nap(11.9)));
}
for(const y of [-28.64,27.94])for(const x of [-10.95,1.96]){
 pts.push(buttress(x,y,y>0?180:0,nap(25.9)));
 pts.push(box(x-.53,y-.53,BASE,x+.53,y+.53,nap(29.75)),spire([x,y],.74,nap(29.75),nap(32.25),4,Math.PI/4));
}
for(const [x,y,deg]of [[33.05,-10.7,45],[36.9,-4.25,75],[36.9,3.5,105],[33,10.3,135],[26.7,13.8,180], [8.1,13.9,180],[14.2,13.9,180],[20.3,13.9,180]]) pts.push(buttress(x,y,deg,nap(12.0),1.4));
for(const y of [-18.15,17.17])pts.push(buttress(-49.47,y,270,nap(18.0),1.4));
// Dakruiter op de viering: achthoekige onderbouw, klokkenkamer en spits.
const TOWER = {at:[-4.5,-.4],shaft:38.1,lantern:42.1,shoulder:43.8,tip:49.6};
const oct= (r,z0,z1)=>prism(circle(TOWER.at,r,8,Math.PI/8),nap(z0),nap(z1));
pts.push(oct(1.68,26.5,TOWER.lantern),oct(1.32,TOWER.lantern,TOWER.shoulder),spire(TOWER.at,1.32,nap(TOWER.shoulder),nap(TOWER.tip),8,Math.PI/8));
// Afgeronde hoekpijlers van de westelijke topgevel, zichtbaar op de Begijnenstraatfoto.
for(const y of [-7.8,7.3])pts.push(prism(circle([-49.35,y],1.05,12),BASE,nap(28.6)),spire([-49.35,y],1.05,nap(28.6),nap(29.8),12,0));
// Twee traptorens tegen de transeptgevels, met achthoekige kap.
for(const [x,y,z]of [[7.78,17.93,31.1],[7.8,-27.1,28.6]]){
 pts.push(prism(circle([x,y],1.5,8),BASE,nap(z-3)),spire([x,y],1.5,nap(z-3),nap(z),8,0));
}
// Blinde spitsboognissen: 0,35 m diep, minimaal 50 graden onder de top.
const niche=(x,y,deg,w,z0,z1)=>Manifold.extrude([[[ -w/2,nap(z0)],[w/2,nap(z0)],[w/2,nap(z1)],[0,nap(z1)+w*.72],[-w/2,nap(z1)]]],.55).rotate([90,0,0]).translate([0,.35,0]).rotate([0,0,deg]).translate([x,y,0]);
const cuts=[];
for(const north of [false,true]) {
 const side=north?180:0;
 for(const x of BAYS)cuts.push(niche(x,north?17.7:-18.7,side,3.8,4.4,9.0));
 for(const x of [-46.0,-39.5,-33,-26.5,-20.1,-13.6,9.4,16.1,22.7])cuts.push(niche(x,north?7.4:-8.02,side,3.6,16.1,21.0));
 for(const x of [9.4,16.1,22.7])cuts.push(niche(x,north?13.9:-15,side,3.4,4.8,10.0));
}
for(const y of [-28.65,27.94]){
 cuts.push(niche(-4.44,y,y>0?180:0,8.2,10.8,21.5));
 cuts.push(niche(-4.44,y,y>0?180:0,4.25,1.8,5.0));
}
for(const y of [-12.8,-.5,12.0])cuts.push(niche(y===-.5?-49.47:-48.85,y,270,y===-.5?7.8:3.4,y===-.5?10.4:3.8,y===-.5?23:9.4));
cuts.push(niche(-53.75,-.45,270,3.7,1.5,5.4),niche(40.57,-.45,90,2.1,2,4.8));
// Vensternissen volgen de vijf vlakken van de kooromgang.
const EAST=[[29.6,-13.1,35],[35.1,-7.65,62],[37,-.5,90],[35.1,7.0,119],[29.8,12.0,148]];
for(const [x,y,d]of EAST)cuts.push(niche(x,y,d,3.5,4.5,9.0));
for(const x of [11.2,16.9,22.7])cuts.push(niche(x,-22.2,0,2.6,2,3.8));
for(const x of [3.7,6.8])cuts.push(niche(x,-28.6,0,1.8,1.1,4.4),niche(x,-28.6,0,1.7,6.4,8.5));
for(let k=0;k<8;k++){const a=(k+1)*Math.PI/4,r=1.68*Math.cos(Math.PI/8);cuts.push(niche(TOWER.at[0]+r*Math.cos(a),TOWER.at[1]+r*Math.sin(a),90+a*180/Math.PI,.9,38.8,40.5));}
const solid=union(pts).subtract(union(cuts));
if(solid.decompose().length!==1)throw new Error('De kerk moet één samenhangend volume zijn.');
console.log('overhang-vlakken',JSON.stringify(downFaces(solid,BASE)));
await writeLandmark({slug:SLUG,nodes:[['building:kerk',solid]],base:BASE,catalog:{
 name:'Grote of Sint-Laurenskerk',origin:ORIGIN,xAxis:[Math.cos(ANGLE),Math.sin(ANGLE)],groundOffsetMetres:-.3,groundHeight:44.3268556,
 groundSamplePoints:[[-55,0],[-30,-24],[30,19],[0,33]],
 replacesBuildings:['NL.IMBAG.Pand.0361100000015852'],
 description:'Oorsprong bij de viering, +X langs de nok naar het oosten (RD -13,92 graden), Z omhoog. Middenschip, koor en dwarsschip uit dakvlakken, vijf dwarse kapeldaken per zijbeuk, kooromgang, alle lagere vleugels en portalen, steunberen, pinakels, twee traptorens en achtkantige dakruiter; nissen en pinakels vereenvoudigd voor 1:1000.',
 realWorld:{groundNapM:GROUND_NAP,naveRidgeNapM:NAVE.ridge,transeptRidgeNapM:TRANSEPT.ridge,towerTipNapM:TOWER.tip,roofAxisDegrees:-13.92,aisleBays:5,minimumFreeStandingM:1.06},
 sources:['https://commons.wikimedia.org/wiki/Category:Sint_Laurenskerk,_Alkmaar (noordwest-, west-, zuidwest- en zuidoostfoto: Txllxt TxllxT, CC BY-SA 4.0, alleen visuele referentie)','https://service.pdok.nl/lv/bag/wfs/v2_0','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0361100000015852','https://nl.wikipedia.org/wiki/Grote_of_Sint-Laurenskerk_(Alkmaar)','https://monumentenregister.cultureelerfgoed.nl/monumenten/7258','https://commons.wikimedia.org/wiki/File:Alkmaar_-_Kerkplein_-_View_on_Transept_%26_Main_Nave_of_Grote_Sint_Laurens_Kerk.jpg (Txllxt TxllxT, CC BY-SA 4.0, alleen visuele referentie)']
}});














