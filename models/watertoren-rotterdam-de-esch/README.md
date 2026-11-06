# Watertoren De Esch (Rotterdam)

De voormalige watertoren van de Rotterdamse drinkwaterleiding (1871–1873) is ontworpen door C.B. van der Tak. Het model toont de ronde bakstenen romp met drie rijen boogvensters, de uitkragende reservoirgeleding, kegelkap met dakkapellen, lantaarn en uivormige bekroning. Het model is opgebouwd uit omwentelingsvormen, bouwdelen en blinde nissen.

- `watertoren-rotterdam-de-esch.glb`: één gesloten node `building:watertoren` in meters.
- `watertoren-rotterdam-de-esch.json`: RD-plaatsing en vervanging van BAG-pand `0599100000758803`.
- `watertoren-rotterdam-de-esch-1-1000.stl`: losse print, Z omhoog, 25,2 × 21,6 × 47,8 mm.
- Generator: `node scripts/generate-watertoren-rotterdam-de-esch.mjs`.

De oorsprong RD (95327,85, 436345,06) is het torenhart, X wijst oost. Onderzijde −0,5 m. De 3D BAG geeft maaiveld NAP +2,593 m en dakvlakken tussen circa +29,3 en +35,2 m; AHN meet maximaal NAP +45,56 m op de lantaarn. Het rijksmonumentenregister noemt de volledige hoogte 48 m; het model reikt tot circa 47,3 m boven maaiveld. De dunne spits en exacte hoogtes van de lantaarn zijn geschat uit foto's en bronhoogte.

De indeling en afmetingen van de nissen, dakkapellen, bekroning en de lage aanbouw zijn geschat. De oorspronkelijke gekoppelde vensters zijn op 1:1000 vereenvoudigd tot blinde boognissen; de fijne kozijnen, houten detaillering, vlaggenmast en balustrades zijn weggelaten. Een lage aanbouw in het vervangen BAG-pand is vereenvoudigd; andere panden blijven in PDOK. Controleer de aansluiting op het terrein en de naastgelegen bebouwing op de kaart.

De generator controleert de geslotenheid. Eén volume, genus 0; op 45° bleef de volumeverhouding na de steunberekening 0,9999999995. Doorsneden per 0,1 m lieten geen relevante toename zien. Een volledige uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd; vier modelaanzichten zijn vergeleken met PDOK en foto's. De fotohoeken zijn benaderend en tonen vooral de zijde aan de waterbassins.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000758803), [AHN DSM PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/32914), [foto](https://mylittledutchblog.com/2023/10/05/een-oude-watertoren-en-een-interessante-buurt/), [luchtfoto](https://ooms.com/actueel/start-verkoop-watertorenweg-160-200-en-filterhuispad-10-60-te-rotterdam).
