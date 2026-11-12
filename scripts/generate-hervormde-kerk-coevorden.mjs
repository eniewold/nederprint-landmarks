import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// +X langs een nok naar het noordoosten, +Y 90 graden linksom; AHN4 en BAG.
const B=-.3,origin=[246499.9,520085.8],axis=[.515,.857],ground=11.155;
const roofed=(poly,planes,z=50)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const regular=(r,n=8)=>Array.from({length:n},(_,i)=>[r*Math.cos(Math.PI/8+i*2*Math.PI/n),r*Math.sin(Math.PI/8+i*2*Math.PI/n)]);
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Vier gelijkwaardige armen met kruisende zadeldaken en scherpe kilgoten.
const armX=roofed(rect(-13.7,-5.75,13.7,5.75),[[0,1.77,21.15],[0,-1.77,21.15]]);
const armY=roofed(rect(-5.75,-13.7,5.75,13.7),[[1.77,0,21.15],[-1.77,0,21.15]]);
// Lage hoekaanbouwen: driehoekige muurvakken, met aflopende dakvlakken.
const corners=[];
for(const sx of [-1,1])for(const sy of [-1,1]){
 const p=[[sx*5.6,sy*5.6],[sx*10.8,sy*5.6],[sx*5.6,sy*10.8]];if(sx*sy<0)p.reverse();
 corners.push(roofed(p,[[sx*.45,sy*.45,14.3]],25));
}
// Achtkante dakruiter, lantern en sterk versmalde spits; op 1:1000 gesloten.
const shaft=prism(regular(2.45),B,25.0),lantern=prism(regular(2.25),24.9,30.1);
const spire=loft(regular(2.25),30.0,regular(.32),44.5);
const piers=[];
for(const s of [-1,1])for(const t of [-1,1]){piers.push(prism(rect(s*13.7-.5,t*5.75-.5,s*13.7+.5,t*5.75+.5),B,9.7),prism(rect(t*5.75-.5,s*13.7-.5,t*5.75+.5,s*13.7+.5),B,9.7));}
let all=union([armX,armY,...corners,shaft,lantern,spire,...piers]);
const niche=(x,y,w,z0,z1,angle=0,depth=.7)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];
// Vier grote toegangen/vensters in de kopse muren en de galmgatnissen.
for(const x of [-3.5,3.5])cuts.push(niche(x,-13.8,1.4,2.5,9.0),niche(x,13.1,1.4,2.5,9.0));
for(const y of [-3.5,3.5])cuts.push(niche(-13.8,y,1.4,2.5,9.0,-90),niche(13.8,y,1.4,2.5,9.0,90));
cuts.push(niche(0,-13.8,1.5,0,3.2),niche(0,13.1,1.5,0,3.2));
for(const a of [0,90,180,270])cuts.push(niche(0,-2.5,1.0,21.5,24.2).rotate([0,0,a]),niche(0,-2.3,1.0,26,29).rotate([0,0,a]));
all=all.subtract(union(cuts));
await writeLandmark({slug:'hervormde-kerk-coevorden',base:B,nodes:[['building:kruiskerk-en-dakruiter',all]],catalog:{name:'Hervormde kerk Coevorden',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0109100000005874'],description:'Zeventiende-eeuwse kruiskerk met vier kruisarmen, lage hoekaanbouwen en achtkante dakruiter met spits.',realWorld:{groundNapM:ground,ridgeNapM:32.3,towerTopM:44.5},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000005874','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/11490','https://commons.wikimedia.org/wiki/Category:Kruiskerk_(Coevorden)','https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0019.php']}});


// Beide printschalen blijven in de catalogus vermeld na regeneratie.
const { readFile, writeFile } = await import("node:fs/promises");
const { default: path } = await import("node:path");
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const catalogDir = path.resolve(outIndex >= 0 && args[outIndex + 1] ? args[outIndex + 1] : path.join(import.meta.dirname, "../models"), "hervormde-kerk-coevorden");
const catalogPath = path.join(catalogDir, "hervormde-kerk-coevorden.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
catalog.printFiles = ["hervormde-kerk-coevorden-1-100.stl", "hervormde-kerk-coevorden-1-1000.stl"];
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
