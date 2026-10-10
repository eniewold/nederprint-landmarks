// Stormvloedkering Hollandse IJssel en Algerabrug: BGT-prisma's en AHN-profielen.
// Vaste BGT-data onderaan, PDOK CC0. Opstand en gevelritme: RCE/Jan van Galen CC BY-SA 4.0.
import Module from 'manifold-3d';
import {Manifold,box,prism,rect,hull,ring3,union,gableRoof,ribbon,check,writeLandmark,toStl,flag} from './efteling-kit.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
// lib/server/overhang-support.ts


// lib/mesh.ts
function withGeometry(source, positions, indices) {
  return {
    id: source.id,
    name: source.name,
    className: source.className,
    // Blijft mee door elke bewerking heen, zodat kleurregels op attribuut-
    // waarde ook gelden voor vereenvoudigde en geknipte meshes.
    ...source.attributes ? { attributes: source.attributes } : {},
    positions,
    indices
  };
}

// lib/server/overhang-support.ts
var SUPPORT_LAYER_HEIGHT_MM = 0.2;
var MIN_SUPPORT_WIDTH_MM = 0.8;
var MAX_SUPPORT_LAYERS = 4e3;
function overhangSupportOptions(maxOverhangDegrees) {
  return {
    maxOverhangDegrees,
    layerHeightMm: SUPPORT_LAYER_HEIGHT_MM,
    minSupportWidthMm: MIN_SUPPORT_WIDTH_MM
  };
}
function supportedSolid(solids, mesh, baseZ, options, outline) {
  const { Manifold: Solid, Mesh: SolidMesh } = solids;
  const handles = [];
  const keep = (handle) => {
    handles.push(handle);
    return handle;
  };
  try {
    const input = new SolidMesh({
      numProp: 3,
      vertProperties: new Float32Array(mesh.positions),
      triVerts: new Uint32Array(mesh.indices)
    });
    input.merge();
    const whole = keep(new Solid(input));
    if (whole.status() !== "NoError" || whole.isEmpty()) return null;
    const within = (polygon) => {
      const { min, max } = whole.boundingBox();
      const section = keep(new solids.CrossSection([polygon], "NonZero"));
      const prism = keep(
        keep(Solid.extrude(section, max[2] - min[2] + 2)).translate([
          0,
          0,
          min[2] - 1
        ])
      );
      return keep(whole.intersect(prism));
    };
    const solid = outline ? within(outline) : whole;
    if (solid.status() !== "NoError" || solid.isEmpty()) return null;
    const bounds = solid.boundingBox();
    const minZ = bounds.min[2];
    const maxZ = bounds.max[2];
    if (!(maxZ > baseZ)) return null;
    const layerHeight = Math.max(
      options.layerHeightMm,
      (maxZ - baseZ) / MAX_SUPPORT_LAYERS
    );
    const step = layerHeight * Math.tan(options.maxOverhangDegrees * Math.PI / 180);
    const minimumArea = step * step * 0.01;
    const footprint = keep(
      solid.slice(minZ + Math.min(layerHeight, (maxZ - minZ) / 2) / 2)
    );
    const parts = [solid];
    if (minZ > baseZ && !footprint.isEmpty()) {
      parts.push(
        keep(
          Solid.extrude(footprint, minZ - baseZ + layerHeight / 2).translate([
            0,
            0,
            baseZ
          ])
        )
      );
    }
    const inset = layerHeight * 0.02;
    const sturdyRadius = options.minSupportWidthMm / 2;
    const hangingArea = Math.max(minimumArea, sturdyRadius * sturdyRadius);
    const lineRadius = sturdyRadius / 2;
    const reach = step * 1.05;
    const thickerBy = step * 0.1;
    const attach = reach + options.minSupportWidthMm;
    const sliceAt = (z) => z >= minZ ? keep(solid.slice(z)) : footprint;
    const halfWidth = (section, limit, tolerance) => {
      let fits = 0;
      let tooWide = limit;
      while (tooWide - fits > tolerance) {
        const radius = (fits + tooWide) / 2;
        if (keep(section.offset(-radius, "Miter", 2)).isEmpty()) {
          tooWide = radius;
        } else {
          fits = radius;
        }
      }
      return tooWide;
    };
    const footLayers = Math.max(
      2,
      Math.ceil(options.minSupportWidthMm * 1.5 / step)
    );
    const pending = [];
    const emit = (entry) => {
      if (!entry.fill) return;
      const missing = Math.max(
        keep(entry.fill.subtract(entry.lower)).area(),
        keep(entry.fill.subtract(entry.middle)).area(),
        keep(entry.fill.subtract(entry.upper)).area()
      );
      if (missing > minimumArea) {
        parts.push(
          keep(
            Solid.extrude(entry.fill, entry.top - entry.bottom).translate([
              0,
              0,
              entry.bottom
            ])
          )
        );
      }
    };
    const footed = (piece, sturdy) => {
      if (pending.length < footLayers) return null;
      const limit = footLayers * step;
      const beyond = (radius) => keep(piece.subtract(keep(sturdy.offset(radius, "Miter", 2)))).area() > minimumArea;
      if (beyond(limit)) return null;
      let fits = limit;
      let tooClose = 0;
      while (fits - tooClose > step / 8) {
        const radius = (fits + tooClose) / 2;
        if (beyond(radius)) tooClose = radius;
        else fits = radius;
      }
      const layers = Math.max(1, Math.ceil(fits / step - 1e-6));
      const cone = (index) => keep(
        keep(piece.offset((layers - index) * step, "Miter", 2)).intersect(
          keep(sturdy.offset(index * step, "Miter", 2))
        )
      );
      const base = cone(0);
      if (keep(base.offset(-lineRadius, "Miter", 2)).isEmpty()) return null;
      const column = keep(piece.offset(step * 0.1, "Miter", 2));
      const beside = keep(column.offset(reach, "Miter", 2));
      for (let index = 1; index <= layers; index += 1) {
        const entry = pending[pending.length - index];
        if (index < layers) {
          const there = keep(entry.layer.intersect(beside));
          if (keep(there.subtract(column)).area() > minimumArea) return null;
          if (keep(entry.own.intersect(beside)).area() > minimumArea) {
            return null;
          }
        } else {
          const resting = keep(
            entry.layer.intersect(keep(column.offset(reach * 2, "Miter", 2)))
          );
          const held = keep(cone(layers - 1).offset(reach, "Miter", 2));
          if (keep(resting.subtract(held)).area() > minimumArea) return null;
        }
      }
      for (let index = 1; index < layers; index += 1) {
        const entry = pending[pending.length - index];
        const shape = cone(index);
        const rest = entry.fill ? keep(entry.fill.subtract(column)) : null;
        entry.fill = rest ? keep(rest.add(shape)) : shape;
        entry.layer = keep(keep(entry.layer.subtract(column)).add(shape));
      }
      return base;
    };
    let above = null;
    let aboveLower = null;
    let aboveUpper = null;
    let aboveFill = null;
    let carry = null;
    for (let top = maxZ; top > baseZ + 1e-9; top -= layerHeight) {
      const bottom = Math.max(baseZ, top - layerHeight);
      const lower = sliceAt(bottom + inset);
      const middle = sliceAt((bottom + top) / 2);
      const upper = sliceAt(top - inset);
      const own = keep(lower.add(upper));
      let fill = null;
      if (aboveLower && aboveUpper && carry) {
        const aboveBottom = aboveFill ? keep(aboveLower.add(aboveFill)) : aboveLower;
        const through = keep(keep(lower.intersect(middle)).intersect(upper));
        let hangs = keep(
          aboveBottom.subtract(keep(through.offset(reach, "Miter", 2)))
        );
        const stepped = keep(aboveUpper.subtract(upper));
        if (stepped.area() > minimumArea) {
          const beyond = keep(
            stepped.subtract(keep(upper.offset(reach, "Miter", 2)))
          );
          if (beyond.area() > minimumArea) hangs = keep(hangs.add(beyond));
        }
        if (hangs.area() > minimumArea) {
          const needed = keep(
            keep(
              carry.intersect(keep(hangs.offset(attach, "Miter", 2)))
            ).simplify(step * 0.05)
          );
          if (!needed.isEmpty()) fill = needed;
        }
      }
      const candidate = fill ? keep(own.add(fill)) : own;
      if (above && keep(above.subtract(candidate)).area() > minimumArea) {
        const sturdy = keep(
          keep(
            keep(candidate.offset(-sturdyRadius, "Miter", 2)).offset(
              sturdyRadius,
              "Miter",
              2
            )
          ).intersect(candidate)
        );
        const near = keep(sturdy.offset(reach, "Miter", 2));
        const loose = keep(above.intersect(near)).decompose().filter((piece) => {
          const area = keep(piece).area();
          return area > minimumArea && keep(piece.intersect(sturdy)).area() < area * 0.25;
        });
        const unsturdy = loose.length ? keep(
          keep(above.subtract(near)).add(
            keep(solids.CrossSection.union(loose))
          )
        ) : keep(above.subtract(near));
        let hanging = unsturdy;
        if (unsturdy.area() > hangingArea) {
          const thin = keep(
            keep(candidate.subtract(sturdy)).intersect(
              keep(unsturdy.offset(reach, "Miter", 2))
            )
          ).decompose().filter((piece) => keep(piece).area() > minimumArea);
          let nearSturdy = null;
          const carrying = thin.filter((piece) => {
            const resting = keep(
              unsturdy.intersect(keep(piece.offset(reach, "Miter", 2)))
            );
            if (resting.isEmpty()) return false;
            nearSturdy ??= keep(sturdy.offset(sturdyRadius * 2, "Miter", 2));
            if (keep(resting.subtract(nearSturdy)).area() <= minimumArea) {
              return true;
            }
            if (!keep(resting.offset(-sturdyRadius, "Miter", 2)).isEmpty()) {
              return false;
            }
            const width = halfWidth(piece, sturdyRadius, thickerBy / 4);
            return keep(
              resting.offset(-(width + thickerBy), "Miter", 2)
            ).isEmpty();
          });
          if (carrying.length) {
            hanging = keep(
              unsturdy.subtract(
                keep(
                  keep(solids.CrossSection.union(carrying)).offset(
                    reach,
                    "Miter",
                    2
                  )
                )
              )
            );
          }
          if (hanging.area() > hangingArea) {
            const printable = hanging.decompose().filter(
              (piece) => !keep(keep(piece).offset(-lineRadius, "Miter", 2)).isEmpty()
            );
            const bases = [];
            const columns = [];
            const standing = printable.filter((piece) => {
              const base = footed(piece, sturdy);
              if (base) {
                bases.push(base);
                columns.push(piece);
                return false;
              }
              return !keep(
                keep(piece.subtract(near)).offset(-lineRadius, "Miter", 2)
              ).isEmpty();
            });
            if (bases.length) {
              const base = keep(solids.CrossSection.union(bases));
              const column = keep(
                keep(solids.CrossSection.union(columns)).offset(
                  step * 0.1,
                  "Miter",
                  2
                )
              );
              fill = fill ? keep(keep(fill.subtract(column)).add(base)) : base;
            }
            hanging = keep(
              keep(
                keep(
                  keep(solids.CrossSection.union(standing)).offset(
                    reach * 1.5,
                    "Miter",
                    2
                  )
                ).intersect(above)
              ).simplify(step * 0.05)
            );
          }
        }
        if (hanging.area() > hangingArea) {
          fill = fill ? keep(fill.add(hanging)) : hanging;
        }
      }
      const layer = fill ? keep(own.add(fill)) : own;
      pending.push({ fill, own, lower, middle, upper, layer, bottom, top });
      if (pending.length > footLayers) emit(pending.shift());
      if (layer.isEmpty()) {
        above = null;
        aboveLower = null;
        aboveUpper = null;
        aboveFill = null;
        carry = null;
        continue;
      }
      above = layer;
      aboveLower = lower;
      aboveUpper = upper;
      aboveFill = fill;
      const next = keep(
        keep(layer.offset(-step, "Miter", 2)).simplify(step * 0.05)
      );
      carry = next.isEmpty() ? null : next;
      if (top < minZ) {
        const outside = keep(layer.subtract(footprint));
        if (outside.area() <= minimumArea) break;
      }
    }
    for (const entry of pending) emit(entry);
    const result = keep(Solid.union(parts));
    if (result.status() !== "NoError" || result.isEmpty()) return null;
    const output = result.getMesh();
    const stride = output.numProp;
    const count = output.vertProperties.length / stride;
    const positions = new Float64Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = output.vertProperties[index * stride];
      positions[index * 3 + 1] = output.vertProperties[index * stride + 1];
      positions[index * 3 + 2] = output.vertProperties[index * stride + 2];
    }
    return withGeometry(mesh, positions, Uint32Array.from(output.triVerts));
  } catch {
    return null;
  } finally {
    for (const handle of handles) handle.delete();
  }
}

const slug='kering-hollandse-ijssel',BASE=-.8,origin=[99433.62,436831.25],xAxis=[.9395,-.3425];
const profileY=(p,y0,y1)=>prism(p,0,y1-y0).rotate([90,0,0]).translate([0,y1,0]);
const towerCentres=[[-42.15,66.43],[42.2,66.78],[-41.85,-68.52],[42.7,-68.24]];
const towers=[];
for(const[u,v]of towerCentres){
 const parts=[box(u-2.65,v-4.65,BASE,u+2.65,v+4.65,27.1),
 hull([...ring3(rect(u-2.65,v-4.65,u+2.65,v+4.65),26.7),...ring3(rect(u-5.55,v-5.6,u+5.55,v+5.6),33.4)]),
 box(u-5.55,v-5.6,33.3,u+5.55,v+5.6,42.65),
 gableRoof(11.5,11.6,42.55,44.64).translate([u,v,0]),
 box(u-5.6,v-6.1,BASE,u+5.6,v+6.1,3.5)];
 // Bordessen met afgeschuinde onderzijde, zodat de 0,9m uitkraging zelf draagt.
 for(const z of [33.35,38.1])parts.push(hull([...ring3(rect(u-5.55,v-5.6,u+5.55,v+5.6),z-1),...ring3(rect(u-6.45,v-6.5,u+6.45,v+6.5),z)]).add(box(u-6.45,v-6.5,z-.01,u+6.45,v+6.5,z+.35)));
 // Machinekamerramen als blinde nissen met robuuste middenstijlen.
 let body=union(parts),cuts=[];
 for(const side of [-1,1])for(const z of [33.9,38.4])for(const dv of [-3,-1,1,3])cuts.push(box(u+side*5.55-(side>0?.35:.2),v+dv-.58,z,u+side*5.55+(side<0?.35:.2),v+dv+.58,z+3.25));
 for(const z of [5.7,12.4,19.1,24.1])for(const side of [-1,1])cuts.push(box(u-.45,v+side*4.65-.4,z,u+.45,v+side*4.65+.4,z+1.5));
 body=body.subtract(union(cuts));
 // Zigzagtrappen tegen de buitengevel: gesloten schuine bouwdelen, 0,9 m.
 const external=u+(u<0?-3.15:3.15),stairs=[];
 for(let k=0;k<7;k++){
  const z=3.5+5.1*k,sg=k%2?1:-1;
  stairs.push(ribbon([[external,v-3.7*sg,z],[external,v+3.7*sg,z+5.1]],1.05,1.0));
  stairs.push(box(external-.6,v+3.7*sg-.9,z+4.3,external+.6,v+3.7*sg+.9,z+5.25));
 }
 towers.push(union([body,...stairs]));
}
const gates=[];
for(const v of [62.65,-72.45]){
 const p=[box(-39,v-.55,8.4,39,v+.55,19.9)];
 // Werkelijke gebogen achterspant met acht vakken; balken ≥ 0,9 m.
 const curve=(u)=>v+1.1+5.0*(1-(u/39)**2);
 const stations=Array.from({length:17},(_,k)=>-39+78*k/16);
 for(const z of [9,19.5])p.push(ribbon(stations.map(u=>[u,curve(u),z]),1.0,1.0));
 for(let k=0;k<8;k++){
  const a=-39+k*9.75,b=a+9.75;
  p.push(ribbon([[a,curve(a),9],[b,curve(b),19.5]],1,1));
  p.push(ribbon([[a,curve(a),19.5],[b,curve(b),9]],1,1));
 }
 for(const u of [-38.5,38.5])p.push(box(u-.55,v-.75,3.3,u+.55,v+1.7,41.8));
 gates.push(union(p));
}
// BGT-wegdelen volgen één doorlopend brugprofiel, gemeten P30 in DSM.
// Eindramp buiten de laatste AHN-pixels: de laatste 10 m lineair geëxtrapoleerd.
const deckKnots=[[-115,8.68],[-80,9.43],[-35,9.94],[0,10.08],[25,9.95],[85,9.03],[120,8.51],[180,7.03],[255,5.04]];
const deckEnvelope=profileY([[-130,BASE],[270,BASE],...deckKnots.toReversed(),[-130,8.4]],-160,100);
const skinEnvelope=profileY([...deckKnots.map(([u,z])=>[u,z-.5]),...deckKnots.toReversed()],-160,100);
const roadData=bgtRoads(),roadFootprints=roadData.map(r=>union(r.polygons.map(poly=>{
 let s=prism(poly[0],BASE,50);for(const hole of poly.slice(1))s=s.subtract(prism(hole,BASE-1,51));return s;
})));
const bridgeBody=union(roadFootprints).intersect(deckEnvelope).subtract(skinEnvelope);
const roads=[];let previous=null;
for(let i=0;i<roadData.length;i++){
 let solid=roadFootprints[i].intersect(skinEnvelope);if(previous)solid=solid.subtract(previous);
 roads.push(solid);previous=previous?previous.add(solid):solid;
}
// Vaste vakwerkbrug: lichte toog met zes driehoeksvakken, 0,9m staven.
const truss=[],stations=Array.from({length:7},(_,k)=>-37.5+75*k/6),arc=(u)=>10.5+5.4*(1-(u/37.5)**2);
for(const v of [-38.7,-30.2]){
 truss.push(ribbon(stations.map(u=>[u,v,arc(u)]),1.05,1.05));
 for(let k=0;k<6;k++){const a=stations[k],b=stations[k+1];truss.push(ribbon([[a,v,10],[b,v,arc(b)]],.95,.95));truss.push(ribbon([[a,v,arc(a)],[b,v,10]],.95,.95));}
}
const bankWalls=[];
for(const [a,b]of [[-47.5,-37],[37,47.5]])bankWalls.push(box(a,-75,BASE,a+.9,74,3.5),box(b-.9,-75,BASE,b,74,3.5),box(a,-75,BASE,b,-74.1,3.5),box(a,73.1,BASE,b,74,3.5));
const construct=union([...towers,...gates,bridgeBody,...truss,...bankWalls]).subtract(union(roads));
const NAP_DATUM=2.863,MODEL_BASE=BASE-NAP_DATUM;
const nodes=[['building:heftorens-schuiven-en-brugconstructie',construct],...roads.map((r,i)=>['road:'+roadData[i].attributes.bgt_functie+'-'+i,r])].map(([name,m])=>[name,m.translate([0,0,-NAP_DATUM])]);
check(nodes,MODEL_BASE);
const all=union(nodes.map(n=>n[1])),sum=nodes.reduce((s,n)=>s+n[1].volume(),0);
if(Math.abs(sum-all.volume())>1e-4)throw Error('Overlappende materiaalvolumes');
await writeLandmark({slug,nodes,base:MODEL_BASE,catalog:{
 name:'Stormvloedkering Hollandse IJssel',origin,xAxis,groundOffsetMetres:0,groundHeight:46.455861,groundSamplePoints:[[-46,0],[-44,0]],
 replacesBuildings:['NL.IMBAG.Pand.0542100000650442','NL.IMBAG.Pand.0542100000652206'],
 replacesTerrain:['G0502.1d2e2605418a1102e0531f050e0a4efd','L0002.bf07a1efd1c84ad8aeae19717e2e059f'],
 description:'Vier heftorens, twee geheven stalen schuiven met gebogen vakwerken en Algerabrug met afzonderlijke BGT-wegdelen; doorlopende dak- en dekprofielen.',
 realWorld:{towerNapM:44.64,gateHeightM:11.5,gateClearanceNapM:8.4,gateWidthM:78,estimated:['zigzagtrappen en raamritme','vakwerkstaven verdikt tot 0,95 m','laatste tien meter oostelijke dekhelling']},
 sources:['PDOK BGT/BAG en AHN DSM 0,5 m, bbox 99200,436660,99630,437020','https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/deltawerken/hollandsche-ijsselkering','https://commons.wikimedia.org/wiki/File:Vogelvluchtperspectief_van_de_stormvloedkering_in_de_Hollandse_IJssel_-_Krimpen_aan_den_IJssel_-_20398120_-_RCE.jpg']
}});
// BGT-attributen horen bij de weg-node, zodat thema's en gedeelde printopvulling werken.
const out=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),glbPath=path.join(out,slug+'.glb');
const rawGlb=await readFile(glbPath),len=rawGlb.readUInt32LE(12),doc=JSON.parse(rawGlb.subarray(20,20+len).toString());
for(let i=1;i<doc.nodes.length;i++)doc.nodes[i].extras={attributes:roadData[i-1].attributes};
let js=Buffer.from(JSON.stringify(doc));js=Buffer.concat([js,Buffer.alloc((4-js.length%4)%4,32)]);
const tail=rawGlb.subarray(20+len),head=Buffer.from(rawGlb.subarray(0,20));head.writeUInt32LE(20+js.length+tail.length,8);head.writeUInt32LE(js.length,12);
await writeFile(glbPath,Buffer.concat([head,js,tail]));
// Dezelfde offline 45°-opvulling als de webshop, gecombineerd over alle onderdelen.
const wasm=await Module();wasm.setup();const raw=all.getMesh(),positions=new Float64Array(raw.vertProperties.length/raw.numProp*3);
for(let i=0;i<positions.length/3;i++)for(let j=0;j<3;j++)positions[i*3+j]=raw.vertProperties[i*raw.numProp+j];
const supported=supportedSolid(wasm,{id:slug,name:slug,className:'building',positions,indices:Uint32Array.from(raw.triVerts)},MODEL_BASE,overhangSupportOptions(45));
if(!supported)throw Error('Printopvulling mislukt');
const mesh=new wasm.Mesh({numProp:3,vertProperties:new Float32Array(supported.positions),triVerts:supported.indices});mesh.merge();
const print=new wasm.Manifold(mesh);const bb=print.boundingBox();
const plate=wasm.Manifold.cube([bb.max[0]-bb.min[0]+2,bb.max[1]-bb.min[1]+2,1.02]).translate([bb.min[0]-1,bb.min[1]-1,MODEL_BASE-1]);
const pieces=print.add(plate).translate([0,0,1-MODEL_BASE]).decompose().filter(p=>p.volume()>.001);
if(pieces.length!==1)throw Error('Losse printdelen');const final=pieces[0];
await writeFile(path.join(out,slug+'-1-1000.stl'),toStl(final,'Hollandse IJsselkering 1:1000 mm Z-up').buffer);
console.log('Print',final.status(),final.boundingBox(),'extraM3',print.volume()-all.volume());
// PDOK BGT, CC0; exacte wegcontouren in het hierboven beschreven RD-stelsel.

function bgtRoads(){return [{"id":"G0502.1d2e2604750e1102e0531f050e0a4efd","polygons":[[[[-92.436,-30.982],[-92.461,-26.328],[-95.04,-26.32],[-95.975,-26.323],[-106.023,-26.371],[-106.001,-31.048],[-95.958,-31.0],[-95.011,-30.996],[-92.436,-30.982]]]],"attributes":{"bgt_functie":"rijbaan lokale weg","bgt_fysiekvoorkomen":"gesloten verharding"}},{"id":"G0502.1d2e2604ef161102e0531f050e0a4efd","polygons":[[[[-94.967,-38.316],[-95.93,-38.32],[-105.966,-38.359],[-105.944,-43.027],[-95.912,-43.001],[-94.938,-42.999],[-92.373,-42.996],[-92.396,-38.301],[-94.967,-38.316]]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding"}},{"id":"G0502.1d2e260540361102e0531f050e0a4efd","polygons":[[[[-106.001,-31.048],[-105.966,-38.359],[-95.93,-38.32],[-94.967,-38.316],[-92.396,-38.301],[-92.436,-30.982],[-95.011,-30.996],[-95.958,-31.0],[-106.001,-31.048]]]],"attributes":{"bgt_functie":"rijbaan lokale weg","bgt_fysiekvoorkomen":"gesloten verharding"}},{"id":"G0542.77a885c953cc4404b93b294dd5f4fc4e","polygons":[[[[165.928,-58.71],[179.587,-63.883],[193.211,-69.988],[208.992,-77.849],[224.149,-86.032],[236.66,-92.772],[246.128,-97.99],[246.154,-97.946],[247.34,-96.0],[248.235,-94.532],[248.642,-93.864],[250.441,-90.909],[252.081,-88.218],[252.694,-87.212],[252.851,-86.954],[254.273,-84.62],[254.299,-84.578],[245.017,-79.578],[229.623,-71.212],[219.879,-66.071],[208.339,-59.952],[198.354,-55.144],[189.584,-51.275],[180.969,-47.583],[172.047,-43.754],[163.779,-41.004],[154.242,-38.063],[144.477,-35.505],[127.683,-31.753],[113.686,-29.405],[101.3,-28.057],[90.587,-27.315],[78.244,-26.986],[64.416,-26.683],[64.415,-22.198],[61.333,-22.151],[61.202,-24.35],[47.085,-24.344],[38.079,-24.44],[19.14,-24.517],[-1.674,-24.691],[-21.359,-24.714],[-41.625,-24.695],[-54.992,-24.71],[-73.991,-24.751],[-81.045,-25.215],[-81.081,-23.1],[-83.315,-23.11],[-83.186,-24.792],[-83.147,-25.303],[-92.486,-26.249],[-114.392,-26.303],[-114.513,-43.611],[-107.005,-43.272],[-92.297,-43.203],[-83.244,-43.721],[-83.237,-44.267],[-83.216,-45.918],[-83.216,-45.947],[-80.939,-46.045],[-80.856,-44.668],[-71.83,-44.539],[-57.748,-44.56],[-42.022,-44.434],[-32.561,-44.52],[-14.922,-44.448],[1.683,-44.368],[18.054,-44.323],[37.037,-44.315],[50.106,-44.296],[61.223,-44.285],[61.238,-46.153],[64.514,-46.024],[64.376,-42.397],[75.151,-42.529],[89.739,-43.153],[102.162,-44.22],[116.653,-45.954],[128.583,-48.068],[142.877,-51.372],[154.641,-54.858],[165.928,-58.71]],[[-95.912,-43.001],[-105.944,-43.027],[-105.966,-38.359],[-106.001,-31.048],[-106.023,-26.371],[-95.975,-26.323],[-95.04,-26.32],[-92.37,-26.31],[-92.359,-30.982],[-92.341,-38.306],[-92.331,-42.993],[-94.938,-42.999],[-95.912,-43.001]]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding"}}];}
