import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag('--scale','1000')),slug='engelmunduskerk-velsen-zuid';
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;

// Gebouwstelsel: u langs de nok van het schip (RD-richting 4,9 graden, gemeten op de 3D BAG-nok en de BAG-gevels),
// v linksom daarop (noord), z boven maaiveld NAP +2,95 m (3D BAG b3_h_maaiveld 2,94; AHN-DTM west 2,98).
const DEG=4.9*Math.PI/180,BASE=-.5,ORIGIN=[104702.7,497309.9],X_AXIS=[+Math.cos(DEG).toFixed(5),+Math.sin(DEG).toFixed(5)];
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const roofY=(s,c,z,k)=>plane(plane(s,0,k,z-k*c),0,-k,z+k*c); // zadeldak met nok langs u op v=c
const roofX=(s,c,z,k)=>plane(plane(s,k,0,z-k*c),-k,0,z+k*c); // zadeldak met nok langs v op u=c
const pyramid=(cu,cv,half,z0,z1)=>Manifold.extrude(new CrossSection([[[-half,-half],[half,-half],[half,half],[-half,half]]]),z1-z0,0,0,[.01,.01]).translate([cu,cv,z0]);

// Maten (NAP uit 3D BAG LoD2.2, gecontroleerd in AHN-DSM 0,5 m), hier boven maaiveld.
const NAVE={u0:-15.5,u1:15.5,v0:-5.47,v1:5.47,eave:6.95,ridge:13.45};           // goot NAP 9,9, nok NAP 16,4
const NAVE_K=(NAVE.ridge-NAVE.eave)/NAVE.v1;                                    // ca. 50 graden
const TOWER={u0:-19.23,u1:-14.6,v0:-2.14,v1:2.48,eave:21.05,top:24.85};          // goot NAP 24,0, top NAP 27,8 (AHN 27,9)
const TC=[(TOWER.u0+TOWER.u1)/2,(TOWER.v0+TOWER.v1)/2],TH=(TOWER.u1-TOWER.u0)/2;
const NORTH={u0:-3.89,u1:1.37,v0:5.2,v1:8.5,eave:5.25,ridge:6.92};             // noordelijke aanbouw
const CONS_A={u0:1.58,u1:6.85,v0:-15.37,v1:-4.9,eave:4.15,ridge:7.0};           // consistorie 1966-'69, west
const CONS_B={u0:6.85,u1:15.23,v0:-17.9,v1:-3.7,eave:4.35,ridge:8.85};          // consistorie/wijkcentrum, oost

// Schip met zadeldak; oostgevel steekt 0,35 m boven het dak uit met een pinakel op de top.
let nave=roofY(box(NAVE.u0,NAVE.u1,NAVE.v0,NAVE.v1,BASE,NAVE.ridge),0,NAVE.ridge,NAVE_K);
let eastGable=roofY(box(15.0,NAVE.u1,NAVE.v0,NAVE.v1,BASE,NAVE.ridge+1),0,NAVE.ridge+.35,NAVE_K);
let pinnacle=Manifold.union([box(14.6,15.5,-.45,.45,NAVE.ridge-1,NAVE.ridge+.9),pyramid(15.05,0,.45,NAVE.ridge+.9,NAVE.ridge+1.5)]);

// Romaanse westtoren met tentdak; goot op een kraag van 45 graden, 0,25 m overstek.
let tower=box(TOWER.u0,TOWER.u1,TOWER.v0,TOWER.v1,BASE,TOWER.eave-.25);
const OH=.25,eaveSlab=Manifold.extrude(new CrossSection([[[-TH,-TH],[TH,-TH],[TH,TH],[-TH,TH]]]),OH,0,0,[(TH+OH)/TH,(TH+OH)/TH]).translate([TC[0],TC[1],TOWER.eave-OH]);
let towerRoof=pyramid(TC[0],TC[1],TH+OH,TOWER.eave,TOWER.top);
// Rondboogfries tussen het tufstenen onderdeel en de bakstenen verhoging: band van 0,2 m op een kraag van 45 graden.
const band=(z)=>Manifold.union([Manifold.extrude(new CrossSection([[[-TH,-TH],[TH,-TH],[TH,TH],[-TH,TH]]]),.2,0,0,[(TH+.2)/TH,(TH+.2)/TH]).translate([TC[0],TC[1],z]),box(TC[0]-TH-.2,TC[0]+TH+.2,TC[1]-TH-.2,TC[1]+TH+.2,z+.2,z+.45)]);

// Gebogen steunberen aan de westzijde van de toren (BAG-contour), holle bovenkant van 4,5 m tot 0,9 m.
const BUT_TOP=4.5,BUT_END=.9;
const curve=(len)=>{const pts=[[0,BASE],[len,BASE]];for(let i=0;i<=12;i++){const t=len*(1-i/12);pts.push([t,BUT_END+(BUT_TOP-BUT_END)*(1-t/len)**2]);}return pts;};
// arm langs -u (profiel in u,z) en arm langs ±v (profiel in v,z)
const armWest=(v0,v1)=>{const len=TOWER.u0-(-20.8);const s=Manifold.extrude(new CrossSection([curve(len)]),v1-v0).rotate([90,0,0]);return s.mirror([1,0,0]).translate([TOWER.u0+.05,v1,0]);};
const armSide=(u0,u1,face,dir,len)=>{let s=Manifold.extrude(new CrossSection([curve(len)]),u1-u0).rotate([90,0,0]).rotate([0,0,90]);if(dir<0)s=s.mirror([0,1,0]);return s.translate([u0,face-dir*.05,0]);};
let buttresses=Manifold.union([
  armWest(1.55,2.55),armSide(-19.4,-18.5,TOWER.v1,1,4.15-TOWER.v1),
  armWest(-2.14,-1.19),armSide(-19.24,-18.34,TOWER.v0,-1,TOWER.v0-(-4.04)),
]);

// Noordelijke aanbouw met zadeldak haaks op het schip en een iets opstaande gevel.
let north=roofX(box(NORTH.u0,NORTH.u1,NORTH.v0,NORTH.v1,BASE,NORTH.ridge),(NORTH.u0+NORTH.u1)/2,NORTH.ridge,(NORTH.ridge-NORTH.eave)/((NORTH.u1-NORTH.u0)/2));
let northGable=roofX(box(NORTH.u0,NORTH.u1,8.1,NORTH.v1,BASE,NORTH.ridge+1),(NORTH.u0+NORTH.u1)/2,NORTH.ridge+.3,(NORTH.ridge-NORTH.eave)/((NORTH.u1-NORTH.u0)/2));

// Consistorie en wijkcentrum (1966-'69) aan de zuidoostzijde: twee evenwijdige zadeldaken met nok noord-zuid,
// die met een kilgoot in het schipdak lopen.
const consist=(c)=>{const cu=(c.u0+c.u1)/2,k=(c.ridge-c.eave)/((c.u1-c.u0)/2);return roofX(box(c.u0,c.u1,c.v0,c.v1,BASE,c.ridge),cu,c.ridge,k);};
let consA=consist(CONS_A),consB=consist(CONS_B);

let church=Manifold.union([nave,eastGable,pinnacle,tower,eaveSlab,towerRoof,band(11.9),buttresses,north,northGable,consA,consB]);

// Blinde nissen: puntige top (flanken 55 graden), 0,35 m diep tenzij anders.
const nicheProfile=(w,h)=>{const r=w/2,top=Math.min(h,r*Math.tan(55*Math.PI/180));return[[-r,0],[r,0],[r,h-top],[0,h],[-r,h-top]];};
const slab=(w,h,len)=>Manifold.extrude(new CrossSection([nicheProfile(w,h)]),len).rotate([90,0,0]); // y in [-len,0]
// gevel loodrecht op v (zuid: side=-1, noord: side=+1)
const nicheV=(face,side,u,z,w,h,d=.35)=>slab(w,h,d+.3).translate([u,side<0?face+d:face+.3,z]);
// gevel loodrecht op u (west: side=-1, oost: side=+1)
const nicheU=(face,side,v,z,w,h,d=.35)=>slab(w,h,d+.3).rotate([0,0,90]).translate([side<0?face-.3:face-d,v,z]);
const cuts=[];
// zuidgevel schip: drie spitsbogige spaarvelden tussen toren en consistorie, twee met rondboogvenster
for(const [u,win] of [[-12.6,true],[-7.3,true],[-2.0,false]]){cuts.push(nicheV(NAVE.v0,-1,u,1.0,4.0,5.3,.25));cuts.push(win?nicheV(NAVE.v0,-1,u,2.4,1.5,3.2,.55):nicheV(NAVE.v0,-1,u,3.0,.9,2.3,.55));}
// noordgevel: rondboogvensters (twee oost en één west van de aanbouw)
for(const u of [10.2,4.6,-8.4])cuts.push(nicheV(NAVE.v1,1,u,2.8,1.6,3.3));
cuts.push(nicheV(NORTH.v1,1,(NORTH.u0+NORTH.u1)/2,2.6,1.2,2.4));
// oostgevel: twee vensters, deur en een venstertje in de top
cuts.push(nicheU(NAVE.u1,1,-3.1,3.2,1.4,3.0),nicheU(NAVE.u1,1,3.45,3.2,1.4,3.0),nicheU(NAVE.u1,1,.44,0,1.9,3.0),nicheU(NAVE.u1,1,0,9.4,.9,1.5));
// toren: deur tussen de steunberen, hoge nis in het tufstenen deel, tweelingnissen, galmgaten
cuts.push(nicheU(TOWER.u0,-1,TC[1],0,1.6,3.2));
for(const [face,side] of [[TOWER.u0,-1],[TOWER.u1,1]]){if(side<0)cuts.push(nicheU(face,side,TC[1],7.6,1.1,2.8));const zt=side<0?13.2:13.8;cuts.push(nicheU(face,side,TC[1]-.65,zt,.9,2.0),nicheU(face,side,TC[1]+.65,zt,.9,2.0));cuts.push(nicheU(face,side,TC[1],16.9,2.0,3.3));}
for(const [face,side] of [[TOWER.v0,-1],[TOWER.v1,1]]){cuts.push(nicheV(face,side,TC[0],7.6,1.1,2.8),nicheV(face,side,TC[0]-.65,13.2,.9,2.0),nicheV(face,side,TC[0]+.65,13.2,.9,2.0),nicheV(face,side,TC[0],16.9,2.0,3.3));}
// consistorie: vensters in de oostgevel, deur en venster in de zuidgevels, vensters in de westgevel
for(const [v,z,w,h] of [[-14.0,1.0,1.2,2.0],[-9.96,1.0,1.2,2.0],[-6.3,1.3,1.0,1.3]])cuts.push(nicheU(CONS_B.u1,1,v,z,w,h));
cuts.push(nicheV(CONS_B.v0,-1,9.3,0,1.2,2.4),nicheV(CONS_B.v0,-1,12.8,1.0,1.2,2.0),nicheV(CONS_B.v0,-1,11.04,5.3,.9,1.2),nicheV(CONS_A.v0,-1,4.2,1.0,1.2,2.0));
for(const v of [-13.0,-9.0])cuts.push(nicheU(CONS_A.u0,-1,v,1.0,1.2,2.0));
church=church.subtract(Manifold.union(cuts));

const parts=[['building:kerk',church]];
const META={name:'Engelmunduskerk Velsen-Zuid',origin:ORIGIN,xAxis:X_AXIS,groundHeight:2.95,groundOffsetMetres:.2,replacesBuildings:['NL.IMBAG.Pand.0453100000025845'],description:'Romaanse eenbeukige kerk met westtoren onder tentdak, gebogen steunberen, noordelijke aanbouw en consistorie (1966-69); oorsprong midden in het schip, x langs de nok (4,9 graden), z boven maaiveld NAP +2,95 m.',realWorld:{groundNapM:2.95,naveEaveNapM:9.9,naveRidgeNapM:16.4,towerEaveNapM:24.0,towerTopNapM:27.8,ahnTowerTopNapM:27.89,naveLengthM:31.0,naveWidthM:10.94,towerWidthM:4.63},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0453100000025845','https://service.pdok.nl/lv/bag/wfs/v2_0','https://commons.wikimedia.org/wiki/Category:Engelmunduskerk,_Velsen-Zuid','https://monumentenregister.cultureelerfgoed.nl/monumenten/37067','https://nl.wikipedia.org/wiki/Engelmunduskerk_(Velsen-Zuid)','https://service.pdok.nl/rws/ahn/wcs/v1_0']};
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
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[`${slug}-1-100.stl`,`${slug}-1-1000.stl`],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
console.log('geschreven',outDir,glb,stl,stlResult.triangles);
