import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-joris-tsjerke-oosterbierum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[163265,583042.5],X_AXIS=[.99966,.02618];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const poly=[[3.4,-4.5],[37.9,-4.4],[41.3,-3.2],[43.2,-.5],[43.2,2.8],[41.2,5.5],[37.9,6.5],[3.4,6.4]];
const body=prism(poly,BASE,9.1);
let roof=prism(poly,9.05,32);roof=plane(roof,0,-1.46,18.31);roof=plane(roof,0,1.46,15.69);roof=plane(roof,-1.5,0,73.8);roof=plane(roof,-1.4,-1.4,71.6);roof=plane(roof,-1.4,1.4,69.0);
// Consistorie uit 1709 aan zuidzijde, met zadeldak loodrecht op het schip.
const annex=box(32.7,39.2,-12.8,-4.3,BASE,4.5);let annexRoof=box(32.7,39.2,-12.8,-4.3,4.45,15);annexRoof=plane(annexRoof,-1.65,0,69.12);annexRoof=plane(annexRoof,1.65,0,-49.52);
// Westtoren: kleine draai t.o.v. de as van het schip.
const towerPoly=[[-3.7,4.1],[3.4,4.8],[3.5,-3.1],[-3.1,-3.9]].reverse();
const tower=prism(towerPoly,BASE,23.6);
const tip=Manifold.hull([[-3.7,4.1,23.55],[3.4,4.8,23.55],[3.5,-3.1,23.55],[-3.1,-3.9,23.55],[0,.45,45.13]]);
let solids=[body,roof,annex,annexRoof,tower,tip];
// De steunberen langs de koorsluiting, met schuin afgedekte toppen.
for(const [x,y] of [[38,-4.45],[41.3,-3.2],[43.2,-.5],[43.2,2.8],[41.2,5.5],[37.9,6.5]]){
 const b=box(x-.48,x+.48,y-.48,y+.48,BASE,3.8);const c=Manifold.hull([[x-.48,y-.48,3.75],[x+.48,y-.48,3.75],[x+.48,y+.48,3.75],[x-.48,y+.48,3.75],[x,y,4.28]]);solids.push(b,c);
}
let church=Manifold.union(solids);
// Blinde spitsboogvensters, in schaal 1:1000 geschikt voor de export.
const arch=(x,y,depth)=>Manifold.extrude(new CrossSection([[[x-.65,1.4],[x+.65,1.4],[x+.65,7],[x,7.8],[x-.65,7]]]),depth).transform([1,0,0,0,0,0,1,0,0,-1,0,0,0,y,0,1]);
for(const x of [8,14,20,26,31])for(const y of [-4.2,6.55])church=church.subtract(arch(x,y,.5));
// Koorvensters op de vijf schuine vlakken: ondiepe nissen loodrecht op de gevel.
const choirEdges=[[[37.9,-4.4],[41.3,-3.2]],[[41.3,-3.2],[43.2,-.5]],[[43.2,-.5],[43.2,2.8]],[[43.2,2.8],[41.2,5.5]],[[41.2,5.5],[37.9,6.5]]];
for(const [a,b] of choirEdges){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux,cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2; const pts=[[-.6,-.2],[.6,-.2],[.6,.4],[-.6,.4]].map(([t,n])=>[cx+ux*t+nx*n,cy+uy*t+ny*n]);church=church.subtract(prism(pts,1.4,7.6));}
church=church.subtract(box(-3.8,-3.2,-.7,.7,BASE,3.4));
for(const side of [-1,1])church=church.subtract(box(-.7,.7,side<0?-4.1:4.2,side<0?-3.6:4.7,19,22));
const parts=[["building:kerk",church]];
const META={name:"Sint Joris Tsjerke Oosterbierum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:1.634,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0070100000323075"],description:"Laatgotische zaalkerk met vijfzijdige koorsluiting, westtoren en zuidelijke consistorie.",realWorld:{groundNapM:1.634},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000323075","https://monumentenregister.cultureelerfgoed.nl/monumenten/8637","https://www.tsjerkepaad.nl/overzicht-kerken","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-joris-tsjerke-oosterbierum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

