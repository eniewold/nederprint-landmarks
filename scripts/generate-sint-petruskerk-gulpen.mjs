import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-petruskerk-gulpen';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.6,ORIGIN=[190355.25,314001.25],X_AXIS=[.936,-.352],GROUND_NAP=95;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(y0+y1)/2;v=plane(v,0,sl,z-sl*mid);return plane(v,0,-sl,z+sl*mid)};
const roofY=(x0,x1,y0,y1,z,sl)=>{let v=box(x0,x1,y0,y1,BASE,z),mid=(x0+x1)/2;v=plane(v,sl,0,z-sl*mid);return plane(v,-sl,0,z+sl*mid)};
// Hoofdschip, kruisbeuk en zijbeuken uit onafhankelijke dakvlakken.
const nave=roofX(2.8,44.9,-6.9,7,21.7,1.1),cross=roofY(23.2,37.2,-15.2,15.5,21.7,.98);
let south=plane(box(6.5,24,-11.2,-6.6,BASE,9.8),0,.65,14.1),north=plane(box(6.5,24,6.6,11.2,BASE,9.8),0,-.65,14.1);
// De ronde hoofdapsis en twee nevenapsissen hebben elk een eigen dak.
const apse=(start,cy,r,wall,top)=>{const p=[[start,cy-r],...Array.from({length:9},(_,i)=>{let a=-Math.PI/2+i*Math.PI/8;return [start+2+r*Math.cos(a),cy+r*Math.sin(a)]}),[start,cy+r]];return Manifold.union([prism(p,BASE,wall),Manifold.hull([...p.map(([x,y])=>[x,y,wall-.1]),[start+2,cy,top]])])};
const choir=apse(43.2,0,4.5,12.5,17.8),apse1=apse(42.2,-8.5,2.2,6.4,9),apse2=apse(42.2,8.5,2.2,6.4,9);
const annex=roofX(36.2,46.8,10,21.3,9.6,.6);
// De 3D BAG mist de hoge toren: AHN meet de nok op circa 48 m.
const tower=box(-3.8,4.1,-4.1,4.0,BASE,32.5);
// De vier hoge frontalen volgen de foto: hun nok ligt ruim boven de galmgeleding.
const towerCap=Manifold.hull([[-3.8,-4.1,32.45],[4.1,-4.1,32.45],[4.1,4.0,32.45],[-3.8,4.0,32.45],[.15,-4.1,40.6], [.15,4.0,40.6],[-3.8,-.05,40.6],[4.1,-.05,40.6],[-.3,-.5,47.8],[.6,-.5,47.8],[.6,.4,47.8],[-.3,.4,47.8]]);
const porch=roofX(-6.3,-3.6,-2.6,2.6,9.4,1.1);
const stair=Manifold.cylinder(18,1.55,1.55,12).translate([0,-5.1,BASE]);
let church=Manifold.union([nave,cross,south,north,choir,apse1,apse2,annex,tower,towerCap,porch,stair]);
const cuts=[];
for(const x of [9,13.4,17.8,22])for(const side of [-1,1]){let y=side*11.2;cuts.push(box(x-.65,x+.65,y-.4,y+.4,2.5,5.8));cuts.push(box(x-.6,x+.6,side<0?-7.3:6.5,side<0?-6.5:7.3,10.6,13.35));}
for(const x of [26,29.5,33.5])for(const y of [-15.2,15.5])cuts.push(box(x-.6,x+.6,y-.25,y+.25,3,11.5));
for(const x of [-2,0,2])for(const y of [-4.1,4])cuts.push(box(x-.5,x+.5,y-.25,y+.25,25.7,30.2));
for(const y of [-2.2,0,2.2])cuts.push(box(-4.1,-3.55,y-.48,y+.48,25.7,30.2),box(3.85,4.35,y-.48,y+.48,25.7,30.2));
// De wijzerplaten geven de vier driehoekige geveltoppen hun herkenbare reliëf.
for(const x of [-3.8,4.1])cuts.push(Manifold.cylinder(.7,1.25,1.25,24,true).rotate([0,90,0]).translate([x,-.05,35.8]));
for(const y of [-4.1,4])cuts.push(Manifold.cylinder(.7,1.25,1.25,24,true).rotate([90,0,0]).translate([.15,y,35.8]));
cuts.push(box(-6.55,-6.05,-1.05,1.05,BASE,4.4));
church=church.subtract(Manifold.union(cuts));const parts=[['building:kerk',church]];
const META={name:'Sint-Petruskerk Gulpen',origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.1729100001035357'],description:'Neoromaanse kruisbasiliek met drie apsissen en westtoren met ruitdak.',realWorld:{groundNapM:GROUND_NAP,towerHeightM:47.8},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1729100001035357','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumenten/491684','https://commons.wikimedia.org/wiki/Category:Sint-Petruskerk_(Gulpen)']};

function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-petruskerk-gulpen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


