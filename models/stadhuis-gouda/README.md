# Stadhuis (Gouda)

`stadhuis-gouda.glb` is het kaartmodel in meters (Y omhoog),
`stadhuis-gouda.json` de catalogus en `stadhuis-gouda-1-1000.stl` het
verbonden printmodel in millimeters met vlakke voet. Reproduceer met
`node scripts/generate-stadhuis-gouda.mjs` vanuit nederprint-landmarks.

Oorsprong RD **108544.65, 447248.44**, X-as **0.312, 0.95008** langs de
nok naar de noordelijke achtergevel; lokale Y linksom. De voet loopt .8 m
onder het straatniveau. Het AHN-DTM geeft circa NAP +.1313 m. Expliciete
straatmonsters vermijden het bordes. Het volledige BAG-pand
**0513100011122752**, inclusief schavot en bordes, wordt vervangen.

De hoofdvorm bestaat uit muren, twee rechte dakvlakken (goot 12.66 m,
nok 21.55 m boven straat), beide trapgevels, twee achtkante arkeltorentjes,
vierkante geveltoren en naald (34.35 m), pinakels, twee grote en acht kleine
dakkapellen, één schoorsteen, dubbele bordestrap, baldakijn en schavot.
De achtergevel en schoorsteen volgen de toestand na de restauratie van
1952; de oude tuitgevel en drie schoorstenen zijn niet overgenomen.

Contour, richting, dakhellingen en hoogten komen uit BAG, orthoHR en AHN
DSM/DTM .5 m (bbox 108450,447180,108570,447310; 9 oktober 2026). Spitstoppen
zijn boven de rasterpunten geëxtrapoleerd. Vensters, pinakels, kleine
kapelletjes, leeuw, klokkenkast en baldakijn zijn op basis van RCE-foto's
vereenvoudigd; geen opmeting van deze details. Windvanen, fijne roeden,
balusters en beeldhouwwerk onder .9 m zijn weggelaten. Het schavot heeft
blinde nissen in plaats van vlakke open korfbogen. De trappen hebben een
volle draagkern en het baldakijn dikke zijsteunen voor printen zonder
losse steun op 1:1000.

Controle: één verbonden volume, Manifold `NoError`, 2992 driehoeken,
7610 m³, STL 42.68 × 13.76 × 35.15 mm. Printpipeline op 1:1000: `NoError`,
7829 → 7845 mm³, .2% overhangopvulling. Catalogus/API/regressie en drie
QA-exporttests: **278 tests groen**. Volledige preview en 3MF van een
80 × 80 m uitsnede: 58 objecten, 16108 driehoeken, 80 × 80 × 36.2 mm.
Vier schuine zijderenders naast de PDOK-reconstructie en referentiefoto's
zijn gecontroleerd. De PDOK-reconstructie mist de spitse torens en
trapgevels. De eigen controlekaart is
[Gouda](http://localhost:3016/kaart/52.01165254/4.71053866/160/1x1/0).

Bronnen: [Rijksmonument 16843](https://monumentenregister.cultureelerfgoed.nl/monumenten/16843),
[RCE/Denslagen 2001, tekst en doorsneden Warffemius](https://www.dbnl.org/tekst/dens002goud01_01/dens002goud01_01_0015.php),
[voor/links RCE 20359142](https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_en_linker_zijgevel_-_Gouda_-_20359142_-_RCE.jpg),
[voor/rechts RCE 20359148](https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_en_rechter_zijgevel_-_Gouda_-_20359148_-_RCE.jpg),
[achtergevel RCE 20379848](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_achtergevel_met_trapgevel_-_Gouda_-_20379848_-_RCE.jpg).
Foto's en tekeningen dienen als visuele referentie; de modelgeometrie is
zelf opgebouwd uit bouwdelen en vlakken.
