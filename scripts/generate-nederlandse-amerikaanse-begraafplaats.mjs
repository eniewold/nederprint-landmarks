// Toren en erehof van Margraten; meters, lokale X naar de begraafplaats.
// Vlakken en bouwdelen; AHN alleen als maatbron, niet als gestapeld raster.
import { Manifold, box, prism, rect, hull, ring3, union, writeLandmark } from './efteling-kit.mjs';
const slug = 'nederlandse-amerikaanse-begraafplaats';
const origin = [184420.5, 314275.4];
const xAxis = [0.980855, -0.19474];
const local = ([x,y]) => [(x-origin[0])*xAxis[0]+(y-origin[1])*xAxis[1],-(x-origin[0])*xAxis[1]+(y-origin[1])*xAxis[0]];
const outlines = {
  toren: [[184420.299,314271.614],[184426.381,314270.372],[184427.682,314276.58],[184421.525,314277.833],[184414.606,314279.24],[184413.323,314273.038]],
  kaartkamer: [[184352.005,314310.969],[184341.408,314313.072],[184340.118,314306.556],[184350.695,314304.532]],
  ontvangst: [[184344.631,314273.941],[184334.079,314276.163],[184332.758,314269.522],[184336.04,314268.874],[184335.199,314264.609],[184340.062,314263.649],[184344.018,314262.816],[184344.912,314267.102],[184343.366,314267.41]],
};
const base = -2.7;
// 101 voet volgens ABMC; AHN-dak 189,2 m minus hof 158,4 m NAP.
const tower = prism(outlines.toren.map(local),base,30.7848)
  .subtract(box(-5.6,-2.8,28.0,5.9,1.7,32)) // verlaagd binnenvlak dak, AHN 186,4 m NAP
  .subtract(box(6.42,-1.5,0.45,7.3,0.9,3.4)) // blinde kapeldeur, oost
  .subtract(box(0.3,2.25,1.4,1.5,3.1,16.1)); // hoge smalle zijopening, blind
const pavilion = (poly,z) => prism(poly.map(local),base,z);
const north = pavilion(outlines.kaartkamer,3.95)
  .subtract(box(-84.2,14.5,0.6,-75,15.27,3.15));
const south = pavilion(outlines.ontvangst,3.95)
  .subtract(box(-84.2,-16.5,0.6,-75,-15.7,3.15));
// AHN: horizontale bovenzijde circa 162,3–162,4 m NAP.
const walls = union([
  box(-74.2,21.05,base,7.1,21.95,4.0),
  box(-74.2,-23.3,base,7.1,-22.4,4.0),
  box(6.2,3.0,base,7.1,21.95,1.7),
  box(6.2,-23.3,base,7.1,-4.1,1.7),
]);
// De BGT-watercontour blijft water in PDOK; alleen de stenen rand toevoegen.
const pool = [[184402.74,314275.037],[184403.996,314281.359],[184359.226,314290.25],[184357.97,314283.928]].map(local);
const xs=pool.map(p=>p[0]), ys=pool.map(p=>p[1]);
const [x0,x1,y0,y1]=[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)];
const border=box(x0-.9,y0-.9,base,x1+.9,y1+.9,.2).subtract(box(x0,y0,base-1,x1,y1,1));
// Rouwende vrouw: jurk, romp en hoofd; handen/duiven kleiner dan 0,9 m vervallen.
const woman=union([
  box(-7.6,-.15,base,-6.3,1.15,.22),
  hull([...ring3(rect(-7.45,-.02,-6.45,1.02),.2),...ring3(rect(-7.39,.04,-6.49,.94),2.45)]),
  box(-7.39,.04,2.2,-6.49,.94,3.35),
  Manifold.sphere(.45,16).scale([1,1,1.2]).translate([-6.94,.49,3.4]),
]);
const nodes = [['building:toren en kapel',tower],['building:kaartkamer',north],['building:ontvangstpaviljoen',south],['building:naamwanden',walls],['road:vijverrand',border],['building:rouwende vrouw',woman]];
await writeLandmark({slug,nodes,base,catalog:{
 name:'Amerikaanse Begraafplaats (Margraten)',origin,xAxis,groundOffsetMetres:0,
 groundSamplePoints:[[-70,0],[-30,8],[-30,-8],[-8,5],[-8,-5]],
 replacesBuildings:['NL.IMBAG.Pand.0936100000006577','NL.IMBAG.Pand.0936100000006576','NL.IMBAG.Pand.0936100000006578'],
 description:'Toren met kapel, twee toegangspaviljoens, naamwanden, stenen vijverrand en schematische rouwende vrouw; Z omhoog vóór glTF-omzetting, lokale +X langs het hof naar het oosten. BAG-contouren, doorlopende vlakke daken en blinde portalen; onderkant 2,7 m verankerd onder hofniveau en de buitenhoeken van de paviljoens. De vijver en het hofterrein blijven PDOK.',
 realWorld:{torenHoogteM:30.7848,torenNapM:189.2,hofNapM:158.4,paviljoenHoogteM:3.95,naamwandHoogteM:4,schattingen:['naamwanddikte en vijverrand 0,9 m voor 1:1000','blinde portalen en zijopening','schematisch vrouwbeeld 3,9 m']},
 sources:['https://www.abmc.gov/sites/default/files/2024-11/EN_NEAC_Brochure_2024-07_0.pdf','https://www.abmc.gov/history/discover-the-history-of-netherlands-american-cemetery/','PDOK BAG WFS: 0936100000006576/6577/6578; BGT waterdeel 79dfe474-068e-5521-a519-b0cf792b6fef','PDOK AHN4 DSM 0,5 m; bbox 184300,314150,184600,314450; geraadpleegd 2026-10-08','https://commons.wikimedia.org/wiki/File:NET-Margraten-American_Cemetery_01.jpg','https://commons.wikimedia.org/wiki/File:Overzicht_grafstenen_met_toren_annex_kapel_op_de_achtergrond_-_Margraten_-_20355736_-_RCE.jpg']
}});
