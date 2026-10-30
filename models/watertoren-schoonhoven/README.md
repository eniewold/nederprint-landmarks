# Watertoren (Schoonhoven)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-schoonhoven.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: kruisvormig prisma van de BAG-contour, zadeldaken als planvlakken, achtkante en ronde prisma's voor schacht, arcaderand en reservoir, en een achtkante spits als omhulsel.

De watertoren is in 1901 gebouwd naar ontwerp van F.A. de Jongh (rijksmonument 452390, sinds 2006 van Vereniging Hendrick de Keyser).

## Bestanden

- `watertoren-schoonhoven.glb`: vier nodes van klasse `building`.
- `watertoren-schoonhoven.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-schoonhoven-1-1000.stl`: alles samen op 1:1000 (15,2 × 15,2 × 46,3 mm).

## Oorsprong en oriëntatie

RD-oorsprong [117922.24, 439652.837], het zwaartepunt van BAG-pand 0608100001224969, op maaiveld (circa NAP +0,5 m). +X loopt langs de oostvleugel, 6,10 graden linksom van RD-oost (`xAxis` [0.99434, 0.1062]); +Y langs de noordvleugel. De ingang met de deur onder een boog ligt aan -Y (zuid, het rondje Bij de Watertoren). Vervangt alleen het BAG-pand van de toren.

## Onderdelen

- `building:kruisvormige-onderbouw-met-vier-topgevels`: achtkante kern (vlakken 3,73 m van het hart) met vier vleugels van 4,4 m breed tot 7,235 m, zoals de BAG-contour (symmetrisch gemaakt, afwijking ≤ 3 cm). Goot +8,25 m, zadeldaken met 0,35 m overstek tot de nok op +11,4 m, achtkant kerndak naar de schacht, een schoorsteen met puntkapje op elke nok. Blinde nissen: deur en venster in de voor- en achtergevel, twee vensters in de kopgevels oost en west, twee vensters per zijwand, een oculus (ruit) in elke topgevel.
- `building:achtkante-schacht-en-kraag`: achtkant van 6,24 m over de vlakken tot +16,6 m, vensternissen op alle acht vlakken (+13,4 tot +15,2), oculi op de vier diagonale vlakken (+11,8), ronde kraag van 7,56 m doorsnede tot +17,2 m met een kraag van 45 graden eronder.
- `building:arcaderand-reservoir-en-kroonlijst`: ronde arcaderand (7,2 m) met zestien boognissen tot +19,4 m, kraagsteenrij als schuine overgang naar het achtkante reservoir (7,7 m over de vlakken), twee spitsboogvensters per vlak van +21,2 tot +23,8, kroonlijst van 8,9 m tot +26,3 m met een schuine onderkant.
- `building:leien-spits-dakkapellen-en-hoektorens`: uitlopende onderkap van +26,2 tot de knik op +28,9 m, achtkante spits tot +41,2 m, vier dakkapellen met zadelkapje op de hoofdvlakken, vier hoektorentjes met kapje en spitsje (+35,8 m) op de diagonalen, de ijzeren standpijp als taps toelopende pen met knop tot +46,0 m.

## Bronnen en maten

- Bestektekeningen 1:100 van maart 1900 op Commons ([zijgevel](https://commons.wikimedia.org/wiki/File:Zijgevel_watertoren_Schoonhoven.jpg), [doorsnede CD](https://commons.wikimedia.org/wiki/File:Doorsnede_watertoren_Schoonhoven.jpg)): verhoudingen en hoogtes van alle geledingen. De foto van de zijgevel is horizontaal geschaald op de BAG-breedte (14,47 m tussen de kopgevels); de hoogtes zijn daarna met één factor 1,056 op het AHN gepast, omdat de gefotografeerde tekening naar boven licht verkort is.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-30): maaiveld circa NAP +0,5 m, vleugelnokken NAP +12 m, kroonlijst NAP +26,8 m (op 5 m van het hart), hoogste punt NAP +48,6 m (windvaan). Daaruit: nok 11,4 m en kroonlijst 26,3 m boven maaiveld.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Schoonhoven)) en [Rijksmonumentenregister 452390](https://monumentenregister.cultureelerfgoed.nl/monumenten/452390): bouwjaar, architect, 50 m hoogte, standpijp van 6 m in de spits.
- Commons-foto's van voor- en achterzijde ([foto 1](https://commons.wikimedia.org/wiki/File:RM452390_Schoonhoven_-_Watertoren_(foto_1).jpg), [RCE achtergevel](https://commons.wikimedia.org/wiki/File:Achtergevel_-_Schoonhoven_-_20198446_-_RCE.jpg), [RCE overzicht](https://commons.wikimedia.org/wiki/File:Overzicht_-_Schoonhoven_-_20198444_-_RCE.jpg)): gebouwde toestand. De tekening toont nog een bordes met trappen en spitsjes op de dakkapellen; die zijn niet gebouwd en staan niet in het model.

## Geschat en weggelaten

Geschat uit tekening en foto's: alle hoogtes behalve nok en kroonlijst, de plaats en maat van de vensters, deuren en oculi, de plaats van de schoorstenen (5,8 m van het hart), de hoektorentjes (hart 3,8 m van het hart op de diagonalen) en de dikte van de standpijp. Het AHN is op de spits te grof om de hoektorentjes en dakkapellen afzonderlijk te zien. Ronde boogvensters zijn spitse nissen geworden (top ≥ 50 graden), oculi een ruit, zodat ze zonder steun printen.

Weggelaten (kleiner dan 0,9 m of te dun): windvaan, stang en bol boven de knop, makelaars en pinakels op de topgevels, het open ijzerwerk van de standpijp, de vakwerkverdeling en roeden van het reservoir, siermetselwerk en speklagen, regenpijpen, het balkonhek en de lantaarn bij de deur.

## Controle

Vier gesloten NoError-nodes met genus 0, elk één deel; samen één deel. STL 15,2 × 15,2 × 46,3 mm, 2,08 cm³. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de gedeelde 45-gradenopvulling het volume met minder dan 2 % en blijven de doorsneden op 5, 14 en 22 m gelijk. Op de kaart staat de toren midden op het rondje van Bij de Watertoren met de voet op het PDOK-maaiveld; het PDOK-blok van het pand is verborgen. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/51.94409/4.84795/200/1x1/0
