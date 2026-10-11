// Nationaal Legermonument: kruis/leeuwen en klok met gebogen achterwand.
import {Manifold,box,rect,prism,ring3,hull,union,writeLandmark} from './efteling-kit.mjs';
const ORIGIN=[169662.8,440773.5],AXIS=[.9734,.2291],BELL=[1.84,-27.55];
const base=box(-3.5,-1.5,0,3.5,1.5,.35),plinth=box(-3,-1,.3,3,1,1.5);
// Kruisarmen met 53 graden afgeschuinde onderzijde; stamdikte minimaal 0,9 m.
const stem=box(-.45,-.45,1.4,.45,.45,6.2);
const arms=union([-1,1].map(s=>hull([[s*.4,-.45,2.95],[s*1.55,-.45,4.4],[s*1.55,-.45,5.3],[s*.4,-.45,5.3],[s*.4,.45,2.95],[s*1.55,.45,4.4],[s*1.55,.45,5.3],[s*.4,.45,5.3]])));
// Leeuwen kijken in tegengestelde richting. Liggende romp en manen sluiten op de sokkel.
const lion=(x,s)=>{const body=hull([...ring3(rect(x-.55,-.85,x+.55,.85),1.45),...ring3(rect(x-.45,-.65,x+.45,.65),2.2)]);const mane=Manifold.sphere(.58,24).scale([1,1,1.2]).translate([x,s*.25,2.25]);const snout=hull([Manifold.sphere(.45,16).translate([x,s*.65,2.3]),Manifold.sphere(.5,16).translate([x,s*.2,2.2])]);const paws=box(x-.5,s>0?.45:-.95,1.45,x+.5,s>0?.95:-.45,1.85);return Manifold.hull([body,mane,snout,paws]);};
const cross=union([base,plinth,stem,arms,lion(-1.8,-1),lion(1.8,1)]);
// AHN top circa NAP 51,48; vloer circa 42,68. Zuil 7 m plus klokframe.
const shaft=box(-.85,-.7,-.35,.85,.7,7.0);
const aFrame=hull([...ring3(rect(-.85,-.7,.85,.7),6.5),...ring3(rect(-1.25,-.7,1.25,.7),7),...ring3(rect(-.45,-.7,.45,.7),8.8)]);
// Ondiepe blinde nis; het kloklichaam is aan de gesloten kern gehecht.
const niche=prism([[-.65,7.2],[.65,7.2],[0,8.3]],.0,.3).rotate([90,0,0]).translate([0,-.4,0]);
const bronze=Manifold.revolve([[0,0],[.49,0],[.49,.1],[.35,.3],[.25,.85],[.2,1.05],[0,1.05]],24).translate([0,-.63,7.25]);
const bell=union([shaft,aFrame.subtract(niche),bronze,hull([...ring3(rect(-.55,-.7,.55,.1),6.65),...ring3(rect(-.55,-1.12,.55,.1),7.25)])]).translate([BELL[0],BELL[1],.35]);
// Gebogen ommuring achter de klok, als band langs de ortho-contour; geen terras dat PDOK dubbelt.
const WALL=[[-12,-22],[-12,-30],[-11,-34],[-8,-37],[-4,-38.6],[4,-38.6],[8,-37],[11,-34],[12,-30],[12,-22]];
const wall=union(WALL.slice(1).map((b,i)=>{const a=WALL[i],d=[b[0]-a[0],b[1]-a[1]],l=Math.hypot(...d),n=[-d[1]/l*.5,d[0]/l*.5];return prism([[a[0]+n[0],a[1]+n[1]],[b[0]+n[0],b[1]+n[1]],[b[0]-n[0],b[1]-n[1]],[a[0]-n[0],a[1]-n[1]]],0,2.0);})).translate([BELL[0],0,0]);
await writeLandmark({slug:'ereveld-grebbeberg',base:0,nodes:[['building:kruis-twee-tegengestelde-leeuwen',cross],['building:luidklok-en-gebogen-muur',union([bell,wall])]],catalog:{name:'Militair Ereveld Grebbeberg',origin:ORIGIN,xAxis:AXIS,groundOffsetMetres:-.2,groundHeight:86.02423,groundSamplePoints:[[7,0],[0,3],[0,-3]],description:'De twee centrale onderdelen van het Nationaal Legermonument: kruis met twee tegengestelde leeuwen en de luidklok met gebogen achterwand. Grafstenen en regimentsmonumenten buiten deze voetafdruk niet opgenomen.',realWorld:{plinthSizeM:[6,2],estimatedCrossTopM:6.2,crossMinimumThicknessM:.9,bellGroundNapM:42.68,bellTopNapM:51.48,bellShaftHeightM:7,bellDiameterM:.97,estimatedWallHeightM:2,estimatedWallThicknessM:1},sources:['https://www.4en5mei.nl/oorlogsmonumenten/zoeken/1887/rhenen-militair-ereveld-grebbeberg','https://www.rijksvastgoedbedrijf.nl/actueel/nieuws/2024/04/30/herdenkingsplek-militair-ereveld-grebbeberg-klaar-voor-nationale-dodenherdenking','https://www.grebbeberg.nl/index.php?page=de-centenklok-op-de-grebbeberg','https://commons.wikimedia.org/wiki/Category:Grebbeberg_War_Cemetery','PDOK actuele HR-ortho, AHN DSM/DTM 0,5 m 2026']}});
