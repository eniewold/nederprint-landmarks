// Rijnbrug bij Rhenen (Rhenen): doorlopende dekvlakken, stalen plaatliggers en pijlers.
// Broncontouren BGT, dekhoogten AHN; onderbouwschattingen in README.
import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const wasm=await Module();wasm.setup();const {Manifold,CrossSection,Mesh}=wasm;
const args=process.argv.slice(2),flag=(s,d)=>args.indexOf(s)>=0?args[args.indexOf(s)+1]:d;
const scale=Number(flag('--scale','1000')),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),'rijnbrug-rhenen');
const WATER_NAP=6.1,SLAB=1.5,ROAD_LAYER=.5;
const ccw=r=>r.reduce((a,p,i)=>a+p[0]*r[(i+1)%r.length][1]-p[1]*r[(i+1)%r.length][0],0)>0?r:[...r].reverse();
const section=r=>new CrossSection([ccw(r)]).simplify(.02),prism=(r,z,h)=>section(r).extrude(h).translate([0,0,z]);
const union=ss=>Manifold.union(ss.filter(s=>!s.isEmpty()));
const rect=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]];
const ORIGIN=[167993.0835, 440403.083];
const AXIS=[0.1726559794192197, 0.9849821890627211];
const DECK_RINGS=[[[267.3513562413206,-7.40387980621502],[267.31876015539007,7.2617377564793335],[86.13973042496706,7.366670792627373],[-267.23315837858536,7.424598523783236],[-267.3159976596665,-7.2774974714688305],[86.61324478859727,-7.277497471468829],[267.3513562413206,-7.40387980621502]],[[266.8040902887873,4.151162901499305],[266.80426844304424,4.306526887861821],[266.80457123237517,4.368510017183843],[261.0929443432964,4.373437482292169],[258.09057090094177,4.375084489481378],[258.08893781747213,4.314898668567486],[258.0865660891263,4.166256901524269],[258.07961219636724,3.759954497669832],[257.9476407275308,-3.624733006292186],[257.9139933410647,-4.122010447347261],[257.8905267917889,-4.48044498957202],[257.8803969082956,-4.625370437508324],[257.8806714716148,-4.638520517937522],[257.8805724970716,-4.724833843683477],[260.92899669770884,-4.7285611536727705],[266.7669051217539,-4.735718849902249],[266.76619177009604,-4.65056316231238],[266.76441975494,-4.478281822755511],[266.7602558491715,-4.118599098828361],[266.4166074036103,-4.133150589292453],[266.3556887865195,3.766974025034501],[266.80434542453736,3.7674443393963504],[266.8040902887873,4.151162901499305]]];
const ROAD_FOOTPRINTS=[{"id":"L0002.0c73418cca614f8c953b5fe3ae445217","rings":[[[267.3905480241107,4.344319119753878],[267.31876015539007,7.2617377564793335],[86.13973042496706,7.366670792627373],[86.23348226015986,4.457163172207664],[258.09057090094177,4.375084489481378],[261.0929443432964,4.373437482292169],[266.80457123237517,4.368510017183843],[267.3905480241107,4.344319119753878]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":null}},{"id":"L0002.a7b0078134f74f53adf8066226d45c93","rings":[[[86.61324478859727,-7.277497471468829],[267.3513562413206,-7.40387980621502],[267.34563036235613,-4.718540495404659],[266.7669051217539,-4.735718849902249],[260.92899669770884,-4.7285611536727705],[257.8805724970716,-4.724833843683477],[86.52898646679043,-4.676991263978365],[86.61324478859727,-7.277497471468829]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":null}},{"id":"P0025.091e6695208049cf939565c752ce7016","rings":[[[86.23348226015986,4.457163172207664],[86.13973042496706,7.366670792627373],[-32.73789355136884,7.38602891054184],[-32.74703844705106,4.51330801025647],[86.23348226015986,4.457163172207664]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.571e0b21994c4e108fbc51e2819da028","rings":[[[-32.74703844705106,4.51330801025647],[-32.73789355136884,7.38602891054184],[-132.73147235031004,7.402791362703255],[-132.73988703224623,4.560655863964092],[-32.74703844705106,4.51330801025647]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.65fa26ad900a431aa6fc43006cd75264","rings":[[[86.61324478859727,-7.277497471468829],[86.52898646679043,-4.676991263978365],[-32.773411170426066,-4.643764583087543],[-32.781760969318185,-7.2777631177899265],[86.61324478859727,-7.277497471468829]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.bf4cd936dfac44329e7997c05c4140cd","rings":[[[-132.73988703224623,4.560655863964092],[-132.73147235031004,7.402791362703255],[-267.23315837858536,7.424598523783236],[-267.24899726763744,4.624817259178814],[-132.73988703224623,4.560655863964092]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.c74e0dcb098a44a9bb728f55c31abad0","rings":[[[-132.7745472370075,-7.2771056925932465],[-132.76709187676622,-4.61483703268549],[-267.3009681640742,-4.577352269027181],[-267.3159976596665,-7.2774974714688305],[-132.7745472370075,-7.2771056925932465]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.e0d79df60b43496ba6992786a25a5d5a","rings":[[[-32.781760969318185,-7.2777631177899265],[-32.773411170426066,-4.643764583087543],[-132.76709187676622,-4.61483703268549],[-132.7745472370075,-7.2771056925932465],[-32.781760969318185,-7.2777631177899265]]],"attributes":{"bgt_functie":"fietspad","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0026.2f57ab922bd73c82e0531221500a01c3","rings":[[[257.8805724970716,-4.724833843683477],[257.8806714716148,-4.638520517937522],[257.8803969082956,-4.625370437508324],[257.8905267917889,-4.48044498957202],[257.9139933410647,-4.122010447347261],[260.94005730963,-4.125596260140578],[266.4166074036103,-4.133150589292453],[266.7602558491715,-4.118599098828361],[266.76441975494,-4.478281822755511],[266.76619177009604,-4.65056316231238],[266.7669051217539,-4.735718849902249],[267.3829379832553,-4.71707713508545],[267.3917910917928,-4.3216095353379975],[267.3997629507538,-0.24907255581847904],[267.4088583563195,3.9444757357522056],[267.3905480241107,4.344319119753878],[266.80457123237517,4.368510017183843],[266.80426844304424,4.306526887861821],[266.8040902887873,4.151162901499305],[266.80434542453736,3.7674443393963504],[266.3556887865195,3.766974025034501],[261.080310032618,3.762074763303104],[258.07961219636724,3.759954497669832],[258.0865660891263,4.166256901524269],[258.08893781747213,4.314898668567486],[258.09057090094177,4.375084489481378],[86.23348226015986,4.457163172207664],[86.3764876067535,0.044586660574247976],[86.52898646679043,-4.676991263978365],[257.8805724970716,-4.724833843683477]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":null}},{"id":"P0025.07f39b3714a94607bf77c6d12902f9cb","rings":[[[-32.760166890396725,0.035798921044837624],[-32.74703844705106,4.51330801025647],[-132.73988703224623,4.560655863964092],[-132.75336921862484,0.027246194565090268],[-32.760166890396725,0.035798921044837624]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.4ef741403000447c916d688bd40e26ad","rings":[[[86.3764876067535,0.044586660574247976],[86.23348226015986,4.457163172207664],[-32.74703844705106,4.51330801025647],[-32.760166890396725,0.035798921044837624],[86.3764876067535,0.044586660574247976]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.7f3f44b9c7914931b9ce2724d0006a27","rings":[[[-32.773411170426066,-4.643764583087543],[-32.760166890396725,0.035798921044837624],[-132.75336921862484,0.027246194565090268],[-132.76709187676622,-4.61483703268549],[-32.773411170426066,-4.643764583087543]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.82a1953a87ce49f9bc828ced053bfa7a","rings":[[[-132.75336921862484,0.027246194565090268],[-132.73988703224623,4.560655863964092],[-267.24899726763744,4.624817259178814],[-267.27484543416506,0.017157454851910666],[-132.75336921862484,0.027246194565090268]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.a07333c14d5e4baaa0e4477c8928dd69","rings":[[[-132.76709187676622,-4.61483703268549],[-132.75336921862484,0.027246194565090268],[-267.27484543416506,0.017157454851910666],[-267.3009681640742,-4.577352269027181],[-132.76709187676622,-4.61483703268549]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}},{"id":"P0025.f47be9f04bfe49a8bbf2d8f5c376af48","rings":[[[86.52898646679043,-4.676991263978365],[86.3764876067535,0.044586660574247976],[-32.760166890396725,0.035798921044837624],[-32.773411170426066,-4.643764583087543],[86.52898646679043,-4.676991263978365]]],"attributes":{"bgt_functie":"rijbaan regionale weg","bgt_fysiekvoorkomen":"gesloten verharding","plus_fysiekvoorkomen":"asfalt"}}];
const BGT_SUPPORTS=[{"id":"P0025.1393fdb4e2434089b30d6870b10032ef","ring":[[-264.1453535551201,-7.289243203398417],[-264.13690955659416,0.024044272093535764],[-264.1278486155823,7.420690126738564],[-265.4113683859347,7.422103996917608],[-267.23315837858536,7.424598523783236],[-267.24899726763744,4.624817259178814],[-267.2536325839683,3.7651059623915426],[-267.27484543416506,0.017157454851910666],[-267.2947056298083,-3.46049830335135],[-267.3009681640742,-4.577352269027181],[-267.3159976596665,-7.2774974714688305],[-264.1453535551201,-7.289243203398417]],"index":6},{"id":"L0002.66a3c8707dbe49de98bdbf2e736a304e","ring":[[-121.19754352385826,7.016390241803204],[-120.31949803703786,-8.169062208588965],[-118.29863423653795,-7.992496357255864],[-119.00413518430125,7.2221859073254775],[-121.19754352385826,7.016390241803204]],"index":12},{"id":"L0002.915ca80096b24fc0a6a0c7b5bb7b1fa0","ring":[[-21.68323279224863,7.532887688390486],[-21.33188701157044,-7.462650519415772],[-19.332953085933955,-7.41581932263048],[-19.684298866612146,7.579718885175779],[-21.68323279224863,7.532887688390486]],"index":13},{"id":"L0002.b93306d4e71e4ec99762f705130ac4de","ring":[[-170.09725338194758,6.79828751746286],[-169.95138397696644,-8.200780424134198],[-167.95155561267913,-8.182219352554274],[-168.09759767363784,6.817833571221295],[-170.09725338194758,6.79828751746286]],"index":14},{"id":"L0002.b9442e10316c4a2fa18f583d306e48ee","ring":[[-72.87272675064798,7.427127181761473],[-72.3456776695843,-7.562993440375502],[-70.34677490270074,-7.492817029334738],[-70.87480896600027,7.497130936814616],[-72.87272675064798,7.427127181761473]],"index":15},{"id":"L0002.e2e2592ec8c943dd90d6a15c7496635d","ring":[[24.682529580149524,-4.812182122084577],[25.0380791954721,-6.84634299847896],[25.40877597960625,-7.744833340221227],[25.821020170010883,-8.480708144452581],[26.63380936483384,-8.88951460814587],[27.55214708041882,-9.043267136828494],[28.438860158552075,-8.738595318090637],[29.1375431786016,-8.125760073108108],[29.35094083251789,-7.1248847355814195],[28.851187891029696,8.178655606368215],[28.009259425516586,8.788449390296524],[26.64295019755475,8.781442707304874],[25.818260205915475,8.157687613024352],[25.072420477639753,6.835050814876807],[24.81682291989762,4.395280356740286],[24.799676102764327,-0.8585816500954871],[24.682529580149524,-4.812182122084577]],"index":18}];
// Continu NAP-wegprofiel: AHN-medianen, uitschieters van voertuigen en
// schaduw-/gatmetingen op de rijbanen verwijderd, zie README.
const PROFILE=[[-268, 18.29], [-260, 18.455], [-220, 19.292], [-180, 20.107], [-140, 20.906], [-100, 21.684], [-60, 22.433], [-20, 23.26], [20, 23.932], [40, 24.174], [60, 24.302], [100, 24.256], [140, 24.261], [150, 24.23], [170, 24.05], [200, 23.65], [220, 23.24], [240, 22.87], [260, 22.48], [268, 22.3]];
function interpolate(points,x,index=1){let i=points.findIndex(p=>p[0]>x)-1;if(i<0)i=x<points[0][0]?0:points.length-2;i=Math.min(points.length-2,i);const [a,b]=[points[i],points[i+1]];return a[index]+(b[index]-a[index])*Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));}
const top=x=>interpolate(PROFILE,x)-WATER_NAP;
function limits(x){const ys=[];for(const ring of DECK_RINGS)for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if(Math.min(a[0],b[0])<=x&&x<Math.max(a[0],b[0]))ys.push(a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]));}if(!ys.length)return x<0?limits(-266):limits(266);return [Math.min(...ys),Math.max(...ys)];}
// Noordelijke rivierpijler uit BGT; zuidelijke positie geschat op 120,7 m afstand.
const RIVER_PIERS=[27,170.5];
function depth(x){return 2.6+1.5*Math.max(0,Math.min(1,(x+18)/45,(215.5-x)/45))+.7*Math.max(0,1-Math.min(...RIVER_PIERS.map(p=>Math.abs(x-p)))/45)**2;}
function loftX(stations,sectionAt){const verts=[],tris=[],n=sectionAt(stations[0]).length;for(const x of stations)for(const [y,z]of sectionAt(x))verts.push(x,y,z);for(let i=0;i<stations.length-1;i++)for(let j=0;j<n;j++){const a=i*n+j,b=i*n+(j+1)%n,c=(i+1)*n+(j+1)%n,d=(i+1)*n+j;tris.push(a,b,c,a,c,d);}for(let j=1;j<n-1;j++){tris.push(0,j+1,j);const k=(stations.length-1)*n;tris.push(k,k+j,k+j+1);}return new Manifold(new Mesh({numProp:3,vertProperties:Float32Array.from(verts),triVerts:Uint32Array.from(tris)}));}
const stations=[...new Set([...Array.from({length:280},(_,i)=>-268+i*536/279),...PROFILE.map(p=>p[0]),...DECK_RINGS.flatMap(r=>r.flatMap(p=>[p[0]-.001,p[0],p[0]+.001])),-18,27,72,125.5,170.5,215.5])].sort((a,b)=>a-b);
const footprint=CrossSection.union(DECK_RINGS.map(section));
const deck=footprint.extrude(SLAB).translate([0,0,-SLAB]).refineToLength(3).warp(v=>{v[2]+=top(v[0]);});
const mask=footprint.extrude(40);
// Twee plaatliggers; geen gesloten koker onder de volledige dekbreedte.
const kokers=[-3.3,3.3].map(c=>loftX(stations,x=>[[c-.475,top(x)-depth(x)],[c+.475,top(x)-depth(x)],[c+.475,top(x)-SLAB+.1],[c-.475,top(x)-SLAB+.1]]).intersect(mask));
const ESTIMATED_PIERS=[-217,170.5,219,266];
const estimated=ESTIMATED_PIERS.map(x=>{const [lo,hi]=limits(x);return prism(rect(x-2.3,lo-.5,x+2.3,hi+.5),0,top(x)-SLAB+.2).intersect(mask);});
const piers=BGT_SUPPORTS.map(({ring})=>{const x=ring.reduce((s,p)=>s+p[0]/ring.length,0);return prism(ring,0,Math.max(.1,top(x)-SLAB+.2));}).filter(s=>!s.isEmpty());
const whole=union([deck,...kokers,...piers,...estimated]);
const layer=deck.subtract(deck.translate([0,0,-ROAD_LAYER]));let rest=footprint;const parts=[];
for(const {id,rings,attributes}of ROAD_FOOTPRINTS){const area=rest.intersect(CrossSection.union(rings.map(section))),road=layer.intersect(area.extrude(40));if(road.isEmpty()||road.volume()<.005)continue;parts.push([`road:${attributes.bgt_functie}-${id.split('.')[1]}`,road,attributes]);rest=rest.subtract(area);}
// Niet als wegdeel geregistreerde dekranden en middenberm blijven constructie.
const roadAreas=CrossSection.union(ROAD_FOOTPRINTS.flatMap(r=>r.rings.map(section))).intersect(footprint);
const roadStrip=deck.translate([0,0,1]).subtract(deck.translate([0,0,-ROAD_LAYER])).intersect(roadAreas.extrude(40));
parts.push(['building:plaatliggers-pijlers-en-dekranden',whole.subtract(roadStrip)]);
const delta=parts.reduce((sum,[,s])=>sum+s.volume(),0)-whole.volume();if(Math.abs(delta)>Math.max(.05,whole.volume()*1e-6))throw Error('Volumepartitie '+delta);
for(const [name,s]of parts)if(s.status()!=='NoError')throw Error(name+': '+s.status());
// Twee doorlopende printwanden volgen de bocht; de schouders zijn 43 graden.
// De brede voet aan lage landhoofden voorkomt vrije horizontale ondervlakken.
const feet=[0,1].map(side=>loftX(stations,x=>{const [lo,hi]=limits(x),mid=(lo+hi)/2,a=side?mid-3:lo-3,b=side?hi+3:mid+3,c=(a+b)/2,ceiling=top(x)-SLAB+.2,root=Math.max(.05,ceiling-((b-a)/2-.5)/Math.tan(43*Math.PI/180)),wall=Math.max(.5,(b-a)/2-(ceiling-root)*Math.tan(43*Math.PI/180));return [[c-wall,0],[c+wall,0],[c+wall,root],[b,ceiling],[b,top(x)-.25],[a,top(x)-.25],[a,ceiling],[c-wall,root]];}));
const endFeet=footprint.offset(.5).extrude(1).refineToLength(3).warp(v=>{v[2]*=top(v[0])-.25;}).intersect(union([prism(rect(-270,-12,-250,12),0,40),prism(rect(250,-12,270,12),0,40)]));
const combined=union([whole,endFeet,...feet.map(f=>f.intersect(mask))]);
console.log("feet",endFeet.status(),endFeet.volume(),endFeet.boundingBox(),"whole",whole.status(),"combined",combined.status()); const printModel=union(combined.decompose().filter(s=>s.volume()>1e-6)).simplify(.001);
if(printModel.status()!=='NoError'||printModel.decompose().filter(s=>s.volume()>1e-6).length!==1)throw Error('STL niet verbonden');
const mesh=printModel.getMesh();let maxSliver=0;
for(let i=0;i<mesh.triVerts.length;i+=3){const ps=[0,1,2].map(k=>Array.from(mesh.vertProperties.slice(mesh.triVerts[i+k]*mesh.numProp,mesh.triVerts[i+k]*mesh.numProp+3))),u=ps[1].map((v,k)=>v-ps[0][k]),v=ps[2].map((v,k)=>v-ps[0][k]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);if(n[2]<-.7072*len&&Math.min(...ps.map(p=>p[2]))>.001){const longest=Math.max(...[0,1,2].map(k=>Math.hypot(...ps[k].map((v,a)=>v-ps[(k+1)%3][a])))),altitude=len/longest;maxSliver=Math.max(maxSliver,altitude*mmPerMetre);if(altitude*mmPerMetre>.05)throw Error('STL vrije overhang '+altitude+' '+JSON.stringify(ps));}}
console.log('STL',printModel.status(),'max snijsliver',maxSliver);
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir,{recursive:true});await writeFile(path.join(outDir,'rijnbrug-rhenen.glb'),toGlb(parts,'NederPrint generate-rijnbrug-rhenen.mjs'));
await writeFile(path.join(outDir,`rijnbrug-rhenen-1-${scale}.stl`),toStl(printModel,`Rijnbrug bij Rhenen Rhenen 1:${scale} geïntegreerde printvoet`).buffer);
const entry={name:'Rijnbrug bij Rhenen',file:'rijnbrug-rhenen.glb',crs:'EPSG:28992',origin:ORIGIN,xAxis:AXIS,unitsPerMetre:1,className:'building',groundOffsetMetres:0,groundHeight:49.5394,groundSamplePoints:[[80,-35],[80,35],[110,-35],[110,35]],replacesTerrain:["P0026.2f57ab9229cd3c82e0531221500a01c3", "P0025.278580eedc0244d488c1c3815437368d"],printFiles:[`rijnbrug-rhenen-1-${scale}.stl`],description:'Volledige BGT-brugcontour en afzonderlijke fietspaden/rijbaan, doorlopend AHN-dekprofiel, twee stalen plaatliggers met haunches en BGT-pijlers; noordelijke AHN-gaten tussen meetbare wegvlakken geïnterpoleerd. Waterbasis geschat NAP +6,1 m, PDOK ellipsoïde 49,5394 m; ontbrekende pijlers en liggerdiepten geschat. Noordelijke PDOK-aanloop lager dan het gemeten wegdek.',realWorld:{deckNapM:PROFILE,waterNapM:WATER_NAP,riverPiersX:RIVER_PIERS,estimatedPiersX:ESTIMATED_PIERS,estimatedGirderDepthM:[2.6,4.8],girderWidthM:.95,slabM:SLAB},sources:['https://repository.officiele-overheidspublicaties.nl/externebijlagen/exb-2019-48859/1/bijlage/exb-2019-48859.pdf','https://nl.wikipedia.org/wiki/Rijnbrug_bij_Rhenen','https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items','https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/Category:Rijnbrug_Rhenen']};
await writeFile(path.join(outDir,'rijnbrug-rhenen.json'),JSON.stringify(entry,null,2)+'\n');console.log(JSON.stringify({parts:parts.map(([name,s])=>({name,status:s.status(),volumeM3:s.volume(),triangles:s.numTri()})),partitionDifferenceM3:delta,stlBounds:printModel.boundingBox()},null,2));
