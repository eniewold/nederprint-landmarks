# Watertoren Wolfheze

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-wolfheze.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de ronde schacht met welving is één omwentelingsprofiel, de kop een achtkant prisma met een schuine daklijst en een achtkant tentdak (`hull` van de goot en de top); deur, vensters en oculus zijn nissen.

De watertoren van Wolfheze is in 1907 gebouwd naar ontwerp van de Ermelose architect Evert Knevel, op het terrein van de psychiatrische inrichting (nu Pro Persona). Hij is 27 m hoog met een reservoir van 40 m³ en gemeentelijk monument.

## Bestanden

- `watertoren-wolfheze.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een losse kop zou een voet tot de grondplaat krijgen.
- `watertoren-wolfheze.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-wolfheze-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [182416.26, 445999.45], het hart van de BAG-cirkel van pand 0274100000012591 (38 punten, straal 3,04 tot 3,11 m), op maaiveld (NAP +32,33 m). De top van het tentdak ligt in het AHN op minder dan 0,1 m van dit hart; de toren staat recht. Assen in RD-richting (`xAxis` [1, 0]). De achtkantige kop staat met de vlakken naar de windstreken (luchtfoto). De deur staat naar het noordwesten. Vervangt alleen het BAG-pand van de toren; het dichtstbijzijnde buurpand (0274100000003276) begint 6,5 m oostelijk en raakt het model niet.

## Onderdeel `building:schacht-kop-en-tentdak`

- Plint op de BAG-straal 3,07 tot +0,95 met een schuine afzaat, daarboven een band van geglazuurde tegels (0,08 m uit) tot +2,98. Rondboogdeur van 1,2 × 3,1 m naar het noordwesten.
- Ronde bakstenen schacht, taps van r 2,91 boven de tegelband naar r 2,43 op +18,2. Twee rijen van drie vensters (0,6 × 1,2 m) op +4,8, +9,0 en +12,9: één rij boven de deur (noordwesten), één naar het zuidwesten met de oculus op +17,7 erboven.
- Holle welving van r 2,43 op +18,2 naar r 3,1 onder de kop op +19,64.
- Achtkantige kop: voetlijst (apothema 3,3) tot +20,0, wanden (apothema 3,2, 6,4 m over de vlakken) tot +23,0 met een rondboogvenster (0,7 × 1,1 m) in elk hoofdvlak, een daklijst die onder 56 graden uitsteekt naar 7,36 m over de vlakken, boeiboord tot de goot op +24,0.
- Achtkant tentdak van de goot tot de top op +27,1 (40 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Wolfheze)): architect, bouwjaar, 27 m, 40 m³.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +32,33, top van het dak NAP +59,44 (27,1 m boven maaiveld) op het hart, dakhelling van circa 40 graden en goot rond +24,0 aan de westkant. Het donkere dak geeft aan de randen gaten en mengwaarden (de kop lijkt in het AHN maar 5 m breed); de breedte komt daarom uit de luchtfoto.
- Luchtfoto (PDOK, 8 cm): achtkantig dak van 7,35 m over de vlakken, vlakken naar de windstreken, de voet van de schacht op de BAG-cirkel.
- BAG-pand 0274100000012591: ligging en voetstraal 3,07 m.
- Foto [Wolfheze Watertoren 2006](https://commons.wikimedia.org/wiki/File:Wolfheze_Watertoren_2006.JPG) (de enige op Commons), vanuit het westzuidwesten: alle tussenliggende hoogtes, de breedtes van schacht en kop en de stand van deur, vensters en oculus. De hoogtes zijn afgelezen met een gekantelde camera die is gepast op maaiveld, goot en top (afstand circa 36 m, 16 graden omhoog); de schacht komt daarmee aan de voet op 6,2 m breed (BAG 6,14 m), boven de tegelband op 5,8 m en onder de welving op 4,9 m.

## Geschat en weggelaten

Geschat: alle hoogtes tussen maaiveld en goot (uit één schuine foto met een gepaste camera, onzekerheid circa 0,3 m), de vorm van de welving (een kwartellips), de wanddikte van de kop ten opzichte van de daklijst (0,48 m overstek; de foto geeft iets minder dan de luchtfoto), de richting van deur en vensters (uit hun stand op de foto, ±10 graden), de vensters in de kop op de vier hoofdvlakken (op de foto alleen het westvlak zichtbaar) en de breedte van vensters en oculus (in het echt circa 0,5 m). Van de oost- en noordkant van de schacht is geen foto; daar staan geen vensters in het model.

Weggelaten (kleiner dan 0,9 m of te dun): de windvaan met de spits op het dak, de consoles onder de daklijst (circa 0,15 m breed, in de schuine daklijst opgenomen), de regenpijp, de lamp naast de deur en de lichte rand onder de voetlijst van de kop.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,7 %: alleen onder de holle welving en de vlakke rand onder de kop tussen 18,2 en 19,64 m, de echte uitkraging. De doorsneden op de deur, de tegelband, de vensterrijen, de oculus, de kopvensters, de daklijst en het dak blijven gelijk. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt alleen een ring steun onder de holle welving en de onderrand van de kop; deur, vensters, oculus en daklijst blijven vrij. Op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,10–0,23 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/52.00169/5.78646/200/1x1/0
