// Cité Rotterdam. Primitives example generate-evoluon.mjs read in full.
// Named podium, atrium, office wings and cantilevered tower heads; no DSM height stacks.
import {Manifold,CrossSection,ccw,prism,box as kitBox,union,writeLandmark} from './efteling-kit.mjs';
const box=(x0,x1,y0,y1,z0,z1)=>kitBox(x0,y0,z0,x1,y1,z1);
const slug='cite-rotterdam',ORIGIN=[93670,435720],ANGLE=-35.20409234741288,GROUND=3.90,BASE=-.75,z=h=>h-GROUND,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)];
const FOOT=[[46.333,16.825],[-50.352,16.735],[-50.335,-11.103],[-46.84,-11.11],[-46.85,-15.96],[-27.445,-15.998],[-27.434,-10.56],[31.514,-10.566],[31.52,-15.283],[49.811,-15.355],[49.873,10.188],[46.41,10.191],[46.333,16.825]],ROOFS={"3":[[-27.02,-10.5],[-26.995,10.87],[-27.749,11.698],[-47.334,11.699],[-47.399,-11.102],[-46.845,-11.103],[-46.854,-15.954],[-27.449,-15.992],[-27.438,-10.5],[-27.02,-10.5]],"15":[[-30.494,16.742],[-50.326,16.534],[-50.339,-10.91],[-47.397,-10.581],[-47.334,11.699],[-31.017,11.697],[-30.494,16.742]],"30":[[31.402,9.992],[31.517,-15.277],[49.806,-15.348],[49.87,10.101],[31.402,9.992]],"36":[[46.412,16.741],[4.603,16.741],[4.446,-3.111],[5.843,-1.604],[8.252,-1.611],[8.892,-2.784],[10.239,-3.527],[11.401,-3.061],[10.927,-1.619],[27.567,-1.667],[27.416,-3.948],[31.341,-5.078],[31.402,9.992],[49.792,10.101],[46.406,10.197],[46.412,16.741]],"35":[[4.458,-1.601],[-7.806,-1.564],[-7.883,-0.155],[-10.371,-0.175],[-10.81,-1.556],[-11.258,-1.554],[-11.422,-10.523],[4.388,-10.537],[4.458,-1.601]],"24":[[-7.806,-1.564],[4.458,-1.601],[4.603,16.741],[-10.417,16.742],[-10.213,12.947],[-10.5,12.892],[-10.665,6.514],[-17.135,6.486],[-17.245,0.195],[-7.883,-0.155],[-7.806,-1.564]],"14":[[11.401,-3.061],[10.239,-3.527],[8.892,-2.784],[8.252,-1.611],[5.843,-1.604],[4.446,-3.111],[4.388,-10.537],[31.319,-10.559],[31.341,-5.078],[27.416,-3.948],[27.567,-1.667],[10.927,-1.619],[11.401,-3.061]],"5":[[-35.78,-9.295],[-35.731,-9.881],[-41.796,-10.661],[-41.527,-13.322],[-34.216,-13.161],[-35.78,-9.295]],"7":[[37.248,-12.136],[44.219,-12.803],[44.154,-9.894],[38.374,-10.225],[38.375,-9.95],[37.255,-10.29],[36.569,-10.835],[37.248,-12.136]],"12":[[41.786,6.309],[38.031,5.126],[39.317,2.395],[42.717,2.666],[42.857,-1.014],[41.985,-3.264],[43.135,-5.701],[45.429,-0.619],[47.228,-0.548],[47.549,4.72],[41.786,6.309]],"20":[[35.008,4.519],[34.014,1.974],[39.317,2.395],[38.359,4.428],[37.467,4.452],[37.139,4.844],[35.008,4.519]],"23":[[38.384,-7.234],[38.374,-10.225],[44.154,-9.894],[44.122,-8.434],[38.384,-7.234]],"32":[[-32.593,8.346],[-33.27,1.872],[-34.368,0.932],[-33.334,1.266],[-33.421,0.43],[-30.801,2.086],[-30.721,8.145],[-32.593,8.346]],"33":[[-43.202,-4.053],[-42.48,-4.391],[-43.634,-10.896],[-42.365,-10.723],[-40.662,-5.241],[-40.568,-2.95],[-42.02,-1.764],[-43.202,-4.053]],"34":[[-42.904,-0.628],[-40.568,-2.95],[-40.602,-3.783],[-37.893,-3.458],[-37.996,-0.064],[-40.404,0.441],[-40.84,-0.067],[-42.055,-0.003],[-42.073,1.018],[-41.528,1.191],[-42.122,3.494],[-40.258,4.675],[-40.03,6.095],[-40.375,6.504],[-42.738,6.448],[-42.904,-0.628]],"6":[[11.167,12.775],[10.91,10.688],[19.242,10.275],[17.567,13.23],[11.167,12.775]],"29":[[12.295,8.837],[10.443,8.65],[9.304,6.808],[9.546,6.446],[10.915,5.696],[13.758,6.002],[13.754,7.738],[12.295,8.837]]};

// Quarter-metre survey rounding joins nearly coincident facade planes (0.25 mm at 1:1000).
for(const poly of [FOOT,...Object.values(ROOFS)])for(const point of poly)for(let a=0;a<2;a++)point[a]=Math.round(point[a]*4)/4;
const cs=poly=>new CrossSection([ccw(poly)]),extrude=(poly,a,b)=>cs(poly).extrude(b-a).translate([0,0,a]);
const closed=poly=>{const q=ccw(poly);return [...q,q[0]];};
const headWest=ROOFS[3],headEast=ROOFS[30];
const halfPlane=box(-100,100,-10.5,100,-2,100).slice(0),westCore=cs(headWest).intersect(halfPlane).toPolygons()[0],eastCore=cs(headEast).intersect(halfPlane).toPolygons()[0];
const frontWest=cs(headWest).subtract(cs(westCore)),frontEast=cs(headEast).subtract(cs(eastCore));
const floor=cs(FOOT).offset(.02,'Miter');
const podium=cs(FOOT).subtract(CrossSection.union([frontWest,frontEast,cs(ROOFS[14])]));
const parts=[floor.extrude(z(4.60)-BASE).translate([0,0,BASE]),podium.extrude(z(21.369)-BASE).translate([0,0,BASE])],holes=[];
// The low glazed front wing is a separate construction volume, rather than a 21 m podium infill.
parts.push(extrude(ROOFS[14],BASE,z(9.253)));
parts.push(extrude(ROOFS[15],BASE,z(44.718)),extrude(ROOFS[36],BASE,z(44.684)),extrude(ROOFS[35],BASE,z(53.435)));
// Both slender bodies carry a projecting upper head. Its start is a photo estimate near NAP 44.7 m.
// The underside is chamfered at 45 degrees over the measured 4.8/5.0 m projection for support-free 1:1000 printing.
parts.push(extrude(westCore,BASE,z(77.082)),extrude(eastCore,BASE,z(88.898)));
parts.push(extrude(headWest,z(44.70),z(77.082)),extrude(headEast,z(44.70),z(88.898)));
const alongX=(profile,x0,x1)=>Manifold.extrude([ccw(profile)],x1-x0).rotate([90,0,0]).rotate([0,0,90]).translate([x0,0,0]);
parts.push(alongX([[-10.5,z(39.26)],[-15.96,z(44.71)],[-10.5,z(44.71)]],-46.83,-27.47));
parts.push(alongX([[-10.5,z(39.84)],[-15.28,z(44.71)],[-10.5,z(44.71)]],31.56,49.77));
for(const [n,a,b] of [[5,77,79.259],[32,77,79.332],[33,77,79.339],[34,77,78.827],[7,88.8,91.065],[12,88.8,90.837],[20,88.8,91.284],[23,88.8,90.217],[6,44.6,46.894],[29,44.6,46.306]])parts.push(extrude(ROOFS[n],z(a),z(b)));
const shell=union(parts);
// Mixed single and double-height openings, kept blind and clear of shared walls and exposed corners.
function windows(poly,start,pitch,count,{glazed=false,depth=.38}={}){
 poly=closed(poly);
 for(let face=0;face<poly.length-1;face++){
  const a=poly[face],b=poly[face+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<3.1)continue;
  const dx=(b[0]-a[0])/L,dy=(b[1]-a[1])/L,n=Math.max(1,Math.round((L-2.4)/3.4)),step=(L-2.4)/n;
  for(let bay=0;bay<n;bay++){
   const s=1.2+(bay+.5)*step,p=(q,d)=>[a[0]+dx*q-dy*d,a[1]+dy*q+dx*d];
   for(let f=0;f<count;f++){
    const type=(bay*7+f*3+face*11)%13,double=!glazed&&type===2&&f+1<count,h=start+f*pitch,high=glazed?pitch-.65:double?pitch*2-.7:type%3===0?pitch-.6:2.05,width=Math.min(step-.8,glazed?2.8:type%4===0?2.8:1.5),deep=type===5?.62:depth;
    const buried=[s-width/2,s,s+width/2].some(q=>[h+.02,h+high-.02].some(H=>{const a=p(q,-.0001),b=p(q,deep+.8),inside=point=>shell.rayCast([point[0],point[1],z(H)],[point[0]+dy*400,point[1]-dx*400,z(H)]).length%2===1;return inside(a)||!inside(b);}));
    if(!buried)holes.push(prism([p(s-width/2,-.11),p(s+width/2,-.11),p(s+width/2,deep),p(s-width/2,deep)],z(h),z(h+high)));
    if(double)f++;
   }
  }
 }
}
windows(westCore,7.0,3.13,12);windows(eastCore,7.0,3.13,12);
windows(headWest,45.40,3.02,10);windows(headEast,45.40,3.02,14);
windows(ROOFS[15],7.0,3.13,12);windows(ROOFS[36],7.0,3.13,12);
windows(ROOFS[35],7.0,3.06,15,{glazed:true});windows(FOOT,5.1,3.05,5,{glazed:true});windows(ROOFS[14],5.2,3,1,{glazed:true});
// Coloured vertical facade slots become deeper closed relief: colour is handled by the map theme.
// Slot positions are photo estimates; solid back walls and corners remain at least 0.8 mm on 1:1000.
for(const [x,y,a,b] of [[-32.4,-15.96,49,67],[36.0,-15.30,48,71]])holes.push(box(x,x+1.6,y-.10,y+.62,z(a),z(b)));
// Validate blind cuts after each group; reject any cut that would open a corner or disconnect material.
// Remove sub-centimetre boolean slivers before Float32 GLB serialization (0.01 mm at 1:1000).
let facades=shell,accepted=0,rejected=0; for(let i=0;i<holes.length;i+=64){const group=holes.slice(i,i+64),candidate=facades.subtract(union(group));if(candidate.genus()===0&&candidate.decompose().length===1){facades=candidate;accepted+=group.length;}else{for(const h of group){const single=facades.subtract(h);if(single.genus()===0&&single.decompose().length===1){facades=single;accepted++;}else rejected++;}}}console.log("Blind facade topology",{accepted,rejected}); const original=facades.simplify(.001),encodedMesh=original.calculateNormals(0,40).getMesh(),stride=encodedMesh.numProp;
const positions=new Float32Array(encodedMesh.vertProperties.length/stride*3);
for(let i=0;i<positions.length/3;i++)for(let a=0;a<3;a++)positions[i*3+a]=encodedMesh.vertProperties[i*stride+a];
const mesh=new encodedMesh.constructor({numProp:3,vertProperties:positions,triVerts:Uint32Array.from(encodedMesh.triVerts)});mesh.merge();
const reconstructed=new Manifold(mesh),physical=reconstructed.decompose().filter(s=>s.volume()>1e-5),body=union(physical);
console.log('Closed Float32 geometry',body.status(),body.genus(),body.decompose().length);

if(body.status()!=='NoError'||body.genus()!==0||body.decompose().length!==1)throw Error('Cité must be one closed connected complex without internal cavities');
await writeLandmark({slug,nodes:[['building:cite-compleet-woonwerkcomplex',body]],base:BASE,title:'Cité Rotterdam',catalog:{name:'Cité',origin:ORIGIN,xAxis:AXIS,groundHeight:47.54438725,groundNap:GROUND,groundOffsetMetres:-.15,groundSamplePoints:[[-55,0],[0,23]],replacesBuildings:['NL.IMBAG.Pand.0599100000766718'],description:'Gehele Cité met twee cantileverende woontorens, gedeeld atrium, lage glasvleugel en hogere aansluitende bouwdelen. BAG en 3D BAG meten contouren en daken; de uitkraging begint op fotoschatting NAP 44.7 m en krijgt een 45 graden afschuining voor 1:1000. Wisselende blinde raamvelden, verticale kleursleuven als reliÃ«f en het atriumglas zijn vereenvoudigd naar schuine fotoâ€™s. Geen gestapelde hoogtelagen. Z=NAP-3.90 m.',realWorld:{groundNapM:GROUND,westTowerRoofNapM:77.082,eastTowerRoofNapM:88.898,topMachineNapM:91.284,shoulderNapM:44.70,middleCoreRoofNapM:53.435,atriumRoofNapM:21.369,lowWingRoofNapM:9.253,estimatedCantileverStartNapM:44.70,estimatedFacadeRelief:true},sources:['PDOK BAG pand 0599100000766718, complete eigen contour EPSG:28992','3D BAG LoD 2.2: beide torendaken, hogere vleugels en dakmachines','PDOK AHN DSM/DTM 0.5 m en orthoHR','PDOK 3D Basisvoorziening maaiveld 47.5444/47.7334 m ellipsoïdisch','https://www.rotterdamarchitectuurprijs.nl/2012/cite.html (Tangram; John Lewis Marshall, nachtbeeld en atriumfoto)','https://www.stadswonenrotterdam.nl/nl/over-ons/begeleid-wonen-in-cite (schuine dagfoto uitkraging)','https://www.hibex.nl/cite-kop-van-zuid-rotterdam/ (gevelbouwer, twee woontorens)']}});
