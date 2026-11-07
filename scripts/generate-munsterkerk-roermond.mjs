import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="munsterkerk-roermond";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-0.5,ORIGIN=[197060,356190],X_AXIS=[1,0],GROUND_NAP=24.044;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofX=(x0,x1,y0,y1,eave,ridge)=>{let s=box(x0,x1,y0,y1,eave-.05,ridge);const ym=(y0+y1)/2,k=(ridge-eave)/((y1-y0)/2);s=plane(s,0,-k,ridge+k*ym);s=plane(s,0,k,ridge-k*ym);return s};
// Westbouw, schip met zijbeuken, dwarsschip en driekorenpartij.
const west=Manifold.union([box(-24,-8,-9.8,9.8,BASE,19.2),box(-29,-23.8,-4.8,4.8,BASE,19.2)]);
const westRoof=Manifold.union([roofX(-24,-8,-9.8,9.8,19.15,24.6),roofX(-29,-23.8,-4.8,4.8,19.15,24.6)]);
const nave=box(-8,10,-8.9,8.9,BASE,10.3);
const naveHigh=box(-8,10,-4.1,4.1,BASE,15.6);
const naveRoof=roofX(-8,10,-4.1,4.1,15.55,19.5);
const northRoof=roofX(-8,10,4.0,8.9,10.25,12.5);
const southRoof=roofX(-8,10,-8.9,-4.0,10.25,12.5);
const crossing=box(8,19,-5.4,5.4,BASE,16.5);
// Aansluitend zuidelijk bouwdeel, zichtbaar op luchtfoto en in de BAG.
const wing=box(16.5,25,-19,-9,BASE,6.2);
let wingRoof=box(16.5,25,-19,-9,6.15,11);wingRoof=plane(wingRoof,-.85,0,28.6);wingRoof=plane(wingRoof,.85,0,-6.68);
const trans=box(7,16,-10.7,10.7,BASE,12.3);
const apse=(x,y,r,z)=>Manifold.cylinder(z-BASE,r,r,16).translate([x,y,BASE]);
const northApse=apse(12,8.5,4.7,12.6),southApse=apse(12,-8.5,4.7,12.6),eastApse=apse(19,0,5.2,13.4);
const cap=(x,y,r,z,h)=>Manifold.cylinder(h,r,0,16).translate([x,y,z]);
const caps=[cap(12,8.5,4.7,12.55,4.5),cap(12,-8.5,4.7,12.55,4.5),cap(19,0,5.2,13.35,4.5)];
// Koepel en lantaarn bestaan uit achthoekige omwentelingsvormen.
const drum=Manifold.cylinder(12,5.3,5.3,8).rotate([0,0,22.5]).translate([12,0,15]);
const dome=Manifold.cylinder(3.6,5.3,2.1,8).rotate([0,0,22.5]).translate([12,0,27]);
const lantern=Manifold.cylinder(1.7,1.4,1.4,8).translate([12,0,30.3]);
const lanternRoof=Manifold.cylinder(1.2,1.4,0,8).translate([12,0,32]);
// Torens met vier frontons en viervlaks spits; oosthoogte afgeleid uit foto's.
function tower(x,y,width,shaft,top){const h=width/2;const base=box(x-h,x+h,y-h,y+h,BASE,shaft);const g1=roofX(x-h,x+h,y-h,y+h,shaft-.05,shaft+3.5);let g2=box(x-h,x+h,y-h,y+h,shaft-.05,shaft+3.5);const k=3.5/h;g2=plane(g2,-k,0,shaft+3.5+k*x);g2=plane(g2,k,0,shaft+3.5-k*x);const roof=Manifold.hull([[x-h,y-h,shaft+1],[x+h,y-h,shaft+1],[x+h,y+h,shaft+1],[x-h,y+h,shaft+1],[x,y,top]]);return Manifold.union([base,g1,g2,roof])}
const towers=[tower(-20,-6.7,7,33,55),tower(-20,6.7,7,33,55),tower(18,-6.1,4.5,29,44),tower(18,6.1,4.5,29,44)];
let church=Manifold.union([west,westRoof,nave,naveHigh,naveRoof,northRoof,southRoof,crossing,wing,wingRoof,trans,northApse,southApse,eastApse,...caps,drum,dome,lantern,lanternRoof,...towers]);
// Galmgaten, drie traveeï¿½n per gevel als printbare, spitse blinde nissen.
for(const [x,y,w,levels] of [[-20,-6.7,7,[24,29]],[-20,6.7,7,[24,29]],[18,-6.1,4.5,[19,24]],[18,6.1,4.5,[19,24]]]){
 for(const z of levels)for(const d of [-1.0,1.0])for(const side of [-1,1]){
  let cut=box(x+d-.42,x+d+.42,y+side*w/2-.28,y+side*w/2+.28,z,z+2.5);cut=plane(cut,-1.25,0,z+2.5+1.25*(x+d));cut=plane(cut,1.25,0,z+2.5-1.25*(x+d));church=church.subtract(cut);
  let cut2=box(x+side*w/2-.28,x+side*w/2+.28,y+d-.42,y+d+.42,z,z+2.5);cut2=plane(cut2,0,-1.25,z+2.5+1.25*(y+d));cut2=plane(cut2,0,1.25,z+2.5-1.25*(y+d));church=church.subtract(cut2);
 }
}
// Zijbeuken en westgevel met verdiepte vensters en ingang.
for(const u of [-6,-2,2,6])for(const side of [-1,1]){let c=box(u-.55,u+.55,side*8.9-.28,side*8.9+.28,3.1,6.4);c=plane(c,-1.2,0,6.4+1.2*u);c=plane(c,1.2,0,6.4-1.2*u);church=church.subtract(c)}
church=church.subtract(box(-29.3,-28.7,-1.1,1.1,0,4));
for(const yy of [-5,-2,2,5])church=church.subtract(box(-29.3,-28.7,yy-.6,yy+.6,7,11));
// Lisenen langs de zijbeuken verbinden muur en kap en markeren de traveeën.
for(const u of [-7,-2.5,2,6.5])for(const side of [-1,1])church=church.add(box(u-.5,u+.5,side<0?-9.35:8.7,side<0?-8.7:9.35,BASE,9.6));
// Twee arcadeniveaus op de drie ronde koorsluitingen.
for(const [cx,cy,start] of [[12,8.5,0],[12,-8.5,180],[19,0,-90]])for(const deg of [start+25,start+60,start+90,start+120,start+155]){
 const rad=deg*Math.PI/180,r=cx===19?5.2:4.7;
 for(const [z0,z1] of [[4.5,8.2],[10.1,11.9]]){
  const cut=box(-.52,.52,-.48,.48,z0,z1).rotate([0,0,deg-90]).translate([cx+r*Math.cos(rad),cy+r*Math.sin(rad),0]);church=church.subtract(cut);
 }
}
// Drie conchen: vensternissen aan de buitenzijde, vereenvoudigd voor printschaal.
for(const side of [-1,1])for(const dx of [-2,0,2])church=church.subtract(box(12+dx-.5,12+dx+.5,side*13.2-.25,side*13.2+.25,5,8.5));
for(const yy of [-2,0,2])church=church.subtract(box(23.95,24.45,yy-.5,yy+.5,5,8.5));
const parts=[["building:kerk",church]];
const META={name:"Munsterkerk Roermond",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0957100000260969"],description:"Kruisbasiliek met westwerk, vier torens, vieringkoepel en drie koorsluitingen; oosttorenspitsen op basis van foto's geschat.",realWorld:{groundNapM:24.044,westernTowersM:55,easternTowersEstimateM:44},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0957100000260969","https://en.wikipedia.org/wiki/Munsterkerk","https://commons.wikimedia.org/wiki/Category:Munsterkerk,_Roermond","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-munsterkerk-roermond.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));



