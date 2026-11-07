import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="protestantse-kerk-gendt";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the freestanding tower to the remaining former choir to the east.
const BASE=-.5,ORIGIN=[195358,432007],X_AXIS=[.98711,-.16],GROUND_NAP=12.216;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const sq=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
// The medieval tower stands alone: no fictitious infill for the vanished nave.
const shaft=box(-3.7,3.7,-4,3.2,BASE,19.6);
const shoulder=Manifold.hull([...sq(0,-.4,3.8,19.55),...sq(0,-.4,1.25,20.7)]);
const spire=Manifold.hull([...sq(0,-.4,1.25,20.65),...sq(0,-.4,.45,24.58)]);
let tower=Manifold.union([shaft,shoulder,spire]);const tc=[];
for(const y of [-1.8,.8])tc.push(box(-4,-3.45,y-.45,y+.45,16.3,19));
for(const x of [-1.2,1.2])for(const sign of [-1,1])tc.push(box(x-.4,x+.4,sign<0?-4.3:2.9,sign<0?-3.7:3.5,16.3,19));
tc.push(box(-4,-3.4,-.55,.55,BASE,2.7));tower=tower.subtract(Manifold.union(tc));
// The existing choir, its polygonal end and small annexes; roofs are single planar slopes.
let hall=box(24.7,36.4,-4.4,4.4,BASE,14);hall=plane(hall,0,-1.55,13.95);hall=plane(hall,0,1.55,13.95);
let choir=prism([[36,-4.3],[39.2,-1.9],[39.2,1.7],[36.2,4.4],[36,4.4]],BASE,14);choir=plane(choir,0,-1.55,13.95);choir=plane(choir,0,1.55,13.95);choir=plane(choir,-1,0,52);
let hallAnnex=box(20.5,25,-3.4,2.6,BASE,7.5);hallAnnex=plane(hallAnnex,0,-1,7.3);hallAnnex=plane(hallAnnex,0,1,8.1);
let rearAnnex=box(25,29.6,4.3,10.4,BASE,8);rearAnnex=plane(rearAnnex,-1,0,34.5);rearAnnex=plane(rearAnnex,1,0,-19.5);
const supports=[];for(const x of [25.2,29,33.1,36])for(const sign of [-1,1]){let y0=sign<0?-5.2:4.2,y1=sign<0?-4.2:5.2;let s=box(x-.45,x+.45,y0,y1,BASE,7);s=plane(s,0,sign<0?1:-1,sign<0?11.5:11.5);supports.push(s);}
let church=Manifold.union([hall,choir,hallAnnex,rearAnnex,...supports]);const cc=[];
for(const x of [26.9,30.8,34.6])for(const sign of [-1,1]){if(sign>0&&x<30)continue;let y0=sign<0?-4.7:4.15,y1=sign<0?-4.15:4.7;cc.push(box(x-.65,x+.65,y0,y1,2.4,6.3));cc.push(Manifold.cylinder(y1-y0,.65,.65,20).rotate([90,0,0]).translate([x,y1,6.3]));}
church=church.subtract(Manifold.union(cc));const parts=[["building:toren",tower],["building:kerk",church]];
const META={name:"Protestantse kerk Gendt",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1705100000022683","NL.IMBAG.Pand.1705100000022686"],description:"Vrijstaande middeleeuwse toren en voormalig koor, tegenwoordig kerk; het verdwenen schip wordt niet gereconstrueerd. Details naar foto's en AHN geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000022686","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000022683","https://monumentenregister.cultureelerfgoed.nl/monumenten/16080","https://monumentenregister.cultureelerfgoed.nl/monumenten/16081","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Gendt)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-kerk-gendt.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

for(const [name,solid] of parts){if(solid.status()!=="NoError"||solid.decompose().length!==1||solid.genus()!==0)throw new Error(`Invalid ${name}`);console.log(name,solid.boundingBox(),solid.numTri());}
await mkdir(outDir,{recursive:true});const glb=`${slug}.glb`;await writeFile(path.join(outDir,glb),toGlb(parts));const printFiles=[];for(const [i,[name,solid]] of parts.entries()){const stl=`${slug}-${i+1}-${scale}.stl`;printFiles.push(stl);await writeFile(path.join(outDir,stl),toStl(solid.translate([0,0,-BASE]),`NederPrint ${META.name} ${name} 1:${scale}`).buffer);}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:24.58}},null,2));
