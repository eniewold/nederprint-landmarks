import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="kerk-van-warstiens";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the nave from the eastern tower toward the western choir; Y is south.
const BASE=-0.5,ORIGIN=[186770.0,575052.8],X_AXIS=[-.99829,.05847],GROUND_NAP=1.132;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// The aisle, lower three-sided western choir, and their plane-faced roofs.
const nave=box(1.25,18.56,-4.12,4.12,BASE,7.56);
let roof=box(1.25,18.58,-4.12,4.12,7.54,15);
roof=plane(roof,0,-1.164,12.35);roof=plane(roof,0,1.164,12.35);
const choir=[[18.45,-2.91],[19.45,-2.91],[20.77,-1.5],[20.77,1.5],[19.45,2.91],[18.45,2.91]];
let apse=prism(choir,BASE,12);apse=plane(apse,0,-1.164,10.90);apse=plane(apse,0,1.164,10.90);apse=plane(apse,-1.0,0,30.35);
// Two masonry stages on the east, capped by a sloped cornice and eight-sided spire.
const tower=box(-1.24,1.4,-1.52,1.52,BASE,12.55);
const top=box(-1.16,1.32,-1.44,1.44,12.5,17.1);
const sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]];
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const cornice=Manifold.hull([...sq(1.43,16.75),...sq(1.65,17.02),...sq(1.65,17.18)]);
const foot=Manifold.hull([...oct(1.65,17.1),...oct(1.25,17.9)]);
const spire=Manifold.hull([...oct(1.25,17.85),...oct(.45,30.0)]);
// Buttresses are widened to 0.9 m at scale; sloped heads retain support-free printing.
const supports=[];
for(const x of [4.7,8.1,11.48,14.84])for(const side of [-1,1]){
 const inner=side*4.0,outer=side*4.85;
 supports.push(Manifold.hull([[x-.45,inner,BASE],[x+.45,inner,BASE],[x-.45,outer,BASE],[x+.45,outer,BASE],[x-.45,inner,7.05],[x+.45,inner,7.05],[x-.45,side*4.5,6.55],[x+.45,side*4.5,6.55]]));
}
let church=Manifold.union([nave,roof,apse,tower,top,cornice,foot,spire,...supports]);
// Five shallow round-headed window niches per long wall.
const cuts=[];
for(const x of [2.95,6.4,9.8,13.15,16.55])for(const side of [-1,1]){
 const y0=side<0?-4.5:3.85,y1=side<0?-3.85:4.5;
 cuts.push(box(x-.65,x+.65,y0,y1,2.3,5.3));
 cuts.push(Manifold.cylinder(y1-y0,.65,.65,20).rotate([90,0,0]).translate([x,y1,5.3]));
}
// Entry, tall tower recesses, clock faces and paired belfry openings.
cuts.push(box(-1.6,-.95,-.53,.53,BASE,2.55));
for(const y of [-.53,.53])cuts.push(box(-1.56,-.92,y-.38,y+.38,5.3,8.1));
for(const y of [-.63,.63])cuts.push(box(-1.5,-.9,y-.35,y+.35,13.15,15.95));
for(const x of [-.57,.57])for(const side of [-1,1])cuts.push(box(x-.35,x+.35,side<0?-1.8:1.15,side<0?-1.15:1.8,13.15,15.95));
for(const y of [-1.45,1.45]) cuts.push(Manifold.cylinder(.5,.55,.55,20).rotate([90,0,0]).translate([0,y+.25,10.55]));
cuts.push(Manifold.cylinder(.55,.58,.58,20).rotate([0,90,0]).translate([-1.5,0,10.55]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Kerk van Warstiens",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0055100000253541"],description:"Zaalkerk met vijf venstertraveeën en steunberen, lagere driezijdige koorsluiting en oostelijke toren met achtkante leien naaldspits. Spitstop en geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0055100000253541","https://www.monumenten.nl/monument/514850","https://commons.wikimedia.org/wiki/Category:Kerk,_Warstiens","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kerk-van-warstiens.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


