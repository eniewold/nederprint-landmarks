# Waalse Kerk (Breda)

Vereenvoudigde voormalige Wendelinuskapel met eenbeukig schip, lager koor, straatvleugel, westelijke aanbouw, steunberen, spitsboognissen en dakruiter. Het model vervangt BAG-pand 0758100000000403.

## Bestanden en plaatsing

- `waalse-kerk-breda.glb`: gesloten model in meters, met node `building:kerk`.
- `waalse-kerk-breda.json`: plaatsing op RD (112828, 400269), lokale X-as ongeveer oostwaarts `[0.9998, -0.02]`, maaiveldreferentie NAP +3,075 m.
- `waalse-kerk-breda-1-100.stl` en `waalse-kerk-breda-1-1000.stl`: afdrukmodellen.
- `scripts/generate-waalse-kerk-breda.mjs`: reproduceert de modellen met vlakken en bouwdelen.

## Maten en vereenvoudiging

De BAG levert de positie en de omtrek; AHN5 toont het hoofddak tot ongeveer NAP +22,1 m en de dakruiter tot NAP +34,88 m. Het maaiveld komt uit 3DBAG; AHN4 heeft circa 9,4% ontbrekende waarden binnen het pand en AHN5 volgens 3DBAG geen. De dakvlakken, de lagere koorkap en de locatie van de dakruiter zijn tegen AHN5 en foto's afgelezen. De vorm van het westelijk bouwdeel, de steunberen, portaal, vensters en precieze maten van de lantaarn zijn op basis van foto's en de BAG-contour geschat. De slanke dakruiter is verdikt en zijn open lantaarn is op deze schaal als gesloten volume met blinde nissen weergegeven. Fijn maaswerk, kruisen, dakranden en details kleiner dan 0,9 m zijn weggelaten.

## Controle

De mesh is één gesloten manifold zonder gaten. De gerichte test controleert plaatsing, pandvervanging, hoogte en de 45-graden-overhangopvulling op 1:1000. Preview-exports met en zonder landmark zijn voor een uitsnede van 150 bij 150 m gemaakt en van vier kanten met elkaar en bronfoto's vergeleken. De voetafdrukken verschillen plaatselijk door vereenvoudiging; de dakruiter is aanvullend ten opzichte van PDOK zichtbaar.

## Bronnen

- [Rijksmonumentenregister 10118](https://monumentenregister.cultureelerfgoed.nl/monumenten/10118)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000000403)
- [AHN-dataroom](https://www.ahn.nl/dataroom)
- [Wikimedia Commons, buitenfoto's](https://commons.wikimedia.org/wiki/Category:Waalse_kerk_(Breda))
- [Erfgoed Breda](https://erfgoed.breda.nl/erfgoed/archief/de-waalse-kerk/)
