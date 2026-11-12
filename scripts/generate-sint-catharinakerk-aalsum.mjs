import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3, origin=[196021.8,594965.66], axis=[1,0], ground=4.819;
const roofed=(poly,planes)=>{let s=prism(poly,B,20);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const roof=[[0,1.03,9.44],[0,-1.03,9.44]];
const nave=roofed(rect(0,-3.97,13.0,3.97),roof);
const end=[];for(let i=0;i<=8;i++){let a=-Math.PI/2+i*Math.PI/8;end.push([18.83+2.6*Math.cos(a),3.18*Math.sin(a)])}
const choir=roofed([[12.93,-3.18],...end,[12.93,3.18]],[...roof,[-1.03,0,9.44+1.03*18.83]]);
// Gesloten lantaarn en geveltoren; nissen suggereren de openingen.
const tower=prism(rect(.25,-1.05,2.6,1.05),7.8,11.4);
const lantern=prism(rect(.4,-.95,2.45,.95),11.3,13.1);
const cap=hull([[.4,-.95,13.05],[2.45,-.95,13.05],[2.45,.95,13.05],[.4,.95,13.05],[1.425,0,13.91]]);
let all=union([nave,choir,tower,lantern,cap]);
const niche=(x,y,w,z0,z1,angle=0,depth=.35)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [2.7,6.4,10])cuts.push(niche(x,-4.03,1.15,1.4,4.6),niche(x,4.03,1.15,1.4,4.6,180));
for(const x of [15,18])cuts.push(niche(x,-3.24,1.05,1.4,4.5),niche(x,3.24,1.05,1.4,4.5,180));
cuts.push(niche(-.06,0,1.4,0,3.0,-90),niche(1.425,-1.02,1,11.55,12.7),niche(1.425,1.02,1,11.55,12.7,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'sint-catharinakerk-aalsum',base:B,nodes:[['building:kerk',all]],catalog:{name:'Sint Catharinakerk Aalsum',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0058100000201649'],description:'Romaanse kerk met versmald koor, halfronde apsis en houten geveltoren.',realWorld:{groundNapM:ground,ridgeNapM:14.262,towerTopNapM:18.73},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000201649','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.friesland.nl/nl/locaties/3852337548/sint-catharinakerk','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/31553','https://www.dbnl.org/tekst/berg229noor02_01/berg229noor02_01_0019.php']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'sint-catharinakerk-aalsum');
const file=path.join(dir,'sint-catharinakerk-aalsum.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['sint-catharinakerk-aalsum-1-100.stl','sint-catharinakerk-aalsum-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
