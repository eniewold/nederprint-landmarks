// Yvie & congress hotel: Team V, completed 2025/registered2026.
// Example generate-grotius-den-haag.mjs read in full.
// Named BAG/3DBAG (TU Delft/3DGI CC BY4.0) roof planes, AHN5 2023 heights.
// Continuous shafts and actual balcony/roof parts, never stacked DSM slices.
import {Manifold,CrossSection,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='y-towers',ORIGIN=[122133,488703],ANGLE=36,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=1.65,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const residencePlan=[[4.017, -15.55], [5.754, -15.584], [5.211, -13.299], [18.558, -13.219], [18.313, -15.713], [20.078, -15.72], [20.917, -13.205], [37.894, -13.103], [38.32, -4.823], [39.664, -5.106], [39.597, -3.471], [40.996, -3.424], [40.91, 10.199], [6.692, 10.3], [6.378, 2.138], [3.31, 0.767]];
const resEastShoulder=[[46.191, -5.161], [46.756, 10.182], [40.91, 10.199], [40.996, -3.424], [39.597, -3.471], [39.664, -5.106], [38.32, -4.823], [37.894, -13.103], [41.402, -13.082], [41.729, -5.251]];
const resWestShoulder=[[3.304, -13.31], [3.31, 0.767], [-1.344, 0.84], [-1.642, -11.809], [-2.446, -12.03], [-1.704, -14.385], [-0.642, -13.334]];
const resNorthWestShoulder=[[4.746, 0.745], [6.378, 2.138], [6.692, 10.3], [3.602, 10.308], [3.298, 9.076], [2.94, 2.442], [4.842, 2.098]];
const resPlantPlan=[[28.186, 4.102], [18.251, 3.998], [18.663, -3.194], [27.342, -3.047]];
const hotelPlantPlan=[[-42.472, -35.246], [-42.386, -43.13], [-44.164, -43.412], [-44.219, -58.102], [-22.751, -58.079], [-22.216, -35.185]];
const hotelPlan=rect(-49.72,-62.79,-17.25,-30.3);
// Current aboveground footprint excludes the large underground garage under
// Schegpark. Temporary AHN5 construction containers/park objects are gone
// on the current ortho and must not become permanent detached model parts.
const podiumPlan=rect(-49.74,-62.8,56.59,10.32);
const westLobby=rect(-49.74,-28.8,3.3,10.32),eastLobby=rect(42.02,-62.74,56.59,9.97);
let body=union([prism(podiumPlan,BASE,z(15.076)),prism(westLobby,BASE,z(18.872)),prism(eastLobby,BASE,z(18.901)),prism(hotelPlan,BASE,z(111.624)),B(-47.79,-31.62,-27.43,-27.61,GROUND,106.952),prism(hotelPlantPlan,z(111.5),z(115.916)),prism(residencePlan,BASE,z(106.112)),prism(new CrossSection([ccw(resEastShoulder)]).offset(.03).toPolygons()[0],BASE,z(102.52)),prism(new CrossSection([ccw(resWestShoulder)]).offset(.03).toPolygons()[0],BASE,z(102.534)),prism(new CrossSection([ccw(resNorthWestShoulder)]).offset(.03).toPolygons()[0],BASE,z(102.512)),prism(resPlantPlan,z(105.95),z(107.638)),Manifold.extrude(new CrossSection([ccw(residencePlan)]).subtract(new CrossSection([ccw(residencePlan)]).offset(-.95)),107.312-105.95).translate([0,0,z(105.95)]),B(-17.5,-38.4,19.3,-24,GROUND,18.9),B(18.16,-19.39,40.17,-13.09,GROUND,16.66)]);
// The courtyard terrace has its own measured lower roof. The central glass
// atrium has an AHN no-return gap and crane-contaminated false108m plane;
// estimated18.9m coherent with adjacent lobby roofs, explicitly documented.
body=body.subtract(B(-39.89,-5.68,-16.88,9.39,15.223,20));
// Diamond skylights are thick shallow reliefs joined to the actual lobby
// roof; no open free-standing frame or extra ground/garage plate.
const skylights=[];for(const u of[-35,-29,-23])for(const v of[-22,-16,-10]){const d=[[u-2.1,v],[u,v-2.1],[u+2.1,v],[u,v+2.1]];skylights.push(Manifold.hull([...ring3(d,z(18.75)),[u,v,z(19.7)]]));}
body=union([body,...skylights]);
function niche(a,b,s0,s1,h0,h1,d=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return prism([[s0,-d],[s1,-d],[s1,.5],[s0,.5]].map(([u,v])=>[a[0]+u*t[0]+v*n[0],a[1]+u*t[1]+v*n[1]]),z(h0),z(h1));}
function carve(c){const candidate=body.subtract(c),parts=candidate.decompose(),valid=candidate.genus()===0&&parts.length===1;for(const p of parts)p.delete();if(valid){const previous=body;body=candidate;previous.delete();}else candidate.delete();c.delete();}
function windows(plan,first,top,step=3.1,pitch=3.2,width=1.8,height=2.2,d=.35){const q=ccw(plan);for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=first;h+height<top-1;h+=pitch){const cuts=[];for(let s=1;s+width<L-1;s+=step)cuts.push(niche(a,b,s,s+width,h,h+height,d));if(cuts.length)carve(union(cuts));for(const c of cuts)c.delete();}}}
// Residential tower: horizontal natural-stone belts with staggered balcony
// fields. The structural shaft is one prism. Balconies have.95m floors and
//45-degree undersides reaching back inside the thick body.
const q=ccw(residencePlan),balconies=[],resGlass=[];
for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<7||((a[0]+b[0])/2<7&&Math.abs(b[1]-a[1])>L*.9))continue;const t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];
 for(let h=5.4,k=0;h+2.12<105.1;h+=3.15,k++){
  const w=Math.min(8.2,L-2.2),stride=w+1.05;for(let s=1;s+w<L-1;s+=stride)resGlass.push(niche(a,b,s,s+w,h,h+2.12,.55));
  const s0=1.1+((k+i)%3)*Math.min(2,(L-5)/6),s1=Math.min(L-1.1,s0+Math.min(16,L-2.2));if(s1-s0<3)continue;
  const plane=d=>[[s0,-3],[s1,-3],[s1,d],[s0,d]].map(([s,v])=>[a[0]+s*t[0]+v*n[0],a[1]+s*t[1]+v*n[1]]);
  // Use a ray to ensure this is an external balcony, not an internal join.
  const m=(s0+s1)/2,point=[a[0]+m*t[0],a[1]+m*t[1]],hits=body.rayCast([point[0]+n[0]*3,point[1]+n[1]*3,z(h+.5)],[point[0]-n[0]*1,point[1]-n[1]*1,z(h+.5)]);if(hits.length&&Math.hypot(hits[0].position[0]-point[0],hits[0].position[1]-point[1])<1)balconies.push(Manifold.hull([...ring3(plane(.02),z(h)-2.15),...ring3(plane(1.2),z(h)-.95),...ring3(plane(1.2),z(h))]));
 }
}
let rejectedBalconies=0;for(const balcony of balconies){const candidate=body.add(balcony),parts=candidate.decompose();if(candidate.genus()===0&&parts.length===1){const previous=body;body=candidate;previous.delete();}else{rejectedBalconies++;candidate.delete();}for(const p of parts)p.delete();balcony.delete();}if(rejectedBalconies)throw new Error('Unintended open balcony frames');
// Hotel: continuous dark stone corner piers and narrow vertical glazing.
windows(hotelPlan,2.2,111.624,2.9,3.18,1.8,2.2,.35);
windows(rect(-47.79,-31.62,-27.43,-27.61),20.1,106.952,2.9,3.18,1.8,2.2,.3);
for(const cut of resGlass)carve(cut);
windows(resEastShoulder,2.5,102.52,3.1,3.15,1.95,2.1,.35);windows(resWestShoulder,2.5,102.534,3.1,3.15,1.95,2.1,.35);windows(resNorthWestShoulder,2.5,102.512,3.1,3.15,1.95,2.1,.35);
// Two-storey public shopfronts/lobby, broad closed glass panels and plinth.
windows(podiumPlan,2.5,15.076,5.0,5.9,3.7,4.7,.45);windows(westLobby,16.0,18.872,5,3.2,3.7,1.1,.3);windows(eastLobby,15.9,18.901,5,3.2,3.7,1.2,.3);
body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));if(body.status()!=='NoError'||body.genus()!==0||body.decompose().length!==1)throw new Error('Yvie/hotel/podium must remain one closed structural solid');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:yvie-maritim-beide-torens-balkons-en-complete-congresplint',body]],catalog:{name:'Y-Towers (Maritim Hotel en Yvie)',origin:ORIGIN,xAxis:AXIS,groundHeight:44.580624,groundOffsetMetres:0,groundSamplePoints:[[122100,488641],[122187,488750],[122168,488780]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012247366'],description:'Beide Y-Towers met volledige eigen bovengrondse congres-/lobbyplint, donker verticaal hotelraster, verspringende horizontale woonbalkons met schuine onderzijde, eigen dakschouders en dakkoppen; de parkgarage, oude bouwketen en valse kraanwand tot108m zijn weggelaten en de buurtorens blijven behouden.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,hotelRoofNapM:111.624,hotelPlantNapM:115.916,hotelShoulderNapM:106.952,residenceRoofNapM:106.112,residencePlantNapM:107.638,residenceShouldersNapM:[102.52,102.534,102.512],congressRoofNapM:15.076,lobbyRoofsNapM:[18.872,18.901],courtyardTerraceNapM:15.223,atriumRoofEstimateNapM:18.9,estimates:['Glazen atriumroof18.9NAP circa2-3m onzeker: AHN5 heeft geen retour en LoD2.2 foutvlak108.242 is door een bouwkraan vervuild; aansluiting bij gemeten lobbydaken en actuele fotos/ortho','Hotelvensters1.8m breed/.35m blind,2.2m hoog op3.18m verdieping en2.9m travee; natuurstenen hoekpilasters massief','Woonbalkonveldenverspringen1-2m uit fotos; vloeren1.2m dik,uitkraging1.2m met45graden onderzijde, glasbanden.55m blind/2.12m hoog op3.15m steek','Glazen westelijke verbindingsstrook blijft zonder fictieve uitkragende balkonframes; dakrand op107.312NAP uit AHN5/fotos tot gesloten.95m rand vereenvoudigd, circa.6m onzeker; dakcontouren tot.75m vereenvoudigd, hotelhoeken rechtgetrokken; gemeten hoogten uit AHN5/3DBAG, machines115.916/107.638NAP','Negen dakwybertjes met19.7NAP kroon circa.4m verhoogd voor herkenbaarheid; publieke garage-/parkplaat en inmiddels verdwenen bouwcontainers niet gemodelleerd']},sources:['https://teamv.nl/project/y-towers-overhoeks/ (architect,torens/plint/wybertjes/balkonritme,2025)','https://knauf.com/nl-NL/projectreferenties/yvie-ytowers-amsterdam (projectleverancier114/106m)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012247366 (TU Delft/3DGI CC BY4.0;AHN52023)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0,bouwjaar2026,pandingegebruik)','https://www.ahn.nl/ahn5 (AHN5DSM2023 CC0,EllipsisWCSfc9d369f-94ca-4373-8281-a6854edb67c9)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho,parkvrijvanbouwketen)','https://commons.wikimedia.org/wiki/File:Yvie_en_Maritim.jpg (MrAronymous CC0)','https://commons.wikimedia.org/wiki/File:Yvie_AmsterdamNoord.jpg (J93ffrey CC BY-SA4.0)','https://commons.wikimedia.org/wiki/File:Maritim_Hotel_Amsterdam_2022.jpg (Choinowski CC BY-SA4.0,alleenbuitenvormnietbouwkraan)']}});
