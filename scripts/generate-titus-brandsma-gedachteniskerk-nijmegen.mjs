import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="titus-brandsma-gedachteniskerk-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[187501.5,428106.5],X_AXIS=[.9755,-.22],GROUND_NAP=30.012;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const square=(x,y,r,z)=>[[x-r,y-r,z],[x+r,y-r,z],[x+r,y+r,z],[x-r,y+r,z]];
const ring=(x,y,r,z,n=8)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(Math.PI/8+i*2*Math.PI/n),y+r*Math.sin(Math.PI/8+i*2*Math.PI/n),z]);
const roofY=(a,b,c,d,wall,top)=>{let s=box(a,b,c,d,BASE,top);let m=(top-wall)/((b-a)/2), mid=(a+b)/2;s=plane(s,-m,0,top+m*mid);return plane(s,m,0,top-m*mid)};
const roofX=(a,b,c,d,wall,top)=>{let s=box(a,b,c,d,BASE,top);let m=(top-wall)/((d-c)/2), mid=(c+d)/2;s=plane(s,0,-m,top+m*mid);return plane(s,0,m,top-m*mid)};
const roundApse=(x,y,r,h,peak)=>{let p=ring(x,y,r,BASE,16).map(([a,b])=>[a,b]);return Manifold.union([prism(p,BASE,h),Manifold.hull([...ring(x,y,r,h,16),[x,y,peak]])]);};
// Nave, crossing and transepts follow the measured ridge and eaves.
let churchParts=[roofY(-5.8,5.8,-12,22,17.7,21.8),roofX(-16.6,15.4,-5.8,5.8,17.7,21.8),roofY(-11,-5,-9,20,9.3,12.3),roofY(5,11,-9,20,9.3,12.3),roundApse(0,-13,5.6,15.5,18.3),roundApse(-8,-10,2.7,9.7,11.5),roundApse(8,-10,2.7,9.7,11.5)];
// Octagonal crossing tower and faceted roof.
churchParts.push(prism(ring(0,0,6.5,BASE).map(([x,y])=>[x,y]),BASE,30.1));
churchParts.push(Manifold.hull([...ring(0,0,6.5,30.05),[0,0,37.35]]));
// Four raised crossing gables, merged into the octagonal lantern roof.
for(const ang of [0,90,180,270]){
 let g=roofY(-3.1,3.1,4.6,6.1,29.8,32.5).rotate([0,0,ang]);churchParts.push(g);
}
// Two front turrets, square masonry and pyramidal roof.
for(const x of [-7.1,7.1]){
 churchParts.push(box(x-2.1,x+2.1,18.2,22.1,BASE,23));
 churchParts.push(Manifold.hull([[x-2.1,18.2,22.95],[x+2.1,18.2,22.95],[x+2.1,22.1,22.95],[x-2.1,22.1,22.95],[x,21.4,33.5],[x,22.1,33.5]]));
}
// Low wing at east transept and entrance pavilion.
churchParts.push(roofY(14.2,20.3,-15.5,-2.5,7.1,10.7));
// Paired transverse gables and the lower side aisle on the east wing.
churchParts.push(roofX(14.3,20.1,-13.6,-9.2,8.1,11.2));
churchParts.push(roofX(14.3,20.1,-8.8,-4.4,8.1,11.2));
churchParts.push(roofY(19.3,22,-11.3,-3.6,5.8,7.5));
churchParts.push(roofY(-15.3,-10,-12,-4.8,9,12.2));
churchParts.push(roofY(10.8,15,-9,-4.2,8.5,11.4));
// Rounded stair enclosures on the north flanks, and the eastern lower turret.
churchParts.push(roundApse(-13,16.5,2.9,8.6,10.6),roundApse(15,14.4,2.8,8.4,10.2));
churchParts.push(box(10.5,13,13,16,BASE,8.2));
churchParts.push(box(-17.7,-16.3,1,3.1,BASE,15.9));
churchParts.push(box(18,22.8,-15,-11.6,BASE,12.4));
churchParts.push(Manifold.hull([...[ [18,-15,12.35],[22.8,-15,12.35],[22.8,-11.6,12.35],[18,-11.6,12.35] ],[20.4,-13.3,15.2]]));
// Shallow pilasters on the choir, integrated into the masonry.
for(const angle of [200,225,255,285,315,345]){
 const rad=angle*Math.PI/180,x=5.45*Math.cos(rad),y=-13+5.45*Math.sin(rad);
 churchParts.push(box(-.35,.35,-.55,.25,BASE,14.7).rotate([0,0,angle+90]).translate([x,y,0]));
}
// Raised dormers over the two transept roofs and the side chapel.
churchParts.push(roofY(-10.2,-9,-3.2,-1.8,20,21.1));
churchParts.push(roofY(9,10.2,-3.2,-1.8,20,21.1));
churchParts.push(roofY(16,17.2,-9,-7.6,10.1,11.3));
let church=Manifold.union(churchParts);
const cuts=[];
// Windows in the octagonal lantern and gable ends; all are shallow blind niches.
for(const ang of [0,45,90,135,180,225,270,315])for(const x of [-1.2,0,1.2])
 cuts.push(box(x-.37,x+.37,5.72,6.25,25,29.1).rotate([0,0,ang]));
for(const sign of [-1,1])for(const y of [8,11]) {
 let a=sign<0?-11.3:10.95,b=sign<0?-10.95:11.3;
 cuts.push(box(a,b,y-.45,y+.45,3.2,7.6));
}
for(const sign of [-1,1])for(const x of [-12,-10,-8,8,10,12]) {
 let a=sign<0?-6.1:5.7,b=sign<0?-5.7:6.1;
 cuts.push(box(x-.45,x+.45,a,b,12.8,16.6));
}
// Wide rose-window and rows of slender recesses in the transept end walls.
for(const sign of [-1,1]){
 let disc=Manifold.cylinder(.7,2.7,2.7,32).rotate([0,90,0]).translate([sign<0?-16.9:15.0,0,12]);cuts.push(disc);
 for(const y of [-2,-1,0,1,2])cuts.push(box(sign<0?-16.9:15.0,sign<0?-16.2:15.7,y-.32,y+.32,6.8,10.9));
 for(const y of [-4,-3,-2,-1,0,1,2,3,4])cuts.push(box(sign<0?-16.9:15.0,sign<0?-16.2:15.7,y-.3,y+.3,17,19.3));
}
// Windows in the rounded choir are shallow cuts facing outward.
for(const [cx,cy,r] of [[0,-13,5.6]]){
 for(const angle of [210,240,270,300,330]){
  const rad=angle*Math.PI/180, x=cx+r*Math.cos(rad),y=cy+r*Math.sin(rad);
  let c=box(-.42,.42,-.1,.75,3, r>4?12:6.5).rotate([0,0,angle+90]).translate([x,y,0]);cuts.push(c);
 }
}
// Rose window and entrance on the principal gable.
cuts.push(Manifold.cylinder(.65,2.4,2.4,32).rotate([90,0,0]).translate([0,22.3,11.2]));
for(const x of [-1.15,1.15])cuts.push(box(x-.58,x+.58,21.7,22.4,.1,3.4));
// Blind paired belfry openings at the front and shallow niches for scale.
for(const x of [-7.1,7.1]) cuts.push(box(x-.3,x+.3,21.7,22.4,24.5,28.3));
for(const x of [-7.1,7.1]) for(const dx of [-.65,.65]) {
 cuts.push(box(x+dx-.38,x+dx+.38,21.7,22.4,17.6,21.2));
 cuts.push(box(x+dx-.38,x+dx+.38,21.7,22.4,12.5,15.7));
}
for(const x of [-4.2,-2.8,-1.4,0,1.4,2.8,4.2])cuts.push(box(x-.35,x+.35,21.7,22.5,15.4,17.9));
for(const x of [-3,-1.5,0,1.5,3])cuts.push(box(x-.45,x+.45,21.7,22.5,7.3,12.8));
church=church.subtract(Manifold.union(cuts));const parts=[["building:kerk",church]];
const META={name:"Titus Brandsma Gedachteniskerk Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0268100000019937"],description:"Kruisbasiliek met vieringtoren, zijbeuken en apsissen; oorsprong bij de viering, lokale +Y naar de hoofdgevel.",realWorld:{groundNapM:GROUND_NAP},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000019937","https://commons.wikimedia.org/wiki/Category:Titus_Brandsma_Memorial","https://monumentenregister.cultureelerfgoed.nl/monumenten/522992","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-titus-brandsma-gedachteniskerk-nijmegen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


