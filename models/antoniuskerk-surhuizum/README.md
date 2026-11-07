# Antoniuskerk (Surhuizum)

Vereenvoudigd landmarkmodel van de Antoniuskerk en de bijna vrijstaande middeleeuwse toren, verbonden door een laag overdekt portaal. De toren heeft acht uitspringende hoeksteunberen en een gemetselde achtzijdige spits; het schip heeft een langsdak en een driezijdige koorsluiting.

## Bestanden

- `antoniuskerk-surhuizum.glb`: gesloten model in meters, voor de kaart en export; één node `building:kerk-en-toren`.
- `antoniuskerk-surhuizum.json`: catalogusgegevens, plaatsing, te vervangen BAG-panden en bronnen.
- `antoniuskerk-surhuizum-1-1000.stl`: los printmodel op 1:1000, in millimeters.
- Generator: `scripts/generate-antoniuskerk-surhuizum.mjs` in de landmarkrepo.

## Plaatsing en opbouw

Oorsprong RD (207755, 580206); lokale X-as [0,95265, 0,30408] loopt langs de kerkas naar het oosten, lokale Y staat daar loodrecht op. Het maaiveld is NAP +2,72 m; de vlakke onderkant van het model ligt 0,5 m lager. Het model vervangt BAG-panden `0059100000837847` (kerk) en `0059100000838057` (toren). Schip en koor zijn prismavolumes met dakvlakken. De toren is een vierkante schacht met afgeschuinde steunberen en vier topgevels, met daarboven de achtzijdige gemetselde spits. De lage verbinding heeft een spits toelopende onderdoorgang. Vensters, deuren, galmgaten en wijzerplaat zijn blinde nissen.

BAG-contouren bepalen de plattegronden en positie van beide panden. De 3D BAG en AHN geven de nok (circa 14,34 m boven maaiveld), goot en torenomhullende; de spitstop is in het model 35,7 m boven maaiveld en uit het AHN afgeleid. De openingen en het profiel van het verbindingsportaal, de steunberen, topgevels, galmgaten en gevelnissen zijn geschat uit foto's. De achtzijdige spits volgt de gemeentelijke erfgoednota. De naaldpunt is voor printbaarheid verbreed tot circa 0,9 m; windvaan, wijzerplaatdetails, kleine ornamenten en vensterroeden zijn weggelaten.

## Controle

De generator meldt `NoError`, één verbonden onderdeel, genus 0 en een grootte van 40,10 × 9,67 × 36,20 m. De gerichte catalogus- en printtest slaagt; op 1:1000 is de volumeverhouding na 45°-overhangverwerking 1,000057. De volledige 150 × 150 m-previewexport op 1:1000 is met en zonder landmark succesvol gemaakt. De vergelijking vanuit vier gelijke schuine hoeken toont dat PDOK de toren slechts tot circa 3 m weergeeft, terwijl het landmark de spits, steunberen en gevelnissen aanvult. De 3MF bevat beide BAG-panden in de PDOK-versie en het volledige landmark in de andere versie.

## Bronnen

- [BAG en 3D BAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0059100000837847), PDOK BAG WFS voor beide panden.
- [AHN DSM 0,5 m via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0) en PDOK luchtfoto Actueel_orthoHR.
- [Rijksmonumentenregister 7051](https://monumentenregister.cultureelerfgoed.nl/monumenten/7051) en [gemeentelijke erfgoednota Achtkarspelen](https://lokaleregelgeving.overheid.nl/CVDR723347).
- [Wikimedia Commons: Antoniuskerk Surhuizum](https://commons.wikimedia.org/wiki/Category:Antoniuskerk,_Surhuizum), foto's van alle zijden en de toren.
