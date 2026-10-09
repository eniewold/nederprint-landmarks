# Kasteel Bouvigne (Breda)

Bestanden: `kasteel-bouvigne.glb` (meters, glTF Y omhoog),
`kasteel-bouvigne.json` (RD-georeferentie en bronnen) en
`kasteel-bouvigne-1-1000.stl` (millimeters, Z omhoog, 19,9 × 36,0 × 24,7 mm).
Reproduceren: `node scripts/generate-kasteel-bouvigne.mjs`; `--out` wijst naar
een catalogusmap en `--scale` verandert de losse STL-schaal.

Oorsprong RD (113136,65; 397249,62) op het water, NAP +1,16 m. +X loopt
11,23 graden linksom vanaf RD-X langs de zuidgevel; +Y naar het noorden.
De voet loopt 0,8 m onder het water. Drie waterpunten rondom het kasteel
bepalen de kaartplaatsing; fallback is ellipsoïdisch 45,6 m.
Vervangt BAG `0758100000069496`; de bijgebouwen blijven PDOK.

Het kasteel bestaat uit vijf dakvlakken (schilddak met dakplat), de
achthoekige noordwesttoren met uitlopende dakvoet, holle spits en gedraaide
peer, het zuidportaal met eigen kap, vier schoorstenen, twee noordelijke
dakkapellen plus één in elk zijdak, plint, kroonlijst, torengeledingen en blinde gevelnissen.
De oostgevel heeft twee bovenvensters en één benedenvenster. De brug heeft
drie doorlopende spitse gewelven; de echte ronde bogen zijn voor 1:1000
verspitst tot 55 graden. Eindpijlers zijn minimaal 0,9 m breed.

Hoogtes uit AHN DSM 0,5 m: goot +11,82 m, dakplat +15,65 m, torenschacht
+18,35 m en brugdek +3,24 m NAP. De torenpeer tot +25,1 m, profiel van de
spits, gevelindeling, kroonlijsten, dakkapellen, brugbogen en schoorsteenmaten
zijn uit de foto's en AHN geschat. Nissen zijn 0,32–0,35 m diep. Weggelaten:
vlaggenstok, ijzeren brugleuningen, kozijnen, luiken, vensterroeden en
windvaan; vrijstaande delen zijn smaller dan 0,9 m. Geen hoogteplakken.

Nodes: `building:kasteel`, `building:brug` en `road:voetpad`. De bovenste
0,5 m van het centrale voetpad is uit de brugconstructie gesneden; geen
dubbele bovenvlakken. De actuele BGT levert geen verhoogd wegdeel op deze
brug: attributen `voetpad` / `open verharding` komen van aansluitend voetpad
`G0758.745908b813744758a6b26923d291c4a5`. Het volledig bedekte
overbruggingsdeel `G0758.4c9db7c56d8a4228b136cc656dc411fd` wordt verborgen.

Controles: alle onderdelen NoError, gesloten Float32-rondgang; de gezamenlijke
STL is één volume zonder binnenholtes (genus 0, 2.136 driehoeken, 3,93 cm³).
Op 1:1000 voegt de ondersteuning van de ondiepe vensternissen 0,04% volume
toe; gedeelde ondersteuning laat brug en voetpad ongewijzigd. De wijziging
van het eerste onderdeel is -0,06% doordat de overlap met de brug aan het
portaal wordt verwijderd. De echte preview/export beslaat 80 × 80 m, met
het hele kasteel en de brug binnen de uitsnede. De monumenttest controleert
plaatsing, torentop, dakplat, drie gewelfpunten, waterbemonstering en dekklasse.
AHN-check: 1.090 geldige cellen boven water +3 m; 57,1% binnen 1 m,
84,6% binnen 2 m. Afwijkingen vooral langs toren, dakkapellen en dakranden.
Vier schuine controles tegenover PDOK: noordzijde heeft dakkapellen en
torengeledingen; oostzijde de afwijkende nissenindeling en schoorstenen;
zuidzijde het portaal en de driegewelvenbrug; westzijde nissen, plint en
torenpeer. De fotovergelijking en controlebeelden blijven buiten de repo.

Bronnen (9 oktober 2026):

- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/529854)
- [Wikipedia](https://nl.wikipedia.org/wiki/Kasteel_Bouvigne)
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000069496)
- PDOK BAG, AHN DSM/DTM 0,5 m, Actueel_orthoHR en BGT OGC API.
- [Renée Kools, zuidwestaanzicht 2025, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Breda_Kasteel_Bouvigne_2025-06-30-1.jpg)
- RCE: [achtergevel](https://commons.wikimedia.org/wiki/File:Achtergevel_en_onderste_deel_toren_-_Ginneken_-_20324179_-_RCE.jpg), [westzijde](https://commons.wikimedia.org/wiki/File:Toren_en_zijgevel_links_-_Ginneken_-_20324181_-_RCE.jpg), [oostzijde](https://commons.wikimedia.org/wiki/File:Zijgevel_rechts_-_Ginneken_-_20324180_-_RCE.jpg).
