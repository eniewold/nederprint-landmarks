# Monument op de Afsluitdijk

Dudoks D-vormige glazen trappentoren met rechte landzijde, zeshoekige uitkijkpost, tentdak, brede lage luifel, afgeronde bordesplint, balustrade en entree-trap. Glas gesloten en luifels met schuine onderzijde voor steunloos 1:1000. Hele actuele BAG-contour behouden als begraven fundering; nieuwe uitbreiding in de dijk en tijdelijke bouwplaats niet verzonnen. +X RD 41,2 graden; z=0 NAP +4,0 m, voet tot NAP -0,5 m aan het meer.

## Meetstelsel en afmetingen

Oorsprong RD [136307.2817742256,553588.7966657182], X-as [0.7524149088957244,0.6586894601186805]. Model z=0: NAP 4 m. Maaiveldpunten [[-12,8],[12,8],[0,10]]; offset -0.3 m. Vervangt NL.IMBAG.Pand.0462100000006517.

Gemeten architectuurhoogtes (NAP, meter):

```json
{
  "groundNapM": 4,
  "plintNapM": 5.96,
  "bordesPrintableNapM": 6.4,
  "balustradeEstimatedNapM": 7.4,
  "canopyNapM": 8.96,
  "shaftEaveNapM": 20.1,
  "roofPeakNapM": 20.93,
  "finialEstimatedNapM": 21.53
}
```

## Modelopbouw en vereenvoudigingen

Benoemde bouwdelen, gevelprofielen en doorlopende dakvlakken; geen gestapelde hoogtelagen. Glas en diepe open ruimten zijn gesloten voor steunloos printen op 1:1000. Ondiepe nissen behouden de gevelherkenning.

Geschat of vereenvoudigd: De afgeronde plint, traptreden, glasnissen, bekroning en sluitingssteen zijn uit bronbeelden geschaald. Glasroeden zijn samengevoegd tot printbare stijlen; letters en bronzen figuren zijn relief. Luifel en uitkijkpost hebben een gesloten schuine onderzijde. Het bordes ligt 0,44 m boven het gemeten vlak om de PDOK-terreinlaag te bedekken; de balustrade is 1,0 m hoog. Restauratie/nieuwbouw is nog tot 2027 in uitvoering: de bekende toren en bordesopbouw zijn gemodelleerd; de actuele BAG-contour ligt als 1 m dikke voet onder de dijk. Geen tijdelijke steigers of verzonnen toekomstige uitbreiding.

## Controle

- Gerichte geometrie- en regressietest in tests/landmark-models.test.ts geslaagd; gesloten Manifold, verbonden model, plaatsing op straatmaaiveld en steuncontrole bij 45 graden.
- Volledige uitsnede 80 × 80 m op exact 1:1000 geëxporteerd met createModelBundle; binaire preview en 3MF geslaagd.
- Toegevoegd volume door 45-graden steunprofiel: 0.157%.
- Vier renders (−35°, 55°, 145°, 235°), naast de oorspronkelijke PDOK-reconstructie en twee schuine bronfoto’s beoordeeld; hele model in preview gecontroleerd.
- Landmark uit/aan op de kaart gecontroleerd; omringende panden en maaiveld beoordeeld.
- GLB, JSON en STL byte-identiek na opnieuw genereren.

[Controle op de kaart](http://localhost:3000/kaart/52.9689844/5.1089690/250/1x1/48.8?theme=thema-polder-8&base=road&size=80&z=1)

Onderzoeksbestanden, bronfoto’s, renders en tijdelijke preview-export staan buiten beide repositories, in de lokale visualisatie-werkmap onder monument-afsluitdijk.

## Bestanden en generatie

```sh
node scripts/generate-monument-afsluitdijk.mjs
```

monument-afsluitdijk.glb (meters, glTF Y omhoog), monument-afsluitdijk.json (catalogus en bronvermelding), monument-afsluitdijk-1-1000.stl (millimeters, Z omhoog). Generator gebruikt het bestaande efteling-kit.mjs.

## Bronnen

- PDOK BAG/BGT 0462100000006517, AHN DSM/DTM 0,5 m, ortho 11 oktober 2026
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0462100000006517
- https://monumentenregister.cultureelerfgoed.nl/monumenten/510384
- https://deafsluitdijk.nl/projecten/renovatie-vlietermonument-afsluitdijk/
- https://deafsluitdijk.nl/nieuws/vlietermonument-restauratie-bijna-klaar-uitbreiding-eenvoudiger/
- https://commons.wikimedia.org/wiki/Category:Monument_Afsluitdijk
- [File:Abschlussdeich Aussichtsturm.jpg](https://commons.wikimedia.org/wiki/File%3AAbschlussdeich_Aussichtsturm.jpg) — The original uploader was -jha- at German Wikipedia., CC BY-SA 3.0
- [File:OVERZICHT DUDOKMONUMENT - Kornwerderzand - 20266819 - RCE.jpg](https://commons.wikimedia.org/wiki/File%3AOVERZICHT_DUDOKMONUMENT_-_Kornwerderzand_-_20266819_-_RCE.jpg) — A. J. van der Wal, CC BY-SA 4.0

BAG/BGT/AHN/ortho: PDOK. 3D BAG dakgeometrie: CC BY 4.0, TU Delft/3D Geoinformation. Foto’s uitsluitend als controlebron gebruikt; niet meegeleverd in het model.
