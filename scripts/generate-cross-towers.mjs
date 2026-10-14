// Cross Towers Amsterdam. generate-evoluon.mjs read fully as primitives example.
// Two continuous shifted office wings, a lower central core and the two podium pavilions.
// PDOK BAG/3D BAG and AHN are open height/contour measurements; facade relief is estimated from Arcam/Edge photographs.
import {Manifold,CrossSection,ccw,prism,box as kitBox,union,writeLandmark} from './efteling-kit.mjs';
const box=(x0,x1,y0,y1,z0,z1)=>kitBox(x0,y0,z0,x1,y1,z1);
const slug='cross-towers',ORIGIN=[120774,483411],ANGLE=-.30,GROUND=-.57,BASE=-.6,z=h=>h-GROUND,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
// The roof edges determine the building frame. Glass returns cause missing DSM points, not changes in the main wall line.
const WEST={x0:-28.30,x1:-14.10,y0:5.90,y1:42.80,roof:86.257},EAST={x0:-3.80,x1:9.90,y0:-.35,y1:35.60,roof:86.243},CORE={x0:-14.20,x1:-3.65,y0:9.35,y1:31.00,roof:85.436};
const EAST_PODIUM=[[14.56, 40.319], [14.061, -14.832], [18.842, -15.193], [18.819, -36.413], [14.863, -36.411], [14.739, -54.058], [14.798, -54.057], [14.784, -51.255], [30.181, -51.091], [30.164, 30.38], [30.13, 35.177], [14.56, 40.319]],WEST_PODIUM=[[-15.784, -36.852], [-15.749, 5.991], [-27.151, 5.855], [-27.284, -36.795], [-15.784, -36.852]];
const profileX=(poly,x0,x1)=>Manifold.extrude([ccw(poly)],x1-x0).rotate([90,0,90]).translate([x0,0,0]);
const profileY=(poly,y0,y1)=>Manifold.extrude([ccw(poly)],y1-y0).rotate([90,0,0]).translate([0,y1,0]);
const parts=[],cuts=[];
for(const w of[WEST,EAST,CORE])parts.push(box(w.x0,w.x1,w.y0,w.y1,BASE,z(w.roof)));
parts.push(prism(EAST_PODIUM,BASE,z(7.405)),prism(WEST_PODIUM,BASE,z(5.116)));
// The low service/gallery strip connects the long restaurant pavilion to the eastern tower; the central courtyard remains open.
parts.push(box(9.65,15.05,-.4,35.65,BASE,z(7.405)));
// A continuous fine roof border survives at 1:1000; no imported solar-panel texture or roof noise.
for(const w of[WEST,EAST]){
 parts.push(box(w.x0,w.x1,w.y0,w.y1,z(w.roof)-.5,z(w.roof)+.18));
 cuts.push(box(w.x0+.85,w.x1-.85,w.y0+.85,w.y1-.85,z(w.roof),z(w.roof)+.3));
}
// Each long facade has a shallow glass field with the attached diagonal frame in front of it.
// Five bays and six triangular bands follow the visible full-height diagrid; dimensions below are photo estimates.
for(const w of[WEST,EAST]){
 const y0=w.y0+.8,y1=w.y1-.8,bay=(y1-y0)/5,lo=1.35,hi=w.roof-.65,pitch=(hi-lo)/6;
 for(const side of[-1,1]){
  const x=side<0?w.x0:w.x1;
  cuts.push(box(side<0?x-.08:x-.40,side<0?x+.40:x+.08,y0,y1,z(lo),z(hi)));
  for(let f=0;f<23;f++){const H=2.7+f*3.58;cuts.push(box(side<0?x-.08:x-.55,side<0?x+.55:x+.08,y0,y1,z(H),z(H+.45)));}
  const faceParts=[];
  for(let band=0;band<6;band++)for(let k=-1;k<=5;k++){
   const a=y0+(k+(band%2? .5:0))*bay,b=y0+(k+(band%2?0:.5))*bay,H=lo+band*pitch;
   for(const end of[b,b+(band%2?bay:-bay)]){
    const L=Math.hypot(end-a,pitch),dy=.475*pitch/L,dz=.475*(end-a)/L;
    const poly=[[a-dy,z(H)+dz],[a+dy,z(H)-dz],[end+dy,z(H+pitch)-dz],[end-dy,z(H+pitch)+dz]];
    faceParts.push(profileX(poly,side<0?x-.08:x-.65,side<0?x+.65:x+.08));
   }
  }
  for(let band=0;band<=6;band+=2){const H=lo+band*pitch;faceParts.push(box(side<0?x-.06:x-.65,side<0?x+.65:x+.06,y0,y1,z(H)-.4,z(H)+.4));}
  // Crop at the corners and roof so every diagonal terminates on a real solid wall.
  parts.push(union(faceParts).intersect(box(x-.7,x+.7,w.y0+.65,w.y1-.65,z(lo)-.45,z(hi)+.45)));
 }
 // Short facades use blind window fields and the visibly sloped upper conference-room glass.
 for(const side of[-1,1]){
  const y=side<0?w.y0:w.y1,n=5,step=(w.x1-w.x0-1.7)/n;
  for(let k=0;k<n;k++)for(let f=0;f<21;f++){
   const a=w.x0+.85+k*step+.22,b=w.x0+.85+(k+1)*step-.22,H=1.6+f*3.58;
   cuts.push(box(a,b,side<0?y-.08:y-.36,side<0?y+.36:y+.08,z(H),z(H+2.65)));
  }
  const topGlass=[[w.x0+.85,z(77.1)],[w.x1-.85,z(77.1)],[w.x1-.85,z(w.roof-.65)],[w.x0+.85,z(w.roof-.65)]];
  const recess=profileY(topGlass,side<0?y-.12:y-.4,side<0?y+.4:y+.12);
  // Extra inclined return: 1.05 m recess at the lower edge tapering to the shallow glazing at the roof.
  const wedge=Manifold.hull([[w.x0+.85,y+(side<0?.95:-.95),z(77.1)],[w.x1-.85,y+(side<0?.95:-.95),z(77.1)],[w.x0+.85,y+(side<0?.36:-.36),z(w.roof-.65)],[w.x1-.85,y+(side<0?.36:-.36),z(w.roof-.65)],[w.x0+.85,y-side*.1,z(77.1)],[w.x1-.85,y-side*.1,z(77.1)],[w.x0+.85,y-side*.1,z(w.roof-.65)],[w.x1-.85,y-side*.1,z(w.roof-.65)]]);
  cuts.push(recess,wedge);
 }
}
// Large blind windows on the recessed central glass core, whose measured roof lies below the two wings.
for(const y of[CORE.y0,CORE.y1])for(let f=0;f<23;f++){
 const H=1.8+f*3.58;cuts.push(box(CORE.x0+.9,CORE.x1-.9,y-.4,y+.4,z(H),z(H+2.55)));
}
// Podium glazing bays keep a robust continuous back wall rather than making a line of open frames.
function podiumWindows(poly,top){
 for(let i=0;i<poly.length-1;i++){
  const a=poly[i],b=poly[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<4)continue;
  const dx=(b[0]-a[0])/L,dy=(b[1]-a[1])/L,count=Math.max(1,Math.floor((L-1.6)/4.5)),step=(L-1.6)/count,P=(s,d)=>[a[0]+dx*s-dy*d,a[1]+dy*s+dx*d];
  for(let k=0;k<count;k++){const s=.8+k*step+.4,e=.8+(k+1)*step-.4;cuts.push(prism([P(s,-.1),P(e,-.1),P(e,.36),P(s,.36)],z(.65),z(top-1.05)));}
 }
}
podiumWindows(EAST_PODIUM,7.405);podiumWindows(WEST_PODIUM,5.116);
// Apply glass recesses to the parent volumes first, then restore attached diagrid ribs only (one connected material body).
const shell=union(parts.slice(0,8)); console.log('Shell',shell.genus(),shell.decompose().length);
let body=shell,accepted=0,rejected=0; for(const c of cuts){const a=body.subtract(c);if(a.genus()===0&&a.decompose().length===1){body=a;accepted++;}else rejected++;}console.log('Glass fields',{accepted,rejected});
// Re-add the diagrid solids because the broad glass cuts pass behind these ribs.
body=union([body,...parts.slice(8)]).simplify(.001);
const encoded=body.calculateNormals(0,40).getMesh(),stride=encoded.numProp,positions=new Float32Array(encoded.vertProperties.length/stride*3);
for(let i=0;i<positions.length/3;i++)for(let a=0;a<3;a++)positions[i*3+a]=encoded.vertProperties[i*stride+a];
const mesh=new encoded.constructor({numProp:3,vertProperties:positions,triVerts:Uint32Array.from(encoded.triVerts)});mesh.merge();body=union(new Manifold(mesh).decompose().filter(s=>s.volume()>1e-5));
console.log('Closed geometry',body.status(),body.genus(),body.decompose().length);
if(body.status()!=='NoError'||body.genus()!==0||body.decompose().length!==1)throw Error('Cross Towers must have connected wings/pavilions and blind facade relief');
await writeLandmark({slug,nodes:[['building:cross-towers-twee-diagridvleugels-kern-en-paviljoens',body]],base:BASE,title:'Cross Towers Amsterdam',catalog:{name:'Cross Towers',origin:ORIGIN,xAxis:AXIS,groundHeight:42.40364998,groundNap:GROUND,groundOffsetMetres:-.15,groundSamplePoints:[[-33,14.8],[33,-10.8]],replacesBuildings:['NL.IMBAG.Pand.0363100012061407'],description:'Twee verschoven continue kantoorvleugels met gemeten daken NAP 86.257/86.243 m, lagere verbindingskern 85.436 m, echte lange podiumpaviljoens en open vijverhof. Aangehecht diagonaal gevelraster, blinde glasvelden en schuin bovenste kopglas volgen openbare bronfotos; raamritme, rasterdikte en glashelling zijn schattingen. Ondergrondse parkeerlagen en vijver zijn geen gebouwvolume. Gevelas -0.30 graden, geen gestapelde hoogtelagen.',realWorld:{groundNapM:GROUND,westRoofNapM:86.257,eastRoofNapM:86.243,coreRoofNapM:85.436,restaurantRoofNapM:7.405,westPodiumRoofNapM:5.116,diagridBays:5,diagridTriangularBands:6,estimatedFacadeRelief:true},sources:['PDOK BAG 0363100012061407, 3D BAG LoD2.2 en AHN DSM/DTM 0.5 m voor contouren, dakranden, daken en maaiveld; actuele orthoHR','https://www.aronsohn.nl/project/vivaldi/ (constructeur: twee verschoven bouwdelen, centrale kern, diagrid en ondergrondse garage)','https://edge.tech/portfolio/cross-towers (eigenaar: twee torens, kern en podiumvoorzieningen; overzichtsfotos)','https://arcam.nl/architectuur-gids/kantoor-ernst-young/ (Doriann Kransberg/Stadsarchief Amsterdam: drie schuine fotos en schuin bovenste kopglas)']}});
