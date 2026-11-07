import {union,hull,prism,rect,circle,spire,writeLandmark} from './efteling-kit.mjs';
const B=-.5, ORIGIN=[181532.5,591260.2], AX=[.9998,-.02], parts=[];
const roofed=(poly,planes)=>{let s=prism(poly,B,80);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s;};
const ridgeY=(y,z,k)=>[[0,k,z-k*y],[0,-k,z+k*y]];
const ridgeX=(x,z,k)=>[[k,0,z-k*x],[-k,0,z+k*x]];
// Nave and five-sided choir under a planar pitched roof.
const nave=[[3.7,-5.4],[38,-5.4],[41,-4.4],[43.7,-1.7],[43.7,1.5],[41,4.3],[38,5.4],[3.7,5.4]];
parts.push(roofed(nave,[...ridgeY(0,17.25,1.55),[-1.55,0,17.25+1.55*38.4]]));
// North and south chapel wings have their own gables, lower than the nave.
parts.push(roofed(rect(21.6,-13.2,28.0,-5.1),ridgeX(24.8,13.0,1.6)));
parts.push(roofed(rect(21.8,5.1,28.0,10.9),ridgeX(24.9,13.0,1.6)));
// West tower, rebuilt after the earlier saddle tower collapsed, and its eight-sided spire.
parts.push(prism(rect(-3.8,-3.8,3.9,3.8),B,24.3));
parts.push(spire([0,0],3.7,24.2,46.6,8,Math.PI/8));
// Sloped buttresses on both flanks.
const butt=(x,y)=>hull([[x-.5,y-.6,B],[x+.5,y-.6,B],[x+.5,y+.6,B],[x-.5,y+.6,B],[x-.5,y-.35,8],[x+.5,y-.35,8],[x+.5,y+.35,8.5],[x-.5,y+.35,8.5]]);
for(const x of [6,11,16,32.5,38])for(const side of [-1,1])parts.push(butt(x,side*5.6));
let all=union(parts);
const niche=(u,w,z0,z1,axis,lo,hi)=>hull([[-w/2,z0],[w/2,z0],[-w/2,z1-w*.7],[w/2,z1-w*.7],[0,z1]].flatMap(([v,z])=>axis==='y'?[[u+v,lo,z],[u+v,hi,z]]:[[lo,u+v,z],[hi,u+v,z]]));
const cuts=[];
for(const x of [8.5,13.5,18.3,31,35.6])cuts.push(niche(x,1.3,3.3,9,'y',-5.8,-5.0),niche(x,1.3,3.3,9,'y',5.0,5.8));
for(const y of [-2,0,2])cuts.push(niche(y,1.05,18.8,22.5,'x',-4.2,-3.4));
for(const x of [-1.3,1.3])cuts.push(niche(x,1.05,18.8,22.5,'y',-4.2,-3.4),niche(x,1.05,18.8,22.5,'y',3.4,4.2));
cuts.push(niche(0,1.6,.2,4.5,'x',-4.2,-3.4));
cuts.push(niche(24.8,1.5,3.2,8.7,'y',-13.5,-12.7),niche(24.9,1.5,3.2,8.7,'y',10.5,11.3));
cuts.push(niche(0,1.4,3.1,9,'x',43.3,44.1));
for(const side of [-1,1])cuts.push(niche(0,1.2,3.1,9,'x',-.8,.2).rotate([0,0,side*45]).translate([42.7,side*3.1,0]));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-maartenkerk-hallum',base:B,nodes:[['building:kerk',all]],catalog:{name:'Sint-Maartenkerk Hallum',origin:ORIGIN,xAxis:AX,groundOffsetMetres:0,groundSamplePoints:[[-6,-9],[17,-15],[-6,8],[17,13]],replacesBuildings:['NL.IMBAG.Pand.1722100000005077'],description:'Middeleeuwse kerk met veelhoekig koor, twee zijkapellen, steunberen en herbouwde westtoren met achtzijdige spits.',realWorld:{groundNapM:4.675,ahnTopNapM:51.2868,modelTopM:46.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000005077','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/15618','https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk_(Hallum)']}});
