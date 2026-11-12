import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X dwars op de nok, +Y langs de lange kap; maten in meters, AHN4/3D BAG.
const B=-.3,origin=[233865,557260],axis=[.941,-.339],ground=10.611;
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Kruisende zadeldaken met kilgoten vormen het historische kerkgebouw.
const churchLong=roofed(rect(-7.8,-19.5,4.2,11.0),[[1,0,15.3],[-1,0,11.9]]);
const churchCross=roofed(rect(-11.55,-10.5,11.7,3.5),[[0,.85,16.49],[0,-.85,10.71]]);
// Lagere aanbouw langs de straat en het platte zalencomplex aan de achterzijde.
const lowStreet=prism(rect(-11.45,-19.4,-7.6,10.5),B,6.15);
const rear=prism([[-11.3,10.3],[4,10.3],[4,14.0],[9.5,14.0],[9.5,6.6],[17.6,6.9],[22.1,6.8],[23.9,7.0],[22.5,23.8],[19.5,23.6],[19.2,27.2],[13.4,26.6],[8.7,25.6],[8.9,23.2],[3.9,22.6],[-11.3,21.8]],B,3.7);
const rearWing=prism(rect(-11.3,10.1,4.0,22.5),B,7.2);
const smallWing=prism(rect(4,-19.5,12.6,-10.2),B,5.4);
// Vier forse lichtkappen op het platte dak, volgens luchtfoto en LoD2.2.
const skylights=[];
for(const x of [13.5,19.8])for(const y of [9.8,19.6])skylights.push(loft(rect(x-2.5,y-2.6,x+2.5,y+2.6),3.6,rect(x-1.7,y-1.9,x+1.7,y+1.9),5.9));
// Drie opgaande geveltoppen van de straatvleugel.
const gables=[];
for(const y of [-15,-12,-9])gables.push(roofed(rect(-11.55,y-1.05,-7.6,y+1.05),[[0,1.05,7.8-1.05*y],[0,-1.05,7.8+1.05*y]],12));
let all=union([churchLong,churchCross,lowStreet,rear,rearWing,smallWing,...skylights,...gables]);
const niche=(x,y,w,z0,z1,angle=0,depth=.6)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];
for(const y of [-17,-14,-11,-8,-5,0])cuts.push(niche(-11.6,y,1.0,1.6,4.5,-90));
for(const x of [-5.4,-3.0,-.6,1.8])cuts.push(niche(x,-19.6,1.0,5.6,10.7));
for(const x of [5.3,7.4,9.5])cuts.push(niche(x,2.95,1.0,4.6,10.2));
cuts.push(niche(-11.6,5.0,1.5,0,3.1,-90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'de-kandelaar-assen',base:B,nodes:[['building:kerk-en-zalen',all]],catalog:{name:'De Kandelaar Assen',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0106100000000328'],description:'Historisch kerkgebouw met kruisende zadeldaken, lagere straatvleugel en zalencomplex met vier lichtkappen.',realWorld:{groundNapM:ground,ridgeNapM:24.26,annexRoofNapM:14.31,skylightTopNapM:16.51},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000328','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:Kandelaarkerk_Assen.jpg','https://drenthe.erfgoedcms.nl/lemma/assen']}});

// Beide printschalen blijven in de catalogus vermeld na regeneratie.
const { readFile, writeFile } = await import("node:fs/promises");
const { default: path } = await import("node:path");
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const catalogDir = path.resolve(outIndex >= 0 && args[outIndex + 1] ? args[outIndex + 1] : path.join(import.meta.dirname, "../models"), "de-kandelaar-assen");
const catalogPath = path.join(catalogDir, "de-kandelaar-assen.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
catalog.printFiles = ["de-kandelaar-assen-1-100.stl", "de-kandelaar-assen-1-1000.stl"];
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
