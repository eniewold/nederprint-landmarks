# Drogenapstoren (Zutphen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-drogenapstoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het poortgebouw is een prisma met een schuine fries en een borstwering met losse kantelen, de torentjes en de bovenbouw zijn achtkanten (`hull` van achthoeken), spitsen zijn achtkante piramides; poort, deur en vensters zijn nissen.

De Drogenapstoren, oorspronkelijk de Saltpoort, is in 1444-1446 gebouwd als stadspoort van Zutphen en al in 1465 dichtgemetseld. Van 1888 tot 1927 diende hij als watertoren met een reservoir van 180 m³ in de toren. In de Tweede Wereldoorlog werd hij gedeeltelijk opgeblazen; in de jaren zestig kreeg hij een nieuwe spits in de oude vorm, maar zonder de dakkapelletjes. Sinds 1983 is hij een woning. Rijksmonument 41393.

## Bestanden

- `drogenapstoren.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; torentjes, bovenbouw, spits en de twee aanbouwen zitten daarom in één gesloten volume.
- `drogenapstoren.json`: catalogusitem met RD-oorsprong, `xAxis`, bemonsteringspunten, `groundHeight` en het vervangen BAG-pand.
- `drogenapstoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [210481.76, 461524.11], het hart van het vierkante deel van BAG-pand 0301100000013716, op het maaiveld van de poort (NAP +9,1 m; de poortweg ligt op +9,0, de Drogenapsteeg op +9,3, de tuin ten westen op +8,1). De gevels staan 4,67 graden linksom van RD; +X wijst naar de zuidgevel met de poort, naar de Martinetsingel (`xAxis` [0.0814, -0.9967]), +Y naar het oosten. De spits staat in het AHN 0,45 m zuidelijker en 0,1 m westelijker dan het hart van het poortgebouw; zo staat hij ook in het model.

`groundSamplePoints` liggen op de poortweg, de Drogenapsteeg en het pad ten oosten en zuidoosten, niet in de lagere tuin, zodat de poort niet een meter wegzakt; de onderkant ligt op −1,3 m zodat de westgevel tot in de tuin reikt. `groundHeight` 52,4 is de terugval als geen punt in de uitsnede valt: NAP +9,0 (poortweg, laagste bemonsteringspunt in het AHN-DTM) plus 43,4 m NAP-ellipsoïdeafstand, zoals het PDOK-terrein bij de Walburgiskerk 150 m verderop die geeft.

## Onderdeel `building:poortgebouw-hoektorentjes-en-spits`

- Poortgebouw van 11,44 × 11,28 m (BAG), tot +11,9 m. In de zuidgevel een spitsboogpoort van 3,0 m breed en 4,1 m hoog, 3 m diep (de doorgang is dichtgezet; de boog is nu een portiek), in een terugliggend spitsboogkader van 4,2 m tot 5,0 m. Daarboven het getraliede venster (1,3 × 2,6 m); een venster in elk van de andere gevels.
- Witte boogfries als schuine kraag (54 graden) van +11,9 tot +12,25, 0,25 m buiten de gevels; borstwering van 0,6 m dik tot +13,0 met per zijde vier kantelen van 0,93 m breed en kantelgaten van 0,9 m, tot +13,75; weergang op +12,25.
- Vier achtkante hoektorentjes van 3,3 m (hoekstraal 1,65), het hart 0,8 m buiten elke gevel, op een omgekeerde achtkante kraag (60 graden) van +10,0 tot +11,9; schacht tot +16,15, blokjesfries (56 graden) tot +16,45 en een achtkante leien spits (69 graden) tot +21,0.
- Achtkante bovenbouw van 8,0 m over de vlakken vanaf de weergang tot +20,9, spitsboogfries als kraag (63 graden) tot +21,4, dakvoet met een schuine onderkant (52 graden) op +22,35 (apothema 4,6 m). Op de vier hoofdvlakken een hoog venster (1,0 × 2,0 m) en een klein venster (0,9 × 0,9 m) boven de weergang.
- Achtkante leien spits met een knik aan de voet: van +22,35 (apothema 4,6) naar +24,0 (4,15), daarna 79 graden tot de top op +45,0.
- Twee lage aanbouwen in het BAG-pand met een lessenaarsdak tegen de toren: west (tegen de stadsmuur) 2,5 × 3,05 m van +6,2 tot +8,6, oost 3,3 × 3,0 m van +7,0 tot +8,4.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Drogenapstoren): Saltpoort 1444-1446, dichtgemetseld 1465, watertoren 1888-1927 met 180 m³, nieuwe spits in de jaren zestig zonder dakkapelletjes, woning sinds 1983. De taak noemt 50 m; het AHN geeft 44,4 m (hoogste cel) en een kegelpassing op de spits 45,5 m; bol en windvaan komen daar nog bovenop.
- [Rijksmonumentenregister 41393](https://monumentenregister.cultureelerfgoed.nl/monumenten/41393).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de poort, borstwering rond +13,6 boven de poort (noordzijde), toppen van de torentjes rond +21, dakvoet van de spits op +22,3 met een straal van 4,3–4,5 m, en het hart en de helling van de spits uit een kegelpassing (rms 0,5 m, 4,9 m stijging per m straal).
- BAG-pand 0301100000013716 (bouwjaar 1446, in gebruik): het vierkante poortgebouw en de twee aanbouwen; DSM-mediaan binnen de aanbouwen NAP +17,45 (west) en +16,8 (oost). Luchtfoto (PDOK): achtkant van de spits en de vier torendaken.
- Foto [Zutphen, de Drogenapstoren RM41393 IMG 7993](https://commons.wikimedia.org/wiki/File:Zutphen,_de_Drogenapstoren_RM41393_IMG_7993_2021-02-12_11.31.jpg), frontaal op de zuidgevel, geschaald op de borstwering in het AHN (29,8 px/m): poort, venster, boogfries, kantelen, hoogtes van de torentjes, bovenbouw met vensters en dakvoet.
- Foto's [Zutphen, de Drogenapstoren positie2 RM41393 foto3](https://commons.wikimedia.org/wiki/File:Zutphen,_de_Drogenapstoren_positie2_RM41393_foto3_2014-03-10_15.23.jpg), [Drogenapsteeg](https://commons.wikimedia.org/wiki/File:20160917_Drogenapsteeg_Drogenapstoren_Zutphen.jpg) en [Monumentendag 010](https://commons.wikimedia.org/wiki/File:Monumentendag_010.JPG): kantelen, vier torentjes op kraagstenen, achtkanten van bovenbouw en spits, vensters aan noord- en westzijde, de knik aan de voet van de spits.

## Geschat en weggelaten

Geschat: de breedte en het aantal kantelen (vier per zijde, op foto's niet scherp te tellen), de diepte van de borstwering en de weergang, de maat en het uitspringen van de torentjes (foto en luchtfoto: 3,3 m, hart 0,8 m buiten de gevel), het begin van de kraag onder de torentjes, de vensters in de noord-, oost- en westgevel van het poortgebouw (plaats en maat), de diepte van de dichtgezette poort, en de vorm van de twee aanbouwen (lessenaarsdak op de AHN-mediaan; op foto's nauwelijks te zien).

Weggelaten (kleiner dan 0,9 m of te dun): de bogen van de witte fries en van de spitsboogfries (als kraag gemodelleerd), schietgaten en kleine vensters in de torentjes, bol en windvaan op de spits en de pinakels op de torentjes, de wapensteen boven de poort, de stadsmuur ten westen buiten het BAG-pand en het bronzen beeld van Drogenap.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (ratio 1,00000; bij 30 graden 1,0046): fries, kraagstenen, blokjesfries, spitsboogfries, onderkant van de dakvoet, poortboog en nisplafonds zijn steiler dan 45 graden. De doorsneden op 1,5, 3,5, 8,5, 11, 12,1, 15, 18, 21,6, 23 en 30 m blijven gelijk. Geen buurpand raakt het model (de villa ten zuidoosten staat 3,5 m van het BAG-pand). Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de poorttoren op het verborgen PDOK-blok; de voet zit aan de straatkanten 0,1–0,45 m in het maaiveld en reikt aan de westkant tot onder de lagere tuin.

Controle-URL: http://localhost:3000/kaart/52.13916/6.19750/200/1x1/0
