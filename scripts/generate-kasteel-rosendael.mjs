// kasteel-rosendael: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-rosendael");
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

const SLUG='kasteel-rosendael';
const ORIGIN=[194570,446941],ANGLE=-11.67*Math.PI/180,X_AXIS=[Math.cos(ANGLE),Math.sin(ANGLE)];
// PDOK-water 80,36 minus lokale mediaan PDOK/AHN 43,505; water zonder AHN-retour.
const WATER_NAP=36.86,BASE=-.8,Z=n=>n-WATER_NAP;
const solids=[],cutters=[],tower=[-14.79,-13.43];
// BAG 0277100000000922; hoofdgebouw is een L, geen volledig vierkant.
const MAIN=rect(-3.15,12.47,-14.39,3.86),LINK=rect(-12.01,-3.1,-14.39,-5.74);
function capped(p,cap,eave,slope){const cs=new CrossSection([ccw(p)]),bounds=cs.bounds();return roofed(p,[...p.map((q,i)=>facet(q,p[(i+1)%p.length],Z(eave),slope,[(bounds.min[0]+bounds.max[0])/2,(bounds.min[1]+bounds.max[1])/2])),[0,0,Z(cap)]]);}
solids.push(capped(MAIN,53.95,51.6,1.28),capped(LINK,53.95,51.6,1.28));
// Lage noordvleugel: twee lengtedaken met lager verbindingsdal.
solids.push(roofed(rect(-2.86,4.4,3.8,33.58),[...ridgeU(.8,Z(48.45),1.28),facet([-2.86,33.58],[4.4,33.58],Z(43.85),1.28,[1,20])]));
solids.push(roofed([[4.4,3.8],[12.1,3.8],[12.1,13.92],[14.75,13.92],[14.75,33.58],[4.4,33.58]],[...ridgeU(9.55,Z(48.3),1.27),facet([4.4,33.58],[14.75,33.58],Z(43.85),1.27,[10,20])]));
// Ronde donjon: cilinderwand, conische kap, achthoekige balustrade/lantaarn en koepel.
const circle=(c,r,n=48)=>Array.from({length:n},(_,i)=>[c[0]+r*Math.cos(i*2*Math.PI/n),c[1]+r*Math.sin(i*2*Math.PI/n)]);
solids.push(prism(circle(tower,8.04),BASE,Z(55.85)));
solids.push(loft([[Z(55.8),circle(tower,8.04)],[Z(58.3),oct(tower,9.5)]]));
const bal=new CrossSection([oct(tower,9.5)]);
solids.push(band(bal,.9,Z(58.25),Z(59.25)),prism(oct(tower,4.8),Z(58.25),Z(61.8)));
solids.push(loft([[Z(61.75),oct(tower,4.8)],[Z(63.4),oct(tower,3.6)],[Z(64.8),tip(tower)]]));
// Noordelijke torenschoorsteen en het resterende gemak: vaste bouwdelen.
solids.push(pinnacle([-14.9,-8.2],.55,Z(56.2),6.2,.45));
solids.push(prism([[-22.2,-8.2],[-20.9,-5.1],[-18.1,-5.2],[-19.2,-9.0]],BASE,Z(45.0)));
// Vijf gemeten hoofdschoorstenen.
for(const [x,y,h]of[[-1.1,1.8,55.4],[10.0,1.8,55.6],[-1.1,-12.0,55.4],[10.0,-12,55.4],[4.8,-5,55.2]])
 solids.push(pinnacle([x,y],.55,Z(51.4),h-51.4,.15));
// Klokkentorentje op de noordvleugel; door bomen afgeschermde opstand uit foto's.
solids.push(prism(rect(8.25,10.75,20.6,23.1),BASE,Z(51.15)),loft([[Z(51.1),rect(8.25,10.75,20.6,23.1)],[Z(54.05),tip([9.5,21.85])]]));
// Ingangsfronton in de oostgevel, twee pilasters en gedragen stenen bordes/trap.
solids.push(profileX([[-3.15,BASE],[3.15,BASE],[3.15,Z(51.55)],[0,Z(54.0)],[-3.15,Z(51.55)]],12.1,13.05).translate([0,-5.2,0]));
for(const y of[-6.9,-3.5])solids.push(prism(rect(12.35,13.15,y-.45,y+.45),BASE,Z(46.6)));
solids.push(prism(rect(12.4,15.4,-8.3,-2.1),BASE,Z(40.1)));
for(let i=0;i<4;i++)solids.push(prism(rect(15.3+i*.55,15.92+i*.55,-8.3,-2.1),BASE,Z(40.1-(i+1)*.38)));
// Veranda heeft vaste consoles/kolommen; het glasdak loopt voor print naar de gevel.
for(const y of[5.1,7.1,9.1,11.1,13.1])solids.push(prism(rect(13.6,14.5,y-.45,y+.45),BASE,Z(43.0)));
solids.push(roofed(rect(12.05,14.5,3.85,13.9),[[-.55,0,Z(51.25)]]).intersect(prism(rect(12.05,14.5,3.85,13.9),BASE,Z(44.1))));
for(const y of[6.1,8.1,10.1,12.1])cutters.push(profileX([[y-.55,Z(40.2)],[y+.55,Z(40.2)],[y+.55,Z(42.1)],[y,Z(42.9)],[y-.55,Z(42.1)]],12.48,14.6));
// Nissen met slechts 0,35 m diepte; traveeën volgen foto's (roeden/persiennes vervallen).
const rectNiche=(angle,a,s,w,z0,z1,c=[0,0])=>prism(rect(a-.35,a+.3,s-w/2,s+w/2),Z(z0),Z(z1)).rotate([0,0,angle]).translate([c[0],c[1],0]);
const rows=[[37.7,39.15],[40.2,43.7],[45.1,48.6],[49.6,51.0]];
for(const [lo,hi]of rows){
 for(const y of[-12.5,-8.9,-5.3,-1.7,1.9])cutters.push(rectNiche(0,12.47,y,1.65,lo,hi));
 for(const x of[-1.55,1.55,4.7,7.85,11])cutters.push(rectNiche(90,14.39,-x,1.65,lo,hi));
 for(const y of[-12.4,-8.6,-1.7,1.7])cutters.push(rectNiche(180,3.15,-y,1.6,lo,hi));
 for(const x of[-1.5,1.65,4.8,7.95,11.1])if(lo>49)cutters.push(rectNiche(-90,3.86,x,1.6,lo,hi));
}
for(const phi of[-135,-90,-45,5,70,130,175])for(const [lo,hi]of[[38.0,39.3],[41.1,44.3],[46.1,50.4]])cutters.push(rectNiche(phi,8.03,0,1.8,lo,hi,tower));
for(let phi=0;phi<360;phi+=45)cutters.push(rectNiche(phi,2.4,0,1.4,59.6,61.4,tower));
for(const [lo,hi]of[[37.6,39.1],[40.3,43.4]])for(const y of[6.4,10.2,14.2,18.2,22.2,26.2,30.2])cutters.push(rectNiche(180,2.86,-y,1.8,lo,hi),rectNiche(0,y<14?12.1:14.75,y,1.8,lo,hi));
// Kapellen op de vier gevels van het hoofdgebouw, alle binnen de wandvoet.
function dormer(c,w,angle,top){const p=rect(c[0]-w/2,c[0]+w/2,c[1]-1,c[1]+1),planes=angle===0?ridgeU(c[0],Z(top),1.25):ridgeV(c[1],Z(top),1.25);solids.push(roofed(p,planes).intersect(prism(MAIN,BASE,100)));}
dormer([11.4,-5.2],2,0,54.75);dormer([4.5,-13.5],1.9,90,54.8);dormer([-2.25,-2.1],1.8,0,54.7);dormer([5,2.9],1.8,90,54.7);
const shell=Manifold.union(solids).subtract(Manifold.union(cutters));
const castle=Manifold.union(shell.decompose().filter(s=>s.volume()>0));
const nodes=[['building:kasteel, donjon en noordvleugel',castle]],all=castle,ATTRIBUTES={};
const OVERHANG_OK=(z,p)=>[39.15,43.7,48.6,51,39.3,44.3,50.4,39.1,43.4,61.4].some(n=>Math.abs(z-Z(n))<1e-5&&p.every(q=>Math.abs(q[2]-z)<1e-5));
const META={name:'Kasteel Rosendael',origin:ORIGIN,xAxis:X_AXIS,groundHeight:80.36,groundSamplePoints:[[-25,-13],[0,-25],[-7,10]],replacesBuildings:['0277100000000922'],
description:'Donjon en L-vormig hoofdgebouw met afzonderlijke dakvlakken, lagere noordvleugel, klokkentorentje, huidige achthoekige lichtlantaarn, nissen, ingangstrap en vereenvoudigde veranda. Waterreferentie NAP 36,86 m afgeleid van PDOK minus lokale AHN-offset; noordelijk dakeinde en fijne geveldetails uit fotos geschat; veranda-openingen versmald met puntige printgewelven en fijne metalen elementen weggelaten.',
realWorld:{waterNapM:WATER_NAP,eaveNapM:51.6,mainRoofNapM:53.95,towerWallNapM:55.85,towerTopNapM:64.8,northRoofNapM:48.45},sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/528472','https://commons.wikimedia.org/wiki/Category:Kasteel_Rosendael','PDOK BAG 0277100000000922, AHN DSM/DTM 0,5 m, Actueel_orthoHR en BGT, 9 oktober 2026']};

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
