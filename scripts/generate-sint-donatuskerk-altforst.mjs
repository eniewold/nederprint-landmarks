import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
// Oorsprong bij westtoren; +X loopt langs de kerk naar de apsis.
const B=-.5,origin=[167250,428832],axis=[.943,-.333],ground=6.966;
const roofed=(poly,planes,z=45)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk met zadeldak, versmald koor en halfronde apsis.
const cy=.65,nave=roofed(rect(2.15,-4.77,21.0,6.05),[[0,.95,15.07-.95*cy],[0,-.95,15.07+.95*cy]]);
const r=3.25,xc=27.12,arc=Array.from({length:11},(_,i)=>{let a=-Math.PI/2+Math.PI*i/10;return [xc+r*Math.cos(a),cy+r*Math.sin(a)]});
const poly=[[20.8,cy-r],...arc,[20.8,cy+r]],planes=[[0,1.0,12.85-cy],[0,-1.0,12.85+cy]];
for(let i=0;i<=6;i++){let a=-Math.PI/2+i*Math.PI/6;planes.push([-Math.cos(a),-Math.sin(a),12.85+xc*Math.cos(a)+cy*Math.sin(a)])}
const choir=roofed(poly,planes);
// Sacristie aan beide zijden van het koor, met lagere dakvlakken.
const left=roofed(rect(20.9,-6.48,26.9,-3.2),[[0,1.0,8.0+6.48]]),right=roofed(rect(20.9,3.8,26.95,10.58),[[0,-.75,9.8+.75*3.8]]);
const tower=prism(rect(-1.83,-1.67,2.62,2.89),B,24.5),center=[.40,.61];
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);const oct=r=>circle(center,r,8,Math.PI/8);
const spire=union([loft(rect(-1.83,-1.67,2.62,2.89),24.4,oct(1.5),25.2),loft(oct(1.5),25.2,oct(.45),34.88)]);
// Vier metselwerkfrontalen aan de spitsvoet.
let gables=[];
for(const [a,b] of [[-1.83,-.93],[1.72,2.62]])gables.push(hull([[a,-1.67,24],[a,2.89,24],[a,.61,27],[b,-1.67,24],[b,2.89,24],[b,.61,27]]));
for(const [a,b] of [[-1.67,-.77],[1.99,2.89]])gables.push(hull([[-1.83,a,24],[2.62,a,24],[.4,a,27],[-1.83,b,24],[2.62,b,24],[.4,b,27]]));
let all=union([nave,choir,left,right,tower,spire,...gables]);
const niche=(x,y,w,z0,z1,angle=0,depth=.85)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[r*.7,z1-r*.3],[0,z1],[-r*.7,z1-r*.3],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [4.5,8,11.5,15,18.5])cuts.push(niche(x,-4.92,1.2,3,8),niche(x,5.35,1.2,3,8));
for(const x of [-.5,.8])cuts.push(niche(x,-1.82,.85,20.5,23.6),niche(x,2.2,.85,20.5,23.6));
for(const y of [-.05,1.25])cuts.push(niche(-1.12,y,.85,20.5,23.6,90));
cuts.push(niche(-1.12,.61,1.35,0,3.4,90),niche(-1.12,.61,1.1,5.8,9.3,90),niche(30.50,.65,1.0,3.0,6.8,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-donatuskerk-altforst',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Sint-Donatuskerk Altforst',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-4,-4],[-4,5],[7,-7],[22,-8],[32,1],[25,12]],replacesBuildings:['NL.IMBAG.Pand.0668100000006986'],description:'Neoromaanse zaalkerk met versmald koor, halfronde apsis, lage sacristieën en westtoren met vier frontalen en achtkantige naaldspits.',realWorld:{groundNapM:ground,naveRidgeM:15.07,towerTopM:34.88},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0668100000006986','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/523080','https://commons.wikimedia.org/wiki/Category:Donatus_Martelaarkerk_(Altforst)']}});

