import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="hervormde-gemeente-waardenburg-neerijnen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: +X langs de nok van het schip naar het oosten (22,1 graden boven RD-oost, gemeten langs de
// BAG-gevels), +Y naar de noordzijde, oorsprong op de as van het schip, Z = 0 op het maaiveld (NAP +4,6 m, AHN-DTM).
const BASE=-.5,ORIGIN=[147552,427024],X_AXIS=[.9266,.3761],GROUND_NAP=4.6;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zadeldak: nok langs X (vc = Y van de nok) of langs Y (uc = X van de nok), helling 45 graden (AHN-DSM).
const roofX=(s,vc,ridge,k=1)=>plane(plane(s,0,k,ridge-k*vc),0,-k,ridge+k*vc);
const roofY=(s,uc,ridge,k=1)=>plane(plane(s,k,0,ridge-k*uc),-k,0,ridge+k*uc);

// Hoofdmaten: BAG-contour in het gebouwstelsel, hoogtes uit AHN-DSM 0,5 m en foto's.
const NAVE={u0:-11.15,u1:11.87,v0:-5.84,v1:4.51},NC=(NAVE.v0+NAVE.v1)/2,RIDGE=13.95;   // nok NAP +18,55 (3DBAG/AHN)
const TR={u0:-1.93,u1:8.39,v0:-8.82,v1:7.52},TC=(TR.u0+TR.u1)/2;                      // dwarsschip, nok even hoog
const EAST={u0:11.87,u1:17.85,v0:-4.2,v1:4.41},EAST_RIDGE=8.6,EC=14.86;               // oostbouw met dwarse nok
const EAVE=RIDGE-(NAVE.v1-NAVE.v0)/2;                                                    // goot circa 8,8 m
const TW={u0:-12.3,u1:-8.1,v0:-2.85,v1:1.45};                                            // toren, eerste geleding
const T1=15.8,T2=21.2,CROWN=22.4,SPIRE_BASE=21.8,TOP=30;                                 // AHN-top NAP +33,9

const nave=roofX(box(NAVE.u0,NAVE.u1,NAVE.v0,NAVE.v1,BASE,40),NC,RIDGE);
const transept=roofY(box(TR.u0,TR.u1,TR.v0,TR.v1,BASE,40),TC,RIDGE);
const east=roofY(box(EAST.u0,EAST.u1,EAST.v0,EAST.v1,BASE,30),EC,EAST_RIDGE);
// Lage aanbouwen: consistorie aan de noordzijde en een portaal aan de zuidzijde, plat op circa 3,1 m.
const annexN=box(8.33,17.04,4.4,6.77,BASE,3.1),annexS=box(8.39,11.01,-7.84,-5.8,BASE,3.1);
// Borstwering langs de goten (in het echt opengewerkt; dicht om printbaar te blijven).
const P=.6,PT=EAVE+.9;
const parapets=[box(NAVE.u0,NAVE.u1,NAVE.v0,NAVE.v0+P,BASE,PT),box(NAVE.u0,NAVE.u1,NAVE.v1-P,NAVE.v1,BASE,PT),
  box(TR.u0,TR.u0+P,TR.v0,TR.v1,BASE,PT),box(TR.u1-P,TR.u1,TR.v0,TR.v1,BASE,PT)];
// Toren: vierkante onderbouw, smallere klokkenverdieping met wimbergen op elke zijde en achtzijdige naaldspits.
const tu=(TW.u0+TW.u1)/2,tv=(TW.v0+TW.v1)/2,H2=1.5;
const shaft=box(TW.u0,TW.u1,TW.v0,TW.v1,BASE,T1);
const belfry=box(tu-H2,tu+H2,tv-H2,tv+H2,T1-.1,T2);
const k=(CROWN-T2)/H2,crownBox=()=>box(tu-H2,tu+H2,tv-H2,tv+H2,T2-.1,CROWN+1);
const crown=Manifold.union([roofX(crownBox(),tv,CROWN,k),roofY(crownBox(),tu,CROWN,k)]);
const oct=(r,z)=>Array.from({length:8},(_,i)=>[tu+r*Math.cos(Math.PI/8+i*Math.PI/4),tv+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const spire=Manifold.hull([...oct(1.4,SPIRE_BASE),...oct(.49,TOP)]);
// Pinakels: vierkante schacht van 0,9 m met piramidekap op de hoeken van gevels, dwarsschip en toren.
const pin=(u,v,z0,top,w=.9)=>{const h=w/2,t=.15,zc=top-1.6;return Manifold.union([box(u-h,u+h,v-h,v+h,z0,zc),Manifold.hull([[u-h,v-h,zc-.01],[u+h,v-h,zc-.01],[u+h,v+h,zc-.01],[u-h,v+h,zc-.01],[u-t,v-t,top],[u+t,v-t,top],[u+t,v+t,top],[u-t,v+t,top]])])};
const PIN=EAVE+2.6,pins=[];
for(const [u,v] of [[NAVE.u0,NAVE.v0],[NAVE.u0,NAVE.v1],[NAVE.u1,NAVE.v0],[NAVE.u1,NAVE.v1],[TR.u0,TR.v0],[TR.u1,TR.v0],[TR.u0,TR.v1],[TR.u1,TR.v1]])pins.push(pin(u,v,BASE,PIN));
for(const [u,v] of [[EAST.u1,EAST.v0],[EAST.u1,EAST.v1]])pins.push(pin(u,v,BASE,EAST_RIDGE-1));
for(const [u,v,ridge] of [[TC,TR.v0+.45,RIDGE],[TC,TR.v1-.45,RIDGE],[NAVE.u1-.45,NC,RIDGE],[EC,EAST.v0+.45,EAST_RIDGE],[EC,EAST.v1-.45,EAST_RIDGE]])pins.push(pin(u,v,ridge-1.2,ridge+1.9));
for(const [u,v] of [[TW.u0,TW.v0],[TW.u0,TW.v1]])pins.push(pin(u,v,BASE,T1+2.2));
for(const [u,v] of [[TW.u1,TW.v0],[TW.u1,TW.v1]])pins.push(pin(u,v,10,T1+2.2));
let church=Manifold.union([nave,transept,east,annexN,annexS,...parapets,shaft,belfry,crown,spire,...pins]);

// Vensters, deuren en ronde vensters als blinde nissen (spitse top van circa 52 graden, rond venster met spitse top).
const D=.35,O=.3;
const arch=(w,z0,z1)=>{const r=.65*w;return[[-w/2,z0],[w/2,z0],[w/2,z1-r],[0,z1],[-w/2,z1-r]]};
const round=(r,zc)=>{const p=[];for(let i=0;i<=12;i++){const a=Math.PI/4-i*Math.PI*1.5/12;p.push([r*Math.cos(a),zc+r*Math.sin(a)])}p.push([0,zc+r*Math.SQRT2]);return p};
// Nis in een gevel evenwijdig aan X (wand op v = wall) of aan Y (wand op u = wall); side = buitenzijde.
const cutV=(prof,u,wall,side)=>{const hi=side>0?wall+O:wall+D;return prism(prof,0,D+O).rotate([90,0,0]).translate([u,hi,0])};
const cutU=(prof,v,wall,side)=>{const lo=side>0?wall-D:wall-O;return prism(prof,0,D+O).rotate([90,0,0]).rotate([0,0,90]).translate([lo,v,0])};
const cuts=[];
for(const s of [-1,1]){const wall=s>0?NAVE.v1:NAVE.v0;for(const u of [-9.4,-6.6,-3.9])cuts.push(cutV(arch(1.3,2.6,7.2),u,wall,s));}
for(const s of [-1,1]){const wall=s>0?TR.v1:TR.v0;cuts.push(cutV(arch(2.8,3.2,8.4),TC,wall,s),cutV(arch(1.6,BASE,2.8),TC,wall,s),cutV(round(.8,10.2),TC,wall,s));}
for(const v of [NAVE.v0+1.6,NAVE.v1-1.6])cuts.push(cutU(arch(1.3,2.4,6.8),v,NAVE.u0,-1));
cuts.push(cutU(arch(1.6,BASE,3),tv,TW.u0,-1),cutU(arch(1.3,4.4,9.2),tv,TW.u0,-1),cutU(round(.65,11.4),tv,TW.u0,-1));
for(const s of [-1,1]){cuts.push(cutV(arch(.95,16.6,19.6),tu,tv+s*H2,s),cutV(round(.45,20.3),tu,tv+s*H2,s),cutU(arch(.95,16.6,19.6),tv,tu+s*H2,s),cutU(round(.45,20.3),tv,tu+s*H2,s));}
for(const u of [13.6,16.1])cuts.push(cutV(arch(1.1,1.8,5.6),u,EAST.v0,-1));
cuts.push(cutV(arch(1.1,1.8,5.6),EC,EAST.v1,1));
for(const v of [-2,2.2])cuts.push(cutU(arch(1.1,1.8,5.2),v,EAST.u1,1));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Hervormde kerk Neerijnen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0304100000004453"],description:"Neogotische kruiskerk (A.M.A. Gulden, 1865) met westtoren van twee geledingen en naaldspits, lage oostbouw en aanbouwen; as langs de BAG-gevels, hoogtes uit AHN en foto's.",realWorld:{groundNapM:GROUND_NAP,ridgeM:RIDGE,eaveM:+EAVE.toFixed(2),towerTopM:TOP,lengthM:+(EAST.u1-TW.u0).toFixed(2),transeptWidthM:+(TR.v1-TR.v0).toFixed(2)},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/30371","https://reliwiki.nl/index.php?curid=13110","https://www.wikidata.org/wiki/Q17437114","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Neerijnen","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0304100000004453","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://www.openstreetmap.org/way/273714185"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-hervormde-gemeente-waardenburg-neerijnen.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));


