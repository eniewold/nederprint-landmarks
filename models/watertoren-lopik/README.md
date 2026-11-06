# Watertoren Lopik (Lopik)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-lopik.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, band, dak, balkonplaten en de kern van de aanbouw zijn omwentelingsvormen van een radiaal profiel (96 segmenten), de aanbouw is daarna op een sector van 150 tot 225 graden gesneden, de liftschacht is een cilinder en de vensters zijn blinde nissen met een schuin plafond.

De watertoren aan de Damweg 3, tussen Lopik en Polsbroekerdam, werd in 1936 gebouwd naar ontwerp van bouwbedrijf MABEG. Hij is 47 m hoog (met de piek) en had één reservoir van 400 m³. Het is een rechte, ronde bakstenen schacht van 12 m doorsnede met één lichte band op ongeveer driekwart hoogte, een rij kleine vensters vlak onder de goot en een vlak koperen kegeldak met een kleine overstek en een piek. In 2022 en 2023 is de toren verbouwd tot zes woningen, een bed & breakfast en een multifunctionele ruimte, met bovenin een uitkijkpunt; aan de westkant kwam een aanbouw met lift en trappenhuis, en daar kwamen ook balkons.

## Bestanden

- `watertoren-lopik.glb`: één node, `building:watertoren-schacht-band-dak-en-aanbouw`.
- `watertoren-lopik.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-lopik-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [122285.43, 444148.61] (51,98477 N, 4,91098 O): het hart van de ronde voetafdruk van BAG-pand 0331100000250018 (cirkel door 22 hoekpunten, straal 6,04 m, afwijking hooguit 0,02 m), op het maaiveld: AHN-DTM NAP +0,1 (−0,04 tot +0,17 tussen 5 en 8 m). De top in het AHN-DSM 0,5 m ligt 0,2 m van dat hart.

De lokale assen zijn gelijk aan RD: +X oost, +Y noord (`xAxis` [1, 0]). Hoeken hieronder in graden linksom vanaf oost.

`groundSamplePoints` liggen op 11 m in de vier asrichtingen, buiten de aanbouw; `groundHeight` 42,53 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 43,69, west 42,53, noord 43,04, zuid 42,92, gemeten 2026-11-06). Het PDOK-terrein loopt van west (42,4 à 42,5) naar oost (43,7 à 43,8) op; de PDOK-reconstructie van het pand staat op 42,45. `groundOffsetMetres` is −0,1.

## Onderdelen

Stralen en hoogtes boven het maaiveld (NAP +0,1).

- Schacht: recht, straal 6,04 m (BAG; geen taps op de foto's), tot de onderkant van de overstek op 39,8 m.
- Band op de vloer van het reservoir: 0,2 m uit, van 31,45 tot 31,95 m.
- Vensters als nissen van 0,9 m breed en 0,3 m diep: acht onder de goot van 37,9 tot 39,1 m (om de 45 graden, vanaf 22,5); de oude trappenhuisvensters aan de zuidzijde (290 graden) van 14,3 tot 17,2 m en van 28,6 tot 30,6 m; de nieuwe vensterkolom aan de noordnoordwestkant (110 graden) op 4,8–6,4, 14,2–15,8, 22,2–23,8 en 29,0–30,6 m.
- Dak: overstek tot 6,39 m met een onderkant van 50 graden, goot tot 40,47 m (AHN NAP +40,6), een flauwe voet van 20 graden tot 40,95 m op 5 m van het hart (AHN NAP +41,04), een kegel van 29 graden tot 43,5 m en een piek van 0,9 m doorsnede tot 45,25 m (AHN NAP +44,05 op het hart).
- Aanbouw aan de westkant (lift, trappenhuis en balkons): een sikkel van 150 tot 225 graden tegen de gevel, glaslijn op 8,4 m van het hart, met om de 4,4 m een balkonplaat van 0,9 m dik tot 8,8 m (acht verdiepingen) en het dak van de aanbouw als plaat tot 39,6 m. Aan de noordkant de ronde liftschacht van 3,2 m doorsnede, hart op 7,6 m en 146 graden, tot 40,4 m.

Band, overstek en balkonplaten hebben een onderkant van 50 graden, de nissen een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Lopik)): Damweg, 1936, MABEG, 47 m, 400 m³; in 2022 verbouwd tot zes woningen, een bed & breakfast en een multifunctionele ruimte, aan de westkant lift en trappenhuis en balkons.
- Bestemmingsplan Watertoren Damweg (NL.IMRO.0331.01WatertorenDamweg-OM02, ruimtelijkeplannen.nl): buitentrap, lift, balkons in metselwerkkarakter, uitkijkpunt bovenin.
- BAG-pand 0331100000250018 (PDOK, 2026-11-06): ronde voetafdruk van 12,08 m.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld, dak en top. Het AHN is van vóór de verbouwing (bouwterrein, nog geen aanbouw).
- PDOK-luchtfoto's 2022 tot 2025 (8 cm): de aanbouw met wit dak en liftschacht aan de westkant vanaf 2023, de vensterkolom aan de noordnoordwestkant.
- Foto's op Wikimedia Commons: "Lopik watertoren.JPG" (2008) en "De 47 meter hoge watertoren aan de Damweg tussen Lopik en Polsbroerdam.jpg" (2015, zuidzijde): rechte schacht, band, vensters onder de goot, trappenhuisvensters, overstek en piek; hoogtes geschaald op de doorsnede van 12,08 m en de goot uit het AHN.

## Geschat en weggelaten

Geschat: de hoogte van de band en de vensters uit twee foto's van vóór de verbouwing (onzekerheid circa een halve meter); het aantal vensters onder de goot (acht) en hun richting; de richting van de oude trappenhuisvensters (zuidzijde, op een foto vanaf de Damweg); de vorm en hoogte van de aanbouw. Er zijn geen foto's van na de verbouwing gevonden en het AHN is ouder dan de aanbouw. De ligging, het wit dak en de hoogte (circa 40 m, net onder de goot) komen uit de luchtfoto's van 2023, 2024 en 2025: per opname verschuift een punt op hoogte h met h maal de kantelvector die de top van het koperen dak ten opzichte van het BAG-hart laat zien, en drie opnames geven dezelfde hoogte. De sector van 150 tot 225 graden, de glaslijn en de balkonplaten om de 4,4 m (circa negen verdiepingen) zijn een schematische weergave van het glazen trappenhuis met de gestapelde balkons; ook de vensterkolom aan de noordnoordwestkant (110 graden, vier vensters) is op dezelfde manier uit de luchtfoto's gehaald.

Weggelaten: de dunne spits boven de piek (dunner dan 0,9 m), de ingang en eventuele luifel (niet op foto's of luchtfoto's te zien), de balkonleuningen en de glasstijlen van het trappenhuis, overige nieuwe vensters die op geen enkele bron te zien zijn, de buitentrap bij de berging en de bergingen zelf (eigen BAG-panden).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet; een eerste versie met vensters die tot in de band en de vlakke onderkant van het dak reikten, kreeg daar opvulling. Een export op 1:1000 (80 m uitsnede) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder met een kegeldak op de BAG-voetafdruk) de band, de vensters, de overstek met goot, het geknikte koperen dak met piek en de aanbouw met liftschacht en balkonplaten aan de westkant.

Controle-URL: http://localhost:3000/kaart/51.98478/4.91104/200/1x1/0
