import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='laurenskerk-echten',B=-.3,O=[183094,543011.2],axis=[.9999,.013];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Historische zaalkerk met driezijdige koorsluiting en aangebouwde spitse toren.
const nave=roofed(rect(-10.3,-4.2,7.9,4.2),[[0,1.15,10.7],[0,-1.15,10.7]]);
const choir=roofed([[7.8,-4.2],[11.65,-2.4],[11.75,1.8],[7.8,4.2]],[[0,1.15,10.7],[0,-1.15,10.7],[-1.1,0,19.4]]);
const tower=prism(rect(-13.15,-1.1,-10.1,2.3),B,15.6);
const spire=hull([[-13.15,-1.1,15.4],[-10.1,-1.1,15.4],[-10.1,2.3,15.4],[-13.15,2.3,15.4],[-11.6,.6,23.2]]);
let solid=union([nave,choir,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-7,-2,3,7])cuts.push(niche(x,3.5,1.1,2.3,5.8),niche(x,-4.3,1.1,2.3,5.8));cuts.push(niche(-13.8,.6,1.2,.1,3.2,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Laurenskerk Echten',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0082100000151764'],description:'Zeventiende-eeuwse zaalkerk met driezijdig koor en toren uit 1879.',realWorld:{groundNapM:.019,naveRidgeNapM:10.74,towerPeakNapM:23.23},sources:['https://kennis.cultureelerfgoed.nl/index.php/Monumenten/25776','https://www.pknechtenerbrugoosterzee.nl/locations/laurenskerk/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0082100000151764','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
