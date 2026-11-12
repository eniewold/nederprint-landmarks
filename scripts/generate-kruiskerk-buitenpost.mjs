import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='kruiskerk-buitenpost',B=-.3,O=[205300,585553],axis=[-.333,.9429];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk en moderne, lager uitgevoerde bouwdelen van hetzelfde BAG-pand.
const nave=roofed(rect(-22.8,-4.5,-2.4,6.5),[[0,1.1,12.3],[0,-1.1,14.5]]);
const side=roofed(rect(-17.8,-14.5,-7,-4.2),[[0,1,20.2],[0,-1,0.8]]);
const mid=prism(rect(-2.6,-18.55,7.1,9.35),B,4.5);
const back=prism(rect(7,-17.7,15.6,15.15),B,3.6);
const back2=prism(rect(15.4,-17.7,20.3,6.85),B,3.6);
const side2=prism(rect(1.5,9,9.7,15.15),B,3.6);
let solid=union([nave,side,mid,back,back2,side2]);const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];cuts.push(niche(-23.4,1,1.7,.1,3.4,-90));for(const y of [-2,4])cuts.push(niche(-23.4,y,1.2,2,5.8,-90));for(const x of [-19,-15,-11,-7])cuts.push(niche(x,5.8,1.2,2,5.8));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Kruiskerk Buitenpost',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0059100000821712'],description:'Voormalige gereformeerde zaalkerk met zadeldak en lagere aanbouwen.',realWorld:{groundNapM:1.476,naveRidgeNapM:14.89},sources:['https://gereformeerdekerken.info/2022/07/05/de-gereformeerde-kerk-te-buitenpost-2/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000821712','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
