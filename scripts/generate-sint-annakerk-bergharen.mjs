import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-annakerk-bergharen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X from the crossing toward the entrance; dimensions in metres.
const BASE=-.5,ORIGIN=[174173.5,429102],X_AXIS=[.833,.553],GROUND_NAP=7.268;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,60);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
const nave=roof([[-6,-4.25],[18,-4.25],[18,4.6],[-6,4.6]],.15,18.0,1.55);
let choir=roof([[-12.7,-2],[-10.4,-4.2],[-4,-4.2],[-4,4.5],[-10.4,4.5],[-12.7,2.2]],.15,18,1.55);choir=plane(choir,1.1,0,31.0);
let cross=prism([[-4.2,-9.5],[3.4,-9.5],[3.4,10.2],[-4.2,10.2]],BASE,60);cross=plane(cross,1.6,0,18.64);cross=plane(cross,-1.6,0,17.36);
const aisles=[];for(const s of [-1,1]){const a=s<0?-7.8:4.4,b=s<0?-4.1:8.3;let t=prism([[3.2,a],[17.5,a],[17.5,b],[3.2,b]],BASE,50);t=plane(t,0,s<0?1:-1,s<0?15.5:16.1);aisles.push(t);}
const tower=box(-3.85,3.2,-3.4,3.7,BASE,25.3);
const sq=(r,z,x=0,y=.15)=>[[-r,-r],[r,-r],[r,r],[-r,r]].map(([a,b])=>[x+a,y+b,z]);
const spire=Manifold.hull([...sq(3.6,25.2,-.3,.15),...sq(.45,46,-.3,.15)]);
const pinnacles=[];for(const x of [-3.2,2.6])for(const y of [-2.8,3.1])pinnacles.push(Manifold.hull([...sq(.7,24.9,x,y),...sq(.45,33.5,x,y)]));
// Entrance front carries two small round stair turrets and conical caps.
const turrets=[];for(const y of [-4.5,4.8]){turrets.push(Manifold.cylinder(14.5,1.1,1.1,20).translate([17.4,y,BASE]));turrets.push(Manifold.cylinder(5.5,1.1,.45,20).translate([17.4,y,14.0]));}
const portal=roof([[17.4,-3.5],[21.1,-3.5],[21.1,4.2],[17.4,4.2]],.35,8.1,1.0);
const butt=[];for(const x of [5.3,9.2,13.2,16.8])for(const s of [-1,1]){let y=s<0?-7.7:8.2,o=y+s*.9;butt.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,6.0],[x+.45,y,6.0],[x-.45,y+s*.45,5.55],[x+.45,y+s*.45,5.55]]));}
let church=Manifold.union([nave,choir,cross,tower,spire,portal,...aisles,...pinnacles,...turrets,...butt]);
const cuts=[];
function niche(x,y,w,z0,z1,sign){const y0=y+(sign>0?-.35:-.18),y1=y+(sign>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const cap=Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w*.5],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w*.5]]);return Manifold.union([b,cap]);}
for(const x of [7.2,11.2,15])for(const s of [-1,1])cuts.push(niche(x,s<0?-7.8:8.3,1.35,2.4,5.8,s));
for(const s of [-1,1])for(const x of [-1.3,.7])cuts.push(niche(x,s<0?-3.4:3.7,1.0,19.0,22.6,s));
for(const s of [-1,1]){const y=s<0?-9.5:10.2;for(const x of [-1.45,.65])cuts.push(niche(x,y,1.2,3.3,9.0,s));cuts.push(Manifold.cylinder(.5,1.05,1.05,24).rotate([90,0,0]).translate([-.4,y+.25,11.6]));}
// Recessed circular rosette on the entrance face, not a through-hole.
cuts.push(Manifold.cylinder(.5,1.5,1.5,32).rotate([0,90,0]).translate([17.8,.15,12.1]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint-Annakerk Bergharen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0296100000026166"],description:"Neogotische kruisbasiliek met vieringtoren, hoofdspits, vier hoekspitsen en twee ronde ingangstorentjes; details geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0296100000026166","https://www.kerkramentussenmaasenwaal.nl/kerken/bergharen-annakerk/","https://commons.wikimedia.org/wiki/Category:Sint-Annakerk,_Bergharen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-annakerk-bergharen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


