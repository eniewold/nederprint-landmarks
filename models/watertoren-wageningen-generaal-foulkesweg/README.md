# Watertoren Generaal Foulkesweg (Wageningen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-wageningen-generaal-foulkesweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, band, reservoir, omloop en kegeldak zijn één omwentelingsprofiel, de steunberen radiale platen met een schuine kap, de traptoren een cilinder met een kegeldakje, het portaal een blok met een schilddak; deur en vensters zijn nissen.

De watertoren aan de Generaal Foulkesweg op de Wageningse Berg, naast het voormalige stadion van FC Wageningen, is in 1948 gebouwd naar ontwerp van Th.K.J. (Theo) Koch, als vervanger van de toren uit 1898 die in de Tweede Wereldoorlog is verwoest. Hij is 30 m hoog met een reservoir van 130 m³ en heet in de volksmond "de peperbus".

## Bestanden

- `watertoren-wageningen-generaal-foulkesweg.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; een los dak of portaal zou een eigen voet tot de grondplaat krijgen.
- `watertoren-wageningen-generaal-foulkesweg.json`: catalogusitem met RD-oorsprong, `xAxis`, maaiveldpunten en het vervangen BAG-pand.
- `watertoren-wageningen-generaal-foulkesweg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [176246.5, 442220.45], het hart van de schacht in het AHN (randen op 10 tot 17 m hoogte), op maaiveld (NAP +43,0 m). De BAG-contour van pand 0289100000005476 is grof (48 punten, straal 2,4 tot 6,7 m, steunberen als punten van 1,5 m) en ligt 1,5 m noordelijker; de top van het kegeldak ligt in het AHN 0,3 m van het hart. Lokale +Y wijst naar de traptoren, op kompasrichting -5 graden (de uitstulping van traptoren en portaal in het AHN, het kegeldakje op de luchtfoto); `xAxis` [0.9962, 0.0872]. De zes steunberen staan op 30, 90 en 150 graden aan weerszijden van de traptoren: twee ribben op de zuidgevel en de randen oost en west op de luchtfoto, en de stand ten opzichte van de traptoren op de frontale foto. Het terrein loopt af naar het noorden: de maaiveldpunten liggen 6,3 m uit het hart en vóór het portaal op 7 m, waar het terrein nog op NAP +43,0 ligt; de zuidkant ligt 0,6 m hoger en zakt dus iets in. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-steunberen-traptoren-reservoir-en-kegeldak`

- Bakstenen schacht die zich licht verjongt, van r 4,78 aan de voet naar r 4,62 op 19,15 m, met zes steunberen van 0,9 m breed die aan de voet 5,25 m en bovenaan 5,12 m uit het hart reiken. Boven de band lopen ze door als een schuine leikap tot 21,1 m tegen het reservoir.
- Witte betonband onder het reservoir, r 4,72 van 19,3 tot 19,7 m, op een schuine onderkant van 56 graden.
- Reservoir r 4,45 tot 25,23 m, witte rand r 4,6 tot 25,8 m (schuine onderkant), daarboven de open omloop als verdieping tot r 4,2 en 26,2 m.
- Koperen kegeldak van 10,1 m: dakrand van 26,45 tot 26,6 m, top op 30,3 m (helling 36 graden).
- Ronde traptoren van 2,5 m met het hart op 4,4 m, van de voet tot 27,9 m, door de dakrand heen, met een eigen kegeldakje tot 28,9 m en vijf spleetvensters boven elkaar.
- Portaal van 5,5 m breed aan de voet van de traptoren, tot 6,5 m uit het hart, goot op 2,4 m en schilddak tot 3,7 m; deur van 1,1 × 2,1 m iets rechts van het midden.
- Getoogd venster hoog in het paneel links van de traptoren (gezien vanaf de deur), spleetvensters onder en halverwege in de panelen en in het reservoir.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Wageningen_Generaal_Foulkesweg)): architect, bouwjaar, 30 m, 130 m³, ligging.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +43,0 rondom (zuidkant +43,6), hoogste punt NAP +73,37 (30,4 m boven maaiveld), schacht r 5,0 tot 5,2 over de steunberen, uitstulping van traptoren en portaal naar het noorden tot 5,7 en 6,5 m, dakhelling uit het midden van het kegeldak (r 0 tot 2,8 m). Het koper buiten r 3 m geeft geen echo's; daar staan lagere waarden uit de omloop.
- BAG-pand 0289100000005476 en luchtfoto (PDOK): ligging, kegeldakje van de traptoren, steunberen op de zuidgevel.
- Foto [Overzicht van de watertoren (RCE 20423290)](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Wageningen_-_20423290_-_RCE.jpg), frontaal met de deur: breedtes van schacht, steunberen, reservoir, dak en traptoren en de hoogtes van band, rand en dakrand, geschaald op de top in het AHN (36,3 px/m).
- Foto [Overzicht van het bovenste gedeelte (RCE 20423291)](https://commons.wikimedia.org/wiki/File:Overzicht_van_het_bovenste_gedeelte_van_de_watertoren_-_Wageningen_-_20423291_-_RCE.jpg): omloop met stijlen, dakrand, traptoren met kegeldakje, leikappen van de steunberen (84 px/m op het reservoir).
- Foto [Overzicht van het onderste gedeelte (RCE 20423292)](https://commons.wikimedia.org/wiki/File:Overzicht_van_het_onderste_gedeelte_van_de_watertoren_-_Wageningen_-_20423292_-_RCE.jpg): portaal, deur en spleetvensters.
- Foto [Watertoren Wageningen](https://commons.wikimedia.org/wiki/File:Watertoren_Wageningen.jpg): controle van de stand van steunberen en venster.

## Geschat en weggelaten

Geschat: de kompasrichting van de traptoren (AHN en luchtfoto verschillen 6 graden), de stand en de uitsprong van de steunberen (0,5 m), de verjonging van de schacht, de hoogte en helling van de leikappen, de diepte van de omloop (0,4 m achter het reservoir), de dikte van de dakrand, de hoogte van het kegeldakje van de traptoren, de diepte en dakhelling van het portaal (de achterkant van het portaal staat niet op de foto's), en de plaats en maten van deur en vensters (spleetvensters 0,45 m breed in plaats van circa 0,3 m, zodat ze op 1:1000 zichtbaar blijven).

Weggelaten (kleiner dan 0,9 m of te dun): de spits met bol en windvaan op het dak (stam circa 0,55 m), de betonnen stijlen in de open omloop (de omloop is een verdieping onder het dak), de stalen trommel binnen de omloop, de overstek van het portaaldak, de natuurstenen omlijsting van de deur, het hekwerk rond de toren en de ladder.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,3 %: alleen onder de dakrand, die 0,85 m buiten de verdiepte omloop steekt, de echte overstek van het kegeldak. De doorsneden op 1,5, 10, 18, 20,5, 23, 25 en 27,5 m (portaal en deur, schacht met steunberen, venster, leikappen, reservoir, witte rand, traptoren boven de dakrand) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt een smalle wig onder de dakrand en splinters in de vensternissen; op de kaart staat de toren op het verborgen PDOK-blok op de helling, met de voet van 0,1 m boven (noordkant, voor het portaal) tot 1,25 m in het maaiveld (zuidkant).

Controle-URL: http://localhost:3000/kaart/51.96800/5.69638/200/1x1/0
