# Sint-Joriskerk (Eindhoven)

Neogotische kruisbasiliek in Stratum van H.J. van Tulder (1884-1885) met de westtoren van J. van Gils (1911), rijksmonument 14646. Het model vervangt BAG-pand 0772100000277589 (het BAG-bouwjaar 1900 is een schatting; de kerk is in 1885 in gebruik genomen).

## Bestanden en plaatsing

- `sint-joriskerk-eindhoven.glb`: gesloten model in meters met node `building:kerk`.
- `sint-joriskerk-eindhoven.json`: RD-oorsprong (162014,9, 382325,06) in het hart van de viering, X-as `[0.9851, 0.1719]` (9,9 graden, langs de goten en de nok van het schip naar het koor), maaiveldreferentie NAP +18,317 m (3D BAG).
- `sint-joriskerk-eindhoven-1-100.stl` en `sint-joriskerk-eindhoven-1-1000.stl`: afdrukmodellen.
- `scripts/generate-sint-joriskerk-eindhoven.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Onderdelen

- Middenschip, dwarsschip en koor onder kappen van ongeveer 62 graden met één nok op NAP +50,4 m (32,05 m boven maaiveld), gemeten in het AHN-DSM langs de as; dakvlakken als planvergelijkingen per goot.
- Driezijdige koorsluiting (3/8) met schilddak en steunberen op de hoeken.
- Zijbeuken onder lessenaarsdaken met steunberen per travee, veelhoekige kapellen aan de westkant naast de toren en aanbouwtjes in de oksels van zijbeuk en dwarsschip.
- Topgevels van het dwarsschip met hoektorentjes, noordportaal, traptoren in de noordwestoksel.
- Sacristie en ontmoetingsruimte naast het koor met de platte galerijen, lessenaarsdaken, een dwarse kopgevel en een afgeschuind oosteinde; de lage gang naar de pastorie hoort bij hetzelfde pand.
- Westtoren met portaalblok, hoeksteunberen, ronde traptoren, wimbergen op vier zijden, hoekpinakels en een achtkante spits met dakkapelletjes, lantaarn en naald tot 85 m.
- Dakruiter op de viering en dakkapelletjes op het schip.
- Blinde vensternissen in zijbeuken, lichtbeuk, koor, dwarsschip en toren (portaal, westvenster, galmgaten).

## Geschat en weggelaten

Hoogtes van nokken, goten, zijbeuken, aanbouwen en torenborstwering komen uit het AHN-DSM (0,5 m); de plattegrond uit de BAG-contour. De spits valt in het DSM grotendeels weg: de basis (straal circa 4,2 m), het niveau van de dakkapelletjes, de lantaarn en de top (DSM NAP +102,8 m, Wikipedia 88 m inclusief kruis) zijn uit DSM-resten en foto's geschat. Wimberghoogte, pinakels, traptorens, dakruiter en vensterposities zijn naar foto's geschat. Weggelaten: kruisen en windvaan, maaswerk, uurwerken, de open galerijbogen en hekwerk (kleiner dan 0,9 m of niet printbaar).

## Controle

Eén gesloten manifold met genus 0. De gerichte test controleert plaatsing, pandvervanging, hoogte en de 45-graden-overhangopvulling op 1:1000 (steunvolume 1,000). Het model is van vier kanten vergeleken met de 3D BAG-reconstructie en met Commons-foto's van toren, zuidzijde, dwarsschip en koor.

## Bronnen

- [Wikipedia: Sint-Joriskerk (Eindhoven)](https://nl.wikipedia.org/wiki/Sint-Joriskerk_(Eindhoven))
- [Rijksmonumentenregister 14646](https://monumentenregister.cultureelerfgoed.nl/monumenten/14646)
- [3D BAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000277589)
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0) (dsm_05m, dtm_05m)
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:St._Joriskerk_(Eindhoven))
