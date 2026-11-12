import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='de-voorhof-franeker',B=-.3,O=[165198,577749],axis=[.0995,.995];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Stedelijk kerkgebouw met hoge kern en lagere platte zijvleugel.
const main=roofed([[-13.3,-3.45],[10.91,-3.73],[13.91,-3.63],[11.93,9.13],[-13.3,9.22]],[[0,1,10.7],[0,-2,25.0],[-1,0,23.7]],10.7);
const wing=prism([[-13.3,-9.87],[11,-9.95],[10.91,-3.5],[-13.3,-3.3]],B,6.0);
let solid=union([main,wing]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-9,-4,1,6])cuts.push(niche(x,-10,1,1,3.3));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'De Voorhof Franeker',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0070100000322628'],description:'Stedelijk kerkgebouw met afgeschuinde dakvlakken en lage zijvleugel.',realWorld:{groundNapM:.992,roofNapM:11.7},sources:['https://www.kerkinfraneker.nl/','https://www.kerkinfraneker.nl/wp-content/uploads/2013/11/KerkinFraneker.jpg','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000322628','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
