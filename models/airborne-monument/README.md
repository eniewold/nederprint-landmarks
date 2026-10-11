# Airborne Monument Oosterbeek — De Naald

Vereenvoudigd model van de gedenkzuil tegenover Hartenstein. De oorspronkelijke
backlog verwees naar het andere Airborne-monument in Arnhem; positie en bron
zijn gecorrigeerd naar Oosterbeek. GLB in meters, Y omhoog; STL op 1:1000 in mm,
Z omhoog, 12,3 × 12,3 × 15,77 mm. Generator:
`node scripts/generate-airborne-monument.mjs` (zonder netwerk).

## Onderzoek en schattingen

- BGT-kunstobject G0274.91dadc54ac6a452e9deb608cf72ea018 geeft het hart
  RD [185506.886, 444579.997]. De voet is langs [0.97437, -0.22495] gedraaid.
- AHN DSM 0,5 m meet boven de zuil NAP 71,291 m; omliggende DTM/DSM-punten
  geven circa 55,52 m. Totale hoogte 15,77 m. Alleen het grondpunt midden
  onder de zuil is NoData; omliggend maaiveld is bruikbaar.
- De bekroning van 5 m is beschreven in de historische bronnen van het
  Wikipedia-artikel. Vijf figuren en vier reliëfzijden zijn bevestigd door
  het Nationaal Comité 4 en 5 mei en de RCE-foto's.
- Voetbreedte 12,3 m, armposities, zuilbreedte 1,76 m, ribben, kragen en
  reliëfdiepte 0,33 m zijn geschat uit ortho en foto's. De kleine echte
  treden zijn een doorlopende afgeschuinde voet van 0,7 m geworden.
- Figuren zijn aangehecht en schematisch, met dragende diameters van
  minimaal 0,9 m. Duif compact tegen de centrale figuur. Gezichten, vingers,
  wapens, opschriften, Pegasus en kleine taferelen zijn niet uitgewerkt.
  Bankjes en later toegevoegde lampen vallen buiten het monumentmodel.

## Controle

Gesloten manifold, één samenhangend volume. De 45° printcontrole geeft
geen extra steunvolume; doorsneden op 0,5, 1, 3, 9, 12 en 14 m blijven gelijk.
De plaatsing bemonstert vier punten op de ronde bestrating buiten de voet,
PDOK ellipsoïdisch circa 99,043–99,060 m, met 0,04 m inzinking.

Vier schuine aanzichten op −35°, 55°, 145° en 235°, 30° boven de horizon,
zijn vergeleken met PDOK en schuine RCE-foto's. Aan alle kanten voegt het model
de ontbrekende zuil, hoekribben, voetarmen en vijf figuren toe. PDOK toont
hier uitsluitend terrein en bestrating; geen gebouw hoeft vervangen te worden.
De volledige preview-export gebruikt 80 × 80 m op 80 × 80 mm (1:1000);
alle armen en de volledige bekroning vallen binnen de uitsnede.

Controlekaart: http://127.0.0.1:5188/kaart/51.98878/5.83133/350/1x1/0?size=80
(lokale proxy met actuele catalogus; dezelfde route werkt op poort 3000 na
herstart van de dev-server). Controleer de gedraaide vierarmige voet, hoogte
van de zuil en vijf schematische figuren tegenover Hartenstein.

`tests/landmark-models.test.ts` controleert BGT-positie, omvang, vier armen,
vier wachters en centrale top, plaatsingshoogte en gesloten printvolume zonder
toegevoegde steun. De vereiste landmarkmodel- en API-tests zijn geslaagd.

## Bronnen

- [Nationaal Comité 4 en 5 mei](https://www.4en5mei.nl/oorlogsmonumenten/zoeken/323/oosterbeek-airborne-monument).
- [Wikipedia, Oosterbeek](https://nl.wikipedia.org/wiki/Airborne-monument_(Oosterbeek)).
- [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Airborne_Monument,_Oosterbeek),
  RCE 20422157, 20422160 en 20422166; uitsluitend visuele referenties.
- PDOK BGT straatmeubilair, actuele luchtfoto en AHN DSM/DTM 0,5 m (CC0).

Controlebeelden en previewbestanden staan buiten de repository.

