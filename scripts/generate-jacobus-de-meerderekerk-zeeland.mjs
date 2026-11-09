// Jacobus de Meerderekerk Zeeland: dakvlakken en bouwdelen, maten in meters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="jacobus-de-meerderekerk-zeeland";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[174816,412123.5],X_AXIS=[-.984,.178];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Middenschip en lagere zijbeuken onder lessenaarsdaken.
let hall=box(0,41,-5,5,BASE,24.7);hall=plane(hall,0,1.5,24.7);hall=plane(hall,0,-1.5,24.7);
let aisle1=box(0,38,-9.2,-4.7,BASE,13.5);aisle1=plane(aisle1,0,.65,16.6);
let aisle2=box(0,38,4.7,9.2,BASE,13.5);aisle2=plane(aisle2,0,-.65,16.6);
// Dwarsbeuken met afzonderlijke dakvlakken per travee.
let wings=[];for(const y of [-1,1])for(const x of [22.7,28.4]){
 let w=box(x-2.95,x+2.95,y<0?-14.9:4.5,y<0?-4.5:14.8,BASE,14.6);
 w=plane(w,1.2,0,14.6-1.2*x);w=plane(w,-1.2,0,14.6+1.2*x);wings.push(w);
}
let choir=prism([[39,-5],[41.8,-5],[44.5,-1.8],[44.5,1.5],[41.8,5],[39,5]],BASE,24.7);choir=plane(choir,0,1.5,24.7);choir=plane(choir,0,-1.5,24.7);choir=plane(choir,-1.5,0,87.5);
// Lagere sacristieën aan de koorzijden.
let annex1=box(34.7,41.8,-13.7,-5,BASE,5.8),annex2=box(36.8,41.6,5,10.8,BASE,5.8);
// Oosttoren met klankgeleding, geveltoppen en zeszijdige spits.
let tower=box(-4.7,3.1,-4.5,4.1,BASE,36.8);
let spire=Manifold.cylinder(25.2,4.45,.45,6).rotate([0,0,30]).translate([-.8,-.2,36.6]);
// Vieringruiter ontbreekt grotendeels in de hoogtekaart; afgeleid uit de foto's.
let rider=Manifold.cylinder(3.1,1.25,1.2,8).translate([24,0,23.5]);
let riderSpire=Manifold.cylinder(12,1.35,.45,8).translate([24,0,26.4]);
// Puntgevels rond de zeszijdige torenspits.
let gables=[];
for(const y of [-4.3,3.9]){let g=box(-4.6,3,-.55,.55,35.8,40).translate([0,y,0]);g=plane(g,1,0,40.8);g=plane(g,-1,0,39.2);gables.push(g);}
for(const x of [-4.5,2.9]){let g=box(-.55,.55,-4.4,4,35.8,40).translate([x,0,0]);g=plane(g,0,1,40.2);g=plane(g,0,-1,39.8);gables.push(g);}
let church=Manifold.union([hall,aisle1,aisle2,...wings,choir,annex1,annex2,tower,spire,rider,riderSpire,...gables]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1).rotate([90,0,0]).translate([x,y,z])};
for(const x of [3.5,8.8,14.1,19]){church=church.subtract(niche(x,-8.7,1.4,1.7,5.8));church=church.subtract(niche(x,9.7,1.4,1.7,5.8));}
for(const x of [4,9,14,19,33,37]){church=church.subtract(niche(x,-4.5,15,1.5,4.6));church=church.subtract(niche(x,5.5,15,1.5,4.6));}
for(const x of [22.7,28.4]){church=church.subtract(niche(x,-14.4,1.6,1.8,6.4));church=church.subtract(niche(x,15.3,1.6,1.8,6.4));}
for(const x of [-1.8,.15]){church=church.subtract(niche(x,-4,29.5,1.2,5));church=church.subtract(niche(x,4.6,29.5,1.2,5));}
for(const y of [-1.2,.8])church=church.subtract(niche(y,.5,29.5,1.2,5).rotate([0,0,90]).translate([-4.7,0,0]));
church=church.subtract(niche(0,.5,.1,1.9,4.7).rotate([0,0,90]).translate([-4.7,-.2,0]));
church=church.subtract(niche(0,.5,8,2.2,9).rotate([0,0,90]).translate([-4.7,-.2,0]));
for(const x of [39.5,41]){church=church.subtract(niche(x,-4.5,9,1.3,9));church=church.subtract(niche(x,5.5,9,1.3,9));}
// Koorvensters, boven de aangebouwde lage ruimten.
for(const y of [-1.2,1.2])church=church.subtract(niche(-y,.55,9,1.3,9).rotate([0,0,-90]).translate([44.5,0,0]));
for(const x of [1,6.2,11.5,16.8])for(const y of [-9.4,9.4])church=Manifold.union([church,box(x-.45,x+.45,y-.45,y+.45,BASE,7.5)]);
const parts=[["building:kerk",church]];
const META={name:"Jacobus de Meerderekerk Zeeland",origin:ORIGIN,xAxis:X_AXIS,groundHeight:19.68,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1685100000141140"],description:"Neogotische kerk met zeszijdige torenspits, dwarsbeuken en koor.",realWorld:{groundNapM:19.68,ahn5NaveNapM:44.3,ahn5TowerNapM:77.63},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1685100000141140","https://monumentenregister.cultureelerfgoed.nl/monumenten/519138","https://commons.wikimedia.org/wiki/Category:Heilige_Jacobus_de_Meerdere,_Zeeland","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-jacobus-de-meerderekerk-zeeland.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








