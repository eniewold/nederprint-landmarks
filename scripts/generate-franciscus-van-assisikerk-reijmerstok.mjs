import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='franciscus-van-assisikerk-reijmerstok';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.7,ORIGIN=[186829,312388],X_AXIS=[.707,-.707],GROUND_NAP=171.5;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const roofY=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(x0+x1)/2;v=plane(v,sl,0,z-sl*mid);return plane(v,-sl,0,z+sl*mid)};
// Wielders' eenbeukige schip en lagere dwarsarmen zijn vlakke zadeldaken.
const nave=roofX(.8,23.5,-6.4,8.3,13.9,1.0),transept=roofY(13.4,20.2,-8,9.9,8.8,.95);
const choir=roofX(21.6,24.5,-3.8,6.4,11.6,1.0),annex=roofX(23.7,27.5,-6.9,-1.7,8.7,.95);
// De toren heeft een zadeldak, geen naaldspits; top uit AHN5/4.
const tower=box(-1.7,3.6,-2.5,2.6,BASE,18.5),towerRoof=roofX(-1.7,3.6,-2.5,2.6,22.95,1.75);
// De karakteristieke ronde penanten bij de ingang, voldoende dik op 1:1000.
const col1=Manifold.cylinder(3.8,.8,.8,12).translate([-1.7,-2.55,BASE]),col2=Manifold.cylinder(3.8,.8,.8,12).translate([-1.7,2.65,BASE]);
let church=Manifold.union([nave,transept,choir,annex,tower,towerRoof,col1,col2]);
// De drie hoge spitsboogvensters bepalen de zijgevel; ze blijven blinde nissen.
const cuts=[];for(const x of [5,9.3,13])for(const y of [-6.4,8.3]){
  cuts.push(box(x-1,x+1,y-.35,y+.35,2.9,5.5));
  cuts.push(Manifold.hull([[x-1,y-.35,5.45],[x+1,y-.35,5.45],[x-1,y+.35,5.45],[x+1,y+.35,5.45],[x,y-.35,6.45],[x,y+.35,6.45]]));
}
for(const y of [-1.3,0,1.3])cuts.push(box(-2,-1.35,y-.45,y+.45,15.9,17.5));
cuts.push(box(-2,-1.35,-1,1,BASE,3.2),box(-2,-1.35,-.8,.8,4.8,9.2));
// Klok in de torengevel als ondiep rond reliëf.
cuts.push(Manifold.cylinder(.7,.85,.85,24,true).rotate([0,90,0]).translate([-1.7,0,14.4]));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Franciscus van Assisikerk Reijmerstok',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1729100001032685'],description:'Eenbeukige kruiskerk met lagere dwarsarmen en dominante zadeldaktoren van Jos Wielders.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:22.95},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1729100001032685','https://www.ahn.nl/dataroom','https://www.monumenten.nl/monument/491690','https://bisdom-roermond.org/Eeuwfeest-nieuwe-kerk-Reijmerstok','https://commons.wikimedia.org/wiki/Category:Franciscus_van_Assisikerk_(Reijmerstok)']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-franciscus-van-assisikerk-reijmerstok.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


