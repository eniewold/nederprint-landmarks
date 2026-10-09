// Vrije schil van De Blob: doorlopende geprofileerde mantel, geen AHN-pixels
// of gestapelde hoogtelagen. Per rij generate-evoluon.mjs geheel gelezen.
import {Manifold,hull,union,box,writeLandmark} from './efteling-kit.mjs';
const slug='de-blob',origin=[161172.8,383525],angle=83,ground=16.4,base=-.45;
const xAxis=[Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180)];
// Langsas +X naar het noorden; +Y naar de Emmasingel. Contour uit BAG;
// daklijn NAP uit AHN 0,5m, glad tussen de architectonische maatstations.
// Glazen uiteinden en asymmetrische doorsnede gecontroleerd op schuine foto's.
// [x, oostrand, westrand, hoogste punt NAP, y van dat punt]
const stations=[
 [-30.12,-.53,.91,23.0,.2],[-29,-5.2,5.1,26.8,2.0],[-27,-8.4,6.8,30.6,2.6],
 [-24,-10.7,8.0,34.3,3.0],[-20,-12.1,8.7,37.6,3.7],[-16,-12.2,9.1,39.8,4.2],
 [-12,-12.15,9.3,40.6,4.0],[-8,-11.95,9.34,41.25,3.5],[-4,-11.55,9.34,41.3,3.8],
 [0,-11,9.2,41.05,4.2],[4,-10,9.0,39.9,4.6],[8,-9.0,8.8,38.05,4.4],
 [12,-7.85,8.55,35.8,4.2],[16,-6.5,8.25,33.3,3.8],[20,-4.9,7.9,30.4,3.4],
 [24,-2.95,7.35,26.7,3.0],[27,-1,6.75,23.5,2.9],[29,.8,5.3,21.2,3.2],
 [29.65,2.9,3.88,20.6,3.4]
];
// Cubische Hermite-interpolatie van maatstations; geen afgeleide DSM-mesh.
function sample(x,k){
 x=Math.min(stations.at(-1)[0],Math.max(stations[0][0],x));
 const i=Math.max(0,stations.findIndex((p,j)=>j<stations.length-1&&x<=stations[j+1][0]));
 const p=stations[i],q=stations[i+1],t=(x-p[0])/(q[0]-p[0]),d=q[0]-p[0];
 const before=stations[Math.max(0,i-1)],after=stations[Math.min(stations.length-1,i+2)];
 const m0=(q[k]-before[k])/(q[0]-before[0]),m1=(after[k]-p[k])/(after[0]-p[0]);
 return (2*t**3-3*t*t+1)*p[k]+(t**3-2*t*t+t)*d*m0+(-2*t**3+3*t*t)*q[k]+(t**3-t*t)*d*m1;
}
const sections=32,roofSteps=20,wallSteps=10;
function profile(x){
 const east=sample(x,1),west=sample(x,2),peak=sample(x,3)-ground,cy=sample(x,4);
 const re=cy-east+.35,rw=west-cy+Math.min(3.2,(west-east)*.24);
 const t0=Math.acos((east-cy)/re),t1=Math.acos((west-cy)/rw);
 const roof=Array.from({length:roofSteps+1},(_,j)=>{
  const t=t0+(t1-t0)*j/roofSteps,r=t>Math.PI/2?re:rw;
  return [x,cy+r*Math.cos(t),peak*Math.sin(t)];
 });
 // De steile glazen westgevel is een gebogen huid met verticale gedragen
 // onderbouw. Glazen pui en witte mantel blijven als volle massa printbaar.
 const end=roof.at(-1),start=roof[0],p=[...roof];
 for(let j=1;j<=wallSteps;j++)p.push([x,west,end[2]+(base-end[2])*j/wallSteps]);
 p.push([x,east,base]);
 for(let j=1;j<wallSteps;j++)p.push([x,east,base+(start[2]-base)*j/wallSteps]);
 return p;
}
const xs=Array.from({length:sections+1},(_,j)=>-30.12+59.77*j/sections),rings=xs.map(profile),n=rings[0].length;
const vertices=rings.flat(),triangles=[];
for(let i=0;i<sections;i++)for(let j=0;j<n;j++){
 const a=i*n+j,b=(i+1)*n+j,c=(i+1)*n+(j+1)%n,d=i*n+(j+1)%n;
 if((i+j)%2)triangles.push([a,b,d],[b,c,d]);else triangles.push([a,b,c],[a,c,d]);
}
for(const i of[0,sections]){
 const ps=rings[i],c=ps.reduce((s,p)=>s.map((v,k)=>v+p[k]/n),[0,0,0]),ci=vertices.push(c)-1;
 for(let j=0;j<n;j++)triangles.push(i===0?[ci,i*n+j,i*n+(j+1)%n]:[ci,i*n+(j+1)%n,i*n+j]);
}
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
let volume=triangles.reduce((s,t)=>s+dot(vertices[t[0]],cross(vertices[t[1]],vertices[t[2]]))/6,0);
if(volume<0)for(const t of triangles)t.reverse();
const skin=new Manifold({numProp:3,vertProperties:Float32Array.from(vertices.flat()),triVerts:Uint32Array.from(triangles.flat())});
if(skin.status()!=='NoError')throw new Error(skin.status());
// Glasvelden volgen het waargenomen contrast: brede zuidkop, noordtong,
// ovaal boven de westentree en twee kleinere openingen in de witte rug.
function glass([x,y,z]){
 return x<-20||(x<-13&&y<-1)||(x>14)||
  (y>3&&((x+9)/6.8)**2+((z-18.3)/6.6)**2<1)||
  (y>3&&((x-7.5)/7)**2+((z-10.5)/6.5)**2<1)||
  (y<-3&&((x+4)/7)**2+((z-18)/7)**2<1);
}
const cuts=[];let glassPanels=0,whitePanels=0;
for(const t of triangles){
 const ps=t.map(i=>vertices[i]),c=ps.reduce((s,p)=>s.map((v,k)=>v+p[k]/3),[0,0,0]);
 if(c[2]<.65||t.some(i=>i>(sections+1)*n-1))continue;
 const nn=cross(sub(ps[1],ps[0]),sub(ps[2],ps[0])),len=Math.hypot(...nn);if(len<1e-5)continue;
 const normal=nn.map(v=>v/len);if(normal[2]<-.3)continue;
 const g=glass(c),depth=g?.35:.10;
 const minAltitude=Math.min(...ps.map((p,j)=>len/Math.hypot(...sub(ps[(j+1)%3],ps[(j+2)%3]))));
 const inset=g?.15:.08,shrink=Math.max(.25,1-3*inset/minAltitude);
 if(minAltitude<.85)continue;
 const inner=ps.map(p=>p.map((v,k)=>c[k]+(v-c[k])*shrink));
 cuts.push(hull(inner.flatMap(p=>[-depth,.06].map(d=>p.map((v,k)=>v+normal[k]*d)))));
 if(g)glassPanels++;else whitePanels++;
}
let model=skin.subtract(union(cuts));
// Blinde deurportalen: westentree en pui aan Nieuwe Emmasingel. Geen luifels
// die op 1:1000 los boven de grond hangen, geen glasdikte of losse kozijnen.
model=model.subtract(union([box(-8,8.91,.1,-4,10,3),box(-8,-13,.1,-4,-11.2,3.3),box(-27,-12,.1,-24,-8.1,3),box(18,-6.7,.1,22,-5.15,3)]));
await writeLandmark({slug,nodes:[['building:de-blob',model]],base,title:'De Blob Eindhoven',catalog:{
 name:'De Blob',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[0,14],[-22,12],[25,10]],
 replacesBuildings:['NL.IMBAG.Pand.0772100001003308'],
 description:'Doorlopende asymmetrische schil met driehoekige glas- en paneelnissen, twee afgeronde koppen en blinde deurportalen; vaste maatstations uit BAG en AHN, vrije vorm en glasvelden uit schuine foto’s geschat. Alle gevels gesloten en gedragen op 1:1000; geen hoogteveld of losse vakwerkstaven.',
 realWorld:{groundNapM:ground,topNapM:41.3,lengthM:59.77,widthM:22.02,axisDegrees:angle,glassPanels,whitePanels,glassReliefM:.35,whiteReliefM:.1},
 sources:['PDOK BAG pand 0772100001003308, EPSG:28992; afgeronde contour en lengterichting','PDOK AHN DSM/DTM 0,5m WCS; maatstations dakmantel en maaiveld; glazen koppen gedeeltelijk ontbrekend','PDOK BGT en luchtfoto actueel; glasvelden en aansluiting plein/Nieuwe Emmasingel','https://fuksas.com/admirant-entrance-building/','https://www.knippershelbig.com/en/projects/de-blob/','https://www.wb-sg.com/projects/blob/','https://commons.wikimedia.org/wiki/File:The_Blob_in_Eindhoven,_Netherlands.jpg','https://commons.wikimedia.org/wiki/File:Binnenstad,_5611_Eindhoven,_Netherlands_-_panoramio_(16).jpg','https://commons.wikimedia.org/wiki/File:13-06-30-eindhoven-03.jpg',"https://commons.wikimedia.org/wiki/File:%27The_Blob%27_Eindhoven_(6564785833).jpg"]
}});
