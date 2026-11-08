# Sint-Willibrorduskerk (Diessen)

Driebeukige gotische kerk met ongedeelde kap, lager dwarsschip, koor en slanke westtoren. Het model vervangt BAG-pand 0798100000006301.

## Bestanden en plaatsing

- `sint-willibrorduskerk-diessen.glb`: gesloten model in meters met node `building:kerk`.
- `sint-willibrorduskerk-diessen.json`: RD-oorsprong (140290, 387374), X-as `[0.9798, 0.2]`, maaiveldreferentie NAP +17,696 m.
- `sint-willibrorduskerk-diessen-1-100.stl` en `sint-willibrorduskerk-diessen-1-1000.stl`: afdrukmodellen.
- `scripts/generate-sint-willibrorduskerk-diessen.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Maten en vereenvoudiging

De BAG geeft de omtrek en positie. AHN5 toont de westspits tot circa NAP +76,15 m en de hoofdnok rond NAP +35,17 m; 3DBAG meldt circa 2,7% ontbrekende AHN4-waarden en 2,6% in AHN5. De regelmatige kapvlakken zijn tussen hoogtepunten geïnterpoleerd. Maten van koorsluiting, sacristie, steunberen en vensters zijn geschat uit de contour en foto's. De spits is voor 1:1000 verdikt; fijn maaswerk, uurwijzers en kruisen zijn weggelaten.

## Controle

Eén gesloten manifold zonder gaten. De gerichte test controleert de plaatsing, pandvervanging, hoogte en de 45-graden-overhangopvulling op 1:1000. Twee previewexports zijn gemaakt met en zonder landmark op een uitsnede van 150 bij 150 m. De kerk is van vier kanten vergeleken met de PDOK-reconstructie en met voor-, zij- en koorfoto's; enkele foto's zijn historisch.

## Bronnen

- [Rijksmonumentenregister 12898](https://monumentenregister.cultureelerfgoed.nl/monumenten/12898)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0798100000006301)
- [AHN5](https://www.ahn.nl/dataroom)
- [Wikimedia Commons: voor-, zij- en koorgevels](https://commons.wikimedia.org/wiki/Category:Willibrordus,_Diessen)
