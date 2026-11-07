import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X langs de kerkas naar het oosten, oorsprong in RD en alle maten in meters.
const B=-.5, origin=[165925,559001], axis=[.9856,-.169], ground=.95;
const roofed=(poly,planes)=>{let s=prism(poly,B,35);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z1-z0).translate([0,0,z0]);
// 3D BAG: nok NAP +11,35 en goot ca. +6,3; veelhoekige ronde koorsluiting.
const cy=.46,r=3.88,xc=14.32,ridge=10.40,slope=(10.40-5.38)/r;
const arc=Array.from({length:11},(_,i)=>{const a=-Math.PI/2+Math.PI*i/10;return [xc+(2.50/r)*r*Math.cos(a),cy+r*Math.sin(a)]});
const poly=[[2.73,cy-r],...arc,[2.78,cy+r]];
let planes=[[0,slope,ridge-slope*cy],[0,-slope,ridge+slope*cy]];
for(let k=0;k<=6;k++){let a=-Math.PI/2+k*Math.PI/6;planes.push([-slope*Math.cos(a),-slope*Math.sin(a),ridge+slope*(xc*Math.cos(a)+cy*Math.sin(a))]);}
const nave=roofed(poly,planes);
// Zadeldaktoren: BAG grondvlak en AHN nok NAP +20,1; nok loopt langs X.
const tower=roofed(rect(-1.88,-2.16,2.78,2.89),[[0,1.34,18.98-1.34*.36],[0,-1.34,18.98+1.34*.36]]);
let all=union([nave,tower]);
// Rondbogige blinde vensternissen; breedtes en ligging naar foto's geschat.
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const rad=w/2,spring=z1-rad;const profile=[[-rad,z0],[rad,z0],[rad,spring],[rad*.866,spring+rad*.5],[rad*.5,spring+rad*.866],[0,z1],[-rad*.5,spring+rad*.866],[-rad*.866,spring+rad*.5],[-rad,spring]];const pts=[];for(const [a,b] of profile)for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [6.7,10.8])cuts.push(niche(x,-3.55,1.1,1.5,4.7),niche(x,3.75,1.1,1.5,4.7));
for(const x of [-.8,1.2])cuts.push(niche(x,-2.30,.85,12.8,14.7),niche(x,2.30,.85,12.8,14.7));
for(const y of [-.6,1.2])cuts.push(niche(-2.05,y,.85,12.8,14.7,90));
cuts.push(niche(-2.05,.35,1.1,0,2.25,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'bartholomeuskerk-westhem',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Bartholomeuskerk Westhem',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-4],[-3,4],[4,-5],[12,-5],[18,0],[12,5]],replacesBuildings:['NL.IMBAG.Pand.0683100000294144'],description:'Zaalkerk met driezijdig gesloten koor onder schilddak en middeleeuwse zadeldaktoren met galmnissen; rondboogvensters en entree verdiept uitgewerkt.',realWorld:{groundNapM:ground,naveRidgeM:ridge,towerRidgeM:18.98},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000294144','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/39822','https://commons.wikimedia.org/wiki/Category:Bartholome%C3%BCskerk,_Westhem']}});

