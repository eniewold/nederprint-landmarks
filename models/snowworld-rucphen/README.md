# SnowWorld Rucphen

Hele SnowWorld BAG-contour met smalle oude skihal: doorlopend gebogen spantprofiel met hellingsknik; brede nieuwe hal: doorlopend schuin dakvlak; lage voorkant, horecavleugels, hipdaken en hoge entreefronton. Gesloten printvolumes, blinde raamstroken, paneelnaden, gesloten entree-luifel, buitentrap, verhoogde dakband en dakinstallaties. +X RD -17 graden, z=0 NAP +10,5 m, verborgen voet -2,3 m.

## Meetstelsel en afmetingen

Oorsprong RD [98405.11878529674,394737.256133333], X-as [0.9563047559630354,-0.29237170472273677]. Model z=0: NAP 10.5 m. Maaiveldpunten [[-20,-70],[12,-80],[50,-58]]; offset -0.3 m. Vervangt NL.IMBAG.Pand.0840100000276424.

Gemeten architectuurhoogtes (NAP, meter):

```json
{
  "groundNapM": 10.5,
  "oldHallHighNapM": 35.88,
  "oldHallKinkEstimatedNapM": 22.3,
  "oldHallLowNapM": 18.6,
  "newHallHighNapM": 35.33,
  "newHallLowNapM": 18.33,
  "frontLowRoofNapM": 14.75,
  "horecaRoofNapM": 13.6,
  "entranceRidgeNapM": 18.4
}
```

## Modelopbouw en vereenvoudigingen

Benoemde bouwdelen, gevelprofielen en doorlopende dakvlakken; geen gestapelde hoogtelagen. Glas en diepe open ruimten zijn gesloten voor steunloos printen op 1:1000. Ondiepe nissen behouden de gevelherkenning.

Geschat of vereenvoudigd: De doorsnede van het gebogen oude dak, de knik in het langsprofiel, dakband, paneelnaden, raamritme, dakinstallaties en exacte plaats en hoogte van de buitentrap zijn afgeleid van schuine bouw- en opleveringsfoto’s, orthofoto en AHN; de trap heeft zeventien vereenvoudigde, massieve treden. Lage entreevleugels en het brede hellende uitbreidingsdak volgen gemeten dakvlakken. Glas en luifelonderzijde zijn gesloten; losse belettering en dunne staalprofielen zijn weggelaten. De volledige BAG-voet loopt 2,3 m onder het voorplein zodat de hellingen en bijgebouwen één printbaar geheel vormen.

## Controle

- Gerichte geometrie- en regressietest in tests/landmark-models.test.ts geslaagd; gesloten Manifold, verbonden model, plaatsing op straatmaaiveld en steuncontrole bij 45 graden.
- Volledige uitsnede 270 × 270 m op exact 1:1000 geëxporteerd met createModelBundle; binaire preview en 3MF geslaagd.
- Toegevoegd volume door 45-graden steunprofiel: 0.000%.
- Vier renders (−35°, 55°, 145°, 235°), naast de oorspronkelijke PDOK-reconstructie en twee schuine bronfoto’s beoordeeld; hele model in preview gecontroleerd.
- Landmark uit/aan op de kaart gecontroleerd; omringende panden en maaiveld beoordeeld.
- GLB, JSON en STL byte-identiek na opnieuw genereren.

[Controle op de kaart](http://localhost:3000/kaart/51.5388956/4.5711998/800/1x1/107?theme=thema-polder-8&base=road&size=270&z=1)

Onderzoeksbestanden, bronfoto’s, renders en tijdelijke preview-export staan buiten beide repositories, in de lokale visualisatie-werkmap onder snowworld-rucphen.

## Bestanden en generatie

```sh
node scripts/generate-snowworld-rucphen.mjs
```

snowworld-rucphen.glb (meters, glTF Y omhoog), snowworld-rucphen.json (catalogus en bronvermelding), snowworld-rucphen-1-1000.stl (millimeters, Z omhoog). Generator gebruikt het bestaande efteling-kit.mjs.

## Bronnen

- PDOK BAG/BGT 0840100000276424, AHN DSM/DTM 0,5 m en ortho, 11 oktober 2026
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0840100000276424
- https://www.snowworld.com/nl/rucphen-breda
- https://www.snowworld.com/en/rucphen-breda/skiing-snowboarding
- https://www.kokstaal.nl/nl/projecten/skihallen-rucphen/
- https://commons.wikimedia.org/wiki/Category:Skid%C3%B4me_Rucphen

BAG/BGT/AHN/ortho: PDOK. 3D BAG dakgeometrie: CC BY 4.0, TU Delft/3D Geoinformation. Foto’s uitsluitend als controlebron gebruikt; niet meegeleverd in het model.

## Vergelijking per aanzicht

- −35°: vloeiender oud boogdak met verhoogde band, plus dakinstallaties op de lage voorbouw; het gemeten brede dak blijft behouden.
- 55°: oude dakknik en boogdoorsnede, lagere entreevolumes, raamritme en dakinstallaties vervangen de ruwe PDOK-facetten.
- 145°: achterzijde van de oude hal met afgeronde dakdoorsnede en dakband, aaneengesloten bijgebouwen en lage entreegevels.
- 235°: massieve buitentrap en dakband op de oude hal, doorlopend hellend dak van de uitbreiding en duidelijkere lage horecavleugels.

Schuine controlefoto’s: [De Kok Staalbouw, Skihallen Rucphen](https://www.kokstaal.nl/nl/projecten/skihallen-rucphen/), bouwfase en oplevering; rechten bij de bronhouder. Uitsluitend lokaal gebruikt voor vergelijking, niet in deze repository opgenomen.

