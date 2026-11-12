import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='sint-antoniuskerk-zwartemeer',B=-.3,O=[267017,525289],axis=[.9995,-.0316];
const roofed=(poly,planes,z=45)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const nave=roofed(rect(-12.4,-5.7,9.3,5.7),[[0,1.12,16.6],[0,-1.12,16.6]]);
const cross=roofed(rect(-6.2,-10.5,3.65,10.35),[[1.12,0,17.94],[-1.12,0,15.26]]);
const apse=roofed([[8.6,-5.7],[11.1,-4.7],[12.7,-2.7],[12.7,2],[11.1,4.2],[8.6,5.4]],[[0,1,15.5],[0,-1,15.5],[-1,0,23.8]]);
const sacristy=roofed(rect(3.4,5.4,11.1,9.2),[[1,0,1.7],[-1,0,15.9]]);
const annex=prism(rect(3.4,-10.15,11.0,-5.4),B,4.2);
// Een aantal brede steunberen langs de zijmuren hoort tot de oorspronkelijke kruiskerk.
const braces=[];for(const x of [-11,-6,3.4,8.5])for(const side of [-1,1]){const [y0,y1]=side<0?[-6.4,-5.4]:[5.4,6.4];braces.push(roofed(rect(x-.48,y0,x+.48,y1),side<0?[[0,1,14.8]]:[[0,-1,14.8]]));}
let solid=union([nave,cross,apse,sacristy,annex,...braces]);
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-10,-8,5.5,7.4])cuts.push(niche(x,-5.8,1.1,4,8.5),niche(x,5.0,1.1,4,8.5));cuts.push(niche(-13,-.1,1.6,.1,4,-90));for(const x of [-4,-2,0,2]){cuts.push(niche(x,-10.6,1.0,4,8.5),niche(x,9.7,1.0,4,8.5));}
solid=solid.subtract(union(cuts));if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Sint-Antoniuskerk Zwartemeer',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0114100000233666'],description:'Neogotische kruiskerk met dwarskappen, veelhoekig koor en sacristie; dakruiter is verwijderd.',realWorld:{groundNapM:17.61,naveRidgeNapM:35.03},sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/510943','https://www.openmonumentendag.nl/monument/oude-of-sint-antoniuskerk/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0114100000233666','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));

