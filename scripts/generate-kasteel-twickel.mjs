// kasteel-twickel: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-twickel");
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

const SLUG='kasteel-twickel';
const ORIGIN=[245638,476205],ANGLE=-60*Math.PI/180,X_AXIS=[Math.cos(ANGLE),Math.sin(ANGLE)];
const WATER_NAP=14.4,BASE=-.8,Z=n=>n-WATER_NAP;
const solids=[],cuts=[];
const FRONT=[[-18.96,8.43],[-19.13,-6.06],[-18.0,-9.8],[18.75,-9.72],[18.7,7.67]];
// Hoofdgebouw en vleugels: werkelijke bouwdeelpolygonen en hellende dakvlakken.
solids.push(roofed(FRONT,[...ridgeV(-.6,Z(39.65),1.63),...ridgeU(-.2,Z(60.1),1.5),[0,0,Z(33.85)]]));
const SOUTH=rect(9.14,19.02,-33.11,-9.7),NORTH=rect(-27.44,-17.97,-21.97,-9.6);
solids.push(roofed(SOUTH,[...ridgeU(14.0,Z(33.8),1.28),facet([9.14,-33.11],[19.02,-33.11],Z(27.5),1.28,[14,-20])]));
solids.push(roofed(NORTH,[...ridgeU(-22.65,Z(33.4),1.25),facet([-27.44,-21.97],[-17.97,-21.97],Z(27.45),1.25,[-22,-14])]));
const NW=rect(-23.03,-14.05,-14.2,-6.0);
solids.push(roofed(NW,[...ridgeU(-18.54,Z(32.1),1.15),...ridgeV(-10.1,Z(32.1),1.15)]));
// Vierkante oosttoren: gemeten hoofdspits NAP 43,56 m.
const east=[21.25,7.89],EP=[[16.15,7.66],[16.19,13.03],[26.33,12.81],[25.99,2.76],[18.68,2.9],[18.7,7.66]];
solids.push(prism(rect(16.16,26.32,2.75,13.03),BASE,Z(30.65)),loft([[Z(30.6),rect(16.16,26.32,2.75,13.03)],[Z(43.6),tip(east)]]));
// Slanke noordwesttoren, terugliggende kap zonder los kroonlijst-overstek.
const slender=[-21.04,-7.79];solids.push(prism(rect(-23.03,-19.05,-9.62,-5.99),BASE,Z(32.7)),loft([[Z(32.65),rect(-23.03,-19.05,-9.62,-5.99)],[Z(42.75),tip(slender)]]));
// Achtzijdige erker/risaliet aan de zuidzijde van de oosttoren, laag dak.
solids.push(roofed([[18.68,-4.22],[19.92,-4.34],[22.42,-3.15],[23.75,-.63],[23.47,2.83],[18.7,2.9]],[...ridgeU(20.8,Z(31.35),1.12),...ridgeV(-.5,Z(31.35),1.12)]));
// Renaissance ingangstopgevel: vaste schouders, fronton en twee pinakels.
const gable=[[-3.4,BASE],[3.4,BASE],[3.4,Z(28.1)],[2.55,Z(28.1)],[2.55,Z(31.7)],[1.65,Z(31.7)],[1.65,Z(34.0)],[.55,Z(34.0)],[0,Z(36.05)],[-.55,Z(34.0)],[-1.65,Z(34.0)],[-1.65,Z(31.7)],[-2.55,Z(31.7)],[-2.55,Z(28.1)],[-3.4,Z(28.1)]];
solids.push(profileX(gable,7.82,8.88).rotate([0,0,90]));
for(const x of[-2.75,2.75])solids.push(pinnacle([x,8.35],.44,Z(28),4.3,1.2));
// Twee erkers op gedragen schuine consoles; geen los balkon.
for(const x of[-6.4,6.45]){
 solids.push(loft([[Z(19.1),rect(x-.5,x+.5,8.1,8.35)],[Z(21.0),rect(x-1.8,x+1.8,8.0,9.05)]]));
 solids.push(prism(rect(x-1.8,x+1.8,8.0,9.05),Z(21.0),Z(27.4)),roofed(rect(x-1.8,x+1.8,8.0,9.05),ridgeU(x,Z(30.1),1.3)).intersect(prism(rect(x-1.8,x+1.8,8.0,9.05),Z(27.3),100)));
}
// Zandstenen speklagen in de gevel, naar binnen afgeschuind.
for(const n of[18.5,21.1,24.45]){
 const outer=new CrossSection([ccw(FRONT)]).offset(.12,'Miter').toPolygons()[0];
 solids.push(loft([[Z(n-.15),FRONT],[Z(n),outer],[Z(n+.12),FRONT]]));
}
// Schoorstenen: twee op de voornok, vijf op de zijvleugels.
for(const [x,y,b,t]of[[-9.8,2.8,33.3,35.85],[10.0,2.5,33.3,35.9],[14,-15,33.2,36.15],[14,-27,33.2,35.8],[-22.6,-16.5,32.6,34.9],[-17.6,-9.4,31.5,34.8],[-13.1,-5.8,32.8,35.5]])solids.push(pinnacle([x,y],.6,BASE,Z(t)-BASE,.15));
// Vier voorgevelkapellen; aanvullende kapellen op binnen- en zijgevels.
const foot=Manifold.union([prism(FRONT,BASE,100),prism(SOUTH,BASE,100),prism(NORTH,BASE,100),prism(NW,BASE,100)]);
const dormer=(x,y,w,side,t)=>solids.push(roofed(rect(x-w/2,x+w/2,y-1,y+1),side==='v'?ridgeU(x,Z(t),1.2):ridgeV(y,Z(t),1.2)).intersect(foot));
for(const x of[-13.5,-5.7,5.7,13.3])dormer(x,7.65,1.9,'v',30.9);
for(const x of[-13.5,-8.5,-3.5,2.0,6.5]){dormer(x,-8.7,1.9,'v',30.9);dormer(x,-5.75,1.3,'v',33.3);}
for(const y of[-14.5,-20.5,-26.5]){dormer(10.05,y,1.8,'u',30.75);dormer(18.0,y,1.8,'u',30.75);}
for(const y of[-12.7,-17.9])dormer(-26.5,y,1.8,'u',30.4);
// Binnenplaats blijft PDOK-terrein; alleen de gemetselde keermuur/balustrade.
solids.push(prism(rect(-18.95,-17.95,-33.7,-21.8),BASE,Z(18.5)),prism(rect(-18.95,9.3,-33.7,-32.7),BASE,Z(18.5)));
solids.push(prism(rect(-3.05,2.65,-11.25,-9.7),BASE,Z(22.9)),roofed(rect(-3.05,2.65,-11.25,-9.7),ridgeU(-.2,Z(24.0),1.15)));
// Gevelindeling: 0,35 m blinde rechthoekige nissen met foto-afgeleide maatvoering.
const rn=(ang,a,s,w,lo,hi)=>prism(rect(a-.35,a+.35,s-w/2,s+w/2),Z(lo),Z(hi)).rotate([0,0,ang]);
const rows=[[15.9,17.3],[18.55,21.5],[22.6,25.5]];
for(const [lo,hi]of rows){
 for(const x of[-16.2,-12.5,-9.3,-6.4,-3.0,3.0,6.45,9.2,12.3,15.3])cuts.push(rn(90,8.3,-x,1.65,lo,hi));
 for(const x of[-15.4,-11.5,-7.5,-3.5,2.6,6.4])cuts.push(rn(-90,9.75,x,1.7,lo,hi));
 for(const y of[-12.8,-17.2,-21.7,-26,-30])cuts.push(rn(0,19.0,y,1.75,lo,hi),rn(180,-9.14,-y,1.75,lo,hi));
 for(const y of[-12.7,-17.7])cuts.push(rn(180,27.4,-y,1.8,lo,hi),rn(0,-17.97,y,1.8,lo,hi));
 for(const x of[18.7,23.6])cuts.push(rn(90,12.95,-x,1.75,lo,hi));
 for(const y of[5.2,10.2])cuts.push(rn(0,26.15,y,1.75,lo,hi));
 cuts.push(rn(180,23.03,7.8,1.1,lo+1,hi),rn(90,-5.99,21.04,1.1,lo+1,hi));
}
// Ingang is een ondiepe puntnis; originele rondboog is geen open tunnel.
cuts.push(niche([0,0],90,8.84,0,2.3,Z(17.7),Z(21.8),.35));
const castle=Manifold.union(Manifold.union(solids).subtract(Manifold.union(cuts)).decompose().filter(s=>s.volume()>0));
// Actuele BGT-voetpaden; het dek is overal de bovenste 0,50 m.
const FRONT_BRIDGE=[[1.72,27.25],[-2.24,27.25],[-2.27,21.85],[-2.66,21.75],[-2.62,18.05],[-2.28,18.05],[-2.04,8.06],[1.88,7.98],[1.85,18.07],[2.27,18.07],[2.24,21.82],[1.93,21.83]];
const REAR_BRIDGE=[[1.95,-54.02],[1.84,-33.27],[-2.14,-33.34],[-2.29,-54.04]];
const frontTop=y=>Z(17.76)-.0035*(y-8);
const rearTop=y=>Z(16.79)+.026*(y+33.27);
let stone=roofed(FRONT_BRIDGE,[[0,-.0035,Z(17.76)+.0035*8]]);
for(const y of[13.0,22.0])stone=stone.subtract(profileX([[y-3.25,BASE-.01],[y+3.25,BASE-.01],[y+3.25,Z(11.85)],[y,Z(16.5)],[y-3.25,Z(11.85)]],-5,5));
const frontStrip=profileX([[7.9,frontTop(7.9)-.5],[27.3,frontTop(27.3)-.5],[27.3,Z(23)],[7.9,Z(23)]],-4,4).intersect(prism(new CrossSection([ccw(FRONT_BRIDGE)]).offset(.03,'Miter').toPolygons()[0],BASE,100));
const frontDeck=stone.intersect(frontStrip);stone=stone.subtract(frontStrip);
// Tuinbrug: 7 zware steunpunten met steile draagbogen onder het oorspronkelijk vlakke houten dek.
let timber=roofed(REAR_BRIDGE,[[0,.026,Z(16.79)+.026*33.27]]);
for(const y of[-35.5,-39,-42.5,-46,-49.5,-52.5]){
 const h=rearTop(y)-.65;
 timber=timber.subtract(profileX([[y-1.15,BASE-.01],[y+1.15,BASE-.01],[y+1.15,h-1.65],[y,h],[y-1.15,h-1.65]],-4,4));
}
const rearStrip=profileX([[-54.1,rearTop(-54.1)-.5],[-33.2,rearTop(-33.2)-.5],[-33.2,Z(23)],[-54.1,Z(23)]],-4,4).intersect(prism(new CrossSection([ccw(REAR_BRIDGE)]).offset(.03,'Miter').toPolygons()[0],BASE,100));
const rearDeck=timber.intersect(rearStrip);timber=timber.subtract(rearStrip);
const bridges=Manifold.union([stone,timber]),deck=Manifold.union([frontDeck,rearDeck]);
const nodes=[['building:kasteel',castle],['building:steenbrug en tuinbrug',bridges],['road:voetpaden',deck]],all=Manifold.union([castle,bridges,deck]);
const ATTRIBUTES={'road:voetpaden':{bgt_functie:'voetpad',bgt_fysiekvoorkomen:'open verharding'}};
const OVERHANG_OK=(z,p)=>[17.3,21.5,25.5,18.3,22.5,26.5].some(n=>Math.abs(z-Z(n))<1e-5&&p.every(q=>Math.abs(q[2]-z)<1e-5));
const META={name:'Kasteel Twickel',origin:ORIGIN,xAxis:X_AXIS,groundHeight:57.83,groundSamplePoints:[[-35,0],[35,0],[25,-35]],replacesBuildings:['1735100000001456'],
 description:'Drie bouwvleugels rond een open binnenplaats, vierkante oosttoren en slanke noordwesttoren, renaissance-topgevel en erkers, vensternissen, kapellen en zeven schoorstenen. Twee actuele BGT-voetpaddekken afzonderlijk; ronde stenen brugbogen en houten tuinbrugdragers steiler vereenvoudigd voor 1:1000 zonder steun. Fijne balusters, roeden, metalen hekken en beelden vervallen.',
 realWorld:{waterNapM:WATER_NAP,mainRoofNapM:33.85,eastTowerTopNapM:43.6,northTowerTopNapM:42.75,frontBridgeNapM:17.76,rearBridgeNapM:16.79},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/507544','https://monumentenregister.cultureelerfgoed.nl/monumenten/507550','https://commons.wikimedia.org/wiki/Category:Twickel_Castle','PDOK BAG 1735100000001456, AHN DSM/DTM 0,5 m, Actueel_orthoHR, BGT voetpad G1735.45cf62f5725515b2e054002128f9eb56 en G1735.45cf62f4018615b2e054002128f9eb56, 9 oktober 2026']};

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
        "G1735.45cf62f4959915b2e054002128f9eb56",
        "G1735.45cf62f4ae8815b2e054002128f9eb56",
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
