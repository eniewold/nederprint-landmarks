// slot-assumburg: bouwdelen en dakvlakken in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "slot-assumburg");
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

const SLUG='slot-assumburg';
const ORIGIN=[107334,502168],X_AXIS=[.802817475,.596224875],WATER_NAP=-.95,BASE=-.8,Z=n=>n-WATER_NAP;
const WEST=rect(-12.05,-1.77,-14.74,10.7),NORTH=rect(-11.1,15.94,3.41,10.7),EAST=rect(6.17,15.94,-14.74,10.7),SOUTH=rect(-8.5,13.27,-14.74,-9.18);
const solids=[roofed(WEST,ridgeU(-8.0,Z(16.9),1.40)),roofed(NORTH,ridgeV(7.05,Z(14.5),1.43)),roofed(EAST,ridgeU(11.7,Z(14.5),1.47)),roofed(SOUTH,ridgeV(-11.96,Z(12.6),1.45))],cuts=[];
const NW=rect(-14.91,-7.21,6.67,13.62),SW=rect(-11.94,-5.05,-14.74,-7.9);
// Twee vierkante torens: het kleinere piramidedak ligt achter een hoge borstwering.
for(const [p,c,h,r]of[[NW,[-11.06,10.15],16.9,21.1],[SW,[-8.5,-11.3],17.35,24.4]]){
 const cs=new CrossSection([ccw(p)]),inner=cs.offset(-1.0,'Miter').toPolygons()[0];
 solids.push(prism(p,BASE,Z(h-.55)),band(cs,.9,Z(h-.6),Z(h)),loft([[Z(h-.6),inner],[Z(r),tip(c)]]));
 // Het kleine blinde rondboogfries krijgt puntige, 0,35 m diepe nissen.
 const bb=p.reduce((b,[x,y])=>[Math.min(b[0],x),Math.max(b[1],x),Math.min(b[2],y),Math.max(b[3],y)],[Infinity,-Infinity,Infinity,-Infinity]);
 for(const x of[bb[0]+1.4,(bb[0]+bb[1])/2,bb[1]-1.4])for(const [y,a]of[[bb[2],270],[bb[3],90]])cuts.push(niche([x,y],a,0,0,.95,Z(h-1.5),Z(h-.9),.35));
 for(const y of[bb[2]+1.3,(bb[2]+bb[3])/2,bb[3]-1.3])for(const [x,a]of[[bb[0],180],[bb[1],0]])cuts.push(niche([x,y],a,0,0,.95,Z(h-1.5),Z(h-.9),.35));
}
// Achtzijdige noordoosttoren uit de BAG-achtkant; tentdak in acht vlakken.
const OC=[16.0,9.85],OP=[[12.31,10.7],[14.62,13.33],[17.5,13.28],[19.62,11.05],[19.54,8.15],[17.45,6.11],[15.94,6.07],[13.27,6.5]];
solids.push(prism(OP,BASE,Z(15.75)),loft([[Z(15.65),OP],[Z(21.35),tip(OC)]]));
// Traptorens aan de binnenhoek en achter de zuidwestelijke donjon.
const ST1=[-9.9,4.9],ST2=[-14.6,-15.2];
solids.push(prism(rect(-11.45,-8.35,3.35,6.7),BASE,Z(18.3)),loft([[Z(18.2),rect(-11.45,-8.35,3.35,6.7)],[Z(23.9),tip(ST1)]]));
solids.push(prism(oct(ST2,3.2),BASE,Z(17.3)),loft([[Z(17.2),oct(ST2,3.2)],[Z(22.8),tip(ST2)]]));
solids.push(prism([[-11.94,-12.67],[-15.9,-13.55],[-16.57,-15.41],[-15.3,-16.96],[-13.35,-16.67],[-12.58,-14.72]],BASE,Z(17.3)));
// Uitstekende westelijke kapelgevel, ondersteund door het gevelvlak zelf.
solids.push(roofed(rect(-15.43,-11.8,-5.89,-1.52),ridgeV(-3.7,Z(20.8),1.25)));
// Hoge schoorsteen-/klokgevel op de zuidwesttoren; gesloten spitsnissen.
solids.push(profileX([[-1.3,BASE],[1.3,BASE],[1.3,Z(22.1)],[0,Z(23.7)],[-1.3,Z(22.1)]],-.45,.45).rotate([0,0,90]).translate([-8.5,-14.3,0]));
// Galerie tegen westelijke hofgevel; massief tot NAP +5,2, blinde spitsbogen.
solids.push(prism(rect(-3.55,-1.7,-9.2,3.45),BASE,Z(5.2)));
for(const y of[-7.3,-4.4,-1.5,1.4])cuts.push(niche([-1.7,y],0,0,0,1.7,Z(1.8),Z(3.0),.35));
// Dakkapellen, ieder vanaf de voet gedragen en tot de vleugelcontour beperkt.
for(const [x,w]of[[-4.8,1.2],[1.9,1.8],[8.6,1.2]])solids.push(roofed(rect(x-w/2,x+w/2,8.5,10.75),ridgeU(x,Z(12.6),1.25)).intersect(prism(NORTH,BASE,100)));
for(const x of[-.8,7.3])solids.push(roofed(rect(x-.7,x+.7,-14.75,-12.9),ridgeU(x,Z(11.9),1.3)).intersect(prism(SOUTH,BASE,100)));
for(const y of[-5.8,1.4])solids.push(roofed(rect(13.6,15.95,y-.65,y+.65),ridgeV(y,Z(12.7),1.3)).intersect(prism(EAST,BASE,100)));
for(const y of[-9,-.2])solids.push(roofed(rect(-12.1,-10.2,y-.65,y+.65),ridgeV(y,Z(14.7),1.3)).intersect(prism(WEST,BASE,100)));
for(const [x,y,w,d,h]of[[13.45,11.2,1.0,1.1,19.8],[18.3,9.2,.95,1.1,19.5],[-12.1,10.3,1.2,1.2,21.1],[-6.1,-10.0,1.2,1.1,22.7],[-8.0,0,1.0,1.2,19.0]])solids.push(prism(rect(x-w/2,x+w/2,y-d/2,y+d/2),BASE,Z(h)));
// Klassieke ingangspartij: steile kraag draagt het bovenblok en twee pilasters.
for(const x of[.1,3.7])solids.push(prism(rect(x-.45,x+.45,10.35,11.05),BASE,Z(6.8)));
solids.push(loft([[Z(6.6),rect(-.5,4.3,10.25,10.7)],[Z(7.4),rect(-.5,4.3,10.25,11.1)]]));
cuts.push(niche([1.9,10.7],90,0,0,2.6,Z(1.6),Z(5.0),.35));
// Rechte vensters zijn 0,35 m blind; enkel de kleine plafonds vormen een uitzondering.
const rn=(a,x,y,w,lo,hi)=>prism(rect(x-.35,x+.35,y-w/2,y+w/2),Z(lo),Z(hi)).rotate([0,0,a]);
for(const [lo,hi]of[[2.0,5.0],[6.2,7.8]]){
 for(const x of[-4.9,-1.4,1.9,5.2,8.7,11.8]){if(x!==1.9||lo>5)cuts.push(rn(90,10.7,-x,1.6,lo,hi));}
 for(const y of[-10.7,-6,-1.3,3.2])cuts.push(rn(0,15.94,y,1.65,lo,hi),rn(180,12.05,-y,1.65,lo,hi));
 for(const x of[-3.4,.3,3.9,7.5,10.7])cuts.push(rn(270,14.74,x,1.5,lo,hi));
}
for(const [lo,hi]of[[2,4.5],[6.7,8.2],[10.2,11.5]])for(const y of[8.65,11.8])cuts.push(rn(180,14.91,-y,1.3,lo,hi));
for(const [lo,hi]of[[2.1,4.3],[6.3,7.8],[10.1,11.0]])for(const y of[-12.6,-9.7])cuts.push(rn(180,11.94,-y,1.2,lo,hi));
for(const [lo,hi]of[[2.1,4.8],[6.0,8.7],[11.3,12.8]])for(const a of[0,45,90])cuts.push(niche(OC,a,3.4,0,1.1,Z(lo),Z(hi),.35));
const castle=Manifold.union(Manifold.union(solids).subtract(Manifold.union(cuts)).decompose().filter(s=>s.volume()>0));
// Hoofdbrug zonder afzonderlijke actuele BGT-dekcontour: landhoofdfunctie
// rijbaan lokale weg / open verharding uit G0396.2181055e5602e99de050020a6b000e5e.
const FP=rect(-.1,4.35,10.7,26.7),ft=y=>Z(1.65)-.025*(y-11);
let front=roofed(FP,[[0,-.025,Z(1.65)+.025*11]]);
for(const y of[13.9,18.9,23.7])front=front.subtract(profileX([[y-1.55,BASE-.1],[y+1.55,BASE-.1],[y+1.55,Z(-1.5)],[y,Z(.72)],[y-1.55,Z(-1.5)]],-1,6));
const fstrip=profileX([[10.6,ft(10.6)-.5],[26.8,ft(26.8)-.5],[26.8,Z(8)],[10.6,Z(8)]],-.3,4.6),fd=front.intersect(fstrip);front=front.subtract(fstrip);
// Lage achterbrug/ramp volgt de gemeten aflopende hoogte; fijn houten hek vervalt.
const RP=rect(2.0,3.55,-30.0,-14.7),rt=y=>Z(-.6)+.1634*(y+30);
let rear=roofed(RP,[[0,.1634,Z(-.6)+.1634*30]]);
for(const y of[-17,-20,-23,-26,-28.5]){const peak=rt(y)-.65;rear=rear.subtract(profileX([[y-.7,BASE-.1],[y+.7,BASE-.1],[y+.7,peak-1.0],[y,peak],[y-.7,peak-1.0]],1,5));}
const rstrip=profileX([[-30.1,rt(-30.1)-.5],[-14.6,rt(-14.6)-.5],[-14.6,Z(8)],[-30.1,Z(8)]],1.9,3.7),rd=rear.intersect(rstrip);rear=rear.subtract(rstrip);
const bridges=Manifold.union([front,rear]);
const nodes=[['building:slot',castle],['building:brugdragers',bridges],['road:toegangsbrug',fd],['road:tuinbrug',rd]],all=Manifold.union(nodes.map(([,s])=>s));
const ATTRIBUTES={'road:toegangsbrug':{bgt_functie:'rijbaan lokale weg',bgt_fysiekvoorkomen:'open verharding'},'road:tuinbrug':{bgt_functie:'voetpad',bgt_fysiekvoorkomen:'half verhard'}};
const OVERHANG_OK=(z,p)=>[5,7.8,4.5,8.2,11.5,4.3,11,4.8,8.7,12.8].some(n=>Math.abs(z-Z(n))<1e-5&&p.every(q=>Math.abs(q[2]-z)<1e-5));
const META={name:'Slot Assumburg',origin:ORIGIN,xAxis:X_AXIS,groundHeight:41.895,groundSamplePoints:[[-23,0],[23,0],[10,17]],replacesBuildings:['0396100000091556'],
 description:'Vier afzonderlijke dakvleugels rond een open BAG-hof, twee vierkante hoektorens met borstwering en piramidedak, achtzijdige hoektoren en twee kleine traptorens, kapelgevel, galerij, dakkapellen, vijf schoorstenen en klassieke entree. Stenen voorbrug met drie printbare spitsbogen en lage aflopende tuinbrug; elk dek afzonderlijk 0,5 m, functie bij gebrek aan BGT-dek overgenomen van aansluitende landhoofden.',
 realWorld:{waterNapM:WATER_NAP,westRidgeNapM:16.9,northRidgeNapM:14.5,southRidgeNapM:12.6,southwestTowerTopNapM:24.4,northwestTowerTopNapM:21.1,octagonalTowerTopNapM:21.35,stairTowerTopNapM:23.9,frontBridgeNapM:1.65,rearBridgeEndNapM:-.6},
 sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/21210','https://commons.wikimedia.org/wiki/Category:Slot_Assumburg','PDOK BAG 0396100000091556, AHN DSM/DTM 0,5 m, Actueel_orthoHR, BGT aansluitingen G0396.2181055e5602e99de050020a6b000e5e en G0396.2181055e5603e99de050020a6b000e5e, 9 oktober 2026']};




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
