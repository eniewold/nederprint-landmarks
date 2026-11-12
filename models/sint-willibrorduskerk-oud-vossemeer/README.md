# Sint Willibrorduskerk (Oud-Vossemeer)

Een eenvoudige zaalkerk uit 1841 met recht gesloten koor, lage zijaanbouw en houten geveltorentje. De naastgelegen pastorie is een eigen BAG-pand en blijft door PDOK weergegeven.

## Bronnen en maten

- [3D BAG kerk, pand 0716100000072954](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0716100000072954): contour en dakvlakken; nok NAP +12,04 m.
- [PDOK AHN DSM/DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): lokaal maaiveld ca. NAP +0,5 m en hoogste DSM-meting van het kleine torentje +17,27 m NAP.
- [Rijksmonument kerk 35368](https://monumentenregister.cultureelerfgoed.nl/monumenten/35368), [Rijksmonument pastorie 496075](https://monumentenregister.cultureelerfgoed.nl/monumenten/496075) en [bouwbeschrijving](https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0074.php).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Willibrorduskerk_(Oud-Vossemeer)): voorgevel en zijgevels op historische en recente foto's.

Het in de 3D BAG grotendeels ontbrekende houten torentje is met foto's en AHN aangevuld; de torentop is op 16,75 m boven maaiveld geschat. De open lantaarn is als massieve kern met blinde galmgaten uitgevoerd en de spits is op schaal verbreed. Nissen, zijaanbouw en gevelopeningen zijn geschat of vereenvoudigd; glasroeden, uurwerk en de dunne kruisbekroning zijn weggelaten.

## Bestanden en plaatsing

`sint-willibrorduskerk-oud-vossemeer.glb` gebruikt meters met Y omhoog en een `building:kerk`-node. De JSON plaatst de oorsprong op RD (72488, 398805) met X-as [-0,071, 0,9975] en vervangt het kerkgebouw. STL-bestanden zijn schaal 1:100 en 1:1000. Genereer met `node scripts/generate-sint-willibrorduskerk-oud-vossemeer.mjs`.

## Controle

De gerichte catalogus- en printtest in `tests/landmark-models.test.ts` slaagt: één gesloten manifold en de overhangopvulling op 45° verandert volume en doorsneden met minder dan 3%. Vier schuine modelbeelden zijn naast PDOK en foto's vergeleken: het model herstelt het torentje en toont vensternissen, terwijl de hoofdvorm en pastorie behouden blijven. De PDOK-top van de pastorie ligt op circa NAP +9,43 m, 3D BAG meet +9,81 m; er is geen aanwijzing voor een hoge kolom. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
