import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// BAG, AHN5 en 3DBAG; +X langs de nok van het dwarsschip, +Y naar achteren.
const B=-.3,origin=[104989,450929],axis=[.9762,-.2169],ground=-1.557;
const roofed=(poly,planes,z=34)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const hip=(x0,x1,y0,y1,ex,ey,eave,ridge)=>{const sy=(ridge-eave)/((y1-y0)/2),sx=(ridge-eave)/ex,cy=(y0+y1)/2;return roofed(rect(x0,y0,x1,y1),[[0,sy,ridge-sy*cy],[0,-sy,ridge+sy*cy],[sx,0,eave-sx*x0],[-sx,0,eave+sx*x1]])};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Twee kruisende schilddaken: goot circa NAP +9,3, nok NAP +14,8.
const hall=hip(-15.7,16.2,-5.5,8.15,6.8,0,10.86,16.34);
const south=hip(-5.7,6.4,-12.9,0.5,6.05,0,10.86,16.34);
// Latere lage achterbouw en achthoekige linker aanbouw.
const rear=hip(-7.7,13.8,12.5,21.3,4.1,0,5.55,9.8);
const connector=union([prism(rect(-6.8,7.6,8.0,12.7),B,4.2),prism(rect(-8.6,12.7,-7.5,18.0),B,3.7)]);
const octagon=prism([[-15.9,11],[-14.6,9.9],[-9.6,9.9],[-8.3,11.2],[-8.3,19.7],[-9.7,21],[-14.6,21],[-15.9,19.7]],B,4.2);
const towerBase=prism(rect(-1.8,-12.9,2.0,-9.2),B,17.1);
const towerMid=prism(rect(-1.65,-12.8,1.85,-9.3),16.9,21.2);
const towerTop=prism(rect(-1.2,-12.35,1.4,-9.75),21.1,24.35);
const towerRoof=loft(rect(-1.4,-12.55,1.6,-9.55),24.2,rect(-.35,-11.5,.55,-10.6),26.35);
// Het klassieke toegangsportaal heeft vier kolommen, fronton en zijmuur.
const portal=union([prism(rect(-4.0,-14.7,4.2,-12.7),B,6.2),roofed(rect(-4.1,-14.8,4.3,-12.65),[[1,0,8.2],[-1,0,8.4]],15)]);
const westPorch=hip(-18.2,-15.5,-.7,2.8,1.7,0,4.25,5.25);
const eastPorch=hip(16.0,18.1,-.4,3.2,1.7,0,4.25,5.25);
const pilasters=[-10,-6,-2,2,6,10].map(x=>prism(rect(x-.45,8.0,x+.45,8.5),B,7.8));
let all=union([hall,south,rear,connector,octagon,towerBase,towerMid,towerTop,towerRoof,portal,westPorch,eastPorch,...pilasters]);
// 0,35 m diepe blinde rondboogvensters, boog vereenvoudigd voor print.
const niche=(x,y,w,z0,z1,angle=0,depth=.55)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
for(const x of [-12.6,-9.0,9.2,13.0])cuts.push(niche(x,-5.6,1.45,2.3,7.1));
for(const x of [-12,-8,-4,0,4,8,12])cuts.push(niche(x,7.7,1.35,2.4,7.2));
for(const y of [-3.3,1.3,5.7])cuts.push(niche(16.3,y,1.4,2.1,7.4,90));
for(const y of [-3.0,1.5,5.8])cuts.push(niche(-15.8,y,1.4,2.1,7.4,-90));
cuts.push(niche(.1,-14.8,1.5,.1,4.7));
for(const x of [-.7,.9])cuts.push(niche(x,-12.9,.9,18.0,20.7),niche(x,-9.45,.9,18.0,20.7));
for(const y of [-11.8,-10.2])cuts.push(niche(1.95,y,.9,18.0,20.7,90),niche(-1.8,y,.9,18.0,20.7,-90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'brugkerk-waddinxveen',base:B,nodes:[['building:brugkerk',all]],catalog:{name:'Brugkerk Waddinxveen',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0627100000010577'],description:'Neoclassicistische kruiskerk met schilddaken, voorportaal, klokkentoren en latere achtervleugel.',realWorld:{groundNapM:ground,ridgeNapM:14.78,towerTopNapM:24.79},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0627100000010577','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/38202','https://commons.wikimedia.org/wiki/File:Brugkerk_Waddinxveen.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_-_Waddinxveen_-_20248555_-_RCE.jpg']}});






// Beide printschalen blijven in de catalogus vermeld na regeneratie.
const { readFile, writeFile } = await import("node:fs/promises");
const { default: path } = await import("node:path");
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const catalogDir = path.resolve(outIndex >= 0 && args[outIndex + 1] ? args[outIndex + 1] : path.join(import.meta.dirname, "../models"), "brugkerk-waddinxveen");
const catalogPath = path.join(catalogDir, "brugkerk-waddinxveen.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
catalog.printFiles = ["brugkerk-waddinxveen-1-100.stl", "brugkerk-waddinxveen-1-1000.stl"];
await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
