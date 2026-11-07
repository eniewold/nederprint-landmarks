import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="ioannis-theatertsjerke-wier";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Axis follows the nave east from the tower to the rounded choir.
const BASE=-0.5,ORIGIN=[170701.7,584988.8],X_AXIS=[.9992,.04],GROUND_NAP=2.434;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const nave=box(1.75,19.55,-5,3.25,BASE,5.95);
let roof=box(1.75,20,-5,3.25,5.94,15);roof=plane(roof,0,-1.45,10.65);roof=plane(roof,0,1.45,13.19);
// Polygonal approximation of the semicircular choir, hipped roof cut with planes.
const apse=[[19.4,-5],[21.7,-4.67],[22.8,-3.8],[23.8,-2.7],[24.24,-1.05],[24.22,.07],[23.88,1.17],[23.37,1.93],[22.78,2.53],[20.6,3.5],[19.4,3.25]];
let choir=prism(apse,BASE,15);choir=plane(choir,0,-1.45,10.65);choir=plane(choir,0,1.45,13.19);choir=plane(choir,-1.45,0,40.2);
const tower=box(-1.86,1.86,-2.84,2.88,BASE,13.8), upper=box(-1.8,1.8,-2.72,2.76,13.78,18.05);
const sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]];const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const cornice=Manifold.hull([...sq(2.1,17.8),...sq(2.3,18),...sq(2.3,18.1)]),spire=Manifold.hull([...oct(2.3,18.05),...oct(.45,30.5)]);
// Four heavy sloping buttresses on the southern wall; width 0.9 m at 1:1000.
const ribs=[];for(const x of [5.88,9.46,13.04,16.63])ribs.push(Manifold.hull([[x-.45,-4.95,BASE],[x+.45,-4.95,BASE],[x-.45,-6.5,BASE],[x+.45,-6.5,BASE],[x-.45,-4.95,5.05],[x+.45,-4.95,5.05]]));
let church=Manifold.union([nave,roof,choir,tower,upper,cornice,spire,...ribs]);
const cuts=[];for(const x of [4.05,7.7,11.25,14.85,18.35])for(const side of [-1,1]){const y0=side<0?-5.3:3.0,y1=side<0?-4.75:3.55;cuts.push(box(x-.55,x+.55,y0,y1,1.8,4.25));cuts.push(Manifold.cylinder(y1-y0,.55,.55,20).rotate([90,0,0]).translate([x,y1,4.25]));}
// Tower entry, paired arches and the conspicuous astronomical clock.
cuts.push(box(-2.1,-1.65,-.6,.6,BASE,2.7));for(const y of [-.7,.7]){cuts.push(box(-2.1,-1.6,y-.38,y+.38,9.8,12.0));cuts.push(box(-2.1,-1.6,y-.4,y+.4,14.3,16.8));}
for(const x of [-.75,.75])for(const side of [-1,1])cuts.push(box(x-.38,x+.38,side<0?-3:2.5,side<0?-2.5:3,14.2,16.9));
cuts.push(Manifold.cylinder(.45,.9,.9,24).rotate([90,0,0]).translate([0,-2.65,6.0]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Ioannis Theatertsjerke Wier",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0083100000000365"],description:"Romaanse zaalkerk met halfrond koor, zuidelijke steunberen en westtoren. Spitstop en geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0083100000000365","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/28626","https://commons.wikimedia.org/wiki/Category:Ioannis_Theaterchurch","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-ioannis-theatertsjerke-wier.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


