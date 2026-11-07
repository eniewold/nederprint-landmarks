import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="petruskerk-pietersbierum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Local X follows the BAG facade towards the choir, 11.2 degrees east of RD-X.
const BASE=-0.5,ORIGIN=[160909.2,580998.2],X_AXIS=[0.980952,0.194242],GROUND_NAP=3.426;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// BAG footprint, three-sided eastern choir and the planar hipped roof.
const nave=[[.95,-4.39],[25.53,-4.36],[27.82,-1.55],[27.82,2.02],[25.63,4.90],[.95,4.89]];
let body=prism(nave,BASE,7.66),roof=prism(nave,7.64,20);
roof=plane(roof,0,-.9,12.075);roof=plane(roof,0,.9,11.625);roof=plane(roof,-1.58,0,51.8);
// Tower: three masonry stages, sloped shoulders and six-sided recessed spire.
const towerBase=box(-2.12,2.12,-1.94,2.24,BASE,7.5);
const towerMiddle=box(-2.02,2.02,-1.84,2.14,7.45,13.85);
const towerTop=box(-1.92,1.92,-1.74,2.04,13.8,19.15);
const hex=(r,z)=>Array.from({length:6},(_,i)=>[r*Math.cos(Math.PI/6+i*Math.PI/3),.15+r*Math.sin(Math.PI/6+i*Math.PI/3),z]);
const foot=Manifold.hull([...hex(2.0,19.1),...hex(1.6,20.0)]);
const spire=Manifold.hull([...hex(1.6,19.95),...hex(.45,31.78)]);
let church=Manifold.union([body,roof,towerBase,towerMiddle,towerTop,foot,spire]);
// Blind openings: four round-headed windows on either side, portal and paired belfry apertures.
const cuts=[];
for(const x of [6.0,10.6,15.2,19.8])for(const side of [-1,1]){
 const y0=side<0?-4.65:4.55,y1=side<0?-4.05:5.15;
 cuts.push(box(x-.7,x+.7,y0,y1,2.25,5.0));
 const cyl=Manifold.cylinder(y1-y0,.7,.7,16).rotate([90,0,0]).translate([x,y1,5.0]);cuts.push(cyl);
}
// The west door and tall shallow lancet above it, plus two blind belfry slots on each face.
cuts.push(box(-2.4,-1.8,-.52,.82,BASE,2.6));
for(const y of [-.65,.75])cuts.push(box(-2.42,-1.82,y-.42,y+.42,14.9,18.1));
for(const x of [-.7,.7])for(const side of [-1,1])cuts.push(box(x-.42,x+.42,side<0?-2.2:1.95,side<0?-1.65:2.5,14.9,18.1));
cuts.push(box(-2.42,-1.82,-.55,.85,8.2,11.3));
// Circular clock and west rose window: shallow cylindrical relief, sized for 1:1000.
for(const [x,y,z,r] of [[-2.3,.15,5.25,.72],[-2.2,.15,12.2,.62]])cuts.push(Manifold.cylinder(.55,r,r,16).rotate([0,90,0]).translate([x,y,z]));
// Door and circular window beside the tower; round windows in the three choir faces.
cuts.push(box(2.65,3.6,4.6,5.2,BASE,2.15));
cuts.push(Manifold.cylinder(.6,.65,.65,16).rotate([90,0,0]).translate([3.15,5.15,5.25]));
cuts.push(Manifold.cylinder(.6,.7,.7,16).rotate([0,90,0]).translate([27.5,.23,5.1]));
for(const [x,y] of [[26.7,-2.95],[26.7,3.5]])cuts.push(Manifold.sphere(.8,16).translate([x,y,3.8]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Petruskerk Pietersbierum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0070100000315200"],description:"Zaalkerk met driezijdige koorsluiting en schilddak; vier rondboogvensters aan weerszijden en westtoren met drie geledingen en zeszijdige naaldspits. Geveldetails en hoogte van de uiterste spitspunt zijn naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000315200","https://monumentenregister.cultureelerfgoed.nl/monumenten/8644","https://monumentenregister.cultureelerfgoed.nl/monumenten/512699","https://commons.wikimedia.org/wiki/Category:Kerk,_Pietersbierum","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-petruskerk-pietersbierum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


