# Watertoren Stampersgat (Stampersgat)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-stampersgat.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, kop, dakrand en kegeldak zijn één omwentelingsprofiel (`revolve`), de band en de piron omwentelingsvormen (`hull`), het portaal een prisma met rondboogprofiel en de deur en de vensters nissen.

De watertoren staat aan de Brugstraat in Stampersgat (gemeente Halderberge). Hij is gebouwd in 1952 naar een ontwerp van Jacques (J.M.) Hurks, had één reservoir van 900 m³ en is sinds 2009 woning en galerie. Volgens Wikipedia is hij 41,45 m hoog. Een ronde, licht tapse bakstenen schacht zonder geledingen draagt een iets bredere ronde kop met een krans van zestien smalle rondboogvensters op een gemetselde band, daarop een uitkragende koperen dakrand en een flauw koperen kegeldak met een piron met bol. Onderaan een rondboogportaal met natuursteenblokken en een tympaan in visgraatverband, en in de onderste twaalf meter paren vierkante vensters en enkele smalle lichtspleten.

## Bestanden

- `watertoren-stampersgat.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op.
- `watertoren-stampersgat.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight`, `groundSamplePoints` en `replacesBuildings` (BAG-pand 1655100000495658).
- `watertoren-stampersgat-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [89579.96, 403226.61] (WGS84 51.61410, 4.44266), het midden van de ronde BAG-contour van pand 1655100000495658 (bouwjaar 1952, straal 7,28 tot 7,36 m). Op het maaiveld NAP +2,70 m (AHN-DTM 9 tot 14 m uit het hart +2,55 tot +2,78; de 3D BAG geeft +2,54). `xAxis` [1, 0]: de toren is rond, dus +X is RD-oost; de deur staat op -20 graden (oostzuidoost, aan de bestrate binnenplaats). `groundHeight` 46,77 (NAP 2,70 + 44,07, NLGEO2018-geoïde op de oorsprong) is de terugval als er geen maaiveld is; de `groundSamplePoints` staan 9 m uit het hart op het vlakke erf.

## Onderdeel `building:schacht-kop-en-koperen-dak`

- Schacht: kegelstomp van 14,6 m op maaiveld (BAG) tot 13,4 m op 33,0 m.
- Schuine onderrand (70 graden) van de schacht naar de kop van 14,2 m, van 33,0 tot 34,1 m; kop tot 38,3 m.
- Band van 14,5 m (0,15 m uit de kop, onderkant 45 graden) van 36,0 tot 36,25 m, als vensterbank.
- Zestien rondboogvensters van 0,6 m breed, van de band tot een boogtop op 37,85 m, als nissen van 0,3 m met een plafond van 56 graden, om de 22,5 graden vanaf +X.
- Kraag van 45 graden van de kop naar de koperen dakrand van 15,0 m, rechte rand van 38,7 tot 39,2 m.
- Kegeldak: vlak deel (helling 0,175) van de rand tot 5,5 m uit het hart op 39,55 m, dan 0,32 (17,7 graden) tot de top op 41,3 m, 72 zijden.
- Piron van 0,9 m dik tot 42,3 m met een bol tot 42,6 m.
- Portaal op -20 graden: rondboogomlijsting van 3,6 m breed, 0,25 m voor de gevel, boogtop op 4,9 m; deur 1,6 × 2,6 m als nis van 0,4 m.
- Acht vierkante vensters van 1,0 × 0,9 m als nissen in twee rijen (7,6 en 11,4 m) in vier kolommen op +12, -48, -88 en -128 graden.

## Bronnen en maten

- [Wikipedia, Watertoren (Stampersgat)](https://nl.wikipedia.org/wiki/Watertoren_(Stampersgat)): Jacques Hurks, 1952, 41,45 m, 900 m³, woning en galerie.
- BAG-pand 1655100000495658: cirkel van 7,30 m straal, bouwjaar 1952; adres Brugstraat 7 (Locatieserver).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-02): maaiveld +2,55 tot +2,78; de kegeltop NAP +43,99 op het hart, het dak +42,19 op 5,5 m en +41,86 op 7,0 m uit het hart (de helling vlakt naar de rand af), dakrand tot 7,36 m (99e percentiel) en 7,72 m (uiterste cel). De wanden ziet het DSM niet.
- 3D BAG (LoD2.2 uit AHN5, 2024): maaiveld +2,54, dak +41,5 tot +44,1, nok +43,89 (NAP). Nok min maaiveld is 41,35 m: de 41,45 m van Wikipedia is de kegeltop, niet de piron.
- Luchtfoto (PDOK, 8 cm): dakrand 15,0 m doorsnede, koperen dak met zestien ribben, bestrate binnenplaats aan de oostkant.
- Foto [Stampersgat Watertoren 1253](https://commons.wikimedia.org/wiki/File:Stampersgat_Watertoren_1253.JPG) (Willemjans, 2006, CC BY-SA 3.0): frontaal op het portaal vanaf het gazon aan de oostkant; silhouetbreedtes dakrand : kop : schacht onder de kop = 558 : 528 : 500 px, kop 4,2 m hoog onder de dakrand, onderrand 1,1 m, vensters en lichtspleten.
- Foto [Stampersgat, watertoren foto4](https://commons.wikimedia.org/wiki/File:Stampersgat,_watertoren_foto4_2010-09-11_13.40.JPG) (Michielverbeek, 2010, CC BY-SA 3.0) en [Watertoren P1070262](https://commons.wikimedia.org/wiki/File:Watertoren_P1070262.JPG) (G.Lanting, 2011, CC BY-SA 3.0): zuidzuidwestkant, kop met band, rondboogvensters en dakrand, piron met bol.
- NLGEO2018-geoïdehoogte op de oorsprong (44,07 m) voor `groundHeight`.

## Geschat en weggelaten

Geschat:

- De verjonging van de schacht en de doorsnede van de kop (±0,3 m): verhoudingen op de foto van 2006, geschaald op de dakrand van 15,0 m uit AHN en luchtfoto.
- De hoogte van de kop, de band en de vensters (±0,5 m): uit dezelfde foto, de foto's zijn van onderen genomen.
- De richting van de deur (oostzuidoost: binnenplaats op de luchtfoto, frontale foto vanaf het oostelijke gazon, de boog aan de rechterrand op de foto's vanuit het zuidzuidwesten) en de plaats van de vierkante vensters (twee foto's dekken alleen de oost- en zuidkant; de noordkant is aangenomen zonder vensters).
- Het aantal rondboogvensters (zestien: negen zichtbaar op een halve omtrek, zestien ribben op het dak).

Weggelaten, omdat ze kleiner zijn dan 0,9 m:

- de smalle lichtspleten in de schacht en de felsnaden en ribben van het koperen dak;
- de natuursteenblokken en het visgraatverband in het portaal (als omlijsting opgenomen, zonder reliëf per blok);
- de dunne lijst over de boogjes van de kopvensters (gaat op in de kraag onder de dakrand).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vult de 45-gradenopvulling per node, zoals de export dat doet, niets op: onderrand 70 graden, band en dakrandkraag 45 graden, nisplafonds 56 graden. PDOK toont de toren als een ronde zuil met een vlak kegeldak; het model voegt de verjonging, de bredere kop met band en vensterkrans, de uitkragende dakrand, de geknikte kegel, de piron en het portaal toe. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.61408/4.44264/200/1x1/0
