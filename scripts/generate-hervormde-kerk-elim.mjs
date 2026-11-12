import {union,hull,prism,rect,circle,writeLandmark,scale} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
// Hervormde kerk Elim: RD-as langs nok (naar het oosten), z=0 rond NAP +11,79 m.
const B=-.3, O=[235733,522134.5], axis=[.9981,-.0616], slug='hervormde-kerk-elim';
const roofed=(poly,planes,z=60)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){const n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
const loft=(a,z,b,z2)=>hull([...a.map(([x,y])=>[x,y,z]),...b.map(([x,y])=>[x,y,z2])]);
// Zaalkerk met recht zadeldak; lagere achtervleugel en twee zijportalen.
const nave=roofed(rect(-14,-6.7,7,6.7),[[0,1.02,13.66],[0,-1.02,13.66]]);
const rear=roofed(rect(6.8,-5.0,13.5,5.0),[[0,1.0,10.4],[0,-1.0,10.4],[-1.0,0,20.8]]);
// Vlakke achteraanbouw: AHN NAP +14,4 m, veel lager dan de achtervleugel.
const rearAnnex=prism(rect(13.3,-4.6,17.9,4.5),B,2.65);
const portals=[];for(const side of [-1,1]){const [v0,v1]=side<0?[-8.45,-6.4]:[6.4,8.4];portals.push(roofed(rect(-1.6,v0,2.4,v1),[[1.0,0,5.5],[-1.0,0,6.3]]));}
// Voorportaal links en rechts van de terugliggende vierkante toren.
const shoulders=[];for(const side of [-1,1]){const [v0,v1]=side<0?[-4.6,-2.2]:[2.0,4.5];shoulders.push(roofed(rect(-16.6,v0,-13.7,v1),[[1.0,0,19.0],[-1.0,0,-10.0]]));}
// Toren bestaat uit architectonische schachten, vierkant naar achtkant, en een tentdak.
const sq=(cx,cy,h)=>rect(cx-h,cy-h,cx+h,cy+h),oct=(cx,cy,r)=>circle([cx,cy],r,8,Math.PI/8),cx=-15.85,cy=-.1;
const tower=union([loft(sq(cx,cy,2.05),B,sq(cx,cy,2.05),13.4),loft(sq(cx,cy,2.05),13.3,oct(cx,cy,2.05),15.3),loft(oct(cx,cy,2.05),15.2,oct(cx,cy,2.05),19.8),loft(oct(cx,cy,2.05),19.7,oct(cx,cy,.48),24.84)]);
let all=union([nave,rear,rearAnnex,...portals,...shoulders,tower]);
// Printbare blinde nissen: top ≥ 45 graden; zijgevelramen en galmgaten.
const niche=(x,y,w,z0,z1,angle=0,depth=.55)=>{const r=w/2,p=[];for(const [a,b] of [[-r,z0],[r,z0],[r,z1-r],[0,z1],[-r,z1-r]])for(const d of [0,depth])p.push([a,d,b]);return hull(p).rotate([0,0,angle]).translate([x,y,0])};
const cuts=[];for(const x of [-11.5,-7.8,-4.0,3.7]){cuts.push(niche(x,-6.8,1.1,3.2,7.0),niche(x,6.15,1.1,3.2,7.0));}
for(const x of [9.1,12.2]){cuts.push(niche(x,-5.05,1.0,2.1,5.5),niche(x,4.5,1.0,2.1,5.5));}
cuts.push(niche(-18.0,cy,1.45,.1,3.4,-90));
for(const z of [6.0,11.2,16.4]){cuts.push(niche(cx,-2.25,.95,z,z+2.0),niche(cx,1.5,.95,z,z+2.0));cuts.push(niche(-18.0,cy,.95,z,z+2.0,-90));}
all=all.subtract(union(cuts));
if (process.argv.includes('--components')) for (const x of all.decompose()) console.log('stuk', x.volume(), x.boundingBox());
await writeLandmark({slug,base:B,nodes:[['building:kerk',all]],catalog:{name:'Hervormde kerk Elim',origin:O,xAxis:axis,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0118100000184677'],description:'Zaalkerk met zadeldak, achtervleugel, zijportalen en vierkante toren met achtkante bekroning en tentdak.',realWorld:{groundNapM:11.79,naveRidgeNapM:25.45,towerTopNapM:36.63},sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/507295','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000184677','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_toren_en_kerk,_zuidwestgevel,_toren_met_achtkantige_bekroning_met_tentdak._-_Elim_-_20322391_-_RCE.jpg']}});
// Regenereer beide vaste STL-schalen en houd ze opgenomen in de metadata.
const i=process.argv.indexOf('--out'),root=i>=0&&process.argv[i+1]?path.resolve(process.argv[i+1]):path.join(import.meta.dirname,'../models'),dir=path.join(root,slug),input=await readFile(path.join(dir,`${slug}-1-${scale}.stl`)),n=input.readUInt32LE(80);
for(const target of [1000,100]){if(target===scale)continue;const result=Buffer.from(input);result.fill(0,0,80);result.write(`NederPrint ${slug} 1:${target} mm Z-up`.slice(0,79),0,80,'ascii');for(let t=0;t<n;t++)for(let k=0;k<9;k++){const off=84+t*50+12+k*4;result.writeFloatLE(input.readFloatLE(off)*scale/target,off)}await writeFile(path.join(dir,`${slug}-1-${target}.stl`),result)}
const mf=path.join(dir,`${slug}.json`),j=JSON.parse(await readFile(mf,'utf8'));j.printFiles=[...new Set([`${slug}-1-${scale}.stl`,`${slug}-1-1000.stl`,`${slug}-1-100.stl`])];await writeFile(mf,JSON.stringify(j,null,2));
