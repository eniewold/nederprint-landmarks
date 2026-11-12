import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='de-fontein-schoonoord',B=-.3,O=[247476.7,540837.9],axis=[.797,.604];
const roofed=(poly,planes,z=40)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);const sq=(x,y,h)=>rect(x-h,y-h,x+h,y+h);
// Waterstaatskerk met rondom afgewolfd dak en middenrisaliet met fronton.
const nave=roofed(rect(-10,-5.4,10.1,5.35),[[0,.75,12.55],[0,-.75,12.55],[.75,0,17.05],[-.75,0,17.05]]);
const portal=roofed(rect(-3.15,5.1,2.7,6.6),[[1,0,12.2],[-1,0,11.75]]);
// De verplaatste open klokkentoren wordt op printschaal een gesloten bouwdeel met blinde nissen.
const tower=union([prism(sq(0,0,1.45),11.7,14.1),prism(sq(0,0,1.05),14,16.75),loft(sq(0,0,1.1),16.65,sq(0,0,.48),18.26)]);
let solid=union([nave,portal,tower]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-8,-5,4.7,7.8])cuts.push(niche(x,4.82,1.3,2.5,7.5),niche(x,-5.5,1.3,2.5,7.5));cuts.push(niche(-.22,6.05,1.5,0,3.2),niche(-.22,6.05,1.2,4.2,8.3));
cuts.push(niche(0,-1.15,.95,14.4,16.4),niche(0,.60,.95,14.4,16.4));
solid=solid.subtract(union(cuts));if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'De Fontein Schoonoord',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0109100000015114'],description:'Voormalige Waterstaatskerk met schilddak, middenrisaliet en verplaatste dakruiter.',realWorld:{groundNapM:19.205,naveRidgeNapM:31.735,towerTopNapM:37.469},sources:['https://www.monumenten.nl/monument/33785','https://www.geheugenvandrenthe.nl/encyclopedie-drenthe/schoonoord','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000015114','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));

