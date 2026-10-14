// Coolse Poort Rotterdam. Primitives example generate-evoluon.mjs read in full.
// Three measured glass volumes and their continuous steel cores, low plinth and capital columns.
import {Manifold,CrossSection,ccw,prism,box as kitBox,union,writeLandmark} from './efteling-kit.mjs';
const box=(x0,x1,y0,y1,z0,z1)=>kitBox(x0,y0,z0,x1,y1,z1);
const slug='coolse-poort',ORIGIN=[92549,437025],ANGLE=15.5,GROUND=.45,BASE=-.75,z=h=>h-GROUND,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
const FOOT=[[-35.647,18.503],[-35.439,-14.631],[-34.292,-14.649],[-33.952,-15.293],[-31.108,-15.293],[-30.679,-14.644],[-2.717,-14.626],[-2.958,-19.758],[-2.609,-20.073],[8.394,-20.136],[8.638,-19.819],[9.794,-19.766],[9.766,-25.331],[21.321,-25.35],[27.397,-5.46],[26.314,-5.399],[26.32,-3.169],[28.131,-3.114],[28.698,-1.399],[29.249,2.163],[29.118,5.109],[33.367,5.138],[33.249,21.182],[9.83,21.415],[9.821,13.211],[8.119,13.222],[8.11,18.164],[7.808,18.461],[-35.647,18.503]],ROOFS={"0":{"xy":[[-30.672,-14.447],[-34.533,-14.457],[-34.538,-14.644],[-33.952,-15.292],[-31.109,-15.291],[-30.672,-14.447]],"h":13.777},"1":{"xy":[[6.266,-7.32],[5.748,-14.157],[10.283,-13.187],[10.36,-9.284],[9.256,-9.308],[9.113,-7.33],[6.266,-7.32]],"h":8.026},"2":{"xy":[[5.582,13.082],[5.673,-2.837],[21.146,-2.943],[21.139,-0.491],[21.575,-0.438],[21.563,13.035],[5.582,13.082]],"h":73.693},"3":{"xy":[[5.617,8.841],[5.582,13.082],[7.483,13.076],[7.587,17.712],[8.11,17.709],[7.809,18.462],[-35.647,18.504],[-35.629,8.044],[-33.997,8.126],[-33.981,8.781],[-33.106,8.17],[-26.138,8.52],[-26.104,8.14],[5.617,8.841]],"h":11.817},"4":{"xy":[[-22.803,-6.909],[-34.547,-6.879],[-34.621,-7.021],[-22.593,-7.222],[-22.803,-6.909]],"h":58.856},"5":{"xy":[[23.642,-0.185],[21.681,-0.425],[21.64,-2.946],[25.182,-2.971],[23.642,-0.185]],"h":50.211},"6":{"xy":[[21.681,-0.425],[23.642,-0.185],[25.985,-4.421],[25.837,-10.567],[27.099,-6.436],[26.314,-5.396],[26.32,-3.167],[28.174,-2.991],[29.185,1.264],[29.119,5.111],[29.592,5.114],[29.799,6.25],[21.579,6.358],[21.681,-0.425]],"h":6.368},"7":{"xy":[[12.012,7.942],[10.418,9.103],[10.229,6.558],[11.984,6.578],[12.012,7.942]],"h":78.361},"8":{"xy":[[-34.129,-1.9],[-35.612,-2.014],[-35.608,-4.942],[-34.265,-4.983],[-34.129,-1.9]],"h":11.811},"9":{"xy":[[9.77,-24.55],[10.059,-24.549],[10.283,-13.187],[5.733,-14.345],[-2.712,-14.368],[-2.459,-20.072],[8.395,-20.134],[9.794,-19.765],[9.77,-24.55]],"h":5.403},"10":{"xy":[[14.286,-19.266],[21.374,-19.486],[21.64,-2.946],[14.069,-2.895],[14.286,-19.266]],"h":65.438},"11":{"xy":[[10.115,9.324],[10.145,8.789],[10.418,9.103],[12.012,7.942],[12.054,9.956],[10.115,9.324]],"h":77.548},"12":{"xy":[[28.575,8.694],[28.25,13.822],[23.057,14.001],[23.181,9.179],[28.575,8.694]],"h":68.88},"13":{"xy":[[21.374,-19.486],[14.286,-19.266],[14.069,-2.895],[10.486,-2.872],[10.406,-6.905],[9.083,-6.909],[9.256,-9.308],[10.36,-9.284],[10.044,-25.339],[12.9,-25.371],[13.561,-24.55],[15.129,-24.55],[15.862,-25.382],[21.322,-25.348],[25.837,-10.567],[25.985,-4.421],[25.182,-2.971],[21.64,-2.946],[21.374,-19.486]],"h":61.213},"14":{"xy":[[10.229,6.558],[10.115,9.324],[9.107,9.013],[9.0,6.545],[10.229,6.558]],"h":78.201},"15":{"xy":[[-34.338,-6.65],[-35.603,-6.657],[-35.439,-14.631],[-2.717,-14.625],[-2.958,-19.757],[-2.459,-20.072],[-2.712,-14.368],[5.733,-14.345],[6.266,-7.32],[-19.124,-6.981],[-20.092,-6.631],[-20.436,-7.329],[-34.361,-7.183],[-34.621,-7.021],[-34.338,-6.65]],"h":11.83},"16":{"xy":[[8.037,2.758],[9.309,2.223],[9.773,4.038],[11.911,3.14],[11.984,6.578],[9.692,6.552],[10.148,5.337],[9.901,4.543],[8.037,2.758]],"h":77.543},"17":{"xy":[[10.513,0.955],[11.864,0.86],[11.911,3.14],[9.773,4.038],[9.225,1.894],[10.513,0.955]],"h":78.408},"18":{"xy":[[-35.629,8.044],[-35.612,-2.014],[-34.832,-1.955],[-34.877,8.081],[-35.629,8.044]],"h":11.812},"19":{"xy":[[-23.6,-1.084],[-24.788,-1.176],[-25.593,-1.801],[-24.686,-2.632],[-23.549,-2.639],[-23.6,-1.084]],"h":11.81},"20":{"xy":[[29.592,5.114],[32.632,5.134],[32.629,6.213],[33.359,6.203],[33.253,20.599],[32.595,20.598],[32.593,21.191],[10.775,21.407],[10.785,20.567],[9.829,20.565],[9.82,13.213],[8.119,13.224],[8.11,17.709],[7.587,17.712],[7.483,13.076],[21.563,13.035],[21.579,6.358],[29.799,6.25],[29.592,5.114]],"h":67.297},"21":{"xy":[[-23.775,4.25],[5.627,4.653],[5.617,8.841],[-26.104,8.14],[-26.138,8.52],[-33.106,8.17],[-33.981,8.781],[-33.997,8.126],[-34.877,8.081],[-34.832,-1.955],[-34.129,-1.9],[-34.265,-4.983],[-35.608,-4.942],[-35.603,-6.657],[-23.157,-6.595],[-22.329,-7.33],[-20.436,-7.329],[-20.092,-6.631],[-19.124,-6.981],[-6.468,-6.975],[-6.472,-7.277],[9.113,-7.33],[9.083,-6.909],[10.406,-6.905],[10.486,-2.872],[-24.686,-2.632],[-25.593,-1.801],[-24.788,-1.176],[-23.6,-1.084],[-23.775,4.25]],"h":58.149},"22":{"xy":[[-34.349,-6.879],[-22.803,-6.909],[-23.157,-6.595],[-34.349,-6.879]],"h":23.47},"23":{"xy":[[5.627,4.653],[-23.775,4.25],[-23.549,-2.639],[5.673,-2.837],[5.627,4.653]],"h":62.379}};

// Shared facade planes round within 12.5 cm survey tolerance, retaining real projecting corners.
for(const poly of [FOOT,...Object.values(ROOFS).map(r=>r.xy)])for(const point of poly)for(let a=0;a<2;a++)point[a]=Math.round(point[a]*4)/4;
const cs=poly=>new CrossSection([ccw(poly)]),extrude=(poly,a,b)=>cs(poly).extrude(b-a).translate([0,0,a]);
const closed=poly=>{const q=ccw(poly);return [...q,q[0]];};
const group=(a,b)=>CrossSection.union([cs(ROOFS[a].xy),cs(ROOFS[b].xy)]).offset(.04,'Miter');
const WEST=group(21,23),NORTH=group(20,2),SOUTH=group(13,10);
const parts=[extrude(FOOT,BASE,z(.85))],holes=[];
// The plinth consists of its true lower shop volumes; it does not fill the arcades under the towers.
for(const n of [3,15,8,18,19,9,6,1])parts.push(extrude(ROOFS[n].xy,BASE,z(ROOFS[n].h)));
for(const [n,cs,start] of [[21,WEST,8.0],[20,NORTH,8.55],[13,SOUTH,8.0]])parts.push(cs.extrude(z(ROOFS[n].h)-z(start)).translate([0,0,z(start)]));
for(const n of[23,2,10])parts.push(extrude(ROOFS[n].xy,BASE,z(ROOFS[n].h)));
// Continuous recessed glazing carries the cantilevered glass volumes; broad outer arcades remain readable.
for(const [cs,start]of[[WEST,8],[NORTH,8.55],[SOUTH,8]])parts.push(cs.offset(-2.15,'Miter').extrude(z(start+.05)-BASE).translate([0,0,BASE]));
// Photos and public architect elevations locate robust columns and the faceted concrete fists under the entrance.
// Capital sides use a 45-degree hull; the fine multi-facet concrete finish is simplified on 1:1000.
const capitals=[];
for(const [x,y,top]of[[25.5,19,8.6],[31,19,8.6],[30.5,9,8.6],[12,19,8.6],[23.5,-19,8.05],[22.5,-6.0,8.05],[-30,-5,8.05],[-30,6,8.05]]){
 const low=top-2.2;parts.push(box(x-.7,x+.7,y-.7,y+.7,BASE,z(low+.04)));
 const head=Manifold.hull([[x-.7,y-.7,z(low)],[x+.7,y-.7,z(low)],[x+.7,y+.7,z(low)],[x-.7,y+.7,z(low)],[x-2.8,y-2.8,z(top)],[x+2.8,y-2.8,z(top)],[x+2.8,y+2.8,z(top)],[x-2.8,y+2.8,z(top)]]);parts.push(head);capitals.push([x,y,top]);
}
for(const n of[12,7,11,14,16,17])parts.push(extrude(ROOFS[n].xy,z(n===12?67.2:73.6),z(ROOFS[n].h)));
// Narrow street-side service volume, measured photo height relative to the known floor spacing.
parts.push(box(21.7,24.6,-2.9,-.4,BASE,z(47.8)));
let shell=union(parts);
function windows(poly,start,pitch,count,{width=1.2,high=2.25,depth=.34,step=2.05}={}){
 poly=closed(poly);
 for(let face=0;face<poly.length-1;face++){
  const a=poly[face],b=poly[face+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<3.1)continue;
  const dx=(b[0]-a[0])/L,dy=(b[1]-a[1])/L,n=Math.max(1,Math.round((L-2.4)/step)),pitchX=(L-2.4)/n;
  for(let bay=0;bay<n;bay++){
   const s=1.2+(bay+.5)*pitchX,w=Math.min(width,pitchX-.8),p=(q,d)=>[a[0]+dx*q-dy*d,a[1]+dy*q+dx*d];if(w<.7)continue;
   for(let f=0;f<count;f++){const h=start+f*pitch;
    const buried=[s-w/2,s,s+w/2].some(q=>[h+.02,h+high/2,h+high-.02].some(H=>{const a=p(q,-.06),b=p(q,depth+.8),inside=point=>shell.rayCast([point[0],point[1],z(H)],[point[0]+dy*400,point[1]-dx*400,z(H)]).length%2===1;return inside(a)||!inside(b);}));
    if(!buried)holes.push(prism([p(s-w/2,-.12),p(s+w/2,-.12),p(s+w/2,depth),p(s-w/2,depth)],z(h),z(h+high)));
   }
  }
 }
}
for(const [cs,h,count]of[[WEST,9.0,15],[NORTH,9.3,18],[SOUTH,9,16]])for(const poly of cs.toPolygons())windows(poly,h,3.16,count);
for(const n of[3,15])windows(ROOFS[n].xy,1.55,3.5,3,{width:2.3,high:2.5,depth:.45,step:3.3});
for(const [cs,h]of[[WEST,8],[NORTH,8.55],[SOUTH,8]])for(const poly of cs.offset(-2.15,'Miter').toPolygons())windows(poly,1.55,3.5,Math.max(1,Math.floor((h-1.6)/3.5)),{width:2.4,high:2.7,depth:.6,step:3.4});
// Roof parapets and core roof gardens are solid attached relief, without fine loose railings.
for(const [x0,x1,y0,y1,h]of[[-23.4,4.8,-2.8,-2.1,62.38],[-23.4,4.8,4,4.65,62.38],[14.1,14.8,-19.4,-3.2,65.44]])parts.push(box(x0,x1,y0,y1,z(h-.1),z(h+.6)));

shell=union(parts); const arcadeGenus=shell.genus();
// Validate blind cuts after each group; reject any cut that would open a corner or disconnect material.
// Remove sub-centimetre boolean slivers before Float32 GLB serialization (0.01 mm at 1:1000).
let facades=shell,accepted=0,rejected=0; for(let i=0;i<holes.length;i+=64){const group=holes.slice(i,i+64),candidate=facades.subtract(union(group));if(candidate.genus()===arcadeGenus&&candidate.decompose().length===1){facades=candidate;accepted+=group.length;}else{for(const h of group){const single=facades.subtract(h);if(single.genus()===arcadeGenus&&single.decompose().length===1){facades=single;accepted++;}else rejected++;}}}console.log("Blind facade topology",{accepted,rejected}); const original=facades.simplify(.001),encodedMesh=original.calculateNormals(0,40).getMesh(),stride=encodedMesh.numProp;
const positions=new Float32Array(encodedMesh.vertProperties.length/stride*3);
for(let i=0;i<positions.length/3;i++)for(let a=0;a<3;a++)positions[i*3+a]=encodedMesh.vertProperties[i*stride+a];
const mesh=new encodedMesh.constructor({numProp:3,vertProperties:positions,triVerts:Uint32Array.from(encodedMesh.triVerts)});mesh.merge();
const reconstructed=new Manifold(mesh),physical=reconstructed.decompose().filter(s=>s.volume()>1e-5),body=union(physical);
console.log('Closed Float32 geometry',body.status(),body.genus(),body.decompose().length);


if(body.status()!=='NoError'||body.genus()!==arcadeGenus||body.decompose().length!==1)throw Error('Coolse Poort must remain one closed connected model with blind facade fields');
await writeLandmark({slug,nodes:[['building:coolse-poort-drie-glasvolumes-en-vuisten',body]],base:BASE,title:'Coolse Poort Rotterdam',catalog:{name:'Coolse Poort',origin:ORIGIN,xAxis:AXIS,groundHeight:44.02135966,groundNap:GROUND,groundOffsetMetres:-.15,groundSamplePoints:[[-20,26],[35,-10]],replacesBuildings:['NL.IMBAG.Pand.0599100000700138'],description:'Volledige eigen Coolse Poort met drie gemeten glasvolumes, hogere continue staalplaatkernen, lage winkelplint, terugliggende glazen entree en verbonden kapiteelkolommen. Dakmaten uit 3D BAG/AHN; herontwikkeling behouden bestaande hoofdvorm en huidige transparante raamvelden volgens Groosman 2025. Bouwdelen uit continue vlakken, geen gestapelde hoogtelagen. Gevelritme, entreevuisten en smalle servicewandhoogte zijn fotoschattingen; kapitelen krijgen 45-graden afschuining voor 1:1000.',realWorld:{groundNapM:GROUND,westGlassRoofNapM:58.149,westCoreRoofNapM:62.379,northGlassRoofNapM:67.297,northCoreRoofNapM:73.693,southGlassRoofNapM:61.213,southCoreRoofNapM:65.438,topMachineNapM:78.408,shopRoofNapM:11.83,capitalColumns:8,estimatedFacadeRhythm:true},sources:['PDOK BAG pand 0599100000700138, volledige contour EPSG:28992','3D BAG LoD 2.2: drie glasvolumes, kernen en machines; PDOK AHN DSM/DTM 0.5 m','PDOK actuele orthoHR: behouden Coolse Poort en huidige plint','PDOK 3D Basisvoorziening maaiveld 43.6177/44.0214 m ellipsoidisch','https://architectenweb.nl/projecten/project.aspx?id=50256 (GROOSMAN eigen projectbeschrijving, foto’s Aiste Rakauskaite en vier gevelaanzichten; oplevering 2025)']}});
