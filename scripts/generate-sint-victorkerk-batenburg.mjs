import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// Kerkas loopt vanaf de toren naar het koor in +X.
const B=-.5,origin=[171812,426019],axis=[-.934,.358],ground=9.215;
const roofed=(poly,planes,z=60)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Basiliek met hoog middenschip, twee zijbeuken en driezijdig gesloten koor.
const cy=-.95,nave=roofed(rect(2.3,-4.8,28.5,2.9),[[0,1.48,20.44-1.48*cy],[0,-1.48,20.44+1.48*cy]]);
const south=roofed(rect(2.2,-8.45,30,-4.65),[[0,1.12,14+1.12*4.65]]),north=roofed(rect(2.2,2.75,30,6.45),[[0,-1.12,14+1.12*2.75]]);
const choir=roofed([[27.7,-4.8],[30.5,-4.8],[32.6,-2.9],[32.6,.3],[30.5,2.4],[27.7,2.9]],[[0,1.48,20.1-1.48*cy],[0,-1.48,20.1+1.48*cy],[-1.48,0,20.1+1.48*29.3]]);
// Vierkante toren met kleine hoekaccenten en ingesnoerde achtkantige naaldspits.
const tower=prism(rect(-3.9,-4.45,2.45,2.4),B,30.2),centre=[-.72,-1.03];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]),oct=r=>circle(centre,r,8,Math.PI/8);
const spire=union([loft(rect(-3.9,-4.45,2.45,2.4),30.1,oct(2.1),31.2),loft(oct(2.1),31.2,oct(.45),50.92)]);
const buttresses=[];for(const x of [-3.35,1.9])for(const y of [-3.9,1.85])buttresses.push(prism(rect(x-.5,y-.5,x+.5,y+.5),B,30.8));
for(const x of [5,9,13.3,17.6,21.9,26])for(const sign of [-1,1]){const y=sign<0?-8.45:6.45;buttresses.push(roofed(rect(x-.5,Math.min(y,y+sign*.9),x+.5,Math.max(y,y+sign*.9)),[[0,-sign,8.2+sign*y]],9));}
let all=union([nave,south,north,choir,tower,spire,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [7.0,11.1,15.4,19.7,24])cuts.push(niche(x,-8.6,1.15,2.6,7.6),niche(x,5.75,1.15,2.6,7.6));
for(const x of [7.0,11.1,15.4,19.7,24])cuts.push(niche(x,-4.95,1.0,14.5,17.5),niche(x,2.2,1.0,14.5,17.5));
for(const x of [-2.4,-.7,1.0])cuts.push(niche(x,-4.6,.9,25,28.8),niche(x,1.7,.9,25,28.8));
for(const y of [-2.5,-.8,.9])cuts.push(niche(-3.15,y,.9,25,28.8,90));
cuts.push(niche(-3.15,-.95,1.4,0,3.6,90),niche(-3.15,-.95,1.25,8,13,90),niche(32.75,-.95,1.2,4.0,10,90),niche(31.62,-3.92,1.0,4,10,42),niche(31.62,1.42,1.0,4,10,135));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-victorkerk-batenburg',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Sint Victorkerk Batenburg',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-6,-6],[-6,4],[8,-11],[25,-11],[34,0],[18,9]],replacesBuildings:['NL.IMBAG.Pand.0296100000000976'],description:'Rooms-katholieke neogotische basiliek met twee zijbeuken, driezijdig koor en westtoren met ingesnoerde spits.',realWorld:{groundNapM:ground,naveRidgeM:20.44,towerTopM:50.92},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0296100000000976','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/8718','https://commons.wikimedia.org/wiki/Category:Sint-Victorkerk,_Batenburg_(Roman_Catholic)']}});

