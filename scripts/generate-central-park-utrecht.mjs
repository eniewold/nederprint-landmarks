// Central Park: straight main shaft, sculpted indoor-park waist, curved lobby,
// two measured roof cores, shared Forum garage and complete north residential wing.
// Example: generate-the-rock.mjs; named continuous facade/building volumes.
// Plan/roof constants: 3D BAG, TU Delft/3DGI CC BY4.0, AHN5 2023. Verified
// with AHN5 DSM WCS and current PDOK ortho; AHN4 shows an unfinished 50m tower.
import {Manifold,CrossSection,prism,rect,box,ccw,union,circle,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='central-park-utrecht',ORIGIN=[135822,455819],AXIS=[.8660254,.5],GROUND=2.8,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.3],[s0,.3]].map(([s,k])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],h])));}
function windows(body,poly,first,top,{pitch=3.85,width=1.65,step=2.8,height=2.75,depth=.35,vary=false}={}){
 const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let row=0;
 for(let h=first;h+height<top-.5;h+=pitch,row++)for(let s=.7;s+1<L-.6;s+=step)cuts.push(niche(a,b,s,Math.min(s+width+(vary?(row%3)*.15:0),L-.6),h,h+height,depth));}
 return cuts.length?body.subtract(union(cuts)):body;
}
const shaftPlan=[[-23.2,-13.2],[24.34,-14.18],[24.83,15.0],[-22.83,15.37]];
// The garden is at 45m above street, bounded by a recessed, undulating curtain
// wall and a sculpted soffit. These are architectural faces, not DSM slices.
let lower=windows(prism(shaftPlan,z(14.8),z(50.782)),shaftPlan,14.0,50.782,{vary:true});
let upper=windows(prism(shaftPlan,z(57.6),z(93.061)),shaftPlan,59.2,93.061,{vary:true});
const gardenPlan=[[-21.7,-10.8],[-12,-10.8],[-8,-10.1],[-5,-10.9],[2,-11.5],[10,-10.9],[14,-9.7],[20,-10.7],[21.7,-8.8],[21.7,-3],[20.1,1],[22,4],[21.9,10.6],[18,11.9],[10,12.4],[5,12],[2,10.4],[-4,11.0],[-12,12.8],[-19,12.4],[-21.7,10.7],[-20.0,4],[-19.8,0],[-21.7,-4]];
let garden=windows(prism(gardenPlan,z(50.65),z(58.0)),gardenPlan,51.2,57.9,{pitch:8,height:5.5,width:1.25,step:2.6,depth:.25});
// Thin curved ceiling edges grow out of the inset facade into the upper shaft.
// Loft sectors avoid a free horizontal lip; the export confirms 45-degree support.
const ceiling=[];for(let i=0;i<shaftPlan.length;i++){
 const a=shaftPlan[i],b=shaftPlan[(i+1)%shaftPlan.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],inward=[-t[1],t[0]],count=Math.ceil(L/2);
 for(let j=0;j<count;j++){
  const corners=[];for(const s of[j*L/count,(j+1)*L/count]){
   const wave=(.5-.5*Math.cos(2*Math.PI*s/L)),drop=1.0+2.0*wave,depth=1.4+1.8*wave;
   corners.push([a[0]+s*t[0],a[1]+s*t[1],z(57.6)],[a[0]+s*t[0]+inward[0]*depth,a[1]+s*t[1]+inward[1]*depth,z(57.6-drop)],[a[0]+s*t[0]+inward[0]*depth,a[1]+s*t[1]+inward[1]*depth,z(58.2)],[a[0]+s*t[0],a[1]+s*t[1],z(58.2)]);
  }ceiling.push(Manifold.hull(corners));
 }
}
// Curved public lobby follows the walking line at Forum level. Its glass skin
// is filled for printing, with blind vertical mullion niches.
const lobbyPlan=[[-22.0,-13.1],[16,-13.8],[16,-12],[18,-11],[21.6,-12.2],[22.7,-11.2],[22.7,1],[22.0,3],[19.7,5],[18.3,8.5],[17.2,11.8],[16,13.5],[-22,14.6]];
const lobby=windows(prism(lobbyPlan,BASE,z(15.1)),lobbyPlan,10.85,15.1,{pitch:5,height:3.0,width:1.2,step:2.8,depth:.25});
// The lower office starts above the two-storey public lobby. Remove just the
// exposed outer casing below it; keep the garage and structural core massive.
const lowCasing=prism(shaftPlan,z(10.321),z(14.8)).subtract(prism(lobbyPlan,z(10.0),z(15.2)));
// The shaft starts above the lobby; no coplanar subtraction skins.
const largeRoofCore=B(-13.56,-8.23,1.33,9.52,92.85,97.319),smallRoofCore=B(5.4,-4.4,12.56,5.38,92.85,99.25);
const eastRoofService=B(12.5,-3.0,16.5,6.5,92.85,96.15),eastParapet=B(22.8,-6.0,24.55,9.5,92.8,94.258);
// Northern residential bar belonging to the SAME BAG: three contiguous wings
// with measured low roof seams and blind balcony/panel recesses, plus stair spine.
const housingPieces=[
 windows(prism(rect(-22.89,35.4,-4.3,48.05),BASE,z(47.724)),rect(-22.89,35.4,-4.3,48.05),11.8,47.724,{pitch:3.15,width:3.4,step:4.7,height:2.15,depth:.5}),
 windows(prism(rect(-22.89,47.85,-4.49,64.35),BASE,z(47.843)),rect(-22.89,47.85,-4.49,64.35),11.8,47.843,{pitch:3.15,width:3.4,step:4.7,height:2.15,depth:.5}),
 windows(prism(rect(-22.89,64.15,-4.03,76.34),BASE,z(47.84)),rect(-22.89,64.15,-4.03,76.34),11.8,47.84,{pitch:3.15,width:3.4,step:4.7,height:2.15,depth:.5})];
const housingStair=windows(prism([[-4.85,47.94],[.46,47.94],[.42,62.28],[-.31,71.14],[-.7,73.53],[-4.03,73.53]],BASE,z(49.4)),rect(-4.85,47.94,.46,73.53),11.8,49.4,{pitch:3.15,width:1.1,step:2.3,height:2.15});
// The Forum is an above-ground garage roof, absent from the old PDOK terrain:
// PDOK samples here read street NAP 2-4m; AHN5 confirms roof 10.3-11.1m.
// Preserve the flat real roof; discard the warped 3DBAG south-basement patch
// with fictitious elevations from -0.36 to 98.86m. Do not cover the tiny utility
// hut BAG0344100000156688 outside this complex.
const garagePlan=[[-23.97,-54.27],[26.96,-54.62],[27.06,-38.02],[24.75,-38],[25.27,34.07],[24.17,35.99],[24.29,62.15],[-.88,62.28],[-4.03,73.53],[-22.89,76.33],[-22.95,-12.05],[-23.83,-12.07]];
const garage=prism(garagePlan,BASE,z(10.321));
// Distinct low northern landscape/service roof, measured higher than the plaza.
const landscapePlan=[[-22.73,23.11],[-20.27,23.11],[-6.43,24.8],[5.48,30.08],[4.53,36.74],[16,36.23],[15.32,29.79],[2.32,23.41],[.32,18.73],[1.65,17.38],[13.48,17.04],[13.91,14.97],[24.83,15],[24.2,43.05],[6.94,44.07],[-1.77,48.94],[-4.6,48.99],[-4.3,35.33],[-22.73,35.4]];
const landscape=prism(landscapePlan,z(10.15),z(11.119));
const all=union([lower,upper,garden,...ceiling,lobby,largeRoofCore,smallRoofCore,eastRoofService,eastParapet,...housingPieces,housingStair,garage,landscape]);
const body=Manifold.compose(all.decompose().filter(s=>s.volume()>0));
const local=([u,v])=>[(u-ORIGIN[0])*AXIS[0]+(v-ORIGIN[1])*AXIS[1],-(u-ORIGIN[0])*AXIS[1]+(v-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:central-park-taille-forum-en-woonvleugel',body]],catalog:{name:'Central Park',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:45.86210,groundSamplePoints:[[135792,455788],[135774,455884]].map(local),replacesBuildings:['NL.IMBAG.Pand.0344100000149581'],description:'Rechte Central Park-toren met terugliggende golvende glazen binnenparktaille, gebogen Forum-lobby, twee dakinstallatiekernen, de volledige gedeelde woonvleugel en het echte verhoogde garagedak; AHN5 2023 en actuele ortho in plaats van AHN4-bouwfase.',realWorld:{groundNapM:GROUND,roofNapM:93.061,largeRoofCoreNapM:97.319,smallRoofCoreNapM:99.25,gardenLowerEdgeNapM:50.782,gardenCeilingNapM:57.6,forumRoofNapM:10.321,landscapeRoofNapM:11.119,housingRoofsNapM:[47.724,47.843,47.84],estimates:['Taillehoogte en de golvende glas- en plafondvlakken uit architectplannen en schuine fotos; 1-3m terugligging en circa 1-3m verticale onzekerheid','Gevarieerd verticale kozijnritme, vloerbanden en .35m blinde vensters uit fotos; zichtbare materiaalstroken minstens .9m','Gebogen lobby uit architectplattegrond geschaald op gemeten torenvoet; contour circa .5-1m vereenvoudigd','Noordelijke woonvleugel, balkon-/raamritme en trappenkop49.4m uit ortho, fotos en 3DBAG samengevoegde dakpatches; gevelnissen .5m','Hoofdinstallaties op gemeten dakhoogtes, kleinere leidingen/hekwerken onder.9m samengevoegd of weggelaten','Geen taps toelopende toren met getrapte groene gevelterrassen: bronarchitect en fotos tonen een rechte bronzen gevel met glazen binnenpark']},sources:['https://groupa.nl/nl/projecten/central-park-utrecht-nl/ (architect, ontwerp en plannen)','https://groupa.nl/news/straight-building-curvy-edges/ (architect, taille en gebogen plint)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000149581 (TU Delft/3DGI CC BY4.0; AHN5 2023)','https://www.ahn.nl/dataroom (AHN5 DSM WCS Ellipsis Drive; CC0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0; hier bouwfase)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Hoogebouw_aan_het_Jaarbeursplein_in_Utrecht.jpg (Choinowski CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Central_Park_Utrecht_under_construction.jpg (Choinowski CC BY-SA4.0, alleen gevel en taille als referentie)']}});
