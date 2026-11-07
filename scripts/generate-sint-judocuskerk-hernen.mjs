import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-judocuskerk-hernen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[175123,427370],X_AXIS=[.993,.114],GROUND_NAP=8.087;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,60);s=plane(s,0,slope,ridge-slope*axis);return plane(s,0,-slope,ridge+slope*axis)};
const nave=roof([[2,-4.1],[33.8,-4.1],[33.8,4.1],[2,4.1]],0,18.35,1.1);
const aisles=[];for(const s of [-1,1]){let p=box(2.6,33.5,s<0?-9.1:3.9,s<0?-3.9:9.4,BASE,40);p=plane(p,0,s<0?.7:-.7,14.5);aisles.push(p)}
let transept=box(17.5,25,-10.1,10.2,BASE,40);transept=plane(transept,1.15,0,-6.1);transept=plane(transept,-1.15,0,42.65);
const round=(x,y,r,h)=>{const body=Manifold.cylinder(h-BASE,r,r,20).translate([x,y,BASE]);const cap=Manifold.cylinder(r,r,0,20).translate([x,y,h-.05]);return Manifold.union([body,cap])};
const apses=[round(33.4,0,3.5,10),round(21,9.5,3,10),round(21,-9.5,3,10),round(33.2,6.5,1.55,7.2),round(33.2,-6.5,1.55,7.2),round(-2.5,0,2.6,8.2)];
const tower=box(-2.5,3.4,-3.4,3.4,BASE,33.5);
const pyramid=Manifold.cylinder(15.1,3.2,.45,8).translate([.45,0,32.9]);
const gables=[];for(const s of [-1,1]){let y=s*3.3;gables.push(Manifold.hull([[-2.5,y,32.5],[3.4,y,32.5],[.45,y,35.8],[-2.5,y-s*.9,32.5],[3.4,y-s*.9,32.5],[.45,y-s*.9,35.8]]))}
for(const s of [-1,1]){let x=.45+s*2.9;gables.push(Manifold.hull([[x,-3.4,32.5],[x,3.4,32.5],[x,0,35.8],[x-s*.9,-3.4,32.5],[x-s*.9,3.4,32.5],[x-s*.9,0,35.8]]))}
const stairs=[];for(const s of [-1,1]){stairs.push(box(2.5,4.6,s<0?-5:-3.3,s<0?-3.3:5,BASE,15));}
let church=Manifold.union([nave,transept,tower,pyramid,...gables,...stairs,...aisles,...apses]);
const cuts=[];function niche(x,y,w,z0,z1,s){let y0=y+(s>0?-.35:-.18),y1=y+(s>0?.18:.35);return Manifold.union([box(x-w/2,x+w/2,y0,y1,z0,z1),Manifold.hull([[x-w/2,y0,z1],[x+w/2,y0,z1],[x,y0,z1+w/2],[x-w/2,y1,z1],[x+w/2,y1,z1],[x,y1,z1+w/2]])])};
for(const x of [6.4,10.2,14,27,30.5])for(const s of [-1,1])cuts.push(niche(x,s<0?-9.1:9.4,1.2,2.7,6.3,s));
for(const s of [-1,1])for(const x of [-1.1,.45,2]){cuts.push(niche(x,s*3.4,1,20,25,s));cuts.push(niche(x,s*3.4,1,13,18,s))}
// Shallow west-facing bell, clock and portal recesses, with printable pointed tops.
function west(y,w,z0,z1,x){return Manifold.union([box(x-.15,x+.35,y-w/2,y+w/2,z0,z1),Manifold.hull([[x-.15,y-w/2,z1],[x-.15,y+w/2,z1],[x-.15,y,z1+w/2],[x+.35,y-w/2,z1],[x+.35,y+w/2,z1],[x+.35,y,z1+w/2]])])}
for(const y of [-1.5,0,1.5]){cuts.push(west(y,.95,20,25,-2.5));cuts.push(west(y,.95,13,18,-2.5))}cuts.push(west(0,2,27,29.5,-2.5));cuts.push(west(0,1.8,1,5,-5.1));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Sint-Judocuskerk Hernen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0296100000025367"],description:"Neoromaanse kruisbasiliek met ronde apsiden en hoge westtoren; details vereenvoudigd.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0296100000025367","https://monumentenregister.cultureelerfgoed.nl/monumenten/9312","https://www.kerkramentussenmaasenwaal.nl/kerken/hernen-judocuskerk/","https://commons.wikimedia.org/wiki/Category:Sint_Judocuskerk,_Hernen","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-judocuskerk-hernen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


