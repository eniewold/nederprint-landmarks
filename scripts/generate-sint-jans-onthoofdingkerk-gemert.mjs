import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-jans-onthoofdingkerk-gemert";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[175345,396275],X_AXIS=[.9992,-.04];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Schip en zijbeuken hebben aparte, aangesloten langsgerichte dakvlakken.
let nave=box(-24,18,-5,5,BASE,24.8);nave=plane(nave,0,1.15,24.8);nave=plane(nave,0,-1.15,24.8);
let aisles=[];for(const s of [-1,1]){let w=s<0?box(-24,18,-11,-4.8,BASE,14.8):box(-24,18,4.8,11,BASE,14.8);w=plane(w,0,-s,19.6);aisles.push(w)}
// Koorsluiting met meerdere vlakken, tegengebouwen en zuidelijke verbindingsvleugel.
let choir=prism([[17,-7.5],[26,-7.5],[31,-6],[34,-3],[35,0],[34,3],[31,6],[26,7.5],[17,7.5]],BASE,23);choir=plane(choir,0,1.15,23);choir=plane(choir,0,-1.15,23);choir=plane(choir,-1,0,55);
let connector=box(10,34,-18,-10.5,BASE,6.5);
let wing=box(34,54,-25,-12,BASE,13.8);wing=plane(wing,0,1,32.3);wing=plane(wing,0,-1,-4.7);
let tower=box(-29,-21,-4.8,4.8,BASE,38.5);
// Achtkantige naald en vier hoekpinakels, waar nodig verbreed voor printbaarheid.
let spire=Manifold.cylinder(18.5,4.6,.46,8).rotate([0,0,22.5]).translate([-25,0,38.4]);
let pinnacles=[];for(const x of [-28.3,-21.7])for(const y of [-4,4]){pinnacles.push(box(x-.6,x+.6,y-.6,y+.6,BASE,39.8),Manifold.cylinder(4.2,.85,.46,4).rotate([0,0,45]).translate([x,y,39.7]))}
// Geveltorentjes van schip en koor en hun massieve, verdikte spitsen.
let turrets=[];for(const x of [-23,17])for(const y of [-10.6,10.6])turrets.push(box(x-.65,x+.65,y-.65,y+.65,BASE,16),Manifold.cylinder(3.4,.9,.46,4).rotate([0,0,45]).translate([x,y,15.9]));
// De beide fronttopgevels zijn schijngevels vóór de lessenaardaken.
let gables=[];for(const s of [-1,1]){let g=s<0?box(-25,-23,-11,-4.5,BASE,17):box(-25,-23,4.5,11,BASE,17);g=plane(g,0,1.4,17-1.4*s*7.75);g=plane(g,0,-1.4,17+1.4*s*7.75);gables.push(g)}
let butt=[];for(const x of [-19,-12,-5,2,9,16])for(const y of [-11.8,10.8])butt.push(box(x-.5,x+.5,y,y+1,BASE,10));
for(const x of [-28,-22])for(const y of [-5.5,4.5])butt.push(box(x-.6,x+.6,y,y+1,BASE,35));
let church=Manifold.union([nave,...aisles,choir,connector,wing,tower,spire,...pinnacles,...turrets,...gables,...butt]);
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-15.5,-8.5,-1.5,5.5,12.5])for(const y of [-10.6,11.4])church=church.subtract(niche(x,y,2.5,2.5,6));
for(const x of [-15.5,-8.5,-1.5,5.5,12.5])for(const y of [-4.4,5.4])church=church.subtract(niche(x,y,16,1.1,3));
for(const y of [-7.1,7.9])church=church.subtract(niche(24,y,4,2.2,10));
church=church.subtract(niche(0,.5,4,2.3,10).rotate([0,0,-90]).translate([35,0,0]));
for(const a of [0,180])for(const dx of [-1.5,1.5])church=church.subtract(niche(dx,5.2,29,1.4,6).rotate([0,0,a]).translate([-25,0,0]));
for(const a of [90,270])for(const dx of [-1.5,1.5])church=church.subtract(niche(dx,4.4,29,1.4,6).rotate([0,0,a]).translate([-25,0,0]));
church=church.subtract(niche(0,.5,BASE,2.3,5).rotate([0,0,90]).translate([-29,0,0]));
church=church.subtract(niche(0,.5,11,2.5,7).rotate([0,0,90]).translate([-29,0,0]));
for(const y of [-7.75,7.75])church=church.subtract(niche(0,.5,4,2.3,7).rotate([0,0,90]).translate([-25,y,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Jans Onthoofdingkerk Gemert",origin:ORIGIN,xAxis:X_AXIS,groundHeight:15.17,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1652100000000307"],description:"Driebeukige kerk met neogotische toren, naaldspits, hoektorentjes en verbonden aanbouw.",realWorld:{groundNapM:15.17,ahn5TowerNapM:72.43,ahn5RoofNapM:40.3},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1652100000000307","https://commons.wikimedia.org/wiki/Category:Kerk_van_Sint-Jans_Onthoofding,_Gemert","https://monumentenregister.cultureelerfgoed.nl/monumenten/16050","https://www.ahn.nl/dataroom"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-jans-onthoofdingkerk-gemert.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));








