// De Drie Koornbloemen Schiedam, meters Z omhoog; GLB Y omhoog en STL op 1:1000.
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
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molen-de-drie-koornbloemen");
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


// BAG-cirkel: straal 6,052 m, hart 86575,709 / 437039,279.
// Stelling en vlucht uit Molendatabase; hoogtes uit AHN, kap en ramen geschat.
const ORIGIN = [86575.71, 437039.28], BASE = -1;
const ROMP = { rBase: 6.052, rTop: 3.1, top: 27.7 };
const STELLING = { z: 16.0, radius: 8.1, plaat: 0.9, kraag: 50 };
const KAP = { top: 30.5 };
const AS = { z: 29.39, richting: 250.2 };
const WIEK = { vlucht: 26.4, vlak: 3.8, dikte: 1, breedte: 2.4, hoek: 50 };
const GROUND_SAMPLES = [[10,0],[8,8],[8,-8]];
const radiusAt = h => ROMP.rBase + (ROMP.rTop-ROMP.rBase)*Math.max(h,0)/ROMP.top;

// Romp is één doorlopende mantel, niet opgebouwd uit hoogtelagen.
let tower = frustum(ring(64,ROMP.rBase),BASE,ring(64,ROMP.rTop),ROMP.top);
const niches = [];
for (const h of [5.0,10.2,14.2,17.6,21.7,25.5]) {
  for (const a of [20,140,260]) {
    const r=radiusAt(h);
    niches.push(hull(box(r-0.38,r+0.6,-0.5,0.5,h,h+1.3)).rotate([0,0,a]));
  }
}
// Rechthoekige deuren en brede beganegrondvensters aan de straatzijde.
for (const a of [215,250,285]) niches.push(hull(box(5.67,6.8,-0.75,0.75,0.1,2.35)).rotate([0,0,a]));
// Gevelsteen op de oostzijde, zonder onprintbare letters.
niches.push(hull(box(radiusAt(5.8)-0.35,radiusAt(5.8)+0.6,-0.65,0.65,5.8,6.8)));
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
  ...at(ring(32,1).map(([u,v])=>[u*3.45,v*3.2]),ROMP.top+0.8),
  ...at(ring(32,1).map(([u,v])=>[u*2.7,v*2.3]),ROMP.top+1.8),
  ...box(-1.9,1.9,-0.3,0.3,KAP.top-0.01,KAP.top),
]);
const R=WIEK.vlucht/2,u0=WIEK.vlak-WIEK.dikte/2,u1=WIEK.vlak+WIEK.dikte/2,tips=[],arms=[];
for(const a of [50,130,230,310]){
  const d=[Math.cos(a*deg),Math.sin(a*deg)],n=[-d[1],d[0]],half=WIEK.breedte/2;
  const corners=[[-half*n[0],-half*n[1]],[half*n[0],half*n[1]],[R*d[0]+half*n[0],R*d[1]+half*n[1]],[R*d[0]-half*n[0],R*d[1]-half*n[1]]].map(([v,z])=>[v,z+AS.z]);
  arms.push(hull(corners.flatMap(([v,z])=>[[u0,v,z],[u1,v,z]])));
  if(d[1]<0)tips.push({corners:corners.slice(2),d});
}
const axle=hull([...box(1.5,1.6,-0.7,0.7,AS.z-3.2,AS.z+0.7),...box(u0-0.3,u1-0.3,-0.7,0.7,AS.z-0.7,AS.z+0.7)]);
const tail=hull([...box(-3.0,-2.0,-0.5,0.5,ROMP.top-0.2,ROMP.top+0.8),...box(-8.1,-7.1,-0.5,0.5,STELLING.z-0.2,STELLING.z+0.9)]);
const turning=union([cap,...arms,axle,tail]).rotate([0,0,AS.richting]);
// Molenaarswoning: echte BAG-trapezium, twee doorlopende dakvlakken.
const WONING = { contour:[[0.204,-6.021],[2.197,-12.761],[8.007,-10.748],[2.444,-5.515]], goot:4.9, nok:7.5, richting:-57.8 };
const ridgeCentre=[3.213,-8.761], cross=[0.846,0.534];
const roofPlane=(poly,a,b,c)=>{const n=Math.hypot(a,b,1);return prism(poly,BASE,20).trimByPlane([a/n,b/n,-1/n],-c/n);};
const roofSlope=(WONING.nok-WONING.goot)/3.1;
const roof=roofPlane(WONING.contour,roofSlope*cross[0],roofSlope*cross[1],WONING.nok-roofSlope*(cross[0]*ridgeCentre[0]+cross[1]*ridgeCentre[1])).intersect(roofPlane(WONING.contour,-roofSlope*cross[0],-roofSlope*cross[1],WONING.nok+roofSlope*(cross[0]*ridgeCentre[0]+cross[1]*ridgeCentre[1])));
const houseHoles=[];
// De buitenste gevel en oostwand; blinde vensters en deur 0,35 m diep.
const edgeNiches=(a,b,count)=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),normal=[dy/length,-dx/length];
 for(let i=0;i<count;i++)for(const z of [0.7,3.0]){
  const t=(i+0.5)/count,c=[a[0]+t*dx,a[1]+t*dy];
  const poly=[[-0.6,-0.36],[0.6,-0.36],[0.6,0.6],[-0.6,0.6]].map(([u,v])=>[c[0]+u*dx/length+v*normal[0],c[1]+u*dy/length+v*normal[1]]);
  houseHoles.push(prism(poly,z,z+1.3));
 }
};
edgeNiches(WONING.contour[1],WONING.contour[2],3);
edgeNiches(WONING.contour[2],WONING.contour[3],2);
const house=union([roof.subtract(union(houseHoles)),hull(box(1.73,2.73,-10.14,-9.14,6.5,8.9))]);
const model=union([tower,stage,turning,house]);

const nodes=[['building:molen',model]];
// Vaste voetstroken onder de twee laagste punten alleen voor de losse STL.
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







for(const [label,s] of [['molen',model],['print',printModel]]){
  if(s.status()!=='NoError')throw new Error(label+': '+s.status());
  if(Math.abs(s.boundingBox().min[2]-BASE)>1e-6)throw new Error('voet niet vlak');
  console.log(label,JSON.stringify({status:s.status(),genus:s.genus(),triangles:s.numTri(),bounds:s.boundingBox(),volume:s.volume()}));
}
await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,'molen-de-drie-koornbloemen.glb'),toGlb(nodes,'NederPrint generate-molen-de-drie-koornbloemen.mjs (manifold-3d)'));
const stlName=`molen-de-drie-koornbloemen-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),`De Drie Koornbloemen Schiedam 1:${scale}`).buffer);
await writeFile(path.join(outDir,'molen-de-drie-koornbloemen.json'),JSON.stringify({
  name:'De Drie Koornbloemen',file:'molen-de-drie-koornbloemen.glb',unitsPerMetre:1,className:'building',crs:'EPSG:28992',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,
  groundSamplePoints:GROUND_SAMPLES,replacesBuildings:['NL.IMBAG.Pand.0606100000018782'],
  description:'Ronde molen op de BAG-cirkel met de aangebouwde molenaarswoning aan de zuidoostzijde, twee vlakke dakhellingen en schoorsteen; stelling 16 m, vlucht 26,4 m uit het actuele molenpaspoort. As 29,39 m boven maaiveld afgeleid van de gemeentelijke verticale wiekpunt op NAP 17,59 m en de vlucht, met maaiveld NAP 1,4 m. Kaphoogte 30,5 m uit AHN; romphelling, kapvorm, stellingradius, draaiende kaprichting 250,2 graden en gevelindeling geschat. RD-assen; voet 1 m onder maaiveld, grondpunten op het land, woninggoot 4,9 m en nok 7,5 m uit AHN geschat.',
  printFiles:[stlName],realWorld:{flightM:WIEK.vlucht,stageM:STELLING.z,rompTopM:ROMP.top,capM:KAP.top,axleM:AS.z,baseRadiusM:ROMP.rBase,stageRadiusM:STELLING.radius,axisDegrees:AS.richting,houseEaveM:WONING.goot,houseRidgeM:WONING.nok,chimneyM:8.9},
  sources:['https://www.molendatabase.nl/molens/ten-bruggencate-nr-01172','https://www.deschiedamsemolens.nl/de-drie-koornbloemen/','https://www.schiedam.nl/ruimtelijkeplannen/NL.IMRO.0606.BP0026-0002/t_NL.IMRO.0606.BP0026-0002.html','PDOK BAG 0606100000018782, AHN DSM/DTM 0,5 m en Actueel_orthoHR, geraadpleegd 2026-10-08','https://commons.wikimedia.org/wiki/File:De_Drie_Koornbloemen_mill_Schiedam_2018_1.jpg','https://commons.wikimedia.org/wiki/File:Driekorenbloemen04.jpg','https://commons.wikimedia.org/wiki/File:Korenmolen_de_drie_koornbloemen,_aan_de_Vellevest_van_uit_het_noord-oosten_-_Schiedam_-_20197215_-_RCE.jpg']
},null,2));
