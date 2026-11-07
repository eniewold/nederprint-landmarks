import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X over de nok richting koor; +Y noord. Maten in meters boven maaiveld.
// BAG 1891100001630065; AHN DSM 0,5m en 3DBAG 2.2. Maaiveld NAP +2,72m.
const B=-0.6, origin=[192053,590085], axis=[0.9767,0.2145];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,45);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zuidbeuk: 3D BAG twee vlakken van 55°, nok +13,2 en goten +8,2 m.
const parts=[roofed(rect(-10.56,-7.18,13.2,-.28),[[0,1.43,18.47],[0,-1.43,7.89]])];
// Romaanse noordbeuk met halfronde apsis; de kap eindigt in een half kegelvlak.
parts.push(roofed(rect(-5.9,-.42,12.95,7.05),[[0,1.42,8.81],[0,-1.42,17.45]]));
let arc=[]; for(let k=0;k<=12;k++){let a=-Math.PI/2+Math.PI*k/12;arc.push([12.95+3.32*Math.cos(a),3.38+3.32*Math.sin(a)])};
const apse=[[12.95,.06],...arc.slice(1,-1),[12.95,6.70]];
parts.push(prism(apse,B,8.12));
parts.push(hull([...apse.map(([x,y])=>[x,y,8.1]),[12.95,3.38,12.96]]));
for(const x of [-10.56,12.3]) parts.push(box(x,-4.2,x+.9,-3.3,12.55,14.0));
// Massieve westtoren, dak evenwijdig aan de beuken, en tuitgevels op beide uiteinden.
parts.push(roofed(rect(-12.2,.55,-5.15,7.75),[[0,1.38,19.3],[0,-1.38,29.87]]));
for(const x of [-12.2,-6.05]) parts.push(box(x,3.6,x+.9,4.5,23.7,25.4));
// Traptoren in de oksel, op de BAG-contour; lage aansluitende kap.
parts.push(roofed([[-10.72,.55],[-10.58,-1.1],[-8.6,-1.8],[-7.2,-.3],[-5.9,.5]],[[0,.72,12.7],[0,-.72,12.6],[-.6,0,7.8]]));
let church=union(parts);
// Nissen als vereenvoudigde spits- en rondbogen; dak en wanden zijn gesloten.
const niche=(x,y,w,z0,z1,dir='y',round=false)=>{let shoulder=z1-w*(round?.5:.8);let pts=[[-w/2,0,z0],[w/2,0,z0],[-w/2,0,shoulder],[w/2,0,shoulder],[0,0,z1],[-w/2,.75,z0],[w/2,.75,z0],[-w/2,.75,shoulder],[w/2,.75,shoulder],[0,.75,z1]];let s=hull(pts);if(dir==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
// Zuidgevel: drie grote vensters, dichtgezet portaal en klein venster westelijk.
for(const x of [-2.6,3.0,8.65])cuts.push(niche(x,-7.52,1.65,2.6,7.35));
cuts.push(niche(-8,-7.52,1.5,.05,5.9),niche(13.5,-3.8,2.05,2.7,7.35,'x'));
// Noordmuur toont romaanse blindbogen, kleine vensters en geprofileerde entree.
for(const x of [-3.6,.2,4.0,7.8])cuts.push(niche(x,6.70,2.0,1.2,5.65,'y',true));
cuts.push(niche(-4.6,6.7,1.35,0,3.8,'y',true),niche(9.6,6.7,1.2,3.7,7.2,'y',true));
// Vensters en dichtgemetselde nissen in de ronding van het koor.
cuts.push(niche(16.56,3.38,1.05,2.7,5.2,'x',true));
// Klankopeningen en entree op westzijde toren, nissen op zijden.
for(const y of [2.5,5.1])cuts.push(niche(-11.84,y,1.05,16.4,19.8,'x',true),niche(-4.8,y,1.05,16.4,19.8,'x',true));
for(const x of [-10.65,-8.0])cuts.push(niche(x,.2,1.05,16.4,19.8,'y',true),niche(x,7.4,1.05,16.4,19.8,'y',true));
cuts.push(niche(-11.84,4.0,1.25,0,3.2,'x',true));
church=church.subtract(union(cuts));
await writeLandmark({slug:'alexanderkerk-rinsumageast',base:B,nodes:[['building:kerk',church]],catalog:{name:'Alexanderkerk Rinsumageast',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-14,-5],[-14,9],[4,-9],[14,-9],[18,3],[11,9]],replacesBuildings:['NL.IMBAG.Pand.1891100001630065'],description:'Dubbelbeukige middeleeuwse kerk met twee langsdaken, rondgesloten romaanse noordbeuk, zadeldaktoren, traptoren en gevelnissen.',realWorld:{groundNapM:2.72,naveRidgeM:13.2,towerRidgeM:24.5,towerGablesM:25.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1891100001630065','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/11691','https://commons.wikimedia.org/wiki/Category:Alexanderkerk,_Rinsumageast','https://www.dbnl.org/tekst/berg229noor03_01/berg229noor03_01_0013.php']}});

