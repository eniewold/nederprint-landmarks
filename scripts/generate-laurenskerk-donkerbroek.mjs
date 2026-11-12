import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[211779.91,559231.18],axis=[.9977,-.0683],ground=5.259;
const roofed=(poly,planes)=>{let s=prism(poly,B,25);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Zaalkerk met afgeschuinde sluiting en houten geveltoren.
const hall=roofed([[0,-4.28],[17.0,-4.28],[19.6,-1.8],[19.6,1.8],[17,4.28],[0,4.28]],[[0,1.22,11.306],[0,-1.22,11.306],[-1.22,0,11.306+1.22*17]]);
const tower=prism(rect(.2,-1.3,2.7,1.3),9.6,14.0);
const spire=loft(rect(.2,-1.3,2.7,1.3),13.95,rect(1,-.45,1.9,.45),21.746);
let all=union([hall,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [3.4,6.8,10.2,13.6])cuts.push(niche(x,-4.34,1.1,1.4,4.6),niche(x,4.34,1.1,1.4,4.6,180));
cuts.push(niche(-.06,0,1.4,0,3,-90),niche(1.45,-1.36,1,11.5,13),niche(1.45,1.36,1,11.5,13,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'laurenskerk-donkerbroek',base:B,nodes:[['building:kerk',all]],catalog:{name:'Laurenskerk Donkerbroek',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0085100000003581'],description:'Laurenskerk met afgeschuind koor en houten geveltoren met naaldspits.',realWorld:{groundNapM:ground,ridgeNapM:16.565,towerTopNapM:27.005},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0085100000003581','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.begraafplaats.nl/begraafplaatsen/kerkhof-donkerbroek-36/','https://www.kerkenvisieonline.nl/pdf-download/']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'laurenskerk-donkerbroek');
const file=path.join(dir,'laurenskerk-donkerbroek.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['laurenskerk-donkerbroek-1-100.stl','laurenskerk-donkerbroek-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
