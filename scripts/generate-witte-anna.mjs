// Witte Anna: Groep 5, 1987; example generate-weenatoren.mjs read.
// BAG CC0, named LoD2.2 roof planes TU Delft/3DGI CC BY4.0.
// A continuous curved residential shaft with its full bent low housing wing.
import {Manifold,CrossSection,prism,ccw,union,writeLandmark} from './efteling-kit.mjs';
const slug='witte-anna',ORIGIN=[82370,455161],ANGLE=-7.92,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=1.2,BASE=-1,z=h=>h-GROUND;
const xy=([u,v])=>[u*AXIS[0]+v*AXIS[1],-u*AXIS[1]+v*AXIS[0]];
const centre=[-25.682637,-7.438839],radius=11.09284;
const circle=Array.from({length:96},(_,i)=>{const t=i*2*Math.PI/96;return xy([centre[0]+radius*Math.cos(t),centre[1]+radius*Math.sin(t)]);});
const wingRaw=[[35.203, 14.514], [12.472, 2.646], [-20.584, 8.202], [-21.392, 9.676], [-18.808, 11.245], [-19.136, 11.817], [-40.502, 0.282], [-34.513, -0.739], [-35.797, -3.005], [-31.766, 1.036], [-26.192, 3.295], [-18.632, 0.646], [-18.634, -0.67], [-17.12, -1.122], [-17.113, -1.817], [-15.644, -2.022], [-15.573, -5.928], [-14.773, -5.904], [-15.198, -4.028], [-12.136, -4.55], [-11.603, -2.584], [5.294, -4.934], [5.407, -7.534], [14.352, -9.056], [22.706, -4.549], [21.903, -3.292], [39.3, 6.989]];
const gallery1Raw=[[5.407, -7.534], [5.294, -4.934], [-11.603, -2.584], [-12.136, -4.55]];
const gallery2Raw=[[39.3, 6.989], [21.903, -3.292], [22.706, -4.549], [40.38, 5.007]];
const endCoreRaw=[[35.203, 14.514], [40.33, 5.187], [42.778, 6.554], [37.817, 15.911]];
const headRaw=[[-27.196, -5.112], [-29.442, -9.836], [-24.91, -10.322], [-23.215, -7.535], [-24.024, -5.741]];
const eastPlantRaw=[[-21.721, -6.638], [-20.091, -7.196], [-16.439, -7.988], [-16.354, -5.951], [-18.174, -6.005], [-22.501, -4.838], [-23.055, -5.934], [-21.721, -6.199]];
const westPlantRaw=[[-34.117, -9.488], [-32.689, -8.907], [-33.107, -7.422], [-33.765, -7.741], [-34.861, -7.209], [-35.253, -9.081]];
const entryRaw=[[28.431, 16.495], [30.589, 12.497], [31.147, 12.346], [35.203, 14.514], [33.953, 16.811], [35.725, 14.793], [37.817, 15.911], [35.489, 20.235]];
const wing=wingRaw.map(xy),core=endCoreRaw.map(xy);
// Measured roofs of the actual low wing, galleries and stairs. Its tiny
// round/tower connection is expanded 5cm to eliminate survey rounding gaps.
let body=union([prism(circle,BASE,z(73.975)),prism([[-16.8,-3.6],[-15,-3.6],[-15,-1],[-16.8,-1]].map(xy),BASE,z(22.67)),prism(new CrossSection([ccw(wing)]).offset(.05).toPolygons()[0],BASE,z(22.67)),prism(gallery1Raw.map(xy),BASE,z(19.996)),prism(gallery2Raw.map(xy),BASE,z(19.988)),prism(core,BASE,z(17.185)),prism(entryRaw.map(xy),BASE,z(3.829)),prism(headRaw.map(xy),z(73.8),z(77.42)),prism(eastPlantRaw.map(xy),z(73.8),z(74.791)),prism(westPlantRaw.map(xy),z(73.8),z(75.132))]);
function niche(a,b,s0,s1,h0,h1,d=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return prism([[s0,-d],[s1,-d],[s1,.5],[s0,.5]].map(([u,v])=>[a[0]+u*t[0]+v*n[0],a[1]+u*t[1]+v*n[1]]),z(h0),z(h1));}
function subtractBlind(cut){const next=body.subtract(cut);if(next.genus()===body.genus()&&next.decompose().length===1)body=next;else next.delete();}
// Tall passage/glazed stair face at the west-side cylinder/wing junction.
// This recognisable opening passes through the narrow west wing; its
// soffit slopes45degrees and its base stays1m thick. Real spiral steps and railings are too fine at1:1000.
const a=xy([-40.502,.282]),b=xy([-34.513,-.739]),L=Math.hypot(b[0]-a[0],b[1]-a[1]),deg=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
const passage=Manifold.hull([[1,-.5,z(2.2)],[L-1,-.5,z(2.2)],[1,3.0,z(2.2)],[L-1,3.0,z(2.2)],[1,-.5,z(21.6)],[L-1,-.5,z(21.6)],[1,3.0,z(18.1)],[L-1,3.0,z(18.1)]]).rotate([0,0,deg]).translate([a[0],a[1],0]);
const beforePassage=body.volume(),portalBody=body.subtract(passage);
if(portalBody.genus()!==1||portalBody.decompose().length!==1||beforePassage-portalBody.volume()<100)throw new Error('One intentional passage, no detached material or interior cavities');
body=portalBody;
// Thirty-two radial window columns. The curved shaft is one structural
// prism; floor/corner bands are closed material >=.9m, not separate layers.
for(let i=0;i<32;i++){const t=i*2*Math.PI/32,normal=[Math.cos(t),Math.sin(t)],tangent=[-normal[1],normal[0]],mid=[centre[0]+radius*normal[0],centre[1]+radius*normal[1]],A=xy([mid[0]-.575*tangent[0],mid[1]-.575*tangent[1]]),B=xy([mid[0]+.575*tangent[0],mid[1]+.575*tangent[1]]);for(let h=2.4;h+1.55<68.5;h+=2.85)subtractBlind(niche(A,B,0,1.15,h,h+1.55));subtractBlind(niche(A,B,-.23,1.38,68.65,73.025,.25));}
const q=ccw(wing);for(let i=0;i<q.length;i++){const A=q[i],B=q[(i+1)%q.length],L=Math.hypot(B[0]-A[0],B[1]-A[1]);if(L<4)continue;for(let s=1;s+1.45<L-1;s+=2.7){const mid=[A[0]+(B[0]-A[0])*(s+.725)/L,A[1]+(B[1]-A[1])*(s+.725)/L],c=xy(centre);if(Math.hypot(mid[0]-c[0],mid[1]-c[1])<radius+1)continue;for(let h=2.5;h+1.8<22;h+=3)subtractBlind(niche(A,B,s,s+1.45,h,h+1.8,.35));}}
// Glazed end staircase of the lower wing, kept solid behind each panel.
const cq=ccw(core);for(let i=0;i<cq.length;i++){const A=cq[i],B=cq[(i+1)%cq.length],len=Math.hypot(B[0]-A[0],B[1]-A[1]);for(let h=2;h+1.8<16.5;h+=3)for(let u=.9;u+1.2<len-.9;u+=2.3)subtractBlind(niche(A,B,u,u+1.2,h,h+1.8,.3));}
if(body.genus()!==1||body.decompose().length!==1)throw new Error('Tower and wing must have one solid with only the real passage');
body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));
const local=([x,y])=>xy([x-ORIGIN[0],y-ORIGIN[1]]);
await writeLandmark({slug,base:BASE,nodes:[['building:witte-anna-ronde-woontoren-glazen-kop-en-geknikte-woonvleugel',body]],catalog:{name:'Witte Anna (De Keukenrol)',origin:ORIGIN,xAxis:AXIS,groundHeight:44.190224,groundOffsetMetres:0,groundSamplePoints:[[82341,455133],[82409,455159]].map(local),replacesBuildings:['NL.IMBAG.Pand.0518100000354187'],description:'Volledige gerenoveerde ronde woontoren met glazen kroon, gemeten zeskantige dakopbouw en geknikte lage woonvleugel met galerijen en eindtrappenhuis; hoge passage met schuine gesloten bovenkant. La Fenetre en de aangrenzende afzonderlijke woonpanden blijven behouden.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,roundCentreRd:[82344.317363,455153.561161],roundRadiusM:radius,towerRoofNapM:73.975,roofHeadNapM:77.42,wingRoofNapM:22.67,galleryRoofsNapM:[19.996,19.988],endCoreNapM:17.185,entryRoofNapM:3.829,estimates:['Ronde gevel uit BAG/3DBAG gefit op radius11.09m en96 vlakken; kleine glazen gevelsprongen vereenvoudigd','Woningvensters1.15m breed/1.55m hoog op2.85m laagsteek, .35m blind; lage vleugel2.7m steek en3m verdiepingen','Blauwe glazen kop begint geschat68.65NAP circa1m onzeker, als.25m blinde glasvelden','Hoge passage/trapzone uit schuine fotos geschatcirca1-2m, circa3m diep, deels doorlopend in de lage westelijke vleugel, met1m dikke sokkel en45graden bovenkant; geen losse spiraaltrap of rastervloer','Hoofd- en bijdaken/voetplannen volgen3DBAG/AHN4, bovenzijde77.42NAP; open dakframe tot gesloten zeskant vereenvoudigd']},sources:['https://www.dvda-denhaag.nl/portfolio/145/ (Groep5/architectuurdocumentatie)','https://haagwonen.nl/projecten/iconische-haagse-woontoren-witte-anna-weer-als-nieuw/ (eigenaar,renovatie2024,toren166 enlagevleugel62woningen)','https://haagwonen.nl/feest-eerste-deel-renovatie-en-verduurzaming-woontoren-witte-anna-klaar/ (vernieuwdegevels)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000354187 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)','https://commons.wikimedia.org/wiki/File:Den_Haag_Witte_Anna_2025-06-16-1.jpg (Renee Kools CC BY4.0)','https://commons.wikimedia.org/wiki/File:Den_Haag_Witte_Anna_2025-06-16-2.jpg (Renee Kools CC BY4.0)','https://commons.wikimedia.org/wiki/File:Witte_Anna2.JPG (Steven Lek publicdomain)','https://commons.wikimedia.org/wiki/File:De_Witte_Anna_(373123617).jpg (FaceMePLS CC BY2.0)']}});
