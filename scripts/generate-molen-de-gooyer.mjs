// De Gooyer Amsterdam, meters Z omhoog; GLB Y omhoog en STL op 1:1000.
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
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molen-de-gooyer");
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

// De Gooyer: twee houten achtkanten op de vierkante stenen voet.
const ORIGIN=[123599.57,486646.85],BASE=-1;
const ROMP={stoneTop:7.8,lowerApothem:5.3,stageApothem:4.4,topApothem:2.7,top:30.7};
const STELLING={z:17.8,apothem:9.2,plaat:0.9};
const KAP={top:33.2},AS={z:31.8,richting:90};
const WIEK={vlucht:26.6,breedte:2.4,dikte:1,hoek:50,vlak:4.2};
const oct=a=>ring(8,a/Math.cos(Math.PI/8),16.95);
const square=box(-5.5,5.5,-5.5,5.5,BASE,ROMP.stoneTop);
let stone=hull(square);
const cuts=[];
for(const a of [0,90,180,270]){
 for(const v of [-2.4,2.4])cuts.push(Manifold.cylinder(1.2,0.7,0.7,24).rotate([0,90,0]).translate([5.12,v,5.5]).rotate([0,0,a]));
 cuts.push(hull([...box(5.12,6.5,-0.95,0.95,0.15,2.1),...box(5.12,6.5,-0.01,0.01,3.1,3.11)]).rotate([0,0,a]));
}
stone=stone.subtract(union(cuts)).rotate([0,0,-5.55]);
let wood=union([
 frustum(oct(ROMP.lowerApothem),7.8,oct(5.0),8.8),
 frustum(oct(5.0),8.8,oct(ROMP.stageApothem),STELLING.z),
 frustum(oct(ROMP.stageApothem),STELLING.z,oct(ROMP.topApothem),ROMP.top),
]);
const radiusAt=h=>h<17.8?5.0+(4.4-5.0)*(h-8.8)/9:4.4+(2.7-4.4)*(h-17.8)/12.9;
const niches=[];
for(const h of [10.5,14.1,21.0,26.0])for(let a=-5.55;a<350;a+=45){
 const r=radiusAt(h);
 niches.push(hull([...box(r-0.38,r+0.7,-0.5,0.5,h,h+1.2),...box(r-0.38,r+0.7,-0.01,0.01,h+1.8,h+1.81)]).rotate([0,0,a]));
}
wood=wood.subtract(union(niches));
let zKraag=STELLING.z-STELLING.plaat-(STELLING.apothem-radiusAt(STELLING.z))*Math.tan(50*deg);
for(let i=0;i<8;i++)zKraag=STELLING.z-STELLING.plaat-(STELLING.apothem-radiusAt(zKraag))*Math.tan(50*deg);
const stage=union([frustum(oct(radiusAt(zKraag)),zKraag,oct(STELLING.apothem),16.9),frustum(oct(STELLING.apothem),16.9,oct(STELLING.apothem),17.8)]);
const cap=hull([...at(ring(32,2.7),30.7),...at(ring(32,1).map(([u,v])=>[u*3.1,v*2.9]),31.3),...at(ring(32,1).map(([u,v])=>[u*2.5,v*2.1]),32.2),...box(-1.6,1.6,-0.3,0.3,33.19,33.2)]);
const R=WIEK.vlucht/2,u0=WIEK.vlak-0.5,u1=WIEK.vlak+0.5,tips=[],arms=[];
for(const a of [50,130,230,310]){
 const d=[Math.cos(a*deg),Math.sin(a*deg)],n=[-d[1],d[0]],half=1.2;
 const corners=[[-half*n[0],-half*n[1]],[half*n[0],half*n[1]],[R*d[0]+half*n[0],R*d[1]+half*n[1]],[R*d[0]-half*n[0],R*d[1]-half*n[1]]].map(([v,z])=>[v,z+AS.z]);
 arms.push(hull(corners.flatMap(([v,z])=>[[u0,v,z],[u1,v,z]])));
 if(d[1]<0)tips.push({corners:corners.slice(2),d});
}
const axle=hull([...box(1.5,1.6,-0.7,0.7,28.5,32.5),...box(3.4,4.2,-0.7,0.7,31.1,32.5)]);
const tail=hull([...box(-2.8,-1.8,-0.5,0.5,30.5,31.5),...box(-8.5,-7.5,-0.5,0.5,17.6,18.7)]);
const turning=union([cap,...arms,axle,tail]).rotate([0,0,AS.richting]);
const mill=union([stone,wood,stage,turning]);
// Badhuis is bouwkundig een buur; PDOK toont het 10 m te hoog tegen de stelling.
// BAG-outline behouden, dakvlakken/hoogtes uit AHN, als aparte solid/node.
const BATH_RD=[[123609.979,486652.325],[123609.071,486651.427],[123612.059,486648.439],[123607.92,486644.276],[123608.026,486644.169],[123605.369,486641.496],[123606.298,486640.56],[123604.562,486638.814],[123605.738,486637.629],[123602.28,486634.15],[123602.17,486634.039],[123611.006,486625.134],[123611.15,486624.989],[123620.14,486634.029],[123620.01,486634.161],[123626.269,486640.35],[123614.89,486651.73],[123614.9,486651.829],[123609.979,486652.325]];
const bathPoly=BATH_RD.map(([x,y])=>[x-ORIGIN[0],y-ORIGIN[1]]);
const bathClip=prism(bathPoly,BASE,15);
const uvSolid=(solid)=>solid.rotate([0,0,45]);
const southPavilion=uvSolid(hull([...box(-7.3,5.5,-23.6,-19.0,BASE,6.6),...box(1.2,3.0,-21.9,-20.4,9.4,9.5)]));
const eastPavilion=uvSolid(hull([...box(5.5,14.3,-23.5,-16.5,BASE,6.6),...box(5.5,14.3,-23.5,-16.5,6.6,6.9)]));
const porch=uvSolid(hull([...box(10,11.3,-7.5,-3.5,BASE,6.5),...box(10.3,11,-6,-5.5,7.1,7.2)]));
let bath=union([prism(bathPoly,BASE,3.65),southPavilion,eastPavilion,porch]).intersect(bathClip);
// Grote blinde vensters langs de buitenzijde van het lage badhuis.
const bathCuts=[];
for(const u of [-5,-1,3,7,11])bathCuts.push(uvSolid(hull([...box(u-0.6,u+0.6,-24.2,-23.22,0.9,2.2),...box(u-0.01,u+0.01,-24.2,-23.22,2.9,2.91)])));
bath=bath.subtract(union(bathCuts));
const model=union([mill,bath]);
const nodes=[['building:molen',mill],['building:badhuis',bath]];
const steun=union(tips.map(({corners,d})=>{
 const p=corners.flatMap(([v,z])=>[-0.3,0.05].map(k=>[v+k*d[0],z+k*d[1]]));return hull(p.flatMap(([v,z])=>[[u0,v,z],[u1,v,z],[u0,v,BASE],[u1,v,BASE]]));
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






for(const [label,s] of [['molen',mill],['badhuis',bath],['print',printModel]]) {
 if(s.status()!=='NoError')throw new Error(label+': '+s.status());
 console.log(label,JSON.stringify({status:s.status(),genus:s.genus(),triangles:s.numTri(),bounds:s.boundingBox(),volume:s.volume()}));
}
await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,'molen-de-gooyer.glb'),toGlb(nodes,'NederPrint generate-molen-de-gooyer.mjs (manifold-3d)'));
const stlName=`molen-de-gooyer-1-${scale}.stl`,plateName=`molen-de-gooyer-grondplaat-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(union([mill,steun]).translate([0,0,-BASE]),`De Gooyer Amsterdam 1:${scale}`).buffer);
const bb=model.boundingBox(),plate=hull(box(bb.min[0]-1,bb.max[0]+1,bb.min[1]-1,bb.max[1]+1,-2,BASE));
await writeFile(path.join(outDir,plateName),toStl(union([printModel,plate]).translate([0,0,2]),`De Gooyer en badhuis Amsterdam 1:${scale}`).buffer);
await writeFile(path.join(outDir,'molen-de-gooyer.json'),JSON.stringify({
 name:'De Gooyer',file:'molen-de-gooyer.glb',unitsPerMetre:1,className:'building',crs:'EPSG:28992',origin:ORIGIN,xAxis:[1,0],groundOffsetMetres:0,
 groundSamplePoints:[[-10,0],[-8,-8],[0,9]],replacesBuildings:['NL.IMBAG.Pand.0363100012169758','NL.IMBAG.Pand.0363100012169757'],
 description:'Twee houten achtkanten op de vierkante stenen BAG-voet; RD-assen, voet 1 m onder het maaiveld, kap/as naar het noorden geschat uit AHN en luchtfoto. Het afzonderlijke badhuis met dakdelen op AHN-hoogte vervangt tevens zijn te hoge PDOK-reconstructie tegen de stelling. Kap, ashoogte, octantknik en vensterverdeling geschat; wieken en stelling printvriendelijk verdikt.',
 printFiles:[stlName,plateName],realWorld:{flightM:26.6,stageM:17.8,stoneTopM:7.8,rompTopM:30.7,capM:33.2,axleM:31.8,baseSideM:11,stageApothemM:9.2,bathRoofM:[3.65,6.9,7.2,9.5]},
 sources:['https://stadsherstel.nl/monumenten/funenkade-5-molen-de-gooyer/','https://nl.wikipedia.org/wiki/De_Gooyer_(Amsterdam)','PDOK BAG 0363100012169758 en 0363100012169757, AHN DSM/DTM 0,5 m en Actueel_orthoHR, geraadpleegd 2026-10-08','https://commons.wikimedia.org/wiki/File:Amsterdam_De_Gooyer_04.jpg','https://commons.wikimedia.org/wiki/File:Amsterdam_De_Gooyer_08.jpg'],
},null,2));
