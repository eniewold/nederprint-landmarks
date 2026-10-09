// kasteel-valkenburg: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-valkenburg");
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

const SLUG='kasteel-valkenburg';
const ORIGIN=[186235,319219],X_AXIS=[1,0],GROUND_NAP=100.3,BASE=-15,Z=n=>n-GROUND_NAP;
// Muurvakken met afzonderlijke planlijnen en een gemeten langsprofiel; geen hoogtelagen.
const WALLS=[["kapel-noord",[-10,21],[2,29],2.2,[[0,110.12],[2.404,104.86],[4.807,104.68],[7.211,105.33],[9.615,103.45],[12.019,102.88],[14.422,104.1]]],["kapel-oost",[2,29],[11,20],1.8,[[0,103.43],[2.121,104.87],[4.243,105.45],[6.364,105.76],[8.485,107.05],[10.607,105.82],[12.728,105.76]]],["kapel-zuid",[11,20],[1,12],1.8,[[0,106.73],[2.134,104.93],[4.269,102.23],[6.403,103.11],[8.537,104.85],[10.672,103.95],[12.806,106.97]]],["hoofdwest-noord",[-10,21],[1,9],3,[[0,110.22],[2.326,110.14],[4.651,108.93],[6.977,106.92],[9.302,107.13],[11.628,108.37],[13.953,109.32],[16.279,112.71]]],["hoofdwest-midden",[1,9],[10,-3],3,[[0,112.71],[2.143,112.58],[4.286,112.47],[6.429,112.75],[8.571,112.66],[10.714,112.31],[12.857,112.16],[15,111.36]]],["hoofdwest-zuid",[10,-3],[25,-22],2.5,[[0,109.53],[2.421,108.33],[4.841,110.46],[7.262,106.31],[9.683,106.69],[12.104,106.48],[14.524,106.74],[16.945,107.59],[19.366,105.92],[21.787,106.71],[24.207,105.69]]],["hoofdoost-noord",[11,20],[17,8],1.8,[[0,106.37],[2.236,107.49],[4.472,104.06],[6.708,101.24],[8.944,101.16],[11.18,100.57],[13.416,99.56]]],["hoofdoost-midden",[17,8],[24,-6],1.8,[[0,99.56],[2.236,99.55],[4.472,99.58],[6.708,99.6],[8.944,99.64],[11.18,99.58],[13.416,99.55],[15.652,99.55]]],["hoofdoost-zuid",[24,-6],[30,-21],1.8,[[0,99.55],[2.308,99.57],[4.616,99.61],[6.924,99.65],[9.232,99.58],[11.54,99.86],[13.848,104.18],[16.155,103.82]]],["hoofd-zuid",[30,-21],[25,-22],2,[[0,104.07],[1.7,104.45],[3.399,105.61],[5.099,106.61]]],["zaal-noord",[1,9],[17,8],1.8,[[0,112.71],[2.29,110.95],[4.58,105.61],[6.871,106.07],[9.161,107.86],[11.451,106.77],[13.741,99.58],[16.031,99.56]]],["zaal-deling",[10,-3],[24,-6],1.3,[[0,110.43],[2.386,100.82],[4.773,99.62],[7.159,99.58],[9.545,99.6],[11.932,99.57],[14.318,99.54]]],["lagezaal-noord",[-17,-10],[9,-3],1.4,[[0,100.11],[2.448,101.26],[4.896,101.8],[7.343,101.61],[9.791,101.47],[12.239,100.99],[14.687,100.98],[17.135,100.98],[19.582,100.94],[22.03,101.15],[24.478,102.78],[26.926,111.95]]],["lagezaal-west",[-17,-10],[-17,-30],1.4,[[0,100.11],[2.222,100.14],[4.444,100.23],[6.667,100.37],[8.889,101.45],[11.111,103.82],[13.333,104.08],[15.556,104.59],[17.778,105.03],[20,104.64]]],["lagezaal-zuid",[-17,-30],[4,-31],1.5,[[0,104.45],[2.336,103.28],[4.672,103.91],[7.008,103.9],[9.344,104.16],[11.68,104.32],[14.016,103.59],[16.352,103.21],[18.688,102.41],[21.024,104.45]]],["toren-west",[-3,-15],[-6,-26],2.2,[[0,104.2],[2.28,104.03],[4.561,102.32],[6.841,101.87],[9.121,102.38],[11.402,103.37]]],["toren-oost",[8,-13],[12,-22],2.2,[[0,102.35],[2.462,102.01],[4.924,102.99],[7.387,104.22],[9.849,104.26]]],["toren-noord",[-3,-15],[8,-13],1.8,[[0,104.2],[2.236,103.9],[4.472,103.83],[6.708,103.69],[8.944,103.19],[11.18,102]]],["toren-zuid",[-6,-26],[12,-22],1.8,[[0,102.83],[2.305,102.15],[4.61,103.75],[6.915,103.28],[9.22,103.26],[11.524,104.29],[13.829,102.99],[16.134,103.21],[18.439,104.27]]],["zuid-buiten",[-17,-30],[-4,-39],1.8,[[0,104.45],[2.259,103.28],[4.518,103.34],[6.776,103.53],[9.035,103.75],[11.294,103.95],[13.553,103.99],[15.811,103.88]]],["zuid-buiten2",[-4,-39],[26,-29],2,[[0,103.9],[2.433,104.08],[4.865,102.36],[7.298,101.78],[9.73,102.19],[12.163,103.53],[14.595,103.59],[17.028,103.68],[19.46,104.12],[21.893,104.07],[24.325,104.23],[26.758,104.23],[29.19,104.15],[31.623,104.11]]],["zuid-buiten3",[26,-29],[30,-21],1.8,[[0,104.11],[2.236,103.99],[4.472,103.55],[6.708,104.12],[8.944,104]]],["zuid-binnen",[4,-31],[26,-24],1.6,[[0,104.6],[2.309,105.95],[4.617,105.9],[6.926,106],[9.235,106.4],[11.543,106.43],[13.852,105.45],[16.161,105.17],[18.469,105.27],[20.778,105.33],[23.087,105.47]]]];
const solids=[],cuts=[];
const wall=(a,b,w,profile)=>{
 const angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI-90,len=Math.hypot(b[0]-a[0],b[1]-a[1]);
 return profileX([[0,BASE],[len,BASE],...profile.slice().reverse().map(([s,z])=>[s,Z(z)])],-w/2,w/2).rotate([0,0,angle]).translate([a[0],a[1],0]);
};
for(const [name,a,b,w,profile]of WALLS)solids.push(wall(a,b,w,profile));
// Openingen in kapel en grote zaal: doorlopende steile spitsbogen op fotoposities.
const opening=(name,s,width,lo,shoulder)=>{
 const row=WALLS.find(r=>r[0]===name),a=row[1],b=row[2],ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI-90;
 cuts.push(profileX([[s-width/2,Z(lo)],[s+width/2,Z(lo)],[s+width/2,Z(shoulder)],[s,Z(shoulder+width*.8)],[s-width/2,Z(shoulder)]],-row[3]/2-.1,row[3]/2+.1).rotate([0,0,ang]).translate([a[0],a[1],0]));
};
opening('hoofdwest-noord',7,2.1,100.2,103.3);
opening('hoofdwest-midden',6,2.3,106.0,109.0);
opening('hoofdwest-zuid',7.2,2,100.1,103.4);
opening('hoofdwest-zuid',12,1.7,105,107.4);
opening('kapel-noord',8,1.7,103.5,106.3);
opening('kapel-oost',5,1.7,100,102.5);
// Lage donjonresten, cirkelvormig fundament in het zuidelijke complex.
const circle=(c,r,n=40)=>Array.from({length:n},(_,i)=>[c[0]+r*Math.cos(i*2*Math.PI/n),c[1]+r*Math.sin(i*2*Math.PI/n)]);
const round=prism(circle([7.9,-23.9],4.3),BASE,Z(104.5)).subtract(prism(circle([7.9,-23.9],2.8),BASE-.1,Z(104.6)));
solids.push(round);
// Noordelijke bastionrest: brede halve ronding, open naar de binnenplaats.
const north=prism(circle([-3,43.7],8.2),BASE,Z(100.2)).subtract(prism(circle([-3,43.7],6.6),BASE-.1,Z(100.3))).intersect(prism(rect(-15,8,43.7,55),BASE,100));
solids.push(north,wall([-11.2,43.7],[-13,31],1.6,[[0,100.2],[5,99.8],[12.83,101.8]]),wall([5.2,43.7],[15,29],1.6,[[0,100.2],[8,99.4],[17.67,99.6]]));
// Versterkte dwingel aan de oostzijde: variabel lager muurprofiel op de helling.
for(const [a,b,h0,h1]of[[[15,29],[26,12],98.5,97.8],[[26,12],[38,-11],97.8,96.8],[[38,-11],[40,-31],96.8,97.2],[[40,-31],[24,-43],97.2,97.5],[[24,-43],[-23,-49],97.5,95.6]])solids.push(wall(a,b,1.5,[[0,h0],[Math.hypot(b[0]-a[0],b[1]-a[1]),h1]]));
// Foto-afgeleide steunberen en terugliggende verticale sleuven, geen generieke blanco muren.
for(const [x,y,ang,top]of[[0,10,42,110.4],[7,1,42,111.8],[12,-5,42,109.4],[-7,20,42,108.3]])solids.push(buttress([x,y],ang,1.3,1.3,Z(top),Z(top-3)));
const castle=Manifold.union(solids).subtract(Manifold.union(cuts));
const nodes=[['building:ruïnemuren, kapel en dwingel',castle]],all=castle,ATTRIBUTES={};
const META={name:'Kasteelruïne Valkenburg',plate:true,origin:ORIGIN,xAxis:X_AXIS,groundHeight:145.76,groundSamplePoints:[[-15,10],[-17,3],[-18,-8]],replacesBuildings:[],
 description:'Bewaarde ruïnemuurvakken en kapel op het PDOK-heuvelplateau, met gemeten onregelmatige muurprofielen, steile openingen, donjonfundament en lagere dwingel. Geen dak of volledig kasteel gereconstrueerd; heuvel blijft PDOK-terrein. Planlijnen, erosieprofielen en openingposities vereenvoudigd voor 1:1000.',
 realWorld:{groundNapM:GROUND_NAP,highestWallNapM:112.75,minimumWallThicknessM:1.3},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/36769','https://www.kasteelvalkenburg.nl/ontdek-onze-locaties/kasteelruine/','https://commons.wikimedia.org/wiki/Category:Valkenburg_Castle','PDOK AHN DSM/DTM 0,5 m, Actueel_orthoHR, BAG en 3D Basisvoorziening; 9 oktober 2026']};
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
