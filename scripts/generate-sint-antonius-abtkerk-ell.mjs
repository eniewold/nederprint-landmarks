import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-antonius-abtkerk-ell';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[183449.27,359033.52],X_AXIS=[.793,-.608],GROUND_NAP=29.6;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
// Het hoofdschip en de zijbeuken zijn afzonderlijke, vlakke dakvolumes.
const nave=roofX(0,32.4,-4.35,4.35,16.34,1.12);
let south=plane(box(0,32.3,-8.5,-4.2,BASE,9.1),0, .63,11.75);
let north=plane(box(0,32.3,4.2,8.5,BASE,9.1),0,-.63,11.75);
// Halfrond koor, met een tentdak als vlakken in plaats van hoogteplakken.
const apsePts=[[32,-4.0],...Array.from({length:9},(_,i)=>{let a=-Math.PI/2+i*Math.PI/8;return [35.6+4*Math.cos(a),4*Math.sin(a)]}),[32,4.0]];
const apse=prism(apsePts,BASE,10.2);
const apseRoof=Manifold.hull([...apsePts.map(([x,y])=>[x,y,10.0]),[35.6,0,14.4]]);
const tower=box(7,13.2,2.7,8.6,BASE,23.5);
// Het AHN geeft circa 26,8 m op de dakvlakken; de hoogste pixel (29,7 m)
// bevat ook het smalle topornament. De afgeknotte dakpunt is printbaar.
const cornice=Manifold.hull([[7,2.7,23.0],[13.2,2.7,23.0],[13.2,8.6,23.0],[7,8.6,23.0],[6.7,2.4,23.4],[13.5,2.4,23.4],[13.5,8.9,23.4],[6.7,8.9,23.4]]);
const belt=Manifold.hull([[7,2.7,18.6],[13.2,2.7,18.6],[13.2,8.6,18.6],[7,8.6,18.6],[6.8,2.5,18.85],[13.4,2.5,18.85],[13.4,8.8,18.85],[6.8,8.8,18.85]]);
const towerRoof=Manifold.hull([[6.7,2.4,23.35],[13.5,2.4,23.35],[13.5,8.9,23.35],[6.7,8.9,23.35],[9.65,5.25,27.8],[10.55,5.25,27.8],[10.55,6.15,27.8],[9.65,6.15,27.8]]);
const entry=roofX(5.3,7.2,4.3,7.5,9,1.0);
// Kleine aanbouwen aan de koorzijde, vastgesteld uit de 3D BAG.
const annex1=roofX(32.2,37.5,-8.5,-4.0,6.9,.65),annex2=roofX(32.2,37.5,4.0,8.1,6.9,.65);
let church=Manifold.union([nave,south,north,apse,apseRoof,tower,belt,cornice,towerRoof,entry,annex1,annex2]);
// Terugliggende vensters en het westelijke ingangsportaal.
const cuts=[];for(const x of [3.5,8,12.5,17,21.5,26,30.2])for(const side of [-1,1]){let y=side*8.5;cuts.push(box(x-.65,x+.65,y-.25,y+.25,2.2,5.8)); if(x>13.2)cuts.push(box(x-.6,x+.6,side<0?-4.5:4.1,side<0?-4.1:4.5,10,12.3));}
// Gekoppelde galmgaten zijn ondiepe nissen op alle vier zijden.
for(const x of [8.8,11.3])for(const y of [2.7,8.6])cuts.push(box(x-.63,x+.63,y-.3,y+.3,19.2,22.2));
for(const y of [4.4,6.8])cuts.push(box(6.7,7.3,y-.6,y+.6,19.2,22.2),box(12.9,13.5,y-.6,y+.6,19.2,22.2));
cuts.push(box(-.3,.3,-.9,.9,BASE,3.5));
// Het ronde venster boven de ingang is een ondiepe nis.
cuts.push(Manifold.cylinder(.6,1.25,1.25,24,true).rotate([0,90,0]).translate([0,0,11.5]));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Antonius Abtkerk Ell',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1640100000057008'],description:'Driebeukige basiliek met rond koor, lage zijbeuken en vierkante noordelijke toren met tentdak.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:27.8},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1640100000057008','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://cuatro.sim-cdn.nl/leudal/uploads/rapportage-_kerkenvisie_gemeente_leudal.pdf','https://commons.wikimedia.org/wiki/Category:Sint-Antonius_Abtkerk_(Ell_(Limburg))']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-antonius-abtkerk-ell.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


