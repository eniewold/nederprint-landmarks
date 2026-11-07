import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// Kerkschip in +X; oorsprong in de westtoren, maten in meters.
const B=-.5,origin=[202731,434219.5],axis=[.996,-.088],ground=13.32;
const roofed=(poly,planes,z=45)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Schip met lagere zijbeuk onder een lang dak en hoger driezijdig koor.
const nave=roofed(rect(2.0,-6.58,17.0,6.04),[[0,1.18,17.0],[0,-1.18,17.0]]);
const choir=roofed([[16.6,-3.61],[27.38,-3.62],[30.73,-.67],[30.73,3.52],[27.67,6.25],[16.1,6.26]],[[0,1.48,19.2-1.48*1.32],[0,-1.48,19.2+1.48*1.32],[-1.48,0,19.2+1.48*27.5]]);
// Middeleeuwse vierkante toren met ingesnoerde achtzijdige spits (AHN NAP +52,16).
const tower=prism(rect(-2.64,-2.43,2.17,3.0),B,20.6),center=[-.23,.28];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const oct=r=>circle(center,r,8,Math.PI/8),sp=union([loft(rect(-2.64,-2.43,2.17,3.0),20.5,oct(1.5),21.5),loft(oct(1.5),21.5,oct(.45),38.84)]);
// Steunberen, aan de basis minimaal 0,9 m, met schuine beëindiging.
let buttresses=[];
for(const x of [5.4,9.4,13.8])for(const sign of [-1,1]){let y=sign<0?-6.58:6.04;buttresses.push(roofed(rect(x-.5,Math.min(y,y+sign*.95),x+.5,Math.max(y,y+sign*.95)),[[0,-sign,7+sign*y]],8));}
for(const x of [19,23,27])for(const sign of [-1,1]){let y=sign<0?-3.61:6.25;buttresses.push(roofed(rect(x-.5,Math.min(y,y+sign*.95),x+.5,Math.max(y,y+sign*.95)),[[0,-sign,8.6+sign*y]],10));}
let all=union([nave,choir,tower,sp,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [7.2,11.6,15.4])cuts.push(niche(x,-6.72,1.2,2.4,6.9),niche(x,5.35,1.2,2.4,6.9));
for(const x of [20.7,24.8])cuts.push(niche(x,-3.76,1.35,3.0,9.9),niche(x,5.55,1.35,3.0,9.9));
for(const x of [-1.05,.55])cuts.push(niche(x,-2.58,.9,15.5,18.5),niche(x,2.28,.9,15.5,18.5));
for(const y of [-.65,1.0])cuts.push(niche(-1.9,y,.9,15.5,18.5,90));
cuts.push(niche(-1.9,.28,1.3,0,3.0,90),niche(30.85,1.4,1.2,3.2,9.2,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'helenakerk-aerdt',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Helenakerk Aerdt',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-4,-5],[-4,5],[5,-8],[18,-8],[32,0],[20,8]],replacesBuildings:['NL.IMBAG.Pand.0196100000338082'],description:'Laatgotische kerk met lager schip en zijbeuk, hoger driezijdig gesloten koor, steunberen en een vierkante toren met slanke achtkantige spits.',realWorld:{groundNapM:ground,naveRidgeM:17.0,choirRidgeM:19.2,towerTopM:38.84},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0196100000338082','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/21959','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Aerdt']}});
