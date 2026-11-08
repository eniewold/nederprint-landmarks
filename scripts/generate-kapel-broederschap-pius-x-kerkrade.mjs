import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='kapel-broederschap-pius-x-kerkrade';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.7,ORIGIN=[203199.4,317876.7],X_AXIS=[.705,-.709],GROUND_NAP=165.2;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const roofY=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(x0+x1)/2;v=plane(v,sl,0,z-sl*mid);return plane(v,-sl,0,z+sl*mid)};
// Kapel en haakse kloostervleugel staan samen onder hetzelfde BAG-nummer.
const chapel=roofX(0,31,-7.5,6.5,19.2,1.0),monastery=roofY(-7.7,1,0,58.5,19.2,1.45);
let back=plane(box(5.4,33.5,6.3,9.7,BASE,11.3),0,-.8,16.4);
// Vijfzijdige koorsluiting met vlakken die naar de nok samenkomen.
let choir=prism([[30,-7.5],[32,-7.5],[35.5,-4.3],[35.5,3.6],[32,6.5],[30,6.5]],BASE,19.2);choir=plane(choir,0,1,19.7);choir=plane(choir,0,-1,18.7);choir=plane(choir,-1.05,0,51.75);
// De naaldvormige dakruiter is op schaal afgeknot voor een voldoende dikke top.
const cx=5.5,cy=-.5,ring=(r,z)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(i*Math.PI/4),cy+r*Math.sin(i*Math.PI/4),z]);
const spire=Manifold.hull([...ring(1.6,18.4),...ring(.48,31.4)]);
const butt=[];for(const x of [7.5,12.4,17.3,22.2,27.1,31.4]){let b=box(x-.48,x+.48,-8.35,-7.25,BASE,12);b=plane(b,0,1,20.1);butt.push(b)}
// Twee verhoogde topgevels en de herhaalde dakkapellen aan de buitengevel.
const gables=[5.6,49.8].map(y=>roofX(-8.05,-5.6,y-1.8,y+1.8,21.7,1.4));
const dormers=[];for(const y of [10,14,18,22,26,30,34,38,42,46,54]){
  dormers.push(roofX(-7.3,-5.1,y-.7,y+.7,16.7,1.0));
  dormers.push(Manifold.hull([[-7.2,y-.65,15.8],[-5.5,y-.65,15.8],[-5.5,y+.65,15.8],[-7.2,y+.65,15.8],[-6.75,y-.45,19],[-5.85,y-.45,19],[-5.85,y+.45,19],[-6.75,y+.45,19]]));
}
let church=Manifold.union([chapel,monastery,back,choir,spire,...butt,...gables,...dormers]);
const cuts=[];
// De kapel telt vijf traveeën; spitsramen als ondiepe nissen.
for(const x of [9.8,14.7,19.6,24.5,29.4])cuts.push(box(x-.75,x+.75,-7.9,-7.15,3.6,11.5));
// De kloostervleugel heeft drie duidelijk leesbare vensterlagen.
for(const y of [4,8,12,16,20,24,28,32,36,40,44,48,52,56])for(const z of [2.5,6.4,10.5]){cuts.push(box(-8,-7.35,y-.55,y+.55,z,z+2.2));if(y>7)cuts.push(box(.65,1.35,y-.55,y+.55,z,z+2.2));}
for(const x of [-6.4,-4.3,-2.2])for(const z of [2.4,6.4,10.4])cuts.push(box(x-.55,x+.55,-.35,.35,z,z+2.3));
for(const y of [-4,0,4])cuts.push(box(35.15,35.85,y-.65,y+.65,4.0,11));
church=church.subtract(Manifold.union(cuts));const parts=[['building:klooster en kapel',church]];
const META={name:'Kapel Broederschap Pius X Kerkrade',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0928100000116638'],description:'Kloosterkapel met vijfzijdig koor, dakruiter en haakse kloostervleugel.',realWorld:{groundNapM:GROUND_NAP,spireHeightM:31.4},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0928100000116638','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.kerkgebouwen-in-limburg.nl/kerken/bleijerheide/kloosterkapel-broeders-franciscanen-thans-kerk-st-maria-ter-engelen','https://commons.wikimedia.org/wiki/Category:Klooster_der_Broeders_Franciscanen_(Kerkrade)']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-kapel-broederschap-pius-x-kerkrade.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


