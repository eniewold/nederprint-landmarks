# Watertoren Spinnerij Twenthe (Almelo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-almelo-1914.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, plaat, reservoirdeel en attiek zijn vierkante prisma's met teruggelegde vlakken tussen de hoekpenanten en lisenen; kapitelen, lateien en kroonlijst hebben een onderkant van 45 graden, de consoles en de onderkant van de plaat zijn afgeknotte piramides onder 45 graden, en de rest van het spinnerijgebouw bestaat uit de dakvlakken van de 3D BAG.

De watertoren uit 1914 (Wikipedia) voedde de sprinklerinstallatie van de stoomspinnerij Twenthe aan het Twenthe-plein. Het hele fabrieksgebouw is rijksmonument 507707; het register noemt een ontwerp van Arend Beltman uit 1916 en beschrijft de toren als een slanke onderbouw met een uitkragend reservoir, dubbele hoeklisenen, kleine vensters onder lateien en tandlijsten. Sinds 1993 is het gebouw een bedrijvencentrum. De toren staat midden in de voorgevel aan het plein (noordwest), tussen het hogere zuidwestblok en het lagere noordoostblok, en steekt voor de gevel uit. Op het dak staan de reclameletters "TWENTHE CENTRUM" op een stalen frame. De tweede, veel bredere watertoren aan de oostkant van het gebouw (met "TWENTHE" in de fries) is niet apart gemodelleerd.

## Bestanden

- `watertoren-almelo-1914.glb`: twee nodes, `building:watertoren-schacht-consoles-en-reservoirdeel` en `building:spinnerij-twenthe`, op maaiveld.
- `watertoren-almelo-1914.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-almelo-1914-1-1000.stl`: alles samen op 1:1000 (het gebouw is 109 × 53 m).

## Oorsprong en oriëntatie

RD-oorsprong [241584.89, 486153.26] (52,35644 N, 6,65821 O), het hart van de schacht: de uitstulping van de BAG-contour in de voorgevel, 3,32 m breed en 2,96 m voor de gevel van het zuidwestblok, vierkant aangenomen. Maaiveld AHN-DTM NAP +11,3 (voor de toren 5e tot 50e percentiel 11,13 tot 11,27; 3D BAG-maaiveld 11,38). Lokale +X loopt langs de voorgevel naar het noordoosten (RD-richting 42,8 graden uit de BAG-randen; `xAxis` [0.73373, 0.67944]), +Y naar het plein (noordwest). `groundHeight` 54,7 is een terugval: NAP +11,3 plus een geoïdehoogte van circa 43,4 m (Alphatoren Enschede 43,5, Kasteel Twickel 43,3), niet gemeten op het PDOK-terrein.

De toren is geen eigen BAG-pand: hij hoort bij pand 0141100000013065 (bouwjaar 1916), het hele spinnerijgebouw van circa 110 × 105 m in RD. De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model dat pand en staat de rest ervan als tweede node in de GLB.

## Onderdeel `building:watertoren-schacht-consoles-en-reservoirdeel`

Maten als halve breedte vanaf het hart, hoogtes boven maaiveld.

- Schacht: hoekpenanten 1,66 m (3,32 m) van -0,3 tot 21,0 m, elk 0,95 m langs het vlak; het bakstenen vlak ertussen 0,2 m terug tot 20,6 m, plafond 45 graden. In de voorgevel vijf vensters van 0,9 m als nis van 0,3 m (0,7-3,9, 5,6-8,5, 10,1-13,0, 14,5-17,4 en 18,6-19,6 m), plafond 63 graden.
- Kapitelen op de hoekpenanten van 20,6 tot 21,15 m, 0,12 m uit, onderkant 45 graden.
- Onderkant van de plaat: afgeknotte piramide van 1,66 m op 21,0 m tot 2,95 m op 22,3 m (45 graden), met op elke hoek een console die er circa 0,25 m onder uitsteekt (van 20,85 tot 22,3 m).
- Betonnen plaat: 2,95 m (5,9 m) van 22,3 tot 23,3 m.
- Reservoirdeel: hoeklisenen 2,85 m (5,7 m), 1,1 m langs elk vlak vanaf de hoek; het bakstenen vlak ertussen 0,2 m terug tot 26,9 m. In elk vlak een venster van 1,3 m van 23,9 tot 26,0 m als nis van 0,3 m en een latei van 2,0 m breed van 26,2 tot 26,6 m. Kapitelen op de lisenen van 26,9 tot 27,2 m.
- Fries van 2,8 m van 27,2 tot 28,2 m, kroonlijst van 3,0 m (6,0 m) van 28,2 tot 28,6 m met een onderkant van 45 graden, gladde attiek van 2,85 m tot 30,45 m (AHN NAP +41,75).
- Reclameletters langs de noordoost- en zuidoostrand van het dak: dichte platen van 0,9 m dik, 0,2 m binnen de rand, tot 32,6 m (AHN-DSM tot NAP +44).

## Onderdeel `building:spinnerij-twenthe`

De rest van BAG-pand 0141100000013065 uit de 3D BAG (LoD2.2, CC BY 4.0): 35 dakvlakken als prisma's vanaf de onderkant onder hun eigen dakvlak (kleinste kwadraten door de hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen. Twee vlakken met een gat (onder hogere vlakken) staan zonder gat, twee splinters op maaiveld zijn weggelaten. Het dakvlak van de toren in de 3D BAG beslaat ook een strook van het gebouw achter de schacht; die strook heeft hier de dakhoogte van het blok ernaast (zuidwestblok 19,0 m, noordoostblok 15,4 m), zonder het deel voor de gevels. De schacht is eruit gesneden; toren en gebouw raken elkaar alleen. Hierin zitten ook de tweede watertoren (blok tot 25,4 m), het noordoostblok met de sheddaken en de lage vleugels.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Almelo_Spinnerij)): 1914, sprinklerinstallatie, rijksmonument 507707, coördinaten 52°21′23″ N 6°39′29″ O.
- [Rijksmonumentenregister 507707](https://monumentenregister.cultureelerfgoed.nl/monumenten/507707): spinnerij Twenthe, A. Beltman 1916; slanke watertoren in de voorgevel met uitkragend reservoir, dubbele hoeklisenen, vensters onder lateien en tandlijsten; tweede, bredere watertoren aan de oostkant.
- BAG-pand 0141100000013065 (PDOK, 2026-11-05): de schacht als uitstulping in de voorgevel en de stand van de gevels.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): maaiveld NAP +11,3, bovenkant van het reservoirdeel NAP +41,7 tot 41,8 (x -3,0 tot 3,1 vanaf het hart), pieken tot NAP +44 langs de noordoost- en zuidoostrand (letters), daken van de blokken naast de toren NAP +30,4 en +26,7. Luchtfoto: het vierkante dak met het frame van de letters.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0141100000013065, LoD2.2-dakvlakken, opgehaald 2026-11-05.
- Foto's op Wikimedia Commons: "Exterieur OVERZICHT VOORGEVEL - Almelo - 20311719 - RCE" (vrijwel diagonaal op de westhoek; schaal circa 30 px/m op de kop uit de breedte van het reservoirdeel: hoogtes van kapitelen, consoles, plaat, vensters, lateien, fries, kroonlijst en attiek), "Watertoren Spinnerij Almelo 1914" (2003: kop, consoles, letters op het frame, vensters alleen in de voorgevel van de schacht), "Exterieur OVERZICHT FABRIEKSCOMPLEX - Almelo - 20297222" en "- 20297223" (de toren in het complex).

## Geschat en weggelaten

Geschat: de hoogtes van alle geledingen uit één schuine foto met een schaal op de breedte van het reservoirdeel en de AHN-top (onzekerheid circa een halve meter); de vorm van de schacht (vierkant aangenomen, de BAG ziet alleen het deel voor de gevel) en dat het reservoirdeel er gecentreerd op staat (het AHN-DSM is rond de kop rommelig); de breedte van het reservoirdeel (5,7 m tussen de lisenen, plaat 5,9 m, kroonlijst 6,0 m) uit het DSM, de luchtfoto en de foto's; de breedtes van penanten en lisenen, de diepte van de teruggelegde vlakken (0,2 m) en de maten van vensters en lateien; de vensterhoogtes in de schacht; de letters als dichte plaat van 0,9 m tot 32,6 m (in het echt letters op een open frame); de dakhoogtes van de strook achter de schacht.

Weggelaten: de tanden van de tandlijst en de groef tussen de dubbele lisenen (kleiner dan 0,9 m; de fries staat er als glad vlak), de ladder aan de schacht, de antenne, het open frame onder de letters, de luifel van de ingang naast de toren, en de gevelindeling van het spinnerijgebouw (betonskelet, vensters, consoles en tandlijsten langs de dakrand: de 3D BAG geeft alleen de massa, net als PDOK).

## Controle

Twee gesloten NoError-nodes met genus 0, die elkaar alleen raken. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet: kapitelen, consoles, onderkant van de plaat, lateien, lisenekapitelen en kroonlijst onder 45 graden of steiler, teruggelegde vlakken met een plafond van 45 graden, vensternissen 63 graden, en de dakvlakken van de 3D BAG staan op de grond. Niet gecontroleerd op de kaart of in een preview-export (geen dev-server in deze sessie); `groundHeight` is geschat. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de 3D BAG-reconstructie (de toren als smal blok tot 30,4 m, zonder kop) de schacht met hoekpenanten, teruggelegde vlakken en vensters, de kapitelen, consoles en schuine onderkant, de uitkragende plaat, het reservoirdeel met lisenen, vensters, lateien, fries en kroonlijst, de attiek en de letters op het dak.

Controle-URL: http://localhost:3000/kaart/52.35644/6.65821/200/1x1/0
