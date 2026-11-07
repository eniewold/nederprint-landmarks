import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-sint-victorkerk-batenburg";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X axis from the western tower to the eastern wall; all dimensions in metres.
const BASE=-.4,ORIGIN=[171685,426080],X_AXIS=[.975,.222],GROUND_NAP=8.463;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,40);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// Main transverse section is a single steep gable roof, measured in AHN.
const nave=roof([[-3.1,-7.4],[17.6,-7.4],[17.6,8.1],[-3.1,8.1]],.35,14.45,1.1);
const tower=box(-3.1,3.5,-4,3.3,BASE,16.4);
const top=Manifold.hull([[-3.1,-4,16.3],[3.5,-4,16.3],[-3.1,3.3,16.3],[3.5,3.3,16.3],[.2,-.35,22.2]]);
// Low eastern chapel and two small projections on the southern elevation.
const chapel=roof([[16.8,-9.4],[23.2,-9.4],[23.2,-3.2],[16.8,-3.2]],-6.3,7.9,1.0);
const supports=[];for(const x of [3.9,12.9])for(const side of [-1,1]){let y=side<0?-7.35:8.05,outer=y+side*.9;supports.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,outer,BASE],[x+.45,outer,BASE],[x-.45,y,6],[x+.45,y,6],[x-.45,y+side*.45,5.55],[x+.45,y+side*.45,5.55]]));}
// Square clock dormers rising out of the pitched tower roof.
const clocks=[box(-.6,.6,2.2,3.3,16.3,17.8),box(-.6,.6,-4,-2.9,16.3,17.8),box(-3.1,-2,-.9,.3,16.3,17.8),box(2.4,3.5,-.9,.3,16.3,17.8)];
let church=Manifold.union([nave,tower,top,chapel,...supports,...clocks]);
const cuts=[];
function niche(x,y,w,z0,z1,side){const y0=y+(side>0?-.35:-.18),y1=y+(side>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const cap=Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w*.45],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w*.45]]);return Manifold.union([b,cap]);}
for(const x of [5.5,10.2,14.8]) {cuts.push(niche(x,8.1,1.6,2.1,5.1,1));cuts.push(niche(x,-7.4,1.6,2.1,5.1,-1));}
// Bell openings are recessed: no unsupported through-holes at print scale.
for(const side of [-1,1])for(const x of [-1.0,1.0]){let y=side<0?-4:3.3;const y0=y+(side>0?-.35:-.2),y1=y+(side>0?.2:.35);const b=box(x-.48,x+.48,y0,y1,13.4,15.0);const c=Manifold.cylinder(y1-y0,.48,.48,16).rotate([90,0,0]).translate([x,y1,15.0]);cuts.push(Manifold.union([b,c]));}
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Oude Sint-Victorkerk Batenburg",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0296100000023786"],description:"Breed kerkschip met ingebouwde lage westtoren en tentdak, kleine oostelijke grafkapel en gevelnissen. Details naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0296100000023786","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/8713","https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Victorkerk,_Batenburg_(Dutch_Reformed)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-sint-victorkerk-batenburg.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


