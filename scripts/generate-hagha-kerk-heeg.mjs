import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='hagha-kerk-heeg',B=-.3,O=[169526,553476.5],axis=[.99995,-.01];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk uit 1840 met driezijdige sluiting en oudere, houten geveltoren.
const nave=roofed(rect(-10.5,-5.7,11.1,5.7),[[0,1,13],[0,-1,13]]);
const choir=roofed([[11,-5.7],[14.5,-2.9],[14.9,-2.3],[14.9,1.8],[14.6,2.4],[11.1,5.5]],[[0,1,13],[0,-1,13],[-1,0,24.1]]);
const west=roofed(rect(-13.7,-4.65,-10.3,4.5),[[0,1,13],[0,-1,13]]);
const tower=prism(rect(-13.5,-1.8,-10.5,1.8),9.5,16.7);
const spire=hull([[-13.5,-1.8,16.6],[-10.5,-1.8,16.6],[-10.5,1.8,16.6],[-13.5,1.8,16.6],[-12,0,25.3]]);
let solid=union([nave,choir,west,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-6,-1,4,9])cuts.push(niche(x,-5.8,1.1,2,6.3),niche(x,5,1.1,2,6.3));cuts.push(niche(-14.3,0,1.2,.1,3.2,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Haghakerk Heeg',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0683100000287528'],description:'Zaalkerk met driezijdig koor en houten geveltoren met spits.',realWorld:{groundNapM:1.013,naveRidgeNapM:14,towerPeakNapM:26.35},sources:['https://www.tsjerkepaad.nl/overzicht-kerken/heeg-hagha-kerk','https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0076.php','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000287528','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
