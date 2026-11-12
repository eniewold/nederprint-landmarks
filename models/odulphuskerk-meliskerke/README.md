# Odulphuskerk, Meliskerke

Eenbeukige middeleeuwse kerk met scheve vierkante toren en tentdak, een klein portaal, steunberen en de twee gebogen oostelijke uitbreidingen uit 2011. De toren en kerk dateren volgens de gemeente uit 1350–1400; de BAG-vermelding 1900 is geen bewezen bouwjaar.

## Bronnen en maatvoering

- [3D BAG, pand 0717100000000255](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0717100000000255): grondplan, oriëntatie en dakvlakken; maaiveld NAP +1,415 m, nok NAP +13,80 m. Het complete kerkcomplex en de uitbreiding behoren tot hetzelfde pand.
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld en torenhoogte; het gemodelleerde tentdak is circa 22,9 m boven maaiveld. De fijne windvaan is weggelaten omdat die op 1:1000 dunner dan 0,9 mm is.
- [Rijksmonument 28118](https://monumentenregister.cultureelerfgoed.nl/monumenten/28118), [gemeente Veere/Zeeland](https://www.zeeland.com/nl-nl/visit/561_nl/odulphuskerk) en [Commons-foto’s](https://commons.wikimedia.org/wiki/Category:Odulphuskerk_(Meliskerke)): de scheve toren, galmgaten, portaal, vensters en gebogen nieuwe vleugels.

De helling en knik van de toren, maatvoering van het tentdak, gevelopeningen, de dakprofielen van de moderne vleugels en details van het portaal zijn uit de bronnen en foto’s geschat. De open galmgaten zijn voor de print blinde nissen; klokken en uurwerken zijn te klein en weggelaten. De boogdaken bestaan uit een uitgetrokken gebogen dwarsprofiel met vlakke segmenten en vormen geen gestapelde hoogteplakken.

## Bestanden en controle

De GLB heeft één gebouw-node, meters en Y omhoog; de JSON plaatst het model met RD-oorsprong (24790, 393525) en xAxis (0,99, 0,141) en vervangt het genoemde BAG-pand. De onderkant ligt 0,5 m onder het lokale maaiveld. STL’s staan op 1:100 en 1:1000. Generator: `node scripts/generate-odulphuskerk-meliskerke.mjs --scale 1000`.

De gerichte modeltest controleert plaatsing, één gesloten component, genus 0 en de 45-gradensteun met volume en doorsneden. De vierzijdige PDOK-/modelvergelijking naast foto’s toont de herstelde galmgaten, steunberen, vensters en twee boogvormige uitbreidingen; de PDOK-gebouwdelen in de directe nabijheid zijn onderzocht en er is geen bevestigde abnormaal hoge kolom gevonden. De kaart en de preview-export van de volledige uitsnede zijn in de webshop gecontroleerd.
