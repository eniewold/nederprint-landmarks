# Sint-Willibrorduskerk (Esch)

Kruiskerk met de oudere toren naast de voorgevel, roosvenster, lagere zijvleugels, traptorentje, dakruiter en veelzijdig koor met twee ronde aanbouwen. Het model vervangt BAG-pand 0788100000000402.

## Bestanden en plaatsing

- `sint-willibrorduskerk-esch.glb`: gesloten model in meters met node `building:kerk`.
- `sint-willibrorduskerk-esch.json`: RD-oorsprong (148405, 402523), X-as `[0.9798, 0.2]`, maaiveldreferentie NAP +7,452 m.
- `sint-willibrorduskerk-esch-1-100.stl` en `sint-willibrorduskerk-esch-1-1000.stl`: afdrukmodellen.
- `scripts/generate-sint-willibrorduskerk-esch.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Maten en vereenvoudiging

BAG geeft de omtrek en de positie. AHN5 toont de toren tot NAP +34,32 m en de kap van de viering tot circa NAP +26,3 m. De dakvlakken zijn geïnterpoleerd tussen meetpunten; 3DBAG meldt circa 2,7% ontbrekende AHN4-waarden en 0,5% in AHN5. Maten en plaatsing van aanbouwen, traptorentje, dakruiter, roosvenster, steunberen en vensters zijn geschat uit foto's en BAG. De open dakruiter is gesloten met blinde nissen; fijne raamtraceringen, uurwijzers, kruisen en details onder 0,9 m zijn weggelaten.

## Controle

Eén gesloten manifold zonder gaten. Een gerichte test controleert plaatsing, pandvervanging, hoogte en 45-graden-overhangopvulling op 1:1000. Previewexports met en zonder landmark zijn gemaakt op een uitsnede van 150 bij 150 m. De modellen zijn uit vier richtingen vergeleken met PDOK en foto's van voor-, achter- en zijkanten.

## Bronnen

- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0788100000000402)
- [AHN5](https://www.ahn.nl/dataroom)
- [Wikimedia Commons: foto's van de kerk](https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Esch))
- [Beschrijving bouwgeschiedenis](https://www.ensie.nl/monumenten-in-noord-brabant/de-rk-st-willibrorduskerk-in-esch)
