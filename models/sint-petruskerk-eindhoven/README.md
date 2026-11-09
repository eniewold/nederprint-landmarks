# Sint-Petruskerk (Eindhoven)

Neogotische kruisbasiliek van H.J. van Tulder aan de Kloosterdreef in Woensel (ingewijd 1880, rijksmonument 14653), met een westtoren van L.P.J. Kooken uit 1912. Die toren kwam er nadat de eerste toren in 1875 tijdens de bouw was ingestort. Het model vervangt BAG-pand 0772100000308080, dat kerk en toren samen omvat.

## Bestanden en plaatsing

- `sint-petruskerk-eindhoven.glb`: gesloten model in meters met node `building:kerk`.
- `sint-petruskerk-eindhoven.json`: RD-oorsprong (160898.64, 384957.33) in de viering op de nokas, X-as `[0.9641, 0.2656]` (nokrichting 15,4 graden, naar het koor in het oosten), maaiveldreferentie NAP +19,4 m (AHN/3DBAG).
- `sint-petruskerk-eindhoven-1-100.stl` en `sint-petruskerk-eindhoven-1-1000.stl`: afdrukmodellen.
- `scripts/generate-sint-petruskerk-eindhoven.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Onderdelen

- Middenschip, dwarsschip en koor als prisma's met zadeldaken. Ze hebben één nok op 27,55 m boven maaiveld en een helling van 1,27 (52 graden). De goten liggen op 20,7 m. Het schip is 10,8 m breed. De dwarsschipgevels zijn topgevels met een pinakel.
- Koorsluiting van een regelmatige achthoek (apothema 5,4 m) met drie schilddakvlakken die in de koorkap uitlopen.
- Zijbeuken van het schip met een lessenaarsdak (14,2 naar 10,8 m) en steunberen met afgeschuinde top. De noordbeuk loopt door tot de toren, de zuidbeuk begint 6 m oostelijker. Aan beide zijden een portaal met zadeldak.
- Kooromgangen in twee delen (12,6 naar 10,6 m, daarna 10,6 naar 7,4 m), een platte sacristiestrook op 7,3 m en een lage veelhoekige omgang op 5,2 m rond de apsis.
- Diagonale hoeksteunberen aan de dwarsschipgevels.
- Westtoren: vierkante schacht van 9,4 m tot 44,5 m met diagonale hoeksteunberen aan de westzijde. Daarboven een klokverdieping met vier wimbergen tot 50,8 m en vier hoekpinakels. De achtkante spits heeft een knik op 49 m, vier dakkapelletjes, een kroon op 61 m en een naald tot 72,0 m. Aan de westgevel een portaal met wimberg.
- Dakruiter op de viering tot 37,5 m en drie dakkapellen per zijde op het schip.
- Portalen, vensters, lichtbeukvensters, galmgaten en transeptvensters als blinde spitse nissen van 0,4 m.

## Maten en vereenvoudiging

De BAG-contour en het AHN-DSM (0,5 m, in een stelsel langs de nok) geven de plattegrond, nokken, goten en lessenaarsdaken. De nok ligt op NAP +46,95 m. Het DSM ziet de torenspits tot NAP +91,4 m, 72,0 m boven maaiveld. Wikipedia noemt 76 m, inclusief het kruis. Het silhouet van de toren komt uit de AHN-omhullende per hoogte: tot 46 m volle breedte en daarboven een spits die van circa 4,6 m breed naar de naald versmalt.

Geschat uit foto's:
- de hoogte van de wimbergen en pinakels;
- de knik, de dakkapelletjes en de kroon van de spits;
- de hoogte van de dakruiter, die het DSM door de leien grotendeels mist;
- de plaats en maat van vensters, dakkapellen en portalen.

De kooromgangen en sacristieën zijn vereenvoudigd tot lessenaarsdaken en platte blokken op de AHN-hoogtes.

Weggelaten:
- het kruis op de spits (dunner dan 0,9 m);
- de balustrade van de klokverdieping (leuning);
- maaswerk, wijzerplaten, de beelden bij de ingang en de kruisen op de gevels.

## Controle

Eén gesloten manifold met genus 0. De gerichte test controleert de plaatsing, de pandvervanging en de hoogte. Hij controleert ook de opvulling voor 45 graden overhang op 1:1000: de steunverhouding is 1,0000. De kerk is van vier kanten vergeleken met de 3DBAG-reconstructie (LoD2.2, zonder bruikbare toren) en met foto's van de westgevel, de toren en de zuid- en noordzijde.

## Bronnen

- [Wikipedia: Sint-Petruskerk (Eindhoven)](https://nl.wikipedia.org/wiki/Sint-Petruskerk_(Eindhoven))
- [Rijksmonumentenregister 14653](https://monumentenregister.cultureelerfgoed.nl/monumenten/14653)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000308080)
- [AHN via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Wikimedia Commons: Sint Petruskerk (Eindhoven)](https://commons.wikimedia.org/wiki/Category:Sint_Petruskerk_(Eindhoven))
