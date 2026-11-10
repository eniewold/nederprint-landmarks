// Chassé Theater, Breda: gemeten golfprofielen en gevels in meters.
// Bouwstelsel: +X (0,961,-0,276) RD, +Y linksom, oorsprong RD (113060,399960).
// AHN5 DSM 0,5 m (2024), BAG en 3D BAG; foto’s en architectuurdoorsneden.
import {Manifold,CrossSection,prism,hull,union,ccw,writeLandmark} from './efteling-kit.mjs';
const O=[113060,399960], G=3.035, BASE=-.5, at=z=>z-G, A=[.961/Math.hypot(.961,.276),-.276/Math.hypot(.961,.276)];
const FOOT=[[33.12,36.47],[15.18,36.47],[15.14,50.59],[16.27,50.66],[16.21,54.86],[24.56,54.85],[24.49,61.74],[14.93,61.71],[14.98,63.32],[-9.81,63.22],[-13.64,52.27],[-22.99,52.26],[-23.02,53.66],[-23.51,53.66],[-23.52,53.43],[-47.97,53.46],[-48.29,54.08],[-52.16,51.41],[-54.25,54.47],[-66.09,46.3],[-63.9,43.12],[-58.7,35.49],[-49.75,35.53],[-40.79,22.61],[-41.96,21.74],[-36.38,13.73],[-35.16,14.59],[-31.32,9.09],[-23.28,-2.33],[-22.73,-3.29],[-21.13,-8.95],[-24.8,-11.49],[-17.46,-21.91],[-16.03,-26.94],[-14.2,-33.01],[-8.45,-53.45],[7.33,-57.94],[7.92,-55.54],[21.92,-58.45],[21.92,-55.81],[21.88,-50.11],[25.8,-48.16],[27.06,-50.69],[32.55,-48.01],[33.22,-47.85],[32.51,-44.82],[27.63,-23.47],[33.34,-23.45],[33.25,.21],[37.7,.25],[37.66,18.13],[33.19,18.11]];
// Doorsneden lopen langs V; geëxtrudeerd langs U. Bovenpunten AHN-DSM (NAP).
const profile=(pts,u0,u1)=>{const xy=[[pts[0][0],BASE],...pts.map(([v,z])=>[v,at(z)]),[pts.at(-1)[0],BASE]];return Manifold.extrude(new CrossSection([ccw(xy)]),u1-u0).rotate([90,0,0]).rotate([0,0,90]).translate([u0,0,0]);};
const whole=prism(FOOT,BASE,at(36));
const big=profile([[-58,22.8],[-50,24.3],[-45,24.43],[-40,25.57],[-35,27.45],[-30,29.38],[-25,31.34],[-20,33.22],[-15,34.25],[-12,34.46],[-10,34.08],[-5,32.7],[0,29.95],[5,27.62],[10,27.08],[15,28.1],[20,29.8],[23,30.15],[25,30],[30,28.74],[35,27.36],[40,26.0],[45,24.6],[50,23.3],[55,22.6],[57,22.55],[59,15.32],[64,15.32]],-20,34).intersect(prism([[-1,-60],[34,-60],[34,-4],[16,-4],[16,64],[-15,64],[-15,30],[-12,15],[-6,0],[-2,-30]],BASE-1,at(37)));
const west=profile([[-58,19],[-50,19.1],[-45,19],[-40,18],[-35,16.6],[-30,15.4],[-20,15.7],[-15,17.35],[-10,19.25],[-5,21.0],[0,22.85],[4,23.8],[7,23.8],[10,23.4],[15,21.35],[20,18.95],[25,16.45],[30,14.15],[35,12.4],[40,11],[45,10.1],[50,9.5],[55,8.5],[64,7.7]],-67,0);
// Vlakke noordwestelijke aansluiting: AHN en 3D BAG NAP +16,45 tot +16,58 m.
const nwPlan=[[-63.9,43.12],[-58.7,35.49],[-50.04,35.52],[-46.83,31.31],[-40.93,22.82],[-36.69,24.92],[-28.44,24.89],[-35.78,34.61],[-48.64,53.18]];
const nwSlope=.003,nwC=at(16.47)-nwSlope*25,nwN=Math.hypot(nwSlope,1);
const northWest=prism(nwPlan,BASE,at(20)).trimByPlane([0,nwSlope/nwN,-1/nwN],-nwC/nwN);
const east=profile([[-5,14.0],[15,14.0],[16,16.2],[20,16.1],[25,15.3],[30,13.8],[35,12.4],[38,11.6]],16,38);
let body=union([prism(FOOT,BASE,at(8)),big.intersect(whole),west.intersect(whole),northWest.intersect(whole),east.intersect(whole)]);
// Lage dakopbouw op de noordwestvleugel, AHN en 3D BAG: NAP +17,6 m.
body=union([body,
 // Aangrenzende lage aansluitingen met verschillende vlakke dakhoogtes (3D BAG/AHN).
 prism([[-65.94,46.07],[-63.9,43.12],[-59.01,46.26],[-57.77,48.24],[-54.25,54.47],[-60.71,49.3]],BASE,at(14.4)).intersect(whole),
 prism([[-52.84,50.57],[-52.16,51.41],[-54.25,54.47],[-59.48,50.85],[-57.77,48.24]],BASE,at(14.35)).intersect(whole),
 prism([[-66.09,46.3],[-65.94,46.07],[-60.71,49.3],[-60.9,49.88]],BASE,at(15.4)).intersect(whole),
 prism([[-60.71,49.3],[-60.09,47.36],[-59.01,46.26],[-57.24,47.44],[-57.77,48.24],[-59.48,50.85],[-60.9,49.88]],BASE,at(15.88)).intersect(whole),
 prism([[-52.4,49.8],[-48,49.8],[-48,54.1],[-52.4,54.1]],BASE,at(17.6)).intersect(whole),
 prism([[-56.3,41.6],[-56.3,43.2],[-59,46.25],[-60.8,45.0],[-58.7,41.7],[-57.8,40.4]],BASE,at(17.72)).intersect(whole),
 prism([[-50.46,35.9],[-46.83,31.31],[-45.22,33.15],[-46.1,35.92]],BASE,at(18.68)).intersect(whole)
]);
// Beglaasde gevelzones en de schuine banden aan de pleinkant: ondiepe nissen;
// panelen en witte trapband blijven als bouwvolume staan. Booleans volgen de BAG-gevel.
const cuts=[];
for(const index of [7,8,9,10,30,31,32,33,34,35,36,46,47,48,49,50]) {
 const a=FOOT[index], b=FOOT[(index+1)%FOOT.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy); if(len<4) continue;
 const d=[dx/len,dy/len], n=[-d[1],d[0]]; // BAG contour CCW, linkerzijde is binnen.
 for(let t=.6;t<len-1.5;t+=3.4) for(const row of [0,1]) {
   const offset= index>=30 && index<=35 ? FOOT.slice(30,index).reduce((sum,p,j)=>sum+Math.hypot(FOOT[31+j][0]-p[0],FOOT[31+j][1]-p[1]),0)+t : 0;
   const z = index>=30 && index<=35 ? 1.4+0.22*offset+row*3.8 : 1.4+row*3.8;
   const w=Math.min(2.4,len-t-.5); if(w<.9) continue;
   const pts=[]; for(const along of [t,t+w]) for(const depth of [-.3,.35]) for(const high of [false,true]) {
    const h=(high ? z+2.4-(depth>0?.65:0) : z) + (index>=30 && index<=35 ? 0.22*(along-t) : 0);
    pts.push([a[0]+d[0]*along+n[0]*depth,a[1]+d[1]*along+n[1]*depth,h]);
   } cuts.push(hull(pts));
 }
}
// Pleinzijde: de oorspronkelijke open onderbouw blijft als blinde nissen leesbaar;
// de terugliggende zwarte openingen sluiten voor steunloos printen in volume.
for(const index of [33,34,35]) {
 const a=FOOT[index],b=FOOT[index+1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),d=[dx/len,dy/len],n=[-d[1],d[0]];
 for(let t=1;t<len-4;t+=5.2){const pts=[];for(const along of [t,t+3.8])for(const depth of [-.3,.38])for(const high of [false,true]){
 const h=high?3.7-(depth>0?.68:0):.2;pts.push([a[0]+d[0]*along+n[0]*depth,a[1]+d[1]*along+n[1]*depth,h]);}cuts.push(hull(pts));}
}
body=body.subtract(union(cuts));
// Twee witte diagonale banden van de pleintrappen zijn aangesloten reliëf.
// De voet loopt schuin van de gevel naar buiten: geen vlakke overhang.
const bands=[]; let alongWall=0;
for(const index of [33,34,35]) {
 const a=FOOT[index],b=FOOT[index+1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),d=[dx/len,dy/len],n=[-d[1],d[0]];
 for(const row of [0,1]) {
  const pts=[];
  for(const t of [-.03,len+.03]) { const bottom=2.0+.25*(alongWall+t)+row*3.8;
   for(const [depth,z] of [[.85,bottom-1.8],[-.38,bottom],[-.38,bottom+1.4],[.85,bottom+1.4]])
    pts.push([a[0]+d[0]*t+n[0]*depth,a[1]+d[1]*t+n[1]*depth,z]);
  } bands.push(hull(pts));
 }
 alongWall+=len;
}
body=union([body,...bands]);
if(body.status()!=='NoError' ||body.decompose().length!==1)throw Error('Chassé is niet één gesloten volume');
console.log('STATUS',body.status(),body.decompose().length,body.boundingBox());
await writeLandmark({slug:'chasse-theater',base:BASE,nodes:[['building:theater',body]],catalog:{name:'Chassé Theater',origin:O,xAxis:A,groundOffsetMetres:-.3,groundSamplePoints:[[45,-65],[-75,20],[45,70]],replacesBuildings:['NL.IMBAG.Pand.0758100000069483'],description:'Chassé Theater met gemeten golvende kappen, foyer en blinde gevelnissen; onderbouw vereenvoudigd voor steunloos printen.',realWorld:{groundNapM:G,roofMaxNapM:34.46},sources:['PDOK AHN5 DSM 0,5 m en luchtfoto, 10 november 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000069483','https://commons.wikimedia.org/wiki/Category:Chass%C3%A9_Theater','https://architecture-history.org/architects/architects/HERTZBERGER/OBJ/1992-1995,%20Chass%C3%A9%20Theater,%20Breda,%20Netherlands.html']}});
