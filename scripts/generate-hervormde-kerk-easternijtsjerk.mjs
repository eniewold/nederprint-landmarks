import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[199311.2,599365.15],axis=[.99995,.01],ground=1.972;
const roofed=(poly,planes)=>{let s=prism(poly,B,30);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Langgerekte gotische zaalkerk en romaanse toren met zadeldak.
const hall=roofed([[3.3,-4.5],[25.0,-4.5],[28.3,-2],[28.3,2],[25,4.5],[3.3,4.5]],[[0,1.35,13.12],[0,-1.35,13.12],[-1.35,0,13.12+1.35*25]]);
const tower=roofed(rect(-3.32,-3.53,3.32,3.53),[[0,1.4,23.42],[0,-1.4,23.42]]);
const buttresses=[];for(const x of [3.55,8.1,12.8,21.2,25.3])for(const y of [-1,1]){
 const edge=y*4.48,inner=edge-y*.1,outer=edge+y*.92;
 buttresses.push(hull([[x-.46,inner,B],[x+.46,inner,B],[x+.46,outer,B],[x-.46,outer,B],[x-.46,inner,5.5],[x+.46,inner,5.5],[x-.46,outer,4.58],[x+.46,outer,4.58]]));
}
let all=union([hall,tower,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.35)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [5.8,10.4,15.2,19.4,23.1])cuts.push(niche(x,-4.56,1.05,1.5,5.7),niche(x,4.56,1.05,1.5,5.7,180));
cuts.push(niche(-3.38,0,1.2,0,3,-90),niche(0,-3.59,1.1,15.8,18.0),niche(0,3.59,1.1,15.8,18.0,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'hervormde-kerk-easternijtsjerk',base:B,nodes:[['building:kerk',all]],catalog:{name:'Hervormde kerk Easternijtsjerk',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0058100000204631'],description:'Caeciliatsjerke met driezijdig koor en romaanse toren met zadeldak.',realWorld:{groundNapM:ground,towerRidgeNapM:25.394},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000204631','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/31588','https://monumentenbehoudnef.nl/kerktorens/oosternijkerk-sint-ceciliakerk']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'hervormde-kerk-easternijtsjerk');
const file=path.join(dir,'hervormde-kerk-easternijtsjerk.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['hervormde-kerk-easternijtsjerk-1-100.stl','hervormde-kerk-easternijtsjerk-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
