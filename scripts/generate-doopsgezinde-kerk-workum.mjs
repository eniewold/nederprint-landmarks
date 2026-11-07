import {union,hull,prism,rect,writeLandmark} from './efteling-kit.mjs';
// X langs de korte as van de kerk, +Y langs de lange as; RD-oorsprong op kerkhoek.
const B=-.5,origin=[158969.98,554970.43],axis=[.752,-.658],ground=.714;
const roofed=(poly,planes,z=25)=>{let s=prism(poly,B,z);for(const [a,b,c] of planes){let n=Math.hypot(a,b,1);s=s.trimByPlane([a/n,b/n,-1/n],-c/n)}return s};
// Achterliggende zaalkerk met schilddak en korte nok, volgens BAG en 3D BAG.
const h=15.55,t=1.30,cx=6.08,y0=5.66,y1=9.79;
const church=roofed(rect(0,0,12.18,15.40),[[t,0,h-t*cx],[-t,0,h+t*cx],[0,t,h-t*y0],[0,-t,h+t*y1]]);
// Lagere aangebouwde kosterswoning aan de straat, met zadeldak en klokgevel.
const house=roofed(rect(-10.35,4.45,.2,10.55),[[0,1.25,7.35-1.25*7.5],[0,-1.25,7.35+1.25*7.5]]);
const facade=hull([[-10.35,5.0,2.8],[-10.35,10,2.8],[-10.35,8.4,7.55],[-10.35,6.6,7.55],[-9.4,5,2.8],[-9.4,10,2.8],[-9.4,8.4,7.55],[-9.4,6.6,7.55]]);
let all=union([church,house,facade]);
// De concave schouders van de klokgevel liggen vóór het zadeldak; vlakken benaderen de kromming.
const edge=[[4.45,3.6],[5.25,3.8],[5.8,4.3],[6.2,5.15],[6.5,6.3],[6.6,7.55]];
const profileCuts=[];
for(const mirror of [false,true])for(let i=0;i<edge.length-1;i++){
  const [y0,z0]=edge[i], [y1,z1]=edge[i+1], a=mirror?15-y0:y0,b=mirror?15-y1:y1;
  profileCuts.push(hull([[-10.5,a,z0],[-10.5,b,z1],[-10.5,a,10],[-10.5,b,10],[-9.4,a,z0],[-9.4,b,z1],[-9.4,a,10],[-9.4,b,10]]));
}
all=all.subtract(union(profileCuts));
const niche=(x,y,w,z0,z1,angle=0,depth=.8)=>{const rad=w/2;const pts=[];for(const [a,b] of [[-rad,z0],[rad,z0],[rad,z1-.25],[0,z1],[-rad,z1-.25]])for(const d of [0,depth])pts.push([a,d,b]);return hull(pts).rotate([0,0,angle]).translate([x,y,0])};
let cuts=[];
// Straatgevel: toegang en beide begane-grondvensters, bovenvenster in klokgevel.
for(const y of [7.1,9.25])cuts.push(niche(-9.7,y,1.1,1.0,3.5,90));
cuts.push(niche(-9.7,5.25,1.1,0,2.5,90),niche(-9.7,7.5,1.05,4.5,6.55,90));
// Gevelopeningen van de eenvoudige schuilkerk en deur in de zichtbare voorzijde.
for(const x of [2.4,6.1,9.8])cuts.push(niche(x,-.15,1.15,3.8,6.5),niche(x,14.75,1.15,3.8,6.5));
for(const y of [2.3,13])cuts.push(niche(.6,y,1.15,3.8,6.5,90));
cuts.push(niche(.6,12.9,1.2,0,2.5,90));
all=all.subtract(union(cuts));
await writeLandmark({slug:'doopsgezinde-kerk-workum',base:B,nodes:[['building:kerk-en-kosterswoning',all]],catalog:{name:'Doopsgezinde Kerk Workum',origin,xAxis:axis,groundOffsetMetres:0,groundSamplePoints:[[-12,3],[-12,12],[0,-2],[12,-2],[14,15],[0,17]],replacesBuildings:['NL.IMBAG.Pand.0104100000126266'],description:'Schuilkerk met hoog schilddak achter een lagere kosterswoning met klokgevel; als één aangesloten BAG-pand gemodelleerd.',realWorld:{groundNapM:ground,churchRidgeM:h,houseRidgeM:7.35},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0104100000126266','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://kennis.cultureelerfgoed.nl/index.php/Monumentkenmerken/39486','https://commons.wikimedia.org/wiki/Category:Doopsgezinde_kerk,_Workum']}});


