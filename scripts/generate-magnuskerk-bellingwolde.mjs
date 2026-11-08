import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="magnuskerk-bellingwolde";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the western tower toward the eastern choir.
const BASE=-.5,ORIGIN=[274081.62,571865.07],X_AXIS=[.99463,.10349],GROUND_NAP=1.439;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// Kerk: schip en driezijdig koor met één schilddak.
let hall=prism([[21.3,-20.68],[45.5,-20.68],[49.1,-18.8],[51.6,-17.8],[51.2,-13.4],[47.2,-11],[21.3,-11]],BASE,16.71);
hall=plane(hall,0,1.45,39.65);hall=plane(hall,0,-1.45,-6.23);hall=plane(hall,-1.45,0,88.5);hall=plane(hall,1.45,0,-13.5);
let annex=box(14.84,21.5,-18.36,-11.85,BASE,8.2);annex=plane(annex,0,1.3,27.8);annex=plane(annex,0,-1.3,-11.4);
let church=Manifold.union([hall,annex]);const supports=[];for(const x of [22,28,34,40,46])for(const sign of [-1,1]){const y=sign<0?-20.68:-11;let p=box(x-.5,x+.5,sign<0?y-1.1:y-.1,sign<0?y+.1:y+1.1,BASE,7.5);p=plane(p,0,sign<0?1:-1,sign<0?28.18:-3.5);supports.push(p);}church=Manifold.union([church,...supports]);
const cuts=[];for(const x of [25,31,37,43])for(const sign of [-1,1]){const y=sign<0?-20.68:-11;cuts.push(box(x-.65,x+.65,y-.3,y+.3,2.6,6.7));}cuts.push(box(14.5,15.2,-15.8,-14.6,BASE,2.7));church=church.subtract(Manifold.union(cuts));
// Vrijstaande toren: vierkant met achtereenvolgens lantaarn en naaldspits.
const fp=[[3.77,2.24],[-2.08,3.86],[-3.77,-2.24],[2.08,-3.86]];
let tower=prism(fp,BASE,15.9);const crown=Manifold.hull([...fp.map(([x,y])=>[x,y,15.85]),...oct(0,0,2.3,16.7)]);const lantern=Manifold.hull([...oct(0,0,2.3,16.65),...oct(0,0,2.3,20.6)]);const spire=Manifold.hull([...oct(0,0,2.3,20.55),...oct(0,0,.45,27.51)]);tower=Manifold.union([tower,crown,lantern,spire]);
const towerCuts=[];
for(const x of [-1,1])towerCuts.push(box(x-.45,x+.45,-3.7,-2.8,11.8,14.2));
// Ondiepe galmgaten maken de smallere klokkenverdieping boven de omloop zichtbaar.
for(const sign of [-1,1]){
 towerCuts.push(box(-.55,.55,sign<0?-2.55:1.72,sign<0?-1.72:2.55,17.2,19.6));
 towerCuts.push(box(sign<0?-2.55:1.72,sign<0?-1.72:2.55,-.55,.55,17.2,19.6));
}
tower=tower.subtract(Manifold.union(towerCuts));
const parts=[["building:kerk",church],["building:toren",tower]];church=Manifold.union([church,tower]);
const META={name:"Magnuskerk Bellingwolde",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0007100000002920","NL.IMBAG.Pand.0007100000002921"],description:"Laatgotische kerk met vrijstaande klokkentoren met lantaarn en spits. Geveldetails naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0007100000002920","https://monumentenregister.cultureelerfgoed.nl/monumenten/8898","https://commons.wikimedia.org/wiki/Category:Magnuskerk","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-magnuskerk-bellingwolde.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==2)throw new Error(`expected church and detached tower, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


