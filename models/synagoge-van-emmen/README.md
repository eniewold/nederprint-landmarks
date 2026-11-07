# Synagoge van Emmen (Emmen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-synagoge-van-emmen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de zaal is de BAG-rechthoek onder twee dakvlakken (planvergelijkingen), bakgoten en plint zijn uitgetrokken doorsneden en convexe omhullenden, de topgevel, pilasters, keperfries, nokstuk en obelisk blokken en hulls, de vensters en deuren spitsboognissen.

De synagoge aan de Julianastraat 27 werd in 1878 gebouwd als eenvoudige bakstenen zaal; in 1909 kwam er een vierde travee aan de straatkant bij, met de vrouwengalerij op een balkon en de gepleisterde voorgevel met het jaartal 1909 op het nokstuk (BAG-bouwjaar 1909). Rijksmonument 510950. In de oorlog werd er joods bezit opgeslagen; het gebouw bleef onbeschadigd. De gemeente kocht het in 1974, restauraties in 1975 en 1994; sinds 2010 beheert de Stichting Emmer Sjoel Sjemmesj het voor culturele activiteiten en af en toe een dienst. Het register beschrijft een bakstenen zaalkerk met een rondom gepleisterde plint en een zadeldak met pannen en een verkropte gietijzeren bakgoot; een in blokverband gepleisterde westgevel met twee vensters tussen hoekpilasters, een topgevel met klimmend keperfries en roosvenster, en een nokstuk met obelisk; zijgevels in vier traveeën door pilasters, met in de westelijke travee een deur met spitsboogbovenlicht en verder spitsboogvensters; een blinde oostgevel.

## Bestanden

- `synagoge-van-emmen.glb`: één node, `building:synagoge-zaal-dak-topgevel-en-obelisk`.
- `synagoge-van-emmen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `synagoge-van-emmen-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [256967.341, 533614.315] (52,780221 N, 6,898502 O), het hart van BAG-pand 0114100000232970 (een rechthoek van 15,67 x 6,80 m), op het maaiveld: AHN-DTM NAP +22,45 (22,3 tot 22,6 rondom). Lokale +X wijst naar RD-richting 20,86 graden (de lange zijde van het BAG-pand, die samenvalt met de nok in het AHN-DSM), naar de blinde achtergevel (oost-noordoost); de voorgevel staat op -X naar de Julianastraat, +Y wijst naar het noord-noordwesten.

`groundSamplePoints` liggen 1,7 m voor de voor- en achtergevel en 1,4 m naast de zijgevels (erf); `groundHeight` 64,30 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (64,30 tot 64,39, gemeten 2026-11-07). `groundOffsetMetres` is -0,1.

Alleen het eigen pand wordt vervangen. De buurpanden 0114100000233079 (noord) en 0114100000269302 (zuid) staan 1,5 m en meer van de zijgevels en raken het model niet; hun PDOK-hoogte past bij het AHN.

## Onderdelen

Hoogtes boven het maaiveld (NAP +22,45); u langs de nok, v dwars.

- Zaal en dak: BAG-rechthoek tot onder de dakvlakken z = 7,75 - 0,85 |v| (AHN-DSM: nok NAP +30,20, helling 0,85 of 40 graden), dus 4,86 m op de gevellijn.
- Plint: gepleisterd, 0,12 m buiten de gevel tot 1,80 m, met een schuine bovenkant tot 1,92 m.
- Bakgoten: langs beide zijgevels van 3,9 m tegen de muur onder 39 graden naar 0,4 m buiten de gevel, bovenkant 4,95 m (AHN NAP +27,3 à 27,4).
- Lisenen: drie per zijgevel op de traveegrenzen (vier traveeën van 3,92 m) en hoeklisenen aan de achtergevel, 0,5 m breed en 0,12 m diep, van de plint tot de bakgoot.
- Zijgevels: in de westelijke travee een deur van 1,1 m met spitsboogbovenlicht tot 3,7 m, in de drie andere traveeën een spitsboogvenster van 1,1 m van 2,0 tot 3,75 m; nissen 0,3 m diep.
- Voorgevel: opstaande topgevel 0,45 m dik en 0,35 m boven het dakvlak; hoekpilasters van 1,0 m breed en 0,25 m voor de gevel tot 4,85 m, met een kroonlijstkop die onder 40 graden 0,22 m uitkraagt tot 5,4 m; twee spitsboogvensters van 1,1 m van 1,95 tot 5,25 m; roosvenster van 0,9 m op 5,8 m; klimmend keperfries van zeven tanden van 0,4 m per zijde, 0,1 m voor de gevel.
- Nokstuk (met het jaartal 1909) van 0,9 m tot 8,65 m en een vierzijdige obelisk tot 9,65 m.

De spitsbogen lopen tot een helling van 50 graden als cirkelboog en daarboven recht naar de top (een zuivere gelijkzijdige boog loopt in de top uit op 30 graden); het roosvenster heeft om dezelfde reden een spitse kap van 50 graden. Bakgoot, kroonlijstkoppen en keperfries hebben een onderkant van 37 tot 40 graden.

## Bronnen en maten

- [Rijksmonumentenregister 510950](https://monumentenregister.cultureelerfgoed.nl/monumenten/510950): bouwjaar 1878, vierde travee 1909, opbouw van gevels, dak, bakgoot, plint, vensters en deuren zoals hierboven.
- [Wikipedia](https://nl.wikipedia.org/wiki/Synagoge_(Emmen)): geschiedenis, adres Julianastraat 27.
- BAG-pand 0114100000232970 (PDOK, 2026-11-07): rechthoek 15,67 x 6,80 m, richting 20,86 graden.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-07, bbox 256942,533590,256992,533640): maaiveld NAP +22,45, nok NAP +30,20 over de hele lengte, dakvlakken (29,2 op 1 m, 28,5 op 2 m, 27,6 op 3 m van de nok), bakgoot NAP +27,3 à 27,4. Geen schoorstenen of dakkapellen in het DSM.
- PDOK-luchtfoto (2026): gepleisterde westgevel naar de straat, pannendak zonder schoorstenen.
- Foto's op Wikimedia Commons: "Emmen- Julianastraat 27.JPG" en "SynagogeEmmen.jpg" (huidige voorgevel en noordgevel), "Voor- en zijgevel - Emmen - 20069863 - RCE.jpg" en "20069862" (voorgevel, zuidgevel met deur en traveeën), "Zij- en achtergevel - Emmen - 20069855 - RCE.jpg" (blinde achtergevel, plint, lisenen en vensters), "Voorgevel - Emmen - 20069861 - RCE.jpg".

## Geschat en weggelaten

Geschat: de plinthoogte (1,80 m) en de hoogtes van vensters, deuren, roosvenster, kroonlijstkoppen, nokstuk en obelisk uit verhoudingen op de foto's, verankerd op de goothoogte uit het AHN (onzekerheid circa 0,3 m); de breedte en diepte van hoekpilasters, lisenen, keperfries en kroonlijstkoppen; de uitkraging van de bakgoot; de diepte van de nissen (0,25 tot 0,3 m). Het nokstuk is verbreed tot 0,9 m en de obelisk heeft een voet van 0,8 m om op 1:1000 te printen.

Weggelaten: de twee schoorstenen van de RCE-foto's uit de jaren zeventig (niet meer op recente foto's, de luchtfoto en in het DSM), de verkropping van de bakgoot om de lisenen, de natuurstenen gedenksteen onder het roosvenster, de tracering en roeden van de vensters (vlak, alleen kleur), de hemelwaterafvoeren, de ventilatiegaten in de achtergevel en het monument voor de joodse oorlogsslachtoffers in de voortuin (een dunne stalen stele, smaller dan 0,9 m), het hek om de voortuin.

## Controle

Eén gesloten NoError-node, één component, genus 0, geen ondervlakken boven de onderkant. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een preview-export op 1:1000 (80 x 80 m rond de oorsprong) bevat het model zonder het PDOK-pand, met hetzelfde volume met en zonder steunmethode v2. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde doos met zadeldak) de plint, de bakgoten, de lisenen en spitsboogvensters en deuren in de zijgevels, en aan de voorgevel de opstaande topgevel met hoekpilasters, kroonlijstkoppen, keperfries, spitsboogvensters, roosvenster, nokstuk en obelisk; de achtergevel heeft hoeklisenen en plint.

Controle-URL: http://localhost:3000/kaart/52.78022/6.89850/200/1x1/0
