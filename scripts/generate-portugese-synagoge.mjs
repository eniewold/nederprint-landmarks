// Offline reconstructie: BAG-voetafdruk, AHN-profielen en LoD2.2 dakvlakken,
// aangevuld met gevels en voorhof naar RCE-foto's. Geen hoogteplakken.
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import Module from 'manifold-3d';
import {Manifold,prism,box,hull,ring3,rect,hipRoof,union,dome,writeLandmark,toStl,flag,downFaces} from './efteling-kit.mjs';
// Dezelfde 45°-printopvulling als de webshop; offline ingebed uit overhang-support.ts.
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

const slug='portugese-synagoge', BASE=-.3, GROUND=1.85;
const z=nap=>nap-GROUND;
const ORIGIN=[122179.747,486737.966], AXIS=[.87467,-.48472];
const profile=[[-14.35,20.80],[-13.35,20.80],[-10.20,25.10],[-6.85,21.10],[-2.90,24.90],[0,23.15],[2.45,24.90],[6.20,21.16],[9.75,25.10],[13,20.80],[14.35,20.80]];
// Eén doorlopend dwarsprofiel; beide korte schildvlakken zijn halfvlakken.
let roof=prism([[-14.35,z(20.4)],...profile.map(([v,h])=>[v,z(h)]),[14.35,z(20.4)]],-18.55,18.55).rotate([90,0,90]);
// (profile-X, profile-Y, extrusie-Z) -> (extrusie, dwars, hoogte).
const hipSlope=1.0,hipNormal=Math.hypot(hipSlope,1),hipOffset=(-hipSlope*18.55-z(20.8))/hipNormal;
roof=roof.trimByPlane([-hipSlope/hipNormal,0,-1/hipNormal],hipOffset).trimByPlane([hipSlope/hipNormal,0,-1/hipNormal],hipOffset);
let walls=box(-18.55,-14.35,BASE,18.55,14.35,z(20.8));
const cuts=[];
// Een blinde nis van 0,35 m; bovenlichten en boogramen blijven in de wand.
function niche(width,bottom,top,arch){
  const pts=[[-width/2,bottom],[width/2,bottom],[width/2,top-(arch?width/2:0)]];
  if(arch)for(let i=0;i<=12;i++){const a=i*Math.PI/12;pts.push([width/2*Math.cos(a),top-width/2+width/2*Math.sin(a)]);}
  else pts.push([-width/2,top]);
  pts.push([-width/2,top-(arch?width/2:0)]);
  return prism(pts,0,.40).rotate([90,0,0]);
}
for(const s of[-1,1]){
  for(const u of[-15,-10,-5,0,5,10,15])for(const [a,b,arched]of[[7.1,14.05,true],[15.5,18.75,false]])
    cuts.push(niche(2.35,z(a),z(b),arched).translate([u,-14.00,0]).rotate([0,0,s<0?0:180]));
  for(const v of[-10.4,-5.2,0,5.2,10.4])for(const[a,b,arched]of[[7.1,14.05,true],[15.5,18.75,false]])
    cuts.push(niche(2.4,z(a),z(b),arched).translate([v,s>0&&Math.abs(v)<7?-19.85:-18.20,0]).rotate([0,0,s<0?-90:90]));
}
walls=walls.subtract(union(cuts));
const main=[walls,roof];
// BAG-steunberen en de doorlopende, afgeschuinde kroonlijst.
for(const s of[-1,1])for(const u of[-17.65,-6.4,6.4,17.65])main.push(box(u-.65,s<0?-15.45:14.15,BASE,u+.65,s<0?-14.15:15.45,z(21.7)));
for(const s of[-1,1])for(const v of[-13,-7.15,7.15,13])main.push(box(s<0?-19.65:18.3,v-.65,BASE,s<0?-18.3:19.65,v+.65,z(21.7)));
main.push(hull([...ring3(rect(-18.6,-14.4,18.6,14.4),z(19.45)),...ring3(rect(-19.1,-14.9,19.1,14.9),z(20.1))]));
// Parapet heeft dichte middenvelden en verdiept balusterreliëf bij de hoeken.
let parapet=box(-19.1,-14.9,z(20.05),19.1,14.9,z(21.65)).subtract(box(-17.8,-13.6,z(20),17.8,13.6,z(22)));
const relief=[];
for(const s of[-1,1])for(const u of[-16,-14.5,14.5,16])relief.push(box(u-.25,-15.05,z(20.3),u+.25,-14.65,z(21.25)).rotate([0,0,s<0?0:180]));
parapet=parapet.subtract(union(relief));main.push(parapet);
// Dakurnen worden verdikt tot 0,9 m; geen losse vlaggen of raamlijsten.
for(const s of[-1,1])for(const u of[-17.65,-6.4,6.4,17.65])main.push(dome([u,s*14.7],[[.5,z(21.65)],[.6,z(21.9)],[.48,z(22.65)],[.45,z(22.9)]],12));
// Entreeportaal aan het voorhof, met ondersteunde omlijsting en blinde deur.
let portal=box(-20.1,-2.1,BASE,-18.3,2.1,z(7.05));
portal=portal.subtract(niche(2.45,z(2.2),z(5.8),true).translate([0,-19.75,0]).rotate([0,0,-90]));main.push(portal);
// Achteraanbouwen, zichtbaar op BAG, orthofoto en RCE-achtergevel.
for(const v of[-10.15,9.9])main.push(box(18.4,v-3.15,BASE,24.15,v+3.15,z(9.88)));
main.push(box(18.4,-6.5,BASE,20.2,6.5,z(20.8)));
// Lage dienstgebouwen vormen het complete U-vormige voorhof.
const west=[[-56.18,-21.16],[-36.94,-21.53],[-33.19,-16.78],[-35.5,-13.06],[-35.84,13.12],[-33.51,17.04],[-35.28,21.76]];
let wings=prism(west,BASE,z(5.20));
const wingRoofs=[];
// De westvleugel is deels vlak met vier veelhoekige daklichten.
const frontRoofSlope=1.0,frontN=Math.hypot(frontRoofSlope,1);
wingRoofs.push(prism(west,z(5.17),z(7.7)).trimByPlane([-frontRoofSlope/frontN,0,-1/frontN],(35.7*frontRoofSlope-z(5.2))/frontN));
for(const[y,x]of[[-12,-44],[-5,-42],[3,-40],[10,-39.5]])wingRoofs.push(dome([x,y],[[1.15,z(7.65)],[1.15,z(8.1)],[.35,z(9.0)]],8));
const north=[[-35.28,21.76],[-35.84,17.05],[17.56,16.22],[17.6,20.81]];
const south=[[-47.35,-21.35],[-1.81,-21.64],[-1.72,-17.93],[-21.34,-17.95],[-21.33,-16.89],[-33.19,-16.78],[-36.94,-21.53]];
wings=union([wings,prism(north,BASE,z(5.20)),prism(south,BASE,z(5.20))]);
wingRoofs.push(hipRoof(51.6,4.7,z(5.17),z(8.05),2.2).rotate([0,0,-1]).translate([-9.8,19.25,0]));
wingRoofs.push(hipRoof(45.5,4.7,z(5.17),z(8.05),2.2).translate([-24.5,-19.4,0]));
// Courtyard frontage with repeating windows; street frontage follows BAG angle.
const smallCuts=[];
for(const s of[-1,1])for(let u=-30;u<16;u+=4.7)smallCuts.push(niche(1.35,z(2.7),z(4.55),false).rotate([0,0,s<0?180:0]).translate([u,s<0?(u<-21?-17.12:-18.25):16.84-.0155*u,0]));
wings=wings.subtract(union(smallCuts));
for(const v of[-12,-8,-4,4,8,12])wings=wings.subtract(niche(1.35,z(2.7),z(4.6),false).rotate([0,0,90]).translate([v<0?-35.82:-36.05,v,0]));
// Westelijke toegangspoort: gesloten boog op printschaal, verdiept in de gevel.
const gate=box(-38,-2.5,BASE,-35.6,2.5,z(6.8)).subtract(niche(3.1,z(2),z(5.4),true).translate([0,-35.9,0]).rotate([0,0,90]));
wingRoofs.push(hipRoof(3.1,5.3,z(6.7),z(8.3),1.1).translate([-36.6,0,0]));
const solid=union([...main,wings,...wingRoofs,gate]).subtract(union(cuts)).subtract(union(smallCuts));
const nodes=[['building:synagoge en voorhof',solid]];
const report=await writeLandmark({slug,nodes,base:BASE,catalog:{name:'Portugese Synagoge',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundSamplePoints:[[-26,0],[-25,-10],[-25,10]],groundHeight:44.784,replacesBuildings:['0255','0253','0258','0254'].map(s=>'NL.IMBAG.Pand.036310001217'+s),description:'Vier doorlopende daknokken met schildvlakken, gevelnissen, steunberen, kroonlijst, dakurnen, entree en alle drie dienstvleugels rondom het voorhof. Hoogtes uit AHN en LoD2.2; geveldetails naar RCE-foto’s.',realWorld:{groundNapM:GROUND,ridgeNapM:25.1,mainLengthM:37.1,mainWidthM:28.7,estimated:['vensternissen 0,35 m diep','urnen verdikt tot 0,9 m','gevelritme en poort','daklichten westvleugel','hoogte kroonlijst en parapet']},sources:['PDOK BAG en AHN DSM/DTM 0,5 m, bbox 122115,486700,122225,486810','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012170255','https://commons.wikimedia.org/wiki/File:Portuguese_synagogue_west.jpg','https://commons.wikimedia.org/wiki/File:Achtergevel_-_Amsterdam_-_20013939_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Binnengevel_op_het_plein_-_Amsterdam_-_20021428_-_RCE.jpg']}});
// Los printen: alle gebouwen zijn verbonden met een vlakke onderplaat.
const wasm=await Module();wasm.setup();
const raw=solid.getMesh(),positions=new Float64Array(raw.vertProperties.length/raw.numProp*3);
for(let i=0;i<positions.length/3;i++)for(let j=0;j<3;j++)positions[i*3+j]=raw.vertProperties[i*raw.numProp+j];
const supported=supportedSolid(wasm,{id:slug,name:slug,className:'building',positions,indices:Uint32Array.from(raw.triVerts)},BASE,overhangSupportOptions(45));
if(!supported)throw Error('Printopvulling mislukt');
const printMesh=new wasm.Mesh({numProp:3,vertProperties:new Float32Array(supported.positions),triVerts:supported.indices});printMesh.merge();
const printModel=new wasm.Manifold(printMesh),plate=wasm.Manifold.cube([82,46,1.02]).translate([-57,-23,BASE-1]);
const print=printModel.add(plate).translate([0,0,1.3]);
const out=path.resolve(flag('--out',path.join(import.meta.dirname,'../models')),slug);
await writeFile(path.join(out,slug+'-1-1000.stl'),toStl(print,'Portugese Synagoge 1:1000 mm Z-up').buffer);
console.log('ondervlakken',JSON.stringify(downFaces(solid,BASE)),'printonderdelen',print.decompose().length);
if(process.argv.includes('--analyse'))for(const p of solid.decompose())console.log(p.volume(),p.boundingBox());
