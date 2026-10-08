// De Kameel Schiedam, meters Z omhoog; GLB Y omhoog en STL op 1:1000.
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
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molen-de-kameel");
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


// BAG-cirkel: straal 4,540 m, hart 87170,844 / 437237,858.
// Stelling en vlucht uit Molendatabase; hoogtes uit AHN, kap en ramen geschat.
const ORIGIN = [87170.84, 437237.86], BASE = -1;
const ROMP = { rBase: 4.54, rTop: 2.55, top: 27.8 };
const STELLING = { z: 15.80, radius: 7.55, plaat: 0.9, kraag: 50 };
const KAP = { top: 30.50 };
const AS = { z: 28.31, richting: 190 };
const WIEK = { vlucht: 25.95, vlak: 3.1, dikte: 1, breedte: 2.4, hoek: 50, helling: 6 };
const GROUND_SAMPLES = [[-8,8],[-10,0],[-8,-8]];
const radiusAt = h => ROMP.rBase + (ROMP.rTop-ROMP.rBase)*Math.max(h,0)/ROMP.top;

// Romp is één doorlopende mantel, niet opgebouwd uit hoogtelagen.
let tower = frustum(ring(64,ROMP.rBase),BASE,ring(64,ROMP.rTop),ROMP.top);
const niches = [];
for (const h of [6.0,9.1,12.4,18.8,22.9,26.0]) {
  for (const a of [10,130,250]) {
    const r=radiusAt(h);
    niches.push(hull(box(r-0.38,r+0.6,-0.5,0.5,h,h+1.3)).rotate([0,0,a]));
  }
}
// Blinde rondboognissen: het binnenvlak volgt de romphelling.
// De kromming geeft circa 0,3 m diepte aan de randen en 0,55 m middenin.
const archNiche=(angle,r,width,bottom,spring)=>{
 const half=width/2,profile=[[-half,bottom],[half,bottom],...Array.from({length:13},(_,i)=>{const a=i*Math.PI/12;return [half*Math.cos(a),spring+half*Math.sin(a)];})];
 return hull(profile.flatMap(([v,z])=>[[radiusAt(z)-.55,v,z],[radiusAt(z)+.8,v,z]])).rotate([0,0,angle]);
};
// Lage invaart naar de grot aan het oostelijke water, brede poort aan het westelijke plein.
niches.push(archNiche(350,ROMP.rBase,3.2,-0.70,0.65));
niches.push(archNiche(190,radiusAt(1),3.0,0.1,3.1));
// Stellingdeur: met de bovenbouw verbonden, geen open gat in de mantel.
niches.push(hull(box(radiusAt(16)-.38,radiusAt(16)+.6,-.55,.55,15.0,17.4)).rotate([0,0,190]));
tower=tower.subtract(union(niches));

let zKraag=STELLING.z-STELLING.plaat-(STELLING.radius-radiusAt(STELLING.z))*Math.tan(STELLING.kraag*deg);
for(let i=0;i<8;i++) zKraag=STELLING.z-STELLING.plaat-(STELLING.radius-radiusAt(zKraag))*Math.tan(STELLING.kraag*deg);
const stage=union([
  frustum(ring(16,radiusAt(zKraag)),zKraag,ring(16,STELLING.radius),STELLING.z-STELLING.plaat),
  frustum(ring(16,STELLING.radius),STELLING.z-STELLING.plaat,ring(16,STELLING.radius),STELLING.z),
]);
// Houten langskap met steile onderrand en dakvlakken naar de nok.
const cap=hull([
  ...at(ring(32,ROMP.rTop),ROMP.top),
  ...at(ring(32,1).map(([u,v])=>[u*2.85,v*2.6]),ROMP.top+0.8),
  ...at(ring(32,1).map(([u,v])=>[u*2.3,v*1.9]),ROMP.top+1.8),
  ...box(-1.65,1.65,-0.3,0.3,KAP.top-0.01,KAP.top),
]);
const R=WIEK.vlucht/2,u0=WIEK.vlak-WIEK.dikte/2,u1=WIEK.vlak+WIEK.dikte/2,tips=[],arms=[];
for(const a of [50,130,230,310]){
  const d=[Math.cos(a*deg),Math.sin(a*deg)],n=[-d[1],d[0]],half=WIEK.breedte/2;
  const corners=[[-half*n[0],-half*n[1]],[half*n[0],half*n[1]],[R*d[0]+half*n[0],R*d[1]+half*n[1]],[R*d[0]-half*n[0],R*d[1]-half*n[1]]].map(([v,z])=>[v,z+AS.z]);
  arms.push(hull(corners.flatMap(([v,z])=>[[u0,v,z],[u1,v,z]])));
  if(d[1]<0)tips.push({corners:corners.slice(2),d});
}
const axle=hull([...box(1.5,1.6,-0.7,0.7,AS.z-3.2,AS.z+0.7),...box(u0-0.3,u1-0.3,-0.7,0.7,AS.z-0.7,AS.z+0.7)]);
const tail=hull([...box(-2.5,-1.6,-0.5,0.5,ROMP.top-0.2,ROMP.top+0.8),...box(-7.55,-6.55,-0.5,0.5,STELLING.z-0.2,STELLING.z+0.9)]);
const sails=union([...arms,axle]).translate([0,0,-AS.z]).rotate([0,-WIEK.helling,0]).translate([0,0,AS.z]);
const turning=union([cap,sails,tail]).rotate([0,0,AS.richting]);
const model=union([tower,stage,turning]);
const nodes=[['building:molen',model]];
// Vaste voetstroken onder de twee laagste punten alleen voor de losse STL.
const steun=union(tips.map(({corners,d})=>{
  const h=WIEK.helling*deg;
  const top=corners.flatMap(([v,z])=>[-0.3,0.05].flatMap(k=>[u0,u1].map(u=>[u*Math.cos(h)-(z+k*d[1]-AS.z)*Math.sin(h),v+k*d[0],AS.z+u*Math.sin(h)+(z+k*d[1]-AS.z)*Math.cos(h)])));
  return hull([...top,...top.map(([u,v])=>[u,v,BASE])]);
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







for(const [label,s] of [['molen',model],['print',printModel]]){
  if(s.status()!=='NoError')throw new Error(label+': '+s.status());
  if(Math.abs(s.boundingBox().min[2]-BASE)>1e-6)throw new Error('voet niet vlak');
  console.log(label,JSON.stringify({status:s.status(),genus:s.genus(),triangles:s.numTri(),bounds:s.boundingBox(),volume:s.volume()}));
}
await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,'molen-de-kameel.glb'),toGlb(nodes,'NederPrint generate-molen-de-kameel.mjs (manifold-3d)'));
const stlName=`molen-de-kameel-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),`De Kameel Schiedam 1:${scale}`).buffer);
await writeFile(path.join(outDir,'molen-de-kameel.json'),JSON.stringify({
  name:'De Kameel',file:'molen-de-kameel.glb',unitsPerMetre:1,className:'building',crs:'EPSG:28992',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,
  groundSamplePoints:GROUND_SAMPLES,replacesBuildings:['NL.IMBAG.Pand.0606100000021161'],
  description:'Herbouwde molen uit 2011 op de exacte BAG-cirkel, met ronde romp, stelling 15,80 m, houten langskap 30,50 m, staart en vlucht 25,95 m uit de actuele Vaags-roedentabel. De watergrot op 350 graden en de westelijke ingangsboog zijn blinde nissen. AS 28,31 m afgeleid van AHN-bovenste verticale wiekpunt 41,28 m minus halve vlucht; kapvorm, bovenstraal, romphelling, stellingradius 7,55 m, kaprichting 190 graden, 6 graden ashelling en gevelindeling geschat uit AHN, ortho en schuine fotos. RD-assen en voet 1 m onder maaiveld, grondpunten uitsluitend op het westelijke land; geen aangebouwde woning in BAG.',
  printFiles:[stlName],realWorld:{flightM:WIEK.vlucht,stageM:STELLING.z,rompTopM:ROMP.top,capM:KAP.top,axleM:AS.z,baseRadiusM:ROMP.rBase,stageRadiusM:STELLING.radius,axisDegrees:AS.richting,sailTiltDegrees:WIEK.helling,boatNicheDegrees:350},
  sources:['https://www.molendatabase.nl/molens/ten-bruggencate-nr-12207','https://www.deschiedamsemolens.nl/de-kameel/','PDOK BAG 0606100000021161, AHN DSM/DTM 0,5 m en Actueel_orthoHR, geraadpleegd 2026-10-08','https://commons.wikimedia.org/wiki/File:Schiedam_De_Kameel.jpg','https://commons.wikimedia.org/wiki/File:De_Kameel.jpg','https://commons.wikimedia.org/wiki/File:Kameel10.jpg']
},null,2));
