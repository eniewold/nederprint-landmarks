# Paleis Kneuterdijk, Den Haag

Compleet historisch paleispand, inclusief de Heulstraatvleugel, de lage verbindingsvleugel en de Gotische zaal aan de Paleisstraat. Beide tuinen blijven open. De moderne kantoorvleugels van de Raad van State blijven de bestaande PDOK-reconstructie.

## Bestanden en reproductie

- `paleis-kneuterdijk.glb`: meters, Y omhoog, één `building:paleis`-node.
- `paleis-kneuterdijk.json`: RD-plaatsing, BAG-vervanging en bronnen.
- `paleis-kneuterdijk-1-1000.stl`: millimeters, Z omhoog, onderkant op nul.
- Generator: `node scripts/generate-paleis-kneuterdijk.mjs` vanuit deze repo.

De generator bevat de vastgelegde dakpolygonen en vlakvergelijkingen; reproductie heeft geen netwerk of tijdelijke onderzoeksbestanden nodig. Hij bouwt muren onder afzonderlijke dakvlakken, gegroepeerd per paleisvleugel. De Gotische zaal heeft twee gemeten hoofdvlakken en afzonderlijke gevelranden en steunberen. Er worden geen gestapelde AHN-hoogtelagen gebruikt.

## Plaatsing en meting

RD-oorsprong `[81033,455334]`, X-as 30° tegen de klok in vanaf RD-oost. Het model vervangt uitsluitend `NL.IMBAG.Pand.0518100000343602`. De contour volgt het BAG-pand, inclusief de beide open tuinruimten. Maaiveldreferentie NAP +2,0 m, onderkant −0,6 m, `groundOffsetMetres` −0,3 m.

PDOK-terrein op de drie bemonsterpunten, gemeten met de echte export op 10 oktober 2026:

| Lokaal punt | Ellipsoïdische terreinhoogte |
|---|---:|
| `[-20,-16]` | 46,424772 m |
| `[15,10]` | 45,533422 m |
| `[-16,44]` | 45,663784 m |

`groundHeight` is de laagste waarde, 45,53342207476514 m. De paleiskappen liggen ongeveer op NAP +19,95 m, de entreebekroning op +22,96 m, de Gotische zaal op +20,3 m en het doorgaande verbindingsdak op circa +10,3 m. Kleine dakranddetails van de verbindingsvleugel zijn hoger.

## Bronnen

- [BAG via PDOK](https://service.pdok.nl/lv/bag/wfs/v2_0), grondvlak en pandidentificatie, CC0.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM/DTM op 0,5 m, CC0.
- [3D BAG, pand 0518100000343602](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000343602), LoD2.2-dakvlakken, CC BY 4.0, TU Delft/3D geoinformation.
- [RCE 17626, paleis](https://monumentenregister.cultureelerfgoed.nl/monumenten/17626) en [RCE 17869, Gotische zaal](https://monumentenregister.cultureelerfgoed.nl/monumenten/17869).
- [Raad van State, paleis en Gotische zaal](https://www.raadvanstate.nl/actueel/nieuws/augustus/open-monumentendagen-2022/).
- [RCE, voorgevel met achtzijdige koepel](https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel;_middenpartij_heeft_een_achtzijdige_koepelbekroning_-_%27s-Gravenhage_-_20390103_-_RCE.jpg).
- [Schuine foto van de tuinzijde](https://commons.wikimedia.org/wiki/File:Achterzijde_Paleis_Kneuterdijk.JPG).
- [Gotische zaal, verbinding en tuin](https://commons.wikimedia.org/wiki/File:Gotische_zaal_met_tuin.JPG).

## Controle op 1:1000

De STL is één gesloten Manifold-volume, `NoError`, genus 0, 6.926 driehoeken, 35,80 cm³ en circa 68,4 × 97,5 × 21,6 mm. De generator rapporteert geen ondervlakken boven de voet die meer dan 45° naar beneden wijzen. Schoorstenen zijn minimaal 1,2 m breed. Gevelranden en steunberen zijn aangesloten; vensters zijn blinde nissen van circa 0,35 m diep met steile bovenzijden. Ook de ronde gotische roosvensters hebben een vereenvoudigde steile bovenzijde voor steunvrij printen.

Onafhankelijke vergelijking van de daken met 7.232 geldige AHN-punten binnen de BAG-contour, één meter van de gevel: 100% gedekt, 96,7% binnen 1 m, 98,3% binnen 2 m, mediaanfout +0,05 m en P90 absolute fout 0,32 m.

Volledige preview-uitsnede van 150 × 150 m rond 52,08156 / 4,30823, schaal 1:1000, Z-factor 1, basis 1 mm, overhanggrens 45°, met en zonder landmarks. Ook de echte 3MF-export is gecontroleerd. `supportedSolid`: 35.475,460964 → 36.034,727297 mm³. De toename van 559,266333 mm³ is exact de aansluiting van de voet: 2.237,063394 mm² × 0,25 mm. Er komt geen steunvolume tegen de gevels of daken bij.

Vier schuine renders op kijkhoogte 30° uit richtingen −35°, 55°, 145° en 235° zijn naast dezelfde PDOK-preview beoordeeld en vergeleken met de hierboven genoemde foto's. De volledige paleiscontour, koepel, Gotische zaal en lage verbinding zijn zichtbaar; beide tuinen blijven open. De controlekaart is met landmarks aan en uit bekeken. De regressietest in `tests/landmark-models.test.ts` controleert de tuinen, de lage verbinding, de Gotische zaal, de entreebekroning en de Heulstraatvleugel.

## Vereenvoudigd of geschat

Vensterverdeling, nisprofielen, gotische roosvensters, dikte en hoogte van de gevelranden en steunbeerbekroningen, en twee schoorsteenprofielen zijn voor 1:1000 vereenvoudigd of vanuit foto's geschat. Fijne rococo-ornamenten, balustradestijltjes en metalen spitsen zijn weggelaten. De grondvorm, ligging, hoofdhoogten en dakvlakken zijn gemeten.

[Controlekaart](http://localhost:3000/kaart/52.08131/4.30865/600/1x1/0?landmarks=1): controleer de open tuinen, de aansluiting van de lage verbindingsvleugel op de Gotische zaal en de achtzijdige entreebekroning.
