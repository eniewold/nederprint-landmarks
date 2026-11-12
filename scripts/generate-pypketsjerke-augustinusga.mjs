import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[207143.75,580985.6],axis=[.181,-.983],ground=1.547;
const roofed=(poly,planes)=>{let s=prism(poly,B,20);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// De na 1971 torenloze kerk: kruisende zadeldaken en lagere aanbouw.
const hall=roofed(rect(7.5,-6.84,27.45,6.84),[[0,1.17,11.41],[0,-1.17,11.41],[4,0,11.41-4*10]]);
const wing=roofed(rect(7.5,-10.53,22.73,10.53),[[.97,0,10.22-.97*15.6],[-.97,0,10.22+.97*15.6]]);
const rear=roofed(rect(0,-10.53,8,10.53),[[.55,0,5.65-.55*3.1],[-.55,0,5.65+.55*3.1]]);
let all=union([hall,wing,rear]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];
for(const y of [-4,0,4])cuts.push(niche(27.5,y,1.1,1,4,-90));
for(const x of [10,13,17,20])cuts.push(niche(x,-10.6,1,1,3.7),niche(x,10.6,1,1,3.7,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'pypketsjerke-augustinusga',base:B,nodes:[['building:kerk',all]],catalog:{name:'Pypketsjerke Augustinusga',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0059100000824880'],description:'Voormalige kerk met kruisende zadeldaken en lage aanbouw; de toren is in 1971 verwijderd.',realWorld:{groundNapM:ground,ridgeNapM:12.961},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000824880','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://gereformeerdekerken.info/2023/10/19/v-m-kerk-augustinusga-herbergt-oekrainers/','https://gereformeerdekerken.info/2016/01/22/laatste-kerkdienst-in-pypketsjerke-augustinusgasurhuizum/']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'pypketsjerke-augustinusga');
const file=path.join(dir,'pypketsjerke-augustinusga.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['pypketsjerke-augustinusga-1-100.stl','pypketsjerke-augustinusga-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
