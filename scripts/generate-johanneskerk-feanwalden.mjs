import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[195349.5,583794.3], AX=[.9985,.055], parts=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,60);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
// Hall and its polygonal east end share continuous, planar roof slopes.
const hall=[[-1.7,-4.1],[14.8,-4.1],[17.5,-2.1],[17.5,1.6],[14.8,4.1],[-1.7,4.1]];
parts.push(roofed(hall,[...ridgeY(0,11.4,1.4),[-1.4,0,11.4+1.4*13.6]]));
// Built-in west tower: square brickwork topped by its characteristic saddle roof.
parts.push(prism(rect(-1.7,-1.8,1.2,1.8),B,14.3));
parts.push(roofed(rect(-1.7,-1.8,1.2,1.8),ridgeY(0,16.6,1.28)));
let all=union(parts);
const niche=(u,w,z0,z1,axis,lo,hi)=>hull([[-w/2,z0],[w/2,z0],[-w/2,z1-w*.7],[w/2,z1-w*.7],[0,z1]].flatMap(([v,z])=>axis==='y'?[[u+v,lo,z],[u+v,hi,z]]:[[lo,u+v,z],[hi,u+v,z]]));
const cuts=[];
for(const x of [3.1,7.1,11.1])cuts.push(niche(x,1.1,2.3,5.3,'y',-4.4,-3.7),niche(x,1.1,2.3,5.3,'y',3.7,4.4));
cuts.push(niche(13.3,1.1,.1,4.0,'y',-4.4,-3.7));
cuts.push(niche(0,1.15,.1,3.5,'x',-2.1,-1.3));
for(const side of [-1,1])cuts.push(niche(-.25,.9,11.1,13.1,'y',side>0?1.45:-2.1,side>0?2.1:-1.45));
cuts.push(niche(0,.9,11.1,13.1,'x',-2.1,-1.3));
// Three blind windows in the eastern closure.
cuts.push(niche(0,1.1,2.1,5.0,'x',17,17.8));

all=all.subtract(union(cuts));

await writeLandmark({slug:'johanneskerk-feanwalden',base:B,nodes:[['building:kerk',all]],catalog:{name:'Johanneskerk Feanwâlden',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[-3,-6],[12,-6],[-3,6],[12,6]],replacesBuildings:['NL.IMBAG.Pand.1891100001636219'],description:'Eenbeukige zaalkerk met afgeschuind koor en ingebouwde westtoren onder zadeldak. Gevels met vereenvoudigde spitsboogvensters en toegangen.',realWorld:{groundNapM:1.503,ahnTopNapM:18.0921,modelTopM:16.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1891100001636219','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/11701','https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Feanwâlden']}});
