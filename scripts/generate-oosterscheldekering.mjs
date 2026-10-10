// Oosterscheldekering sluitgat Schaar: BGT-prisma's en AHN-profielen.
// Vaste BGT-data onderaan, PDOK CC0. Opstand en gevelritme: Commons, zie README.
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

const source=oosterscheldeData();
const slug='oosterscheldekering',BASE=-1.2,origin=source.origin,xAxis=source.xAxis;
const polySolid=(d,z0,z1)=>{
 const polys=d.type==='Polygon'?[d.contours]:d.contours;
 return union(polys.map(poly=>{let s=prism(poly[0],z0,z1);for(const h of poly.slice(1))s=s.subtract(prism(h,z0-1,z1+1));return s;}));
};
const building=[];
// Alle zeventien bovenbouwen van het sluitgat Schaar, op de BGT-pijlerposities.
for(const p of source.piers){
 const [u,v]=p.centre,top=p.topNap;
 const head=Math.max(15.7,Math.min(18.55,top-6.8));
 const parts=[box(u-5.1,v-5.2,BASE,u+5.1,v+5.2,6.0),box(u-5.1,v-29,BASE,u+5.1,v+4.2,1.0)];
 // Twee benen en open midden, de hydraulische stangen liggen in dit midden.
 for(const side of [-1,1]){
  const x=u+side*3.5;
  parts.push(box(x-1.55,v-4.4,5.6,x+1.55,v+4.4,head-.8));
  parts.push(hull([...ring3(rect(x-1.55,v-4.4,x+1.55,v+4.4),head-5.0),...ring3(rect(x-1.95,v-4.9,x+1.95,v+4.9),head-4.5)]));
  const radius=.75,cylinderBase=head-.2,capHeight=.7;
  parts.push(Manifold.cylinder(Math.max(.9,top-capHeight-cylinderBase),radius,radius,24).translate([u+side*2.65,v,cylinderBase]));
  parts.push(Manifold.cylinder(capHeight,radius+.18,.1,24).translate([u+side*2.65,v,top-capHeight]));
  parts.push(box(u+side*1.3-.5,v-.5,5.6,u+side*1.3+.5,v+.5,head));
 }
 parts.push(box(u-6.15,v-2.7,head-1.35,u+6.15,v+2.7,head));
 // Dwarsbalk naar de N57 en werkbordessen; alle uitkragingen krijgen 45° voeten.
 parts.push(box(u-3,v-27.3,9.3,u+3,v+.5,11.9));
 for(const z of [8.0,12.5,head-1.6])parts.push(hull([...ring3(rect(u-5.05,v-4.35,u+5.05,v+4.35),z-.8),...ring3(rect(u-5.8,v-5.1,u+5.8,v+5.1),z)]).add(box(u-5.8,v-5.1,z-.01,u+5.8,v+5.1,z+.4)));
 const stairs=[];
 for(let k=0;k<3;k++){const z=6+2.3*k,dir=k%2?1:-1;stairs.push(ribbon([[u+dir*4.7,v-5.25,z],[u-dir*4.7,v-5.25,z+2.3]],1,1));}
 let body=union(parts),cuts=[];
 for(const side of [-1,1])cuts.push(box(u+side*3.5-.55,v+4.05,head-4,u+side*3.5+.55,v+5.05,head-2.5));
 body=body.subtract(union(cuts));building.push(union([body,...stairs]));
}
// Zestien schuiven, met de echte platte voorplaat en ruimtelijke achtervakwerken.
for(let i=0;i<source.piers.length-1;i++){
 const a=source.piers[i].centre[0]+1.4,b=source.piers[i+1].centre[0]-1.4,mid=(a+b)/2,L=b-a;
 const parts=[box(a,-1.25,BASE,b,-.25,8.8)];
 const arc=x=>1.1+3.6*(1-((x-mid)/(L/2))**2);
 const xs=Array.from({length:9},(_,k)=>a+L*k/8);
 // Gesloten kern achter het vakwerk: de driehoekige velden blijven als
 // circa 0,35 m diepe blinde nissen tussen de uitstekende ribben zichtbaar.
 // Dit vervangt de fijne open raamwerken door printbare bouwvlakken.
 parts.push(prism([[a,-.25],[b,-.25],...xs.slice().reverse().map(x=>[x,arc(x)+.15])],BASE,8.8));
 for(const z of [2.1,8.35])parts.push(ribbon(xs.map(x=>[x,arc(x),z]),1,1));
 for(let k=0;k<8;k++){
  parts.push(ribbon([[xs[k],arc(xs[k]),2.1],[xs[k+1],arc(xs[k+1]),8.35]],.95,.95));
  parts.push(ribbon([[xs[k],arc(xs[k]),8.35],[xs[k+1],arc(xs[k+1]),2.1]],.95,.95));
  parts.push(ribbon([[xs[k],-.75,8.35],[xs[k],arc(xs[k]),8.35]],.95,.95));
 }
 for(let k=0;k<17;k++)parts.push(box(a+L*k/17,-.4,BASE,a+L*k/17+.9,.25,8.8));
 building.push(union(parts));
}
const main=source.decks.find(d=>d.height===1),work=source.decks.find(d=>d.id==='L0002.7ca1e1d5f4c34f80bd2fe4b3d1ce1ddf'),access=source.decks.find(d=>d.id==='L0002.cc0078b5825d426091cac514f39820c9');
// Eén doorlopend dek en onderbalk, geen hoogteplakken; BGT bepaalt de omtrek.
const profileX=(p,x0,x1)=>prism(p,0,x1-x0).rotate([90,0,90]).translate([x0,0,0]);
// Permanente 45graden onderbouw van het N57-dek, één doorlopende doorsnede.
building.push(profileX([[-18,BASE],[-16,BASE],[-6.9,9.3],[-28,9.3]],-446,446));
// Ook de lage achterspanten krijgen een doorlopende zelfdragende voet.
for(let i=0;i<source.piers.length-1;i++){const a=source.piers[i].centre[0]+1.4,b=source.piers[i+1].centre[0]-1.4;building.push(profileX([[-.4,BASE],[1.8,BASE],[4.7,2.1],[-.4,2.1]],a,b));}
building.push(polySolid(main,9.3,12.17),polySolid(work,5.35,5.85),polySolid(access,9.3,12.17));
const roadData=[...source.roads,{...work,attributes:{bgt_functie:'rijbaan lokale weg',bgt_fysiekvoorkomen:'gesloten verharding'}}];
const roads=roadData.map((d,i)=>polySolid(d,i===0?11.67:5.35,i===0?12.17:5.85));
let prior=null;for(let i=0;i<roads.length;i++){if(prior)roads[i]=roads[i].subtract(prior);prior=prior?prior.add(roads[i]):roads[i];}
const construct=union(building).subtract(union(roads));
const nodes=[['building:pijlers-schuiven-en-dekconstructie',construct],...roads.map((r,i)=>['road:'+roadData[i].attributes.bgt_functie+'-'+i,r])];
check(nodes,BASE);
const all=union(nodes.map(n=>n[1])),sum=nodes.reduce((s,n)=>s+n[1].volume(),0);
if(Math.abs(sum-all.volume())>1e-4)throw Error('Overlappende materiaalvolumes');
await writeLandmark({slug,nodes,base:BASE,catalog:{
 name:'Oosterscheldekering — sluitgat Schaar',origin,xAxis,groundOffsetMetres:0,groundHeight:43.390021981279624,groundSamplePoints:[[-250,25],[0,25],[250,25]],replacesBuildings:[],
 replacesTerrain:source.decks.map(d=>d.id),
 description:'Deelmodel: het volledige sluitgat Schaar ten noorden van Neeltje Jans, met zeventien pijlers, zestien schuiven, N57 en werkweg. Doorlopende betonvlakken en afzonderlijke BGT-wegdelen.',
 realWorld:{scope:'sluitgat Schaar, 17 pijlers en 16 schuiven, niet de gehele 9 km kering',pylonCentres:source.piers.map(p=>p.centre),pylonTopNapM:source.piers.map(p=>p.topNap),deckNapM:12.17,workDeckNapM:5.85,estimated:['bovenbouw en cilinderprofiel uit AHN-toppen en foto','vakwerkstaven minimaal 0,95 m','blind raamdetail en bordessen','werkwegfunctie overgenomen van aansluitende BGT-werkwegen','gesloten schuifkern met circa 0,35 m diepe vakwerknissen']},
 sources:['PDOK BGT/BAG, AHN DSM/DTM 0,5 m, EPSG:28992 bbox 39150,407200,39680,408100','https://www.rijkswaterstaat.nl/water/projectenoverzicht/oosterscheldekering-conserveren-schuiven','https://commons.wikimedia.org/wiki/File:Oosterscheldekering-vrata.jpg','https://commons.wikimedia.org/wiki/File:Oosterschelde-Sperrwerk,_Detail.jpg']
}});
// BGT-attributen per weg-node, met gedeelde printopvulling over de hele constructie.
const out=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),glbPath=path.join(out,slug+'.glb');
const rawGlb=await readFile(glbPath),len=rawGlb.readUInt32LE(12),doc=JSON.parse(rawGlb.subarray(20,20+len).toString());
for(let i=1;i<doc.nodes.length;i++)doc.nodes[i].extras={attributes:roadData[i-1].attributes};
let js=Buffer.from(JSON.stringify(doc));js=Buffer.concat([js,Buffer.alloc((4-js.length%4)%4,32)]);
const tail=rawGlb.subarray(20+len),head=Buffer.from(rawGlb.subarray(0,20));head.writeUInt32LE(20+js.length+tail.length,8);head.writeUInt32LE(js.length,12);
await writeFile(glbPath,Buffer.concat([head,js,tail]));
const wasm=await Module();wasm.setup();const raw=all.getMesh(),positions=new Float64Array(raw.vertProperties.length/raw.numProp*3);
for(let i=0;i<positions.length/3;i++)for(let j=0;j<3;j++)positions[i*3+j]=raw.vertProperties[i*raw.numProp+j];
const supported=supportedSolid(wasm,{id:slug,name:slug,className:'building',positions,indices:Uint32Array.from(raw.triVerts)},BASE,overhangSupportOptions(45));
if(!supported)throw Error('Printopvulling mislukt');
const mesh=new wasm.Mesh({numProp:3,vertProperties:new Float32Array(supported.positions),triVerts:supported.indices});mesh.merge();
const print=new wasm.Manifold(mesh),bb=print.boundingBox();
const plate=wasm.Manifold.cube([bb.max[0]-bb.min[0]+2,bb.max[1]-bb.min[1]+2,1.02]).translate([bb.min[0]-1,bb.min[1]-1,BASE-1]);
const pieces=print.add(plate).translate([0,0,1-BASE]).decompose().filter(p=>p.volume()>.001);
if(pieces.length!==1)throw Error('Losse printdelen');
await writeFile(path.join(out,slug+'-1-1000.stl'),toStl(pieces[0],'Oosterscheldekering Schaar 1:1000 mm Z-up').buffer);
console.log('Print',pieces[0].status(),pieces[0].boundingBox(),'extraM3',print.volume()-all.volume());

// PDOK BGT CC0: volledige contouren; AHN 0,5 m: zeventien toppen in NAP.
function oosterscheldeData(){return {"origin": [39393.582, 407659.754], "xAxis": [0.464607984, 0.885516472], "piers": [{"id": "L0002.c882502d089e439485eb10ad605f9d7b", "contours": [[[-361.496, 5.237], [-362.795, 3.701], [-362.825, 0.469], [-362.87, -4.172], [-358.24, -4.163], [-358.238, -5.252], [-355.904, -5.193], [-355.925, -3.397], [-355.393, -3.396], [-355.423, 3.628], [-355.939, 3.631], [-355.95, 5.181], [-361.496, 5.237]]], "type": "Polygon", "height": 0, "centre": [-358.417, -0.311], "topNap": 20.351}, {"id": "L0002.2e1cb005d3774c68a038f80821c1839f", "contours": [[[-319.216, -4.809], [-310.595, -4.822], [-310.628, -3.567], [-310.047, -3.547], [-310.091, 3.811], [-310.674, 3.771], [-310.664, 4.924], [-319.227, 4.981], [-319.233, 3.68], [-319.83, 3.685], [-319.892, -3.457], [-319.211, -3.465], [-319.216, -4.809]]], "type": "Polygon", "height": 0, "centre": [-314.942, 0.099], "topNap": 19.584}, {"id": "L0002.60d4aaddbead4dfb8dad507a555fe0da", "contours": [[[-274.809, -3.332], [-274.37, -3.333], [-274.382, -4.683], [-265.73, -4.724], [-265.718, -3.353], [-265.268, -3.354], [-265.237, 3.671], [-265.709, 3.662], [-265.717, 4.947], [-274.242, 4.989], [-274.244, 3.697], [-274.784, 3.674], [-274.809, -3.332]]], "type": "Polygon", "height": 0, "centre": [-270.018, 0.155], "topNap": 19.405}, {"id": "L0002.d0dd2f4aa8f9433a92bab117a4138fdc", "contours": [[[-220.27, 3.501], [-220.733, 3.502], [-220.753, 4.855], [-229.314, 4.79], [-229.315, 3.51], [-229.815, 3.511], [-229.808, -3.517], [-229.344, -3.517], [-229.339, -4.982], [-220.715, -4.879], [-220.711, -3.516], [-220.261, -3.517], [-220.27, 3.501]]], "type": "Polygon", "height": 0, "centre": [-225.031, -0.022], "topNap": 23.089}, {"id": "L0002.f066f89c55b14fc48e66af9d68c6335d", "contours": [[[-184.922, -3.414], [-184.351, -3.413], [-184.336, -4.808], [-175.789, -4.781], [-175.783, -3.389], [-175.27, -3.388], [-175.271, 3.632], [-175.739, 3.631], [-175.748, 4.939], [-184.413, 4.915], [-184.41, 3.615], [-184.942, 3.613], [-184.922, -3.414]]], "type": "Polygon", "height": 0, "centre": [-180.081, 0.096], "topNap": 23.012}, {"id": "L0002.73feb1a53e3a457b9dfcc6da82603eea", "contours": [[[-139.954, -3.431], [-139.384, -3.431], [-139.38, -4.861], [-130.795, -4.826], [-130.861, -3.416], [-130.305, -3.415], [-130.3, 3.6], [-130.733, 3.6], [-130.737, 4.907], [-139.392, 4.925], [-139.346, 3.617], [-139.929, 3.609], [-139.954, -3.431]]], "type": "Polygon", "height": 0, "centre": [-135.093, 0.073], "topNap": 26.435}, {"id": "L0002.9aac2bee2e0545ef9c6e62746f22e534", "contours": [[[-94.83, -3.35], [-94.224, -3.351], [-94.189, -4.759], [-85.604, -4.801], [-85.607, -3.359], [-85.196, -3.359], [-85.176, 3.65], [-85.738, 3.679], [-85.754, 4.919], [-94.247, 4.977], [-94.267, 3.663], [-94.824, 3.664], [-94.83, -3.35]]], "type": "Polygon", "height": 0, "centre": [-89.971, 0.131], "topNap": 26.718}, {"id": "L0002.a3a62c09cf9f404aaf2df474e1bd8021", "contours": [[[-50.061, -3.374], [-49.568, -3.375], [-49.526, -4.885], [-40.904, -4.794], [-40.928, -3.4], [-40.412, -3.401], [-40.408, 3.616], [-40.963, 3.616], [-40.941, 4.906], [-49.467, 4.93], [-49.489, 3.636], [-50.071, 3.617], [-50.061, -3.374]]], "type": "Polygon", "height": 0, "centre": [-45.228, 0.091], "topNap": 25.86}, {"id": "L0002.4399260077a14e4c859f169545845107", "contours": [[[-4.79, -3.438], [-4.238, -3.439], [-4.209, -4.825], [4.319, -4.895], [4.332, -3.456], [4.843, -3.458], [4.862, 3.547], [4.356, 3.547], [4.355, 4.854], [-4.276, 4.86], [-4.295, 3.537], [-4.771, 3.536], [-4.79, -3.438]]], "type": "Polygon", "height": 0, "centre": [0.041, 0.031], "topNap": 27.242}, {"id": "L0002.8510f37883814afc9e6761cca610d2da", "contours": [[[40.057, -3.467], [40.623, -3.469], [40.589, -4.945], [49.195, -4.904], [49.206, -3.509], [49.74, -3.511], [49.738, 3.54], [49.225, 3.541], [49.215, 4.832], [40.706, 4.834], [40.693, 3.552], [40.086, 3.546], [40.057, -3.467]]], "type": "Polygon", "height": 0, "centre": [44.923, 0.003], "topNap": 24.437}, {"id": "L0002.009e4350cbd14027a495ef2815c11782", "contours": [[[85.028, -3.464], [85.627, -3.467], [85.608, -4.877], [94.215, -4.9], [94.189, -3.512], [94.713, -3.515], [94.729, 3.529], [94.189, 3.529], [94.226, 4.826], [85.638, 4.816], [85.608, 3.539], [85.054, 3.54], [85.028, -3.464]]], "type": "Polygon", "height": 0, "centre": [89.902, 0.004], "topNap": 23.493}, {"id": "L0002.544863a3b1b64e06a78d61ac575397b0", "contours": [[[130.095, -3.529], [130.727, -3.528], [130.702, -5.024], [139.257, -4.969], [139.201, -3.516], [139.714, -3.515], [139.722, 3.503], [139.171, 3.502], [139.188, 4.808], [130.705, 4.804], [130.686, 3.456], [130.059, 3.48], [130.095, -3.529]]], "type": "Polygon", "height": 0, "centre": [134.936, -0.044], "topNap": 24.564}, {"id": "L0002.b5bdccc7c69841a1abc0ea853845cb72", "contours": [[[184.75, 3.509], [184.323, 3.509], [184.345, 4.825], [175.73, 4.775], [175.705, 3.499], [175.193, 3.499], [175.176, -3.505], [175.677, -3.507], [175.672, -5.01], [184.325, -4.924], [184.325, -3.528], [184.738, -3.529], [184.75, 3.509]]], "type": "Polygon", "height": 0, "centre": [179.997, -0.032], "topNap": 22.914}, {"id": "L0002.8ec37177e40544c0ad834c32c3bda8f3", "contours": [[[220.178, -3.504], [220.678, -3.504], [220.661, -4.876], [229.326, -4.954], [229.307, -3.512], [229.733, -3.512], [229.741, 3.525], [229.351, 3.525], [229.347, 4.816], [220.678, 4.779], [220.655, 3.513], [220.194, 3.513], [220.178, -3.504]]], "type": "Polygon", "height": 0, "centre": [224.987, -0.016], "topNap": 19.499}, {"id": "L0002.266c795c090e4cb49e674a33de39e372", "contours": [[[265.217, -3.445], [265.705, -3.447], [265.711, -4.852], [274.289, -4.866], [274.27, -3.464], [274.764, -3.465], [274.773, 3.56], [274.333, 3.561], [274.335, 4.887], [265.688, 4.878], [265.694, 3.574], [265.243, 3.575], [265.217, -3.445]]], "type": "Polygon", "height": 0, "centre": [270.002, 0.041], "topNap": 19.829}, {"id": "L0002.661ab191bffc4595af841242ad0b6a67", "contours": [[[310.191, -3.486], [310.6, -3.486], [310.566, -4.973], [319.272, -4.902], [319.235, -3.487], [319.754, -3.487], [319.742, 3.531], [319.252, 3.531], [319.226, 4.863], [310.676, 4.799], [310.665, 3.532], [310.168, 3.532], [310.191, -3.486]]], "type": "Polygon", "height": 0, "centre": [314.946, -0.003], "topNap": 20.869}, {"id": "L0002.50580b2d32d640a59c63d583bb8e5a90", "contours": [[[360.986, 4.308], [358.936, 4.277], [358.932, 4.966], [355.583, 4.908], [355.597, 3.632], [355.042, 3.624], [355.069, -3.467], [355.63, -3.49], [355.635, -4.864], [358.398, -4.854], [361.193, -4.865], [361.18, -4.227], [364.057, -4.252], [364.033, -2.649], [362.74, -2.632], [362.717, -0.308], [362.767, 2.665], [364.063, 2.683], [364.101, 4.355], [361.938, 4.298], [360.986, 4.308]]], "type": "Polygon", "height": 0, "centre": [359.93, 0.206], "topNap": 21.156}], "roads": [{"id": "L0002.44431abd6df04446938046443660da72", "contours": [[[445.988, -25.301], [445.929, -7.747], [400.089, -7.725], [352.671, -7.716], [298.214, -7.738], [249.129, -7.696], [193.978, -7.677], [125.883, -7.657], [75.933, -7.642], [28.771, -7.64], [-57.193, -7.652], [-124.039, -7.606], [-195.512, -7.591], [-246.17, -7.552], [-292.716, -7.559], [-345.186, -7.54], [-415.287, -7.507], [-445.976, -7.529], [-446.042, -24.791], [-446.044, -25.353], [-436.478, -25.431], [-424.392, -25.402], [-411.271, -25.399], [-393.727, -25.414], [-381.771, -25.44], [-365.081, -25.394], [-349.244, -25.438], [-334.316, -25.407], [-321.997, -25.44], [-306.137, -25.457], [-289.89, -25.457], [-275.013, -25.461], [-257.356, -25.445], [-241.621, -25.495], [-229.682, -25.535], [-216.542, -25.503], [-198.047, -25.501], [-180.574, -25.514], [-155.444, -25.573], [-125.069, -25.538], [-97.428, -25.603], [-59.338, -25.58], [-15.862, -25.631], [32.432, -25.632], [80.046, -25.572], [137.709, -25.568], [186.996, -25.569], [234.409, -25.602], [285.42, -25.617], [337.585, -25.718], [387.946, -25.661], [445.99, -25.801], [445.988, -25.301]]], "type": "Polygon", "height": 1, "attributes": {"bgt_functie": "rijbaan autoweg", "bgt_fysiekvoorkomen": "gesloten verharding"}}], "decks": [{"id": "L0002.7ca1e1d5f4c34f80bd2fe4b3d1ce1ddf", "contours": [[[-193.326, -4.106], [-221.732, -4.129], [-221.725, -4.608], [-222.269, -5.117], [-227.5, -5.198], [-228.064, -4.746], [-228.041, -4.128], [-267.062, -4.14], [-267.064, -4.729], [-267.588, -5.133], [-272.437, -5.106], [-273.009, -4.634], [-273.007, -4.095], [-312.203, -4.1], [-312.192, -4.624], [-312.711, -5.191], [-317.302, -5.193], [-317.92, -4.759], [-317.96, -4.116], [-336.37, -4.108], [-357.208, -4.127], [-357.209, -4.585], [-357.644, -4.918], [-361.927, -4.9], [-361.968, -7.678], [-180.983, -7.727], [179.741, -7.713], [361.42, -7.738], [361.404, -5.496], [357.435, -5.478], [356.815, -4.849], [356.81, -4.194], [336.055, -4.27], [318.069, -4.201], [318.082, -4.72], [317.464, -5.422], [312.565, -5.419], [311.944, -4.895], [311.945, -4.2], [291.912, -4.296], [273.132, -4.235], [273.152, -4.785], [272.648, -5.377], [267.557, -5.383], [267.042, -4.903], [267.048, -4.19], [247.948, -4.3], [228.196, -4.202], [228.178, -4.925], [227.852, -5.326], [222.506, -5.327], [222.044, -4.9], [222.051, -4.243], [198.592, -4.245], [183.153, -4.248], [183.135, -4.82], [182.612, -5.363], [177.595, -5.368], [177.061, -4.888], [177.024, -4.209], [138.306, -4.258], [138.328, -4.84], [137.766, -5.293], [132.593, -5.319], [131.955, -4.858], [131.975, -4.233], [93.227, -4.245], [93.252, -4.894], [92.763, -5.353], [87.624, -5.365], [87.111, -4.863], [87.041, -4.197], [48.114, -4.217], [48.164, -4.906], [47.573, -5.46], [42.696, -5.424], [42.044, -4.823], [42.048, -4.206], [3.255, -4.181], [3.288, -4.891], [2.811, -5.365], [-2.293, -5.34], [-2.924, -4.772], [-2.906, -4.184], [-41.744, -4.188], [-41.707, -4.762], [-42.146, -5.228], [-47.458, -5.277], [-48.072, -4.77], [-48.072, -4.164], [-86.791, -4.178], [-86.781, -4.77], [-87.213, -5.348], [-92.275, -5.335], [-92.976, -4.68], [-92.974, -4.186], [-132.117, -4.15], [-132.099, -4.835], [-132.733, -5.356], [-137.356, -5.39], [-138.055, -4.836], [-138.066, -4.17], [-177.458, -4.117], [-177.405, -4.779], [-177.948, -5.348], [-182.448, -5.346], [-183.039, -4.759], [-183.052, -4.128], [-193.326, -4.106]]], "type": "Polygon", "height": 2}, {"id": "L0002.cc0078b5825d426091cac514f39820c9", "contours": [[[-468.193, -28.78], [-438.307, -28.644], [-438.452, -6.583], [-439.625, -6.586], [-439.503, 1.638], [-439.507, 3.481], [-441.754, 3.47], [-441.76, 1.728], [-441.782, -6.273], [-440.719, -6.294], [-439.798, -7.03], [-439.691, -26.698], [-468.261, -26.777], [-468.193, -28.78]]], "type": "Polygon", "height": 2}, {"id": "L0002.f278045f709242f08d859ad45d23b0c9", "contours": [[[-139.287, -26.654], [-139.279, -27.017], [-138.721, -27.027], [-138.702, -26.651], [-94.208, -26.657], [-94.219, -27.064], [-93.602, -27.079], [-93.587, -26.659], [-49.449, -26.665], [-49.457, -27.079], [-48.812, -27.07], [-48.798, -26.666], [-4.312, -26.672], [-4.3, -27.1], [-3.57, -27.137], [-3.574, -26.671], [40.626, -26.671], [40.648, -27.093], [41.321, -27.111], [41.354, -26.666], [85.665, -26.678], [85.671, -27.101], [86.305, -27.106], [86.31, -26.677], [130.625, -26.69], [130.615, -27.144], [131.427, -27.17], [131.438, -26.684], [175.783, -26.684], [175.774, -27.085], [176.199, -27.082], [176.211, -26.685], [220.758, -26.713], [220.775, -27.153], [221.201, -27.152], [221.223, -26.711], [265.762, -26.756], [265.747, -27.128], [266.21, -27.12], [266.211, -26.758], [310.733, -26.798], [310.739, -27.131], [311.148, -27.138], [311.15, -26.803], [355.578, -26.802], [355.571, -27.187], [356.019, -27.18], [356.021, -26.816], [402.376, -26.795], [402.387, -27.162], [402.821, -27.163], [402.827, -26.797], [422.53, -26.823], [444.797, -26.882], [444.798, -27.177], [445.242, -27.184], [445.25, -26.877], [446.022, -26.879], [446.025, -25.852], [445.941, -25.851], [445.879, -7.696], [446.004, -7.696], [445.994, -7.303], [442.23, -7.323], [442.222, -6.664], [440.569, -6.652], [439.668, -7.432], [360.275, -7.342], [315.367, -7.291], [270.403, -7.221], [225.382, -7.192], [175.716, -7.265], [134.639, -7.24], [89.588, -7.239], [44.664, -7.215], [-0.25, -7.2], [-45.509, -7.197], [-90.284, -7.177], [-135.397, -7.185], [-179.512, -7.166], [-224.513, -7.197], [-270.38, -7.126], [-315.364, -7.116], [-360.076, -7.1], [-399.297, -7.083], [-439.91, -7.11], [-440.791, -6.394], [-442.372, -6.388], [-442.382, -7.045], [-446.19, -7.078], [-446.187, -7.477], [-445.926, -7.479], [-445.995, -25.4], [-446.182, -25.41], [-446.172, -26.61], [-439.827, -26.557], [-409.09, -26.578], [-409.092, -26.996], [-408.494, -26.987], [-408.505, -26.562], [-364.281, -26.591], [-364.287, -27.006], [-363.646, -26.986], [-363.635, -26.603], [-319.238, -26.584], [-319.245, -26.986], [-318.681, -26.988], [-318.661, -26.588], [-274.254, -26.597], [-274.265, -27.057], [-273.668, -27.038], [-273.668, -26.61], [-229.202, -26.621], [-229.21, -27.0], [-228.65, -27.007], [-228.647, -26.614], [-184.266, -26.636], [-184.274, -27.05], [-183.69, -27.044], [-183.691, -26.629], [-139.287, -26.654]]], "type": "Polygon", "height": 1}]};}
