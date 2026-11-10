// Stadsschouwburg Amsterdam; gebouwstelsel volgens nokken, 37 graden RD.
import {Manifold,CrossSection,ccw,prism,box,hull,union,spire,writeLandmark,downFaces} from './efteling-kit.mjs';
const O=[120600,486350],X=[Math.cos(37*Math.PI/180),Math.sin(37*Math.PI/180)],G=1.269,B=-.5,Z=n=>n-G;
const foot=[[39.7,10.8],[39.6,26.7],[31.6,26.7],[31.6,29.6],[30.6,29.6],[30.9,54.8],[14.5,54.8],[14.4,78.5],[5.3,78.8],[5.4,59.4],[4.2,59.4],[4.1,75.7],[.7,75.7],[.7,77.3],[-6.7,76.6],[-6.8,79],[-17.7,79.3],[-15.9,61.3],[-13.6,59.2],[-1,59.3],[-1,54.7],[-14.1,54.7],[-13.6,29.5],[-14.5,29.5],[-13.8,22.8],[-14.4,5.5],[-10.9,5.5],[-11.1,2.8],[-7.2,-1.2],[-4.4,-.9],[-4.4,-5.9],[15.5,-5.3],[15.7,-6],[21.7,-5.8],[21.7,-.8],[24.5,-1],[28.4,2.9],[28.1,5.7],[31.6,5.7],[31.6,10.7]];
const rabo=[[17,98.5],[17.3,88.9],[27,89.5],[27,78.2],[14.3,78.5],[14.4,54.7],[31.3,54.9],[30.7,98.5]];
const hipped=(x0,y0,x1,y1,e,r,h)=>hull([[x0,y0,Z(e)],[x1,y0,Z(e)],[x1,y1,Z(e)],[x0,y1,Z(e)],[(x0+x1)/2,y0+h,Z(r)],[(x0+x1)/2,y1-h,Z(r)]]);
const parts=[prism(foot,B,Z(14.3)),prism(rabo,B,Z(19.9)),
// voorbouw, met symmetrische zijkappen
box(-13.6,5.5,B,30,29.5,Z(20.9)),box(-4.5,0,B,22,29.5,Z(21.8)),
hipped(-4.5,5.5,21.7,29.5,21.8,28.5,8),
box(-13.6,29.5,B,-4.7,54.7,Z(16.9)),box(21.5,29.5,B,30,54.7,Z(16.9)),
// Zadeldak van zaal met goten NAP +27.5 en nok +33.6
box(-4.8,28.5,B,21.5,49.1,Z(27.5)),
hull([[-4.8,28.5,Z(27.5)],[21.5,28.5,Z(27.5)],[-4.8,49.1,Z(27.5)],[21.5,49.1,Z(27.5)],[8.35,28.5,Z(33.6)],[8.35,49.1,Z(33.6)]]),
// Toneeltoren en achterbouw met afzonderlijke hellende dakvlakken
box(-1.9,49.1,B,27.2,54.8,Z(35.3)),box(-1.0,54.7,B,14.4,75.8,Z(29.4)),
hull([[5.4,54.7,B],[27.2,54.7,B],[5.4,74.1,B],[27.2,74.1,B],[5.4,54.7,Z(37.2)],[27.2,54.7,Z(37.2)],[5.4,74.1,Z(35.1)],[27.2,74.1,Z(35.1)]]),
box(-17.6,59.2,B,-6.7,79,Z(22)),box(-6.7,59.2,B,-1,76,Z(26.5)),
// Rabozaal: schuin dak, laag glazen sokkelvolume vult uitkraging tot beneden.
hull([[14.4,54.7,B],[27.2,54.7,B],[14.4,74.1,B],[27.2,74.1,B],[14.4,54.7,Z(37.2)],[27.2,54.7,Z(37.2)],[14.4,74.1,Z(35.1)],[27.2,74.1,Z(35.1)]]),
box(14.4,74.1,B,27,78.5,Z(32.1)), box(26.1,78.5,B,27,89.5,Z(31.8)),box(17.3,88.6,B,27,89.5,Z(31.8))];
// Dakkapellen op zijvleugels; uit ortho en opstandfoto's.
for(const x of [-10.1,26.1]) for(const y of [11,19,26]){
 parts.push(box(x-1.05,y-1.2,B,x+1.05,y+1.2,Z(22.6)));
 parts.push(hull([[x-1.05,y-1.2,Z(22.5)],[x+1.05,y-1.2,Z(22.5)],[x+1.05,y+1.2,Z(22.5)],[x-1.05,y+1.2,Z(22.5)],[x,y-1.2,Z(23.8)],[x,y+1.2,Z(23.8)]]));
}
// Vier torens met steile vierzijdige bekroning; lamp en ornament worden vereenvoudigd.
for(const [x,y,w,eave,tip,lantern] of [[-1.6,-1.8,5.8,20.9,27.8,29.7],[19.5,-1.8,5.8,20.9,28.1,30.5],[-11,6.6,4.4,17.2,24.5,25.3],[28.2,6.6,4.4,17.2,25.7,26.3]]){
 const t=1.6;
 parts.push(box(x-w/2,y-w/2,B,x+w/2,y+w/2,Z(eave)));
 // Vier dakvlakken eindigen in een kleine lantaarn; geen open bogen op 1:1000.
 parts.push(hull([[x-w/2,y-w/2,Z(eave-.1)],[x+w/2,y-w/2,Z(eave-.1)],[x+w/2,y+w/2,Z(eave-.1)],[x-w/2,y+w/2,Z(eave-.1)],[x-t/2,y-t/2,Z(tip)],[x+t/2,y-t/2,Z(tip)],[x+t/2,y+t/2,Z(tip)],[x-t/2,y+t/2,Z(tip)]]));
 parts.push(box(x-t/2,y-t/2,B,x+t/2,y+t/2,Z(lantern)));
 parts.push(hull([[x-t/2,y-t/2,Z(lantern-.1)],[x+t/2,y-t/2,Z(lantern-.1)],[x+t/2,y+t/2,Z(lantern-.1)],[x-t/2,y+t/2,Z(lantern-.1)],[x,y,Z(lantern+.8)]]));
}// Doorlopende pilasters in het ritme van de plein- en zijgevels; reliëf 0,3 m.
for(const x of [-.4,5.05,10.55,16.05]){
 const y=-5.9+(x+4.4)*.6/19.9;
 parts.push(box(x-.45,y-.28,B,x+.45,y+.2,Z(17)));
}
for(const y of [9,13,17,21,25,29]){
 parts.push(box(-13.9,y-.45,B,-13.35,y+.45,Z(16)));
 parts.push(box(29.75,y-.45,B,30.3,y+.45,Z(16)));
}
let body=union(parts);
// Westelijke toneeldakhelft: 3D BAG vlak 414,8 m², met AHN gecontroleerd.
const toneelWest=[[-1,54.7],[5.4,54.7],[5.4,59.4],[4.2,59.4],[4.1,71.8],[-6.4,71.0],[-6.3,69.8],[-6.6,68.3],[-2.4,68.2],[-2.4,67.6],[-1.6,67.1],[-2.3,62.5],[-2.2,59.3],[-1,59.3]];
const roofSlope=-2.1/19.4, roofC=Z(37.2)-roofSlope*54.7, roofNormal=Math.hypot(roofSlope,1);
body=union([body,prism(toneelWest,B,Z(40)).trimByPlane([0,roofSlope/roofNormal,-1/roofNormal],-roofC/roofNormal)]);
// Achterste dakstrook is volgens AHN vlak op NAP +35,4 m (y 70..75,6).
body=union([body,prism([[-6.4,70],[5.4,70],[5.3,75.7],[-6.4,75.6]],B,Z(35.4))]);
// De pleinvensters als zeer ondiepe nissen met een spits, passend bij de gevelritmiek.
const openings=[];
for(const x of [2.3,7.8,13.3]) for(const z of [1.2,8]) {
 const y=-5.9+(x+4.4)*.6/19.9, w=3.1, h=(z<3?4.5:6.2);
 openings.push(hull([[x-w/2,y-.4,z],[x+w/2,y-.4,z],[x-w/2,y+.18,z],[x+w/2,y+.18,z],[x-w/2,y-.4,z+h-1.8],[x+w/2,y-.4,z+h-1.8],[x-w/2,y+.18,z+h-1.8],[x+w/2,y+.18,z+h-1.8],[x,y-.4,z+h],[x,y+.18,z+h]]));
}
// Hoge venstertraveeen in beide historische zijvleugels, als blinde nissen.
// De spitse bovenzijde voorkomt steun in de volledige export op 1:1000.
for(const side of [-1,1]) for(const y of [11,15,19,23,27]) {
 const z=7.0,h=7.4,lo=side<0?-14.0:29.65,hi=side<0?-13.25:30.45,w=2.1;
 openings.push(hull([[lo,y-w/2,z],[hi,y-w/2,z],[lo,y+w/2,z],[hi,y+w/2,z],
  [lo,y-w/2,z+h-1.3],[hi,y-w/2,z+h-1.3],[lo,y+w/2,z+h-1.3],[hi,y+w/2,z+h-1.3],
  [lo,y,z+h],[hi,y,z+h]]));
}
// Vensters beneden in de Marnixstraatvleugel volgen de schuine BAG-gevel.
for(const y of [11,15,19,23,27]){
 const face=y<=22.8?-14.4+(y-5.5)*.6/17.3:-13.8-(y-22.8)*.7/6.7;
 const x0=face-.3,x1=face+.4,z=1.4,h=3.4,w=1.8;
 openings.push(hull([[x0,y-w/2,z],[x1,y-w/2,z],[x0,y+w/2,z],[x1,y+w/2,z],
  [x0,y-w/2,z+h-1.2],[x1,y-w/2,z+h-1.2],[x0,y+w/2,z+h-1.2],[x1,y+w/2,z+h-1.2],
  [x0,y,z+h],[x1,y,z+h]]));
}
// Melkweg omvat de Rabozaal en overschrijdt deels de BAG-grens. Zijn twee
// voetpolygonen, omgerekend naar dit stelsel, krijgen 15 cm veiligheidsmarge.
const melkwegFoot=[[-21.503,136.002],[-21.988,128.774],[-21.974,121.568],[-21.169,114.597],[-19.733,100.045],[-7.779,101.368],[-3.297,101.864],[-3.258,100.965],[-1.859,101.026],[-1.09,78.838],[5.221,78.714],[14.339,78.511],[26.966,78.162],[26.972,89.473],[17.29,88.85],[16.862,103.245],[19.26,103.349],[18.906,113.744],[13.907,113.626],[13.029,138.311],[-6.744,137.247]];
const zaalFoot=[[16.97,98.44],[17.29,88.85],[26.97,89.47],[26.97,78.16],[14.34,78.51],[14.47,54.79],[23.49,54.59],[31.28,54.93],[30.78,98.55]];
const cutFoot=poly=>Manifold.extrude(new CrossSection([ccw(poly)]).offset(.15),Z(50)-B+1).translate([0,0,B-1]);
body=body.subtract(union(openings)).subtract(union([cutFoot(melkwegFoot),cutFoot(zaalFoot)]));console.log('status',body.status(),'parts',body.decompose().length,'down',downFaces(body,B));
await writeLandmark({slug:'stadsschouwburg-amsterdam',base:B,nodes:[['building:schouwburg',body]],catalog:{name:'Stadsschouwburg Amsterdam',origin:O,xAxis:X,groundOffsetMetres:-.3,replacesBuildings:['NL.IMBAG.Pand.0363100012168738'],description:'Historische Stadsschouwburg Amsterdam; Rabozaal op aangrenzend BAG-pand wordt door Melkweg-landmark geleverd. Lokaal +Y naar achteren.',realWorld:{groundNapM:G},sources:['https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012168738','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012173457','PDOK AHN DSM 0,5 m en Actueel_orthoHR', 'https://commons.wikimedia.org/wiki/Category:Stadsschouwburg_Amsterdam', 'https://arcam.nl/architectuur-gids/rabozaal-melkweg/']}});















