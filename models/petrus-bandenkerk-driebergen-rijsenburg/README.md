# Petrus' Bandenkerk Driebergen-Rijsenburg

Deze classicistische rooms-katholieke kerk aan het Kerkplein is gebouwd in 1809–1810 naar ontwerp van Adrianus Tollus. Het model bevat de kerk, het zuilenportiek, de torenlantaarn, meerdere dwarskappen en de achtervleugel binnen BAG-pand 1581100000009695.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1581100000009695): ligging, omtrek en AHN5-maten uit 2023; maaiveld NAP +4,482 m, scheepsnok NAP +18,346 m.
- [AHN-hoogtekaart](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste meetpunt op de toren circa 23,97 m boven maaiveld. De torentop is in het model 24 m.
- [Rijksmonumentenregister 14099](https://monumentenregister.cultureelerfgoed.nl/monumenten/14099) en [architectuurbeschrijving](https://www.dbnl.org/tekst/gron052utre02_01/gron052utre02_01_0005.php): historie, architectuur en ligging.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Petrus%27_Banden_(Driebergen-Rijsenburg)): foto's van het classicistische front en de gevels.

De kappen, absis, achtervleugel, toren en front zijn afzonderlijke bouwdelen met dakvlakken. Plattegrond en hoofdhoogten volgen BAG en AHN; de gevelvensters, portiek en torenlantaarn zijn naar foto's geschat. Voor 1:1000 zijn de vier portiekzuilen minimaal 0,94 m en tegen de achterliggende wand verbonden. De lantaarn is gesloten, met een vereenvoudigd koepeldak en verdikte top; de balustrade, kruis en kleine ornamenten zijn weggelaten. De rondbogen zijn printbaar vereenvoudigd tot spitsboognissen.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert de catalogus, plaatsing, BAG-vervanging, verbinding, torenhoogte en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn naast de PDOK-reconstructie en foto's bekeken: de vier dwarskappen, lange kap en achtervleugel komen overeen, de toren en portiek zijn op basis van foto's verduidelijkt. De voorzijde en zijgevel zijn fotografisch gecontroleerd; de achterzijde is vooral met BAG en PDOK beoordeeld. Binnen 10 m van het model zijn geen andere PDOK-panden aangetroffen.

Regenereren: `node scripts/generate-petrus-bandenkerk-driebergen-rijsenburg.mjs` vanuit de landmarks-repository.
