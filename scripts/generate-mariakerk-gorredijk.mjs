import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[200533.21,556157.88],axis=[.9383,.3458],ground=1.534;
const roofed=(poly,planes)=>{let s=prism(poly,B,25);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// 18e-eeuwse zaalkerk met driehoekige koorsluiting en gevelruiter.
const hall=roofed([[0,-4.12],[14.55,-4.12],[17.05,-2.55],[18.2,0],[17.05,2.55],[14.55,4.12],[0,4.12]],[[0,1.25,10.98],[0,-1.25,10.98],[-1.25,0,10.98+1.25*14.55]]);
const tower=prism(rect(.2,-1.3,2.8,1.3),9.0,12.8);
const spire=hull([[.2,-1.3,12.75],[2.8,-1.3,12.75],[2.8,1.3,12.75],[.2,1.3,12.75],[1.47,0,19.37],[1.53,0,19.37]]);
let all=union([hall,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.3)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1+.04],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [4.0,8.4,12.7])cuts.push(niche(x,-4.18,1.2,1.6,5.2),niche(x,4.18,1.2,1.6,5.2,180));for(const x of [1.05,1.95])cuts.push(niche(x,-1.36,.65,10.4,12),niche(x,1.36,.65,10.4,12,180));cuts.push(niche(-.06,0,1.1,0,3,-90));all=all.subtract(union(cuts));
await writeLandmark({slug:'mariakerk-gorredijk',base:B,nodes:[['building:kerk',all]],catalog:{name:'Mariakerk Gorredijk',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0086100000350800'],description:'Zaalkerk met driezijdig koor en houten gevelruiter.',realWorld:{groundNapM:ground,spireTopNapM:20.902},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0086100000350800','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.opsterland.nl/8-mariakerk','https://www.friesland.nl/nl/locaties/1958243273/mariakerk']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'mariakerk-gorredijk');const file=path.join(dir,'mariakerk-gorredijk.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['mariakerk-gorredijk-1-100.stl','mariakerk-gorredijk-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
