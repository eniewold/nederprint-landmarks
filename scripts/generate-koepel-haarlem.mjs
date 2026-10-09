// Haarlemse Koepel: doorlopende omwentelingsvlakken, geveltravees en lichtlantaarn.
// Per-rij referentie gelezen: generate-evoluon.mjs; geen DSM-hoogtelagen.
import {box,prism,circle,dome,spire,hull,union,writeLandmark} from './efteling-kit.mjs';
const slug='koepel-haarlem',ground=.47745,base=-.3,origin=[104535.491,488662.722];
const angle=-12.5,xAxis=[Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180)];
const z=n=>n-ground,parts=[],cuts=[];
// BAG cirkelpassing (exclusief uitspringende lisenen), AHN radiale medianen .5m.
const radius=31.13;
const profile=[[radius,13.93],[30.5,14.02],[28.5,14.393],[27.55,14.535],
 [27.35,14.59],[27.35,17.30],[26.5,17.509],[25.5,18.561],[24.5,20.350],
 [23.5,21.748],[22.5,22.910],[20.5,24.766],[18.5,26.348],[16.5,27.650],
 [14.5,28.678],[12.5,29.546],[10.5,30.320],[8.5,30.846],[6.5,31.359],[4.5,31.812],[0,31.88]];
parts.push(dome([0,0],[[radius,base],...profile.map(([r,n])=>[r,z(n)])],240));
const roofNap=r=>{for(let k=1;k<profile.length;k++){const[a,za]=profile[k-1],[b,zb]=profile[k];if(r>=b&&a!==b)return zb+(za-zb)*(r-b)/(a-b);}return profile.at(-1)[1];};
// Vijftienzijdige lantaarn met tentdak; geen ronde kegel op deze hoekige kap.
parts.push(prism(circle([0,0],4.05,15,Math.PI/15),z(31.5),z(33.80)));
parts.push(spire([0,0],4.05,z(33.80),z(35.66),15,Math.PI/15));
parts.push(dome([0,0],[[.8,z(35.3)],[.6,z(35.70)],[.45,z(36.0)],[0,z(36.161243)]],30));
for(let k=0;k<15;k++)cuts.push(box(3.61,-.65,z(32.15),4.35,.65,z(33.35)).rotate([0,0,k*360/15]));
// Dertig hoofdroeven volgens de constructie; verbreed tot .9m printreliëf.
for(let j=0;j<30;j++){
 const a=j*2*Math.PI/30,d=[Math.cos(a),Math.sin(a)],t=[-d[1],d[0]];
 const line=profile.filter(([r])=>r>=4.5&&r<=26.5);
 for(let k=1;k<line.length;k++){
  const ps=[];for(const[r,n]of[line[k-1],line[k]])for(const w of[-.45,.45])for(const dz of[-.3,.20])ps.push([r*d[0]+w*t[0],r*d[1]+w*t[1],z(n)+dz]);
  parts.push(hull(ps));
 }
}
// Daklichtgroepen in de huidige ortho: paneelgroepen, blinde nissen .35m diep.
// RCE beschrijft 28 individuele daklichten; gepaarde ruiten vereenvoudigd.
for(let j=0;j<14;j++){
 const r=18.5,n=roofNap(r),s=(roofNap(r+.1)-roofNap(r-.1))/.2;
 cuts.push(box(-2.05,-1.8,-.35,2.05,1.8,.8).rotate([0,-Math.atan(s)*180/Math.PI,0]).translate([r,0,z(n)]).rotate([0,0,(j+.5)*360/14]));
}
// Zestig lisenen/travees, vier cellagen. Ingebed reliëf blijft volledig gedragen.
for(let j=0;j<60;j++){
 const a=360*j/60;
 parts.push(box(30.8,-.35,base,31.5,.35,z(13.88)).rotate([0,0,a]));
 for(const n of[2.0,5.1,8.2,11.3])cuts.push(box(30.78,-.7,z(n),31.9,.7,z(n+1.65)).rotate([0,0,a+3]));
}
// Horizontalen zijn ingebed in de gevel, zonder vrije ondervlakken.
for(const n of[3.85,6.95,10.05])parts.push(dome([0,0],[[31.1,z(n-.2)],[31.48,z(n+.18)],[31.1,z(n+.42)]],240));
// Twintig ventilatieopeningen in de binnenring, paarsgewijs met schuine kapjes.
for(let j=0;j<10;j++)for(const da of[-1.1,1.1]){
 const a=j*36+da;
 cuts.push(box(27.01,-.4,z(15.35),27.8,.4,z(16.15)).rotate([0,0,a]));
 parts.push(hull([[27.15,-.5,z(16.0)],[27.15,.5,z(16.0)],[27.8,-.5,z(16.6)],[27.8,.5,z(16.6)],[27.15,-.5,z(16.8)],[27.15,.5,z(16.8)]]).rotate([0,0,a]));
}
// Twee uitwendige nissen/entreepilasters uit BAG/BGT, zonder gekopieerde Arnhem-torens.
for(const a of[90,270]){
 parts.push(box(30.8,-2.13,base,32.85,2.13,z(13.90)).rotate([0,0,a]));
 cuts.push(box(32.5,-.8,z(.8),33.4,.8,z(3.4)).rotate([0,0,a]));
}
// Portaal aan de westzijde: huidige hoofdtoegang als gedragen blinde poort.
parts.push(box(-31.9,-2.4,base,-30.5,2.4,z(4.7)));
cuts.push(box(-32.3,-1.45,z(.45),-31.5,1.45,z(3.9)));
const raw=union(parts).subtract(union(cuts));
const shells=raw.decompose().filter(s=>Math.abs(s.volume())>1e-6);
if(raw.status()!=='NoError'||shells.length!==1)throw Error('Geen gesloten verbonden model '+JSON.stringify(shells.map(s=>({v:s.volume(),bbox:s.boundingBox()}))));
await writeLandmark({slug,base,nodes:[['building:koepel met zestig travees en vijftienzijdige lantaarn',shells[0]]],catalog:{
 name:'Koepelgevangenis (Haarlem)',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[0,-36],[16,-33],[-16,-33]],
 replacesBuildings:['NL.IMBAG.Pand.0392100000039278'],
 description:'Hart uit BAG-cirkelfit; +X -12.5 graden in RD, hoofdtoegang west. Complete rondbouw met binnenring, aankapping en lichtlantaarn; losse administratie en overige bijgebouwen blijven PDOK.',
 realWorld:{groundNapM:ground,diameterM:radius*2,topNapM:36.161243,radialRoofProfileNap:profile,
 schattingen:['raamvormen, lisenen en portaal vereenvoudigd uit restauratiefoto; nissen .35m diep','hoofdroeven verdikt tot .9m, fijne naden niet meegenomen','28 historische daklichten samengevat in 14 paneelgroepen naar huidige ortho; ruiten en kozijnpatroon vereenvoudigd','ringgoot en overgang binnenmuur uit AHN radiale medianen; piron op gemeten AHN-top']},
 sources:['PDOK BAG 0392100000039278; AHN DSM/DTM .5m en Actueel_orthoHR bbox 104424.24,488554.56,104664.24,488794.56; 2026-10-09',
 'BGT G0392.ebc749e04c18473d9e504596c18e1fec, actuele versie eaae6c05-b2d3-6b54-90e2-3a5a2dce6f8e van 2023-12-18',
 'https://monumentenregister.cultureelerfgoed.nl/monumenten/513315','https://burovanstigt.nl/de-koepel/',
 'https://commons.wikimedia.org/wiki/File:Close-up_Koepel_Haarlem.jpg']
}});
