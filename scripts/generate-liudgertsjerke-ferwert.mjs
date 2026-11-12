import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='liudgertsjerke-ferwert',B=-.3,O=[184110,594642],axis=[.35,-.93675];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// T-vormige kerk met dwarskap, entreeportiek en aangebouwde Rehobothzaal.
const main=roofed(rect(-11,-5.2,11.6,7),[[0,.9,14.56],[0,-.9,12.94]]);
const wing=roofed(rect(-7.4,6.8,8.1,13.5),[[.75,0,14.09],[-.75,0,13.51]]);
const porch=roofed(rect(-12.6,-1.4,-10.8,3.1),[[0,1,6.9],[0,-1,5.2]]);
const rear=roofed(rect(11.4,-1.4,13.2,3.1),[[0,1,6.9],[0,-1,5.2]]);
const annex=roofed([[8,7],[8,8.4],[14.2,12.6],[6.3,24],[3,21.7],[.1,25.7],[-7,20.7],[-4.1,16.7],[-3.2,13.5],[-7.4,13.4],[-7.4,7]],[[.57,.4,0],[-.57,-.4,17]]);
let solid=union([main,wing,porch,rear,annex]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-8,-4,1,5,9])cuts.push(niche(x,-5.3,1,2.7,7.2));cuts.push(niche(-13.2,.8,1.3,.1,3.7,-90),niche(-11.1,.8,4,7.7,11.8,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Liudgertsjerke Ferwert',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1722100000004372'],description:'T-vormige kerk met dwarskap, portiek en aangebouwde Rehobothzaal.',realWorld:{groundNapM:.915,naveRidgeNapM:14.73},sources:['https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0058.php','https://commons.wikimedia.org/wiki/Category:Liudgertsjerke,_Ferwert','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000004372','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));


