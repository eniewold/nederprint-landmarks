import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.5, origin=[195691.2,598630], axis=[.991,.132];
const roofed=(poly,planes)=>{let s=prism(poly,B,60); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const nave=[[1.0,-5.4],[21,-5.4],[24.7,-4.8],[27.4,-2.2],[27.4,1.7],[25.4,4.8],[21.7,5.7],[1.0,5.7]];
// Nave and five-sided eastern closure; all roof faces remain planar.
const p=[roofed(nave,[[0,1.23,14.55],[0,-1.23,14.55],[-1.23,0,14.55+1.23*21.6]])];
// Partially inset west tower with the characteristic saddle roof.
p.push(box(-2.3,-2.3,2.7,3.45,B,17.1));
p.push(hull([[-2.3,-2.3,17.05],[2.7,-2.3,17.05],[2.7,3.45,17.05],[-2.3,3.45,17.05],[-2.3,.55,21.4],[2.7,.55,21.4]]));
let all=union(p);
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w/2;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
// Recessed Romanesque blind arches, actual small windows and side entrance.
for(const x of [4.0,6.8,9.6,12.4,15.2,18.0,20.8]) cuts.push(niche(x,-5.75,1.15,4.0,7.35),niche(x,5.2,1.15,4.0,7.35));
cuts.push(niche(4.2,-5.75,1.05,.0,3.5));
// The chancel has narrow windows in three closing faces.
cuts.push(niche(0,0,1.0,3.0,6.5).rotate([0,0,44]).translate([26.3,-3.6,0]));
cuts.push(niche(0,0,1.0,3.0,6.5).rotate([0,0,123]).translate([26.7,3.5,0]));
cuts.push(niche(27.7,0,1.0,3.0,6.5,'x'));
// Belfry openings at the upper part of each side of the tower.
cuts.push(niche(-1.9,.55,1.0,14.7,16.3,'x'),niche(3.0,.55,1.0,14.7,16.3,'x'));
cuts.push(niche(.2,-2.6,1.0,14.7,16.3),niche(.2,3.05,1.0,14.7,16.3));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-annakerk-hantumhuzen',base:B,nodes:[['building:kerk',all]],catalog:{name:'Sint-Annakerk Hantumhuzen',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-4],[3,-6],[20,-6],[-3,4],[20,6],[28,0]],replacesBuildings:['NL.IMBAG.Pand.0058100000203683'],description:'Romanogotische eenbeukige kerk uit de dertiende eeuw met vijfzijdige koorsluiting en deels ingebouwde zadeldaktoren.',realWorld:{groundNapM:2.151,ahnTowerNapM:23.54,modelTopM:21.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000203683','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/38700','https://commons.wikimedia.org/wiki/Category:Saint_Anne_Church_(Hantumhuzen)']}});

