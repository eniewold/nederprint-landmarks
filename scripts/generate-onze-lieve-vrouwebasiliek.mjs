// Onze-Lieve-Vrouwebasiliek: bouwdelen en dakvlakken, geen DSM-hoogtelagen.
// BAG/AHN CC0; dakmetingen 3D BAG LoD2.2 CC BY 4.0, 10-10-2026.
import {Manifold,prism,rect,box,union,hull,circle,spire,writeLandmark,downFaces} from './efteling-kit.mjs';
const SLUG='onze-lieve-vrouwebasiliek',ORIGIN=[176585,317556],ANGLE=5*Math.PI/180;
const GROUND_NAP=48.6,BASE=-1.8,nap=z=>z-GROUND_NAP;
// BAG-contour hieronder wordt voor reproduceerbaarheid letterlijk opgeslagen.
const FOOT=[[-30.78, -18.02], [-30.76, -19.88], [-28.16, -19.83], [-28.18, -20.92], [-3.62, -20.88], [7.67, -20.67], [7.67, -21.81], [8.17, -21.81], [8.2, -25.87], [7.7, -25.86], [7.64, -29.93], [24.76, -29.66], [24.76, -29.1], [25.6, -29.0], [27.02, -28.16], [27.53, -27.19], [27.68, -26.36], [27.62, -25.5], [27.28, -24.76], [26.74, -24.09], [25.46, -23.55], [24.77, -23.56], [25.09, -18.3], [26.79, -18.11], [28.62, -17.51], [30.53, -16.26], [31.97, -14.69], [32.98, -13.12], [33.84, -10.84], [34.14, -9.36], [34.16, -7.12], [33.81, -4.6], [32.79, -2.22], [30.45, 0.53], [27.7, 2.04], [25.33, 2.36], [25.63, 7.58], [26.41, 7.59], [27.77, 8.27], [28.44, 9.59], [28.46, 10.45], [28.12, 11.88], [27.51, 12.56], [26.97, 12.95], [25.7, 13.25], [25.7, 14.21], [24.54, 14.22], [24.55, 19.53], [20.01, 19.53], [20.2, 21.17], [12.45, 21.18], [12.46, 24.7], [10.16, 24.96], [9.54, 37.22], [0.61, 36.82], [0.59, 37.27], [-0.33, 37.17], [-0.32, 36.78], [-3.84, 36.59], [-3.88, 37.08], [-4.64, 37.0], [-4.64, 36.56], [-7.82, 36.31], [-7.91, 36.83], [-8.88, 36.78], [-8.82, 36.37], [-12.11, 36.17], [-12.11, 36.62], [-12.98, 36.52], [-12.91, 36.05], [-16.34, 35.77], [-16.4, 38.35], [-21.56, 38.19], [-21.41, 36.08], [-22.15, 36.09], [-22.07, 11.65], [-31.69, 11.05], [-31.68, 9.34], [-31.43, 9.07], [-30.85, 9.07], [-30.76, 5.5], [-31.45, 5.47], [-31.48, 5.14], [-31.64, 5.16], [-31.64, 3.61], [-31.13, 3.56], [-31.1, 2.3], [-32.35, 1.93], [-33.23, 1.08], [-33.66, -0.07], [-33.53, -1.32], [-35.48, -1.34], [-35.34, -14.56], [-33.37, -14.56], [-33.4, -15.8], [-32.91, -16.9], [-32.01, -17.68]];

const COURT=[[3.1,30.82],[3.34,4.87],[3,4.87],[-8.56,4.96],[-8.62,10.41],[-16,10.34],[-16.76,30.06]];
const footprint=prism(FOOT,BASE,55).subtract(prism(COURT,BASE-1,56));
const cut=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n);};
const roofed=(poly,planes)=>planes.reduce((s,[a,b,c])=>cut(s,a,b,nap(c)),prism(poly,BASE,55));
const ridgeY=(y,z,t)=>[[0,t,z-t*y],[0,-t,z+t*y]];
const ridgeX=(x,z,t)=>[[t,0,z-t*x],[-t,0,z+t*x]];
const parts=[prism(FOOT,BASE,nap(56.85)).subtract(prism(COURT,BASE-1,55))],cuts=[];
// Hoog basilicaal middenschip; dwarse zijbeukkappen hebben hun eigen nokken.
parts.push(roofed(rect(-27.9,-14.74,21.0,-1.18),ridgeY(-7.98,73.82,.767)));
parts.push(roofed(rect(-30.0,-21,8.3,-14.4),[[0,.657,72.25]]));
parts.push(roofed(rect(-30.8,-1.5,8.3,5.9),[[0,-.65,61.5]]));
for(const [x0,x1,rx,rz,s]of [[-29.6,-20.4,-24.7,66.95,.90],[-12.5,-.5,-6.6,68.15,.79]])parts.push(roofed(rect(x0,-21,x1,-14.3),ridgeX(rx,rz,s)));
for(const [x0,x1,rx,rz,s]of [[-30.95,-20.3,-24.7,67.16,1.0],[-12.2,-.4,-6.3,68.0,.82]])parts.push(roofed(rect(x0,-1.5,x1,5.9),ridgeX(rx,rz,s)));
// Twee dwarsschepen met aansluitende kapellen; oosttorens met ZADELDAKEN.
parts.push(roofed(rect(8.0,-1.5,21.6,14.9),ridgeX(14.6,68.25,.81)));
parts.push(roofed(rect(7.5,-30,22.3,-14.4),ridgeX(14.2,68.9,.89)));
for(const [x,y,rz]of [[22.6,5.3,77.5],[22.55,-21.05,77.5]])parts.push(roofed(rect(x-3.0,y-3.2,x+3.0,y+3.2),ridgeY(y,rz,1.63)));
// Rond oostkoor: halve cirkel als bouwdeel en radiale kapvlakken tot de nok.
const apse=[[19.3,-18.6],[25.0,-18.6],...Array.from({length:17},(_,i)=>{const a=-Math.PI/2+i*Math.PI/16;return[24.5+9.65*Math.cos(a),-8.0+9.65*Math.sin(a)];}),[19.3,2.6]];
parts.push(roofed(apse,[...ridgeY(-7.8,73.9,.91),[-1.051,.128,100.688],[-.834,-.589,89.716],[-.826,.619,99.339]]));
// Kleine ronde apsiden naast het oostkoor, verbonden met beide transepten.
for(const [x,y]of [[25.2,10.4],[24.8,-26.3]]){
 parts.push(prism(circle([x,y],2.9,24),BASE,nap(57.7)),spire([x,y],2.9,nap(57.7),nap(60.2),24,0),box(20,y-2.9,BASE,x,y+2.9,nap(58.0)));
}
// Massief westwerk met ondiep zadeldak en twee RONDE traptorens.
parts.push(roofed(rect(-35.5,-14.8,-26.7,-1.2),ridgeX(-32.1,79.6,.59)));
for(const [x,y,tip]of [[-31.1,-.45,90.3],[-30.7,-15.25,89.35]]){
 parts.push(prism(circle([x,y],2.60,32),BASE,nap(83.0)),spire([x,y],2.60,nap(83),nap(tip),32,0));
 // Waterlijsten met steile onderzijde, maximaal 0,25 m uitkraging.
 for(const z of [71.0,74.1,77.2,80.2])parts.push(hull([...circle([x,y],2.6,32).map(p=>[...p,nap(z-.4)]),...circle([x,y],2.85,32).map(p=>[...p,nap(z)])]));
 for(let k=0;k<8;k++){const a=k*Math.PI/4,r=2.6;cuts.push(niche(x+r*Math.cos(a),y+r*Math.sin(a),a*180/Math.PI+90,.95,80.9,82.0));}
}
for(const y of [-11.2,-4.8])parts.push(roofed(rect(-33.65,y-.65,-32.45,y+.65),[...ridgeY(y,79.7,1.2),[.59,0,99.35]]));
// Noordwestportaal en kapel, inclusief de verhoogde geveltop.
parts.push(roofed(rect(-31.8,1.8,-21.3,11.2),ridgeY(7.22,66.4,1.84)));
parts.push(roofed(rect(-16.1,4.8,-8.5,10.45),[...ridgeY(7.42,61.78,1.48),[2.145,.065,91.445],[-1.571,-.053,45.034]]));
// Kloostergangen: eigen west-, noord- en oostkap, open pandhof.
parts.push(roofed(rect(-22.3,9.6,-15.9,36.2),[[-.947,-.032,42.308]]));
parts.push(roofed(rect(-22.3,30,10.2,37.4),[[-.046,1.187,21.153],[.012,-1.281,104.807]]));
parts.push(roofed(rect(3.0,4.8,10.3,37.4),[[1.146,.023,53.85],[-1.34,-.019,70.113]]));
// Lagere noordelijke vertrekken en smalle platte aanbouw naast de oostgang.
parts.push(roofed(rect(9.4,14.3,20.3,21.8),ridgeY(17.6,61.65,1.62)));
parts.push(roofed(rect(20,14.3,24.6,20.1),[...ridgeY(16.9,60.36,1.62),[-1.612,0,95.827]]));
parts.push(box(10,20.5,BASE,12.6,25.1,nap(57.55)));
parts.push(roofed(rect(19.6,-30,25.4,-24),[[0,.461,70.342]]));
// Rondboognissen worden blind uitgevoerd; top in twee steile vlakken.
function niche(x,y,deg,w,z0,z1){return Manifold.extrude([[[-w/2,nap(z0)],[w/2,nap(z0)],[w/2,nap(z1)],[0,nap(z1)+w*.64],[-w/2,nap(z1)]]],.55).rotate([90,0,0]).translate([0,.35,0]).rotate([0,0,deg]).translate([x,y,0]);}
for(const x of [-25,-17.5,-10.1,-2.8,4.2]){
 cuts.push(niche(x,-14.74,0,2.3,65.8,69.3),niche(x,-1.18,180,2.3,65.8,69.3));
 cuts.push(niche(x,-20.85,0,2.5,51.7,56.3));
}
for(const [x,y]of [[22.6,5.3],[22.55,-21.05]])for(const z of [64.5,71.3])for(const xx of [x-1.1,x+1.1])cuts.push(niche(xx,y-3.2,0,.95,z,z+2.4),niche(xx,y+3.2,180,.95,z,z+2.4));
for(let k=0;k<8;k++){const a=-Math.PI/2+(k+.5)*Math.PI/8,x=24.5+9.65*Math.cos(a),y=-8+9.65*Math.sin(a);cuts.push(niche(x,y,a*180/Math.PI+90,1.95,53.1,57.7),niche(x,y,a*180/Math.PI+90,1.65,60.7,63.3));}
cuts.push(niche(-31.7,7.2,270,5.8,49.3,56.9),niche(-35.45,-8,270,3.5,67,69.3));
for(const y of [14,19,24,28])cuts.push(niche(-16.2,y,90,2.8,51.0,55.8),niche(3.1,y,270,2.8,51.0,55.8));
for(const x of [-13,-8,-3,1])cuts.push(niche(x,30.3,0,2.8,51,55.8));
const solid=union(parts).intersect(footprint).subtract(union(cuts));
if(solid.decompose().length!==1||solid.genus()!==1)throw new Error('Eén gesloten volume met uitsluitend de open pandhof vereist: '+solid.genus());
console.log('overhang-vlakken',JSON.stringify(downFaces(solid,BASE)));
await writeLandmark({slug:SLUG,nodes:[['building:basiliek',solid]],base:BASE,catalog:{
 name:'Onze-Lieve-Vrouwebasiliek',origin:ORIGIN,xAxis:[Math.cos(ANGLE),Math.sin(ANGLE)],groundOffsetMetres:-.3,groundHeight:94.15919492867137,
 groundSamplePoints:[[-39,-8],[39,-8],[-4,21]],replacesBuildings:['NL.IMBAG.Pand.0935100000021253'],
 description:'Basilicaal schip met dwarskappen, rond oostkoor, twee oosttorens met zadeldaken, westwerk met ronde traptorens, kapellen en lage aanbouwen; kloostergangen rondom een open pandhof. Regelmatige bouwdelen en dakvlakken, blinde vensternissen. +X ongeveer oost, Z omhoog.',
 realWorld:{groundNapM:GROUND_NAP,naveRidgeNapM:73.82,westworkRidgeNapM:79.6,northWestTipNapM:90.3,southWestTipNapM:89.35,eastTowerRidgeNapM:77.5,roofAxisDegrees:5,minimumFreeStandingM:.95,courtyardOpen:true},
 sources:['https://service.pdok.nl/lv/bag/wfs/v2_0','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000021253','https://monumentenregister.cultureelerfgoed.nl/monumenten/27454','https://www.zichtopmaastricht.nl/locaties/onze-lieve-vrouwebasiliek-het-kerkgebouw','https://commons.wikimedia.org/wiki/File:Maastricht_Basiliek_Onze_Lieve_Vrouwe_ten_Tenhemelopneming_Apsis_2.jpg','https://commons.wikimedia.org/wiki/File:Maastricht_RK_OLV_basiliek_7905.jpg','https://commons.wikimedia.org/wiki/File:Maastricht_RK_OLV_pandhof_7918.jpg','https://commons.wikimedia.org/wiki/File:West_toren_en_transept_vanaf_een_punt_pl.m._2_meter_boven_de_nok_van_het_dak_van_de_school_in_de_Stokstraat_-_Maastricht_-_20146457_-_RCE.jpg']
}});
