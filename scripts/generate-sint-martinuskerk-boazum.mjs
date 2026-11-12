import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='sint-martinuskerk-boazum',B=-.3,O=[175710,567059.15],axis=[.99995,.01];
const roofed=(poly,planes,z=35)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Romaanse zaal en smaller, rondgesloten koor, allebei met vlakke dakschilden.
const nave=roofed(rect(-15.9,-5.35,10.7,5.35),[[0,1,14.4],[0,-1,14.4]]);
const apsePoly=[[10.5,-4.05],[17.7,-4.05],[19.7,-3.5],[21.2,-2],[21.8,0],[21.2,2],[19.7,3.5],[17.7,4.05],[10.5,4.05]];
const apse=roofed(apsePoly,[[0,1,14.4],[0,-1,14.4],[-1,0,32.1]]);
// Middeleeuwse westtoren met zadeldak, geen naaldspits.
const tower=roofed(rect(-21.2,-3,-15.7,3),[[0,1.38,26.42],[0,-1.38,26.42]]);
let solid=union([nave,apse,tower]);const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-12,-7,-2,3,8,14])cuts.push(niche(x,-5.45,1.0,3,6.8),niche(x,4.65,1.0,3,6.8));cuts.push(niche(-21.8,0,1.3,.1,3.1,-90));for(const z of [16.5,20])cuts.push(niche(-21.8,0,1.0,z,z+2.1,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Sint-Martinuskerk Boazum',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0140100000169734'],description:'Romaanse zaalkerk met rond koor en middeleeuwse zadeldaktoren.',realWorld:{groundNapM:1.64,naveRidgeNapM:16.04,towerRidgeNapM:28.06},sources:['https://www.kerkboazum.nl/geschiedenis/','https://www.kerkboazum.nl/kerktoren/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0140100000169734','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
