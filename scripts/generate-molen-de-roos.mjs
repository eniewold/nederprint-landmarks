// De Roos Delft, meters Z omhoog; GLB Y omhoog en STL op 1:1000.
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
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molen-de-roos");
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

// De Roos: zeshoekige onderbouw en ronde bovenbouw als bouwdelen.
const ORIGIN=[83883.98,447791.58],BASE=-1;
const ROMP={hexRadius:6.7,hexTopRadius:5.1,hexTop:10.8,roundBase:4.35,rTop:2.75,top:23.0};
const AS={z:24.4,richting:0},WIEK={vlucht:25.35,vlak:4.2,dikte:1,breedte:2.4};
const STELLING={z:12,radius:8.2,plaat:0.9};
const radiusAt=h=>h<10.8?(6.7+(5.1-6.7)*Math.max(h,0)/10.8)*Math.cos(Math.PI/6):4.35+(2.75-4.35)*(h-10.8)/12.2;
let tower=union([frustum(ring(6,6.7),BASE,ring(6,5.1),10.8),frustum(ring(48,4.35),10.79,ring(48,2.75),23)]);
const cuts=[];
// Twee ruime inrijpoorten als blinde nissen, geen horizontale brug boven de opening.
for(const a of [30,210])cuts.push(hull([...box(5.2,6.8,-1.3,1.3,0.1,2.3),...box(5.2,6.8,-0.02,0.02,3.6,3.62)]).rotate([0,0,a]));
for(const [h,angles] of [[4.2,[30,150,270]],[7.8,[30,150,270]],[14.1,[30,150,270]],[18.2,[30,150,270]],[21.1,[30,150,270]]])for(const a of angles){const r=radiusAt(h);cuts.push(hull([...box(r-0.38,r+0.8,-0.5,0.5,h,h+0.9),...box(r-0.38,r+0.8,-0.01,0.01,h+1.6,h+1.61)]).rotate([0,0,a]));}
tower=tower.subtract(union(cuts));
let zKraag=11.1-(8.2-radiusAt(11.1))*Math.tan(50*deg);
for(let i=0;i<8;i++)zKraag=11.1-(8.2-radiusAt(zKraag))*Math.tan(50*deg);
const stage=union([frustum(ring(16,radiusAt(zKraag)),zKraag,ring(16,8.2),11.1),frustum(ring(16,8.2),11.1,ring(16,8.2),12)]);
const cap=hull([...at(ring(32,2.75),23),...at(ring(32,1).map(([u,v])=>[u*3.05,v*2.85]),23.7),...at(ring(32,1).map(([u,v])=>[u*2.5,v*1.8]),24.8),...box(-1.6,1.6,-0.3,0.3,25.69,25.7)]);
const R=WIEK.vlucht/2,u0=WIEK.vlak-0.5,u1=WIEK.vlak+0.5,tips=[],arms=[];
for(const a of [50,130,230,310]){
 const d=[Math.cos(a*deg),Math.sin(a*deg)],n=[-d[1],d[0]],half=1.2;
 const corners=[[-half*n[0],-half*n[1]],[half*n[0],half*n[1]],[R*d[0]+half*n[0],R*d[1]+half*n[1]],[R*d[0]-half*n[0],R*d[1]-half*n[1]]].map(([v,z])=>[v,z+AS.z]);
 arms.push(hull(corners.flatMap(([v,z])=>[[u0,v,z],[u1,v,z]])));
 if(d[1]<0)tips.push({corners:corners.slice(2),d});
}

const axle=hull([...box(1.5,1.6,-0.7,0.7,21.5,25.1),...box(3.4,4.2,-0.7,0.7,23.7,25.1)]);
const tail=hull([...box(-2.8,-1.8,-0.5,0.5,22.8,23.8),...box(-7.8,-6.8,-0.5,0.5,11.8,12.9)]);
const turning=union([cap,...arms,axle,tail]).rotate([0,0,AS.richting]);
// Twee lage dakvolumes binnen hetzelfde BAG-pand, geen DSM-lagen.
const local=p=>p.map(([x,y])=>[x-ORIGIN[0],y-ORIGIN[1]]);
const south=local([[83887.116,447783.346],[83891.182,447776.36],[83895.827,447779.027],[83889.738,447790.168]]);
const north=local([[83875.091,447798.609],[83881.939,447802.548],[83884.678,447797.786],[83877.883,447793.755]]);
const gable=(p,a,b,eave,ridge)=>Manifold.intersection(hull([...at(p,BASE),...at(p,eave),[a[0]-ORIGIN[0],a[1]-ORIGIN[1],ridge],[b[0]-ORIGIN[0],b[1]-ORIGIN[1],ridge]]),prism(p,BASE,15));
let house=gable(south,[83888.2,447786.5],[83893.5,447777.8],4.2,7.2);
let warehouse=gable(north,[83879.2,447795.2],[83878.6,447800.6],4.8,7.0);
// Nissen op de zuidelijke kopgevel en de westelijke magazijngevel.
const houseCuts=[];
for(const v of [-1.1,1.1])houseCuts.push(hull([...box(-0.4,0.8,v-0.45,v+0.45,1.1,2.4),...box(-0.4,0.8,v-0.01,v+0.01,3,3.01)]).rotate([0,0,-60]).translate([9.5,-13.6,0]));
house=house.subtract(union(houseCuts));
const warehouseCuts=[];
for(const v of [-1.4,1.4])warehouseCuts.push(hull([...box(-0.4,0.8,v-0.5,v+0.5,1.3,3.1),...box(-0.4,0.8,v-0.01,v+0.01,3.7,3.71)]).rotate([0,0,210]).translate([-6,6.6,0]));
warehouse=warehouse.subtract(union(warehouseCuts));
const model=union([tower,stage,turning,house,warehouse]);
const nodes=[['building:molen',model]];
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
 console.log(label,JSON.stringify({status:s.status(),genus:s.genus(),triangles:s.numTri(),bounds:s.boundingBox(),volume:s.volume()}));
}
await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,'molen-de-roos.glb'),toGlb(nodes,'NederPrint generate-molen-de-roos.mjs (manifold-3d)'));
const stlName=`molen-de-roos-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),`De Roos Delft 1:${scale}`).buffer);
await writeFile(path.join(outDir,'molen-de-roos.json'),JSON.stringify({
 name:'De Roos',file:'molen-de-roos.glb',unitsPerMetre:1,className:'building',crs:'EPSG:28992',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,
 groundSamplePoints:[[10,0],[0,10],[-8,-8]],replacesBuildings:['NL.IMBAG.Pand.0503100000009662'],
 description:'Zeskante stenen onderbouw met ronde bovenromp, stelling op 12 m, kap met langsnok, staart en verdikte wieken in X-stand aan de oostkant; beide lage aanbouwen van hetzelfde BAG-pand met zadeldaken. RD-assen, voet 1 m onder het maaiveld. Vlucht 25,35 m uit Molendatabase. Oorsprong uit de BAG-boog, dakhoogtes uit AHN; vorm/maten zeskant, kap, ashoogte/asrichting en vensters geschat. Historische scheefstand van de onderbouw niet nagebootst.',
 printFiles:[stlName],realWorld:{flightM:25.35,stageM:12,hexTopM:10.8,hexRadiusM:6.7,rompTopM:23,capM:25.7,axleM:24.4,stageRadiusM:8.2,annexRoofsM:[7.2,7]},
 sources:['https://legacy.molendatabase.nl/nederland/molen.php?nummer=959','https://molenderoos.nl/stichting-molen-de-roos/','PDOK BAG 0503100000009662, AHN DSM/DTM 0,5 m en Actueel_orthoHR, geraadpleegd 2026-10-08','https://commons.wikimedia.org/wiki/File:Delft_De_Roos_seen_from_the_northwest.jpg','https://commons.wikimedia.org/wiki/File:Delft,_Molen_de_Roos_RM12159_IMG_0495_2024-04-07_13.06.jpg']
},null,2));
