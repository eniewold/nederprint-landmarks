// ruine-van-brederode: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ruine-van-brederode");
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

const SLUG='ruine-van-brederode';
const ORIGIN=[102986,493334],X_AXIS=[.906307787,.422618262],WATER_NAP=4.1,BASE=-.8,Z=n=>n-WATER_NAP;
const circle=(c,r)=>Array.from({length:48},(_,i)=>[c[0]+r*Math.cos(i*2*Math.PI/48),c[1]+r*Math.sin(i*2*Math.PI/48)]);
const solids=[],cuts=[];
// Ruinemuren zijn eigen langsprofielen op planlijnen, geen gestapelde AHN-lagen.
const wall=(a,b,w,profile)=>{const len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI-90;return profileX([[0,BASE],[len,BASE],...profile.slice().reverse().map(([s,z])=>[s,Z(z)])],-w/2,w/2).rotate([0,0,ang]).translate([a[0],a[1],0]);};
solids.push(wall([-11.6,-12.5],[-11.6,12.8],1.6,[[0,7.8],[5,7.9],[9,7.8],[13,7.6],[17,8],[21,7.7],[23,14.8],[25.3,16.2]]));
solids.push(wall([-.4,-16.8],[-.4,9.3],1.3,[[0,7.5],[7,7.5],[14,7.6],[20,7.7],[24,7.4],[26.1,7.8]]));
solids.push(wall([-10.9,-16.8],[15.1,-16.8],1.7,[[0,7.3],[8,7.3],[16,7.4],[22,7.7],[26,7.7]]));
solids.push(wall([18.4,-13],[18.5,6.5],1.7,[[0,7.7],[8,7.9],[14,8.4],[16,9.7],[18,11.9],[19.5,11.9]]));
// Resten van de noordelijke ringmuur zijn bijna op hofniveau verdwenen.
solids.push(wall([-10.8,17.5],[13.8,17.7],1.4,[[0,6],[4,5.7],[10,5.6],[18,5.7],[24.6,6.2]]));
for(const y of[-11.8,-6.4,4.3])solids.push(prism(rect(-15,-11.2,y-.55,y+.55),BASE,Z(7.1)));
// Westelijke buitenmuur is verdwenen tussen de twee vierkante torens: geen fictieve ring.
const NW=rect(-19.8,-10.5,12.0,21.93),SW=rect(-19.63,-10.25,-22.05,-11.87),NE=rect(13.7,24.08,16.4,26.24);
const ncs=new CrossSection([ccw(NW)]);
solids.push(prism(NW,BASE,Z(9.1)),band(ncs,1.6,Z(9.05),Z(16.1)));
const scs=new CrossSection([ccw(SW)]);solids.push(band(scs,1.5,BASE,Z(7.8)));
const SE=[18.2,-17.18],rcs=new CrossSection([ccw(circle(SE,5.05))]);solids.push(band(rcs,1.7,BASE,Z(7.75)));
// Donjon met de aanwezige piramide binnen de gekanteelde borstwering.
solids.push(prism(NE,BASE,Z(21.6)),roofed(rect(15.05,22.75,17.75,24.9),[...ridgeU(18.9,Z(27.0),1.5),...ridgeV(21.3,Z(27.0),1.5)]));
const necs=new CrossSection([ccw(NE)]);solids.push(band(necs,1.0,Z(21.5),Z(21.9)));
for(const x of[14.55,18.9,23.2])for(const y of[16.9,25.74])solids.push(prism(rect(x-.75,x+.75,y-.5,y+.5),Z(21.8),Z(23.3)));
for(const y of[20,23])for(const x of[14.2,23.58])solids.push(prism(rect(x-.5,x+.5,y-.75,y+.75),Z(21.8),Z(23.3)));
// Ronde traptoren, met het rode spitse dak naast het grijze donjondak.
const ST=[13.75,18.4];solids.push(prism(circle(ST,1.7),BASE,Z(22.0)),loft([[Z(22),circle(ST,1.7)],[Z(27.15),tip(ST)]]));
// Open hoge poortzaal, met een lage huidige glazen afdekking tussen de resterende muren.
solids.push(prism(rect(13.1,19.4,10,16.6),BASE,Z(12.8)));
solids.push(wall([12.7,9.3],[12.7,16.8],1.2,[[0,20.4],[3,20.1],[6,20.8],[7.5,21.2]]));
solids.push(wall([19.0,8.3],[19.0,16.8],1.25,[[0,21.1],[2,22.1],[5,22.4],[8.5,23.0]]));
solids.push(wall([1.2,9.2],[19.5,9.2],1.4,[[0,14.4],[2,16.3],[8,16.5],[10.8,16.3],[12,20.4],[15,20.8],[18.3,22.0]]));
// Het lage poortdeel loopt naar de houten brug af; spitsboog blijft als doorgang zichtbaar.
solids.push(wall([18.8,5.4],[18.8,9.5],1.5,[[0,11.9],[1.2,13.0],[2.1,13.5],[3.2,20.5],[4.1,22.1]]));
cuts.push(profileX([[6.35,BASE-.1],[8.0,BASE-.1],[8.0,Z(9.2)],[7.175,Z(10.6)],[6.35,Z(9.2)]],17.6,20.1));
// Zichtbare brede openingen in de dakloze zaal en kapeltoren: steile bovenkanten.
for(const [y,lo,sh,w]of[[12,14.1,15.8,1.1],[12,17.8,19.1,1.1]])cuts.push(profileX([[y-w/2,Z(lo)],[y+w/2,Z(lo)],[y+w/2,Z(sh)],[y,Z(sh)+w*.8],[y-w/2,Z(sh)]],11.8,13.5));
for(const [ang,a,s,lo,sh,w]of[[0,19,12,14.2,15.8,1.1],[0,19,12,17.8,19.2,1.1],[270,-9.2,7,9.2,11.5,1.5],[270,-9.2,7,13.5,14.8,1.3],[180,19.8,-17,10.2,12.0,1.5]])cuts.push(niche([0,0],ang,a,s,w,Z(lo),Z(sh),.35));
// Donjonvensters: blinde rechthoekige nissen, niet het vooroorlogse vensterbeeld kopieren.
const rn=(a,x,y,w,lo,hi)=>prism(rect(x-.35,x+.35,y-w/2,y+w/2),Z(lo),Z(hi)).rotate([0,0,a]);
for(const [lo,hi]of[[7.8,9.6],[11.5,13.4],[15.8,17.7]]){for(const y of[19,23.4])cuts.push(rn(0,24.08,y,1.3,lo,hi));for(const x of[16.8,21])cuts.push(rn(90,26.24,-x,1.3,lo,hi));}
let castle=Manifold.union(solids).subtract(Manifold.union(cuts));castle=Manifold.union(castle.decompose().filter(s=>s.volume()>0));
// Het actuele BGT-voetpad, uitsluitend de binnenbrug. Vijf forse dragers en
// steile draagvlakken vervangen de onprintbare slanke houten balken/paaltjes.
const BRIDGE=[[36.93,7.64],[36.92,8.65],[19.61,7.57],[19.63,6.44]],top=x=>Z(7.9)-.047*(x-21);
let bridge=roofed(BRIDGE,[[-.047,0,Z(7.9)+.047*21]]);
for(const x of[21.6,25,28.4,31.8,35.2])bridge=bridge.subtract(profileX([[x-1.2,BASE-.1],[x+1.2,BASE-.1],[x+1.2,top(x)-2.1],[x,top(x)-.55],[x-1.2,top(x)-2.1]],-10,-5).rotate([0,0,-90]));
// Profiel staat langs X: na -90 graden wordt y van het profiel x, extrusie -y.
const strip=profileX([[19.5,top(19.5)-.5],[37,top(37)-.5],[37,Z(15)],[19.5,Z(15)]],-9,-6).rotate([0,0,-90]);
const deck=bridge.intersect(strip),structure=bridge.subtract(strip);
const nodes=[['building:ruine',castle],['building:houten toegangsbrug',structure],['road:voetpad',deck]],all=Manifold.union([castle,structure,deck]);
const ATTRIBUTES={'road:voetpad':{bgt_functie:'voetpad',bgt_fysiekvoorkomen:'open verharding'}};
const OVERHANG_OK=(z,p)=>[9.6,13.4,17.7].some(n=>Math.abs(z-Z(n))<1e-5&&p.every(q=>Math.abs(q[2]-z)<1e-5));
const META={name:'Ruïne van Brederode',origin:ORIGIN,xAxis:X_AXIS,groundHeight:47.04,groundSamplePoints:[[-24,0],[28,-12],[0,30]],replacesBuildings:['0453100000414917'],plate:true,
 description:'Huidige ruine met open hof, vier ongelijke hoektorens, donjon met piramidedak en kantelen, ronde traptoren, hoge poortzaal, lage muurprofielen en houten binnenbrug. Glasafdekking als massieve lage afdekking, vensters als 0,35 m nissen en brugdragers steil vereenvoudigd voor 1:1000; geen verdwenen westvleugel of daken gereconstrueerd.',
 realWorld:{waterNapM:WATER_NAP,donjonRoofNapM:27.0,stairTowerTopNapM:27.15,chapelWallNapM:16.1,lowTowersNapM:7.8,bridgeNapM:7.9},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/37110','https://www.ruinevanbrederode.nl/','https://commons.wikimedia.org/wiki/Category:Ru%C3%AFne_van_Brederode','PDOK BAG 0453100000414917, AHN DSM/DTM 0,5 m, Actueel_orthoHR, BGT voetpad G0453.40dd423ff9d05788e053cc1f0a0a3668, 9 oktober 2026']};



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
        "G0453.40dd424045625788e053cc1f0a0a3668",
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
