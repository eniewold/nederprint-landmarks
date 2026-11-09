import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='sint-petrus-stoel-van-antiochiekerk-uden';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[170540,407864],X_AXIS=[.931,.365];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c);
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c);

// Schip met gemeten nok NAP +42,50 m en flankerende lagere beuken.
let nave=roofY(box(-38.5,3,-8,4.2,BASE,26),-2,26,1);
let aisles=[];for(const [a,b,k,c] of [[-11.8,-7.9,.65,16.5],[4.1,8,-.65,13.8]]){let s=box(-33,-7.5,a,b,BASE,12);s=plane(s,0,k,c);aisles.push(s)}
// Kruising en klaverbladvormige koorpartij met drie ronde sluitingen.
let transept=roofX(box(-3.3,8.2,-16.8,13.2,BASE,26),2.5,26,1);
let choir=roofY(box(2,24,-8,4.2,BASE,26),-2,26,1);
const round=(x,y,r,height,top)=>Manifold.union([Manifold.cylinder(height-BASE,r,r,32).translate([x,y,BASE]),Manifold.cylinder(top-height,r,.12,32).translate([x,y,height-.05])]);
let apses=[round(22.7,-2,7.8,19,24.7),round(2.5,-16.8,5.3,15.7,21.2),round(2.5,13.2,5.3,15.7,21.2),round(-7.5,-11.8,3.7,11.6,15.5),round(-7.5,8,3.7,11.6,15.5),round(12.5,-12,4.2,11.6,15.5),round(12.5,8.1,4.2,11.6,15.5)];
// Achthoekige vieringstoren met koepel, profiel als kromme omwentelingsvorm.
let drum=Manifold.cylinder(37.5-BASE,10.2,10.2,8).rotate([0,0,22.5]).translate([1,-2,BASE]);
let profile=[[0,37.5],[10.2,37.5]];for(let i=1;i<=32;i++){let a=(Math.PI/2)*i/32;profile.push([10.2*Math.cos(a),37.5+10.4*Math.sin(a)])}profile.push([0,37.5]);
let dome=Manifold.revolve([profile],8).rotate([0,0,22.5]).translate([1,-2,0]);
let cornice=Manifold.cylinder(1.1,10.2,10.7,8).rotate([0,0,22.5]).translate([1,-2,36.4]);
// Octogonale torenschachten, vlakke spitsen; top NAP +75,94 m in AHN4.
let towers=[];for(const y of [-9.5,5.5]){let base=box(-41.3,-33.7,y-3.8,y+3.8,BASE,15);let shaft=Manifold.cylinder(26.0,3.55,3.55,8).rotate([0,0,22.5]).translate([-37.5,y,14.7]);let sp=Manifold.cylinder(18.8,3.55,.45,8).rotate([0,0,22.5]).translate([-37.5,y,40.4]);towers.push(base,shaft,sp)}
// Westfront en voorportaal; sacristie aan zuidoostkant.
let front=roofY(box(-41,-35,-5.7,1.7,BASE,26),-2,26,1);
let entry=plane(box(-42.7,-39,-5.3,1.3,BASE,8.5),-.4,0,-8.2);
let annex=roofY(box(11.8,23.2,-23.3,-10,BASE,9.6),-20,9.6,.95);
let supports=[];for(const x of [-30,-24,-18,-12])for(const y of [-12,8])supports.push(box(x-.5,x+.5,y-.6,y+.6,BASE,11));
let church=Manifold.union([nave,...aisles,transept,choir,...apses,drum,cornice,dome,...towers,front,entry,annex,...supports]);
// Binnen de maaiveldvoet sluit deze dunne plaat twee onbedoelde tunnels aan de kruising.
church=church.add(Manifold.cylinder(.6,12.5,12.5,8).rotate([0,0,22.5]).translate([1,-2,BASE]));
// Blinde rondbogen worden printbare nissen met steunloze punt.
const niche=(x,y,z,w,h)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1.3).rotate([90,0,0]).translate([x,y,z])};
for(const x of [-29,-24,-19,-14])for(const y of [-11.4,8.8])church=church.subtract(niche(x,y,3,1.8,6));
for(const x of [-29,-24,-19,-14])for(const y of [-7.4,4.9])church=church.subtract(niche(x,y,13,1.4,5));
for(const y of [-9.5,5.5]){for(const z of [16,22,31])church=church.subtract(niche(0,0,z,1.35,z===31?7:4).rotate([0,0,90]).translate([-41.0,y,0]));}
for(const y of [-4.3,-2,0.3])church=church.subtract(niche(0,0,.4,1.6,4.2).rotate([0,0,90]).translate([-43.0,y,0]));
for(const y of [-4.3,-2,0.3])church=church.subtract(niche(0,0,5.1,1.65,1.8).rotate([0,0,90]).translate([-43.0,y,0]));
church=church.subtract(Manifold.cylinder(1.5,2.5,2.5,32).rotate([0,90,0]).translate([-41.6,-2,15]));
// Ramen op de rondingen, als blinde nissen van circa 0,6 m diep.
for(const [cx,cy,r,angles] of [[22.7,-2,7.8,[-45,0,45]],[2.5,-16.8,5.3,[225,270,315]],[2.5,13.2,5.3,[45,90,135]]]){
 for(const ang of angles){
  let rad=ang*Math.PI/180,x=cx+(r-.55)*Math.cos(rad),y=cy+(r-.55)*Math.sin(rad);
  church=church.subtract(niche(0,0,3,1.6,5.5).rotate([0,0,ang+90]).translate([x,y,0]));
  church=church.subtract(niche(0,0,10,1.25,4).rotate([0,0,ang+90]).translate([x,y,0]));
 }
}
// Torengeledingen: nissen op elke vrije zijde van de achtkantige schacht.
for(const cy of [-9.5,5.5])for(let a=0;a<8;a++){
 let ang=a*45,rad=ang*Math.PI/180,x=-37.5+2.75*Math.cos(rad),y=cy+2.75*Math.sin(rad);
 church=church.subtract(niche(0,0,29.5,1.35,7.8).rotate([0,0,ang+90]).translate([x,y,0]));
}
// Drie hoge vensters onder de koepel op de vrije achtkantvlakken.
for(let a=0;a<8;a++){const ang=a*45,rad=ang*Math.PI/180,x=1+8.9*Math.cos(rad),y=-2+8.9*Math.sin(rad);church=church.subtract(niche(0,0,24.0,1.8,6.6).rotate([0,0,ang+90]).translate([x,y,0]));}
for(let a=0;a<8;a++){let ang=a*45,rad=ang*Math.PI/180;let c=Manifold.cylinder(1.3,1.1,1.1,20).rotate([0,90,0]).rotate([0,0,ang]).translate([1+8.9*Math.cos(rad),-2+8.9*Math.sin(rad),33.0]);church=church.subtract(c)}
const parts=[['building:kerk',church]];
const META={name:"Sint-Petrus Stoel van Antiochi\u00ebkerk Uden",origin:ORIGIN,xAxis:X_AXIS,groundHeight:16.496,groundOffsetMetres:BASE,replacesBuildings:['NL.IMBAG.Pand.0856100000342681'],description:'Koepelkerk met twee achthoekige westtorens, drie ronde sluitingen en sacristie.',realWorld:{groundNapM:16.496,ahn4TopNapM:75.9365,ahnDomeHeightM:47.9},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0856100000342681','https://commons.wikimedia.org/wiki/Category:St._Petrus_Stoel_te_Antiochi%C3%AB,_Uden','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://www.parochiesintpetrus.nl/actueel/rondleidingen-in-de-kerk/']};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-sint-petrus-stoel-van-antiochiekerk-uden.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
console.log(pieces.map(p=>p.boundingBox())); if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));















