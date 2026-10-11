// Broederpoort: benoemde prisma's, vier dakvlakken en zes-/tienkante spitsen.
import{Manifold,box,prism,circle,hull,ring3,union,place,hipRoof,writeLandmark}from'./efteling-kit.mjs';
const O=[190564.99,507882.26],q=Math.hypot(.5077,-.8615),A=[.5077/q,-.8615/q],BASE=-.3;
const G={halfWidth:6.04,parkY:-5.02,cityY:3.91,eave:9.29,ridge:18.02,gateHalf:2.6,spring:1.35,apex:5.07};
const polygonFr=(c,r0,r1,z0,z1,n,phase=0)=>hull([...ring3(circle(c,r0,n,phase),z0),...ring3(circle(c,r1,n,phase),z1)]);
const pointed=(y0,y1,w,spring,top)=>hull([[-w/2,y0,BASE-.2],[w/2,y0,BASE-.2],[-w/2,y1,BASE-.2],[w/2,y1,BASE-.2],[-w/2,y0,spring],[w/2,y0,spring],[-w/2,y1,spring],[w/2,y1,spring],[0,y0,top],[0,y1,top]]);
const tunnel=pointed(-6,5,5.2,G.spring,G.apex);
let core=box(-6.04,G.parkY,BASE,6.04,G.cityY,G.eave).subtract(tunnel);
// Brede ronde parkmond als ondiepe nis; de spitse tunnel daarachter blijft printbaar.
const mouth=union([box(-2.95,-5.35,BASE-.1,2.95,-4.67,2.12),Manifold.cylinder(.68,2.95,2.95,64).rotate([90,0,0]).translate([0,-4.67,2.12])]);core=core.subtract(mouth);
const frontCuts=[];for(const x of[-3.3,0,3.3])frontCuts.push(box(x-1.15,3.56,6.3,x+1.15,4.2,8.9));for(const x of[-2,2])frontCuts.push(box(x-.65,-5.4,6.5,x+.65,-4.67,8.5));
for(const x of[-6.04,6.04])for(const y of[-2.9,0,2.5])frontCuts.push(box(x-.36,y-.55,6.5,x+.36,y+.55,8.5));core=core.subtract(union(frontCuts));
// Naturstenen kroonlijst loopt op een schuine, aan de muur gehechte kraag.
const cornice=polygonFr([0,-.555],7,7.35,8.95,9.3,4,Math.PI/4).intersect(box(-6.4,-5.4,8.94,6.4,4.29,9.31));core=union([core,cornice.subtract(tunnel),box(-.7,3.72,5.5,.7,4.18,6.4)]);
let roof=hipRoof(12.08,8.93,G.eave,G.ridge,2.0).translate([0,-.555,0]);
const dormer=(x,y,z,s)=>{let d=union([box(x-.6,y-1,z,x+.6,y+1,z+1.1),hull([[x-.7,y-1.05,z+1.1],[x+.7,y-1.05,z+1.1],[x-.7,y+1.05,z+1.1],[x+.7,y+1.05,z+1.1],[x,y-1.05,z+1.8],[x,y+1.05,z+1.8]])]);return d.subtract(box(x-.45,y+s*.95-.4,z+.2,x+.45,y+s*.95+.4,z+1.1));};
roof=union([roof,dormer(0,-3.3,12.2,-1),...[-2.6,2.6].map(x=>dormer(x,2.75,12.5,1)),...[-1.55,1.55].map(x=>dormer(x,1.35,15.0,1))]);
// Renaissance-topgevel: rolwerk grof als gelobde vlakken, treden minstens 0,9 m.
const gp=[[-3.35,9.25],[3.35,9.25],[3.35,10.5],[2.75,11.45],[2.05,12.45],[2.75,13.3],[2.75,14.2],[1.85,14.2],[1.85,15.35],[1.15,15.35],[1.15,16.5],[.5,16.5],[.5,17.55],[-.5,17.55],[-.5,16.5],[-1.15,16.5],[-1.15,15.35],[-1.85,15.35],[-1.85,14.2],[-2.75,14.2],[-2.75,13.3],[-2.05,12.45],[-2.75,11.45],[-3.35,10.5]];
let gable=prism(gp,0,.9).rotate([90,0,0]).translate([0,4.1,0]);
gable=union([gable,...[-2.55,2.55].map(x=>Manifold.cylinder(.95,.75,.75,32).rotate([90,0,0]).translate([x,4.15,10.35])),...[[2.95,13.7],[2.05,14.7],[1.35,15.85]].map(([w,z])=>box(-w,3.4,z,w,4.2,z+.32))]);
gable=gable.subtract(union([-1.05,1.05].map(x=>union([box(x-.6,3.8,9.6,x+.6,4.4,10.9),Manifold.cylinder(.6,.6,.6,32).rotate([90,0,0]).translate([x,4.4,10.9])]))).add(Manifold.cylinder(.7,.45,.45,24).rotate([90,0,0]).translate([0,4.2,12.8])));
const towers=[],spires=[];
for(const [x,y,r,n,wallTop,peak]of[[-5.7,-3.94,2.89,6,13.44,23.66],[5.7,-3.94,2.89,6,13.44,23.55],[-5.66,3.84,1.96,10,13.12,23.19],[5.62,3.92,1.91,10,13.12,23.00]]){
 let t=y<0?prism(circle([x,y],r,n,Math.PI/6),BASE,wallTop):union([prism(circle([x,y],r,48),BASE,6.1),polygonFr([x,y],r,2.3,5.95,6.65,10,Math.PI/10),prism(circle([x,y],2.3,10,Math.PI/10),6.6,wallTop)]);
 const tc=[];for(const deg of[0,90,180,270])for(const z of[6.85,10.6])tc.push(place(box(r-.4,-.55,z,r+.65,.55,z+1.9),{deg,at:[x,y,0]}));if(y>0)tc.push(box(x-.55,y+r-.4,BASE-.1,x+.55,y+r+.5,2.5));t=t.subtract(union(tc));
 const sr=y<0?3.1:2.55;let s=union([polygonFr([x,y],sr,sr-.55,wallTop-.05,wallTop+.8,n,Math.PI/n),polygonFr([x,y],sr-.55,.45,wallTop+.8,peak-.45,n,Math.PI/n),Manifold.sphere(.45,20).translate([x,y,peak-.45])]);
 // Dakvenster op iedere buitengerichte torenspits, aan de kern vast.
 const dir=y<0?-1:1,z=17.3,rr=(sr-.55)*(1-(z-wallTop-.8)/(peak-.45-wallTop-.8));const d=union([box(x-.55,y+dir*rr-.8,z,x+.55,y+dir*rr+.8,z+1.1),hull([[x-.65,y+dir*rr-.85,z+1.1],[x+.65,y+dir*rr-.85,z+1.1],[x-.65,y+dir*rr+.85,z+1.1],[x+.65,y+dir*rr+.85,z+1.1],[x,y+dir*rr-.85,z+1.7],[x,y+dir*rr+.85,z+1.7]])]);s=union([s,d]).subtract(box(x-.45,y+dir*(rr+.8)-.35,z+.15,x+.45,y+dir*(rr+.8)+.35,z+1.05));towers.push(t);spires.push(s);
}
await writeLandmark({slug:'broederpoort-kampen',base:BASE,nodes:[['building:poort-torens-daken-en-open-tunnel',union([core,roof,gable,...towers,...spires])]],catalog:{name:'Broederpoort',origin:O,xAxis:A,groundHeight:43.84420087456545,groundOffsetMetres:.23,groundSamplePoints:[[0,-7],[0,6],[-9,0],[9,0]],replacesBuildings:['NL.IMBAG.Pand.0166100000012159'],description:'Vier hoektorens: parkzijde zeszijdig, stadszijde rond met tienzijdige bovenbouw; steil schilddak en renaissance-rolwerk, dakkapellen, spitsen en vensternissen. +Y stad/noordoost. Ronde parkmond ondiep, doorgaande tunnel met printbare spitse kap.',realWorld:{groundNapM:1.55,roofEaveNapM:10.84,roofRidgeNapM:19.57,spireTopNapM:[25.21,25.10,24.74,24.55],gateWidthM:5.2,estimatedGateApexM:5.07,minimumPartM:.9},sources:['https://monumentenregister.cultureelerfgoed.nl/monumenten/23446','https://visitkampen.nl/locaties/de-broederpoort','https://commons.wikimedia.org/wiki/Category:Broederpoort','PDOK BAG/BGT 0166100000012159, AHN DSM/DTM 0,5 m en Actueel_orthoHR, 2026-10-11']}});
