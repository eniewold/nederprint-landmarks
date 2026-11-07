import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// Kerkas naar koor in +X; oorsprong in de toren. Alle maten in meters.
const B=-.5,origin=[168677,426973],axis=[-.27,.963],ground=6.664;
const roofed=(poly,planes,z=50)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Basiliek met hoog middenschip en twee lagere zijbeuken onder lessenaarsdaken.
const cy=-1.25,nave=roofed(rect(3.3,-4.8,26,2.3),[[0,1.48,20.44-1.48*cy],[0,-1.48,20.44+1.48*cy]]);
const south=roofed(rect(3.2,-8.65,26,-4.65),[[0,1.12,13.15+1.12*4.65]]),north=roofed(rect(3.2,2.15,26,6.7),[[0,-1.12,13.15+1.12*2.15]]);
// Versmald driezijdig koor met afgeschuind schild.
const choir=roofed([[25.6,-5.3],[30.5,-5.3],[32.5,-2.1],[32.5,.8],[30.5,3.2],[25.6,3.2]],[[0,1.42,19.4-1.42*cy],[0,-1.42,19.4+1.42*cy],[-1.42,0,19.4+1.42*28.5]]);
const annex=roofed(rect(3,6.5,10.6,10.1),[[0,-1.1,9.4+1.1*6.5]]);
// Vierkante toren met ingesnoerde achtzijdige spits; top AHN NAP +49,08.
const tower=prism(rect(-2.3,-3.9,3.5,1.72),B,25.0),centre=[.6,-1.1];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]),oct=r=>circle(centre,r,8,Math.PI/8);
const spire=union([loft(rect(-2.3,-3.9,3.5,1.72),24.9,oct(1.7),25.8),loft(oct(1.7),25.8,oct(.45),42.42)]);
// Lage polygonale doopkapel naast de toren, met tentdak.
const baptCenter=[1.7,-4.45],baptRing=circle(baptCenter,1.75,8,Math.PI/8),baptTop=circle(baptCenter,.45,8,Math.PI/8);
const baptistery=union([prism(baptRing,B,7.3),loft(baptRing,7.2,baptTop,8.7)]);
const buttresses=[];
for(const x of [6,10.5,15.0,19.5,24])for(const sign of [-1,1]){const y=sign<0?-8.65:6.7;buttresses.push(roofed(rect(x-.5,Math.min(y,y+sign*.95),x+.5,Math.max(y,y+sign*.95)),[[0,-sign,7.3+sign*y]],8));}
let all=union([nave,south,north,choir,annex,tower,spire,baptistery,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [8.2,12.7,17.2,21.7])cuts.push(niche(x,-8.8,1.2,2.1,7)); for(const x of [12.7,17.2,21.7])cuts.push(niche(x,6.0,1.2,2.1,7));
for(const x of [8.2,12.7,17.2,21.7])cuts.push(niche(x,-4.95,1.1,14,17),niche(x,1.6,1.1,14,17));
for(const x of [-1.05,.55,2.15])cuts.push(niche(x,-4.05,.9,19.8,23.3),niche(x,1.0,.9,19.8,23.3));
for(const y of [-2.55,-.95,.65])cuts.push(niche(-1.6,y,.9,19.8,23.3,90));
cuts.push(niche(-1.6,-1.1,1.55,0,3.5,90),niche(-1.6,-1.1,1.35,7,12.0,90),niche(32.65,-1.0,1.1,3,8.5,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-servatiuskerk-appeltern',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Sint-Servatiuskerk Appeltern',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-4,-6],[-4,4],[8,-10],[25,-11],[34,0],[15,12]],replacesBuildings:['NL.IMBAG.Pand.0668100000004609'],description:'Neogotische basiliek met twee lage zijbeuken, driezijdig gesloten koor en westtoren met ingesnoerde achtkantige spits.',realWorld:{groundNapM:ground,naveRidgeM:20.44,towerTopM:42.42},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0668100000004609','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/523081','https://commons.wikimedia.org/wiki/Category:Sint-Servatiuskerk,_Appeltern']}});



