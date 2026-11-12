import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[184056.8,594809.25],axis=[.99982,-.019],ground=5.388;
const roofed=(poly,planes)=>{let s=prism(poly,B,45);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Langgerekte gotische zaalkerk met vijfzijdig koor en forse zadeldaktoren.
const hall=roofed([[5,-5.4],[43.6,-5.4],[47,-4.2],[49,-1.5],[49,2],[47,4.8],[43.6,5.5],[5,5.5]],[[0,1.55,18.55],[0,-1.55,18.55],[-1.2,0,18.55+1.2*44]]);
const tower=roofed(rect(-5.05,-5.2,5.05,5.2),[[0,1.4,36.72],[0,-1.4,36.72]]);
const northPorch=roofed(rect(33.3,5.4,36.6,7.7),[[0,-1.1,11.1+1.1*5.4]]);
const buttresses=[];for(const x of [7,14,21,28,39,43])for(const y of [-1,1]){const edge=y*5.36,inner=edge-y*.1,outer=edge+y*.92;buttresses.push(hull([[x-.46,inner,B],[x+.46,inner,B],[x+.46,outer,B],[x-.46,outer,B],[x-.46,inner,7],[x+.46,inner,7],[x-.46,outer,6.05],[x+.46,outer,6.05]]));}
let all=union([hall,tower,northPorch,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.3)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1+.04],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [10.5,17.5,24.5,31.5,40.8])cuts.push(niche(x,-5.46,1.05,2,8),niche(x,5.56,1.05,2,8,180));
for(const x of [-3,0,3])for(const z of [12.8,23.7])cuts.push(niche(x,-5.26,1.1,z,z+5),niche(x,5.26,1.1,z,z+5,180));
for(const y of [-3,0,3])for(const z of [12.8,23.7])cuts.push(niche(-5.11,y,1.1,z,z+5,-90));cuts.push(niche(-5.11,0,1.4,0,4.3,-90));all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-martinustsjerke-ferwert',base:B,nodes:[['building:kerk',all]],catalog:{name:'Sint Martinustsjerke Ferwert',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1722100000004303'],description:'Gotische zaalkerk met vijfzijdig koor en forse zadeldaktoren.',realWorld:{groundNapM:ground,towerRidgeNapM:42.114},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000004303','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/15581','https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0058.php']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'sint-martinustsjerke-ferwert');const file=path.join(dir,'sint-martinustsjerke-ferwert.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['sint-martinustsjerke-ferwert-1-100.stl','sint-martinustsjerke-ferwert-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
