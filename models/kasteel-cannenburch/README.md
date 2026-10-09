# Kasteel Cannenburch (Vaassen)

`kasteel-cannenburch.glb` is de catalogusbron in meters (glTF Y omhoog),
`kasteel-cannenburch.json` bevat georeferentie, bronnen en vervangingsids,
`kasteel-cannenburch-1-1000.stl` is de gezamenlijke print in millimeters,
Z omhoog: 34,6 × 45,5 × 29,6 mm, 12,12 cm³, 2.686 driehoeken.
Reproduceren: `node scripts/generate-kasteel-cannenburch.mjs`;
`--out` is een catalogusmap, `--scale` de STL-schaal.

Oorsprong RD (194435; 478398,5), op het water. +X langs de voorgevel,
-2,21 graden ten opzichte van RD-X (nokrichting gemeten in AHN); +Y noordwaarts.
De voet ligt 0,8 m onder het water. AHN heeft geen waterretour in deze gracht;
NAP +13,21 m is afgeleid uit PDOK-water (ellipsoïdisch 56,35 m) minus het
lokale hoogteverschil van 43,14 m tussen PDOK-LoD2 en AHN. Drie waterpunten
bepalen de plaatsing, met 56,35 m als fallback.
Vervangt BAG `0232100000014978`; de twee bouwhuizen blijven PDOK.

Onderdelen: twee aansluitende schilddaken (hoofdzaalnok NAP +36,15 m,
oostvleugel +36,10 m), drie vierkante hoektorens met schilddak (zuidwest
+29,05 m, noordwest +26,45 m, zuidoost +32,95 m), noordoosttoren met
achtkantig uivormig dak tot +37 m en ingangstoren tot +42 m. De ingangstoren
heeft vier topgevels, acht hoekpinakels op schuine voeten en geledingen;
de huidige ingang daarnaast heeft een risaliet en fronton. Vijf
schoorstenen, negen dakkapellen, ondiepe rechthoekige vensternissen,
hoekplinten, bordes, trap en balustrade als 0,9 m dikke stenen muur.
Alle daken bestaan uit vlakken en geledingen, zonder hoogteplakken.

Geschat uit foto's en AHN: uiprofielen en de hoogste punten (AHN mist de
punten), gevelindeling, topgevels, pinakels, dakkapellen, fronton, brugbogen,
trap en balustrade. Weggelaten: vlaggenstok, windvanen, beeldhouwwerk,
balusters, luiken, kozijnen en metalen brugleuning: kleiner dan 0,9 m;
de balustrade is verdicht voor de print. Onzichtbare raamholtes op gevels
die door aangrenzende bouwdelen worden bedekt zijn gevuld.

Nodes `building:kasteel`, `building:brug en bordes`, `road:voetpad`.
De brug ligt links naast de ingangstoren; contour uit actueel BGT-wegdeel
`G0232.12c689e424a945d1aae3a8d9db53a357`, hoogteligging 1, vereenvoudigd
op 5 cm. De bovenste 0,5 m van het dek draagt attributen `voetpad` /
`open verharding`; de stenen trap aan het kasteeleinde blijft constructie.
Twee bruggewelven zijn verspitst tot 55 graden om zonder steun te printen.
Overbruggingsdeel `G0232.10b22e04f8a64e2d9047095ea308d189` volledig bedekt
en verborgen via `replacesTerrain`.

Controle: NoError en Float32-rondgang voor elk onderdeel, één gezamenlijke
STL zonder binnenholtes (genus 0). Gedeelde ondersteuning op 1:1000 verandert
brug en dek niet; eerste onderdeel -0,14% door verwijderen van overlap aan
het bordes. Nissen zijn 0,35 m diep. Echte preview en 3MF over 100 × 100 m,
alle onderdelen binnen de uitsnede. Monumenttest controleert positie van
beide uien, hoofdzaalnok, beide gewelfpunten, dekhoogte en BGT-attributen.
AHN: 2.549 geldige cellen boven water +3 m, 66,4% binnen 1 m en 81,3%
binnen 2 m; verschillen bij dakkapellen, schoorstenen, dakranden en torens.
Vier kanten tegenover PDOK: noord heeft uivormige bekroning, dakkapellen,
vensters en schoorstenen; oost gevelnissen en torengeledingen; zuid de
topgevels op de ingangstoren, risaliet, bordes en brug; west de onderscheiden
schilddaken en geveldetails. Foto's en controlebeelden staan buiten de repo.

Bronnen (9 oktober 2026): [register 520122](https://monumentenregister.cultureelerfgoed.nl/monumenten/520122),
[Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_De_Cannenburch), PDOK BAG,
AHN DSM/DTM 0,5 m, Actueel_orthoHR, BGT OGC API, [Commons/RCE](https://commons.wikimedia.org/wiki/Category:Cannenburgh):
voorgevel 20306670, voorgevel/linkerzijde 20306672, zijgeveldetail 20424442
en zijgevel/achtergevel/gracht 20238679 (oorspronkelijke Commons-licenties).
