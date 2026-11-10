// Stopera: gemeten vlakke bouwdelen met de operazaal en gebogen foyer. Coördinaten in meters RD t.o.v. het lokale oorsprongspunt.
import {Manifold,CrossSection,ccw,hull,union,writeLandmark} from './efteling-kit.mjs';
const G=.871, BASE=-.5;
const part=(p,h)=>Manifold.extrude(new CrossSection([ccw(p)]).offset(.08),h-G-BASE).translate([0,0,BASE]);
const stadhuis_aanbouw=part([[-87.11, -32.54], [-79.4, -20.69], [-91.22, -12.59], [-99.12, -24.24]],19.86);
const west_voorbouw=part([[-68.76, -18.64], [-86.79, -6.06], [-91.22, -12.59], [-79.4, -20.69], [-87.11, -32.54], [-81.04, -36.74]],16.66);
const theater_opbouw_oost=part([[33.49, -14.37], [43.51, -1.43], [26.14, 12.22], [16.46, 0.01]],24.55);
const stadhuis_dakopbouw_1=part([[-7.03, 59.76], [-0.51, 55.44], [7.26, 66.64], [1.08, 70.83]],27.76);
const theater_dakopbouw=part([[28.53, -42.98], [21.11, -37.37], [16.69, -41.52], [25.19, -48.77]],33.42);
const stadhuis_dakopbouw_2=part([[-48.44, 66.8], [-37.62, 59.29], [-32.95, 65.72], [-44.02, 73.22]],27.75);
const halfronde_toneelaanbouw=part([[41.13, -42.47], [43.49, -34.31], [38.95, -26.59], [29.88, -23.84], [22.46, -29.03], [22.84, -30.33], [38.42, -42.64]],22.44);
const stadhuis_dakopbouw_5=part([[87.39, 11.74], [79.93, 0.36], [86.16, -3.73], [93.83, 7.45], [90.19, 9.87], [90.43, 10.87], [88.88, 10.74]],27.79);
const stadhuis_dakopbouw_3=part([[36.27, 29.96], [42.89, 25.95], [50.32, 36.97], [44.21, 41.25]],27.78);
const opera_zaal=part([[-0.58, -42.57], [0.04, -41.98], [-2.12, -40.21], [-2.91, -41.21], [-13.65, -34.95], [-19.22, -47.18], [-16.65, -64.54], [-11.34, -74.01], [-0.33, -82.64], [15.64, -88.17], [16.39, -87.42], [24.46, -88.25], [41.52, -81.79], [42.3, -80.8], [33.61, -63.67], [31.62, -66.27], [29.16, -65.76], [31.1, -61.06]],23.13);
const toneelhuis=part([[18.01, -1.3], [14.52, 1.66], [-9.62, -28.74], [-10.19, -27.34], [-13.65, -34.95], [-2.91, -41.21], [-2.12, -40.21], [0.04, -41.98], [-0.58, -42.57], [31.15, -61.09], [32.62, -60.6], [33.1, -62.01], [35.66, -60.99], [45.91, -47.58], [41.12, -44.76], [38.3, -46.4], [37.96, -45.34], [39.77, -43.7], [16.28, -25.31], [28.63, -10.27], [23.4, -5.85], [20.87, -5.94], [22.07, -7.16], [20.8, -7.34], [20.77, -8.0], [19.66, -7.51], [16.62, -7.95], [17.2, -6.41], [16.47, -6.09], [17.33, -6.06], [18.4, -3.19]],20.46);
const stadhuis_binnenvleugel=part([[-27.49, 41.19], [-61.18, -7.31], [-60.77, -7.58], [-61.73, -8.99], [-62.18, -8.75], [-64.99, -12.82], [-87.58, 2.41], [-84.59, -0.06], [-101.47, -24.84], [-100.15, -25.75], [-86.79, -6.06], [-68.76, -18.64], [-81.99, -38.15], [-69.43, -46.72], [-5.72, 46.86], [-17.88, 55.28], [-26.95, 42.95]],9.84);
const theater_opbouw_west=part([[79.22, -29.71], [62.05, -16.02], [52.09, -28.7], [69.39, -42.27]],24.54);
const noordfoyer=part([[-15.97, 9.59], [-21.93, -1.39], [-20.68, -8.44], [-17.89, -13.48], [-17.16, -13.36], [-14.54, -16.59], [-12.84, -20.79], [19.37, 19.95], [1.92, 33.65], [-16.19, 10.71]],10.27);
const opera_noordvleugel=part([[21.64, 22.81], [87.03, -28.96], [89.77, -25.48], [83.85, -20.78], [84.18, -20.33], [18.13, 30.79], [14.05, 24.12], [19.37, 19.95]],9.76);
const lage_binnenplaats=part([[-48.22, -34.17], [-35.58, -42.43], [-31.43, -36.29], [-29.39, -37.69], [-30.61, -39.78], [-14.41, -16.93], [-17.16, -13.36], [-17.89, -13.48], [-20.68, -8.44], [-20.78, -6.97], [-25.21, -12.38], [-34.33, -5.74], [-3.04, 39.97], [-0.88, 38.62], [2.13, 41.43], [-5.72, 46.86], [-68.82, -45.82], [-64.03, -48.69], [-47.94, -25.05], [-43.88, -27.8]],6.16);
const opera_nevenruimte=part([[14.52, 1.66], [16.46, 0.01], [26.14, 12.22], [43.51, -1.43], [33.49, -14.37], [40.8, -20.55], [39.57, -24.04], [38.79, -23.68], [37.98, -26.48], [39.46, -27.46], [43.56, -24.09], [54.29, -32.3], [53.7, -33.07], [55.82, -34.63], [33.61, -63.67], [42.3, -80.8], [82.84, -29.2], [25.8, 15.87]],20.46);
const stadhuis_dakopbouw_4=part([[-62.35, 22.08], [-73.62, 29.85], [-76.03, 28.11], [-75.43, 27.16], [-77.84, 23.57], [-67.23, 15.33]],27.77);
const stadhuis_tussenvleugel=part([[-59.19, 20.89], [-62.39, 17.83], [-61.79, 17.07], [-67.37, 8.87], [-68.23, 9.4], [-69.43, 7.66], [-71.78, 2.39], [-76.73, -4.87], [-64.99, -12.82], [-62.18, -8.75], [-61.73, -8.99], [-60.77, -7.58], [-61.18, -7.31], [-27.49, 41.19], [-26.95, 42.95], [-17.88, 55.28], [-27.53, 61.96], [-23.65, 67.13], [-26.5, 68.92], [-47.37, 39.69], [-46.71, 39.22], [-47.05, 38.73], [-53.39, 31.08], [-52.59, 30.58]],13.34);
const gebogen_foyer=part([[-29.63, -60.73], [-27.23, -60.06], [-26.62, -62.06], [-28.98, -63.46], [-21.14, -77.9], [-20.2, -78.5], [-18.29, -77.43], [-16.95, -79.02], [-18.33, -80.76], [-19.3, -80.7], [-5.03, -91.95], [-3.19, -89.88], [-1.38, -90.8], [-1.92, -92.91], [-2.53, -93.1], [-0.36, -93.94], [15.67, -98.26], [15.01, -97.48], [15.57, -95.37], [17.64, -95.49], [17.59, -97.91], [18.28, -98.16], [36.24, -95.63], [35.3, -95.17], [34.95, -93.01], [36.95, -92.29], [38.09, -94.18], [37.83, -95.01], [53.29, -85.56], [49.57, -76.4], [47.61, -74.05], [41.52, -81.79], [24.46, -88.25], [16.39, -87.42], [15.64, -88.17], [-0.33, -82.64], [-11.34, -74.01], [-16.65, -64.54], [-19.22, -47.18], [-10.19, -27.34], [-14.41, -16.93], [-30.61, -39.78], [-28.59, -40.53], [-28.83, -42.66], [-31.53, -42.96]],16.07);
const stadhuis_L=part([[99.91, -4.16], [102.46, -3.6], [104.37, -1.84], [105.14, 0.65], [104.55, 3.19], [101.97, 5.47], [99.38, 5.75], [97.3, 4.92], [93.83, 7.45], [86.16, -3.73], [79.93, 0.36], [87.39, 11.74], [88.88, 10.74], [90.43, 10.87], [91.02, 11.16], [90.97, 13.12], [52.14, 39.66], [42.89, 25.95], [36.27, 29.96], [44.21, 41.25], [46.97, 39.82], [47.44, 41.6], [46.82, 41.93], [47.7, 42.56], [8.95, 69.08], [-0.51, 55.44], [-7.03, 59.76], [1.08, 70.83], [2.98, 69.54], [4.52, 72.1], [-31.95, 96.99], [-43.14, 80.6], [-44.16, 81.15], [-43.11, 80.34], [-44.73, 77.98], [-46.02, 78.8], [-45.43, 76.96], [-77.45, 30.33], [-76.03, 28.11], [-73.62, 29.85], [-62.35, 22.08], [-67.23, 15.33], [-80.6, 25.72], [-93.7, 6.51], [-76.73, -4.87], [-74.43, -1.51], [-75.33, -0.97], [-73.3, 1.99], [-72.38, 1.5], [-69.43, 7.66], [-68.23, 9.4], [-67.37, 8.87], [-61.79, 17.07], [-62.39, 17.83], [-59.19, 20.89], [-52.59, 30.58], [-53.39, 31.08], [-47.05, 38.73], [-46.71, 39.22], [-47.37, 39.69], [-26.31, 68.93], [-23.65, 67.13], [-25.07, 64.88], [103.37, -19.24], [108.15, -12.24], [97.14, -4.71], [97.81, -3.59]],23.82);
const operagevel=part([[63.12, -11.43], [73.68, -19.79], [72.64, -21.15], [82.84, -29.2], [47.61, -74.05], [49.57, -76.4], [87.03, -28.96], [21.64, 22.81], [-12.84, -20.79], [-9.62, -28.74], [25.8, 15.87], [62.18, -12.88]],13.54);
const podiumtoren=part([[33.5,-65.2],[2.8,-40.8],[16.1,-24.0],[46.8,-48.4]],32.64);
// Galerij: glas ontbreekt grotendeels in het AHN; gedaante en ligging afgeleid van ortho en foto's.
const ga=[-25.1,64.9],gb=[103.4,-19.2],gw=2.5,dx=gb[0]-ga[0],dy=gb[1]-ga[1],gl=Math.hypot(dx,dy),nx=-dy/gl,ny=dx/gl;
const edge=(p,s,z)=>[p[0]+nx*s,p[1]+ny*s,z-G];
const galerij=hull([edge(ga,-gw,G+BASE),edge(ga,gw,G+BASE),edge(gb,-gw,G+BASE),edge(gb,gw,G+BASE),edge(ga,-gw,10.0),edge(ga,gw,10.0),edge(gb,-gw,10.0),edge(gb,gw,10.0),edge(ga,0,12.0),edge(gb,0,12.0)]);
const aansluitvlak=(p,h)=>Manifold.extrude(new CrossSection([ccw(p)]).offset(.35),h-G-BASE).translate([0,0,BASE]);
// Lagere dakvlakken rond het toneelhuis, afgeleid uit 3D BAG en gecontroleerd met AHN5.
const schouder_noord_laag=aansluitvlak([[33.5,-18.9],[35.9,-18.3],[27.2,-12.1],[17,-24.5],[20.4,-28.1],[26.9,-23.1],[28,-18.6],[32.7,-20.8]],13.74);
const schouder_noord_midden=aansluitvlak([[28,-18.6],[26.9,-23.1],[20.4,-28.1],[21.3,-29.1],[22.3,-28.5],[22.5,-29],[29.9,-23.8],[31.1,-24.2],[32.7,-20.8]],16.81);
const schouder_noord_hoog=aansluitvlak([[37.7,-18],[33.5,-18.9],[31.1,-24.2],[38.1,-26.1],[40.8,-20.5]],19.7);
const schouder_zuid_laag=aansluitvlak([[55.8,-34.6],[53.7,-33.1],[54.3,-32.3],[43.6,-24.1],[41.7,-25.6],[48.6,-34.5],[43.5,-39.4],[43.9,-40.5],[41.2,-44.8],[45.9,-47.6]],13.7);
const schouder_zuid_midden=aansluitvlak([[43.9,-40.5],[43.5,-39.4],[48.6,-34.5],[46,-30.9],[42.8,-33.2],[43.5,-34.3],[41.4,-42.2],[40.5,-42.9],[41.8,-43.9]],16.82);
const schouder_zuid_hoog=aansluitvlak([[41.7,-25.6],[39.5,-27.5],[42.8,-33.2],[46,-30.9]],19.7);
let body=union([schouder_noord_laag,schouder_noord_midden,schouder_noord_hoog,schouder_zuid_laag,schouder_zuid_midden,schouder_zuid_hoog,stadhuis_L,opera_zaal,toneelhuis,stadhuis_binnenvleugel,noordfoyer,opera_noordvleugel,lage_binnenplaats,opera_nevenruimte,stadhuis_tussenvleugel,gebogen_foyer,operagevel,theater_opbouw_oost,theater_opbouw_west,stadhuis_aanbouw,west_voorbouw,halfronde_toneelaanbouw,stadhuis_dakopbouw_1,stadhuis_dakopbouw_2,stadhuis_dakopbouw_3,stadhuis_dakopbouw_4,theater_dakopbouw,stadhuis_dakopbouw_5,podiumtoren,galerij]);
// Doorlopende gevelstijlen vereenvoudigen het raamritme en hebben geen overhang.
const arc=[[-29.44,-60.26],[-28.98,-63.46],[-21.14,-77.9],[-19.3,-80.7],[-5.03,-91.95],[-.36,-93.94],[15.67,-98.26],[36.24,-95.63],[53.29,-85.56]];
const stijlen=[];
function gevel(path,top,width,step){for(let i=0;i<path.length-1;i++){
 const a=path[i],b=path[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
 for(let s=width/2+1;s<l-width/2-1;s+=step){const x=a[0]+ux*s,y=a[1]+uy*s,w=width/2;const poly=[[x-ux*w-nx*.5,y-uy*w-ny*.5],[x+ux*w-nx*.5,y+uy*w-ny*.5],[x+ux*w+nx*.5,y+uy*w+ny*.5],[x-ux*w+nx*.5,y-uy*w+ny*.5]];stijlen.push(part(poly,top));}
}}
gevel(arc,15.5,1,5.5);
// Herhaal de raamverdeling van de bakstenen stadhuisvleugel, op basis van gevelbeelden.
const buiten=[[-93.7,6.51],[-31.95,96.99],[90.97,13.12]];
gevel(buiten,23.6,1,5.8);
body=union([body,...stijlen]);
// Blinde ramen aan de Waterlooplein- en Zwanenburgwalvleugels; getrapte bovenrand.
const vensters=[];
for(let i=0;i<buiten.length-1;i++) { if(!(i>=1))continue;
 const a=buiten[i],b=buiten[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
 for(let t=2;t<l-3;t+=5.8) for(const z of [5.2,9.4,13.6,17.8]) {
  const pts=[];for(const x of [t,t+3.3])for(const depth of [-.45,.52])for(const top of [false,true]){
   const h=top?z+2.1-(depth<0?1.5:0):z;
   pts.push([a[0]+ux*x+nx*depth,a[1]+uy*x+ny*depth,h]);
  } vensters.push(hull(pts));
 }
}
body=body.subtract(union(vensters));body=body.decompose().sort((a,b)=>b.volume()-a.volume())[0];
if(body.status()!=='NoError'||body.decompose().length!==1) throw Error('Stopera moet een verbonden manifold zijn');
await writeLandmark({slug:'stopera',base:BASE,nodes:[['building:stopera',body]],catalog:{name:'Stopera',origin:[121875,486775],xAxis:[1,0],groundOffsetMetres:0,groundSamplePoints:[[-101,-12],[-82,-48],[108,-25]],replacesBuildings:['NL.IMBAG.Pand.0363100012186092'],description:'Stadhuis en muziektheater aan de Amstel, met L-vormige stadhuisvleugel, toneeltoren en gebogen foyer met raamvlakken. Lokale X en Y liggen langs RD-oost en RD-noord; z=0 is maaiveld NAP +0,871 m.',realWorld:{groundNapM:G,stadhuisDakNapM:23.82,foyerDakNapM:16.07,zaalDakNapM:23.13,toneeltorenNapM:32.64},sources:['PDOK BAG pand 0363100012186092 en AHN5 DSM 0,5 m, geraadpleegd 10 november 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012186092','https://arcam.nl/architectuur-gids/stopera/','https://commons.wikimedia.org/wiki/Category:Stopera']}});
