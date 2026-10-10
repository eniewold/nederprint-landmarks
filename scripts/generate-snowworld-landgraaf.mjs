// SnowWorld Landgraaf: hellende dakvlakken, afzonderlijke hallen, chalets en hotel.
// Meters, Z-up; eigen assen langs de noordelijke nok. Geen gestapelde DSM-lagen.
import {Manifold,box,prism,hull,union,gableRoof,writeLandmark,toStl,flag,ccw} from './efteling-kit.mjs';
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

const slug='snowworld-landgraaf',origin=[199520,320760],xAxis=[.987786,.155817],DATUM=151.2391,BASE=149.5;
const outline=[[387.725, -35.247], [386.827, -32.19], [380.711, -11.379], [380.681, 18.631], [370.643, 20.416], [361.309, 21.977], [346.217, 24.318], [330.474, 26.453], [318.892, 27.893], [299.88, 29.91], [285.24, 31.251], [266.538, 32.522], [249.939, 33.383], [231.156, 34.007], [215.449, 34.256], [202.048, 34.249], [189.691, 34.057], [172.698, 33.549], [158.914, 32.932], [143.597, 31.991], [128.393, 30.821], [93.879, 27.604], [74.979, 26.258], [56.081, 25.333], [24.139, 24.838], [18.801, 24.756], [11.468, 24.642], [11.482, 17.954], [8.456, 17.954], [8.465, 28.5], [-14.84, 28.521], [-14.85, 17.943], [-15.72, 17.943], [-15.716, 17.39], [-15.307, 17.393], [-15.279, 6.148], [-15.272, 3.195], [-26.562, 3.12], [-29.478, 3.101], [-34.015, 3.071], [-34.016, 0.577], [-34.017, -4.715], [-34.019, -12.123], [-34.024, -35.255], [-19.009, -35.214], [-19.004, -75.145], [-23.704, -75.144], [-23.704, -82.625], [-24.504, -82.625], [-24.503, -82.775], [-26.514, -82.775], [-26.513, -85.939], [-26.512, -87.805], [-20.792, -87.805], [-20.793, -87.975], [-17.953, -87.974], [-17.952, -97.064], [-17.308, -97.065], [-3.454, -97.062], [19.249, -97.06], [19.249, -100.49], [58.889, -100.485], [62.041, -100.484], [69.628, -100.484], [69.625, -72.092], [69.598, -56.173], [59.597, -56.161], [59.612, -42.886], [71.818, -42.927], [78.94, -43.032], [86.06, -43.256], [93.177, -43.599], [100.286, -44.059], [107.384, -44.639], [115.827, -45.472], [124.255, -46.468], [132.662, -47.627], [141.046, -48.948], [149.399, -50.431], [161.302, -52.946], [172.217, -55.225], [181.151, -57.029], [189.792, -58.552], [198.285, -59.935], [206.565, -61.032], [214.864, -61.986], [223.179, -62.795], [231.507, -63.461], [239.843, -63.983], [240.512, -64.019], [246.334, -64.29], [255.354, -64.472], [264.379, -64.473], [273.403, -64.294], [282.42, -63.935], [291.426, -63.396], [300.853, -62.776], [310.253, -61.66], [319.588, -60.051], [328.819, -57.954], [337.909, -55.381], [389.213, -40.309], [387.725, -35.247]];
const footprint=prism(outline,BASE,255);
// Bouwkundige dwarsdoorsneden: noordelijke dakrand, dakknik tussen de hallen,
// zuidelijke dakrand en nokhoogte. Hoofdhellingen uit AHN-planfits; omtrek uit BAG.
const hallSections=[
 [11.47,24.64,-42.89,-15,164.30],[30,24.93,-42.89,-15,168.05],
 [60,25.52,-42.89,-15,171.60],[120,30.17,-45.96,-16.5,182.65],
 [180,33.77,-56.80,-28.5,194.07],[240,33.72,-64.00,-36.5,205.93],
 [300,29.90,-62.84,-34.5,217.74],[350,23.74,-51.83,-22,227.84],
 [380.71,18.63,-43.01,-16.5,232.93],[390,18.63,-40.0,-16.5,233.35],
];
function sectionPoints([u,north,south,divider,ridge],lower){
 const verts=lower?[[south,ridge-3.1-.11*(divider-south)],[divider,ridge-3.1]]:[[divider,ridge],[0,ridge],[north,ridge-.16*north]];
 return [[u,verts[0][0],BASE],[u,verts.at(-1)[0],BASE],...verts.map(([v,z])=>[u,v,z])];
}
const mainHall=union(hallSections.slice(1).map((s,i)=>hull([...sectionPoints(hallSections[i],false),...sectionPoints(s,false)]))).intersect(footprint);
const southernHall=union(hallSections.slice(1).map((s,i)=>hull([...sectionPoints(hallSections[i],true),...sectionPoints(s,true)]))).intersect(footprint);
// Korte oefenhal aan de zuidzijde: langssprong en zadeldwarsprofiel volgens AHN.
const practiceRoof=hull([...[19.25,69.63].flatMap(u=>{
 const ridge=163.86+.181*(u-19.25);return [[u,-100.49,BASE],[u,-55.8,BASE],[u,-100.49,ridge-2.9],[u,-72.1,ridge],[u,-55.8,ridge-1.62]];
})]).intersect(footprint);
const connectingHall=hull([[0,-79,BASE],[59.7,-79,BASE],[0,-35,BASE],[59.7,-35,BASE],
 [0,-79,163.1],[59.7,-79,168.4],[0,-69,164.4],[59.7,-69,169.4],[0,-35,162.0],[59.7,-35,167.1]]).intersect(footprint);
// Panelen op drie hoofdvelden: brede banen volgen hun dakvlak, met zichtbare
// tussenruimten; individuele paneelcellen zijn op 1:1000 niet bruikbaar.
const panelSkin=roof=>roof.translate([0,0,.42]).subtract(roof.translate([0,0,-.02]));
const panels=[];
for(let u=40;u<356;u+=22.5){
 panels.push(panelSkin(mainHall).intersect(box(u,3,BASE,Math.min(u+18.3,360),45,245)));
 panels.push(panelSkin(mainHall).intersect(box(u,-29,BASE,Math.min(u+18.3,353),-4,245)));
}
for(let v=-64;v<-20;v+=3.4)panels.push(panelSkin(southernHall).intersect(box(26,v,BASE,367,v+2.6,245)));
// Entree en conferentiecentrum: vijf lage chaletfronten plus een grote middenkap.
let entry=footprint.intersect(box(-35,-75.2,BASE,11.5,29,163.15));
const chaletBays=[[-35.26,-26.0],[-26.0,-16.3],[-16.3,-6.6],[-6.6,3.07]];
for(const [a,b]of chaletBays){
 entry=entry.subtract(box(-35,a,160.85,-15.0,b,190));
 entry=entry.add(gableRoof(19.0,b-a,160.85,164.02).translate([-24.5,(a+b)/2,0]));
}
// Hogere ontvangstruimte direct achter de kleine kappen, met vlakke middenzone.
entry=entry.add(box(-16.4,-35.2,BASE,-12.6,5.0,171.38));
entry=entry.add(gableRoof(26.5,16.2,163.15,170.7).translate([-2,-3.5,0]));
entry=entry.add(gableRoof(20.0,10.55,159.1,166.9).translate([-3.7,11.5,0]));
// Alpine Hotel: asymmetrische hoge kap, zes bouwlagen, blokvormig houten front,
// eigen glazen entreeportaal en terugliggende terraszijde; geen vlak dakblok.
const profileAlongX=(p,u0,u1)=>Manifold.extrude([ccw(p)],u1-u0).rotate([90,0,90]).translate([u0,0,0]);
let hotel=box(-17.95,-97.06,BASE,19.25,-79.4,169.1);
hotel=hotel.add(profileAlongX([[-97.06,169.05],[-97.06,173.48],[-90.7,180.55],[-79.4,169.1]],-17.95,19.25));
hotel=hotel.add(box(-18.7,-97.06,BASE,-16.25,-86.5,174.1));
hotel=hotel.add(box(-23.7,-82.62,BASE,-17.9,-75.14,155.7));
hotel=hotel.add(gableRoof(10.8,10.65,155.5,161.4).translate([-21.1,-82.1,0]));
// Glasnissen: 0,35 m diep, ruime penanten; balkonterrassen krijgen een gesloten
// wand/45°-onderbouw zodat geen losse steunen nodig zijn.
const niches=[];
for(let z=155.2;z<173;z+=3.18){
 for(let u=-13;u<15;u+=5.15)niches.push(box(u,-97.46,z,u+2.15,-96.71,z+1.85));
 for(let v=-94;v<-81;v+=4.7)niches.push(box(-19.1,v,z,-18.32,v+2.15,z+1.85));
}
hotel=hotel.subtract(union(niches));
for(const [a,b]of chaletBays)for(let v=a+1.1;v<b-1.1;v+=3.1)entry=entry.subtract(box(-34.5,v,153.4,-33.67,v+2.1,159.8));
// Techniekzone voorzijde, dakinstallaties en de verhoogde bovenste uitloop.
const installations=[box(-14.8,18.0,BASE,8.46,28.52,158.9),box(-7.3,19.5,158.8,4.8,26.1,162.4),box(371,-12,229.0,380,2,232.94)];
const merged=union([mainHall,southernHall,practiceRoof,connectingHall,entry,hotel,...panels,...installations]);
const complex=union(merged.decompose().filter(s=>s.volume()>.001));
const nodes=[['building:skihallen-entree-en-alpine-hotel',complex.translate([0,0,-DATUM])]];
await writeLandmark({slug,nodes,base:BASE-DATUM,catalog:{name:'SnowWorld Landgraaf',origin,xAxis,groundOffsetMetres:0,groundHeight:197.072499,groundSamplePoints:[[-40,-45]],replacesBuildings:['NL.IMBAG.Pand.0882100000017847'],description:'Hoge skihal met vlakke middenstrook, hellende noordzijde en gebogen lagere zuidhal, oefenhal, zonnepaneelvelden, chaletfronten en Alpine Hotel met asymmetrische kap.',realWorld:{mainRoofTopNapM:232.94,hotelRidgeNapM:180.55,roofStepM:3.1,estimated:['dakknikken en zuidhelling geïnterpoleerd tussen AHN-vlakken','gevelglas en chaletspanten','installaties en printbare onderbouw']},sources:['https://www.kokstaal.nl/en/projects/landgraaf-ski-halls/','https://www.vwarchitectuur.nl/project/skibaan-snowworld-landgraaf/','https://www.vwarchitectuur.nl/project/sporthotel-snowworld-landgraaf/','PDOK BAG 0882100000017847, actuele ortho en AHN DSM/DTM 0,5m, bbox 199000,320200,200000,321200','https://commons.wikimedia.org/wiki/File:Landgraaf-SnowWorld.JPG','https://commons.wikimedia.org/wiki/File:SnowWorld.JPG']}});

const wasm=await Module();wasm.setup();const raw=nodes[0][1].getMesh();const positions=Float64Array.from(Array.from({length:raw.numVert*3},(_,i)=>raw.vertProperties[Math.floor(i/3)*raw.numProp+i%3]));
const supported=supportedSolid(wasm,{id:slug,name:slug,className:'building',positions,indices:raw.triVerts},BASE-DATUM,overhangSupportOptions(45));const mesh=new wasm.Mesh({numProp:3,vertProperties:Float32Array.from(supported.positions),triVerts:supported.indices});mesh.merge();const solid=new wasm.Manifold(mesh),b=solid.boundingBox();
const plate=wasm.Manifold.cube([b.max[0]-b.min[0]+2,b.max[1]-b.min[1]+2,1.02]).translate([b.min[0]-1,b.min[1]-1,BASE-DATUM-1]);const pieces=solid.add(plate).translate([0,0,1-(BASE-DATUM)]).decompose().filter(s=>s.volume()>.001);if(pieces.length!==1)throw Error('Losse positieve printdelen');const final=pieces[0];
await writeFile(path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug,slug+'-1-1000.stl'),toStl(final,'SnowWorld Landgraaf 1:1000 mm Z-up').buffer);console.log('PRINT',final.status(),final.boundingBox(),'permanente opvulling m3',solid.volume()-nodes[0][1].volume());
