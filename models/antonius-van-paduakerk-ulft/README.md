# Antonius van Paduakerk Ulft

Model van de voormalige Antonius van Paduakerk aan de Dr. Ariënsstraat 1 in Ulft, een neoromaanse kerk uit 1914 van architect Herman Kroes, rijksmonument 523685. De kerk met beide westtorens is BAG-pand 1509100000203444. De aangrenzende pastorie is een afzonderlijk BAG-pand en wordt niet vervangen.

## Bronnen en maten

- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/523685), met beschrijving van de torens, dakruiter en bouwdelen.
- [Wikimedia Commons: foto's van kerk, torens, koor en aanbouwen](https://commons.wikimedia.org/wiki/Category:Antonius,_Ulft).
- BAG voor de plattegrond; 3DBAG LoD2.2 voor nokken, dakvlakken en aanbouwen; AHN DSM voor de torens. Maaiveld circa NAP +14,52 m, hoogste AHN-punten op de torens NAP +37,76 m en +38,76 m. De torenrasters bevatten 64 en 65 geldige cellen en geen lege cellen; de hoogste piek kan de fijne bekroning raken. De twee gemodelleerde tentdakpunten liggen op 23,4 m boven maaiveld. Middenschip en dwarskap hebben een nokhoogte van circa 14,6 m.

Het model bevat een driebeukig schip, kruisende zadeldaken, halfronde apsis, twee westtorens met tentdaken, vereenvoudigde dakruiter, sacristie en lagere aanbouwen, dakkapellen en blinde venster- en galmgatnissen. De exacte maten en diepten van vensters, galmgaten, dakruiter, aanbouwen en dakkapellen zijn uit foto's en hoogtegegevens geschat. De open toren- en dakruiterconstructies zijn op 1:1000 als gesloten nissen vereenvoudigd; smalle zuilen, kruizen, windhaan, uurwerk en fijn raamwerk zijn weggelaten. Het gebouw meet circa 43,6 bij 25,8 m in het eigen assenstelsel.

## Productie en controle

Het model is één gesloten volume en bedoeld voor afdruk op 1:1000 zonder steunmateriaal. Genereer GLB, catalogus-JSON en STL met `node scripts/generate-antonius-van-paduakerk-ulft.mjs` in de landmarks-repository. De webshop bevat een plaatsings- en printtest in `tests/landmark-models.test.ts`. Een uitsnede van 150 bij 150 m is geëxporteerd en het model is van vier zijden met PDOK en foto's vergeleken. Controleer de ligging via [de kaart](http://localhost:3000/kaart/51.90186/6.37451/200/1x1/0).
