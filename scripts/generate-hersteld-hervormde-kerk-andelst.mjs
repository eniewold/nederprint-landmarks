import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hersteld-hervormde-kerk-andelst";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Local X follows the axis from the western tower towards the taller eastern choir.
const BASE=-0.5,ORIGIN=[178450.8,435297.6],X_AXIS=[.955,.297],GROUND_NAP=9.632;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const nave=box(3,18.55,-3.6,6.2,BASE,6.8);let roof=box(3,18.6,-3.6,6.2,6.79,15);roof=plane(roof,0,-1.15,13.83);roof=plane(roof,0,1.15,10.84);
// The later Gothic choir is substantially higher, and closes in three planes.
const cp=[[18.45,-3.42],[31.1,-3.42],[33.61,-.72],[33.64,3.08],[31.2,5.71],[18.45,5.77]];
let choir=prism(cp,BASE,19);choir=plane(choir,0,-1.42,18.21);choir=plane(choir,0,1.42,14.8);choir=plane(choir,-1.42,0,60.6);
// A small lower attached entrance beside the tower.
let annex=box(-3.05,3.05,-6.25,-1.85,BASE,8);annex=plane(annex,0,1,10.5);annex=plane(annex,0,-1,2.4);
const tower=box(-3.28,3.12,-1.92,4.34,BASE,17.6);const sq=(r,z)=>[[-r,1.2-r,z],[r,1.2-r,z],[r,1.2+r,z],[-r,1.2+r,z]];
const spire=Manifold.hull([...sq(3.1,17.55),...sq(.45,27.1)]);
const ribs=[];for(const x of [19,23.4,27.8,31])for(const side of [-1,1]){const y=side<0?-3.4:5.7,o=side<0?-4.2:6.5;ribs.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,9.4],[x+.45,y,9.4]]));}
let church=Manifold.union([nave,roof,choir,annex,tower,spire,...ribs]);const cuts=[];
for(const x of [6.3,10.4,14.6])for(const side of [-1,1]){const y0=side<0?-3.9:5.95,y1=side<0?-3.35:6.5;cuts.push(box(x-.55,x+.55,y0,y1,2,4.65));cuts.push(Manifold.cylinder(y1-y0,.55,.55,20).rotate([90,0,0]).translate([x,y1,4.65]));}
for(const x of [20.7,25.1,29.5])for(const side of [-1,1]){const y0=side<0?-3.7:5.45,y1=side<0?-3.15:6.05;cuts.push(box(x-.6,x+.6,y0,y1,2.8,8));cuts.push(Manifold.hull([[x-.6,y0,8],[x+.6,y0,8],[x,y0,8.85],[x-.6,y1,8],[x+.6,y1,8],[x,y1,8.85]]));}
cuts.push(box(-3.55,-3.02,.6,1.8,BASE,2.8));for(const y of [.35,2.05])cuts.push(box(-3.55,-3.02,y-.4,y+.4,14.7,16.7));for(const x of [-.8,.8])for(const side of [-1,1])cuts.push(box(x-.4,x+.4,side<0?-2.2:4.1,side<0?-1.7:4.6,14.7,16.7));church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Hersteld Hervormde Kerk Andelst",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1734101000027014"],description:"Vroegromaans schip met hoger gotisch driezijdig koor en westtoren; spitsuiteinde en geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1734101000027014","https://www.monumenten.nl/monument/36730","https://www.monumenten.nl/monument/36729","https://commons.wikimedia.org/wiki/Category:NH_church_Andelst","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hersteld-hervormde-kerk-andelst.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


