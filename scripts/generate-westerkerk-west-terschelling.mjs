import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="westerkerk-west-terschelling";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Main axis follows the church west-to-east; coordinates and roof facets derive from 3D BAG and AHN.
const BASE=-0.5,ORIGIN=[143532,596888],X_AXIS=[.869,.495],GROUND_NAP=5.916;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const nave=box(-12.1,13.43,-5.75,6.0,BASE,5.49);
let roof=box(-12.1,13.43,-5.75,6.0,5.48,16);roof=plane(roof,0,-1.297,13.11+.125*1.297);roof=plane(roof,0,1.297,13.11-.125*1.297);
// Lower rear annex; exact ridge is estimated from the BAG points and photographs.
let annex=box(-17.4,-12,-3.3,6,BASE,10);annex=plane(annex,0,-.6,7.2+.6*1.35);annex=plane(annex,0,.6,7.2-.6*1.35);
// The roof-mounted bell turret has a filled core and shallow blind openings, preserving printable walls.
const turret=box(10.75,12.55,-.78,1.02,12.2,15.05);
const sq=(r,z)=>[[11.65-r,.12-r,z],[11.65+r,.12-r,z],[11.65+r,.12+r,z],[11.65-r,.12+r,z]];
const cap=Manifold.hull([...sq(.9,15.0),...sq(.45,16.95)]);
const ribs=[];for(const x of [-11.7,-6.85,-1.8,3.2,8.15,13.0])for(const side of [-1,1]){const inner=side<0?-5.7:5.95,outer=side<0?-6.25:6.5;ribs.push(Manifold.hull([[x-.45,inner,BASE],[x+.45,inner,BASE],[x-.45,outer,BASE],[x+.45,outer,BASE],[x-.45,inner,5.4],[x+.45,inner,5.4],[x-.45,outer,4.85],[x+.45,outer,4.85]]));}
let church=Manifold.union([nave,roof,annex,turret,cap,...ribs]);
const cuts=[];for(const x of [-9.3,-4.3,.7,5.7,10.5])for(const side of [-1,1]){const y0=side<0?-6.2:5.75,y1=side<0?-5.5:6.3;cuts.push(box(x-.55,x+.55,y0,y1,1.8,4.3));cuts.push(Manifold.cylinder(y1-y0,.55,.55,20).rotate([90,0,0]).translate([x,y1,4.3]));}
// East entrance and two windows. Openings are blind so that the print has no unsupported arches.
cuts.push(box(13.15,13.8,-.65,.65,BASE,2.8));for(const y of [-3,3]){cuts.push(box(13.15,13.8,y-.55,y+.55,2.3,4.7));cuts.push(Manifold.cylinder(.65,.55,.55,20).rotate([0,90,0]).translate([13.15,y,4.7]));}
for(const side of [-1,1]){cuts.push(box(11.3,12.0,side<0?-.95:.75,side<0?-.55:1.2,13.55,14.8));cuts.push(box(side<0?10.5:12.3,side<0?11:12.8,-.22,.46,13.55,14.8));}
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Westerkerk West-Terschelling",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0093100000215186"],description:"Recht gesloten zaalkerk met vijf venstertraveeën en een dakruiter; geveldetails en uiterste dakruiterpunt naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0093100000215186","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/35074","https://commons.wikimedia.org/wiki/Category:Westerkerk_(West-Terschelling)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-westerkerk-west-terschelling.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


