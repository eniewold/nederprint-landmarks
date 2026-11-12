import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const slug='protestantse-kerk-nieuw-weerdinge',B=-.3,O=[262657,542197],axis=[.5598,-.8286];
const roofed=(poly,planes,z=40)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const sq=(x,y,h)=>rect(x-h,y-h,x+h,y+h);
// Rechte kerkzaal, lang achtergebouw met lage kap en zijdelingse aanbouw.
const nave=roofed(rect(-20.9,-5.6,-.8,5.55),[[0,1,11.75],[0,-1,11.75]]);
const annex=roofed(rect(-.95,-4.83,20.84,4.92),[[0,.4,5.5],[0,-.4,5.5]]);
const wing=prism(rect(-.8,4.8,14.2,8.55),B,3.25);
// Gevelruiter: het stenen klokhuis en de naald als verbonden bouwdelen.
const tower=union([prism(sq(-20.05,0,1.05),10.3,13.05),loft(sq(-20.05,0,1.05),12.95,sq(-20.05,0,.48),17.65)]);
let solid=union([nave,annex,wing,tower]);
const niche=(x,y,w,z0,z1,angle=0,depth=.6)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-17,-13,-9,-5])cuts.push(niche(x,-5.7,1.05,2.0,5.6),niche(x,4.98,1.05,2.0,5.6));
cuts.push(niche(-21.5,0,1.35,.1,3.2,-90));for(const y of [-3.4,3.4])cuts.push(niche(-21.5,y,1.0,2.1,5.7,-90));
solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'protestantse kerk Nieuw-Weerdinge',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0114100000207643'],description:'Voormalige hervormde zaalkerk Het Anker met zadeldak, gevelruiter en achtergebouw.',realWorld:{groundNapM:11.97,naveRidgeNapM:23.7,spireTopNapM:29.62},sources:['https://www.orgelsindrenthe.nl/nederlands/nwweerhk.html','https://www.ensie.nl/monumenten-in-drenthe/kerken-in-nieuw-weerdinge','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0114100000207643','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);
for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}
const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
