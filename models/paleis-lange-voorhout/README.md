# Paleis Lange Voorhout, Den Haag

Het paleis aan Lange Voorhout 74 met zijn lage achteraanbouw, plus het losstaande historische koetshuis aan Smidswater 13–16. De tuin tussen beide gebouwen en de open hof tussen de koetshuisvleugels blijven open.

## Bestanden en reproductie

- `paleis-lange-voorhout.glb`: meters, Y omhoog, `building:paleis` en `building:koetshuis`.
- `paleis-lange-voorhout.json`: RD-plaatsing, twee BAG-vervangingen, bronnen.
- `paleis-lange-voorhout-1-1000.stl`: millimeters, Z omhoog, beide gebouwen op onderkant nul.
- Generator: `node scripts/generate-paleis-lange-voorhout.mjs` vanuit deze repo.

De reproduceerbare generator bevat de vaste dakpolygonen en vlakvergelijkingen, afzonderlijk voor paleis en koetshuis. Hij bouwt gesloten muurvolumes onder dakvlakken en voegt pilasters, schoorstenen en een gesteund balkon toe. Geen gestapelde AHN-hoogtelagen; geen netwerk of tijdelijke onderzoeksbestanden nodig voor reproductie.

## Plaatsing en metingen

RD-oorsprong `[81461,455562]`, X-as −60° vanaf RD-oost, langs de paleisvoorgevel. Maaiveldreferentie NAP +0,8 m bij de laagste hof, onderkant −0,65 m en `groundOffsetMetres` −0,3 m. Vervangen panden:

- Paleis: `NL.IMBAG.Pand.0518100000339315`.
- Koetshuis: `NL.IMBAG.Pand.0518100000272157`.

De PDOK-export bemonsterde op 10 oktober 2026:

| Lokaal punt | Ellipsoïdische terreinhoogte |
|---|---:|
| `[-7,-16]` | 46,210809 m |
| `[7,-16]` | 46,218675 m |
| `[0,22]` | 44,668800 m |
| `[0,33]` | 44,321571 m |

`groundHeight` is 44,32157050307381 m. Paleis: voordak en dakplateau circa NAP +21,2 m, vierzijdige lichtkap +22,36 m, fronton +18,63 m, achteraanbouw +8,8 m. Koetshuis: eigen afgeknotte kappen rond +11,6 m, straatfronton circa +9,6 m en hogere rand van de rechter zijvleugel circa +13,7 m. De straat voor het paleis ligt hoger dan de tuin en de hof.

## Bronnen

- [BAG via PDOK](https://service.pdok.nl/lv/bag/wfs/v2_0), pandcontouren en identificatie, CC0.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM en DTM op 0,5 m, CC0.
- [3D BAG paleis](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000339315) en [3D BAG koetshuis](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000272157), LoD2.2-dakvlakken, CC BY 4.0, TU Delft/3D geoinformation.
- [RCE 17723, paleis](https://monumentenregister.cultureelerfgoed.nl/monumenten/17723) en [RCE 17982, koetshuis](https://monumentenregister.cultureelerfgoed.nl/monumenten/17982).
- [Escher in Het Paleis](https://escherinhetpaleis.nl/het-paleis).
- [Monumentenzorg Den Haag, koetshuis](https://www.monumentenzorgdenhaag.nl/monumenten/smidswater-13-tm-16).
- [Paleisvoorgevel](https://commons.wikimedia.org/wiki/File:17723_EscherMuseum.jpg).
- [Schuine koetshuisvoorgevel, RCE](https://commons.wikimedia.org/wiki/File:Exterieur_VOORGEVEL_-_%27s-Gravenhage_-_20276482_-_RCE.jpg).
- [Schuine tuinzijde en hof, RCE](https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_ACHTERGEVEL_-_%27s-Gravenhage_-_20276484_-_RCE.jpg).

## Print- en visuele controle

Beide GLB-nodes zijn ieder één gesloten Manifold-volume, `NoError`, genus 0. Paleis 2.064 driehoeken, koetshuis 2.008; gecombineerde STL 4.072 driehoeken, twee losstaande gesloten volumes, circa 16,08 cm³ en 37,9 × 60,8 × 22,3 mm. De gecombineerde genuswaarde −1 komt van twee afzonderlijke gesloten gebouwen. De generator vindt geen ondervlakken met meetbaar oppervlak boven de voet die steun vereisen. Schoorstenen minimaal 1,1 m breed; pilasters aangesloten; nissen blind met steile bovenzijden. Het balkon heeft een schuine kraag van circa 53° en vraagt geen losse steun.

AHN-controle van 3.794 geldige meetpunten, binnen beide BAG-contouren en één meter van de gevel: 100% gedekt, 95,5% binnen 1 m, 98,3% binnen 2 m, mediaanfout +0,01 m, P90 absolute fout 0,39 m.

Volledige 130 × 130 m preview rond 52,0835 / 4,31435 op 1:1000, Z-factor 1, basis 1 mm, overhanggrens 45°, met en zonder landmarks. Ook de echte 3MF-export is gecontroleerd. Bij `supportedSolid` neemt het paleisvolume circa 115,30 mm³ toe en het koetshuis circa 184,42 mm³. Dat komt overeen met de respectievelijke voetoppervlakken van 461,07 en 737,66 mm² × 0,25 mm; het verschil is kleiner dan 0,04 mm³. De vorm krijgt geen steun langs de daken, vensters of het balkon.

Vier identieke camera's op kijkhoogte 30° zijn naast PDOK beoordeeld:

| Richting | Wat het landmark toevoegt |
|---|---|
| −35° | Nissen aan de tuinzijde van paleis en koetshuis; gedifferentieerde lage achteraanbouw. |
| 55° | Koetshuispoortnissen en pilasters aan het Smidswater; de twee schoorstenen. |
| 145° | Negen vensterassen en drie vensterlagen van het paleis, pilasters en balkon. |
| 235° | Paleiszijgevelnissen, fronton en balkon; eigen kapvlakken behouden. |

De renders zijn ook tegen de hierboven genoemde schuine foto's beoordeeld. De gehele complexcontour past binnen de export. De controlekaart is met landmarks aan en uit bekeken. De regressietest in `tests/landmark-models.test.ts` bewaakt beide BAG-vervangingen, de open tuin en hof, de lichtkap, de lage achteraanbouw, het balkon en de koetshuisschoorsteen.

## Geschat of vereenvoudigd

Vensternisprofielen, gevelpilasters, balkonprofiel en vier schoorsteenprofielen zijn naar foto's vereenvoudigd of geschat. Nisbovenzijden zijn steiler dan de echte rechte vensters voor printbaarheid op 1:1000. Fijne beeldhouwwerken in het fronton, kozijnroeden, balkonhekspijlen en metalen vlaggenmasten zijn kleiner dan 0,9 m en weggelaten. Grondvlakken, ligging, hoofddaken, frontons en lichtkap komen uit metingen.

[Controlekaart](http://localhost:3000/kaart/52.08330/4.31381/600/1x1/0?landmarks=1): controleer de paleislichtkap en lage achteraanbouw, de open tuin en hof en de aansluiting van het koetshuis op de omliggende panden.
