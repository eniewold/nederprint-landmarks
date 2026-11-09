// Hervormde kerk Drimmelen (1792, rijksmonument 28096): zaalkerk op een langgerekt achthoekig plan
// onder een hoog leien schilddak met dakruiter, en de consistoriekamer tegen de noordwestgevel.
// Lokaal stelsel: oorsprong in het hart van de zaal op maaiveld, +X langs de nok naar de
// ingangsgevel (zuidoost), +Y naar het noordoosten. Maten uit BAG/3DBAG en AHN, zie README.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="hervormde-kerk-drimmelen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const BASE=-.5,ORIGIN=[114616.3,413372.25],X_AXIS=[.628,-.778],GROUND_NAP=.547;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const oct=(r,z0,z1,rot=22.5)=>Manifold.cylinder(z1-z0,r,r,8).rotate([0,0,rot]).translate([0,0,z0]);

// Zaal: achthoek, lange zijden y = ±5,13 (BAG), kopse vlakken x = ±8,69, afgeschuinde hoeken van 3 m onder 45°.
const L=8.69,W=5.13,C=3,EAVE=6.35,RIDGE=13.2,K=(RIDGE-EAVE)/W; // goot NAP +6,9, nok NAP +13,75 (3DBAG/AHN)
const hallPoly=[[L-C,-W],[L,-W+C],[L,W-C],[L-C,W],[-L+C,W],[-L,W-C],[-L,-W+C],[-L+C,-W]];
// Gevelvlakken: buitennormaal (graden) en afstand tot het hart.
const DIAG=(L-C+W)/Math.SQRT2;
const facets=[[0,L],[180,L],[90,W],[-90,W],[45,DIAG],[135,DIAG],[-45,DIAG],[-135,DIAG]];
const walls=prism(hallPoly,BASE,EAVE);
// Kroonlijst: 45°-kraag van 0,4 m en een dakvoet die 0,4 m overstekt.
const OV=.4,eaveSec=new CrossSection([hallPoly]).offset(OV,"Miter");
const kraag=Manifold.hull([prism(hallPoly,EAVE-1.25,EAVE-1.24),Manifold.extrude(eaveSec,.01).translate([0,0,EAVE-.86])]);
// Schilddak: per gevelvlak een dakvlak met gelijke helling (53°) vanaf de goot.
let roof=Manifold.extrude(eaveSec,RIDGE+1-(EAVE-.86)).translate([0,0,EAVE-.86]);
for(const[a,d]of facets){const r=a*Math.PI/180,nx=Math.cos(r),ny=Math.sin(r),n=Math.hypot(K,1);roof=roof.trimByPlane([-K*nx/n,-K*ny/n,-1/n],-(EAVE+K*d)/n);}

// Dakkapel op het noordwestelijke schuine dakvlak aan de noordoostzijde (foto zuidoost-/noordoostgevel).
let dormer=box(4.4,6.75,-.7,.7,7.0,9.15);dormer=plane(dormer,0,1,9.85);dormer=plane(dormer,0,-1,9.85);
dormer=dormer.rotate([0,0,135]);

// Consistoriekamer tegen de noordwestgevel: zadeldak langs de as, aan het eind afgewolfd naar NAP +3,9 (3DBAG).
const AW=2.14,AX=-16.59;
let annex=box(AX,-7.6,-AW,AW,BASE,9);annex=plane(annex,0,1.2,EAVE+1.2*AW);annex=plane(annex,0,-1.2,EAVE+1.2*AW);
annex=plane(annex,1,0,9.0+11.0); // z <= 9 - (-x-11)

// Dakruiter: vierkante leien voet op de nok, achtkantige lantaarn, kap, bol en naald.
const tBase=box(-1.1,1.1,-1.1,1.1,11,14.4);
const lantern=oct(.95,14.3,16.35);
const lanternKraag=Manifold.hull([oct(.95,16.34,16.35),oct(1.1,16.49,16.65)]);
const cap=Manifold.hull([oct(1.1,16.6,16.65),oct(.36,17.34,17.35)]);
const knob=Manifold.hull([oct(.36,17.3,17.35),oct(.47,17.46,17.68),oct(.3,17.85,17.86)]);
const needle=Manifold.cylinder(1.85,.45,.2,8).rotate([0,0,22.5]).translate([0,0,17.85]);

let church=Manifold.union([walls,kraag,roof,dormer,annex,tBase,lantern,lanternKraag,cap,knob,needle]);

// Blinde nissen van 0,35 m: rondboogvensters met een top van 45°, de ingang en de vensters van de consistorie.
const niche=(s,z,w,h,a,d,depth=.35)=>{const p=[[-w/2,0],[w/2,0],[w/2,h-w/2],[0,h],[-w/2,h-w/2]];return prism(p,0,1).rotate([90,0,0]).translate([s,-d+depth,z]).rotate([0,0,a+90]);};
const flat=(s,z,w,h,a,d,depth=.3)=>box(s-w/2,s+w/2,-d-1,-d+depth,z,z+h).rotate([0,0,a+90]);
const cuts=[];
for(const a of [90,-90])for(const s of [-2.6,2.6])cuts.push(niche(s,1.6,1.5,3.7,a,W));
for(const a of [45,135,-45,-135])cuts.push(niche(0,1.6,1.5,3.7,a,DIAG));
cuts.push(niche(0,BASE,1.3,3.2,0,L)); // ingang onder de gevelsteen
cuts.push(flat(0,3.75,1.7,1.15,0,L,.2)); // gevelsteen als vlakke nis
for(const a of [90,-90]){const sgn=a>0?1:-1;for(const z of [.8,3.5])cuts.push(flat(sgn*10.2,z,1.0,1.7,a,AW,.3));}
cuts.push(niche(0,8.15,.9,1.25,0,6.75,.25).rotate([0,0,135])); // venster dakkapel
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Hervormde kerk Drimmelen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,
  replacesBuildings:["NL.IMBAG.Pand.1719100000018980"],
  description:"Achthoekige zaalkerk uit 1792 onder hoog leien schilddak met dakruiter en consistoriekamer; oorsprong in het hart van de zaal, X naar de ingang (zuidoost).",
  realWorld:{groundNapM:GROUND_NAP,eaveNapM:6.9,ridgeNapM:13.75,turretCapNapM:17.9,hallLengthM:17.38,hallWidthM:10.26},
  sources:["https://nl.wikipedia.org/wiki/Hervormde_kerk_(Drimmelen)","https://monumentenregister.cultureelerfgoed.nl/monumenten/28096","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1719100000018980","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Drimmelen)"]};

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
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,printSolid=church.translate([0,0,-BASE]);
await writeFile(path.join(outDir,glb),toGlb(parts));
for(const scale of [100,1000])await writeFile(path.join(outDir,`${slug}-1-${scale}.stl`),toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`,1000/scale));
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
