# Watertoren Speelhuislaan (Breda)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-breda-speelhuislaan.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, galerij, belvedère, trommel en dak zijn één omwentelingsprofiel (`revolve`), de lantaarn bestaat uit een glazen ring met drie schijven op schuine onderkanten, het trappenhuis en de ingangsaanbouw zijn prisma's (`hull`) op de BAG-voorgevel, en de vensters, de deur en de stroken in de trommel zijn nissen.

De watertoren in de wijk Belcrum is in 1934-1935 gebouwd naar ontwerp van P.A.H. Hornix, directeur van Gemeentewerken, en J.H.J. Op den Oord, in een zakelijke stijl met invloeden van de Amsterdamse School. Een betonskelet bekleed met roodpaarse handvormsteen, een reservoir van 1200 m³ (register) boven een lekvloer met daaromheen een belvedère met ronde vensters, en oorspronkelijk een koperen lantaarn. Volgens Wikipedia 41,8 m hoog, volgens het register 39,3 m; rijksmonument 519041. Boven de ingang zitten reliëfs van Gerard (J.) van Aalst.

## Bestanden

- `watertoren-breda-speelhuislaan.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse galerij of trommel zou een eigen voet tot de grondplaat krijgen.
- `watertoren-breda-speelhuislaan.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-breda-speelhuislaan-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [112199.1, 401506.4], het hart van de ronde toren op maaiveld (NAP +2,35 m; het AHN-maaiveld rond de voet ligt tussen +2,25 en +2,41). Het midden van de lantaarn in het AHN (112199,08; 401506,30) en de cirkel door het ronde deel van BAG-pand 0758100000050726 (112199,11; 401506,49, r 8,21) vallen binnen 0,2 m samen. `xAxis` [0.9928, -0.1208]: +X loopt langs de rechte zuidrand van de BAG-contour, de voorgevel van trappenhuis en ingangsaanbouw (-6,9 graden van RD-oost); de voorkant kijkt naar -Y (zuid). Richtingen θ in het script lopen vanaf -Y naar +X.

`groundSamplePoints` liggen 10,5 m uit het hart en vóór het trappenhuis. `groundHeight` 46,31 (NAP 2,35 + 43,96, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:schacht-galerij-trommel-lantaarn-en-trappenhuis`

- Schacht van 15,1 m doorsnede tot +17,13, met drie rijen smalle vensters (0,5 m breed, op +4,8, +9,7 en +14,6) om de 45 graden vanaf θ = -32,5, behalve achter trappenhuis en aanbouw.
- Galerij (belvedère) van 17,9 m doorsnede, vloer op +19,3, rechte rand van 0,5 m op een schuine kraag van 50 graden naar de schacht.
- Belvedère: terugliggende wand van 14,9 m doorsnede van +19,3 tot +21,0 met ronde vensters (1,1 m) in dezelfde richtingen als de schachtvensters.
- Reservoirtrommel van 16,8 m doorsnede vanaf +22,1, met een schuine onderrand van 49 graden vanaf de belvedère, en vijftien verdiepte verticale stroken (0,5 m breed, 0,3 m diep) om de 24 graden van +27,0 tot de dakrand op +33,65.
- Licht kegelvormig dak (5 graden) tot +34,15 aan de voet van de lantaarn.
- Lantaarn: glazen ring van 4,6 m doorsnede met drie schijven van 5,7 m (bovenkanten +35,7, +37,0 en +38,3, rand 0,25 m op een schuine onderkant van 47 graden), de bovenste bol tot +38,8, en de mastvoet van 0,9 m tot +39,8.
- Trappenhuis voor de zuidgevel, 3,3 m diep tot de voorgevel (9,27 m uit het hart), van x = 0,9 tot de halfronde oostkop (middelpunt [7,7, -7,6], r 1,67), plat dak op +26,65; hoog strookvenster (0,9 m breed, +4,5 tot +18,0), drie ronde vensters (1,2 m) op +20,3 en twee liggende vensters onderin.
- Ingangsaanbouw van x = -2,4 tot 0,9 met een ronde westhoek (r 0,8), plat dak op +3,9, en de stalen rondboogdeuren (1,9 m breed) als nis met een spitse top van 55 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Breda_Speelhuislaan)): ontwerpers, bouwjaren, 41,8 m, doorsnede 17 m, trappenhuis tegen de toren, belvedère met ronde vensters, betonnen lantaarndak uit de bezetting.
- [Rijksmonument 519041](https://monumentenregister.cultureelerfgoed.nl/monumenten/519041): 39,3 m, rond, kegelvormig dak met lantaarn, uitkragend deel op reservoirniveau met belvedère, ingangsaanbouw en trappenhuis van vijf lagen met platte daken, reservoirvloer op 22,81 m.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +2,35; dakrand +33,73 boven maaiveld op 7,5 m uit het hart, dak +34,11 op 3,5 m; lantaarnschijf +38,27 op 2 m, top +38,77 op 1 m, mastvoet +39,77 in het hart; trappenhuis +26,6 tot +26,7; trommelrand tussen 8,3 en 8,5 m uit het hart, galerij tot circa 9 m. De zuidkant van de toren heeft een nodata-schaduw in het DSM.
- BAG-pand 0758100000050726 en luchtfoto (PDOK, 8 cm): ronde contour (r 8,21), rechte voorgevel van trappenhuis en aanbouw op 9,27 m uit het hart over 10,4 m, halfronde oostkop (r 1,67) en ronde westhoek.
- 3D BAG (LoD2.2, rmse 0,22 m): ter vergelijking; heeft trommel, trappenhuis en een blok als lantaarn, geen galerij of belvedère.
- Foto [Breda Belcrumwatertoren 2024-08-17](https://commons.wikimedia.org/wiki/File:Breda_Belcrumwatertoren_2024-08-17.jpg), frontaal op het trappenhuis: trommel 976 px = 16,9 m (57,8 px/m); schacht 0,90, belvedère 0,89 en galerij 1,068 keer de trommel; hoogtes van galerij, belvedère, onderrand van de trommel en onderkant van de stroken; richtingen van de stroken (om de 24 graden) en de vensters; breedte van aanbouw (3,3 m) en trappenhuis (8,4 m); de lantaarn met drie schijven.
- RCE-foto's [zuidzijde](https://commons.wikimedia.org/wiki/File:Overzicht_zuidzijde_-_Breda_-_20534450_-_RCE.jpg), [noordoostzijde](https://commons.wikimedia.org/wiki/File:Overzicht_noordoostzijde_-_Breda_-_20534416_-_RCE.jpg) en [zuidoostzijde](https://commons.wikimedia.org/wiki/File:Overzicht_zuidoostzijde_-_Breda_-_20534413_-_RCE.jpg): trappenhuis met ronde oostkop, vensterrijen, ronde vensters, ingang.

## Geschat en weggelaten

Geschat: de doorsnede van de schacht (15,1 m) uit de verhouding op de frontale foto; de BAG-cirkel (16,4 m) ligt tussen schacht en trommel en is waarschijnlijk de bovenaanzicht van de trommel. De hoogtes van galerij (+19,3), belvedère en onderrand van de trommel (+21,0 tot +22,1) en de onderkant van de stroken (+27,0) uit de foto, geschaald op de AHN-dakrand (±0,4 m); de dikte en schuine onderkant van de galerij, die in het echt een gebogen onderkant heeft. Het aantal en de stand van de schachtvensters en de ronde belvedèrevensters (om de 45 graden, op foto's drie zichtbaar per kant) en hun hoogtes (±0,5 m); de stroken zijn breder (0,5 m) dan in het echt (circa 0,3 m) om op 1:1000 zichtbaar te blijven. De lantaarnschijven: straal uit het AHN, hoogteverdeling en overstek (0,55 m) uit de foto. De diepte van trappenhuis en aanbouw achter de BAG-voorgevel; de grens tussen beide (x = 0,9) uit de foto.

Weggelaten (kleiner dan 0,9 m): de mast boven de mastvoet (circa 0,45 m dik, tot circa 41,8 m), het hekwerk van de galerij, de kleine ronde vensters in de trommel, de stenen afdekkingen en waterlijsten, de reliëfs boven de ingang, regenpijpen en antennes. De keermuur van 48 m langs de vijver hoort bij het terrein, niet bij de toren.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, vrijwel niets op (volume minder dan 0,1 % meer): de kraag onder de galerij loopt onder 50 graden, de onderrand van de trommel onder 49, de onderkanten van de lantaarnschijven onder 47 graden en de plafonds van de nissen onder 56 graden. De doorsneden van de voet tot de lantaarn blijven gelijk. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.60072/4.76942/200/1x1/0
