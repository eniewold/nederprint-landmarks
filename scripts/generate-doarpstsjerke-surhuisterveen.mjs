import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// Surhuisterveen: gebouwstelsel langs de nok naar het koor (RD +20,50 graden).
// BAG-contour en dakvlakken uit 3D BAG, AHN voor de dakruiter; zie README.
const B=-0.5, origin=[206815.8,577504.0], axis=[0.93669646,0.35014245];
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const roofed=(poly,planes)=>{let s=prism(poly,B,40);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// BAG: westelijke topgevel, twee lange wanden en driezijdige koorsluiting.
const outline=[[-7.77,3.94],[-7.71,-3.62],[6.81,-3.62],[9.12,-1.33],[9.18,1.87],[6.75,3.97]];
const facet=([x0,y0],[x1,y1],z,t,[ix,iy])=>{const l=Math.hypot(x1-x0,y1-y0);let nx=-(y1-y0)/l,ny=(x1-x0)/l;if(nx*(ix-x0)+ny*(iy-y0)<0){nx=-nx;ny=-ny}return [t*nx,t*ny,z-t*(nx*x0+ny*y0)]};
// Vlakke dakhellingen; nok +10,64 m en goot +6,16 m boven maaiveld.
let parts=[roofed(outline,[[0,1.18,10.44],[0,-1.18,10.84],facet(outline[2],outline[3],6.16,1.18,[4,0]),facet(outline[3],outline[4],6.16,1.18,[4,0]),facet(outline[4],outline[5],6.16,1.18,[4,0])])];
// Vierkante dakruiter bij de westgevel. De spits is als vier vlakken gebouwd;
// de bovenste 0,9 m brede doorsnede houdt de fragiele punt printbaar op 1:1000.
parts.push(box(-7.55,-.95,-5.45,1.15,B,12.42));
parts.push(hull([[-7.55,-.95,12.40],[-5.45,-.95,12.40],[-5.45,1.15,12.40],[-7.55,1.15,12.40],[-7.75,-1.15,12.6],[-5.25,-1.15,12.6],[-5.25,1.35,12.6],[-7.75,1.35,12.6]]));
parts.push(hull([[-7.75,-1.15,12.58],[-5.25,-1.15,12.58],[-5.25,1.35,12.58],[-7.75,1.35,12.58],[-6.95,-.35,17.2],[-6.05,-.35,17.2],[-6.05,.55,17.2],[-6.95,.55,17.2]]));
let all=union(parts);
// Spitsboogvensters en ingangen als blinde nissen (0,35 m diep).
const niche=(x,y,w,z0,z1,ang=0)=>{const r=w/2,z=z1-r*.85,pts=[[-r,z0],[r,z0],[r,z],[0,z1],[-r,z]];return hull(pts.flatMap(([u,v])=>[[u,0,v],[u,.7,v]])).rotate([0,0,ang]).translate([x,y,0])};
const cuts=[];
for(const x of [-3.85,.35,4.55]){cuts.push(niche(x,-3.98,1.45,1.8,5.68),niche(x,3.60,1.45,1.8,5.68));}
// Zuidelijke toegang met klein raam erboven, noordelijke eerste kleine venster.
cuts.push(niche(-6.15,-3.98,1.45,0,2.8),niche(-6.15,-3.98,.95,3.65,5.3),niche(-6.15,3.60,.95,3.65,5.3));
// Venster in zuidoostelijk koorvlak en drie kleine ronde westgevelopeningen.
cuts.push(niche(8.0,-2.86,1.2,2,5.7,-45),niche(-7.42,-1.7,.9,2.8,3.7,90),niche(-7.42,1.5,.9,4.1,5.0,90),niche(-7.42,0,.9,6.9,7.8,90));
// Galmgaten van dakruiter zijn ondiep, de hoeken blijven gesloten.
cuts.push(niche(-6.5,-1.30,1.1,10.83,12.13),niche(-6.5,.80,1.1,10.83,12.13),niche(-7.2,.1,1.1,10.83,12.13,90),niche(-5.8,.1,1.1,10.83,12.13,270));
all=all.subtract(union(cuts));
await writeLandmark({slug:'doarpstsjerke-surhuisterveen',base:B,nodes:[['building:kerk',all]],catalog:{name:'Doarpstsjerke Surhuisterveen',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-9,-5],[0,-5],[10,-5],[-9,5],[0,5],[10,5]],replacesBuildings:['NL.IMBAG.Pand.0059100000824311'],description:'Zaalkerk met driezijdige koorsluiting, zadeldak en vierkante dakruiter met vierzijdige spits; vensters en galmgaten als blinde nissen.',realWorld:{groundNapM:1.127,naveRidgeNapM:11.79,ahnObservedSpireNapM:16.56,modelTopM:17.2},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000824311','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/7050','https://commons.wikimedia.org/wiki/File:7050_dorpskerk_surhuisterveen.jpg','https://www.pkn-surhuisterveen.nl/over-ons/doarpstsjerke/']}});



