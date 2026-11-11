# PKN-kerk (Venhuizen)

Een printbaar model van de Hervormde (PKN-)kerk aan de Kerkweg in Venhuizen: een laatgotische eenbeukige kruiskerk met vijfzijdig gesloten koor. Het schip werd in 1875 ingekort en kreeg toen een nieuwe westgevel met een half ingebouwde toren (ontwerp T.C. van der Sterr). Na de brand van 2003 zijn kap en gewelven in 2004 gereconstrueerd. Rijksmonument 37126.

## Bestanden

- `pkn-kerk-venhuizen.glb`: gesloten model in meters, Y omhoog, één node `building:kerk`.
- `pkn-kerk-venhuizen.json`: catalogusitem; vervangt BAG-pand 0498100000007309.
- `pkn-kerk-venhuizen-1-100.stl` en `pkn-kerk-venhuizen-1-1000.stl`: printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-pkn-kerk-venhuizen.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (143395, 520066) bij de viering, op maaiveld (NAP −0,11 m). De lokale X-as (0,99988; −0,01571) loopt langs de nok van schip en koor naar het oosten (−0,9 graden, gemeten aan de muren in de BAG en de dakvlakken van de 3D BAG); Y wijst naar het noorden. De onderkant ligt vlak op −0,5 m; `groundOffsetMetres` is −0,2 omdat het maaiveld rond de kerk vlak is (AHN-DTM op de negen exportpunten −0,14 tot +0,24 m).

## Onderdelen

- Schip en koor als één lichaam: muren tot de goot op NAP +8,4 m, zadeldak (54 graden) tot de nok op NAP +17,05 m, koorsluiting met vijf dakschilden.
- Dwarsschip (26,5 × 10,9 m) met topgevels en een nok op NAP +17,25 m (58 graden).
- Steunberen met schuine afdekking langs schip en koor, radiale beren op de hoeken van de koorsluiting, diagonale hoekberen aan het dwarsschip, de westhoeken van het schip en de toren.
- Plint van 0,25 m met schuine kraag tot NAP +1,6 m.
- Toren (4,8 m) in drie geledingen (NAP +16,1 en +19,7 m), kroonlijst op een schuine kraag tot NAP +22,7 m, achtzijdige naaldspits tot NAP +37,2 m met vier dakkapellen.
- Blinde spitsboognissen (0,3–0,35 m) voor de vensters van schip, koor en koorsluiting, het grote middenvenster en twee zijnissen en een topnis in elke dwarsschipgevel, de ingang en galmgaten (in paren) van de toren.

## Geschat en weggelaten

Gemeten: voetafdruk, steunbeerposities en torenmaat uit de BAG; goot, nokken en dakhellingen uit 3D BAG en AHN5-DSM; spitshoogte uit het AHN5-DSM (36,7 m op 0,5 m raster, de punt is iets hoger geschat). Geschat uit foto's: de hoogtes van de torengeledingen, de kroonlijst, maat en plaats van de dakkapellen en alle venster- en nismaten. Weggelaten (kleiner dan 0,9 m of plat): maaswerk, oculi in de topgevels, wijzerplaten, gootlijst, windvaan en kruis.

## Controle

De generator levert één gesloten component met genus 0. De catalogus- en printtest (`PKN-kerk Venhuizen catalogue and print test` in de webshop) slaagt: plaatsing via de catalogus, één solid en minder dan 3 % extra volume bij 45 graden printbare overhang. Renders van vier kanten zijn naast de 3D BAG-reconstructie en de RCE- en Commons-foto's gelegd. Op de kaart nakijken: de plaatsing van de toren tegen de westgevel en de hoogte van de spits.

## Bronnen

- [BAG / 3D BAG pand 0498100000007309](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0498100000007309)
- [Rijksmonumentenregister 37126](https://monumentenregister.cultureelerfgoed.nl/monumenten/37126)
- [Wikimedia Commons, Nederlands Hervormde Kerk Venhuizen](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Venhuizen)
- [OpenStreetMap way 275529242](https://www.openstreetmap.org/way/275529242)
- [AHN hoogtegegevens](https://www.ahn.nl/dataroom) (DSM als controle van nokken en spits, DTM voor het maaiveld)
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0)
