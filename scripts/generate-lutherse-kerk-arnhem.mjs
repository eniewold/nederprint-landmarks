import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X van het voorplein naar de achtergevel, oorsprong nabij de voorgevel.
const B=-.5,origin=[190546,443900],axis=[.11,-.994],ground=17.797;
const roofed=(poly,planes,z=14.0)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk met schilddak, bovenaan afgevlakt volgens 3D BAG en AHN.
const poly=[[-.72,-4.68],[13.44,-4.71],[19.52,-4.02],[19.87,5.62],[15.52,5.58],[-.66,5.59]];
const body=roofed(poly,[[0,1.05,14-1.05*(-1.45)],[0,-1.05,14+1.05*2.4],[1.35,0,14-1.35*2.4],[-1.35,0,14+1.35*16.3]],14);
// Fronton aan de Korenmarkt en vier verbonden hoek- en middenpilasters.
const pediment=roofed(rect(-1.02,-4.35,.25,5.02),[[0,.24,12.7-.24*.4],[0,-.24,12.7+.24*.4]],12.7);
const pillars=[];for(const y of [-4.15,-1.15,1.95,4.85])pillars.push(prism(rect(-1.18,y-.48,.15,y+.48),B,10.3));
// Langs de zichtbare linkerzijde ritmische pilasters als gevelbouwdelen.
for(const x of [1.1,4.7,8.3,11.9])pillars.push(prism(rect(x-.48,-4.95,x+.48,-4.55),B,10.0));
let all=union([body,pediment,...pillars]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[r*.7,z1-r*.3],[0,z1],[-r*.7,z1-r*.3],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
// Voorgevel met middenportaal en twee rijen vensters, geabstraheerd naar de foto's.
for(const y of [-2.7,.4,3.4])cuts.push(niche(-.35,y,1.05,6.5,9.0,90));
for(const y of [-2.7,3.4])cuts.push(niche(-.35,y,1.05,2.8,5.4,90));
cuts.push(niche(-.35,.4,1.4,0,3.8,90));
// Twee niveaus van rondboogopeningen in de linker zijgevel.
for(const x of [2.8,6.4,10,13])cuts.push(niche(x,-4.83,1.1,2.8,5.3),niche(x,-4.83,1.1,6.4,8.9));
all=all.subtract(union(cuts));
await writeLandmark({slug:'lutherse-kerk-arnhem',base:B,nodes:[['building:kerk',all]],catalog:{name:'Lutherse Kerk Arnhem',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-7],[-3,7],[8,-7],[21,-7],[22,7],[8,7]],replacesBuildings:['NL.IMBAG.Pand.0202100000206918'],description:'Voormalige Lutherse zaalkerk met schilddak, klassiek fronton en pilasters; venster- en portaalnissen voor 1:1000.',realWorld:{groundNapM:ground,roofTopM:14.0},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000206918','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.monumenten.nl/monument/8348','https://commons.wikimedia.org/wiki/Category:Former_Lutheran_church_(Arnhem)']}});

