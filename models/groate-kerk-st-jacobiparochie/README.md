# Groate Kerk (St.-Jacobiparochie)

Neoclassicistische kerk van Thomas Romein (1843), vereenvoudigd voor NederPrint. De GLB is de bron voor de kaart en export; de STL is bedoeld voor 1:1000.

## Bestanden

- `groate-kerk-st-jacobiparochie.glb`: gesloten model in meters, node `building:kerk`.
- `groate-kerk-st-jacobiparochie.json`: catalogus, plaatsing en bronnen.
- `groate-kerk-st-jacobiparochie-1-1000.stl`: gesloten printmodel zonder grondplaat.
- Generator: `scripts/generate-groate-kerk-st-jacobiparochie.mjs`.

## Ligging en bouwdelen

Oorsprong RD (169411,75, 587400,00), op maaiveld NAP +0,829 m; lokale +X loopt langs de brede hoofdgevel [0,990149, 0,140016], +Y naar de achterzijde. Het model vervangt BAG-pand 0063100000002015. De voet steekt 0,5 m in het maaiveld. De hoofdzaal heeft een 3D BAG-schilddak met een nok op NAP +15,81 m, afzonderlijke lagere achterbouwen, en een voorhal met fronton en vier Dorische zuilen. Boven de voorhal staan de vierkante klokgeleding, ronde lantaarn en koepel; rondboogvensters en galmgaten zijn blinde nissen.

## Maten en vereenvoudiging

Plattegrond en dakvlakken zijn gemeten uit BAG en 3D BAG LoD2.2 en vergeleken met AHN-DSM 0,5 m (de hoogste ter plaatse gemeten waarde NAP +30,93 m omvat de dunne bekroning). Klokgeleding, lantaarn en koepel volgen de 3D BAG- en AHN-hoogten; het bovenste koepelpunt ligt op +27,7 m boven maaiveld. De zuilen, deuren, raamafmetingen, nissen en laagbouwdetails zijn geschat uit foto's. De open ruimte achter de zuilen en lantaarn is voor steunvrij printen gesloten en met ondiepe nissen weergegeven. Fijne roeden, balustrade, uurwijzers en de te dunne windvaan zijn weggelaten.

## Controle

Generator: NoError, één gesloten onderdeel, genus 0, omvang 29,88 × 37,17 × 28,2 m. De modeltest controleert plaatsing, BAG-vervanging en printbare 45°-ondersteuning op 1:1000. De uitsnede van 150 × 150 m is geëxporteerd met en zonder landmark voor de vergelijking van vier hoeken met de PDOK-gebouwtegel en foto's. Controleer op de kaart vooral het fronton met zuilen, de koepeltoren en de lagere achterbouw.

## Bronnen

- [3D BAG, pand 0063100000002015](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0063100000002015)
- [Rijksmonumentenregister 9511](https://monumentenregister.cultureelerfgoed.nl/monumenten/9511)
- [Wikimedia Commons, Groate Kerk](https://commons.wikimedia.org/wiki/Category:Groate_Kerk)
- [De Groate Kerk, gevels en geschiedenis](https://groatekerk.nl/in-de-kerk/)
- PDOK AHN DSM 0,5 m, WCS, geraadpleegd in RD.
