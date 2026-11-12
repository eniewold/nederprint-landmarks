import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='st-pieterkerk-grou',B=-.3,O=[185333,567933],axis=[.996,-.089];
const roofed=(poly,planes,z=35)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Romaans schip en halfronde apsis met dakruiter; westelijke zadeldaktoren.
const nave=roofed(rect(-13,-5.4,12.9,5.5),[[0,1,16],[0,-1,16]]);
const choir=roofed([[12.7,-3.6],[18.9,-3.5],[20.8,-2.9],[22.1,-1.4],[22.6,.1],[22.1,2.3],[20.8,3.6],[18.5,4.1],[12.7,4]],[[0,1,13.5],[0,-1,13.5],[-1,0,32]]);
const tower=roofed(rect(-20.4,-3.6,-12.8,3.7),[[0,1.3,27.6],[0,-1.3,27.6]]);
const lantern=prism(rect(13.2,-.85,14.9,.85),11.6,17.8);
const cap=hull([[13.2,-.85,17.7],[14.9,-.85,17.7],[14.9,.85,17.7],[13.2,.85,17.7],[14.05,0,19.8]]);
let solid=union([nave,choir,tower,lantern,cap]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-9,-4,1,6,10])cuts.push(niche(x,-5.5,1.1,3,7.8),niche(x,4.8,1.1,3,7.8));cuts.push(niche(-21,0,1.3,.1,3.4,-90));for(const z of [17,21])cuts.push(niche(-21,0,1.1,z,z+2.2,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Sint Piterkerk Grou',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0055100000254258'],description:'Romaanse kerk met apsis, dakruiter en middeleeuwse zadeldaktoren.',realWorld:{groundNapM:1.128,naveRidgeNapM:17.1,towerRidgeNapM:28.72},sources:['https://www.dorpsarchiefgrou.nl/bouwwerken/kerken/sint-piterkerk/','https://www.tsjerkepaad.nl/overzicht-kerken/grou-sint-piter-kerk','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0055100000254258','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
