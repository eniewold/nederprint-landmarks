# Watertoren Winterswijk

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-winterswijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één verjongende achthoek, kraag en band zijn schuine achthoekige ringen, de opstand een prisma en het dak een tentdak (`hull` van de achthoek en de top); lisenen, consoles, portaal en vensterstroken zijn ribben, deur en vensters nissen.

De watertoren aan de Misterweg in Winterswijk is in 1926 ontworpen en gebouwd door bouwbedrijf MABEG, 36 m hoog met een reservoir van 400 m³. Sinds 1993 is hij een woning (huisnummer 140). Rijksmonument 523469.

## Bestanden

- `watertoren-winterswijk.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse opstand of los dak zou een voet tot de grondplaat krijgen.
- `watertoren-winterswijk.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-winterswijk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [245410.75, 442930.55], het hart van de achthoekige BAG-contour van pand 0294100000392878 (11,4 m over de vlakken, hoeken op 4,9 + k·45 graden), tussen het BAG-hart en het hart van de schacht in het AHN; op maaiveld (NAP +37,35 m). De top van het tentdak staat in het AHN op hetzelfde hart, dus de toren staat niet scheef. +X wijst naar het vlak met de deur en de hoge vensterstrook, naar de Misterweg (`xAxis` [0.4602, -0.8878], 297,4 graden linksom van RD-oost); de vlakken staan op k·45 graden. Vervangt alleen het BAG-pand van de toren; de aanbouw uit 2003 ten noorden (pand 0294100000385345) blijft PDOK.

## Onderdeel `building:schacht-reservoirzone-en-tentdak`

- Achthoekige bakstenen schacht van 11,44 m over de vlakken (BAG) die verjongt tot 10,84 m op +18,55, met op elke hoek een lisene van 0,8 m voor de getande hoekmetselwerken.
- Ingang op +X: portaal van 2,6 m breed en 3,6 m hoog, 0,3 m voor het vlak, met een deurnis van 1,6 × 2,6 m. Daarboven een vensterstrook van 1,2 m breed, 0,2 m voor het vlak, van +4,6 tot +17,8 met drie smalle vensternissen; dezelfde strook op het vlak +90. In de vlakken ±45 twee vensters (1,1 × 1,3 m) boven elkaar.
- Witte betonnen kraag (55 graden) naar de vensterzone van 11,4 m over de vlakken op +18,95; witte band van 11,7 m van +21,85 tot +22,5 met een schuine onderkant (53 graden) en zestien consoles (0,7 m breed, onderkant 51 graden) op de hoeken en midden op de vlakken.
- Reservoirzone van 11,24 m over de vlakken tot +31,15 met zestien lisenen van 0,7 m breed en 0,25 m diep, boven de consoles.
- Koperen opstand van 10,44 m over de vlakken, 0,4 m terugliggend, tot +33,4 met een venster (0,9 × 1,0 m) in elk vlak; koperen achtzijdig tentdak (35 graden) tot +37,0.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Winterswijk)): MABEG, 1926, 36 m, 400 m³, woning sinds 1993.
- [Rijksmonumentenregister 523469](https://monumentenregister.cultureelerfgoed.nl/monumenten/523469).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de toren NAP +37,35, hoogste punt NAP +74,35 (37,0 m boven maaiveld), het oppervlak boven elke hoogte neemt gestaag af (verjonging, terugliggende opstand), dakvoet rond 33,5 m, tentdak van circa 35 graden.
- BAG-pand 0294100000392878 (bouwjaar 1924 in de BAG, in gebruik) en luchtfoto (PDOK): achthoek, stand van de vlakken, tentdak, aanbouw en straat.
- Foto [Winterswijk, de Watertoren RM523469 IMG 2610](https://commons.wikimedia.org/wiki/File:Winterswijk,_de_Watertoren_RM523469_IMG_2610_2022-07-18_18.06.jpg), frontaal met rechte lijnen: hoogtes van kraag, band, reservoirzone en opstand, de verjonging (2 % breedte over 7 m), de vensterzone 5 % breder dan de schacht eronder, de zestien lisenen en consoles, geschaald op de dakvoet in het AHN (32 px/m).
- Foto's [Water Tower Winterswijk](https://commons.wikimedia.org/wiki/File:Water_Tower_Winterswijk.JPG) en [Winterswijk, watertoren RM523469 foto2](https://commons.wikimedia.org/wiki/File:Winterswijk,_watertoren_RM523469_foto2_2015-05-14_09.03.jpg): koperen opstand met vensters, terugsprong ten opzichte van de reservoirzone, tentdak.
- Foto [Watertoren Winterswijk](https://commons.wikimedia.org/wiki/File:Watertoren_Winterswijk.jpg): ingang met portaal, vensterstrook en de vensters in de vlakken ernaast.

## Geschat en weggelaten

Geschat: de verjonging van de schacht (de AHN-randen zijn per zijde tot 0,4 m onbetrouwbaar; BAG aan de voet, foto voor de verhouding), de breedte van de vensterzone en reservoirzone (de foto's geven 4–5 % breder dan de schacht, het AHN iets smaller), de terugsprong van de opstand (foto's 0,3–0,6 m), de diepte van lisenen en consoles, de hoogtes van de vensters in de schacht, de vensterstrook op het vlak +90 (op de foto alleen schuin te zien) en een venster in alle acht vlakken van de opstand (op de foto's in elk zichtbaar vlak). De richting van de deur volgt uit de straat en het hek op de foto.

Weggelaten (kleiner dan 0,9 m of te dun): de kleine vierkante vensters in de vensterzone (0,6 m), de tanding van het hoekmetselwerk, de ijzeren steunen rond de reservoirzone, de piek op het tentdak, het hekwerk en de luifellamp bij de deur.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,002 %: kraag, band, consoles, vensterstroken en nisplafonds zijn steiler dan 45 graden. De doorsneden op 1,5, 8, 19,5, 21,5, 27, 32,3 en 35 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komen alleen splinters steun in de vensternissen van de koperen opstand; de aanbouw ten noorden blijft PDOK (circa 5 m, geen te hoge strook). Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,06–0,16 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.96743/6.70280/200/1x1/0
