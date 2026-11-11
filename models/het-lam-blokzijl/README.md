# Het Lam, Blokzijl

Vereenvoudigd model van de doopsgezinde vermaning aan de Breestraat 2: een zaalkerk met zadeldak met wolfseinden aan beide uiteinden, achter de rechte voorgevel, portaal, hoge vensternissen en een lagere dwarsaanbouw. Het Rijksmonumentenregister dateert het gebouw in het derde kwart van de zeventiende eeuw; BAG vermeldt 1820.

## Bronnen en maten

- [BAG/3D BAG, pand 1708100000016185](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000016185): plattegrond, richting van de nok en LoD2.2-dakvlakken; nok NAP +14,87 m, maaiveld NAP +0,86 m.
- [PDOK AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): dwarsdoorsneden van het dak bevestigen een nok van ongeveer NAP +14,4 à +14,5 m en aflopende dakvlakken.
- [Rijksmonument 507462](https://monumentenregister.cultureelerfgoed.nl/monumenten/507462) en [RCE-beschrijving](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/507462): gebouwgeschiedenis en dakvorm.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Doopsgezinde_kerk_(Blokzijl)): voorgevel, vensters en zijgevel.

Vensterbreedten, nisdiepte, portaal en gevelbekroning zijn vereenvoudigd en uit foto's geschat. De ronde vensters zijn blinde nissen; onderverdeling van het glas en kleine details zijn weggelaten. Op de PDOK-luchtfoto neemt de kleine schoorsteen van de achteraanbouw inclusief schaduw ongeveer 0,6 tot 0,75 m in; omdat deze maat onder 0,9 m ligt en het AHN 0,5 m raster hem niet betrouwbaar scheidt van de daknok, is hij weggelaten. Het model heeft geen toren. De onderkant ligt 0,5 m onder maaiveld.

## Bestanden

`het-lam-blokzijl.glb` is de bron voor de kaart (meters, Y omhoog); de JSON plaatst het model op RD (193743,835, 526837,025), X langs de nok naar het noordwesten. Het vervangt BAG-pand `NL.IMBAG.Pand.1708100000016185`. De STL's zijn in millimeters op 1:100 en 1:1000 met een vlakke onderkant. Genereer met `node scripts/generate-het-lam-blokzijl.mjs` vanuit deze repository.


## Controle

De gerichte modeltest in `tests/landmark-models.test.ts` slaagt op 1:1000; de generator meldt één gesloten component en `NoError`. Een preview-export van een uitsnede van 200 × 200 m bevat het gehele model. De PDOK-gebouwmesh is vanuit vier schuine hoeken vergeleken met het model: het model voegt het portaal, de voorgevel en de vensternissen toe en behoudt de lagere dwarsaanbouw. De voorgevel en één zijgevel zijn ook met foto's vergeleken; de tegenoverliggende zijde en details van de aanbouw blijven schattingen. Twee naburige PDOK-panden raken de modelvoet niet en hun hoogte is vergeleken met het AHN.
