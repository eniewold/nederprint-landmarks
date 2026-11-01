# Watertoren Franeker

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-franeker.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, band, bovendeel en fries zijn geëxtrudeerde achthoeken (band en fries met een schuine onderkant als één omhulsel), de lisenen prisma's op de hoeken met een schuin uitlopende voet, het dak een achtzijdige piramide; de deur is een nis.

De watertoren aan de rand van Franeker is in 1925 gebouwd naar ontwerp van de I.W.G.L., volgens Wikipedia 48,80 m hoog (de ansichtkaart uit 1925 zegt 49 m) met een reservoir van 445 m³. De oorspronkelijke geribde koepel is later vervangen door een laag metalen tentdak en de gevels zijn grijs bekleed. Het BAG-pand staat sinds kort op "Verbouwing pand" met een logiesfunctie.

## Bestanden

- `watertoren-franeker.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los dak zou een voet tot de grondplaat krijgen.
- `watertoren-franeker.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-franeker-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [166462.95, 577889.5], het hart van de achthoek in het AHN, op maaiveld aan de voet (NAP +1,65 m; de toren staat op een lage verhoging, op 10 m afstand ligt het maaiveld op NAP +1,55). +X wijst naar het vlak op 12,9 graden linksom van RD-oost (`xAxis` [0.97476, 0.22325]): de vlaknormalen volgen uit de minima van de steunfunctie van het DSM en uit de richting van de BAG-contour, die op dezelfde hoek staat. De lisenen staan op de hoeken (22,5 + k·45 graden). De deur staat in het vlak op -90 graden (lokaal -Y), naar het pad en de bestrating aan de zuidkant op de luchtfoto. Vervangt alleen het BAG-pand van de toren.

De BAG-contour van pand 0070100000322890 is kleiner dan de toren: vlakken op 5,1 m van het hart en smalle uitsteeksels tot 7,05 m op de hoeken (de voeten van de lisenen). Het AHN geeft vlakken op 5,9 tot 6,1 m en hoeken op 6,3 tot 6,5 m, en de foto een silhouet van 12,6 m; het model volgt AHN en foto.

## Onderdeel `building:schacht-met-lisenen-band-fries-en-tentdak`

- Achthoekige schacht van 11,3 m over de vlakken tot de band. Deur (1,6 × 2,6 m) in het zuidvlak.
- Op elke hoek een lisene van 0,9 m breed met de voorkant 6,35 m uit het hart, 0,4 m voor de vlakken van de schacht, tot de dakrand op +43,4. Onderaan lopen ze schuin uit tot 7,0 m uit het hart op het maaiveld, vanaf +6,0.
- Band onder het reservoir van +28,5 tot +31,1 (12,2 m over de vlakken), met een schuine onderkant vanaf +27,8 (56 graden). De band loopt om de lisenen heen.
- Bovendeel (het reservoir) 11,7 m over de vlakken en een fries vanaf +39,6 (11,9 m, schuine onderkant) tot de dakrand; de hoeken van beide blijven binnen de voorkant van de lisenen.
- Laag achtzijdig tentdak met graten op de hoeken van de achthoek, voet op +43,2 binnen de dakrand, top op +47,2.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Franeker)): ontwerper, bouwjaar, 48,80 m, 445 m³.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld aan de voet NAP +1,65, hoogste punt NAP +48,88 (47,2 m boven maaiveld), vlakken en hoeken van de achthoek, de richting van de vlakken, de voet van de lisenen (tot circa 6,8 m op 1 m hoogte), de helling van het tentdak (circa 35 tot 40 graden). Rond de dakrand heeft het DSM een ring met te lage waarden (metalen dak, weinig echo's); die is niet gebruikt.
- BAG-pand 0070100000322890 en luchtfoto (PDOK): ligging, richting van de achthoek, achtzijdig tentdak met graten en een klein topstuk, pad aan de zuidkant.
- Foto [Watertoren Franeker 03cw](https://commons.wikimedia.org/wiki/File:Watertoren_Franeker_03cw.JPG) (2007), frontaal met rechte camera: hoogtes van de schuin uitlopende voet, de band (onderkant 28,5 m, bovenkant 31,1 m), de lijn van het fries (39,6 m) en de dakrand (43,4 m), geschaald op de top in het AHN (12,8 px/m op de zijhoeken, 13,6 px/m op het voorste vlak); de breedte van vlakken en lisenen.
- Foto [Watertorens van Franeker, 24-09-1925](https://commons.wikimedia.org/wiki/File:Watertorens_van_Franeker_Nutsbedrijven_en_Infrastructuur,_24-09-1925,_archiefnr_2086.jpg): de lisenen met hun voet, de band onder het reservoir die om de lisenen loopt, de oorspronkelijke koepel.

## Geschat en weggelaten

Geschat: de breedte en het uitspringen van de lisenen (0,9 m, 0,4 m voor de schacht; het AHN onderscheidt ze niet van de vlakken), de diepte van band en fries (0,45 en 0,1 m), de hoogtes van band, fries en dakrand uit één foto, de helling van het tentdak tussen dakrand en AHN-top, en de richting van de deur (naar het pad; op de foto is de zuidgevel niet te zien).

Weggelaten (kleiner dan 0,9 m of te dun): de ronde ventilatiegaten in de band (circa 0,6 m), de drie driehoekige uitsparingen per vlak onder de dakrand (circa 0,6 m), het vierkante rooster in het fries, antennes en kasten aan de gevel, het topstuk van het dak. De smalle vensters uit 1925 zijn op de foto van 2007 niet meer te zien. Mogelijke nieuwe vensters of aanbouwen van de verbouwing tot logies zijn niet bekend; het pand ernaast met een bouwvergunning uit 2026 (1949100011163207) staat nog niet op de luchtfoto en hoort niet bij dit model.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,0000): band en fries hebben een schuine onderkant van 55 tot 56 graden, de lisenen lopen naar onder uit en de deurnis heeft een plafond van 56 graden. De doorsneden op 1,5, 15, 29 en 41 m blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) krijgt de toren geen ondersteuning. Op de kaart staat hij op de plek van het verborgen PDOK-blok, met de voet 0,1 tot 0,15 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/53.18755/5.55869/200/1x1/0
