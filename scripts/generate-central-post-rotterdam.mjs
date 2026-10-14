// Central Post Rotterdam. Primitives example generate-evoluon.mjs read in full.
// Measured BAG and 3D BAG roof planes; facade subdivisions are building elements, never DSM layers.
import {Manifold,CrossSection,ccw,prism,rect,box as kitBox,union,writeLandmark} from './efteling-kit.mjs';
const box=(x0,x1,y0,y1,z0,z1)=>kitBox(x0,y0,z0,x1,y1,z1);
const slug='central-post-rotterdam',ORIGIN=[92129,437799],ANGLE=17.39142037839605,GROUND=-.1,BASE=-.75,z=h=>h-GROUND,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
const FOOT=[[-52.80,-15.87],[-48.12,-15.86],[-48.12,-17.28],[48.38,-17.28],[48.21,6.76],[51.24,6.76],[51.24,12.09],[48.37,12.08],[48.37,16.76],[-48.35,16.74],[-48.13,-5.53],[-52.97,-5.53]];
const ROOF=53.136,EAST=57.123,WEST=57.058;
const slab=(poly,a,b)=>prism(poly,z(a),z(b));
const parts=[prism(FOOT,BASE,z(ROOF)),box(-52.974,-41.87,-17.28,-4.334,z(ROOF-.05),z(WEST)),box(38.514,48.37,-3.054,16.757,z(ROOF-.05),z(EAST))];
const holes=[];
// Continuous concrete shell with deep blind glass fields: paired upper/lower glazing in seven tall halls.
// The original floor rails remain as seven facade beams; these are not solid stacked storey volumes.
for(const side of[-1,1]){
 const outer=side<0?-17.28:16.74,inner=outer-side*.48;
 for(let hall=0;hall<7;hall++){
  const floor=3.9+hall*6.65,upper=Math.min(floor+5.55,ROOF-1.2);
  for(let bay=0;bay<16;bay++){
   const x0=-32.7+bay*4.36,x1=x0+3.77;
   for(const [a,b]of[[floor+.05,Math.min(floor+2.25,upper)],[floor+2.62,upper]])if(b>a)holes.push(box(x0,x1,Math.min(outer+side*.06,inner),Math.max(outer+side*.06,inner),z(a),z(b)));
  }
 }
 // The ground-level lobbies and former loading doors retain glazing and structural piers.
 for(let bay=0;bay<16;bay++){const x0=-32.7+bay*4.36;holes.push(box(x0,x0+3.77,Math.min(outer+side*.06,inner+.06*side),Math.max(outer+side*.06,inner+.06*side),z(.6),z(3.32)));}
}
// Office heads have half-height floor rhythm; sharp facade returns stay solid.
for(const side of[-1,1]){const outside=side<0?-48.34:48.37,inside=outside-side*.45;
 for(let floor=0;floor<15;floor++)for(let bay=0;bay<5;bay++){
  const y0=-3.35+bay*3.65,h=.75+floor*3.45,facade=side===1&&bay===3?51.24:outside,glass=facade-side*.45;
  holes.push(box(Math.min(facade+side*.08,glass),Math.max(facade+side*.08,glass),y0,y0+2.98,z(h),z(Math.min(h+2.4,ROOF-.65))));
 }
}
// Deep south-facing west gallery strip is a series of blind loggias, keeping a full inner wall.
for(let floor=0;floor<15;floor++){const h=.65+floor*3.45;holes.push(box(-41.1,-35.1,-17.34,-15.7,z(h),z(Math.min(h+2.45,ROOF-.7))));}
// East office head front windows follow the same half-height rhythm.
for(let floor=0;floor<15;floor++)for(let bay=0;bay<2;bay++){const h=.65+floor*3.45;holes.push(box(39.5+bay*4,42.5+bay*4,-17.34,-16.82,z(h),z(Math.min(h+2.4,ROOF-.7))));}
// Roof construction: measured continuous parapet and individual machine houses (not roof pixels).
const cs=new CrossSection([ccw(FOOT)]);parts.push(cs.subtract(cs.offset(-.7,'Miter')).extrude(1.38).translate([0,0,z(ROOF-.04)]));
for(const [x0,x1,y0,y1,h]of[[-32.05,-22.97,-9.52,4.83,56.495],[-21.91,-12.38,-9.93,4.96,56.436],[-4.65,5.29,-10.08,1.53,56.52],[12.62,21.99,-10.17,4.89,56.344],[24.82,34.67,-9.86,4.75,56.519],[-3.37,3.21,1.42,7.72,57.762],[38.57,44.15,11.15,15.21,57.723],[-46.97,-39.84,-11.59,-4.39,56.101]])parts.push(box(x0,x1,y0,y1,z(ROOF-.05),z(h)));
// The Louis van Roode projecting concrete art windows are simplified, connected shallow wedge frames.
// Positions and silhouettes are estimated from oblique photographs; artwork colours and mosaics are omitted.
const artWindows=[[-50.9,4.5,2.0,2.7],[-46.5,6.5,2.7,3.1],[-49.4,10.6,3.1,2.8],[-44.8,13.8,2.4,3.0],[-50.7,17.2,2.8,2.3],[-46.2,20.1,3.0,2.9],[-50.3,23.4,2.7,2.5],[-44.7,25.2,2.0,3.2],[-48.5,28.8,3.0,2.4],[-45.0,31.7,2.2,2.7],[-50.3,34.8,2.2,2.8],[-46.7,37.0,3.1,2.3],[-49.6,40.1,2.6,2.2],[-45.6,42.8,2.7,2.6],[-50.4,46.0,2.3,2.2],[-46.7,48.5,2.1,2.5],[-50.4,50.9,1.8,1.6],[-43.6,7.2,1.3,2.2],[-44.1,17.9,1.2,2.3],[-43.8,35.0,1.3,2.0],[-43.9,45.9,1.3,2.1],[-48.1,14.1,1.7,2.0]];
for(const [station,h,w,H] of artWindows){
 const y=-15.1+(station+51)*1.1;
 const panel=Manifold.hull([[-52.65,y-w/2,z(h-H/2)],[-52.65,y+w/2,z(h-H/2)],[-53.48,y-w/2,z(h-H/2+.83)],[-53.48,y+w/2,z(h-H/2+.83)],[-52.65,y-w/2,z(h+H/2)],[-52.65,y+w/2,z(h+H/2)],[-53.48,y-w/2,z(h+H/2)],[-53.48,y+w/2,z(h+H/2)]]);
 parts.push(panel);holes.push(box(-53.54,-53.05,y-w/2+.45,y+w/2-.45,z(h-H/2+.9),z(h+H/2-.4)));
}
// Two recessed entrances replace the original post loading doors; shallow canopy undersides print at 45 degrees.
for(const x of[-20.5,22.5]){holes.push(box(x-3.3,x+3.3,-17.34,-16.28,z(.05),z(3.6)));parts.push(Manifold.hull([[x-3.8,-17.28,z(3.6)],[x+3.8,-17.28,z(3.6)],[x-3.8,-18.3,z(4.65)],[x+3.8,-18.3,z(4.65)],[x-3.8,-17.28,z(5.05)],[x+3.8,-17.28,z(5.05)],[x-3.8,-18.3,z(5.05)],[x+3.8,-18.3,z(5.05)]]));}
const building=union(parts).subtract(union(holes));
if(building.status()!=='NoError'||building.genus()!==0)throw Error('Central Post blind windows must form one closed body');
await writeLandmark({slug,nodes:[['building:central-post-met-koppen-en-kunstvensters',building]],base:BASE,title:'Central Post Rotterdam',catalog:{name:'Central Post',origin:ORIGIN,xAxis:AXIS,groundHeight:43.57521675,groundNap:GROUND,groundOffsetMetres:-.15,groundSamplePoints:[[-17.2566,-24.9842],[30.4686,-23.1660]],replacesBuildings:['NL.IMBAG.Pand.0599100000700780'],description:'Gehele BAG-voetafdruk van het voormalige stationspostgebouw; zeven dubbelhoge glazen zaalgevels, vijftienlaagse kantoorhoofden, blinde westgalerijen, verbonden kunstvenster-reliÃ«fs en gemeten dakmachines. BAG/3D BAG/AHN leveren dak- en contourmaten; venster- en reliÃ«fritme, entreepuien en luifels zijn uit fotoâ€™s geschat. Geen nieuwe 60 m glazen opbouw; renovatie voegde interne entresols toe. Z=NAP+0.1 m.',realWorld:{groundNapM:GROUND,roofNapM:ROOF,westCoreNapM:WEST,eastCoreNapM:EAST,machineTopNapM:57.762,pairedGlazingHalls:7,officeFloors:15,artWindows:22,glassDepthM:.48},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000700780','PDOK BAG 0599100000700780 EPSG:28992; AHN DSM/DTM 0.5 m en actuele orthoHR','PDOK 3D Basisvoorziening: maaiveld Delftseplein 43.5752/43.6063 m ellipsoÃ¯disch','https://kaanarchitecten.com/work/central-post-offices (schuine foto Luuk Kramer; uitsluitend visuele referentie)','https://central-post-rotterdam.com/nl/gebouw/','https://wederopbouwrotterdam.nl/artikelen/stationspostkantoor (fotoâ€™s Marlies Lageweg en bouwhistorie)']}});
