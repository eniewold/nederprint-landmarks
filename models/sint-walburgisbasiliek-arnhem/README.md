# Sint Walburgisbasiliek (Arnhem)

De Sint-Walburgiskerk op het Sint Walburgisplein is een pseudobasilicale kruiskerk met twee westtorens, een driezijdig gesloten koor en kapellen aan de zuidzijde. De oudste bouwfase dateert uit de veertiende eeuw; het complex is rijksmonument 8370.

## Model en bestanden

Het model bevat het langsschip en dwarsschip met zadeldaken, lagere zijbeuken, de kapellen met eigen daken, een afgeschilde koorsluiting met drie vensternissen en arcade, twee westtorens met geknikte, uitlopende dakvoeten en ingesnoerde spitsen, steunberen en ondiepe spitsboognissen voor vensters en galmgaten. De voornaamste dakvlakken zijn analytische vlakken; de GLB heeft één gesloten node `building:walburgisbasiliek` in meters en Y omhoog. De binaire STL gebruikt millimeters en Z omhoog op 1:1000.

De oorsprong ligt bij de viering op RD (191170; 443535); +X wijst langs het schip naar het oosten. De voet ligt 0,5 m onder het maaiveld. Het model vervangt BAG-pand `NL.IMBAG.Pand.0202100000268355`. Het aangrenzende pand `0202100000853624` hoort daar niet bij.

Regenereren: `node scripts/generate-sint-walburgisbasiliek-arnhem.mjs`; `--out` en `--scale` zijn optioneel.

## Bronnen en schattingen

- [3D BAG pand 0202100000268355](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000268355): gebouwcontour en dakvlakken. Schip en dwarsschip hebben een nok van circa NAP +41,1 m, de goten liggen rond +33,5 m en het maaiveld rond +12,7 m NAP.
- PDOK AHN-DSM 0,5 m en actuele orthofoto: controle van de dakvorm en de ligging van de twee torens en de kapellen; hoogste rasterwaarde in de uitsnede circa NAP +61 m.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/8370), [Wikipedia](https://nl.wikipedia.org/wiki/Sint-Walburgiskerk_(Arnhem)) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Walburgisbasiliek): naam, bouwgeschiedenis en de zichtbare gevels.

De vorm en hoogte van de twee torenspitsen zijn geschat; hun toppen staan op 48,4 m boven maaiveld en zijn bovenaan verbreed tot 0,9 m voor de print. Ook de precieze maatvoering van de steunberen, kapeldaken, vensters en boogfriezen is vereenvoudigd en op luchtfoto en foto's geschat. De kerkramen en galmgaten zijn blinde nissen met puntige bovenzijde. Maaswerk, uurwerkdetails, kruisen en andere elementen kleiner dan 0,9 m zijn weggelaten; de kleine openingen van de dakrand zijn als boognissen vereenvoudigd.

## Printcontrole

De generator controleert gesloten geometrie, Float32-herinlezing en neerwaartse vlakken steiler dan 45 graden. De STL is één gesloten component. In een aparte controle van de 45-graden-export nam het volume minder dan 0,01% toe; doorsneden op 5, 10, 15, 19, 22, 27, 35 en 45 m bleven binnen 0,1% gelijk. De kaartpositie en de volledige 1:1000-preview zijn bekeken. Een export met en zonder landmark is vanuit vier gelijke hoeken met PDOK en foto's vergeleken; de twee spitsen, kapellen en koorvensters zijn toegevoegd. De fotohoeken komen niet overal exact overeen.
