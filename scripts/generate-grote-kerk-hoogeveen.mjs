// Grote Kerk Hoogeveen: a church hall grown from the 1652 Greek-cross church,
// with a hipped roof, tall arched bays and a small ridge belfry.
// Coordinates are metres in RD/local axes; the solid is a closed GLB plus a 1:1000 STL.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv=process.argv.slice(2);
const flag=(name,fallback)=>{const i=argv.indexOf(name);return i>=0&&argv[i+1]?argv[i+1]:fallback;};
const scale=Number(flag("--scale","1000")),slug="grote-kerk-hoogeveen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const mmPerMetre=1000/scale,wasm=await Module();wasm.setup();wasm.setCircularSegments(32);
const {Manifold,CrossSection}=wasm;
const ORIGIN=[228865.5,527043.5],X_AXIS=[1,0],GROUND_NAP=12.73,BASE=-0.3,NAP=h=>h-GROUND_NAP;
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const ccw=pts=>{let a=0;pts.forEach(([x,y],i)=>{const [u,v]=pts[(i+1)%pts.length];a+=x*v-u*y;});return a>0?pts:[...pts].reverse();};
const prism=(poly,z0,z1)=>Manifold.extrude(new CrossSection([ccw(poly)]),z1-z0).translate([0,0,z0]);
const box=(x0,x1,y0,y1,z0,z1)=>prism(rect(x0,x1,y0,y1),z0,z1);
const gable=(x0,x1,y0,y1,eave,ridge,axis="x")=>{
  const p=[[x0,y0,eave],[x1,y0,eave],[x1,y1,eave],[x0,y1,eave]];
  if(axis==="x"){const y=(y0+y1)/2;p.push([x0,y,ridge],[x1,y,ridge]);}
  else {const x=(x0+x1)/2;p.push([x,y0,ridge],[x,y1,ridge]);}
  return Manifold.hull(p);
};
const shed=(x0,x1,ya,yb,za,zb)=>Manifold.hull([
  [x0,ya,BASE],[x1,ya,BASE],[x0,yb,BASE],[x1,yb,BASE],
  [x0,ya,za],[x1,ya,za],[x0,yb,zb],[x1,yb,zb],
]);
const oct=([cx,cy],across)=>{
  const r=across/(2*Math.cos(Math.PI/8));
  return Array.from({length:8},(_,k)=>{const a=Math.PI/8+k*Math.PI/4;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});
};
const loft=sections=>Manifold.union(sections.slice(1).map(([z1,p1],i)=>{const[z0,p0]=sections[i];return Manifold.hull([...p0.map(([x,y])=>[x,y,z0]),...p1.map(([x,y])=>[x,y,z1])]);}));
const revolve=(cx,cy,profile)=>Manifold.revolve(new CrossSection([ccw(profile.map(([r,h])=>[r,NAP(h)]))]),0).translate([cx,cy,0]);
const opening=(profile,axis,lo,hi)=>Manifold.hull(profile.flatMap(([u,z])=>axis==="y"?[[u,lo,z],[u,hi,z]]:[[lo,u,z],[hi,u,z]]));
const archCut=(u,w,z0,z1,apex,axis,lo,hi)=>opening([[u-w/2,z0],[u+w/2,z0],[u+w/2,z1],[u+w*.35,z1+.45*(apex-z1)],[u,z1+(apex-z1)],[u-w*.35,z1+.45*(apex-z1)],[u-w/2,z1]],axis,lo,hi);

const solids=[];
const eaveMain=NAP(19.2),ridgeMain=NAP(25.2),eaveSide=eaveMain;
// One continuous hipped roof, following the visible roof outline and BAG footprint.
solids.push(box(-17.5,17.5,-11.8,11.8,BASE,eaveMain));
solids.push(Manifold.hull([
  [-17.5,-11.8,eaveMain],[-17.5,11.8,eaveMain],[17.5,-11.8,eaveMain],[17.5,11.8,eaveMain],
  [-13.8,0,ridgeMain],[13.8,0,ridgeMain],
]));
// Masonry piers and a supported cornice on both long facades.
for(const x of [-15,-10.8,-6.6,-2.4,1.8,6,10.2,14.4]){
  solids.push(box(x-.42,x+.42,-12.2,-11.45,BASE,eaveMain),box(x-.42,x+.42,11.45,12.2,BASE,eaveMain));
}
// Main entrance shown as a raised round-headed panel on the south side; a smaller west door marks the end wall.
const southDoor=opening([
  [-1.35,BASE],[1.35,BASE],[1.35,NAP(16.0)],[1.12,NAP(17.0)],[.75,NAP(17.65)],[0,NAP(17.9)],[-.75,NAP(17.65)],[-1.12,NAP(17.0)],[-1.35,NAP(16.0)],
],"y",-12.3,-11.75);
const westDoor=opening([
  [-1.15,BASE],[1.15,BASE],[1.15,NAP(16.0)],[.95,NAP(17.0)],[.62,NAP(17.6)],[0,NAP(17.8)],[-.62,NAP(17.6)],[-.95,NAP(17.0)],[-1.15,NAP(16.0)],
],"x",-17.9,-17.3);
solids.push(southDoor,westDoor);
// Four-post ridge turret near the west end, with an octagonal belfry and a compact onion-like cap.
const TC=[-13.4,-.1],tBase=NAP(25.0),tEave=NAP(27.1),tTop=NAP(28.0),towerWidth=3.4,post=.9;
solids.push(loft([[tBase,oct(TC,towerWidth)],[tEave,oct(TC,towerWidth)]]));
// Closed printable bell chamber; its former open posts required support under the roof.
solids.push(loft([[tEave,oct(TC,towerWidth)],[tTop,oct(TC,towerWidth)]]));
// Steep closed cap on the open bell frame; no thin eaves or horizontal ledges.
solids.push(loft([[tTop,oct(TC,3.4)],[NAP(28.35),oct(TC,2.65)],[NAP(28.8),oct(TC,1.8)],[NAP(29.3),oct(TC,.95)],[NAP(29.8),oct(TC,.3)],[NAP(30.9),[[TC[0],TC[1]]]]]));

let church=Manifold.union(solids);
// Arched window panels are raised from the masonry. Recess cuts here create
// narrow tunnels in the 1:1000 shell, so relief keeps the bays legible and solid.
for(const x of [-12.8,-8.6,-4.4,-.2,4,8.2,12.4]){
  const profile=[[x-.8,NAP(15.7)],[x+.8,NAP(15.7)],[x+.8,NAP(18.25)],[x+.63,NAP(18.75)],[x+.3,NAP(19.0)],[x,NAP(19.1)],[x-.3,NAP(19.0)],[x-.63,NAP(18.75)],[x-.8,NAP(18.25)]];
  solids.push(opening(profile,"y",-12.0,-11.4),opening(profile,"y",11.4,12.0));
}
// Raised arched panels on the western end wall.
for(const y of [-8,-4,0,4,8]) solids.push(archCut(y,1.55,NAP(15.7),NAP(18.1),NAP(19.0),"x",-17.8,-17.2));
church=Manifold.union(solids);
const parts=[["building:kerk-hoogeveen",church]];

const META={
  name:"Grote Kerk Hoogeveen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:-.3,
  replacesBuildings:["NL.IMBAG.Pand.0118100000035304"],
  description:"Oorsprong RD (228865,5, 527043,5); +X oostwaarts langs het hoofdvolume, +Y noordwaarts; maaiveld NAP +12,73 m. Hallenkerk met een schilddak, pilasters, rondboogvensters en een kleine gesloten dakruiter met klokkap. Hoogten uit AHN DSM/DTM 0,5 m; geveldetaillering en kapopbouw uit RCE-foto's. De hoofdingang is als verhoogd rondboogpaneel weergegeven voor steunloos printen op 1:1000.",
  realWorld:{lengthM:35.5,widthM:23.7,groundNapM:12.73,naveEaveNapM:19.2,naveRidgeNapM:25.2,belfryTopNapM:30.9},
  sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/22255","https://www.openstreetmap.org/way/280045026","PDOK BAG pand 0118100000035304, EPSG:28992","PDOK AHN DSM/DTM 0,5 m via WCS en Actueel_orthoHR-luchtfoto","Wikimedia Commons / RCE: exterieur 20114763–20114767; Historische Vereniging Hoogeveen, kerkgeschiedenis"],
};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-grote-kerk-hoogeveen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
