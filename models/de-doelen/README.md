# De Doelen

Volledige BAG-contour van De Doelen inclusief Grote Zaal met asymmetrische hellende kap, kleinere zaal, lagere foyers, dakterrassen, noordfoyer en hoge congresvleugel met hellende dakopbouw. Gesloten bouwvolumes, glasnissen, paneelrelief, entree en ronde trapkern. +X RD 17,5 graden, z=0 NAP -1,3 m; voet -0,7 m.

## Meetstelsel en afmetingen

Oorsprong RD [92087.12170681679,437451.79290749785], X-as [0.9537169507482269,0.3007057995042731]. Model z=0: NAP -1.3 m. Maaiveldpunten [[75,0],[70,-35],[0,-50]]; offset -0.3 m. Vervangt NL.IMBAG.Pand.0599100000700228.

Gemeten architectuurhoogtes (NAP, meter):

```json
{
  "groundNapM": -1.3,
  "groteZaalRidgeNapM": 27.69,
  "groteZaalSouthEaveNapM": 21.4,
  "groteZaalNorthEaveNapM": 18.47,
  "smallHallTopNapM": 24.63,
  "foyerRoofNapM": 11.5,
  "congressRoofNapM": 43.04,
  "congressRoofPlantNapM": 48.89
}
```

## Modelopbouw en vereenvoudigingen

Benoemde bouwdelen, gevelprofielen en doorlopende dakvlakken; geen gestapelde hoogtelagen. Glas en diepe open ruimten zijn gesloten voor steunloos printen op 1:1000. Ondiepe nissen behouden de gevelherkenning.

Geschat of vereenvoudigd: Vensterritme, ondiepe gevelnissen, dakroeden, trapkernstraal en entreeluifel naar fotos vereenvoudigd; glasruimten en doorgangen gevuld, dunne kolommen en belettering weggelaten. Groene dakterrassen volgen het dakvlak zonder losse vegetatie. Alle dakvlakken volgen BAG/3D BAG en AHN; nulvolume-snijrestjes verwijderd.

## Controle

- Gerichte geometrie- en regressietest in tests/landmark-models.test.ts geslaagd; gesloten Manifold, verbonden model, plaatsing op straatmaaiveld en steuncontrole bij 45 graden.
- Volledige uitsnede 190 × 190 m op exact 1:1000 geëxporteerd met createModelBundle; binaire preview en 3MF geslaagd.
- Toegevoegd volume door 45-graden steunprofiel: 0.004%.
- Vier renders (−35°, 55°, 145°, 235°), naast de oorspronkelijke PDOK-reconstructie en twee schuine bronfoto’s beoordeeld; hele model in preview gecontroleerd.
- Landmark uit/aan op de kaart gecontroleerd; omringende panden en maaiveld beoordeeld.
- GLB, JSON en STL byte-identiek na opnieuw genereren.

[Controle op de kaart](http://localhost:3000/kaart/51.9219850/4.4726400/600/1x1/72.5?theme=thema-polder-8&base=road&size=190&z=1)

Onderzoeksbestanden, bronfoto’s, renders en tijdelijke preview-export staan buiten beide repositories, in de lokale visualisatie-werkmap onder de-doelen.

## Bestanden en generatie

```sh
node scripts/generate-de-doelen.mjs
```

de-doelen.glb (meters, glTF Y omhoog), de-doelen.json (catalogus en bronvermelding), de-doelen-1-1000.stl (millimeters, Z omhoog). Generator gebruikt het bestaande efteling-kit.mjs.

## Bronnen

- PDOK BAG/BGT 0599100000700228, AHN DSM/DTM 0,5 m en ortho, 11 oktober 2026
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000700228
- https://www.dedoelen.nl/nl/geschiedenis-b51d
- https://www.dedoelen.nl/en/green-and-biodiverse-roof-at-de-doelen-completed-5qsb
- https://commons.wikimedia.org/wiki/Category:De_Doelen_Rotterdam
- [File:Rotterdam de doelen2.jpg](https://commons.wikimedia.org/wiki/File%3ARotterdam_de_doelen2.jpg) — Wikifrits, Public domain
- [File:Overzicht voorgevel en rechter zijgevel en buurpand - Rotterdam - 20357646 - RCE.jpg](https://commons.wikimedia.org/wiki/File%3AOverzicht_voorgevel_en_rechter_zijgevel_en_buurpand_-_Rotterdam_-_20357646_-_RCE.jpg) — A. J. van der Wal, CC BY-SA 4.0

BAG/BGT/AHN/ortho: PDOK. 3D BAG dakgeometrie: CC BY 4.0, TU Delft/3D Geoinformation. Foto’s uitsluitend als controlebron gebruikt; niet meegeleverd in het model.
