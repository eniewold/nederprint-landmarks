import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='jacobuskerk-rolde',B=-.3,O=[239516,556506.4],axis=[.9946,.104];
const roofed=(poly,planes,z=70)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);const sq=(x,y,h)=>rect(x-h,y-h,x+h,y+h);
// Recht schip en vijfzijdig koor: beide onder één doorlopend zadeldak met schilden.
const nave=roofed(rect(-11.1,-6.15,14.5,5.05),[[0,1.23,17.1],[0,-1.23,18.3]]);
const choirPoly=[[14.2,-6.15],[17.5,-4.5],[19.8,-1.4],[19.8,.8],[17.4,4.0],[14.2,5.05]];
const choir=roofed(choirPoly,[[0,1.23,17.1],[0,-1.23,18.3],[-1.23,0,40.5]]);
// Toren met bakstenen schacht en vierzijdige spits; de smalle piek is op printmaat begrensd.
const tower=union([prism(rect(-19.1,-5,-11.05,3.4),B,30.3),loft(rect(-19.1,-5,-11.05,3.4),30.2,sq(-15.1,-.8,.48),52.75)]);
const sacristy=roofed(rect(5.3,-10.6,10.8,-6),[[1,0,.95],[-1,0,17.05]]);
// Metselsteunberen met afgeschuinde bovenzijde.
const buttresses=[];for(const x of [-10.6,-5.5,-.2,5.2,10.6,14.8])for(const side of [-1,1]){let y0=side<0?-7.25:4.95,y1=side<0?-6.0:6.15;buttresses.push(roofed(rect(x-.52,y0,x+.52,y1),side<0?[[0,1,16.8]]:[[0,-1,15.7]]));}
let solid=union([nave,choir,tower,sacristy,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.65)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-8,-2.8,2.5,8,13])cuts.push(niche(x,-6.25,1.4,4.3,12),niche(x,4.45,1.4,4.3,12));
cuts.push(niche(-19.7,-.8,1.7,.1,4.2,-90));for(const z of [12,21,26])cuts.push(niche(-19.7,-.8,1.1,z,z+2.3,-90));
solid=solid.subtract(union(cuts));if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Jacobuskerk Rolde',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1680100000003235'],description:'Vijftiende-eeuwse zaalkerk met veelhoekig koor, steunberen, toren met naaldspits en sacristie.',realWorld:{groundNapM:16.32,naveRidgeNapM:33.99,towerHeightM:52.75,ahnSpireMaxNapM:63.02},sources:['https://www.jacobuskerkrolde.nl/gebouw_2/','https://www.rolde.nl/hoogtepunten/gebouwen/jacobuskerk','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000003235','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));


