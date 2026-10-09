# Stadhuis (Rotterdam)

`stadhuis-rotterdam.glb` bevat één gesloten `building:`-node in meters, Y omhoog; de JSON plaatst die in RD en vervangt uitsluitend BAG-pand 0599100000701897. `stadhuis-rotterdam-1-1000.stl` is Z omhoog in millimeters, met vlakke onderkant. Herhaal met `node scripts/generate-stadhuis-rotterdam.mjs`; `--out` wijst naar een catalogusmap.

RD-oorsprong [92580, 437529], X-as [.959, .284]; de Coolsingel ligt aan -X en Doelwater aan +Y. Straatniveau circa NAP +.45m. De voet loopt .8m onder het bemonsterde maaiveld; geen dubbele terreinplaat. Het pand blijft op de kaart staan op straatmonsterpunten langs de vier buitenzijden.

Vier buitenvleugels met eigen schilddaken, hoekrisalieten, trappenhuiskappen, hoofdportaal, trapgevel, voorste wachthoven, raadzaal, drie glazen achterkappen en de open binnentuin zijn bouwdelen. De toren bestaat uit vierkante onderbouw, galmnissen, achthoekige lantaarn, vier klokgevels, koperen koepel en vereenvoudigd Vredesbeeld. Alle zichtbare buitengevels en tuinwanden hebben een vensterritme; dakkapellen en schoorstenen staan afzonderlijk op de kappen.

## Gemeten, geschat en weggelaten

BAG en ortho bepalen de contour en de hoofdassen; AHN-DSM/DTM .5m bepaalt maaiveld, dakranden, nokken, hoekdaken en torenomhullende. Daknokken liggen op 31.12, 31.83, 31.82 en 31.76m boven straat. Torentop met beeldromp 74.5m, overeenkomend met de smalle AHN-top rond NAP +75m. De in het register genoemde 71.5m is geen reden om de aantoonbare hogere beeldtop af te knippen.

Venster- en dakkapelmaten, klokgevels, lantaarn, koepelprofiel, de kleine voorste toren en risalietdetails zijn naar foto's vereenvoudigd. Geen automatische hoogteplakken: kappen bestaan uit doorlopende vlakken, de koepel uit een radiaal profiel. Portieken/balkons hebben een volle draagkern; vensters en bogen zijn blinde nissen voor steunvrij printen op 1:1000. Het Vredesbeeld heeft een vaste schematische romp. Raamroeden, vlaggenmasten, losse tuinsculptuur en dunne beeldledematen zijn weggelaten wegens onderdelen onder .9mm op printschaal. De twee loopbruggen naar andere gebouwen blijven bij de PDOK-omgeving; die gebouwen worden niet verborgen.

## Controle

Generator: `NoError`, één verbonden buitenhuid, genus 6, 11.468 driehoeken, 107.1 × 89.6 × 75.3mm op 1:1000; volume 168.73cm³. Gesloten kleine holtes door overlappende nissen worden gevuld, de tuin blijft open. Regressietest controleert plaatsing, exacte pandvervanging, voet, torentop, hoekbekroningen en het lege tuinmidden. De twee landmarktestsuites zijn groen (277 tests); na aanvulling van torenmuurnissen en vier pinakels zijn met print- en previewcontroles 279 tests groen.

Printcontrole bij 45°: gesloten `NoError`, 171.953 → 171.995mm³, circa .02% extra integrale overhangopvulling. Preview en 3MF: volledige uitsnede RD [92495,437445,92670,437620], 175 × 175mm op 1:1000, 222 objecten, 78.088 driehoeken, totale hoogte 80.9mm. GLTFLoader gecontroleerd. Kaartcontrole via `http://localhost:3019/kaart/51.92273501/4.47979129/350/1x1/0`, bovenaanzicht en schuin, inclusief aan/uit-vervanging van PDOK.

Vier schuine vergelijkingen met dezelfde PDOK-hoeken: -35° voegt achterkappen, hofvensters en dakkapellen toe; 55° toont afzonderlijke voorste toren, trapgevel en koepel; 145° voegt zijgevelreliëf en complete klokbekroning toe; 235° toont vensterritme, hoektorentjes en dakdetails. Geen zijde blijft een vlakke PDOK-gevel. De controlebeelden en exports blijven buiten de repo.

## Bronnen

- PDOK BAG-WFS pand 0599100000701897, Actueel_orthoHR en AHN DSM/DTM .5m, RD-bbox [92460,437400,92700,437650], geraadpleegd 9 oktober 2026.
- [RCE, monument 513763](https://monumentenregister.cultureelerfgoed.nl/monumenten/513763): bouwdelen en hoven.
- [Commons, NL-Rotterdam-rathaus](https://commons.wikimedia.org/wiki/File:NL-Rotterdam-rathaus.jpg): volledige schuine voorgevel.
- [RCE-foto 20377466](https://commons.wikimedia.org/wiki/File:Overzicht_achtergevel_-_Rotterdam_-_20377466_-_RCE.jpg): hofgevel en kapelletjes.
- [Commons, City hall Rotterdam](https://commons.wikimedia.org/wiki/Category:City_hall,_Rotterdam): schuine geveldetails en voorgevel RCE 20377524.
