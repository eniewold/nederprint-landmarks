import {union,hull,prism,rect,circle,writeLandmark} from './efteling-kit.mjs';
const B=-.5, origin=[172054,578408], axis=[-.9103,.4139];
const roofed=(poly,planes)=>{let s=prism(poly,B,80); for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n);}return s};
const box=(x0,y0,x1,y1,z0,z1)=>prism(rect(x0,y0,x1,y1),z0,z1);
const p=[];
// Long high nave roof, flanked by lower aisles; polygonal roof planes are continuous.
p.push(roofed(rect(1.5,-4.15,29.6,4.0),[[0,.97,13.3],[0,-.97,13.3],[-.97,0,13.3+.97*24.7]]));
p.push(roofed(rect(1.5,-6.2,29.6,-4.0),[[0,1.25,14.45]]));
p.push(roofed(rect(1.5,3.9,29.6,6.1),[[0,-1.25,14.45]]));
// Rear low service wing, retained where part of the replaced BAG building.
p.push(roofed(rect(29.4,-6.2,33.5,6.15),[[-.58,0,23.4]]));
// East-facing entrance tower and side stair block.
p.push(box(-2.1,-2.3,2.3,2.3,B,20.95));
p.push(roofed(rect(-1.6,-4.6,1.7,-2.2),[[0,1.0,12.2]]));
// Brick cornice has an angled lower face; the parapet and louvres are closed for printing.
p.push(hull([[-2.1,-2.3,20.4],[2.3,-2.3,20.4],[2.3,2.3,20.4],[-2.1,2.3,20.4],[-2.45,-2.65,20.8],[2.65,-2.65,20.8],[2.65,2.65,20.8],[-2.45,2.65,20.8],[-2.45,-2.65,21.25],[2.65,-2.65,21.25],[2.65,2.65,21.25],[-2.45,2.65,21.25]]));
// Two enclosed octagonal lanterns preserve the tower profile on a 1:1000 print.
const oct=(r)=>circle([.1,0],r,8,Math.PI/8);
p.push(hull([...oct(1.72).map(([x,y])=>[x,y,21.2]),...oct(1.55).map(([x,y])=>[x,y,23.2])]));
p.push(hull([...oct(1.55).map(([x,y])=>[x,y,23.1]),...oct(1.15).map(([x,y])=>[x,y,24.3])]));
p.push(hull([...oct(1.15).map(([x,y])=>[x,y,24.25]),...oct(1.38).map(([x,y])=>[x,y,25.25]),...oct(1.0).map(([x,y])=>[x,y,26.0])]));
p.push(hull([...oct(1.0).map(([x,y])=>[x,y,25.95]),...oct(.9).map(([x,y])=>[x,y,30.75])]));
p.push(hull([...oct(.9).map(([x,y])=>[x,y,30.7]),...oct(.48).map(([x,y])=>[x,y,31.4])]));
let all=union(p);
const niche=(x,y,w,z0,z1,axis='y')=>{let z=z1-w/2;let s=hull([[-w/2,0,z0],[w/2,0,z0],[-w/2,0,z],[w/2,0,z],[0,0,z1],[-w/2,1,z0],[w/2,1,z0],[-w/2,1,z],[w/2,1,z],[0,1,z1]]);if(axis==='x')s=s.rotate([0,0,90]);return s.translate([x,y,0])};
let cuts=[];
for(const x of [8.5,13.5,18.5,23.5,27.5]) cuts.push(niche(x,-6.5,1.3,2.0,5.9),niche(x,5.6,1.3,2.0,5.9));
// Portal, tall front window and the paired belfry niches on the four tower faces.
cuts.push(niche(-1.6,0,1.8,.0,3.0,'x'),niche(-1.6,0,1.0,6.0,9.8,'x'));
for(const y of [-.9,.9]) cuts.push(niche(-1.6,y,.9,15.9,19.5,'x'),niche(2.6,y,.9,15.9,19.5,'x'));
for(const x of [-.85,1.05]) cuts.push(niche(x,-2.6,.9,15.9,19.5),niche(x,1.9,.9,15.9,19.5));
// Closed small lantern on print scale.
all=all.subtract(union(cuts));
await writeLandmark({slug:'maria-geboortekerk-dronryp',base:B,nodes:[['building:kerk',all]],catalog:{name:'Maria Geboortekerk Dronryp',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-3,-4],[3,-7],[18,-7],[-3,4],[18,7],[31,0]],replacesBuildings:['NL.IMBAG.Pand.0083100000007241'],description:'Driebeukige waterstaatskerk uit 1839 met oostelijke geveltoren uit 1939 en dubbele lantaarn.',realWorld:{groundNapM:1.21,ahnLanternNapM:32.8,modelTopM:31.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000007241','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/508677','https://commons.wikimedia.org/wiki/Category:Maria_Geboortekerk_(Dronryp)']}});


