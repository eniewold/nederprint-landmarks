import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-walburgiskerk-netterden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

// Gebouwstelsel: x langs de as van toren (west) naar koor (oost), y naar het noorden,
// oorsprong in het hart van het schip op maaiveld. As uit de BAG-langsgevels (-2,4 graden).
const BASE=-.5,ORIGIN=[218785.0,430170.4],X_AXIS=[.99912,-.04182],GROUND_NAP=15.75;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Houd z <= a*x + b*y + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(r,z,cx=0,cy=0)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const rect=(a,b,c,d,z)=>[[a,c,z],[b,c,z],[b,d,z],[a,d,z]];

// Maten (m boven maaiveld NAP +15,75), uit 3DBAG, AHN-DSM 0,5 m en foto's.
const WALL_S=-7.31,WALL_N=7.31;          // buitengevels zijbeuken (BAG)
const NAVE_HALF=3.75,RIDGE=14.05,NAVE_SLOPE=1.64; // schipdak 59 graden, nok 3DBAG b3_h_nok
const BAY_EAVE=5.6,BAY_RIDGE=8.8;        // dwarse zadeldaken per travee (AHN kil 5,6 / nok 8,8)
const BAYS=[-10,-6,-2,2,6,10,14.58];     // traveegrenzen, steek 4 m (AHN-nokken op -8, -4 ... 12)
const TOWER=[-16.5,-9.7,-3.5,3.45],TOWER_TOP=21.5,SPIRE_TIP=41.0,TC=[-13.1,-.025];

const parts=[];
// Zijbeuken: lage romp tot de kilgoot, daarop per travee een dwars zadeldak met topgevel.
parts.push(box(BAYS[0],BAYS.at(-1),WALL_S,WALL_N,BASE,BAY_EAVE));
const bayRoof=(u0,u1,v0,v1,ridge,eave)=>{const uc=(u0+u1)/2,k=(ridge-eave)/((u1-u0)/2);let s=box(u0,u1,v0,v1,BASE,ridge+1);s=plane(s,-k,0,ridge+k*uc);return plane(s,k,0,ridge-k*uc)};
for(let i=0;i<BAYS.length-1;i++){
  parts.push(bayRoof(BAYS[i],BAYS[i+1],2.6,WALL_N,BAY_RIDGE,BAY_EAVE));
  if(i<BAYS.length-2)parts.push(bayRoof(BAYS[i],BAYS[i+1],WALL_S,-2.6,BAY_RIDGE,BAY_EAVE));
}
// Zuidoostelijke travee springt 2,75 m uit (risaliet met hogere topgevel en drie lancetten).
parts.push(bayRoof(10.13,14.6,-10.05,-2.4,10.0,6.6));
// Topgevelpijlertjes op elke travee.
for(let i=0;i<BAYS.length-1;i++){const uc=(BAYS[i]+BAYS[i+1])/2;parts.push(box(uc-.45,uc+.45,WALL_N-1.1,WALL_N+.05,7.6,9.7));if(i<BAYS.length-2)parts.push(box(uc-.45,uc+.45,WALL_S-.05,WALL_S+1.1,7.6,9.7));}
parts.push(box(11.92,12.82,-10.1,-9.0,8.8,10.9));
// Steunberen tussen de traveeën, schuin afgedekt.
const buttress=(u,s)=>{const w=WALL_N*s,o=(WALL_N+.85)*s;return Manifold.hull([[u-.45,w,BASE],[u+.45,w,BASE],[u-.45,o,BASE],[u+.45,o,BASE],[u-.45,o,3.9],[u+.45,o,3.9],[u-.45,w,4.75],[u+.45,w,4.75]])};
for(const u of [-6,-2,2,6,10])parts.push(buttress(u,1));
for(const u of [-6,-2,2,6])parts.push(buttress(u,-1));
parts.push(buttress(14.15,1));

// Schip: steil zadeldak, oostelijk afgewolfd boven de driezijdige koorsluiting.
const APSE=[[14.4,-2.65],[14.61,-2.65],[16.22,-1.03],[16.22,1.69],[14.51,3.4],[14.4,3.4]];
const APSE_EAVE=9.0,HIP=2.0;
parts.push(prism(APSE,BASE,APSE_EAVE));
let nave=prism([[-10,-NAVE_HALF],[14.6,-NAVE_HALF],...APSE.slice(1,5),[14.6,NAVE_HALF],[-10,NAVE_HALF]],5.2,RIDGE+1);
nave=plane(nave,0,-NAVE_SLOPE,RIDGE);nave=plane(nave,0,NAVE_SLOPE,RIDGE);
for(let i=1;i<4;i++){const [p,q]=[APSE[i],APSE[i+1]],dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;nave=plane(nave,-HIP*nx,-HIP*ny,APSE_EAVE+HIP*(nx*p[0]+ny*p[1]))}
parts.push(nave);
// Dakkapellen op beide schipdakvlakken (luchtfoto).
for(const u of [-8.5,-.5,7.5])for(const s of [-1,1]){
  const v0=s*1.9,v1=s*3.35;parts.push(box(u-.5,u+.5,Math.min(v0,v1),Math.max(v0,v1),7.5,9.6));
  parts.push(Manifold.hull([[u-.5,v0,9.55],[u+.5,v0,9.55],[u,v0,10.5],[u-.5,v1,9.55],[u+.5,v1,9.55],[u,v1,10.5]]));
}
// Dakruiter op de nok: achtkante lantaarn met naaldspits.
const DR=5.4;
parts.push(Manifold.hull([...oct(.95,12.6,DR,0),...oct(.95,16.6,DR,0)]));
parts.push(Manifold.hull([...oct(.95,16.55,DR,0),...oct(1.15,16.9,DR,0)]));
parts.push(Manifold.hull([...oct(1.15,16.85,DR,0),...oct(.12,22.2,DR,0)]));

// Toren: vierkant, kroonlijst op schuine kraag, ingesnoerde achtkante naaldspits.
const [t0,t1,t2,t3]=TOWER;
parts.push(box(t0,t1,t2,t3,BASE,TOWER_TOP));
parts.push(Manifold.hull([...rect(t0,t1,t2,t3,20.6),...rect(t0-.25,t1+.25,t2-.25,t3+.25,20.85),...rect(t0-.25,t1+.25,t2-.25,t3+.25,TOWER_TOP)]));
parts.push(Manifold.hull([...rect(t0+.15,t1-.15,t2+.15,t3-.15,TOWER_TOP-.05),...oct(2.95,24.2,...TC)]));
parts.push(Manifold.hull([...oct(2.95,24.15,...TC),...oct(.18,SPIRE_TIP,...TC)]));
// Galmgatlucarnes op de vier spitsvoeten en hoekpinakels.
for(const a of [0,90,180,270]){
  const luc=Manifold.union([box(1.1,3.05,-.5,.5,TOWER_TOP-.1,23.1),Manifold.hull([[1.1,-.5,23.05],[3.05,-.5,23.05],[1.1,.5,23.05],[3.05,.5,23.05],[1.1,0,24.1],[3.05,0,24.1]])]);
  parts.push(luc.rotate([0,0,a]).translate([TC[0],TC[1],0]));
}
for(const [cu,cv] of [[t0+.45,t2+.45],[t1-.45,t2+.45],[t1-.45,t3-.45],[t0+.45,t3-.45]]){
  parts.push(box(cu-.45,cu+.45,cv-.45,cv+.45,TOWER_TOP-.1,22.7));
  parts.push(Manifold.hull([...rect(cu-.45,cu+.45,cv-.45,cv+.45,22.65),[cu,cv,25.0]]));
}
// Traptoren in de hoek van toren en zuidaanbouw, achtkant met spits.
parts.push(Manifold.hull([...oct(1.15,BASE,-10.55,-4.35),...oct(1.15,10.0,-10.55,-4.35)]));
parts.push(Manifold.hull([...oct(1.3,9.95,-10.55,-4.35),...oct(.12,14.0,-10.55,-4.35)]));
// Zuidaanbouw tegen de toren: topgevel naar het zuiden, nok noord-zuid.
parts.push(bayRoof(-15.65,-9.69,-9.25,-3.3,9.6,5.7));
// Ingangsportaal met lessenaarsdak tussen zuidaanbouw en eerste travee.
{let p=box(-9.75,-5.9,-9.0,-6.9,BASE,3.7);p=plane(p,0,.5,3.7+.5*7.3);parts.push(p);}
// Noordaanbouw (doopkapel) met veelhoekige sluiting en tentdak.
const BAPT=[[-14.19,3.3],[-10.0,3.3],[-10.0,7.31],[-11.42,8.35],[-12.66,8.35],[-14.19,6.83]];
parts.push(prism(BAPT,BASE,6.0));
parts.push(Manifold.hull([...BAPT.map(([u,v])=>[u,v,5.95]),[-12.3,5.6,10.0]]));
parts.push(Manifold.hull([...oct(.5,9.4,-12.3,5.6),...oct(.1,11.6,-12.3,5.6)]));
// Achtkante traptoren met spits op de zuidoosthoek.
parts.push(Manifold.hull([...oct(1.37,BASE,10.0,-10.1),...oct(1.37,9.2,10.0,-10.1)]));
parts.push(Manifold.hull([...oct(1.55,9.15,10.0,-10.1),...oct(1.55,9.5,10.0,-10.1)]));
parts.push(Manifold.hull([...oct(1.5,9.45,10.0,-10.1),...oct(.12,16.0,10.0,-10.1)]));

let church=Manifold.union(parts);

// Vensters, galmgaten, portaal en wijzerplaten als blinde nissen.
// Lokale nis: breedte langs de gevel (x), hoogte z, uitwendige normaal -y; spitse top van ten minste 53 graden.
const nicheShape=(w,h,depth)=>{const rise=Math.max(.7,w*.67);return Manifold.extrude(new CrossSection([ccw([[-w/2,0],[w/2,0],[w/2,h-rise],[0,h],[-w/2,h-rise]])]),depth+.1).rotate([90,0,0]).translate([0,depth,0])};
const roundShape=(r,depth)=>Manifold.extrude(CrossSection.circle(r,16),depth+.1).rotate([90,0,0]).translate([0,depth,0]);
const ANG={S:0,N:180,E:90,W:-90};
const at=(shape,face,u,v,z)=>shape.rotate([0,0,ANG[face]]).translate([u,v,z]);
const cuts=[];
for(let i=0;i<BAYS.length-1;i++){const uc=(BAYS[i]+BAYS[i+1])/2;cuts.push(at(nicheShape(1.3,4.8,.35),"N",uc,WALL_N,2.0));if(i<BAYS.length-2)cuts.push(at(nicheShape(1.3,4.8,.35),"S",uc,WALL_S,2.0));}
for(const [u,h] of [[11.2,4.3],[12.37,5.6],[13.55,4.3]])cuts.push(at(nicheShape(.85,h,.35),"S",u,-10.05,2.2));
cuts.push(at(nicheShape(1.2,4.8,.35),"E",16.22,.33,2.4));
cuts.push(at(nicheShape(2.2,5.6,.4),"S",-12.67,-9.25,1.6));
cuts.push(at(nicheShape(1.2,3.0,.3),"S",-7.8,-9.0,BASE));
cuts.push(at(nicheShape(.9,2.8,.3),"W",-14.19,5.2,1.8));
// Toren: westportaal, venster, galmgaten en wijzerplaten.
cuts.push(at(nicheShape(1.8,4.3,.45),"W",t0,TC[1],BASE));
cuts.push(at(nicheShape(1.2,3.6,.35),"W",t0,TC[1],5.0));
for(const [f,u,v] of [["W",t0,TC[1]],["N",TC[0],t3],["S",TC[0],t2],["E",t1,TC[1]]]){
  const off=f==="W"||f==="E"?[0,1]:[1,0];
  if(f!=="E")for(const d of [-.75,.75])cuts.push(at(nicheShape(.85,3.9,.35),f,u+off[0]*d,v+off[1]*d,12.3));
  cuts.push(at(roundShape(1.0,.25),f,u,v,18.4));
}
church=church.subtract(Manifold.union(cuts));
const meshParts=[["building:kerk",church]];
const META={name:"Sint-Walburgiskerk Netterden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1509100000203686"],description:"Neogotische pseudobasiliek van Cuypers (1868) met dwarse topgevels per travee, toren met ingesnoerde naaldspits, dakruiter en traptorens; details geschat.",realWorld:{groundNapM:GROUND_NAP,ridgeM:RIDGE,towerTopM:TOWER_TOP,spireTipM:SPIRE_TIP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1509100000203686","https://monumentenregister.cultureelerfgoed.nl/monumenten/16072","https://nl.wikipedia.org/wiki/Sint-Walburgiskerk_(Netterden)","https://commons.wikimedia.org/wiki/Category:Sint-Walburgiskerk_(Netterden)","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.openstreetmap.org/way/270936402"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-walburgiskerk-netterden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(meshParts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

