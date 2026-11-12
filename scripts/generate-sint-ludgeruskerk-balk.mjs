import {union,hull,prism,rect,circle,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='sint-ludgeruskerk-balk',B=-.3,O=[167982,545582],axis=[.57,-.8216];
const roofed=(poly,planes,z=45)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);const sq=(x,y,h)=>rect(x-h,y-h,x+h,y+h),oct=(x,y,r)=>circle([x,y],r,8,Math.PI/8);
// Hogere middenbeuk, twee lagere zijbeuken en veelhoekige koorsluiting.
const nave=roofed(rect(-15.6,-6.35,8.3,-.25),[[0,1.45,21.985],[0,-1.45,12.415]]);
const aisle1=roofed(rect(-15.6,-10.35,7.8,-6.1),[[0,.5,12.5]]),aisle2=roofed(rect(-15.6,-.5,7.8,3.8),[[0,-.5,10.6]]);
const choir=roofed([[7.8,-8.6],[10.7,-6.4],[13.5,-4.5],[13.5,-2],[10.7,.5],[7.8,1.5]],[[0,1.2,20.9],[0,-1.2,13.1],[-1.2,0,29.5]]);
// Sacristie en verbindingsgang naar het naastgelegen, zelfstandige pastoriepand.
const sacristy=roofed(rect(3.7,3.5,11.4,13.7),[[1,0,1.8],[-1,0,16.9]]);
const tower=union([prism(rect(-21.1,-6.55,-15.4,-.45),B,23),loft(rect(-21.1,-6.55,-15.4,-.45),22.9,oct(-18.25,-3.5,2.8),24),loft(oct(-18.25,-3.5,2.8),23.9,oct(-18.25,-3.5,.48),36.82)]);
const stair=roofed(rect(-17.7,-8,-15.4,-6.2),[[1,0,25.0],[-1,0,-7.0]]);
const braces=[];for(const x of [-15,-10.9,-6.5,-2.1,2.3,7])for(const side of [-1,1]){const [y0,y1]=side<0?[-11,-10.2]:[3.65,4.45];braces.push(roofed(rect(x-.48,y0,x+.48,y1),side<0?[[0,1,18]]:[[0,-1,12]]));}
let solid=union([nave,aisle1,aisle2,choir,sacristy,tower,stair,...braces]);const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-13,-8.6,-4.2,.2,4.5])cuts.push(niche(x,-10.45,1,2.4,6.7),niche(x,3.05,1,2.4,6.7));cuts.push(niche(-21.7,-3.5,1.5,.05,3.5,-90));for(const z of [15.5,20])cuts.push(niche(-21.7,-3.5,1,z,z+2,-90));solid=solid.subtract(union(cuts));
if(process.argv.includes('--components'))for(const c of solid.decompose())console.log('component',c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',solid]],catalog:{name:'Sint-Ludgeruskerk Balk',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0653100000147026'],description:'Driebeukige neogotische basiliek met koor, sacristie, westtoren, traptorentje en ingesnoerde spits.',realWorld:{groundNapM:.337,naveRidgeNapM:17.57,towerPeakNapM:37.16},sources:['https://www.monumenten.nl/monument/513656','https://kennis.cultureelerfgoed.nl/index.php/Complexen/513655','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0653100000147026','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
