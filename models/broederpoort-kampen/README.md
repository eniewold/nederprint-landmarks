# Broederpoort, Kampen

GLB in meters met Y omhoog; gesloten bouwdelen, STL in mm op 1:1000. Generator `scripts/generate-broederpoort-kampen.mjs`, Node vanuit nederprint-landmarks. Model uit poortprisma, vier dakvlakken, zes-/tienzijdige torens en spitsen, uitgesneden nissen en renaissance-topgevel; geen AHN-hoogteplakken.

Oorsprong RD [190564.99, 507882.26], +X zuidoost langs de gevel, +Y noordoost naar de stad. Vervangt BAG `0166100000012159`; het omringende park, straten en woningen blijven PDOK. Backlogpositie lag circa 20 m zuidelijker: gebouwpositie volgt BAG, controlekaart gecentreerd op het echte gebouw.

## Bronnen en maten

- [RCE 23446](https://monumentenregister.cultureelerfgoed.nl/monumenten/23446) beschrijft vier hoektorens, het hoge schilddak, een spitsbogige stadsmond, brede landzijdige toog, rolwerk en ronde stadstorens die halverwege tienhoekig worden.
- [Visit Kampen](https://visitkampen.nl/locaties/de-broederpoort): bouwgeschiedenis en huidige functie. [Commons](https://commons.wikimedia.org/wiki/Category:Broederpoort): park-, stads- en schuine zijgevels; recente foto's vanuit oost/west en de reeksen Feldseite/Stadtseite gebruikt.
- BAG/BGT 0166100000012159: hoofdblok circa 12,08 × 8,93 m; park-torenmiddens circa ±5,7 / −3,94 m, straal 2,89 m met **zes** zijden; stadszijde ronde torens circa ±5,65 / +3,9 m, straal 1,9–1,96 m. De zes landzijdige zijden komen uit de BAG-contour en zijn op de foto's gecontroleerd; de RCE noemt daarvoor geen aantal. Bovenbouw en spitsen stadszijde hebben tien zijden.
- AHN DSM/DTM 0,5 m: datum NAP +1,55 m, hoofdgoot circa +10,84 m en nok +19,57 m. Vier torentoppen respectievelijk +25,21 / +25,10 / +24,74 / +24,55 m. Hoofdhellingen circa 1,95 m per horizontale meter; dakhoogtes niet afgerond op lagen. Modelfoot −0,3 m. Laagste PDOK-grondsample bij de stadsmond 43,8442009 m ellipsoïdisch; offset +0,23 m brengt het datum bij NAP +1,55 m. De overige twee zijpunten liggen op het hogere talud.

## Geschat en vereenvoudigd

Goothip-inspringing 2 m en overgangsniveaus van de torens zijn op foto's geschat, met de AHN-omhullende als hoogtecontrole. Het rolwerk heeft gelobde onderste schouders, grof gehouden treden, twee blinde boogvensters en een rond nisje. Vier stadsdak-dakkapellen, één parkdak-dakkapel en vier spitsdakvensters hebben geschatte maten en posities. Hoofdvensters, torenvensters en kleine toegangsdeuren zijn 0,35–0,4 m diepe nissen. Toren-spitsen hebben een uitgespreide voet gevolgd door doorlopende schuine vlakken; de makelaar is een tot 0,9 m verdikte bol. Dunne windvanen, kroezen, haken, luikbeslag en gegraveerde letters zijn weggelaten. Losse straatlantaarns en tuinmeubilair zijn geen bouwdeel.

De poorttunnel is 5,2 m breed, met aanzet 1,35 m en top 5,07 m: een spitse kap van 55° die printbaar open blijft. De echte brede ronde parkmond is een 0,35 m diepe ronde uitsparing vóór die kap. De werkelijke ton-/boogvorm is daarmee vereenvoudigd; geen vlak plafond dat de hele doorgang zou opvullen. De centrale opening wordt niet gemodelleerd als zwarte reliëfplaat.

## Controle

Eén gesloten NoError-gebouwvolume met positief volume: de vier torens en spitsen zijn met poort en dak verenigd, zodat de export het dak niet afzonderlijk tot de grond opvult. STL circa 16,8 × 13,5 × 24,0 mm. Toegevoegde vrijstaande/dragende delen minstens 0,9 m; dunner reliëf zit vast aan massieve wanden. Gedeelde 45°-opvulling circa 0,375% extra volume; doorsneden op 1/4/8/15 m blijven gelijk, de 1 × 8 × 1 m meetruimte door de tunnel blijft leeg vóór en na opvulling.

Hele model via `createModelBundle` in een 80 × 80 m uitsnede naar 80 mm: 1:1000, basis 1 mm, rand 0, bomen uit, z=1, overhang 45°. Volledige preview, detail van de doorgang en de kaart bekeken. Vier renders bij 30° kijkhoogte naast dezelfde PDOK-hoek en Commons-foto's, buiten de repository: −35° voegt ronde stadstorens/rolwerk toe; 55° voegt parkmond, dakvenster en spitsen toe; 145° voegt zeszijdige park-torens en zijvensters toe; 235° voegt stadsvensters, dakkapellen en open tunnel toe. PDOK heeft grove, afgesneden torenspitsen en geen doorgang; ieder modelaanzicht voegt herkenbare bouwdelen toe.

Permanente test in `tests/landmark-models.test.ts` controleert vervanging, vier torens/spitsen, nok, één geheel en de blijvend open tunnel na 45°-export.

Controle-URL: http://localhost:3000/kaart/52.55740/5.91160/220/1x1/0?size=80

Nakijken: ronde/tienzijdige stadstorens tegenover zeszijdige park-torens, rolwerk, vijf hoofddak-dakkapellen en het verschil tussen ronde parkmond en spitse doorgaande opening.
