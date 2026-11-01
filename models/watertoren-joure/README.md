# Watertoren Joure

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-joure.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de toren is één achthoekig omwentelingsprofiel (voet, schacht, kraag, band, reservoir, dakrand en tentdak), de bakstenen vakken, vensters en ventilatieramen zijn nissen, en de vleugels zijn BAG-vormen met elk hun dakvlak.

De watertoren in Joure is in 1928 gebouwd naar ontwerp van C.J. Wierda, omdat de toren van Heerenveen het net niet op druk hield: 30,3 m hoog, een reservoir van 150 m³, een betonskelet met baksteen ertussen. Hij is in 1956 gerestaureerd, tot 1987 gebruikt en in 1990 verbouwd tot woonhuis, met twee lage vleugels aan de voet.

## Bestanden

- `watertoren-joure.glb`: één node van klasse `building`, op het maaiveld. De export vult elke node apart op; toren en vleugels zitten in één gesloten vorm.
- `watertoren-joure.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-joure-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [182684.16, 553077.5], het hart van de achthoekige BAG-contour van pand 0051100001222389 (de zeven zichtbare hoekpunten passen op een regelmatige achthoek met apothema 3,98 m binnen 3 cm), op maaiveld (NAP +0,3 m). +X staat loodrecht op het oostvlak, 17,1 graden linksom van RD-oost (`xAxis` [0.9558, 0.2941]); de vlakken staan op 0, 45, ... graden. De luchtfoto en de 3D BAG (AHN5, 2023) zetten de nok op hetzelfde hart. Vervangt het BAG-pand van toren en vleugels (bouwjaar 1990, de verbouwing); het woonhuis ten zuiden (0051100001220497) blijft PDOK.

## Onderdeel `building:schacht-reservoir-tentdak-en-vleugels`

- Lichte voet van 7,96 m over de vlakken tot +0,6, daarboven wijken de hoekpijlers uit tot de schacht op +4,2 (7,36 m).
- Verjongende schacht tot +16,75 (6,74 m) met in elk vlak een bakstenen vak 0,3 m achter het betonskelet (pijlers 0,4 m per vlak), van +5,9 tot onder de kraag. In de vlakken op ±45 graden naast het oostvlak twee hoge smalle vensters (0,6 m breed, +7,6 tot +10,3 en +11,8 tot +14,6).
- Kraag onder 60 graden naar het reservoir op +18,05, betonnen band van 8,5 m met een schuine onderkant (51 graden) tot +18,85.
- Reservoir van 8,26 m over de vlakken met per vlak een bakstenen vak van 2,2 m tot +23,4 en tussen de kapitelen 1,4 m tot +24,4; daarboven een lichte fries met een ventilatieraam van 1,6 × 0,55 m in elk vlak.
- Overstekende dakrand van 10,16 m over de vlakken (0,95 m overstek, vlakke onderkant) van +26,1 tot +26,55 en een achtzijdig koperen tentdak van 28 graden tot de nok op +29,2.
- Westvleugel: een wig van het westvlak naar een smalle punt 13 m verderop, met een lessenaarsdak van 6,9 m aan de toren naar 2,0 m op de punt. Oostvleugel: plat dak op 3,25 m met aan de noordzijde een dakvlak van 5,4 m aan de toren naar 3,0 m aan de oostgevel. Vormen uit de BAG, dakvlakken uit de 3D BAG.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Joure)): architect, bouwjaar, 30,3 m, 150 m³, betonskelet met baksteen, verbouwing tot woonhuis.
- BAG-pand 0051100001222389 (PDOK): achthoekige voet (apothema 3,98 m, vlakken op 17,1 + k·45 graden), vormen van de vleugels.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0051100001222389) LoD2.2 (AHN5, 2023): nok NAP +29,26, dakvoet rond r = 4 op NAP +27,0 tot +27,3 (helling 28 graden, dakrand op 26,55 m), dakvlakken van de vleugels.
- Luchtfoto 8 cm (PDOK, opgehaald 2026-11-01): koperen tentdak in acht vlakken met omgeschreven straal 5,5 m, vleugels.
- RCE-foto [62618](https://commons.wikimedia.org/wiki/File:Watertoren_in_Joure_verbouwd_tot_woning,_21-08-1991,_signatuur_62618.jpg) (1991), recht op het oostvlak: breedtes van voet, schacht, reservoir en dakrand (verhouding tot de dakrand en de BAG-voet), hoogtes van band, kraag, kapitelen, fries en schachtvakken, geschaald tussen de onderkant van de dakrand (26,1 m) en de aansluiting van de oostvleugel (5,2 m): 37,9 px/m.
- Foto [Watertoren Joure uo](https://commons.wikimedia.org/wiki/File:Watertoren_Joure_uo.JPG): vensters in de schuine vlakken, dakrand, bol op de nok.

## Geschat en weggelaten

Geschat: de hoogtes onder de dakrand (uit één foto met perspectief, ±0,5 m), de diepte van de bakstenen vakken (0,3 m, in het echt minder, zodat het skelet op 1:1000 zichtbaar is) en de breedte van de pijlers, de vorm van de uitwijkende voet, de dikte van de dakrand. De vensters staan alleen in de twee vlakken waar de foto ze toont; de andere vlakken zijn niet gefotografeerd. Het AHN4-DSM van PDOK legt de dakrand 1,9 m zuidelijker dan de nok; de 3D BAG op AHN5 en de luchtfoto geven een symmetrisch dak op het BAG-hart, en dat is gevolgd.

Weggelaten (kleiner dan 0,9 m of te dun): de bol en bliksemafleider op de nok, de antennes aan de dakrand, de dakramen in het tentdak, de vensters in de kraag, de siermetselwerkbanen in de reservoirvakken, de vensters en zonnepanelen van de vleugels (indeling niet bekend).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met minder dan 1 % (gemeten 0,93 %), helemaal boven 24,9 m: de wig onder de vlakke onderkant van de dakrand, de echte overhang. Kraag, band, vakken en vensters blijven open; de doorsneden op 2, 6,5, 12, 17,5, 21, 24 en 28 m blijven gelijk. Controlebeelden blijven buiten de repo. In een preview-export op 1:1000 (100 × 100 m) zit de ondersteuning alleen onder de overstekende dakrand. Op de kaart staan toren en vleugels op de plek van het verborgen PDOK-pand, met de voet 0,1 tot 0,3 m in het PDOK-maaiveld.

Controle-URL: http://localhost:3000/kaart/52.96389/5.79917/200/1x1/0
