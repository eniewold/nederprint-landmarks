import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[205703.055,575311.375],axis=[.9355,.353],ground=3.681;
const roofed=(poly,planes)=>{let s=prism(poly,B,16);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Een zaalkerk met zadeldak, kleinere schilddakvleugel en platte aanbouw.
const hall=roofed(rect(12.2,-3.48,25.43,2.79),[[0,.96,6.68-.96*(-.345)],[0,-.96,6.68+.96*(-.345)]]);
const rear=roofed(rect(3.49,-4.41,13.84,3.79),[[0,.95,6.56-.95*(-.31)],[0,-.95,6.56+.95*(-.31)],[.95,0,6.56-.95*6.4],[-.95,0,6.56+.95*11.3]]);
const low=prism(rect(0,-3.47,3.55,3.47),B,3.39);
let all=union([hall,rear,low]);
const niche=(x,y,w,z0,z1,angle=0,depth=.35)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [15,17.7,20.4,23])cuts.push(niche(x,-3.54,1.05,.9,3.1),niche(x,2.85,1.05,.9,3.1,180));
cuts.push(niche(25.49,-.35,1.1,0,2.8,90),niche(25.49,-2.1,1,1.15,3,90),niche(25.49,1.35,1,1.15,3,90),niche(25.49,-.35,1.1,4.4,5.5,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'de-kapel-witte-kerk-boelenslaan',base:B,nodes:[['building:kerk',all]],catalog:{name:'De Kapel (Witte kerk) Boelenslaan',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0059100000834625'],description:'Torenloze witte kapel met zadeldak en kleinere achterbouwen.',realWorld:{groundNapM:ground,ridgeNapM:10.363},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000834625','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://gereformeerdekerken.info/2016/01/01/het-ontstaan-van-de-voortgezette-gereformeerde-kerken-in-nederland-vgkn/','https://www.kerk-en-orgel.nl/record.php?action=display_ordered&id=18829']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'de-kapel-witte-kerk-boelenslaan');
const file=path.join(dir,'de-kapel-witte-kerk-boelenslaan.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['de-kapel-witte-kerk-boelenslaan-1-100.stl','de-kapel-witte-kerk-boelenslaan-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
