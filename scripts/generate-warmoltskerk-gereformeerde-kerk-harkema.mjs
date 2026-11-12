import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[205181.2,577839.4],axis=[-.396,.91825],ground=2.493;
const roofed=(poly,planes)=>{let s=prism(poly,B,30);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// T-vormig kerkvolume met dwarskap en geveltoren; lagere achterbouw.
const hall=roofed(rect(4.2,-9.6,18,10.2),[[.85,0,11.8-.85*11.1],[-.85,0,11.8+.85*11.1]]);
const facade=roofed(rect(1.3,-4.8,8,4.8),[[0,1,11.7],[0,-1,11.7]]);
const tower=prism(rect(-1.2,-1.1,1.8,1.7),B,14.2);
const spire=hull([[-1.2,-1.1,14.1],[1.8,-1.1,14.1],[1.8,1.7,14.1],[-1.2,1.7,14.1],[.72,.3,19.13],[.78,.3,19.13]]);
const annex=prism([[17.9,-11],[41,-11],[41,-10.7],[45.1,-10.7],[45.1,.8],[44,.8],[44,7.5],[18,7.5]],B,5.3);
const porch=roofed(rect(20.7,-16.3,25.8,-10.8),[[1,0,6.3-23.25],[-1,0,6.3+23.25]]);
let all=union([hall,facade,tower,spire,annex,porch]);
const niche=(x,y,w,z0,z1,angle=0,depth=.3)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1+.04],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[niche(-1.26,0,1.1,0,3,-90)];for(const y of [-7,7])cuts.push(niche(4.14,y,1.1,2,5,-90));all=all.subtract(union(cuts));
await writeLandmark({slug:'warmoltskerk-gereformeerde-kerk-harkema',base:B,nodes:[['building:kerk',all]],catalog:{name:'Warmoltskerk - Gereformeerde Kerk Harkema',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0059100000825617'],description:'T-vormige kerk met geveltoren en lagere achterbouw.',realWorld:{groundNapM:ground,spireTopNapM:21.62},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000825617','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://lokaleregelgeving.overheid.nl/CVDR723347/1','https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01.pdf']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'warmoltskerk-gereformeerde-kerk-harkema');const file=path.join(dir,'warmoltskerk-gereformeerde-kerk-harkema.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['warmoltskerk-gereformeerde-kerk-harkema-1-100.stl','warmoltskerk-gereformeerde-kerk-harkema-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));


