import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X oostzuidoost en +Y noordoost, oorsprong bij zuidelijke hoek van het hoofdbouwdeel.
const B=-.5,origin=[213827.67,432142.60],axis=[.9846,.1753],ground=16.355;
const roofed=(poly,planes,z=28)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Kerkzaal en haakse vleugel als twee bouwdelen met zadeldaken; BAG en 3D BAG geven de dakvlakken.
const main=roofed(rect(0,0,7.98,18.95),[[1.95,0,17.75-1.95*3.99],[-1.95,0,17.75+1.95*3.99]]);
const wing=roofed([[-7.35,4.05],[.15,4.05],[.35,18.95],[-9.16,19.22]],[[0,1.10,18.05-1.10*11.60],[0,-1.10,18.05+1.10*11.60]]);
let all=union([main,wing]);
const niche=(x,y,w,z0,z1,angle=0,depth=.9)=>{const rad=w/2;const pts=[];for(const [a,b] of [[-rad,z0],[rad,z0],[rad,z1-rad],[0,z1],[-rad,z1-rad]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
// Gotisch kerkraam en ingangsportaal in de zuidelijke kopgevel; zijvensters.
cuts.push(niche(4,-.15,1.45,5.2,9.4),niche(4,-.15,1.8,0,3.4),niche(4,-.15,.95,12.0,13.5));
for(const y of [4.1,9.0,14.1])cuts.push(niche(8.10,y,1.25,3.4,8.8,90));
// Vleugel: rechthoekige vensters en portalen volgens de foto's, tot blinde nissen vereenvoudigd.
for(const x of [-5.5,-2.3])cuts.push(niche(x,3.9,1.3,1.0,3.3),niche(x,3.9,1.2,5.0,7.4));
cuts.push(niche(-8.5,16.8,1.35,0,2.8,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-pancras-en-joriskerk-s-heerenberg',base:B,nodes:[['building:kerk-en-vleugel',all]],catalog:{name:"Sint-Pancras en Joriskerk 's-Heerenberg",origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-11,3],[-11,20],[2,-2],[10,-2],[10,20],[-2,21]],replacesBuildings:['NL.IMBAG.Pand.1955100000004067'],description:'Laatgotische kerk met haakse vleugel en twee hoge zadeldaken, puntgevels, spitsboogvensters en portaal; voormalige slotkapel naast Huis Bergh.',realWorld:{groundNapM:ground,mainRidgeM:17.75,wingRidgeM:18.05},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1955100000004067','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/9271',"https://commons.wikimedia.org/wiki/Category:Sint-Pancras_en_Joriskerk_('s-Heerenberg)"]}});



