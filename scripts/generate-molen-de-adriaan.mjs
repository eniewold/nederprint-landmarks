// De Adriaan Haarlem, meters Z omhoog; GLB Y omhoog en STL op 1:1000.
// Voorbeeld: generate-molen-de-valk.mjs. --out en --scale zijn optioneel.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molen-de-adriaan");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const hull = (points) => Manifold.hull(points);
const deg = Math.PI / 180;
const ring = (n, r, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot * deg + (2 * Math.PI * i) / n;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const frustum = (bottom, z0, top, z1) => hull([...at(bottom, z0), ...at(top, z1)]);
const box = (u0, u1, v0, v1, z0, z1) => {
  const pts = [];
  for (const u of [u0, u1]) for (const v of [v0, v1]) for (const z of [z0, z1]) pts.push([u, v, z]);
  return pts;
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);

// De Adriaan: gemeten BAG-voet, AHN-hoogtes en bronmaten van SMZK.
// Benoemde bouwdelen met rechte vlakken; geen DSM-hoogtelagen.
const ORIGIN = [104310.15, 488700.05];
const BASE = -1;
const ROMP = { voetRadius: 4.85, stenenTop: 7.4, houtVoet: 4.0, houtTop: 2.55, top: 23.0 };
const STELLING = { z: 12, apothem: 7.0, plaat: 0.9 };
const KAP = { top: 25.6 };
const AS = { z: 24.0, richting: 45 };
const WIEK = { vlucht: 24.3, breedte: 2.4, dikte: 1.0, hoek: 50, vlak: 4.0 };
const oct = (r) => ring(8, r / Math.cos(Math.PI / 8), 17.8);
const radial = (h) => ROMP.houtVoet + (ROMP.houtTop-ROMP.houtVoet)*(h-ROMP.stenenTop)/(ROMP.top-ROMP.stenenTop);
let tower = union([
  frustum(ring(48,ROMP.voetRadius),BASE,ring(48,ROMP.voetRadius),ROMP.stenenTop),
  frustum(oct(ROMP.houtVoet),ROMP.stenenTop-0.01,oct(ROMP.houtTop),ROMP.top),
]);
// Acht steunberen op de BAG-uitstulpingen, schuine bovenkanten.
const buttresses=[];
for(let a=17.8;a<360;a+=45) buttresses.push(hull([...box(4.3,5.8,-0.55,0.55,BASE,4.8),...box(4.3,4.5,-0.55,0.55,6.9,7)]).rotate([0,0,a]));
tower=union([tower,...buttresses]);
// Blinde vensters, 0,35 m diep, afgeschuinde/spitse top voor de print.
const niches=[];
for(const h of [3.0,6.0,9.1,15.0,19.0]) {
  const r=h<7.4?4.85:radial(h)/Math.cos(Math.PI/8);
  for(let a=40.3;a<360;a+=45) niches.push(hull([...box(r-0.38,r+0.8,-0.55,0.55,h,h+1.1),...box(r-0.38,r+0.8,-0.01,0.01,h+1.8,h+1.81)]).rotate([0,0,a]));
}
tower=tower.subtract(union(niches));
// Stelling op doorlopende 50 graden kraag (echte houten schoren verdikt).
let zKraag=STELLING.z-STELLING.plaat-(STELLING.apothem-radial(STELLING.z))*Math.tan(50*deg);
for(let i=0;i<8;i++) zKraag=STELLING.z-STELLING.plaat-(STELLING.apothem-radial(zKraag))*Math.tan(50*deg);
const stage=union([
 frustum(oct(radial(zKraag)),zKraag,oct(STELLING.apothem),STELLING.z-STELLING.plaat),
 frustum(oct(STELLING.apothem),STELLING.z-STELLING.plaat,oct(STELLING.apothem),STELLING.z),
]);
// Gebogen houten kap: langgerekte doorsnede met nok langs de bovenas.
const cap=hull([...at(ring(32,2.55),23),...at(ring(32,1).map(([u,v])=>[u*3.0,v*2.6]),23.6),...at(ring(32,1).map(([u,v])=>[u*2.6,v*1.9]),24.7),...box(-1.7,1.7,-0.35,0.35,KAP.top-0.01,KAP.top)]);
const R=WIEK.vlucht/2,u0=WIEK.vlak-WIEK.dikte/2,u1=WIEK.vlak+WIEK.dikte/2;
const tips=[],arms=[];
for(const a of [50,130,230,310]) {
 const d=[Math.cos(a*deg),Math.sin(a*deg)],n=[-d[1],d[0]],half=WIEK.breedte/2;
 const corners=[[-half*n[0],-half*n[1]],[half*n[0],half*n[1]],[R*d[0]+half*n[0],R*d[1]+half*n[1]],[R*d[0]-half*n[0],R*d[1]-half*n[1]]].map(([v,z])=>[v,z+AS.z]);
 arms.push(hull(corners.flatMap(([v,z])=>[[u0,v,z],[u1,v,z]])));
 if(d[1]<0)tips.push({corners:corners.slice(2),d});
}
const axle=hull([...box(1.3,1.4,-0.7,0.7,21.2,24.7),...box(3.3,4.0,-0.7,0.7,23.3,24.7)]);
const tail=hull([...box(-2.7,-1.7,-0.5,0.5,22.8,23.8),...box(-6.7,-5.7,-0.5,0.5,11.8,12.9)]);
const turning=union([cap,...arms,axle,tail]).rotate([0,0,AS.richting]);
// Stenen aanbouw: BAG-hoekpunten, nok/ goot uit AHN; topgevel aan de zuidwestkant.
const ANNEX_RD=[[104302.932,488694.387],[104310.167,488690.541],[104314.0,488697.8],[104307.345,488702.684]];
const poly=ANNEX_RD.map(([x,y])=>[x-ORIGIN[0],y-ORIGIN[1]]);
const inner=[1.0,-0.3],outer=[-3.6,-7.6];
let annex=Manifold.intersection(hull([...at(poly,BASE),...at(poly,6.1),[...inner,9.0],[...outer,9.0]]),prism(poly,BASE,12));
// Drie vensters en entree op de kopgevel, alle blinde nissen.
const heading=Math.atan2(outer[1]-inner[1],outer[0]-inner[0])/deg;
const cuts=[];
for(const [v,h,w,ht] of [[-2.2,3.9,1.0,1.6],[0,3.9,1.2,1.8],[2.2,3.9,1.0,1.6],[0,0.2,1.8,2.8],[0,6.5,1.0,1.6]]) {
 cuts.push(hull([...box(-0.4,0.8,v-w/2,v+w/2,h,h+ht-0.6),...box(-0.4,0.8,v-0.01,v+0.01,h+ht,h+ht+0.01)]).rotate([0,0,heading]).translate([...outer,0]));
}
annex=annex.subtract(union(cuts));
// Entree en raamopeningen als nissen in de kopgevel; de onderbouw blijft gesloten.
const model=union([tower,stage,turning,annex]);
const nodes=[['building:molen',model]];
// Permanente dunne printvoeten onder de twee onderste wiekpunten, zoals De Valk.
const steun=union(tips.map(({corners,d})=>{
 const p=corners.flatMap(([v,z])=>[-0.3,0.05].map(k=>[v+k*d[0],z+k*d[1]]));
 return hull(p.flatMap(([v,z])=>[[u0,v,z],[u1,v,z],[u0,v,BASE],[u1,v,BASE]]));
})).rotate([0,0,AS.richting]);
const printModel=union([model,steun]);
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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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





for(const [label,s] of [['model',model],['print',printModel]]) {
 if(s.status()!=='NoError')throw new Error(label+': '+s.status());
 console.log(label,JSON.stringify({status:s.status(),genus:s.genus(),triangles:s.numTri(),bounds:s.boundingBox(),volume:s.volume()}));
}
await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,'molen-de-adriaan.glb'),toGlb(nodes,'NederPrint generate-molen-de-adriaan.mjs (manifold-3d)'));
const stlName=`molen-de-adriaan-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),`De Adriaan Haarlem 1:${scale}`).buffer);
await writeFile(path.join(outDir,'molen-de-adriaan.json'),JSON.stringify({
 name:'De Adriaan',file:'molen-de-adriaan.glb',unitsPerMetre:1,className:'building',crs:'EPSG:28992',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,
 groundSamplePoints:[[8,-3],[4,-10],[-5,-9]],replacesBuildings:['NL.IMBAG.Pand.0392100000036506'],
 description:'Oorsprong in het hart van de BAG-voet, RD-assen; voet 1 m onder het kademaaiveld. Achtkant op ronde stenen onderbouw, acht steunberen, stelling op 50 graden kraag, kap en wieken naar het noordoosten, staart en stenen aanbouw met zadeldak. Kapvorm, ashoogte, richting en vensters geschat uit AHN en foto; wieken in printvriendelijke X-stand.',
 printFiles:[stlName],realWorld:{flightM:24.3,stageM:12,capM:25.6,axleM:24,baseRadiusM:4.85,stageApothemM:7,sailThicknessM:1,sailWidthM:2.4},
 sources:['https://www.smzk.nl/adriaan/','https://www.molenadriaan.nl/nl/','https://legacy.molendatabase.nl/nederland/molen.php?nummer=1163','https://nl.wikipedia.org/wiki/De_Adriaan_(Haarlem)','PDOK BAG pand 0392100000036506; AHN DSM/DTM 0,5 m en Actueel_orthoHR, geraadpleegd 2026-10-08','https://commons.wikimedia.org/wiki/File:Haarlem,_molen_de_Adriaan_foto2_2015-01-04_09.37.jpg'],
},null,2));
