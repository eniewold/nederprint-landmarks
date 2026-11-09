import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-laurentiuskerk-oudorp';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[113483,516630],X_AXIS=[.98728,-.15899];
const prism=(p,z0,z1)=>{const a=p.reduce((s,q,i)=>s+q[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*q[1],0);return Manifold.extrude(new CrossSection([a<0?[...p].reverse():p]),z1-z0).translate([0,0,z0])};
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((d-c)/2),mid=(c+d)/2;return plane(plane(s,0,k,ridge-k*mid),0,-k,ridge+k*mid)};
const crossGable=(a,b,c,d,eave,ridge)=>{let s=box(a,b,c,d,eave-.1,ridge);const k=(ridge-eave)/((b-a)/2),mid=(a+b)/2;return plane(plane(s,k,0,ridge-k*mid),-k,0,ridge+k*mid)};
const roof=(p,eave,peaks)=>Manifold.hull([...p.map(([x,y])=>[x,y,eave]),...peaks]);
// Driebeukige pseudobasiliek met breed langsdak en vijfzijdig koor.
const solids=[];
solids.push(box(-19.8,21.1,-7.4,9.8,BASE,9.05),gable(-19.8,21.1,-7.4,9.8,9,17.79));
const choir=[[20.5,-3.2],[22.8,-3.2],[25.2,-.7],[25.2,2.9],[22.8,5.3],[20.5,5.3]];
solids.push(prism(choir,BASE,10),roof(choir,9.95,[[20.5,1.1,17.1],[22.5,1.1,17.1]]));
// Noord- en zuidgevel hebben regelmatig verdeelde steunberen.
for(const x of [-17.2,-12.5,-7.8,-3,1.7,6.5,11.2,16,20.7])for(const y of [-7.45,9.85])solids.push(box(x-.48,x+.48,y-.7,y+.7,BASE,9.1));
// Pastorie: twee verdiepingen onder een schilddak; de latere verbindingsbouw is laag.
const house=[[11.1,-28],[24,-28],[24,-16.3],[11.1,-16.3]];
solids.push(prism(house,BASE,8.8),roof(house,8.75,[[16,-22,13.35],[19,-22,13.35]]));
solids.push(box(21.8,24,-23.2,-21,BASE,10.4),gable(21.8,24,-23.2,-21,10.35,12.4));
// Achterste dakkapel met plat dak is in het monumentenregister beschreven; maten geschat.
solids.push(box(11.35,14,-23.8,-20.8,BASE,11.15));
solids.push(box(10.2,21.4,-16.5,-7.2,BASE,4.5),crossGable(10.2,21.4,-16.5,-7.2,4.45,7));
// Halfingebouwde westtoren met slanke spits; hoogten uit AHN en foto's.
solids.push(box(-22.2,-16.9,-1.2,4.8,BASE,28));
const ring=(x,y,r,z)=>Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return [x+r*Math.cos(a),y+r*Math.sin(a),z]});
solids.push(Manifold.hull([...ring(-19.55,1.8,2.8,27.95),...ring(-19.55,1.8,.5,48.2)]));
// Portaal met topgevel aan de ingang, zoals op de westfoto.
solids.push(box(-23.3,-21.8,.3,3.4,BASE,5),gable(-23.3,-21.8,.3,3.4,4.95,7));
let church=Manifold.union(solids);
const pointed=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w*.55],[0,h],[-w/2,h-w*.55]];return prism(p,0,.7).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-15,-10.3,-5.5,-.7,4.1,8.8,13.6,18.3])for(const y of [-7.05,10.15])church=church.subtract(pointed(x,y,2.3,1.8,5.6));
for(const y of [-.3,1.8,3.9])for(const z of [7,22])church=church.subtract(pointed(0,0,z,1.2,5).rotate([0,0,90]).translate([-22.55,y,0]));
// Voorzijde pastorie: twee brede benedenvensters, een deur en drie bovenvensters.
for(const y of [-25.5,-18.8])church=church.subtract(box(23.65,24.35,y-.7,y+.7,1.2,3.7));
for(const y of [-25.5,-22.1,-18.8])church=church.subtract(box(23.65,24.35,y-.7,y+.7,5,7.5));
church=church.subtract(box(23.65,24.35,-22.7,-21.5,.3,3.1));
// Rond roosvenster in de westtoren en hoog venster van de koorsluiting.
church=church.subtract(Manifold.cylinder(.7,1.15,1.15,32).rotate([0,90,0]).translate([-22.55,1.8,16.3]));
church=church.subtract(pointed(0,0,2.5,1.65,8).rotate([0,0,90]).translate([24.85,1.1,0]));
// Westelijke achtergevel is beschreven in het monumentenregister; nissen schematisch.
for(const y of [-25.5,-22.1,-18.8])for(const z of [1.1,4.9])church=church.subtract(pointed(0,0,z,1.4,2.4).rotate([0,0,90]).translate([10.75,y,0]));
const parts=[['building:kerk',church]];
const META={name:'Sint-Laurentiuskerk Oudorp',origin:ORIGIN,xAxis:X_AXIS,groundHeight:.24,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0361100000100864'],description:'Neogotische pseudobasiliek met toren, pastorie en lage verbindingsvleugel.',realWorld:{groundNapM:.24,churchRidgeNapM:18.03,houseRidgeNapM:13.8,spireAhn4NapM:48.66},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0361100000100864','https://commons.wikimedia.org/wiki/Category:St._Laurentius_(Oudorp)','https://www.erfgoedalkmaar.nl/monumenten/fotogalerij-sint-laurentiuskerk-oudorp/','https://www.monumenten.nl/monument/524949','https://monumentenregister.cultureelerfgoed.nl/monumenten/524948','https://www.ahn.nl/dataroom']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-protestantse-kerk-oisterwijk.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
for(const piece of pieces)console.log('piece',JSON.stringify(piece.boundingBox()),piece.volume());
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));





