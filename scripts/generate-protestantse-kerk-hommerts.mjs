import {union,hull,prism,rect,spire,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[172659,555218.9], AX=[.99,.141], parts=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,60);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
// One hall with a three-sided chancel; roof slopes are continuous planes.
const hall=[[-.4,-6.2],[24.8,-6.2],[28.6,-2.4],[28.6,3],[24.8,6.9],[-.4,6.9]];
parts.push(roofed(hall,[...ridgeY(.35,16.7,.9),[-.9,0,16.7+.9*22.4]]));
// Half-embedded tower with four levels, steep spire and low entry buttresses.
parts.push(prism(rect(-2.8,-2.7,2.8,2.7),B,24.2));
parts.push(spire([0,0],2.65,24.1,42.7,8,Math.PI/8));
// Four raised triangular gables around the spire, each fully supported by the tower.
for(let a=0;a<360;a+=90)parts.push(hull([[-2.8,-2.1,24],[-1.8,-2.1,24],[-2.8,2.1,24],[-1.8,2.1,24],[-2.8,0,25.8],[-1.8,0,25.8]]).rotate([0,0,a]));
for(const side of [-1,1])parts.push(prism(rect(-1.2,side*5.25-.5,.5,side*5.25+.5),B,12));
let all=union(parts);
const niche=(u,w,z0,z1,axis,lo,hi)=>hull([[-w/2,z0],[w/2,z0],[-w/2,z1-w*.7],[w/2,z1-w*.7],[0,z1]].flatMap(([v,z])=>axis==='y'?[[u+v,lo,z],[u+v,hi,z]]:[[lo,u+v,z],[hi,u+v,z]]));
const cuts=[];
for(const x of [3,7.5,12,16.5,21])cuts.push(niche(x,1.3,3.0,10.3,'y',-6.6,-5.8),niche(x,1.3,3.0,10.3,'y',6.5,7.3));
cuts.push(niche(0,1.4,.1,4.5,'x',-3.1,-2.4));
for(const side of [-1,1])cuts.push(niche(0,1.3,17.6,22.6,'y',side>0?2.3:-3.1,side>0?3.1:-2.3));
cuts.push(niche(0,1.3,17.6,22.6,'x',-3.1,-2.4));
cuts.push(niche(0,1.0,14.6,15.6,'x',-3.1,-2.4));
cuts.push(niche(0,1.35,3.2,9.5,'x',28.1,29));
all=all.subtract(union(cuts));
await writeLandmark({slug:'protestantse-kerk-hommerts',base:B,nodes:[['building:kerk',all]],catalog:{name:'Protestantse Kerk Hommerts',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[-5,-8],[20,-8],[-5,8],[20,8]],replacesBuildings:['NL.IMBAG.Pand.0683100000291825'],description:'Johannes de Doperkerk: eenbeukige zaal met veelhoekige koorsluiting, half ingebouwde toren met spits en blinde rondboogvensters.',realWorld:{groundNapM:.341,ahnTopNapM:43.0273,modelTopM:42.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000291825','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/39787','https://commons.wikimedia.org/wiki/Category:Johannes_de_Doperkerk,_Hommerts']}});
