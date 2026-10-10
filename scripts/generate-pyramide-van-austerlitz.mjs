// Pyramide van Austerlitz: gemeten zijvlakken en bouwdelen, geen DSM-hoogtelagen.
// AHN DSM/DTM 0,5 m en BGT/BAG (PDOK, CC0), foto's: zie models/.../README.md.
import {Manifold,box,rect,prism,hull,ring3,union,check,writeLandmark,toStl,flag} from './efteling-kit.mjs';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const slug='pyramide-van-austerlitz', BASE=-18.15;
const origin=[151956.297,455795.396],xAxis=[.57584,.81756];
// Plateau NAP 66,48; omringend pad NAP 48,83. Bovenste DSM-punten NAP 80,334.
// Het bestaande PDOK-talud blijft in de GLB; alleen de zelfstandige STL bevat de heuvel.
const towerFoot=-.45,brickTop=11.62,lanternTop=12.61,roofTop=13.854;
const square=(r)=>rect(-r,-r,r,r);
let tower=hull([...ring3(square(1.53),towerFoot),...ring3(square(1.07),brickTop)]);
// Vier zijden met drie verticale blinde spleten: op 1:1000 verbreed tot 0,9 m.
const niches=[];
for(const z of [2.5,5.85,9.15])for(let side=0;side<4;side++){
 const cut=box(-.45,-1.65,z,.45,-.9,z+1.4).rotate([0,0,side*90]);niches.push(cut);
}
tower=tower.subtract(union(niches));
// Massieve lantaarn met ondiepe diagonale ruiten in plaats van fragiele losse stijlen.
let lantern=box(-1.12,-1.12,brickTop,1.12,1.12,lanternTop);
const lanternCuts=[];
for(let side=0;side<4;side++)for(const sign of [-1,1]){
 const p=[[-.82,brickTop+.17],[-.1,lanternTop-.16],[-.82,lanternTop-.16]];
 const cut=prism(p,0,.3).rotate([90,0,0]).translate([0,-.93,0]).scale([sign,1,1]).rotate([0,0,side*90]);lanternCuts.push(cut);
}
lantern=lantern.subtract(union(lanternCuts));
const roof=hull([...ring3(square(1.25),lanternTop),[0,0,roofTop]]);
const roofSeat=hull([...ring3(square(1.12),lanternTop-.2),...ring3(square(1.25),lanternTop)]);
tower=union([tower,lantern,roofSeat,roof,box(-1.7,-1.7,-.6,1.7,1.7,.15)]);
// De trap als één zijprofiel; 81 echte treden worden op printschaal gegroepeerd.
// Bovenkant 0,7 m boven het AHN-talud om de grovere PDOK-triangulatie te volgen.
const bottom=-25.15,top=-5.2,treadCount=20;
const profile=[[bottom,BASE],[top,BASE],[top,1.25]];
for(let k=treadCount-1;k>=0;k--){
 const u=bottom+(top-bottom)*k/treadCount,z=-16.9+18.15*k/treadCount;
 profile.push([u+(top-bottom)/treadCount,z],[u,z]);
}
profile.push([bottom,BASE]);
const stair=prism(profile,0,1.9).rotate([90,0,0]).translate([0,.95,0]);
const sideProfile=[[bottom,BASE],[top,BASE],[top,1.55],[bottom,-16.6]];
const sideWall=(v)=>prism(sideProfile,0,.9).rotate([90,0,0]).translate([0,v+.45,0]);
const memorial=box(bottom-1.15,-2,-17.75,bottom+.7,2,-15.6);
const stairs=union([stair,sideWall(-1.4),sideWall(1.4),memorial]);
const nodes=[['building:obelisk-met-lantaarn',tower],['road:trap-en-gedenkplaat',stairs]];
await writeLandmark({slug,nodes,base:BASE,catalog:{
 name:'Pyramide van Austerlitz',origin,xAxis,groundOffsetMetres:0,groundHeight:110.049915,
 groundSamplePoints:[[-1.2,1.8],[1.2,1.8],[0,2.1]],
 replacesBuildings:['NL.IMBAG.Pand.0351100000008766'],
 description:'Obelisk op de AHN-positie, vierkante bakstenen schacht, blinde vensters, lantaarn, vierzijdig dak en zuidwesttrap; de kaart gebruikt de bestaande grasheuvel.',
 realWorld:{plateauNapM:66.48,footNapM:48.83,topNapM:80.334,baseWidthM:3.06,estimated:['lantaarnhoogte','raamspleten 0,35 m diep','81 treden gegroepeerd tot 20','trapwanden tot 0,9 m verdikt']},
 sources:['PDOK AHN DSM/DTM 0,5 m; bbox 151870,455715,152005,455850','https://www.monumentdepyramidevanausterlitz.nl/','https://commons.wikimedia.org/wiki/File:Pyramid_of_Austerlitz_oct_2022.jpg','https://commons.wikimedia.org/wiki/File:Pyramide_van_Austerlitz_P1010572.jpg']
}});
// Volledige print: vier doorlopende aardvlakken en werkelijk terrasreliëf.
// Terrasgroeven snijden in een vlakke helling; nooit een stapel hoogteplakken.
const hillBase=-17.65,hillTop=-.15;
let hill=hull([...ring3(rect(-25,-25,25,25),hillBase),...ring3(rect(-5.4,-5.4,5.4,5.4),hillTop)]);
const grooves=[];
for(let k=1;k<30;k++){
 const z=hillBase+(hillTop-hillBase)*k/30,r=25-(25-5.4)*k/30;
 // Ondiep horizontaal reliëf, geen vrijstaande richels of dragende dunne delen.
 const outer=box(-26,-26,z-.13,26,26,z+.13),inner=box(-r+.22,-r+.22,z-.2,r-.22,r-.22,z+.2);
 grooves.push(outer.subtract(inner));
}
hill=hill.subtract(union(grooves));
const foot=box(-26,-26,BASE,26,26,hillBase+.03);
const all=union([hill,foot,tower,stairs]).translate([0,0,-BASE]);
check([['volledige-pyramide',all]],0);
if(all.decompose().length!==1)throw new Error('Losse delen in de volledige STL');
const out=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug);
await writeFile(path.join(out,slug+'-1-1000.stl'),toStl(all,'Pyramide van Austerlitz 1:1000 mm Z-up').buffer);
console.log('Complete STL',all.boundingBox(),all.status(),all.numTri());

