import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[192161.04,571793.57],axis=[.9977,.0677],ground=.688;
const roofed=(poly,planes)=>{let s=prism(poly,B,25);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
const oct=(cx,cy,r)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
// Zaalkerk met driezijdige sluiting, westtoren en ingesnoerde naaldspits.
const hall=roofed([[1.7,-3.78],[15.15,-3.78],[18.2,-1.9],[18.2,1.9],[15.15,3.78],[1.7,3.78]],[[0,1.1,10.446],[0,-1.1,10.446],[-1.1,0,10.446+1.1*15.15]]);
const tower=prism(rect(-1.65,-1.82,1.75,1.82),B,12.9);
const spire=loft(oct(.05,0,1.72),12.85,oct(.05,0,.49),20.215);
let all=union([hall,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.4)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [3.7,7.1,10.5,13.9])cuts.push(niche(x,-3.84,1.15,1.3,4.5),niche(x,3.84,1.15,1.3,4.5,180));
cuts.push(niche(-1.72,0,1.2,0,3,-90),niche(.05,-1.88,1,10.4,12.2),niche(.05,1.88,1,10.4,12.2,180));
all=all.subtract(union(cuts));
await writeLandmark({slug:'agnestsjerke-earnewald',base:B,nodes:[['building:kerk',all]],catalog:{name:'Agnestsjerke Earnewâld',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0737100000022684'],description:'Zaalkerk met driezijdige sluiting en westtoren met ingesnoerde spits.',realWorld:{groundNapM:ground,ridgeNapM:11.134,towerTopNapM:20.903},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000022684','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://tsjerkepaad.nl/overzicht-kerken','https://www.kerk-en-orgel.nl/record.php?action=display_ordered&id=2159&item=818&province=fr','https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Earnewâld']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');
const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'agnestsjerke-earnewald');
const file=path.join(dir,'agnestsjerke-earnewald.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['agnestsjerke-earnewald-1-100.stl','agnestsjerke-earnewald-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
