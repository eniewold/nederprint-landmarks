# Watertoren Kweekschool van de Broeders (Maastricht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-kweekschool-maastricht.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de vierde bouwlaag en de kroonlijst zijn prisma's en omhulsels met schuine onderkanten, het dak is één schilddak uit vier vlakken, vensters en de deur zijn nissen. De kweekschool eromheen bestaat uit prisma's onder de dakvlakken van de 3D BAG.

De Kweekschool van de Broeders van de Onbevlekte Ontvangenis aan de Tongerseweg 135 in Maastricht (Lambertus Faber, 1909; vakschool van Alphons Boosten, 1936-37) is rijksmonument 506723 en sinds 2019 studentenhuisvesting. De school had een eigen watertoren voor de drinkwatervoorziening, omdat de gemeente Oud-Vroenhoven die niet kon leveren. De toren sluit de oostvleugel (de linkervleugel gezien vanaf de Tongerseweg) aan de zuidkant af.

## Bestanden

- `watertoren-kweekschool-maastricht.glb`: twee nodes van klasse `building`, beide op het maaiveld. De toren is één node, zodat de export de vierde bouwlaag en de kroonlijst niet apart tot de grondplaat opvult; de kweekschool is een eigen bouwdeel.
- `watertoren-kweekschool-maastricht.json`: catalogusitem met RD-oorsprong, `xAxis`, vier bemonsteringspunten rond de vrije zuidkant van de toren, `groundHeight` 121,21 (NAP +75,45 plus de NLGEO2018-geoïdehoogte van 45,76 m op de oorsprong, terugval voor een uitsnede zonder die punten) en het vervangen BAG-pand.
- `watertoren-kweekschool-maastricht-1-1000.stl`: toren en kweekschool samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [175026.67, 316890.75], het hart van de kroonlijst in het AHN (omhullende boven 24 m: 5,95 bij 8,8 m), op het maaiveld (NAP +75,45 m, AHN-DTM rond de voet). +X loopt langs de zuidgevel van de toren naar het oostnoordoosten (RD-richting 28,5 graden, uit de BAG-contour van de vleugel); -Y wijst naar het zuidzuidoosten, naar de gevel met de deur. De vleugel ligt aan de +Y-kant; de schacht staat 7,15 m voor de kopgevel van de vleugel uit.

De toren is geen eigen BAG-pand: hij hoort bij pand 0935100000010728, de hele kweekschool (3550 m²: hoofdvleugel, twee zijvleugels, kapel en het juvenaat). De kaart en de export kunnen alleen hele panden verbergen, en de PDOK-reconstructie van de toren is een kale doos met een piramidedak plus een scheef randvlak langs de westgevel. Daarom vervangt het model het hele pand en neemt de GLB de rest ervan over als `building:kweekschool`.

## Onderdeel `building:schacht-vierde-bouwlaag-kroonlijst-en-schilddak`

- Schacht van 4,3 × 7,15 m tot de rondboogfries op +19,6, met een plint van 0,12 m tot +0,9 (afgeschuinde bovenkant onder 56 graden).
- Zuidgevel: deur met bovenlicht (1,2 × 2,3 m) en daarboven één venster per bouwlaag (1,0 m breed op +2,9 tot +4,2, 1,3 m breed op +6,3 tot +8,9 en +11,7 tot +15,1).
- Oostgevel: drie vensters van 0,75 m op de derde bouwlaag (+11,7 tot +15,1), daaronder drie trapvensters die 1,4 m per venster naar het zuiden oplopen (+2,8 tot +8,2) en één laag venster aan de zuidkant (+1,0 tot +2,4). Westgevel: drie vensters per bouwlaag op de hoogtes van de zuidgevel. Vensters 2 m uit elkaar, penanten 1,25 m; alle nissen 0,25 tot 0,3 m diep met een plafond onder 56 graden.
- Rondboogfries met waterlijst als band van 0,33 m op een schuine onderkant (56 graden), +19,6 tot +20,8.
- Vierde bouwlaag van 4,8 × 7,65 m (+20,8 tot +23,45) met drie vensters op de korte en vijf op de lange gevels (0,45 m breed, 1,4 m uit elkaar, +21,15 tot +23,1).
- Kroonlijst op consoles van 5,95 × 8,8 m: schuine onderkant onder 56 graden van +23,45 tot +24,3, boeiboord tot +24,9.
- Laag schilddak met leien uit vier vlakken tot één punt op +27,35 (39 graden naar oost en west, 29 graden naar noord en zuid), zoals de 3D BAG en het AHN.

## Onderdeel `building:kweekschool`

De rest van BAG-pand 0935100000010728 uit de 3D BAG (LoD2.2, dezelfde vlakken als de PDOK-gebouwtegels): per dakvlak een prisma tot het vlak (kleinste kwadraten door de hoekpunten), 2 cm verbreed en samengevoegd. De vijf vlakken van de toren (het schilddak en een scheef randvlak langs de westgevel) liggen als vlak op het dak van de vleugel (19,65 m in het AHN), zodat dat dak doorloopt tot de schacht; de schacht en de grond ervoor zijn eruit gesneden. Hoogste punt is de nok van de kapel op 23,31 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Kweekschool_van_de_Broeders_van_de_Onbevlekte_Ontvangenis): geschiedenis, Faber 1909, eigen watertoren.
- [Rijksmonumentenregister 506723](https://monumentenregister.cultureelerfgoed.nl/monumenten/506723): de watertoren sluit de linkerzijvleugel af; vier bouwlagen, de vierde iets breder met boogfriezen; schilddak met leien en nokpion; smalle rechthoekige vensters in de zijgevels; houten deur.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +75,40 tot +75,56, top van het dak NAP +102,8 (27,35 m boven maaiveld), omhullende van de kroonlijst 5,95 × 8,8 m, dak van de vleugel NAP +95,1.
- BAG-pand 0935100000010728 en luchtfoto (PDOK): ligging, gevelrichting van de vleugel, kroonlijst van de toren en schilddak.
- 3D BAG (3DGI en TU Delft, CC BY 4.0), pand NL.IMBAG.Pand.0935100000010728: dakvlakken van de kweekschool, als constante onderaan het script; bovenkant kroonlijst van de toren NAP +100,35.
- Foto [Zuidoostgevel, RCE 20353893](https://commons.wikimedia.org/wiki/File:Zuidoostgevel_-_Maastricht_-_20353893_-_RCE.jpg), perspectief gecorrigeerd: hoogtes van deur, vensters, fries, vierde bouwlaag en kroonlijst (36,6 px/m langs de zuidoosthoek, geschaald op de kroonlijst op 24,9 m) en de verhouding schacht, fries en kroonlijst.
- Foto [Overzicht oostgevel, RCE 20353895](https://commons.wikimedia.org/wiki/File:Overzicht_oostgevel_-_Maastricht_-_20353895_-_RCE.jpg): oostgevel met trapvensters, vijf vensters op de vierde bouwlaag, consoles en windvaan.
- Foto [Overzicht binnenplaats vanuit de derde verdieping, RCE 20353903](https://commons.wikimedia.org/wiki/File:Overzicht_binnenplaats_vanuit_de_derde_verdieping_-_Maastricht_-_20353903_-_RCE.jpg): vierde bouwlaag aan de westkant boven het dak van de vleugel.

## Geschat en weggelaten

Geschat: de schacht (4,3 × 7,15 m) uit de verhouding schacht, fries en kroonlijst op de foto en de kroonlijst in het AHN; de BAG-contour van de toren (5,8 × 7,2 m) ligt 0,8 m noordelijker dan de kroonlijst in het AHN en is niet gevolgd. De hoogtes uit één perspectief gecorrigeerde foto; de onderkant van de fries ligt met +19,6 zo'n 0,2 m lager dan op de foto, zodat hij aansluit op het dak van de vleugel. De vensters van de westgevel (aan de binnenplaats) staan niet op een foto en zijn gelijk aan die van de oostgevel boven de trap genomen. De vensters van de vierde bouwlaag zijn 0,45 m breed, zodat de penanten 0,95 m blijven.

Weggelaten (kleiner dan 0,9 m of alleen kleur): de rondboogjes van de fries (circa 0,55 m), de consoles afzonderlijk, de gele speklagen, de nokpion met windvaan en de regenpijpen. Weggelaten omdat het geen deel van het pand is: de moderne glazen entree tegen de oostgevel van de toren en het moderne bouwdeel met terras ten oosten. De kweekschool is niet verder gemodelleerd dan de 3D BAG; de dakruiter van de kapel (tot NAP +102,4 in het AHN) staat daar niet in.

## Controle

Twee gesloten NoError-nodes met genus 0, elk één component met de onderkant op -0,3 m. In de webshoptest verandert de 45-gradenopvulling per node, zoals de export die doet, het volume niet (gemeten 1,000 voor toren en kweekschool): plint, fries, kroonlijst en nissen hebben geen ondervlak vlakker dan 45 graden, en de kweekschool bestaat uit prisma's tot de onderkant. De doorsneden op 0,5, 3,5, 7, 13, 19,7, 22, 24,5 en 26 m (toren) en 2, 10 en 18 m (kweekschool) blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2, uitsnede 150 m) komen toren en kweekschool zonder steun. Op de kaart sluit de kweekschool aan op de omgeving en staat de toren met de voet 0,11–0,19 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/50.84183/5.67062/200/1x1/0
