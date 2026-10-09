// Bepaalt voor brugmodellen welke BGT-overbruggingsdelen (het brugdek, met
// relatieve hoogteligging 1 of hoger) het model vervangt, en zet hun
// lokaal_id's in `replacesTerrain` van de catalogus-JSON. PDOK legt zo'n dek in
// de terreintegels plat op het water of de uiterwaard (attribuut `gml_id` =
// lokaal_id); kaart en export verbergen het zolang het landmarkmodel zichtbaar
// is. Het maaiveld eronder (hoogteligging 0: water, terrein, pijlervoeten)
// blijft staan, dus er valt geen gat.
//
//   node scripts/replaces-terrain.mjs edithbrug haringvlietbrug   # alleen rapport
//   node scripts/replaces-terrain.mjs --all --write                # alle brugmodellen
//
// Met --all doen de brugmodellen mee: modellen met een `road:`-node die
// BGT-attributen heeft. Een model dat op de opdrachtregel genoemd wordt doet
// altijd mee, bijvoorbeeld de Pier van Scheveningen, waarvan het dek ook een
// overbruggingsdeel is.
// Een overbruggingsdeel telt mee als minstens 90 % (of --min) van zijn oppervlak binnen
// de voetafdruk van het model valt (de GLB in bovenaanzicht, 1 m verbreed);
// deels bedekte delen worden gemeld en niet opgenomen, want daar zou een gat
// in het dek vallen. Met --write past het script ook de generator aan: de
// lijst komt als `replacesTerrain` vóór `description` in het catalogusobject,
// zodat een hergeneratie hem behoudt. Ids in de lijst die geen
// overbruggingsdeel zijn (met de hand toegevoegd, zoals een kapot PDOK-vlak dat
// het model met een eigen onderdeel vervangt) laat het script staan.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MODELS = path.join(import.meta.dirname, "../models");
const SCRIPTS = import.meta.dirname;
const CELL = 0.5;
const DILATE = 1.0;
const args = process.argv.slice(2);
// --min 0.85: lagere grens voor een model waarvan het BGT-vlak ook open stukken
// tussen de bouwdelen bedekt, bijvoorbeeld tussen de armen van een pier.
const minIndex = args.indexOf("--min");
const MIN_INSIDE = minIndex === -1 ? 0.9 : Number(args[minIndex + 1]);
const REPORT_INSIDE = 0.2;
const BGT = "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items";
const RD = "http://www.opengis.net/def/crs/EPSG/0/28992";

const write = args.includes("--write");
const all = args.includes("--all");
const slugs = all
  ? (await readdir(MODELS, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  : args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--min");

function readGlb(buffer) {
  const jsonLength = buffer.readUInt32LE(12);
  const gltf = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString("utf8"));
  const bin = buffer.subarray(20 + jsonLength + 8);
  const accessor = (index) => {
    const a = gltf.accessors[index];
    const view = gltf.bufferViews[a.bufferView];
    const offset = (view.byteOffset ?? 0) + (a.byteOffset ?? 0);
    const n = a.count * { SCALAR: 1, VEC3: 3 }[a.type];
    const Type = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array }[a.componentType];
    return new Type(bin.buffer.slice(bin.byteOffset + offset, bin.byteOffset + offset + n * Type.BYTES_PER_ELEMENT));
  };
  const nodes = [];
  for (const node of gltf.nodes ?? []) {
    if (node.mesh == null) continue;
    for (const primitive of gltf.meshes[node.mesh].primitives) {
      nodes.push({
        name: node.name ?? "",
        attributes: node.extras?.attributes,
        positions: accessor(primitive.attributes.POSITION),
        indices: accessor(primitive.indices),
      });
    }
  }
  return nodes;
}

/** Bovenaanzicht van het model als raster in RD, 1 m verbreed. */
function footprint(entry, nodes) {
  const unit = entry.unitsPerMetre ?? 1;
  const length = Math.hypot(...entry.xAxis);
  const [ax, ay] = entry.xAxis.map((c) => c / length);
  const toRd = (x, y) => [entry.origin[0] + (x * ax - y * ay) / unit, entry.origin[1] + (x * ay + y * ax) / unit];
  const triangles = [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const { positions: p, indices } of nodes) {
    for (let i = 0; i < indices.length; i += 3) {
      // glTF Y omhoog: model-x = X, model-y = -Z.
      const t = [0, 1, 2].map((k) => toRd(p[3 * indices[i + k]], -p[3 * indices[i + k] + 2]));
      triangles.push(t);
      for (const [x, y] of t) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
    }
  }
  x0 -= 2 * DILATE; y0 -= 2 * DILATE; x1 += 2 * DILATE; y1 += 2 * DILATE;
  const w = Math.ceil((x1 - x0) / CELL), h = Math.ceil((y1 - y0) / CELL);
  const grid = new Uint8Array(w * h);
  for (const [[ax1, ay1], [bx, by], [cx, cy]] of triangles) {
    const area = (bx - ax1) * (cy - ay1) - (cx - ax1) * (by - ay1);
    if (Math.abs(area) < 1e-9) continue;
    const i0 = Math.max(0, Math.floor((Math.min(ax1, bx, cx) - x0) / CELL));
    const i1 = Math.min(w - 1, Math.floor((Math.max(ax1, bx, cx) - x0) / CELL));
    const j0 = Math.max(0, Math.floor((Math.min(ay1, by, cy) - y0) / CELL));
    const j1 = Math.min(h - 1, Math.floor((Math.max(ay1, by, cy) - y0) / CELL));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const px = x0 + (i + 0.5) * CELL, py = y0 + (j + 0.5) * CELL;
        const w1 = ((bx - px) * (cy - py) - (cx - px) * (by - py)) / area;
        const w2 = ((cx - px) * (ay1 - py) - (ax1 - px) * (cy - py)) / area;
        if (w1 >= -1e-9 && w2 >= -1e-9 && w1 + w2 <= 1 + 1e-9) grid[j * w + i] = 1;
      }
    }
  }
  const reach = Math.round(DILATE / CELL);
  const dilated = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (!grid[j * w + i]) continue;
      for (let dj = -reach; dj <= reach; dj++) {
        for (let di = -reach; di <= reach; di++) {
          if (di * di + dj * dj > reach * reach) continue;
          const ii = i + di, jj = j + dj;
          if (ii >= 0 && jj >= 0 && ii < w && jj < h) dilated[jj * w + ii] = 1;
        }
      }
    }
  }
  return {
    bbox: [x0, y0, x1, y1],
    inside: (x, y) => {
      const i = Math.floor((x - x0) / CELL), j = Math.floor((y - y0) / CELL);
      return i >= 0 && j >= 0 && i < w && j < h && dilated[j * w + i] === 1;
    },
  };
}

async function overbruggingsdelen([x0, y0, x1, y1]) {
  const features = [];
  let url = `${BGT}?bbox=${x0},${y0},${x1},${y1}&bbox-crs=${encodeURIComponent(RD)}&crs=${encodeURIComponent(RD)}&f=json&limit=1000`;
  while (url) {
    const response = await fetch(url, { headers: { "User-Agent": "NederPrint-landmark-research/1.0", Accept: "application/geo+json" } });
    if (!response.ok) throw new Error(`BGT ${response.status} voor ${url}`);
    const page = await response.json();
    features.push(...page.features);
    url = page.links?.find((link) => link.rel === "next")?.href;
  }
  return features;
}

function pointInRings(rings, x, y) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

/** Aandeel van het oppervlak van een (multi)polygoon dat binnen de voetafdruk valt. */
function insideShare(geometry, foot) {
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  let total = 0, inside = 0;
  for (const rings of polygons) {
    const xs = rings[0].map(([x]) => x), ys = rings[0].map(([, y]) => y);
    for (let y = Math.min(...ys) + CELL / 2; y < Math.max(...ys); y += CELL) {
      for (let x = Math.min(...xs) + CELL / 2; x < Math.max(...xs); x += CELL) {
        if (!pointInRings(rings, x, y)) continue;
        total++;
        if (foot.inside(x, y)) inside++;
      }
    }
  }
  return total ? inside / total : 0;
}

/** Zet de lijst vóór `description` in het catalogusobject van de generator. */
function patchGenerator(source, slug, ids) {
  const literal = (indent) =>
    ids.length
      ? `${indent}replacesTerrain: [\n${ids.map((id) => `${indent}  "${id}",`).join("\n")}\n${indent}],\n`
      : "";
  const existing = /^([ \t]*)replacesTerrain: \[[^\]]*\],\n/m;
  if (existing.test(source)) return source.replace(existing, (_, indent) => literal(indent));
  const marker = source.indexOf(`${slug}.json`);
  const crs = source.indexOf(`crs: "EPSG:28992"`, marker === -1 ? 0 : marker);
  if (crs === -1) return null;
  const description = /^([ \t]*)description:/m;
  const rest = source.slice(crs);
  const match = rest.match(description);
  if (!match) return null;
  const at = crs + match.index;
  return source.slice(0, at) + literal(match[1]) + source.slice(at);
}

const summary = [];
for (const slug of slugs) {
  const jsonPath = path.join(MODELS, slug, `${slug}.json`);
  let entry;
  try {
    entry = JSON.parse(await readFile(jsonPath, "utf8"));
  } catch {
    continue;
  }
  const nodes = readGlb(await readFile(path.join(MODELS, slug, entry.file)));
  // Met --all alleen brugmodellen; een expliciet genoemd model (zoals een pier
  // op een overbruggingsdeel) doet altijd mee.
  const isBridge = nodes.some((node) => node.name.startsWith("road:") && node.attributes?.bgt_functie);
  if (all && !isBridge) continue;
  const foot = footprint(entry, nodes);
  const ids = [];
  const partial = [];
  const bridgeParts = new Set();
  for (const feature of await overbruggingsdelen(foot.bbox)) {
    const p = feature.properties;
    bridgeParts.add(p.lokaal_id);
    if (p.eind_registratie) continue;
    if (!(Number(p.relatieve_hoogteligging) >= 1)) continue;
    const share = insideShare(feature.geometry, foot);
    if (share >= MIN_INSIDE) ids.push(p.lokaal_id);
    else if (share >= REPORT_INSIDE) partial.push(`${p.lokaal_id} (${Math.round(share * 100)} %)`);
  }
  // Ids die geen overbruggingsdeel zijn, staan er met de hand in (bijvoorbeeld
  // een kapot PDOK-vlak dat het model zelf vervangt) en blijven staan.
  const manual = (entry.replacesTerrain ?? []).filter((id) => !bridgeParts.has(id));
  const dekvlakken = ids.length;
  ids.push(...manual);
  ids.sort();
  const before = JSON.stringify(entry.replacesTerrain ?? []);
  console.log(`${slug}: ${dekvlakken} dekvlak(ken)${manual.length ? `, ${manual.length} handmatig behouden` : ""}${partial.length ? `, deels onder het model: ${partial.join(", ")}` : ""}`);
  for (const id of ids) console.log(`  ${id}${manual.includes(id) ? " (handmatig)" : ""}`);
  summary.push({ slug, ids: ids.length, partial: partial.length });
  if (!write || JSON.stringify(ids) === before) continue;
  // In de JSON na replacesBuildings (of na de maaiveldvelden), de rest ongewijzigd.
  const ordered = {};
  for (const [key, value] of Object.entries(entry)) {
    if (key === "replacesTerrain") continue;
    if (key === "description" && !("replacesTerrain" in ordered) && ids.length) ordered.replacesTerrain = ids;
    ordered[key] = value;
  }
  if (!("replacesTerrain" in ordered) && ids.length) ordered.replacesTerrain = ids;
  await writeFile(jsonPath, JSON.stringify(ordered, null, 2));
  // Meestal generate-<slug>.mjs; anders de generator die <slug>.json schrijft.
  let generatorPath = path.join(SCRIPTS, `generate-${slug}.mjs`);
  let source = await readFile(generatorPath, "utf8").catch(() => null);
  if (source == null) {
    for (const name of (await readdir(SCRIPTS)).filter((n) => /^generate-.+\.mjs$/.test(n))) {
      const text = await readFile(path.join(SCRIPTS, name), "utf8");
      if (text.includes(`"${slug}.json"`)) {
        generatorPath = path.join(SCRIPTS, name);
        source = text;
        break;
      }
    }
  }
  if (source == null) {
    console.log(`  let op: geen generator voor ${slug}.json gevonden`);
    continue;
  }
  const patched = patchGenerator(source.replace(/\r\n/g, "\n"), slug, ids);
  if (patched == null) console.log(`  let op: catalogusobject in generate-${slug}.mjs niet gevonden, zet replacesTerrain er zelf in`);
  else await writeFile(generatorPath, patched);
}
console.log(`${summary.length} brugmodellen, ${summary.filter((s) => s.ids).length} met dekvlakken, ${summary.filter((s) => s.partial).length} met deels bedekte delen`);
