import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="fredericuskerk-steggerda";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// +X langs nok van westelijke ingang naar koor; maten BAG / AHN, meters.
const BASE=-0.5, ORIGIN=[200160,540650], X_AXIS=[0.93715,0.34893],GROUND_NAP=2.196;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,60));
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const ridgeX=(y,z,t)=>[[0,t,z-t*y],[0,-t,z+t*y]];
const ridgeY=(x,z,t)=>[[t,0,z-t*x],[-t,0,z+t*x]];
const hex=(x,y,r,z)=>Array.from({length:6},(_,i)=>{const a=Math.PI/6+i*Math.PI/3;return[x+r*Math.cos(a),y+r*Math.sin(a),z]});
const solids=[];
// Middenschip met steile nok; lagere zijbeuken met lessenaarsdaken.
solids.push(roof(rect(-13.4,1.8,-4.5,5.0),ridgeX(.25,15.7,1.38)));
solids.push(roof(rect(-13.4,1.8,-9, -.8),[[0,0.72,12.76]]));
solids.push(roof(rect(-13.4,1.8,1.3,9.7),[[0,-0.72,13.38]]));
// Westelijke, lagere ingangsbeuk en de twee kleine zijkapellen.
solids.push(roof(rect(-18.2,-13.2,-4.2,5.1),ridgeX(.45,12.6,1.45)));
solids.push(roof(rect(-15.7,-13.1,-6.8,-4.0),[[0,0.65,8.9]]));
solids.push(roof(rect(-15.7,-13.1,4.9,7.7),[[0,-.65,10.8]]));
// Schijntransept met twee kruisende topgevels onder de vieringtoren.
solids.push(roof(rect(1.6,8.4,-9.2,9.7),ridgeY(5,12.6,1.25)));
// Koor met driezijdige sluiting, eigen nok en schildvlakken.
const choir=[[8,-4.5],[13.4,-4.5],[15.9,-1.6],[15.9,2.3],[13.4,5],[8,5]];
solids.push(roof(choir,[...ridgeX(.25,14.1,1.25),[-1.55,0,38.74]]));
// Sacristie, lage zijruimten en verbinding naar pastorie (zelfde BAG-pand).
solids.push(roof(rect(8.2,13.7,-9.2,-4.2),ridgeX(-6.7,7.45,.9)));
solids.push(roof(rect(8.2,13.7,4.8,9.1),ridgeX(6.9,7.9,.9)));
solids.push(roof(rect(7.7,13.7,-17.8,-9.0),ridgeX(-13.4,7.4,.72)));
solids.push(prism([[13.5,-17.75],[19.3,-17.8],[19.35,-10.7],[19.6,-10.7],[20.1,-4.26],[16.72,-4.23],[16.12,-7.22],[16.06,-13.26],[13.5,-13.24]],BASE,2.75));
// Zeskantige vieringtoren en zesvlakkige spits: geen gestapelde hoogtelagen.
solids.push(Manifold.hull([...hex(4.95,.3,3.55,BASE),...hex(4.95,.3,3.55,21.8)]));
solids.push(Manifold.hull([...hex(4.95,.3,3.55,21.75),...hex(4.95,.3,.45,32.8)]));
// Dakkapellen met zadeldak op beide lange dakvlakken: twee per zijde.
for(const x of [-9.4,-2.05])for(const side of [-1,1]){
 const y0=side<0?-5.1:2.75,y1=side<0?-2.25:5.65;
 solids.push(roof(rect(x-1.15,x+1.15,y0,y1),ridgeY(x,12.55,1.05)));
}
// Steunberen langs beide zijgevels, afgeschuind vanaf de muur naar buiten.
for(const x of [-13.05,-9.3,-5.55,-1.8,1.8])for(const side of [-1,1]){
 const y=side<0?-9:9.7, outer=y+side*.9;
 const yz=side<0?[[outer,BASE],[y+.2,BASE],[y+.2,5.4],[outer,4.5]]:[[y-.2,BASE],[outer,BASE],[outer,4.5],[y-.2,5.4]];
 const h=Manifold.hull(yz.flatMap(([v,z])=>[[x-.48,v,z],[x+.48,v,z]]));solids.push(h);
}
let church=Manifold.union(solids);const cuts=[];
// Spitsbogige blinde nissen in beide lange gevels.
function lancetY(x,y,z0,z1,w,side){
 const lower=box(x-w/2,x+w/2,y-.48,y+.48,z0,z1-w*.6);
 const cap=Manifold.hull([[x-w/2,y-.48,z1-w*.6],[x+w/2,y-.48,z1-w*.6],[x,y-.48,z1],[x-w/2,y+.48,z1-w*.6],[x+w/2,y+.48,z1-w*.6],[x,y+.48,z1]]);
 return Manifold.union([lower,cap]);
}
for(const x of [-11.1,-7.4,-3.7,0])for(const side of [-1,1]) cuts.push(lancetY(x,side<0?-8.85:9.55,2.4,5.7,1.25,side));
// Vensters in de topgevels en de gekoppelde dakvensters.
for(const x of [-9.8,-9.0,-2.45,-1.65])for(const side of [-1,1]) cuts.push(lancetY(x,side<0?-5:5.55,10.1,11.55,.62,side));
for(const x of [3.8,6.1])for(const side of [-1,1])cuts.push(lancetY(x,side<0?-9.0:9.55,3.0,7.3,1.1,side));
// Galmgaten op zes zijden: blinde openingen in het achtkant.
for(let k=0;k<6;k++){
 const a=k*Math.PI/4;const n=box(-.65,.65,-.45,.45,17.2,20.8).translate([0,3.15,0]).rotate([0,0,k*60]).translate([4.95,.3,0]);cuts.push(n);
}
// Westelijk portaal als nis en drie langwerpige gevelramen.
cuts.push(box(-18.5,-17.9,-.55,1.45,BASE,3.25));
for(const y of [-2.4,.4,3.2])cuts.push(box(-18.48,-17.9,y-.48,y+.48,4.1,7.9));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Fredericuskerk Steggerda",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0098100000017990"],description:"Driebeukige neogotische kerk met steile langskap en zijbeuken, schijntransepten, driezijdig koor en zeskantige vieringtoren met hoge zesvlakkige spits; twee dakkapellen per dakvlak, sacristie en verbinding met pastorie. Vensternissen, steunberen en uiteindelijke spitstop zijn op foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0098100000017990","https://monumentenregister.cultureelerfgoed.nl/monumenten/508652","https://commons.wikimedia.org/wiki/Category:Fredericuskerk,_Steggerda","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-fredericuskerk-steggerda.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


