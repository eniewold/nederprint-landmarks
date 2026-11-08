# Maria Geboortekerk (Nijmegen)

Landmark voor de rooms-katholieke Maria Geboortekerk aan de Berg en Dalseweg 40-42 in Nijmegen (rijksmonument 522947, BAG-pand `0268100000002755`). De kerk is een neogotische kruisbasiliek. Johannes Kayser bouwde in 1900-1901 het schip, zijn zoon Jules Kayser in 1923-1924 het koor, het dwarsschip en de voorgevel. Het BAG-pand heeft 1924 als bouwjaar. Op hetzelfde pand staan ook de sacristie achter het koor en de pastorie (Berg en Dalseweg 40) met een gang naar de kerk. Die zijn daarom meegemodelleerd. Niet te verwarren met `maria-geboortekerk-lent`.

## Bestanden

- `maria-geboortekerk-nijmegen.glb`: één node `building:kerk`, meters, Y omhoog.
- `maria-geboortekerk-nijmegen.json`: catalogusitem.
- `maria-geboortekerk-nijmegen-1-1000.stl`: printbestand op 1:1000 in mm, Z omhoog.
- Generator: `scripts/generate-maria-geboortekerk-nijmegen.mjs`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (188482,4, 428281,4), het midden van de viering. De X-as loopt langs de kerkas van het koor naar de voorgevel (`xAxis` [0,3859, 0,9225], de nokrichting in het AHN, 22,7 graden oost van noord). +Y wijst naar het WNW. z = 0 ligt op NAP +32,6 m, het maaiveld van de verdiepte binnenplaats en de koorzijde. Het voorplein aan de Berg en Dalseweg ligt 2,5 m hoger; de voorgevel loopt daaronder door. `groundSamplePoints` bemonstert vier punten achter het koor en op de binnenplaats.

## Onderdelen

- **Schip, koortravee en dwarsschip** met hetzelfde dwarsprofiel: 12,2 m breed, goot op NAP +56,0 m, nok op +65,4 m, dakhelling 57 graden. Het dwarsschip is 27,8 m lang. Op de voorgevel, de koorgevel en de twee dwarsschipgevels staan topgevels.
- **Zijbeuken** met lessenaarsdaken (31 graden) tot tegen de lichtbeuk. De laatste travee bij de voorgevel is smaller.
- **Luchtbogen**: zes per zijde. Elke boog heeft een pijler met pinakel op de zijbeukmuur en een schuine boog als volle schijf tot de lichtbeuk.
- **Apsis**: vijf zijden van een achthoek, lager dan het koor (nok NAP +60,8 m), met een schilddak en steunberen op de hoeken.
- **Kapellen** naast de koortravee, met zadeldaken dwars op het koor en topgevels naar buiten. In de hoeken met het dwarsschip staan traptorentjes met pyramidedak.
- **Dakruiter** op de viering: een achtkante lantaarn met acht wimbergen en een naald tot NAP +82,1 m.
- **Voorgevel** met twee achtkante traptorens. Elke toren heeft een kraag en een achtkante spits tot NAP +68,1 m. Verder een voorportaal met topgeveltje en pinakels op de hoeken van de zijbeukfronten.
- **Sacristie** in twee vleugels met zadeldaken, een lage verbindingsbouw achter het koor, en lage portaaltjes naast het dwarsschip.
- **Pastorie** met schilddak en schoorsteen, verbonden met de kerk door een lage gang.
- **Dakkapellen** met zadeldak op het schip, het koor en het dwarsschip.
- **Blinde nissen** van 0,35-0,45 m: spitsboogvensters in de zijbeuken, de lichtbeuk, de apsis en de kapelgevels; grote vensters in de voorgevel en de dwarsschipgevels; nissen in de topgevels; het portaal, de zijdeuren en de torenvensters.

## Geschat en weggelaten

De footprint komt uit de BAG. De nok- en goothoogtes van het schip, het dwarsschip, de apsis, de zijbeuken, de kapellen, de sacristie en de pastorie komen uit het AHN-DSM op 0,5 m. Ook de plaats en hoogte van de luchtbogen en de top van de traptorens komen daaruit (DSM +67,6 m). Het DSM ziet de naald van de dakruiter maar tot NAP +72,6 m. De top op +82,1 m is geschat uit de verhouding tot de dwarsschipgevel op de RCE-foto van de zuidoostzijde. Ook de geleding van de torens, de vensters, het portaal en de dakkapellen zijn geschat uit foto's. Weggelaten zijn kleiner dan 0,9 m of open:

- de kruisen
- het maaswerk en de roos
- de open bogen in de lantaarn
- de pinakels op de lantaarn
- de beelden van Albertus Magnus en Dominicus
- de fijne banden en lijsten
- de crypte-arcade
- het beeld van Maria op het voorplein (staat los)

## Controle

De generator maakt één gesloten volume met genus 0 en een vlakke voet (86,8 × 37,2 × 50,5 m). Een test plaatst het model op een uitsnede van 200 × 200 m en controleert `replacesBuildings` en manifold. Hij laat ook zien dat op 1:1000 geen extra steun nodig is. Het model is in vier schuine aanzichten vergeleken met de 3DBAG-reconstructie (LoD2.2) en met foto's van Commons en de RCE.

## Bronnen

- [3DBAG-pand 0268100000002755](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000002755)
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Rijksmonumentenregister 522947](https://monumentenregister.cultureelerfgoed.nl/monumenten/522947)
- [Wikipedia: Maria Geboortekerk (Nijmegen)](https://nl.wikipedia.org/wiki/Maria_Geboortekerk_(Nijmegen))
- Foto's op Wikimedia Commons: [categorie](https://commons.wikimedia.org/wiki/Category:Maria_Geboortekerk_(Nijmegen)), [zuidoostgevel (RCE)](https://commons.wikimedia.org/wiki/File:Zuid-oost_gevel_-_Nijmegen_-_20167856_-_RCE.jpg), [westgevel (RCE)](https://commons.wikimedia.org/wiki/File:Westgevel_-_Nijmegen_-_20167853_-_RCE.jpg), [achterzijde](https://commons.wikimedia.org/wiki/File:Nijmegen_Rijksmonument_522947_kerk_Berg_en_Dalseweg_42_achterzijde.JPG)

Controleer op [de kaart](http://localhost:3000/kaart/51.84232/5.87307/200/1x1/0) de hoogte van de voet. Kijk bij de voorgevel aan het hogere voorplein en bij de verdiepte binnenplaats naast de pastorie.
