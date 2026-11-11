// Protestantse (Hervormde) kerk Blankenham, Kerkbuurt 9: eenbeukige zaalkerk van
// vijf traveeën met driezijdige koorsluiting, 1892 naar ontwerp van W. Duiks de Jong
// (eclectisch-neorenaissance). Schilddak over de koorsluiting, westgevel met
// hoeklisenen en een middenrisaliet die overgaat in een vierkant torentje met
// houten klokkenverdieping en achtzijdige leien spits. Rijksmonument 387546.
// Gebouwstelsel: u langs de nok (oost +), v naar het noorden; oorsprong RD
// (189456.97, 531036.05) midden in de zaal. Hoogtes in m t.o.v. maaiveld NAP +0,85 m.
// Voetafdruk uit BAG-pand 1708100000027665 (symmetrisch gemaakt), muurplaat, nok en
// dakhelling uit 3D BAG (LoD2.2) en AHN-DSM, torengeledingen en gevels uit foto's
// (RCE 20277084 t/m 20277087 en Commons).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="protestantse-kerk-blankenham";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const GROUND_NAP=.85,nap=z=>+(z-GROUND_NAP).toFixed(3);
const BASE=-.5,ORIGIN=[189456.97,531036.05],X_AXIS=[.98618,.16568];
// Zaal: BAG-muren op v = ±5,165, westgevel u = -10,52, koorsluiting met twee schuine
// zijden en een oostwand van 4,3 m.
const HW=5.165,U0=-10.52,UC=8.43,UE=11.42,VE=2.15;
const WALL=[[U0,-HW],[UC,-HW],[UE,-VE],[UE,VE],[UC,HW],[U0,HW]];
// Muurplaat (snijlijn dakvlak/muur) NAP +8,55, nok NAP +13,95: helling 1,045 (46 graden),
// gelijk voor het schild boven de koorsluiting. Overstek met goot 0,35 m.
const WALL_TOP=nap(8.55),RIDGE=nap(13.95),SLOPE=(RIDGE-WALL_TOP)/HW,EAVE_OUT=.35;
// Toren: middenrisaliet (3,2 m, 0,25 m voor de gevel) tot NAP +13,6, houten
// klokkenverdieping (2,9 m) met kroonlijst tot NAP +17,45, achtzijdige spits tot NAP +24,5.
const TOWER={uc:-9.0,half:1.6,front:U0-.25,belfry:1.45,cornice:1.85};
const T_BRICK=nap(13.6),T_CORNICE=nap(16.9),T_CORNICE_TOP=nap(17.45),SPIRE_TOP=nap(24.5),SPIRE_APOTHEM=1.1;

const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const hull=pts=>Manifold.hull(pts);
const ring=(poly,z)=>poly.map(([u,v])=>[u,v,z]);
const offset=(poly,d)=>new CrossSection([poly]).offset(d,"Miter").toPolygons()[0];
// Dakschilden: z = WALL_TOP + SLOPE * afstand binnen de muurlijn, voor elke muur behalve de westgevel.
const edges=[];for(let i=0;i<WALL.length;i++){const p=WALL[i],q=WALL[(i+1)%WALL.length];if(p[0]===U0&&q[0]===U0)continue;const d=[q[0]-p[0],q[1]-p[1]],l=Math.hypot(...d),n=[-d[1]/l,d[0]/l];edges.push({p,n});}
const roofed=(s,lift=0)=>{for(const {p,n} of edges)s=plane(s,SLOPE*n[0],SLOPE*n[1],WALL_TOP+lift-SLOPE*(n[0]*p[0]+n[1]*p[1]));return s};
const westClip=s=>s.intersect(box(U0,40,-40,40,-5,60));

// Muren, dak met overstek en een kraag van 45 graden onder de goot.
const walls=prism(WALL,BASE,WALL_TOP);
const outer=offset(WALL,EAVE_OUT),GUTTER=WALL_TOP-SLOPE*EAVE_OUT;
const roof=westClip(roofed(prism(outer,GUTTER-.3,RIDGE+1)));
const eaveCorbel=westClip(hull([...ring(WALL,GUTTER-.3-EAVE_OUT),...ring(outer,GUTTER-.3)]));
// Topgevel: verhoogde gevelrand (0,9 m breed, 0,35 m boven het dak).
const coping=plane(plane(box(U0-.05,U0+.9,-HW-.05,HW+.05,WALL_TOP-1,RIDGE+2),0,SLOPE,RIDGE+.35),0,-SLOPE,RIDGE+.35);
// Hoeklisenen van de westgevel tot 1 m boven de muurplaat met een piramidevormige bekroning.
const lisenes=[];for(const sv of [-1,1]){const v0=sv*(HW+.3),v1=sv*(HW-.6),a=Math.min(v0,v1),b=Math.max(v0,v1),u0=U0-.3,u1=U0+.6,top=WALL_TOP+1.0;
  lisenes.push(box(u0,u1,a,b,BASE,top),hull([...ring([[u0,a],[u1,a],[u1,b],[u0,b]],top-.01),[(u0+u1)/2,(a+b)/2,top+1.3]]));}
// Koorsluiting: lisenen op de vier hoeken van de schuine zijden.
for(const [u,v] of [[UC,-HW],[UE,-VE],[UE,VE],[UC,HW]])lisenes.push(Manifold.cylinder(WALL_TOP-BASE,.45,.45,8).rotate([0,0,22.5]).translate([u,v,BASE]));
// Gemetselde plint van 0,15 m met schuine kraag.
const PLINTH=.55;
const plinth=poly=>{const o=offset(poly,.15);return hull([...ring(o,BASE),...ring(o,PLINTH),...ring(poly,PLINTH+.15)])};

// Toren: risaliet van de grond tot NAP +13,6, kraag, houten klokkenverdieping,
// kroonlijst op een schuine kraag, achtzijdige naaldspits.
const T=TOWER,tu0=T.front,tu1=T.uc+T.half;
const rect=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
const brick=box(tu0,tu1,-T.half,T.half,BASE,T_BRICK);
const brickCap=hull([...ring(rect(tu0,tu1,-T.half,T.half),T_BRICK-.16),...ring(rect(tu0-.15,tu1+.15,-T.half-.15,T.half+.15),T_BRICK),...ring(rect(tu0-.15,tu1+.15,-T.half-.15,T.half+.15),T_BRICK+.25)]);
const bsq=h=>rect(T.uc-h,T.uc+h,-h,h);
const belfry=prism(bsq(T.belfry),T_BRICK+.2,T_CORNICE);
const cornice=hull([...ring(bsq(T.belfry),T_CORNICE-.41),...ring(bsq(T.cornice),T_CORNICE),...ring(bsq(T.cornice),T_CORNICE_TOP)]);
const spire=Manifold.cylinder(SPIRE_TOP-T_CORNICE_TOP,SPIRE_APOTHEM/Math.cos(Math.PI/8),.05,8).rotate([0,0,22.5]).translate([T.uc,0,T_CORNICE_TOP-.01]);
// Zuidportaal (gepleisterde omlijsting, 2,2 m breed, 0,3 m voor de muur) in de westelijke
// travee, bekroond met een zadeltje van 45 graden.
const PORTAL_U=-8.1,PORTAL_TOP=nap(7.6);
const portal=plane(plane(box(PORTAL_U-1.1,PORTAL_U+1.1,-HW-.3,-HW+.05,BASE,PORTAL_TOP),1,0,PORTAL_TOP-PORTAL_U),-1,0,PORTAL_TOP+PORTAL_U);

let church=Manifold.union([walls,roof,eaveCorbel,coping,...lisenes,plinth(WALL),brick,brickCap,belfry,cornice,spire,portal]);

// Blinde nissen (0,25–0,35 m) met spitse top van ~54 graden voor de rondboogvensters,
// achthoekige nissen voor oculi en rozetten.
const niche=(w,z0,z1,depth=.35)=>{const r=w/2,h=z1-z0;return prism([[-r,0],[r,0],[r,h-.7*w],[0,h],[-r,h-.7*w]],-depth,.6).rotate([90,0,0]).translate([0,0,z0])};
const oculus=(d,zc,depth=.3)=>Manifold.cylinder(depth+.6,d/2,d/2,8).rotate([0,0,22.5]).translate([0,0,-.6]).rotate([-90,0,0]).translate([0,0,zc]);
const onWall=(n,u,v,deg)=>n.rotate([0,0,deg]).translate([u,v,0]);
const cuts=[];
// Zijgevels: vijf traveeën; zuid heeft het portaal in de westelijke travee.
const WIN=[-8.1,-3.53,-.04,3.53,6.95];
for(const u of WIN){cuts.push(onWall(niche(1.25,nap(3.1),nap(6.8)),u,HW,180));if(u!==PORTAL_U)cuts.push(onWall(niche(1.25,nap(3.1),nap(6.8)),u,-HW,0));}
cuts.push(onWall(niche(1.15,BASE,nap(3.9)),PORTAL_U,-HW-.3,0));
cuts.push(onWall(oculus(.9,nap(5.05)),PORTAL_U,-HW-.3,0));
// Koorsluiting: groot venster in de zuidoostzijde, blinde boog in de oostwand, deur en
// oculus in de noordoostzijde.
const chamfer=(p,q)=>({u:(p[0]+q[0])/2,v:(p[1]+q[1])/2,deg:Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI});
const se=chamfer([UC,-HW],[UE,-VE]),ne=chamfer([UE,VE],[UC,HW]);
cuts.push(onWall(niche(1.6,nap(2.9),nap(7.2)),se.u,se.v,se.deg));
cuts.push(onWall(niche(1.6,nap(2.9),nap(7.2),.25),UE,0,90));
cuts.push(onWall(niche(1.1,BASE,nap(3.6)),ne.u,ne.v,ne.deg),onWall(oculus(.9,nap(5.2)),ne.u,ne.v,ne.deg));
// Westgevel: twee hoge vensters met rozetten erboven, in het risaliet een gekoppeld
// venster en een oculus, in de toren gekoppelde vensters op drie zijden.
for(const v of [-3.3,3.3])cuts.push(onWall(niche(1.3,nap(2.4),nap(5.9)),U0,v,-90),onWall(oculus(1.1,nap(7.4)),U0,v,-90));
cuts.push(onWall(niche(1.0,nap(4.3),nap(6.2),.3),tu0,0,-90),onWall(oculus(1.0,nap(7.9)),tu0,0,-90));
for(const dv of [-.45,.45])cuts.push(onWall(niche(.6,nap(10.3),nap(12.4),.3),tu0,dv,-90));
for(const [v,deg] of [[-T.half,0],[T.half,180]])for(const du of [-.45,.45])cuts.push(onWall(niche(.6,nap(11.0),nap(12.9),.25),T.uc+du,v,deg));
// Klokkenverdieping: twee galmgaten per zijde.
for(const [u,v,deg] of [[T.uc-T.belfry,0,-90],[T.uc+T.belfry,0,90],[T.uc,-T.belfry,0],[T.uc,T.belfry,180]])for(const d of [-.65,.65])cuts.push(onWall(niche(.8,nap(14.9),nap(16.6),.3).translate([d,0,0]),u,v,deg));
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Protestantse kerk Blankenham",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,groundSamplePoints:[[-11.8,-6.2],[-11.8,6.2],[-4,-6.4],[-4,6.4],[5,-6.4],[5,6.4],[12.6,-3],[12.6,0]],replacesBuildings:["NL.IMBAG.Pand.1708100000027665"],
  description:"Oorsprong RD (189456.97, 531036.05) midden in de zaal, X langs de nok naar het oosten; zaalkerk van 1892 met driezijdige koorsluiting onder een schilddak en een westtorentje met houten klokkenverdieping en achtzijdige spits; torengeledingen en nissen uit foto's geschat.",
  realWorld:{groundNapM:GROUND_NAP,wallTopNapM:8.55,ridgeNapM:13.95,roofPitchDeg:+(Math.atan(SLOPE)*180/Math.PI).toFixed(1),towerBrickNapM:13.6,belfryCorniceNapM:17.45,spireTopNapM:24.5,widthM:2*HW,lengthM:+(UE-U0).toFixed(2)},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000027665","https://monumentenregister.cultureelerfgoed.nl/monumenten/387546","https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT,_WESTGEVEL,_ZUIDGEVEL_-_Blankenham_-_20277084_-_RCE.jpg","https://www.openstreetmap.org/way/267317784","https://www.ahn.nl/dataroom"]};

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
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min.map(x=>+x.toFixed(3)),max:bb.max.map(x=>+x.toFixed(3))}},null,1));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printSolid=church.translate([0,0,-BASE]),printFiles=[];
await writeFile(path.join(outDir,glb),toGlb(parts));
for(const scale of [100,1000]){const f=`${slug}-1-${scale}.stl`;printFiles.push(f);await writeFile(path.join(outDir,f),toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale));}
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles,realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2)+"\n");
