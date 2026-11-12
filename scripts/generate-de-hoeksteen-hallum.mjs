import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[181488.25,591125.25],axis=[.99664,.0819],ground=1.699;
const roofed=(poly,planes)=>{let s=prism(poly,B,35);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Zaalkerk met twee dwarsbeuken en terzijde geplaatste toren.
const main=roofed(rect(1,-1.5,22,10),[[0,1.0,14.3-4.25],[0,-1.0,14.3+4.25]]);
const wing1=roofed(rect(4.2,-4.7,10.45,15.8),[[1.2,0,12.0-1.2*7.3],[-1.2,0,12.0+1.2*7.3]]);
const wing2=roofed([[10.4,-5.7],[16.8,-5.7],[16.8,12.8],[11.8,18.8],[9.9,19.2],[6.3,15.8],[6.3,13.7],[10.4,10]],[[1.2,0,12.0-1.2*13.6],[-1.2,0,12.0+1.2*13.6]]);
const rear=roofed([[20,-5.7],[31.7,-5.7],[33.5,-3.9],[33.5,-1.2],[26.2,6],[20,5]],[[0,1.2,8.8],[0,-1.2,8.8],[-1.2,0,8.8+1.2*30.8]]);
const tower=prism(rect(-2.3,-1.7,2.3,2.2),B,17.2);
const spire=hull([[-2.3,-1.7,17.1],[2.3,-1.7,17.1],[2.3,2.2,17.1],[-2.3,2.2,17.1],[-.03,.25,26.75],[.03,.25,26.75]]);
let all=union([main,wing1,wing2,rear,tower,spire]);
const niche=(x,y,w,z0,z1,angle=0,depth=.3)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1+.04],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[niche(-2.36,0,1,0,3,-90),niche(-.65,-1.76,.9,12.1,15.5),niche(.65,-1.76,.9,12.1,15.5),niche(-.65,2.26,.9,12.1,15.5,180),niche(.65,2.26,.9,12.1,15.5,180),niche(7.3,-4.76,1.3,2,8),niche(13.6,-5.76,1.3,2,8)];all=all.subtract(union(cuts));
await writeLandmark({slug:'de-hoeksteen-hallum',base:B,nodes:[['building:kerk',all]],catalog:{name:'De Hoeksteen Hallum',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.1722100000005107'],description:'Zaalkerk met twee dwarsbeuken en naastgelegen toren.',realWorld:{groundNapM:ground,spireTopNapM:28.45},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000005107','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://gereformeerdekerken.info/2023/01/21/onderzoek-naar-keuze-kerkgebouwen-hallum/','https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01.pdf']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'de-hoeksteen-hallum');const file=path.join(dir,'de-hoeksteen-hallum.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['de-hoeksteen-hallum-1-100.stl','de-hoeksteen-hallum-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));
