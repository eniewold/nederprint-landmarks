import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="oude-kerk-lunteren";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
// Lokaal stelsel = RD min ORIGIN (X oost, Y noord); de kerk staat vrijwel exact op de RD-as (nokken -0,3 graden).
const BASE=-.5,ORIGIN=[171075,455085],X_AXIS=[1,0],GROUND_NAP=15.05,EAVE=7;
const ccw=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1]}return a>0?p:[...p].reverse()};
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([ccw(p)]),z1-z0).translate([0,0,z0]);
const box=(a,b,c,d,z0,z1)=>prism([[a,c],[b,c],[b,d],[a,d]],z0,z1);
// Dakvlak z <= a*x + b*y + c.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
// Zadeldak met schilden: nok langs Y op x=xc tussen y0 en y1 (of langs X), helling s.
const hipNS=(x0,x1,y0,y1,xc,r0,r1,ridge,s,sy=s,eave=EAVE)=>{let r=box(x0,x1,y0,y1,eave-.05,ridge+1);r=plane(r,-s,0,ridge+s*xc);r=plane(r,s,0,ridge-s*xc);r=plane(r,0,-sy,ridge+sy*r1);return plane(r,0,sy,ridge-sy*r0)};

// Hoofdvolume (1858): brede zaal tot de goot op 7,0 m, met het strookje tegen de toren uit de BAG-contour.
const body=Manifold.union([box(-12.95,11.5,-11.4,9.85,BASE,EAVE),box(-13.2,-12.9,-4.85,4.04,BASE,EAVE),box(11.4,13.82,-4.6,2.5,BASE,EAVE)]);
// Schip: oost-west zadeldak (54,5 graden) van de toren tot het afgeschilde koortje.
let nave=prism([[-13.2,-4.8],[11.45,-4.8],[11.45,-4.6],[13.82,-4.6],[13.82,2.5],[11.45,2.5],[11.45,3.2],[-13.2,3.2]],EAVE-.05,14);
nave=plane(nave,0,-1.41,12.6-1.41*.8);nave=plane(nave,0,1.41,12.6+1.41*.8);nave=plane(nave,-1.42,0,12.4+1.42*10.2);
// Twee dwarse schilddaken (48 graden) over de middelste traveeën, nok op 12,4 m.
const crossA=hipNS(-7.25,2.3,-11.4,9.85,-2.45,-6.5,5.0,12.4,1.12,1.1);
const crossB=hipNS(2.15,11.5,-11.4,9.85,6.75,-6.6,5.1,12.35,1.16,1.09);
// Westelijke hoektraveeën met korte schilddaken (53 graden), nok op 10,3 en 10,5 m.
const westN=hipNS(-12.95,-7.55,3.2,9.85,-10.2,5.95,7.15,10.3,1.3);
const westS=hipNS(-12.95,-7.45,-11.4,-4.8,-10.2,-8.6,-7.6,10.5,1.3);
// Vier portalen met half schilddak tegen de langsgevels.
const porch=(x0,x1,yw,yf)=>{const s=Math.sign(yf-yw),lo=Math.min(yw,yf),hi=Math.max(yw,yf),out=s<0?[lo,hi+.3]:[lo-.3,hi];let w=box(x0,x1,out[0],out[1],BASE,3.3),r=box(x0,x1,out[0],out[1],3.25,6);r=plane(r,-.85,0,3.3+.85*x1);r=plane(r,.85,0,3.3-.85*x0);r=plane(r,0,-.85*s,3.3+.85*s*yf);return Manifold.union([w,r])};
const porches=[porch(-4.1,-.8,-11.4,-13.15),porch(4.95,8.47,-11.4,-13.25),porch(-4,-.73,9.85,11.75),porch(5.05,8.52,9.85,11.72)];
// Consistorie aan de oostzijde: schilddak (46 graden), goot 4,75 m, nok 8,3 m; lage platte aanbouw ten noorden van het koor.
const consist=Manifold.union([box(13.75,20.6,-8.7,2.3,BASE,4.75),hipNS(13.75,20.6,-8.7,2.3,17.21,-5.3,-1.1,8.3,1.03,1.03,4.75)]);
const flatAnnex=box(11.4,16.64,2.2,6.26,BASE,2.5);
let church=Manifold.union([body,nave,crossA,crossB,westN,westS,...porches,consist,flatAnnex]);
// Blinde spitsboognissen (0,35 m): vensters in de langsgevels, blindnissen in de portaalfronten.
const niche=(x,y,w,z0,z1,axis,dir)=>{const h=w/2*1.45,d=.35,p=[[-w/2,z0],[w/2,z0],[w/2,z1],[0,z1+h],[-w/2,z1]];let n=prism(p,-d,d).rotate([90,0,0]);if(axis==="x")n=n.rotate([0,0,90]);return n.translate([x,y,0])};
const cuts=[];
for(const x of [-10.2,-5.65,.75,3.6,9.9]){cuts.push(niche(x,-11.4,1.9,2.2,5.1));cuts.push(niche(x,9.85,1.9,2.2,5.1))}
for(const [x0,x1,yf] of [[-4.1,-.8,-13.15],[4.95,8.47,-13.25],[-4,-.73,11.75],[5.05,8.52,11.72]]){const c=(x0+x1)/2;for(const dx of [-.85,.85])cuts.push(niche(c+dx,yf,.9,.6,2.2))}
church=church.subtract(Manifold.union(cuts));

// Gotische toren (15e eeuw): drie geledingen met kleine terugsprongen, ingesnoerde naaldspits tot 38,5 m.
const TX0=-19.28,TX1=-13.17,TY0=-4.15,TY1=2.75,TC=[(TX0+TX1)/2,(TY0+TY1)/2],Z1=7,Z2=14,Z3=20;
const stage=(i,z0,z1)=>box(TX0+i,TX1-i,TY0+i,TY1-i,z0,z1);
const step=(i,j,z)=>Manifold.hull([[TX0+i,TY0+i,z],[TX1-i,TY0+i,z],[TX1-i,TY1-i,z],[TX0+i,TY1-i,z],[TX0+j,TY0+j,z+(j-i)],[TX1-j,TY0+j,z+(j-i)],[TX1-j,TY1-j,z+(j-i)],[TX0+j,TY1-j,z+(j-i)]]);
let tower=Manifold.union([stage(0,BASE,Z1),step(0,.15,Z1-.05),stage(.15,Z1,Z2),step(.15,.3,Z2-.05),stage(.3,Z2,Z3)]);
const tcuts=[];
const tn=(face,off,w,z0,z1)=>{const i=z0<Z1?0:z0<Z2?.15:.3;if(face==="W")return niche(TX0+i,TC[1]+off,w,z0,z1,"x");if(face==="E")return niche(TX1-i,TC[1]+off,w,z0,z1,"x");return niche(TC[0]+off,face==="N"?TY1-i:TY0+i,w,z0,z1)};
tcuts.push(tn("W",0,1.3,0,2.3),tn("W",0,1.5,3.2,5.6));
for(const f of ["W","S","N"])tcuts.push(tn(f,f==="N"?-.3:0,1.6,7.8,12.1));
for(const f of ["W","S","N","E"])for(const o of [-.85,.85])tcuts.push(tn(f,o,.9,14.7,18.4));
tower=tower.subtract(Manifold.union(tcuts));
const sq=(h,z)=>[[TC[0]-h,TC[1]-h,z],[TC[0]+h,TC[1]-h,z],[TC[0]+h,TC[1]+h,z],[TC[0]-h,TC[1]+h,z]];
const oct=(a,z)=>{const r=a/Math.cos(Math.PI/8);return Array.from({length:8},(_,k)=>[TC[0]+r*Math.cos(Math.PI/8+k*Math.PI/4),TC[1]+r*Math.sin(Math.PI/8+k*Math.PI/4),z])};
const top3=[[TX0+.3,TY0+.3,Z3-.05],[TX1-.3,TY0+.3,Z3-.05],[TX1-.3,TY1-.3,Z3-.05],[TX0+.3,TY1-.3,Z3-.05]];
const flare=Manifold.hull([...top3,...sq(1.95,21.2)]);
const broach=Manifold.hull([...sq(1.95,21.15),...oct(1.5,25.5)]);
const needle=Manifold.hull([...oct(1.5,25.45),...oct(.46,38.5)]);
// Traptoren tegen de noordmuur: halve achthoek tot 15,2 m met spits dakje.
const stairPoly=[[-15.36,2.3],[-15.36,3.74],[-14.42,4.56],[-13.23,4.57],[-12.67,4.04],[-12.67,2.3]];
const stair=Manifold.union([prism(stairPoly,BASE,15.2),Manifold.hull([...stairPoly.map(([x,y])=>[x,y,15.15]),[-14,3.35,17.9]])]);
church=Manifold.union([church,tower,flare,broach,needle,stair]);
const parts=[["building:kerk",church]];
const META={name:"Oude Kerk Lunteren",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,replacesBuildings:["NL.IMBAG.Pand.0228100000054819"],description:"Vijftiende-eeuwse toren met traptoren en ingesnoerde naaldspits, kerkzaal van 1858 met schip, twee dwarse schilddaken, portalen en consistorie; X oost, Y noord.",realWorld:{groundNapM:GROUND_NAP,eaveM:EAVE,ridgeM:12.6,towerCorniceM:Z3},sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0228100000054819","https://service.pdok.nl/rws/ahn/wcs/v1_0","https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0","https://monumentenregister.cultureelerfgoed.nl/monumenten/14480","https://reliwiki.nl/index.php/Lunteren,_Dorpsstraat_34_-_Oude_Kerk","https://nl.wikipedia.org/wiki/Oude_Kerk_(Lunteren)","https://commons.wikimedia.org/wiki/Category:Oude_Kerk_(Lunteren)"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  for(const[name,solid]of named){const m=solid.calculateNormals(0,40).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-oude-kerk-lunteren.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),volume:+church.volume().toFixed(1),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2))},null,2));
if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(parts));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,highestPointM:+bb.max[2].toFixed(2)}},null,2));
