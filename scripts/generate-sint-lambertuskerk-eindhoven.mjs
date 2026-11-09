import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="sint-lambertuskerk-eindhoven";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel (u, v): u langs de kerkas (161 graden in RD, gemeten aan de nokken van schip en koor) naar de toren aan
// de Hoogstraat, v 90 graden linksom (noordzijde van het schip, richting pastorie). Het hart van de viering ligt op u = 2,6;
// het model wordt aan het eind daarheen verschoven. Hoogtes boven maaiveld NAP +18,70 m.
const BASE=-.5,GROUND=18.7,CROSS_U=2.6,ORIGIN=[160324.54,381796.85],X_AXIS=[-.9455,.3256];
const area=p=>p.reduce((a,q,i)=>{const r=p[(i+1)%p.length];return a+q[0]*r[1]-r[0]*q[1]},0)/2;
const ccw=p=>area(p)<0?[...p].reverse():p;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const ngon=(n,apothem,cx=0,cy=0,phase=0)=>{const r=apothem/Math.cos(Math.PI/n);return Array.from({length:n},(_,k)=>{const a=phase+Math.PI/n+2*Math.PI*k/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]})};
const ring=(n,apothem,z,cx=0,cy=0,phase=0)=>ngon(n,apothem,cx,cy,phase).map(([x,y])=>[x,y,z]);
// Dakvlakken: per gootlijn (rand i van een linksom polygoon) een vlak dat met helling `slope` naar binnen oploopt.
const roofed=(poly,eave,slope,edges=poly.map((_,i)=>i),top=70)=>{
  if(area(poly)<=0)throw new Error("polygoon moet linksom zijn");
  let s=prism(poly,BASE,top);
  for(const i of edges){const[p,q]=[poly[i],poly[(i+1)%poly.length]],L=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=-(q[1]-p[1])/L,ny=(q[0]-p[0])/L;s=plane(s,slope*nx,slope*ny,eave-slope*(nx*p[0]+ny*p[1]))}
  return s;
};
const mirrorV=p=>[...p].map(([u,v])=>[u,-v]).reverse();
const spire=(n,apothem,z0,z1,cx,cy,phase=0)=>Manifold.hull([...ring(n,apothem,z0,cx,cy,phase),[cx,cy,z1]]);

// Hoofdkap van schip en eerste koortravee: zadeldak (goot 16,95 m, nok 26,2 m, 53,7 graden) van de toren tot u = -12,6,
// daar een topgevel boven het lagere koordak.
const NAVE_W=6.8,RIDGE=26.2,SLOPE=1.36,NAVE_EAVE=RIDGE-SLOPE*NAVE_W;
const nave=roofed([[-12.6,-NAVE_W],[26.0,-NAVE_W],[26.0,NAVE_W],[-12.6,NAVE_W]],NAVE_EAVE,SLOPE,[0,2]);
// Dwarsschip: zelfde nok en helling, nok op u = 2,6, schilden van 64 graden boven de topgevels met twee lancetten.
const TR_HALF=6.2,TR_END=17.95,TR_EAVE=RIDGE-SLOPE*TR_HALF,HIP=2.1;
const transept=roofed([[CROSS_U-TR_HALF,-TR_END],[CROSS_U+TR_HALF,-TR_END],[CROSS_U+TR_HALF,TR_END],[CROSS_U-TR_HALF,TR_END]],TR_EAVE,SLOPE,[1,3]);
const transeptHipped=plane(plane(transept,0,HIP,TR_EAVE+HIP*TR_END),0,-HIP,TR_EAVE+HIP*TR_END);

// Zijbeuken van het schip, sprongsgewijs breder vanaf de toren (BAG): een ingangstravee met lessenaarsdak, de middelste
// beuk met een asymmetrisch zadeldak (nok 15,3 m op 2,8 m van de schipmuur) en tegen het dwarsschip een recht gesloten zijkapel.
const aisle=(side)=>{
  const f=side>0?(p=>p):mirrorV;
  const o=side>0?{s1:[21.6,25.9,9.9],s2:[CROSS_U+TR_HALF,21.6,13.3],ch:[CROSS_U+TR_HALF,13.1,16.6]}:{s1:[21.3,25.7,10.5],s2:[CROSS_U+TR_HALF,21.3,13.8],ch:[CROSS_U+TR_HALF,12.8,16.9]};
  const rect=(u0,u1,v0,v1)=>f([[u0,v0],[u1,v0],[u1,v1],[u0,v1]]);
  // Mirrored polygons keep their counterclockwise order; edge 0 is then the outer wall and edge 2 the inner wall.
  const pick=(n)=>side>0?n:(n+2)%4;
  const [a0,a1,aw]=o.s1;const s1=roofed(rect(a0,a1,NAVE_W-.01,aw),13.0-.77*(aw-NAVE_W),.77,[pick(2)]);
  const [b0,b1,bw]=o.s2,RV=9.6,RZ=15.3;
  let s2=roofed(rect(b0,b1,NAVE_W-.01,bw),RZ-1.27*(bw-RV),1.27,[pick(2)]);
  s2=plane(s2,0,side*.8,RZ-.8*RV);
  // Zijkapel: lessenaarsdak van 11,2 naar 9,4 m met een schild aan de westzijde (rand 1 in beide spiegelingen).
  const [c0,c1,cw]=o.ch;const ch=plane(roofed(rect(c0,c1,bw-.01,cw),9.4,.55,[pick(2)]),-1.0,0,9.4+c1);
  // Steunbeer (1,3 x 1,9 m, BAG) midden op de buitenmuur van de middelste beuk, bovenkant 45 graden naar buiten.
  const buttress=side>0?plane(box(15.9,17.2,bw-.01,bw+1.9,BASE,8.6),0,-1,8.6+bw):plane(box(15.9,17.2,-bw-1.9,-bw+.01,BASE,8.6),0,1,8.6+bw);
  return [s1,s2,ch,buttress];
};

// Lagere bouwdelen ten oosten van het dwarsschip: per zijde een blok met lessenaarsdak (14,8 naar 10,2 m) en daarin de
// driezijdig gesloten koorkapel met een eigen steil schilddak (goot 10,2 m, nok 14,3 m, AHN 14 m).
const eastBlock=(side)=>{
  const P=side>0?[[-16.9,NAVE_W],[CROSS_U-TR_HALF+.01,NAVE_W],[CROSS_U-TR_HALF+.01,16.8],[-16.9,16.8],[-18.3,13.4],[-16.9,10.0]]
                :[[-17.2,-9.6],[-18.6,-12.9],[-17.3,-16.6],[CROSS_U-TR_HALF+.01,-16.6],[CROSS_U-TR_HALF+.01,-NAVE_W],[-17.2,-NAVE_W]];
  const outer=side>0?16.8:16.6,eave=10.2,sl=(14.8-eave)/(outer-NAVE_W);
  let s=prism(P,BASE,70);
  s=plane(s,0,-side*sl,eave+sl*outer);
  const hips=side>0?[3,4]:[0,1];
  for(const i of hips){const[p,q]=[P[i],P[(i+1)%P.length]],L=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=-(q[1]-p[1])/L,ny=(q[0]-p[0])/L;s=plane(s,nx,ny,eave-(nx*p[0]+ny*p[1]))}
  const C=side>0?[[-16.9,10.0],[-12.0,10.0],[-12.0,16.8],[-16.9,16.8],[-18.3,13.4]]:[[-17.2,-9.6],[-18.6,-12.9],[-17.3,-16.6],[-12.0,-16.6],[-12.0,-9.6]];
  return s.add(roofed(C,eave,1.2));
};

// Koor: hoge koorwanden op |v| = 5,5 (goot 17,0 m, nok 23,6 m) met achtzijdige sluiting, en een lage omgang (goot 8,6 m)
// rond de sluiting tot de BAG-rand; aan de zuidzijde een traptorentje.
const CH_W=5.5,CH_C=-17.8,CH_EAVE=17.0,CH_SLOPE=(23.6-CH_EAVE)/CH_W;
const choirPoly=[[CH_C-CH_W,-2.28],[CH_C-2.28,-CH_W],[-12.6,-CH_W],[-12.6,CH_W],[CH_C-2.28,CH_W],[CH_C-CH_W,2.28]];
const choir=roofed(choirPoly,CH_EAVE,CH_SLOPE,[0,1,3,4,5]);
const ambPoly=[[-25.4,-3.0],[-21.1,-7.3],[-12.6,-7.3],[-12.6,7.3],[-21.1,7.3],[-25.4,3.0]];
const ambulatory=roofed(ambPoly,8.6,1.0,[0,1,3,4,5],13);
const stair=prism(ngon(8,1.3,-22.6,-6.6),BASE,10.6).add(spire(8,1.3,10.6,13.4,-22.6,-6.6));

// Dakruiter op de overgang van hoofdkap naar koordak (Reliwiki: "hoge dakruiter op het koor"): vierkante schacht,
// achtkantige klokkenstoel en naaldspits; maten geschat op de foto van de RCE (1960).
const RU=-13.2;
const ridgeTurret=box(RU-1.2,RU+1.2,-1.2,1.2,20.5,28.8)
  .add(prism(ngon(8,1.2,RU,0),28.7,31.6))
  .add(spire(8,1.2,31.6,43.0,RU,0));

// Toren: vierkante schacht van 8,6 m tot 36,3 m, vier hoekpinakels tot 42,6 m, lage achtkantige lantaarn tot 40,5 m en
// leien naaldspits tot 60,8 m (AHN 60,1 m op 0,5 m raster). Steunberen op de voorhoeken, polygonale aanbouwen aan beide zijden.
const T0=25.4,T1=34.0,TV0=-4.9,TV1=3.7,TC=[(T0+T1)/2,(TV0+TV1)/2],T_TOP=36.3,LANT_TOP=40.5,SPIRE_TOP=60.8,LANT=3.2;
const tower=box(T0,T1,TV0,TV1,BASE,T_TOP);
const pinnacles=[[T0+.75,TV0+.75],[T1-.75,TV0+.75],[T1-.75,TV1-.75],[T0+.75,TV1-.75]].map(([x,y])=>prism(ngon(8,.65,x,y),T_TOP-.1,39.0).add(spire(8,.65,39.0,42.6,x,y)));
const lantern=prism(ngon(8,LANT,...TC),T_TOP-.1,LANT_TOP);
const towerSpire=spire(8,LANT,LANT_TOP,SPIRE_TOP,...TC);
const towerButtresses=[plane(box(T1-1.4,34.2,TV1-.01,5.0,BASE,20.0),0,-1,20.0+TV1),plane(box(T1-1.4,34.2,-5.8,TV0+.01,BASE,20.0),0,1,20.0-TV0)];
// Wimperg op de zuidzijde van de toren boven het zijportaal (foto's): vlakke gevel van 0,4 m met een spitse top (52 graden).
const wimperg=prism([[26.5,0],[32.7,0],[32.7,15.5],[29.6,19.5],[26.5,15.5]],0,.41).rotate([90,0,0]).translate([0,TV0+.01,0]);
const annexS=roofed([[25.7,-7.2],[26.6,-7.8],[27.4,-7.3],[28.7,-8.6],[30.7,-8.6],[32.0,-7.3],[32.0,TV0+.01],[25.7,TV0+.01]],6.5,1.2,[0,1,2,3,4,5],10);
const annexN=roofed([[25.9,TV1-.01],[32.1,TV1-.01],[32.1,6.6],[30.8,8.0],[28.8,8.0],[27.6,6.7],[26.8,7.2],[25.9,6.6]],6.5,1.2,[1,2,3,4,5,6],10);

// Steunberen voor de topgevels van het dwarsschip (BAG: drie per gevel, 0,9 m breed, 0,65 m diep).
const trButtress=(u,side)=>{const b=box(u-.45,u+.45,TR_END-.01,TR_END+.65,BASE,12.0);const t=plane(b,0,-1.0,12.0+TR_END);return side>0?t:t.mirror([0,1,0])};
const trButtresses=[-3.15,2.5,7.95].flatMap(u=>[trButtress(u,1),trButtress(u,-1)]);

// Dakkapelletjes (1,1 m breed) op hoofdkap en dwarsschip, posities van de luchtfoto.
const dormer=(cu,side,axis="u")=>{
  // Voorgevel op 4,6 m van de nok (dakvlak daar 19,9 m), goot 21,0 m, zadeldakje tot 21,66 m; de achterkant zit in het dak.
  let d=plane(plane(box(-.55,.55,2.8,4.6,18.5,23),-1.2,0,21.66),1.2,0,21.66);
  if(side<0)d=d.mirror([0,1,0]);
  return axis==="u"?d.translate([cu,0,0]):d.rotate([0,0,-90]).translate([CROSS_U,cu,0]);
};
const dormers=[13.8,20.5,-7.6].flatMap(u=>[dormer(u,1),dormer(u,-1)]).concat([dormer(10.0,1,"v"),dormer(10.0,-1,"v"),dormer(-10.0,1,"v"),dormer(-10.0,-1,"v")]);

let church=Manifold.union([nave,transeptHipped,...aisle(1),...aisle(-1),eastBlock(1),eastBlock(-1),choir,ambulatory,stair,ridgeTurret,
  tower,...pinnacles,lantern,towerSpire,...towerButtresses,wimperg,annexS,annexN,...trButtresses,...dormers]);

// Blinde vensternissen (0,35 m) met spitse boog (top >= 55 graden).
const niche=(w,h,depth=.35)=>{const r=w/2*Math.tan(55*Math.PI/180);return prism([[-w/2,0],[w/2,0],[w/2,h-r],[0,h],[-w/2,h-r]],0,depth+1).rotate([90,0,0]).translate([0,1,0])};
const cuts=[];
const onFace=(phi,px,py,s,z,w,h,depth)=>cuts.push(niche(w,h,depth).translate([s,0,z]).rotate([0,0,phi-90]).translate([px,py,0]));
for(const side of [1,-1]){
  const N=side>0?90:270;
  // Topgevels van het dwarsschip: twee lancetten tussen de steunberen.
  for(const u of [-.35,5.2])onFace(N,u,side*TR_END,0,3.5,2.0,10.5);
  // Zijbeuken, zijkapellen en oostelijke blokken.
  const w2=side>0?13.3:13.8,w1=side>0?9.9:10.5,wc=side>0?16.6:16.9,we=side>0?16.8:16.6;
  for(const u of [14.4,19.2])onFace(N,u,side*w2,0,2.8,1.4,5.0);
  onFace(N,23.7,side*w1,0,2.8,1.3,5.0);
  onFace(N,10.9,side*wc,0,2.5,1.4,4.6);
  for(const u of [-6.0,-10.0,-14.0])onFace(N,u,side*we,0,2.8,1.4,5.0);
  // Lichtbeuk boven de zijbeukdaken en hoge koorwanden boven de omgang.
  for(const u of [11.2,15.2,19.4,23.4])onFace(N,u,side*NAVE_W,0,13.6,1.1,2.8);
  onFace(N,-19.0,side*CH_W,0,11.0,1.3,5.2);
  // Torenzijden boven de aanbouwen: galmgaten en een venster.
  for(const s of [-1.6,1.6])onFace(N,TC[0]+s,side>0?TV1:TV0,0,24.0,1.1,9.5);
  if(side>0)onFace(N,TC[0],side>0?TV1:TV0,0,14.5,1.8,6.0);
}
// Hoge koorsluiting: drie lancetten, en lage vensters in de omgang.
for(const[p,q]of [[choirPoly[5],choirPoly[0]],[choirPoly[0],choirPoly[1]],[choirPoly[4],choirPoly[5]]]){const phi=Math.atan2(-(q[0]-p[0]),q[1]-p[1])*180/Math.PI;onFace(phi,(p[0]+q[0])/2,(p[1]+q[1])/2,0,11.0,1.3,5.2)}
for(const[p,q]of [[ambPoly[5],ambPoly[0]],[ambPoly[0],ambPoly[1]],[ambPoly[4],ambPoly[5]]]){const phi=Math.atan2(-(q[0]-p[0]),q[1]-p[1])*180/Math.PI;onFace(phi,(p[0]+q[0])/2,(p[1]+q[1])/2,0,2.6,1.2,4.2)}
// Toren: galmgaten aan voor- en achterzijde (achter boven het schipdak), het grote westvenster en een nis in de wimperg.
for(const s of [-1.6,1.6]){onFace(0,T1,TC[1]-s,0,24.0,1.1,9.5);onFace(180,T0,TC[1]+s,0,27.2,1.1,6.3)}
onFace(0,T1,TC[1],0,4.5,2.4,8.5);
onFace(270,29.6,TV0-.4,0,12.0,1.6,4.6);
church=church.subtract(Manifold.union(cuts));
church=church.translate([-CROSS_U,0,0]);
const parts=[["building:kerk",church]];

const META={name:"Sint-Lambertuskerk Eindhoven",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0772100000271465"],description:"Neogotische kruisbasiliek in Gestel (Wolter te Riele, 1910-11): ingangstoren met hoekpinakels en achtkantige spits, schip en dwarsschip onder één nok, koor met achtzijdige sluiting en dakruiter, trapsgewijs bredere zijbeuken en kapellen; oorsprong in het hart van de viering, X naar de toren aan de Hoogstraat.",realWorld:{groundNapM:GROUND,ridgeM:RIDGE,naveEaveM:+NAVE_EAVE.toFixed(2),choirRidgeM:23.6,towerShaftM:T_TOP,towerSpireM:SPIRE_TOP,ahnTowerTopM:60.1,ridgeTurretM:43.0},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000271465","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/356432","https://nl.wikipedia.org/wiki/Sint-Lambertuskerk_(Eindhoven)","https://reliwiki.nl/index.php/Eindhoven,_Hoogstraat_299_-_Lambertus","https://commons.wikimedia.org/wiki/Category:Sint_Lambertuskerk,_Eindhoven"]};
function toStl(solid,label,mmPerMetre){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return b;
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:`NederPrint generate-${slug}.mjs`},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printFiles=[100,1000].map(s=>`${slug}-1-${s}.stl`);
await writeFile(path.join(outDir,glb),toGlb(parts));
const printSolid=church.translate([0,0,-BASE]);
for(const s of [100,1000])await writeFile(path.join(outDir,`${slug}-1-${s}.stl`),toStl(printSolid,`NederPrint ${META.name} 1:${s} mm Z-up`,1000/s));
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
