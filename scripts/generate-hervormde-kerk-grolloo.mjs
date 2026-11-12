import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[241517,550496], axis=[.9755,.2199], ground=18.064;
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const oct=(x,y,r)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Rechthoekige zaalkerk met twee door AHN bepaalde zadeldakvlakken.
const hall=roofed(rect(-9.05,-4.41,9.62,4.53),[[0,.865,9.53-.865*.06],[0,-.865,9.53+.865*.06]]);
// Vierkante houten geveltoren, achthoekige lantaarn en printbare naald.
const tower=prism(rect(-9.08,-1.28,-6.48,1.32),8.3,11.35);
const lantern=prism(oct(-7.78,.02,1.39),11.25,13.9);
const spire=loft(oct(-7.78,.02,1.39),13.85,oct(-7.78,.02,.49),18.91);
let all=union([hall,tower,lantern,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-6.5,-3.2,.1,3.4,6.7])cuts.push(niche(x,-4.48,1.15,1.4,4.65),niche(x,4.6,1.15,1.4,4.65,180));
// De frontentree en beide hoge vensters als drukbare blinde nissen.
for(const y of [-2.8,2.8])cuts.push(niche(-9.1,y,1.15,1.3,4.7,-90));
cuts.push(niche(-9.1,0,1.4,0,3.3,-90),niche(-9.1,0,1.0,5.0,7.2,-90));
// Galmgaten zijn nissen om de dunne lantaarn sterk en steunvrij te houden.
cuts.push(niche(-7.78,-1.35,1.0,11.7,13.2),niche(-7.78,1.4,1.0,11.7,13.2,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'hervormde-kerk-grolloo',base:B,nodes:[['building:kerk',all]],catalog:{name:'Hervormde kerk Grolloo',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1680100000003506'],description:'Waterstaatskerk met zadeldak en houten geveltoren met achthoekige lantaarn en spits.',realWorld:{groundNapM:ground,ridgeNapM:27.591,towerTopNapM:36.974},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000003506','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://monumentenregister.cultureelerfgoed.nl/monumenten/482937','https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Grolloo)','https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0044.php']}});
const { readFile, writeFile } = await import('node:fs/promises');
const { default: path } = await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out');
const dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'hervormde-kerk-grolloo');
const json=path.join(dir,'hervormde-kerk-grolloo.json'),catalog=JSON.parse(await readFile(json,'utf8'));
catalog.printFiles=['hervormde-kerk-grolloo-1-100.stl','hervormde-kerk-grolloo-1-1000.stl'];
await writeFile(json,JSON.stringify(catalog,null,2)+'\n');
