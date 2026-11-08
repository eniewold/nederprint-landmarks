import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-remigiuskerk-steenderen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X from the west tower toward the polygonal east choir.
const BASE=-.5,ORIGIN=[209849.4,453024.3],X_AXIS=[.99459663,.10381491],GROUND_NAP=10.293;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(s)=>{s=plane(s,0,-1.40,22.42);return plane(s,0,1.40,21.3);};
// Broad nave roof, distinct narrower choir with a three-sided end.
let nave=gable(box(3.75,38,-9.6,10.25,BASE,21.86));
let choir=prism([[37.5,-4.6],[41.6,-4.4],[44,-1.1],[44.1,1.6],[41.7,4.7],[37.5,4.9]],BASE,21.86);choir=gable(choir);choir=plane(choir,-1.4,0,76.46);
const tower=box(-4.1,3.8,-4,4.9,BASE,27.05);
// A square base and short tapered shoulder lead into the eight-sided spire.
const square=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
const oct=(r,z)=>Array.from({length:8},(_,i)=>[-.15+r*Math.cos(Math.PI/8+i*Math.PI/4),.45+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const shoulder=Manifold.hull([...square(-4.1,3.8,-4,4.9,27),...oct(2.9,30.3)]);
const spire=Manifold.hull([...oct(2.9,30.25),...oct(.5,42.06)]);
const braces=[];for(const x of [4.2,9.9,14.7,19.7,25,31.9,37.9])for(const sign of [-1,1]){
 const y0=sign<0?-10.9:9.95,y1=sign<0?-9.35:11.35;
 let b=box(x-.47,x+.47,y0,y1,BASE,7.9);b=plane(b,0,sign<0?1:-1,sign<0?18.2:18.5);braces.push(b);
}
for(const [x,y,ang] of [[41.5,-4.5,210],[44,-1.5,255],[44.1,1.6,285],[41.7,4.7,335]]){let b=box(-.46,.46,-.15,.85,BASE,10.6);b=plane(b,0,-1,10.75);braces.push(b.rotate([0,0,ang]).translate([x,y,0]));}
let church=Manifold.union([nave,choir,tower,shoulder,spire,...braces]);
const sideNiche=(x,y,z,w,h)=>{const pts=[[-w/2,0],[w/2,0],[w/2,h-.65],[0,h],[-w/2,h-.65]];return Manifold.extrude(new CrossSection([pts]),.4).rotate([90,0,0]).translate([x,y,z]);};
const frontNiche=(y,z,w,h)=>{const pts=[[-w/2,0],[w/2,0],[w/2,h-.6],[0,h],[-w/2,h-.6]];return Manifold.extrude(new CrossSection([pts]),.4).rotate([90,0,90]).translate([-4.16,y,z]);};
const cuts=[];for(const x of [6.7,12.2,17.2,22.2,28.4,34.9]){cuts.push(sideNiche(x,-9.26,2.5,1.25,4.6));cuts.push(sideNiche(x,10.31,2.5,1.25,4.6));}
for(const sign of [-1,1])for(const x of [-1.6,1.0]){const y=sign<0?-3.65:4.96;cuts.push(sideNiche(x,y,20.2,1.1,3.5));}
cuts.push(frontNiche(0,.05,1.65,3),frontNiche(-1.3,20.2,1.1,3.5),frontNiche(1.3,20.2,1.1,3.5));
for(const y of [-1.5,1.5])cuts.push(frontNiche(y,8,.9,7.0));
// Shallow clock face on the western and northern tower walls.
cuts.push(Manifold.cylinder(.35,.7,.7,24).rotate([0,90,0]).translate([-4.16,0,25.2]));
cuts.push(Manifold.cylinder(.35,.7,.7,24).rotate([90,0,0]).translate([0,4.96,25.2]));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Sint-Remigiuskerk Steenderen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1876100000016632"],description:"Pseudobasiliek met breed schip, driezijdig koor en stevige westtoren; +X loopt van toren naar koor.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1876100000016632","https://monumentenregister.cultureelerfgoed.nl/monumenten/34521","https://commons.wikimedia.org/wiki/Category:Sint-Remigiuskerk,_Steenderen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-remigiuskerk-steenderen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


