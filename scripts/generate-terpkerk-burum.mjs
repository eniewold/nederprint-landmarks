import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.65, origin=[211190.9,587771.3], axis=[.942,.3356];
const roofed=(poly,planes)=>{let s=prism(poly,B,70); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
// Church body, a gabled nave with three-sided eastern chancel and sloped hipped roof.
const nave=[[-2.15,-5.25],[22.8,-5.25],[25.8,-2.1],[25.8,1.85],[22.8,5.05],[-2.15,5.05]];
const p=[roofed(nave,[[0,1.25,13.87],[0,-1.25,13.87],[-1.25,0,13.87+1.25*22.2]])];
// Square western tower rises from roof, with bevelled cornice and printable spire.
p.push(box(-2.35,-2.05,2.15,2.05,B,17.38));
p.push(hull([[-2.35,-2.05,16.9],[2.15,-2.05,16.9],[2.15,2.05,16.9],[-2.35,2.05,16.9],[-2.55,-2.25,17.12],[2.35,-2.25,17.12],[2.35,2.25,17.12],[-2.55,2.25,17.12],[-2.55,-2.25,17.34],[2.35,-2.25,17.34],[2.35,2.25,17.34],[-2.55,2.25,17.34]]));
p.push(hull([[-2.35,-2.05,17.3],[2.15,-2.05,17.3],[2.15,2.05,17.3],[-2.35,2.05,17.3],[-.55,-.45,27.82],[.35,-.45,27.82],[.35,.45,27.82],[-.55,.45,27.82]]));
let all=union(p);
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w/2;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
// Three large church windows per side and two modest south doors.
for(const x of [7.5,13.2,18.9]) cuts.push(niche(x,-5.6,1.8,2.25,6.45),niche(x,4.65,1.8,2.25,6.45));
cuts.push(niche(3.15,-5.6,1.0,.0,2.5));
// Two visible chancel windows on the diagonal faces.
cuts.push(niche(0,0,1.8,2.25,6.45).rotate([0,0,46]).translate([24.65,-3.95,0]));
cuts.push(niche(0,0,1.8,2.25,6.45).rotate([0,0,134]).translate([24.65,3.95,0]));
// Recessed tower sound openings, accessible from all four sides.
cuts.push(niche(-.1,-2.5,1.2,14.15,16.05),niche(-.1,1.65,1.2,14.15,16.05),niche(-1.95,0,1.2,14.15,16.05,'x'),niche(2.55,0,1.2,14.15,16.05,'x'));
all=all.subtract(union(cuts));
await writeLandmark({slug:'terpkerk-burum',base:B,nodes:[['building:kerk',all]],catalog:{name:'Terpkerk Burum',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-6],[4,-6],[19,-6],[-3,6],[19,6],[27,0]],replacesBuildings:['NL.IMBAG.Pand.0079100000357389'],description:'Driezijdig gesloten zaalkerk op een terp, met ingebouwde westtoren, slanke vierzijdige spits en hoge rondboogvensters.',realWorld:{groundNapM:2.634,ahnTopNapM:30.457,modelTopM:27.82},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0079100000357389','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/23745','https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Burum)']}});

