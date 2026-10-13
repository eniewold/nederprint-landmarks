// Hourglass: three connected, waisted stone volumes with continuous inclined
// faces, glass seams and the complete lower courtyard/entrance buildings.
// Example generate-the-rock.mjs; architectural planes and hulls, no DSM layers.
// Roof constants: 3D BAG, TU Delft/3DGI CC BY4.0; PDOK AHN4/BAG/ortho CC0.
// Waist heights/widths and facade relief inferred from oblique reference photos.
import {Manifold,prism,rect,box,ccw,union,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='hourglass-amsterdam',ORIGIN=[119606,483413],ANGLE=2.91,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=-.35,BASE=-1,z=h=>h-GROUND,WAIST=32.8;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function loft(p0,h0,p1,h1){return Manifold.hull([...ring3(p0,z(h0)),...ring3(p1,z(h1))]);}
const mix=(a,b,t)=>a.map(([u,v],i)=>[u+(b[i][0]-u)*t,v+(b[i][1]-v)*t]);
function planAt(spec,h){if(h<=7)return spec.foot;if(h<=WAIST)return mix(spec.foot,spec.waist,(h-7)/(WAIST-7));return mix(spec.waist,spec.top,(h-WAIST)/(spec.roof-WAIST));}
function niche(a,b,s0,s1,h0,h1,depth=.45){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.55],[s0,.55]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));}
function slopingBlock(spec){
 let solid=union([prism(spec.foot,BASE,z(7.05)),loft(spec.foot,7,spec.waist,WAIST),loft(spec.waist,WAIST,spec.top,spec.roof)]),cuts=[];
 // The window back planes stand vertically even on an inclined stone facade.
 // They use the face at row-centre, so the recess remains blind at both ends.
 for(let h=9.7,row=0;h+2.65<spec.roof-.8;h+=3.7,row++){
  const p=ccw(planAt(spec,h+1.325));for(let i=0;i<p.length;i++){
   const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
   for(let s=1.0+(row%2)*.22;s+1.5<L-1;s+=2.65)cuts.push(niche(a,b,s,s+1.45+(row%3)*.1,h,h+2.65,.45));
  }
 }
 // Deep, broad public plinth windows, closed behind their glazing.
 const p=ccw(spec.foot);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=1;s+2<L-1;s+=5.0)cuts.push(niche(a,b,s,Math.min(s+3.5,L-1),.7,6.1,.55));}
 return solid.subtract(union(cuts));
}
const northwest={foot:[[-27.1,3.1],[5.5,3.14],[6.1,26.65],[-26.179,26.396]],waist:[[-20.4,6.7],[2.0,6.7],[2.5,22.5],[-20.4,22.5]],top:[[-25.969,3.141],[5.492,3.142],[5.835,25.714],[-26.179,26.396]],roof:69.472};
const northeast={foot:[[5.5,3.14],[32.632,3.53],[33.877,26.672],[6.1,26.65]],waist:[[8.9,6.7],[28.5,6.7],[29.0,22.5],[8.9,22.5]],top:[[5.492,3.142],[32.632,3.53],[33.867,26.541],[6.11,26.55]],roof:79.665};
const southeast={foot:[[3.2,-28.98],[30.83,-30.481],[32.632,3.53],[5.5,3.14]],waist:[[7.4,-22.6],[26.0,-23.8],[28.5,6.7],[8.9,6.7]],top:[[4.472,-21.553],[30.291,-22.867],[31.375,3.142],[5.492,3.142]],roof:69.472};
let nw=slopingBlock(northwest),ne=slopingBlock(northeast),se=slopingBlock(southeast);
// Glass atrium spines hold the L junctions together through the waist. These
// are filled structural building parts, with sufficient material behind both
// exposed sides; never thin rows of open windows between opposing facades.
const northSeam=B(1.5,7.2,9.6,22.5,GROUND-1,69.472),eastSeam=B(9.0,-3.2,28.6,7.2,GROUND-1,69.472);
// The northern-western rooflight is a genuine recessed roof well; flat floor.
const nwWellPlan=[[-6.7,12.6],[3.9,12.5],[2.5,17.0],[-6.5,17.0]];
nw=nw.subtract(prism(nwWellPlan,z(64.161),z(69.7)));
// Roof terrace of the tallest volume lies slightly below the main parapet.
ne=ne.subtract(B(11.7,20.7,26.4,25.2,79.257,79.85)).subtract(B(15.6,7.1,19.9,16.2,77.948,79.85));
const roofServices=[B(-20.5,11.7,-17.4,15.1,69.35,71.183),B(13.6,-12.8,16.5,-9.0,69.35,70.446)];
// Complete low courtyard buildings to the southwest, not the adjacent NoMA
// House, which is a different BAG and remains as its existing PDOK model.
const lowPlan=[[-29.033,-27.311],[-.828,-28.614],[.212,-14.629],[.72,-5.968],[4.377,3.142],[-26.318,3.141]];
let courtyard=prism(lowPlan,BASE,z(4.677));
const southWestPlan=[[-27.129,-27.428],[-.828,-28.614],[-.413,-14.604],[-17.454,-13.927],[-21.37,-14.561],[-25.832,-13.593]];
const southwest=prism(southWestPlan,BASE,z(11.395));
const skylight=prism([[-16.883,-13.949],[.212,-14.629],[.72,-5.968],[-16.457,-5.153]],z(4.5),z(5.654));
const southPlinthPlan=[[.677,-28.901],[30.827,-30.496],[31.198,-23.727],[2.858,-21.422]];
const southPlinth=prism(southPlinthPlan,BASE,z(9.903));
// Large southwest plinth frames remain blind and closed below the roof.
const lowCuts=[];for(const p of[southWestPlan,southPlinthPlan]){const q=ccw(p);for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=1;s+2<L-1;s+=4.6)lowCuts.push(niche(a,b,s,Math.min(s+3.1,L-1),.7,7.4,.5));}}
let body=union([nw,ne,se,northSeam,eastSeam,courtyard,southwest,skylight,southPlinth,...roofServices]).subtract(union(lowCuts));
// Glass incisions near the two outer north corners follow the inclined face
// continuously in two sectors, without a full-depth cut or hollow lattice.
const seamCuts=[];for(const spec of[northwest,northeast])for(const [h0,h1]of[[7.3,WAIST],[WAIST,spec.roof-2]]){
 const p0=ccw(planAt(spec,h0)),p1=ccw(planAt(spec,h1));const i=spec===northwest?3:1,a0=p0[i],b0=p0[(i+1)%4],a1=p1[i],b1=p1[(i+1)%4];
 const stripCorners=(a,b,h)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return [[1,-.55],[2.25,-.55],[2.25,.6],[1,.6]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],z(h)]);};
 seamCuts.push(Manifold.hull([...stripCorners(a0,b0,h0),...stripCorners(a1,b1,h1)]));
}
body=body.subtract(union(seamCuts));
body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:hourglass-drie-gevelvolumes-en-hofplint',body]],catalog:{name:'Hourglass',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:42.660322,groundSamplePoints:[[119574,483401],[119642,483419],[119610,483445]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012249957'],description:'Hourglass als drie L-vormig verbonden, getailleerde bouwvolumes met doorlopende schuine natuursteengevels, blinde rechtopstaande vensters, glazen naden/atria, gemeten dakterrassen en de complete lage zuidwestelijke hofplint; NoMA House blijft afzonderlijk.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,waistNapM:WAIST,roofsNapM:[69.472,79.665,69.472],roofWellNapM:64.161,roofTerraceNapM:79.257,roofRecessNapM:77.948,lowRoofsNapM:[4.677,11.395,5.654,9.903],estimates:['Waist32.8NAP en facettering/versmalling uit schuine fotos, circa1-2m onzeker; hoekpunten tussen gemeten voet- en dakvlakken als doorgaande vlakken verbonden','Staand vensterritme3.7m, verspringing .22m en .45m blinde nissen uit fotos; interne glas-/atriumdelen massief','Brede plintramen/entrees .5-.55m blind; glazen naden volgen de helling als twee doorlopende vlakken en blijven .55m diep','Dakterrassen/wellen en afzonderlijke lage hofgebouwen zijn gemeten, glaslichtdak massief voor print','Losse zonnepanelen, lamellen, onderhoudsgieken en glas-/metaalroedes kleiner dan.9m samengevoegd of weggelaten']},sources:['https://damenpartners.com/projecten/hourglass/ (architect, schuine gevels en rechtopstaande ramen)','https://damenpartners.com/hourglass-receives-award-of-excellence/ (architect, drie volumes inL)','https://www.hurks.nl/projecten/hourglass/ (bouwer,2020)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012249957 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Zuidas_Kenniskwartier_25.jpg (MrAronymous CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Zuidas_Kenniskwartier_17.jpg (MrAronymous CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Zuidas_Kenniskwartier_07.jpg (MrAronymous CC BY-SA4.0)']}});
