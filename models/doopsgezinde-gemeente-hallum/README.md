# Doopsgezinde Gemeente, Hallum

Torenloze doopsgezinde vermaning met voorportaal en lagere achteraanbouw. Het huidige kerkgebouw dateert uit het begin van de twintigste eeuw.

## Bronnen en maten

- [3DBAG, BAG-pand 1722100000005087](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1722100000005087) voor plattegrond en dakvlakken.
- PDOK AHN DSM 0,5 m en 3DBAG: maaiveld NAP 1,437 m; nok rond NAP 11,5 m. De modelnok is 10,06 m boven maaiveld.
- [Tsjerkepaad met voorgevelfoto](https://tsjerkepaad.nl/overzicht-kerken/hallum-doopsgezinde-kerk), [Wikimedia met schuine foto](https://commons.wikimedia.org/wiki/File:20220808_Hallumer_fermanje.jpg), en [historische beschrijving](https://www.dbnl.org/tekst/berg229noor01_01/berg229noor01_01_0013.php).
- Vier zijden naast de PDOK-reconstructie en twee foto's gecontroleerd: zaal, portaal en achteraanbouw zijn herkenbaar.

## Model en schattingen

Oorsprong RD (181350, 591276), lengteas vanaf de voorgevel naar zuidoost. Het geheel meet circa 25,7 × 11,9 m; zaalnok 10,06 m boven maaiveld. Zaal, portaal en achteraanbouw zijn uit dakvlakken en afzonderlijke bouwdelen gevormd en verenigd. De vensterposities en de toegang zijn naar de foto's geschat; het portaal is vereenvoudigd en de kleine gevelbekroning, raamtracering en vlaggenmast zijn op 1:1000 te dun en weggelaten.

## Export en controle

Genereer met `node scripts/generate-doopsgezinde-gemeente-hallum.mjs --scale 1000` en met `--scale 100`. De STL's zijn één gesloten onderdeel met genus 0; de generator controleert de 45-gradengrens. De GLB staat in meters op RD en vervangt het BAG-pand. De 1:1000-afdruk meet circa 25,7 × 11,9 × 10,6 mm inclusief 0,5 mm grondinsteek.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
