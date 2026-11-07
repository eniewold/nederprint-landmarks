import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// RD-oorsprong in de westtoren; as naar het oosten, maten in meters.
const B=-.5,origin=[159942,578696],axis=[.9999,.013],ground=2.01;
const roofed=(poly,planes,z=40)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Schip en apsis: BAG-contour en dakvlakken van 3D BAG, nok NAP +17,1.
const poly=[[-1.4,-5.5],[26.3,-5.5],[28.9,-4.6],[31.35,-2.1],[31.35,2.1],[28.9,4.6],[26.3,5.5],[-1.4,5.5]];
const nave=roofed(poly,[[0,1.04,15.1],[0,-1.04,15.1],[-1.04,0,15.1+1.04*26.1]]);
// Portaalgevel en vierkant torenlichaam; spits uit AHN en foto's.
const tower=prism(rect(-1.6,-2.0,2.7,2.0),B,20.7);
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const center=[.5,0],oct=(r)=>circle(center,r,8,Math.PI/8);
const spire=loft(oct(2.15),20.5,oct(.45),30.24);
// Steunberen aan beide langsgevels met afgeschuinde beëindiging.
const buttresses=[];
for(const x of [4,8.4,13.1,17.8,22.1,26])for(const sign of [-1,1]){const y=sign*5.5;const poly=rect(x-.48,Math.min(y,y+sign*.9),x+.48,Math.max(y,y+sign*.9));buttresses.push(roofed(poly,[[0,-sign,7.0+sign*y]],8));}
// Vier gemetselde topgevels onder de spits, herkenbaar op de foto's.
const gables=[];
for(const [a,b] of [[-1.6,-.7],[1.8,2.7]])gables.push(hull([[a,-2,20],[a,2,20],[a,0,23],[b,-2,20],[b,2,20],[b,0,23]]));
for(const [a,b] of [[-2,-1.1],[1.1,2]])gables.push(hull([[-1.6,a,20],[2.7,a,20],[.5,a,23],[-1.6,b,20],[2.7,b,20],[.5,b,23]]));
let all=union([nave,tower,spire,...gables,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const rad=w/2;const pts=[];for(const [a,b] of [[-rad,z0],[rad,z0],[rad,z1-rad],[0,z1],[-rad,z1-rad]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [6.2,10.8,15.45,20,24.2])cuts.push(niche(x,-5.65,1.30,2.5,7.9),niche(x,4.85,1.30,2.5,7.9));
for(const y of [-.75,.75])cuts.push(niche(-1.0,y,.9,16.5,19.8,90));
for(const x of [-.3,1.25])cuts.push(niche(x,-2.15,.9,16.5,19.8),niche(x,1.35,.9,16.5,19.8));
cuts.push(niche(-1.0,0,1.45,0,3.0,90),niche(-1.0,0,1.35,8.5,12.9,90),niche(-.8,-3.9,1.0,4,7.3,90),niche(-.8,3.9,1.0,4,7.3,90),niche(31.5,0,1.2,2.7,7.6,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'andreaskerk-wijnaldum',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Andreaskerk Wijnaldum',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-7],[-3,7],[8,-8],[22,-8],[33,0],[20,8]],replacesBuildings:['NL.IMBAG.Pand.0072100000292329'],description:'Eenbeukige gotische kerk met polygonale koorsluiting, steunberen en spitsboogvensters; westgevel met ingebouwde toren en naaldspits.',realWorld:{groundNapM:ground,naveRidgeM:15.1,towerTopM:30.24},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0072100000292329','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/8670','https://commons.wikimedia.org/wiki/Category:Andreaskerk_(Wijnaldum)']}});


