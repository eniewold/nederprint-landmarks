// Rijntoren, UNStudio, 2005. Voorbeeld generate-evoluon.mjs geheel gelezen.
// Doorlopende schuine gevelvlakken, een bovenprisma en dakbouwdelen;
// geen gestapelde hoogtelagen. Maten uit BAG/AHN/3D BAG, details uit foto's.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='rijntoren',ORIGIN=[190215,444129],ANGLE=-13,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=28.9,BASE=-5.4,z=h=>h-GROUND;
const PLAN=ccw([[-20.75,-8.57],[20.81,-8.7],[22.04,-8.64],[23.22,-8.27],[24.27,-7.62],[25.1,-6.75],[25.71,-5.68],[26.05,-4.42],[26.08,-3.56],[25.97,-2.7],[19.86,8.02],[-22.11,8.42]]);
const footPoint=([x,y])=>[x,1+(y-1)*8/17.12],foot=PLAN.map(footPoint);
const expansion=h=>Math.max(0,Math.min(1,(h-24.5)/20));
const pointAt=([x,y],h)=>{const q=footPoint([x,y]),t=expansion(h);return [x,q[1]+(y-q[1])*t];};
// Smalle voet, glazen overgangsvlakken over de onderste vier niveaus en
// bovenbouw met afgeronde noordoostelijke kop. De hull heeft doorlopende
// schuine zijvlakken, geen stapeling van horizontale contourplakken.
let tower=union([prism(foot,BASE,z(24.6)),Manifold.hull([...ring3(foot,z(24.5)),...ring3(PLAN,z(44.5))]),prism(PLAN,z(44.35),z(89.990))]);
const windows=[];
function field(a,b,s0,s1,h0,h1,depth=.45){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([h0,h1].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>{const xy=pointAt([a[0]+s*t[0],a[1]+s*t[1]],h);return [xy[0]+d*n[0],xy[1]+d*n[1],z(h)];})));}
for(let i=0;i<PLAN.length;i++){
 const a=PLAN[i],b=PLAN[(i+1)%PLAN.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
 // Lange glasbanden, onderbroken door de middensponning; bij de ronde kop
 // volgen kortere aangesloten glasvelden dezelfde bouwgeometrie.
 if(L<1)continue;
 const width=L>15?5.9:Math.max(.55,L-.25),step=L>15?6.4:L;
 for(let s=.15;s+width<L-.05;s+=step)for(let h=31.3;h+2.35<89.8;h+=3.55){const centre=1-Math.min(1,Math.abs((s+width/2)-L/2)/(L/2));windows.push(field(a,b,s,s+width,h,h+2.3-.65*centre));}
}
tower=tower.subtract(union(windows));
// Glazen entreevelden op het hogere stadsbalkon en expeditie op het lagere
// niveau, beide geschat uit de architectbeschrijving en schuine foto's.
const entryCuts=[];for(const i of [0,10]){const a=PLAN[i],b=PLAN[(i+1)%PLAN.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<5)continue;for(let s=1;s+3.8<L-.6;s+=4.5)entryCuts.push(field(a,b,s,s+3.8,25.1,29.5,.6));}
tower=tower.subtract(union(entryCuts));
// Gemeten brede daklift-/techniekkern, geen extra toren of terreinplaat.
const core=prism([[-10.32,-6.8],[17.74,-6.73],[17.83,.89],[-10.27,1.02]],z(89.8),z(94.169));
// De opstaande dakrand langs de noordgevel en om de gebogen kop is ruim
// één meter hoog. De vrije dakruimte en beide gemeten dakvlakken blijven.
const parapet=prism([[-21.44,6.99],[19.67,7.02],[25.29,-4.51],[23.08,-8.33],[24.86,-7.05],[25.97,-4.86],[25.96,-2.71],[19.86,8.01],[-21.54,8.4]],z(89.8),z(91.124));
let model=union([tower,core,parapet]).setTolerance(.005);
model=Manifold.compose(model.decompose().filter(s=>s.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Rijntoren niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:rijntoren-smalle-voet-gebogen-kop-glasbanden-en-dakopbouw',model]],catalog:{name:'Rijntoren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:72.51205677,groundSamplePoints:[[190192,444123],[190214,444106],[190242,444130],[190209,444146]].map(local),replacesBuildings:['NL.IMBAG.Pand.0202100000247396'],description:'Complete Rijntoren,2005: smalle dragende voet, doorlopende verbredende glazen gevelvlakken over vier onderste niveaus, afgeronde kop, horizontale venster-/borstweringbanden met middensponning, hele entree-/expeditievoet, gemeten daklift-/techniekkern en opstaande gebogen dakrand. Arnhem Centraal en Parktoren zijn eigen panden en blijven behouden. Geen DSM-hoogtelagen of extra plein-/garageplaat.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,lowerPublicLevelNapM:24.5,lobbyLevelNapM:31,fullWidthLevelNapM:44.5,mainRoofNapM:89.990,coreRoofNapM:94.169,parapetNapM:91.124,footWidthM:8,estimates:['BAG-contour .1–.3m vereenvoudigd, gebogen kop uit vaste BAG-punten','onderste vier niveaus als schuine glasvlakken van 8m voet naar17.12m bovenbouw, overgang24.5–44.5NAP en rechte in plaats van licht gekromde generatrices geschat','glasbanden5.9m met3.55m verdiepingsritme, bandhoogte2.3m naar1.65m bij middensponning, diepte.45m en entreeraster geschat uit architectfoto’s','geen annex van stationpand0223614; bestaand Arnhem Centraal-model behouden; Parktoren0238526 niet vervangen','fijne roedes, reclame, dakrailingen en kleine antennes onder.9m weggelaten; kleurverloop niet apart gemodelleerd']},sources:['https://architectenweb.nl/projecten/project.aspx?id=4449 (eigen UNStudio-projectprofiel,voet8m,uitkraging5/3m,niveaus24.5/31; foto’s alleen referentie)','https://www.grunsvengroep.nl/projecten/werken/park-en-rijn-toren-arnhem/ (hoofdaannemer,70m,16verdiepingen)','https://ibsconsultants.nl/en/portfolio/construction-of-park-en-rijn-towers/ (geveladviseur,schuine primaire foto’s alleen referentie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000247396 (TU Delft/3DGI,CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
