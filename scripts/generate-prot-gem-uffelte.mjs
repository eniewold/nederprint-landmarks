import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[215145.208,533805.696], axis=[.9333,.3592], ground=5.7;
const roofed=(poly,planes)=>{let s=prism(poly,B,20);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// De oorspronkelijke zaalkerk heeft één zadeldak; de dakruiter is een bouwdeel.
const hall=roofed(rect(0,-3.754,14.56,3.754),[[0,1.39,8.65],[0,-1.39,8.65]]);
const tower=prism(rect(.35,-.8,2.1,.8),7.2,10.65);
const cap=hull([[-.0,-.8,10.65],[2.45,-.8,10.65],[2.45,.8,10.65],[0,.8,10.65],[1.2,0,11.25]]);
// Geen uitstekende kap: een oplopend voetvlak ondersteunt de verbreding.
const skirt=hull([[.35,-.8,10.3],[2.1,-.8,10.3],[2.1,.8,10.3],[.35,.8,10.3],[0,-.8,10.65],[2.45,-.8,10.65],[2.45,.8,10.65],[0,.8,10.65]]);
let all=union([hall,tower,skirt,cap]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];
for(const x of [2.4,5.1,7.8,10.5,13])cuts.push(niche(x,-3.8,1.15,.9,3.7),niche(x,3.8,1.15,.9,3.7,180));
cuts.push(niche(-.06,0,1.65,0,3.0,-90),niche(-.06,0,1,4.2,5.9,-90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'prot-gem-uffelte',base:B,nodes:[['building:kerk',all]],catalog:{name:'Uffelter Kerk',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1701100000208026'],description:'Zaalkerk met zadeldak en houten dakruiter in Uffelte.',realWorld:{groundNapM:ground,ridgeNapM:14.352,towerTopNapM:16.954},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1701100000208026','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.ghardeman.nl/fotos600p/uffeltesel.htm','https://uffelterkerk.nl/geschiedenis/','https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0088.php']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'prot-gem-uffelte');
const file=path.join(dir,'prot-gem-uffelte.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['prot-gem-uffelte-1-100.stl','prot-gem-uffelte-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
