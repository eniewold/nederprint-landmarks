// Stadhuis met Vleeshal en naoorlogse achterbouw. BAG, AHN-DSM/DTM en
// schuine RCE/Commons-foto's; benoemde muren, kappen, geledingen en nissen.
import {box,prism,circle,spire,dome,hull,ring3,gableRoof,hipRoof,place,union,writeLandmark} from './efteling-kit.mjs';
const slug='stadhuis-middelburg',base=-.8,ground=4.33,origin=[31675,391496],xAxis=[.929,.37];
const footprint=[[-3.4,34.13],[-3.93,33.74],[-3.36,32.79],[-2.39,16.82],[-9.33,16.03],[-9.81,18.21],[-20.55,17.43],[-20.78,-21.07],[9.63,-21.04],[12.7,-22.57],[13.9,-21.23],[13.86,-19.55],[12.05,-18.36],[10.09,.29],[8.38,17.23],[7.48,34.5],[7.06,34.83],[-2.95,34.01]];
const pointed=(w,z,h)=>[[-w/2,z],[w/2,z],[w/2,z+h*.62],[0,z+h],[-w/2,z+h*.62]];
const nx=(x,y,z,w,h)=>prism(pointed(w,z,h),x-.35,x+.65).rotate([90,0,90]).translate([0,y,0]);
const ny=(x,y,z,w,h)=>prism(pointed(w,z,h),-.65,.35).rotate([90,0,0]).translate([x,y,0]);
const cuts=[];
for(const x of [-19.1,-16.1,-13.1,-9.9,-6.7,-3.5,-.3,2.9,6.1,9.3])for(const z of [1.1,6.55])cuts.push(ny(x,-21.05,z,1.9,z<2?3.25:5.0));
for(const x of [-20.7,9.9])for(const y of [-17,-11,-5,1,7,13])cuts.push(nx(x,y,6.45,2.0,4.8));
const innerCourt=box(-10.1,-4.9,base-1,-3.15,-.35,60);
const parts=[prism(footprint,base,14.05).subtract(innerCourt).subtract(union(cuts))];
// Vleeshal, 38 m lange kap; dwarsprofiel rechtstreeks uit twee AHN-vlakken.
parts.push(box(-20.7,-21,13.98,-10.25,17.65,14.74),place(gableRoof(38.8,10.5,14.69,23.55),{at:[-15.48,-1.7,0],deg:90}));
// Marktzaal dwarskap. De lagere achterbouw vernauwt naar de Noordstraat.
parts.push(box(-10.3,-21.05,13.98,10.0,-11.6,15.24),place(gableRoof(20.5,9.5,15.19,22.47),{at:[-.1,-16.3,0]}));
const rearPoly=[[-3.8,-11.8],[10.05,-11.8],[8.4,17.2],[7.48,34.5],[-3.4,34.13],[-2.39,16.82]];
const rearRoof=place(gableRoof(46.8,13.5,12.55,18.12),{at:[3.4,11.2,0],deg:90}).intersect(prism(rearPoly,base,70));parts.push(rearRoof);
// Noordelijke nissen en kleine topgevel van de achterbouw.
parts.push(place(gableRoof(11.0,.9,13.1,21.65),{at:[2.05,34.15,0],deg:0}));
// Vleeshal topgevels aan Markt en achterzijde, met steunende pinakels.
for(const y of [-21.2,17.75]){
 let g=place(gableRoof(1.05,10.8,14.55,25.6),{at:[-15.45,y,0],deg:90});
 g=g.subtract(ny(-15.45,y,16.0,2.2,5.6));parts.push(g);
 for(const [x,z] of [[-20.55,20.4],[-18.5,23.8],[-16.15,26.82],[-14.75,26.82],[-12.35,23.8],[-10.4,20.4]])parts.push(box(x-.5,y-.5,14.2,x+.5,y+.5,z),spire([x,y],.75,z-.02,z+1.7,4,Math.PI/4));
}
// Gootbalustrade als .95 m dikke band met blind maaswerk.
let rail=box(-20.8,-21.55,14.8,10.3,-20.6,16.0);const rc=[];
for(let x=-19.8;x<9.5;x+=1.5)rc.push(ny(x,-21.55,15.0,1.0,.7));parts.push(rail.subtract(union(rc)));
// Koertoren rechts op de hoek; volle achtkante schacht en twee galerijbanden.
const corner=[11.8,-20.55];parts.push(prism(circle(corner,2.12,8,Math.PI/8),base,17.0),prism(circle(corner,2.55,8,Math.PI/8),6.2,7.3),prism(circle(corner,2.3,8,Math.PI/8),15.5,16.7),prism(circle(corner,1.46,8,Math.PI/8),16.6,22.5),spire(corner,1.65,22.45,25.15,8));
// De kloktoren heeft een vierkante onderbouw en een achtkante lantaarn.
const c=[-2.44,-6.84];let lower=box(c[0]-3.48,c[1]-3.68,base,c[0]+3.48,c[1]+3.68,30.9);
const lc=[];for(const deg of [0,90,180,270])lc.push(place(prism(pointed(2.35,22.5,6.8),3.15,3.8).rotate([90,0,90]),{at:[...c,0],deg}));
parts.push(lower.subtract(union(lc)),box(c[0]-3.6,c[1]-3.8,30.6,c[0]+3.6,c[1]+3.8,31.7));
let lantern=prism(circle(c,2.82,8,Math.PI/8),31.5,44.0);const ln=[];
for(let k=0;k<8;k++)ln.push(place(prism(pointed(1.7,33.9,8.2),2.36,3.4).rotate([90,0,90]),{at:[...c,0],deg:k*45}));
parts.push(lantern.subtract(union(ln)),prism(circle(c,3.05,8,Math.PI/8),43.7,44.65),spire(c,3.03,44.6,48.4,8,Math.PI/8),dome(c,[[.8,47.9],[1.2,48.35],[1.5,49.3],[1.1,50.2],[.55,50.65]],24),spire(c,.55,50.6,52.05,8));
// Wijzerplaten als ondiepe cirkelnissen; metselwerk draagt vier pinakels.
for(const deg of [0,90,180,270]){
 const face=place(prism(circle([0,30.0],1.18,32),3.29,3.9).rotate([90,0,90]),{at:[...c,0],deg});
 const pin=[c[0]+3.07*Math.cos(deg*Math.PI/180+Math.PI/4),c[1]+3.07*Math.sin(deg*Math.PI/180+Math.PI/4)];
 parts.push(prism(circle(pin,.57,8),27.7,37.9),spire(pin,.8,37.85,41.5,8));lc.push(face);
}
// Kapelletjes in drie rijen op de Marktzaal en Vleeshal. Draagkern tot dak.
for(const x of [-8,-4.8,-1.6,1.6,4.8,8])for(const [y,z] of [[-20.05,16.5],[-18.75,18.5],[-17.3,20.6]])parts.push(box(x-.45,y-.5,15,x+.45,y+.5,z+.75),place(gableRoof(1.05,1.1,z+.7,z+1.6),{at:[x,y,0],deg:90}));
for(const x of [-19.4,-11.6])for(const y of [-12,-5,2,9])for(const z of [17.0,19.3])parts.push(box(x-.5,y-.45,14.5,x+.5,y+.45,z+.7),place(gableRoof(1.05,1.1,z+.65,z+1.65),{at:[x,y,0]}));
// Hardstenen bordes met volle trapkern en twee steile zijvoluten.
parts.push(box(-1.5,-23.15,base,2.5,-20.7,1.8));
for(const side of [-1,1])parts.push(hull([[.5+side*1.5,-23.1,base],[.5+side*1.5,-20.7,base],[.5+side*3.7,-23.1,base],[.5+side*3.7,-20.7,base],[.5+side*1.5,-23.1,1.7],[.5+side*1.5,-20.7,1.7],[.5+side*3.7,-23.1,.1],[.5+side*3.7,-20.7,.1]]));
// De achterbouw en beide lange zijgevels krijgen hun eigen vensterritme;
// snijd deze na het samenvoegen zodat een aansluitende wand de nis niet vult.
const backWindows=[];
for(const y of [-7,-1,5,11,17,23,29])for(const z of [1.6,7.2])backWindows.push(nx(9.98-(y+12)*.054,y,z,1.65,3.8));
for(const x of [-.45,3.5,6.5])for(const z of [1.8,7.4])backWindows.push(ny(x,34.3,z,1.35,3.3));
for(const y of [-14,-8,-2,4,10])backWindows.push(nx(-20.7,y,1.8,1.7,3.3));
for(const y of [0,8,16,24,30])for(const x of [.0,6.5])parts.push(box(x-.5,y-.6,13.5,x+.5,y+.6,16.7),place(gableRoof(1.2,1.35,16.65,17.9),{at:[x,y,0]}));
const shells=union(parts).subtract(union([...lc.slice(4),...backWindows])).decompose(),outer=shells.filter(s=>s.volume()>0);
// Afgedekte nissen in aansluitende bouwdelen worden geen gesloten holtes.
// Vul de drie kleine binnenholtes (samen <17m³); behoud één buitenhuid.
if(outer.length!==1||shells.some(s=>s.volume() < -8))throw Error('Los bouwdeel of binnenholte');
await writeLandmark({slug,base,nodes:[['building:stadhuis, Vleeshal, kloktoren en achtervleugel',outer[0]]],catalog:{name:'Stadhuis (Middelburg)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[-15,-25],[5,-25],[15,0],[12,29]],replacesBuildings:['NL.IMBAG.Pand.0687100000029116'],description:'Marktgevel langs +X, Noordstraat langs +Y; Vleeshal, dwarszaal, lagere achtervleugel en achtkante kloktoren met bekroning, opgebouwd uit muren en dakvlakken. Voet .8m onder straat.',realWorld:{groundNapM:ground,vleeshalRidgeM:23.55,frontRidgeM:22.47,rearRidgeM:18.12,towerTopM:52.05,schattingen:['torenbekroning, pinakels, topgevels, kapelletjes, koertoren en vensters naar fotos vereenvoudigd; smalle metalen top/windvaan weggelaten','achterbouw en kleine binnenplaats op AHN/ortho vereenvoudigd binnen BAG-contour; goten en raamroeden onder .9m weggelaten','galerijen en maaswerk blinde nissen, bordes volle draagkern voor 1:1000']},sources:['PDOK BAG 0687100000029116, orthoHR, AHN DSM/DTM .5m bbox 31590,391400,31760,391610; 2026-10-09','https://monumentenregister.cultureelerfgoed.nl/monumenten/29284','https://www.openmonumentendag.nl/wp-content/uploads/2019/01/Stadhuis-van-Middelburg-informatieblad.pdf','https://commons.wikimedia.org/wiki/File:2023_Stadhuis_Middelburg_(1).jpg','https://commons.wikimedia.org/wiki/File:2023_Stadhuis_Middelburg_(2).jpg','https://commons.wikimedia.org/wiki/File:Achtergevel_en_gevel_Noordstraat_-_Middelburg_-_20154835_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_Bodenplaats_in_de_richting_van_het_Stadhuis_-_Middelburg_-_20154212_-_RCE.jpg']}});
