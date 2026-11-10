// Circustheater Scheveningen: gemeten BAG-omtrek, AHN-koepelprofiel en losse bouwdelen.
import {Manifold,prism,union,dome,circle,hull,writeLandmark} from './efteling-kit.mjs';
const O=[79343.7,458632.3], G=5.287, BASE=-.5, z=n=>n-G;
const FOOT=[[0.48, -45.5], [12.69, -38.11], [38.02, -27.63], [36.52, -23.92], [49.85, -17.84], [52.24, -14.78], [53.22, -11.02], [52.61, -7.18], [51.6, -4.92], [50.37, -4.43], [51.49, -3.36], [42.09, 0.84], [40.84, 0.47], [33.45, 8.27], [28.69, 17.02], [24.33, 22.78], [18.82, 27.46], [13.53, 30.71], [9.3, 32.1], [15.25, 45.77], [16.8, 45.19], [15.6, 45.89], [17.5, 48.3], [14.35, 46.95], [13.54, 48.99], [13.34, 48.1], [13.2, 49.09], [11.71, 49.25], [9.5, 53.77], [7.61, 55.62], [-44.91, -0.18], [-44.36, -1.13], [-41.84, 0.25], [-40.14, -0.86], [-37.44, -5.21], [-36.0, -3.58], [-31.24, -7.81], [-33.41, -10.32], [-39.47, -5.63], [-40.28, -6.45], [-39.59, -7.09], [-45.53, -13.53], [-15.65, -41.54], [-16.06, -45.2], [-13.67, -49.66], [-10.67, -51.28], [-7.27, -51.39], [-4.21, -49.83]];
const TOWER=[[-16.42, -11.81], [-19.0, -26.05], [9.13, -30.98], [11.98, -18.2], [11.67, -17.02], [1.7, -14.68], [-7.25, -14.15], [-7.36, -13.12], [-7.39, -13.87], [-15.35, -11.5]];
// Lage vleugels en de afgeronde foyer, uit de actuele gebouwcontour.
const lowEast=[[42.36,.67],[49.22,-2.55],[49.87,.25],[45.25,5.21],[39.98,7.56],[34.77,7.47],[40.84,.47]];
const lowNorth=[[9.3,32.1],[13.14,30.37],[13.53,30.71],[17.5,44.78],[15.25,45.77]];
const body=prism(FOOT,BASE,z(16.21)).subtract(prism(lowEast,z(12.15),z(16.4))).subtract(prism(lowNorth,z(12.12),z(16.4)));
// Toneeltoren, laagopbouw en de circuskoepel: elke contour is een eigen bouwdeel.
const tower=prism(TOWER,BASE,z(38.56));
const domeRoof=dome([0,0],[[22.4,z(16.1)],[21,z(18.72)],[19,z(20.5)],[17,z(21.94)],[15,z(23.08)],[13,z(24.04)],[11,z(24.82)],[9,z(25.53)],[7,z(26.13)],[5,z(26.55)],[3,z(26.93)]],32);
const lantern=dome([0,0],[[2.8,z(26.5)],[2.8,z(27.5)],[.45,z(29.15)]],8);
const lowerStage=prism([[-19.81,-34.37],[7.31,-39.14],[9.13,-30.98],[-19,-26.05]],BASE,z(21.31));
const connector=hull([...circle([15.4,52.8],5,32).map(([x,y])=>[x,y,BASE]),...circle([10,44],5,32).map(([x,y])=>[x,y,BASE]),...circle([15.4,52.8],5,32).map(([x,y])=>[x,y,z(16.21)]),...circle([10,44],5,32).map(([x,y])=>[x,y,z(16.21)])]);
const entryDrum=prism(circle([15.4,52.8],5,48),BASE,z(16.4));
const littleDome=dome([15.4,52.8],[[5,z(16.25)],[5,z(17.4)],[4.35,z(17.4)],[4.35,z(18.65)],[3.7,z(18.65)],[3.7,z(19.65)],[3.15,z(19.65)],[2.8,z(20.65)],[1,z(21.5)]],48);
let solid=union([body,tower,lowerStage,domeRoof,lantern,connector,entryDrum,littleDome]);
// Foyer aan de pleinzijde: ondiepe venstervakken volgen de gebogen buitengevel.
// De exacte vakmaat is geschat uit de frontale Commons-foto van 2018.
const path=[[15.25,45.77],[9.3,32.1],[13.526,30.713],[18.816,27.456],[24.332,22.784],[28.691,17.016],[33.447,8.272],[40.844,.468]];
const cuts=[];
for(let i=1;i<path.length;i++){
 const a=path[i-1],b=path[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);const d=[(b[0]-a[0])/len,(b[1]-a[1])/len],n=[d[1],-d[0]];
 const pt=(t,w,h)=>[a[0]+d[0]*t+n[0]*w,a[1]+d[1]*t+n[1]*w,h];
 for(let t=.55;t+1.6<len-.4;t+=2.7) cuts.push(hull([pt(t,-5,1),pt(t+1.6,-5,1),pt(t,.35,1),pt(t+1.6,.35,1),pt(t,-5,7.2),pt(t+1.6,-5,7.2),pt(t,.35,7.2),pt(t+1.6,.35,7.2),pt(t+.8,-5,8),pt(t+.8,.35,8)]));
}
solid=solid.subtract(union(cuts));
// Luifel in doorsnede als hellende kraag, verbonden met foyer; vereenvoudigd
// en minimaal 1 m dik op de schaal van een 1:1000-stadskaart.
{
 const a=path[0],b=path[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);const d=[(b[0]-a[0])/len,(b[1]-a[1])/len],n=[d[1],-d[0]];
 const pt=(t,w,h)=>[a[0]+d[0]*t+n[0]*w,a[1]+d[1]*t+n[1]*w,h];
 solid=union([solid,hull([pt(0,.5,3.5),pt(len,.5,3.5),pt(0,.5,6),pt(len,.5,6),pt(0,-1,5),pt(len,-1,5),pt(0,-1,6),pt(len,-1,6)])]);
}
if(solid.status()!=='NoError'||solid.decompose().length!==1)throw Error('Model niet verbonden');
await writeLandmark({slug:'circustheater-scheveningen',base:BASE,nodes:[['building:theater',solid]],catalog:{name:'AFAS Circustheater',origin:O,xAxis:[1,0],groundOffsetMetres:-.25,groundSamplePoints:[[45,15],[50,12]],replacesBuildings:['NL.IMBAG.Pand.0518100000211276'],description:'Circustheater met circuskoepel, lantaarn en toneeltoren.',sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000211276','PDOK AHN5 DSM 0,5m','https://commons.wikimedia.org/wiki/File:Afas_Circustheater-Scheveningen.jpg']}});



