# Sint-Willibrorduskerk (Deurne)

Gotische kruisbasiliek met vijfzijdig gesloten koor, middenschip, lagere zijbeuken, dwarsschip, twee lage geveltorens en westtoren met achtzijdige spits. Het model vervangt BAG-pand 0762100000018832.

## Bestanden en plaatsing

- `sint-willibrorduskerk-deurne.glb`: gesloten model in meters met node `building:kerk`.
- `sint-willibrorduskerk-deurne.json`: RD-oorsprong (183340, 386232), X-as `[0.8, 0.6]`, maaiveldreferentie NAP +26,434 m.
- `sint-willibrorduskerk-deurne-1-100.stl` en `sint-willibrorduskerk-deurne-1-1000.stl`: afdrukmodellen.
- `scripts/generate-sint-willibrorduskerk-deurne.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Maten en vereenvoudiging

De BAG geeft de omtrek en positie. AHN5 toont de westspits tot circa NAP +84,06 m en de hoofdnok rond NAP +53,8 m; 3DBAG meldt circa 8% ontbrekende AHN4-waarden en circa 1,2% in AHN5. De kapvlakken zijn tussen hoogtepunten geïnterpoleerd. Maten van koorsluiting, de lage nevenruimten, traptorentje, steunberen en vensters zijn geschat uit de contour en foto's. De kleine dakpunten zijn voor 1:1000 verdikt. Historische foto's tonen hogere zijtorenspitsen en een dakruiter, maar die zijn bij de restauratie verdwenen en daarom niet opgenomen. Fijn maaswerk, uurwijzers en kruisen zijn weggelaten.

## Controle

Eén gesloten manifold zonder gaten. De gerichte test controleert de plaatsing, pandvervanging, hoogte en de 45-graden-overhangopvulling op 1:1000. Previewexports met en zonder landmark zijn gemaakt voor een uitsnede van 150 bij 150 m en vanuit vier kanten met PDOK en foto's vergeleken. Een historische koorfoto is gebruikt voor de vorm van de achterzijde en aan actuele foto's getoetst voor latere veranderingen.

## Bronnen

- [Rijksmonumentenregister 12372](https://monumentenregister.cultureelerfgoed.nl/monumenten/12372)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0762100000018832)
- [AHN5](https://www.ahn.nl/dataroom)
- [Wikimedia Commons: voor-, zij- en koorgevels](https://commons.wikimedia.org/wiki/Category:Sint-Willibrorduskerk_(Deurne))
- [Bouwgeschiedenis van de kerk](https://www.willibrorduskerkdeurne.nl/kijk-in-de-kerk/korte-historie-van-de-sint-willibrorduskerk/)
