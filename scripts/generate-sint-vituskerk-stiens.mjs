import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-vituskerk-stiens";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// BAG and 3D BAG ridge/facade direction, +X east, Z up. Heights above AHN ground NAP +2.611 m.
const BASE=-0.5,ORIGIN=[179704,586259.3],X_AXIS=[0.998270,0.058798],GROUND_NAP=2.611;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,ridgeY,z,slope,hip)=>{let s=prism(p,BASE,50);s=plane(s,0,slope,z-slope*ridgeY);s=plane(s,0,-slope,z+slope*ridgeY);if(hip)s=plane(s,-slope,0,z+slope*hip);return s};
// Main nave and narrower, five-sided choir: BAG outline and 3D BAG planar roofs.
const nave=[[-13.8,-5.5],[15.9,-5.5],[15.9,6.08],[-13.8,5.93]];
const choir=[[15.7,-3.85],[19.25,-3.85],[22.35,-3.1],[24.17,-.65],[24.05,1.66],[22.15,4.02],[19.55,4.45],[15.7,4.45]];
const main=roof(nave,.3,17.63,1.36),apse=roof(choir,.3,17.63,1.36,19.15);
// Square west tower with saddle roof: actual ridge east-west, not a spire.
const tower=roof([[-23.36,-4.36],[-13.75,-4.36],[-13.75,4.83],[-23.36,4.83]],.24,37.55,2.18);
// Small south-side vestry, pitched roof, reconstructed from photographs and orthophoto.
const annex=roof([[11.3,-7.5],[16.05,-7.5],[16.05,-5.15],[11.3,-5.15]],-6.32,4.05,1.05);
let church=Manifold.union([main,apse,tower,annex]);
// Recesses are shallow and pointed so the ceilings remain printable at 1:1000.
const cuts=[];
function sideNiche(x,y,w,z0,z1,side){const y0=y+(side>0?-.35:-.25),y1=y+(side>0?.25:.35);return Manifold.hull([[x-w/2,y0,z0],[x+w/2,y0,z0],[x-w/2,y1,z0],[x+w/2,y1,z0],[x-w/2,y0,z1],[x+w/2,y0,z1],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y0,z1+w*.85],[x,y1,z1+w*.85]])}
for(const x of [-9.5,-4.7,.1,4.9,9.7]){cuts.push(sideNiche(x,-5.48,1.35,2.5,6.6,-1));}
for(const x of [-9.5,-4.7,.1,4.9,9.7])cuts.push(sideNiche(x,5.99,1.30,2.6,6.5,1));
cuts.push(sideNiche(18.0,-3.85,1.65,3.0,7.5,-1),sideNiche(18.0,4.45,1.65,3.0,7.5,1));
// Tower belfry paired lancets and lower faÃ§ade windows on each side.
for(const x of [-20.4,-16.9])for(const side of [-1,1])cuts.push(sideNiche(x,side<0?-4.36:4.83,1.2,22.3,25.2,side));
for(const x of [-20.4,-16.9])for(const side of [-1,1])cuts.push(sideNiche(x,side<0?-4.36:4.83,1.2,8.1,14.5,side));
// West entrance and pointed recesses on both sides of the portal.
const westNiche=(y,w,z0,z1)=>Manifold.hull([[-23.65,y-w/2,z0],[-22.95,y-w/2,z0],[-23.65,y+w/2,z0],[-22.95,y+w/2,z0],[-23.65,y-w/2,z1],[-22.95,y-w/2,z1],[-23.65,y+w/2,z1],[-22.95,y+w/2,z1],[-23.65,y,z1+w*.85],[-22.95,y,z1+w*.85]]);
cuts.push(westNiche(.24,2.0,BASE,3.2),westNiche(-2.3,1.15,5.3,10.3),westNiche(2.75,1.15,5.3,10.3),westNiche(-1.4,1.25,22.3,25.2),westNiche(1.85,1.25,22.3,25.2));
// Recessed paired gable arches beneath the saddle roof on both gables.
for (const y of [-1.25,1.65]) {
  cuts.push(westNiche(y,1.15,28.6,31.0));
  cuts.push(Manifold.hull([[-14.05,y-.575,28.6],[-13.45,y-.575,28.6],[-14.05,y+.575,28.6],[-13.45,y+.575,28.6],[-14.05,y-.575,31.0],[-13.45,y-.575,31.0],[-14.05,y+.575,31.0],[-13.45,y+.575,31.0],[-14.05,y,31.98],[-13.45,y,31.98]]));
}
// Ovale blinde nissen op de zuidoostelijke en oostelijke zijde van de koorsluiting.
cuts.push(Manifold.sphere(1,24).scale([1.15,.48,.62]).translate([20.7,-3.5,3.2]));
cuts.push(Manifold.sphere(1,24).scale([.48,1.0,.62]).translate([24.1,.4,3.2]));
// Church side doorway and shallow circular clock on the tower.
cuts.push(sideNiche(-7.0,-5.48,1.35,BASE,2.6,-1));
cuts.push(Manifold.cylinder(.55,.8,.8,16).rotate([90,0,0]).translate([-18.5,-4.05,19.0]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint Vituskerk Stiens",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0081100000004723"],description:"Middeleeuwse zaalkerk met smaller vijfzijdig gesloten koor, schildkap, lage aanbouw en hoge zadeldaktoren; dakvlakken en positie uit 3D BAG/AHN, gevelnissen en aanbouw naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0081100000004723","https://monumentenregister.cultureelerfgoed.nl/monumenten/24542","https://commons.wikimedia.org/wiki/Category:Sint-Vituskerk,_Stiens","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-vituskerk-stiens.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


