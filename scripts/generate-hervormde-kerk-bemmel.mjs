import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X langs de kerk naar het koor, oorsprong bij de westtoren.
const B=-.5,origin=[190071,433358.5],axis=[.995,.099],ground=12.411;
const roofed=(poly,planes,z=35)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Schip en driezijdige sluiting onder schilddak; zuidkapel heeft een dwarsdak.
const poly=[[2.2,-5.75],[21.2,-5.75],[21.2,-3.78],[22.92,-3.76],[25.06,-1.06],[25.06,1.21],[22.58,4.06],[19.0,4.02],[19,5.97],[2.2,5.83]];
const nave=roofed(poly,[[0,1.0,13.0],[0,-1.0,13.0],[-1.05,0,13+1.05*21.4]]);
const chapel=roofed(rect(14.9,-10.2,21.25,-5.0),[[1.55,0,12.5-1.55*18.075],[-1.55,0,12.5+1.55*18.075]]);
// Vierkante toren met laag ingesnoerd tentdak; 3D BAG en AHN bepalen de hoogte.
const tower=prism(rect(-2.0,-2.54,2.45,2.95),B,18.1),c=[.2,.2];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const roof=loft(rect(-2,-2.54,2.45,2.95),18.0,rect(c[0]-.45,c[1]-.45,c[0]+.45,c[1]+.45),23.30);
let all=union([nave,chapel,tower,roof]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [5.1,9.2,13.3])cuts.push(niche(x,-5.9,1.15,2.0,6.0),niche(x,5.13,1.15,2.0,6.0));
cuts.push(niche(18.1,-10.35,1.55,2.5,7.8));
for(const x of [-.85,.75])cuts.push(niche(x,-2.69,.9,14.5,17.1),niche(x,2.25,.9,14.5,17.1));
for(const y of [-.7,1.0])cuts.push(niche(-1.3,y,.9,14.5,17.1,90));
cuts.push(niche(-1.3,.2,1.3,0,2.5,90),niche(25.2,.1,1.0,2.5,6.7,90),niche(24.07,-2.47,1.0,2.5,6.7,52),niche(23.90,2.70,1.0,2.5,6.7,131));
all=all.subtract(union(cuts));
await writeLandmark({slug:'hervormde-kerk-bemmel',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Hervormde Kerk Bemmel',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-4,-4],[-4,4],[8,-8],[17,-12],[27,0],[12,8]],replacesBuildings:['NL.IMBAG.Pand.1705100000003185'],description:'Laatgotische kerk met driezijdig koor, zuidkapel met dwarsdak en oudere vierkante westtoren met laag tentdak.',realWorld:{groundNapM:ground,naveRidgeM:13.0,towerTopM:23.30},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000003185','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/8937','https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Bemmel']}});

