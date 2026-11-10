// Agora Lelystad: handmatig getekende bouwdelen, meters in RD met Z omhoog.
// Hoogtes van de vlakken op basis van 3D BAG, getoetst aan AHN5; insnijdingen
// en hun proporties naar foto's. De voet is -0,4 m t.o.v. het maaiveld.
import {hull, prism, box, union, downFaces, writeLandmark} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const O=[161050,502590], G=-3.25, BASE=-0.4;
const p=([x,y,z])=>[x-161050,y-502590,z-G];
const vol=(tops)=>{const pts=tops.map(p);return hull([...pts,...pts.map(([x,y])=>[x,y,BASE])]);};
// Elk deel is een architectonisch vlak, geen horizontale DSM-sneden.
const flats=[
  // Bovenste, vlakke dak van het toneelhuis.
  [[161035.1,502554.8,21.95],[161061.9,502558.2,22.0],[161061.3,502575.1,22.18],[161035.3,502573.4,22.18]],
  // Het centrale schuine dak naar de foyer.
  [[161035.3,502573.4,22.18],[161061.3,502575.1,22.18],[161066.8,502590.5,15.4]],
  [[161035.3,502573.4,22.18],[161066.8,502590.5,15.4],[161053.3,502597.3,15.3],[161043.6,502604.9,15.0],[161033.9,502574.4,21.9]],
  // Aansluitende driehoek tussen het schuine middenvlak en het foyerdak.
  [[161066.8,502590.5,15.4],[161067.3,502590.7,14.9],[161067.2,502593.9,14.3],[161060.4,502597.8,14.4],[161053.3,502597.3,15.3]],
  // Grote noordelijke zaal en foyer met bijna vlak dak.
  [[161043.6,502604.9,14.5],[161053.3,502597.3,14.5],[161060.4,502597.8,14.4],[161067.2,502593.9,14.3],[161065.9,502623.7,14.2],[161044.8,502623.8,14.5]],
  // Westelijke schuine vouw en hoek van de foyer.
  [[161023.7,502593.4,8.4],[161043.6,502612.6,14.6],[161044.8,502623.8,14.9],[161024.8,502619.5,8.7]],
  [[161024.1,502589.3,8.6],[161032.6,502562.0,8.7],[161032.9,502575.0,9.7],[161031.3,502590.5,10.4],[161043.6,502604.9,14.3],[161043.6,502612.6,14.8],[161023.7,502593.4,8.8]],
  [[161032.9,502575.0,20.6],[161033.9,502574.4,21.9],[161043.6,502603.9,15.2],[161031.3,502590.5,10.4]],
  // Steile vouw langs de westzijde van het hoge toneelhuis.
  [[161032.6,502562.0,8.7],[161034.1,502557.2,8.8],[161035.1,502554.8,21.95],[161034.3,502562.3,22.0],[161032.9,502575.0,20.6]],
  [[161025.8,502553.5,1.7],[161034.1,502557.2,8.8],[161032.6,502562.0,8.7],[161024.1,502589.3,8.6]],
  // De steile oostelijke dakvlakken lopen tot op het lage volume.
  [[161061.3,502575.1,22.2],[161061.9,502558.2,22.0],[161067.8,502558.9,5.0],[161066.2,502563.7,9.1],[161064.4,502565.1,14.1]],
  [[161061.3,502575.1,21.9],[161066.8,502590.5,15.5],[161067.3,502590.7,14.7],[161067.1,502578.9,12.1],[161064.4,502565.1,13.5]],
  // Lage oostelijke dienstaanbouw.
  [[161069.5,502556.2,1.75],[161068.9,502566.6,1.75],[161087,502568,1.75],[161086.4,502576.8,1.75],[161069.4,502575.8,1.75]],
];
const footprint=[[161069.5,502556.2],[161068.86,502566.58],[161087,502567.79],[161086.4,502576.79],[161067.11,502578.93],[161067.32,502591.53],[161065.94,502623.66],[161044.07,502623.83],[161024.51,502619.47],[161023.6,502588.89],[161025.8,502553.5]].map(([x,y])=>[x-O[0],y-O[1]]);
let body=union([prism(footprint,BASE,0.2),...flats.map(vol)]);
// Glas en de inspringende entree als blinde nissen: de diepte blijft beperkt
// zodat de dakrand geen grote horizontale overspanning voor de printer vormt.
// De lange westwand draait licht ten opzichte van RD-noord.
const westX=y=>y< -1 ? -26.4-0.0629*(y+1) : -26.4+0.0303*(y+1);
// Nisplafonds lopen naar buiten op voor een printbare overhang.
const westNiche=(yz)=>hull(yz.flatMap(([y,z],i)=>[[westX(y)-0.7,y,z+(i>=2?1.8:0)],[westX(y)+0.38,y,z]]));
const northNiche=(x1,x2,z1,z2)=>hull([[x1,33.2,z1],[x2,33.2,z1],[x1,33.2,z2],[x2,33.2,z2],[x1,34.4,z1],[x2,34.4,z1],[x1,34.4,z2+1.8],[x2,34.4,z2+1.8]]);
const cuts=[
  westNiche([[-25,1.0],[-1,1.0],[-1,4.7636],[-25,2.0]]),
  westNiche([[-1,1.0],[28,1.0],[28,7.0],[8,5.8],[-1,4.7636]]),
  // Het grote bovenlicht in de noordelijke foyer.
  northNiche(-4.5,12.5,10.0,14.0),
  // Lage glazen entree onder de foyer.
  northNiche(-3.0,10.0,0.1,5.4),
];
// De smalle vensters in de lange zijgevel (Commons-foto Lelystad
// Agoratheater 5): op schaal als blinde uitsparingen, zonder de roeden.
for (const y of [-29,-22,-15,-8,-1,6,13,20]) {
  cuts.push(westNiche([[y,8.2],[y+1.8,8.2],[y+1.8,9.1],[y,9.1]]));
}
body=body.subtract(union(cuts));
if(body.status()!=='NoError'||body.isEmpty()) throw Error('Ongeldig theater');
console.log('Overhangvlakken:', JSON.stringify(downFaces(body,BASE)));
await writeLandmark({slug:'agora-lelystad',base:BASE,nodes:[['building:agoratheater',body]],catalog:{name:'Agoratheater',origin:O,xAxis:[1,0],groundOffsetMetres:-0.2,groundSamplePoints:[[-30,35],[0,40],[23,38]],replacesBuildings:['NL.IMBAG.Pand.0995100000739215'],description:'Bouwvolume met de gevouwen dakvlakken van het theater, het hoge toneelhuis, de foyer en de lage dienstaanbouw. Lokale X naar het oosten, Y naar het noorden; grond op NAP -3,25 m.',realWorld:{groundNapM:G,highRoofNapM:22.1,foyerRoofNapM:14.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0995100000739215','PDOK AHN5 DSM en DTM 0,5 m','PDOK Actueel orthoHR','https://commons.wikimedia.org/wiki/Category:Agoratheater','https://www.unstudio.com/projects/further/theatre-agora/']}});
// Bewaar het kenmerkende oranje ook voor zelfstandige GLB-viewers. De kaart
// mag overeenkomstig de toepassing zelf nog een themakleur kiezen.
const outArg=process.argv.indexOf('--out');
const root=outArg>=0 ? path.resolve(process.argv[outArg+1]) : path.resolve(import.meta.dirname,'../models');
const file=path.join(root,'agora-lelystad','agora-lelystad.glb');
const glb=await readFile(file), oldLength=glb.readUInt32LE(12), oldEnd=20+oldLength;
const doc=JSON.parse(glb.subarray(20,oldEnd).toString('utf8'));
doc.materials=[{name:'oranje gevel',pbrMetallicRoughness:{baseColorFactor:[0.93,0.32,0.025,1],metallicFactor:0,roughnessFactor:0.8}}];
for(const mesh of doc.meshes) for(const primitive of mesh.primitives) primitive.material=0;
const json=Buffer.from(JSON.stringify(doc)), padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]);
const header=Buffer.alloc(20); header.writeUInt32LE(0x46546c67,0); header.writeUInt32LE(2,4); header.writeUInt32LE(20+padded.length+glb.length-oldEnd,8); header.writeUInt32LE(padded.length,12); header.writeUInt32LE(0x4e4f534a,16);
await writeFile(file,Buffer.concat([header,padded,glb.subarray(oldEnd)]));
