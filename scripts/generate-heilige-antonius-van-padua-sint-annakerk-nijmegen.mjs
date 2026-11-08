import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="heilige-antonius-van-padua-sint-annakerk-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: x langs de kerkas van de voorgevel (Groenestraat, noord) naar het koor (zuid), y naar het oosten.
// De as ligt 7,5 graden van het noorden (nokken van schip en dwarsschip in het AHN); oorsprong op de as in de voorgevel.
const BASE=-.5,ORIGIN=[186741.73,427039.77],X_AXIS=[-.1305,-.9914],GROUND_NAP=23.47;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const rect=(x0,x1,y0,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const box=(x0,x1,y0,y1,z0,z1)=>prism(rect(x0,x1,y0,y1),z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zadeldak met de nok evenwijdig aan x (op y=cy) of aan y (op x=cx): z = nok - helling * afstand tot de nok.
const gableAlongX=(p,cy,ridge,slope)=>plane(plane(prism(p,BASE,ridge+1),0,-slope,ridge+slope*cy),0,slope,ridge-slope*cy);
const gableAlongY=(p,cx,ridge,slope)=>plane(plane(prism(p,BASE,ridge+1),-slope,0,ridge+slope*cx),slope,0,ridge-slope*cx);
const oct=(r,z,cx=0,cy=0)=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4,R=r/Math.cos(Math.PI/8);return[cx+R*Math.cos(a),cy+R*Math.sin(a),z]});
const spire=(cx,cy,z0,r0,z1,r1)=>Manifold.hull([...oct(r0,z0,cx,cy),...oct(r1,z1,cx,cy)]);
const pyramidCap=(x0,x1,y0,y1,z0,z1)=>Manifold.hull([[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[(x0+x1)/2,(y0+y1)/2,z1]]);
const pinnacle=(cx,cy,z0,z1,top,w=1)=>Manifold.union([box(cx-w/2,cx+w/2,cy-w/2,cy+w/2,z0,z1),pyramidCap(cx-w/2,cx+w/2,cy-w/2,cy+w/2,z1,top)]);

// Maten (m boven maaiveld NAP +23,47) uit het AHN-DSM 0,5 m in dit stelsel; zie README.
const NAVE_HALF=5.5,EAVE=17.6,RIDGE=24.3,SLOPE=(24.3-17.6)/5.5; // schip en koor: 11 m breed, dak circa 50 graden
const TRANSEPT=[29.6,41],TRANSEPT_HALF=15.35,CROSS_X=35.3;
const parts=[];
// Schip met koor tot de apsis, dwarsschip met dezelfde nok.
parts.push(gableAlongX(rect(-.3,46,-NAVE_HALF,NAVE_HALF),0,RIDGE,SLOPE));
parts.push(gableAlongY(rect(TRANSEPT[0],TRANSEPT[1],-TRANSEPT_HALF,TRANSEPT_HALF),CROSS_X,RIDGE,SLOPE));
// Driezijdige apsis (achtkant, binnenstraal 5,5 m) met steiler kegeldak tot het nokeinde.
const APSE_C=46,APSE_EAVE=16.5,t=NAVE_HALF*Math.tan(Math.PI/8);
const apsePoly=[[APSE_C,-NAVE_HALF],[APSE_C+t,-NAVE_HALF],[APSE_C+NAVE_HALF,-t],[APSE_C+NAVE_HALF,t],[APSE_C+t,NAVE_HALF],[APSE_C,NAVE_HALF]];
parts.push(prism(apsePoly,BASE,APSE_EAVE));
parts.push(Manifold.hull([...apsePoly.map(([x,y])=>[x,y,APSE_EAVE-.05]),[APSE_C,0,RIDGE]]));
for(const [x,y] of [[APSE_C+t,-NAVE_HALF],[APSE_C+NAVE_HALF,-t],[APSE_C+NAVE_HALF,t],[APSE_C+t,NAVE_HALF]]){
  const a=Math.atan2(y,x-APSE_C)*180/Math.PI;
  parts.push(Manifold.hull([[-.6,-.45,BASE],[1.1,-.45,BASE],[1.1,.45,BASE],[-.6,.45,BASE],[-.6,-.45,11.5],[-.6,.45,11.5],[1.1,-.45,9.8],[1.1,.45,9.8]]).rotate([0,0,a]).translate([x,y,0]));
}
// Zijbeuken met lessenaarsdak (9,0 aan de buitenmuur, 12,3 tegen het schip), steunberen met pinakels tussen de traveeën.
const aisle=(y0,y1,s)=>plane(prism(rect(10.5,TRANSEPT[0],y0,y1),BASE,13),0,s*.66,12.3+.66*NAVE_HALF);
parts.push(aisle(-10.5,-NAVE_HALF,1),aisle(NAVE_HALF,10.5,-1));
for(const x of [15,20,25])for(const s of [-1,1]){
  const yi=s*10.5,yo=s*11.5;
  parts.push(Manifold.hull([[x-.45,yi,BASE],[x+.45,yi,BASE],[x-.45,yo,BASE],[x+.45,yo,BASE],[x-.45,yi,9.6],[x+.45,yi,9.6],[x-.45,yo,8.6],[x+.45,yo,8.6]]));
  parts.push(pinnacle(x,s*10.3,8.5,13.2,15));
}
// Koorzijkapellen langs het koor, ook als lessenaarsdak.
parts.push(plane(prism(rect(TRANSEPT[1]-.2,46.5,-9.75,-NAVE_HALF),BASE,13),0,.68,12.4+.68*NAVE_HALF));
parts.push(plane(prism(rect(TRANSEPT[1]-.2,46,NAVE_HALF,10.05),BASE,13),0,-.68,12.4+.68*NAVE_HALF));
// Voorste traveeën naast de torens met een dwars zadeldak (nok 15,5 haaks op de as).
parts.push(gableAlongY(rect(4.6,10.5,-13.75,-NAVE_HALF+.1),7.55,15.5,1.46));
parts.push(gableAlongY(rect(5.1,10.5,NAVE_HALF-.1,11.75),7.8,15.5,1.46));
// Lage aanbouwen binnen hetzelfde BAG-pand.
parts.push(box(10.5,24.4,-13.25,-10.4,BASE,4.5)); // platte gang aan de westzijde
parts.push(plane(prism(rect(24.4,TRANSEPT[0]+.1,-14.75,-10.4),BASE,13),.5,0,9.5-.5*24.4)); // lessenaar tegen het dwarsschip
parts.push(box(10.5,27.8,10.4,19.05,BASE,7),Manifold.hull([[10.5,10.4,6.95],[27.8,10.4,6.95],[27.8,19.05,6.95],[10.5,19.05,6.95],[11.7,11.6,8.4],[26.6,11.6,8.4],[26.6,17.85,8.4],[11.7,17.85,8.4]])); // oostelijke aanbouw, afgeschuind plat dak
parts.push(box(14.7,20.3,19,21.25,BASE,5.5)); // uitbouw aan de oostgevel
parts.push(gableAlongY(rect(6.4,10.5,10.6,17.15),8.45,9,1.9)); // portaal oost
parts.push(box(TRANSEPT[1]-.2,49.7,-17.55,-9.7,BASE,8.9)); // sacristie west
parts.push(box(46.4,49.7,-9.8,-5.4,BASE,4.6)); // lage gang achter de koorkapel
parts.push(gableAlongY(rect(46,51.1,4.85,16.55),48.55,6.6,.8)); // lage vleugel achter het koor (oost)
parts.push(box(41.9,45.7,10,14.65,BASE,2.9)); // lage aanbouw oost van het koor
parts.push(box(50.9,63,5.65,8.75,BASE,3.6)); // gang naar het zuidelijke gebouw
// Topgevels van voorgevel en dwarsschip steken als borstwering 0,6 m boven het dak uit.
const gableWallX=(x0,x1,half,eave,ridge)=>prism([[x0,-half-.15],[x1,-half-.15],[x1,half+.15],[x0,half+.15]],BASE,ridge+1)
  .trimByPlane([0,-(ridge-eave)/half,-1].map((v,i,a)=>v/Math.hypot(...a)),-(ridge+.6)/Math.hypot(0,(ridge-eave)/half,1))
  .trimByPlane([0,(ridge-eave)/half,-1].map((v,i,a)=>v/Math.hypot(...a)),-(ridge+.6)/Math.hypot(0,(ridge-eave)/half,1));
parts.push(gableWallX(-.3,.6,NAVE_HALF,EAVE,RIDGE));
for(const [y0,y1] of [[-TRANSEPT_HALF,-TRANSEPT_HALF+.9],[TRANSEPT_HALF-.9,TRANSEPT_HALF]]){
  let w=prism(rect(TRANSEPT[0]-.15,TRANSEPT[1]+.15,y0,y1),BASE,RIDGE+1);
  w=plane(plane(w,-SLOPE,0,RIDGE+.6+SLOPE*CROSS_X),SLOPE,0,RIDGE+.6-SLOPE*CROSS_X);parts.push(w);
}
parts.push(box(-.3,.6,-.45,.45,RIDGE,RIDGE+2.2)); // kruis op de voorgevel (verbreed)
// Hoekpinakels aan voorgevel en dwarsschipgevels.
for(const s of [-1,1]){
  for(const x of [TRANSEPT[0]-.2,TRANSEPT[1]+.2])parts.push(pinnacle(x,s*(TRANSEPT_HALF+.1),BASE,18.5,20.5,1.2));
}
// Dakkapellen op schip en dwarsschip.
const dormer=(x,s)=>{let d=prism(rect(x-.6,x+.6,s>0?1:-3.7,s>0?3.7:-1),18,23);return plane(plane(d,-1.2,0,21.6+1.2*x),1.2,0,21.6-1.2*x)};
for(const x of [7,17,26])for(const s of [-1,1])parts.push(dormer(x,s));
// Dakruiter op de viering: achtkante lantaarn met naaldspits.
parts.push(spire(CROSS_X,0,22,1.05,27.6,1.05),spire(CROSS_X,0,27.5,1.05,36,.45));
// Hoge oosttoren: schacht 6,4 x 6,0 m, hoeksteunberen, wimbergen en pinakels rond de achtkante naaldspits tot 56 m (Wikipedia).
const T={x0:-1.3,x1:5.1,y0:4.75,y1:10.75},tcx=(T.x0+T.x1)/2,tcy=(T.y0+T.y1)/2,TOP=30.5;
parts.push(box(T.x0,T.x1,T.y0,T.y1,BASE,TOP));
for(const [x0,x1,y0,y1] of [[T.x0-1,T.x0,T.y1-1.2,T.y1],[T.x0,T.x0+1.2,T.y1,T.y1+1],[T.x0-1,T.x0,T.y0,T.y0+1.2],[T.x1-1.2,T.x1,T.y1,T.y1+1]])parts.push(box(x0,x1,y0,y1,BASE,20),pyramidCap(x0,x1,y0,y1,19.95,21.3));
for(const [x,y] of [[T.x0+.5,T.y0+.5],[T.x0+.5,T.y1-.5],[T.x1-.5,T.y0+.5],[T.x1-.5,T.y1-.5]])parts.push(spire(x,y,TOP-.1,.5,33.5,.5),spire(x,y,33.4,.5,35.2,.12));
for(const a of [0,90,180,270]){
  // wimberg: driehoekige topgevel op elke torenzijde, tegen de spits aan
  const w=Manifold.hull([[-1.5,0,TOP-.1],[1.5,0,TOP-.1],[0,0,33.6],[-1.5,2.4,TOP-.1],[1.5,2.4,TOP-.1],[0,2.4,33.6]]);
  const r=a*Math.PI/180,d=(a%180===0?(T.y1-T.y0):(T.x1-T.x0))/2;
  parts.push(w.translate([0,-d,0]).rotate([0,0,a]).translate([tcx,tcy,0]));
}
parts.push(spire(tcx,tcy,TOP-.1,2.55,54.4,.45),box(tcx-.45,tcx+.45,tcy-.45,tcy+.45,54,56));
// Lagere westtoren: vierkante schacht, achtkante klokkenverdieping met overgangsschilden, naaldspits.
const W={x0:-.3,x1:4.5,y0:-9.6,y1:-5},wcx=(W.x0+W.x1)/2,wcy=(W.y0+W.y1)/2;
parts.push(box(W.x0,W.x1,W.y0,W.y1,BASE,20.5));
parts.push(Manifold.hull([[W.x0,W.y0,20.45],[W.x1,W.y0,20.45],[W.x1,W.y1,20.45],[W.x0,W.y1,20.45],...oct(1.9,21.6,wcx,wcy)]));
parts.push(spire(wcx,wcy,21.5,1.9,24.6,1.9),spire(wcx,wcy,24.5,1.9,33,.45),box(wcx-.45,wcx+.45,wcy-.45,wcy+.45,32.6,34));
for(const [x,y] of [[W.x0+.45,W.y0+.45],[W.x0+.45,W.y1-.45],[W.x1-.45,W.y0+.45]])parts.push(pinnacle(x,y,20.4,22,23.4,.9));
let church=Manifold.union(parts);

// Gevelreliëf als blinde nissen van 0,35 m met spitse top (>= 50 graden).
const cuts=[];
// Nis in een gevel waarvan de buitenkant naar hoek a (graden, 0 = +x) wijst; diepte 0,35 m de muur in.
const pointedNiche=(w,z0,z1)=>{const h=w*.75;return Manifold.hull([[-w/2,-.05,z0],[w/2,-.05,z0],[-w/2,.35,z0],[w/2,.35,z0],[-w/2,-.05,z1],[w/2,-.05,z1],[-w/2,.35,z1],[w/2,.35,z1],[0,-.05,z1+h],[0,.35,z1+h]])};
const niche=(x,y,a,w,z0,z1)=>pointedNiche(w,z0,z1).rotate([0,0,a+90]).translate([x,y,0]);
const disc=(x,y,a,r,z)=>Manifold.cylinder(.4,r,r,48).rotate([-90,0,0]).translate([0,-.05,z]).rotate([0,0,a+90]).translate([x,y,0]);
const W_=-90,E_=90,N_=180,S_=0; // gevelrichtingen: west (-y), oost (+y), voorgevel (-x), achter (+x)
// Voorgevel: drie portalen, groot middenvenster met twee zijvensters.
for(const y of [-3,0,3])cuts.push(niche(-.3,y,N_,1.9,BASE,4.6));
cuts.push(niche(-.3,0,N_,3.2,7.5,14.5));for(const y of [-3.4,3.4])cuts.push(niche(-.3,y,N_,1.2,7.5,12.5));
// Oosttoren: deur, klok, galmgaten. Westtoren: vensters en galmgat.
cuts.push(niche(T.x0,tcy,N_,1.6,BASE,3.6));
for(const y of [tcy-1.1,tcy+1.1])cuts.push(niche(T.x0,y,N_,1,23.5,27.5));
for(const x of [tcx-1.1,tcx+1.1])cuts.push(niche(x,T.y1,E_,1,23.5,27.5));
cuts.push(disc(T.x0,tcy,N_,1.05,20.5),disc(tcx,T.y1,E_,1.05,20.5));
cuts.push(niche(W.x0,wcy,N_,1.1,8,12),niche(W.x0,wcy,N_,1.1,15,18.5),niche(wcx,W.y0,W_,1.1,15,18.5));
// Lichtbeuk en zijbeuken: per travee een venster (de oostelijke zijbeuk zit achter de aanbouw).
for(const x of [12.5,17.5,22.5,27.2]){
  cuts.push(niche(x,-NAVE_HALF,W_,1.5,13.2,15.8),niche(x,NAVE_HALF,E_,1.5,13.2,15.8));
  if(x<24)cuts.push(niche(x,-13.25,W_,1.2,1.5,3.2));
}
// Voorste traveeën: venster in de dwarse topgevel.
cuts.push(niche(7.55,-13.75,W_,1.8,3,9),niche(7.8,11.75,E_,1.8,3,9));
// Dwarsschipgevels: groot roosvenster boven een vensterpartij.
for(const [y,a] of [[-TRANSEPT_HALF,W_],[TRANSEPT_HALF,E_]]){
  cuts.push(disc(CROSS_X,y,a,2.6,13.5),niche(CROSS_X,y,a,4.2,3,8.6));
  for(const x of [TRANSEPT[0]+1.6,TRANSEPT[1]-1.6])cuts.push(niche(x,y,a,1.2,3,8));
}
// Apsisvensters in de drie zijden, koorvensters boven de koorkapellen.
for(const a of [-45,0,45]){const r=a*Math.PI/180;cuts.push(niche(APSE_C+NAVE_HALF*Math.cos(r),NAVE_HALF*Math.sin(r),a,1.4,4,11.5));}
for(const [y,a] of [[-NAVE_HALF,W_],[NAVE_HALF,E_]])cuts.push(niche(43.5,y,a,1.4,13,15.6));
church=church.subtract(Manifold.union(cuts));
church=church.trimByPlane([0,0,1],BASE);
const named=[["building:kerk",church]];
const META={name:"Heilige Antonius van Padua-Sint Annakerk (Groenestraatkerk), Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0268100000013467"],description:"Neogotische kruisbasiliek van Albert Margry (1909-1910) met twee ongelijke torens aan de Groenestraat; oorsprong op de kerkas in de voorgevel, x naar het koor (zuid).",realWorld:{groundNapM:GROUND_NAP,naveRidgeM:RIDGE,naveEaveM:EAVE,naveWidthM:2*NAVE_HALF,transeptLengthM:2*TRANSEPT_HALF,eastTowerM:56,westTowerM:34},sources:["https://nl.wikipedia.org/wiki/Groenestraatkerk","https://monumentenregister.cultureelerfgoed.nl/monumenten/524836","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000013467","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Groenestraatkerk_(Nijmegen)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:`NederPrint generate-${slug}.mjs`},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(named));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
