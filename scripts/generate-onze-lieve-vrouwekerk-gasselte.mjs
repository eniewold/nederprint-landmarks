import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[249104.5,554824.7], axis=[.982,.189], ground=17.783;
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// De muren en drie gesloten schildvlakken volgen de BAG-contour en de AHN-nok.
const outline=[[-9.97,-4.34],[8.3,-4.33],[11.05,-1.74],[11.05,1.52],[7.98,4.78],[-9.97,4.78]];
const hall=roofed(outline,[[0,.90,10.45-.9*.22],[0,-.90,10.45+.9*.22],[-1.1,0,19.23]]);
// Vierkante houten dakruiter binnen de westelijke gevel, met tentdak.
const tower=prism(rect(-9.35,-1.45,-6.15,1.75),8.4,14.0);
const spire=loft(rect(-9.35,-1.45,-6.15,1.75),13.95,rect(-8.2,-.3,-7.3,.6),17.4);
let all=union([hall,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.35)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-6,-2.5,1,4.5])cuts.push(niche(x,-4.45,1.25,1.5,4.7),niche(x,4.9,1.25,1.5,4.7,180));
cuts.push(niche(-10.1,.2,1.2,0,2.8,-90));
// Twee koorvensters in de afgeschuinde oostgevels.
cuts.push(niche(9.85,3.4,1.25,1.8,4.7,135,.6),niche(9.85,-3.2,1.25,1.8,4.7,45,.6));
cuts.push(niche(-7.75,-1.5,1.0,11.5,13.4),niche(-7.75,1.8,1.0,11.5,13.4,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'onze-lieve-vrouwekerk-gasselte',base:B,nodes:[['building:kerk',all]],catalog:{name:'Onze-Lieve-Vrouwekerk Gasselte',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1680100000015525'],description:'Het Witte Kerkje met gesloten koor en vierkante houten dakruiter met tentdak.',realWorld:{groundNapM:ground,ridgeNapM:28.23,towerTopNapM:35.18},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000015525','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.vriendenwittekerkjegasselte.nl/','https://commons.wikimedia.org/wiki/Category:Onze-Lieve-Vrouwekerk_(Gasselte)']}});
const { readFile, writeFile } = await import('node:fs/promises');
const { default: path } = await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out');
const dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'onze-lieve-vrouwekerk-gasselte');
const json=path.join(dir,'onze-lieve-vrouwekerk-gasselte.json'),catalog=JSON.parse(await readFile(json,'utf8'));
catalog.printFiles=['onze-lieve-vrouwekerk-gasselte-1-100.stl','onze-lieve-vrouwekerk-gasselte-1-1000.stl'];
await writeFile(json,JSON.stringify(catalog,null,2)+'\n');
