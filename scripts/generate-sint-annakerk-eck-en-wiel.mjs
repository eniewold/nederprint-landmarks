import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-annakerk-eck-en-wiel";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs east from the tower towards the choir.
const BASE=-.5,ORIGIN=[159827.3,442455],X_AXIS=[.94,-.342],GROUND_NAP=6.816;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,40);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
const nave=roof([[-2.7,-3.3],[14.4,-3.3],[14.4,3.3],[-2.7,3.3]],0,14.0,1.2);
const aisles=[];for(const s of [-1,1]){let a=s<0?-7.6:3.1,b=s<0?-3.1:7.6;let p=prism([[-2.7,a],[14.5,a],[14.5,b],[-2.7,b]],BASE,40);p=plane(p,0,s<0?1:-1,13.3);aisles.push(p);}
const plan=[[14.3,-5.1],[22.8,-5.1],[25.6,-3.2],[26.4,-1.6],[26.4,1.6],[25.7,3.2],[22.1,5.4],[14.3,5.4]];
let choir=roof(plan,.15,16.4,1.25);choir=plane(choir,-1,0,42.8);
const annex=box(14.3,22.8,-8.6,-5.0,BASE,4.2);
const tower=box(-2.75,3.0,-2.8,2.8,BASE,17.6);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const hip=Manifold.hull([...oct(3.2,17.5),...oct(2,18.7)]);
const spire=Manifold.hull([...oct(2,18.6),...oct(.45,24.5)]);
const butt=[];for(const x of [2.7,6.1,9.8,13.3])for(const s of [-1,1]){let y=s<0?-7.55:7.55,o=y+s*.9;butt.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,6.1],[x+.45,y,6.1],[x-.45,y+s*.45,5.65],[x+.45,y+s*.45,5.65]]));}
let church=Manifold.union([nave,choir,annex,tower,hip,spire,...aisles,...butt]);
const cuts=[];
function niche(x,y,w,z0,z1,s){const y0=y+(s>0?-.35:-.18),y1=y+(s>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const cap=Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w*.5],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w*.5]]);return Manifold.union([b,cap]);}
for(const x of [4.4,7.9,11.6])for(const s of [-1,1])cuts.push(niche(x,s<0?-7.6:7.6,1.4,2.7,5.2,s));
for(const x of [17.2,20.8])cuts.push(niche(x,5.4,1.4,5,10.0,1));
// Tall windows on the exposed eastern face and the sloping choir closure.
const eb=box(26.05,26.6,-.75,.75,4.2,10.1);const ea=Manifold.hull([[26.05,-.75,10.1],[26.05,.75,10.1],[26.05,0,10.85],[26.6,-.75,10.1],[26.6,.75,10.1],[26.6,0,10.85]]);cuts.push(Manifold.union([eb,ea]));
for(const s of [-1,1]){const b=box(-.35,.25,-.7,.7,4.2,10.1);const c=Manifold.hull([[-.35,-.7,10.1],[-.35,.7,10.1],[-.35,0,10.8],[.25,-.7,10.1],[.25,.7,10.1],[.25,0,10.8]]);cuts.push(Manifold.union([b,c]).rotate([0,0,s*55]).translate([24.2,s*4.2,0]));}
for(const s of [-1,1])cuts.push(niche(0,s<0?-2.8:2.8,1.25,14.2,16.2,s));
for(const y of [-2.8,2.8])cuts.push(Manifold.cylinder(.6,.65,.65,20).rotate([90,0,0]).translate([1.4,y+.3,16.6]));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint-Annakerk Eck en Wiel",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0214100000017062"],description:"Pseudobasiliek met lagere zijbeuken, driezijdig koor, ingebouwde westtoren en korte ingesnoerde spits; details geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0214100000017062","https://www.monumenten.nl/monument/28303","https://www.kerkeckenwiel.nl/index.php?page=page&page_id=12","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Eck_en_Wiel","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-annakerk-eck-en-wiel.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


