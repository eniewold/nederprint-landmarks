import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[194936.88,583069.73], axis=[-.195,-.9808], ground=1.896;
const roofed=(poly,planes)=>{let s=prism(poly,B,25);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaal met zadeldak; lagere dwarsvleugel en afgeschoonde achteraanbouw.
const main=roofed(rect(9.35,-9.7,16.47,6.28),[[1,0,9.6-12.9],[-1,0,9.6+12.9]]);
const annex=roofed(rect(0,-6.77,9.45,5.61),[[0,.3,5.5],[0,-.3,5.5]]);
const rear=roofed([[9.3,-9.7],[10.1,-10.5],[11.4,-11.8],[14.35,-11.8],[16.45,-9.7]],[[1,0,9.35-13],[-1,0,9.35+13]]);
const tower=prism(rect(12.15,4.9,13.65,6.28),8.4,10.5);
const spire=hull([[12.15,4.9,10.45],[13.65,4.9,10.45],[13.65,6.28,10.45],[12.15,6.28,10.45],[12.88,5.6,12.6],[12.92,5.6,12.6]]);
let all=union([main,annex,rear,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.3)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1+.04],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
all=all.subtract(union([niche(11.15,6.34,.9,1.3,4.5,180),niche(12.9,6.34,1,2.5,5.5,180),niche(14.65,6.34,.9,1.3,4.5,180),niche(12.9,6.34,1,0,2,180)]));
await writeLandmark({slug:'doopgezinden-gemeente-feanwalden',base:B,nodes:[['building:kerk',all]],catalog:{name:'Doopgezinden gemeente Feanwalden',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1891100001636893'],description:'Doopsgezinde zaalkerk met gevelruiter en aangebouwde lage dwarsvleugel.',realWorld:{groundNapM:ground,roofRidgeNapM:11.496},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1891100001636893','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.dbnl.org/tekst/berg229noor03_01/berg229noor03_01_0017.php']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'doopgezinden-gemeente-feanwalden');const file=path.join(dir,'doopgezinden-gemeente-feanwalden.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['doopgezinden-gemeente-feanwalden-1-100.stl','doopgezinden-gemeente-feanwalden-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));


