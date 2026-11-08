import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-lobith";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: +X langs de nok van de puntgevel (NO) naar de driezijdige sluiting (ZW), +Y naar de straat (ZO).
// Oorsprong in het midden van de BAG-bbox; z = 0 op maaiveld NAP +15,2 m (AHN-DTM rond de kerk).
const BASE=-.5,ORIGIN=[205513.53,430515.18],X_AXIS=[-.5335,-.8458],GROUND_NAP=15.2;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Maten (BAG 0196100000342619, AHN-DSM 0,5 m, foto's): zaal 13,85 x 11,0 m, sluiting tot x = 8,4.
const GX=-8.55,AX=5.3,EX=8.4,HW=5.5,D=2.3,EAVE=.35;
const RIDGE=14.3,K=1.38,HE=RIDGE-K*(HW+EAVE),RIDGE_END=5.1; // nok NAP +29,5; dakhelling 54 graden; nok eindigt bij x = 5,1
const foot=[[GX,-HW],[AX,-HW],[EX,-D],[EX,D],[AX,HW],[GX,HW]];
const facetN=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);return[-dy/l,dx/l]}; // buitennormaal; zijden rechtsom
const sides=[[[AX,HW],[EX,D]],[[EX,D],[EX,-D]],[[EX,-D],[AX,-HW]]];
// Voetafdruk met overstek op de lange zijden en de sluiting; de puntgevel steekt boven het dak uit.
const offFoot=[[GX,-HW-EAVE],[AX+EAVE*.414,-HW-EAVE],[EX+EAVE,-D-EAVE*.414],[EX+EAVE,D+EAVE*.414],[AX+EAVE*.414,HW+EAVE],[GX,HW+EAVE]];
const walls=prism(foot,BASE,HE);
const cornice=Manifold.hull([prism(foot,HE-.4,HE-.39),prism(offFoot,HE-.06,HE-.05)]);
// Dakvlakken: twee lange schilden tot de nok, drie steilere schilden boven de sluiting die bij x = 5,1 op de nok samenkomen.
let roof=prism(offFoot,HE-.06,RIDGE+1);
roof=plane(roof,0,K,RIDGE);roof=plane(roof,0,-K,RIDGE);
for(const [p,q] of sides){const n=facetN(p,q),d=n[0]*p[0]+n[1]*p[1]+EAVE,s=(RIDGE-HE)/(d-n[0]*RIDGE_END);roof=plane(roof,-s*n[0],-s*n[1],HE+s*d)}
// Puntgevel aan de noordoostzijde met afdekking 0,35 m boven het dak en schouderstukken op de hoeken.
let gable=box(GX,GX+.6,-HW,HW,BASE,RIDGE+1);gable=plane(gable,0,K,RIDGE+.35);gable=plane(gable,0,-K,RIDGE+.35);
const kneel=[-1,1].map(s=>box(GX,GX+.9,s>0?HW-.9:-HW,s>0?HW:-HW+.9,BASE,HE+1.1));
// Dakruiter (foto's, AHN-piek NAP +33,5 bij x = -1): leien voet met uurwerk, zeszijdige lantaarn, koepel en makelaar.
const TX=-1,hex=(r,z,k=0)=>Array.from({length:6},(_,i)=>[TX+r*Math.cos(i*Math.PI/3+k),r*Math.sin(i*Math.PI/3+k),z]);
const turretBase=box(TX-.95,TX+.95,-.95,.95,9,15.6);
const lantern=Manifold.hull([...hex(.95,15.55),...hex(.95,17.3)]);
const lanternCap=Manifold.hull([...hex(.95,17.25),...hex(1.1,17.4),...hex(1.1,17.55)]);
const dome=Manifold.hull([...hex(1.1,17.5),...hex(.95,17.9),...hex(.6,18.2),...hex(.3,18.35)]);
const finial=Manifold.hull([...hex(.45,18.3),[TX,0,19.4]]);
// Steen portaal aan de straatzijde met kroonlijst (Anno 1660).
const PX=-2.3;
const portal=Manifold.union([box(PX-1.1,PX+1.1,HW-.1,HW+.25,BASE,3.6),Manifold.hull([box(PX-1.1,PX+1.1,HW-.1,HW+.25,3.55,3.6),box(PX-1.3,PX+1.3,HW-.1,HW+.45,3.8,4.1)])]);
let church=Manifold.union([walls,cornice,roof,gable,...kneel,turretBase,lantern,lanternCap,dome,finial,portal]);
// Spitsboogvensters, blinde nis in de sluiting en de deur als nissen van 0,35 m (top 52 graden).
const niche=(cx,cy,n,w,z0,z1,depth=.35)=>{const r=w/2*1.3,y0=-depth,y1=.6;
  const s=Manifold.union([box(-w/2,w/2,y0,y1,z0,z1-r),Manifold.hull([[-w/2,y0,z1-r],[w/2,y0,z1-r],[0,y0,z1],[-w/2,y1,z1-r],[w/2,y1,z1-r],[0,y1,z1]])]);
  return s.rotate([0,0,Math.atan2(-n[0],n[1])*180/Math.PI]).translate([cx,cy,0])};
const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
const cuts=[];
for(const [x,z0] of [[1.6,2.6],[PX,4.25],[-5.5,3.4]])cuts.push(niche(x,HW,[0,1],1.4,z0,5.7));
for(const x of [1.6,PX,-5.5])cuts.push(niche(x,-HW,[0,-1],1.4,3.6,5.7));
cuts.push(niche(...mid(...sides[0]),facetN(...sides[0]),1.5,2.6,5.7));
cuts.push(niche(...mid(...sides[1]),facetN(...sides[1]),1.5,1.4,5.7));
cuts.push(niche(...mid(...sides[2]),facetN(...sides[2]),1.5,2.8,5.7));
cuts.push(niche(PX,HW+.25,[0,1],1.1,BASE,2.95,.6));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];
const META={name:"Nederlands Hervormde Kerk Lobith",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0196100000342619"],description:"Zaalkerkje uit 1660 met driezijdige sluiting, hoog schilddak, puntgevel tegen de buurbebouwing en zeszijdig koepeltorentje; X van de puntgevel naar de sluiting, +Y naar de Markt.",realWorld:{groundNapM:GROUND_NAP,lengthM:+(EX-GX).toFixed(2),widthM:2*HW,eaveM:+HE.toFixed(2),ridgeM:RIDGE,roofPitchDeg:+(Math.atan(K)*180/Math.PI).toFixed(1)},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/21963","https://reliwiki.nl/index.php/Lobith,_Markt_13_-_Ned._Hervormde_Kerk","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0196100000342619","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Lobith"]};
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
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
