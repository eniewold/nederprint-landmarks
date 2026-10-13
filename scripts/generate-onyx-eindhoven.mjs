// Onyx, diederendirrix, 2019. Voorbeeld generate-evoluon.mjs gelezen.
// Doorlopende woonprisma's, verticale gevelvelden, dakvlakken en bouwdelen.
import {Manifold,CrossSection,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='onyx-eindhoven',ORIGIN=[160952,383524],ANGLE=13.4,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=16.95,BASE=-1.2,z=h=>h-GROUND;
const MAIN=rect(-11.84,-10.95,12.94,10.2),REAR=rect(-11.84,10.1,2.38,13.19);
const SW=[[-11.84,-10.95],[-7.54,-10.95],[-5.97,-5.79],[-8.46,-3.69],[-11.84,-3.69]];
const SE=[[7.03,-10.95],[12.94,-10.95],[12.94,-4.99],[7.97,-6.88]];
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.45){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,first,pitch,top,width,step,height){const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.7;s+width<L-.5;s+=step)for(let h=first;h+height<top-.4;h+=pitch)cuts.push(niche(a,b,s,s+width,h,h+height));}return solid.subtract(union(cuts));}
// Twee lagere hoekvelden zijn echte penthouseterrassen, geen DSM-lagen.
let main=prism(MAIN,BASE,z(94.482)).subtract(union([prism(SW,z(87.689),z(101)),prism(SE,z(87.690),z(101))]));
main=facade(main,MAIN,24.3,3.15,94.482,1.5,2.45,2.7);
let rear=facade(prism(REAR,BASE,z(95.503)),REAR,24.3,3.15,94.4,1.5,2.45,2.7);
// De kleine langsribbels zijn gevelbouwdelen met een driehoekige doorsnede;
// de hoofdvorm blijft een prismatisch gebouw met twee terugliggende hoeken.
const fins=[];for(const side of [-1,1])for(let u=-5.3;u<12;u+=2.45){const v=side>0?10.2:-10.95;fins.push(prism([[u-.55,v-side*.25],[u+.55,v-side*.25],[u,v+side*.4]],z(23.5),z(94.6)));}
// Verlichte kroon: afzonderlijke verticale stijlen en bovenregels rond de
// dakruimte. De glasopeningen blijven werkelijk open, met een gemeten kern.
const crown=[];for(const side of [-1,1])for(let u=-5.3;u<12.6;u+=2.45){const v=side>0?10.2:-10.95;crown.push(B(u-.55,v-.55,u+.55,v+.55,94.35,99.786));}
for(const u of [-11.3,12.4])for(let v=-2;v<10;v+=2.45)crown.push(B(u-.55,v-.55,u+.55,v+.55,94.35,99.786));
crown.push(B(-5.7,-11.5,12.94,-10.4,98.7,99.786),B(-5.7,9.65,12.94,10.75,98.7,99.786),B(11.9,-10.4,13.5,10.2,98.7,99.786));
const core=B(-3.1,-4,2.8,8,94.35,98.452),plant=B(6.15,-.95,8.8,7.0,94.35,98.589);
const westPlant=prism([[-10.5,-1.95],[-9.25,-3.02],[-8.06,-1.66],[-3.78,-2.68],[-3.73,-1.2],[-5.94,-1.42],[-6.75,5.99],[-9.19,5.26]],z(94.35),z(95.619));
const westVent=prism([[-6.61,8.75],[-5.94,-1.42],[-3.73,-1.2],[-4.2,4.36],[-4,7.93],[-2.66,7.94],[-2.62,9.04]],z(94.35),z(97.127));
// De twee lagere hoekterrassen krijgen smalle, aangesloten randstijlen;
// relingen, zonnepanelen en lampjes kleiner dan .9 m worden weggelaten.
const terracePosts=[B(-11.84,-10.95,-10.84,-9.95,87.55,94.5),B(11.94,-10.95,12.94,-9.95,87.55,94.5)];
// Aangesloten balkonbakken: drie geschatte velden uit de architectfoto's,
// met een geringe 45–48° onderzijde en minimaal .9 m dikke buitenrand.
function balcony(a,b,s,w,h){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]],plan=d=>[[s,-.6],[s+w,-.6],[s+w,d],[s,d]].map(([v,q])=>[a[0]+v*t[0]+q*n[0],a[1]+v*t[1]+q*n[1]]);return union([Manifold.hull([...ring3(plan(.05),z(h-1.2)),...ring3(plan(1.4),z(h))]),prism(plan(1.4),z(h-.05),z(h+.9))]);}
const balconies=[];for(const [a,b,s,top] of [[[-11.84,10.2],[-11.84,-10.95],13.8,86],[[12.94,-10.95],[12.94,10.2],10.8,92],[[12.94,10.2],[-11.84,10.2],4.7,92]])for(let h=25.1;h+.9<top;h+=3.15)balconies.push(balcony(a,b,s,3.35,h));
// Glazen restaurant-/entreeplint. Geen nieuwe plaat over het verhoogde park
// of de ondergrondse garage; Lighting blijft het eigen PDOK-pand.
let model=union([main,rear,...fins,...crown,core,plant,westPlant,westVent,...terracePosts,...balconies]);const lowCuts=[],p=ccw(MAIN);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.8;s+2.3<L-.6;s+=3.3)lowCuts.push(niche(a,b,s,s+2.3,17.35,22.7,.65));}model=model.subtract(union(lowCuts)).setTolerance(.005);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Onyx niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:onyx-verticale-gevelribben-balkonbakken-terrassen-en-open-kroon',model]],catalog:{name:'Onyx',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:60.55688738,groundSamplePoints:[[160945,383546],[160973,383534],[160967,383500],[160928,383517]].map(local),replacesBuildings:['NL.IMBAG.Pand.0772100001022321','NL.IMBAG.Pand.0772100001047018'],description:'Volledige Onyx, 2019: verticale gemetselde gevelvelden met blinde ramen en kleine facetribben, aangesloten balkonbakken, restaurant-/entreeplint, achterste bouwdeel, twee lagere hoekterrassen, open kroon en gemeten dakapparatuur. Het garagepand1047018 levert een tweede torenscan en een dubbel Lighting-deel; Lighting blijft via pand1003342 behouden. Geen garage-/parkplaat en geen gestapelde DSM-lagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,mainRoofNapM:94.482,rearRoofNapM:95.503,terraceNapM:[87.689,87.690],crownNapM:99.786,roofCoreNapM:98.452,plantNapM:98.589,estimates:['regelmatige torencontouren, terugliggende hoekterrassen en dakcontouren circa .5–1m vereenvoudigd op BAG/AHN/3D BAG','vensters1.5×2.7m, laagritme3.15m, facetribben, kroonstijlen en glasslots uit architectfoto’s geschat','drie balkonvelden metbakken1.4m diep en.9m bovenrand zijn uit foto’s geschat; schuine onderschaal is printvereenvoudiging','restaurantpuien en entreeveld, fijne roedes/reclame/relings en zonnepanelen smaller dan .9m weggelaten of samengevoegd','garage1047018 bevat dubbelscans van Onyx en Lighting; Lighting1003342 behouden, oude scans verschillen plaatselijk .3–.8m langs kleine zuidelijke randstroken']},sources:['https://www.diederendirrix.nl/nl/projecten/woontoren-onyx-eindhoven/ (architect,2019,schuine foto’s Mitchell van Eijk alleen referentie)','https://www.schoeck.com/nl/detail/onyx-toren (balkonbouwer,84m,balkonbakken)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001022321 (TU Delft/3DGI,CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','PDOK 3D Tiles: dubbele garage-/torenscan1047018 en afzonderlijk Lighting-pand1003342']}});
