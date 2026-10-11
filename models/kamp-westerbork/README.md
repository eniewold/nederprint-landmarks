# Nationaal Monument Westerbork

Het spoormonument uit 1970 in Hooghalen: opwaartse rails, dwarsliggers, stootblok, keienmuur en twee tekstplaten. Oorsprong RD `[237397,548450.7]`, +X langs het spoor naar het stootblok, richting 2,32° vanaf RD-oost. Meters, Z omhoog in het script; glTF `(x,z,-y)`. Drie gesloten `building:`-nodes. Het grindbed, de paden en de overige kampobjecten blijven PDOK; geen BAG-panden of terreinvlakken vervangen.

## Bronnen en metingen

- [Nationaal Comité 4 en 5 mei](https://www.4en5mei.nl/oorlogsmonumenten/zoeken/2055/hooghalen-nationaal-monument-westerbork): onderdelen en betekenis, 97 dwarsliggers en genoemde spoorlengte van 40 m.
- [Plattegrond Herinneringscentrum Kamp Westerbork](https://kampwesterbork.nl/downloads/plattegrond-april-2021.pdf): afbakening van het monument tegenover andere kampobjecten.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Westerbork_national_memorial): schuine foto's van de opgekrulde rails, het stootblok, de achteroverhellende keienmuur en beide tekstplaten. Foto's staan alleen in de tijdelijke controlemap, buiten de repo.
- PDOK BGT, Actueel_orthoHR en AHN DSM/DTM 0,5 m, 11 oktober 2026. Het grindbed is BGT-object `G1731.8abeacd5439b75760000000a0919ab40`, oppervlakte 559,6 m², RD-bounds `[237356.43,548446.24]`–`[237444.11,548458.59]`. De zichtbare spooruiteinden liggen circa RD `[237359,548449]` en `[237435,548452]`; hun afstand is circa 76 m. Dit wijkt af van de 40 m in de tekstbron: het model volgt de huidige georeferentie en luchtfoto. Die lengteschatting moet bij review worden gecontroleerd.

## Opbouw en schattingen

Doorlopende prisma's tussen doorsneden geven de gebogen en uitwaaierende railuiteinden; geen gestapelde hoogtelagen. De railtop is 2,65 m hoog, de muur 2,55 m, het stootblok 2 m en de tekstplaten 0,6–0,85 m: geschat uit schuine foto's. Muurbreedte 9 m en plaats van stootblok en platen zijn uit luchtfoto en foto's afgeleid. Het DSM is bij de muur door bomen vervuild en wordt daar niet als muurhoogte gebruikt.

Op 1:1000 zijn de werkelijke dunne spoorprofielen onbruikbaar. Beide rails zijn 0,9 m breed en hebben een doorlopende voet; onder de opgekrulde uiteinden staan dikke zijvlakken. De 97 echte dwarsliggers zijn tot 34 bredere liggers gegroepeerd. Het stootblok heeft verdikte schragen, bufferkoppen en schuine aanzetstukken onder de dwarsbalk. De grove keien zijn vast aan de muur gehecht. De platen zijn gesloten schuine blokken.

Weggelaten: tekst, afzonderlijke kleine keien, bevestigingsbouten, smalle profielranden en het oorspronkelijke houten stootblok achter de muur. Ook de 102.000 stenen, wachttoren en het overige kampterrein vallen buiten dit afzonderlijke spoormonument.

## Maaiveld en controles

AHN DTM meet NAP 16,48–16,52 m onder het spoor. De actuele PDOK-tegels hebben op de drie samples ellipsoïdische hoogtes 58,04868, 58,00859 en 57,99769 m; het grindbed ligt daarin ongeveer 2,4 m lager dan het AHN. Het model volgt de PDOK-kaartbodem: minimumsample 57,9976944844 m, offset −0,15 m, modeldatum 57,8476944844 m. Deze discrepantie en de aansluiting op de grond zijn onderdeel van de review.

`node scripts/generate-kamp-westerbork.mjs --scale 1000` schrijft GLB, JSON en STL. De losse STL meet 80 × 9 × 2,65 mm en bevat vier losse positieve onderdelen; gebruik de kaart-export voor een gezamenlijke onderplaat. Alle nodes hebben `NoError`. De 45°-controle voegt 0,1294 m³ toe, 0,07277% van 177,8277 m³, uitsluitend onder de dwarsbalk/bufferkoppen van het stootblok. De standaard printbare-overhangoptie maakt die kleine aansluiting vast zonder losse steunconstructie.

De volledige `createModelBundle`-export is gecontroleerd op 1:1000, uitsnede 120 × 120 m, preview en 3MF 120 × 120 mm; alle delen liggen binnen de uitsnede. Vier schuine renders op 30° boven de horizon (−35°, 55°, 145°, 235°), plus de railuiteinden in detail, zijn naast PDOK en bronfoto's bekeken. Het spoor en de muur voegen het ontbrekende monument toe; het terrein wordt niet gedubbeld. De permanente webshoptest controleert plaatsing, drie nodes, twee opkrullende uiteinden, stootblok, verbonden positieve volumes en minder dan 0,1% overhangopvulling. De verplichte landmark/API-suite slaagt met 367 tests.

[Controlekaart](http://localhost:3000/kaart/52.91683/6.61233/350/1x1/0?size=120): controleer de spoorlengte, verdikte opwaartse rails en aansluiting van stootblok en muur op het grindbed. Een bestaande server met gecachte catalogus kan een herstart nodig hebben; tijdens de controle is een tijdelijke proxy met de actuele kaartcatalogus gebruikt.
