import {union,hull,prism,rect,circle,ring3,dome,writeLandmark} from './efteling-kit.mjs';
// +X langs de as naar het koor, +Y naar de noordgevel; hoogten boven NAP +3,40 m.
const B=-0.5,origin=[178767.50,548646.02],axis=[0.99997,-0.0077];
const roofed=(poly,planes)=>{let s=prism(poly,B,35);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// BAG contour, schild naar het driezijdige koor; goten NAP +9,1 m en nok +13,9 m.
const nave=[[0.05,-4.12],[17.87,-4.12],[19.82,-1.80],[19.87,1.69],[17.96,3.85],[-.01,4.10]];
let parts=[roofed(nave,[[0,1.19,10.55],[0,-1.19,10.55],[-1.19,0,10.55+1.19*16.55]])];
// Westgevel met bakstenen torenvoet onder de achtkante houten dakruiter.
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
parts.push(box(-.15,-1.30,2.85,1.35,B,12.45));
const centre=[1.37,.03];
// Lantaarn gesloten uitgevoerd met blinde galmnissen voor printbaarheid; achtkantig dak volgt foto.
const oct=circle(centre,1.55,8,Math.PI/8);parts.push(prism(oct,12.35,14.25));
parts.push(dome(centre,[[1.52,14.20],[1.46,14.46],[1.25,14.72],[.85,14.98],[.35,15.15],[0,15.20]],8));
let all=union(parts);
// Rondboogvensters van de zijgevels en toegang als blinde nissen, ronding in vijf facetten.
const niche=(x,y,w,z0,z1,angle=0)=>{const r=w/2, spring=z1-r;const profile=[[-r,z0],[r,z0],[r,spring],[r*.866,spring+r*.5],[r*.5,spring+r*.866],[0,z1],[-r*.5,spring+r*.866],[-r*.866,spring+r*.5],[-r,spring]];const pts=[];for(const [a,b] of profile)for(const depth of [0,.75])pts.push([a,depth,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [5.1,9.3,13.5])cuts.push(niche(x,-4.48,1.45,1.55,4.85),niche(x,3.72,1.45,1.55,4.85));
cuts.push(niche(16.9,-4.48,1.0,0,2.4),niche(16.9,3.72,1.0,0,2.4));
cuts.push(niche(.22,0,1.25,0,2.75,90));
// Een venster in ieder schuin vlak van de koorsluiting.
cuts.push(niche(19.08,-3.15,1.25,1.55,4.85,50),niche(19.14,2.97,1.25,1.55,4.85,131));
// Wijzerplaten in de houten onderbouw aan de lange gevels.
cuts.push(niche(1.37,-1.66,1.05,10.72,11.8),niche(1.37,.99,1.05,10.72,11.8));
// Acht open lantaarnvlakken worden in de schaal blind verzonken; het dak blijft zelfdragend.
for(let k=0;k<8;k++){const a=Math.PI/4+2*Math.PI*k/8; const nx=Math.cos(a),ny=Math.sin(a);cuts.push(niche(centre[0]+nx*1.10,centre[1]+ny*1.10,.84,12.65,14.00,a*180/Math.PI-90));}
all=all.subtract(union(cuts));
await writeLandmark({slug:'johannestsjerke-sint-nicolaasga',base:B,nodes:[['building:kerk',all]],catalog:{name:'Johannestsjerke Sint Nicolaasga',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-2,-5],[6,-5],[16,-5],[21,0],[16,5],[0,5]],replacesBuildings:['NL.IMBAG.Pand.0051100001229622'],description:'Zaalkerk uit 1721 met driezijdig gesloten koor en schilddak, westgevel met achtkante klokkenlantaarn en koepeltje, rondboogvensters en toegang; open lantaarn op printschaal als blinde nissen.',realWorld:{groundNapM:3.4,roofRidgeM:10.55,domeTopM:15.2},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0051100001229622','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/13254','https://commons.wikimedia.org/wiki/Category:Protestantse_kerk,_Sint_Nicolaasga']}});
