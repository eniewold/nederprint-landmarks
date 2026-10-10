// Spoorbrug Maastricht: boogbrug, geheven westelijke tafelbrug en plaatliggeraanbruggen.
// Broncontouren BGT, dekhoogten AHN; onderbouwschattingen in README.
import Module from 'manifold-3d';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const wasm=await Module();wasm.setup();const {Manifold,CrossSection,Mesh}=wasm;
const args=process.argv.slice(2),flag=(s,d)=>args.indexOf(s)>=0?args[args.indexOf(s)+1]:d;
const scale=Number(flag('--scale','1000')),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag('--out',path.join(import.meta.dirname,'../models'))),'spoorbrug-maastricht');
const WATER_NAP=44.15,SLAB=1.5,ROAD_LAYER=.5;
const ccw=r=>r.reduce((a,p,i)=>a+p[0]*r[(i+1)%r.length][1]-p[1]*r[(i+1)%r.length][0],0)>0?r:[...r].reverse();
const section=r=>new CrossSection([ccw(r)]).simplify(.02),prism=(r,z,h)=>section(r).extrude(h).translate([0,0,z]);
const union=ss=>Manifold.union(ss.filter(s=>!s.isEmpty()));
const rect=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]];
const ORIGIN=[176844.5255, 318798.42949999997];
const AXIS=[0.948251835419329, -0.31751922244782893];
const DECK_RINGS=[[[86.9090024389557,-3.052165061777496],[89.33446285004523,-3.0457002139876197],[91.88325197555858,-3.039067438679067],[108.20962220635249,-3.1477554634046316],[108.1850044376258,2.6230568680864157],[88.96662208753759,2.3454873336679753],[86.27804922386763,2.3468861549146194],[83.98001944210436,2.3472356090380635],[83.39562934990735,2.3477048011764157],[82.63731414763515,2.347937172614164],[67.43116199585626,2.3550601667959197],[43.21123956706177,2.366353646295108],[-23.859578478483545,2.448321328661869],[-63.032382590052876,2.255209862106176],[-63.06496345671562,3.4233119497520357],[-107.85307951623587,3.2671426911060486],[-107.86175113879872,0.57824369658075],[-108.23680036629382,0.5802628446796102],[-108.24482403289511,-2.1200194777555526],[-107.87009232461905,-2.1210903740291496],[-107.87510567649993,-3.5485506594142024],[-92.28616438494421,-3.435934460112127],[-91.64801992818705,-3.4331681784037227],[-85.9414013430991,-3.4089540455161744],[-83.91534010549586,-3.4001869770269524],[-65.65327244053063,-3.324724401958529],[45.82344297572666,-3.32472440195853],[65.32771415811187,-3.293107252249744],[85.56661896952829,-3.0555740247859307],[86.09345307817274,-3.0542242182667945],[86.9090024389557,-3.052165061777496]]];
const ROAD_FOOTPRINTS=[{"id":"L0004.21311ee1461746039f613c0a52ed82e1","rings":[[[108.20962220635249,-3.1477554634046316],[108.1850044376258,2.6230568680864157],[88.96662208753759,2.3454873336679753],[86.27804922386763,2.3468861549146194],[83.98001944210436,2.3472356090380635],[83.39562934990735,2.3477048011764157],[82.63731414763515,2.347937172614164],[67.43116199585626,2.3550601667959197],[43.21123956706177,2.366353646295108],[-23.859578478483545,2.448321328661869],[-63.032382590052876,2.255209862106176],[-63.06496345671562,3.4233119497520357],[-107.85307951623587,3.2671426911060486],[-107.86175113879872,0.57824369658075],[-108.23680036629382,0.5802628446796102],[-108.24482403289511,-2.1200194777555526],[-107.87009232461905,-2.1210903740291496],[-107.87510567649993,-3.5485506594142024],[-92.28616438494421,-3.435934460112127],[-91.64801992818705,-3.4331681784037227],[-85.9414013430991,-3.4089540455161744],[-83.91534010549586,-3.4001869770269524],[-65.65327244053063,-3.324724401958529],[45.82344297572666,-3.32472440195853],[65.32771415811187,-3.293107252249744],[85.56661896952829,-3.0555740247859307],[86.09345307817274,-3.0542242182667945],[86.9090024389557,-3.052165061777496],[89.33446285004523,-3.0457002139876197],[91.88325197555858,-3.039067438679067],[108.20962220635249,-3.1477554634046316]]],"attributes":{"bgt_functie":"spoorbaan","bgt_fysiekvoorkomen":"half verhard","plus_fysiekvoorkomen":null}}];
const BGT_SUPPORTS=[{"id":"L0002.1a23d5b5e47f475dbfb36a430bbba5b9","ring":[[-58.98386578262065,8.86894017566054],[-59.81024316246301,9.387377660828962],[-60.57502500666117,9.49195648660927],[-61.117013921338526,9.472877273630951],[-61.81584968902661,9.219891958280611],[-62.64656343633592,8.51040998526659],[-63.14208786754635,7.577811176507858],[-63.34440441334499,6.597861169988671],[-63.2149797173825,-4.84625606323074],[-62.65817490150954,-5.721765855925347],[-61.961076178176974,-6.515497781635419],[-61.33613612911407,-7.0338933208647125],[-60.906499430361436,-7.180038136266839],[-60.20720405098234,-7.0323561388309965],[-59.44034819517675,-6.569935230549996],[-58.61231238830598,-5.751674451493513],[-58.29106933886784,-4.789903739108085],[-58.23213208031953,6.967219522965032],[-58.466509742975106,7.9348744775773445],[-58.98386578262065,8.86894017566054]],"index":153},{"id":"L0002.4ed45f8289f64b91844dd70bff7dc383","ring":[[39.38575064404306,7.533054673048369],[39.15029458575648,7.899242390807071],[38.51342978638741,8.582376511807956],[37.60971119704622,9.234156928299702],[36.54409670025484,9.412007270617602],[35.28410460708131,9.282219270092842],[34.43436984724015,8.607496484089406],[34.099958917917654,7.562223634364274],[34.236954019945635,6.583051871070859],[38.15630767480559,-3.1881181165565136],[38.784421947275625,-4.412014133723677],[39.79627472369093,-5.7489135161735385],[41.257791520203995,-6.844551071932523],[41.902313308714014,-7.112783553362518],[42.76850101113332,-6.909218172773712],[43.51685463538318,-6.328553163451705],[44.00792518581687,-5.37635427951959],[44.175170443533474,-4.650699386488685],[43.982177925586434,-3.8853740386569444],[39.38575064404306,7.533054673048369]],"index":155},{"id":"L0002.5637000a543b42fcbec806e97f3bf646","ring":[[73.2118575392479,7.430169725672448],[72.88749609871314,8.061867957329099],[72.50376509407907,8.401606851327339],[71.70183238851172,8.850191219927776],[70.66897292930993,9.12548440454791],[69.9446753421462,8.992631082317256],[69.25939497922488,8.53854317870654],[69.00165896775931,7.617019902636582],[69.15612082048992,6.815592091747667],[73.87656463725868,-4.875572571075724],[74.41229581464734,-5.370056246790005],[75.42921264409715,-6.013460600200278],[76.22863422435537,-6.243534799150569],[77.01775629053752,-6.109012069972037],[77.67619822369832,-5.685002375864911],[77.98687924680836,-5.094814014510506],[78.03619792273983,-4.388609604878935],[77.85887579830404,-3.7519677399127764],[73.2118575392479,7.430169725672448]],"index":157},{"id":"L0002.ee7575eccdaf47e68d1630676167d999","ring":[[-26.598764997037353,9.661864578473061],[-27.140753911723827,9.642785365430306],[-27.83958967943039,9.38980005013516],[-28.6703034267397,8.680318077121138],[-29.165827857950138,7.747719268362409],[-29.368144403748776,6.767769261843224],[-29.2387197077678,-4.676347971431385],[-28.681914891913326,-5.551857764070796],[-27.98481616858076,-6.34558968978087],[-27.359876119517857,-6.86398522901016],[-26.930239420746734,-7.010130044467484],[-26.230944041367646,-6.86244804703164],[-25.46408818558054,-6.400027138695445],[-24.636052378691286,-5.581766359694159],[-24.314809329253148,-4.619995647308729],[-24.25587207070484,7.137127614764389],[-24.490249733378892,8.104782569431894],[-25.00760577300595,9.038848267459894],[-25.833983152866796,9.557285752683512],[-26.598764997037353,9.661864578473061]],"index":159},{"id":"L0002.fda40332d15541488ecb6541fa33a5d3","ring":[[-89.10641192565313,-4.655407419008435],[-88.7916417615952,-4.9781638966064286],[-88.30558248187866,-4.990467416654174],[-87.89986417712281,-4.756538672806795],[-87.45624705207234,-4.254713158951729],[-87.16237301859698,-3.630078823964667],[-86.97405204124172,-2.8224921663892566],[-86.79357155322383,0.9563626592915538],[-86.76717787997175,2.4742932815448024],[-86.90441077156672,2.9313721953845406],[-87.45417307636987,3.5118507980767064],[-88.05271166582348,3.9167564129698578],[-88.44424605785626,3.949111008135321],[-89.44308456493799,3.392138264817371],[-89.7230997042851,2.8079999920540244],[-89.86074161401713,-3.6340692178150333],[-89.85820146022779,-3.641655232527531],[-89.3566655494274,-3.6403398726361957],[-89.10641192565313,-4.655407419008435]],"index":161},{"id":"L0004.1431ad498e91438a8889d77c2cf2db9f","ring":[[106.19255624635812,-5.350184330154901],[106.4879221788337,-5.356739169837067],[108.21901250814584,-5.399286458614653],[108.20962220635249,-3.1477554634046316],[108.1850044376258,2.6230568680864157],[108.17686379589246,4.6535461514839955],[106.54479529334161,4.664921692944598],[106.07329453371642,4.668390650544818],[106.1665354940482,-3.1938606252086554],[106.19255624635812,-5.350184330154901]],"index":162},{"id":"L0004.baaaafef1627456cab3360d021c09f70","ring":[[-108.23680036629382,0.5802628446796102],[-108.24482403289511,-2.1200194777555526],[-107.87009232461905,-2.1210903740291496],[-107.87510567649993,-3.5485506594142024],[-107.88165592330421,-5.705234941889539],[-105.67630188967927,-5.690215410727221],[-105.72920929711235,2.0452833324942015],[-105.74491553669593,4.2904811665678775],[-107.85001641917988,4.268957353344754],[-107.85307951623587,3.2671426911060486],[-107.86175113879872,0.57824369658075],[-108.23680036629382,0.5802628446796102]],"index":174}];

// Drie dekvlakken met een echte hoogtesprong aan de tafelbrug, geen hoogteplakken.
const PROFILE=[[-109,51.59],[-90,51.72],[-61,51.78],[-27,51.78],[40,51.8],[75,51.7],[100,51.5],[109,51.4]];
function interpolate(points,x,index=1){let i=points.findIndex(p=>p[0]>x)-1;if(i<0)i=x<points[0][0]?0:points.length-2;i=Math.min(points.length-2,i);const [a,b]=[points[i],points[i+1]];return a[index]+(b[index]-a[index])*Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));}
const top=x=>interpolate(PROFILE,x)-WATER_NAP;
function limits(x){const ys=[];for(const ring of DECK_RINGS)for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if(Math.min(a[0],b[0])<=x&&x<Math.max(a[0],b[0]))ys.push(a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]));}if(!ys.length)return x<0?limits(-107):limits(107);return [Math.min(...ys),Math.max(...ys)];}
function loftX(stations,sectionAt){const verts=[],tris=[],n=sectionAt(stations[0]).length;for(const x of stations)for(const [y,z]of sectionAt(x))verts.push(x,y,z);for(let i=0;i<stations.length-1;i++)for(let j=0;j<n;j++){const a=i*n+j,b=i*n+(j+1)%n,c=(i+1)*n+(j+1)%n,d=(i+1)*n+j;tris.push(a,b,c,a,c,d);}for(let j=1;j<n-1;j++){tris.push(0,j+1,j);const k=(stations.length-1)*n;tris.push(k,k+j,k+j+1);}return new Manifold(new Mesh({numProp:3,vertProperties:Float32Array.from(verts),triVerts:Uint32Array.from(tris)}));}

const TABLE=[-60.8,-26.8],TABLE_NAP=53.22,ARCH_ENDS=[-26.8,39.15],ARCH_CROWN_NAP=64.05,TRUSS_Y=[-2.65,2.65],TRUSS_WIDTH=1.5;
const footprint=CrossSection.union(DECK_RINGS.map(section)),mask=footprint.extrude(40);
const bands=[[-110,TABLE[0],'west'],[...TABLE,'tafel'],[TABLE[1],110,'oost']];
const level=(x,label)=>label==='tafel'?TABLE_NAP-WATER_NAP:top(x);
const decks=bands.map(([a,b,label])=>({a,b,label,area:footprint.intersect(section(rect(a,-20,b,20)))})).map(s=>({...s,solid:s.area.extrude(SLAB).translate([0,0,-SLAB]).refineToLength(2).warp(v=>{v[2]+=level(v[0],s.label);})}));
const deck=union(decks.map(s=>s.solid));
const stations=(a,b)=>[...new Set([a,b,...Array.from({length:Math.ceil((b-a)/2)},(_,i)=>a+(b-a)*i/Math.ceil((b-a)/2)),...PROFILE.map(p=>p[0]).filter(x=>x>a&&x<b),...DECK_RINGS.flatMap(r=>r.flatMap(p=>[p[0]-.001,p[0],p[0]+.001])).filter(x=>x>a&&x<b)])].sort((a,b)=>a-b);
const plateGirders=decks.flatMap(s=>[-2.65,2.65].map(y=>loftX(stations(s.a,s.b),x=>[[y-.75,level(x,s.label)-2.1],[y+.75,level(x,s.label)-2.1],[y+.75,level(x,s.label)+1.95],[y-.75,level(x,s.label)+1.95]]).intersect(mask)));
// Historische brede BGT-voeten; tweedelige, naar boven versmallende pijlerkoppen uit de schuine foto's.
const piers=BGT_SUPPORTS.flatMap(({ring,index})=>{
 const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]),a=Math.min(...xs),b=Math.max(...xs),x=(a+b)/2;
 const high=top(x)-SLAB+.2+(x>-64&&x<-24?TABLE_NAP-51.78:0);
 if(index===162||index===174||index===161)return [prism(ring,0,high)];
 const base=prism(ring,0,1.3),shafts=[[-7,-.9],[.9,9]].map(([lo,hi])=>{
  const lower=section(ring).intersect(section(rect(a-1,lo,b+1,hi))),upper=lower.offset(-.5);
  return Manifold.hull([lower.extrude(.1).translate([0,0,1.2]),upper.extrude(.1).translate([0,0,high-.1])]);
 });return [base,...shafts];
});
const profileY=(poly,y0,y1)=>section(poly).extrude(y1-y0).rotate([90,0,0]).translate([0,y1,0]);
function crown(x){const [a,b]=ARCH_ENDS,u=(x-(a+b)/2)/((b-a)/2);return 53.73-WATER_NAP+(ARCH_CROWN_NAP-53.73)*(1-u*u);}
const arches=TRUSS_Y.map(y=>{
 const [a,b]=ARCH_ENDS,xs=Array.from({length:65},(_,i)=>a+(b-a)*i/64),outline=[[a,top(a)-.2],[b,top(b)-.2],...xs.toReversed().map(x=>[x,crown(x)])];
 let wall=profileY(outline,y-.75,y+.75);
 // Verticale hangers worden herkenbaar in twaalf blinde spitsnissen; 0,9 m kern.
 for(let j=0;j<12;j++){
  const l=a+(b-a)*j/12+1,r=a+(b-a)*(j+1)/12-1,m=(l+r)/2,z=top(m)+2.7,h=Math.min(crown(l),crown(r))-.95,shoulder=h-(r-l)/2*1.35;
  if(shoulder<z+.5)continue;
  const opening=[[l,z],[r,z],[r,shoulder],[m,h],[l,shoulder]];
  wall=wall.subtract(profileY(opening,y-.76,y-.45)).subtract(profileY(opening,y+.45,y+.76));
 }return wall.intersect(mask);
});
// Bedienhuisjes naast de tafelbrug; grondmaten en hoogte uit foto's geschat.
const huts=TABLE.map(x=>prism(rect(x-1.2,3.8,x+1.2,6.2),0,TABLE_NAP-WATER_NAP+2.3));
const roadClearance=union(decks.map(s=>s.area.intersect(section(rect(-111,-1.88,111,1.88))).extrude(40).refineToLength(2).warp(v=>{v[2]+=level(v[0],s.label)-ROAD_LAYER-.02;})));
const whole=union([deck,...plateGirders,...piers.map(s=>s.subtract(roadClearance)),...arches,...huts]);
const guards=union(TRUSS_Y.map(y=>prism(rect(-110,y-.77,110,y+.77),0,40)));
const parts=[],roadStrips=[];
for(const s of decks)for(const {id,rings,attributes}of ROAD_FOOTPRINTS){
 const area=s.area.intersect(CrossSection.union(rings.map(section))),layer=s.solid.subtract(s.solid.translate([0,0,-ROAD_LAYER])).intersect(area.extrude(40)).subtract(guards);
 if(layer.isEmpty())continue;
 parts.push([`road:spoorbaan-${s.label}`,layer,attributes]);roadStrips.push(s.solid.translate([0,0,1]).subtract(s.solid.translate([0,0,-ROAD_LAYER])).intersect(area.extrude(40)).subtract(guards));
}
parts.push(['building:boogbrug-tafelbrug-pijlers-en-bedienhuisjes',whole.subtract(union(roadStrips))]);
const delta=parts.reduce((sum,[,s])=>sum+s.volume(),0)-whole.volume();if(Math.abs(delta)>Math.max(.05,whole.volume()*1e-6))throw Error('Volumepartitie '+delta);
for(const [name,s]of parts)if(s.status()!=='NoError')throw Error(name+': '+s.status());
const feet=decks.flatMap(s=>[0,1].map(side=>loftX(stations(s.a,s.b),x=>{
 const [lo,hi]=limits(x),mid=(lo+hi)/2,a=side?mid-3:lo-3,b=side?hi+3:mid+3,c=(a+b)/2,ceiling=level(x,s.label)-SLAB+.2,root=Math.max(.05,ceiling-((b-a)/2-.5)/Math.tan(35*Math.PI/180)),wall=Math.max(.5,(b-a)/2-(ceiling-root)*Math.tan(35*Math.PI/180));
 return [[c-wall,0],[c+wall,0],[c+wall,root],[b,ceiling],[b,level(x,s.label)-.25],[a,level(x,s.label)-.25],[a,ceiling],[c-wall,root]];
}).intersect(mask)));
const endFeet=footprint.offset(.5).extrude(1).refineToLength(2).warp(v=>{v[2]*=top(v[0])-.25;}).intersect(union([prism(rect(-111,-12,-98,12),0,40),prism(rect(98,-12,111,12),0,40)]));
const printModel=union([whole,endFeet,...feet]).simplify(.001);
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

await mkdir(outDir,{recursive:true});await writeFile(path.join(outDir,'spoorbrug-maastricht.glb'),toGlb(parts,'NederPrint generate-spoorbrug-maastricht.mjs'));
await writeFile(path.join(outDir,`spoorbrug-maastricht-1-${scale}.stl`),toStl(printModel,`Spoorbrug Maastricht Maastricht 1:${scale} geïntegreerde printvoet`).buffer);
const entry={name:'Spoorbrug Maastricht',file:'spoorbrug-maastricht.glb',crs:'EPSG:28992',origin:ORIGIN,xAxis:AXIS,unitsPerMetre:1,className:'building',groundOffsetMetres:0,groundHeight:89.81573,groundSamplePoints:[[0,-25],[0,25],[20,-25],[20,25]],replacesTerrain:["L0004.186e17215ab442e4be521be52d123632"],printFiles:[`spoorbrug-maastricht-1-${scale}.stl`],description:'Actueel BGT-dek van 216,45 m met afzonderlijke geheven tafelbrug op NAP +53,22 m, spoorvlak circa +51,8 m en boogkruin +64,05 m uit AHN; twee printbare boogschermen met blinde hangernissen, plaatliggers, historische brede pijlers en geschatte bedienhuisjes. Waterbasis NAP +44,15 m, PDOK-ellipsoïde +89,81573 m; diktes en pijleropstand vereenvoudigd.',realWorld:{deckNapM:PROFILE,tableNapM:TABLE_NAP,archEndsX:ARCH_ENDS,archCrownNapM:ARCH_CROWN_NAP,waterNapM:WATER_NAP,trussWidthM:TRUSS_WIDTH,slabM:SLAB},sources:['https://nl.wikipedia.org/wiki/Spoorbrug_Maastricht','https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items','https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:2021_Maastricht,_F_Romanusweg,_Spoorbrug_(2a)_(cropped).jpg']};
await writeFile(path.join(outDir,'spoorbrug-maastricht.json'),JSON.stringify(entry,null,2)+'\n');console.log(JSON.stringify({parts:parts.map(([name,s])=>({name,status:s.status(),volumeM3:s.volume(),triangles:s.numTri()})),partitionDifferenceM3:delta,stlBounds:printModel.boundingBox()},null,2));
