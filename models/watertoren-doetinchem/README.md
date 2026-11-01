# Watertoren Doetinchem

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-doetinchem.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en reservoirblok zijn één vierkant prisma, galerij, luifel, kroonlijst en dakrand zijn kragen met een schuine onderkant, het tentdak twee piramidevlakken met een knik; vensters en deuren zijn nissen.

De watertoren aan de Oude Terborgseweg 208 in Doetinchem is in 1937-1938 gebouwd naar ontwerp van G.J. (Gerrit) Postel Hzn., 40,6 m hoog, met twee vlakbodemreservoirs van 180 m³ boven elkaar. Functionalistisch met traditionele details: een betonnen draagconstructie met een bakstenen omhulsel op een vrijwel vierkante plattegrond, een omlopende galerij met een luifel erboven en aan de ingangszijde een smalle, hoge risaliet. Rijksmonument 513133. Postel ontwierp ook de watertoren van Aalten (`watertoren-aalten`).

## Bestanden

- `watertoren-doetinchem.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een losse galerij of een los dak zou een voet tot de grondplaat krijgen.
- `watertoren-doetinchem.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-doetinchem-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [218197.866, 440613.235], het hart van het vierkant van BAG-pand 0222100000591573 (8,41 m), op maaiveld (NAP +16,1 m in het AHN rond de voet). De top van het tentdak in het AHN ligt op het hart. +X wijst naar de ingangszijde met risaliet en portaal, 36,8 graden linksom van RD-oost (noordoost, naar de Oude Terborgseweg); de gevels volgen de BAG-contour. De gevel op 180 graden (zuidwest) is die van de foto met de dienstdeur. Vervangt alleen het BAG-pand van de toren; de dichtstbijzijnde andere panden liggen op 19 m of verder.

## Onderdeel `building:schacht-galerij-reservoirblok-en-tentdak`

- Vierkante bakstenen schacht van 8,4 m tot de kroonlijst, met in de drie gevels zonder risaliet twee paar smalle vensters (7,3 tot 8,5 en 18,3 tot 19,5 m) en in de zuidwestgevel een deur.
- Ingangszijde: risaliet van 3,2 m breed en 1,0 m diep van het maaiveld tot tegen de galerij, met een kolom trapvensters; daarvoor een laag portaal tot 2,66 m uit de gevel (BAG), 4,2 m hoog met een overstekende afdekking en de ingang.
- Omlopende galerij op 24,1 m, 1,0 m uit de gevel (10,4 m in het vierkant), op een kraag onder 61 graden. Daarboven de glazen verdieping met drie ramen per gevel en aan de ingangszijde een deur naar de galerij, onder een luifel van 0,7 m op 26,6 tot 27,0 m, ook op een kraag.
- Reservoirblok tot 36,25 m met hoeklisenen van 0,9 m breed en 0,2 m voor de gevel, per gevel vier vensters onder de kroonlijst en drie trapvensters (rechts twee, links één). Op de lisenen stenen consoles vanaf 35,0 m onder de kroonlijst (36,25 tot 36,45 m, 0,35 m over de gevel).
- Lichte fries tot 36,7 m, dakrand van 9,1 m op 37,15 tot 37,4 m op een schuine onderkant, tentdak met een flauwere voet tot de knik op 37,65 m (8,2 m) en dan onder 36 graden tot de top op 40,6 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Doetinchem)): architect, bouwjaren, 40,6 m, 2 × 180 m³, vierkante plattegrond, galerij met luifel, risaliet aan de ingangszijde, monumentnummer.
- [Rijksmonumentenregister 513133](https://monumentenregister.cultureelerfgoed.nl/monumenten/513133).
- BAG-pand 0222100000591573 (PDOK): vierkant van 8,41 m met een uitbouw van 3,2 bij 2,66 m aan de noordoostzijde (risaliet en portaal), richting van de gevels.
- 3D BAG LoD2.2 van hetzelfde pand: tentdak met de top op NAP +56,5 m, de uitbouw als laag dak van 4 tot 6 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +16,1 rond de voet, hoogste punt NAP +56,93 (bliksemafleider), dakhelling circa 36 graden en dakvoet rond 37,5 m, galerij en luifel als rand van 24 tot 28 m buiten de gevel, de risaliet tot ruim 20 m en het portaal op circa 4 m. De gevelranden in het DSM zijn rommelig (punten op de gevels, een geïnterpoleerde strook aan de zuidwestzijde).
- Foto [Watertower Doetinchem by G.J. Postel Hzn.](https://commons.wikimedia.org/wiki/File:Watertower_Doetinchem_by_G.J._Postel_Hzn.,_Doetinchem,_the_Netherlands.JPG), van ver en bijna recht op een gevel: hoogtes van galerij, ramen, luifel, vensters, consoles, kroonlijst, fries en dakrand, geschaald op de breedte over de hoeklisenen (36,7 px/m) met de dakrand uit het AHN; hoeklisenen, consoles en de knik in het dak.
- Foto [Doetinchem Watertoren](https://commons.wikimedia.org/wiki/File:Doetinchem_Watertoren.JPG), op de zuidwestgevel: vensterparen en deur in de schacht, dezelfde vensterindeling in het reservoirblok.

## Geschat en weggelaten

Geschat: de diepte van de risaliet (1,0 m, uit het DSM) en zijn trapvensters (geen foto van de ingangszijde), de vorm en hoogte van het portaal (BAG, 3D BAG en DSM, plat afgedekt), de vensterparen in de noordwest- en zuidoostgevel (zoals de zuidwestgevel), dezelfde vensterindeling in alle vier gevels van het reservoirblok en de glazen verdieping, de deur naar de galerij aan de ingangszijde, de uitkraging van galerij (1,0 m) en luifel (0,7 m), de maten van consoles, kroonlijst en fries, en de knik in het dak. Galerij, luifel, kroonlijst, consoles, dakrand en portaalafdekking zijn in het echt dunne platen met een vlakke onderkant; hier staan ze op een kraag onder 61 graden zodat de export ze niet opvult. De vier vensters onder de kroonlijst zitten 0,4 m lager dan op de foto, omdat het latei tussen nis en kraag anders als te dun werd opgevuld.

Weggelaten (kleiner dan 0,9 m of te dun): het hekwerk van de galerij, de antennes en de bliksemafleider op de top, de kleine consoles onder de dakrand, de hardstenen lateien en de bakstenen consoles bij het portaal, de raamroeden en het metselwerk.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,005 % (0,14 m³): alleen een randje van 0,05 m in de bovenhoek van de vensternissen. Er is geen echte overhang; alle kragen hangen onder 61 graden (52 langs de hoekgraten). De doorsneden op 1,5, 8, 19, 23, 25,5, 31, 34,7, 36,1 en 36,6 m blijven gelijk. Renders van vier kanten naast de 3D BAG: het model heeft per kant de galerij, de luifel, de glazen verdieping, de hoeklisenen met consoles, de kroonlijst, de fries en de dakrand met knik, die het PDOK-blok mist; aan de noordoostzijde ook de risaliet met trapvensters en het portaal met ingang. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen alleen splinters steun in de bovenhoeken van de vensternissen; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,03–0,17 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.95034/6.30650/200/1x1/0
