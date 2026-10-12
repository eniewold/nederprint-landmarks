// De Regent, Van Aken, 1999: benoemde vlakken en bouwdelen, geen DSM-lagen.
// Per-rij voorbeeld volledig gelezen: generate-vestedatoren.mjs.
// BAG 0772100000286298; AHN/PDOK CC0; 3DBAG TU Delft/3DGI CC BY 4.0.
// Gevels en loggia's: Commons Rosemoon, Migdejong, Michielverbeek.
import {Manifold,CrossSection,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='de-regent',ORIGIN=[161058,383266],ANGLE=-17.78,rad=ANGLE*Math.PI/180,AXIS=[Math.cos(rad),Math.sin(rad)];
const GROUND=16.8,BASE=-1,z=h=>h-GROUND;
const B=(u0,v0,u1,v1,h0,h1)=>box(u0,v0,z(h0),u1,v1,z(h1));
const FOOT=[[-9.56,11.69],[-9.59,5.39],[-13.55,5.41],[-13.53,1.11],[-19.51,1.11],[-24.23,-9.4],[-19.35,-11.35],[-14.82,-12.54],[-10.25,-13.29],[-5.59,-13.55],[-.94,-13.34],[3.67,-12.67],[8.22,-11.39],[12.59,-9.4],[16.51,-6.89],[20.01,-3.85],[23.73,1.08],[14.41,1.08],[14.42,5.39],[10.46,5.4],[10.46,11.69]];
// Gebogen winkelplint: volledige BAG-voet, eigen glasritme; geen terreinplaat.
let plinth=prism(FOOT,BASE,z(24.52));
function niche(a,b,s0,s1,h0,h1,d=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-d],[s1,-d],[s1,.2],[s0,.2]].map(([s,w])=>[a[0]+t[0]*s+n[0]*w,a[1]+t[1]*s+n[1]*w,h])));}
const shopCuts=[],pf=ccw(FOOT);for(let i=0;i<pf.length;i++){const a=pf[i],b=pf[(i+1)%pf.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=.7;s+1.6<L-.5;s+=2.5)for(const [h0,h1] of [[17.6,20.4],[21.3,23.62]])shopCuts.push(niche(a,b,s,s+1.6,h0,h1));}plinth=plinth.subtract(union(shopCuts));
// Middenstrook en twee lagere witte vleugels. De plint is open op kolommen:
// draagkolommen van 1,2 m en korte permanente 45°-verbredingen onder de vloer.
let core=B(-13.55,-2.95,14.41,5.4,GROUND+BASE,110.444);
const whiteSouth=rect(-9.56,-10.4,10.46,-2.9),whiteNorth=rect(-9.56,5.35,10.46,11.69);
let whites=union([prism(whiteSouth,z(29.6),z(107.445)),prism(whiteNorth,z(29.6),z(107.466))]);
const columns=[];for(const v of [-9.5,10.79])for(const u of [-8.9,-4.1,.7,5.5,9.7]){const top=rect(u-.6,v-.6,u+.6,v+.6);columns.push(prism(top,z(24.4),z(29.65)));columns.push(Manifold.hull([...ring3(top,z(27.6)),...ring3(rect(u-2.6,v-2.6,u+2.6,v+2.6),z(29.65))]).intersect(prism(v<0?whiteSouth:whiteNorth,z(27.5),z(29.7))));}
// Nissen in beide witte gevels; hogere loggia-velden hebben eigen platen.
const whiteCuts=[];for(const poly of [whiteSouth,whiteNorth]){const p=ccw(poly);for(let i=0;i<p.length;i++){if((poly===whiteSouth&&i===2)||(poly===whiteNorth&&i===0))continue;const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let h=31.1;h+1.6<101.3;h+=2.9)for(let s=.9;s+2.4<L-.8;s+=4.15)whiteCuts.push(niche(a,b,s,s+2.4,h,h+1.45));}}
// Six echte loggia's op de hoge witte eindgevels, teruggelegen 1,3 m.
for(const v of [-10.4,11.69])for(let k=0;k<6;k++){const h=83.3+2.9*k;whiteCuts.push(B(-2.8,v<0?v-.3:v-1.3,3.5,v<0?v+1.3:v+.3,h+.9,h+2.9));}
// Bovenste twee lagen zijn grotere glazen terrassen, op alle witte faces.
for(const poly of [whiteSouth,whiteNorth]){const p=ccw(poly);for(let i=0;i<p.length;i++){if((poly===whiteSouth&&i===2)||(poly===whiteNorth&&i===0))continue;const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L>3)for(const h of [101.2,104.2])whiteCuts.push(niche(a,b,.9,L-.9,h+.9,h+2.2,.8));}}
whites=whites.subtract(union(whiteCuts));
const coreCuts=[];const cp=ccw(rect(-13.55,-2.95,14.41,5.4));for(let i=0;i<cp.length;i++){const a=cp[i],b=cp[(i+1)%cp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L>10)continue;for(let h=26.8;h+1.45<100.7;h+=2.9)for(let s=.7;s+1.9<L-.5;s+=2.8)coreCuts.push(niche(a,b,s,s+1.9,h,h+1.35));for(const h of [101.2,104.1,107.0])coreCuts.push(niche(a,b,.7,L-.7,h+.9,h+2.4,.8));}core=core.subtract(union(coreCuts));
const rim=prism(rect(-13.55,-2.95,14.41,5.4),z(110.4),z(112.965)).subtract(prism(rect(-12.55,-1.95,13.41,4.4),z(110.444),z(114)));
// Onderhoudsinstallaties op werkelijk gemeten dak; lange dunne giek niet printbaar.
const plants=union([B(-6.5,-2.9,3.0,3.5,110.35,111.82),B(2.3,1.5,4.3,3.4,110.35,111.789),B(-1.6,.2,3.0,1.7,111.7,116.08)]);
const lowSouth= B(-5.7,-12.5,4.6,-9.2,24.45,33.475);
// Echte brede winkel-luifel, met een printbare rand die in de plint steekt.
const front=ccw(FOOT).filter(p=>p[1]<-5);const canopyParts=[];for(let i=0;i<pf.length;i++){const a=pf[i],b=pf[(i+1)%pf.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(a[1]>1||b[1]>1||L<2)continue;const d=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[d[1],-d[0]],pt=(s,t)=>[a[0]+s*d[0]+t*n[0],a[1]+s*d[1]+t*n[1]],back=[pt(0,-.2),pt(L,-.2),pt(L,.1),pt(0,.1)],outer=[pt(0,-.2),pt(L,-.2),pt(L,1.1),pt(0,1.1)];canopyParts.push(Manifold.hull([...ring3(back,z(22.4)),...ring3(outer,z(23.4))]));canopyParts.push(prism(outer,z(23.4),z(24.3)));}
// Smalle glasopstanden boven de winkelplint, blind gegraveerd en >=0,9 m dik.
const model=union([plinth,core,whites,...columns,rim,plants,lowSouth,...canopyParts]).trimByPlane([0,0,1],BASE);
console.log('parts',model.status(),model.decompose().map(m=>({volume:m.volume(),bounds:m.boundingBox()}))); if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('De Regent niet gesloten/verbonden');
const rdLocal=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:de-regent-met-middenstrook-loggias-kolommen-en-gebogen-winkelplint',model]],catalog:{name:'De Regent',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:60.75296294,groundSamplePoints:[[161030,383260],[161050,383285],[161079,383277],[161068,383248]].map(rdLocal),replacesBuildings:['NL.IMBAG.Pand.0772100000286298'],description:'De Regent op het Clausplein: hoge middenstrook, twee lagere witte vleugels, vensternissen, zes hoge loggia’s per eindgevel, bovenste glaslagen, kroonrand, open kolomplint, dakinstallaties en volledige gebogen winkelvoet. Benoemde prisma’s en vlakken, geen DSM-lagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,coreRoofNapM:110.444,coreRimNapM:112.965,whiteRoofNapM:[107.445,107.466],plantNapM:[111.789,111.82,116.08],shopNapM:24.52,storeyM:2.9,loggiasPerEnd:6,nicheDepthM:.35,estimates:['gevelritme en venstermaat uit schuine foto’s, laaghoogte 2,9 m','zes loggia’s per witte eindgevel, 1,3 m diep en platen 0,9 m dik','plintkolommen 1,2 m breed, korte 45°-verbredingen onder witte vleugels','gebogen winkelgevel uit BAG, glasstroken en luifel vereenvoudigd','onderhoudsinstallatie op gemeten +116,08, dunne giek/antennes/letters weggelaten wegens doorsnede onder 0,9 m']},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000286298 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:De_Regent_vanaf_de_Willemstraat_Eindhoven.JPG (Rosemoon, CC BY-SA 3.0)','https://commons.wikimedia.org/wiki/File:Deregenteindhoven.jpg (Migdejong, CC BY-SA 3.0)','https://commons.wikimedia.org/wiki/File:Eindhoven,_woontoren_De_Regent_vanaf_de_Keizersgracht_IMG_8522_2019-01-20_09.19.jpg (Michielverbeek, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Eindhoven,_woontoren_De_Regent_vanaf_de_Willemstraat_IMG_8605_2019-01-20_11.31.jpg (Michielverbeek, CC BY-SA 4.0)']}});
