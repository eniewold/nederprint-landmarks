import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
const B=-.5, origin=[187186.8,557767.8], axis=[.99999,.004];
const roofed=(poly,planes)=>{let s=prism(poly,B,50); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const nave=[[-1.3,-4.35],[12.1,-4.3],[15.95,-2.0],[15.75,2.6],[12.0,4.7],[-1.3,4.6]];
const p=[roofed(nave,[[0,1.33,12.65],[0,-1.33,12.65],[-1.33,0,12.65+1.33*11.7]])];
// Compact square belfry on the front gable with an eight-faced taper.
p.push(box(-1.3,-1.3,1.35,1.3,10.1,14.6));
const oct=(r)=>circle([0,0],r,8,Math.PI/8);
p.push(hull([...oct(1.48).map(([x,y])=>[x,y,14.55]),...oct(1.10).map(([x,y])=>[x,y,15.0]),...oct(.48).map(([x,y])=>[x,y,22.65])]));
let all=union(p);
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w/2;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
for(const x of [3,7,11]) cuts.push(niche(x,-4.65,1.35,1.75,5.3),niche(x,4.1,1.35,1.75,5.3));
cuts.push(niche(0,-4.65,1.0,.0,2.65));
// The chancel has a high window on each angled face.
cuts.push(niche(0,0,1.35,1.75,5.3).rotate([0,0,31]).translate([14.3,-3.22,0]));
cuts.push(niche(0,0,1.35,1.75,5.3).rotate([0,0,151]).translate([14.2,3.7,0]));
for(const y of [-.45,.45])cuts.push(niche(-.9,y,.65,12.6,14.1,'x'));
for(const x of [-.45,.45])cuts.push(niche(x,-1.6,.65,12.6,14.1),niche(x,.9,.65,12.6,14.1));
all=all.subtract(union(cuts));
await writeLandmark({slug:'de-kapelle-haskerdijken',base:B,nodes:[['building:kerk',all]],catalog:{name:'De Kapelle Haskerdijken',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-2,-5],[4,-5],[12,-5],[-2,5],[12,5],[17,0]],replacesBuildings:['NL.IMBAG.Pand.0051100001221441'],description:'Kapel uit 1818 met driezijdig koor, hoge rondboogvensters en kleine westelijke geveltoren met ingesnoerde spits.',realWorld:{groundNapM:1.101,ahnTopNapM:23.762,modelTopM:22.65},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0051100001221441','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/20847','https://commons.wikimedia.org/wiki/Category:Kapelle,_Haskerdijken']}});

