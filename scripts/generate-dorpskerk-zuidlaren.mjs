import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[242087.9,568485.1], axis=[.958,.286], ground=5.021;
const roofed=(poly,planes)=>{let s=prism(poly,B,45);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
// De lagere romaanse beuk en het hogere gotische koor met driezijdige sluiting.
const nave=roofed(rect(4.1,-4.08,20.85,4.97),[[0,.98,11.05-.98*.445],[0,-.98,11.05+.98*.445]]);
const choir=roofed([[20.6,-4.43],[31.5,-4.43],[34.95,-1.1],[34.95,2.6],[31.5,5.65],[20.6,5.65]],[[0,.95,15.07-.95*.61],[0,-.95,15.07+.95*.61],[-.95,0,15.07+.95*31.5]]);
const tower=prism(rect(-2.48,-3.05,4.35,3.5),B,23.7);
const spire=loft(oct(.94,.22,3.25),23.65,oct(.94,.22,.49),38.04);
const buttresses=[];for(const x of [21.2,26.15,31.0])for(const y of [-1,1]){
 const edge=y<0?-4.42:5.64,outer=edge+y*1.15,inner=edge-y*.15;
 buttresses.push(hull([[x-.48,inner,B],[x+.48,inner,B],[x+.48,outer,B],[x-.48,outer,B],[x-.48,inner,8.2],[x+.48,inner,8.2],[x-.48,outer,7.05],[x+.48,outer,7.05]]));
}
let all=union([nave,choir,tower,spire,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [7,12,17])cuts.push(niche(x,-4.14,1.15,1.8,5.8),niche(x,5.03,1.15,1.8,5.8,180));
for(const x of [23.7,28.4])cuts.push(niche(x,-4.5,1.35,2.2,8.4),niche(x,5.72,1.35,2.2,8.4,180));
cuts.push(niche(-2.55,.2,1.4,0,3.0,-90),niche(.9,-3.12,1.2,18.3,21),niche(.9,3.57,1.2,18.3,21,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'dorpskerk-zuidlaren',base:B,nodes:[['building:kerk',all]],catalog:{name:'Dorpskerk Zuidlaren',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1730100000008006'],description:'Middeleeuwse dorpskerk met hoog driezijdig koor, steunberen en ingesnoerde torenspits.',realWorld:{groundNapM:ground,ridgeNapM:20.093,towerTopNapM:43.06},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1730100000008006','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kerkfotografie.nl/dorpskerk-zuidlaren/','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/41091','https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0107.php']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'dorpskerk-zuidlaren');
const file=path.join(dir,'dorpskerk-zuidlaren.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['dorpskerk-zuidlaren-1-100.stl','dorpskerk-zuidlaren-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
