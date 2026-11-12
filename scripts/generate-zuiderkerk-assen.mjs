import path from 'node:path';
import {readFile,writeFile} from 'node:fs/promises';
import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +Y naar de voorgevel; kaprichtingen uit BAG en AHN4, meters.
const B=-.3,origin=[233871,556725],axis=[.9988,-.0486],ground=9.827;
const roofed=(poly,planes,z=32)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Dwarskappen vormen een kruis met kilgoten.
const nave=roofed(rect(-6.75,-17.1,6.85,15.2),[[1.2,0,16.6],[-1.2,0,16.6]]);
const cross=roofed(rect(-11.65,-6.5,11.8,7.2),[[0,1.2,16.6],[0,-1.2,16.6]]);
const rearLeft=prism(rect(-10.9,-17.1,-6.6,-6.3),B,7.0);
const rearRight=roofed(rect(6.7,-17.1,15.6,-9.7),[[0,.9,22.2],[0,-.9,-.4]],25);
const tower=prism(rect(6.75,8.6,11.75,12.7),B,16.5);
const towerRoof=loft(rect(6.7,8.55,11.8,12.75),16.4,rect(8.95,10.45,9.55,10.95),22.8);
const sideTower=prism(rect(-11.65,7.1,-6.5,10.2),B,8.6);
const sideRoof=loft(rect(-11.65,7.1,-6.5,10.2),8.5,rect(-9.2,8.5,-8.9,8.8),10.7);
// Toegangspartij met blinde rondboognis, vooruitgeschoven tot aan de straat.
const portal=roofed(rect(-3.4,14.9,3.4,16.15),[[1,0,7.5],[-1,0,7.5]],12);
let all=union([nave,cross,rearLeft,rearRight,tower,towerRoof,sideTower,sideRoof,portal]);
const niche=(x,y,w,z0,z1,angle=0,depth=.65)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];
for(const x of [-2.0,0,2.0])cuts.push(niche(x,14.65,1.0,5.7,12.3));
for(const x of [-4.8,4.8])cuts.push(niche(x,14.65,.9,4.9,10.1));
cuts.push(niche(0,15.6,1.5,0,3.5),niche(9.2,12.2,1.1,0,3.0));
for(const y of [-4.5,-1.5,1.5,4.5])cuts.push(niche(-11.75,y,1.0,2.0,6.8,-90),niche(11.9,y,1.0,2.0,6.8,90));
for(const x of [-4.5,-2.2,0,2.2,4.5])cuts.push(niche(x,-17.2,.9,4.5,10.0));
all=all.subtract(union(cuts));
await writeLandmark({slug:'zuiderkerk-assen',base:B,nodes:[['building:kerk-en-toren',all]],catalog:{name:'Zuiderkerk Assen',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0106100000000646'],description:'Interbellum kerk met kruisende zadeldaken, gemetselde entree en vierkante toren met tentdak.',realWorld:{groundNapM:ground,ridgeNapM:26.42,towerTopNapM:32.63},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000646','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/469336','https://commons.wikimedia.org/wiki/Category:Zuiderkerk_(Assen)']}});

// De catalogus blijft beide standaardexports vermelden, ongeacht de laatst gegenereerde schaal.
const outIndex=process.argv.indexOf('--out');
const outRoot=path.resolve(outIndex>=0 && process.argv[outIndex+1] ? process.argv[outIndex+1] : path.join(import.meta.dirname,'../models'));
const metadataPath=path.join(outRoot,'zuiderkerk-assen','zuiderkerk-assen.json');
const metadata=JSON.parse(await readFile(metadataPath,'utf8'));
metadata.printFiles=[...new Set(['zuiderkerk-assen-1-100.stl','zuiderkerk-assen-1-1000.stl',...metadata.printFiles])];
await writeFile(metadataPath,JSON.stringify(metadata,null,2)+'\n');
