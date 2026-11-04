# Watertoren Laren (Laren)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-laren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is een prisma (cirkel van 128 zijden met een vlakke entreezijde) met een verzonken dak, lijsten op een schuine kraag en blinde nissen; garage, vleugel en dienstwoning zijn blokken met dakvlakken als planvergelijking.

De watertoren aan de Rijksweg-West 27 is in 1931-1933 gebouwd voor het Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van W. Hamdorff (rijksmonument 511249, onderdeel van complex 511248). Volgens het register is hij circa 35,65 m hoog, expressionistisch, in paarsgrijze gesinterde baksteen rond een betonskelet, met een dubbel reservoir van 2 × 500 m³. Het is een zeer brede cilinder met een afgeplatte entreezijde naar het zuidoosten (groot venster van glasbeton, lichtstrook, halfronde portiek) en een smalle rechthoekige traptoren aan de oostkant met gestapelde lichtspleten en bovenin een balkon met luifel; plat afgedekt, zonder zichtbare scheiding tussen schacht en reservoir. Aan de noordkant zit de transformatoringang met de latei "1933" en reliëfs. Tegen de voet staan de garage (zadeldak) en de bergplaats (plat dak); een lange lage vleugel loopt naar het noordwesten naar de dienstwoning met kruisende zadeldaken. Toren, vleugel en woning vormen samen één BAG-pand.

## Bestanden

- `watertoren-laren.glb`: één node `building:watertoren-met-traptoren-garage-vleugel-en-dienstwoning`.
- `watertoren-laren.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-laren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [142669.73, 474535.1] (52,25871 N, 5,20661 O), het hart van de cilinder (cirkelfit op de rand van het AHN-DSM boven 31 m, straal 7,8 m). Maaiveld AHN-DTM NAP +28,55 (rondom 28,5 tot 28,75). Lokale +X loopt langs de garage en de traptoren (BAG-randen, RD 24,6 graden; `xAxis` [0.90924, 0.41628]), +Y naar het noordwesten langs de lage vleugel; de vlakke entreegevel kijkt naar -Y. `groundHeight` 71,58 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de zeven `groundSamplePoints` rond het complex (71,58 tot 71,83), `groundOffsetMetres` -0,1. Het model vervangt BAG-pand 0417100000012598 (het hele pand, dus ook vleugel en dienstwoning; anders steekt de PDOK-reconstructie daarvan door het model).

## Onderdeel `building:watertoren-met-traptoren-garage-vleugel-en-dienstwoning`

Hoogtes boven maaiveld.

- Cilinder: straal 7,8 m tot 33,95 m, aan de entreezijde vlak afgesneden op y -7,5 (van x -4,05 tot de traptoren). Borstwering van 0,6 m rond een plat dak op 33,0 m. Lijst van 0,25 m van 32,6 tot 33,0 m rondom, onderkant onder 45 graden.
- Entreegevel: venster van glasbeton als nis van 3,8 × 14 m (4,9 tot 18,9 m) met een dorpel, lichtstrook als nis van 2,8 × 0,9 m (21,4 tot 22,3 m), portiek als rondboognis van 2,7 m breed en 0,6 m diep tot circa 3,5 m, met een spitse top boven 45 graden.
- Noordingang (op RD 65,4 graden): dubbele deur 1,9 × 2,4 m en smal venster 0,6 × 3,6 m als nissen, latei tot 3,25 m en kap tot 8,05 m op een schuine kraag.
- Traptoren: x 4,9 tot 8,1, y -10,2 tot -2,4, tot 35,6 m; zes lichtspleten van 0,6 × 1,4 m (8,6 tot 27,6 m) op de noordoost- en de zuidoostgevel; balkon van 2,0 × 1,5 m met dichte borstwering (30,9 tot 32,3 m) op een console onder 45 graden; schuine luifel erboven (32,8 tot 35,5 m, onderkant onder circa 48 graden).
- Garage: 9,2 × 8,2 m, nok langs X op 7,65 m, goten 2,8 m; twee garagedeuren in de zuidoostgevel, drie vensters en twee kleine vensters in de topgevel.
- Bergplaats: 5,5 × 6,6 m, plat dak 6,15 m, vensterbanden op twee lagen.
- Lage ring tegen de westkant (BAG-boog r 10,82 m) tot 1,5 m.
- Vleugel naar het noordwesten: 7 × 19 m, westdeel plat op 2,2 m, oostdeel zadeldak met de nok op 4,55 m; acht vensternissen onder de goot.
- Dienstwoning (45 graden gedraaid): lange vleugel met nok 8,1 m (zuidoostkop 8,9 m), dwarsdak met nok 8,2 m, dakopbouw tot 9,86 m, lage dwarsvleugel naar de vleugel (nok 5,6 m), aanbouw met lessenaarsdak (6,0 naar 3,1 m) en schoorsteen tot 9,4 m.

## Bronnen en maten

- [Rijksmonumentenregister 511249](https://monumentenregister.cultureelerfgoed.nl/monumenten/511249): bouwjaren, ontwerper, 35,65 m, cilinder met afgeplatte entreezijde, traptoren, garage en bergplaats.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Laren)): hoogte en reservoirs.
- BAG-pand 0417100000012598 en 3D BAG (PDOK, 2026-11-04): contour, stand van de gevels.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP +28,55, borstwering +62,5, dak +61,55, traptoren +64,15; nokken en goten van garage, vleugel en dienstwoning; luchtfoto voor de dakvormen van de woning.
- Foto's op Wikimedia Commons: "Laren Watertoren 8452" (entreegevel), "Laren Watertoren 8454", "WaterTowerLaren2017-1" tot "-4" en de RCE-foto 20408146 (traptoren, spleten, balkon, luifel, noordingang met latei en reliëfs, garage, vleugel).

## Geschat en weggelaten

Geschat: de hoogtes van venster, lichtstrook, portiek, spleten, balkon en luifel uit foto's zonder perspectieffit (onzekerheid circa een halve meter); de lijst onder de borstwering (op de foto's nauwelijks zichtbaar); het aantal en de plaats van de vensters in garage, bergplaats en vleugel; de dakvormen van de dienstwoning uit het AHN-DSM per vleugel (nokken en hellingen gefit, kleine dakkapellen niet).

Weggelaten: de reliëfs (wapen met "PWN" en de figuur met zon en golven) naast de noorddeur en de cijfers op de latei (minder dan 0,9 m reliëf), de ruitjes van het glasbetonvenster en de lichtstrook (één nis), het hekwerk van het balkon (als dichte borstwering), de antenne op het dak, de lantaarns en de lage muurtjes in de tuin. De lichtspleten zijn 0,6 m in plaats van circa 0,3 m breed.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet (9905,57 naar 9905,58 m³): lijsten, dorpel, latei en balkon op een schuine kraag, luifel onder circa 48 graden, nissen met een plafond van 56 graden, daken van 45 tot 50 graden. Via `createModelBundle` op een uitsnede van 100 m op 1:1000 staat het model compleet in de export, de voet 0,15 tot 0,25 m in het PDOK-terrein, zonder ondersteuningsobject; de PDOK-reconstructie van het pand is verborgen. De buurpanden (garages en woningen tot circa 7,5 m) hebben geen hoogte van de toren meegenomen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde veelhoek tot 34 m met een blok voor de traptoren en dozen voor de aanbouwen) de ronde cilinder met borstwering, lijst en verzonken dak, de traptoren met spleten, balkon en luifel, het glasbetonvenster, de lichtstrook en de portiek, de noordingang met latei en kap, de garagedeuren en vensters, de vensters van bergplaats en vleugel, en de dienstwoning met afzonderlijke nokhoogtes, dakopbouw en schoorsteen.

Controle-URL: http://localhost:3000/kaart/52.25871/5.20661/200/1x1/0
