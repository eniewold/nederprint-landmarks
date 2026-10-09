// kasteel-cannenburch: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-cannenburch");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor een veelhoek met apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: goot z0, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Doorsnede van een of meer veelhoeken en een rand (borstwering) van breedte w langs de omtrek, van z0 tot z1.
const section = (...polys) => CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
const band = (cs, w, z0, z1) => Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);

// BAG-contour en AHN-nokken in het gevelstelsel, gemeten 9 oktober 2026.
const SLUG='kasteel-cannenburch';
const ORIGIN=[194435,478398.5], ANGLE=-2.21*Math.PI/180;
const X_AXIS=[Math.cos(ANGLE),Math.sin(ANGLE)];
// Water NAP +13,21 afgeleid uit PDOK-water 56,35 en lokale geoid-offset
// 43,14 m (mediaan PDOK-LoD2 minus AHN); AHN heeft hier geen waterretour.
const WATER_NAP=13.21, BASE=-.8, Z=n=>n-WATER_NAP;
const HALL={plan:rect(-13.17,13.29,-7.99,7.05),ridgeV:-1.0,ridge:36.15,slope:1.29};
const EAST={plan:rect(2.27,13.29,-15.62,7.05),ridgeU:8.95,ridge:36.10,slope:1.31};
const SW={c:[-15.3,-8.42],w:6.31,d:7.01,eave:23.0,top:29.05};
const NW={c:[-12.19,9.11],w:6.78,d:6.26,eave:22.35,top:26.45};
const SE={c:[12.05,-11.47],w:7.72,d:8.30,eave:27.5,top:32.95};
const NE={c:[12.36,9.01],w:6.67,d:6.29,eave:28.9,knee:32.4,bulb:35.65,top:37.0};
const ENTRY={c:[5.23,-14.7],w:5.92,d:7.54,eave:32.6,knee:36.25,bulb:40.2,top:42.0};
const hip=(c,w,d,eave,top,slope)=>roofed(rect(c[0]-w/2,c[0]+w/2,c[1]-d/2,c[1]+d/2),[
 ...ridgeU(c[0],Z(top),slope),...ridgeV(c[1],Z(top),slope),[0,0,Z(top)]]);
const windows=[];
const window=(c,a,apo,w,z0,z1)=>profileX([[-w/2,Z(z0)],[w/2,Z(z0)],[w/2,Z(z1)],[-w/2,Z(z1)]],apo-.35,apo+.4).rotate([0,0,a]).translate([...c,0]);
const solids=[];
solids.push(roofed(HALL.plan,[...ridgeV(HALL.ridgeV,Z(HALL.ridge),HALL.slope),[HALL.slope,0,Z(26.55)+HALL.slope*13.17],[-HALL.slope,0,Z(26.55)+HALL.slope*13.29]]));
solids.push(roofed(EAST.plan,[...ridgeU(EAST.ridgeU,Z(EAST.ridge),EAST.slope),[0,EAST.slope,Z(27.15)+EAST.slope*15.62],[0,-EAST.slope,Z(27.15)+EAST.slope*7.05]]));
for(const t of [SW,NW,SE]){
 solids.push(hip(t.c,t.w,t.d,t.eave,t.top,(t.top-t.eave)/(Math.min(t.w,t.d)/2)));
 solids.push(prism(sq(t.c,Math.min(t.w,t.d)/2+.14),BASE,Z(15.15)));
}
const onion=(t)=>{
 const p=rect(t.c[0]-t.w/2,t.c[0]+t.w/2,t.c[1]-t.d/2,t.c[1]+t.d/2);
 solids.push(prism(p,BASE,Z(t.eave)));
 solids.push(loft([[Z(t.eave),p],[Z(t.knee),oct(t.c,2.05)]]));
 solids.push(loft([[Z(t.knee),oct(t.c,2.05)],[Z(t.knee+.9),oct(t.c,2.5)],[Z(t.bulb-1.0),oct(t.c,2.45)],[Z(t.bulb),oct(t.c,1.3)],[Z(t.top),tip(t.c)]]));
 for(const h of [19.6,24.7,t.eave])solids.push(loft([[Z(h-.3),p],[Z(h),p.map(([x,y])=>[t.c[0]+(x-t.c[0])*(1+.18/(t.w/2)),t.c[1]+(y-t.c[1])*(1+.18/(t.d/2))])]]));
};
onion(NE);onion(ENTRY);
// Vier topgevels rond de ingangstoren, met brede schoorsteenachtige pinakels.
for(const a of [0,90,180,270]){
 solids.push(profileX([[-2.65,Z(32.4)],[2.65,Z(32.4)],[0,Z(36.4)]],2.55,2.96).rotate([0,0,a]).translate([...ENTRY.c,0]));
 for(const s of [-2.2,2.2]){const c=[ENTRY.c[0]+2.7*Math.cos(a*Math.PI/180)-s*Math.sin(a*Math.PI/180),ENTRY.c[1]+2.7*Math.sin(a*Math.PI/180)+s*Math.cos(a*Math.PI/180)];solids.push(loft([[Z(31.8),sq(c,.1)],[Z(32.4),sq(c,.45)]]),pinnacle(c,.45,Z(32.4),1.2,.7));}
}
// Zandstenen risaliet van de huidige ingang en driehoekige bekroning.
solids.push(prism(rect(-2.5,.15,-8.42,-7.6),BASE,Z(26.6)));
solids.push(profileX([[-2.5,Z(25.8)],[.15,Z(25.8)],[-1.18,Z(27.9)]],7.8,8.42).rotate([0,0,270]));
for(const h of [18.8,23.7,27.0,32.3])solids.push(loft([[Z(h-.35),rect(ENTRY.c[0]-ENTRY.w/2,ENTRY.c[0]+ENTRY.w/2,-18.47,-18.1)],[Z(h),rect(ENTRY.c[0]-ENTRY.w/2-.25,ENTRY.c[0]+ENTRY.w/2+.25,-18.75,-18.1)]]));
// Schoorstenen aan beide nokken en de twee westtorens.
for(const [x,y,w,d,h]of[[-6.3,-.9,1.45,1.4,37.75],[7.9,-1,1.3,1.4,38.1],[8.7,-11.7,1.4,1.4,38.0],[-15.3,-8.4,1.1,1.1,30.1],[-12.2,9.1,1.1,1.1,27.5]])solids.push(prism(rect(x-w/2,x+w/2,y-d/2,y+d/2),BASE,Z(h)));
// Dakkapellen: breed achter, kleinere schildkapellen op de hellingen.
for(const [x,y,h]of[[-6.7,6.6,28.4],[-4.8,6.6,28.4],[3.5,6.6,28.5],[-5,-7.5,28.6],[.1,-7.5,28.7]])solids.push(roofed(rect(x-.65,x+.65,y-1.5,y+.45),ridgeU(x,Z(h),1.3)));
for(const [x,y,h]of[[-12.8,-.4,28.6],[13,-2.6,29.8],[13,2.3,29.5],[-12.2,9.5,25.2]])solids.push(roofed(rect(x-1.4,x+.45,y-.65,y+.65),ridgeV(y,Z(h),1.3)));
// Raamrijen aan de asymmetrische gevels; ondiep, geen open galerijen.
for(const x of [-10.1,-6.5,-2.5,2.0,5.7])for(const [z0,z1]of[[17.3,20.3],[22.2,25.1]])windows.push(window([x,0],90,7.05,1.5,z0,z1));
for(const x of [-9.2,-6.2,-1.2])for(const [z0,z1]of[[17.6,20.8],[22.8,25.4]])windows.push(window([x,0],270,7.99,1.7,z0,z1));
for(const y of [-4.1,1.3,4.4])for(const [z0,z1]of[[17.7,20.3],[22.6,25.3]]){
 windows.push(window([0,y],180,13.17,1.6,z0,z1));windows.push(window([0,y],0,13.29,1.6,z0,z1));
}
for(const t of [SW,NW,SE,NE])for(const a of [0,90,180,270])for(const [z0,z1]of[[17.5,20.5],[22.5,25.0]]){const top=Math.min(z1,t.eave-.3);if(top>z0)windows.push(window(t.c,a,a%180===0?t.w/2:t.d/2,1.5,z0,top));}
for(const a of [0,270])for(const [z0,z1]of[[17.0,19.5],[21.5,24.0],[26,28.4],[29.7,31.4]])windows.push(window(ENTRY.c,a,a===0?ENTRY.w/2:ENTRY.d/2,1.3,z0,z1));
let castle=Manifold.union(solids).subtract(Manifold.union(windows));
// Nissen op een door een aangrenzend bouwdeel verborgen gevel vormen
// geen binnenholtes in de print: alleen de buitenste gesloten schil blijft.
castle=Manifold.union(castle.decompose().filter(p=>p.volume()>0));
// Bordes, dichte stenen balustrade (0,9 m) en trap naar de brug.
let bridge=prism(rect(-12.15,2.27,-12.4,-7.9),BASE,Z(16.1));
for(const x of [-11.7,1.8])bridge=bridge.add(prism(rect(x-.45,x+.45,-12.4,-8),BASE,Z(17.3)));
bridge=bridge.add(prism(rect(-12.15,-2.0,-12.4,-11.5),BASE,Z(17.3)));
for(let i=0;i<3;i++)bridge=bridge.add(prism(rect(-3.32,.72,-13.6+i*.4,-12.2+i*.4),BASE,Z(15.75+i*.15)));
// Actuele BGT G0232.12c689e424a945d1aae3a8d9db53a357 (hoogteligging 1),
// vereenvoudigd op 5 cm, in lokaal gevelstelsel.
const BRIDGE_PLAN=[[-4.09,-32.99],[.07,-33.13],[.72,-12.30],[-3.32,-12.22]];
let archBridge=prism(BRIDGE_PLAN,BASE,Z(15.75));
for(const y of [-19.2,-27])archBridge=archBridge.subtract(profileX([[y-2.8,BASE-1],[y+2.8,BASE-1],[y+2.8,Z(10.4)],[y,Z(14.54)],[y-2.8,Z(10.4)]],-5,2));
bridge=bridge.add(archBridge);
const deckStrip=Manifold.extrude(new CrossSection([ccw(BRIDGE_PLAN)]).offset(.03,'Miter'),2.75).translate([0,0,Z(15.25)])
 .intersect(prism(rect(-6,2,-34,-13.62),Z(15.25),Z(18)));
const deck=bridge.intersect(deckStrip),structure=bridge.subtract(deckStrip);
const nodes=[['building:kasteel',castle],['building:brug en bordes',structure],['road:voetpad',deck]];
const all=Manifold.union([castle,bridge]);
const ATTRIBUTES={'road:voetpad':{bgt_functie:'voetpad',bgt_fysiekvoorkomen:'open verharding'}};
const META={name:'Kasteel Cannenburch',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:[[-23,0],[22,0],[0,17]],groundHeight:56.35,replacesBuildings:['0232100000014978'],plate:false,
 description:'Oorsprong op het water NAP +13,21 m (PDOK-water minus lokale geoid-offset; geen AHN-waterretour); +X langs de voorgevel (-2,21 graden in RD); twee kruiselings aansluitende schilddaken, drie vierkante torens met schilddak, twee torens met achtkantige uivormige bekroning, vier topgevels op de toegangstoren, ingang met risaliet en fronton, schoorstenen, dakkapellen, gevelnissen, bordes en brug; fijn beeldhouwwerk en balusters kleiner dan 0,9 m weggelaten, bekroningen en details uit foto geschat.',
 realWorld:{waterNapM:WATER_NAP,hallRidgeNapM:HALL.ridge,entranceTopNapM:ENTRY.top,northEastTopNapM:NE.top},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/520122','https://nl.wikipedia.org/wiki/Kasteel_De_Cannenburch','https://commons.wikimedia.org/wiki/Category:Cannenburgh','PDOK BAG 0232100000014978, AHN DSM/DTM 0,5 m, Actueel_orthoHR en BGT, 9 oktober 2026']};
// Alleen de horizontale bovenzijde van 0,35 m diepe blinde raamdagkanten.
const OVERHANG_OK=(z,p)=>p.every(q=>Math.abs(q[2]-z)<1e-5)&&[20.3,20.8,25.1,25.4,25.3,20.5,25.0,19.5,24,28.4,31.4,26.8,22.05,22.7].some(h=>Math.abs(z-Z(h))<1e-4);
// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (name.startsWith('road:') || Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (!name.startsWith('road:') && Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1, ...(ATTRIBUTES[name]?{extras:{attributes:ATTRIBUTES[name]}}:{}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      replacesTerrain: [
        "G0232.10b22e04f8a64e2d9047095ea308d189",
      ],
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));
