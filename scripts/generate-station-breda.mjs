// Station Breda: architectonische dakprofielen en bouwdelen; geen hoogtelagen.
import {Manifold,prism,box,hull,ring3,rect,union,writeLandmark} from './efteling-kit.mjs';
const O=[112895.35854881468,400925.37260406057],A=[0.996917333733128,0.07845909572784494],G=2.3,BASE=-1,at=n=>n-G,FOOT=[[123.076,45.395],[124.129,88.192],[91.912,88.681],[82.097,88.498],[76.679,88.266],[71.865,88.019],[64.585,87.543],[47.411,85.946],[41.929,85.268],[35.345,84.382],[28.966,83.419],[28.643,83.366],[28.873,93.642],[29.025,99.74],[27.007,99.879],[26.981,101.899],[23.331,101.904],[19.714,101.917],[16.096,101.857],[12.481,101.722],[8.869,101.512],[5.262,101.231],[0.873,100.774],[-3.505,100.206],[-7.866,99.528],[-12.209,98.74],[-16.531,97.842],[-20.828,96.836],[-25.099,95.721],[-28.113,94.856],[-31.111,93.936],[-34.093,92.964],[-37.056,91.939],[-40.001,90.863],[-42.137,90.039],[-44.626,89.043],[-47.083,88.017],[-48.632,87.343],[-49.881,86.814],[-51.133,86.29],[-52.389,85.775],[-53.648,85.268],[-54.91,84.769],[-55.978,84.351],[-57.05,83.945],[-58.127,83.552],[-59.209,83.169],[-60.294,82.799],[-59.674,80.849],[-61.718,80.9],[-61.889,74.174],[-61.9,73.718],[-61.894,73.65],[-62.099,64.361],[-67.008,63.644],[-71.663,63.022],[-76.325,62.454],[-80.993,61.94],[-85.667,61.478],[-88.369,61.221],[-91.072,60.989],[-93.778,60.781],[-96.484,60.598],[-99.193,60.439],[-103.408,60.163],[-107.625,59.936],[-111.844,59.759],[-116.065,59.632],[-120.287,59.554],[-123.494,59.526],[-125.177,59.549],[-137.403,59.673],[-154.535,60.097],[-154.732,51.864],[-155.335,27.505],[-155.349,27.027],[-155.698,10.325],[-99.889,8.972],[-101.009,-37.369],[-101.471,-55.399],[-101.581,-59.94],[-101.732,-66.202],[-102.5,-99.045],[-72.97,-99.116],[-48.974,-99.134],[-47.936,-99.131],[-26.774,-99.145],[-19.777,-99.187],[-2.559,-99.204],[18.382,-99.243],[19.204,-99.225],[40.922,-99.191],[41.887,-99.236],[88.163,-99.227],[88.983,-64.49],[89.824,-29.277],[120.46,-30.111],[121.257,3.101],[156.903,2.13],[157.131,10.952],[157.183,11.916],[156.113,12.124],[143.995,14.378],[141.974,14.754],[131.85,16.637],[131.421,16.716],[127.975,17.388],[127.125,17.692],[126.319,18.095],[125.567,18.594],[124.881,19.179],[124.27,19.843],[123.744,20.576],[123.311,21.367],[122.977,22.205],[122.745,23.077],[122.694,23.321],[122.65,23.565],[122.613,23.811],[122.582,24.058],[122.558,24.306],[123.076,45.395]];
// Het lagere parkeerdek boven sporen en perrons, met de brede noordwestelijke uitloper.
const deckFoot=[[-102,-67],[94,-67],[94,-28],[122,-28],[122,16],[157,16],[157,26],[123,27],[122,57],[-154,61],[-155,11],[-102,11]];
const deck=prism(deckFoot,BASE,at(19.64));
const blocks=[];const block=(x0,y0,x1,y1,top=23.45)=>blocks.push(box(x0,y0,BASE,x1,y1,at(top)));
// Kantoorstrook aan de noordzijde en de haaks daarop gerichte woonstroken.
block(-154,34,123,57,23.4);block(14,57,45,89,23.55);block(69,56,94,90,22.9);
// Dakplateaus boven de perronhal: geen zwevende dakplaten.
for(const x of[-101,-47,-16,32,91])block(x,-67,x+3.3,35,23.55);
block(-101,-67,-49,-57,23.55);block(-101,-57,-90,12,23.55);
block(-49,-21,-12,-13,23.55);block(-49,-5,-12,4,23.55);
block(91,-28,123,-17,23.45);
// Zuidelijke woonhoven: drie losse U-vormen rond open pleinen, verbonden via de hal.
for(const [l,r] of[[-102,-49],[-48,-13],[-5,94]]){
 block(l,-99,l+10,-64);block(r-10,-99,r,-64);block(l,-75,r,-64);
}
let body=union([deck,...blocks,prism(FOOT,BASE,-.1)]);
const cut=[];
// Negen structureel beglaasde daklichten, met 45-graden gesloten verdiepingen.
for(const [x,w]of[[-143,5],[-123,12],[-105,5],[-87,5],[-69,5],[-51,5],[-33,5],[-15,5],[3,5]]){
 const p=rect(x-w/2,39,x+w/2,51),q=rect(x-w/2+1.8,40.8,x+w/2-1.8,49.2);
 cut.push(hull([...ring3(p,at(24)),...ring3(q,at(22.2))]));
}
// Twee langgerekte binnenhoven aan de noordzijde; wanden gesloten naar beneden.
for(const [x0,y0,x1,y1,top]of[[23,59,37,86,23.55],[75,59,86,85,22.9]])cut.push(hull([...ring3(rect(x0,y0,x1,y1),at(top+.3)),...ring3(rect(x0+4.5,y0+4.5,x1-4.5,y1-4.5),at(top-4.2))]));
// Lichtsleuven tussen parkeerbanen, brede taluds sluiten de uitsparingen af.
for(const [x0,y0,x1,y1]of[[-85,-52,-57,-44],[-84,-10,-56,-2],[-7,-51,29,-42],[42,-52,80,-43],[42,-17,80,-9],[-6,-5,27,3],[-86,20,-54,28]])cut.push(hull([...ring3(rect(x0,y0,x1,y1),at(19.9)),...ring3(rect(x0+2.5,y0+2.5,x1-2.5,y1-2.5),at(17.4))]));
body=body.subtract(union(cut));
// Blinde raamvelden en glazen halgevels; dikke penanten blijven dragend.
const niches=[];for(const [y,x0,x1]of[[57,-150,120],[-67,-99,90],[-99,-102,94]])for(let x=x0+1.5;x<x1-2;x+=4.6)for(let z=4.1;z<19;z+=3.4)niches.push(box(x,y-.24,z,x+3.2,y+.24,z+2.35));
for(const x of[-102,94,123])for(let y=-62;y<30;y+=6)niches.push(box(x-.25,y,1.8,x+.25,y+4.6,at(17.8)));
body=body.subtract(union(niches)).decompose().sort((a,b)=>b.volume()-a.volume())[0];
// Dakranden en lage parkeerbaanseparaties; geen auto's, draden of los hekwerk.
const rims=[];for(const x of[-99,-45,-14,34,89])rims.push(box(x,-62,at(19.5),x+.95,29,at(20.5)));
for(const y of[-65,33])rims.push(box(-100,y,at(19.5),94,y+.95,at(20.5)));
// Dakinstallaties op de oostelijke en zuidelijke kopvolumes, gemeten in DSM.
for(const [x,y,w,h]of[[111,-20,8,6],[-91,-68,4,4],[84,-68,4,4]])rims.push(box(x-w/2,y-h/2,at(23.2),x+w/2,y+h/2,at(24.2)));
body=union([body,...rims]).intersect(prism(FOOT,BASE,50));if(body.status()!=='NoError'||body.decompose().length!==1)throw Error('station niet verbonden');
await writeLandmark({slug:'station-breda',base:BASE,nodes:[['building:station',body]],catalog:{name:'Station Breda',origin:O,xAxis:A,groundOffsetMetres:-.3,groundSamplePoints:[[-70,-106],[-25,-106],[65,-106]],replacesBuildings:['NL.IMBAG.Pand.0758100000101539'],description:'Volledige OV-terminal van Koen van Velsen: lagere perronhal met parkeerdek, hogere kantoor- en woonstroken, drie zuidelijke woonhoven, twee noordhoven en negen glazen daklichten. Gesloten volumes en 45-graden binnenprofielen voor de dakuitsparingen, raamvelden en installaties. Ondergrondse BAG-uitlopers verborgen onder straatniveau; +X RD 4,5 graden, z=0 NAP +2,3 m.',realWorld:{groundNapM:G,parkingRoofNapM:19.64,northRoofNapM:23.4,higherStripsNapM:23.55,eastRoofNapM:22.9,installationNapM:24.2},sources:['PDOK BAG/BGT 0758100000101539, AHN DSM/DTM 0,5 m en ortho, 11 oktober 2026','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000101539','https://koenvanvelsen.com/nl/projects/87/treinstation-breda','https://www.octatube.nl/nl_NL/project-item.html/projectitem/105','https://commons.wikimedia.org/wiki/Category:Breda_station_(2014)']}});

