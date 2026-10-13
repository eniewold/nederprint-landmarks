// De Hoge Heren, Wiel Arets, 2001. Voorbeeld per rij: generate-evoluon.mjs
// volledig gelezen. Benoemde prisma's en werkelijke platte dakvlakken.
// BAG/PDOK/AHN CC0; 3D BAG TU Delft/3DGI CC BY 4.0; WAA-foto's referentie.
import {Manifold,prism,rect,box,union,ccw,ring3,writeLandmark} from './efteling-kit.mjs';
const slug='hoge-heren',ORIGIN=[92642,436268],ANGLE=25.8,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=3.2,BASE=-1.2,z=h=>h-GROUND;
const FOOT=[[-36.39,-1.71],[-37.89,-1.71],[-37.86,-21.86],[-28.78,-21.86],[-28.76,-20.36],[22.65,-20.26],[36.3,-20.23],[36.3,-21.75],[41.62,-21.76],[48.64,-2.34],[47.25,-1.81],[48.42,1.4],[14.25,13.76],[-36.42,13.7]];
const PODIUM=[[-36.4,-20.36],[36.3,-20.23],[41.1,-18.8],[47.9,1.2],[14.25,13.76],[-36.42,13.7]];
// Westtoren: twee verschoven woonvleugels met een open nis aan de lifthal.
const WEST=[[-36.22,-20.1],[-6.32,-20.1],[-6.32,-4.82],[-14.7,-4.82],[-14.7,-2.1],[-10.5,-2.1],[-10.5,9.06],[-36.22,10.66]];
// Oosttoren volgt het stratenpatroon: schuine oost- en noordgevel, plus
// inspringingen bij de noordwestelijke glazen lifthal.
const EAST=[[14.41,-16.81],[36.71,-17.01],[40.39,-13.9],[42.16,-14.49],[47.98,1.56],[14.93,13.51],[12.1,4.29],[12.37,-1.24],[19.43,-1.94],[21.6,-3.46],[25.87,-5.62],[30.13,.49],[28.75,1.2],[22.89,1.38],[23.15,-3.48],[17.9,-2.44],[14.47,-3.12]];
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
function niche(a,b,s0,s1,h0,h1,depth=.35){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[t[1],-t[0]];return Manifold.hull([z(h0),z(h1)].flatMap(h=>[[s0,-depth],[s1,-depth],[s1,.4],[s0,.4]].map(([s,d])=>[a[0]+s*t[0]+d*n[0],a[1]+s*t[1]+d*n[1],h])));}
function facade(solid,poly,{first,pitch,top,width,step,height,loggias=false}){
 const cuts=[],p=ccw(poly);
 for(let i=0;i<p.length;i++){
  const a=p[i],b=p[(i+1)%p.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(L<2.2)continue;
  const count=Math.max(1,Math.floor((L-1.5)/step)),gap=(L-count*step)/2;
  for(let k=0;k<count;k++){
   const s=gap+step*(k+.5),w=Math.min(width,step-.9);
   for(let h=first;h+height<top-.45;h+=pitch){
    const depth=loggias&&k===count-2&&L>20?1.1:.35;
    cuts.push(niche(a,b,s-w/2,s+w/2,h,h+height,depth));
   }
  }
 }
 return solid.subtract(union(cuts));
}
// Lage terugliggende glasstroken (NAP +6,7) vormen geen brede nieuwe
// terrasplaat: ze blijven beperkt tot de BAG-stroken langs de voet.
let foot=facade(prism(FOOT,BASE,z(6.735)),FOOT,{first:3.35,pitch:4,top:6.735,width:2.8,step:3.7,height:2.8});
let podium=facade(prism(PODIUM,BASE,z(18.535)),PODIUM,{first:6.8,pitch:2.8,top:18.535,width:2.8,step:3.6,height:1.7});
// Glazen begane grond als blinde puien; horizontale liggers blijven massief.
const groundCuts=[],pp=ccw(PODIUM);for(let i=0;i<pp.length;i++){const a=pp[i],b=pp[(i+1)%pp.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=1;s+2.8<L-.7;s+=3.8)groundCuts.push(niche(a,b,s,s+2.8,3.35,6.2,.45));}podium=podium.subtract(union(groundCuts));
const west=facade(prism(WEST,BASE,z(100.618)),WEST,{first:22.3,pitch:2.83,top:100.618,width:2.65,step:3.65,height:1.35,loggias:true});
const east=facade(prism(EAST,BASE,z(100.631)),EAST,{first:22.3,pitch:2.83,top:100.631,width:2.65,step:3.65,height:1.35,loggias:true});
// Glazen lifthal op het podium tussen de schijven: werkelijk verhoogde
// aansluitstrook, 3D BAG +20,825; geen hoge brug tussen de woontorens.
const HALL=rect(-6.5,-3,14.5,-1.5);
const hall=facade(prism(HALL,z(18.4),z(20.825)),HALL,{first:18.8,pitch:3,top:20.825,width:1.2,step:2.1,height:1.5});
// Dakliften en grote techniekonderdelen uit de afzonderlijke 3D BAG-vlakken.
const westLift=B(-26.4,-2.9,-21.1,1.7,100.5,105.010);
const eastLift=B(23.7,-3.1,29.0,1.8,100.5,105.107);
const westVent=B(-26.0,-6.4,-22.0,-3.5,100.5,101.897);
const westHallRoof=B(-19.2,-4.9,-13.3,-2.6,100.5,101.730);
const westSmall=B(-20.5,-1.0,-17.2,2.0,100.5,101.539);
const eastHallRoof=B(18.7,-5.3,26.0,-2.7,100.5,101.657);
const eastSmall=B(28.2,-1.2,30.2,.9,100.5,101.599);
const podiumPlant=B(1,-17.2,7,-14.0,18.4,19.925);
// Zuidentree: breed glasveld in de plint en een geringe 45°-luifel.
const entrance=niche(pp[0],pp[1],33,39,3.35,6.7,.8);
const canopy=Manifold.hull([...ring3(rect(-2.5,-20.7,3.5,-20.2),z(6.4)),...ring3(rect(-2.5,-21.4,3.5,-20.2),z(7.2))]);
let model=union([foot,podium,west,east,hall,westLift,eastLift,westVent,westHallRoof,westSmall,eastHallRoof,eastSmall,podiumPlant,canopy]).subtract(entrance);
// Alleen volledig ingesloten negatieve nissen van overlappende bouwdelen
// vullen, zoals de Hoftoren; de buitenvorm en verbondenheidscontrole blijven.
model=Manifold.compose(model.decompose().filter(p=>p.volume()>0)).trimByPlane([0,0,1],BASE);
if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Hoge Heren niet gesloten/verbonden');
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:hoge-heren-twee-gelede-torens-lifthallen-en-glazen-podium',model]],catalog:{name:'De Hoge Heren',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:0,groundHeight:46.84164660,groundSamplePoints:[[92603,436223],[92670,436234],[92692,436270],[92630,436298]].map(local),replacesBuildings:['NL.IMBAG.Pand.0599100000627495'],description:'De Hoge Heren: rechthoekige gelede westtoren en oosttoren op het stratenpatroon, diepe loggiavelden en vensternissen, open bovenruimte tussen beide torens, gezamenlijk zeslaags podium met glazen begane grond, glasentree en kleine luifel, lifthal en gemeten dakopbouwen; doorlopende prisma’s en vlakke daken, geen DSM-lagen.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,towerRoofNapM:[100.618,100.631],roofLiftNapM:[105.010,105.107],podiumNapM:18.535,hallNapM:20.825,lowerGlassNapM:6.735,storeyM:2.83,estimates:['regelmatige torencontouren uit BAG/3D BAG, lifthalnissen en dakopbouwcontouren circa .5–1 m vereenvoudigd','brede rechthoekige vensters circa 2.65 × 1.35 m, verdiepingsritme 2.83 m, loggiaposities en 1.1 m diepte uit foto’s geschat','glazen beganegrondpuien, parkeergevelraster, entreeveld en kleine 45 graden luifel geschat','kolenstructuur van gevelpanelen, roedes, loggiarelings, groen en onderhoudsgieken kleiner dan .9 m niet vrijstaand opgenomen']},sources:['https://www.wielaretsarchitects.com/en/projects/hoge_heren/ (architect, 2001, schuine foto’s alleen referentie)','https://www.bureaubouwkunde.nl/projecten/de-hoge-heren-rotterdam/ (gehele complex, zeslaagse voet)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000627495 (TU Delft/3DGI, CC BY 4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0']}});
