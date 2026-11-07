import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[177701.5,576756], AX=[.9877,-.1564], parts=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,80);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
// East-west nave, with three facets of the five-sided chancel and planar roof faces.
const nave=[[0,-4.6],[20.3,-4.6],[23.3,-4.1],[26.5,-1.5],[26.5,1.5],[23.3,4.1],[20.3,4.6],[0,4.6]];
parts.push(roofed(nave,[[0,1.4,13.5],[0,-1.4,13.5],[-1.4,0,43.2]]));
// Square west tower and pyramidal spire; axis and silhouette follow the AHN raster.
parts.push(prism(rect(-3,-2.9,3,2.9),B,17.45));
parts.push(hull([[-3,-2.9,17.4],[3,-2.9,17.4],[3,2.9,17.4],[-3,2.9,17.4],[0,0,28.95]]));
// Distinctive two large buttresses on the southern facade and smaller chancel supports.
const butt=(x,y,h)=>hull([[x-.52,y-.45,B],[x+.52,y-.45,B],[x+.52,y+.45,B],[x-.52,y+.45,B],[x-.52,y-.05,h-1],[x+.52,y-.05,h-1],[x+.52,y+.45,h],[x-.52,y+.45,h]]);
for(const x of [5.2,13.7])parts.push(butt(x,-5.0,6.2));
parts.push(butt(22.5,-4.4,5.7),butt(22.5,4.4,5.7));
let all=union(parts);
const niche=(x,y,w,z0,z1,axis='y')=>{let t=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z1-w*.55],[w/2,0,z1-w*.55],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z1-w*.55],[w/2,1,z1-w*.55],[0,1,z1]]);if(axis==='x')t=t.rotate([0,0,90]);return t.translate([x,y,0]);};
const cuts=[];
for(const x of [3,8.5,11.3,16.2,19.5])cuts.push(niche(x,-5.2,1.2,2.7,6.6));
for(const x of [4,11.5,19])cuts.push(niche(x,4.1,1.15,2.6,6.4));
// Three shallow choir windows: the middle and south-east are visible on photographs.
cuts.push(niche(27,0,1.3,2.5,6.4,'x'));
for(const side of [-1,1])cuts.push(niche(0,0,1.2,2.5,6.3,'x').rotate([0,0,side*40]).translate([25.45,side*3.0,0]));
// Tower entrances and paired sound openings, cut as shallow pointed niches.
cuts.push(niche(-2.55,0,1.55,.2,4.1,'x'));
for(const x of [-1.35,1.35])cuts.push(niche(x,-3.3,1.05,13.1,16.6),niche(x,2.5,1.05,13.1,16.6));
for(const y of [-1.25,1.25])cuts.push(niche(-2.55,y,1.05,13.1,16.6,'x'),niche(3.4,y,1.05,13.1,16.6,'x'));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-margaretakerk-boksum',base:B,nodes:[['building:kerk',all]],catalog:{name:'Sint Margaretakerk Boksum',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[0,-7],[14,-7],[0,7],[14,7]],replacesBuildings:['NL.IMBAG.Pand.0083100000008523'],description:'Eenbeukige kerk met vijfzijdig koor, twee zware zuidelijke steunberen, vierkante westtoren en ingesnoerde spits. Ondiepe spitsboogvensters en galmgaten.',realWorld:{groundNapM:4.241,ahnTopNapM:33.196,modelTopM:28.95},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000008523','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/28584','https://commons.wikimedia.org/wiki/Category:Margaretakerk,_Boksum','https://aldefrysketsjerken.nl/boksum']}});
