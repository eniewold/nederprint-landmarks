# Sint Jodocuskerk (Oosterland)

Het model omvat het vijfzijdig gesloten laatgotische koor met een lagere zuidelijke aanbouw en de vrijstaande vierkante toren met zadeldak en een overgebleven gedeelte van de oude westgevel. Het oorspronkelijke schip verdween na de kerkbrand van 1612. Het voormalige raadhuis tussen kerk en toren is een afzonderlijk BAG-pand en blijft door PDOK weergegeven.

## Bronnen en maten

- [3D BAG kerk, pand 1676100000457422](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000457422): contour en dakvlakken, nok NAP +15,68 m en maaiveld circa +0,05 m.
- [3D BAG toren, pand 1676100000427954](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000427954): afzonderlijke torenvoet en locatie, nok NAP +20,54 m.
- [PDOK AHN DSM/DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste lokale DSM-meting kerk +16,72 m en toren +21,08 m NAP; maaiveld in de omgeving circa +0,3 m, plaatselijk hoger bij de toren.
- [Rijksmonument kerk 14160](https://monumentenregister.cultureelerfgoed.nl/monumenten/14160), [toren 14162](https://monumentenregister.cultureelerfgoed.nl/monumenten/14162) en [bouwgeschiedenis](https://erfgoedschouwenduiveland.nl/erfgoed-themaopen-monumentendag/oosterland).
- [Wikimedia Commons: Sint Jodocus](https://commons.wikimedia.org/wiki/Category:Sint_Jodocus,_Oosterland): aanzichten uit meerdere richtingen.

De kerkhoogte, detaillering van de torengevel, galmgaten, steunberen en vensternissen zijn vereenvoudigd of geschat. Glasroeden, uurwerk en details onder 0,9 m zijn weggelaten. De positie en omvang van de oude westgevel bij de toren zijn uit de foto's benaderd; de aansluiting op het afzonderlijke voormalige raadhuis verdient controle.

## Bestanden en plaatsing

`sint-jodocuskerk-oosterland.glb` gebruikt meters met Y omhoog en nodes `building:kerk` en `building:toren`. De JSON plaatst het model op RD (61440, 407427), met X-as [0,989, 0,148], en vervangt beide genoemde BAG-panden. STL-bestanden zijn schaal 1:100 en 1:1000. Genereer met `node scripts/generate-sint-jodocuskerk-oosterland.mjs`.

## Controle

De gerichte catalogus- en printtest in `tests/landmark-models.test.ts` slaagt: kerk en toren zijn elk één gesloten manifold, de overhangopvulling op 45° verandert elk volume en de doorsneden met minder dan 3%. Vier schuine modelbeelden zijn vergeleken met PDOK en foto's: de vijfzijdige sluiting en losse toren blijven behouden en gevelopeningen en steunberen zijn toegevoegd. Het raadhuis is in de vergelijking afzonderlijk zichtbaar gehouden; een lokale AHN/PDOK-uitschieter van circa 6 m bij dit buurpand is onzeker en verdient kaartcontrole. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
