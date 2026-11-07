import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// Sint-Egbertkapel. Lokaal +X langs de nok naar de entree (noordoost); +Y links daarvan.
// Afmetingen in meters; maaiveld uit BAG/AHN NAP +4,36 m. Dakvlakken en nokrichtingen uit 3D BAG LoD2.2.
const B=-0.5, origin=[205978,611415], axis=[0.733114,0.680106];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,40);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const ridgeY=(y,z,t)=>[[0,t,z-t*y],[0,-t,z+t*y]];
const ridgeX=(x,z,t)=>[[t,0,z-t*x],[-t,0,z+t*x]];
const parts=[];
// Kerk, twee kruisende zadeldaken met gescheiden nokken en kilgoten.
parts.push(roofed(rect(-4.55,-2.66,9.29,4.01),ridgeY(.73,9.12,1.28)));
parts.push(roofed(rect(-4.51,-4.0,.50,5.36),ridgeX(-2.0,7.88,1.24)));
// Vijfzijdige koorsluiting; drie schuine schilden komen bij de nok samen.
parts.push(roofed([[-4.42,-1.7],[-6.95,-1.7],[-8.15,-.6],[-8.15,2.0],[-6.95,3.15],[-4.42,3.15]], [...ridgeY(.73,7.75,1.24),[1.24,0,14.6]]));
// Platte sacristie in hoek van de koorsluiting en linker kruisarm.
parts.push(box(-8.5,-6.29,-4.15,-2.30,B,3.53));
// Voorportaal onder eigen zadeldak, een massieve portiek met diepliggende toegang.
parts.push(roofed(rect(9.15,-.89,12.76,2.26),ridgeY(.69,5.40,1.28)));
// Dakruiter met dakvorm. De kwetsbare open stijlen zijn voor 1:1000 gesloten met blinde nissen.
parts.push(box(-2.88,.14,-1.65,1.30,8.55,10.75));
parts.push(hull([[-3.0,.03,10.7],[-1.53,.03,10.7],[-3.0,1.41,10.7],[-1.53,1.41,10.7],[-2.26,.03,11.58],[-2.26,1.41,11.58]]));
// Een kleine schoorsteen, verdikt tot de minimale printmaat.
parts.push(box(6.8,.3,7.72,1.22,8.3,9.55));
let solid=union(parts);
// Rondbogen weergegeven met ondiepe, spits gesloten nissen; kleine ramen per groep zichtbaar.
const niche=(x,y,w,z0,z1,axis='y')=>{const shoulder=z1-w*.55;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,shoulder],[w/2,0,shoulder],[0,0,z1],[-w/2,.7,z0],[w/2,.7,z0],[-w/2,.7,shoulder],[w/2,.7,shoulder],[0,.7,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
const cuts=[];
for(const center of [2.65,6.4]) for(const d of [-.68,0,.68]) {cuts.push(niche(center+d,-3.00,.57,1.75,3.95));cuts.push(niche(center+d,3.65,.57,1.75,3.95))}
for(const y of [-4.35,5.0]) for(const d of [-.82,0,.82]) cuts.push(niche(-2.0+d,y,.65,1.65,d===0?4.48:3.85));
// Portaalopening en de twee hoge rondboogramen in de hoofdgevel.
cuts.push(niche(13.1,.69,1.75,.02,3.35,'x'));
for(const y of [-1.65,3.0])cuts.push(niche(9.64,y,.82,3.3,5.85,'x'));
// Apsis en sacristie: vensters in de blinde achter- en linkerwanden.
for(const y of [-.5,1.65]) cuts.push(niche(-7.80,y,.8,1.7,3.6,'x'));
cuts.push(niche(-6.5,-6.62,1.1,1.2,2.85));
for(const x of [-2.38,-1.98]) cuts.push(niche(x,-.15,.32,9.38,10.56));
solid=solid.subtract(union(cuts));
await writeLandmark({slug:'sint-egbertkapel-schiermonnikoog',base:B,nodes:[['building:kapel',solid]],catalog:{name:'Sint Egbertkapel Schiermonnikoog',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[7,-4],[8,5],[2,-5],[2,6],[-8,-7],[-9,4]],replacesBuildings:['NL.IMBAG.Pand.0088100000137791'],description:'Kruiskapel met twee kruisende zadeldaken, dakruiter, vijfzijdige apsis, sacristie en zadeldakportaal; gevels met vensternissen. Lokale +X naar noordoosten richting entree.',realWorld:{groundNapM:4.364,naveRidgeM:9.12,transeptRidgeM:7.88,dsmTopNapM:16.014},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0088100000137791','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/512350','https://commons.wikimedia.org/wiki/Category:Sint_Egbert_(Schiermonnikoog)','https://www.monumenten.nl/monument/512350']}});
