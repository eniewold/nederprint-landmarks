import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-martinuskerk-linne';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.8,ORIGIN=[193413.25,352198.5],X_AXIS=[.998,.065],GROUND_NAP=27.7;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const nave=roofX(3,30.5,-4.5,4.5,18.1,1.06);
let south=plane(box(3,26.8,-9.3,-4.3,BASE,9.1),0,.58,11.7),north=plane(box(3,26.8,4.3,9.3,BASE,9.1),0,-.58,11.7);
// De koorsluiting is halfrond, met een eigen half kegeldak.
const p=[[29,-4.1],...Array.from({length:9},(_,i)=>{let a=-Math.PI/2+i*Math.PI/8;return [30.1+4.1*Math.cos(a),4.1*Math.sin(a)]}),[29,4.1]];
const apse=Manifold.union([prism(p,BASE,12.1),Manifold.hull([...p.map(([x,y])=>[x,y,12]),[30.1,0,15.2]])]);
const side1=roofX(26,30.8,-9.1,-4.2,9.0,.7),side2=roofX(26,30.8,4.2,9.1,9.0,.7);
// Westtoren met frontalen en een achthoekige spits: AHN5 meet de top.
const tower=box(-3.2,3.5,-3.6,3.5,BASE,27.3);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[.15+r*Math.cos(Math.PI/8+i*Math.PI/4),-.05+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
// De frontfoto toont brede, hoge frontalen; meetpunten nabij de buitenzijde
// reiken tot circa 31 m en het frontaal loopt erboven in de steile dakvlakken.
const gables=Manifold.hull([[-3.2,-3.6,27.25],[3.5,-3.6,27.25],[3.5,3.5,27.25],[-3.2,3.5,27.25],[.15,-3.6,32.4],[.15,3.5,32.4],[-3.2,-.05,32.4],[3.5,-.05,32.4],...oct(3.1,31)]);
const spire=Manifold.hull([...oct(3.1,30.95),...oct(.49,42.8)]);
const baptistry=Manifold.cylinder(7.5,2.1,2.1,12).translate([0,4.5,BASE]);
const stair=Manifold.cylinder(11,1.6,1.6,12).translate([0,-4.1,BASE]);
const bRoof=Manifold.hull([[0,4.5,9.4],...Array.from({length:12},(_,i)=>[2.1*Math.cos(i*Math.PI/6),4.5+2.1*Math.sin(i*Math.PI/6),6.6])]);
const butt=[];for(const x of [5.5,12.5,19.5,26])for(const side of [-1,1]){let b=box(x-.5,x+.5,side<0?-10:8.3,side<0?-8.3:10,BASE,9.8);b=plane(b,0,side<0?1:-1,side<0?19.5:19.5);butt.push(b)}
let church=Manifold.union([nave,south,north,apse,side1,side2,tower,gables,spire,baptistry,bRoof,stair,...butt]);
const cuts=[];for(const x of [8.2,15.2,22.2])for(const side of [-1,1]){let y=side*9.3;cuts.push(box(x-.65,x+.65,y-.3,y+.3,2.3,5.5));for(const dx of [-.8,.8])cuts.push(box(x+dx-.5,x+dx+.5,side<0?-4.8:4.2,side<0?-4.2:4.8,10.3,12.7));}
for(const x of [-1.15,1.15])for(const y of [-3.6,3.5])cuts.push(box(x-.55,x+.55,y-.3,y+.3,22.8,26.2));
for(const y of [-1.3,1.3])cuts.push(box(-3.5,-2.9,y-.55,y+.55,22.8,26.2));
for(const z of [7.5,14.2])cuts.push(box(-3.5,-2.9,-.55,.55,z,z+2.5));
cuts.push(Manifold.cylinder(.7,.95,.95,24,true).rotate([0,90,0]).translate([-3.2,-.05,29]));
cuts.push(box(-3.5,-2.9,-1.1,1.1,BASE,3.7));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Martinuskerk Linne',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1641100001084157'],description:'Neoromaanse driebeukige basiliek met ronde apsis en toren met frontalen en achtkante spits.',realWorld:{groundNapM:GROUND_NAP,spireHeightM:42.8},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1641100001084157','https://www.ahn.nl/dataroom','https://www.monumenten.nl/monument/522193','https://commons.wikimedia.org/wiki/Category:Sint_Martinuskerk,_Linne']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-martinuskerk-linne.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


