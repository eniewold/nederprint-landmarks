import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[205566.95,585283],axis=[.97,.243],ground=1.246;
const roofed=(poly,planes)=>{let s=prism(poly,B,45);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Laatgotische zaalkerk met vijfzijdige sluiting en zware westtoren.
const nave=roofed([[3.8,-5.3],[35.8,-5.3],[38.4,-4.6],[40.75,-1.3],[40.75,1.3],[38.4,4.6],[35.7,5.5],[3.8,5.65]],[[0,1.02,16.83],[0,-1.02,16.83],[-1.02,0,16.83+1.02*35.7]]);
const tower=prism(rect(-3.7,-4.22,3.92,3.98),B,25.7);
const cap=loft(rect(-3.7,-4.22,3.92,3.98),25.65,rect(-.34,-.57,.56,.33),37.17);
const buttresses=[];for(const x of [4.3,9.2,13.95,18.55,23.0,27.4,31.5,35.55]){
 buttresses.push(hull([[x-.46,-5.2,B],[x+.46,-5.2,B],[x+.46,-6.4,B],[x-.46,-6.4,B],[x-.46,-5.2,8.4],[x+.46,-5.2,8.4],[x-.46,-6.4,7.2],[x+.46,-6.4,7.2]]));
}
let all=union([nave,tower,cap,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [6.8,11.6,16.3,20.8,25.2,29.4,33.6])cuts.push(niche(x,-5.36,1.2,2,8.1));
cuts.push(niche(-3.76,-.1,1.45,0,3.4,-90),niche(.1,-4.28,1.2,20.3,23),niche(.1,4.04,1.2,20.3,23,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'mariakerk-buitenpost',base:B,nodes:[['building:kerk',all]],catalog:{name:'Mariakerk Buitenpost',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0059100000837071'],description:'Laatgotische Mariakerk met zware westtoren, tentdak en vijfzijdig koor.',realWorld:{groundNapM:ground,towerTopNapM:38.414},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000837071','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/7036','https://www.binnenbuitenpost.nl/verhalen/geschiedenis/de-mariakerk-aan-de-oude-havenstraat/']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'mariakerk-buitenpost');
const file=path.join(dir,'mariakerk-buitenpost.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['mariakerk-buitenpost-1-100.stl','mariakerk-buitenpost-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
