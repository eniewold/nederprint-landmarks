// Voorbeeld voor deze rij: generate-evoluon.mjs, volledig gelezen.
// Volledige fabrieksvleugels, torenschachten en dakvlakken, geen hoogtelagen.
import {CrossSection,box,prism,hipRoof,union,writeLandmark} from './efteling-kit.mjs';
const slug='lichttoren',origin=[161123,383504],angle=13.5,ground=16.55,base=-.4;
const a=angle*Math.PI/180,xAxis=[Math.cos(a),Math.sin(a)],z=n=>n-ground,parts=[],cuts=[];
const outline=[[-103.972,60.958],[-104.008,43.242],[-104.037,28.9],[-102.557,28.897],[-102.573,21.198],[-105.619,21.201],[-105.616,21.642],[-110.801,21.676],[-110.789,16.498],[-110.339,16.499],[-110.333,5.355],[-110.333,3.131],[-110.274,-30.183],[-111.221,-30.155],[-111.252,-45.135],[-86.399,-45.178],[-81.242,-45.194],[-80.513,-45.203],[-80.505,-44.471],[-80.513,-42.576],[-80.507,-41.722],[-80.504,-39.702],[-80.498,-38.853],[-80.499,-37.076],[-80.494,-30.196],[-84.811,-30.184],[-87.449,-30.178],[-87.468,-26.028],[-87.481,-23.226],[-87.485,-22.427],[-87.498,-19.633],[-87.501,-18.816],[-87.515,-16.032],[-87.57,-3.884],[-87.579,-2.09],[-70.289,-2.118],[-70.288,-1.735],[-68.027,-1.74],[-67.752,-1.741],[-65.322,-1.745],[-63.708,-1.748],[-48.188,-1.776],[-38.82,-1.793],[-38.82,-2.147],[-35.203,-2.148],[-35.203,-1.783],[-34.746,-1.784],[-34.673,-1.784],[-32.04,-1.786],[-31.05,-1.786],[-28.393,-1.787],[-27.483,-1.789],[-24.353,-1.79],[-24.341,-4.902],[-19.895,-7.47],[-21.092,-9.451],[-22.796,-8.462],[-30.443,-21.638],[-10.904,-32.99],[-3.864,-20.896],[-3.243,-19.829],[1.563,-11.662],[8.866,0.754],[10.863,-0.408],[12.649,2.662],[10.626,3.839],[10.69,3.951],[10.741,11.167],[9.779,12.851],[7.193,17.384],[0.927,20.981],[0.776,20.989],[0.781,23.298],[-2.754,23.308],[-2.76,20.968],[-22.28,21.027],[-47.98,21.106],[-67.489,21.166],[-67.498,23.286],[-71.021,23.27],[-71.012,21.161],[-74.667,21.165],[-74.638,28.84],[-73.164,28.836],[-73.102,60.458],[-73.101,60.736],[-73.101,60.898],[-103.972,60.958]];
const footprint=new CrossSection([outline]);
const area=(p,top)=>prism(p,base,z(top)).intersect(prism(outline,base,z(top)));
parts.push(area([[-120,-50],[20,-50],[20,70],[-120,70]],44.82));
// EC westvleugel, westelijke dwarsarm en recente hotelvleugel op hetzelfde BAG.
parts.push(area([[-113,-45.2],[-80.4,-45.2],[-80.4,-30.1],[-113,-30.1]],48.01));
parts.push(area([[-111,-30.1],[-87.4,-30.1],[-87.4,29],[-111,29]],45.3));
parts.push(area([[-105,28.8],[-73,28.8],[-73,62],[-105,62]],48.35));
// Zes lagen ED met oorspronkelijk dak en een terugliggende moderne opbouw.
const attic=[[-68,5.7],[-65.3,8.4],[-57.7,7.5],[-54,5.1],[-49.5,6.45],[-33.8,4.5],[-20,3.8],[-16.5,5.4],[-16.5,13.6],[-68,13.6]];
parts.push(prism(attic,z(44.7),z(50.2)));
const southAnnex=[[-30.44,-21.64],[-10.9,-32.99],[-4.65,-19.39],[-7.6,-17.62],[-15.24,-13.03],[-19.9,-7.47]];
parts.push(area(southAnnex,49.34));
// Zevenzijdige proefruimte; hogere ingesloten trappenschacht aan de achterzijde.
const tower=[[2.62,3.17],[2.99,10.52],[-2.67,15.31],[-10.58,13.56],[-9.2,7.56],[-5.56,.6],[-1.68,-1.195]];
const stair=[[-6.28,2.58],[-5.73,3.31],[-7.43,6.62],[-9.2,7.56],[-11.91,8.02],[-11.56,1.93],[-9.87,.26],[-7.02,-.41],[-5.56,.6]];
parts.push(prism(tower,base,z(61.44)),prism(stair,base,z(65.02)));
// Vier uitstekende liftkoppen en de kleine tentdakopbouw van EC.
const lifts=[[-1.1,21.2,47.55],[-69.3,21.2,47.5],[-37,-.3,47.6],[-108.1,19.1,48.3]];
for(const[x,y,h]of lifts)parts.push(box(x-1.75,y-1.75,base,x+1.75,y+1.75,z(h)));
parts.push(hipRoof(5.8,5.4,z(48.25),z(51.54),2.7).translate([-108.1,19.1,0]));
// Reliefbanden in liftkoppen: blinde nissen, geen loshangende richels.
for(const[x,y,h]of lifts)for(let n=Math.max(44.9,h-3);n<h-.1;n+=.75){
 cuts.push(box(x-2,y-1.95,z(n),x+2,y-1.53,z(n+.22)),box(x-2,y+1.53,z(n),x+2,y+1.95,z(n+.22)));
}
const groove=(A,B,s,t,lo,hi,depth=.45)=>{const len=Math.hypot(B[0]-A[0],B[1]-A[1]),d=[(B[0]-A[0])/len,(B[1]-A[1])/len],n=[d[1],-d[0]],at=[A[0]+d[0]*(s+t)/2,A[1]+d[1]*(s+t)/2];return box(-depth,-(t-s)/2,z(lo),.85,(t-s)/2,z(hi)).rotate([0,0,Math.atan2(n[1],n[0])*180/Math.PI]).translate([...at,0]);};
// ED straatzijde, binnenzijde, afgeschuinde kop en EC-gevels: zes vensterlagen.
const fronts=[[[.7,21],[-73,21.2],14],[[10.74,11.17],[7.19,17.38],1],[[7.19,17.38],[.927,20.98],1],[[10.69,3.95],[10.74,11.17],1],[[8.87,.75],[-10.9,-32.99],5],[[-30.44,-21.64],[-24.35,-1.79],3],[[-24.35,-1.79],[-87.58,-2.09],12],[[-87.58,-2.09],[-87.45,-30.18],5],[[-111.25,-45.135],[-80.513,-45.203],6],[[-110.27,-30.18],[-110.33,15.28],9]];
for(const[A,B,count]of fronts){
 const len=Math.hypot(B[0]-A[0],B[1]-A[1]);
 for(let floor=0;floor<6;floor++)for(let i=0;i<count;i++){
  const t=(i+.5)*len/count,lo=18.3+floor*4.15,hi=lo+(floor===5?2.05:2.85),w=count===1?len-1.7:Math.min(3.3,len/count-1.0);
  cuts.push(groove(A,B,t-w/2,t+w/2,lo,hi));
 }
}
// Kleinere torenramen: vijf lagen, drie vensters op elke zichtbare zijde.
for(let face=0;face<tower.length;face++){
 const A=tower[face],B=tower[(face+1)%tower.length],len=Math.hypot(B[0]-A[0],B[1]-A[1]);
 // Achtergevel achter de hogere trapkern heeft eigen vensters hieronder.
 if(face>=3&&face<=5)continue;
 for(let floor=0;floor<5;floor++)for(let i=0;i<3;i++){const t=(i+.5)*len/3;cuts.push(groove(A,B,t-.48,t+.48,46.1+floor*3.05,48+floor*3.05,.32));}
}
// Vrije achterkant van de trapkern, eveneens vijf kleine vensters.
for(let floor=0;floor<5;floor++)cuts.push(groove([-11.91,8.02],[-11.56,1.93],2.5,3.5,47.8+floor*3.5,49.65+floor*3.5,.32));
// Opbouw: blinde glasstroken aan Mathildelaan en nieuwe hotelvleugel.
for(let x=-65;x<-18;x+=3.3)cuts.push(box(x,13.2,z(45.7),x+2.3,14,z(48.9)));
for(let floor=0;floor<7;floor++)for(let y=31;y<59;y+=4.1){cuts.push(box(-104.4,y,z(18.1+floor*4),-103.55,y+2.2,z(20.7+floor*4)),box(-73.55,y,z(18.1+floor*4),-72.7,y+2.2,z(20.7+floor*4)));}
const model=union(parts).subtract(union(cuts));

if(model.status()!=='NoError'||model.decompose().length!==1)throw Error('Model niet gesloten/verbonden '+model.status()+' '+model.decompose().length);
await writeLandmark({slug,base,nodes:[['building:Lichttoren ED EC vleugels en zevenzijdige toren',model]],catalog:{name:'Lichttoren',origin,xAxis,groundOffsetMetres:0,groundSamplePoints:[[16,15],[-40,27],[-114,-12]],replacesBuildings:['NL.IMBAG.Pand.0772100001003341'],
 description:'Volledige BAG-vorm van Lichttoren en EC/ED-vleugels met zevenzijdige proefruimte, hogere trapkern, zes gevelreeks-lagen, liftkoppen en dakopbouw. Genoemde bouwdelen en vlakken; vensterdetail regelmatig uit fotos geschat. Moderne hotelvleugel op hetzelfde pand inbegrepen.',
 realWorld:{groundNapM:ground,mainRoofNapM:44.82,towerRoofNapM:61.44,stairRoofNapM:65.02,atticRoofNapM:50.2,axisDegrees:angle,estimates:['venstermaten, betonnen roeden en reliefbanden uit fotos regelmatig gemaakt','moderne hotelvleugel vensterreeksen geschat','dakinstallaties, reclameletters, vlaggenmasten en hekjes weggelaten; tentdak en dakopbouwen op AHN-ankers vereenvoudigd']},
 sources:['PDOK BAG0772100001003341, BGT, AHN DSM/DTM0.5m en Actueel_orthoHR;2026-10-09','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001003341 (3D BAG CC BY4.0)','https://monumentenregister.cultureelerfgoed.nl/monumenten/518717','https://commons.wikimedia.org/wiki/File:Lichttoren_Eindhoven_1.JPG','https://commons.wikimedia.org/wiki/File:13-06-28-eindhoven-by-RalfR-66.jpg','https://commons.wikimedia.org/wiki/File:Achterzijde_van_gebouw_ED,_gezien_vanaf_de_Emmasingel_-_Eindhoven_-_20338975_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_van_de_binnengevel_van_gebouw_EC_en_rechts_een_gedeelte_van_de_zuidgevel_van_gebouw_ED_-_Eindhoven_-_20338982_-_RCE.jpg']}});



