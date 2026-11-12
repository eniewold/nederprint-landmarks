import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[228615,527520], axis=[.9998,.02], ground=10.529;
const roofed=(poly,planes,z=30)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Het kantongerecht met afgeschilde hoofdkap, vooruitspringende geveltop en lage entree.
const main=roofed(rect(-2.08,-8.49,7.35,7.89),[[.9,0,11.57-.9*2.2],[-.9,0,11.57+.9*2.2],[0,.65,11.57+.65*3.3],[0,-.65,11.57+.65*3.3]]);
const front=roofed(rect(1.0,-2.67,7.35,2.22),[[0,1.05,11.57],[0,-1.05,11.57]]);
const porch=prism(rect(7.25,-2.67,10.39,2.22),B,4.47);
// De gekoppelde achtervleugel heeft een vlak deel en een lange zadeldakstrook.
const rearFlat=prism([[-24.87,-7.18],[-2.27,-9.96],[-2.08,-.1],[-24.05,1.7]],B,4.08);
const rear=roofed([[-24.05,1.7],[-2.08,-.1],[-.94,7.42],[-23.12,10.05]],[[0,.72,11.57-.72*5.0],[0,-.72,11.57+.72*5.0]]);
const junction=prism(rect(-23.7,-1.0,-1.5,2.1),B,3.8);
let all=union([main,front,porch,rearFlat,rear,junction]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
// Twee vensterlagen op de zichtbare gevels, terugliggend voor steunvrije print.
const cuts=[];for(const y of [-6,-4,4,6])cuts.push(niche(7.45,y,1.05,1.2,3.8,90),niche(7.45,y,1.05,5.1,7.7,90));
for(const x of [-21,-17,-13,-9,-5]){const edge=7.42+(-.94-x)*.1186+.1;cuts.push(niche(x,edge,1.05,1.2,3.7,180,.65),niche(x,edge,1.05,5.0,7.2,180,.65));}
cuts.push(niche(10.5,0,1.2,0,3.1,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'h2o-evangelische-gemeenschap-hoogeveen',base:B,nodes:[['building:kantongerecht',all]],catalog:{name:'H2O Evangelische Gemeenschap Hoogeveen',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0118100000038775'],description:'Voormalig kantongerecht uit 1900 met middenrisaliet, entree en gekoppelde achtervleugel.',realWorld:{groundNapM:ground,ridgeNapM:22.1,flatRoofNapM:14.6},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000038775','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:Voormalig_kantongerecht_Hoogeveen.jpg','https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0049.php','https://www.h2ohoogeveen.nl/contact/']}});
const { readFile, writeFile } = await import('node:fs/promises');
const { default: path } = await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out');
const dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'h2o-evangelische-gemeenschap-hoogeveen');
const json=path.join(dir,'h2o-evangelische-gemeenschap-hoogeveen.json'),catalog=JSON.parse(await readFile(json,'utf8'));
catalog.printFiles=['h2o-evangelische-gemeenschap-hoogeveen-1-100.stl','h2o-evangelische-gemeenschap-hoogeveen-1-1000.stl'];
await writeFile(json,JSON.stringify(catalog,null,2)+'\n');
