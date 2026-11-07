import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="antoniuskerk-surhuizum";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// BAG- and 3D BAG-derived axis; heights relative to NAP +2.72 m.
const BASE=-0.5,ORIGIN=[207755,580206],X_AXIS=[0.95265,0.30408],GROUND_NAP=2.72;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,ridgeY,z,slope,hip)=>{let s=prism(p,BASE,55);s=plane(s,0,slope,z-slope*ridgeY);s=plane(s,0,-slope,z+slope*ridgeY);if(hip!==undefined)s=plane(s,-1.62,0,z+1.62*hip);return s};
// Nave with polygonal choir; ridge +14.34 m and eaves +7.1 m from 3D BAG.
const nave=roof([[-9.67,-4.70],[15.50,-4.70],[19.90,-2.0],[19.90,2.24],[15.50,4.97],[-9.67,4.97]],.3,14.34,1.47,15.5);
// Tower body is separate from the nave except for a narrow covered passage.
const tower=box(-18.84,-12.43,-2.77,3.15,BASE,20.3);
const round8=(cx,cy,r)=>Array.from({length:8},(_,k)=>{const a=Math.PI/8+k*Math.PI/4;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]});
const c=[-15.64,.19], base8=round8(...c,3.48), top8=round8(...c,.49);
const spire=Manifold.hull([...base8.map(([x,y])=>[x,y,19.9]),...top8.map(([x,y])=>[x,y,35.7])]);
// Four masonry gables beneath the eight-sided brick spire.
const gables=[];
for(const angle of [0,90,180,270]){
 const g=Manifold.hull([[-2.85,-.14,20.1],[2.85,-.14,20.1],[-2.85,.14,20.1],[2.85,.14,20.1],[0,-.14,23.7],[0,.14,23.7]]).translate([0,-2.9,0]).rotate([0,0,angle]).translate([c[0],c[1],0]);gables.push(g);
}
// Two stout perpendicular buttresses at each corner, tapered tops.
const supports=[];
for(const x of [-18.5,-12.75])for(const y of [-2.55,2.93]){
 const sy=y<0?-1:1,sx=x<c[0]?-1:1;
 const a=box(x-.62,x+.62,Math.min(y,y+sy*1.95),Math.max(y,y+sy*1.95),BASE,14.7);
 const b=Manifold.hull([[x-.62,y,14.6],[x+.62,y,14.6],[x-.62,y+sy*1.95,14.6],[x+.62,y+sy*1.95,14.6],[x-.62,y,18.5],[x+.62,y,18.5],[x-.62,y+sy*.32,18.5],[x+.62,y+sy*.32,18.5]]);
 const d=box(Math.min(x,x+sx*1.7),Math.max(x,x+sx*1.7),y-.62,y+.62,BASE,14.7);
 const e=Manifold.hull([[x,y-.62,14.6],[x,y+.62,14.6],[x+sx*1.7,y-.62,14.6],[x+sx*1.7,y+.62,14.6],[x,y-.62,18.5],[x,y+.62,18.5],[x+sx*.32,y-.62,18.5],[x+sx*.32,y+.62,18.5]]);
 supports.push(a,b,d,e);
}
// Narrow low covered link: a pointed passage rather than a flat overhang.
const link=box(-12.5,-9.6,-.70,1.04,BASE,4.1);
const passage=Manifold.hull([[-11.9,-1.0,BASE],[-10.3,-1.0,BASE],[-11.9,1.4,BASE],[-10.3,1.4,BASE],[-11.9,-1.0,1.25],[-10.3,-1.0,1.25],[-11.9,1.4,1.25],[-10.3,1.4,1.25],[-11.1,-1.0,2.55],[-11.1,1.4,2.55]]);
let church=Manifold.union([nave,tower,spire,...gables,...supports,link]).subtract(passage);
const cuts=[];
function sideNiche(x,y,w,z0,z1,side){const y0=y+(side>0?-.40:-.60),y1=y+(side>0?.60:.40);return Manifold.hull([[x-w/2,y0,z0],[x+w/2,y0,z0],[x-w/2,y1,z0],[x+w/2,y1,z0],[x-w/2,y0,z1],[x+w/2,y0,z1],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y0,z1+w*.85],[x,y1,z1+w*.85]])}
for(const x of [-7.4,-2.5,2.4,7.3,12.2])for(const side of [-1,1])cuts.push(sideNiche(x,side<0?-4.70:4.97,1.55,2.35,5.75,side));
// Two belfry openings per elevation and a small tower door.
for(const x of [-16.5,-14.75])for(const side of [-1,1])cuts.push(sideNiche(x,side<0?-2.77:3.15,.9,17.0,19.2,side));
function endNiche(x,y,w,z0,z1){return Manifold.hull([[x-.32,y-w/2,z0],[x+.32,y-w/2,z0],[x-.32,y+w/2,z0],[x+.32,y+w/2,z0],[x-.32,y-w/2,z1],[x+.32,y-w/2,z1],[x-.32,y+w/2,z1],[x+.32,y+w/2,z1],[x-.32,y,z1+w*.85],[x+.32,y,z1+w*.85]])}
cuts.push(endNiche(-18.84,.19,1.35,BASE,2.2),endNiche(19.9,.1,1.5,BASE,2.45));
for(const y of [-.6,.95])cuts.push(endNiche(-18.84,y,.9,17,19.2),endNiche(-12.43,y,.9,17,19.2));
// Three large windows on the choir closing: the east face and the two diagonal sides.
cuts.push(endNiche(19.90,.10,1.45,3.9,6.2));
function angledNiche(a,b,w,z0,z1){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),tx=dx/len,ty=dy/len,nx=ty,ny=-tx,cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2;
 const pt=(along,depth,z)=>[cx+tx*along+nx*depth,cy+ty*along+ny*depth,z];
 return Manifold.hull([pt(-w/2,-.38,z0),pt(w/2,-.38,z0),pt(-w/2,.35,z0),pt(w/2,.35,z0),pt(-w/2,-.38,z1),pt(w/2,-.38,z1),pt(-w/2,.35,z1),pt(w/2,.35,z1),pt(0,-.38,z1+w*.85),pt(0,.35,z1+w*.85)]);
}
cuts.push(angledNiche([15.5,-4.7],[19.9,-2.0],1.4,2.5,5.8),angledNiche([19.9,2.24],[15.5,4.97],1.4,2.5,5.8));
// Clock impression and large nave entrance on the south side.
cuts.push(Manifold.cylinder(.90,.65,.65,20).rotate([90,0,0]).translate([-15.65,-2.38,20.15]));
cuts.push(sideNiche(-7.7,-4.7,1.5,BASE,2.25,-1));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk-en-toren",church]];
const META={name:"Antoniuskerk Surhuizum",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0059100000837847","NL.IMBAG.Pand.0059100000838057"],description:"Zaalkerk met driezijdige sluiting en vrijstaande middeleeuwse toren met achtzijdige gemetselde spits, hoeksteunberen en laag overdekt verbindingsportaal; daken uit BAG en 3D BAG, hoogte uit AHN, gevelnissen geschat uit foto's.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000837847","https://monumentenregister.cultureelerfgoed.nl/monumenten/7051","https://commons.wikimedia.org/wiki/Category:Antoniuskerk,_Surhuizum","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://lokaleregelgeving.overheid.nl/CVDR723347"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-antoniuskerk-surhuizum.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


