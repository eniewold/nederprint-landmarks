# Sint Jacobskerk, Vlissingen

Driebeukige kruiskerk met drie langskappen, breed dwarsschip, driezijdig gesloten koor en ingebouwde westtoren. De achtkantige houten torenbekroning is opgebouwd uit gesloten geledingen met ondiepe nissen; open gaanderijen en fijn maaswerk zijn op 1:1000 niet printbaar en daarom vereenvoudigd.

## Bronnen en maatvoering

- [3D BAG pand 0718100000000778](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0718100000000778): grondvlak, nokken en bouwdelen. Het maaiveld ligt rond NAP +1,37 m; de nok circa 19,8 m daarboven.
- PDOK AHN DSM 0,5 m: de hoogste meting van de toren is NAP +48,90 m, circa 47,5 m boven maaiveld.
- [Rijksmonument 37752](https://monumentenregister.cultureelerfgoed.nl/monumenten/37752), [de beschrijving van de kerk](https://sintjacobskerk.nl/kerkgebouw/) en [foto's](https://commons.wikimedia.org/wiki/Category:Sint_Jacob_(Vlissingen)) leveren de vorm van de toren, kapellen en gevels.

De maten van de bekroningsgeledingen, traptorens, steunberen en ondiepe vensternissen zijn benaderd op basis van de bronnen. Kleine ornamenten, het kruis en de balustrades zijn weggelaten. Naast de noordzijde staan aparte BAG-panden 0718100000000678 en 0718100000000683; deze zijn geen onderdeel van de vervanging.

## Genereren en controle

`node scripts/generate-sint-jacobskerk-vlissingen.mjs --scale 1000 --components` en `--scale 100 --components` produceren de GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en extra steun bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
