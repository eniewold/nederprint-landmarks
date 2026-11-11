// Noordervermaning Westzaan (J.J. Allanstraat 463): houten doopsgezinde vermaning
// uit 1695 zonder toren, met een bakstenen neogotische voorgevel (ca. 1850-1860)
// met pinakels, spitsboogvensters en roosvenster; sinds 1964 Gereformeerde Gemeente.
// Gebouwstelsel: u langs de nok naar de voorgevel (oost, +), v naar het noorden,
// oorsprong RD (113205.6, 497261.0) midden in de zaal. Hoogtes t.o.v. maaiveld NAP -0,70 m.
// Voetafdruk uit BAG-pand 0479100000002310, nok, goten en dakhellingen uit 3D BAG
// (LoD2.2) en AHN5-DSM (residu < 0,3 m), gevelindeling uit foto's (RCE, Commons, Reliwiki).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const slug="noordervermaning-westzaan";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug);
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

const GROUND_NAP=-.7,nap=z=>+(z-GROUND_NAP).toFixed(3);
const BASE=-.5,ORIGIN=[113205.6,497261.0],AXIS_DEG=11.8;
const X_AXIS=[+Math.cos(AXIS_DEG*Math.PI/180).toFixed(5),+Math.sin(AXIS_DEG*Math.PI/180).toFixed(5)];
// Zaal: houten deel (west) met schilddak, bakstenen voorgevelbouw (oost) met topgevel.
const HALL={u0:-10.4,u1:10.36,v:5.05};
const BRICK={u0:3.83,vs:-5.3};             // zuidmuur van het stenen deel staat 0,25 m verder uit
const RIDGE=nap(11.63),RIDGE_W=-6.24;       // nok van het schild in het westen tot de voorgevel
const ROOF_SLOPE=.98,HIP_SLOPE=1.19;        // 44,4 en 50 graden
const EAVES=+(RIDGE-ROOF_SLOPE*HALL.v).toFixed(3); // NAP +6,68 m
// Aanbouw aan de noordzijde (zadeldak oost-west) met een smalle verbinding naar de zaal.
const ANNEX={u0:2.4,u1:8.2,v0:7.9,v1:11.85,vr:10.0,eS:nap(1.88),eN:nap(2.4),ridge:nap(4.62)};
const LINK={u0:6.7,u1:8.2,top:nap(1.75)};
// Voorgevel: hoekpilasters met pinakels, verhoogde gevelrand, pinakel op de top.
const PIL={w:.9,u0:9.86,top:8.6,tip:9.9},COPING=.3,APEX={u0:9.46,top:RIDGE+COPING+1.0,tip:RIDGE+COPING+2.1};

const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const hull=pts=>Manifold.hull(pts);
const ring=(poly,z)=>poly.map(([u,v])=>[u,v,z]);

// Zaal als één convex lichaam: muren tot de goot, zadeldak tot de nok, schild aan de westkant,
// tot de voorgevel doorlopende nok.
const hallPoly=[[HALL.u0,-HALL.v],[HALL.u1,-HALL.v],[HALL.u1,HALL.v],[HALL.u0,HALL.v]];
const hall=hull([...ring(hallPoly,BASE),...ring(hallPoly,EAVES),[RIDGE_W,0,RIDGE],[HALL.u1,0,RIDGE]]);
// Stenen deel: zuidmuur 0,25 m dikker, afgedekt door hetzelfde dakvlak.
const brickStrip=plane(box(BRICK.u0,HALL.u1,BRICK.vs,-HALL.v+.01,BASE,RIDGE),0,ROOF_SLOPE,RIDGE);
// Topgevel steekt 0,3 m boven het dak uit (witte gevelrand), over de volle breedte van het stenen deel.
const gable=hull([...[[BRICK.vs,BASE],[HALL.v+.1,BASE],[HALL.v+.1,EAVES-ROOF_SLOPE*.1+COPING],[0,RIDGE+COPING],[BRICK.vs,RIDGE+ROOF_SLOPE*BRICK.vs+COPING]].flatMap(([v,z])=>[[PIL.u0,v,z],[HALL.u1,v,z]])]);
// Hoekpilasters (0,9 m) met achtzijdige pinakel; topstuk op de gevel met pinakel.
const pinnacle=(u,v,w,z0,z1)=>Manifold.cylinder(z1-z0,w/2/Math.cos(Math.PI/8),.05,8).rotate([0,0,22.5]).translate([u,v,z0-.01]);
const pilasters=[];
for(const v0 of [BRICK.vs-.45,HALL.v-.3]){const v1=v0+PIL.w;pilasters.push(box(PIL.u0,PIL.u0+PIL.w,v0,v1,BASE,PIL.top),pinnacle(PIL.u0+PIL.w/2,(v0+v1)/2,PIL.w,PIL.top,PIL.tip));}
const apex=[box(APEX.u0,HALL.u1,-.45,.45,RIDGE-.6,APEX.top),pinnacle((APEX.u0+HALL.u1)/2,0,.9,APEX.top,APEX.tip)];
// Aanbouw: zadeldak met ongelijke goten, topgevels oost en west; verbinding met plat dak.
const annexPoly=[[ANNEX.u0,ANNEX.v0],[ANNEX.u1,ANNEX.v0],[ANNEX.u1,ANNEX.v1],[ANNEX.u0,ANNEX.v1]];
const annex=hull([...ring(annexPoly,BASE),[ANNEX.u0,ANNEX.v0,ANNEX.eS],[ANNEX.u1,ANNEX.v0,ANNEX.eS],[ANNEX.u0,ANNEX.v1,ANNEX.eN],[ANNEX.u1,ANNEX.v1,ANNEX.eN],[ANNEX.u0,ANNEX.vr,ANNEX.ridge],[ANNEX.u1,ANNEX.vr,ANNEX.ridge]]);
const link=box(LINK.u0,LINK.u1,HALL.v-.1,ANNEX.v0+.1,BASE,LINK.top);
let church=Manifold.union([hall,brickStrip,gable,...pilasters,...apex,annex,link]);

// Blinde nissen (0,3 m diep). shape: polygoon in (breedte, hoogte) met de voet op 0.
const nicheOf=(poly,z0,depth=.3)=>prism(poly,-depth,.6).rotate([90,0,0]).translate([0,0,z0]);
const pointed=(w,z0,z1,depth)=>{const r=w/2,h=z1-z0;return nicheOf([[-r,0],[r,0],[r,h-.7*w],[0,h],[-r,h-.7*w]],z0,depth)};
const rect=(w,z0,z1,depth)=>{const r=w/2;return nicheOf([[-r,0],[r,0],[r,z1-z0],[-r,z1-z0]],z0,depth)};
const round=(d,zc,depth)=>nicheOf(Array.from({length:16},(_,i)=>{const a=2*Math.PI*i/16;return[d/2*Math.cos(a),d/2+d/2*Math.sin(a)]}),zc-d/2,depth);
// niche ligt in het vlak x/z en snijdt naar +y; deg draait hem naar de gevel.
const onWall=(n,u,v,deg)=>n.rotate([0,0,deg]).translate([u,v,0]);
const cuts=[];
// Voorgevel (oost): drie hoge spitsboogvensters boven, twee vensters en de deur beneden, roosvenster.
const FRONT=HALL.u1,vc=(BRICK.vs+HALL.v+.1)/2;
for(const dv of [-2.85,0,2.85])cuts.push(onWall(pointed(1.7,4.35,7.45),FRONT,vc+dv,90));
for(const dv of [-2.85,2.85])cuts.push(onWall(pointed(1.7,1.35,3.5),FRONT,vc+dv,90));
cuts.push(onWall(pointed(1.6,.6,3.5),FRONT,vc,90));
cuts.push(onWall(round(1.8,9.55),FRONT,vc,90));
// Gestuukte zijmuren van het stenen deel: twee smalle spitsboogvensters per kant.
for(const u of [5.45,8.2]){cuts.push(onWall(pointed(1.0,1.8,5.6),u,BRICK.vs,0),onWall(pointed(1.0,1.8,5.6),u,HALL.v,180));}
// Houten zijmuren: vier hoge rechthoekige vensters per kant.
for(const u of [-8.9,-5.5,-2.1,1.3]){cuts.push(onWall(rect(1.25,3.9,6.75),u,-HALL.v,0),onWall(rect(1.25,3.9,6.75),u,HALL.v,180));}
// Westgevel: twee vensters en de hoge deur.
for(const v of [-2.7,2.6])cuts.push(onWall(rect(1.25,3.9,6.75),HALL.u0,v,-90));
cuts.push(onWall(rect(1.1,1.4,3.8),HALL.u0,-.85,-90));
church=church.subtract(Manifold.union(cuts));

const parts=[["building:kerk",church]];
const META={name:"Noordervermaning Westzaan",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,replacesBuildings:["NL.IMBAG.Pand.0479100000002310"],
  description:"Oorsprong RD (113205.6, 497261.0) midden in de zaal, X langs de nok naar de bakstenen voorgevel (oost); houten zaalkerk uit 1695 met schilddak en neogotische voorgevel met pinakels, gevelindeling en pinakels uit foto's geschat.",
  realWorld:{groundNapM:GROUND_NAP,eavesNapM:6.68,ridgeNapM:11.63,roofPitchDeg:44.4,hipPitchDeg:50,lengthM:20.76,widthM:10.1,annexRidgeNapM:4.62,frontPinnacleNapM:+(APEX.tip+GROUND_NAP).toFixed(2)},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0479100000002310","https://monumentenregister.cultureelerfgoed.nl/monumenten/39982","https://nl.wikipedia.org/wiki/Noordervermaning_(Westzaan)","https://reliwiki.nl/index.php/Westzaan,_J.J._Allanstraat_463_-_Noordervermaning","https://commons.wikimedia.org/wiki/Category:Noordervermaning_(Westzaan)","https://www.openstreetmap.org/way/285093882","https://www.ahn.nl/dataroom"]};

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
