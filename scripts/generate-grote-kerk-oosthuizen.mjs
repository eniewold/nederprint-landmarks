import {union,hull,prism,rect,circle,dome,spire,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[128241,509321.5], AX=[.9962,-.0872], pieces=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,80);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
const ridgeX=(x,z,k)=>[[k,0,z-k*x],[-k,0,z+k*x]];
// Schip en koor: twee dakvlakken met vijfzijdige sluiting tegen de oostgevel.
const nave=[[-17.5,-5.8],[15.3,-5.8],[18.1,-4.1],[20.2,-1.6],[20.2,1.4],[18.1,4.1],[15.3,5.8],[-17.5,5.8]];
pieces.push(roofed(nave,[...ridgeY(0,18.5,1.3),[-1.3,0,18.5+1.3*16.4]]));
// Dwarspand met dezelfde nokhoogte en twee topgevels.
pieces.push(roofed(rect(-5.8,-16.3,5.8,16.3),ridgeX(0,19.0,1.38)));
// Kruisingstoren: achtkant met blinde openingen; de open kroon wordt een printbare peer.
pieces.push(prism(circle([0,0],1.5,8,Math.PI/8),17.2,22.0));
pieces.push(spire([0,0],1.55,21.9,23.5,8,Math.PI/8));
pieces.push(dome([0,0],[[.5,23.2],[1.0,23.7],[1.2,24.1],[1.0,24.6],[.5,25.5]],8));
// Regelmatige steunberen langs zijden en aan de koppen van het dwarsschip.
const butt=(x0,y0,x1,y1,h)=>hull([[x0,y0,B],[x1,y0,B],[x1,y1,B],[x0,y1,B],[x0,y0,h-1],[x1,y0,h-1],[x1,y1,h],[x0,y1,h]]);
for(const x of [-16.8,-11.7,-6.3,6.4,11.4,15.3])for(const s of [-1,1]) {const y=s*6.1;pieces.push(butt(x-.52,y-.5,x+.52,y+.5,7.8));}
for(const y of [-15.9,-10.8,10.8,15.9])for(const s of [-1,1]){const x=s*6.15;pieces.push(butt(x-.5,y-.52,x+.5,y+.52,7.8));}
// Steunberen rond de vijfzijdige koorsluiting.
for(const [x,y] of [[15.3,-5.8],[18.1,-4.1],[20.1,-1.6],[20.1,1.4],[18.1,4.1],[15.3,5.8]]) pieces.push(butt(x-.5,y-.5,x+.5,y+.5,8.5));
let all=union(pieces);
const niche=(x,y,w,z0,z1,axis='y')=>{const z=z1-w/2;let h=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')h=h.rotate([0,0,90]);return h.translate([x,y,0]);};
const cuts=[];
for(const x of [-14.2,-9,8.5,13.3])cuts.push(niche(x,-6.1,1.9,3.0,10.1),niche(x,5.5,1.9,3.0,10.1));
for(const y of [-13.4,-8.6,8.6,13.4])cuts.push(niche(-5.5,y,1.9,3,10.1,'x'),niche(6.2,y,1.9,3,10.1,'x'));
cuts.push(niche(-17.2,0,3.2,1,10.5,'x'),niche(-1.6,-16.6,2,3,11),niche(1.6,-16.6,2,3,11),niche(-1.6,16,2,3,11),niche(1.6,16,2,3,11));
// Hoge vensters in drie zijden van de sluiting.
cuts.push(niche(20.6,0,1.5,3,10,'x'));
for(const s of [-1,1]) cuts.push(niche(0,0,1.5,3,10,'x').rotate([0,0,s*40]).translate([19.5,s*3,0]));
// Uitsparingen in de lantaarn zijn ondiep en nooit volledig open.
for(let a=0;a<360;a+=45){const c=niche(0,1.0,.75,19.0,21.2);cuts.push(c.rotate([0,0,a]));}
all=all.subtract(union(cuts));
await writeLandmark({slug:'grote-kerk-oosthuizen',base:B,nodes:[['building:kerk',all]],catalog:{name:'Grote Kerk Oosthuizen',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[-17,-10],[15,-10],[-17,10],[15,10]],replacesBuildings:['NL.IMBAG.Pand.0478100000001179'],description:'Laatgotische eenbeukige kruiskerk met vijfzijdig koor, steunberen en een achtkantige vieringtoren met peervormige bekroning.',realWorld:{groundNapM:-1.209,ahnTopNapM:24.679,modelTopM:25.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0478100000001179','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/40332','https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Oosthuizen']}});
