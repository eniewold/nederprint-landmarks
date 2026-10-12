// De Admirant, Dam & Partners 2006, en De Bruine Heer in één BAG-pand.
// BAG 0772100000288644, AHN DSM/DTM 0,5 m en ortho: PDOK, CC0.
// Dakvlakken 3D BAG TU Delft/3DGI, CC BY 4.0; schuin torendak als één
// planvergelijking. Gevels: Dam & Partners, foto's Luuk Kramer/Mathieu van Ek;
// Commons S. Perquin (2024/2025, CC BY-SA 4.0), Lempkesfabriek (CC BY-SA 3.0).
// Voorbeeld per rij: generate-vestedatoren.mjs. Geen DSM-hoogtelagen.
import {Manifold,CrossSection,prism,rect,box,union,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='de-admirant',ORIGIN=[161135,383385],GROUND=16.55,BASE=-1,ANGLE=-40.4,rad=ANGLE*Math.PI/180;
const AXIS=[Math.cos(rad),Math.sin(rad)],z=h=>h-GROUND;
// Vaste surveycoördinaten: RD minus (161150,383430). Bouw in het eigen
// torenstelsel; elke gevel behoudt de werkelijke richting van zijn bouwdeel.
const local=([x,y])=>[(x+15)*AXIS[0]+(y+45)*AXIS[1],-(x+15)*AXIS[1]+(y+45)*AXIS[0]];
const rdLocal=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
const P=(poly,h)=>prism(poly.map(local),BASE,z(h));
const Q=(poly,b,h)=>prism(poly.map(local),z(b),z(h));
const R=(a,b,c,d,h)=>P(rect(a,b,c,d),h);
function roofPlane(poly,a,b,c,bottom=BASE){
 // a,b en c horen bij RD minus de torenoorsprong; transformeer de normaal.
 const al=a*AXIS[0]+b*AXIS[1],bl=-a*AXIS[1]+b*AXIS[0],cl=c-GROUND,n=Math.hypot(al,bl,1);
 return prism(poly.map(local),bottom,140).trimByPlane([al/n,bl/n,-1/n],-cl/n);
}
function niche(a,b,s0,s1,h0,h1,depth=.35){
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),d=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[d[1],-d[0]];
 return Manifold.hull([z(h0),z(h1)].flatMap(zz=>[[s0,-depth],[s1,-depth],[s1,.3],[s0,.3]].map(([s,t])=>[a[0]+d[0]*s+n[0]*t,a[1]+d[1]*s+n[1]*t,zz])));
}
function detail(solid,poly,{first=20.2,pitch=3.8,top=42.7,width=2.25,step=3.3,tower=false}={}){
 const p=poly.map(local);if(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0)<0)p.reverse();const cuts=[];
 for(let i=0;i<p.length;i++){
  const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<2)continue;
  for(let k=0,h=first;h+1.7<top-.5;k++,h=first+pitch*k){
   for(let s=1.0,j=0;s+width<L-.8;s+=step,j++){
    const w=tower&&((k+2*j+i)%5===0)?Math.min(2.7,width+1.1):width;
    // Enkele dubbele vensters en hogere puien tussen de reguliere travees.
    const high=tower&&((k+3*j+i)%13===0)?2.55:1.65;
    cuts.push(niche(a,b,s,Math.min(s+w,L-.8),h,h+high));
   }
  }
 }
 return solid.subtract(union(cuts));
}
// Doorlopende geknikte toren: de BAG-omtrek vereenvoudigd zonder gevelruis.
const TOWER=[[-28.257,-45.750],[-7.577,-63.195],[6.505,-48.803],[-10.198,-36.991],[-22.252,-27.061]];
const ROOF={a:.262424129,b:.0659441442,c:115.714908};
let tower=roofPlane(TOWER,ROOF.a,ROOF.b,ROOF.c);
tower=detail(tower,TOWER,{first:40.8,pitch:3.02,top:120.6,width:1.25,step:3.05,tower:true});
// Kantoorplint: vier hogere lagen, eigen vensterritme onder de woonlagen.
tower=detail(tower,TOWER,{first:20.1,pitch:4.65,top:39.2,width:1.6,step:4.2});
// Glazen hoekbanden, als nissen en blind glasreliëf (geen onprintbare kozijnen).
const towerP=TOWER.map(local),cornerCuts=[];
for(const i of [0,2]){
 const a=towerP[i],b=towerP[(i+1)%towerP.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let h=18.8;h<119;h+=3.02)cornerCuts.push(niche(a,b,L-3.6,L-.65,h,h+2.5,.4));
}
tower=tower.subtract(union(cornerCuts));
// Blinde glasvelden op het hellende dak: ieder veld volgt hetzelfde vlak.
const roofCuts=[];
const tcs=new CrossSection([towerP],'NonZero'),roofInside=tcs.offset(-.9,'Miter');
for(let u=-17;u<19;u+=3.5)for(let v=-7;v<18;v+=3.5){
 const s=new CrossSection([rect(u,v,u+2.5,v+2.5)],'NonZero').intersect(roofInside);
 if(s.isEmpty())continue;
 const cell=s.toPolygons()[0],rdPoly=cell.map(([u,v])=>[u*AXIS[0]-v*AXIS[1]-15,u*AXIS[1]+v*AXIS[0]-45]);
 const outer=roofPlane(rdPoly,ROOF.a,ROOF.b,ROOF.c+.2),inner=roofPlane(rdPoly,ROOF.a,ROOF.b,ROOF.c-.3);roofCuts.push(outer.subtract(inner));
}
tower=tower.subtract(union(roofCuts));
// De Bruine Heer: lange hoofdvleugel met plat dak, hogere kern en noordkop.
const BROWN=[[-20.294,-21.255],[-14.083,-23.406],[-6.692,-24.829],[-7.252,-26.390],[3.614,-30.360],[21.415,27.709],[19.000,28.816],[17.310,23.351],[9.662,25.299],[6.239,14.031],[-1.613,16.240],[2.326,28.997],[3.762,33.651],[-2.032,35.267]];
const CORE=[[20.482,42.844],[17.901,42.313],[15.985,41.921],[12.835,31.788],[11.446,30.161],[11.331,26.948],[2.326,28.997],[-1.613,16.240],[6.239,14.031],[9.662,25.299],[17.310,23.351],[22.653,40.623]];
const NORTH=[[18.232,42.382],[16.870,47.981],[15.591,47.723],[13.299,59.111],[10.486,58.530],[8.899,59.552],[6.291,59.512],[4.375,58.552],[3.283,57.046],[.218,56.416],[3.624,40.649],[2.440,38.368],[12.580,35.197],[15.985,41.921]];
const brown=detail(P(BROWN,42.733),BROWN),core=detail(P(CORE,46.710),CORE,{top:46.710,width:.95,step:2.9}),north=detail(P(NORTH,40.445),NORTH,{top:40.445,width:2.6,step:3.75});
const northJoint=P([[.940,34.431],[11.546,31.502],[12.835,31.788],[13.778,34.822],[2.386,38.377],[1.612,37.486]],42.215);
const northRaisedStrip=P([[3.762,33.651],[3.293,28.778],[10.238,27.197],[11.546,31.502]],44.239);
// Glazen winkelplint langs de oostzijde, met een werkelijk licht hellend dak.
const SHOP=[[1.228,-38.682],[9.199,-47.868],[28.129,24.269],[23.956,28.526],[19.886,22.153]];
const shop=detail(roofPlane(SHOP,-.09776231,.02738508,24.86758631),SHOP,{first:17.5,pitch:10,top:23.4,width:2.7,step:3.6});
const northShop=detail(P([[18.232,42.382],[22.653,40.623],[19.000,28.816],[21.415,27.709],[26.587,43.754],[23.424,47.234],[22.716,48.742],[19.524,48.514],[16.870,47.981]],22.109),[[18.232,42.382],[22.653,40.623],[19.000,28.816],[21.415,27.709],[26.587,43.754],[23.424,47.234],[22.716,48.742],[19.524,48.514],[16.870,47.981]],{first:17.5,pitch:8,top:22.1,width:2.1,step:3.2});
// De LoD2.2 geeft hier een steil vlak +45..57 dat niet past bij AHN en de
// foto: glasverbinding op +23,454, met de meetbare opbouwen ernaast.
const LINK=[[-12.601,-34.313],[-8.247,-29.167],[-7.660,-27.530],[-12.809,-25.955],[-13.058,-26.721],[-18.851,-24.824],[-19.670,-27.355],[-21.782,-26.916]];
const link=detail(P(LINK,23.454),LINK,{first:17.6,pitch:8,top:23.45,width:1.8,step:3.0});
const connector=P([[-12.601,-34.313],[-10.433,-36.061],[-6.229,-29.858],[-8.378,-29.323]],40.15);
const connectorCap=P([[-12.192,-24.062],[-12.809,-25.955],[-7.66,-27.53],[-6.692,-24.829],[-11.546,-23.135]],45.428);
// Twee langgerekte zadeldaklichten op de Bruine Heer: vier echte dakvlakken.
function skylight(eave,ridge){return Manifold.hull([...eave.map(p=>[...local(p),z(42.72)]),...ridge.map(p=>[...local(p),z(44.045)])]);}
const skyWest=skylight([[-8.313,-7.334],[-1.858,12.909],[1.230,12.160],[-5.471,-8.760]],[[-6.818,-8.084],[-.149,12.780]]);
const skyEast=skylight([[-2.157,-9.732],[4.683,11.525],[7.676,10.155],[1.148,-10.067]],[[-.418,-9.909],[6.258,10.805]]);
const plants=union([
 Q([[6.688,-2.893],[2.901,-18.542],[4.252,-18.856],[9.341,-2.406]],42.6,44.291),
 Q([[11.531,13.459],[10.616,9.256],[12.872,9.008],[16.525,20.813],[15.165,21.163],[12.370,13.553]],42.6,44.332),
 Q([[10.702,13.693],[12.370,13.553],[14.360,21.368],[12.665,21.803]],42.6,47.461),
 Q([[-7.339,-10.105],[-9.767,-9.412],[-11.313,-14.758],[-9.009,-15.708]],42.6,45.32),
 Q([[-4.506,-11.335],[-6.261,-10.986],[-7.569,-18.655],[-6.682,-19.141],[-4.511,-13.393]],42.6,45.545),
 Q([[3.762,33.651],[3.293,28.778],[10.238,27.197],[11.546,31.502]],42.6,44.239)
]);
// Nieuwe torenentree aan de westgevel: blinde portaalnis en ondersteunde luifel.
const ta=towerP[4],tb=towerP[0],tl=Math.hypot(tb[0]-ta[0],tb[1]-ta[1]),td=[(tb[0]-ta[0])/tl,(tb[1]-ta[1])/tl],tn=[td[1],-td[0]],tp=(s,t)=>[ta[0]+td[0]*s+tn[0]*t,ta[1]+td[1]*s+tn[1]*t];
tower=tower.subtract(niche(ta,tb,tl*.4,tl*.4+3.0,17.0,20.1,.4));
const canopyPoly=[tp(tl*.4-.3,-.1),tp(tl*.4+3.3,-.1),tp(tl*.4+3.3,1.2),tp(tl*.4-.3,1.2)];
const canopy=union([Manifold.hull([...ring3([tp(tl*.4-.3,-.1),tp(tl*.4+3.3,-.1),tp(tl*.4+3.3,.1),tp(tl*.4-.3,.1)],z(19.2)),...ring3(canopyPoly,z(20.4))]),prism(canopyPoly,z(20.4),z(21.3))]);
// Historische entree aan de Emmasingel: de luifel met het beeld boven de
// bakstenen penant (Dam-foto). Positie, hoogtes en figuurvorm zijn geschat;
// het beeld is verbreed tot 1 m zodat het herkenbaar en stevig blijft.
const ba=local([-20.294,-21.255]),bb=local([-2.032,35.267]),bL=Math.hypot(bb[0]-ba[0],bb[1]-ba[1]),bd=[(bb[0]-ba[0])/bL,(bb[1]-ba[1])/bL],bn=[-bd[1],bd[0]],bp=(s,t)=>[ba[0]+s*bd[0]+t*bn[0],ba[1]+s*bd[1]+t*bn[1]];
const oldCanopyPlan=[bp(52.7,-.1),bp(58.5,-.1),bp(58.5,1.5),bp(52.7,1.5)];
const oldCanopy=union([Manifold.hull([...ring3([bp(52.7,-.1),bp(58.5,-.1),bp(58.5,.1),bp(52.7,.1)],z(17.8)),...ring3(oldCanopyPlan,z(19.3))]),prism(oldCanopyPlan,z(19.3),z(20.2))]);
const statueAt=bp(53.3,1.0);
const pedestal=box(statueAt[0]-.55,statueAt[1]-.55,z(20.1),statueAt[0]+.55,statueAt[1]+.55,z(21.5));
const statue=union([pedestal,Manifold.cylinder(1.4,.5,.5,24).translate([...statueAt,z(21.4)]),Manifold.sphere(.45,24).translate([...statueAt,z(23.15)])]);
// Onderhoudswagen op het dak, gemeten vlak op +118,225. De dunne giek
// blijft weg: de doorsnede is te klein voor een vrij onderdeel op 1:1000.
const roofCar=Q([[-5.882,-43.920],[-11.771,-39.833],[-13.801,-44.231],[-8.951,-47.682]],117.9,118.225);
// Gemeenschappelijke éénlaagse winkelplint op de BAG-voetafdruk. Deze
// footprint bevat gebouwen, geen hof of garage-terrein; +20,009 is het
// laagste gemeten bovengrondse dak. De afzonderlijke hogere daken blijven.
const GROUND_FOOT=[[-28.257,-45.75],[-7.577,-63.195],[6.505,-48.803],[-10.198,-36.991],[-7.443,-33.522],[-.819,-35.618],[.521,-31.43],[3.318,-32.21],[1.229,-38.683],[9.2,-47.869],[28.129,24.27],[23.956,28.526],[23.297,26.55],[21.256,27.215],[26.587,43.755],[23.425,47.233],[25.409,48.219],[22.162,49.859],[18.539,50.461],[19.524,48.515],[15.592,47.723],[13.3,59.111],[10.487,58.531],[8.899,59.551],[6.292,59.511],[4.376,58.551],[3.283,57.046],[.218,56.415],[3.625,40.648],[2.438,38.36],[.096,39.302],[-.784,38.817],[-2.109,35.231],[-20.543,-22.03],[-13.92,-24.198],[-13.532,-23.135],[-12.061,-23.661],[-13.058,-26.723],[-18.851,-24.826],[-19.67,-27.355],[-21.683,-25.291],[-23.209,-30.054],[-22.712,-30.417],[-23.817,-33.799],[-24.292,-33.431]];
const commonPlinth=P(GROUND_FOOT,20.009);
let model=union([commonPlinth,tower,brown,core,north,northJoint,northRaisedStrip,shop,northShop,link,connector,connectorCap,skyWest,skyEast,plants,canopy,oldCanopy,statue,roofCar]);
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0));
if(model.status()!=='NoError'||model.decompose().length!==1){console.log(JSON.stringify(model.decompose().map(s=>({volume:s.volume(),bbox:s.boundingBox()}))));throw Error('Admirant: '+model.status()+' delen '+model.decompose().length);}
await writeLandmark({slug,nodes:[['building:admirant-toren-met-bruine-heer-en-winkelplint',model]],base:BASE,catalog:{name:'De Admirant',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:60.5967063,groundSamplePoints:[[161121,383371],[161160,383379],[161122,383427],[161148,383490]].map(rdLocal),replacesBuildings:['NL.IMBAG.Pand.0772100000288644'],description:'De Admirant en De Bruine Heer in één BAG-pand, met geknikte woontoren, één continu hellend dakvlak, glazen hoekbanden, blinde vensters, kantoorplint, lange historische vleugel met twee zadeldaklichten, kern, noordkop, installatieblokken en glazen winkelplint. Oorsprong RD (161135,383385), X op -40,4 graden, NAP +16,55 m. Gevelritme, transparante verbindingsdaken en printluifel vereenvoudigd.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofPlaneRD:[ROOF.a,ROOF.b,ROOF.c],roofPlaneOriginRD:ORIGIN,towerRoofNapRangeM:[112.312,121.107],brownRoofNapM:42.733,coreNapM:46.710,northNapM:40.445,skylightRidgeNapM:44.045,shopRoofPlaneRD:[-.09776231,.02738508,24.86758631],nicheDepthM:.35,residentialStoreyM:3.02,estimates:['vensterritme met smalle, brede en enkele hogere vensters uit foto’s; 3,02 m woonlagen','blinde glasvelden en hoekbanden, 0,35–0,4 m diep','glazen verbinding tussen toren en Bruine Heer op +23,454: AHN kijkt door glas; steile LoD2.2-uitschieter verworpen','entreeluifel op +21,3 met 45° ondersnede en minstens 0,9 m dikte','kleine installatievormen en onderhoudswagen op dak vereenvoudigd','historische entreeluifel en beeld op de luifel uit foto geschat; lichaam en hoofd minstens 0,9 m breed']},sources:['https://damenpartners.com/projecten/rond-de-admirant/ (foto’s Luuk Kramer en Mathieu van Ek, alleen referentie)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000288644 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://commons.wikimedia.org/wiki/File:De_Admirant_(2025).jpg (S. Perquin, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Emmasingel,_Eindhoven_(2024).jpg (S. Perquin, CC BY-SA 4.0)','https://commons.wikimedia.org/wiki/File:Admirant1.jpg (Lempkesfabriek, CC BY-SA 3.0)']}});
