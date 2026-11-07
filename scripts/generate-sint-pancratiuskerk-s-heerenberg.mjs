import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="sint-pancratiuskerk-s-heerenberg";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X runs from the front tower northeast to the choir; separate surfaces form roofs and wings.
const BASE=-0.5,ORIGIN=[213930,432179],X_AXIS=[-.613,.79],GROUND_NAP=16.238;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofed=(p,planes)=>planes.reduce((s,[a,b,c])=>plane(s,a,b,c),prism(p,BASE,35));
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
// Nave, high choir and its polygonal five-eighths termination.
const mainPoly=[[0,-4.3],[41.9,-4.3],[44.2,-2.8],[45.8,-1.5],[45.8,2.4],[43,5],[0,4.3]];
const nave=roofed(mainPoly,[[0,-2.05,25.28],[0,2.05,25.28],[-1.7,0,101.2]]);
// Lower lean-to aisles, separately sloping out from the clerestory.
const south=roofed(rect(-1,26.7,-9.2,-3.8),[[0,1.1,20.5]]);
const north=roofed(rect(-1,26.7,3.8,10),[[0,-1.1,20.5]]);
// A transverse high roof, hipped at each three-sided transept end.
const transeptPoly=[[26.4,-9.2],[26.4,-10],[29,-12.7],[32.8,-12.7],[35.4,-10],[35.4,10],[32.8,12.7],[29,12.7],[26.4,10]];
const transept=roofed(transeptPoly,[[-2.05,0,88.63],[2.05,0,-38.07],[0,1.5,43.8],[0,-1.5,43.8]]);
// Lower polygonal chapels beside the choir and an attached service wing in the BAG footprint.
const chap1=roofed([[35,-9.2],[43.2,-9.2],[45,-7.4],[45,-4],[35,-4]],[[0,1,20],[ -1,0,57]]);
const chap2=roofed([[35,4],[43,4],[45,5.3],[45,8],[42,10.4],[35,9.6]],[[0,-1,20],[-1,0,57]]);
const wing2=roofed([[41.5,8],[47.3,7.2],[49.9,8.5],[49.9,10.1],[47.3,11.3],[47.3,13.2],[42,13.2]],[[0,-.8,19],[0,.8,2.2]]);
const wing=roofed([[45,-13.1],[53,-13.3],[54.46,-5.4],[45,-3.8]],[[0,1,17],[0,-1,0]]);
// Tower and its four-sided narrowing spire.
const tower=box(-4.2,4.1,-3.68,4.61,BASE,40.5);const sq=(r,z)=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]],oct=(r,z)=>Array.from({length:8},(_,i)=>[r*Math.cos(Math.PI/8+i*Math.PI/4),r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const cornice=Manifold.hull([...sq(3.6,40.0),...sq(3.8,40.4),...sq(3.8,40.6)]),spire=Manifold.hull([...oct(4.0,40.55),...oct(.45,59)]);
// Slim roof fleche, thickened to remain printable.
const fleche=Manifold.hull([...oct(.9,24.8).map(([x,y,z])=>[x+30.9,y,z]),...oct(.45,37.0).map(([x,y,z])=>[x+30.9,y,z])]);
const ribs=[];for(const x of [4.5,9.4,14.3,19.2,24.1])for(const side of [-1,1]){const y=side<0?-9.15:9.95,o=side<0?-10:10.8;ribs.push(Manifold.hull([[x-.5,y,BASE],[x+.5,y,BASE],[x-.5,o,BASE],[x+.5,o,BASE],[x-.5,y,10.8],[x+.5,y,10.8]]));}
let church=Manifold.union([nave,south,north,transept,chap1,chap2,wing,wing2,tower,cornice,spire,fleche,...ribs]);
const cuts=[];for(const x of [2,7,12,17,22])for(const side of [-1,1]){const y0=side<0?-9.4:9.8,y1=side<0?-9:10.3;cuts.push(box(x-.55,x+.55,y0,y1,2.5,8));cuts.push(Manifold.hull([[x-.55,y0,8],[x+.55,y0,8],[x,y0,8.8],[x-.55,y1,8],[x+.55,y1,8],[x,y1,8.8]]));}
cuts.push(box(-4.5,-3.9,-.7,.7,BASE,4.3));for(const y of [-1.1,1.1])cuts.push(box(-4.5,-3.8,y-.55,y+.55,31,38));for(const x of [-1.1,1.1])for(const side of [-1,1])cuts.push(box(x-.55,x+.55,side<0?-4:4.3,side<0?-3.4:4.9,31,38));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Sint-Pancratiuskerk s-Heerenberg",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.1955100000004076"],description:"Driebeukige neogotische kruisbasiliek met driezijdig gesloten transept, koor en zijkapellen en hoge torenspits. Details en spitsuiteinde naar foto's geschat.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1955100000004076","https://kennis.cultureelerfgoed.nl/index.php/Monumenten/9269","https://commons.wikimedia.org/wiki/Category:Sint-Pancratiuskerk_('s-Heerenberg)","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-pancratiuskerk-s-heerenberg.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));




