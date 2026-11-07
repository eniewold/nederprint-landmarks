import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="maria-geboortekerk-lent";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// X points from the west tower towards the choir; Y points north-west.
const BASE=-0.5,ORIGIN=[187892.8,430396.5],X_AXIS=[.8989,.4382],GROUND_NAP=10.539;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
function gable(a,b,c,d,eave,ridge,axis='x'){let r=box(a,b,c,d,eave-.1,ridge);if(axis==='x'){const m=(c+d)/2,k=(ridge-eave)/((d-c)/2);r=plane(r,0,k,ridge-k*m);r=plane(r,0,-k,ridge+k*m);}else{const m=(a+b)/2,k=(ridge-eave)/((b-a)/2);r=plane(r,k,0,ridge-k*m);r=plane(r,-k,0,ridge+k*m);}return r;}
// Nave and lower side aisles, cross arm and lower polygonal choir.
const nave=box(.8,38,-5.1,4.6,BASE,12.1), roof=gable(1,38,-5.1,4.6,12,20.1);
const aisles=[box(6.3,34,-10.7,10.3,BASE,8),gable(6.3,34,-10.7,10.3,7.9,12.4)];
const transept=[box(27,37.6,-11.6,13.5,BASE,12),gable(27,37.6,-11.6,13.5,11.9,19.3,'y')];
const choir=prism([[37,-5],[40,-5],[43,-2],[43,4.5],[40,7],[37,7]],BASE,12);let choirRoof=prism([[37,-5],[40,-5],[43,-2],[43,4.5],[40,7],[37,7]],11.9,19);choirRoof=plane(choirRoof,0,1.0,18);choirRoof=plane(choirRoof,0,-1.0,20);choirRoof=plane(choirRoof,-1,0,59);
// Attached low service wing, part of the same BAG building, plus small end building.
const wing=[box(3.2,6.5,8,21,BASE,3.5),box(-12.4,6.2,20.4,30.4,BASE,5.2),gable(-12.4,6.2,20.4,30.4,5.1,8.6)];
const tower=box(-3.6,1,-3,2.2,BASE,29.1);
const sq=(r,z)=>[[-1.3-r,-.4-r,z],[-1.3+r,-.4-r,z],[-1.3+r,-.4+r,z],[-1.3-r,-.4+r,z]];
const oct=(r,z)=>Array.from({length:8},(_,i)=>[-1.3+r*Math.cos(Math.PI/8+i*Math.PI/4),-.4+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const cornice=Manifold.hull([...sq(2.65,28.7),...sq(2.9,29.0),...sq(2.9,29.15)]),foot=Manifold.hull([...oct(2.9,29.05),...oct(2.25,30.3)]),spire=Manifold.hull([...oct(2.25,30.2),...oct(.45,45)]);
const supports=[];for(const x of [9.5,14.1,18.7,23.3])for(const y of [-1,1])supports.push(Manifold.hull([[x-.5,y*10.0,BASE],[x+.5,y*10.0,BASE],[x-.5,y*11.25,BASE],[x+.5,y*11.25,BASE],[x-.5,y*10.0,7.6],[x+.5,y*10.0,7.6],[x-.5,y*10.8,7.2],[x+.5,y*10.8,7.2]]));
let church=Manifold.union([nave,roof,...aisles,...transept,choir,choirRoof,...wing,tower,cornice,foot,spire,...supports]);
const cuts=[];for(const x of [11.8,16.4,21,25.6])for(const side of [-1,1])cuts.push(box(x-.65,x+.65,side<0?-11:10.4,side<0?-10.4:10.7,2.5,6.8));
// Shallow belfry openings remain within the masonry.
for(const y of [-1.3,.5])cuts.push(box(-3.8,-3.15,y-.38,y+.38,23.4,27.3));
for(const x of [-2.2,-.4])for(const side of [-1,1])cuts.push(box(x-.38,x+.38,side<0?-3.2:1.85,side<0?-2.65:2.4,23.4,27.3));
church=church.subtract(Manifold.union(cuts));
const parts=[['building:kerk',church]];
const META={name:'Maria Geboortekerk Lent',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0268100000036618'],description:'Neogotische kruiskerk met westtoren, spits, lagere zijbeuken, transept, koor en verbonden lage aanbouw; details en dakafmetingen geschat naar foto’s.',realWorld:{groundNapM:GROUND_NAP},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000036618','https://www.monumenten.nl/monument/522954','https://www.rkparochiemariamagdalena.nl/gemeenschap/lent/?eventDisplay=past&post_type=project&project=lent&shortcode=61918f5d','https://commons.wikimedia.org/wiki/Category:Maria_Geboorte_(Lent)','https://service.pdok.nl/rws/ahn/wcs/v1_0']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-maria-geboortekerk-lent.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





