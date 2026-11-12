import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='nieuwe-kerk-hoogzand-van-oostermeer-eastermar',B=-.3,O=[200667,577529],axis=[.975,-.219];
const roofed=(poly,planes,z=35)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk en aangebouwde voormalige verenigingsruimten met platte tussenbouw.
const nave=roofed(rect(-13.2,-8.3,13.2,3.8),[[0,1,16.12],[0,-1,11.62]]);
const choir=roofed([[13,-5.7],[14.6,-5.7],[17,-3.8],[17,-.7],[14.6,1.2],[13,1.2]],[[0,1,16.12],[0,-1,11.62],[-1,0,29.2]]);
const connector=prism(rect(-3.3,-35.5,8.5,-8.1),B,3.8);
const rear=roofed(rect(-16.3,-40.5,4.8,-33.8),[[0,1,43.8],[0,-1,-30.5]]);
const side=roofed(rect(4.6,-35.5,13.7,-21.6),[[1,0,21.2],[-1,0,2.9]]);
const hallTower=roofed(rect(-16.3,-35.5,-13.7,-32),[[0,1,41.8],[0,-1,-24.2]]);;const tower=prism(rect(-13.2,-3.7,-10.9,-1),B,19.4);
const spire=hull([[-13.2,-3.7,19.3],[-10.9,-3.7,19.3],[-10.9,-1,19.3],[-13.2,-1,19.3],[-12.05,-2.35,26.7]]);
let solid=union([nave,choir,connector,rear,side,hallTower,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-8,-3,2,7,11])cuts.push(niche(x,3.1,1.1,2.8,6.8),niche(x,-8.4,1.1,2.8,6.8));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Nieuwe Kerk Hoogzand van Oostermeer Eastermar',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0737100000014279'],description:'Negentiende-eeuwse zaalkerk met spitse dakruiter en aangesloten kerkelijk verenigingsgebouw.',realWorld:{groundNapM:2.393,naveRidgeNapM:16.26,towerPeakNapM:29.14},sources:['https://kennis.cultureelerfgoed.nl/index.php/Complexen/512552','https://commons.wikimedia.org/wiki/Category:Nieuwe_Kerk_(It_Heechs%C3%A2n)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000014279','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));


