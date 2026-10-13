// SnowWorld Amsterdam/SnowPlanet, HB-architecten1999, uitbreiding2005.
// Voorbeeld Rucphen: architectonische gebogen dakprofielen; nooit DSM-hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark,toStl} from './efteling-kit.mjs';
import {writeFile} from 'node:fs/promises';import path from 'node:path';import Module from 'manifold-3d';
// Zelfde permanente 45Â°-opvulling als de webshop.
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

const slug='snowworld-amsterdam',ORIGIN=[106841,495950],ANGLE=-57.9,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=-1.1095,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const footprint=[[-42.5,36.95],[-42.28,30.28],[-61.85,29.51],[-60.53,10.5],[-40.95,11.89],[-40.55,4.9],[-44.27,4.4],[-48.39,3.53],[-52.85,2.1],[-51.51,-16.77],[-13.15,-14.14],[11.41,-14.14],[11.48,-6.57],[76.01,-6.58],[75.64,7.22],[161.11,7.22],[171.82,8.77],[176.82,14],[176.83,29.53],[171.91,34.7],[161.34,36.23],[11.13,36.25],[-9.36,33.41],[-9.9,39.18],[-22.96,39.58]];
const clip=prism(footprint,BASE,50);
// Iedere kap is een eigen bouwdeel, met een gemeten boog en eigen langshelling.
// Cross(v)=nok-k(v-hart)^2; profielstations modelleren de verspringende echte kappen.
function section([u,peak,c,k],v0,v1){return [[u,v0,BASE],[u,v1,BASE],...Array.from({length:25},(_,i)=>{const v=v1-(v1-v0)*i/24;return[u,v,z(peak-k*(v-c)**2)];})];}
function bay(stations,v0,v1){return union(stations.slice(1).map((s,i)=>Manifold.hull([...section(stations[i],v0,v1),...section(s,v0,v1)]))).intersect(clip);}
const lowBay=[[-16,9.969,12.0,.0126],[40.6,11.087,13.5,.012]],lowerSlope=[[40.6,12.076,13.8,.0122],[75.8,16.248,13.8,.0122]],middleSlope=[[75.8,17.244,13.944,.0123],[115.9,21.715,16.65,.0118]],upperSlope=[[115.9,22.733,16.7,.0119],[146.05,25.85,21.62,.0117]],roundedHead=[[146.05,26.91,21.6,.011],[157,28.565,21.6,.0055],[165,29.233,21.37,.0036],[176.83,29.078,21.42,.0044]];
const longHall=union([bay(lowBay,7.1,36.3),bay(lowerSlope,7.1,36.3),bay(middleSlope,7.1,36.3),bay(upperSlope,7.1,36.3),bay(roundedHead,7.1,36.3)]);
const lowerShort=bay(lowBay.map(([u,h,c,k])=>[u,h-.75,c,k]),-6.65,7.3),upperShort=bay(lowerSlope.map(([u,h,c,k])=>[u,h-1.8,c,k]),-6.65,7.3);
// Ontvangsthal heeft een eigen lage boog; platte zijgalerijen blijven apart.
const reception=bay([[-62,8.39,8.55,.0105],[-16,8.49,8.55,.0105]],-6.65,35.1);
const westGallery=prism([[-51.51,-16.77],[-13.15,-14.14],[11.41,-14.14],[11.48,-6.57],[-33.4,-6.54],[-40.55,4.9],[-52.85,2.1]],BASE,z(2.696));
const eastGallery=prism([[-42.5,36.95],[-42.28,30.28],[-9.1,30.28],[-9.9,39.18],[-22.96,39.58]],BASE,z(3.259));
const beam=(a,b,w=.95)=>Manifold.hull([Manifold.cube([w,w,w],true).translate([a[0],a[1],z(a[2])]),Manifold.cube([w,w,w],true).translate([b[0],b[1],z(b[2])])]);
// Witte entreevorken en voorluifel: gesloten45Â°onderschalen, minimumstijl0.95m.
const canopy=Manifold.hull([...ring3(rect(-63.6,13,-58.7,29.5),z(3.9)),...ring3(rect(-65,11.6,-58.7,30.9),z(5.3))]);
const entranceSteel=[beam([-63.0,14,GROUND],[-59,16,6.7]),beam([-63.0,28,GROUND],[-59,26,4.8])];
const cooling=[B(66.5,-6.5,76.1,-3.0,GROUND,14.7),B(68.4,-6.6,75.6,-2.8,14.6,16.15)];
let body=union([prism(footprint,BASE,BASE+.9),longHall,lowerShort,upperShort,reception,westGallery,eastGallery,canopy,...entranceSteel,...cooling]);
const cuts=[];
// Glasvelden en houten gevelpanelen als blinde0.38m-nissen; geen losse glasranden.
const frontAngle=Math.atan2(-19.01,1.32)*180/Math.PI;
for(let s=.8;s<17;s+=3.6){cuts.push(box(s,-.4,z(.1),s+2.4,.38,z(3.7)).rotate([0,0,frontAngle]).translate([-61.85,29.51,0]));if(s>6)cuts.push(box(s,-.4,z(4.7),s+2.4,.38,z(6.0)).rotate([0,0,frontAngle]).translate([-61.85,29.51,0]));}
for(let u=-49;u<6;u+=4.6)cuts.push(B(u,-17.1,u+3.1,-16.35,-.15,1.7));
for(let u=-38;u<-10;u+=4.0)cuts.push(B(u,39.2,u+2.8,40.0,0,2.3));
// Paneelvelden aan de lange oostzijde volgen de stijgende en afgeronde dakranden.
const eastHeight=u=>{for(const S of[lowBay,lowerSlope,middleSlope,upperSlope,roundedHead])if(u<=S.at(-1)[0]){for(let i=1;i<S.length;i++)if(u<=S[i][0]){const a=S[i-1],b=S[i],t=(u-a[0])/(b[0]-a[0]);const peak=a[1]+t*(b[1]-a[1]),c=a[2]+t*(b[2]-a[2]),k=a[3]+t*(b[3]-a[3]);return peak-k*(36.2-c)**2;}}return29;};
for(let u=-10;u<159;u+=8.8){const h=eastHeight(u);if(h>4.0)cuts.push(B(u,35.85,u+5.6,36.65,Math.max(GROUND+1,h-3.4),h-1.2));}
// De voorste hoge glaswand onder de boog krijgt een zichtbare portaalnis.
cuts.push(B(-62.3,18,-61.48,25.5,GROUND+.5,4.3));
body=body.subtract(union(cuts));
const material=body.decompose().filter(p=>p.volume()>.001);if(material.length!==1)throw Error('Losse bouwdelen '+material.length);body=material[0];
await writeLandmark({slug,nodes:[['building:verspringende-tonkappen-korte-piste-en-ontvangst',body]],base:BASE,catalog:{name:'SnowWorld Amsterdam',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:41.78637831515875,groundSamplePoints:[[-73.13047659345374,5.738762341682726],[-69.07938416572912,19.724063559104977]],replacesBuildings:['NL.IMBAG.Pand.0453100000000400'],description:'Vijf verspringende gebogen pistekappen met stijgend dwarsprofiel, afgeronde kop, lagere korte piste, ontvangstboog, witte entreevorken en volledige zijgalerijen.',realWorld:{groundNapM:GROUND,mainRoofTopNapM:29.233,mainLowCrownNapM:9.969,receptionCrownNapM:8.49,westGalleryRoofNapM:2.696,eastGalleryRoofNapM:3.259,roofSections:{lowBay,lowerSlope,middleSlope,upperSlope,roundedHead},estimated:['regelmatige paraboolprofielen gefit op AHN-dwarsmetingen; hoogtes geÃ¯nterpoleerd door glasgaten','kleine vouwen tussen roofstations, naden en kopafronding','entreevorken, luifel, glasvelden en koelinstallatievereenvoudiging']},sources:['PDOK BAG0453100000000400, Actueel_orthoHR, AHN4 DSM/DTM0.5m bbox106631,495740,107051,496160; dwarsprofielen per meter langs nokas -57.9graden','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0453100000000400','https://abr-roosendaal.nl/project_detail/snow-planet-spaarnwoude/','https://www.snowworld.com/nl/amsterdam','https://www.snowworld.com/en/amsterdam/plan-your-visit','https://bispingen.snowworld.com/unternehmen/ueber-uns.html']}});

const wasm=await Module();wasm.setup();const raw=body.getMesh(),positions=Float64Array.from(Array.from({length:raw.numVert*3},(_,i)=>raw.vertProperties[Math.floor(i/3)*raw.numProp+i%3]));
const supported=supportedSolid(wasm,{id:slug,name:slug,className:"building",positions,indices:raw.triVerts},BASE,overhangSupportOptions(45));if(!supported)throw Error("Printcorrectie mislukt");const sm=new wasm.Mesh({numProp:3,vertProperties:Float32Array.from(supported.positions),triVerts:supported.indices});sm.merge();const printed=new wasm.Manifold(sm);if(printed.status()!=="NoError"||printed.decompose().filter(p=>p.volume()>1e-6).length!==1)throw Error("Losse printdelen");
const bb=printed.boundingBox(),plate=wasm.Manifold.cube([bb.max[0]-bb.min[0]+2,bb.max[1]-bb.min[1]+2,1.02]).translate([bb.min[0]-1,bb.min[1]-1,BASE-1]),print=printed.add(plate).translate([0,0,1-BASE]);await writeFile(path.resolve(import.meta.dirname,"../models",slug,slug+"-1-1000.stl"),toStl(print,slug+" 1:1000 mm Z-up, permanente 45 graden opvulling").buffer);console.log("PRINT",print.status(),100*(printed.volume()/body.volume()-1),"% opvulling");
