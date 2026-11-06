# Watertoren 's-Gravendeel ('s-Gravendeel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-s-gravendeel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, banden, consolezone, ring, reservoir, kroonlijst en borstwering zijn één omwentelingsprofiel (96 segmenten), de lisenen en consoles prisma's en wiggen in de richting van k × 45 graden, de steunberen hulls met een hellende voorkant en een schuine afdekking, de dakopbouwen blokken, de deur en de vensters blinde nissen met een schuin plafond.

De watertoren van 's-Gravendeel werd in 1914 gebouwd naar ontwerp van Visser en Smit. Hij is 35 m hoog en heeft een reservoir van 200 m³; het is een betonskelet dat met metselwerk is gevuld, op een bakstenen voet met vier steunberen met een natuurstenen afdekking (Wikipedia). Gemeentelijk monument. De toren staat er nog (BAG-status "Pand in gebruik", AHN en luchtfoto 2026); op de luchtfoto oogt hij lichter dan op de foto van 2007.

## Bestanden

- `watertoren-s-gravendeel.glb`: één node, `building:watertoren-schacht-steunberen-reservoir-en-borstwering`.
- `watertoren-s-gravendeel.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-s-gravendeel-1-1000.stl`: het model op 1:1000 (10,1 × 10,1 × 35,8 mm; de steunberen staan diagonaal).

## Oorsprong en oriëntatie

RD-oorsprong [102340.67, 420936.79] (51,774619 N, 4,624201 O): het hart van de ronde BAG-voetafdruk van pand 0585100001641941 (cirkelfit op 21 hoekpunten van de ronde wand, straal 4,84 m, afwijking hooguit 0,12 m), op het maaiveld: AHN-DTM NAP 0,0 rond de voet (west −0,1 tot 0,1, oost tot +0,4).

De lokale X-as staat 8 graden linksom van RD-oost (`xAxis` [0.99027, 0.13917]), naar de deur aan de oostzijde, waar het pad naartoe loopt. De vier steunberen staan op ±45 en ±135 graden; de BAG tekent er twee, op 143,4 en 232,7 graden RD (135,4 en 224,7 lokaal), de andere twee staan op de luchtfoto en de foto. De lisenen van het reservoir staan op k × 45 graden, de vensters van het reservoir daartussen.

`groundSamplePoints` liggen op 9 m in de vier asrichtingen; `groundHeight` 43,42 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 43,82, west 43,42, noord 43,78, zuid 43,60, gemeten 2026-11-06). Het PDOK-pand staat op 43,41. `groundOffsetMetres` is −0,1; aan de oostkant ligt het terrein circa 0,4 m hoger dan de voet.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP 0,0).

- Schacht: rond, straal 4,84 m op het maaiveld (BAG), taps tot 4,24 m op 24,3 m.
- Steunberen: vier, 1,35 m breed; de voorkant helt van 6,15 m van het hart op het maaiveld (BAG) naar 5,2 m op 9,3 m, met een schuine afdekking tot tegen de schacht op circa 10,2 m.
- Ingang op 0 graden: natuurstenen omlijsting 2,0 m breed en 3,0 m hoog, 0,2 m voor de wand, met de deur als nis van 1,2 m breed tot 2,4 m.
- Vensters in de schacht die op de foto te zien zijn: op 0 graden (6,6–8,2 en 17,0–18,6 m), op −118 graden (11,4–13,0 m) en op −83 graden (21,4–23,0 m), als nissen van 0,9 m breed.
- Banden: 4,4 m van 24,5 tot 25,0 m en 4,55 m van 25,2 tot 26,0 m, met een onderkant van 50 graden.
- Consolezone: de wand loopt van 4,55 m op 26,0 m naar 4,7 m op 27,2 m en kraagt dan onder 50 graden uit tot de ring (5,05 m op 27,62 m); acht consoles onder de lisenen, wiggen met een onderkant van 56 graden.
- Ring: straal 5,05 m, van 27,62 tot 28,2 m.
- Reservoir: rond, straal 4,8 m, van 28,2 tot 33,35 m, met acht lisenen (0,9 m breed, 0,2 m voor de mantel) en per veld één venster als nis van 0,9 m breed van 29,7 tot 32,9 m.
- Kroonlijst: 4,92 m, van 33,5 tot 33,8 m, met een onderkant van 51 graden boven de mantel.
- Dak plat op 33,8 m (AHN NAP +33,8); borstwering 4,65 tot 3,75 m van het hart, tot 35,1 m (AHN NAP +35,0 à +35,2); de lisenen steken als pijlertjes uit tot 35,45 m.
- Dakopbouwen: een trappenhuis van 2,6 × 2,6 m tot 35,5 m (AHN NAP +35,5) op 2,0 m van het hart in de richting van 46 graden, 37 graden gedraaid; een kastje van 1,0 × 1,2 m tot 35,0 m tegen de borstwering op 175 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_('s-Gravendeel)): 1914, Visser en Smit, 35 m, 200 m³, betonskelet met metselwerk op een bakstenen voet met vier steunberen met natuurstenen afdekking, banden van mondstenen; gemeentelijk monument.
- BAG-pand 0585100001641941 (PDOK, 2026-11-06): ronde voetafdruk met twee steunberen aan de westzijde, bouwjaar 1914.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP 0,0, dak NAP +33,8, borstwering NAP +35,0 à +35,2, dakopbouw NAP +35,5, bovenkant tot circa 4,8 m van het hart.
- PDOK-luchtfoto (Actueel_orthoHR): plat dak binnen de borstwering met het trappenhuis en een kastje, pijlertjes op de borstwering, de steunberen aan de zuidwest- en zuidoostzijde en het pad naar de oostzijde.
- Foto op Wikimedia Commons: "Gravendeel Watertoren 3595.JPG" (Willemjans, 2007, CC BY-SA 3.0), vanaf het oosten-zuidoosten. Andere foto's van de toren staan niet op Commons.

## Geschat en weggelaten

Geschat: er is maar één foto (vanaf het oosten-zuidoosten, van onderen). De verhoudingen van schacht, banden, consolezone, ring, reservoir en borstwering komen uit die foto, horizontaal geschaald op de straal van het reservoir uit het AHN (4,8 m) en verticaal op het maaiveld en de borstwering uit het AHN; de hoogtes van banden, ring, kroonlijst en vensters zijn daardoor circa een halve meter onzeker. De straal van de schacht bovenaan (4,24 m) en de helling en hoogte van de steunberen zijn uit de foto geschat. Dat de deur aan de oostzijde zit, volgt uit de positie van de steunberen op de foto en het pad op de luchtfoto. De noord- en westzijde zijn op geen foto te zien: daar staan alleen de lisenen, reservoirvensters en steunberen die het regelmatige patroon volgt, geen schachtvensters. De vensters zijn in het echt circa 0,5 m breed (in het reservoir twee boven elkaar) en staan als nissen van 0,9 m in het model; de borstwering is in werkelijkheid dunner dan 0,9 m.

Weggelaten: de kleine getoogde openingen in de borstwering en de ronde openingen in de consolezone (kleiner dan 0,9 m), de banden van mondstenen, de afwijkende kleur van lisenen en ringen, de stang over het dak.

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een cilinder met twee volle-hoogte uitsteeksels aan de westzijde en een blokje op het dak) de tapse schacht, vier steunberen met afdekking, de deur, vensters, de banden, consoles, de ring, het reservoir met lisenen en vensters, de kroonlijst en de borstwering met pijlertjes en de dakopbouwen.

Controle-URL: http://localhost:3000/kaart/51.77464/4.62419/200/1x1/0
