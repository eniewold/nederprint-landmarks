# Grote Kerk (Almelo)

Protestantse kruiskerk aan het Kerkplein: een Grieks kruis van 1738 met vier schilddaken, het laatgotische zandstenen koor van 1493 (het oudste deel, van de vroegere slotkapel) en een westtoren van twee geledingen uit 1738 met de koepelspits van 1777. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0141100000019525 (kerk, toren en aanbouwen zijn één pand).
- STL op 1:1000: circa 45,7 × 35,5 × 44,7 mm.
- Genereren: `node scripts/generate-grote-kerk-almelo.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (242136,11; 486377,50), lat/lon 52,358369 / 6,666362, op het hart van de viering op maaiveld (NAP +12,1 m). +X loopt langs de west-oostnok van toren naar koor, onder 6,8 graden in RD (`xAxis` [0,99297; 0,1184]); +Y wijst naar de noordarm. De gevels lopen evenwijdig aan die as in de BAG-contour, de nokken liggen er in het AHN-DSM op. `groundHeight` 55,15 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk; `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Kruis (1738)**: noord- en zuidarm 12,8 × 33 m, westarm 13,1 m breed tot de toren. Alle dakvlakken van het kruis hebben helling 1,30 (52 graden), nok +20,0 m, goot circa +11,7 m (3D BAG en AHN); schilden op de noord- en zuidgevel, de west-oostkap loopt door de viering tot de westgevel van het koor. Zandstenen hoekpilasters op de buitenhoeken en de binnenhoeken van de westarm, plint, twee rondboogvensters per kopgevel met een blind veld erboven, één venster in de westgevels van noord- en zuidarm, en in de noord- en zuidmuur van de westarm een venster plus de ingangspartij met zandstenen omlijsting, deur en venster erboven (register: ingangen aan noord- en zuidzijde). Sokkels met vazen tegen de toren.
- **Koor (1493)**: 11 m breed, steiler dak (helling 1,69, nok +21,7 m) dat 1,7 m boven de kruisnok uitkomt; driezijdige sluiting met hellingen van circa 1,95 tot het nokeinde op u = 15,9 m (3D BAG 15,8 m). Steunberen op de vier hoeken van de sluiting (BAG) en op beide zijmuren, hoge spitsboogvensters in de sluiting en de zijmuren.
- **Aanbouwen**: de consistorie in de noordoosthoek onder een schilddak (goot +4,0, nok +7,1 m, 3D BAG), de platte tussenbouw in het zuidoosten (+4,9 m) en de achtkante kamer met tentdak tot +9,3 m en makelaar.
- **Toren**: onderste geleding 7,3 × 8,1 m (BAG) met brede zandstenen hoekpilasters tot de kroonlijst op +10,6 m, ingangspartij in het westen, oculus en rondboogvenster op noord en zuid; bovenste geleding iets ingesprongen met hoeklisenen, twee rondboogvensters boven elkaar en een paneel per zijde, kroonlijst op +23,2 m, plat dak en balustrade tot +25,2 m (AHN +25). Achtkante lantaarn (5,6 m) met voet en panelen, band, boogstelling en kroonlijst tot +33,7 m (3D BAG-goot van de koepel +33,8), klokvormige koepel, twee uien en de makelaar tot +44,3 m (hoogste AHN-punt).

## Geschat

- De hoogtes van de torenkroonlijst (+10,6), de vensters en de lantaarngeledingen zijn uit de verhoudingen op de RCE-foto's van noord- en westgevel geschat, geschaald op de gemeten balustrade (+25,2) en koepelgoot (+33,7). Het profiel van de koepel en de uien is uit foto's geschat en met het AHN-DSM gecontroleerd (r = 1 m op circa +38 m).
- Vensterbreedtes (2,2 m kruis, 1,8 m koor), steunberen (1,0 × 1,0 m, tot +9,4 m) en de omlijsting van de ingangen zijn uit foto's geschat. De achtkante kamer is als regelmatige achthoek van 7,9 m gemodelleerd (BAG-contour iets onregelmatig).

## Weggelaten of vereenvoudigd

- Rondbogen (vensters, deuren, lantaarnbogen) zijn spitse blinde nissen (58 graden) voor print zonder steun; de lantaarn is dicht, de opengewerkte balustraden zijn dichte borstweringen met hoekposten.
- Kruis en windvaan op de makelaar, het kruisje op het koordak, de wapens boven de ingangen, de zonnewijzer, uurwerkplaten, regenpijpen en de kroonlijst onder de goot van het kruis (kleiner dan 0,9 m).
- Het maaswerk van het dichtgemetselde oostvenster van het koor.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote Kerk (Almelo)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Almelo))
- Rijksmonumentenregister: [7487 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/7487) en [7488 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/7488)
- [Archimon: Almelo, hervormde kerk](https://archimon.nl/overijssel/almeloherv.html)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Almelo) (RCE 20276047, 20276050, 20276051, 20276052, 20276055, 20276057, 20006974; "Grote Kerk church Almelo 2019")
- BAG pand 0141100000019525 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0141100000019525) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
