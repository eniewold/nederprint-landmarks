# Goirkese Kerk (Tilburg)

Vereenvoudigd model van de Sint-Dionysiuskerk op het Goirke: een neogotisch schip uit 1839 met de vieringtoren, dwarsschip en koor uit de uitbreiding van 1938. De oude voorste torenspits is in 1966 afgebroken.

## Bestanden en plaatsing

- `goirkese-kerk-tilburg.glb`: gesloten bouwdeel in meters, Y omhoog.
- `goirkese-kerk-tilburg.json`: catalogusitem en vervanging van BAG-pand `0855100000019067`.
- `goirkese-kerk-tilburg-1-100.stl` en `goirkese-kerk-tilburg-1-1000.stl`: binaire printbestanden.
- `scripts/generate-goirkese-kerk-tilburg.mjs`: reproduceerbare generator.

Oorsprong RD (133815, 398234) bij de viering, X-as (0,956; -0,294), richting koor. De voet ligt 0,5 m onder het maaiveld van circa NAP +13,65 m. Het AHN5 geeft de torenspits tot NAP +65,66 m; het model is ongeveer 52,4 m hoog. De contour en dakvlakken zijn gebaseerd op BAG, AHN en foto's.

## Vorm en schattingen

Schip, zijbeuken, hoge lichtbeuk, lagere dwarsaanbouwen, transept, vieringtoren, koor en kapellen zijn als afzonderlijke dakvlakken en bouwdelen opgebouwd. Vensters en galmgaten zijn blinde nissen. Dakhellingen, maatvoering van kapellen, nissen en lantaarn zijn geschat. Maaswerk, beelden, smalle dakvensters en het kruis zijn vanwege de printschaal weggelaten; de lantaarn is gesloten uitgevoerd.

## Controle

De generator meldt `NoError`, één component en genus 0. De gerichte plaatsings- en 45-gradensteuncontrole op 1:1000 en twee preview-exports van de volledige kerk zijn geslaagd. Vier hoeken zijn met foto's en de PDOK-reconstructie vergeleken; het model voegt gevelnissen en een hogere lantaarn toe en onderscheidt schip, lage beuken en dwarsschip.

## Bronnen

- [3D BAG-pand 0855100000019067](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000019067), contour en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), DSM en maaiveld.
- [Rijksmonumentenregister 521052](https://monumentenregister.cultureelerfgoed.nl/monumenten/521052).
- [Open Monumentendag](https://www.openmonumentendag.nl/monument/goirkese-kerk/), bouwfasen.
- [Wikimedia Commons: Goirkese kerk](https://commons.wikimedia.org/wiki/Category:Goirkese_kerk), voor- en zijgevels en koorzijde.
