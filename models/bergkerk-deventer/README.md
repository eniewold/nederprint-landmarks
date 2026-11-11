# Bergkerk (Deventer)

Een vereenvoudigde, printbare weergave van de Sint-Nicolaas- of Bergkerk met de twee romaanse westtorens, schip, zijbeuken, dwarsschip en koorsluiting.

## Bronnen en maatvoering

- [3D BAG, pand 0150100000000704](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0150100000000704): contour, dakvlakken en maaiveld NAP +12,897 m. De nok van het schip ligt circa 29 m boven maaiveld.
- [AHN DSM 0,5 m](https://www.ahn.nl/dataroom): profielen en posities van de torens; hoogste meetpunt circa NAP +62,9 m.
- [Rijksmonumentenregister 12416](https://monumentenregister.cultureelerfgoed.nl/monumenten/12416): de twee romaanse torens; [kerk 12423](https://monumentenregister.cultureelerfgoed.nl/monumenten/12423).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Bergkerk_(Deventer)): westfront, noord- en zuidgevel, koor en dakvormen.

Gebouwdelen en vensters zijn vereenvoudigd naar de foto's. Vensterdiepte, lijstwerk, exacte hoogte en details van de torenbekroningen en de steunberen zijn geschat; de scherpe spitsen zijn bovenaan tot 0,9 m verdikt voor 1:1000. Dun raamtracering, wijzerplaten, kruisen, dakramen en treden kleiner dan 0,9 m zijn weggelaten. De koorsluiting en de kleine aanbouw zijn geometrisch vereenvoudigd.

## Model en print

De GLB bevat één gesloten `building:kerk`-node, in meters met Y omhoog. Oorsprong RD (207989; 474058), lokale +X loopt langs de nok naar het koor. Onderzijde 0,5 m onder maaiveld. Het model vervangt BAG-pand `NL.IMBAG.Pand.0150100000000704`; de torens liggen binnen datzelfde pand. De STL's zijn in millimeters op 1:100 en 1:1000.

Genereer met `node scripts/generate-bergkerk-deventer.mjs --scale 100` en `--scale 1000`. Het model bestaat uit dakvlakken en afzonderlijke bouwdelen; nissen zijn blind. De test controleert plaatsing, manifold, één component en overhangopvulling met doorsneden.
