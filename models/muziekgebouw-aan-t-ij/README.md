# Muziekgebouw aan 't IJ

Muziekgebouw met glazen foyer, 19 m dakluifel met gesloten 45-graden onderzijde, Bimhuis op schuin voetvolume, restaurantplint, entreetrappen, glasnissen, daklijst en installaties. Behoudt de verbindingsvolumes tot lokale X=40.5; het hotel staat apart in movenpick-amsterdam zonder overlappend volume. +X RD -16,2 graden, z=0 NAP +1,0 m; diepe voet -1,5 m aan de kade.

## Meetstelsel en afmetingen

Oorsprong RD [122753.33449981491,487918.5885706783], X-as [0.9602936856769431,-0.2789911060392293]. Model z=0: NAP 1 m. Maaiveldpunten [[-60,-34],[-20,-45],[8,-32]]; offset -0.3 m. Vervangt NL.IMBAG.Pand.0363100012118833.

Gemeten architectuurhoogtes (NAP, meter):

```json
{
  "groundNapM": 1,
  "mainRoofNapM": 26.34,
  "mainRoofPlantNapM": 27.24,
  "bimhuisRoofNapM": 21.35,
  "bimhuisUndersideEstimatedNapM": 8.1,
  "canopyProjectionM": 19.27,
  "sharedHotelBoundaryLocalXM": 40.5
}
```

## Modelopbouw en vereenvoudigingen

Benoemde bouwdelen, gevelprofielen en doorlopende dakvlakken; geen gestapelde hoogtelagen. Glas en diepe open ruimten zijn gesloten voor steunloos printen op 1:1000. Ondiepe nissen behouden de gevelherkenning.

Geschat of vereenvoudigd: Het glasrooster, de traptreden en kleine installaties zijn foto-/orthoschattingen. De onderzijde van de 19,27 m dakluifel en het Bimhuis zijn gesloten 45-graden volumes voor steunloos printen; de Bimhuis-onderkant is op NAP 8,1 m geschat. Letters, dunne kolommen en glas zijn vereenvoudigd. Het hotel binnen hetzelfde BAG-pand is op 14 oktober 2026 afgesplitst naar movenpick-amsterdam, met eigen horizontale gevelbanden, lobby en dakmachine. Dit model eindigt exact op lokale X=40.5, het hotel begint daar; oorsprong, as, terreinpunten en offset blijven gelijk. De test controleert dat het intersectievolume nul is en dat beide modellen samen geplaatst worden.

## Controle

- Gerichte geometrie- en regressietest in tests/landmark-models.test.ts geslaagd; gesloten Manifold, verbonden model, plaatsing op straatmaaiveld en steuncontrole bij 45 graden.
- Opnieuw gecontroleerd in de volledige uitsnede van 210 × 210 m op 1:1000 samen met Mövenpick; binaire preview met 118 objecten en 54.666 driehoeken geslaagd.
- De regressietest van dit model controleert opnieuw de gesloten Bimhuis- en luifelgeometrie en minder dan 4% extra volume door het 45-graden steunprofiel.
- Vier renders (−35°, 55°, 145°, 235°) van het gezamenlijke complex naast de oorspronkelijke PDOK-reconstructie en drie schuine Arcam-fotos beoordeeld; het hele complex valt binnen de preview.
- Landmark uit/aan op de kaart gecontroleerd; omringende panden en maaiveld beoordeeld.
- GLB, JSON en STL byte-identiek na opnieuw genereren.

[Controle op de kaart](http://localhost:3000/kaart/52.3781876/4.9136266/600/1x1/106.2?theme=thema-polder-8&base=road&size=190&z=1)

Onderzoeksbestanden, bronfoto’s, renders en tijdelijke preview-export staan buiten beide repositories, in de lokale visualisatie-werkmap onder muziekgebouw-aan-t-ij.

## Bestanden en generatie

```sh
node scripts/generate-muziekgebouw-aan-t-ij.mjs
```

muziekgebouw-aan-t-ij.glb (meters, glTF Y omhoog), muziekgebouw-aan-t-ij.json (catalogus en bronvermelding), muziekgebouw-aan-t-ij-1-1000.stl (millimeters, Z omhoog). Generator gebruikt het bestaande efteling-kit.mjs.

## Bronnen

- PDOK BAG/BGT 0363100012118833, AHN DSM/DTM 0,5 m en ortho, 11 oktober 2026
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012118833
- https://3xn.com/project/muziekgebouw
- https://www.muziekgebouw.nl/nl/ontwerp-gebouw-en-zaal-m98x
- https://commons.wikimedia.org/wiki/Category:Muziekgebouw_aan_'t_IJ
- [File:Muziekgebouw (music building) at the IJ Amsterdam with restaurant Zouthaven - panoramio.jpg](https://commons.wikimedia.org/wiki/File%3AMuziekgebouw_(music_building)_at_the_IJ_Amsterdam_with_restaurant_Zouthaven_-_panoramio.jpg) — Henk Monster, CC BY 3.0
- [File:Bimhuis by day.JPG](https://commons.wikimedia.org/wiki/File%3ABimhuis_by_day.JPG) — Tjako van Schie, CC BY-SA 3.0

BAG/BGT/AHN/ortho: PDOK. 3D BAG dakgeometrie: CC BY 4.0, TU Delft/3D Geoinformation. Foto’s uitsluitend als controlebron gebruikt; niet meegeleverd in het model.
