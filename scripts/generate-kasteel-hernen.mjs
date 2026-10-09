// kasteel-hernen: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-hernen");
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

// BAG 0296100000025272, PDOK/AHN 0,5 m en RCE-foto's, 9 oktober 2026.
const SLUG='kasteel-hernen';
const ORIGIN=[174926,427378],ANGLE=-10.9*Math.PI/180,X_AXIS=[Math.cos(ANGLE),Math.sin(ANGLE)];
// Hof NAP +8,41 m; de grachtbodem zit lager en is geen gebouwreferentie.
const GROUND_NAP=8.41,BASE=-3,Z=n=>n-GROUND_NAP;
const WEST=[[-9.45,16.87],[-9.52,-17.21],[-6.39,-20.58],[-3.4,-20.5],[-3.46,8.84],[-5.35,18.89],[-8.24,17.03]];
const NORTH=[[-8.24,17.03],[-5.35,18.89],[10.37,18.34],[12.82,15.83],[14.22,8.98],[4.88,8.53],[-3.46,8.84]];
const EAST=[[4.88,8.53],[14.22,8.98],[18.05,-11.35],[11.95,-12.14],[9.1,-12.1]];
const SOUTH=[[-9.52,-17.21],[-6.39,-20.58],[11.5,-19.91],[13.14,-19.84],[11.95,-12.14],[9.1,-12.1],[-.55,-12.22],[-.54,-10.4],[-3.46,-10.21]];
const solids=[roofed(WEST,ridgeU(-6.3,Z(19.65),1.22)),roofed(NORTH,ridgeV(13.2,Z(23.45),1.43)),roofed(SOUTH,ridgeV(-15.95,Z(20.65),1.12))];
// Oostvleugel loopt niet parallel aan de westmuur: nok en vlakken volgen de BAG-gevel.
const q=.1924,t=1.52/Math.hypot(1,q),ridge=11.85;
solids.push(roofed(EAST,[[t,t*q,Z(26.05)-t*ridge],[-t,-t*q,Z(26.05)+t*ridge]]));
// Verticale topgevels worden in hun eigen vlak opgebouwd uit een getrapte omtrek.
const stepped=[[-4.4,BASE],[4.4,BASE],[4.4,Z(19.4)],[3.5,Z(19.4)],[3.5,Z(21.1)],[2.6,Z(21.1)],[2.6,Z(22.8)],[1.7,Z(22.8)],[1.7,Z(24.5)],[.8,Z(24.5)],[.8,Z(26.3)],[-.8,Z(26.3)],[-.8,Z(24.5)],[-1.7,Z(24.5)],[-1.7,Z(22.8)],[-2.6,Z(22.8)],[-2.6,Z(21.1)],[-3.5,Z(21.1)],[-3.5,Z(19.4)],[-4.4,Z(19.4)]];
// De twee uiteinden van de hoge oostkap; profiel staat dwars op de nok.
for(const [cy,cx]of[[8.68,10.17],[-11.8,14.12]])solids.push(profileX(stepped,-.46,.46).rotate([0,0,100.9]).translate([cx,cy,0]));
const circle=(c,r)=>Array.from({length:48},(_,i)=>[c[0]+r*Math.cos(i*2*Math.PI/48),c[1]+r*Math.sin(i*2*Math.PI/48)]);
const SW=[-9.61,-20.4],NW=[-6.8,17.95],NE=[11.55,17.46];
solids.push(prism(circle(SW,3.21),BASE,Z(16.15)),loft([[Z(15.9),circle(SW,3.21)],[Z(16.35),circle(SW,3.46)],[Z(26.55),tip(SW)]]));
// Uitkragende arkeltorens: de uitzetting onder de schacht is minimaal 50 graden.
for(const [c,h]of[[NW,23.7],[NE,23.65]])solids.push(loft([[Z(9.5),tip(c)],[Z(12.0),circle(c,1.65)],[Z(17.3),circle(c,1.65)],[Z(17.55),circle(c,1.85)],[Z(h),tip(c)]]));
// De verdwenen zuidoostelijke donjon heeft nog een lage vierkante kelder/restmuur.
const ruinPlan=[[11.5,-19.91],[13.14,-19.84],[11.95,-12.14],[18.05,-11.35],[19.9,-20.75],[11.55,-22.15]];
const rcs=new CrossSection([ccw(ruinPlan)]);
solids.push(Manifold.extrude(rcs, Z(9.6)-BASE).translate([0,0,BASE]),band(rcs,.95,Z(9.55),Z(10.45)));
// Kleine traptoren aan de zuidzijde van het hof, dak in twee vlakken.
solids.push(roofed(rect(-3.5,-.4,-12.25,-9.7),[...ridgeU(-1.95,Z(21.1),1.5),...ridgeV(-10.95,Z(21.1),1.5)]));
// Het westelijke erkerblok rust op een vereenvoudigde console met een afschuining >45 graden.
solids.push(loft([[Z(8.9),rect(-9.4,-9.1,-2.1,.1)],[Z(10.5),rect(-10.85,-9.1,-2.1,.1)],[Z(13.5),rect(-10.85,-9.1,-2.1,.1)]]));
solids.push(roofed(rect(-10.85,-9.1,-2.1,.1),ridgeV(-1,Z(14.3),1.15)).trimByPlane([0,0,1],Z(13.4)));
for(const [x,y,w,d,h]of[[-6.3,10,1.2,1.3,22],[-6.3,-9.5,1.3,1.4,22.1],[-1.9,13.2,1.1,1.2,25.8],[7,13.2,1.1,1.2,25.8],[-2.7,-15.9,1.5,1.4,23.1],[11.2,3,1.5,1.5,28.5],[12.5,-3.5,1.5,1.6,29.0]])solids.push(prism(rect(x-w/2,x+w/2,y-d/2,y+d/2),BASE,Z(h)));
// Kapellen aan de buitenzijde van de west-, zuid- en oostkap.
for(const y of [-14,-6,3,11])solids.push(roofed(rect(-9.4,-7.75,y-.6,y+.6),ridgeV(y,Z(17.7),1.3)));
for(const x of [-3.8,1.7,7.3])solids.push(roofed(rect(x-.65,x+.65,-20.2,-18.4),ridgeU(x,Z(17.7),1.3)).intersect(prism(SOUTH,BASE,100)));
for(const y of [-7,0,6]){const x=15.86-q*y;solids.push(roofed(rect(x-1.4,x+.2,y-.65,y+.65),ridgeV(y,Z(21.3),1.3)).intersect(prism(EAST,BASE,100)));}
const holes=[];
// Blinde vensters 0,35 m diep; de boog wordt vereenvoudigd tot een printbare punt.
const win=(c,a,apo,w,z0,z1)=>niche(c,a,apo,0,w,Z(z0),Z(z1),.35);
for(const [y,w,z0,z1]of[[12,1.7,10.2,12.9],[7,1.2,10.9,12.2],[3.8,1.2,10.8,12.5],[-4.2,1.1,11,12.8],[-12.3,1.6,10.2,13.2],[-17.3,1.4,10.3,13.1]])holes.push(win([0,y],180,9.5,w,z0,z1));
holes.push(win([-10.45,-1],180,.4,1.35,10.8,12.8));
for(const x of [-3.6,1.5,6.5])holes.push(win([x,-20.1],270,.3,2.05,9.6,13.25));
for(const [x,w,z0,z1]of[[-1.5,1.6,9.6,11.5],[5.2,2.0,11.0,14.1]])holes.push(win([x,18.65],90,.1,w,z0,z1));
for(const y of [-8,-4,2,6]){const x=15.86-q*y;for(const [z0,z1]of[[9.0,11.4],[12.3,14.7]])holes.push(win([x,y],0,.15,1.5,z0,z1));}
// Binnenhof: vensters maken de vier overdekte vleugels ook van boven herkenbaar.
for(const y of [-6,0,6])holes.push(win([-3.46,y],0,.05,1.5,10.3,13.0));
for(const x of [-.5,3.1])holes.push(win([x,8.7],270,.05,1.5,10.4,13.5));
for(const x of [2.3,6.5])holes.push(win([x,-12.1],90,.1,1.5,10.4,13.5));
for(const y of [-6,1,6]){const x=7.1-q*y;holes.push(win([x,y],180,.1,1.4,10.5,13.4));}
// Grote entreepoort: 55 graden dakloze doorgang door de oostvleugel tot aan het hof.
const gateY=3.8,gateX=15.86-q*gateY;
holes.push(profileX([[gateY-1.25,BASE-1],[gateY+1.25,BASE-1],[gateY+1.25,Z(10.45)],[gateY,Z(12.3)],[gateY-1.25,Z(10.45)]],5,18));
let castle=Manifold.union(solids).subtract(Manifold.union(holes));
// Alleen de buitenhuid, geen verborgen nis achter een aansluitende vleugel.
castle=Manifold.union(castle.decompose().filter(p=>p.volume()>0));
const nodes=[['building:kasteel en donjonrest',castle]],all=castle,ATTRIBUTES={};
const META={name:'Kasteel Hernen',origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:[[0,0],[0,5],[0,-5]],groundHeight:52.06,replacesBuildings:['0296100000025272'],plate:false,
 description:'Hof op NAP +8,41 m als referentie; +X -10,9 graden in RD; vier afzonderlijke dakvleugels rond de BAG-binnenplaats, ronde zuidwesttoren, twee uitkragende arkeltorens, trapgevels, erker, kapellen, schoorstenen, nissen, printbare poort en lage donjonrest; details en spitsen uit RCE-foto geschat, geen verdwenen donjon gereconstrueerd.',
 realWorld:{groundNapM:GROUND_NAP,westRidgeNapM:19.65,northRidgeNapM:23.45,eastRidgeNapM:26.05,southRidgeNapM:20.65,roundTowerTopNapM:26.55},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/9318','https://commons.wikimedia.org/wiki/Category:Hernen_Castle','https://nl.wikipedia.org/wiki/Kasteel_Hernen','PDOK BAG 0296100000025272, Actueel_orthoHR, AHN DSM/DTM 0,5 m, 9 oktober 2026']};
// Alle nissen hebben hellende bovenkanten; geen uitzondering voor horizontale gewelven.
const OVERHANG_OK=()=>false;
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
