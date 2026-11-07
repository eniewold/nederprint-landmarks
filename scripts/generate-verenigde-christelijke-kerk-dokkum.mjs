import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[195579.5,593419], AX=[.989,-.147], parts=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,60);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
// Hall and neoclassical front volume under a continuous gabled roof.
parts.push(roofed(rect(-3.65,-4.0,19.1,5.2),ridgeY(.6,11.6,.84)));
// Low eastern ancillary volume belongs to the same BAG building.
parts.push(roofed(rect(18.8,-4.1,24.1,5.3),ridgeY(.6,5.1,.16)));
// Square clock drum and open belfry are supported by the front pediment.
parts.push(prism(rect(-3.1,-.9,-.1,2.1),9.5,19.25));
parts.push(hull([[-3.1,-.9,19.2],[-.1,-.9,19.2],[-.1,2.1,19.2],[-3.1,2.1,19.2],[-1.6,.6,20.4]]));
let all=union(parts);
// Openings have pointed tops so that the belfry roof prints without support.
const opening=(u,w,z0,z1,axis,lo,hi)=>hull([[-w/2,z0],[w/2,z0],[-w/2,z1-w*.7],[w/2,z1-w*.7],[0,z1]].flatMap(([v,z])=>axis==='y'?[[u+v,lo,z],[u+v,hi,z]]:[[lo,u+v,z],[hi,u+v,z]]));
const cuts=[];
cuts.push(opening(-1.6,1.0,15.8,19.1,'y',-1.2,2.4),opening(.6,1.0,15.8,19.1,'x',-3.4,.2));
// Front facade: three blind round-arch fields, with a narrower central entry.
for(const y of [-2.35,.6,3.55])cuts.push(opening(y,1.45,1.2,6.5,'x',-4.0,-3.25));
// A simplified clock face is a shallow inset, preserving the enclosing mass.
cuts.push(opening(.6,1.05,12.4,13.55,'x',-3.4,-2.8));
for(const x of [3.1,7.3,11.5,15.7])cuts.push(opening(x,1.4,3.1,6.9,'y',-4.4,-3.8),opening(x,1.4,3.1,6.9,'y',4.8,5.5));
all=all.subtract(union(cuts));
await writeLandmark({slug:'verenigde-christelijke-kerk-dokkum',base:B,nodes:[['building:kerk',all]],catalog:{name:'Verenigde christelijke kerk Dokkum',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[-5,-6],[15,-6],[-5,7],[15,7]],replacesBuildings:['NL.IMBAG.Pand.0058100000212970'],description:'Neoclassicistische zaalkerk uit 1852 met drie gevelvelden, fronton, vierkante uurwerktoren en opengewerkte klokkenkamer met aangepaste spitsbogen.',realWorld:{groundNapM:1.699,ahnTopNapM:23.9102,modelTopM:20.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000212970','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/13153','https://commons.wikimedia.org/wiki/Category:Verenigde_christelijke_kerk,_Dokkum']}});
