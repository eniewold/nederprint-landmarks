// Koepelgevangenis Arnhem: omwentelingsprofiel, vier traptorens en BAG-vleugels.
// Bronprofielen beschrijven doorlopende dakvlakken, geen gestapelde hoogtelagen.
// Referentie: generate-evoluon.mjs; meters op ware grootte, vlakke printvoet.
import { Manifold, box, prism, circle, dome, spire, hull, gableRoof, union, writeLandmark } from './efteling-kit.mjs';

const slug = 'koepel-arnhem', base = -.8, ground = 31.07;
const origin = [188751.822, 444225.866], xAxis = [.99994, -.01095];
const z = nap => nap - ground, parts = [], cuts = [], relief = [];
const core = h => h + 35.70 - ground;
// BAG-cirkel least-squares: r=31.846 m. AHN-mediaan per radiale meter,
// gegroepeerd op veranderingen in het dakprofiel, inclusief lessenaarsring.
const profile = [[31.846,49.45],[30.5,50.07],[28.5,51.22],[26.5,53.17],
  [25.5,55.24],[23.5,58.34],[20.5,61.35],[16.5,63.71],[12.5,65.41],
  [8.5,66.54],[4.5,67.20],[0,67.25]];
const roofNap = r => {
  for (let i=1; i<profile.length; i++) {
    const [a,za]=profile[i-1], [b,zb]=profile[i];
    if (r>=b) return zb+(za-zb)*(r-b)/(a-b);
  }
  return profile.at(-1)[1];
};
parts.push(dome([0,0], [[31.846,base], ...profile.map(([r,h])=>[r,z(h)])], 224));
// Veertienzijdige lichtlantaarn, tentdak en verdikte piron naar AHN en foto's.
parts.push(prism(circle([0,0],4.1,14,Math.PI/14),z(66.8),z(68.4)));
parts.push(spire([0,0],4.1,z(68.4),z(70.2),14,Math.PI/14));
parts.push(dome([0,0],[[.65,z(69.6)],[.85,z(70.1)],[.60,z(70.6)],[.45,z(71.2)],[0,z(71.734)]],28));
for (let j=0;j<14;j++) {
  cuts.push(box(3.78,-.55,z(67.2),4.4,.55,z(68.1)).rotate([0,0,360*j/14]));
}
// 28 radiale roeven, printreliëf 0.9 m breed. Alleen ingebed in het dak.
for (let j=0;j<28;j++) {
  const a=2*Math.PI*j/28, t=[-Math.sin(a),Math.cos(a)], d=[Math.cos(a),Math.sin(a)];
  const line=profile.filter(([r])=>r>=4.5&&r<=26.5);
  for (let k=1;k<line.length;k++) {
    const corners=[];
    for (const [r,h] of [line[k-1],line[k]]) for (const w of [-.45,.45]) for (const dz of [-.4,.25])
      corners.push([r*d[0]+w*t[0],r*d[1]+w*t[1],z(h)+dz]);
    parts.push(hull(corners));
  }
}
// Twee banden van 14 dakvensters plus 14 vensters in het lessenaarsdak.
for (const [r,w,len] of [[12.5,2.8,3.0],[22.0,3.5,3.8],[29.2,1.2,1.5]]) {
  const h=roofNap(r), slope=(roofNap(r+.1)-roofNap(r-.1))/.2;
  for (let j=0;j<14;j++) {
    const angle=360*(j+.5)/14;
    cuts.push(box(-len/2,-w/2,-.3,len/2,w/2,.65)
      .rotate([0,-Math.atan(slope)*180/Math.PI,0]).translate([r,0,z(h)]).rotate([0,0,angle]));
  }
}
// 13 celvensters tussen elke twee traptorens, vier verdiepingen: blinde nissen.
for (let q=0;q<4;q++) for (let j=1;j<=13;j++) for (const h of [1.5,4.65,7.80,10.95]) {
  const angle=90*q+90*j/14;
  // Geen raamholte waar de oostelijke verbindingsgang tegen de rondwand staat.
  if (Math.cos(angle*Math.PI/180)>.98) continue;
  const arch=prism([[-.65,core(h)],[.65,core(h)],[.65,core(h+1.25)],[.35,core(h+1.50)],[-.35,core(h+1.50)],[-.65,core(h+1.25)]],31.43,32.2).rotate([90,0,90]);
  cuts.push(arch.rotate([0,0,angle]));
}
// Vier traptorens: voet in de cirkel, kantelen, kruisvenster en schietsleuven.
for (let q=0;q<4;q++) {
  const a=90*q, tower=[];
  tower.push(box(29.1,-2.1,base,34.4,2.1,z(52.1)));
  for (const yy of [-1.6,0,1.6]) tower.push(box(33.25,yy-.50,z(51.9),34.4,yy+.50,z(53.05)));
  for (const yy of [-2.1,1.1]) for (const xx of [30.0,32.0]) tower.push(box(xx,yy,z(51.9),xx+1.0,yy+1.0,z(53.05)));
  parts.push(union(tower).rotate([0,0,a]));
  cuts.push(box(34.02,-.90,core(2.0),34.8,.90,core(12.8)).rotate([0,0,a]));
  for (const yy of [-1.35,0,1.35]) cuts.push(box(34.0,yy-.25,core(14.5),34.8,yy+.25,core(15.65)).rotate([0,0,a]));
  // Middenstijl en twee kalven dragen het blinde reliëf volledig.
  relief.push(box(34.0,-.45,core(2.0),34.25,.45,core(12.8)).rotate([0,0,a]));
  for (const h of [5.7,9.2]) relief.push(box(34.0,-.90,core(h),34.25,.90,core(h+.9)).rotate([0,0,a]));
}
// BAG-vleugels: alleen de aangebouwde delen van hetzelfde pand vervangen.
const west=[[-67.5,-8.5],[-53.98,-8.47],[-53.99,-6.31],[-39.28,-6.39],[-39.28,6.6],[-67.5,6.44]];
const westVolume=union([box(-68,-9,base,-39,7,z(44.1)),gableRoof(29,15.5,z(44.1),z(50.85)).translate([-53.5,-.75,0])]);
parts.push(westVolume.intersect(prism(west,base,40)));
parts.push(box(-39.4,-2.1,base,-30.0,2.1,z(46.6)));
// Oostelijke verbindingsgang heeft een lager zadeldak; administratie nok N-S.
parts.push(box(30,-6.43,base,42,6.44,z(38.9)));
parts.push(gableRoof(12,12.87,z(38.9),z(44.8)).translate([36,0,0]));
parts.push(box(41.16,-10.45,base,50.45,10.39,z(45.9)));
parts.push(gableRoof(20.84,9.29,z(45.9),z(49.65)).rotate([0,0,90]).translate([45.805,-.03,0]));
// Gevelnissen, schoorstenen en daklicht aan beide vleugels volgens schuine foto's.
for (const x of [-64,-59,-54,-49,-44]) for (const h of [1.8,5.0,8.2])
  for (const y of [x<-54?-8.5:-6.4,6.5]) {
    if(x<-56&&y>0&&h===1.8) continue; // Lage aangebouwde noordstrook dekt dit raam.
    cuts.push(box(x-.65,y-.4,core(h),x+.65,y+.4,core(h+1.8)));
  }
for (const y of [-7.8,-3.9,0,3.9,7.8]) for (const h of [1.4,4.8,8.2])
  cuts.push(box(50.08,y-.70,core(h),50.9,y+.70,core(h+1.8)));
for (const x of [-63,-42]) parts.push(box(x-.6,-1.8,z(47.5),x+.6,-.6,z(51.6)));
parts.push(box(44.9,7.3,z(48.1),46.1,8.5,z(50.0)));
cuts.push(box(-60,-2.0,z(49.4),-55,.4,z(51.2)));

// Actuele BGT-contour (23 september 2026) omvat ook de lage annexen.
// De PDOK-tegel groepeert ze onder hetzelfde BAG-id; geen bijgebouw wegnemen.
// Maaiveld daalt hier tot NAP 31.07: alle volle kernen beginnen op dat vlak,
// zodat de heuvel het hogere koepelvoetstuk bedekt en geen annex zweeft.
const south=[[-2.213,-34.395],[-2.373,-37.994],[-2.006,-37.990],[-1.962,-41.990],[-3.962,-42.012],[-5.959,-42.334],[-5.970,-41.334],[-19.270,-41.379],[-20.462,-42.093],[-20.466,-32.592],[-34.368,-32.544],[-34.422,-45.846],[-34.682,-58.649],[-33.079,-58.932],[-30.065,-60.199],[-27.154,-61.167],[-24.050,-61.533],[-21.552,-61.306],[-17.566,-59.962],[-4.664,-60.121],[-2.555,-60.898],[.651,-61.463],[3.750,-61.329],[5.542,-60.609],[12.043,-60.638],[12.019,-58.438],[15.020,-58.505],[18.527,-59.167],[21.943,-60.629],[24.952,-61.396],[27.254,-61.571],[30.549,-61.135],[34.433,-59.593],[36.925,-58.865],[36.944,-60.665],[42.744,-60.602],[42.724,-58.802],[48.450,-61.139],[49.508,-57.227],[50.709,-57.314],[51.232,-59.409],[51.137,-59.910],[53.327,-58.986],[55.207,-57.165],[56.481,-54.751],[57.245,-51.442],[57.314,-48.641],[56.475,-45.050],[54.943,-42.167],[52.817,-39.790],[50.903,-38.511],[48.795,-37.834],[46.996,-37.954],[44.911,-39.277],[43.929,-40.987],[43.836,-41.902],[42.729,-41.898],[42.735,-40.285],[36.946,-40.267],[36.941,-42.064],[1.537,-41.952],[1.495,-38.052],[2.011,-38.046],[2.051,-34.374]];
const southMask=prism(south,base,60);
const southRoof=union([
  box(-35,-63,base,-20.4,-32,z(41.2)),box(-20.4,-63,base,58,-32,z(41.5)),
  gableRoof(18,13,z(41.5),z(44.9)).rotate([0,0,90]).translate([-12.5,-51.5,0]),
  box(1.5,-61,base,12,-42,z(44.85)),
]);
parts.push(southRoof.intersect(southMask));
const north=[[-2.05,31.8],[-2.05,33.6],[-1.84,38.62],[-13.15,38.59],[-17.28,51.25],[-6.48,51.07],[-6.49,52.17],[6.2,52.15],[6.2,51.01],[16.95,50.85],[12.86,38.58],[1.55,38.65],[2.2,31.79]];
parts.push(prism(north,base,60).intersect(union([
  box(-18,38.5,base,18,53,z(49.21)),box(-2.3,31.7,base,2.3,38.7,z(40.5)),
])));
parts.push(box(-6.3,44.9,z(49),6.1,51.4,z(51.94)));
parts.push(prism([[-73.68,-8.51],[-67.5,-8.5],[-67.5,6.44],[-56.35,6.44],[-56.27,12.18],[-73.68,12.22]],base,z(41.80)));
for(const x of [-71,-66,-61]) cuts.push(box(x-.65,11.9,z(39.1),x+.65,12.6,z(40.6)));
// Nissen in de buitenrand van de zuidelijke annex, op absolute NAP-niveaus.
for(let k=0;k<south.length;k++) {
  const [x0,y0]=south[k], [x1,y1]=south[(k+1)%south.length], len=Math.hypot(x1-x0,y1-y0);
  if(Math.min(y0,y1)>-57||len<2.5) continue;
  const n=Math.max(1,Math.floor(len/3.6)),angle=Math.atan2(y1-y0,x1-x0)*180/Math.PI;
  for(let j=0;j<n;j++) for(const h of [35.2,38.4]) {
    const t=(j+.5)/n;
    cuts.push(box(-.65,-.35,z(h),.65,.35,z(h+1.6)).rotate([0,0,angle]).translate([x0+t*(x1-x0),y0+t*(y1-y0),0]));
  }
}
for(const x of [-12,-8,-4,0,4,8,12]) for(const h of [40.3,44.0,47.3])
  cuts.push(box(x-.65,50.8,z(h),x+.65,52.5,z(h+1.4)));
for(const [x,y,h] of [[24,-52,44.2],[30,-51,43.1],[-29,-34,43.4]])
  parts.push(box(x-.7,y-.7,z(40.8),x+.7,y+.7,z(h)));

const raw=union([union(parts).subtract(union(cuts)),...relief]);
const shells=raw.decompose(), nonzero=shells.filter(s=>Math.abs(s.volume())>1e-6);
if (raw.status()!=='NoError'||nonzero.length!==1||nonzero[0].volume()<=0) throw Error('Geen enkel gesloten model: '+raw.status()+' '+nonzero.map(s=>JSON.stringify({v:s.volume(),bb:s.boundingBox()})).join(';'));
// Alleen nulvolume-oppervlakken van co-planaire dakroeven verwijderen.
const solid=nonzero[0];
await writeLandmark({slug,base,nodes:[['building:koepel met traptorens en aangebouwde vleugels',solid]],catalog:{
  name:'Koepelgevangenis (Arnhem)',origin,xAxis,groundOffsetMetres:0,
  groundSamplePoints:[[25,-65],[36,-64],[43,-65]],
  replacesBuildings:['NL.IMBAG.Pand.0202100000274796'],
  description:'Ronde koepel met lessenaarsring, lantaarn, vier gekanteelde traptorens, circa 200 zichtbare celraamnissen, twee oude vleugels en lage annexen uit de actuele BGT-contour. +X langs de oostelijke verbindingsgang, vrijwel oostwaarts; poort, kerk, ringmuur en afzonderlijke panden blijven PDOK.',
  realWorld:{groundNapM:ground,diameterM:63.692,topNapM:71.734,radialRoofProfileNap:profile,
    schattingen:['roeven verdikt tot 0.9 m reliëf, fijn zinkpatroon en hekwerk weggelaten','vensters, kantelen en lantaarn vereenvoudigd uit schuine fotos; dakvensters als blinde nissen','vleugeldaken op gemeten AHN-nokken en BAG/BGT-contour; afwijkende historische dakdetails niet gekopieerd','annexvensters en installaties schematisch; vlakke voet op laagste omringende pad, hoger koepelmaaiveld NAP35.7']},
  sources:['PDOK BAG 0202100000274796; AHN DSM/DTM .5m en Actueel_orthoHR bbox 188570,444060,188920,444390; 2026-10-09',
    'BGT pand G0202.2af034b95c7812c4e05343604191f184, actuele versie 393e0716-aece-7f0a-df29-a638c5a51b99; 2026-09-23',
    'https://monumentenregister.cultureelerfgoed.nl/monumenten/516731',
    'https://commons.wikimedia.org/wiki/File:Arnhem_-_Wilhelminastraat_bij_16_-_Cellencomplex_-_2.jpg',
    'https://commons.wikimedia.org/wiki/File:Bovenaanzicht_vanaf_zendmast_-_Arnhem_-_20365904_-_RCE.jpg',
    'https://commons.wikimedia.org/wiki/File:Koepel_Arnhem,_exterieur.jpg']
}});
