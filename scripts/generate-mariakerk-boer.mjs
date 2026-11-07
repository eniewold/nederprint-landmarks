import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.5, origin=[166942.8,580989.8], axis=[.98648,-.1639];
const roofed=(poly,planes)=>{let s=prism(poly,B,50); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s};
const rectSolid=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const nave=[[1.15,-3.65],[14.65,-3.65],[16.35,-3.35],[17.8,-2.5],[18.65,-1.1],[18.65,1.1],[17.8,2.5],[16.35,3.35],[14.65,3.65],[1.15,3.65]];
// Continuous gabled roof with hipped round-ended apse: planar slopes.
const p=[roofed(nave,[[0,1.28,9.87],[0,-1.28,9.87],[-1.28,0,9.87+1.28*14.9]])];
// Square tower and four-sided tapered spire, with 0.9 m printable top.
p.push(rectSolid(-2.45,-2.1,1.55,2.1,B,13.5));
p.push(hull([[-2.45,-2.1,13.48],[1.55,-2.1,13.48],[1.55,2.1,13.48],[-2.45,2.1,13.48],[-.90,-.45,18.38],[0,-.45,18.38],[0,.45,18.38],[-.90,.45,18.38]]));
// Supported tower cornice; its lower edge rises at 45 degrees.
p.push(hull([[-2.45,-2.1,13.05],[1.55,-2.1,13.05],[1.55,2.1,13.05],[-2.45,2.1,13.05],[-2.7,-2.35,13.32],[1.8,-2.35,13.32],[1.8,2.35,13.32],[-2.7,2.35,13.32],[-2.7,-2.35,13.48],[1.8,-2.35,13.48],[1.8,2.35,13.48],[-2.7,2.35,13.48]]));
// Sloping buttresses at the round chancel.
for(const [x,y] of [[15.0,-3.75],[17.0,-3.1],[18.45,-1.4],[18.45,1.4],[17,3.1],[15,3.75]])p.push(hull([[x-.48,y-.48,B],[x+.48,y-.48,B],[x+.48,y+.48,B],[x-.48,y+.48,B],[x-.48,y-.48,3.5],[x+.48,y-.48,3.5],[x+.48,y+.48,4.3],[x-.48,y+.48,4.3]]));
// Framed historic entrance on south elevation, top closed and sloping for printability.
p.push(rectSolid(3.0,-4.05,5.15,-3.5,B,3.25));
p.push(hull([[2.9,-4.05,3.2],[5.25,-4.05,3.2],[2.9,-3.5,3.2],[5.25,-3.5,3.2],[4.075,-4.05,4.0],[4.075,-3.5,4.0]]));
let all=union(p);
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w/2;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
// Three arched windows on south and one on north; shallow blind recesses.
for(const x of [7.3,10.5,13.7]) cuts.push(niche(x,-4.3,1.3,1.7,4.6));
cuts.push(niche(10.5,3.25,1.3,1.7,4.6));
// Tower pairs of bell openings, treated as niches.
for(const x of [-1.25,.3]) {cuts.push(niche(x,-2.5,.78,10.0,12.3));cuts.push(niche(x,1.7,.78,10,12.3));}
for(const y of [-.8,.8]) cuts.push(niche(-2.0,y,.78,10,12.3,'x'));
cuts.push(niche(4.05,-4.35,1.1,.0,2.8));
cuts.push(rectSolid(-.99,-2.45,.09,-1.80,8.45,9.48));
all=all.subtract(union(cuts));
await writeLandmark({slug:'mariakerk-boer',base:B,nodes:[['building:kerk',all]],catalog:{name:'Mariakerk Boer',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-3],[2,3],[12,-4],[12,4],[19,0]],replacesBuildings:['NL.IMBAG.Pand.0070100000322272'],description:'Romaanse zaalkerk met rondgesloten koor, steunberen, westtoren met vierzijdige spits en versierde zuidingang.',realWorld:{groundNapM:1.72,ahnSpireNapM:20.18,modelTopM:18.38},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000322272','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/15850','https://commons.wikimedia.org/wiki/Category:Mariakerk_(Boer)','https://www.tsjerkepaad.nl/overzicht-kerken/boer-maria-kerk']}});

