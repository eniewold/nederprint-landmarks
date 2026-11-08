import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-lambertuskerk-lemiers';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.8,ORIGIN=[197324.25,309653.25],X_AXIS=[.975,.222],GROUND_NAP=195.8;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
// De drie opeenvolgende bouwdelen hebben elk een eigen, lager liggende nok.
const nave=roofX(2.8,12.5,-3.1,4.5,10.2,.95),choir=roofX(12.3,18.4,-2.1,3.4,8.3,1.0),annex=roofX(18.2,23.3,-2.1,3.4,7.2,1.0);
const tower=box(-3.1,3.1,-3.1,4.1,BASE,10.1);
// Romaans getinte noordkapel met halfronde sluiting en tentdak.
const np=[[-3.1,3.7],[3.3,3.7],[3.3,7.5],...Array.from({length:9},(_,i)=>{let a=i*Math.PI/8;return [3.3*Math.cos(a),7.5+3.3*Math.sin(a)]}),[-3.1,3.7]];
const north=prism(np,BASE,5.1),northRoof=Manifold.hull([...np.slice(0,-1).map(([x,y])=>[x,y,5]),[0,6.9,8.1]]);
// Vierkante, onderaan uitgezwenkte naald; de top volgt het AHN5-DSM.
const flare=Manifold.hull([[-3.1,-3.1,10],[3.1,-3.1,10],[3.1,4.1,10],[-3.1,4.1,10],[-1.75,-1.25,12.2],[1.75,-1.25,12.2],[1.75,2.25,12.2],[-1.75,2.25,12.2]]);
const needle=Manifold.hull([[-1.75,-1.25,12.1],[1.75,-1.25,12.1],[1.75,2.25,12.1],[-1.75,2.25,12.1],[-.45,.05,25.7],[.45,.05,25.7],[.45,.95,25.7],[-.45,.95,25.7]]);
let church=Manifold.union([nave,choir,annex,tower,north,northRoof,flare,needle]);
const cuts=[];for(const x of [5.2,9.5])for(const y of [-3.1,4.5])cuts.push(box(x-.6,x+.6,y-.35,y+.35,2.8,6.2));
for(const x of [15.2,20.8])for(const y of [-2.1,3.4])cuts.push(box(x-.6,x+.6,y-.35,y+.35,2.6,5.1));
for(const x of [-1.25,1.25])cuts.push(box(x-.55,x+.55,-3.45,-2.75,3.5,8.2));
cuts.push(box(-1.1,1.1,-3.45,-2.75,BASE,2.9));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Lambertuskerk Lemiers',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,groundSamplePoints:[[-4,-5],[8,-5],[20,-5],[20,8],[0,12]],replacesBuildings:['NL.IMBAG.Pand.0981100000015856'],description:'Kerk van Lambertus en Genoveva in Holset, met drie verspringende dakvolumes en naaldspits op de westtoren.',realWorld:{groundNapM:GROUND_NAP,spireHeightM:25.7},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0981100000015856','https://www.ahn.nl/dataroom','https://bedevaart.meertens.knaw.nl/plaats/343','https://commons.wikimedia.org/wiki/Category:HH._Lambertus_en_Genovevakerk']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-lambertuskerk-lemiers.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


