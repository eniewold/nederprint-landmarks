# Sint-Lambertuskerk (Maasbommel)

Landmark voor de rooms-katholieke Sint-Lambertuskerk aan de Raadhuisdijk 44 in Maasbommel (rijksmonument 523092, BAG-pand `0668100000004445`). De kerk is een neogotische driebeukige basiliek van C. van Dijk uit 1868-1869. De BAG geeft als bouwjaar 1840, maar dat is niet het bouwjaar van deze kerk. De toren staat aan de dijkzijde in het zuiden en het driezijdig gesloten koor in het noorden.

## Bestanden

- `sint-lambertuskerk-maasbommel.glb`: één node `building:kerk`, meters, Y omhoog.
- `sint-lambertuskerk-maasbommel.json`: catalogusitem.
- `sint-lambertuskerk-maasbommel-1-1000.stl`: printbestand op 1:1000 in mm, Z omhoog.
- Generator: `scripts/generate-sint-lambertuskerk-maasbommel.mjs`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (165161, 425690), op de nok van het schip. De X-as loopt langs de kerkas van de toren naar het koor (`xAxis` [-0,0105, 1], ongeveer 0,6 graden west van noord) en +Y wijst naar het westen. z = 0 ligt op NAP +8,55 m, het maaiveld langs de zijbeuken. `groundSamplePoints` bemonstert vier punten vlak naast de zijbeuken, de toren en het koor. Zo zakt het model niet naar het lagere terrein ten noorden van de kerk. Het model loopt 1 m door onder z = 0, omdat het maaiveld van NAP +9,2 m aan de dijk daalt naar circa +8,1 m bij het koor.

## Onderdelen

- **Schip** van 7,9 m breed: goot op NAP +23,0 m, nok op +29,35 m, dakhelling 58 graden. Het **koor** heeft drie zijden en een schilddak van 66 graden.
- **Zijbeuken** met lessenaarsdaken van 35 graden, die tegen de lichtbeuk aansluiten op NAP +19,2 m. De westbeuk is 3,5 m breed en de oostbeuk 4,05 m. Beide lopen langs de toren door tot aan de zuidgevel.
- **Lage kapellen** met lessenaarsdak naast het koor, en een **platte sacristie** aan de oostzijde op NAP +13,3 m.
- **Toren** van 7,0 × 7,1 m. De muren lopen tot NAP +37,5 m, daarboven staan vier kruisende wimbergen tot +41,8 m. Op de hoeken staan pinakels. De achtkante naaldspits loopt tot NAP +55,0 m, 46,45 m boven z = 0. Op de zuidhoeken staan steunberen.
- **Traptoren** met achtkante spits in de hoek van de toren en de westbeuk, tot circa NAP +24,3 m.
- **Steunberen** langs de zijbeuken: zes traveeën van 3,7 m. Verder lisenen tegen de lichtbeuk, steunberen op de koorhoeken en twee dakkapellen per dakschild.
- **Blinde nissen** van 0,35 m diep: spitsboogvensters in de zijbeuken, de lichtbeuk en het koor, drie galmgaten per torengevel, een nis op de tweede geleding, een ruitvormige wijzerplaat in elke wimberg en het torenportaal.

## Geschat en weggelaten

De footprint en de dakvlakken komen uit de 3DBAG (LoD2.2). De nok-, goot- en torenhoogtes komen uit het AHN-DSM op 0,5 m. Het hoogste DSM-punt van de spits ligt op NAP +54,26 m; de top is daarom op +55,0 m gezet. De geleding van de toren, de hoogte van de wimbergen, de vensters, de traveemaat en de dakkapellen zijn geschat uit foto's van Commons. Weggelaten: het kruis op de spits en op het koor, de windvaan, de tracering en de fijne lijsten en waterlijsten (allemaal kleiner dan 0,9 m), en de kleine pinakels op de lisenen.

## Controle

De generator maakt één gesloten volume met genus 0 en een vlakke voet (2202 driehoeken, 38,8 × 21,6 × 47,45 m). De test plaatst het model op een uitsnede van 200 × 200 m, controleert `replacesBuildings` en manifold, en laat zien dat op 1:1000 geen extra steun nodig is (verhouding 1,000). Het model is in vier schuine aanzichten vergeleken met de 3DBAG-reconstructie en met foto's van Commons.

## Bronnen

- [3DBAG-pand 0668100000004445](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0668100000004445)
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Rijksmonumentenregister 523092](https://monumentenregister.cultureelerfgoed.nl/monumenten/523092)
- [Monumenten in Nederland: Gelderland (DBNL)](https://dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0144.php): basiliek van C. van Dijk, 1868-1869
- Foto's op Wikimedia Commons: [zijaanzicht vanaf de dijk](https://commons.wikimedia.org/wiki/File:Maasbommel,_de_Sint-Lambertuskerk_RM523092_IMG_4122_2018-06-06_13.43.jpg), [westzijde](https://commons.wikimedia.org/wiki/File:Maasbommel_Rijksmonument_523092_RK_kerk_van_opzij.JPG) en [koorzijde](https://commons.wikimedia.org/wiki/File:Maasbommel_Rijksmonument_523092_RK_kerk_achteraanzicht.JPG)

Controleer op [de kaart](http://localhost:3000/kaart/51.81976/5.53462/200/1x1/0) de hoogte van de voet aan de dijkzijde en de plaatsing van de toren tegen de Raadhuisdijk.
