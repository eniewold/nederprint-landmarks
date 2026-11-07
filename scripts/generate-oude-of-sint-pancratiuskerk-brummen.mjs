import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-of-sint-pancratiuskerk-brummen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the historic church from its western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[207871,455682],X_AXIS=[.99733,.07302],GROUND_NAP=10.347;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
let nave=box(4,34,-4.3,5.5,BASE,17);nave=plane(nave,0,-1.25,16.35);nave=plane(nave,0,1.25,14.85);
let choir=prism([[33.5,-4.3],[35,-4.3],[37.5,-2.4],[37.5,2],[34.5,5.3],[33.5,5.3]],BASE,17);choir=plane(choir,0,-1.25,16.35);choir=plane(choir,0,1.25,14.85);choir=plane(choir,-1,0,51.6);
// South aisle and later low entry extension, constructed as separate plane-faced buildings.
let aisle=box(5.5,31.2,-14,-4,BASE,15);aisle=plane(aisle,0,-1.1,2.5);aisle=plane(aisle,0,1.1,22.3);
let porch=box(9.8,27,-18.4,-13.7,BASE,10);porch=plane(porch,0,-1, -7.2);porch=plane(porch,0,1,25.0);
// The separately recorded tower includes a polygonal stair turret on the north.
const tower=box(-4,4.25,-3.7,4.55,BASE,22.1);
const stair=prism([[3.8,4],[3.8,4.8],[2.6,5.8],[1.2,5.8],[.3,4.8],[.2,4]],BASE,14.3);
const stairRoof=Manifold.hull([...oct(2,4.7,1.75,14.25),...oct(2,4.7,.45,16)]);
const baseRoof=Manifold.hull([...sq(.1,.4,4.2,22.05),...oct(.1,.4,2.8,23.1)]);
const spire=Manifold.hull([...oct(.1,.4,2.8,23.05),...oct(.1,.4,.9,38.4),...oct(.1,.4,.45,39.08)]);
const supports=[];for(const x of [4.5,10.2,16.1,21.6,26.4,31]){let s=box(x-.48,x+.48,5.3,7.1,BASE,9.4);s=plane(s,0,-1,15.5);supports.push(s);}
let church=Manifold.union([nave,choir,aisle,porch,tower,stair,stairRoof,baseRoof,spire,...supports]);
const cuts=[];for(const x of [7.5,13.4,18.8,23.9,28.7]){cuts.push(box(x-.65,x+.65,5.15,5.9,2.6,7.3));cuts.push(Manifold.cylinder(.75,.65,.65,20).rotate([90,0,0]).translate([x,5.9,7.3]));}
// Paired tall windows in the west-facing gable and small south-side openings.
for(const y of [-11.6,-8.1])cuts.push(box(5.25,5.85,y-.6,y+.6,3.5,8.2));
for(const x of [7.2,29])cuts.push(box(x-.55,x+.55,-14.3,-13.75,2.5,6.5));
for(const x of [12.2,16.3,20.4,24.5])cuts.push(box(x-.55,x+.55,-18.7,-18.1,2.3,5.5));
for(const y of [-2,0,2]){cuts.push(box(-4.3,-3.7,y-.4,y+.4,17,20));cuts.push(box(-4.3,-3.7,y-.4,y+.4,10.3,15.5));}
for(const x of [-2,0,2])for(const side of [-1,1])cuts.push(box(x-.4,x+.4,side<0?-4:4.25,side<0?-3.4:4.85,17,20));
cuts.push(box(-4.3,-3.7,-.6,.6,BASE,2.6));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Oude of Sint-Pancratiuskerk Brummen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0213100000079251","NL.IMBAG.Pand.0213100000079204"],description:"Laatgotische kerk met driezijdig koor, zuidbeuk uit 1937 en afzonderlijk geregistreerde westtoren met afgeknotte achtkante spits. Details geschat naar AHN en foto's.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0213100000079251","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0213100000079204","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/11231","https://commons.wikimedia.org/wiki/Category:Oude-_of_Sint-Pancratiuskerk,_Brummen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-of-sint-pancratiuskerk-brummen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));



