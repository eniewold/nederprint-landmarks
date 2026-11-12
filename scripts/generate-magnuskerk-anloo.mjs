import {union,hull,prism,rect,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
// Hoofdassen en daknokken volgens BAG en AHN4; +X naar het koor.
const B=-.3,origin=[242905.8,562599.7],axis=[.99999,.003],ground=14.198;
const roofed=(poly,planes,z=34)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const nave=roofed(rect(-14.8,-5.7,6.35,5.7),[[0,1.12,13.9],[0,-1.12,13.9]]);
const choir=roofed([[6.15,-4.47],[17.1,-4.5],[20.6,-2.5],[20.8,1.9],[17.1,4.55],[6.15,4.5]],[[0,1.12,12.9],[0,-1.12,12.9],[-1.13,0,32.22]]);
const tower=roofed(rect(-21.45,-3.55,-14.65,3.48),[[0,1.23,23.7],[0,-1.23,23.7]]);
// Twee echte trapgevels: stenen treden op de koppen van het zadeldak.
const steps=[];
for(const [x0,x1] of [[-21.5,-20.65],[-15.45,-14.60]]){
 for(const [half,top] of [[3.5,19.7],[2.7,20.7],[1.9,21.7],[1.0,22.7],[.48,23.7]])steps.push(prism(rect(x0,-half,x1,half),B,top));
}
// Dakruiter op het zadel; opening tot een blinde nis vereenvoudigd en de kolom verdikt.
const lantern=prism(rect(-18.65,-.62,-17.45,.58),23.0,25.5);
const spire=loft(rect(-18.65,-.62,-17.45,.58),25.4,rect(-18.18,-.15,-17.92,.11),29.95);
// Schuine steunberen langs het lagere koor, minimaal 0,9 m breed.
const buttresses=[];
for(const x of [6.7,11.4,16.6])for(const side of [-1,1]){
 const y0=side<0?-5.25:4.3,y1=side<0?-4.3:5.25;
 buttresses.push(loft(rect(x-.45,y0,x+.45,y1),B,rect(x-.45,y0,x+.45,y1),6.0));
}
let all=union([nave,choir,tower,...steps,lantern,spire,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.65)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];
for(const x of [-12.0,-8.2,-4.2,-.2,3.6])cuts.push(niche(x,-5.8,.95,3.5,6.5),niche(x,5.15,.95,3.5,6.5));
for(const x of [8.7,13.9])cuts.push(niche(x,-4.56,1.15,2.7,6.5),niche(x,4.0,1.15,2.7,6.5));
cuts.push(niche(20.9,-.2,1.0,2.7,6.5,90),niche(-9.7,-5.8,1.2,.1,2.5),niche(-10.0,5.15,1.2,.1,2.5),niche(-21.55,0,1.2,.1,3.3,-90));
for(const y of [-1.1,1.1])cuts.push(niche(-21.55,y,.9,14.3,17.3,-90));
for(const x of [-19.8,-16.5])cuts.push(niche(x,-3.65,.9,14.3,17.3),niche(x,2.95,.9,14.3,17.3));
all=all.subtract(union(cuts));
await writeLandmark({slug:'magnuskerk-anloo',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Magnuskerk Anloo',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1680100000008375'],description:'Romaanse kerk met lager driezijdig gesloten koor en zadeldaktoren met twee trapgevels en dakruiter.',realWorld:{groundNapM:ground,naveRidgeNapM:28.1,choirRidgeNapM:27.1,towerRidgeNapM:37.9,towerSpireNapM:44.15},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000008375','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.drentscheaa.nl/drentsche-aa-verhaal/mens-landschap/kerktorens-bakens/','https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Anloo']}});



// Behoud de twee vaste afdrukschalen ook bij een afzonderlijke generatoraanroep.
const outputFlag = process.argv.indexOf('--out');
const modelRoot = outputFlag >= 0 && process.argv[outputFlag+1] ? path.resolve(process.argv[outputFlag+1]) : path.join(import.meta.dirname, '../models');
const modelDir = path.join(modelRoot, 'magnuskerk-anloo');
const inputStl = await readFile(path.join(modelDir, `magnuskerk-anloo-1-${scale}.stl`));
const triangleCount = inputStl.readUInt32LE(80);
for (const fixedScale of [1000, 100]) {
  if (fixedScale === scale) continue;
  const result = Buffer.from(inputStl);
  result.fill(0, 0, 80);
  result.write(`NederPrint Magnuskerk Anloo 1:${fixedScale} mm Z-up`.slice(0, 79), 0, 80, "ascii");
  for (let i = 0; i < triangleCount; i++) for (let v = 0; v < 9; v++) {
    const offset = 84 + i * 50 + 12 + v * 4;
    result.writeFloatLE(inputStl.readFloatLE(offset) * scale / fixedScale, offset);
  }
  await writeFile(path.join(modelDir, `magnuskerk-anloo-1-${fixedScale}.stl`), result);
}
const manifestPath = path.join(modelDir, 'magnuskerk-anloo.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.printFiles = [...new Set([`magnuskerk-anloo-1-${scale}.stl`, 'magnuskerk-anloo-1-1000.stl', 'magnuskerk-anloo-1-100.stl'])];
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
