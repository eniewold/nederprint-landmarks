import {union,hull,prism,rect,writeLandmark,scale,toStl} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';
const slug='dorpskerk-goingarijp',B=-.3,O=[180723,558206],axis=[.99995,.01];
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk en vrijstaande klokkenstoel; stijlen zijn voor printschaal verbreed.
const nave=roofed(rect(-7.2,-3.5,5.1,3.5),[[0,1.18,9.6],[0,-1.18,9.6]]);
const choir=roofed([[5,-3.5],[7.3,-1.6],[7.3,1.6],[5,3.5]],[[0,1.18,9.6],[0,-1.18,9.6],[-1.18,0,15.5]]);
const niche=(x,y,w,z0,z1,angle=0,depth=.7)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
let kerk=union([nave,choir]);const cuts=[];for(const x of [-4,0,4])cuts.push(niche(x,-3.6,1,2,5.3),niche(x,2.9,1,2,5.3));cuts.push(niche(-7.8,0,1.2,.1,2.7,-90));kerk=kerk.subtract(union(cuts));
const cx=-10.7,cy=.5;const leg=(x,y)=>hull([[cx+x-.5,cy+y-.5,B],[cx+x+.5,cy+y-.5,B],[cx+x+.5,cy+y+.5,B],[cx+x-.5,cy+y+.5,B],[cx+x*.5-.5,cy+y*.5-.5,5.5],[cx+x*.5+.5,cy+y*.5-.5,5.5],[cx+x*.5+.5,cy+y*.5+.5,5.5],[cx+x*.5-.5,cy+y*.5+.5,5.5]]);
const cap=hull([[cx-.8,cy-.8,5],[cx+.8,cy-.8,5],[cx+.8,cy+.8,5],[cx-.8,cy+.8,5],[cx-1.65,cy-1.65,5.9],[cx+1.65,cy-1.65,5.9],[cx+1.65,cy+1.65,5.9],[cx-1.65,cy+1.65,5.9],[cx,cy,8.3]]);
const stoel=union([leg(-1.3,-1.3),leg(-1.3,1.3),leg(1.3,-1.3),leg(1.3,1.3),cap]);
if(process.argv.includes('--components'))for(const [name,s] of [['kerk',kerk],['stoel',stoel]])for(const c of s.decompose())console.log(name,c.volume(),c.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',kerk],['building:klokkenstoel',stoel]],catalog:{name:'Dorpskerk Goingarijp',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0051100001226614'],description:'Zaalkerk uit 1770 met vrijstaande houten klokkenstoel.',realWorld:{groundNapM:.303,naveRidgeNapM:9.9,bellFrameTopNapM:8.6},sources:['https://www.tsjerkepaad.nl/overzicht-kerken/goingarijp-dorps-kerk','https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0010.php','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0051100001226614','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));


// Een extra grondplaat maakt de twee vrijstaande bouwdelen samen printbaar op 1:100.
const plate=prism(rect(-13,-4.2,8,4.2),-.5,-.25);
const onPlate=union([kerk,stoel,plate]).scale([scale/100,scale/100,scale/100]);
const plateName=`${slug}-grondplaat-1-100.stl`;
await writeFile(path.join(dir,plateName),toStl(onPlate,`${slug} grondplaat 1:100`).buffer);
j.printFiles.push(plateName);await writeFile(mf,JSON.stringify(j,null,2));
