// Hofpoort: measured straight office slab with blank upper crown, roof well,
// large garage/plinth, raised east parking wing and lower northeast roof.
// Example generate-weenatoren.mjs: continuous shaft, separate named roof cores.
// Plans/heights: 3D BAG TU Delft/3DGI CC BY4.0, checked with PDOK AHN/ortho.
// Facade and De parel only observed from reference photos; no height-map layers.
import {Manifold,prism,rect,box,ccw,union,writeLandmark} from './efteling-kit.mjs';
const slug='hofpoort',ORIGIN=[92502,437802],ANGLE=17,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=-.05,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.42,bevel=.07){
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];
 return Manifold.hull([[s0-bevel,.3,h0-bevel],[s1+bevel,.3,h0-bevel],[s1+bevel,.3,h1+bevel],[s0-bevel,.3,h1+bevel],[s0,-depth,h0],[s1,-depth,h0],[s1,-depth,h1],[s0,-depth,h1]].map(([s,k,h])=>[a[0]+s*t[0]+k*n[0],a[1]+s*t[1]+k*n[1],z(h)]));
}
function facade(body,poly,first,top,{pitch=3.25,width=1.05,step=2.1,height=1.65,depth=.42,bevel=.07}={}){
 const cuts=[],p=ccw(poly);for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let h=first;h+height<top-.5;h+=pitch)for(let s=.7;s+1<L-.6;s+=step)cuts.push(niche(a,b,s,Math.min(s+width,L-.6),h,h+height,depth,bevel));}
 return cuts.length?body.subtract(union(cuts)):body;
}
const shaftPlan=[[-15.323,-20.686],[9.661,-20.704],[10.067,13.199],[-14.956,13.049]];
let tower=facade(prism(shaftPlan,BASE,z(93.441)),shaftPlan,13.1,87.3);
// Measured recessed roof well, not a thin open facade or an invented roof slope.
const wellPlan=[[2.25,-8.74],[3.511,-8.711],[4.826,-9.501],[5.136,-8.674],[7.643,-8.616],[6.699,-6.907],[5.594,-7.458],[3.974,-7.622],[3.683,-4.662],[2.502,-4.215],[2.25,-3.623],[3.578,-3.596],[3.766,-2.009],[3.349,-.948],[4.517,-.7],[5.374,.794],[2.252,.749]];
tower=tower.subtract(prism(wellPlan,z(89.052),z(93.6)));
const liftPlan=[[-7.631,.693],[-7.398,-11.674],[2.247,-11.673],[2.251,1.437],[.125,2.115],[.13,3.455],[-2.218,3.353]];
const lift=prism(liftPlan,z(93.25),z(94.606));
const liftWest=Manifold.hull([[-7.631,.693,z(94.45)],[-5.397,1.79,z(94.45)],[-2.218,3.353,z(94.45)],[-7.676,3.116,z(94.45)],[-7.631,.693,z(96.126)],[-7.676,3.116,z(96.126)],[-5.397,1.79,z(95.35)],[-2.218,3.353,z(94.606)]]);
const liftEast=prism([[1.986,1.478],[2.598,2.965],[.13,3.455],[.125,2.115]],z(94.45),z(95.694));
// The renovation's transparent double-height lobby remains a blind, filled
// inset, retaining a strong core and printable lower corners.
const lobbyCuts=[];const sp=ccw(shaftPlan);for(let i=0;i<sp.length;i++){const a=sp[i],b=sp[(i+1)%sp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=1;s+2<L-1;s+=4.5)lobbyCuts.push(niche(a,b,s,Math.min(s+3.3,L-1),.8,7.5,.6,0));}
tower=tower.subtract(union(lobbyCuts));
// De parel (Marc Ruygrok, 2001): each original 5x5m logo position becomes
// a blind square frame and shallow integral sphere relief, not a loose ball.
const westFace=sp.findIndex((a,i)=>a[0]<-14&&sp[(i+1)%sp.length][0]<-14),eastFace=sp.findIndex((a,i)=>a[0]>9&&sp[(i+1)%sp.length][0]>9);
const pearls=[];for(const [i,s]of[[westFace,24.0],[eastFace,24.0]]){
 const a=sp[i],b=sp[(i+1)%sp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]],center=[a[0]+s*t[0],a[1]+s*t[1]];
 tower=tower.subtract(niche(a,b,s-2.5,s+2.5,87.6,92.6,.3,0));
 const sphere=Manifold.sphere(1,40).scale([.8,1.85,1.85]).rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI]).translate([center[0]+n[0]*.1,center[1]+n[1]*.1,z(90.1)]);pearls.push(sphere);
}
// Complete garage within its own BAG footprint; adjoining 1979/1995 buildings
// are separate panden and their contours have zero overlap with this model.
const garagePlan=[[-18.953,-22.659],[-17.89,-23.287],[27.772,-23.296],[27.757,-21.258],[25.841,-15.618],[25.63,-5.205],[23.643,-5.621],[22.1,-3.168],[22.975,-1.184],[25.243,-1.648],[25.438,4.314],[23.556,4.342],[21.226,5.681],[23.774,8.136],[26.156,8.197],[26.153,18.621],[23.785,18.857],[23.424,23.261],[9.725,23.838],[9.691,30.235],[9.028,31.005],[-18.64,30.762],[-19.07,30.007]];
const eastPlan=[[25.841,-15.618],[29.421,-15.59],[28.725,-21.262],[42.558,-21.314],[43.296,-20.247],[43.311,-14.508],[46.45,-14.469],[47.17,-13.542],[46.703,-11.314],[43.235,-11.2],[43.107,9.062],[29.231,8.903],[29.239,4.922],[27.964,4.277],[25.438,4.314]];
const northeastPlan=[[26.156,8.8],[42.443,8.8],[43.019,23.154],[42.379,24],[29.293,23.457],[29.004,18.335],[26.153,18.621]];
const garage=(p,h)=>facade(prism(p,BASE,z(h)),p,2.2,h,{pitch:3.4,width:8,step:9.2,height:1.05,depth:.7,bevel:.12});
const mainGarage=garage(garagePlan,12.765),eastGarage=garage(eastPlan,14.396),northeast=garage(northeastPlan,11.142);
const penthousePlan=[[-2.244,20.5],[9.676,19.049],[9.661,23.245],[-1.634,23.233]];
const penthouse=facade(prism(penthousePlan,z(12.55),z(17.563)),penthousePlan,13.6,17.563,{pitch:4,width:1.1,step:2.2,height:2.8});
const westStair=B(8.7,19.0,10.25,25.0,GROUND-1,17.563),eastStair=B(23.25,4.3,26.1,8.25,GROUND-1,15.504);
const eastService=prism(rect(43.1,-14.4,46.7,-11.2),z(14.2),z(16.812));
const all=union([tower,lift,liftWest,liftEast,...pearls,mainGarage,eastGarage,northeast,penthouse,westStair,eastStair,eastService]);
const body=Manifold.compose(all.decompose().filter(p=>p.volume()>1e-6));
const local=([u,v])=>[(u-ORIGIN[0])*AXIS[0]+(v-ORIGIN[1])*AXIS[1],-(u-ORIGIN[0])*AXIS[1]+(v-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:hofpoort-toren-parkeergarage-en-parelreliefs',body]],catalog:{name:'Hofpoort (Shell-gebouw)',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:43.290304,groundSamplePoints:[[92529,437824],[92511,437838]].map(local),replacesBuildings:['NL.IMBAG.Pand.0599100000702496'],description:'Rechte betonnen Hofpoorttoren met blind/beveled vensterraster en massieve kop, gemeten dakput en liftopbouw, beide De-parelreliefs, transparante gerenoveerde plint als blinde nissen en de volledige garage met hogere oostvleugel en lage noordoosthoek; aangrenzend Shell-I blijft apart.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,mainRoofNapM:93.441,liftNapM:94.606,liftCornersNapM:[96.126,95.694],roofWellNapM:89.052,garageRoofsNapM:[12.765,14.396,11.142],penthouseNapM:17.563,eastServiceNapM:16.812,estimates:['Vensterpitch3.25m, kolomraster2.1m en gebogen/afgeschuinde raamneggen .42m diep uit fotos geschat; venstermateriaalstroken circa .9m','Garageopeningen blinde doorlopende bandnissen .7m diep; interieur massief, hoek-/trappenkoppen uit fotos vereenvoudigd','De parel heeft bronmaat5x5m; positie en bolrelief circa1.85m straal geschat, ondiep met de gevel verbonden voor1:1000','Gerenoveerde dubbelhoge entree met blinde glasnissen .6m diep; exacte puilijnen en trappositie uit fotos geschat','Grillige .2-.8m dakranden naar doorgaande plint-/gevelvlakken vereenvoudigd, dakhoogtes en putdiepte gemeten']},sources:['https://www.rotterdamarchitectuurprijs.nl/archief/spaces-hofplein.html (renovatie2016, ZZDP/SevilPeach)','https://www.shell.nl/over-ons/nieuws/shell-venster-2024/verleden-heden-toekomst.html (historische opdrachtgever,26lagen/95m)','https://www.bkor.nl/beeld/de-parel/ (collectiebeheerder,Marc Ruygrok,5x5m)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702496 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:Rotterdam_-_Hofpoort.jpg (Fred Romero CC BY2.0)','https://commons.wikimedia.org/wiki/File:Rotterdam_-_Hofpoort_(1).jpg (Fred Romero CC BY2.0)']}});
