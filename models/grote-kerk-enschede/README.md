# Grote Kerk (Enschede)

Voormalige hervormde kerk aan de Oude Markt, rijksmonument 15307. Ontstaan uit een eenbeukige romaanse kerk van rond 1200 (de noordmuur is daarvan over), in 1480 naar het zuiden en oosten vergroot tot een tweebeukige hallenkerk met twee koren, en in 1842 verbouwd tot zaalkerk: zuilen en gewelven werden uitgebroken, de twee koorsluitingen samengetrokken en de twee zadeldaken vervangen door één hoog zadeldak. Na de stadsbrand van 1862 kregen de muren brede rondboogvensters. De westtoren is romaans (onderste vier geledingen), de bovenste geleding laat-15e-eeuws; de huidige spits is de reconstructie van 1926-1928 die de achtkante lantaarn van na 1862 verving. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0153100000214967 (kerk, toren en sacristie zijn één pand).
- STL op 1:1000: circa 45,0 × 27,3 × 50,9 mm.
- Genereren: `node scripts/generate-grote-kerk-enschede.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (258086,89; 471360,51), lat/lon 52,220676 / 6,895860, op de nok van de zaalkerk op maaiveld (NAP +42,0 m), midden tussen westgevel en oostwand. +X loopt langs de nok van west naar oost, onder −13,0 graden in RD (`xAxis` [0,97437; −0,22495]), gemeten aan de nok in het AHN-DSM; +Y wijst naar het noorden. `groundHeight` 85,79 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (west van de toren); `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Zaalkerk**: 18,6 m breed (noordmuur v = 9,4, zuidmuur v = −9,2, BAG), westgevel van de zuidbeuk op u = −15,85, oostwand op u ≈ 19,6. Eén zadeldak met nok +18,65 m en helling 0,70 (35 graden), goot +12,15 m (AHN en 3D BAG); boven de samengetrokken koorsluiting een schild vanaf het nokeinde op u = 12,0 met drie vlakken (oostwand en twee korte schuine wanden, hellingen 0,85 en steiler, 3D BAG). Plint, gootlijst van 0,25 m, drie dakkapelletjes per dakschild.
- **Steunberen** volgens de BAG-contour: drie aan de zuidzijde, vier aan de noordzijde, diagonale hoekberen zuidwest, zuidoost, noordoost en op de schuine sluitingswanden, een middenbeer in de oostwand; twee versnijdingen met waterslag. Tussen toren en zuidbeuk een beer met lessenaarsdakje.
- **Vensters en ingangen**: brede vensters (2,5 m, als spitse nis) in elk travee van noord- en zuidgevel en in de schuine sluitingswanden, westvenster en westingang van de zuidbeuk, zuidingang met omlijsting onder het middelste zuidvenster, de dichtgezette noordingang, een deur in de oostwand. De zonnewijzer van 1836 als plaat op de zuidgevel.
- **Sacristie** (ca. 1480) aan de noordzijde: 10 × 5,8 m, schilddak met goot +6,3 en nok +8,4 m (3D BAG), diagonale hoekberen, twee vensters en een deur.
- **Toren**: 7,9 × 7,9 m (BAG, oostzijde in het schip). Romaanse geledingen met hoeklisenen van 1,2 m en rondboogfriezen (als kraag) op +11,4 en +17,7 m, twee vensters per zijde in de tweede geleding, twee tweelingvensters per zijde in de derde, band op +22,1 m, bovenste geleding met een galmgat per zijde, kroonlijst met boogfries tot +27,5 m. Westportaal met getrapte omlijsting en twee blinde bogen. Geknikte vierzijdige leien spits: overstekende voet op +28, knik op +31 m, naald tot de makelaar op +50,5 m; vier hoektorentjes met spitsjes tot +32,6 m en vier wijzerplaathuisjes met puntgevel (+33,3 m, AHN +33,8).

## Geschat

- De hoogte van de spits: het AHN ziet de leien spits nauwelijks (hoogste punt +47,7 m op 0,3 m naast de as). De top op +50,5 m is uit de verhouding toren/spits op de RCE-foto 20351541 en de twee foto's van 2019 geschat en tegen de AHN-punten op de spits gecontroleerd; het kruis met de windhaan erboven is weggelaten.
- De hoogtes van friezen, band en vensters in de toren zijn uit de westgevel op de foto's van 2019 geschat, geschaald op de gemeten kroonlijst (+27,5). Hoektorentjes en wijzerplaathuisjes (breedte 1,0 en 2,0 m) zijn geschat.
- Vensterbreedtes, deur- en portaalmaten, de versnijdingen van de steunberen en de plaats van de dakkapelletjes zijn uit foto's geschat. Het noordportaal staat op de plek van de RCE-foto's van de noordgevel, maar de exacte plek is geschat.

## Weggelaten of vereenvoudigd

- Rondbogen (vensters, portalen) zijn spitse blinde nissen (58 graden) voor print zonder steun; het maaswerk in de vensters is weggelaten.
- De kleine galmluiken en dakkapelletjes in de spits, de kleine vensters en schietgaten in de onderste torengeleding, de wijzerplaten zelf (als ondiepe nis), regenpijpen, ventilatiepijpen op het dak, het kruis en de windhaan (allemaal kleiner dan 0,9 m).
- De wimpergjes op de steunberen zijn als schuine waterslag gemodelleerd.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote Kerk (Enschede)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Enschede))
- [Rijksmonumentenregister 15307](https://monumentenregister.cultureelerfgoed.nl/monumenten/15307)
- [Archimon: Enschede, Grote of St. Jacobskerk](https://archimon.nl/overijssel/enschedeherv.html)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Enschede) (RCE 20351541, 20273507, 20273535, 20273496; "Grote Kerk church Enschede 2019" en "2019 2")
- BAG pand 0153100000214967 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0153100000214967) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
