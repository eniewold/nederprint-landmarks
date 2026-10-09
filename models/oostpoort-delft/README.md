# Oostpoort (Delft)

Gesloten landmarkmodel van de landpoort, twee torens, traptoren, overdekte stadsmuur, waterpoort en lage westelijke uitbouw. De afzonderlijke ophaalbrug blijft onderdeel van PDOK.

## Bestanden

- `oostpoort-delft.glb`: meters, Y omhoog, node `building:landpoort, torens, stadsmuur en waterpoort`.
- `oostpoort-delft.json`: plaatsing, bronnen en vervanging van BAG-pand `0503100000032633`.
- `oostpoort-delft-1-1000.stl`: één verbonden solid, millimeters op 1:1000, vlakke onderkant.
- Generator: `../../scripts/generate-oostpoort-delft.mjs`.

## Maten en plaatsing

RD-oorsprong `(85070.515, 447428.705)` ligt tussen de landpoorttorens; maaiveld NAP +0,40 m. Lokale X-as `(0.94732, -0.32029)` wijst naar de veldzijde. De landpoortnok staat dwars op die as, parallel aan de lijn tussen de torens. De onderkant ligt 0,8 m onder straatniveau; bemonsteringspunten staan op straat, buiten het water.

BAG en de actuele PDOK-luchtfoto bepalen de contour en torenposities. AHN DSM/DTM van 0,5 m bepaalt hoogten en dakprofielen: torendiameter 3,84 m, hartafstand 7,34 m, torenspits 24,92 m boven straat, landpoortnok 11,45 m en waterpoortnok 6,63 m. De lage westelijke uitbouw volgt de BAG-contour en een AHN-dakhoogte rond NAP +3,4 m.

## Opbouw en vereenvoudiging

Afzonderlijke muren, cilinders, achtkante bovengeledingen, geknikte spitsvlakken en zadeldakken zijn verenigd; geen gestapelde DSM-hoogtelagen. Ook de stadsmuur heeft een eigen dak, gevelnissen en steunberen. De waterpoort heeft twee grove trapgevels en een doorgaande waterboog. De landpoort heeft een doorgaande opening, topgevel en schoorsteen aan de stadszijde.

De grens tussen ronde en achtkante torengeleding, dakknikken en gedeeltelijk door bomen bedekte waterpoorthoogten zijn uit AHN-randpunten en schuine foto's geschat. Vensters, spaarbogen, steunberen, trapgevels en schoorsteen zijn vereenvoudigd naar de foto's. Beide ronde gewelven zijn vervangen door steile spitse openingen voor steunvrij printen. Nissen zijn 0,35 m diep en circa 0,9 m of breder. Windvanen, baksteenfriezen, raamroeden en goten onder 0,9 m zijn weggelaten.

## Controle

De generator levert één gesloten verbonden manifold, `NoError`, genus 0, 3010 driehoeken; STL-maat 21,75 × 15,60 × 25,72 mm op 1:1000. De werkelijke printvoorbereiding met 45° overhang voegt circa 0,1% volume toe (961 → 963 mm³; afgeronde volumes), uitsluitend kleine nis- en lijstovergangen. De twee doorgangen blijven open.

Regressietest in de webshop controleert de exacte BAG-vervanging, beide spitstoppen, waterpoort, westelijke uitbouw, onderkant en selectiebegrenzing. Alle 273 tests van `landmark-models.test.ts` en `landmark-api.test.ts` slagen.

Vier schuine aanzichten (−35°, 55°, 145°, 235°, elevatie 30°) zijn vergeleken met de oorspronkelijke PDOK-reconstructie en schuine RCE/Commons-foto's. Aan de veldzijde voegen volledige spitsen, geledingen en open landpoort detail toe; aan de waterzijde ook de waterboog en steunberen; aan beide stadszijden de dakvormen, traptoren, schoorsteen, topgevels en uitbouw. PDOK kapt de torenspitsen af.

Een volledige uitsnede van 80 × 80 m is met `createModelBundle` op 1:1000 geëxporteerd: preview en 3MF, 124 objecten, 64044 driehoeken, 80 × 80 × 26,8 mm. Controlebeelden en exports staan buiten de repository. Controlekaart: http://localhost:3014/kaart/52.01081075/4.36862274/120/1x1/0.

## Bronnen

- PDOK BAG WFS, pand `0503100000032633`; actuele orthoHR; AHN DSM/DTM 0,5 m, bbox `85020,447380,85130,447490`, geraadpleegd 2026-10-09.
- https://monumentenregister.cultureelerfgoed.nl/monumenten/11968
- https://commons.wikimedia.org/wiki/File:De_Oostpoort,_Delft.jpg
- https://commons.wikimedia.org/wiki/File:Stadspoort_binnenzijde_-_Delft_-_20325391_-_RCE.jpg
- https://commons.wikimedia.org/wiki/File:Overzicht_stadspoort_buitenzijde_aan_water_-_Delft_-_20322269_-_RCE.jpg
- https://commons.wikimedia.org/wiki/File:Oostpoort,_overzicht_Stadszijde_-_Delft_-_20048592_-_RCE.jpg
