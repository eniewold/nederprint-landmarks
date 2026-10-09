// PDOK BAG/AHN 0,5m: gemeten nokken en twee vlakhellingen per zadeldak.
// Geen hoogteplakken: machinehal, zes dwarskappen, ketelhuis, lichtkap en schoorsteen.
import {Manifold,box,prism,rect,hull,ring3,union,gableRoof,dome,check,writeLandmark,toStl,flag} from './efteling-kit.mjs';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import Module from 'manifold-3d';
// Dezelfde permanente 45°-opvulling als de webshop.
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

const slug='woudagemaal',origin=[174730,539927],xAxis=[.8886,-.4587],DATUM=2.55,BASE=1.25;
const HALL={x0:-27.2,x1:35.85,y0:-5.79,y1:10.13,eave:11.72,ridge:16.52};
const BOILER={x0:-44.12,x1:-27.2,y0:-5.79,y1:25.94,eave:9.02,ridge:14.37};
const cx=(HALL.x0+HALL.x1)/2,cy=(HALL.y0+HALL.y1)/2;
const hallParts=[box(HALL.x0,HALL.y0,BASE,HALL.x1,HALL.y1,HALL.eave),gableRoof(63.55,16.42,HALL.eave-.08,HALL.ridge).translate([cx,cy,0])];
const niches=[];
for(const [u,width,ridge]of [[-19.1,6.6,14.37],[4.4,10.8,15.56],[28.1,6.6,14.37]]){
 // Lagere dwarse zadeldaken en bakstenen tuitgevels aan beide kanaalzijden.
 hallParts.push(gableRoof(16.9,width,11.98,ridge).rotate([0,0,90]).translate([u,cy,0]));
 for(const y of [HALL.y0-.36,HALL.y1+.36]){
  hallParts.push(hull([...ring3(rect(u-width/2,y-.45,u+width/2,y+.45),BASE),...ring3(rect(u-width/2,y-.45,u+width/2,y+.45),11.98),[u,y-.45,ridge+.22],[u,y+.45,ridge+.22]]));
  for(const dx of [-1.25,1.25])niches.push(box(u+dx-.6,y-.8,10.45,u+dx+.6,y+.8,12.15));
 }
}
// Raamritme: hoge gekoppelde vensters met een tweede register en brede natuurstenen lateien.
for(const u of [-24,-13,-7,16,22,33])for(const [y,s]of [[HALL.y0,-1],[HALL.y1,1]]){
 for(const dx of [-1.35,0,1.35]){
  niches.push(box(u+dx-.45,y+(s<0?-.1:-.35),3.18,u+dx+.45,y+(s<0?.35:.1),7.78));
  niches.push(box(u+dx-.45,y+(s<0?-.1:-.35),9.05,u+dx+.45,y+(s<0?.35:.1),10.49));
 }
 hallParts.push(box(u-2,y+(s<0?-.3:-.06),7.8,u+2,y+(s<0?.06:.3),8.25),box(u-2,y+(s<0?-.3:-.06),10.53,u+2,y+(s<0?.06:.3),10.93));
}
for(const y of [HALL.y0,HALL.y1]){
 // Entree middenrisaliet: gesloten portaal, schuin afgedekte luifel en lage nis.
 hallParts.push(box(1.7,y-1.1,BASE,7.1,y+1.1,7.7),gableRoof(5.8,2.6,7.68,8.95).translate([4.4,y,0]));
 niches.push(box(3.35,y+(y<0?-1.2:.75),3.2,5.45,y+(y<0?-.75:1.2),6.5));
}
// Kopgevel: groot venster, brede middenstijl en blind spits toelopend bovenvak.
for(const v of [cy-2.7,cy,cy+2.7])niches.push(box(35.5,v-1.0,4.0,36.2,v+1.0,10.4));
let hall=union(hallParts).subtract(union(niches));
const boilerParts=[box(BOILER.x0,BOILER.y0,BASE,BOILER.x1,BOILER.y1,BOILER.eave),gableRoof(32.23,17.42,BOILER.eave-.08,BOILER.ridge).rotate([0,0,90]).translate([-35.66,10.075,0]),box(-37.1,-2.2,13.65,-34.22,29.94,15.43),gableRoof(32.3,3.15,15.38,16.22).rotate([0,0,90]).translate([-35.66,13.8,0])];
const boilerNiches=[];
for(const v of [-1,4.7,10.4,16.1,21.8]){
 for(const x of [BOILER.x0,BOILER.x1])if(x===BOILER.x0||v>12)for(const dv of [-1.2,1.2])boilerNiches.push(box(x-.4,v+dv-.75,3.0,x+.4,v+dv+.75,7.45));
 for(const x of [-37.1,-34.22])boilerNiches.push(box(x-.4,v-1.8,14.1,x+.4,v+1.8,15.08));
}
// Achteraan lichtkap/laag service-uitbouw volgens de BAG-uitsprong.
boilerParts.push(box(-43.79,25.85,BASE,-30.9,29.94,5.65));
let boiler=union(boilerParts).subtract(union(boilerNiches));
const chimneyCentre=[-52.31,10.16];
let chimney=dome(chimneyCentre,[[2.46,BASE],[2.46,3.25],[2.32,3.8],[1.47,58.8],[1.47,60.45],[1.82,60.82],[1.82,61.27]],48);
chimney=chimney.subtract(Manifold.cylinder(.45,.72,.72,32).translate([...chimneyCentre,60.92]));
const nodes=[['building:machinehal-en-zes-dwarskappen',hall],['building:ketelhuis-met-lichtkap',boiler],['building:schoorsteen',chimney]].map(([name,m])=>[name,m.translate([0,0,-DATUM])]);
await writeLandmark({slug,nodes,base:BASE-DATUM,catalog:{name:'Ir. D.F. Woudagemaal',origin,xAxis,groundOffsetMetres:0,groundHeight:44.729549,groundSamplePoints:[[0,-7.5],[20,-7.5]],replacesBuildings:['0082100000149207','0082100000155861'].map(id=>'NL.IMBAG.Pand.'+id),description:'Machinehal met doorlopend zadeldak en zes lagere dwarskappen, haaks ketelhuis met verhoogde lichtkap en taps toelopende gemetselde schoorsteen; raamritme als blinde nissen.',realWorld:{hallRidgeNapM:16.52,boilerRidgeNapM:14.37,chimneyTopNapM:61.27,estimated:['venster- en natuursteenmaten','schoorsteenprofiel tussen AHN-top en BAG-voet','entreeportalen en nisdiepte']},sources:['https://www.woudagemaal.nl/over-ons/ir-d-f-woudagemaal/architectuur','https://wiki.woudagemaal.nl/w/index.php/Ontwerp_en_inrichting_gebouw','PDOK BAG, AHN DSM/DTM 0,5 m en luchtfoto 0,25 m, bbox 174650,539880,174800,540010','https://commons.wikimedia.org/wiki/File:Ir._D.F._Woudagemaal_1.jpg']}});
// Eén grondplaat verbindt de losse schoorsteen met beide hallen voor een zelfstandige print.
const wasm=await Module();wasm.setup();
const supported=nodes.map(([name,m])=>{const mesh=m.getMesh();const positions=Float64Array.from(Array.from({length:mesh.numVert*3},(_,i)=>mesh.vertProperties[Math.floor(i/3)*mesh.numProp+i%3]));const q=supportedSolid(wasm,{id:name,name,className:'building',positions,indices:mesh.triVerts},BASE-DATUM,overhangSupportOptions(45));const mm=new wasm.Mesh({numProp:3,vertProperties:Float32Array.from(q.positions),triVerts:q.indices});mm.merge();return new wasm.Manifold(mm);});
const all=wasm.Manifold.union(supported),b=all.boundingBox();const plate=wasm.Manifold.cube([b.max[0]-b.min[0]+2,b.max[1]-b.min[1]+2,1.02]).translate([b.min[0]-1,b.min[1]-1,BASE-DATUM-1]);
const solid=all.add(plate).translate([0,0,-(BASE-DATUM-1)]);check([['stl',solid]],0);const stl=toStl(solid,'Woudagemaal 1:1000 mm Z-up');
await writeFile(path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug,slug+'-1-1000.stl'),stl.buffer);
console.log('STL met plaat',solid.status(),solid.decompose().length,solid.boundingBox());
