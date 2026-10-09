// SnowWorld: doorlopende langsprofielen en tonvormige dwarsdoorsneden, geen AHN-lagen.
import {Manifold,box,prism,rect,hull,ring3,union,gableRoof,hipRoof,ribbon,check,writeLandmark,toStl,flag} from './efteling-kit.mjs';
import {writeFile} from 'node:fs/promises';import path from 'node:path';
import Module from 'manifold-3d';
// Zelfde permanente 45°-opvulling als de webshop.
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

const slug='snowworld-zoetermeer',origin=[91270,453890],xAxis=[-.4052,.9142],DATUM=-3.2,BASE=-4.2;
const profile=(p,y0,y1)=>prism(p,0,y1-y0).rotate([90,0,0]).translate([0,y1,0]);
// Dwarsprofiel van een dak dat langs X lineair stijgt. Iedere knik is een bouwdeelovergang.
function barrel(knots,y0,y1,crown,thickness=null){
 const centre=(y0+y1)/2,half=(y1-y0)/2;
 const cross=Array.from({length:17},(_,i)=>{const t=-1+i/8;return [centre+t*half,-crown*t*t];});
 return union(knots.slice(1).map(([u1,z1],i)=>{const [u0,z0]=knots[i];return hull([...[u0,u1].flatMap((u,j)=>{const z=j?z1:z0,low=thickness===null?BASE:z-thickness;return [[u,y0,low],[u,y1,low],...cross.map(([v,dz])=>[u,v,z+dz])];})]);}));
}
const longKnots=[[-10.3,5.8],[35,7.0],[70,12.8],[125,23.85],[150,29.62],[300.7,66.73]];
const longHeight=u=>{for(let i=1;i<longKnots.length;i++)if(u<=longKnots[i][0]){const [a,z]=longKnots[i-1],[b,w]=longKnots[i];return z+(w-z)*(u-a)/(b-a);}return longKnots.at(-1)[1];};
let longHall=barrel(longKnots,-92.33,-61.3,5.75,8.5);
const steel=[];
// Een doorlopende middenwand garandeert een dragende voet; naast de wand blijft het vakwerk zichtbaar.
steel.push(profile([[35,BASE],[300.7,BASE],[300.7,longHeight(300.7)-8.48],[35,longHeight(35)-8.48]],-77.27,-76.37));
for(let u=52;u<=299;u+=17.6){const top=longHeight(u)-8.45;
 for(const y of [-91.7,-61.9])steel.push(box(u-.65,y-.65,BASE,u+.65,y+.65,top+.15));
 for(const y of [-91.7,-61.9])if(u+17.6<301){const end=longHeight(u+17.6)-8.45;steel.push(ribbon([[u,y,BASE+2],[u+17.6,y,end]],1.05,1.05),ribbon([[u,y,top],[u+17.6,y,BASE+2]],1.05,1.05));}
}
// Kijkpunt en trap aan oostrand, BAG-uitstulping aan de kop; treden op een doorlopende helling.
steel.push(box(292.1,-103,BASE,300.7,-92.2,60.9));
const stair=[];for(let u=45;u<292;u+=2.5){const top=longHeight(u)-6.3;stair.push(box(u,-96,BASE,u+2.5,-94.6,top));}
steel.push(union(stair));longHall=union([longHall,...steel]);
const oldKnots=[[27.1,5.6],[54,5.92],[85,8.35],[130,14.83],[141,16.75],[166.55,16.86]];
const oldWest=barrel(oldKnots,-20.94,8.9,.86),oldEast=barrel(oldKnots,-50.82,-20.94,.86);
// Zonnepaneelvelden: grote aaneengesloten, dunne vlakken met regelmatige banen; geen paneeltjes op 1:1000.
const panels=[];for(const [y0,y1,roof]of [[-47,-23.5,oldEast],[-18,5.5,oldWest]])for(let y=y0;y<y1;y+=3.4){
 panels.push(roof.translate([0,0,.22]).subtract(roof.translate([0,0,-.05])).intersect(box(48,y,BASE-1,137,Math.min(y+2.6,y1),30)));
}
// Voorgebouw volgt de BAG-contour; restaurants, ontvangst en verhuur krijgen eigen kappen.
const entryOutline=[[-.22,-93.29],[27.12,-61.29],[27.13,-57.06],[35.31,-57.06],[35.31,-50.83],[57.84,-50.82],[57.84,8.93],[57.91,15.12],[56.35,15.1],[56.35,21.64],[21.24,21.65],[21.22,28.12],[18.89,28.13],[18.88,39.27],[-8.87,39.29],[-8.87,28.13],[-10.36,28.14],[-10.37,15.14],[-12.61,15.17],[-12.63,5.05],[-15.63,5.03],[-15.62,-5.07],[-8,-5.09],[-7.98,-23.99],[-10.24,-23.99],[-10.4,-43.47],[-10.25,-57.36],[-10.25,-63.22],[-10.16,-73.1],[-12.53,-73.23],[-12.56,-79.71],[-15.53,-79.71],[-15.2,-89.42],[-10.43,-89.55],[-10.42,-93.28]];
let entry=prism(entryOutline,BASE,5.52);
const smallGables=[[-56.5,-43.5],[-43.5,-30.5],[-5.1,5.05],[5.05,15.15],[15.15,28.14]];
for(const [a,b]of smallGables){entry=entry.subtract(box(-18,a,1.26,6,b,20));entry=entry.add(gableRoof(18.8,b-a,1.26,6.75).translate([-2,(a+b)/2,0]));}
entry=entry.add(gableRoof(44,19,5.46,11.06).translate([11,-14.5,0]));
entry=entry.subtract(box(-9,28.14,1.26,19,40,20)).add(hipRoof(27.75,11.2,1.26,5.66,1.4).translate([5,33.7,0]));
const windows=[];for(const [a,b]of smallGables)windows.push(box(-18,a+1,BASE+1,-16.8,b-1,4.5));
// De echte glasgevel ligt achter het dakoverstek; de nissen zijn tot 0,35m beperkt.
for(const [u,v0,v1]of [[-10.25,-56,-31],[-8,-24,-6],[-15.62,-5,5],[-12.63,5,15],[-10.37,15,28]])for(let v=v0+1;v<v1-1;v+=3.1)windows.push(box(u-.4,v,BASE+1,u+.35,v+2.1,3.7));
entry=entry.subtract(union(windows));
const plant=[box(36,-57.0,BASE,54,-50.7,4.7),box(38,-54,4.65,48,-51.5,7.5),box(12,-89.5,BASE,26,-84,2.8)];
const merged=union([longHall,oldWest,oldEast,entry,...panels,...plant]);
// Verwijder uitsluitend afgesloten interne holtes en numerieke splinters onder 0,001mm³ op 1:1000.
const hall=union(merged.decompose().filter(s=>s.volume()>.001));
const nodes=[['building:drie-skihallen-en-voorcomplex',hall.translate([0,0,-DATUM])]];
await writeLandmark({slug,nodes,base:BASE-DATUM,catalog:{name:'SnowWorld Zoetermeer',origin,xAxis,groundOffsetMetres:0,groundHeight:40.530596,groundSamplePoints:[[-25,-15]],replacesBuildings:['NL.IMBAG.Pand.0637100000171219'],description:'Twee lagere skihallen met ondiep gewelfde daken, doorlopend tonvormig dak van de verlengde derde baan, staalvakwerk en zijtrap met uitzichtpunt; voorcomplex met afzonderlijke zadeldaken.',realWorld:{longHallTopNapM:66.73,ahnMaximumNapM:67.4737,oldHallsTopNapM:16.86,estimated:['dakinterpolatie door ontbrekende AHN-returns','staalprofielen en trapgroepen verdikt','entreeglas en dakoverstekken']},sources:['https://www.zoetermeer.nl/_flysystem/media/7.-beeldkwaliteitsplan-snowworld.pdf','https://www.zoetermeer.nl/uitbreidingsnowworld','PDOK BAG en AHN DSM/DTM 0,5m, bbox 90900,453800,91450,454350','https://commons.wikimedia.org/wiki/File:Snowworld_Zoetermeer_(36995235085).jpg','https://commons.wikimedia.org/wiki/File:Zoetermeer_Meerzicht_Snowworld_(02).JPG']}});

const wasm=await Module();wasm.setup();const raw=nodes[0][1].getMesh();const positions=Float64Array.from(Array.from({length:raw.numVert*3},(_,i)=>raw.vertProperties[Math.floor(i/3)*raw.numProp+i%3]));
const supported=supportedSolid(wasm,{id:slug,name:slug,className:'building',positions,indices:raw.triVerts},BASE-DATUM,overhangSupportOptions(45));const mesh=new wasm.Mesh({numProp:3,vertProperties:Float32Array.from(supported.positions),triVerts:supported.indices});mesh.merge();const solid=new wasm.Manifold(mesh),b=solid.boundingBox();
const plate=wasm.Manifold.cube([b.max[0]-b.min[0]+2,b.max[1]-b.min[1]+2,1.02]).translate([b.min[0]-1,b.min[1]-1,BASE-DATUM-1]);const pieces=solid.add(plate).translate([0,0,1-(BASE-DATUM)]).decompose().filter(s=>s.volume()>.001);if(pieces.length!==1)throw Error('Losse positieve printdelen');const final=pieces[0];
await writeFile(path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug,slug+'-1-1000.stl'),toStl(final,'SnowWorld Zoetermeer 1:1000 mm Z-up').buffer);console.log('PRINT',final.status(),final.boundingBox(),'permanente opvulling m3',solid.volume()-nodes[0][1].volume());
