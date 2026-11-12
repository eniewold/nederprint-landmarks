import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
// De Antenne Hijken: lokale +X loopt van de voorgevel naar de achterbouw.
const B=-.3,O=[229806,545859],axis=[.4795,-.8775],slug='kerkelijk-centrum-de-antenne-hijken';
const roofed=(poly,planes,z=60)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// 1906 zaalkerk met zadeldak, nok evenwijdig aan X, en langwerpige kleine uitbouw.
const nave=roofed(rect(-15,-3.7,5.0,4.7),[[0,.85,8.57],[0,-.85,9.42]]);
const side=roofed(rect(-.3,4.5,5,6.9),[[0,-.85,10.5]]);
// Lage verbindingsbouw en dwarsgeplaatst zadeldak van het ontmoetingscentrum uit 1982/83.
const link=prism(rect(4.8,-2.7,8.9,5.7),B,3.0);
const rear=roofed(rect(8.7,-4.5,17.1,8.2),[[.67,0,-2.2],[-.67,0,15.36]]);
let all=union([nave,side,link,rear]);
// Deur, vensters en het ronde bovenlicht als ondiepe blinde nissen; geen maaswerk.
const niche=(x,y,w,z0,z1,angle=0,depth=.55)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[niche(-15.1,.5,1.4,.1,2.8,-90),niche(-15.1,-1.8,1.0,2.2,4.6,-90),niche(-15.1,2.8,1.0,2.2,4.6,-90)];
const oculus=[];for(const x of [-15.1,-14.6])for(let k=0;k<8;k++){const a=2*Math.PI*k/8;oculus.push([x,.5+.55*Math.cos(a),6.6+.55*Math.sin(a)]);}cuts.push(hull(oculus));
for(const x of [-11.3,-7.5,-3.7,.1]){cuts.push(niche(x,-3.8,1.0,2.0,5.3),niche(x,4.2,1.0,2.0,5.3));}
all=all.subtract(union(cuts));
await writeLandmark({slug,base:B,nodes:[['building:kerk',all]],catalog:{name:'Kerkelijk Centrum De Antenne Hijken',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1731100000030444'],description:'Zaalkerk met zadeldak, rond bovenlicht en een later ontmoetingscentrum onder een dwars zadeldak.',realWorld:{groundNapM:14.06,naveRidgeNapM:23.05,rearRidgeNapM:20.5},sources:['https://www.pgbeilen.nl/kerkgebouwen/antenne/','https://gereformeerdekerken.info/2019/10/24/de-eerste-100-jaar-gereformeerde-kerk-in-hijken-2/','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1731100000030444','https://service.pdok.nl/rws/ahn/wcs/v1_0']}});
// Beide vaste STL-schalen ontstaan bij elke aanroep en blijven opgenomen in printFiles.
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);
for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}
const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
