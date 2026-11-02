# Watertoren Almkerk (Almkerk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-almkerk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht en de band zijn cilinders (72 zijden), de kraag onder de band staat schuin (`hull`), het dak is een echte kegel, de vensters en de deur zijn nissen.

De nieuwe watertoren van Almkerk staat in de buurtschap Uppel aan de Provincialeweg Noord (gemeente Altena), binnendijks op een terp. Hij is eind jaren 1940 gebouwd (BAG-bouwjaar 1948) voor de Waterleiding Maatschappij Noord-West-Brabant, als vervanger van de oude toren die het Duitse leger aan het eind van de oorlog opblies. Volgens Wikipedia is hij 43,3 m hoog met een reservoir van 500 m³ (in de tekst 600 m³), was hij tot 2008 in gebruik en is hij sinds 2014 een woning. Wikipedia noemt Kees de Bever als ontwerper; H. Sangster (genoemd in de opdracht) ontwierp de torens van deze maatschappij uit de jaren 1930, waaronder de oude toren van Almkerk. Een bron die Sangster aan deze toren koppelt is niet gevonden.

## Bestanden

- `watertoren-almkerk.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse band of bol zou een eigen voet tot de grondplaat krijgen.
- `watertoren-almkerk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en het vervangen BAG-pand.
- `watertoren-almkerk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [124141.32, 422420.76], het middelpunt van de cirkel door de BAG-contour van pand 0874100000001233 (37 hoekpunten, straal 6,52 tot 6,67, gefit 6,54 m), op het maaiveld van de terp (NAP +2,52 m; het AHN-DTM ligt tot 8,5 m uit het hart tussen +2,46 en +2,56 en zakt daarbuiten naar circa +1,5). `xAxis` [1, 0]: +X wijst naar RD-oost, want een ronde toren heeft geen hoofdas. De vensterkolom staat op -95 graden (zuid, iets west), waar de ruiten op de luchtfoto zitten; de deur op 170 graden (west), waar het pad vanaf de dijk aankomt.

De vier `groundSamplePoints` liggen 7,5 m uit het hart op de terp (oost, noord, west en zuidwest; zuidoost heeft een gat in het AHN-DTM). `groundHeight` 46,14 (NAP 2,52 + 43,62, NLGEO2018-geoïde op de oorsprong) is de terugval zonder maaiveld.

## Onderdeel `building:schacht-band-en-kegeldak`

- Ronde bakstenen schacht van 13,08 m doorsnede, recht tot de band.
- Band van 13,74 m doorsnede (0,33 m uitkragend): een schuine kraag van 38,05 tot 38,4 m (47 graden; in het echt een ronde onderkant) en een rechte rand tot de dakrand op 39,6 m.
- Kegeldak van 23 graden van de dakrand tot 42,57 m, met een achtkantige bol van 0,9 m met een spits tot 43,35 m.
- Acht rondvensters van 0,7 m onder de band (37,15 tot 37,85 m), om de 45 graden tussen de assen van de vensterkolom.
- Aan de zuidkant een koppelvenster van twee vensters van 0,9 × 2,7 m (29,8 tot 32,5 m) met een dam van 0,3 m, en daaronder vier smalle trapvensters van 0,6 m breed (8,0, 13,8, 19,6 en 25,2 m, 1,3 tot 1,4 m hoog).
- Op de begane grond zeven paren kleine vensters van 0,5 × 1,0 m (2,1 tot 3,1 m), om de 45 graden vanaf de vensterkolom, behalve aan de deurzijde.
- Deur van 1,2 × 2,4 m aan de westkant als nis van 0,4 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Almkerk)): ontwerper, opdrachtgever, 43,3 m, 500 m³, buiten gebruik in 2008, woning sinds 2014.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld NAP +2,52, dakrand NAP +42,15 tot +42,46 op 6,5 tot 6,9 m uit het hart (39,6 m), dakvlak z = 45,12 - 0,43 r (23 graden, top NAP +45,12 = 42,6 m), bol en windvaan tot NAP +46,22 (43,7 m). De gepubliceerde 43,3 m valt tussen de kegeltop en de windvaan.
- BAG-pand 0874100000001233 (bouwjaar 1948, logiesfunctie) en luchtfoto (PDOK, 8 cm): ronde contour, kegeldak met staande naden en een dakladder, ruiten aan de zuidkant, pad vanaf de dijk aan de westkant.
- 3D BAG (LoD2.2) van het pand: dakrand 42,44, nok 44,88 (NAP), ter controle.
- Foto [Overzicht watertoren met tuinkabouters op de voorgrond - Uppel](https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_tuinkabouters_op_de_voorgrond_-_Uppel_-_20335217_-_RCE.jpg) (RCE): de hele toren, 24,5 px/m over de schacht, geschaald op de hoogte tot de dakrand; hoogtes van de band, de rondvensters, het koppelvenster, de trapvensters en de vensterparen.
- Foto [Watertoren - Almkerk](https://commons.wikimedia.org/wiki/File:Watertoren_-_Almkerk_-_20007301_-_RCE.jpg) (RCE): de top, band van 1,2 m hoog en circa 5 % breder dan de schacht, rondvensters, kegeldak met bol en windvaan.
- Foto [Uppel met watertoren](https://commons.wikimedia.org/wiki/File:Uppel_met_watertoren.jpg): silhouet, rondvensters en de vensterkolom.

## Geschat en weggelaten

Geschat: de hoogte en uitkraging van de band (1,2 m hoog, 0,33 m, uit twee foto's, ±0,15 m); de hoogtes van de vensters (±0,3 m, uit één foto geschaald op de AHN-hoogte van de dakrand); de stand van de vensterkolom (zuid, uit de luchtfoto) en dat er maar één kolom is; het aantal rondvensters (acht, uit de onderlinge afstand op de foto's) en de vensterparen op de begane grond om de 45 graden (op de foto zijn er twee paren te zien); de plaats en maat van de deur (aan het pad, geen foto). De bol is vergroot tot 0,9 m en krijgt een spits zodat hij zonder steun print; de rondvensters zijn rechthoekige nissen.

Weggelaten (kleiner dan 0,9 m of los van de toren): de windvaan, de staande naden en de dakladder op het kegeldak, de antennes en hun mast (op oudere foto's), de kozijnen, de tuinmuur rond de terp, de pergola en de zonnepanelen op het erf. De terp zelf zit in het PDOK-terrein en staat niet in de GLB.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export die doet, vrijwel niets op (volume minder dan 1,0005): de kraag onder de band loopt onder 47 graden, de plafonds van de deur en de vensters onder 56 graden, en de bol staat op de kegel. De doorsneden van de voet tot de bol blijven gelijk. Vergeleken met de 3D BAG-reconstructie heeft het model een ronde kegel in plaats van scheve facetten, de uitkragende band, de bol en de vensters; controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.78957/4.93991/200/1x1/0
