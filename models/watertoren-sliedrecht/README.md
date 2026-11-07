# Watertoren Sliedrecht (Sliedrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-sliedrecht.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: voet, schacht, friezen en reservoir zijn één omwentelingsprofiel (96 segmenten), de kraag, de achtkante dakplaat en de achtzijdige piramide één hull, de makelaar een kegeltje, de ventilatiekokers blokken, de noordaanbouw een hull met zadeldak en de zuidwestaanbouw een prisma; vensters, deuren, oculi en de boogjes van de friezen zijn blinde nissen.

De watertoren staat op het voormalige waterleidingterrein (het Watertorenterrein) aan de Rivierdijk, aan de Beneden Merwede. Hij werd in 1886 gebouwd, toen Sliedrecht een waterleiding kreeg, naar ontwerp van Jan Schotel; volgens Wikipedia is hij 28,5 m hoog met één reservoir van 250 m³. De toren staat er nog (luchtfoto en AHN; begin 2025 lag het terrein volgens de gemeenteraad nog braak). Een ronde, taps toelopende bakstenen schacht, inmiddels grotendeels met cement bepleisterd, op een iets bredere voet met een plint, een boogfries onder een uitkragende band en een rondboogdeur met een oculus; bovenaan een uitkragend rondboogfries op consoles, een ronde reservoirmantel met smalle spleetvensters en een overstekende achtkante dakplaat met een flauwe achtzijdige piramide, vier ventilatiekokers en een makelaar. De pompgebouwen eromheen zijn grotendeels ruïnes; alleen de aanbouwen in het BAG-pand van de toren staan in het model.

## Bestanden

- `watertoren-sliedrecht.glb`: één node, `building:watertoren-voet-schacht-reservoir-dak-en-aanbouwen`.
- `watertoren-sliedrecht.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-sliedrecht-1-1000.stl`: het model op 1:1000 (15,1 × 14,4 × 31,0 mm).

## Oorsprong en oriëntatie

RD-oorsprong [114511.95, 425808.5] (51,81942 N, 4,79998 O): het hart van de cirkelfit op de torenhoeken van BAG-pand 0610100000007644 (straal 5,93 m, afwijking hooguit 0,21 m), op het maaiveld: AHN-DTM NAP +3,9 (3,6 tot 3,9 rond de toren). Het achtkante dak in het AHN-DSM (11,5 m breed) en de top liggen hooguit 0,1 m van dat hart.

De lokale X-as wijst naar RD-oost (`xAxis` [1, 0]): de vlakken van de achtkante dakplaat staan op de luchtfoto naar het noorden, oosten, zuiden en westen. Hoeken hieronder in graden linksom vanaf de lokale X-as.

`groundSamplePoints` liggen buiten het model ten oosten (9 m), westen (12 m), noorden (11 m) en noordoosten; `groundHeight` 47,47 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 47,57, west 47,54, noord 47,55, noordoost 47,47, gemeten 2026-11-07). Het PDOK-pand staat op 45,96. In de ommuurde ruïnehof ten zuidwesten van de toren ligt het terrein lager (AHN tot NAP +2,1, PDOK-terrein 46,1 tot 46,6 bij de zuidgevel van de aanbouw); de onderkant van het model ligt daarom op −1,4 m, zodat de zuidwestaanbouw daar niet zweeft. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,9).

- Voet: plint met straal 5,85 m tot 0,6 m, schuin afgezet naar de muur met straal 5,55 m (0,95 m); boogfries die onder 51 graden uitkraagt naar een band met straal 5,75 m van 4,45 tot 5,3 m, met 24 boogjes als nissen (niet achter het dak van de noordaanbouw); daarboven een schuine afzaat naar de schacht.
- Rondboogdeur (1,4 m breed, tot 2,6 m) met een oculus erboven (3,1 tot 4,2 m) op −15 graden, aan de oostzuidoostkant.
- Schacht: verjongt van straal 5,1 m op 5,75 m tot 4,25 m op 17,9 m, met twee rijen van acht spleetvensters (11,2–13,0 en 15,6–17,2 m) op 22,5 + k × 45 graden.
- Rondboogfries op consoles: kraagt onder 72 graden uit tot straal 4,8 m op 19,6 m, band tot 19,9 m, met 16 bogen als nissen.
- Reservoir: straal 4,7 m van 20,0 tot 23,2 m, acht spleetvensters (21,0–22,8 m) op k × 45 graden.
- Dak: kraag van 50 graden (hoeken) tot 61 graden (vlakken) van het reservoir naar de achtkante dakplaat (apothema 5,65 m) op 24,9 m, dakrand tot 25,4 m, achtzijdige piramide tot 28,55 m (AHN NAP +32,46), vier ventilatiekokers van 2,2 × 1,4 m op de assen (hart op 3,7 m) tot 27,4 m, makelaar van 0,9 m doorsnede tot 29,6 m.
- Noordaanbouw (BAG): 7,45 m breed tot 8,5 m ten noorden van het hart, goot 4,2 m, zadeldak van 46 graden met de nok noord-zuid op 8,1 m; topgevel naar het noorden met een rondboogdeur en een oculus.
- Zuidwestaanbouw (BAG, luchtfoto): plat gedekt blok van −9,2 tot 1,0 m (west-oost) en −5,2 tot −1,8 m (zuid-noord), 3,8 m hoog, met twee rondboogvensters in de zuidgevel en één in de westgevel.

Nissen zijn 0,25 à 0,3 m diep met een plafond dat naar binnen onder 56 graden oploopt; de oculi zijn ruitvormige nissen met flanken van 50 graden of steiler.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Sliedrecht)): 1886, Jan Schotel, 28,5 m, één reservoir van 250 m³.
- BAG-pand 0610100000007644 (PDOK, 2026-11-07): ronde toren met een aanbouw aan de noordkant en een aan de zuidwestkant, bouwjaar 1886.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-07): maaiveld NAP +3,9, top NAP +32,46, piramide met helling 0,52 à 0,56, dakplaat 11,5 m breed, noordaanbouw NAP +8 à +12 met de nok noord-zuid, zuidwestaanbouw NAP +7,5.
- PDOK-luchtfoto (Actueel_orthoHR, 4 cm per pixel uitgerekt): achtkante dakplaat van 11,3 m over de vlakken, vier kokers, schacht van circa 10,2 m doorsnede boven de voet, plat dak van de zuidwestaanbouw en de muren van de ruïnehof.
- Foto's op Wikimedia Commons (categorie "Watertoren (Sliedrecht)"): "Februari 2014 2014-03-12 12-00.jpg" (vanuit het zuiden), "De watertoren van Sliedrecht, gezien vanaf de Beneden Merwede (01).jpg", "Watertoren in Sliedrecht 2014-03-16 09-24.jpg", "Sliedrecht Watertoren 6855.JPG" (vanaf de Rivierdijk) en "Watertoren Sliedrecht.jpg" (1886).
- Gemeente Sliedrecht, schriftelijke vragen over het Watertorenterrein (februari 2025): terrein ligt al lang braak.

## Geschat en weggelaten

Geschat: de hoogtes van de voet, de friezen, het reservoir en de onderkant van de dakplaat komen uit de foto's vanuit het zuiden en vanaf de rivier, geschaald op de dakrand in het AHN (25,4 m) en de BAG-voet; ze zijn circa een halve meter onzeker. De stralen van de schacht en het reservoir komen uit de luchtfoto en de foto van 2014. De dakplaat heeft in het echt een vlakke onderkant; in het model rust ze op een kraag van 50 graden. Het aantal en de plaats van de spleetvensters (acht per rij) en de boogjes van de friezen (24 en 16; op de foto smaller en talrijker) zijn geschat; de vensters zijn in het echt 0,3 à 0,4 m breed en staan als nissen van 0,9 m in het model. De richting van de deur (oostzuidoost) komt uit de foto vanaf de rivier. De noordaanbouw staat op de luchtfoto onder de scheef afgebeelde dakplaat; vorm en hoogte komen uit de BAG en het DSM, de deur en het oculus in de topgevel van de foto uit 1886. De nok is 8,1 m in plaats van de gemeten 7,9 m, zodat het dak net steiler is dan de printhoek.

Weggelaten: de muren van de ruïnes rond de toren (de ruïnehof ten zuiden en de omheining ten westen; een steens metselwerk, dunner dan 0,9 m, zonder dak en buiten het BAG-pand), de openingen in de ventilatiekokers (de stijlen ernaast zouden dunner dan 0,8 m worden), de ankers in de reservoirmantel, de schoorsteen op de ruïne, de leuningen en de dunne spits van de makelaar.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model, niet het PDOK-pand en geen ondersteuningsobject; het modelvolume is met en zonder steun gelijk. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een veelhoekig prisma tot NAP +32,6 met twee lage blokken) de taps toelopende ronde schacht met vensters, de plint en de boogfries met de deur, het uitkragende fries met het reservoir, de overstekende achtkante dakplaat met piramide, kokers en makelaar, en het zadeldak van de noordaanbouw.

Controle-URL: http://localhost:3000/kaart/51.81942/4.79998/200/1x1/0
