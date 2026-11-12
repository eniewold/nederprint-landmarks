import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='tsjerke-fan-friens',B=-.3,O=[182658,568100.8],axis=[.9983,-.0587];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk uit 1795 met driezijdig koor en spitse dakruiter.
const nave=roofed(rect(-8.6,-4.25,7.8,4.3),[[0,1,10.65],[0,-1,10.65]]);
const choir=roofed([[7.7,-4.3],[10.2,-2],[10.2,1.8],[7.7,4.3]],[[0,1,10.65],[0,-1,10.65],[-1,0,18.35]]);
const tower=prism(rect(-8.25,-1.3,-5.7,1.3),8.3,13.8);
const spire=hull([[-8.25,-1.3,13.7],[-5.7,-1.3,13.7],[-5.7,1.3,13.7],[-8.25,1.3,13.7],[-6.975,0,20.45]]);
let solid=union([nave,choir,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-5,-.5,4])cuts.push(niche(x,-4.35,1.1,2,5.8),niche(x,3.6,1.1,2,5.8));cuts.push(niche(-9.2,0,1.2,.1,3,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Tsjerke fan Friens',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0055100000253640'],description:'Zaalkerk uit 1795 met driezijdig koor en dakruiter.',realWorld:{groundNapM:2.514,naveRidgeNapM:13.17,towerPeakNapM:22.96},sources:['https://kennis.cultureelerfgoed.nl/index.php/Monumenten/22881','https://www.tsjerkepaad.nl/overzicht-kerken/friens-kerk','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0055100000253640','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
