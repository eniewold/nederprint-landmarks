// SnowWorld Terneuzen: EBARchitects, 2007. BAG-plan en gemeten LoD2.2-vlakken.
// Voorbeeld SnowWorld Zoetermeer: dakvlakken en dragende spanten, geen hoogtelagen.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark,toStl} from './efteling-kit.mjs';
import {writeFile} from 'node:fs/promises';import path from 'node:path';import Module from 'manifold-3d';
// Zelfde permanente 45Ã‚Â°-opvulling als de webshop.
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

const slug='snowworld-terneuzen',ORIGIN=[47782,368554],ANGLE=39.1,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=1.1,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const plane=(poly,a,b,c)=>{const n=Math.hypot(a,b,1);return prism(poly,BASE,50).trimByPlane([a/n,b/n,-1/n],-z(c)/n);};
const mainPlan=[[6.64,-32.2],[85.37,-32.2],[85.37,-2.7],[182.35,-2.7],[182.35,27.73],[23.68,27.8],[23.68,28.23],[6.63,28.23]];
const top=(u,v)=>.18145652*u+.00013807*v+8.14156996;
const mainEnvelope=plane(mainPlan,.18145652,.00013807,8.14156996);
// Pistevloer en doos: geschatte 8.5m afstand onder het gemeten dak; werkelijk hol.
const mainShell=mainEnvelope.subtract(mainEnvelope.translate([0,0,-8.5]));
const retailPlan=[[6.5,-32.2],[181.34,-32.31],[181.34,-9.07],[177.39,-9.07],[177.39,-2.74],[182.35,-2.74],[182.35,27.73],[6.5,28.23]];
let retail=prism(retailPlan,BASE,z(7.521));
// Lage L-vleugel: sporthal, horeca, hellende rode box en overdekte toegang.
const sportPlan=[[-55.76,58.35],[-6.3,58.35],[-2.63,64.12],[-2.62,118.94],[-55.7,118.94]];
const sport=prism(sportPlan,BASE,z(6.921));
const frontPlan=[[-66.36,-17.51],[-52.25,-17.52],[-52.25,-19.7],[-22.25,-19.7],[-18.38,28.69],[-11.55,33.82],[-14.3,58.96],[-66.36,58.96]];
let front=prism(frontPlan,BASE,z(5.856));
const upperRestaurant=plane([[-52.1,-32.47],[-22.25,-32.33],[-23.73,4.28],[-23.63,28.75],[-44.23,29],[-45.01,-19.24],[-52.12,-19.7]],.00076598,-.00008276,10.47242368);
const vestibule=union([prism(rect(-23.73,-32.33,-18.3,28.75),BASE,z(9.386)),plane(rect(2.3,-32.22,6.7,28.22),.00807687,-.00015927,8.51096367)]);
const connectingRoof=plane([[-18.38,-32.31],[2.34,-32.22],[2.54,28.22],[-2.63,28.5],[-18.38,28.69]],.18497758,.00012559,13.58258083);
const redBox=plane(rect(-66.87,-32.54,-52.1,-19.7),.18528482,-.00022315,25.47568344);
const canopyPlan=[[-14.3,58.35],[-6.3,58.35],[-2.63,64.12],[-2.62,118.94],[-14.8,118.94]];
const canopyEnvelope=plane(canopyPlan,.03266981,.00006791,10.42099091),canopy=canopyEnvelope.subtract(canopyEnvelope.translate([0,0,-1.1]));
const beam=(a,b,w=1.15)=>Manifold.hull([Manifold.cube([w,w,w],true).translate([a[0],a[1],z(a[2])]),Manifold.cube([w,w,w],true).translate([b[0],b[1],z(b[2])])]);
const steel=[];
// Aan weerszijden zichtbare X-spanten, geschatte 17.6m travee, verdikt voor 1:1000.
for(let u=58;u<179;u+=17.6){const v0=u<85?-31.55:-2.05,v1=27.15,h=top(u,0)-8.4;for(const v of[v0,v1]){steel.push(B(u-.7,v-.7,u+.7,v+.7,7.4,h));if(u+17.6<180){const w=u+17.6,h1=top(w,0)-8.4;steel.push(beam([u,v,7.55],[w,v,h1]),beam([u,v,h],[w,v,7.55]));}}
 steel.push(beam([u,v0,h],[u,v1,h],1.25));}
// Doorlopende interne middenwand draagt de print; de zichtbare buitenvelden zijn open.
steel.push(plane(rect(20,12.2,181,13.3),.18145652,.00013807,8.14156996-8.4));
for(let v=66;v<118;v+=8.8)steel.push(B(-3.3,v-.55,-2.1,v+.55,GROUND,9.3));
// Lange gebogen glasluifel langs de retail, op de schuine ontwerpersfoto zichtbaar.
// Langsprofiel en breedte geschat; aaneengesloten profielstroken, geen hoogtelagen.
const awningProfile=[[10,8.3],[40,10.2],[75,10.3],[110,9.4],[150,8.5],[180,8.2]],awning=[];
for(let i=1;i<awningProfile.length;i++){const [u0,h0]=awningProfile[i-1],[u1,h1]=awningProfile[i];awning.push(Manifold.hull([...[u0,u1].flatMap((u,j)=>[27.5,34].flatMap(v=>[[u,v,z((j?h1:h0)-1.1)],[u,v,z(j?h1:h0)]]))]));}
for(let u=15;u<178;u+=17.6)awning.push(B(u-.55,32.5,u+.55,33.6,GROUND,9.6));
// Twee buitentrappentorens aan de terugliggende pistezijgevel: gemeten kophoogtes.
const details=[...awning,B(-44,30,-40,33.5,5.5,9.55),B(84.9,-24,89,-11,7.3,9.54),B(168.3,-6.1,175.3,-2.5,GROUND,35.243),B(90.2,-6.7,96.1,-2.5,GROUND,25.654)];
// Koelinstallaties met herkenbare gemeten groepsmaat, vereenvoudigde apparaten.
for(let u=85;u<98;u+=4.0)for(let v=-22;v<-10;v+=4.0)details.push(B(u,v,u+2.8,v+2.8,7.3,9.34));
let body=union([retail,sport,front,upperRestaurant,vestibule,connectingRoof,redBox,canopy,mainShell,...steel,...details]);
const cuts=[];
for(const [u,v,w,h]of[[168.3,-6.1,7,35.243],[90.2,-6.7,5.9,25.654]])for(let level=3;level<h-2;level+=3.2)cuts.push(B(u+.9,v-.3,u+w-.9,v+.38,level,level+1.7));
function facade(poly,low,high,pitch=4.4){const p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<8)continue;for(let s=.9;s+2.9<L-.5;s+=pitch)cuts.push(box(s,-.42,z(low),s+2.9,.38,z(high)).rotate([0,0,Math.atan2(dy,dx)*180/Math.PI]).translate([...a,0]));}}
facade(retailPlan,2.1,5.8);facade(sportPlan,2,5.2);facade(frontPlan,2,4.8);facade(rect(-45,-19,-23,28),7.1,9.4);
// Grote zijpanelen en de kopruit zijn blind reliÃƒÂ«f, zonder dunne letters.
for(const v of[-32.2,28.23])for(let u=12;u<85;u+=8.8)cuts.push(B(u,v-.4,u+5.7,v+.38,top(u,v)-7.3,top(u,v)-2.1));
for(let u=94;u<179;u+=8.8)cuts.push(B(u,27.35,u+5.7,28.1,top(u,27)-7.3,top(u,27)-2.1));
for(let v=1;v<24;v+=4.2)cuts.push(B(181.97,v,182.8,v+2.9,35.2,39.4));
body=body.subtract(union(cuts));
const material=body.decompose().filter(p=>p.volume()>.001);if(material.length!==1)throw Error('Losse bouwdelen '+material.length);body=material[0];
await writeLandmark({slug,nodes:[['building:skihal-staalspanten-en-leisurevleugels',body]],base:BASE,catalog:{name:'SnowWorld Terneuzen',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:45.47486049774154,groundSamplePoints:[[28.912700324058672,22.892264194945362],[128.83475170822405,-1.6145439852362369]],replacesBuildings:['NL.IMBAG.Pand.0715100000041102'],description:'Doorlopend hellend pistevolume op open staalspanten boven de retail, met lage L-sportvleugel, hellende rode box, glasnissen, toegangsluifel en koelinstallaties.',realWorld:{groundNapM:GROUND,mainRoofPlaneNap:[.18145652,.00013807,8.14156996],mainRoofTopNapM:41.235,sportRoofNapM:6.921,retailRoofNapM:7.521,restaurantRoofNapM:10.442,estimated:['pistevloer 8.5m onder dak','staaltravee en verdikte spanten','vensters, panelen, luifel en kleine koelapparaten','interne printwand; overhangopvulling verkleint de hogere spantopeningen']},sources:['PDOK BAG 0715100000041102, Actueel_orthoHR, AHN4 DSM/DTM 0.5m bbox47582,368354,47982,368754','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0715100000041102','https://healthinvest-beherman.com/skidome-terneuzen/','https://www.infosteel.be/images/magazine/info-steel-21/238/index.html','https://www.reliance-scada.com/en/success-stories/other/reliance-scada-at-snowworld-terneuzen','https://www.snowworld.com/nl/terneuzen/skien-snowboarden']}});

const wasm=await Module();wasm.setup();const raw=body.getMesh(),positions=Float64Array.from(Array.from({length:raw.numVert*3},(_,i)=>raw.vertProperties[Math.floor(i/3)*raw.numProp+i%3]));
const supported=supportedSolid(wasm,{id:slug,name:slug,className:"building",positions,indices:raw.triVerts},BASE,overhangSupportOptions(45));if(!supported)throw Error("Printcorrectie mislukt");const sm=new wasm.Mesh({numProp:3,vertProperties:Float32Array.from(supported.positions),triVerts:supported.indices});sm.merge();const printed=new wasm.Manifold(sm);if(printed.status()!=="NoError"||printed.decompose().filter(p=>p.volume()>1e-6).length!==1)throw Error("Losse printdelen");
const bb=printed.boundingBox(),plate=wasm.Manifold.cube([bb.max[0]-bb.min[0]+2,bb.max[1]-bb.min[1]+2,1.02]).translate([bb.min[0]-1,bb.min[1]-1,BASE-1]),print=printed.add(plate).translate([0,0,1-BASE]);await writeFile(path.resolve(import.meta.dirname,"../models",slug,slug+"-1-1000.stl"),toStl(print,slug+" 1:1000 mm Z-up, permanente 45 graden opvulling").buffer);console.log("PRINT",print.status(),100*(printed.volume()/body.volume()-1),"% opvulling");
