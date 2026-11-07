import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// RD-oorsprong in de toren; X langs de as van de kerk naar het oosten, maten in meters.
const B=-.5,origin=[170977,544690],axis=[.9863,.165],ground=1.91;
const roofed=(poly,planes)=>{let s=prism(poly,B,45);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Schip met driezijdige koorsluiting, gevel en nok afgeleid uit BAG en 3D BAG.
const navePoly=[[4.9,-4.0],[22.64,-3.93],[27.7,-1.59],[27.65,3.95],[22.67,6.31],[4.96,6.35]];
const nave=roofed(navePoly,[[0,1.16,12.70-1.16*1.1],[0,-1.16,12.70+1.16*1.1],[-1.3,0,12.7+1.3*22.3]]);
// Forse westelijke zadeldaktoren; de nok loopt langs X, hoogte uit AHN DSM.
const tower=roofed(rect(-3.58,-3.85,4.96,5.82),[[0,1.60,35.94-1.60*.98],[0,-1.60,35.94+1.60*.98]]);
let all=union([nave,tower]);
// Blinde spitsboogvensters en galmgaten naar foto's, vereenvoudigd voor de print.
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const rad=w/2;const pts=[];for(const [a,b] of [[-rad,z0],[rad,z0],[rad,z1-rad],[0,z1],[-rad,z1-rad]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [8.0,12.1,16.2,20.3])cuts.push(niche(x,-4.15,1.15,1.6,5.6),niche(x,5.75,1.15,1.6,5.6));
for(const x of [-1.7,.65,3.0])cuts.push(niche(x,-4.00,1.1,24.2,27.7),niche(x,5.22,1.1,24.2,27.7));
for(const y of [-1.35,1.0,3.35])cuts.push(niche(-3.75,y,1.1,24.2,27.7,90));
cuts.push(niche(-3.75,1.0,1.25,0,2.7,90),niche(27.85,1.1,1.3,1.6,5.6,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'vaste-burchtkerk-wijckel',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Vaste Burchtkerk Wijckel',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-5,-5],[-5,7],[5,-6],[18,-6],[29,1],[18,8]],replacesBuildings:['NL.IMBAG.Pand.0653100000148996'],description:'Zaalkerk met driezijdige koorsluiting en forsere middeleeuwse zadeldaktoren, spitsboogvensters en drievoudige galmnissen.',realWorld:{groundNapM:ground,naveRidgeM:12.70,towerRidgeM:35.94},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0653100000148996','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/15938','https://commons.wikimedia.org/wiki/Category:Vaste_Burchtkerk_(Wijckel)']}});

