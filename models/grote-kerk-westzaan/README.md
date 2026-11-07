# Grote Kerk (Westzaan)

Vereenvoudigd model van de hervormde kruiskerk aan de Kerkbuurt in Westzaan (rijksmonument 40006), gebouwd in 1740–1741 in de vorm van een Grieks kruis, met een gevel in régencestijl (mogelijk naar ontwerp van Jan van der Streng). De kerk werd tegen de laatgotische toren van de vorige Sint-Joriskerk gebouwd; die toren stortte in 1843 in en is niet herbouwd. De westgevel, met het jaartal 1969, is bij de restauratie van dat jaar vernieuwd.

## Onderdelen

- Vier gelijke armen van 12,2 × 28,4 m (noord-zuid) en 11,8 × 28,0 m (oost-west) met zadeldaken van 54,5 graden (helling 1,4). De nokken liggen op NAP +21,95 m en snijden elkaar in de kruising; de dakvlakken vormen daar vier kilgoten.
- Ronde hoekstukken tussen de armen (kwartcirkels van 3,7 m rond de binnenhoek, uit de BAG-contour), plat gedekt op kroonlijsthoogte NAP +14,2 m.
- Witte kroonlijst van 0,35 m rond de zijgevels en de hoekstukken, met een afgeschuinde onderkant van 49 graden.
- Oostgevel: ingezwenkte geveltop met voluten op de lisenen en een kuif (NAP +23,6 m in het AHN), twee hoge rondboogvensters, een oculus en de rondboogdeur.
- Noord- en zuidgevel: rechte topgevel 0,45 m boven het dakvlak met een blokje op de top, twee hoge rondboogvensters, een oculus en een zolderraam.
- Westgevel (1969): rechte topgevel met zolderraam, lisenen die tot 1,4 m boven de kroonlijst doorlopen, twee kleine vensters en een ingangsportaal met zadeldakje.
- Lisenen van 1,2 m breed en 0,45 m vooruit aan weerszijden van elke eindgevel (sprongen in de BAG-contour).
- Twee lage veelhoekige aanbouwen in de westelijke binnenhoeken met een schilddak van 27 graden (goot 4,2 m boven het kerkhof), en ronde vensters in de ronde hoekstukken erboven.
- Deuren in de oostelijke ronde hoekstukken.

Vensters, oculi en deuren zijn blinde nissen van 0,35 m met een spitse top (58 graden) of, bij de oculi, een punt bovenop, zodat ze op 1:1000 zonder steun printen.

## Geschat

- Hoogtes en dakhelling komen uit het AHN-DSM (0,5 m): nok, kroonlijst, kuif van de oostgevel, top van de rechte gevels (NAP +22,6 m), lisenen van de westgevel en de daken van de aanbouwen. Het kerkhof ligt op NAP +0,6 m (AHN-DTM); dat is z = 0 in het model.
- De contour van de ingezwenkte oostgevel is uit het DSM op de gevel en de foto's afgeleid; de krullen, de schelp en het wapen zijn vereenvoudigd tot een glad silhouet.
- Plaats en maat van vensters, oculi en deuren zijn van de foto's geschat. Of de zuidgevel een deur heeft, is op de beschikbare foto's niet te zien; die is weggelaten.
- Het portaal (BAG 2,35 × 3,1 m) is een dicht blok met zadeldak; in werkelijkheid is het een open portiek met zuilen.

## Weggelaten

- Wapen, beeldhouwwerk, vlechtingen, kapitelen en de geprofileerde kroonlijst als losse lijsten (kleiner dan 0,9 m).
- Het kleine luikje in de kilgoot bij de kroonlijst, schoorsteentjes op de aanbouwen, lantaarns en het hekwerk.
- De verdwenen toren (ingestort 1843).

## Bestanden en genereren

De GLB gebruikt meters en glTF Y omhoog; de node `building:kerk` vervangt `NL.IMBAG.Pand.0479100000001164` (het enige BAG-pand van de kerk; de aanbouwen en het portaal horen erbij). De oorsprong is RD (113142,71, 497542,03) in het hart van de kruising, +X loopt langs de oost-westnok (7,5 graden linksom van RD-oost). De onderkant ligt 0,6 m onder het kerkhof, omdat de straat aan de noordzijde lager ligt. `groundHeight` 43,459 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk. Genereer GLB, catalogus-JSON en STL op 1:1000 vanuit de root:

```sh
node scripts/generate-grote-kerk-westzaan.mjs
```

## Controle

Het model is één gesloten volume (`NoError`, genus 0); het grondvlak van 649 m² komt overeen met de BAG (652 m²). Met de printbare overhang van 45 graden voegt de export niets toe: de 3MF-export op 1:1000 is met en zonder steun gelijk en het PDOK-pand is eruit. Het model is van vier kanten vergeleken met de PDOK-reconstructie en met RCE- en Commons-foto's uit het zuidoosten, zuidwesten en noordoosten.

## Bronnen

- [Wikipedia: Grote Kerk (Westzaan)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Westzaan)): bouwgeschiedenis.
- [Rijksmonument 40006](https://monumentenregister.cultureelerfgoed.nl/monumenten/40006).
- [Commons-categorie Hervormde Kerk, Westzaan](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Westzaan), vooral [Hervormde-kerk.JPG](https://commons.wikimedia.org/wiki/File:Hervormde-kerk.JPG) en de RCE-opnamen 20255050, 20255058 en 20255059.
- BAG-pand `0479100000001164` (PDOK BAG WFS): voetafdruk, lisenen, hoekstukken, aanbouwen en portaal.
- 3D BAG `NL.IMBAG.Pand.0479100000001164`: nokhoogte en dakvlakken ter controle.
- PDOK AHN DSM en DTM 0,5 m en actuele luchtfoto.
