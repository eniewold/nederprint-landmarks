import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const slug='protestantse-gemeente-hoogeveen',B=-.3,O=[228724.5,526911.75],axis=[.99949,.0318];
const roofed=(poly,planes,z=50)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const sq=(x,y,h)=>rect(x-h,y-h,x+h,y+h);
// De zaal heeft een zadeldak en een verbrede achterpartij; vóór de zaal staat het portaal.
const nave=roofed(rect(-13,-11.15,14.1,11.15),[[0,1.0,22.15],[0,-1.0,22.15]]);
const crossRoofs=[-7,5].map(x=>roofed(rect(x-4,-11.05,x+4,11.05),[[1,0,17.8-x],[-1,0,17.8+x]]));
const rear=roofed(rect(13.9,-9.2,17.05,9.2),[[0,1.0,22.15],[0,-1.0,22.15],[-1,0,35.5]]);
const portal=roofed(rect(-18.45,-3.3,-12.8,3.3),[[0,1,7.6],[0,-1,7.6]]);
// Hoekpinakels met vierzijdige kap flankeren de getrapte voorgevel.
const towers=[];for(const y of [-9.4,9.4])towers.push(prism(sq(-12.25,y,1.6),B,15.1),loft(sq(-12.25,y,1.6),15.0,sq(-12.25,y,.48),17.0));
// Het open klokhuis is op printschaal een gesloten, door nissen geleed volume.
const spire=union([prism(sq(-12.25,0,1.15),19.8,25),loft(sq(-12.25,0,1.5),24.9,sq(-12.25,0,.8),26.5),loft(sq(-12.25,0,.8),26.4,sq(-12.25,0,.48),32.34)]);
let solid=union([nave,rear,portal,...crossRoofs,...towers,spire]);
// Blinde ramen en doorgang hebben zelfdragende puntbogen.
const niche=(x,y,w,z0,z1,angle=0,depth=.6)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-8,-3,2,7,12])cuts.push(niche(x,-11.25,1.2,3.0,8.5),niche(x,10.65,1.2,3.0,8.5));
cuts.push(niche(-19,0,2.0,.1,4.3,-90));for(const y of [-5.4,-3.8,3.8,5.4])cuts.push(niche(-13.5,y,1.0,5.5,9.5,-90));
solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Protestantse Gemeente Hoogeveen',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0118100000129129'],description:'Hoofdstraatkerk met zadeldak, voorportaal, twee hoekpinakels en centrale dakruiter.',realWorld:{groundNapM:12.28,naveRidgeNapM:34.45,spireTopNapM:44.62},sources:['https://gereformeerdekerken.info/2017/08/26/de-hoofdstraatkerk-te-hoogeveen/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000129129','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);
for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}
const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));

