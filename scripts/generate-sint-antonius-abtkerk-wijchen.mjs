import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-antonius-abtkerk-wijchen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[178386.3,424254.2],X_AXIS=[.017,-.999855];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,e,r)=>{let z=box(a,b,c,d,e-.05,r),m=(c+d)/2,k=(r-e)/((d-c)/2);return plane(plane(z,0,k,r-k*m),0,-k,r+k*m)};
// Groot neoclassicistisch schip met breed schilddak en driezijdige koorafsluiting.
let solids=[box(-2.7,39,-11.2,10.5,BASE,11.2),prism([[38.8,-7.2],[41.8,-4.5],[42.8,-1.8],[41.5,1.5],[39,4]],BASE,14.8)];
let roof=box(-2.7,42.8,-11.2,10.5,11.15,19.7);roof=plane(roof,0,.87,21.27);roof=plane(roof,0,-.69,18.46);roof=plane(roof,.95,0,17.5);roof=plane(roof,-1.2,0,66.2);solids.push(roof);
// Twee dwarse zijkapellen aan het koor en lagere aangebouwde sacristie.
for(const [v0,v1] of [[-17.5,-7.1],[3.8,14]]){solids.push(box(32.5,39,v0,v1,BASE,7.5));let cap=box(32.5,39,v0,v1,7.45,11.2);cap=plane(cap,1.15,0,-29.96);cap=plane(cap,-1.15,0,52.4);solids.push(cap);}
solids.push(box(28.3,34.2,9.5,18.5,BASE,4.5),gable(28.3,34.2,9.5,18.5,4.45,7.4));
// Lage verbindingsvleugel richting pastorie, onderdeel van het kerk-BAG-pand.
solids.push(box(9.5,28.4,10.2,15.4,BASE,4.4),gable(9.5,28.4,10.2,15.4,4.35,7.3));
let link=prism([[15,14],[20,14],[21.8,16.5],[13.5,20.4],[9.5,14.5]],BASE,7.1);link=plane(link,0,-.5,15.5);solids.push(link);
// Fronton van de symmetrische voorgevel.
let fronton=box(-3.05,-2.6,-3.8,3.8,11.15,12.7);fronton=plane(fronton,0,.39,12.7);fronton=plane(fronton,0,-.39,12.7);solids.push(fronton);
// Vierkante schacht en achtzijdige naald, hoogtemetingen uit AHN.
solids.push(box(-2.8,2.8,-3.2,3.1,BASE,23.5));
let shoulder=Manifold.hull([[-2.8,-3.2,23.45],[2.8,-3.2,23.45],[2.8,3.1,23.45],[-2.8,3.1,23.45],[-2.65,-2.65,24.6],[2.65,-2.65,24.6],[2.65,2.65,24.6],[-2.65,2.65,24.6]]);solids.push(shoulder,Manifold.cylinder(12.0,2.8,.45,8,false).rotate([0,0,22.5]).translate([0,0,24.55]));
// Pilasters van de lange zijgevels en de voorgevel.
for(const x of [4,10,16,22,28,33])for(const y of [-11.45,10.25])solids.push(box(x,x+.7,y,y+.5,BASE,9.7));
for(const y of [-10,-4.4,3.8,9.3])solids.push(box(-2.95,-2.55,y,y+.65,BASE,10.8));
let church=Manifold.union(solids);
const arch=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],...[...Array(9)].map((_,i)=>{const a=i*Math.PI/8;return [w/2*Math.cos(a),h-w/2+w/2*Math.sin(a)]})];return prism(p,0,.45).rotate([90,0,0]).translate([x,y,z])};
for(const x of [6.5,12.5,18.5,24.5,30]){church=church.subtract(arch(x,-11.1,2.8,1.35,4.2));church=church.subtract(arch(x,10.65,2.8,1.35,4.2));}
for(const y of [-7,0,7])church=church.subtract(arch(y,0,BASE,1.5,3.1).rotate([0,0,90]).translate([-3.05,0,0]));
for(const y of [-7,0,7])church=church.subtract(arch(y,0,5.2,1.5,3).rotate([0,0,90]).translate([-3.05,0,0]));
for(const y of [-1,1])church=church.subtract(arch(y,0,18.5,.9,2.6).rotate([0,0,90]).translate([-2.9,0,0]));
const parts=[["building:kerk",church]];
const META={name:"Sint-Antonius Abtkerk Wijchen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:10.221,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0296100000000860"],description:"Neoclassicistische hallenkerk met ingebouwde toren, zijkapellen en sacristie.",realWorld:{groundNapM:10.221,ahnTopNapM:47.3},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0296100000000860","https://monumentenregister.cultureelerfgoed.nl/monumenten/39631","https://commons.wikimedia.org/wiki/Category:Antonius_Abtkerk,_Wijchen","https://detwaalfapostelen.nl/gemeenschappen/h-antonius-abt-wijchen/","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-antonius-abtkerk-wijchen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));






