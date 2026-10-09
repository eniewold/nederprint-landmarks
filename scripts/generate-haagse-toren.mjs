// Haagse Toren: L-vleugels, afgeronde glashoeken, twee serres en kroon.
// Voorbeeld per rij: generate-evoluon.mjs, geheel gelezen; benoemde prisma's/vlakken.
import {Manifold,CrossSection,box,prism,circle,hull,union,writeLandmark} from './efteling-kit.mjs';
const slug='haagse-toren',origin=[82121.46,454232.43],angle=-10.47,ground=.9,base=-1.2;
const z=n=>n-ground,rad=angle*Math.PI/180,xAxis=[Math.cos(rad),Math.sin(rad)],parts=[],cuts=[];
// BAG 0518100000225439: rechte west/zuidgevels en twee ronde trappenhuiskoppen.
const arc=(c,r,a,b,n=18)=>Array.from({length:n+1},(_,i)=>{const t=(a+(b-a)*i/n)*Math.PI/180;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];});
const outline=[[-12.5,-14.7],[17.52,-14.7],...arc([17.52,-11.25],3.45,-90,40),...arc([-8.55,19.51],4.2,40,180),[-12.5,-14.7]];
const footprint=new CrossSection([outline]);
const whole=prism(outline,base,z(123.73));
const notch=prism([[-2.5,-2.2],[50,-2.2],[-2.5,60]],z(9.65),z(124));
parts.push(whole.subtract(notch));
// Glazen serres: werkelijk horizontaal overspannen, hier twee gesloten volumes
// met schuine onderzijden vanuit de beide vleugels (>50°), geen losse steun.
const serrePoly=[[-3.0,-2.7],[14.1,-2.7],[-3.0,16.05]];
const supportedBridge=(bottom,top)=>{
 const s=prism(serrePoly,z(bottom-21),z(top)),n=Math.hypot(1.2,1);
 const west=s.trimByPlane([1.2/n,0,1/n],(bottom-ground-3.6)/n);
 const south=s.trimByPlane([0,1.2/n,1/n],(bottom-ground-3.24)/n);
 return union([west,south]);
};
parts.push(supportedBridge(33.46,51.80),supportedBridge(76.48,94.86));
// Bovenste publieke lagen en dak: AHN/3D BAG geeft terras123.73, dak127.805,
// kroon130.40 en drie hoekpunten132.90. Brondakvlakken regelmatig herbouwd.
// TU Delft/3D geoinformatie, 3D BAG CC BY 4.0, pand0518100000225439.
parts.push(supportedBridge(115.6,123.73));
const crownInner=[[-7.7,-8.8],[11.7,-8.8],[-7.7,13.2]];
const crownOuter=footprint.offset(1.75,'Round',2,48).toPolygons()[0];
const crownLower=footprint.offset(-.35,'Round',2,48).toPolygons()[0];
const crown=hull([...crownLower.map(([x,y])=>[x,y,z(123.72)]),...crownOuter.map(([x,y])=>[x,y,z(132.9)])])
 .subtract(prism(crownInner,z(123.74),z(134)));
parts.push(crown);
// De fijne open vakwerkkroon wordt een gedragen rand met puntige openingen.
// De spitse top draagt de doorlopende dakrand zonder horizontale overspanning.
const crownOpening=(a,b,t)=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=[dy/len,-dx/len];
 const at=[a[0]+dx/len*t,a[1]+dy/len*t];
 const poly=[[-.82,z(125.4)],[.82,z(125.4)],[.82,z(130.65)],[0,z(131.9)],[-.82,z(130.65)]];
 return prism(poly,0,18).rotate([90,0,90]).translate([-17,0,0])
  .rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI]).translate([...at,0]);
};
const grooveAlong=(a,b,start,end,height,width,depth=.35)=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),d=[dx/len,dy/len],n=[d[1],-d[0]];
 const x=(start+end)/2,at=[a[0]+d[0]*x,a[1]+d[1]*x];
 return box(-depth,-(end-start)/2,height,1,(end-start)/2,height+width)
 .rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI]).translate([at[0],at[1],0]);
};
// Rechte gevels: 38 regelmatige woonlagen op ongeveer3m steek, 9/7 vensterbaaien.
for(const [a,b,count]of[[[-12.5,18.2],[-12.5,-14.7],9],[[-12.5,-14.7],[17.52,-14.7],8]]){
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let floor=0;floor<38;floor++)for(let col=0;col<count;col++){
  const t=1.4+(len-2.8)*(col+.5)/count,nap=9.8+floor*3;
  cuts.push(grooveAlong(a,b,t-1.04,t+1.04,z(nap),1.42,.35));
 }
 // Kroonhoogte: echte doorgangen, >1m pijlers, top boven50°.
 for(let t=2;t<len-1;t+=3.1)cuts.push(crownOpening(a,b,t));
}
// Binnengevels van de L volgen hetzelfde ritme (ramen tegenover de open zijde).
for(const [a,b,count]of[[[-2.5,-2.2],[-2.5,15.7],5],[[14,-2.2],[-2.5,-2.2],4]]){
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let floor=0;floor<38;floor++){
  const nap=10.1+floor*3;
  for(let j=0;j<count;j++){
   const t=(j+.5)*len/count;
   const far=a[0]===-2.5?a[1]+t+.95+2.7:a[0]-t+.95+3;
   // Ook achter de schuine onderzijde geen nissen: die zouden een interne holte snijden.
   if([[33.46,51.8],[76.48,94.86],[115.6,123.73]].some(([lo,hi])=>nap<=hi&&nap+1.45>=lo-1.2*Math.max(.8,far)))continue;
   cuts.push(grooveAlong(a,b,t-.95,t+.95,z(nap),1.45,.35));
  }
 }
}
// Glazen ronde hoeken: blinde horizontale voegen, met vier verticale stijlen.
for(const [c,r,a0,a1]of[[[-8.55,19.51],4.2,40,180],[[17.52,-11.25],3.45,-90,40]]){
 for(let k=0;k<40;k++){
  const nap=4.1+k*3;
  const ring=prism(arc(c,r+.45,a0,a1,24).concat(arc(c,r-.28,a1,a0,24)),z(nap),z(nap+.32));cuts.push(ring);
 }
 for(let a=a0+18;a<a1;a+=24){const q=a*Math.PI/180;cuts.push(box(r-.3,-.12,z(4),r+.5,.12,z(123.5)).rotate([0,0,a]).translate([...c,0]));}
}
// Glazen serrevoegen: enkel relief op de diagonale voorzijde en geen reclame.
const A=[14.1,-2.7],B=[-3,16.05],length=Math.hypot(A[0]-B[0],A[1]-B[1]);
for(const [lo,hi]of[[33.46,51.8],[76.48,94.86],[115.6,123.7]]){
 for(let n=lo+2.5;n<hi;n+=3)cuts.push(grooveAlong(A,B,.3,length-.3,z(n),.3,.3));
 for(let t=2;t<length-1;t+=3.15)cuts.push(grooveAlong(A,B,t-.13,t+.13,z(lo+.2),hi-lo-.4,.3));
}
// Begane grond: glasplint en twee blinde entrees op straatniveau.
cuts.push(box(-8,-15.1,z(.1),-4,-14.35,z(3.8)),box(-12.9,-5,z(.1),-12.15,-1,z(4.1)));
const model=union(parts).subtract(union(cuts));
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Model niet gesloten/verbonden '+model.status()+' '+model.decompose().length+' '+model.genus());
await writeLandmark({slug,base,nodes:[['building:L-vleugels met glashoeken serres en gedragen kroon',model]],catalog:{
 name:'De Haagse Toren (Strijkijzer)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[0,-19],[-17,0],[17,5]],
 replacesBuildings:['NL.IMBAG.Pand.0518100000225439'],description:'L-vormige woontoren met ronde glashoeken, twee serres en driehoekige kroon; vlakken en bouwdelen uit BAG/AHN, gevelritme uit foto geschat. Schuine gedragen onderzijden onder serres en spitse kroondoorgangen voor 1:1000.',
 realWorld:{groundNapM:ground,topNapM:132.9,terraceNapM:123.73,crownNapM:130.4,serreTopNapM:[51.8,94.86],storeyPitchM:3,axisDegrees:angle,
 estimates:['vensterbaaien, glasspui en verdiepingsteek regelmatig uit fotos','onderzijde serres als schuine printbare invulling','vakwerkkroon als dikke rand met spitse doorgangen, fijne staalstaven en antennes weggelaten','bovenste publieke lagen115.6m en eerste serre51.8m uit fotos geschat; overige hoogteankers AHN/3D BAG']},
 sources:['PDOK BAG0518100000225439, BGT, AHN DSM/DTM0.5m en Actueel_orthoHR;2026-10-09','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000225439 (3D BAG CC BY4.0)',
 'https://aaarchitecten.nl/projecten/het-strijkijzer-den-haag/','https://www.boele.nl/nl/projecten/het-strijkijzer',
 'https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_1.jpg','https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_5.jpg','https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_7.jpg','https://commons.wikimedia.org/wiki/File:Het_Strijkijzer_vanaf_HS.jpg','https://commons.wikimedia.org/wiki/File:Het_Strijkijzer_The_Hague_2015.JPG']
}});
