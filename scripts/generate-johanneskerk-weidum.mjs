import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// Lokaal +X langs de nok oostwaarts, +Y naar de noordgevel, NAP-maaiveld +3,39 m.
const B=-.5, origin=[178580,573318], axis=[.9889,.1486], ground=3.39;
const roofed=(poly,planes)=>{let s=prism(poly,B,40);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
// 3D BAG: schip goten NAP +10,85, nok +17,15. Het ronde koor sluit met vlakke waaiersegmenten.
const cy=.20, r=5.03, xc=22.50, ridge=13.76, slope=(13.76-7.46)/r;
const arc=Array.from({length:13},(_,i)=>{const a=-Math.PI/2+Math.PI*i/12;return [xc+r*Math.cos(a),cy+r*Math.sin(a)]});
const poly=[[1.7,cy-r],...arc,[1.7,cy+r]];
let planes=[[0,slope,ridge-slope*cy],[0,-slope,ridge+slope*cy]];
for(let k=0;k<=6;k++){let a=-Math.PI/2+k*Math.PI/6;planes.push([-slope*Math.cos(a),-slope*Math.sin(a),ridge+slope*(xc*Math.cos(a)+cy*Math.sin(a))]);}
const nave=roofed(poly,planes);
// Toren naar BAG-contour, NAP +21,4 goot; 8-zijdige ingesnoerde spits uit AHN en foto's.
const tower=box(-2,-1.85,2.45,2.35,B,18.02);const centre=[.20,.25];
const square=(half)=>rect(centre[0]-half,centre[1]-half,centre[0]+half,centre[1]+half);
const oct=(radius)=>circle(centre,radius,8,Math.PI/8);
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const spire=union([loft(square(2.13),17.95,oct(1.10),19.0),loft(oct(1.10),19.0,oct(.45),29.44)]);
let all=union([nave,tower,spire]);
// De rondbogige vensters en Romaanse spaarvelden zijn blind uitgesneden (0,35 m); portalen apart herkenbaar.
const niche=(x,y,w,z0,z1,angle=0,depth=.7)=>{const rad=w/2,spring=z1-rad;const profile=[[-rad,z0],[rad,z0],[rad,spring],[rad*.866,spring+rad*.5],[rad*.5,spring+rad*.866],[0,z1],[-rad*.5,spring+rad*.866],[-rad*.866,spring+rad*.5],[-rad,spring]];const pts=[];for(const [a,b] of profile)for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
// Noord- en zuidgevel: grotere vensters en de smallere blinde spaarvelden ertussen, zoals op RCE-foto's.
for(const x of [6.3,10.3,14.4,18.6])cuts.push(niche(x,cy-r-.15,1.30,2.8,6.0),niche(x,cy+r-.55,1.30,2.8,6.0));
for(const x of [4.3,8.3,12.3,16.4,20.6])cuts.push(niche(x,cy-r-.15,.82,3.0,5.8),niche(x,cy+r-.55,.82,3.0,5.8));
cuts.push(niche(6.4,cy-r-.15,1.30,0,2.45),niche(5.3,cy+r-.55,1.20,0,2.35));
// Raam in de apsis en galmnissen in de toren, twee per vrije zijde.
for(const a of [-60,0,60]){const t=a*Math.PI/180;cuts.push(niche(xc+(r-.52)*Math.cos(t),cy+(r-.52)*Math.sin(t),1.22,2.7,5.9,a-90));}
for(const x of [-.45,.85]){cuts.push(niche(x,-2.05,.75,14.6,17.0),niche(x,1.90,.75,14.6,17.0));}
for(const y of [-.40,.85])cuts.push(niche(-2.20,y,.75,14.6,17,90));
cuts.push(niche(-2.15,.25,1.20,0,2.35,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'johanneskerk-weidum',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Johanneskerk Weidum',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-3],[0,3],[8,-6],[18,-6],[26,0],[17,6]],replacesBuildings:['NL.IMBAG.Pand.0140100000168429'],description:'Romano-gotische eenbeukige kerk met afgeronde apsis, schip met schilddak, ronde vensters en spaarvelden; vierkante tufstenen toren met ingesnoerde spits en blinde galmnissen. Printbaar model met spitse top verbreed tot 0,9 m.',realWorld:{groundNapM:ground,naveRidgeM:ridge,towerEaveM:18.02,towerTopM:29.44},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0140100000168429','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/8518','https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Weidum']}});
