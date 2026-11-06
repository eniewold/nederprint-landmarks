# Watertoren Vriezenveen (Vriezenveen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-vriezenveen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een regelmatige achthoek (prisma), de risalieten zijn blokken, de bovenbouw een cilinder, het dak een kegel van 32 vlakken (convexe omhullende van de dakvoet en de top), en de vensters en de deur zijn nissen.

De watertoren aan de Bouwmeesterstraat is in 1934 gebouwd naar ontwerp van Hendrik Sangster (gemeentelijk monument). Volgens Wikipedia is hij 40,80 m hoog met een reservoir van 295 m³. Het is een achtkante bakstenen schacht met op vier hoeken een risaliet met een plat front en een kolom smalle staande vensters; in de westelijke risaliet, naar de straat, zit de deur. Bovenop staat een witte ronde bovenbouw met een band kleine vensters onder de rand en boven elke risaliet een beklede kop. Daarop ligt een vlak kegeldak.

## Bestanden

- `watertoren-vriezenveen.glb`: één node `building:achtkante-schacht-met-risalieten-ronde-bovenbouw-en-kegeldak`, op maaiveld.
- `watertoren-vriezenveen.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-vriezenveen-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [239450.18, 492628.14] (52,41496 N, 6,62851 O), het hart van BAG-pand 1700100000034518 (gemiddelde van de twintig hoekpunten; de top in het AHN-DSM ligt 0,3 m ernaast). Maaiveld AHN-DTM NAP +9,95; het terrein loopt van oost (9,8 tot 9,9) naar west (10,2 tot 10,4) op. Lokale +X is de normaal van het front van de oostelijke risaliet (RD 3,8 graden, de randen van de risalieten in de BAG; `xAxis` [0.9978, 0.06627]). `groundHeight` 52,47 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 8 m van het hart (oost 52,47, noord 52,52, west 52,98, zuid 52,85); het PDOK-pand begint op 52,37. Het model vervangt BAG-pand 1700100000034518, zodat het PDOK-blok verdwijnt. De buurpanden (de dienstwoning op 10 m en twee panden op 22 m) hebben in PDOK de hoogte van het AHN en steken niet in de toren.

## Onderdeel `building:achtkante-schacht-met-risalieten-ronde-bovenbouw-en-kegeldak`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Plint tot 1,9 m: regelmatige achthoek met de hoeken op 6,3 m (apothema 5,82, de BAG), de hoeken onder de risalieten afgesneden op hun front; bovenkant 0,1 m onder 45 graden naar de schacht.
- Schacht tot 33,1 m: achthoek met apothema 5,72. Witte afdekking die van de achthoek op 33,1 m schuin oploopt naar de bovenbouw op 33,45 m.
- Vier risalieten op de hoeken 0, 90, 180 en 270 graden: voet tot 4,1 m met het front op 6,15 m en ±1,6 m breed (de BAG), daarboven 0,1 m smaller tot 34,9 m. In elk front vijf staande vensters van 0,4 × 3,5 m (onderkant 5,0, 10,45, 15,9, 21,35 en 26,8 m) en bovenin twee venstertjes van 0,4 m naast elkaar van 31,65 tot 32,85 m. In de westelijke risaliet de deur van 1,6 m breed van 0,5 tot 2,65 m, met een stoep van 2,4 × 0,85 m tot 0,5 m.
- Beklede kop op elke risaliet: 1,4 m breed, 0,1 m voor het front, van 33,95 m (onderkant onder 50 graden) tot de rand.
- Ronde bovenbouw met een straal van 5,6 m van 33,1 tot 37,3 m, met een band van 32 vensters van 0,6 × 0,65 m (36,05 tot 36,7 m), acht per kwart tussen de koppen.
- Dak: kegel van 32 vlakken met een helling van 0,70 (35 graden) tot de top op 40,94 m. De dakvoet ligt in de bovenbouw; de rand blijft als opstaande ring van circa 0,4 m rond het dak staan.
- Openingen als nissen met een plafond van 56 graden (0,25 tot 0,4 m diep).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Vriezenveen)): bouwjaar, architect, hoogte 40,80 m, reservoir 295 m³, de achtzijdige toren met risalieten met smalle staande vensters aan vier zijden en de bovenbouw met vensters onder de dakrand.
- BAG-pand 1700100000034518 (PDOK, 2026-11-06): achthoek met vier risalieten (twintig hoekpunten, 113,7 m²).
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +9,95, top NAP +50,89 (40,94 m), het dak loopt gelijkmatig op met 0,70 m per m (NAP +48,05 op 4 m uit het hart, +49,50 op 2 m).
- Luchtfoto (PDOK, 2026-11-06): ronde bovenbouw 11,1 m breed, koppen 1,3 m breed tot circa 6,05 m uit het hart, 32 naden in het kegeldak met de top in het midden.
- Foto's op Wikimedia Commons: "Twenterand-Vriezenveen, de Watertoren GM1700-WN005 IMG 6782 2025-04-20 16.13" (vanuit het westen: deur, vensterkolom, venstertjes, afdekking, bovenbouw, koppen), "Vriezenveen Watertoren 8937" (2006, vensterkolom) en "Vriezenveen, watertoren foto9 2014-10-04 14.35" (twee risalieten schuin, koppen en vensterband). De hoogtes langs de gevel komen uit de eerste foto, met een camera (94 m afstand, 26 graden omhoog) gefit op de rand op 37,3 m en de breedte van de risaliet; de deur kwam daarmee op 2,0 m hoog.

## Geschat en weggelaten

Geschat: alle hoogtes langs de gevel (plint, voet, vensters, afdekking, risaliettop, kop, vensterband, rand) uit één foto met een gefitte camera; de rand op 37,3 m uit het AHN, dat daar door de randpixels geen scherpe waarde geeft; de straal van de bovenbouw (luchtfoto 5,55, foto circa 5,7, hier 5,6); de staande vensters regelmatig gezet (op de foto 3,3 tot 3,8 m lang, onderkant 5,0 tot 26,7 m) en 0,4 in plaats van circa 0,3 m breed; dat alle vier de risalieten dezelfde vensters hebben (gezien in drie); het aantal vensters in de band (zeven tot acht per kwart op de foto) en hun maat; de deur alleen in het westen; de uitsprong van plint en voet (0,1 m); de stoep.

Weggelaten: de slanke spits op de top en de antennes van 2006 (kleiner dan 0,9 m), de raamstijlen, de voegen en de horizontale lijntjes in het metselwerk, de lijst langs de rand van de bovenbouw (kleiner dan 0,9 m).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. In een export op 1:1000 van 100 × 100 m rond de toren staat het model erin zonder ondersteuningsobject en is het PDOK-pand weg (zonder landmarks staat het er wel). Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de achthoek met risalieten geëxtrudeerd met een achtkante piramide als dak) de ronde bovenbouw met vensterband en koppen, het kegeldak met de opstaande rand, de plint en de voeten van de risalieten, de staande vensters en de venstertjes, en aan de westkant de deur met de stoep.

Controle-URL: http://localhost:3000/kaart/52.41494/6.62849/200/1x1/0
