# Doopgezinden gemeente Feanwalden

Zaalkerk uit 1865 aan de Zuiderweg in Feanwâlden, met zadeldak, voorgevelruiter en lagere aangebouwde dwarsvleugel. Het model vervangt BAG-pand `1891100001636893`.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1891100001636893): plattegrond, oriëntatie en dakvlakken; maaiveld NAP +1,896 m, hoofdnok NAP +11,496 m; AHN5-bron met 99,9% geldige meetcellen.
- [AHN-DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): controle op hoogten; rond de gevelruiter zijn metingen tot NAP +14,50 m gevonden.
- [DBNL, Noordelijk Oostergo, afb. 290](https://www.dbnl.org/tekst/berg229noor03_01/berg229noor03_01_0017.php): historische exterieurfoto, beschrijving en bouwjaar.
- PDOK 3D: reconstructie vanuit vier kijkrichtingen vergeleken met het model en de historische foto.

De hoofdvorm is circa 16,5 × 18,1 m, exclusief terrein. De gevelruiter is voor 1:1000 verbreed; de spits, vensteruitsparingen, lage vleugelkap en achteraanbouw zijn vereenvoudigd of geschat. Het fijne lijstwerk en de openingen in de ruiter zijn weggelaten. Het puntje van de spits is door beperkte AHN-resolutie geschat.

## Bestanden en controles

- `doopgezinden-gemeente-feanwalden.glb` en `.json`: model en plaatsing.
- `doopgezinden-gemeente-feanwalden-1-1000.stl`: printbestand voor 1:1000.
- `doopgezinden-gemeente-feanwalden-1-100.stl`: printbestand voor 1:100.
- `scripts/generate-doopgezinden-gemeente-feanwalden.mjs`: reproduceerbare vlakken- en bouwdelenopbouw.

De gegenereerde mesh is één verbonden gesloten solid (genus 0). De voorgevel met gevelruiter is op de foto gecontroleerd; de gehele massa is vanuit vier kanten naast de PDOK-reconstructie weergegeven.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
