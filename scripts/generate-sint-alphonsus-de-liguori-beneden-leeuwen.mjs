import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-alphonsus-de-liguori-beneden-leeuwen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X follows the church axis from front to choir; Y points toward the attached presbytery.
const BASE=-.5,ORIGIN=[163884,432594],X_AXIS=[.286,-.958],GROUND_NAP=6.842;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// High nave and the two lower aisles.
let nave=box(-28.5,15.5,-5.5,5.5,BASE,25);nave=plane(nave,0,-1,24.7);nave=plane(nave,0,1,24.7);
let aisle=box(-28.5,7.8,-9.8,9.8,BASE,18);aisle=plane(aisle,0,-.8,17.2);aisle=plane(aisle,0,.8,17.2);
// Wide transept with ridge running across the longitudinal axis.
let cross=box(-3.2,7.8,-12.1,12.1,BASE,25);cross=plane(cross,-1,0,26.95);cross=plane(cross,1,0,22.35);
// Polygonal choir and its lower encircling ambulatory.
let choir=prism([[8,-5.5],[15.4,-5.5],[19,-3.9],[21,-1.5],[21,1.5],[19,4],[15.4,5.5],[8,5.5]],BASE,25);choir=plane(choir,0,-1,24.7);choir=plane(choir,0,1,24.7);choir=plane(choir,-1,0,42.5);
let ambul=prism([[7.3,-10],[15,-10],[19.7,-6.5],[22.7,-2.3],[22.7,3],[19.7,6.6],[15,10],[7.3,10]],BASE,12);ambul=plane(ambul,-.8,0,27.5);ambul=plane(ambul,0,-.8,18);ambul=plane(ambul,0,.8,18);
// The historic presbytery is part of the same BAG object and must stay in the replacement.
let house=box(-37.4,-12.6,15,28.7,BASE,13);house=plane(house,0,-.8,29.5);house=plane(house,0,.8,-5.5);
let wing=box(-23.8,-9.2,22.8,33.6,BASE,13);wing=plane(wing,-.8,0,-.2);wing=plane(wing,.8,0,26.2);
let link=box(-27,-17,9.3,16,BASE,8);link=plane(link,0,-.7,15.5);
// Octagonal crossing tower: solid simplified lantern and dome, then printable tapered spire.
const drum=Manifold.hull([...oct(2,0,2.8,21.7),...oct(2,0,2.8,26.2)]);
const dome=Manifold.hull([...oct(2,0,2.8,26.15),...oct(2,0,1.5,28.1),...oct(2,0,.9,28.7)]);
const needle=Manifold.hull([...oct(2,0,.9,28.65),...oct(2,0,.45,31.94)]);
// Masonry buttresses emerge above the ambulatory with sloping tops.
const buttresses=[];for(const x of [10,14.2])for(const sign of [-1,1]){let b=box(x-.5,x+.5,sign<0?-6.4:5.0,sign<0?-5:6.4,BASE,18.5);b=plane(b,0,sign<0?1:-1,23.5);buttresses.push(b);}
let church=Manifold.union([nave,aisle,cross,choir,ambul,house,wing,link,drum,dome,needle,...buttresses]);
const cuts=[];for(const x of [-24,-17,-10])for(const side of [-1,1]){let y0=side<0?-10.1:9.5,y1=side<0?-9.5:10.1;cuts.push(box(x-.65,x+.65,y0,y1,3,8));cuts.push(Manifold.cylinder(y1-y0,.65,.65,20).rotate([90,0,0]).translate([x,y1,8]));}
for(const x of [11.8,15.8])for(const sign of [-1,1]){let y0=sign<0?-5.8:5.25,y1=sign<0?-5.25:5.8;cuts.push(box(x-.6,x+.6,y0,y1,10,17.8));cuts.push(Manifold.cylinder(y1-y0,.6,.6,20).rotate([90,0,0]).translate([x,y1,17.8]));}
for(const y of [-7,0,7])cuts.push(box(-28.8,-28.2,y-.65,y+.65,3,8));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Sint-Alphonsus de Liguori Beneden-Leeuwen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0668100000000632"],description:"Neoromaanse kruisbasiliek met achthoekige vieringtoren, zijbeuken, kooromgang en aangebouwde pastorie. Vieringtoren en geveldetails zijn vereenvoudigd.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0668100000000632","https://www.monumenten.nl/monument/523078","https://commons.wikimedia.org/wiki/Category:Alphonsus_de_Liguorikerk_(Beneden-Leeuwen)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-alphonsus-de-liguori-beneden-leeuwen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


