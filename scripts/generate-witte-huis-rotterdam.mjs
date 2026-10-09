// Per rij volledig gelezen: generate-amsterdam-centraal.mjs en generate-domtoren.mjs.
import {Manifold,box,prism,circle,hull,union,writeLandmark} from './efteling-kit.mjs';
const slug='witte-huis-rotterdam',origin=[93395,437083],angle=18.5,ground=2.8,base=-.4;
const a=angle*Math.PI/180,xAxis=[Math.cos(a),Math.sin(a)],z=n=>n-ground,parts=[],cuts=[];
const outline=[[-9.243,11.392],[-11.144,-9.289],[-9.599,-9.274],[-9.591,-8.116],[-8.247,-7.817],[-8.241,-8.621],[-8.516,-8.623],[-8.51,-8.889],[-5.753,-8.873],[-5.741,-9.215],[-4.431,-9.178],[-4.434,-8.777],[3.194,-8.671],[3.196,-9.073],[4.436,-9.055],[4.433,-8.654],[7.779,-8.613],[7.785,-9.006],[8.354,-9.006],[9.753,-7.566],[9.748,-6.984],[9.346,-6.987],[9.287,-3.729],[9.688,-3.727],[9.671,-2.487],[9.259,-2.487],[9.149,3.55],[9.551,3.553],[9.533,4.793],[9.129,4.78],[9.072,8.047],[9.474,8.05],[9.456,8.625],[8.069,10.091],[7.506,10.142],[7.468,9.744],[4.239,9.991],[4.268,10.393],[3.035,10.489],[3.006,10.087],[0.097,10.312],[0.135,10.71],[-0.544,10.759],[-0.564,10.354],[-3.46,10.585],[-3.422,10.983],[-4.677,11.076],[-4.706,10.675],[-7.931,10.932],[-7.905,11.324]];
const footprint=prism(outline,base,z(46));
parts.push(prism(outline,base,z(33.85)));
// Afgeplat schilddak uit vier doorlopende dakvlakken, geen hoogtelagen.
const roof=hull([...outline.map(p=>[...p,z(33.8)]),...[[ -6.5,-5.1],[5.5,-5.1],[5.35,6.55],[-5.55,6.65]].map(p=>[...p,z(41.8)])]).intersect(footprint);
parts.push(roof);
// Gemeten centrale lift-/trappenopbouw op het uitzichtplatform.
parts.push(prism([[-3.646,2.842],[-3.522,-3.652],[1.727,-3.48],[1.314,3.433]],z(41.7),z(45.6)));
// Westelijke terugliggende vluchttrapgevel: dichte bodem en echte inspringing.
cuts.push(box(-12,-3.4,base,-7.9,5.6,z(29.3)),hull([...[[ -12,-3.4],[-7.9,-3.4],[-7.9,5.6],[-12,5.6]].map(p=>[...p,z(29.25)]),...[[ -12,-3.4],[-11,-3.4],[-11,5.6],[-12,5.6]].map(p=>[...p,z(33.85)])]));
function frontGable(c,w,shoulder,peak,face,bottom=33.65){
 const profile=[[-w/2,z(bottom)],[w/2,z(bottom)],[w/2,z(shoulder)],[0,z(peak)],[-w/2,z(shoulder)]];
 return prism(profile,-.8,.8).rotate([90,0,0]).rotate([0,0,face]).translate([c[0],c[1],0]);
}
parts.push(frontGable([-.8,-8.82],8.0,34.4,39.55,0),frontGable([9.28,.8],8,34.5,39.35,90),frontGable([-1.4,10.48],8.0,34.6,39.7,180));
const groove=(A,B,s,t,lo,hi,depth=.35)=>{const len=Math.hypot(B[0]-A[0],B[1]-A[1]),d=[(B[0]-A[0])/len,(B[1]-A[1])/len],n=[d[1],-d[0]],at=[A[0]+d[0]*(s+t)/2,A[1]+d[1]*(s+t)/2];return box(-depth,-(t-s)/2,z(lo),.7,(t-s)/2,z(hi)).rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI]).translate([...at,0]);};
// Negen gevelreeksen boven de winkelplint; reliefvensters houden de muren heel.
for(const[A,B,count]of[[[-10.2,-8.86],[8.1,-8.61],6],[[9.27,-6.7],[9.07,8],5],[[7.5,10.2],[-8.8,11],6]]){
 const len=Math.hypot(B[0]-A[0],B[1]-A[1]);
 for(let f=0;f<9;f++)for(let k=0;k<count;k++){const s=(k+.5)*len/count;cuts.push(groove(A,B,s-.77,s+.77,6.4+f*3.02,8.55+f*3.02,.37));}
 // Dichte winkel/entree-nissen aan de straat.
 for(let k=0;k<count;k++){const s=(k+.5)*len/count;cuts.push(groove(A,B,s-.9,s+.9,3.25,5.5,.36));}
}
// Ronde hoekerkers met achtkantige steile arkeldaken, dragende voet.
for(const c of[[8.7,-7.45],[8.28,9.05]]){
 const shaft=prism(circle(c,1.62,32),base,z(37.25));parts.push(shaft);
 const lower=circle(c,1.85,8,Math.PI/8),upper=circle(c,1.2,8,Math.PI/8);
 parts.push(hull([...lower.map(p=>[...p,z(37)]),...upper.map(p=>[...p,z(39)])]),hull([...upper.map(p=>[...p,z(38.9)]),[...c,z(45.5)]]));
 for(let f=0;f<10;f++)for(let d=0;d<4;d++){const t=(-90+d*45)*Math.PI/180;const A=[c[0]+1.67*Math.cos(t),c[1]+1.67*Math.sin(t)],B=[A[0]-.95*Math.sin(t),A[1]+.95*Math.cos(t)];cuts.push(groove(A,B,-.48,.48,6.3+f*3.02,8.35+f*3.02,.4));}
}
// Drie topgevelnissen: ronde klokken noord/zuid, oostelijk opschrift blind.
for(const[c,d]of[[[-.8,-9.7],0],[[-1.4,11.28],180]])cuts.push(prism(circle([0,0],1.35,32),0,1.5).rotate([-90,0,0]).rotate([0,0,d]).translate([c[0],c[1],z(36.8)]));
cuts.push(box(8.7,-1,z(35),10.4,2.6,z(37.3)));
// Reliëflijsten als kleine schuine profielen; niet als lichaamshoogtelagen.
for(const n of[9.2,30.7,33.3]){
 const wide=outline.map(([x,y])=>[x*1.024,y*1.024]);
 parts.push(hull([...outline.map(p=>[...p,z(n-.55)]),...wide.map(p=>[...p,z(n)])]));
}
// Ingangsfrontaal en schematische beelden als vast gevelrelief.
parts.push(frontGable([-.8,-9.12],3.7,6.2,7.8,0,3));
for(const[c,face]of[[[-6.5,-8.9],0],[[4.6,-8.7],0],[[9.25,-4.8],90],[[9.15,5.9],90],[[-5,10.8],180]])parts.push(box(-.5,-.45,z(7.6),.5,.1,z(9.5)).rotate([0,0,face]).translate([...c,0]));
// Dakramen op de vier steile leivlakken: blinde rechthoekige nissen.
for(const n of[36.5,38.6,40.5])for(const t of[-3.6,0,3.6]){ if(n===36.5&&t===0)continue;
 for(const[at,d]of[[[9.3-(n-33.8)/2.1,t+.5],0],[[-10.9+(n-33.8)/1.82,t+.5],180],[[t,-9+(n-33.8)/2],-90],[[t,10.65-(n-33.8)/2],90]])cuts.push(box(-.5,-.55,z(n)-.55,.95,.55,z(n)+.55).rotate([0,0,d]).translate([...at,0]));
}
const final=union(parts).subtract(union(cuts));
if(final.status()!=='NoError'||final.decompose().length!==1)throw Error('Niet gesloten/verbonden '+final.status()+' '+final.decompose().length);
await writeLandmark({slug,base,nodes:[['building:Witte Huis schilddak topgevels hoekerkers',final]],catalog:{name:'Het Witte Huis',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[12,2],[0,-13],[1,14]],replacesBuildings:['NL.IMBAG.Pand.0599100000690521'],description:'Complete BAG-voet met drie venstergevels, westelijke vluchttrap-inspringing, afgeplat steil schilddak, drie topgevels, twee ronde hoekerkers met achtkantige kap en centrale dakopbouw. Blinde nissen en gedragen gevelrelief op 1:1000.',realWorld:{groundNapM:ground,eaveNapM:33.85,flatRoofNapM:41.8,coreRoofNapM:45.6,turretTopNapM:45.5,axisDegrees:angle,estimates:['hoekerkerradius, arkeltop45.5 en achtkantige kap uit fotos geschat bij AHN-gaten','topgevelprofiel, vensters, klokdiameter en vast beeldrelief uit fotos geschat','kleine daklichten, reclameborden, hekwerk, vlaggenmasten en sierballen weggelaten']},sources:['PDOK BAG0599100000690521 BGT AHN DSM/DTM0.5m orthofoto 2026-10-09','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000690521 (CC BY4.0)','https://monumentenregister.cultureelerfgoed.nl/monumenten/334003','https://stadsarchief.rotterdam.nl/het-witte-huis','https://commons.wikimedia.org/wiki/File:Halfzijaanzicht_van_het_Witte_Huis_Rotterdam_(2020)_2.jpg','https://commons.wikimedia.org/wiki/File:00_2440_Witte_Huis_(Rotterdam).jpg']}});
