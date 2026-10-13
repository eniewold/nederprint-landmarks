// UNStudio Tower: complete upright main volume, lower north shoulder,
// high crown and installations, continuous white Moire bands and blind voids.
// Example generate-the-rock.mjs; named structural parts, no DSM height slabs.
import {Manifold,CrossSection,prism,rect,box,ccw,union,writeLandmark} from './efteling-kit.mjs';
const slug='unstudio-tower',ORIGIN=[119714,483360],ANGLE=3.2,r=ANGLE*Math.PI/180,AXIS=[Math.cos(r),Math.sin(r)],GROUND=-.6,BASE=-1,z=h=>h-GROUND;
const B=(a,b,c,d,h0,h1)=>box(a,b,z(h0),c,d,z(h1));
const mainPlan=[[-19.926,-19.792],[-2,-20.839],[3.5,-19.86],[8.5,-21.453],[18.91,-22.062],[18.919,13.122],[-19.89,8.186],[-19.9,4],[-18.7,-1.5],[-19.92,-7]],northPlan=[[-19.89,8.186],[18.919,13.122],[18.922,19.701],[-19.883,13.91]];
let main=prism(mainPlan,BASE,z(81.229)),north=prism(northPlan,BASE,z(62.407));
// The original perimeter is straight; its aluminium/glass bands fold inward
// around multi-storey voids. True recesses are filled behind their glazing.
function faceCut(p,a,b,depth=.35){const deg=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;return Manifold.extrude(new CrossSection([ccw(p.map(([u,h])=>[u,z(h)]))]),depth+.5).rotate([90,0,0]).translate([0,depth,0]).rotate([0,0,deg]).translate([a[0],a[1],0]);}
const outer=ccw([[-19.926,-19.792],[-2,-20.839],[3.5,-19.86],[8.5,-21.453],[18.91,-22.062],[18.922,19.701],[-19.883,13.91],[-19.9,4],[-18.7,-1.5],[-19.92,-7]]),cuts=[];
for(let i=0;i<outer.length;i++){
 const a=outer[i],b=outer[(i+1)%outer.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),top=i===5?62.407:81.229;
 for(let h=5.6,row=0;h+2.3<top-1.4;h+=3.75,row++){
  const shift=s=>.65*Math.sin(row*.65)*Math.exp(-Math.pow((s-L*.56)/5.8,2));
  const lower=Array.from({length:13},(_,k)=>{const s=.95+(L-1.9)*k/12;return[s,h+shift(s)];}),upper=lower.slice().reverse().map(([s,hh])=>[s,hh+2.3]);cuts.push(faceCut([...lower,...upper],a,b,.35));
 }
 // Refurbished double-height lobby: broad closed glazing, no open base frame.
 cuts.push(faceCut([[1,.2],[L-1,.2],[L-1,4.2],[1,4.2]],a,b,.55));
}
// Northern upper face is exposed above the lower shoulder and has its own
// regular horizontal glass bands; source orientation follows its oblique plan.
const na=[18.919,13.122],nb=[-19.89,8.186],nL=Math.hypot(nb[0]-na[0],nb[1]-na[1]);
for(let h=64;h+2.3<80;h+=3.75)cuts.push(faceCut([[1,h],[nL-1,h],[nL-1,h+2.3],[1,h+2.3]],na,nb));
// Main south and west atrium/void sequences. Their levels/widths are inferred
// from oblique photographs; broad diagonal shoulder faces remain connected.
const voidCuts=[];
const southA=[-19.926,-19.792],southB=[18.91,-22.062],westA=[-19.883,13.91],westB=[-19.926,-19.792];
function voids(a,b,items){for(const [s,h,w,H]of items){const p=[[s,h],[s+w,h+1.2],[s+w,h+H-1.0],[s+w*.62,h+H],[s,h+H-1.5]];voidCuts.push(faceCut(p,a,b,3.0));}}
voids(southA,southB,[[18.5,9,8,8.5],[17.2,28,9.5,10.0],[18.5,47.5,8.0,10.5],[20,66,6.5,8.5]]);
voids(westA,westB,[[13,12,7.5,8],[15,32,8,10],[13.5,53,7.5,9],[15,70,6,7]]);
// Narrower diagonal glazing next to each void produces the folded band
// silhouette. The 0.35 m details are cut into the same closed structure.
const crownPlan=[[18.919,13.122],[-19.119,8.283],[-19.891,7.484],[-19.894,4.778],[-19.08,4.474],[-19.102,6.661],[17.618,12.104],[18.286,11.877],[18.455,-11.977],[18.911,-11.458]];
const crown=prism(crownPlan,z(81.1),z(82.577));
const roofMachines=prism([[-5.319,3.741],[-5.083,-4.932],[3.946,-5.293],[4.311,3.564],[-2.065,4.055]],z(81.1),z(84.568));
const westMachine=prism([[-10.835,-11.117],[-9.237,-12.958],[-8.137,-11.519],[-9.684,-9.902]],z(81.1),z(84.036));
// Measured thin east roof edge merged into a 1.1 m wide closed crown strip.
const eastEdge=B(17.81,-22.06,18.91,-11.45,81.1,83.503);
let body=union([main,north,crown,roofMachines,westMachine,eastEdge]).subtract(union(voidCuts));
if(body.genus()!==0)throw new Error('The large glazing voids must remain blind');
// At folded corners a strip can intersect another recess from its back side.
// Carve bands individually and retain a closed genus-zero building throughout.
let omittedBands=0;for(const cut of cuts){const candidate=body.subtract(cut);if(candidate.status()==='NoError'&&candidate.genus()===0){body=candidate;}else{candidate.delete();omittedBands++;}}
console.log('Band junctions kept closed',omittedBands);body=Manifold.compose(body.decompose().filter(p=>p.volume()>1e-6));
const local=([x,y])=>[(x-ORIGIN[0])*AXIS[0]+(y-ORIGIN[1])*AXIS[1],-(x-ORIGIN[0])*AXIS[1]+(y-ORIGIN[1])*AXIS[0]];
await writeLandmark({slug,base:BASE,nodes:[['building:unstudio-moire-gevelbanden-atriumvoids-en-noordschouder',body]],catalog:{name:'UNStudio Tower',origin:ORIGIN,xAxis:AXIS,groundHeight:42.369837,groundOffsetMetres:0,groundSamplePoints:[[119716,483335],[119688,483350],[119722,483387]].map(local),replacesBuildings:['NL.IMBAG.Pand.0363100012118868'],description:'Volledige UNStudio Tower met doorgaand recht hoofdvolume, lagere noordschouder, hoge schuine dakrand, gemeten installatiekoppen, witte Moire-gevelbanden met gearticuleerde glasstroken, verspringende meerlaagse blinde atriumvoids en gerenoveerde massieve glaslobby; naburige Mahlergebouwen blijven behouden.',realWorld:{groundNapM:GROUND,axisDegrees:ANGLE,mainRoofNapM:81.229,northShoulderNapM:62.407,crownNapM:82.577,roofMachinesNapM:84.568,westMachineNapM:84.036,eastCrownNapM:83.503,estimates:['Verticale zuid/westglasvouwen circa1.2-1.3m diep uit fotos, afgeronde detailovergangen gefacetteerd','Horizontalelaagsteek3.75m, bandhoogte/welving en.35m blinde glasnissen uit fotos; minimale witte bandcirca1.0m','Zuid- en westvoids: niveau/positie/breedte circa1-2m onzeker, blind tot3.0m diep (circa1.8m achter de gevouwen gevel); interne atria massief voorprint','Bandnissen eindigen .95m voor de hoeken; iedere ingreep houdt het gebouw gesloten met genus0','Dubbelhoge gerenoveerde glasplint.55m blind; entree-interieur niet uitgehold','Gemeten oostdakrand1.1m breed samengevoegd voorprint; kleine middeninstallaties onder.9m en antennes weggelaten','Geen taps gestapelde hoogtelagen of uitgeholde onderste verdieping; afgeronde detailhoeken vereenvoudigd tot doorgaande gevelvlakken']},sources:['https://www.unstudio.com/projects/further/unstudio-tower/ (architect,Moire,banden envoids)','https://www.unstudio.com/projects/further/unstudio-tower-lobby-remodeling/ (architect,lobbyrenovatie2016-2018)','https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012118868 (TU Delft/3DGI CC BY4.0)','https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)','https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)','https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)','https://commons.wikimedia.org/wiki/File:UNStudio_Amsterdam_1.JPG (DennisM CC0)','https://commons.wikimedia.org/wiki/File:UNStudio_Amsterdam_2.JPG (DennisM CC0)','https://commons.wikimedia.org/wiki/File:Amsterdam_-_Mahler_4_UN_Studio_(29669086163).jpg (Fred Romero CC BY2.0)']}});
