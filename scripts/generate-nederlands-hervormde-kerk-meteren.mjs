import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="nederlands-hervormde-kerk-meteren";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Modelstelsel: X langs de nok van het schip naar het koor (ONO, 23,9 graden in RD, gemeten op de zuidgevel
// van BAG-pand 0236100000008970), Y naar het NNW, oorsprong op de as van het schip, maaiveld NAP +4,42 m (3DBAG).
const BASE=-0.5,ORIGIN=[147800.44,430615.01],X_AXIS=[.9141,.4055],GROUND_NAP=4.42;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Dakvlak boven een gevelrand: helling s naar binnen vanaf goothoogte eaves op de lijn door p met buitennormaal n.
const eavePlane=(s,p,n,eaves,slope)=>plane(s,-slope*n[0],-slope*n[1],eaves+slope*(n[0]*p[0]+n[1]*p[1]));
const sideRoof=(s,y0,y1,eaves,slope)=>eavePlane(eavePlane(s,[0,y0],[0,-1],eaves,slope),[0,y1],[0,1],eaves,slope);

// Schip (middeleeuws, verbouwd 1837 en ca. 1875): zadeldak, nok NAP +17,0 m.
const NAVE_EAVES=6.3,NAVE_SLOPE=1.4,NAVE_HALF=4.5,NAVE_X=[-10.9,7.38];
const nave=sideRoof(box(NAVE_X[0],NAVE_X[1],-NAVE_HALF,NAVE_HALF,BASE,30),-NAVE_HALF,NAVE_HALF,NAVE_EAVES,NAVE_SLOPE);
// Oostgevel van het schip met opstaande gevelrand en hoeklisenen, steekt boven het koordak uit.
let gable=sideRoof(box(7.1,7.65,-4.7,4.7,BASE,30),-4.7,4.7,NAVE_EAVES+.35+.2*NAVE_SLOPE,NAVE_SLOPE);
gable=Manifold.union([gable,box(7.1,7.65,-.45,.45,12,13.45)]);

// Koor van 1837: driezijdig gesloten, schilddak met gelijke helling op alle zijden, schoorsteen op het schildpunt.
const CHOIR_EAVES=5.73,CHOIR_SLOPE=.93,CH=3.25;
const choirPoly=[[7,-CH],[14.15,-CH],[15.92,-1.5],[15.92,1.5],[14.15,CH],[7,CH]];
let choir=prism(choirPoly,BASE,20);
for(let i=0;i<choirPoly.length;i++){const a=choirPoly[i],b=choirPoly[(i+1)%choirPoly.length];if(a[0]===7&&b[0]===7)continue;const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);const n=ccw(choirPoly)===choirPoly?[dy/l,-dx/l]:[-dy/l,dx/l];choir=eavePlane(choir,a,n,CHOIR_EAVES,CHOIR_SLOPE)}
const hipX=15.92-CH;// schildpunt
const chimney=Manifold.union([box(hipX-.45,hipX+.45,-.45,.45,8,9.9),Manifold.hull([[hipX-.55,-.55,9.85],[hipX+.55,-.55,9.85],[hipX+.55,.55,9.85],[hipX-.55,.55,9.85],[hipX,0,10.35]])]);
// Dakkapel met spitse kap in het oostelijke schilddakvlak.
const choirDormer=prism([[-.5,5.75],[.5,5.75],[.5,6.55],[0,7.15],[-.5,6.55]],0,1.9).rotate([90,0,90]).translate([13.5,0,0]);

// Aanbouw ten noorden van het schip (zelfde BAG-pand): laag zadeldak, twee dakkapellen aan de noordzijde.
const ANNEX_Y=[5.2,12.45],ANNEX_RIDGE=7.25,ANNEX_SLOPE=1.22,annexMid=(ANNEX_Y[0]+ANNEX_Y[1])/2;
const annex=sideRoof(box(-10.19,3.89,4.3,ANNEX_Y[1],BASE,20).translate([0,-annexMid,0]),-(ANNEX_Y[1]-ANNEX_Y[0])/2,(ANNEX_Y[1]-ANNEX_Y[0])/2,ANNEX_RIDGE-ANNEX_SLOPE*(ANNEX_Y[1]-ANNEX_Y[0])/2,ANNEX_SLOPE).translate([0,annexMid,0]);
const annexDormers=[-5,-1.3].map(x=>prism([[-.5,5],[.5,5],[.5,5.9],[0,6.4],[-.5,5.9]],0,1.6).rotate([90,0,0]).translate([x,annexMid+1.8,0]));
const link=box(3.2,7.26,4.3,5.5,BASE,3);

// Toren (onderbouw 14e, bovenbouw late 15e eeuw): twee geledingen, tentdak met dakkapellen.
const T={x0:-15.27,x1:-10.85,y0:-2.68,y1:2.6},TC=[(T.x0+T.x1)/2,(T.y0+T.y1)/2];
const rect=(d,z)=>[[T.x0-d,T.y0-d,z],[T.x1+d,T.y0-d,z],[T.x1+d,T.y1+d,z],[T.x0-d,T.y1+d,z]];
const towerLow=box(T.x0,T.x1+.45,T.y0,T.y1,BASE,7.5);
const towerUp=Manifold.hull([...rect(0,7.5),...rect(-.15,7.65),...rect(-.15,16)]);
const TOP_Z=24.6,EAVE_Z=16.35,APEX=25.3;
const towerRoof=Manifold.hull([...rect(-.15,16),...rect(.1,EAVE_Z),[TC[0]-.3,TC[1]-.3,TOP_Z],[TC[0]+.3,TC[1]-.3,TOP_Z],[TC[0]+.3,TC[1]+.3,TOP_Z],[TC[0]-.3,TC[1]+.3,TOP_Z],[TC[0],TC[1],APEX]]);
// Dakkapel per torendakvlak: voorvlak verticaal, onderkant onder 51 graden de kap in.
const towerDormers=[[1,0],[-1,0],[0,1],[0,-1]].map(([nx,ny])=>{
  const h=(nx?(T.x1-T.x0)/2:(T.y1-T.y0)/2)+.1,dist=z=>h-(z-EAVE_Z)*(h-.3)/(TOP_Z-EAVE_Z);
  const df=dist(18)+.05,db=df-1.3,pts=[];
  for(const s of [-.45,.45])pts.push([s,df,18],[s,df,19],[s,db,16.4],[s,db,21.5]);pts.push([0,df,19.5],[0,db,22]);
  const q=pts.map(([s,d,z])=>[TC[0]+nx*d-ny*s,TC[1]+ny*d+nx*s,z]);return Manifold.hull(q)});

let church=Manifold.union([nave,gable,choir,chimney,choirDormer,annex,...annexDormers,link,towerLow,towerUp,towerRoof,...towerDormers]);

// Blinde nissen: vensters met spitse top (>= 50 graden), deuren, galmgaten, uurwerken en het oculus.
// niche(p, n, b, z0, z1, top): p punt op de gevel, n buitennormaal, b breedte.
const niche=(p,n,b,z0,z1,top,d=.35)=>{const prof=[[-b/2,z0],[b/2,z0],[b/2,z1],[0,z1+top],[-b/2,z1]];
  return prism(prof,-d,.6).rotate([90,0,0]).rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI+90]).translate([p[0],p[1],0])};
const disc=(p,n,r,z,d=.3)=>Manifold.extrude(CrossSection.circle(r,24),d+.6).translate([0,0,-d]).rotate([90,0,0]).rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI+90]).translate([p[0],p[1],z]);
const cuts=[];
const S=[0,-1],N=[0,1],E=[1,0],W=[-1,0];
for(const x of [-7.5,-5.2,.2,4.6])cuts.push(niche([x,-NAVE_HALF],S,1.3,2,4.4,.8));
cuts.push(niche([-9.7,-NAVE_HALF],S,1.2,0,2.4,.75));
cuts.push(niche([5.6,NAVE_HALF],N,.9,3.4,5,.6));
cuts.push(disc([7.65,0],E,.55,10.05));
cuts.push(niche([9.2,-CH],S,1.2,0,4.2,.8));
cuts.push(niche([10.8,CH],N,1.5,1.5,3.9,.95));
const dg=Math.SQRT1_2;
for(const [p,n] of [[[15.035,-2.375],[dg,-dg]],[[15.92,0],E],[[15.035,2.375],[dg,dg]]])cuts.push(niche(p,n,1.4,1.5,3.9,.9));
cuts.push(niche([.5,ANNEX_Y[1]],N,1.2,1,2.2,.7),niche([3.89,annexMid],E,1.1,.9,2.6,0));
// Toren: drie blindnissen per gevel in de bovengeleding, twee galmgaten, uurwerk op zuid- en oostzijde, ingang west.
const faces=[[[TC[0],T.y0+.15],S,T.x1-T.x0],[[TC[0],T.y1-.15],N,T.x1-T.x0],[[T.x0+.15,TC[1]],W,T.y1-T.y0],[[T.x1-.15,TC[1]],E,T.y1-T.y0]];
for(const [p,n,w] of faces){const t=[-n[1],n[0]];const off=w>5?1.65:1.35;
  if(n!==E)for(const o of [-off,0,off])cuts.push(niche([p[0]+t[0]*o,p[1]+t[1]*o],n,.9,8.1,11.9,.65,.3));
  for(const o of [-.9,.9])cuts.push(niche([p[0]+t[0]*o,p[1]+t[1]*o],n,.9,12.6,14.1,.6,.3));
  if(n===S||n===E)cuts.push(disc(p,n,.5,15.25));}
cuts.push(niche([T.x0,TC[1]],W,1.2,0,2.6,.75));
church=church.subtract(Manifold.union(cuts));
const parts=[["building:kerk",church]];

const META={name:"Nederlands Hervormde Kerk Meteren",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0236100000008970"],
  description:"Middeleeuwse dorpskerk, verbouwd in 1837 en rond 1875: toren met tentdak, zaalkerk met zadeldak, driezijdig gesloten koor met schilddak en een noordelijke aanbouw; X langs de nok naar het koor, maten uit BAG, 3DBAG en AHN, details geschat van foto's.",
  realWorld:{groundNapM:GROUND_NAP,naveRidgeM:+(NAVE_EAVES+NAVE_SLOPE*NAVE_HALF).toFixed(2),naveEavesM:NAVE_EAVES,choirRidgeM:+(CHOIR_EAVES+CHOIR_SLOPE*CH).toFixed(2),towerEavesM:EAVE_Z,towerApexM:APEX},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0236100000008970","https://service.pdok.nl/lv/bag/wfs/v2_0","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/16509","https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0148.php","https://www.wikidata.org/wiki/Q17374086","https://www.openstreetmap.org/way/274830706","https://commons.wikimedia.org/wiki/File:Meteren,_de_Nederlands_Hervormde_kerk_RM16509_foto6_2015-08-06_12.00.jpg","https://commons.wikimedia.org/wiki/File:Meteren_NH_Kerk.jpg","https://commons.wikimedia.org/wiki/File:N-H_kerk_Meteren.jpg","https://commons.wikimedia.org/wiki/File:Overzicht_van_kerk_en_kerktoren_met_tentdak,_vanuit_het_zuidwesten_-_Meteren_-_20409696_-_RCE.jpg"]};
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
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
