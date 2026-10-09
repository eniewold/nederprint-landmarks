// slot-zuylen: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "slot-zuylen");
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

const SLUG='slot-zuylen';
const ORIGIN=[133493,459926],X_AXIS=[.866025403784,.5],WATER_NAP=-.34,BASE=-.8,Z=n=>n-WATER_NAP;
// U-vormige BAG-voetafdruk: voorplein blijft volledig van het PDOK-terrein.
const OUTLINE=[[-16.83,10.67],[-16.87,9.27],[-15.79,8.18],[-15.06,8.18],[-14.97,-4.67],[-16.78,-4.74],[-16.81,-6.64],[-16.88,-11.22],[-10.29,-11.32],[-7.66,-11.36],[-7.53,-2.81],[-1.32,-2.87],[-1.33,-3.22],[3.37,-3.27],[3.37,-2.92],[9.62,-2.98],[9.64,-11.03],[13.7,-11.02],[17.76,-11.02],[17.75,-3.25],[16.45,-3.25],[16.35,9.72],[13.82,9.7],[13.8,12.29],[10.61,12.31],[10.61,14.15],[4.35,14.16],[4.36,13.47],[1.2,13.46],[1.21,9.7],[-13.4,9.68],[-13.36,10.55],[-14.34,11.72],[-15.81,11.74]];
const footprint=prism(OUTLINE,BASE,100);
const main=rect(-15,16.45,-3.3,9.72),west=rect(-16.9,-7.5,-11.4,9.72),east=rect(9.6,17.8,-11.1,9.72);
const solids=[
 roofed(main,[...ridgeV(4.9,Z(19.3),1.40),facet([-15,0],[-15,9.72],Z(13.0),1.45,[0,4.9]),facet([16.45,-3.3],[16.45,9.72],Z(12.95),1.45,[0,4.9]),[0,0,Z(19.3)]]).intersect(footprint),
 // Voorste dakstrook is vrijwel vlak (AHN +14,2..14,4), in tegenstelling
 // tot het steile achterdak. Foto 20225982 bevestigt: geen vijf dakkapellen.
 roofed(rect(-7.55,9.65,-3.3,1.45),[[0,.04,Z(14.35)]]).intersect(footprint),
 roofed(west,[...ridgeU(-11.1,Z(19.25),1.48),facet([-16.9,-11.3],[-7.5,-11.3],Z(13.0),1.48,[-11,0])]).intersect(footprint),
 roofed(east,[...ridgeU(13.1,Z(19.3),1.50),facet([9.6,-11.02],[17.8,-11.02],Z(13.0),1.48,[13.1,0])]).intersect(footprint),
 // Lage rechthoekige achteruitbouw met eigen schilddak en middenrisaliet.
 roofed([[1.2,9.65],[13.83,9.65],[13.8,12.29],[10.61,12.31],[10.61,14.15],[4.35,14.16],[4.36,13.47],[1.2,13.46]], [...ridgeU(7.15,Z(17.0),1.35),facet([1.2,13.46],[10.61,14.15],Z(12.7),1.55,[7.15,10]),[0,0,Z(17.0)]]),
];
const cuts=[];
// Achtkantige arkeltorens rusten op een steile kraag tegen de gevelhoeken.
const TOWERS=[{c:[-15.55,-10.45],size:3.1,eave:16.25,tip:23.6},{c:[16.15,-9.8],size:3.1,eave:16.3,tip:24.3},{c:[15.3,9.25],size:3.05,eave:16.35,tip:24.2},{c:[-15.15,9.95],size:3.2,eave:16.9,tip:21.2,bell:true}];
for(const T of TOWERS){
 const p=oct(T.c,T.size),small=oct(T.c,.9);
 if(T.bell)solids.push(prism(p,BASE,Z(T.eave)));
 else solids.push(loft([[Z(1.4),small],[Z(3.6),p],[Z(T.eave),p]]));
 if(T.bell){
  // Klokdak als enkele gelede kap, geen AHN-hoogtestapeling; pinakel verdikt tot 0,9 m.
  solids.push(loft([[Z(16.8),oct(T.c,3.2)],[Z(17.8),oct(T.c,2.5)],[Z(19.4),oct(T.c,1.8)],[Z(20.0),oct(T.c,.9)],[Z(21.2),tip(T.c)]]));
 }else solids.push(loft([[Z(T.eave-.05),p],[Z(T.tip),tip(T.c)]]));
 for(const a of[0,45,90,180,270])for(const [lo,hi]of[[4.2,6.0],[8.0,9.6],[12.1,13.3]])cuts.push(niche(T.c,a,T.size/2-.01,0,.95,Z(lo),Z(hi),.35));
}
// Terras aan de zuidwestgevel: gesloten onderbouw, drie treden naar het water.
solids.push(prism(rect(-20.0,-14.95,-7.0,7.4),BASE,Z(1.55)));
for(const [x,h]of[[-21.2,.1],[-20.8,.6],[-20.4,1.1]])solids.push(prism(rect(x,-19.9,-5.5,-2.8),BASE,Z(h)));
// Dakkapellen: voorste zijvleugels, twee per buitenzijgevel, drie achter.
for(const [x,y]of[[-12.3,-10.9],[13.25,-10.65]])solids.push(roofed(rect(x-.8,x+.8,y,y+2),ridgeU(x,Z(17.0),1.2)).intersect(footprint));
for(const y of[-4.8,3.3])solids.push(roofed(rect(-15.1,-13.2,y-.75,y+.75),ridgeV(y,Z(16.6),1.25)).intersect(footprint));
for(const y of[-4.8,3.3])solids.push(roofed(rect(14.7,16.45,y-.75,y+.75),ridgeV(y,Z(16.6),1.25)).intersect(footprint));
for(const x of[-8.5,-.5])solids.push(roofed(rect(x-.75,x+.75,7.7,9.72),ridgeU(x,Z(16.2),1.25)).intersect(footprint));
solids.push(roofed(rect(11.65,13.4,10.2,12.8),ridgeU(12.5,Z(15.6),1.25)).intersect(footprint));
// Vier schoorstenen, de grote voorzien van een schuin gedragen dekplaat en kap.
for(const [x,y,h,w]of[[-4.5,5.3,22.5,1.3],[-11.2,-7.5,21.35,1.2],[13.0,-7.3,21.4,1.2],[7.2,11.3,20.1,1.35]]){
 solids.push(prism(rect(x-w/2,x+w/2,y-.55,y+.55),BASE,Z(h-.8)),loft([[Z(h-.95),rect(x-w/2,x+w/2,y-.55,y+.55)],[Z(h-.55),rect(x-w/2-.2,x+w/2+.2,y-.75,y+.75)],[Z(h),tip([x,y])]]));
}
// Omgaande gootlijsten op schuine kragen, tot de buitengevels beperkt.
solids.push(loft([[Z(13.2),rect(-7.3,9.4,-2.70,-2.3)],[Z(14.1),rect(-7.3,9.4,-3.38,-2.3)]]));
solids.push(loft([[Z(12.4),rect(-14.8,-14.4,-7.4,7.7)],[Z(13.0),rect(-15.15,-14.4,-7.4,7.7)]]));
solids.push(loft([[Z(12.2),rect(15.7,16.2,-7.3,7.6)],[Z(12.95),rect(15.7,16.68,-7.3,7.6)]]));
solids.push(loft([[Z(11.4),rect(-13.35,1.15,9.2,9.45)],[Z(12.1),rect(-13.35,1.15,9.2,9.93)]]));
// Klassieke deurpartij in middenrisaliet, twee pilasters en schuin gedragen bovenblok.
for(const x of[-.45,2.45])solids.push(prism(rect(x-.45,x+.45,-3.52,-2.86),BASE,Z(6.3)));
solids.push(loft([[Z(6.0),rect(-1.05,3.05,-3.2,-2.8)],[Z(6.6),rect(-1.05,3.05,-3.64,-2.8)]]));
cuts.push(niche([1,-3.22],270,0,0,2.0,Z(1.4),Z(5.4),.35));
const rn=(a,x,y,w,lo,hi)=>prism(rect(x-.35,x+.35,y-w/2,y+w/2),Z(lo),Z(hi)).rotate([0,0,a]);
for(const [lo,hi]of[[3.3,6.5],[8.0,11.2]]){
 for(const x of[-6,-2.5,1,4.5,8])if(x!==1||lo>6)cuts.push(rn(270,2.87,x,1.6,lo,hi));
 for(const x of[-12.2,13.35])cuts.push(rn(270,11.25,x,1.8,lo,hi));
 for(const y of[-6,-.5,4.9])cuts.push(rn(180,14.97,-y,1.9,lo,hi),rn(0,16.40,y,1.9,lo,hi));
 for(const x of[-11,-6.7,-2.4])cuts.push(rn(90,9.68,-x,1.8,lo,hi));
 for(const x of[3.1,5.6,8.15,10.7])cuts.push(rn(90,x<4.35?13.46:14.16,-x,1.6,lo,hi));
 cuts.push(rn(0,13.8,11.1,1.4,lo,hi),rn(180,-1.2,-11.1,1.4,lo,hi));
 cuts.push(rn(0,-7.6,-7.0,1.6,lo,hi),rn(180,-9.62,7.0,1.6,lo,hi));
}
for(const x of[-6,-2.5,4.5,8])cuts.push(rn(270,2.87,x,1.0,.3,1.3));
// Blinde nissen die door de overlappende torenromp geheel opgesloten raken
// leveren geen onzichtbare luchtkamers op in het printvolume.
const castle=Manifold.union(Manifold.union(solids).subtract(Manifold.union(cuts)).decompose().filter(p=>p.volume()>0));
// Driebogenbrug uit de volledige actuele BGT-dekcontour, los van het voorplein.
const BP=[[31.01,-31.57],[30.74,-27.68],[22.09,-29.3],[21.78,-29.16],[21.62,-28.95],[21.52,-28.7],[21.32,-27.61],[20.9,-27.69],[21,-28.57],[21.91,-33.49],[22.14,-34.85],[22.59,-34.78],[22.4,-33.9],[22.41,-33.63],[22.5,-33.51],[22.79,-33.3]];
// Wegprofiel helt van de kruin naar beide landhoofden; boogtoppen >=55 graden.
const center=[25.9,-30.7],ca=Math.cos(10.5*Math.PI/180),sa=Math.sin(10.5*Math.PI/180);
const B=(s,t)=>[center[0]+ca*s-sa*t,center[1]+sa*s+ca*t];
const bx=([x,y])=>(x-center[0])*ca+(y-center[1])*sa;
const btop=s=>Z(1.7)-.018*Math.abs(s);
let bridge=roofed(BP,[[-.018*ca,-.018*sa,Z(1.7)+.018*(center[0]*ca+center[1]*sa)],[.018*ca,.018*sa,Z(1.7)-.018*(center[0]*ca+center[1]*sa)]]);
for(const s of[-2.95,0,2.95])bridge=bridge.subtract(profileX([[s-1,BASE-.1],[s+1,BASE-.1],[s+1,Z(-.78)],[s,Z(.68)],[s-1,Z(-.78)]],-4,4).rotate([0,0,-79.5]).translate([...center,0]));
const strips=[[-8,0],[0,8]].map(([a,b])=>profileX([[a,btop(a)-.5],[b,btop(b)-.5],[b,Z(8)],[a,Z(8)]],-5,5).rotate([0,0,-79.5]).translate([...center,0]));
const strip=Manifold.union(strips),deck=bridge.intersect(strip),structure=bridge.subtract(strip);
const nodes=[['building:slot',castle],['building:brugdragers',structure],['road:erfbrug',deck]],all=Manifold.union(nodes.map(([,s])=>s));
// BGT labelt het brugdek als onbegroeid terrein 'gesloten verharding'
// G1904.7f655726ff004a20befa6c61e393623a op hoogteligging 1, geen wegdeel.
const ATTRIBUTES={'road:erfbrug':{bgt_fysiekvoorkomen:'gesloten verharding'}};
const OVERHANG_OK=(z,p)=>[6.5,11.2,1.3].some(n=>Math.abs(z-Z(n))<1e-5&&p.every(q=>Math.abs(q[2]-z)<1e-5));
const META={name:'Slot Zuylen',origin:ORIGIN,xAxis:X_AXIS,groundHeight:42.936,groundSamplePoints:[[-25,0],[24,0],[0,22]],replacesBuildings:['0333100000015736'],plate:true,
 description:'U-vormig slot rond open voorplein met drie afzonderlijke schilddaken, lage achteruitbouw en terras, drie achtkantige arkeltorens met steile spits en westtoren met klokdak, dakkapellen, vier schoorstenen, gootlijsten en klassieke deurpartij. Stenen driebogenbrug heeft eigen 0,5 m dek met gesloten verharding met actuele BGT-classificatie; oorspronkelijke ronde bogen zijn printbare spitsbogen.',
 realWorld:{waterNapM:WATER_NAP,mainRidgeNapM:19.3,westRidgeNapM:19.25,eastRidgeNapM:19.3,annexRidgeNapM:17.0,bellTowerTopNapM:21.2,spireTowerTopNapM:24.3,bridgeCrownNapM:1.7,terraceNapM:1.55},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/519611','https://monumentenregister.cultureelerfgoed.nl/monumenten/519615','https://commons.wikimedia.org/wiki/Category:Slot_Zuylen_(exterior)','PDOK BAG 0333100000015736, AHN DSM/DTM 0,5 m, Actueel_orthoHR, BGT overbruggingsdeel G1904.7bcb115ebc064389a13bd207b3c72e96 en onbegroeidterreindeel G1904.7f655726ff004a20befa6c61e393623a gesloten verharding, 9 oktober 2026']};
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
        "G1904.7bcb115ebc064389a13bd207b3c72e96",
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
