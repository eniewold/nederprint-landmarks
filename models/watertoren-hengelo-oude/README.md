# Oude watertoren (Hengelo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-hengelo-oude.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, onderbouw, waterlijst, schacht, voetband, bodem, band en reservoir zijn omwentelingsprofielen, consoles, lisenen en kanteelblokken radiale blokken, en het portaal en de aanbouwen prisma's met zadeldaken als convexe omhullende van goten en nok.

De oude watertoren aan de Watertorenlaan 60 in Hengelo, bij het Fanny Blankers-Koen Stadion, is in 1896-1897 gebouwd naar ontwerp van ir. J. Schotel voor Stork en de waterleiding (neorenaissance, rijksmonument 511440, complex 511439 met kolenschuur, elektrisch gemaal, trafohuisje en dienstwoning). Hij is volgens Wikipedia en het register 29,2 m hoog met een ijzeren hangbodemreservoir van 300 m³. Na oorlogsschade is het reservoir in 1959 vernieuwd; de betonnen consoles, lisenen en kanteelblokken stammen daarvan.

## Bestanden

- `watertoren-hengelo-oude.glb`: één node `building:watertoren-voet-schacht-reservoir-portaal-en-aanbouwen`, op maaiveld.
- `watertoren-hengelo-oude.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-hengelo-oude-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [251812.41, 475165.92] (52,25601 N, 6,80506 O), het hart van de cirkel in BAG-pand 0164100000008027 (straal 5,29 m, de voet met de plint; het pand omvat ook het portaal en twee aanbouwen). Maaiveld NAP +20,65 (AHN-DTM rond de toren 20,6 tot 20,7; 3D BAG 20,37). Lokale +X wijst naar RD-richting 57,6 graden (kompas 32,4 graden), langs de nok van het kantoortje; +Y naar kompas 302,4 graden, waar het ingangsportaal staat; de machinekamer ligt langs -X. De hoek komt uit de rechte zijden van het BAG-pand en ligt evenwijdig aan de nokken in het AHN-DSM. Het register noemt de ingang "noord", de machinekamer "zuid" en het kantoortje "oost": dat is circa 58 graden gedraaid ten opzichte van het kompas.

`groundHeight` 64,04 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 6,5 m van het hart in de vrije hoeken tussen portaal en aanbouwen (64,04, 64,04, 64,10 en 64,11, gemeten 2026-11-06); het terrein rond de toren ligt tussen 63,98 en 64,25. Het model vervangt BAG-pand 0164100000008027, zodat de PDOK-reconstructie (een cilinder tot NAP +48,8 met blokken voor portaal en aanbouwen) verdwijnt. De losse aanbouw ten zuiden van de machinekamer (BAG-pand 0164100000007902, PDOK-nok NAP +26,1, AHN 25,85) blijft PDOK.

## Onderdeel `building:watertoren-voet-schacht-reservoir-portaal-en-aanbouwen`

Hoogtes boven maaiveld (NAP +20,65), hoeken linksom vanaf +X.

- Plint: natuursteen, 10,6 m (BAG), tot 0,5 m, geprofileerd terug naar de onderbouw op 0,75 m.
- Onderbouw: cilinder van 10,2 m tot 6,72 m. Rondboogvensters van 0,65 m van 1,65 tot 4,5 m op 56 en 131 graden, gekoppelde vensters op 245 en 295 graden; onder het venster op 131 graden een natuurstenen blok van 3,0 m breed tot 1,0 m.
- Waterlijst: onderkant van 50 graden, voorkant 10,5 m van 6,9 tot 7,1 m, schuin terug naar de schacht op 7,55 m.
- Schacht: taps van 9,4 m op 7,55 m tot 9,0 m op 18,65 m, met tien rondboogvensters van 0,75 m langs de trap: vijf op 10,85 tot 12,7 m (355, 63, 131, 220 en 290 graden) en vijf op 14,9 tot 16,8 m (24, 96, 166, 240 en 315 graden).
- Voetband 9,3 m van 18,0 tot 18,4 m (onderkant 50 graden); 28 betonnen consoles van 0,4 m breed met een voorkant van 50 graden tot de band; daartussen de bodem als kegel van 50 graden.
- Betonnen band: 11,7 m, onderkant 50 graden, voorkant 20,27 tot 20,55 m.
- Reservoir: cilinder van 11,0 m tot 28,85 m, met 28 lisenen van 0,45 m (0,2 m voor het reservoir, tot 22,75 m met een schuine kop), twee rijen van veertien kijkspleten van 0,3 m (21,65–22,45 en 27,0–27,75 m), een dak op 28,05 m (NAP +48,70) binnen een borstwering van 0,9 m dik, en 18 kanteelblokken van 0,9 × 0,9 m tot 29,3 m.
- Ingangsportaal (+Y): 3,4 m breed, voorgevel op 6,4 m van het hart, goot 4,3 m, zadeldak van 45 graden tot 6,0 m en een tuitgevel tot 6,3 m; deur van 1,2 m onder een rondboog tot 3,77 m.
- Machinekamer (-X): 9,3 × 6,0 m (BAG) tot x = -13,28, goten 3,65 m, nok 6,15 m (DSM; 3D BAG 26,98 = 6,3 m), dakhelling 40 graden; kopgevel met borstwering tot 6,45 m, hoeklisenen tot 4,4 m, aan beide zijgevels twee gekoppelde rondboogvensters, in de kopgevel een venster en een roosvenster (nis met spitse top).
- Kantoortje (+X): 7,0 × 3,5 m (BAG) tot x = 7,09, goten 4,1 m, nok 6,2 m (DSM), dakhelling 31 graden; drie rondboogvensters van 0,75 m in de kopgevel.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Oude_watertoren_(Hengelo)): 1896-1897, J. Schotel, 29,2 m, 300 m³.
- [Rijksmonumentenregister 511440](https://monumentenregister.cultureelerfgoed.nl/monumenten/511440): natuurstenen voet met plint, onderbouw met banden en waterlijst, rondboogvensters met tracering, schacht met betonnen consoles en lisenen, ingang met tuitgevel, aanbouwen met zadeldaken, machinekamer met segmentboogvensters en roosvenster, kantoortje met drie rondboogvensters, vlakke bovenkant met betonnen modillons; reservoir in 1959 vernieuwd.
- BAG-panden 0164100000008027 en 0164100000007902 (PDOK, 2026-11-06): cirkel van de voet, portaal, machinekamer en kantoortje.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +20,65, dak NAP +48,70, omhullende van het reservoir circa 11 tot 11,2 m, nokken en goten van de aanbouwen.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0164100000008027: dak 48,69, nok 26,98, maaiveld 20,37.
- PDOK-luchtfoto (Actueel_orthoHR): kanteelrand, dak, portaal en aanbouwen.
- Foto's op Wikimedia Commons: "Hengelo Watertoren 8749.JPG" (2007, vanaf het westen, camera circa 38 m van de as en 18 graden omhoog; perspectief opgelost met de brandpuntsafstand uit de EXIF (8,9 mm = 2309 px), het maaiveld en de kanteelrand op 29,3 m; daaruit alle geledingen, breedtes, portaal en machinekamer) en "Hengelo-Watertorenlaan-Gemaal.JPG" (vanaf het oosten: schachtvensters, kopgevel van het kantoortje).

## Geschat en weggelaten

Geschat: alle geledingen tussen maaiveld en dak en de breedtes van onderbouw, schacht, band en reservoir uit één foto met opgelost perspectief (onzekerheid circa 0,3 m; de kanteelrand op 29,3 m is aangenomen tussen de register-hoogte en de borstwering boven het DSM-dak); de stand van de schacht- en onderbouwvensters aan kanten zonder foto; de zuidoostzijde en kopgevel van de machinekamer (gespiegeld, roosvenster uit het register); het kantoortje en het portaal (alleen BAG, DSM en schuin op foto). De consoles zijn langer dan in het echt (voorkant 50 in plaats van circa 55 graden, vanaf 18,4 in plaats van 19,2 m) zodat ze zonder steun printen; de kanteelblokken zijn vergroot tot 0,9 m met 18 in plaats van circa 28 stuks, de borstwering is 0,9 m dik.

Weggelaten: de vlaggenmast, het dakluik (circa 0,3 m hoog), de pinakel op de tuitgevel, de schouderstukken en de natuurstenen tracering met zuiltjes (kleiner dan 0,9 m), de gemetselde banden in onderbouw en schacht (alleen kleur), dakoverstekken, en de losse aanbouw 0164100000007902 en de overige gebouwen van het complex (eigen BAG-panden).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: plint, waterlijst, voetband, consoles, bodem en band met een onderkant van 50 graden, nissen met een plafond van 56 tot 63 graden, daken en gevels verjongend. Een export op 1:1000 van een uitsnede van 80 m rond de toren bevat het model. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder tot het dak met platte blokken voor portaal en aanbouwen) aan elke kant de plint, de waterlijst, de taps toelopende schacht met vensters, de consoles, de uitkragende band, het reservoir met lisenen en spleten en de kanteelrand, en daarnaast het portaal met tuitgevel (noordwest), de machinekamer met zadeldak, kopgevel, lisenen en vensters (zuidwest) en het kantoortje met zadeldak en vensters (noordoost).

Controle-URL: http://localhost:3000/kaart/52.25601/6.80506/200/1x1/0
