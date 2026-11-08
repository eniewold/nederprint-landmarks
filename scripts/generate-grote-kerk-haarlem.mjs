// Grote of Sint-Bavokerk (Haarlem): kruisbasiliek in Brabantse gotiek met de
// houten vieringtoren. Gebouwd uit vlakken en benoemde bouwdelen: schip en koor
// onder één zadeldak met driezijdig afgeschilde koorsluiting, zijbeuken en
// kooromgang onder lessenaarsdaken (rond de koorsluiting vijf dakvlakken met
// hoekkepers), transept met topgevels en hoektorentjes, kapellen met eigen
// daken, steunberen met pinakels, vensternissen, de westgevel met traptorens en
// de vieringtoren met vierkante voet, achtkante geledingen en spits.
//
//   node scripts/generate-grote-kerk-haarlem.mjs              # 1:1000 (standaard)
//   node scripts/generate-grote-kerk-haarlem.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (103933, 488399,2) onder de viering, +X langs de
// as van de westgevel naar het koor (RD-richting 2,2 graden), +Y naar het
// noorden, Z omhoog met z = 0 op het maaiveld (NAP +1,5 m). Hoogtes in het
// script zijn NAP; het model zakt aan het eind GROUND_NAP omlaag.
//
// Bronnen: 3DBAG LoD2.2 (dakvlakken: nokken, goten, hellingen, kapellen en
// torentjes), BAG-contour (muren, steunberen, kapellen), PDOK-luchtfoto, foto's
// op Wikimedia Commons (opstand, torengeledingen, hoektorentjes), Wikipedia
// (vieringtoren ruim 78 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0&&argv[i+1]?argv[i+1]:f};
const scale=Number(flag("--scale","1000")),slug="grote-kerk-haarlem";
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),slug),mmPerMetre=1000/scale;
const wasm=await Module();wasm.setup();const {Manifold,CrossSection}=wasm;
const ORIGIN=[103933,488399.2],X_AXIS=[0.99926,0.03839],GROUND_NAP=1.5,BASE=-0.5,FLOOR=GROUND_NAP+BASE;
const D=Math.PI/180;
const prism=(p,z0,z1)=>Manifold.extrude(new CrossSection([p]),z1-z0).translate([0,0,z0]);
const box=(x0,x1,y0,y1,z0,z1)=>prism([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],z0,z1);
// Houdt z <= a x + b y + c: elk dakvlak is een planvergelijking.
const plane=(s,a,b,c)=>{const n=Math.hypot(a,b,1);return s.trimByPlane([a/n,b/n,-1/n],-c/n)};
const gableX=(s,xr,zr,k)=>plane(plane(s,-k,0,zr+k*xr),k,0,zr-k*xr); // nok langs Y op x = xr
const gableY=(s,yr,zr,k)=>plane(plane(s,0,-k,zr+k*yr),0,k,zr-k*yr); // nok langs X op y = yr
// Dakvlak met buitennormaal onder hoek deg rond (cx, cy): goothoogte ze op afstand d0, helling k naar binnen.
const facet=(s,cx,cy,deg,d0,ze,k)=>{const nx=Math.cos(deg*D),ny=Math.sin(deg*D);return plane(s,-k*nx,-k*ny,ze+k*d0+k*(nx*cx+ny*cy))};
const arc=(cx,cy,r,degs)=>degs.map(d=>[cx+r*Math.cos(d*D),cy+r*Math.sin(d*D)]);
const oct=(cx,cy,r,z)=>Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4),z]);
const sq=(x0,x1,y0,y1,z)=>[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
const hull=(pts)=>Manifold.hull(pts);

// ---------- hoofdvolumes (3DBAG: goten, nokken en hellingen) ----------
// Schip: muren tot de goot op NAP +28,85 m, nok +43,2 m op y = -0,5 (helling 56 graden).
const NAVE={x0:-49.5,x1:7.5,yc:-0.5,half:9.7,ridge:43.2,slope:1.48};
// Koor: iets smaller, goot +30 m, nok +43,3 m, driezijdige sluiting (straal 9 m rond (46, -0,6)) afgeschild met helling 58 graden.
const CHOIR={x0:-5,yc:-0.6,half:9.0,cx:46,ridge:43.3,slope:1.48,hip:1.6};
// Transept: muren x = -5 en 7,3, nok op x = 1,8 (+43,3 m), helling 62 graden; fronten op y = 25 en -25,8.
const TRANSEPT={x0:-5,x1:7.3,xr:1.8,y0:-25.8,y1:25.0,ridge:43.3,slope:1.88};
// Zijbeuken van het schip: lessenaarsdak 45 graden van +13,8 m aan de buitenmuur naar de hoge muur.
const AISLE={x0:-47.6,y0:-17.8,y1:17.1,eave:13.8,slope:1.0};
// Zijbeuken van het koor en de kooromgang: buitenmuur een halve achttienhoek (BAG: negen zijden van 20 graden, straal
// 17,4 m rond (46,6, -0,6)) met een steunbeer op elke hoek; het lessenaarsdak (48 graden, goot +14,3 m) heeft volgens
// 3DBAG en AHN vijf dakvlakken met hoekkepers (0, ±36 en ±72 graden), parallel aan een halve tienhoek.
const AMB={x0:7.2,cx:46.6,cy:-0.6,r:17.4,eave:14.3,slope:1.1,walls:[-90,-70,-50,-30,-10,10,30,50,70,90],roofs:[-72,-36,0,36,72]};
const TOWER={cx:1.8,cy:-0.5,half:4.2,top:48.5,stages:[[3.9,3.5,48.5,55],[3.0,2.7,55,60.5],[2.2,1.95,60.5,65.5],[1.5,1.3,65.5,69]],spire:[1.1,69,0.45,80]};

let nave=gableY(box(NAVE.x0,NAVE.x1,NAVE.yc-NAVE.half,NAVE.yc+NAVE.half,FLOOR,50),NAVE.yc,NAVE.ridge,NAVE.slope);
let choir=prism([[CHOIR.x0,CHOIR.yc-CHOIR.half],...arc(CHOIR.cx,CHOIR.yc,CHOIR.half,[-90,-30,30,90]),[CHOIR.x0,CHOIR.yc+CHOIR.half]],FLOOR,50);
choir=gableY(choir,CHOIR.yc,CHOIR.ridge,CHOIR.slope);
for(const a of [-60,0,60])choir=facet(choir,CHOIR.cx,CHOIR.yc,a,CHOIR.half*Math.cos(30*D),CHOIR.ridge-CHOIR.slope*CHOIR.half,CHOIR.hip);
let transept=gableX(box(TRANSEPT.x0,TRANSEPT.x1,TRANSEPT.y0,TRANSEPT.y1,FLOOR,50),TRANSEPT.xr,TRANSEPT.ridge,TRANSEPT.slope);
// Het oostelijke dakvlak van het zuidtransept loopt naast het koor door tot x = 13,1 (goot +21,5 m).
let transeptEast=plane(box(TRANSEPT.x1-0.2,13.1,-13.2,-5.1,FLOOR,50),-TRANSEPT.slope,0,TRANSEPT.ridge+TRANSEPT.slope*TRANSEPT.xr);
let aisles=box(AISLE.x0,TRANSEPT.x0+0.2,AISLE.y0,AISLE.y1,FLOOR,50);
aisles=plane(aisles,0,-AISLE.slope,AISLE.eave+AISLE.slope*AISLE.y1);aisles=plane(aisles,0,AISLE.slope,AISLE.eave-AISLE.slope*AISLE.y0);
let amb=prism([[AMB.x0,AMB.cy-AMB.r],...arc(AMB.cx,AMB.cy,AMB.r,AMB.walls),[AMB.x0,AMB.cy+AMB.r]],FLOOR,50);
for(const a of [-90,90])amb=facet(amb,AMB.cx,AMB.cy,a,AMB.r,AMB.eave,AMB.slope);
for(const a of AMB.roofs)amb=facet(amb,AMB.cx,AMB.cy,a,AMB.r*Math.cos(10*D),AMB.eave,AMB.slope);

// ---------- kapellen en aanbouwen ----------
const parts=[nave,choir,transept,transeptEast,aisles,amb];
// Twee kapellen aan de noordkant van het koor onder schilddaken (nok langs X op y = 20,1, +21,2 m; noordgoot +9,2 m).
for(const [x0,x1] of [[7.3,14.5],[14.5,21.0]]){
  let c=box(x0,x1,14,25,FLOOR,50);c=plane(c,0,-1.85,9.2+1.85*26.6);c=plane(c,0,1.85,21.2-1.85*20.1);
  c=plane(c,2.1,0,14.5-2.1*x0);c=plane(c,-2.1,0,14.5+2.1*x1);parts.push(c);
}
// Derde noordkapel met dwars zadeldak (nok +17,4 m), twee zuidkapellen langs het koor (nok +19,5 m),
// twee kapellen langs de zuidkant van het schip (nok +22,6 en +15,4 m).
for(const [x0,x1,y0,y1,xr,zr,k] of [[21,27.5,14,23.1,24.25,17.4,1.7],[7.1,15,-26,-12,11.65,19.5,1.75],[15,22.9,-26,-12,18.3,19.6,1.72],[-33.5,-25.4,-21.3,-12,-29.3,22.6,2.13],[-19.2,-9.3,-23.4,-12,-14.6,15.4,1.35]])
  parts.push(gableX(box(x0,x1,y0,y1,FLOOR,50),xr,zr,k));
// Lage aanbouwen: tegen het zuidtransept (lessenaar naar het westen), tussen en naast de zuidkapellen.
parts.push(plane(box(-10,-4.8,-25.7,-17.8,FLOOR,50),0.98,0,10.5+0.98*4.4));
parts.push(plane(box(-25.4,-19.2,-21.8,-17,FLOOR,50),0,0.26,5.6+0.26*21.6));
parts.push(plane(box(-37.5,-33.2,-21,-17,FLOOR,50),0.81,0,8.5+0.81*33.2));
// Zuidportaal met steile topgevel (nok +12 m).
parts.push(gableX(box(-1.6,1.8,-30,-25.6,FLOOR,50),0.1,12,3.3));
// Aanbouw aan de zuidoostkant, 69,6 graden gedraaid langs de straat: zadeldak (nok +12,8 m, goot +7,5 m) met schild aan het zuideinde.
{let a=box(0,17.6,-3.8,3.8,FLOOR,50);a=gableY(a,0,12.8,1.4);a=plane(a,1.4,0,7.5);parts.push(a.rotate([0,0,69.6]).translate([51.1,-30.95,0]));}
// Laag tussenlid tussen die aanbouw en de zuidoostkant van de kooromgang (dak naar de straat afhellend, top +12 m),
// en de lage kapel tegen het zuidoostelijke omgangsvlak (lessenaar van +17 m aan de muur naar +13,7 m).
{let l=box(14,19.6,-3.3,2.4,FLOOR,50);l=plane(l,-0.9,0,11.5+0.9*16);l=plane(l,0,-1.2,11.5+1.2*0.5);parts.push(l.rotate([0,0,69.6]).translate([51.1,-30.95,0]));}
{let k=box(-1.5,3.3,-2.5,2.5,FLOOR,50);k=plane(k,-1.0,0,17);const [[x,y]]=arc(AMB.cx,AMB.cy,AMB.r*Math.cos(10*D),[-20]);parts.push(k.rotate([0,0,-20]).translate([x,y,0]));}

// ---------- torens en torentjes ----------
// Vieringtoren: vierkante loden voet met uurwerken en hoekpinakels, vier achtkante geledingen, spits (verbreed topje).
parts.push(box(TOWER.cx-TOWER.half,TOWER.cx+TOWER.half,TOWER.cy-TOWER.half,TOWER.cy+TOWER.half,30,TOWER.top));
for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const x=TOWER.cx+sx*(TOWER.half-0.6),y=TOWER.cy+sy*(TOWER.half-0.6);
  parts.push(box(x-.5,x+.5,y-.5,y+.5,TOWER.top-.01,TOWER.top+2));parts.push(hull([...sq(x-.5,x+.5,y-.5,y+.5,TOWER.top+1.99),[x,y,TOWER.top+3.6]]));}
for(const [r0,r1,z0,z1] of TOWER.stages)parts.push(hull([...oct(TOWER.cx,TOWER.cy,r0,z0-.01),...oct(TOWER.cx,TOWER.cy,r1,z1)]));
parts.push(hull([...oct(TOWER.cx,TOWER.cy,TOWER.spire[0],TOWER.spire[1]-.01),...oct(TOWER.cx,TOWER.cy,TOWER.spire[2],TOWER.spire[3])]));
// Westgevel: twee achtkante traptorens (tot +35,6 m) met spitsen.
for(const y of [7.5,-8.1]){parts.push(hull([...oct(-50.4,y,1.6,FLOOR),...oct(-50.4,y,1.6,35.6)]));parts.push(hull([...oct(-50.4,y,1.6,35.59),[-50.4,y,39.5]]));}
// Hoektorentjes op de transeptfronten (tot +33 m, spits +36,5 m) en traptorens in de binnenhoeken.
const turret=(x0,x1,y0,y1,top,tip)=>{parts.push(box(x0,x1,y0,y1,FLOOR,top));parts.push(hull([...sq(x0,x1,y0,y1,top-.01),[(x0+x1)/2,(y0+y1)/2,tip]]));};
turret(-5.2,-3.6,-27.4,-25.6,33,36.5);turret(6.0,7.6,-27.4,-25.6,33,36.5);
turret(-5.2,-3.6,24.8,26.6,33,36.5);turret(7.2,9.0,23.5,26.6,33.5,37);
turret(-6.3,-4.3,16,19.6,34.9,37.5);turret(8.0,10.8,-18.4,-15.4,22,25.5);

// ---------- steunberen en pinakels ----------
// Steunbeer tegen een muur: 1 m breed, 1,3 m diep, met afgeschuinde kop; opgebouwd naar +X en gedraaid naar de buitennormaal.
const brace=(x,y,deg,top)=>{let b=box(-.8,1.3,-.5,.5,FLOOR,top);b=plane(b,-1.25,0,top-1.25*0.3);parts.push(b.rotate([0,0,deg]).translate([x,y,0]));};
// Steunbeer op de hoge muur, boven het zijbeukdak, met pinakel.
const pinnacle=(x,y,deg,top)=>{parts.push(box(-.6,1.3,-.5,.5,FLOOR,top).rotate([0,0,deg]).translate([x,y,0]));
  parts.push(hull([...sq(-.6,1.3,-.5,.5,top-.01),[.35,0,top+2.6]]).rotate([0,0,deg]).translate([x,y,0]));};
const NAVE_BAYS=[-43.3,-37.1,-30.9,-24.7,-18.5,-12.3],CHOIR_BAYS=[13.4,18.9,24.3,29.7,35.1,40.6];
for(const x of [-47.1,...NAVE_BAYS])brace(x,AISLE.y1,90,13.5);
for(const x of [-47.1,-43.3,-37.1,-24.7])brace(x,AISLE.y0,-90,13.5);
for(const x of NAVE_BAYS){pinnacle(x,NAVE.yc+NAVE.half,90,27);pinnacle(x,NAVE.yc-NAVE.half,-90,27);}
for(const x of [29.7,35.1,40.6,46.5])brace(x,AMB.cy+AMB.r,90,14);
for(const x of [24.3,29.7,35.1,40.6,46.5])brace(x,AMB.cy-AMB.r,-90,14);
for(const a of AMB.walls.slice(1,-1)){const [[x,y]]=arc(AMB.cx,AMB.cy,AMB.r-0.1,[a]);brace(x,y,a,14);}
for(const x of CHOIR_BAYS){pinnacle(x,CHOIR.yc+CHOIR.half,90,27.5);pinnacle(x,CHOIR.yc-CHOIR.half,-90,27.5);}
for(const a of [-90,-30,30,90]){const [[x,y]]=arc(CHOIR.cx,CHOIR.yc,CHOIR.half,[a]);pinnacle(x,y,a,27.5);}
// Steunberen op de kapelfronten aan de noordkant.
for(const x of [8.7,14.5,20.3])brace(x,25,90,11);
for(const x of [-33.5,-25.4])brace(x,-21.3,-90,13);
for(const x of [11.65-3.0,11.65+3.0,18.3+3.8])brace(x,-26,-90,12);

let church=Manifold.union(parts);

// ---------- nissen: vensters, portalen, roosvensters, uurwerken en galmgaten ----------
// Spitsboognis van w bij h, 0,35 m diep, in het XZ-vlak; `deg` is de buitennormaal van de muur.
const archPts=(w,h)=>[[-w/2,0],[w/2,0],[w/2,h-.6*w],[0,h],[-w/2,h-.6*w]];
const niche=(x,y,z,w,h,deg)=>Manifold.extrude(new CrossSection([archPts(w,h)]),.7).rotate([90,0,0]).translate([0,.35,0]).rotate([0,0,deg-90]).translate([x,y,z]);
const round=(x,y,z,r,deg)=>Manifold.cylinder(.7,r,r,28).rotate([90,0,0]).translate([0,.35,0]).rotate([0,0,deg-90]).translate([x,y,z]);
const cuts=[];
const mid=(bays,x0,x1)=>[x0,...bays,x1].slice(0,-1).map((x,i)=>(x+[x0,...bays,x1][i+1])/2);
// Zijbeukvensters van het schip (noord elke travee, zuid waar geen kapel staat) en de lichtbeuk.
for(const x of mid(NAVE_BAYS,-47.1,TRANSEPT.x0))cuts.push(niche(x,AISLE.y1,4.5,2.8,7,90));
for(const x of [-45.2,-40.2])cuts.push(niche(x,AISLE.y0,4.5,2.8,7,-90));
for(const x of mid(NAVE_BAYS,-47.1,TRANSEPT.x0)){cuts.push(niche(x,NAVE.yc+NAVE.half,22.5,2.6,6,90));cuts.push(niche(x,NAVE.yc-NAVE.half,22.5,2.6,6,-90));}
// Koor: lichtbeuk per travee en in de drie sluitingsvlakken, zijbeuken en kooromgang.
for(const x of mid(CHOIR_BAYS,TRANSEPT.x1,CHOIR.cx)){cuts.push(niche(x,CHOIR.yc+CHOIR.half,23.8,2.6,5.2,90));cuts.push(niche(x,CHOIR.yc-CHOIR.half,23.8,2.6,5.2,-90));}
for(const a of [-60,0,60]){const [[x,y]]=arc(CHOIR.cx,CHOIR.yc,CHOIR.half*Math.cos(30*D),[a]);cuts.push(niche(x,y,23.8,3,5.2,a));}
for(const x of [32.4,37.85,43.3])cuts.push(niche(x,AMB.cy+AMB.r,4.5,2.8,7,90));
for(const x of [27,32.4,37.85,43.3])cuts.push(niche(x,AMB.cy-AMB.r,4.5,2.8,7,-90));
for(const a of [0,20,40,60,80]){const [[x,y]]=arc(AMB.cx,AMB.cy,AMB.r*Math.cos(10*D),[a]);cuts.push(niche(x,y,4.5,2.8,7,a));}
// Transeptfronten: groot venster met roosvenster in de top; zijwanden boven de zijbeuken.
cuts.push(niche(TRANSEPT.xr,TRANSEPT.y1,12,7,20,90),round(TRANSEPT.xr,TRANSEPT.y1,38.3,1.3,90));
cuts.push(niche(TRANSEPT.xr,TRANSEPT.y0,13,7,19,-90),round(TRANSEPT.xr,TRANSEPT.y0,38.3,1.3,-90));
cuts.push(niche(TRANSEPT.x0,21.9,4.5,2.4,7,180),niche(TRANSEPT.x0,21.9,20.5,2.4,6,180),niche(TRANSEPT.x1,21.9,22.5,2.4,6,0));
cuts.push(niche(TRANSEPT.x0,-21.8,13,2.4,6,180),niche(TRANSEPT.x0,-21.8,21,2.4,6,180),niche(TRANSEPT.x1,-21,22.5,2.4,6,0));
// Westgevel: groot venster en portaal tussen de traptorens; vensters in de westwanden van de zijbeuken.
cuts.push(niche(NAVE.x0,-0.3,12,7,20,180),niche(NAVE.x0,-0.3,1.5,3,5.5,180),niche(AISLE.x0,13.2,4.5,2.6,6,180),niche(AISLE.x0,-13.6,4.5,2.6,6,180));
// Kapellen en portaal.
for(const x of [11.65,18.3])cuts.push(niche(x,-26,4.5,3,8,-90));
for(const x of [11.4,17.75])cuts.push(niche(x,25,3,2.6,5,90));
cuts.push(niche(24.25,23.1,4.5,2.8,7,90),niche(-29.3,-21.3,5,3,8,-90),niche(-14.6,-23.4,4,2.6,6,-90),niche(0.1,-30,1.5,2.2,5,-90));
// Uurwerken op de vier zijden van de torenvoet, galmgaten in de eerste twee geledingen.
for(const [x,y,deg] of [[TOWER.cx,TOWER.cy+TOWER.half,90],[TOWER.cx,TOWER.cy-TOWER.half,-90],[TOWER.cx+TOWER.half,TOWER.cy,0],[TOWER.cx-TOWER.half,TOWER.cy,180]])cuts.push(round(x,y,44.5,1.6,deg));
for(let k=0;k<8;k++){const a=k*45;const r1=(3.9+3.5)/2*Math.cos(22.5*D),r2=(3.0+2.7)/2*Math.cos(22.5*D);
  cuts.push(niche(TOWER.cx+r1*Math.cos(a*D),TOWER.cy+r1*Math.sin(a*D),49.5,1.2,4,a));cuts.push(niche(TOWER.cx+r2*Math.cos(a*D),TOWER.cy+r2*Math.sin(a*D),56,1.0,3.2,a));}
church=church.subtract(Manifold.union(cuts)).translate([0,0,-GROUND_NAP]);
const named=[["building:grote-kerk-haarlem",church]];

const META={name:"Grote of Sint-Bavokerk",origin:ORIGIN,xAxis:X_AXIS,groundHeight:GROUND_NAP,groundOffsetMetres:BASE,
  // Maaiveld op de Grote Markt, de straat ten noorden van het transept, het Klokhuisplein en de Oude Groenmarkt.
  groundSamplePoints:[[-58,0],[0,31],[72,0],[0,-33]],replacesBuildings:["NL.IMBAG.Pand.0392100000065734"],
  description:"Kruisbasiliek in Brabantse gotiek: schip en koor onder één zadeldak (goot +28,9/+30 m, nok +43,2 m) met driezijdig afgeschilde koorsluiting, zijbeuken en kooromgang onder lessenaarsdaken met vijf dakvlakken rond de sluiting, transept met topgevels, roosvensters en hoektorentjes, kapellen en aanbouwen, steunberen met pinakels, vensternissen, westgevel met twee traptorens en de houten vieringtoren: vierkante voet met uurwerken tot +48,5 m, vier achtkante geledingen met galmgaten en de spits tot +80 m. Oorsprong onder de viering op het maaiveld (NAP +1,5 m), +X van de westgevel naar het koor (RD-richting 2,2 graden). Vervangt BAG-pand 0392100000065734; de Vishal, de huisjes aan de Oude Groenmarkt en de buurpanden blijven PDOK.",
  realWorld:{groundNapM:GROUND_NAP,naveRidgeNapM:NAVE.ridge,naveEaveNapM:28.85,choirEaveNapM:30,transeptRidgeNapM:TRANSEPT.ridge,towerBaseNapM:TOWER.top,towerCrownNapM:69,towerTipNapM:80},
  sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0392100000065734","https://monumentenregister.cultureelerfgoed.nl/monumenten/19264","https://nl.wikipedia.org/wiki/Grote_of_Sint-Bavokerk","https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Haarlem","https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0","https://service.pdok.nl/rws/ahn/wcs/v1_0"]};
function toStl(solid,label){
  const m=solid.getMesh(),v=m.vertProperties,tri=m.triVerts,s=m.numProp,n=tri.length/3,b=Buffer.alloc(84+n*50);b.write(label.slice(0,79),0,80,"ascii");b.writeUInt32LE(n,80);let o=84;
  for(let t=0;t<n;t++){const p=[0,1,2].map(k=>{const i=tri[t*3+k]*s;return[v[i]*mmPerMetre,v[i+1]*mmPerMetre,v[i+2]*mmPerMetre];});const a=p[1].map((c,i)=>c-p[0][i]),d=p[2].map((c,i)=>c-p[0][i]),q=[a[1]*d[2]-a[2]*d[1],a[2]*d[0]-a[0]*d[2],a[0]*d[1]-a[1]*d[0]],l=Math.hypot(...q)||1;for(const c of [...q.map(x=>x/l),...p[0],...p[1],...p[2]]){b.writeFloatLE(c,o);o+=4;}b.writeUInt16LE(0,o);o+=2;}
  return{buffer:b,triangles:n};
}
function toGlb(named){
  const chunks=[],views=[],acc=[],meshes=[],nodes=[];let length=0;
  const push=(a,target)=>{const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength),p=Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);views.push({buffer:0,byteOffset:length,byteLength:b.length,target});chunks.push(p);length+=p.length;return views.length-1;};
  // Scherpe randen boven 15 graden: de muurvlakken van de kooromgang verschillen 20 graden en moeten hoekig blijven.
  for(const[name,solid]of named){const m=solid.calculateNormals(0,15).getMesh(),s=m.numProp,n=m.vertProperties.length/s,pos=new Float32Array(n*3),norm=new Float32Array(n*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<n;i++){const v=m.vertProperties,p=[v[i*s],v[i*s+2],-v[i*s+1]],q=s>=6?[v[i*s+3],v[i*s+5],-v[i*s+4]]:[0,1,0];for(let j=0;j<3;j++){pos[i*3+j]=p[j];norm[i*3+j]=q[j];min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j]);}}const pi=push(pos,34962),ni=push(norm,34962),ii=push(Uint32Array.from(m.triVerts),34963),a=acc.length;acc.push({bufferView:pi,componentType:5126,count:n,type:"VEC3",min,max},{bufferView:ni,componentType:5126,count:n,type:"VEC3"},{bufferView:ii,componentType:5125,count:m.triVerts.length,type:"SCALAR"});meshes.push({name,primitives:[{attributes:{POSITION:a,NORMAL:a+1},indices:a+2,mode:4}]});nodes.push({name,mesh:meshes.length-1});}
  const json=Buffer.from(JSON.stringify({asset:{version:"2.0",generator:"NederPrint generate-grote-kerk-haarlem.mjs"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,buffers:[{byteLength:length}],bufferViews:views,accessors:acc})),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]),bin=Buffer.concat(chunks),h=Buffer.alloc(12);h.writeUInt32LE(0x46546c67,0);h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bin.length,8);const ch=(len,type)=>{const b=Buffer.alloc(8);b.writeUInt32LE(len,0);b.writeUInt32LE(type,4);return b;};return Buffer.concat([h,ch(jp.length,0x4e4f534a),jp,ch(bin.length,0x004e4942),bin]);
}

// ---------- controles ----------
if(church.status()!=="NoError")throw new Error(church.status());
const bb=church.boundingBox();if(Math.abs(bb.min[2]-BASE)>1e-5)throw new Error("modelvoet is niet vlak");
const pieces=church.decompose();if(pieces.length!==1)throw new Error(`expected one connected component, got ${pieces.length}`);
// Naar beneden gerichte vlakken steiler dan 45 graden boven de voet (alleen de bovenhelften van ronde nissen).
let overhang=0;{const m=church.getMesh(),v=m.vertProperties,s=m.numProp;for(let t=0;t<m.triVerts.length;t+=3){const p=[0,1,2].map(k=>[0,1,2].map(a=>v[m.triVerts[t+k]*s+a]));if(Math.max(...p.map(q=>q[2]))<BASE+1e-6)continue;const e1=p[1].map((c,i)=>c-p[0][i]),e2=p[2].map((c,i)=>c-p[0][i]),n=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]],l=Math.hypot(...n);if(l>0&&-n[2]/l>Math.SQRT1_2)overhang+=l/2;}}
console.log(JSON.stringify({slug,status:church.status(),genus:church.genus(),components:pieces.length,triangles:church.numTri(),bounds:{min:bb.min,max:bb.max},size:bb.max.map((v,i)=>+(v-bb.min[i]).toFixed(2)),overhangM2:+overhang.toFixed(2)},null,2));
await mkdir(outDir,{recursive:true});
const glb=`${slug}.glb`,stl=`${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir,glb),toGlb(named));const printSolid=church.translate([0,0,-BASE]),stlResult=toStl(printSolid,`NederPrint ${META.name} Haarlem 1:${scale} mm Z-up`);await writeFile(path.join(outDir,stl),stlResult.buffer);
await writeFile(path.join(outDir,`${slug}.json`),JSON.stringify({...META,file:glb,unitsPerMetre:1,className:"building",crs:"EPSG:28992",printFiles:[stl],realWorld:{...META.realWorld,lengthM:+(bb.max[0]-bb.min[0]).toFixed(2),widthM:+(bb.max[1]-bb.min[1]).toFixed(2),highestPointM:+bb.max[2].toFixed(2)}},null,2));
