import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-mauritiuskerk-schin-op-geul';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.9,ORIGIN=[189074,318485],X_AXIS=[.99,-.14],GROUND_NAP=90.7;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const roofY=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(x0+x1)/2;v=plane(v,sl,0,z-sl*mid);return plane(v,-sl,0,z+sl*mid)};
// Romaans westelijk schip, hoger koor en dwarse uitbreiding uit 1926.
const oldNave=roofX(2.5,16,-4,4.2,12.9,1.2),newNave=roofX(15.4,36.3,-3.9,5.5,14.9,1.08),cross=roofY(17.3,28.8,-12.6,13.2,14.9,.9);
let south=plane(box(1,16,-7.7,-3.8,BASE,7.8),0,.65,10.4),north=plane(box(2.4,16,4,7.8,BASE,7.8),0,-.65,10.4);
// Ronde koorsluiting met halfrond dak en lage zijaanbouwen.
const ap=[[35.5,-4],...Array.from({length:9},(_,i)=>{let a=-Math.PI/2+i*Math.PI/8;return [36+5.1*Math.cos(a),.7+5.1*Math.sin(a)]}),[35.5,5.5]];
const choir=Manifold.union([prism(ap,BASE,9.3),Manifold.hull([...ap.map(([x,y])=>[x,y,9.2]),[36,.7,13.0]])]);
const annex1=roofX(29,38.5,-12,-7.7,7.4,.5),annex2=roofX(29,38.5,8.7,13.1,7.4,.5);
const connect1=roofX(27.8,32,-12,-3.6,7.8,.5),connect2=roofX(27.8,32,5.2,13.1,7.8,.5);
const tower=box(-3.3,3.1,-3.4,3.9,BASE,14.0);
const oct=(x,y,r,z)=>Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),y+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const flare=Manifold.hull([...oct(0,.25,3.5,13.9),...oct(0,.25,2.2,15)]),spire=Manifold.hull([...oct(0,.25,2.2,14.95),...oct(0,.25,.49,22.7)]);
// De dakruiter heeft een gesloten kern voor de printschaal, met een kleine kap.
const lantern=Manifold.cylinder(4.1,1.0,1.0,8).translate([24,.5,14.3]);
const lanternRoof=Manifold.hull([...oct(24,.5,1.0,18.3),...oct(24,.5,.8,19.3),...oct(24,.5,.47,20.0)]);
const butt=[];for(const x of [4,7,10,13.5])for(const side of [-1,1]){let b=box(x-.48,x+.48,side<0?-8.2:7.1,side<0?-7.1:8.2,BASE,6.7);b=plane(b,0,side<0?1:-1,side<0?14.6:14.4);butt.push(b)}
let church=Manifold.union([oldNave,newNave,cross,south,north,choir,annex1,annex2,connect1,connect2,tower,flare,spire,lantern,lanternRoof,...butt]);
const cuts=[];for(const x of [5.5,8.5,11.5,14.5])for(const y of [-7.7,7.8])cuts.push(box(x-.55,x+.55,y-.3,y+.3,2.4,5.5));
for(const x of [20.5,25.5])for(const y of [-12.6,13.2])cuts.push(box(x-.65,x+.65,y-.35,y+.35,3,9));
for(const x of [23,25])cuts.push(box(x-.25,x+.25,0,1,15.5,17.5));
for(const y of [-.5,1.5])cuts.push(box(23.5,24.5,y-.25,y+.25,15.5,17.5));
cuts.push(box(-3.6,-3.0,-.7,.7,2.2,5.8),box(-3.6,-3.0,-.9,.9,BASE,2.5));
for(const y of [-1.1,1.1])cuts.push(box(-3.6,-3.0,y-.5,y+.5,11,13));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Mauritiuskerk Schin op Geul',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,groundSamplePoints:[[-4,0],[0,8],[15,-9],[35,-9],[40,6]],replacesBuildings:['NL.IMBAG.Pand.0994100002017570'],description:'Middeleeuws schip met 18e-eeuwse toren, ronde koorsluiting en 20e-eeuwse kruisuitbreiding.',realWorld:{groundNapM:GROUND_NAP,spireHeightM:22.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0994100002017570','https://www.ahn.nl/dataroom','https://kerkschinopgeul.nl/historie/','https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Mauritiuskerk_(Schin_op_Geul)']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-mauritiuskerk-schin-op-geul.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


