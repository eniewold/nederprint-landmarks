import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='obadja-zorgvlied',B=-.3,O=[213501.85,548475.22],axis=[.7205,.6935];
const roofed=(poly,planes,z=40)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);const sq=(x,y,h)=>rect(x-h,y-h,x+h,y+h);
// Rechthoekige houten kapel met zadeldak en achterste dakschild.
const nave=roofed(rect(-7.58,-2.92,7.58,2.92),[[0,1,6.53],[0,-1,6.53],[1,0,11.2]]);
// Smalle gevelruiter is iets verbreed voor een stabiele 1:1000-print.
const tower=union([prism(sq(6.9,0,.6),5.8,7.8),loft(sq(6.9,0,.6),7.7,sq(6.9,0,.48),8.8)]);
let solid=union([nave,tower]);
const niche=(x,y,w,z0,z1,angle=0,depth=.7)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-4.4,-1.8,.8,3.4])cuts.push(niche(x,-3.02,.9,1.2,3.1),niche(x,2.35,.9,1.2,3.1));cuts.push(niche(8.1,0,1.2,.05,2.6,90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kapel',solid]],catalog:{name:'Obadja Zorgvlied',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1701100000205872'],description:'Houten kapel met zadeldak, achterschild en smalle gevelruiter.',realWorld:{groundNapM:8.12,naveRidgeNapM:14.65,towerTopEstimatedNapM:16.92},sources:['https://www.gemeentediever.nl/religie/hervormde-evangelisatievereniging-obadja/index.html','https://www.inwesterveld.nl/obadja-kapel-in-zorgvlied/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1701100000205872','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));

