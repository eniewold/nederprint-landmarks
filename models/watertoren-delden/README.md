# Watertoren Delden (Twickel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-delden.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, onderbouw, cordonlijst en schacht zijn cilinders en afgeknotte kegels, de overgang naar de achtkant is de convexe omhullende van de schacht en het rondboogfries, en ommanteling, kroonlijst, borstwering en torentje zijn achthoekige prisma's met evenwijdige zijden.

De watertoren van landgoed Twickel bij de Watertorenstraat in Delden is in 1894 gebouwd naar ontwerp van H.P.N. Halbertsma, in opdracht van R.F. baron van Heeckeren van Wassenaer, door Scholten & Westenberg uit Almelo, met beeldhouwwerk van Gerard Muller (neorenaissance, rijksmonument 507505). Hij is volgens het register 37,5 m hoog en bevat een vroeg ijzeren Intze-reservoir van 200 m³; het water kwam via een leiding van circa 10 km uit Almelo. De toren staat op een lage heuvel; de gebouwen van het pompstation ten noorden ervan zijn eigen BAG-panden.

## Bestanden

- `watertoren-delden.glb`: één node `building:watertoren-onderbouw-schacht-reservoirommanteling-en-torentje`, op maaiveld.
- `watertoren-delden.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-delden-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [245218.97, 476162.32] (52,26608 N, 6,70887 O), het hart van BAG-pand 1735100000056870 (een cirkel met straal 4,14 m, de bakstenen onderbouw); de Wikipedia-coördinaat ligt er binnen een paar meter naast. Maaiveld NAP +22,0 op de heuvel (AHN-DTM op 5 tot 8 m van het hart 21,8 tot 22,05; 3D BAG 21,82). Lokale +X wijst naar het oosten, +Y naar het noorden (`xAxis` [1, 0]): op de luchtfoto liggen de noord-, oost- en westzijde van de achtkante borstwering evenwijdig aan het RD-raster.

`groundHeight` 65,35 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 5 m van het hart aan de noord-, west-, zuid- en zuidoostkant (65,45, 65,35, 65,47 en 65,48, gemeten 2026-11-05). Aan de noordoostkant ligt het PDOK-terrein tot 0,8 m hoger (de stoep voor de ingang, tussen 15 en 65 graden); daar staat bewust geen punt. De heuvel zelf zit in het PDOK-terrein en staat niet in het model. Het model vervangt BAG-pand 1735100000056870, zodat de PDOK-reconstructie (een cilinder tot NAP +57,8 met een blokje voor het torentje) verdwijnt.

## Onderdeel `building:watertoren-onderbouw-schacht-reservoirommanteling-en-torentje`

Hoogtes boven maaiveld (NAP +22,0). Achthoeken met de maat van het hart tot een zijde.

- Plint: hardsteen, 8,9 m, licht verjongend tot 8,6 m op 1,25 m.
- Onderbouw: cilinder van 8,28 m (BAG) tot 8,5 m. Twee rondboogvensters van 1,0 m breed van 2,5 tot 5,9 m (spitse top van 50 graden), 76 graden aan weerszijden van de ingang; vier vierkante oculi van 0,9 m op 6,95 tot 7,85 m, 43 en 106 graden naast de ingang.
- Ingangspartij aan de noordoostkant (hart op 35 graden van oost, kompasrichting 55 graden): 2,4 m breed, 0,8 m voor de onderbouw uit, van de stoep (1,15 m) tot de kroonlijst (5,9 tot 6,3 m, onderkant 45 graden) en een halfrond fronton tot 7,49 m; deur van 1,2 m onder een rondboog tot 4,2 m. Stoep van 3,6 m breed met twee treden (1,15, 0,8 en 0,45 m), boven de stoep in het PDOK-terrein.
- Cordonlijst: onderkant van 45 graden van 8,5 m, voorkant 8,85 m van 8,78 tot 9,2 m, schuin terug naar de schacht op 10,05 m.
- Schacht: cilinder van 7,78 m tot 24,6 m, met drie rijen van acht kijkspleten (0,45 m breed, op 10,7–12,1, 17,4–18,9 en 22,6–23,7 m) als nis van 0,3 m.
- Consoles en rondboogfries: de schacht gaat van 24,6 tot 26,5 m over in de achtkant van het fries (9,7 m), zijden 54 graden; op de acht hoeken een console van 0,9 m breed vanaf 23,8 m (de engelenkopjes, riviergoden en nimfen). Fries van 26,5 tot 28,1 m met drie blinde bogen per zijde (0,7 m breed, spitse top).
- Profiellijst 9,9 m van 28,1 tot 28,4 m (onderkant 45 graden).
- Reservoirommanteling: achtkant van 9,4 m van 28,4 tot 34,55 m; per zijde een verdiept vlak van 0,12 m tussen hoekblokken (30,25 tot 34,05 m, boven de knoppenband) met een blind venster van 0,75 m en een timpaan tot 33,45 m.
- Kroonlijst: onderkant 45 graden van 34,55 tot 34,9 m, 10,1 m, bovenkant 35,85 m = het dak (NAP +57,85; 3D BAG 57,84).
- Borstwering: achtkant van 9,25 m (luchtfoto), 0,9 m dik, tot 37,95 m met twee kantelen van 0,9 × 0,9 m per zijde.
- Torentje: achtkant van 2,8 m op het dak tot 38,95 m, met vensters van 0,55 m in de vier schuine zijden, een lijst tot 39,2 m en kantelen tot 40,0 m (NAP +62,0; AHN-DSM 62,0, PDOK 61,9) met inkepingen van 0,9 m in de noord-, oost-, zuid- en westzijde.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Delden)): 1894, Halbertsma, 37,5 m, 200 m³, landgoed Twickel.
- [Rijksmonumentenregister 507505](https://monumentenregister.cultureelerfgoed.nl/monumenten/507505): plint, ronde onderbouw met ingang, cordonlijst, slankere schacht, uitkragende achtkante ommanteling op een rondboogfries met verzwaarde hoeken, blinde vensters met timpaan, knoppen, kantelen en een achtkant torentje.
- BAG-pand 1735100000056870 (PDOK, 2026-11-05): voetafdruk (cirkel van 8,28 m) en hart.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): maaiveld NAP +22,0, dak NAP +57,5 tot 58,0, borstwering tot circa 59,5, torentje NAP +62,0, omhullende van de ommanteling circa 10 m.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.1735100000056870: dak NAP +57,84, maaiveld 21,82.
- PDOK-luchtfoto (Actueel_orthoHR): stand van de achtkant, borstwering 9,25 m, torentje, trap met vazen naar het noordoosten.
- PDOK-terrein (2026-11-05): stoep voor de ingang aan de noordoostkant.
- Foto's op Wikimedia Commons: "Delden, de watertoren RM507505 foto7 2013-04-22" (vanaf het zuidoosten; 29,85 px/m uit de BAG-diameter, alle geledingen en breedtes), "Watertoren Delden", "Water tower in Delden" (ingangspartij, vensters, oculi) en de RCE-opnamen 20297443, 20297444 en 20297445 (overzicht, reservoirommanteling).

## Geschat en weggelaten

Geschat: alle geledingen onder het dak en de breedtes van plint, cordonlijst, schacht, fries, ommanteling en kroonlijst uit één foto (onzekerheid circa 0,3 m), met het dak en het torentje uit het AHN en de 3D BAG; de richting van de ingang (35 graden van oost: de stoep in het PDOK-terrein en de trap op de luchtfoto, terwijl het register "zuidzijde" schrijft); de vensters en oculi aan de kant die op geen foto staat (gespiegeld om de ingang); de stand van de kijkspleten; de maten van de ingangspartij en de stoep; de diepte van nissen en verdiepte vlakken. De kantelen zijn vergroot tot 0,9 × 0,9 m (in het echt circa 0,5 m) en de borstwering is 0,9 m dik, voor 1:1000.

Weggelaten: de bliksemafleider en de ladder op het torentje, de Ionische zuilen, het wapen en de beelden als losse vormen (de consoles staan er als blok), de knoppen, het kleine rondboogfries onder de kroonlijst, de lijst onder de schachtkop en de dunne band in de onderbouw (kleiner dan 0,9 m), de kleine vensters in de borstwering (0,4 m), de trap met vazen en de heuvel (die zitten in het PDOK-terrein), en de gebouwen van het pompstation (eigen BAG-panden).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: plint en cordonlijst verjongend, consoles en overgang naar de achtkant steiler dan 54 graden, profiellijst, kroonlijsten en fronton met een onderkant van 45 graden of bol, nissen met een plafond van 56 graden of een spitse top van 50 graden. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde cilinder op de BAG-cirkel tot het dak met een blokje voor het torentje) aan elke kant de plint, de cordonlijst, de slankere schacht met kijkspleten, de consoles en het rondboogfries, de uitkragende achtkant met blinde vensters, de kroonlijst, de kantelen en het gekanteelde torentje, en aan de noordoost- en oostkant de ingangspartij met stoep, vensters en oculi.

Controle-URL: http://localhost:3000/kaart/52.26608/6.70887/200/1x1/0
