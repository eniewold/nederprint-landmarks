# Nederlands Hervormde Kerk Wanneperveen

De kerk uit 1502 heeft een driezijdig gesloten koor, westelijk dakschild, steunberen en zuidelijke consistorie. Ten zuidwesten staat een vrijstaande houten klokkenstoel. De kerk en klokkenstoel zijn afzonderlijke objecten; BAG-pand 1708100000025507 wordt vervangen. De grondplaat-STL verbindt beide voor een losse print.

## Bronnen en maten

- [3DBAG pand 1708100000025507](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000025507): omtrek, ligging en AHN4-hoogtematen uit 2022; maaiveld NAP +0,328 m en nok NAP +14,959 m.
- [Rijksmonument kerk](https://monumentenregister.cultureelerfgoed.nl/monumenten/10584) en [klokkenstoel](https://monumentenregister.cultureelerfgoed.nl/monumenten/507464): bouwgeschiedenis en klokmaat. De consistorie dateert uit 1887–1888.
- [OpenStreetMap klokkenstoel](https://www.openstreetmap.org/node/9014769874) voor plaatsing; [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Wanneperveen)) voor schuine foto's van kerk, consistorie en klokkenstoel.

De kerk is opgebouwd uit gesloten dak- en wandvlakken met steunberen en ingesneden vensternissen. Nok, hoofdomtrek en richting zijn op 3DBAG gebaseerd; vensters en steunberen, hoogte en detaillering van de consistorie en westelijke nokaanzet zijn naar foto's geschat. De klokkenstoel is niet als gebouw in PDOK aanwezig; de geschatte afmetingen zijn 5 m breed en 7 m hoog. Het open houtwerk is sterk vereenvoudigd en minimaal 0,94 m dik gemaakt voor schaal 1:1000. Een centrale drager ondersteunt de schematische klok in plaats van de werkelijke ophanging; fijne onderdelen zijn weggelaten. AHN wordt daar door boomkronen beïnvloed.

## Controle

De generator controleert beide volumes op manifoldstatus en één component; beide hebben genus 0. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, beide afzonderlijke gesloten delen en het extra volume en de doorsneden na 45-graden steungeneratie; de test slaagt voor 1:1000. Vier schuine aanzichten zijn naast de PDOK-reconstructie en foto's bekeken: hoofdvolume, koorsluiting, schilddak en aangebouwde consistorie komen overeen. Vensters en steunberen zijn in het model duidelijker dan in de PDOK-mesh. De vrijstaande klokkenstoel komt uit foto's en ontbreekt in die mesh. Het naastgelegen BAG-pand 1708100000025508 ligt circa 13 m van de kerk en overlapt niet; de lokale AHN-waarden zijn daar beïnvloed door boomkronen.

Regenereren: `node scripts/generate-nederlands-hervormde-kerk-wanneperveen.mjs` vanuit de landmarks-repository.
