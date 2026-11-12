import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
const B=-.3,origin=[165496.4,577782.3],axis=[.99216,-.125],ground=2.377;
const roofed=(poly,planes)=>{let s=prism(poly,B,65);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Driebeukige pseudobasiliek met lagere zijbeuken en vijfzijdige kooromgang.
const main=roofed([[4,-6],[51.5,-6],[55.3,-4.2],[57.4,-1.6],[57.4,1.6],[55.3,4.2],[51.5,6],[4,6]],[[0,1.45,23.8],[0,-1.45,23.8],[-1.45,0,23.8+1.45*51.7]]);
const aisles=roofed([[3,-11.7],[51.5,-11.7],[57.4,-10],[61.8,-6],[63.3,-2.4],[63.3,2.4],[61.8,6],[57.4,10],[51.5,11.7],[3,11.7]],[[0,.85,20.05],[0,-.85,20.05],[-.85,0,64.0]]);
const tower=prism(rect(-3.8,-4,3.65,4.1),B,31.6);
const spire=hull([[-3.15,-3.3,31.5],[3,-3.3,31.5],[3,3.35,31.5],[-3.15,3.35,31.5],[-.07,0,58.4],[.03,0,58.4]]);
const cons=roofed(rect(43.8,11.6,51.4,19.2),[[0,-.75,23.8]]);
const buttresses=[];for(const x of [7.2,10.9,14.5,18.1,21.6,25.2,28.8,32.4,36,40,44.1,47.1,50.3])for(const y of [-1,1]){let e=y*11.65,inside=e-y*.15,outside=e+y*.95;buttresses.push(hull([[x-.46,inside,B],[x+.46,inside,B],[x+.46,outside,B],[x-.46,outside,B],[x-.46,inside,8.8],[x+.46,inside,8.8],[x+.46,outside,7.8],[x-.46,outside,7.8]]));}
let all=union([main,aisles,tower,spire,cons,...buttresses]);
const niche=(x,y,w,z0,z1,angle=0,depth=.3)=>{const r=w/2,pts=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1+.04],[-r,z1-r]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [9,12.7,16.3,19.8,23.4,27,30.6,34.2,38,42,45.6,48.7]){cuts.push(niche(x,-11.76,1.2,2.5,8.2));if(x<43)cuts.push(niche(x,11.76,1.2,2.5,8.2,180));}for(const x of [-2,0,2])cuts.push(niche(x,-4.06,1,25.7,29.3),niche(x,4.16,1,25.7,29.3,180));cuts.push(niche(-3.86,0,1.4,0,5,-90));all=all.subtract(union(cuts));
await writeLandmark({slug:'martinikerk-franeker',base:B,nodes:[['building:kerk',all]],catalog:{name:'Martinikerk Franeker',origin,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0070100000320200'],description:'Driebeukige gotische Martinikerk met kooromgang en hoge naaldspits.',realWorld:{groundNapM:ground,spireTopNapM:60.785},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000320200','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/15661','https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0061.php']}});
const {readFile,writeFile}=await import('node:fs/promises');const {default:path}=await import('node:path');const args=process.argv.slice(2),i=args.indexOf('--out'),dir=path.resolve(i>=0&&args[i+1]?args[i+1]:path.join(import.meta.dirname,'../models'),'martinikerk-franeker');const file=path.join(dir,'martinikerk-franeker.json'),json=JSON.parse(await readFile(file,'utf8'));json.printFiles=['martinikerk-franeker-1-100.stl','martinikerk-franeker-1-1000.stl'];await writeFile(file,JSON.stringify(json,null,2)+String.fromCharCode(10));

