# Kasteel Middachten (De Steeg)

Het huidige hoofdgebouw met vier risalieten en de hoofdbrug naar de voorburg. Bouwhuizen, tuinen en de westelijke tuinbrug blijven PDOK-objecten.

## Bestanden

- `kasteel-middachten.glb`: meters, glTF Y omhoog; `building:kasteel`, `building:brug`, `road:erf op brug`.
- `kasteel-middachten.json`: RD-plaatsing, waterbemonstering, BAG-vervanging.
- `kasteel-middachten-1-1000.stl`: millimeters, Z omhoog, één verbonden stuk; geen grondplaat nodig.
- Herbouw: `node scripts/generate-kasteel-middachten.mjs --components` in nederprint-landmarks; `--out` wijst naar de catalogusmap.

## Plaatsing en gemeten bouwdelen

Oorsprong RD `[201850,448073]`; +X −10° in RD langs de gevel, +Y 90° linksom. BAG-pand `0275100000018888` wordt vervangen. De hoofdcontour is circa 30,4 × 30,7 m, met risalieten aan vier zijden. Het schuin toelopende onderhuis heeft een 0,45 m bredere voet.

Referentie is water NAP +10,19 m. Er zijn geen bruikbare AHN-waterretouren; afgeleid uit PDOK-water 53,80 m minus de lokale mediaan van PDOK-LoD2 versus AHN (43,616 m). De drie waterbemonsteringspunten `[-21,0]`, `[21,0]`, `[0,-22]` geven PDOK 53,79–53,82 m. Terugval 53,80 m; geen extra verticale verschuiving. De onderkant zit 0,80 m onder het water en er is geen dubbel terrein.

Naast het BAG-gebouw bevat PDOK een foutief opgehoogd BGT-pandvlak **G0275.7fdb612465a0483b8ec5712ddfb46d47** (`_3df_id: 01KPKJZYS1HWKF4DWBMDC8ZDHW`). Dat terrein loopt binnen de hoofdgebouwcontour tot ellipsoïdehoogte 74,50 m en stak door de vensternissen en ondergevels. Alleen dit vlak staat in `replacesTerrain`, in JSON én generator. Het doorlopende erf, de voorburg en het grachtwater blijven PDOK-objecten. De geometrie, plaatsing en printbestanden van het kasteel zijn hiervoor niet veranderd.

| Deel | Hoogte NAP | Herkomst |
| --- | --- | --- |
| Goot | 27,70 m | AHN 0,5 m / foto |
| Afgeplat schilddak | 32,12 m | AHN, groot vlak plateau |
| Zijrisalietdak / parapet | 27,95 / 28,95 m | AHN; parapethoogte foto geschat |
| Noord- en zuidrisalietnok | 32,10 m | AHN / foto |
| Lichtkoepel boven trappenhuis | 33,70 m | AHN en luchtfoto; facetten geschat |
| Acht schoorstenen | 34,30–34,50 m | AHN, posities uit luchtfoto |
| Brugdek | 15,25–19,00 m | AHN-profiel 15,25–16,70 m; kort bordes verhoogd voor PDOK-terrein |

Dakvlakken zijn schuine vlakken boven bouwdeelpolygonen met een horizontale afplatting, geen hoogtelagen. De lichtkoepel heeft acht facetten. Verder: vijf kapellen, polygonale segmentbekroning op de voorgevel, vier ingangspilasters, afgeschuinde lijsten, drie raamrijen, zijvensters in risalieten en vier vereenvoudigde vazen op brugpijlers.

## Brug en printvereenvoudigingen

De actuele BGT registreert deze hoofdbrug in `onbegroeidterreindeel` **erf** `G0275.fa324ffa3ff3471c9e82ee2e353e0f79`, niet als afzonderlijk wegdeel of overbruggingsdeel. De erfgrens geeft de brugcontour met verbrede uiteinden. Het afzonderlijke dek bevat daarom het werkelijke attribuut `bgt_fysiekvoorkomen: erf`; geen verzonnen `bgt_functie`. De deklaag is 0,50 m dik en los van de dragende brugconstructie, met een kleine marge op de snijstrook tegen restvlakken. `replaces-terrain.mjs` vindt hier geen te vervangen dekplaat; de westelijke tuinbrug valt buiten het landmark.

Het PDOK-erf loopt door onder het bordes en de voorburg en kan niet als geheel worden vervangen. Bij de ingang ligt het plaatselijk tot ellipsoïdaal 61,855 m, circa 2 m boven het AHN-brugprofiel. Daarom loopt het korte aanloopdeel van NAP 19,00 via 18,80 naar 17,50 m af; het middendeel volgt 16,70 m en het landuiteinde 15,25 m. Deze geschatte verhoging geeft circa 0,6 m marge boven PDOK en moet op de kaart worden beoordeeld. De vier pijlers/vazen volgen de plaatselijke dekhoogte.

De brede ronde brugboog is versmald tot een centrale puntboog van 55° met de aanzet onder water, omdat de oorspronkelijke brede boog op 1:1000 onvoldoende steil is voor steunvrij printen. Ook het kleine gewelf onder het bordes is puntig. Deze afwijking moet bij review worden beoordeeld. De metalen balustrade is kleiner dan 0,9 m en weggelaten. De vazen zijn vereenvoudigde vaste volumes zonder oren of losse sculptuur. Vensternissen zijn 0,35 m diep; roeden, wapens, beeldhouwwerk, consoles van de kleine balkons en fijne kroonlijstdetails ontbreken. Zijparapetten zijn naar binnen verdikt tot 0,9 m. Kapellen zijn bijgesneden op het pandplan.

## Controle

- Generator: alle onderdelen `NoError`, genus 0; geen interne holtes; Float32-rondgang gesloten en volume binnen 0,2%.
- STL: één verbonden volume, 2.118 driehoeken, 16,96 cm³, 31,3 × 56,8 × 25,1 mm op 1:1000.
- Printsteuncontrole: brug en dek `extraPct` praktisch 0; kasteel −0,1185% door het verwijderen van overlap bij het bordes, geen toegevoegde steunwand.
- Verticale stralen op 5.640 punten over het hele dek: dikte minimaal 0,500 m, nul samenvallende bovenvlakken van brugconstructie en wegdek binnen 1 cm.
- AHN-vergelijking op 3.671 gebouwcellen: 75,3% binnen 1 m, 87,3% binnen 2 m, mediane afwijking 0,43 m. Printvereenvoudigingen en details uit foto zijn expliciet.
- Vier gelijke schuine camera's naast PDOK en RCE-foto's gecontroleerd; op elke zijde extra nissen, kapellen, gevelgeleding, parapetten of brugdetails. PDOK mist de hoofdbrug.
- Echte preview / 3MF 120 × 120 m op 1:1000: geheel past, 120 × 120 mm, hoogte 25,6 mm. Water blijft aanwezig, brug bereikt de voorburg.
- Terreinregressie (10 oktober 2026): beide delen van het foutieve pandvlak uit de twee PDOK-terreintegels verdwijnen in de export; grachtwater en noordelijk voorburgerf behouden hun oorspronkelijke objectaantallen. De volledige 120 × 120 mm preview/3MF is opnieuw geëxporteerd en gecontroleerd.
- Monumenttest plus beide landmarksuites: 307 tests groen, inclusief de terreinvervanging.
- [Controlekaart](http://localhost:3063/kaart/52.0190283/6.0697280/240/1x1/0): controleer de brugboog en aansluiting op de voorburg, de zijparapetten en de ingang; `landmarks=0` geeft het PDOK-hoofdgebouw terug.

## Bronnen

- [RCE hoofdgebouw 515228](https://monumentenregister.cultureelerfgoed.nl/monumenten/515228): dak, vier risalieten, venstertraveeën, ingang en centraal trappenhuis.
- [RCE brug 515235](https://monumentenregister.cultureelerfgoed.nl/monumenten/515235).
- [Commons Kasteel Middachten](https://commons.wikimedia.org/wiki/Category:Kasteel_Middachten): RCE `20265123` voor/rechts, `20265089` links/brug, `20265118` achter en `20265856` rechterzijde/brug; Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 3.0 NL, zie bestandspagina's.
- PDOK BAG WFS, Actueel_orthoHR, AHN DSM/DTM 0,5 m, BGT OGC API en 3D Basisvoorziening, 9 oktober 2026.
