# Doopsgezinde kerk, Borne

Een vereenvoudigd model van de zaalkerk aan de Ennekerdijk 31, rijksmonument 9921. De kerk heeft een rechthoekige plattegrond, schilddak en verhoogde lijstgevel aan de straat met een ingang en spitsboogvensters.

## Bronnen en maatvoering

- [3D BAG, pand 0147100000011150](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0147100000011150): voetafdruk circa 15,36 × 7,52 m, maaiveld NAP +14,505 m en nok NAP +24,39 m; vier hellende dakvlakken.
- [AHN DSM 0,5 m](https://www.ahn.nl/dataroom): dakdoorsneden bevestigen de nok op circa 9,8 m boven maaiveld.
- [Rijksmonumentenregister 9921](https://monumentenregister.cultureelerfgoed.nl/monumenten/9921): zaalkerk met lijstgevel.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Doopsgezinde_kerk,_Borne): gevel, ramen en dakvorm.

De grootte en plaatsing van de vensters en deur, de diepte van de nissen en de hoogte van de lijstgevel zijn geschat naar foto's. De achtergevel is niet op een voldoende duidelijke recente foto gecontroleerd. De opnamen 20038507 en 20038508 uit april 1985 tonen de kerk tijdens herstel na brand en zijn daarom geen betrouwbaar bewijs voor de huidige toestand. Kleine details zoals raamhout, dakpannen en de dunne goot zijn weggelaten omdat ze kleiner zijn dan 0,9 m op ware grootte.

## Model en print

De GLB is in meters, Y omhoog, met één gesloten `building:kerk`-node. Oorsprong RD (248711,116; 480017,536), lokale +X langs de nok naar de straatgevel in het westen; onderzijde ligt 0,5 m onder maaiveld. Vervangt BAG-pand `NL.IMBAG.Pand.0147100000011150`. De STL's zijn in millimeters op 1:100 en 1:1000. Ramen zijn blinde nissen; dakvlakken zijn uit geometrische vlakken opgebouwd.

Genereer met `node scripts/generate-doopsgezinde-kerk-borne.mjs --scale 100` en `--scale 1000`.

