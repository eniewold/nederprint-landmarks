# Watertoren Brielle (Brielle)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-brielle.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint en schacht zijn achtkante prisma's en hulls, de consoles, de schuine reservoirbodem, de rand en de goot zijn hulls (planvlakken), het reservoir is een prisma op een 64-hoek en het klokdak een omwentelingsvorm van een profiel (rok en kegel); vensters, deur en verdiepte gevelvlakken zijn blinde nissen met een schuin plafond.

De watertoren van Brielle (G.J. van den Boogerdweg 1) werd in 1923 gebouwd naar ontwerp van A.D. Heederik. Hij is 40,50 m hoog en heeft een reservoir van 200 m³ (Wikipedia); rijksmonument 518188. De toren ging in 1984 buiten gebruik, werd in 2006 voor één euro verkocht en heeft nu een kantoorfunctie (BAG). Hij staat er nog (BAG "Pand in gebruik", luchtfoto en AHN). Een achtkante, wit gepleisterde schacht op een iets bredere plint, met op elke hoek een lisene die bovenaan in twee trappen uitkraagt tot console onder het ronde reservoir; in de gevelvlakken kolommen van vensters. Het reservoir staat op een rand met twee lijnen en heeft acht paren smalle hoge vensters; daarboven een donkere gootlijst en een leien klokdak met een vrijwel verticale, iets bolle rok, een kegel en een pinakel.

## Bestanden

- `watertoren-brielle.glb`: één node, `building:watertoren-plint-schacht-consoles-reservoir-en-klokdak`.
- `watertoren-brielle.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-brielle-1-1000.stl`: het model op 1:1000 (10,5 × 10,5 × 39,8 mm).

## Oorsprong en oriëntatie

RD-oorsprong [70542.95, 435107.67] (51,898066 N, 4,160090 O): het zwaartepunt van de achtkante BAG-voetafdruk van pand 0501100001994429 (7,26 m over de vlakken; het BAG-bouwjaar 1960 klopt niet), op het maaiveld: AHN-DTM NAP +1,25 (1,15 tot 1,36 tussen 3 en 8 m). De top van de kegel in het AHN-DSM ligt binnen 0,35 m van dit punt.

De lokale X-as staat loodrecht op een gevelvlak, 6,2 graden rechtsom van RD-oost (`xAxis` [0.99415, -0.108]): het gemiddelde van de BAG-zijden, die afwisselend op -3,1 en -9,3 graden staan.

`groundSamplePoints` liggen op 6,5 m in de vier asrichtingen; `groundHeight` 44,964 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (zuid 44,964, west 45,015, noord 45,074, oost 45,129, gemeten 2026-11-06). Het PDOK-pand staat op 44,95 met de top op 83,71 (een achtkante kolom met een spits dak). `groundOffsetMetres` is −0,1. Geen buurpand raakt het model (de dichtstbijzijnde PDOK-panden liggen circa 20 m oostelijk).

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +1,25).

- Plint: achtkant van 7,26 m over de vlakken (BAG) tot 3,8 m, afzaat van 45 graden naar de schacht op 4,0 m. Deur (nis 1,4 × 2,4 m) in de zuidgevel aan het pad, vensters (nis 0,9 × 0,9 m) op 1,5 m in de oost- en westgevel.
- Schacht: achtkant van 6,86 m over de vlakken tot de reservoirbodem. Op elke hoek een lisene van 0,6 m langs elke gevel; daartussen een verdiept gevelvlak van 1,64 m breed en 0,3 m diep van 4,0 tot 19,3 m. Per gevelvlak een venster op 5,2 m, een kolom van vier vensters (0,9 × 0,85 m, 0,22 m diep) van 9,6 tot 14,5 m en een venster op 20,0 m onder het reservoir.
- Consoles: op elke hoek twee trappen (35 en 38 graden), van de lisene op 19,6 m naar 4,3 m uit het hart op 20,75 m en naar de reservoirwand (4,85 m) op 22,6 m.
- Reservoirbodem: van de achtkant op 21,65 m onder 45 graden naar de cirkel van 9,7 m op 23,1 m.
- Rand: 10,0 m, van 23,3 tot 23,8 m, onderkant 37 graden.
- Reservoir: 9,7 m tot 29,45 m, met acht vensterparen als nissen van 1,0 × 4,2 m (24,6 tot 28,8 m) midden boven de gevelvlakken.
- Goot: 10,4 m op 30,0 m op een kraag van 45 graden vanaf de reservoirwand op 29,45 m.
- Klokdak: rok tot 10,5 m op 30,9 m en 10,1 m bij de knik op 32,9 m; kegel van 50 graden (AHN-helling 1,2) tot de top op 38,95 m (AHN NAP +40,2).
- Pinakel: van 0,9 m dik tot 39,45 m.

Nissen hebben een plafond dat naar binnen onder 63 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Brielle)): 1923, A.D. Heederik, 40,50 m, 200 m³, rijksmonument 518188, buiten gebruik 1984.
- BAG-pand 0501100001994429 (PDOK, 2026-11-06): achtkant van 7,26 m over de vlakken, kantoorfunctie, adres G.J. van den Boogerdweg 1.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +1,25, kegel met helling 1,2 van NAP +37,1 op 2,5 m uit het hart tot de top NAP +40,2; de steile, donkere rok en de goot geven gaten in het DSM (waarden 10 tot 30 tussen 3 en 5,5 m, deels bomen).
- PDOK-luchtfoto (Actueel_orthoHR): rond dak van 10,4 m, door de scheefstand naar het noorden verschoven.
- Foto's op Wikimedia Commons (categorie "Watertoren (Brielle)"): "Watertoren Brielle.jpg" (telelens van grote afstand, bijna orthografisch), "Watertoren Brielle 2020.jpg" en "Exterieur OVERZICHT - Brielle - 20270371 - RCE.jpg".

## Geschat en weggelaten

Geschat: de hoogtes van de knik (32,9 m), de goot (30,0 m) en de onderkant van het reservoir met de rand (23,1 tot 23,8 m), de vorm van de rok en de diameter van het reservoir (9,7 m) komen uit de foto "Watertoren Brielle.jpg" (0,032 m per pixel op het dak, geschaald op de luchtfoto) en sluiten aan op de kegel uit het AHN. De indeling van de schacht (plinthoogte, lisenen, verdiepte vlakken, vensterkolommen, consoles) is afgeleid van de RCE-foto, die van onderen is genomen, en is dus alleen in verhoudingen betrouwbaar. De vensters in de schacht staan in het model op elk van de acht gevelvlakken; de stand van de deur (zuid, aan het pad) en de plintvensters is onzeker. Wikipedia noemt 40,50 m; het AHN geeft 38,95 m tot de top van de kegel, de pinakel komt tot 39,45 m.

Weggelaten: de kleine dakluikjes in de rok (circa 0,4 m) en het grotere dakvenster (circa 0,6 m breed), de lijnen in de rand (dunner dan 0,9 m), de stijl tussen de twee smalle vensters van elk paar (samengevoegd tot één nis van 1,0 m) en het hekwerk bij de ingang.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun (geen ondersteuningsobject) en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde achtkante kolom van 7 m met een spits dak) de plint met deur, de lisenen en vensterkolommen, de consoles, het bredere ronde reservoir met vensters en rand, de goot en het klokdak met pinakel.

Controle-URL: http://localhost:3000/kaart/51.89807/4.16009/200/1x1/0
