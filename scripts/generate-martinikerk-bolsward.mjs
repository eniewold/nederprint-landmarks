import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='martinikerk-bolsward',B=-.3,O=[164330,564213],axis=[.9975,.071];
const roofed=(poly,planes,z=65)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Pseudobasiliek: middenbeuk en twee lagere zijbeuken met eigen schuine dakvlakken.
const nave=roofed(rect(-34.4,-5.3,31.1,6.9),[[0,1.35,26.48],[0,-1.35,24.32]]);
const aisle1=roofed(rect(-34.4,-11.65,20,-5.2),[[0,.75,20.4]]),aisle2=roofed(rect(-34.4,6.7,26.1,13.35),[[0,-.75,21.6]]);
const choir=roofed([[30.8,-5.1],[34.4,-4.2],[36.6,-1.6],[36.9,1.9],[35.1,4.8],[31.9,6.0],[30.8,6.0]],[[0,1.35,26.48],[0,-1.35,24.32],[-1.35,0,68.1]]);
// Monumentale westtoren met zadeldak; de oude houten bekroning is verdwenen.
const tower=roofed(rect(-34.55,-5.1,-23,7.0),[[0,1.6,51.34],[0,-1.6,48.78]]);
const stair=roofed(rect(-22.5,-19,-17,-11.4),[[1,0,34],[-1,0,-5]]);
const buttresses=[];for(const x of [-33.4,-28,-22.6,-16.6,-10.7,-4.8,1.4,7.1,13.3,19.3,25.6])for(const side of [-1,1]){if(side<0&&x>20)continue;const [y0,y1]=side<0?[-12.65,-11.5]:[13.2,14.35];buttresses.push(roofed(rect(x-.5,y0,x+.5,y1),side<0?[[0,1,22.5]]:[[0,-1,24.2]]));}
let solid=union([nave,aisle1,aisle2,choir,tower,stair,...buttresses]);const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-30.5,-25.3,-19.6,-13.5,-7.8,-1.7,4.2,10.2,16.2]){if(x!==-19.6)cuts.push(niche(x,-11.75,1.6,3.0,9.5));cuts.push(niche(x,12.65,1.6,3.0,9.5));}cuts.push(niche(-35.2,1,2.2,.1,5,-90));for(const y of [-2,1,4])cuts.push(niche(-35.2,y,1.25,33,37,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Martinikerk Bolsward',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0064100000128122'],description:'Gotische pseudobasiliek met lagere zijbeuken, veelhoekig koor en monumentale zadeldaktoren.',realWorld:{groundNapM:1.645,naveRidgeNapM:26.6,towerRidgeNapM:51.70},sources:['https://www.monumenten.nl/monument/9812','https://www.bolsward.nl/martinikerk/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0064100000128122','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));

