import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="westerkerk-leeuwarden";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[182184,579549],X_AXIS=[1,0],GROUND_NAP=1.594;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const southPoly=[[-15.4,-10.9],[15.4,-10.9],[18.8,-7.7],[18.8,-3.5],[15,-2.5],[-15.4,-2.5]];
const northPoly=[[-15.8,2.5],[14,2.5],[17.7,7.1],[15.6,11.2],[-15.8,11.2]];
const body1=prism(southPoly,BASE,9.5),body2=prism(northPoly,BASE,10.9),middle=box(-15.4,15,-2.6,2.6,BASE,16.6);
let roof1=prism(southPoly,9.45,24);roof1=plane(roof1,0,-1.5,12.6);roof1=plane(roof1,0,1.5,27.6);roof1=plane(roof1,1.5,0,33.2);roof1=plane(roof1,-1.5,0,42.6);
let roof2=prism(northPoly,10.85,25);roof2=plane(roof2,0,-1.5,29.1);roof2=plane(roof2,0,1.5,12.9);roof2=plane(roof2,1.5,0,34.6);roof2=plane(roof2,-1.5,0,42);
// In 2023 voltooide derde beuk met asymmetrisch hellend dak.
const extPoly=[[-15.8,11],[-1.3,11],[-1.6,14.3],[-6.9,16.1],[-15.8,12.8]];
let extension=prism(extPoly,BASE,11);extension=plane(extension,0,-.38,13.6);
let church=Manifold.union([body1,body2,middle,roof1,roof2,extension]);
// De zeven muurdammen langs Bagijnestraat, afgedekt met 45-graden helling.
for(const u of [-14,-9.7,-4.4,.8,6.1,11.4,16]){const butt=box(u-.55,u+.55,-11.8,-10.6,BASE,8.8);church=church.add(butt);}
// Hoge vensters als ondiepe nissen, met spitse printbare bovenzijde.
for(const u of [-12,-6.8,-1.5,3.7,9,14]){let cut=box(u-.65,u+.65,-12,-10.55,4.4,9.4);cut=plane(cut,-1.2,0,9.4+1.2*u);cut=plane(cut,1.2,0,9.4-1.2*u);church=church.subtract(cut)}
// Entree en het hoge rondboogvenster in de oostgevel, als blinde nissen.
church=church.subtract(box(18.45,19.05,-6.3,-4.2,0,3.6));
church=church.subtract(box(18.45,19.05,-6.3,-4.2,5.0,9.8));
for(const u of [2.3,6.6,10.7]) { let cut=box(u-.7,u+.7,10.85,11.45,4.2,9.6);cut=plane(cut,-1.2,0,9.6+1.2*u);cut=plane(cut,1.2,0,9.6-1.2*u);church=church.subtract(cut); }
church=church.rotate([0,0,-24.8]);const parts=[["building:kerk",church]];
const META={name:"Westerkerk Leeuwarden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0080100000354369"],description:"Westerkerk met twee historische beuken, twee schilddaken en de derde beuk van 2023.",realWorld:{groundNapM:1.594},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000354369","https://monumentenregister.cultureelerfgoed.nl/monumenten/24095","https://commons.wikimedia.org/wiki/Category:Westerkerk_(Leeuwarden)","https://www.mokearchitecten.nl/portfolio/westerkerk","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-westerkerk-leeuwarden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));

