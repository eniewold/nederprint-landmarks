import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
const B=-.5, origin=[165099,548242.5], axis=[-.931,.365];
const roofed=(poly,planes)=>{let s=prism(poly,B,50); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const nave=[[-1.3,-3.7],[16.2,-3.7],[18.4,-1.4],[18.4,1.7],[16.2,3.9],[-1.3,3.9]];
// Church nave with a hipped three-sided chancel.
const p=[roofed(nave,[[0,1.0,10.15],[0,-1.0,10.15],[-1.0,0,10.15+1.0*14.7]])];
// Connected hall occupies the southern part of the same BAG footprint, own roof.
p.push(roofed(rect(2.1,-9.7,17.5,-3.7),[[0,1.1,15.15],[0,-1.1,.65]]));
// Square belfry stands on the front gable; small recesses represent louvres.
p.push(box(-1.25,-1.4,1.45,1.4,8.65,12.65));
const oct=(r)=>circle([.1,0],r,8,Math.PI/8);
p.push(hull([...oct(1.55).map(([x,y])=>[x,y,12.2]),...oct(1.55).map(([x,y])=>[x,y,12.6]),...oct(1.2).map(([x,y])=>[x,y,13.1]),...oct(.48).map(([x,y])=>[x,y,19.45])]));
// Pediment framing the entrance on the front wall.
p.push(box(-1.7,-1.15,-1.15,1.15,B,3.1));
p.push(hull([[-1.7,-1.3,3.1],[-1.7,1.3,3.1],[-1.15,-1.3,3.1],[-1.15,1.3,3.1],[-1.7,0,3.85],[-1.15,0,3.85]]));
let all=union(p);
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w/2;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
for(const x of [2.7,6.2,9.7,13.2])cuts.push(niche(x,3.4,1.4,1.5,5.4));
for(const x of [3.0,6.0,9.0,12.0,15.0])cuts.push(niche(x,-10.0,1.1,1.4,3.8));
cuts.push(niche(-1.3,0,1.4,.0,2.8,'x'));
for(const y of [-.65,.65])cuts.push(niche(-.9,y,.55,10.15,11.95,'x'),niche(1.75,y,.55,10.15,11.95,'x'));
for(const x of [-.55,.75])cuts.push(niche(x,-1.7,.55,10.15,11.95),niche(x,1.1,.55,10.15,11.95));
all=all.subtract(union(cuts));
await writeLandmark({slug:'hervormde-kerk-elahuizen',base:B,nodes:[['building:kerk',all]],catalog:{name:'Hervormde Kerk Elahuizen',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-2,4],[6,4],[16,4],[-2,-4],[18,0],[10,-10]],replacesBuildings:['NL.IMBAG.Pand.0653100000148455'],description:'Waterstaatskerk uit 1864 met driezijdig koor, fronton, geveltoren en achtkantige spits, met aangebouwde kerkzaal.',realWorld:{groundNapM:.049,ahnTopNapM:19.552,modelTopM:19.45},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0653100000148455','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/21485','https://commons.wikimedia.org/wiki/Category:Kerk_van_Elahuizen']}});

