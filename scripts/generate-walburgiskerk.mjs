// Walburgiskerk Zutphen, afzonderlijke bouwdelen/dakvlakken, geen hoogtelagen.
// BAG/AHN CC0; 3D BAG CC BY 4.0, gemeten 10 oktober 2026.
import {Manifold,prism,rect,box,union,hull,circle,spire,dome,writeLandmark,downFaces} from './efteling-kit.mjs';
const SLUG='walburgiskerk',ORIGIN=[210347,461575],ANGLE=-16*Math.PI/180;
const GROUND_NAP=9.6,BASE=-.65,nap=z=>z-GROUND_NAP;
const FOOT=[[9.85, 14.31], [5.87, 14.29], [4.86, 15.26], [4.8, 21.65], [6.54, 21.66], [6.54, 22.79], [4.8, 22.78], [4.73, 30.23], [6.0, 31.52], [5.14, 32.36], [3.92, 31.1], [-5.34, 31.05], [-6.68, 32.33], [-7.47, 31.5], [-6.2, 30.28], [-6.1, 22.7], [-7.84, 22.69], [-7.83, 21.56], [-6.08, 21.57], [-5.99, 14.51], [-8.95, 14.51], [-8.97, 16.0], [-9.2, 16.0], [-9.22, 17.83], [-8.44, 17.83], [-8.45, 18.8], [-9.24, 18.8], [-9.25, 19.55], [-14.89, 19.54], [-14.88, 18.67], [-15.69, 18.67], [-15.67, 17.79], [-14.89, 17.79], [-14.87, 15.97], [-15.13, 15.96], [-15.11, 14.41], [-19.03, 14.4], [-19.05, 15.92], [-20.06, 15.92], [-20.04, 14.36], [-23.98, 14.36], [-24.0, 15.86], [-24.97, 15.86], [-24.95, 14.31], [-29.14, 14.3], [-29.16, 15.8], [-30.12, 15.8], [-30.1, 14.23], [-34.9, 14.23], [-34.93, 15.74], [-35.87, 15.74], [-35.76, 7.73], [-38.92, 7.73], [-38.92, 4.71], [-37.22, 4.71], [-36.49, 4.0], [-36.42, -6.45], [-37.97, -8.02], [-37.01, -8.98], [-36.0, -7.97], [-35.94, -17.99], [-34.91, -17.98], [-34.92, -16.36], [-30.26, -16.34], [-30.25, -17.96], [-29.26, -17.96], [-29.27, -16.34], [-24.83, -16.32], [-24.82, -17.94], [-23.81, -17.93], [-23.82, -16.31], [-20.0, -16.3], [-19.99, -17.92], [-19.0, -17.91], [-19.01, -16.29], [-15.07, -16.27], [-15.06, -17.89], [-14.06, -17.89], [-14.06, -16.27], [-10.18, -16.25], [-10.18, -17.87], [-9.18, -17.87], [-9.18, -16.25], [-5.45, -16.23], [-5.43, -17.77], [-4.89, -17.77], [-4.86, -19.73], [-5.35, -19.74], [-6.19, -20.23], [-6.18, -20.86], [-10.18, -20.87], [-11.08, -20.02], [-11.69, -20.67], [-10.91, -21.42], [-10.83, -27.14], [-11.7, -28.06], [-11.04, -28.69], [-10.23, -27.83], [-5.34, -27.82], [-5.41, -32.49], [-6.73, -33.7], [-5.92, -34.58], [-4.54, -33.32], [5.06, -33.41], [6.31, -34.68], [7.11, -33.9], [6.28, -33.04], [8.53, -33.07], [9.01, -33.55], [9.58, -32.97], [9.09, -32.5], [9.16, -27.83], [11.79, -27.86], [12.71, -28.79], [13.4, -28.11], [12.47, -27.16], [12.48, -22.16], [13.43, -21.21], [12.78, -20.54], [12.75, -18.45], [6.05, -18.57], [6.01, -16.5], [6.14, -16.7], [6.92, -16.69], [7.68, -15.9], [10.46, -15.86], [11.14, -16.51], [11.59, -16.5], [12.1, -15.94], [17.17, -15.4], [17.8, -15.73], [21.92, -22.46], [21.76, -23.38], [22.57, -23.52], [22.73, -22.62], [25.9, -20.91], [26.28, -21.59], [26.98, -21.2], [26.6, -20.54], [29.61, -18.92], [30.11, -19.52], [30.76, -18.98], [30.27, -18.39], [32.3, -15.56], [32.93, -16.01], [33.41, -15.34], [32.78, -14.89], [34.81, -12.07], [35.56, -12.13], [35.63, -11.32], [34.76, -11.24], [34.15, -7.9], [34.44, -6.36], [38.35, -6.26], [39.05, -7.7], [39.96, -7.26], [39.26, -5.83], [41.67, -3.16], [43.2, -3.71], [43.56, -2.72], [42.07, -2.19], [41.98, 1.43], [43.54, 2.11], [43.13, 3.05], [41.59, 2.38], [38.96, 5.0], [39.56, 6.43], [38.64, 6.82], [38.16, 5.66], [34.09, 5.6], [33.81, 6.84], [32.83, 6.62], [33.14, 5.28], [30.38, 4.3], [29.6, 5.52], [28.61, 5.87], [27.64, 5.3], [24.91, 9.62], [25.05, 10.3], [24.63, 10.7], [23.91, 10.69], [18.47, 13.46], [18.01, 14.19], [17.42, 14.31], [16.61, 13.86], [11.73, 14.0], [11.25, 14.77], [10.62, 14.76]];

const footprint=prism(FOOT,BASE,90);
const cut=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n);};
const roofed=(poly,planes)=>planes.reduce((s,[a,b,c])=>cut(s,a,b,nap(c)),prism(poly,BASE,90));
const ridgeY=(y,z,t)=>[[0,t,z-t*y],[0,-t,z+t*y]];
const ridgeX=(x,z,t)=>[[t,0,z-t*x],[-t,0,z+t*x]];
const parts=[prism(FOOT,BASE,nap(11.4))],cuts=[];
// Hallenschip: drie langsdaken, elk met een eigen westelijk schild.
parts.push(roofed(rect(-36.4,-16.4,5.8,-6.8),[[0,1.577,51.118],[0,-1.568,14.552],[2.445,0,112.91]]));
parts.push(roofed(rect(-36.4,-6.8,5.8,4.85),[[0,1.549,37.338],[0,-1.485,33.94],[-2.365,0,13.632],[2.445,0,120.0]]));
parts.push(roofed(rect(-36.4,4.7,5.8,14.5),[[0,1.72,17.165],[0,-1.669,49.125],[2.417,0,112.196]]));
// Transept met schild aan beide uiteinden, zuidelijke verbreding en aanbouwen.
parts.push(roofed(rect(-6.15,13.7,6.1,31.15),[[1.953,.013,36.589],[-1.919,-.015,34.553],[0,1.97,3.9],[.011,2.601,111.502],[-1.052,-1.341,70.247],[.865,-.936,59.221]]));
parts.push(roofed(rect(5.9,-33.15,9.2,-20.8),[[-.109,0,27.158]]));
parts.push(roofed(rect(5.6,-28.0,12.75,-18.4),[[0,1.856,70.691],[0,-1.746,-18.252],[-3.02,0,58.526]]));
parts.push(roofed(rect(-10.85,-27.85,-5.3,-20.7),[[.066,1.452,57.446],[.045,-1.435,-13.161],[2.161,0,40.795]]));
parts.push(roofed(rect(-6.15,-16.6,6.1,13.9),[[1.122,.014,32.251],[-1.109,-.047,32.095]])); parts.push(roofed(rect(-5.4,-33.45,6.1,-16.5),[[1.929,-.021,34.419],[-1.882,.02,36.702],[.011,2.601,111.502]])); // Noordportaal, schilddak en spitse gevel, traptoren naast het transept.
parts.push(roofed(rect(-15,14.35,-9.1,19.55),[[2.1,-.046,50.272],[-2.071,-.093,-.313],[0,-.8,39.8]]));
parts.push(prism(circle([5.6,14.5],1.45,8,Math.PI/8),BASE,nap(27.4)),spire([5.6,14.5],1.45,nap(27.4),nap(31),8));
// Hoog koor: schildkap met dakruiter, geen kunstmatige langsnok tot aan de apsis.

// Kapellen langs het koor, vijf dwarse kappen per zijde.
// Afzonderlijke koorkapellen: convex grondvlak uit bijbehorende LoD2.2-dakvlakken.
parts.push(roofed([[7.054, -16.535], [6.954, -16.467], [6.871, -15.036], [6.48, -8.324], [6.68, -7.552], [8.099, -7.424], [9.787, -7.441], [10.166, -9.251], [10.794, -14.421], [9.373, -15.863]],[[2.5785, 0.1507, 11.5435], [-1.9659, -0.2379, 44.7506], [0.4663, 2.7572, 65.2444]]));
parts.push(roofed([[12.257, -15.759], [12.107, -15.106], [10.899, -9.837], [10.406, -7.687], [10.665, -7.449], [12.534, -7.466], [14.97, -7.49], [16.909, -13.87], [16.045, -15.378]],[[1.8531, 0.427, 10.965], [-1.6778, -0.5073, 48.2448], [-0.3354, 2.7356, 72.9059]]));
parts.push(roofed([[18.544, -13.999], [15.707, -7.978], [19.437, -5.233], [19.595, -5.361], [20.071, -5.744], [20.735, -6.914], [23.038, -11.601]],[[1.5912, 0.754, 7.9448], [-1.5551, -0.8398, 52.9454]]));
parts.push(roofed([[24.546, -10.154], [20.735, -6.914], [20.285, -6.532], [19.935, -5.888], [20.591, -4.384], [20.735, -4.277], [22.192, -3.258], [22.781, -3.281], [26.314, -5.027], [26.62, -6.078], [26.825, -6.786], [25.431, -9.388]],[[1.2418, 1.4706, 11.3007], [-0.8084, -1.6195, 39.9689], [-2.5068, 1.3386, 103.1578]]));
parts.push(roofed([[28.006, -3.482], [20.154, -3.18], [18.595, -0.902], [17.658, 0.738], [18.837, 1.232], [18.942, 1.24], [27.109, 1.816], [27.979, 1.812], [28.003, -2.879]],[[0.059, 1.7419, 31.2359], [0.1203, -1.8224, 26.879], [-2.2858, -0.0113, 90.798]]));
parts.push(roofed([[9.547, 5.59], [5.759, 5.724], [5.543, 11.312], [5.524, 11.813], [5.545, 13.599], [9.091, 13.448], [10.009, 12.633]],[[1.833, -0.0281, 16.9839], [-1.6907, 0.1078, 42.534], [-0.1446, -2.9085, 66.9533]]));
parts.push(roofed([[14.727, 5.38], [10.019, 5.71], [11.32, 12.56], [16.321, 12.281]],[[1.5562, -0.2969, 13.0743], [-1.4741, 0.3389, 46.8186]]));
parts.push(roofed([[18.96, 3.887], [16.327, 5.038], [15.34, 5.928], [17.702, 11.933], [17.815, 12.197], [22.253, 11.543], [23.169, 11.075], [19.386, 3.907]],[[1.5575, -0.6154, 6.6845], [-1.7164, 0.8043, 57.3709]]));
parts.push(roofed([[19.951, 2.221], [21.196, 6.093], [21.968, 6.719], [25.028, 8.517], [25.858, 7.143], [26.17, 3.441], [24.526, 2.694]],[[1.148, -1.4263, 11.2374], [-0.7956, 1.7345, 41.6913]]));
parts.push(roofed([[7.86, -6.46], [5.345, -2.967], [5.359, -1.793], [5.397, 1.254], [6.616, 4.608], [16.399, 4.974], [18.737, 2.865], [20.436, -0.871], [20.154, -3.18], [16.889, -6.303]],[[-0.0427, 1.9875, 40.161], [0.0665, -1.9997, 35.7756], [-2.0129, 1.8897, 72.8184], [-1.9131, -2.1117, 68.7964], [1.4286, 1.904, 27.6244], [1.6328, -1.7383, 22.7553]]));
parts.push(prism([[5.2, 13.964], [9.23, 13.792], [10.369, 12.781], [10.034, 7.661], [11.033, 12.926], [16.756, 12.607], [15.567, 7.461], [17.378, 12.067], [17.6, 12.583], [22.36, 11.881], [23.644, 11.226], [21.157, 6.513], [21.768, 7.008], [25.149, 8.993], [26.2, 7.254], [26.539, 3.224], [24.619, 2.351], [19.591, 1.832], [19.677, 1.643], [27.097, 2.166], [28.328, 2.161], [28.353, -2.877], [28.357, -3.846], [24.407, -3.694], [26.607, -4.781], [26.956, -5.98], [27.201, -6.826], [25.709, -9.61], [24.548, -10.615], [21.793, -8.273], [23.502, -11.751], [18.384, -14.481], [15.782, -8.959], [17.288, -13.913], [16.26, -15.708], [11.985, -16.138], [11.766, -15.184], [10.646, -10.301], [11.162, -14.547], [9.558, -16.174], [6.993, -16.917], [6.615, -16.659], [6.521, -15.056], [6.127, -8.29], [6.403, -7.226], [8.085, -7.074], [10.072, -7.093], [10.147, -7.449], [10.531, -7.097], [12.537, -7.116], [15.23, -7.142], [15.416, -7.757], [16.917, -6.653], [7.683, -6.813], [4.994, -3.078], [5.009, -1.789], [5.047, 1.318], [6.368, 4.949], [12.561, 5.181], [9.883, 5.369], [9.874, 5.228], [5.422, 5.386], [5.193, 11.299], [5.174, 11.809], [5.2, 13.964]],BASE,nap(26.6)));
// Oostelijke veelhoekige koorsluiting met echte schuine dakvlakken.
const apse=[[29.5,-6.4],[38.35,-6.26],[41.67,-3.16],[41.98,1.43],[38.96,5],[34.1,5.61],[30.38,4.3]];
parts.push(roofed(apse,[[.087,1.822,33.285],[.111,-1.84,30.437],[-2.813,.04,142.934],[-1.795,1.67,105.013],[-1.739,-1.649,100.685]]));
// Librije: lage veelhoekige aanbouw langs de zuidelijke kooromgang.
parts.push(roofed([[17.8,-15.7],[22,-22.6],[26.6,-20.5],[32.8,-14.9],[34.8,-11.2],[34.1,-7.9],[29.5,-6.4],[17.8,-7.5]],[[.846,-1.487,-23.098],[-.804,1.467,66.592],[-1.376,1.02,75.442],[-2.014,-.29,81.984]]));
// Vierkante westtoren met gelede steunberen, achtkant en klokvormige bekroning.
const T=[-30.5,-1.45];
parts.push(box(-36.5,-7.8,BASE,-24.5,5.35,nap(54.4)));
parts.push(prism(circle(T,5.05,8,Math.PI/8),nap(53.9),nap(63.5)));
parts.push(dome(T,[[4.95,nap(62.9)],[5.2,nap(63.8)],[4.4,nap(65.0)],[4.2,nap(66.1)],[3.7,nap(67.2)],[2.65,nap(68.1)]],8).translate([-T[0],-T[1],0]).rotate([0,0,22.5]).translate([T[0],T[1],0]));
parts.push(prism(circle(T,2.65,8,Math.PI/8),nap(67.7),nap(74.2)));
parts.push(dome(T,[[2.65,nap(73.8)],[2.95,nap(74.5)],[.55,nap(77.6)],[.35,nap(78)],[1,nap(79.1)],[.3,nap(80.3)]],8).translate([-T[0],-T[1],0]).rotate([0,0,22.5]).translate([T[0],T[1],0]));
// Steunberen hebben een doorlopende voet en steile afzaten, geen losse platen.
const butt=(x,y,deg,h,depth=1.45)=>hull([[-.52,1,BASE],[.52,1,BASE],[-.52,-depth,BASE],[.52,-depth,BASE],[-.52,1,nap(h)],[.52,1,nap(h)],[-.52,-depth,nap(h-3)],[.52,-depth,nap(h-3)]]).rotate([0,0,deg]).translate([x,y,0]);
for(const x of [-35.4,-29.6,-24.4,-19.5,-14.6,-9.6]){
 for(const [y,d]of [[-16.3,0],[14.35,180]]){parts.push(butt(x,y,d,27.7));parts.push(prism(circle([x,y],.67,4,Math.PI/4),BASE,nap(29.3)),spire([x,y],.67,nap(29.3),nap(32),4,Math.PI/4));}
}
for(const [x,y,d]of [[-6.0,31,180],[4.7,31,180],[-5.0,-33,0],[5.5,-33,0],[17.5,14,180],[24.8,9.6,225],[38.7,5.0,225],[42,1.4,270],[41.7,-3.2,315],[38.4,-6.2,0]])parts.push(butt(x,y,d,28.3,1.1));
for(const x of [-36.1,-25.0])for(const y of [-7.3,4.9]){
 const dir=Math.atan2(y-T[1],x-T[0])*180/Math.PI+90;parts.push(butt(x,y,dir,53.2,1.4));
 parts.push(prism(circle([x,y],.75,4,Math.PI/4),BASE,nap(55.3)),spire([x,y],.75,nap(55.3),nap(58.5),4,Math.PI/4));
}
// Gesloten balustradebanden en blind maaswerk: minimum wand 0,95 m.
for(const [y,z]of [[-16.25,27.8],[14.3,28.4]])parts.push(box(-35.8,y-.48,BASE,-5.7,y+.48,nap(z+1.05)));
parts.push(roofed(rect(-15,18.6,-9.1,19.55),ridgeX(-12.05,26.4,1.1)));
// Koorruiter: achthoekige gesloten lantaarn met spits en steunbaar profiel.
parts.push(prism(circle([12,-1.05],1.45,8),BASE,nap(44.2)),spire([12,-1.05],1.45,nap(44.2),nap(48.0),8,0));
function niche(x,y,d,w,z0,z1){return Manifold.extrude([[[-w/2,nap(z0)],[w/2,nap(z0)],[w/2,nap(z1)],[0,nap(z1)+w*.68],[-w/2,nap(z1)]]],.55).rotate([90,0,0]).translate([0,.35,0]).rotate([0,0,d]).translate([x,y,0]);}
for(const x of [-32.3,-27,-21.9,-17,-12]){cuts.push(niche(x,-16.3,0,3.6,13.3,23)); if(x!==-12)cuts.push(niche(x,14.35,180,3.6,13.3,23));}
cuts.push(niche(-12.1,19.55,180,3.6,10.5,18.0)); for(const [x,y,d]of [[.2,31.1,180],[.4,-33.35,0]])cuts.push(niche(x,y,d,4.5,13,23));
for(const [x,y,d]of [[-36.5,-1.4,270],[-30.5,-7.8,0],[-30.5,5.35,180],[-24.5,-1.4,90]])for(const z of [35,43.5])for(const dx of [-2,2]){
 const a=d*Math.PI/180;cuts.push(niche(x+dx*Math.cos(a),y+dx*Math.sin(a),d,2.1,z,z+5.0));
}
for(let k=0;k<8;k++){const a=k*Math.PI/4,r=2.65*Math.cos(Math.PI/8);cuts.push(niche(T[0]+r*Math.cos(a),T[1]+r*Math.sin(a),90+a*180/Math.PI,1.1,69,72.8));}
// Koorramen en gesloten balustrades volgen de werkelijke schuine gevelranden.
for(let i=0;i<FOOT.length;i++){
 const a=FOOT[i],b=FOOT[(i+1)%FOOT.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;
 if(x<6||len<3||y<-7.5)continue;
 const deg=Math.atan2(dy,dx)*180/Math.PI,nx=-dy/len*.96,ny=dx/len*.96;
 cuts.push(niche(x,y,deg,Math.min(3.8,len-1),13.3,23.5));
 parts.push(prism([a,b,[b[0]+nx,b[1]+ny],[a[0]+nx,a[1]+ny]],BASE,nap(28.4)));
}
const solid=union(parts).intersect(footprint).subtract(union(cuts));
if(solid.decompose().length!==1||solid.genus()!==0)throw new Error('Eén gesloten kerkvolume zonder interne gaten vereist: '+solid.genus());
console.log('overhang-vlakken',JSON.stringify(downFaces(solid,BASE)));
await writeLandmark({slug:SLUG,nodes:[['building:kerk',solid]],base:BASE,catalog:{
 name:'Walburgiskerk',origin:ORIGIN,xAxis:[Math.cos(ANGLE),Math.sin(ANGLE)],groundOffsetMetres:-.3,groundHeight:52.968301959211026,
 groundSamplePoints:[[-41,-1],[0,-38],[-19,20]],replacesBuildings:['NL.IMBAG.Pand.0301100000003887'],
 description:'Drie langsdaken met westelijke schilden, transept, hoog koor met dakruiter, dwarse koorkapellen en polygonale koorsluiting, Librije, noordportaal en zuidelijke aanbouwen; vierkante toren met achtkant, klokvormige kap en gesloten lantaarn. Steunberen, pinakels, balustradebanden en blinde vensternissen. Dakvlakken uit BAG/AHN/3D BAG.',
 realWorld:{groundNapM:GROUND_NAP,naveRidgeNapM:35.6,northAisleRidgeNapM:33.39,southAisleRidgeNapM:32.78,choirRidgeNapM:38.65,towerRoofTipNapM:80.3,choirTurretTipNapM:48,roofAxisDegrees:-16,minimumFreeStandingM:.95},
 sources:['https://service.pdok.nl/lv/bag/wfs/v2_0','https://service.pdok.nl/rws/ahn/wcs/v1_0','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0301100000003887','https://monumentenregister.cultureelerfgoed.nl/monumenten/41195','https://walburgiskerk.nl/','https://commons.wikimedia.org/wiki/File:Zutphen_Walburgiskirche.jpg','https://commons.wikimedia.org/wiki/File:Dak_van_de_St._Walburgskerk_te_Zutphen_gezien_vanaf_de_toren_-_Zutphen_-_20226815_-_RCE.jpg','https://commons.wikimedia.org/wiki/File:Het_koor_van_de_St._Walburgskerk_te_Zutphen_gezien_vanuit_het_noorden_-_Zutphen_-_20226529_-_RCE.jpg']
}});
