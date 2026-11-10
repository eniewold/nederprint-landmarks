// Nieuwe Luxor Theater: named planar architectural volumes from PDOK BAG and AHN5.
import {prism,strip,hull,union,downFaces,writeLandmark} from './efteling-kit.mjs';
const O=[93335,435755], G=3.366, BASE=-0.4;
const poly={"0":[[-33.65,-18.57],[-38.76,-7.4],[-38.9,-4.21],[-38.03,-1.14],[-33.33,6.43],[-22.05,22.14],[-15.02,30.34],[-11.04,33.8],[-8.96,32.14],[-23.9,15.35],[-16.14,9.31],[-10.47,16.53],[-10.93,17.37],[-10.63,18.27],[-9.76,18.67],[-8.98,18.41],[-2.08,26.79],[1.73,28.53],[6.27,28.38],[8.91,27.31],[19.03,20.96],[34.28,9.52],[48.75,-3.87],[50.42,-6.15],[51.38,-8.83],[51.55,-11.68],[50.92,-14.43],[49.55,-16.91],[47.53,-18.91],[44.59,-21.04],[44.14,-20.66],[-3.05,-55.2],[-10.92,-48.3],[-20.1,-38.44],[-27.77,-28.2]],"3":[[-19.97,24.73],[-13.52,31.89],[-11.04,33.8],[-8.96,32.14],[-17.2,22.82]],"4":[[45.9,-7.46],[50.61,-11.58],[43.78,-20.52],[38.5,-17.06]],"7":[[-3.28,-39.4],[-32.52,-16.27],[-31.95,-13.82],[-12.98,3.86],[20.8,-22.2]],"8":[[41.55,-13.1],[39.57,-11.59],[42.53,-8.12],[-2.54,26.14],[-1.78,27.0],[0.91,28.33],[3.4,28.71],[6.27,28.38],[8.91,27.31],[25.12,16.69],[34.28,9.52],[42.49,2.27],[48.75,-3.87],[50.42,-6.15],[51.48,-10.44],[50.61,-11.58],[45.9,-7.46]],"10":[[21.5,-3.84],[25.1,-0.59],[39.57,-11.59],[38.59,-12.73],[21.63,-20.65],[11.88,-12.36],[19.96,-2.6]],"11":[[40.7,-12.46],[41.55,-13.1],[38.5,-17.06],[43.78,-20.52],[51.48,-10.44],[50.92,-14.43],[49.55,-16.91],[47.53,-18.91],[44.59,-21.04],[44.14,-20.66],[-3.05,-55.2],[-9.86,-49.31],[-15.39,-43.73],[-20.94,-37.42],[-26.53,-30.01],[-31.45,-22.34],[-35.93,-14.09],[-38.49,-8.43],[-38.9,-4.21],[-38.03,-1.14],[-33.33,6.43],[-19.97,24.73],[-17.2,22.82],[-23.9,15.35],[-16.14,9.31],[-10.47,16.53],[-10.9,17.72],[-5.78,13.91],[-13.12,3.65],[-31.95,-13.82],[-32.52,-16.27],[-3.28,-39.4],[22.19,-21.21],[23.76,-22.76]],"12":[[23.76,-22.76],[22.19,-21.21],[20.8,-22.2],[-12.98,3.86],[-5.78,13.91],[-10.9,17.72],[-10.79,18.04],[-10.04,18.64],[-8.98,18.41],[-3.31,25.64],[-1.78,27.0],[-2.54,26.14],[42.53,-8.12],[39.57,-11.59],[40.7,-12.46]]};
const roof=(p,a,b,c)=>{const n=Math.hypot(a,b,1); return prism(p,BASE,70).trimByPlane([a/n,b/n,-1/n],-(c-G)/n);};
// Footprint, main foyers, auditorium's sloped roof and stage tower.
const footprint=prism(poly[0],BASE,22.04-G);
const foyer=prism(poly[11],BASE,25.34-G);
const waterfront=roof(poly[8],0.045767,-0.035584,23.08628);
const hall=roof(poly[7],-0.059038,-0.074998,30.7462);
const tower=prism(poly[12],BASE,39.92-G).subtract(prism(poly[10],37.20-G,50));
const lowerTower=prism(poly[10],BASE,37.20-G);
const pylon=prism(poly[3],BASE,39.92-G);
const entry=prism(poly[4],BASE,26.65-G);
// The two raised plant blocks are visible in both AHN and the roof image.
const plants=[[[15.4,-11.6],[20,-15.3],[21.5,-13.2],[16.7,-10]],[[18.9,-7.7],[23,-11.2],[24.5,-10],[20.4,-5.9]]].map(p=>prism(p,37.1-G,39.68-G));
// Grounded simplified truss of the riverside truck ramp. The pointed openings
// keep printable diagonals >=0.9 m; the original slender bars are enlarged.
const ra=[-0.6,-51.8],rb=[10,-73],dx=rb[0]-ra[0],dy=rb[1]-ra[1],len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux;
const rp=(s,t,z)=>[ra[0]+ux*s+nx*t,ra[1]+uy*s+ny*t,z];
let ramp=prism(strip(ra,rb,4.6,0,len),BASE,7.7);
const holes=[];for(let x=1.2;x<len-3.4;x+=4.5){const a=x,b=x+3.2,m=(a+b)/2;holes.push(hull([rp(a,-3,1.1),rp(b,-3,1.1),rp(m,-3,4.2),rp(a,3,1.1),rp(b,3,1.1),rp(m,3,4.2)]));} ramp=ramp.subtract(union(holes));
// Buried join: the tall sign pylon stands separately at ground level.
const bridge=prism(strip([-18.2,23],[-10.9,17.8],1.2,0,9),BASE,0.1);
let body=union([footprint,foyer,waterfront,hall,tower,lowerTower,pylon,entry,...plants,ramp,bridge]);
// Shallow glazing recesses around the curved city-facing foyer. Recess roofs
// rise outwards at 45 degrees so they do not require separate support.
const cuts=[];const faces=[
 [[-33.65,-18.57],[-38.76,-7.4],[-38.9,-4.21],[-38.03,-1.14],[-33.33,6.43],[-22.05,22.14]],
 [[-2.08,26.79],[1.73,28.53],[6.27,28.38],[8.91,27.31],[19.03,20.96],[34.28,9.52],[48.75,-3.87],[50.42,-6.15],[51.38,-8.83],[51.55,-11.68]]];
for(const face of faces)for(let j=0;j<face.length-1;j++){let a=face[j],b=face[j+1],dd=Math.hypot(b[0]-a[0],b[1]-a[1]),ex=(b[0]-a[0])/dd,ey=(b[1]-a[1])/dd;let perp=[-ey,ex];for(let t=.6;t+2.1<dd;t+=3.2){for(let z of [5.8,12.3]){let corners=[];for(let q of [t,t+2.1])for(let w of [-.45,.45]){let x=a[0]+ex*q+perp[0]*w,y=a[1]+ey*q+perp[1]*w;corners.push([x,y,z],[x,y,z+2.0+(w>0?1.5:0)]);}cuts.push(hull(corners));}}}
// Broad inset screen of the tall stage facade, framed by the roof and pylon.
{let a=[-2.54,26.14],b=[42.53,-8.12],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ex=(b[0]-a[0])/L,ey=(b[1]-a[1])/L,perp=[-ey,ex],corners=[];
 for(let q of [13,43])for(let w of [-.48,.48]){let x=a[0]+ex*q+perp[0]*w,y=a[1]+ey*q+perp[1]*w;corners.push([x,y,22.8],[x,y,34.0+(w>0?1.5:0)]);}cuts.push(hull(corners));}
// Waterfront foyer glass: three long bays in four storeys, leaving columns.
{let a=[44.14,-20.66],b=[-3.05,-55.2],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ex=(b[0]-a[0])/L,ey=(b[1]-a[1])/L,perp=[-ey,ex];
 for(let t=3;t+10<L-3;t+=13)for(let z of [4,7.2,10.4,13.6]){let corners=[];for(let q of [t,t+10])for(let w of [-.48,.48]){let x=a[0]+ex*q+perp[0]*w,y=a[1]+ey*q+perp[1]*w;corners.push([x,y,z],[x,y,z+1.8+(w>0?1.5:0)]);}cuts.push(hull(corners));}}
body=body.subtract(union(cuts));
// Zichtbaar vakwerk van de laadroute loopt langs de watergevel.
{
 const a=[44.14,-20.66], b=[-3.05,-55.2], L=Math.hypot(b[0]-a[0],b[1]-a[1]), ex=(b[0]-a[0])/L, ey=(b[1]-a[1])/L, n=[-ey,ex];
 const beam=(t0,z0,t1,z1)=>{const pts=[];for(const [t,z] of [[t0,z0],[t1,z1]])for(const [w,dz] of [[-0.5,-1.9],[-0.5,0.65],[1,0],[1,0.65]])pts.push([a[0]+ex*t+n[0]*w,a[1]+ey*t+n[1]*w,z+dz]);return hull(pts)};
 const truss=[beam(0.2,3.0,L-0.2,3.0),beam(0.2,7.4,L-0.2,7.4)];
 for(let s=0.2;s<L-5;s+=7.0){let e=Math.min(s+7,L-0.2);truss.push(beam(s,3.0,(s+e)/2,7.4),beam((s+e)/2,7.4,e,3.0));}
 body=union([body,...truss]);
}
if(body.status()!=='NoError')throw Error(body.status());
console.log('parts',body.decompose().length,'downFaces',JSON.stringify(downFaces(body,BASE)));
await writeLandmark({slug:'nieuwe-luxor-theater',base:BASE,nodes:[['building:theater',body]],catalog:{name:'Nieuwe Luxor Theater',origin:O,xAxis:[1,0],groundOffsetMetres:-0.2,groundSamplePoints:[[-40,0],[-35,-25],[-20,-45]],replacesBuildings:['NL.IMBAG.Pand.0599100000702518'],description:'Nieuwe Luxor Theater: gebogen foyer, schuine zaalkap en rechthoekig toneelhuis. X oost, Y noord, Z=0 maaiveld NAP +3,366 m.',realWorld:{groundNapM:G,towerNapM:39.92},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702518','PDOK AHN5 DSM 0,5 m en actuele luchtfoto','https://bolles-wilson.com/project/luxor-theatre/','https://commons.wikimedia.org/wiki/Category:Luxor_Rotterdam_(2001)']}});


