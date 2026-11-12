# Johanneskerk (Nieuwerkerk)

Het model omvat het vijfzijdig gesloten gotische koor met sacristie, de lagere kerkzaal en verbindingsdelen en de vrijstaande zeskantige toren. Het oorspronkelijke schip is na brand verdwenen; de toren is in 1976 op de oorspronkelijke fundamenten herbouwd. Kerk en toren blijven twee afzonderlijke bouwdelen met elk een gesloten mesh.

## Bronnen en maten

- [3D BAG kerk en zaal, pand 1676100000432074](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000432074): plattegrond en dakvlakken; koornok NAP +20,53 m en maaiveld ca. +0,82 m.
- [3D BAG toren, pand 1676100000462578](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000462578): zeshoekige torenvoet en positie. De toren heeft een afzonderlijk BAG-pand.
- [PDOK AHN DSM/DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): lokaal maaiveld ca. NAP +1,0 m en hoogste torenpunt NAP +32,95 m; bij het kerkgebouw is de hoogste DSM-meting +21,06 m.
- [Rijksmonument kerk 14164](https://monumentenregister.cultureelerfgoed.nl/monumenten/14164), [toren 14165](https://monumentenregister.cultureelerfgoed.nl/monumenten/14165) en [beschrijving bouwgeschiedenis](https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0064.php).
- [Wikimedia Commons: Sint Johannes Evangelist](https://commons.wikimedia.org/wiki/Category:Sint_Johannes_Evangelist_(Nieuwerkerk)): foto's uit meerdere richtingen.

Geschat of vereenvoudigd: de torenkap en torentop (32,2 m boven maaiveld), steunberen, vensternissen, sacristie en de vorm van de lage verbindingen. In de zeshoekige toren zijn blinde galmgaten gebruikt; glasroeden en details kleiner dan 0,9 m zijn weggelaten. Eén vensternis bij de koorsluiting is weggelaten omdat die bij deze schaal een onbedoelde doorgang vormde.

## Bestanden en plaatsing

`johanneskerk-nieuwerkerk.glb` gebruikt meters met Y omhoog en nodes `building:kerk` en `building:toren`. De JSON plaatst het model op RD (59060, 407649) met X-as [0,9994, -0,034] en vervangt beide BAG-panden. STL-bestanden zijn schaal 1:100 en 1:1000. Genereer met `node scripts/generate-johanneskerk-nieuwerkerk.mjs`.

## Controle

De gerichte catalogus- en printtest in `tests/landmark-models.test.ts` slaagt: kerk en toren zijn elk één gesloten manifold, de overhangopvulling op 45° verandert elk volume en de doorsneden met minder dan 3%. Vier schuine modelbeelden zijn naast PDOK en foto's vergeleken: toren en koor behouden hun scheiding, hoofdvormen en zadeldaken; ramen en steunberen zijn toegevoegd. Nabijgelegen PDOK-panden zijn steekproefsgewijs met AHN vergeleken. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
