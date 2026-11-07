import {union,hull,prism,rect,circle,dome,spire,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[172105.7,578930.4], AX=[.9997,-.024], parts=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,80);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
const ridgeX=(x,z,k)=>[[k,0,z-k*x],[-k,0,z+k*x]];
// Nave with five-sided apse; the roof has planar slopes and a hipped east end.
const nave=[[5,-4.5],[37,-4.5],[41,-3],[44.5,-1],[44.5,1.5],[41,3.5],[37,5],[5,5]];
parts.push(roofed(nave,[...ridgeY(.25,17.65,1.45),[-1.45,0,17.65+1.45*39]]));
// Northern cross-wing and its independent saddle roof.
parts.push(roofed(rect(20.1,4.7,30.8,12.1),ridgeX(25.45,14.8,1.2)));
// The square tower and octagonal upper lantern are the distinctive landmark.
parts.push(prism(rect(-4.15,-4.5,4.8,4.5),B,19.7));
parts.push(prism(circle([0,0],4.45,8,Math.PI/8),19.5,31.6));
parts.push(hull([...circle([0,0],4.45,8,Math.PI/8).map(([x,y])=>[x,y,31.5]),...circle([0,0],1.8,8,Math.PI/8).map(([x,y])=>[x,y,35.1])]));
parts.push(prism(circle([0,0],1.8,8,Math.PI/8),35.1,37.6));
parts.push(dome([0,0],[[1.3,37.4],[1.6,37.9],[1.75,38.5],[1.65,39.1],[1.15,39.7],[.48,40.0]],8));
parts.push(spire([0,0],.5,39.9,42.8,8,Math.PI/8));
// Small north-east stair turret and steep roof.
parts.push(prism(rect(4.25,1.6,7.1,4.2),B,20.0));
parts.push(spire([5.67,2.9],1.4,19.9,24.7,4,Math.PI/4));
// Southern buttresses slope back to the masonry.
const butt=x=>hull([[x-.52,-5.25,B],[x+.52,-5.25,B],[x+.52,-4.3,B],[x-.52,-4.3,B],[x-.52,-4.8,7.5],[x+.52,-4.8,7.5],[x+.52,-4.3,8],[x-.52,-4.3,8]]);
for(const x of [9,15,21,27,33,37])parts.push(butt(x));
let all=union(parts);
const niche=(u,w,z0,z1,axis,lo,hi)=>hull([[-w/2,z0],[w/2,z0],[-w/2,z1-w*.7],[w/2,z1-w*.7],[0,z1]].flatMap(([v,z])=>axis==='y'?[[u+v,lo,z],[u+v,hi,z]]:[[lo,u+v,z],[hi,u+v,z]]));
const cuts=[];
for(const x of [12,18,24,30,35])cuts.push(niche(x,1.6,3.2,9.5,'y',-4.9,-4.2));
for(const y of [-2,0,2])cuts.push(niche(y,1.25,2,6.8,'x',-4.5,-3.8));
for(const y of [-2,2])cuts.push(niche(y,1.25,10.5,17.5,'x',-4.5,-3.8));
// East choir panels, and a single high pointed opening in the cross-wing.
cuts.push(niche(0,1.6,1.0,7.0,'x',44.0,45.0));
cuts.push(niche(25.45,1.7,3.2,9.5,'y',11.7,12.4));
for(const side of [-1,1])cuts.push(niche(0,1.35,3.0,9.0,'x',-.8,.2).rotate([0,0,side*36]).translate([42.7,side*2.7,0]));
// Shallow pointed louvres on the octagonal lantern, never cutting through.
for(let a=0;a<360;a+=45)cuts.push(niche(0,1.15,22.3,29.6,'y',3.4,4.8).rotate([0,0,a]));
all=all.subtract(union(cuts));
await writeLandmark({slug:'salviuskerk-dronryp',base:B,nodes:[['building:kerk',all]],catalog:{name:'Salviuskerk Dronryp',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[-6,-8],[20,-8],[-6,8],[20,13]],replacesBuildings:['NL.IMBAG.Pand.0083100000006198','NL.IMBAG.Pand.0083100000006225'],description:'Witgepleisterde kerk met dwarsarm en koorsluiting, vierkante toren, achtkantige klokkenlantaarn en peervormige bekroning.',realWorld:{groundNapM:3.0,ahnTopNapM:46.1374,modelTopM:42.8},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000006198','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000006225','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/28604','https://commons.wikimedia.org/wiki/Category:Salviuskerk_(Dronryp)']}});
