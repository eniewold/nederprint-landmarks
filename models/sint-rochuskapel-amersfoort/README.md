# Sint Rochuskapel Amersfoort

De vroeg-16e-eeuwse kapel bij het hofje De Armen de Poth heeft een driezijdige sluiting en een open dakruiter. Het model vervangt BAG-pand 0307100000321277.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0307100000321277): omtrek, ligging en AHN5-gegevens uit 2023; oppervlakte 83,12 m², maaiveld NAP +2,814 m en nok NAP +14,509 m.
- [AHN-hoogtekaart](https://service.pdok.nl/rws/ahn/wcs/v1_0): dakprofiel en hoogtepunten dakruiter; nabij de ruiter is circa 14,4 m boven maaiveld gemeten, de spitstop is naar foto's geschat op 15,2 m.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/324416) en [Monumenten in Nederland](https://www.dbnl.org/tekst/sten009monu01_01/sten009monu01_01_0011.php): monument en bouwgeschiedenis.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Rochuskapel_(Amersfoort)): foto's van beide lange gevels, de koorsluiting en de westgevel.

De kap is met rechte vlakken boven de BAG-plattegrond opgebouwd. Dakruiter, schoorsteen en ingesneden vensters zijn op basis van foto's aangebracht; de ruiter en schoorsteen ontbreken in de PDOK-mesh. De plaats en grootte van de nissen en de hoogte en vorm van de dakruiter zijn geschat. Het open en fijne houten klokkenframe is voor 1:1000 vervangen door een massieve drager van 0,96 m met vergroot kapje en afgevlakte top; klok, windvaan en maaswerk zijn te fijn en weggelaten.

## Controle

De taak valt niet af: met 83,12 m² en een nok van circa 11,70 m boven maaiveld overschrijdt de kapel beide grenzen van 40 m² en ongeveer 6 m. De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, verbinding en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine modelaanzichten zijn vergeleken met de PDOK-reconstructie en foto's van de gevels: hoofdvolume en driezijdige sluiting volgen PDOK, met vensternissen, dakruiter en schoorsteen toegevoegd. Naburig pand 0307100000575505 ligt op circa 0,74 m zonder overlap; PDOK-dak NAP circa +6,62 m tegen AHN p95 circa +7,03 m. Pand 0307100000364780 ligt circa 4,9 m weg, zonder overlap, PDOK circa +10,48 m tegen AHN p95 +10,51 m.

Regenereren: `node scripts/generate-sint-rochuskapel-amersfoort.mjs` vanuit de landmarks-repository.
