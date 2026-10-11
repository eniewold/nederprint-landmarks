# Station Zwolle

Volledige twee BAG-stationsvleugels met hoog middengebouw, klokfronton, kopfrontons, lage zij- en eindvleugels, gesloten gebogen perronkap met lichtstraat, blinde rondboogdeuren, vensters, pilasters en schuine luifel. Vrijstaande kappen en moderne passage blijven afzonderlijk. +X RD -28 graden, z=0 NAP +2,1 m; voet -0,6 m.

## Meetstelsel en afmetingen

Oorsprong RD [202738.58514172834,502228.72691760736], X-as [0.882947592858927,-0.4694715627858908]. Model z=0: NAP 2.1 m. Maaiveldpunten [[-25,12],[22,14],[60,10]]; offset -0.3 m. Vervangt NL.IMBAG.Pand.0193100000060699, NL.IMBAG.Pand.0193100000064248.

Gemeten architectuurhoogtes (NAP, meter):

```json
{
  "groundNapM": 2.1,
  "centralRidgeNapM": 16.06,
  "sideRidgeNapM": 10.51,
  "lowEndRidgeNapM": 9.09,
  "canopyTopNapM": 18.6,
  "frontonTopNapM": 15.7
}
```

## Modelopbouw en vereenvoudigingen

Benoemde bouwdelen, gevelprofielen en doorlopende dakvlakken; geen gestapelde hoogtelagen. Glas en diepe open ruimten zijn gesloten voor steunloos printen op 1:1000. Ondiepe nissen behouden de gevelherkenning.

Geschat of vereenvoudigd: Frontonhoogte 15,7 m naar AHN en foto, luifelonderzijde schuin gesloten; vensterritme, klokdiameter en pilasterrelief naar foto vereenvoudigd. De kap is gevuld tot de voet; dunne stalen spanten en raamroeden ontbreken. Vrijstaande perronkappen en de nieuwe passerelle vallen buiten de twee vervangen BAG-panden.

## Controle

- Gerichte geometrie- en regressietest in tests/landmark-models.test.ts geslaagd; gesloten Manifold, verbonden model, plaatsing op straatmaaiveld en steuncontrole bij 45 graden.
- Volledige uitsnede 180 × 180 m op exact 1:1000 geëxporteerd met createModelBundle; binaire preview en 3MF geslaagd.
- Toegevoegd volume door 45-graden steunprofiel: 0.132%.
- Vier renders (−35°, 55°, 145°, 235°), naast de oorspronkelijke PDOK-reconstructie en twee schuine bronfoto’s beoordeeld; hele model in preview gecontroleerd.
- Landmark uit/aan op de kaart gecontroleerd; omringende panden en maaiveld beoordeeld.
- GLB, JSON en STL byte-identiek na opnieuw genereren.

[Controle op de kaart](http://localhost:3000/kaart/52.5056630/6.0903260/600/1x1/118?theme=thema-polder-8&base=road&size=180&z=1)

Onderzoeksbestanden, bronfoto’s, renders en tijdelijke preview-export staan buiten beide repositories, in de lokale visualisatie-werkmap onder station-zwolle.

## Bestanden en generatie

```sh
node scripts/generate-station-zwolle.mjs
```

station-zwolle.glb (meters, glTF Y omhoog), station-zwolle.json (catalogus en bronvermelding), station-zwolle-1-1000.stl (millimeters, Z omhoog). Generator gebruikt het bestaande efteling-kit.mjs.

## Bronnen

- PDOK BAG/BGT 0193100000060699 en 0193100000064248, BGT overkapping L0004.d9c42d34173c46f6ab44e87c9a67de1e, AHN DSM/DTM 0,5 m, ortho, 11 oktober 2026
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000060699
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000064248
- https://www.spoorbeeld.nl/databank/zwolle
- https://www.zwolle.nl/erfgoed/station
- https://commons.wikimedia.org/wiki/Category:Zwolle_station_facades
- [File:Zwolle, treinstation RM41815 foto7 2016-06-05 09.55.jpg](https://commons.wikimedia.org/wiki/File%3AZwolle%2C_treinstation_RM41815_foto7_2016-06-05_09.55.jpg) — Michielverbeek, CC BY-SA 4.0
- [File:Zwolle, NS station.jpg](https://commons.wikimedia.org/wiki/File%3AZwolle%2C_NS_station.jpg) — Mpol, CC BY-SA 4.0

BAG/BGT/AHN/ortho: PDOK. 3D BAG dakgeometrie: CC BY 4.0, TU Delft/3D Geoinformation. Foto’s uitsluitend als controlebron gebruikt; niet meegeleverd in het model.
