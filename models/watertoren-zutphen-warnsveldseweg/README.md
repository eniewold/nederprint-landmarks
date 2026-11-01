# Watertoren Warnsveldseweg (Zutphen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-zutphen-warnsveldseweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint en schacht zijn twaalfzijdige prisma's (de schacht verjongend), de koepel is één `hull` van twaalfhoeken op de hoogtes uit het AHN; panelen, nissen en vensters zijn uitsparingen, lateien, consoles, vinnen en balkons blokken met een schuine onderkant.

De watertoren aan de Warnsveldseweg is in 1926–1927 net buiten de oude stad gebouwd door de Hollandsche Maatschappij tot het Maken van Werken in Gewapend Beton, naar een ontwerp van Hendrik Sangster, ter vervanging van de Drogenapstoren. Hij is 46,2 m hoog en heeft een reservoir van 600 m³ dat nog in gebruik is; sinds 1984 zijn er woningen in de schacht. Rijksmonument 523419.

## Bestanden

- `watertoren-zutphen-warnsveldseweg.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse koepel of losse vinnen zouden een voet tot de grondplaat krijgen.
- `watertoren-zutphen-warnsveldseweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` (ellipsoïdisch, NAP +9,15 + 43,37) en het vervangen BAG-pand.
- `watertoren-zutphen-warnsveldseweg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [210993.15, 461874.42], het hart van de schacht in het AHN (zwaartepunt en twaalfhoekfit tussen 12 en 37 m; 0,3 m van het hart van BAG-pand 0301100000014935), op maaiveld (NAP +9,15 m, het maaiveld direct rond de voet ligt op +9,05 tot +9,35). De toren staat niet merkbaar scheef. +X wijst naar het zuidvlak met de balkons (`xAxis` [0, -1]); de vlakken staan op k·30 graden, de hoeken op 15 + k·30 graden, zoals in de BAG-contour en het AHN. Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde buurpand (het appartementengebouw uit 1999) ligt 15 m van het hart.

## Onderdeel `building:schacht-en-koepel`

- Donkere bakstenen plint van 13,9 m over de vlakken (BAG-contour) tot +2,9 met een deur op het zuidvlak en het oostvlak en een venster op het vlak −30.
- Twaalfzijdige bakstenen schacht van 13,4 m over de vlakken op de plint, verjongend tot 12,9 m op de dakvoet (+39,4). Elk vlak heeft een paneel van 2,1 m breed, 0,15 m verdiept tussen hoekpenanten van 0,7 m per kant, van +3,2 tot onder de latei; bovenaan elk paneel een witte latei van 2,3 m breed, 0,2 m voor de wand, van +38,8 tot +39,4 (onderkant 55 graden).
- Op elke hoek een witte vin van 0,8 m breed die 0,35 m buiten de hoek staat, met een voet op +36,9 (onderkant 55 graden), over de bovenkant van de wand en als rib over de koepelgraat tot +44,5.
- Op elk tweede vlak (0, ±60, ±120, 180): een hoog smal venster (0,7 × 3,2 m) van +35,1 tot +38,3, en halverwege een getrapte bakstenen console van 2,25 m breed (0,4 m voor de wand, +28,8 tot +30,1, onderkant 55 graden) met een witte vin van 0,8 m breed tot +32,5.
- Woonlagen met vloeren op +3,5, +6,8 en +10,1: op het zuidvlak drie balkondeuren (1,8 × 2,1 m) met balkons van 2,0 m breed die 0,6 m voor het paneel staan, met een dichte borstwering tot 1,0 m boven de vloer en een onderkant van 55 graden (het onderste rust op de plint); op het vlak +60 een vensterstrook van 0,7 m breed van +3,3 tot +12,4; op de overige tien vlakken per laag een dubbel venster (1,3 × 2,0 m).
- Twaalfzijdige gebolde betonnen koepel van de dakvoet tot +46,05, met de hoekstraal per 0,5 m uit het AHN (6,1 m op de dakvoet, 4,55 m op +43, 2,25 m op +45).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Zutphen_Warnsveldseweg)): Sangster, 1926–1927, 46,2 m, 600 m³, woningen sinds 1984.
- [Rijksmonumentenregister 523419](https://monumentenregister.cultureelerfgoed.nl/monumenten/523419).
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de voet NAP +9,05 tot +9,35 (gekozen +9,15), hoogste punt NAP +55,13 (46,0 m boven maaiveld), rand van de wand op circa +39,3 tot +39,4, koepelprofiel per sector, de schacht van 13,2 m over de vlakken op de dakvoet.
- BAG-pand 0301100000014935 (bouwjaar 1924 in de BAG, in gebruik, 153 m²) en luchtfoto (PDOK): twaalfhoek, stand van de vlakken, de twaalf hoekvinnen en lateien rond de koepel, de balkons op het zuidvlak.
- Foto [Zutphen, de watertoren RM523419 foto2](https://commons.wikimedia.org/wiki/File:Zutphen,_de_watertoren_RM523419_foto2_2014-03-10_15.02.jpg), frontaal met rechte lijnen op het zuidvlak: hoogtes van plint, woonlagen, consoles, vinnen, hoge vensters, lateien en hoekvinnen, paneelbreedte en verjonging, geschaald op de dakvoet in het AHN (29,9 px/m op het voorste vlak).
- Foto's [Zutphen, de watertoren RM523419 IMG 3891](https://commons.wikimedia.org/wiki/File:Zutphen,_de_watertoren_RM523419_IMG_3891_2020-03-31_14.00.jpg) en [Watertoren Zutphen](https://commons.wikimedia.org/wiki/File:Watertoren_Zutphen.jpg): koepel, vinnen, balkons en vensterstrook.
- Foto [Zutphen Wasserturm](https://commons.wikimedia.org/wiki/File:Zutphen_Wasserturm.jpg): de vensters van de woonlagen en de plintdeur aan de kant van de Warnsveldseweg.

## Geschat en weggelaten

Geschat: de verjonging van de schacht (de foto's geven 3–6 % over de hoogte; het AHN ziet de wanden niet, alleen de rand op de dakvoet), de diepte van panelen, lateien, consoles en vinnen, de uitsprong van de balkons, de vensters van de woonlagen op de vlakken die op geen foto te zien zijn (noord- en westkant) en de plaats van de plintdeuren. De koepel is twaalfzijdig zoals de schacht en de hoekvinnen op de luchtfoto. De vinnen zijn 0,8 m breed in plaats van circa 0,5 m, zodat ze op 1:1000 niet als te dun worden opgevuld; de console is iets breder dan het paneel.

Weggelaten (kleiner dan 0,9 m of te dun): de kolom van vier kleine vierkante vensters (0,5 m) op elk tweede vlak tussen +22 en +27, de kanteeltjes op de lateien (0,4 m), de gekrulde voeten van de vinnen, de witte band op de plint, de dunne balkonplaten en hun hekken (als dichte borstwering gemodelleerd), regenpijpen, ventilatieroosters en de piek op de koepel.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest verandert de 45-gradenopvulling per node, zoals de export die doet, het volume niet meetbaar (verhouding 1,0000): lateien, consoles, vinnen en balkons hebben een onderkant van 55 graden, nis- en paneelplafonds 56 graden, en de koepel staat binnen de wand. De doorsneden op 1,5, 4,6, 8, 20, 29,5, 31, 37, 39,2 en 42 m blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt geen steun. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,10–0,34 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.14222/6.20516/200/1x1/0
