// CasaNova Rotterdam (Barcode Architects, 2023). Example generate-evoluon.mjs read fully.
// Measured BAG footprint and continuous 3D BAG/AHN5 roof planes, no stacked height layers.
// Photo references: Dinx CC BY-SA 4.0 (Commons); Hans Wilschut via Barcode (visual reference only).
import {Manifold,CrossSection,ccw,prism,rect,box,union,writeLandmark} from './efteling-kit.mjs';
const slug='casanova-rotterdam',ORIGIN=[93092, 437006],ANGLE=14.88723018143221,GROUND=2.54,BASE=-.75,z=h=>h-GROUND,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
const PODIUM=[[-32.8985, 10.2906], [-31.1707, -25.7997], [17.994, -23.3694], [17.4639, 10.2782]],TRIANGLE=[[-16.091, 9.5289], [-0.0557, -18.3165], [16.6511, 9.5289]],MACHINE=[[0.0727, -12.9411], [11.4687, 6.7832], [-6.417, 6.7782], [-7.1178, 5.7455], [-8.5683, 1.4997]];
const PODIUM_ROOF=19.38,TAPER_TOP=31.9,TOWER_ROOF=111.489,CROWN_TOP=112.48,MACHINE_TOP=113.71;
const slab=(poly,a,b)=>prism(poly,z(a),z(b));const cs=new CrossSection([ccw(PODIUM)]),corePlan=cs.offset(-2.2,'Miter').toPolygons()[0];
// The ground slab, full glazed plinth and terrace form one connected construction.
const plinthParts=[prism(PODIUM,BASE,z(3.65)),prism(corePlan,BASE,z(17.18)),Manifold.hull([...corePlan.map(([x,y])=>[x,y,z(17.1)]),...PODIUM.map(([x,y])=>[x,y,z(PODIUM_ROOF)])])];
const holes=[];
function localPoint(a,b,s,depth){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);return[a[0]+dx*s/L-dy*depth/L,a[1]+dy*s/L+dx*depth/L];}
// Real three-level folded balcony galleries, not heightfield slices. Undersides are 45-degree wedges.
for(const edge of [1,2,3]){const a=ccw(PODIUM)[edge],b=ccw(PODIUM)[(edge+1)%4],L=Math.hypot(b[0]-a[0],b[1]-a[1]),count=edge===1?9:7,step=L/count;
 for(let k=0;k<=count;k++){const s=Math.min(L-.45,Math.max(.45,k*step));const pa=localPoint(a,b,s-.5,-.03),pb=localPoint(a,b,s+.5,-.03),pc=localPoint(a,b,s+.5,2.4),pd=localPoint(a,b,s-.5,2.4);plinthParts.push(prism([pa,pb,pc,pd],BASE,z(PODIUM_ROOF)));}
 for(const h of [7.1,11.15,15.2])for(let k=0;k<count;k++){const s0=k*step+.2,s1=(k+1)*step-.2,mid=(s0+s1)/2;const top=[localPoint(a,b,s0,1.1),localPoint(a,b,mid,-.05),localPoint(a,b,s1,1.1),localPoint(a,b,s1,2.65),localPoint(a,b,s0,2.65)];const bottom=[localPoint(a,b,s0,2.25),localPoint(a,b,mid,2.25),localPoint(a,b,s1,2.25)];plinthParts.push(Manifold.hull([...bottom.map(([x,y])=>[x,y,z(h-1.65)]),...top.map(([x,y])=>[x,y,z(h+.9)])]));}
 // Glazing recessed into the continuous inner wall, between structural piers.
 for(const h of [3.9,8.05,12.1])for(let k=1;k<count-1;k++){const s0=k*step+.9,s1=(k+1)*step-.9;holes.push(slab([localPoint(a,b,s0,2.02),localPoint(a,b,s1,2.02),localPoint(a,b,s1,2.62),localPoint(a,b,s0,2.62)],h,h+2.45));}
}
// Equilateral tower: three straight facades, four lower floors taper continuously to a smaller foot.
const t=ccw(TRIANGLE),centroid=t.reduce((a,b)=>[a[0]+b[0]/3,a[1]+b[1]/3],[0,0]);
const factor=h=>.70+.30*Math.max(0,Math.min(1,(h-PODIUM_ROOF)/(TAPER_TOP-PODIUM_ROOF)));
const atHeight=(p,h)=>centroid.map((v,i)=>v+(p[i]-v)*factor(h));
const foot=t.map(p=>atHeight(p,PODIUM_ROOF-.05));
const pedestal=Manifold.hull([...foot.map(([x,y])=>[x,y,z(PODIUM_ROOF-.05)]),...t.map(([x,y])=>[x,y,z(TAPER_TOP+.02)])]);
const towerParts=[pedestal,slab(t,TAPER_TOP,TOWER_ROOF),slab(MACHINE,TOWER_ROOF-.05,MACHINE_TOP)];
const towerSection=new CrossSection([t]);towerParts.push(towerSection.subtract(towerSection.offset(-1,'Miter')).extrude(CROWN_TOP-TOWER_ROOF+.05).translate([0,0,z(TOWER_ROOF-.05)]));
// Blind windows and deeper corner loggias follow the inclined planes at the foot.
const firstTowerHole=holes.length;const FLOOR_PITCH=(TOWER_ROOF-PODIUM_ROOF)/30;
for(let face=0;face<3;face++){const a=t[face],b=t[(face+1)%3],L=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=(b[0]-a[0])/L,dy=(b[1]-a[1])/L,step=L/9;
 for(let floor=0;floor<30;floor++){const h0=PODIUM_ROOF+.65+floor*FLOOR_PITCH,h1=Math.min(h0+2.0,TOWER_ROOF-.7);if(h1<=h0)continue;
  for(let bay=0;bay<9;bay++){const balcony=bay===1||bay===7,margin=balcony?.6:.85,depth=balcony?.72:.34,s0=bay*step+(bay===0?1.75:margin),s1=(bay+1)*step-(bay===8?1.75:margin);
   const verts=[];for(const h of [h0,h1])for(const s of[s0,s1]){const p=atHeight([a[0]+dx*s,a[1]+dy*s],h);for(const d of[-.07,depth])verts.push([p[0]-dy*d,p[1]+dx*d,z(h)]);}holes.push(Manifold.hull(verts));
  }
 }
}
// Large raised garden beds, simplified from the current PDOK orthophoto; planting itself is omitted.
for(const plan of [[[-28,-21],[-20,-22],[-17,-18],[-20,-13],[-28,-14]],[[-30,-8],[-26,-8],[-17,3],[-20,7],[-30,7]],[[-12,-23],[8,-22],[9,-20],[-10,-20]]])plinthParts.push(slab(plan,19.1,20.05));
const towerCheck=union(towerParts).subtract(union(holes.slice(firstTowerHole)));console.log("tower genus",towerCheck.genus());if(towerCheck.genus()!==0)throw Error("Tower window niches are not blind");
const building=union([...plinthParts,...towerParts]).subtract(union(holes));
if(building.status()!=='NoError')throw new Error('CasaNova is not a closed manifold');
await writeLandmark({slug,nodes:[['building:casanova-toren-en-volledige-onderbouw',building]],base:BASE,title:'CasaNova Rotterdam',catalog:{name:'CasaNova',origin:ORIGIN,xAxis:AXIS,groundHeight:45.97028124,groundNap:GROUND,groundOffsetMetres:-.15,groundSamplePoints:[[-31.2813, -32.0387], [3.4371, -29.8862]],replacesBuildings:['NL.IMBAG.Pand.0599100100018533'],description:'Gehele eigen BAG-voetafdruk met terugliggende glasplint, drie echte gevouwen galerijvloeren, dakgardenbedden, driehoekige toren en continu versmallende voet. Dakranden uit 3D BAG/AHN5 2023; z=NAP-2.54 m, lokale X langs de noordelijke torengevel (14.887 graden). Vensters, loggia’s, taperhoogte, plintpuien en galerijvouwen zijn uit schuine foto’s geschat en voor 1:1000 vereenvoudigd; The Muse blijft PDOK.',realWorld:{podiumRoofNapM:PODIUM_ROOF,taperTopNapM:TAPER_TOP,towerRoofNapM:TOWER_ROOF,crownTopNapM:CROWN_TOP,machineTopNapM:MACHINE_TOP,groundNapM:GROUND,facadeBaysPerSide:9,blindWindowDepthM:.34,blindLoggiaDepthM:.72,photoEstimatedNeckScale:.70},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100018533','PDOK BAG 0599100100018533 EPSG:28992, actuele contour','PDOK AHN5 DSM 0.5 m (2023); PDOK AHN DTM 0.5 m en actuele orthoHR','PDOK 3D Basisvoorziening: maaiveld op Wijnhaven 45.9703/46.0340 m ellipsoïdisch','https://barcodearchitects.com/projects/casanova/ (schuine foto’s Hans Wilschut, uitsluitend visuele referentie; maten uit open data)','https://commons.wikimedia.org/wiki/File:CasaNova_Rotterdam.jpg Dinx, CC BY-SA 4.0','https://nl.wikipedia.org/wiki/CasaNova_(Rotterdam)']}});
