import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="trouwkapel-bronkhorst";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X from entrance toward the three-sided closure; all dimensions metres.
const BASE=-.35,ORIGIN=[209281,454509],X_AXIS=[.98,-.2],GROUND_NAP=10.094;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roof=(p,axis,ridge,slope)=>{let s=prism(p,BASE,30);s=plane(s,0,slope,ridge-slope*axis);s=plane(s,0,-slope,ridge+slope*axis);return s};
// One cross section along the chapel, trimmed at the eastern hip.
const plan=[[-6.7,-4.8],[5.5,-4.8],[9.5,-2.5],[9.5,2.3],[5.6,4.5],[-6.7,4.5]];
let nave=roof(plan,-.15,12.66,1.15);nave=plane(nave,-1.15,0,23.585);
const portal=roof([[-9.5,-1.8],[-6.6,-1.8],[-6.6,1.6],[-9.5,1.6]],-.1,6.0,1.0);
const rider=box(-.25,1.85,-1.15,.95,11.5,14.25);
const cap=Manifold.hull([[-.3,-1.2,14.2],[1.9,-1.2,14.2],[-.3,1,14.2],[1.9,1,14.2],[.8,-.1,17.4]]);
const butt=[];for(const x of [-5.9,-1.9,2.1,5.5])for(const side of [-1,1]){let y=side<0?-4.75:4.45,o=y+side*.9;butt.push(Manifold.hull([[x-.45,y,BASE],[x+.45,y,BASE],[x-.45,o,BASE],[x+.45,o,BASE],[x-.45,y,6.6],[x+.45,y,6.6],[x-.45,y+side*.45,6.15],[x+.45,y+side*.45,6.15]]));}
let church=Manifold.union([nave,portal,rider,cap,...butt]);
const cuts=[];
function niche(x,y,w,z0,z1,s){const y0=y+(s>0?-.35:-.18),y1=y+(s>0?.18:.35);const b=box(x-w/2,x+w/2,y0,y1,z0,z1);const c=Manifold.cylinder(y1-y0,w/2,w/2,24).rotate([90,0,0]).translate([x,y1,z1]);return Manifold.union([b,c]);}
for(const x of [-3.9,.1,3.9])for(const s of [-1,1])cuts.push(niche(x,s<0?-4.8:4.5,1.55,3.2,6.3,s));
const eastWindow=box(9.15,9.7,-.85,.55,3.2,6.3);const eastArch=Manifold.cylinder(.55,.7,.7,24).rotate([0,90,0]).translate([9.15,-.15,6.3]);cuts.push(Manifold.union([eastWindow,eastArch]));
// Recesses in the two slanted sides of the three-sided closure.
for(const s of [-1,1]){const b=box(-.35,.25,-.7,.7,3.2,6.3);const c=Manifold.cylinder(.6,.7,.7,24).rotate([0,90,0]).translate([-.35,0,6.3]);cuts.push(Manifold.union([b,c]).rotate([0,0,s*61]).translate([7.5,s*3.55,0]));}
// Two shallow bell openings per face, printable without a through-hole.
for(const s of [-1,1])for(const x of [.25,1.3])cuts.push(niche(x,s<0?-1.15:.95,.9,12.3,13.15,s));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kapel",church]];
const META={name:"Trouwkapel Bronkhorst",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1876100000011985"],description:"Eenbeukige kapel met driezijdige sluiting, portaal, steunberen en dakruiter met spits. Details geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1876100000011985","https://kapelbronkhorst.nl/","https://www.monumenten.nl/monument/34548","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Bronkhorst","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-trouwkapel-bronkhorst.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


