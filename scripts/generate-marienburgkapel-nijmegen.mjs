import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="marienburgkapel-nijmegen";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Gebouwstelsel: +X langs de nok van de westgevel naar de driezijdige koorsluiting (OZO), +Y naar het noorden (NNO).
// Oorsprong midden tussen de lange muren (BAG 0268100000002938), z = 0 op het plein NAP +31,65 m (AHN-DTM rondom).
const BASE=-.5,ORIGIN=[188023.94,428622.31],X_AXIS=[.9461,-.3239],GROUND_NAP=31.65;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){let q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const deg=Math.PI/180;
// Convexe veelhoek evenwijdig verschuiven (positief = naar buiten).
const offPoly=(p,d)=>{p=ccw(p);const L=p.map((a,i)=>{const b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),n=[dy/l,-dx/l];return{a:[a[0]+n[0]*d,a[1]+n[1]*d],t:[dx/l,dy/l]}});
  return L.map((l,i)=>{const m=L[(i+L.length-1)%L.length],det=m.t[0]*l.t[1]-m.t[1]*l.t[0],s=((l.a[0]-m.a[0])*l.t[1]-(l.a[1]-m.a[1])*l.t[0])/det;return[m.a[0]+m.t[0]*s,m.a[1]+m.t[1]*s]})};

// Maten (BAG-contour, AHN-DSM 0,5 m, 3D BAG LoD2.2, foto's RCE/Commons):
// schip 29,25 m tussen westgevel (x = -15,5) en de hoek van de 3/8-sluiting (x = 13,75), breed 10,6 m;
// sluiting rond x = 11,55 met binnenstraal 5,3 m (oostzijde op x = 16,85).
// Nok NAP +55,08 (z = 23,43), dakhelling 60 graden (AHN 1,72 en 3D BAG 1,71-1,74 m/m), koordaken met dezelfde helling.
const GX=-15.5,HW=5.3,CX=11.55,R_IN=5.3,R_OUT=R_IN/Math.cos(22.5*deg),EAVE=.35;
const RIDGE=23.43,K=1.73,HE=RIDGE-K*(HW+EAVE);
const apseV=a=>[CX+R_OUT*Math.cos(a*deg),R_OUT*Math.sin(a*deg)];
const foot=[[GX,-HW],apseV(-67.5),apseV(-22.5),apseV(22.5),apseV(67.5),[GX,HW]];
const walls=prism(foot,BASE,HE);
// Plint tot 2,6 m met afgeschuinde waterlijst (foto's: donkere voet met versnijding).
const plinth=Manifold.hull([prism(offPoly(foot,.15),BASE,2.6),prism(foot,BASE,2.75)]);
// Daklijst als schuine kraag van 45 graden onder het overstek; geen overstek aan de westgevel.
const offFoot=offPoly(foot,EAVE).map(([x,y])=>[Math.max(x,GX),y]);
const cornice=Manifold.hull([prism(foot,HE-.4,HE-.39),prism(offFoot,HE-.06,HE-.05)]);
let roof=prism(offFoot,HE-.06,RIDGE+1);
roof=plane(roof,0,-K,RIDGE);roof=plane(roof,0,K,RIDGE);
for(const a of [-45,0,45]){const c=Math.cos(a*deg),s=Math.sin(a*deg);roof=plane(roof,-K*c,-K*s,RIDGE+K*c*CX)}
// Westgevel: puntgevel met afdekking 0,35 m boven het dak en een schoorsteen met zadelkapje op de top.
let gable=box(GX,GX+.6,-HW,HW,BASE,RIDGE+1);gable=plane(gable,0,K,RIDGE+.35);gable=plane(gable,0,-K,RIDGE+.35);
const chimney=Manifold.union([box(GX+.05,GX+.95,-.5,.5,RIDGE-1.5,RIDGE+1.8),Manifold.hull([box(GX-.05,GX+1.05,-.6,.6,RIDGE+1.8,RIDGE+1.95),box(GX-.05,GX+1.05,-.05,.05,RIDGE+2.5,RIDGE+2.55)])]);
// Steunberen (BAG-contour: 1,0-1,2 m breed, 1,35 m diep; foto's: versnijding halverwege, schuine afdekking onder de goot).
// Profiel (d naar buiten vanaf het muurvlak, z): 1,35 m diep tot 6,5 m, versnijding naar 0,9 m, schuine kap van 60 graden.
const BUT=[[-.4,BASE],[1.35,BASE],[1.35,6.5],[.9,7.1],[.9,11.6],[-.4,11.6+K*1.3]];
const buttress=(p,a,w=1.05,prof=BUT)=>Manifold.extrude(new CrossSection([ccw(prof)]),w).translate([0,0,-w/2]).rotate([90,0,0]).rotate([0,0,a]).translate([p[0],p[1],0]);
const buttresses=[];
for(const x of [-10.75,-6.5,1.57,5.62,9.71])buttresses.push(buttress([x,-HW],-90,x===-10.75?1.07:1.0+(x>9?.2:0)));
for(const x of [-10.55,-6.42,-2.29,1.76,5.94,10.08])buttresses.push(buttress([x,HW],90,1.0+(Math.abs(x-10.08)<.1||Math.abs(x+10.55)<.1?.1:0)+(Math.abs(x+2.29)<.1?.2:0)));
buttresses.push(buttress([GX,-HW],-135,.95),buttress([GX,HW],135,.95));
for(const a of [-67.5,-22.5,22.5,67.5])buttresses.push(buttress(apseV(a),a,1.05));
// Traptoren aan de zuidzijde (BAG: 2,6 x 2,0 m buiten de muur), romp tot 14,6 m, leien naald tot NAP +52,6 (AHN 52,3).
const TX=-2.6,TV=-6.03;
const turret=Manifold.union([box(TX-1.3,TX+1.3,-7.33,-4.73,BASE,14.6),Manifold.hull([box(TX-1.42,TX+1.42,-7.45,-4.61,14.5,14.65),[TX,TV,20.95]]),Manifold.hull([[TX,TV,20.7],[TX+.12,TV,20.7],[TX,TV+.12,20.7],[TX,TV,21.6]])]);
// Dakruiter op x = -8,5 (AHN-piek NAP +65,5): vierkante leien voet, achtkantige lantaarn met lijst, vier wimpergen en een achtkante naald.
const RX=-8.5,oct=(r,z,k=22.5)=>Array.from({length:8},(_,i)=>[RX+r*Math.cos((i*45+k)*deg),r*Math.sin((i*45+k)*deg),z]);
const rBase=box(RX-.95,RX+.95,-.95,.95,RIDGE-2,25.0);
const lantern=Manifold.hull([...oct(1.03,24.9),...oct(1.03,27.0)]);
const lanternCap=Manifold.hull([...oct(1.03,26.95),...oct(1.18,27.1),...oct(1.18,27.3)]);
const gablets=[0,90,180,270].map(a=>{const c=Math.cos(a*deg),s=Math.sin(a*deg),pt=(t,d,z)=>[RX+c*d-s*t,s*d+c*t,z];return Manifold.hull([pt(-.5,.3,27.25),pt(.5,.3,27.25),pt(0,.3,28.6),pt(-.5,1.12,27.25),pt(.5,1.12,27.25),pt(0,1.12,28.6)])});
const spire=Manifold.hull([...oct(.92,27.25),[RX,0,35.5]]);
// Pinakel op de top van het koordak (historische foto 1910).
const apsePin=Manifold.hull([...oct(.45,RIDGE-.6,22.5).map(([x,y,z])=>[x-RX+CX,y,z]),[CX,0,RIDGE+1.5]]);
// Dakkapellen (foto's: twee per lange zijde en één op het noordoostschild van het koor), 1,2 m breed met zadeldakje van 50 graden.
const dormer=(cx,a,dFront,zS)=>{const prof=[[-.6,zS-1.2],[.6,zS-1.2],[.6,zS+1.3],[0,zS+2.0],[-.6,zS+1.3]];
  return Manifold.extrude(new CrossSection([ccw(prof)]),dFront).rotate([90,0,0]).translate([0,dFront,0]).rotate([0,0,a-90]).translate(cx)};
const zSill=16.6,dS=(RIDGE-zSill)/K;
const dormers=[dormer([-11.6,0,0],90,dS,zSill),dormer([4.6,0,0],90,dS,zSill),dormer([-12.6,0,0],-90,dS,zSill),dormer([3.8,0,0],-90,dS,zSill),dormer([CX,0,0],45,dS,zSill)];
let chapel=Manifold.union([walls,plinth,cornice,roof,gable,chimney,...buttresses,turret,rBase,lantern,lanternCap,...gablets,spire,apsePin,...dormers]);
// Vensters en deur als blinde nissen (top 52 graden): spitsboogvensters in het schip (noord) en de koorsluiting,
// groot westvenster en gevelvenstertje, lage rondboogvensters van de benedenkerk, ingang in de tweede travee aan de noordzijde.
const niche=(cx,cy,n,w,z0,z1,depth=.35)=>{const r=w/2*1.3,y0=-depth,y1=.8;
  const s=Manifold.union([box(-w/2,w/2,y0,y1,z0,z1-r),Manifold.hull([[-w/2,y0,z1-r],[w/2,y0,z1-r],[0,y0,z1],[-w/2,y1,z1-r],[w/2,y1,z1-r],[0,y1,z1]])]);
  return s.rotate([0,0,Math.atan2(-n[0],n[1])/deg]).translate([cx,cy,0])};
const cuts=[];
const northBays=[-13.03,-8.49,-4.36,-.27,3.85,8.01,11.91];
for(const x of northBays)cuts.push(niche(x,HW,[0,1],x>11?1.6:1.9,5.0,12.9));
for(const x of [-13.03,-4.36,-.27])cuts.push(niche(x,HW,[0,1],1.3,.9,3.2,.3));
cuts.push(niche(-8.49,HW,[0,1],1.5,BASE,3.3,.5),niche(-8.49,HW,[0,1],2.6,3.5,6.4,.2));
for(const x of [-8.6,-5.2,.13])cuts.push(niche(x,-HW,[0,-1],1.3,.9,3.4,.3));
for(const a of [-45,0,45]){const n=[Math.cos(a*deg),Math.sin(a*deg)];cuts.push(niche(CX+n[0]*R_IN,n[1]*R_IN,n,2.2,4.5,13.0))}
cuts.push(niche(GX,0,[-1,0],2.2,4.5,13.2),niche(GX,0,[-1,0],.95,16.0,18.4));
chapel=chapel.subtract(Manifold.union(cuts));
const parts=[["building:kapel",chapel]];
const META={name:"Mariënburgkapel Nijmegen",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:0,replacesBuildings:["NL.IMBAG.Pand.0268100000002938"],description:"Gotische kloosterkapel (circa 1431) met steil leien zadeldak, driezijdige koorsluiting, steunberen, traptoren aan de zuidzijde en slanke dakruiter; X van de westgevel naar het koor, +Y naar het noorden.",realWorld:{groundNapM:GROUND_NAP,lengthM:+(CX+R_IN-GX).toFixed(2),widthM:2*HW,eaveM:+HE.toFixed(2),ridgeM:RIDGE,roofPitchDeg:+(Math.atan(K)/deg).toFixed(1),turretTopM:20.95,roofTurretTopM:35.5},sources:["https://nl.wikipedia.org/wiki/Mari%C3%ABnburgkapel","https://monumentenregister.cultureelerfgoed.nl/monumenten/31158","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000002938","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://commons.wikimedia.org/wiki/Category:Mari%C3%ABnburgkapel"]};
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

if(chapel.status()!=="NoError")throw new Error(chapel.status());
const bb=chapel.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=chapel.decompose();console.log(JSON.stringify({slug,status:chapel.status(),genus:chapel.genus(),components:pieces.length,triangles:chapel.numTri(),volume:+chapel.volume().toFixed(1),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=chapel.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
