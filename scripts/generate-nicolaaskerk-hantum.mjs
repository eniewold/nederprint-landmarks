import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='nicolaaskerk-hantum',B=-.3,O=[193345,597437.5],axis=[.998,-.063];
const roofed=(poly,planes,z=40)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Romaanse zaalkerk met rondgesloten koor en half ingebouwde toren uit 1808.
const nave=roofed(rect(-13.6,-5.8,10,4),[[0,1,14.77],[0,-1,12.97]]);
const choir=roofed([[9.9,-5.7],[12.4,-4.4],[14.2,-2.1],[14.1,.7],[12.5,2.9],[10,4]],[[0,1,14.77],[0,-1,12.97],[-1,0,23.77]]);
const tower=prism(rect(-13.6,-4.3,-7.5,2.5),B,19.2);
const cap=hull([[-13.6,-4.3,19.1],[-7.5,-4.3,19.1],[-7.5,2.5,19.1],[-13.6,2.5,19.1],[-10.55,-.9,32.8]]);
let solid=union([nave,choir,tower,cap]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-5,0,5,9])cuts.push(niche(x,-5.9,1.1,2.5,6.8));for(const x of [-5,0,5])cuts.push(niche(x,3.3,1,3,6));cuts.push(niche(-14.2,-.9,1.2,.1,3.1,-90));for(const z of [13,16])cuts.push(niche(-14.2,-.9,1,z,z+2,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Nicolaaskerk Hantum',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0058100000201906'],description:'Romaanse kerk met rond koor en half ingebouwde toren met spits.',realWorld:{groundNapM:4.53,naveRidgeNapM:18.4,towerPeakNapM:37.31},sources:['https://kennis.cultureelerfgoed.nl/index.php/Monumenten/38698','https://www.friesland.nl/nl/locaties/3239007473/nicolaaskerk-1','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000201906','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
